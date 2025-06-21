const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const HF_TOKEN = "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";
const JWT_API = "https://huggingface.co/api/spaces/TwanAPI/API/jwt";
const SPACE_BASE = "https://TwanAPI-API.hf.space";

let jwtCache = {
  token: null,
  expires: 0
};

// Optimized middleware
app.use(express.raw({ type: '*/*', limit: '10mb' }));

// Cache headers for better performance
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});

app.all('*', async (req, res) => {
  try {
    const token = await getJWTToken();
    if (!token) {
      return res.status(500).json({ error: "Failed to get JWT" });
    }

    const proxyUrl = buildProxyUrl(req, token);
    const proxyOptions = createProxyRequest(req);

    const response = await fetch(proxyUrl, proxyOptions);
    await processResponse(response, req, res);

  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(502).json({ error: "Proxy error", message: error.message });
  }
});

async function getJWTToken() {
  const now = Date.now();
  
  if (jwtCache.token && now < jwtCache.expires) {
    return jwtCache.token;
  }

  try {
    const response = await fetch(JWT_API, {
      headers: { 
        Authorization: `Bearer ${HF_TOKEN}`,
        'User-Agent': 'HF-Proxy/1.0'
      },
      timeout: 5000
    });

    if (!response.ok) {
      throw new Error(`JWT API returned ${response.status}`);
    }

    const data = await response.json();
    jwtCache.token = data.token;
    jwtCache.expires = now + (45 * 60 * 1000); // 45 minutes
    
    return data.token;
  } catch (error) {
    console.warn('JWT request failed, using fallback:', error.message);
    // Generate fallback token
    const fallbackToken = Buffer.from(`${now}:${HF_TOKEN.slice(-8)}`).toString('base64');
    jwtCache.token = fallbackToken;
    jwtCache.expires = now + (10 * 60 * 1000); // 10 minutes for fallback
    return fallbackToken;
  }
}

function buildProxyUrl(req, token) {
  const separator = req.url.includes('?') ? '&' : '?';
  return `${SPACE_BASE}${req.url}${separator}__sign=${token}`;
}

function createProxyRequest(req) {
  const headers = {};
  const skipHeaders = ['host', 'content-length', 'connection', 'upgrade'];
  
  Object.entries(req.headers).forEach(([key, value]) => {
    if (!skipHeaders.includes(key.toLowerCase())) {
      headers[key] = value;
    }
  });

  return {
    method: req.method,
    headers,
    body: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
    redirect: "manual",
  };
}

async function processResponse(response, req, res) {
  // Handle redirects
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (location) {
      const newLocation = location.replace(SPACE_BASE, `${req.protocol}://${req.get('host')}`);
      return res.redirect(response.status, newLocation);
    }
  }

  const contentType = response.headers.get("content-type") || "";

  // Copy response headers
  response.headers.forEach((value, key) => {
    if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
      res.set(key, value);
    }
  });

  res.status(response.status);

  // Handle HTML content
  if (contentType.includes("text/html")) {
    const html = await response.text();
    const modifiedHTML = html.replace(new RegExp(SPACE_BASE, 'g'), `${req.protocol}://${req.get('host')}`);
    return res.send(modifiedHTML);
  }

  // Handle other content
  const arrayBuffer = await response.arrayBuffer();
  res.send(Buffer.from(arrayBuffer));
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});


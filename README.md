# CodeShare - Code Sharing Application

Một ứng dụng chia sẻ code đơn giản giống như Pastebin, được xây dựng với Node.js, Express, React, và SQLite3.

## Tính năng

- ✅ Tạo và chia sẻ các đoạn code với URL duy nhất
- ✅ Hỗ trợ nhiều ngôn ngữ lập trình với syntax highlighting
- ✅ Monaco Editor với theme Dracula
- ✅ 3 chế độ xem: View, Edit, Raw
- ✅ Lưu trữ với SQLite3
- ✅ Giao diện responsive và hiện đại
- ✅ API RESTful đầy đủ

## Công nghệ sử dụng

### Backend
- **Node.js** + **Express.js** - Web server
- **SQLite3** - Database
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI framework
- **React Router** - Client-side routing
- **Monaco Editor** - Code editor (VS Code editor)
- **Webpack** - Module bundler
- **Babel** - JavaScript transpiler

## Cài đặt và chạy

### 1. Clone/Download dự án
```bash
git clone <repository-url>
cd codeshare
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Build frontend
```bash
npm run build
```

### 4. Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại: http://localhost:3000

### Development mode
Để chạy với auto-reload:
```bash
npm run dev:server
```

## API Documentation

### Endpoints

#### `POST /api/code`
Tạo mới đoạn code
```json
{
  "title": "My Code",
  "content": "console.log('Hello World');",
  "language": "javascript"
}
```

#### `GET /api/code/:id`
Lấy thông tin đoạn code theo ID
```json
{
  "id": 1,
  "title": "My Code",
  "content": "console.log('Hello World');",
  "language": "javascript",
  "created_at": "2025-06-07T16:22:00.000Z",
  "updated_at": "2025-06-07T16:22:00.000Z"
}
```

#### `PUT /api/code/:id`
Cập nhật đoạn code
```json
{
  "title": "Updated Code",
  "content": "console.log('Hello Updated World');",
  "language": "javascript"
}
```

#### `GET /api/codes`
Lấy danh sách tất cả codes (với preview)

### Frontend Routes

- `/` - Trang chủ với danh sách codes
- `/new` - Tạo code mới
- `/code/:id` - Xem code (mode=view)
- `/code/:id?mode=edit` - Chỉnh sửa code
- `/code/:id?mode=raw` - Xem raw text
- `/code/:id/raw` - Download raw text

## Cấu trúc dự án

```
codeshare/
├── src/
│   ├── server.js           # Express server
│   ├── database.js         # SQLite database layer
│   └── frontend/
│       ├── index.js        # React entry point
│       ├── App.js          # Main React component
│       ├── App.css         # Dracula theme styles
│       └── components/
│           ├── CodeEditor.js   # Monaco editor component
│           └── CodeList.js     # Code listing component
├── public/
│   ├── index.html          # HTML template
│   └── bundle.js           # Built React app
├── database/
│   └── codes.db            # SQLite database file
├── package.json
├── webpack.config.js
└── README.md
```

## Database Schema

### Table: `codes`
```sql
CREATE TABLE codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT 'Untitled',
    content TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'javascript',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Ngôn ngữ được hỗ trợ

- JavaScript/TypeScript
- Python
- Java
- C/C++
- C#
- PHP
- Ruby
- Go
- Rust
- SQL
- HTML/CSS
- JSON/XML
- YAML
- Markdown
- Shell/Bash

## Tính năng chính

### Monaco Editor
- Syntax highlighting cho tất cả ngôn ngữ
- Auto-completion
- Error detection
- Theme Dracula
- Minimap
- Word wrap
- Line numbers

### Modes
1. **View Mode**: Chỉ xem, không chỉnh sửa được
2. **Edit Mode**: Có thể chỉnh sửa và lưu
3. **Raw Mode**: Hiển thị plain text, có thể download

### Responsive Design
- Hoạt động tốt trên desktop và mobile
- Giao diện thân thiện với người dùng
- Loading states và error handling

## Scripts

- `npm start` - Chạy production server
- `npm run build` - Build production bundle
- `npm run dev` - Build development bundle với watch mode
- `npm run dev:server` - Chạy development với auto-reload

## License

ISC

## Contributing

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## Roadmap

- [ ] User authentication
- [ ] Code expiration dates
- [ ] Syntax themes selection
- [ ] Code comments/annotations
- [ ] Share via social media
- [ ] Code statistics
- [ ] Export to GitHub Gist

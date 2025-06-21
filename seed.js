const Database = require('./src/database');

async function seedData() {
    const db = new Database();
    
    // Wait a bit for database to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sampleCodes = [
        {
            title: "Hello World in JavaScript",
            content: "// A simple Hello World program in JavaScript\nconsole.log(\"Hello, World!\");\n\nfunction greet(name) {\n    return `Hello, ${name}!`;\n}\n\nconst message = greet(\"CodeShare\");\nconsole.log(message);",
            language: "javascript"
        },
        {
            title: "Python Data Analysis",
            content: "# Python script for data analysis\nimport pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# Create sample data\ndata = {\n    'name': ['Alice', 'Bob', 'Charlie', 'Diana'],\n    'age': [25, 30, 35, 28],\n    'salary': [50000, 60000, 75000, 55000]\n}\n\ndf = pd.DataFrame(data)\nprint(df)\n\n# Calculate mean salary\nmean_salary = df['salary'].mean()\nprint(f\"Average salary: ${mean_salary:,.2f}\")\n\n# Plot data\nplt.bar(df['name'], df['salary'])\nplt.title('Employee Salaries')\nplt.xlabel('Employee')\nplt.ylabel('Salary ($)')\nplt.show()",
            language: "python"
        },
        {
            title: "React Component Example",
            content: "import React, { useState, useEffect } from 'react';\n\nconst UserProfile = ({ userId }) => {\n    const [user, setUser] = useState(null);\n    const [loading, setLoading] = useState(true);\n    const [error, setError] = useState(null);\n\n    useEffect(() => {\n        const fetchUser = async () => {\n            try {\n                setLoading(true);\n                const response = await fetch(`/api/users/${userId}`);\n                \n                if (!response.ok) {\n                    throw new Error('User not found');\n                }\n                \n                const userData = await response.json();\n                setUser(userData);\n            } catch (err) {\n                setError(err.message);\n            } finally {\n                setLoading(false);\n            }\n        };\n\n        fetchUser();\n    }, [userId]);\n\n    if (loading) return <div>Loading...</div>;\n    if (error) return <div>Error: {error}</div>;\n    if (!user) return <div>No user found</div>;\n\n    return (\n        <div className=\"user-profile\">\n            <img src={user.avatar} alt={user.name} />\n            <h1>{user.name}</h1>\n            <p>{user.email}</p>\n            <p>Joined: {new Date(user.joinDate).toLocaleDateString()}</p>\n        </div>\n    );\n};\n\nexport default UserProfile;",
            language: "javascript"
        },
        {
            title: "SQL Database Query",
            content: "-- Advanced SQL query with joins and aggregations\n\nSELECT \n    u.name AS user_name,\n    u.email,\n    COUNT(o.id) AS total_orders,\n    SUM(o.amount) AS total_spent,\n    AVG(o.amount) AS avg_order_value,\n    MAX(o.created_at) AS last_order_date\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.status = 'active'\n    AND u.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)\nGROUP BY u.id, u.name, u.email\nHAVING total_orders > 0\nORDER BY total_spent DESC\nLIMIT 10;\n\n-- Create index for performance\nCREATE INDEX idx_orders_user_date ON orders(user_id, created_at);\nCREATE INDEX idx_users_status_created ON users(status, created_at);",
            language: "sql"
        },
        {
            title: "CSS Dracula Theme",
            content: ":root {\n    --dracula-bg: #282a36;\n    --dracula-current-line: #44475a;\n    --dracula-selection: #44475a;\n    --dracula-foreground: #f8f8f2;\n    --dracula-comment: #6272a4;\n    --dracula-cyan: #8be9fd;\n    --dracula-green: #50fa7b;\n    --dracula-orange: #ffb86c;\n    --dracula-pink: #ff79c6;\n    --dracula-purple: #bd93f9;\n    --dracula-red: #ff5555;\n    --dracula-yellow: #f1fa8c;\n}\n\n.dark-theme {\n    background-color: var(--dracula-bg);\n    color: var(--dracula-foreground);\n}\n\n.button {\n    background: linear-gradient(45deg, var(--dracula-purple), var(--dracula-pink));\n    border: none;\n    border-radius: 8px;\n    padding: 12px 24px;\n    color: var(--dracula-bg);\n    font-weight: 600;\n    cursor: pointer;\n    transition: all 0.3s ease;\n    box-shadow: 0 4px 15px rgba(189, 147, 249, 0.3);\n}\n\n.button:hover {\n    transform: translateY(-2px);\n    box-shadow: 0 6px 20px rgba(189, 147, 249, 0.4);\n}\n\n.code-block {\n    background-color: var(--dracula-current-line);\n    border: 1px solid var(--dracula-comment);\n    border-radius: 6px;\n    padding: 16px;\n    font-family: 'Fira Code', 'Courier New', monospace;\n    overflow-x: auto;\n}",
            language: "css"
        }
    ];\n\n    console.log('🌱 Seeding sample data...');\n    \n    for (const code of sampleCodes) {\n        try {\n            const result = await db.createCode(code.title, code.content, code.language);\n            console.log(`✅ Created: \"${code.title}\" (ID: ${result.id})`);\n        } catch (error) {\n            console.error(`❌ Failed to create \"${code.title}\":`, error);\n        }\n    }\n    \n    console.log('🎉 Sample data seeded successfully!');\n    console.log('🌐 Visit http://localhost:3000 to see your CodeShare app');\n    \n    db.close();\n    process.exit(0);\n}\n\nseedData().catch(console.error);

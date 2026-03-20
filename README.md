# 📝 TaskMaster-API (Node/Express)

A robust, production-ready RESTful API built with **Node.js** and **Express**, designed for high-performance task management. This project demonstrates clean architecture, custom middleware implementation, and secure access control using **API Key Authentication**.

## 🚀 Overview

The **TaskMaster-API** provides a standardized interface for developers to integrate To-Do functionality into any frontend application. It focuses on developer experience (DX) with clear error messaging, consistent JSON schemas, and enforced security protocols.

### Key Features
* **Secure by Design:** Every endpoint is protected via custom API Key middleware.
* **Full CRUD Support:** Create, Read, Update, and Delete tasks with ease.
* **Atomic Updates:** Toggle task completion status or update titles independently.
* **Input Validation:** Ensures data integrity by sanitizing user input before processing.
* **Scalable Structure:** Organized folder structure (Routes, Controllers, Middleware) for easy expansion.

---

## 🔐 Authentication

To interact with the API, you must include a valid key in the request header. This ensures that only authorized clients can modify data.

| Header | Value |
| :--- | :--- |
| `x-api-key` | `YOUR_SECRET_API_KEY_HERE` |

> **Note:** Unauthorized requests will return a `401 Unauthorized` status code.

---

## 🛠️ Tech Stack

* **Runtime:** [Node.js](https://nodejs.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Environment:** [Dotenv](https://www.npmjs.com/package/dotenv) (Security & Configuration)
* **ID Generation:** [UUID/v4](https://www.npmjs.com/package/uuid) (For unique task identifiers)

---

## 📂 API Reference

### Get all tasks
```http
GET /api/v1/tasks
```

### Get a particular task
```http
GET /api/v1/tasks/:id
```

### Create a new task
```http
POST /api/v1/tasks
Content-Type: application/json

{
  "title": "Learn Express Middleware"
}
```

### Update a task
```http
PUT /api/v1/tasks/:id
```

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone git@github.com:DGashaw/todo-api.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment:**
   Create a `.env` file in the root directory and add:
   ```env
   PORT=3000
   API_KEY=your_super_secret_key
   MONGODB_DEVELOPMENT_CONNECTION_STR=your mongodb connection string
   ```
4. **Run the server:**
   ```bash
   npm start
   ```

---

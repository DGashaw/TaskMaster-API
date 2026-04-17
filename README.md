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
PATCH /api/v1/tasks/:id
```

---

## 🐳 Docker Setup (Development)

The TaskMaster-API includes Docker Compose configuration for running MongoDB in a containerized environment during development.

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) installed and running
- [Docker Compose](https://docs.docker.com/compose/install/)

### Starting Infrastructure

```bash
# Start MongoDB container in the background
npm run infrastructure-start

# Stop MongoDB container
npm run infrastructure-down
```

### Docker Configuration

The `docker-compose.yml` file defines:
- **Service:** MongoDB (latest image)
- **Container Name:** `taskmaster-mongodb`
- **Port:** `27017` (accessible at `localhost:27017`)
- **Data Volume:** `./data` (persisted on your local machine)

---

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone git@github.com:DGashaw/TaskMaster-API.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start MongoDB (Development Only):**
   ```bash
   npm run infrastructure-start
   ```
4. **Configure Environment:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   API_KEY=your_super_secret_key
   NODE_ENV=development
   MONGODB_DEVELOPMENT_CONNECTION_STR=mongodb://localhost:27017/taskmaster
   MONGODB_URI=your_production_mongodb_connection_string
   ```
   
   > **Note:** When running locally with Docker, use `mongodb://localhost:27017/taskmaster` for `MONGODB_DEVELOPMENT_CONNECTION_STR`

5. **Run the server:**
   ```bash
   # Development mode (with nodemon and local Docker MongoDB)
   npm run development
   
   # Production mode (requires MONGODB_URI in .env)
   npm start
   ```

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test-coverage
```

### Database Tests in Development Mode
The `database.test.js` file includes tests that connect to a real MongoDB instance in development mode. Before running these tests, ensure a Docker containerized MongoDB instance is running:

```bash
# Using the provided script
npm run infrastructure-start

# Or manually
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

> **Note:** Tests in 'test' environment use an in-memory MongoDB (via `mongodb-memory-server`), so no external database is required for other test files.

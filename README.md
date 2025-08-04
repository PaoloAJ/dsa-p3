# 🐊 Smart Scheduler

A UF Gator-themed smart scheduling app that helps users organize and prioritize their tasks efficiently using a **custom-built hash map** and **priority queue (min heap)**. Built with **Next.js** and packaged with **Docker**, this project offers both development flexibility and production scalability.

## 👨‍💻 Group Members

- Anilov Villanueva
- Rafael Matheus
- [Name 3]

## 📌 Project Description

Smart Scheduler is a dynamic task management app that:

- Automatically sorts tasks by **priority and time**.
- Resolves scheduling conflicts using a **custom min heap**.
- Stores and retrieves tasks by date using a **custom hash map**.
- Provides a clean and responsive user interface built with **Next.js**.
  Whether you're a student juggling deadlines or a professional managing meetings, Smart Scheduler helps you stay on track with minimal effort.

## 🚀 Getting Started

### 🔧 Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Docker](https://www.docker.com/) (optional for containerized setup)

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

## 🐳 Running with Docker

# 1. Build the Docker image

docker build -t smart-scheduler .

# 2. Run the Docker container

docker run -p 3000:3000 smart-scheduler

## 📄 License

This project is licensed under the MIT License](LICENSE).

You are free to use, modify, and distribute this software with proper attribution.
See the LICENSE file for more details.

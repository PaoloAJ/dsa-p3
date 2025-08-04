# 🐊 Swampy Scheduler

A UF Gator-themed smart scheduling app that helps users organize and prioritize their tasks efficiently using a **custom-built hash map** and **priority queue (min heap)**. Built with **Next.js** and packaged with **Docker**, this project offers both development flexibility and production scalability.

## 👨‍💻 Group Members

- Anilov Villanueva
- Rafael Matheus
- Juan Sanchez

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

```bash
# 1. Build the Docker image
docker build -t smart-scheduler .

# 2. Run the Docker container
docker run -p 3000:3000 smart-scheduler
```

## 📄 License

This project is licensed under the [GNU General Public License v3.0](LICENSE.md).

You may use, modify, and share this software for personal, academic, or non-commercial use.  
Any modified versions must also remain open-source and under the same license.  
Commercial use without permission is prohibited.

See the LICENSE.md file for full details.

# MirrorLog  

> **Track your progress. Visualize your growth. Reflect your learning.**  
> A full-stack productivity and reflection app to log daily activities, track weekly roadmaps, and visualize your consistency.

---

## Overview
**MirrorLog** is a personal productivity and self-tracking web app designed to help learners, developers, and students **reflect, track, and grow**.  
It combines **daily logging**, **goal roadmaps**, and **activity insights** — all in one clean interface.

---

## Features
- 🪞 **Logger Module** – Write quick progress updates with smart tags like `@todo`, `@done`, `@stuck`, and filter them by date, tag, or keyword.  
- 🗺️ **Roadmap Planner** – Organize your learning weeks or project goals with subheadings and checkable todos.  
- 📈 **Statistics Dashboard** – Visualize pages, logs, and tags along with an activity heatmap.  
- 🔐 **Authentication System** – Secure login/register with JWT-based authentication.  
- 🎨 **Responsive UI** – Elegant dark/light styled interface using **Tailwind CSS + Lucide Icons + Framer Motion**.  
- ⚙️ **Modular Backend** – RESTful API with Express and MongoDB for easy scaling.  

---

## Tech Stack

| Layer | Technologies |
|:------|:--------------|
| **Frontend** | React (Vite), Tailwind CSS, Framer Motion, Lucide-React |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Auth & Security** | JWT Authentication, Bcrypt |
| **Dev Tools** | Postman, VS Code, GitHub |

---

## 🗂️ Folder Structure
```

MirrorLog/
│
├── backend/           # Express API (controllers, routes, models)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   └── utils/
│
├── frontend/          # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── utils/
│   └── public/
│
└── README.md

````

---

## Getting Started

### Clone the repository
```bash
git clone https://github.com/Nithin-26-dotcom/Mirror-Log.git
cd Mirror-Log
````

### Backend setup

```bash
cd backend
npm install
npm start
```

> Create a `.env` file in `/backend` with:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
```

### Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

Then open:
👉 `http://localhost:5173/`

---

## Project Modules

| Module        | Description                                              |
| :------------ | :------------------------------------------------------- |
| **Auth**      | Handles login/register and JWT verification              |
| **Pages**     | User workspace sections (like DSA, Exams, Projects)      |
| **Logger**    | Stores reflective progress logs with tag-based filtering |
| **Roadmap**   | Weekly roadmap with todos and completion tracking        |
| **Dashboard** | Stats overview with activity heatmap and insights        |

---

## Developer

**👤 Nithin Kumar Goud**

* 🎓 Vasavi College of Engineering, Hyderabad
* 🥇 Elite Topper (Top 2%) – NPTEL C Programming, IIT Kharagpur
* 💼 Passionate about Full Stack Development & Problem Solving
* 📧 [nithin@test.com](nithinkumargoud1234@gmail.com)
* 🌐 [LinkedIn]([https://linkedin.com/in/](https://www.linkedin.com/in/nitin-panjugula)) *(add yours later)*

---

## Future Enhancements (v2 Ideas)

* [ ] Google OAuth and profile avatars
* [ ] Notification system and reminders
* [ ] Collaborative shared pages
* [ ] Graph-based insights (tag frequency trends)
* [ ] Mobile-friendly responsive dashboard

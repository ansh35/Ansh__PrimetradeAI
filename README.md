# 🚀 TaskFlow: Premium Team Task Manager

**TaskFlow** is a premium, full-stack Team Task Manager built with the MERN stack (React, Express, MongoDB, Node.js). Engineered for high-performance teams, it provides a sophisticated SaaS-style interface for organizing projects, assigning tasks, and tracking member performance with precision.

---

### 🌐 Live Deployment
- **✨ Live Application**: **[taskflow.up.railway.app](https://anshprimetradeai-production.up.railway.app)**
- **📡 Backend API**: **[taskflow-api.up.railway.app](https://content-quietude-production.up.railway.app/api)**
- **📖 API Documentation**: **[Swagger UI Docs](https://content-quietude-production.up.railway.app/api-docs)**
- **📈 Scalability Report**: **[View SCALABILITY.md](./SCALABILITY.md)**

---

## 📸 Project Previews

> [!IMPORTANT]
> **View High-Resolution Screenshots**: [Click here to view the Project Gallery on Google Drive](https://drive.google.com/drive/folders/1kxCxDQxGYts0BJWBex3p7VYTQ5w0FZ5S?usp=sharing)

---

## ⚡ Quick Start

### 1. Database Setup
- **MongoDB Atlas**: Create a cluster, whitelist your IP, and obtain your connection string (`MONGO_URI`).

### 2. Server Configuration
```bash
cd server
npm install
# Create a .env file and configure:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# NODE_ENV=development

npm run dev
```

### 3. Client Configuration
```bash
cd client
npm install
# Create a .env file and configure:
# VITE_API_URL=http://localhost:5000/api

npm run dev
```

---

## ✨ Key Features

- **💎 Executive Dashboard**: A high-fidelity "Cortex" featuring glassmorphic cards, real-time data synchronization, and tactical analytics.
- **📂 Project Repositories**: Advanced multi-member project architecture with automated progress monitoring and phase-based task registries.
- **👥 Dynamic Team Intelligence**: Strategic grouping of users into functional units (e.g., Dev, Design) for bulk task assignments and departmental isolation.
- **📊 Performance Analytics**: Granular efficiency tracking with visual progress bars and mission-critical completion metrics for administrative oversight.
- **🛡️ Secure Access Protocol**: Enterprise-grade JWT authentication paired with Role-Based Access Control (RBAC) for data integrity.
- **🎨 Premium UI System**: A state-of-the-art interface built with **Shadcn UI** components and **Tailwind CSS v4**, featuring a deep-space dark mode and sophisticated **Glassmorphism**.
- **⚡ Neural Interactions**: Smooth micro-animations and interactive elements designed for a premium, responsive user experience.

---

## 📖 Technical Documentation

### 🚀 Tech Stack
- **Frontend**: React 19 (Vite), **Tailwind CSS v4**, **Shadcn UI** (Optimized Components).
- **Design System**: **Glassmorphism** with high-contrast dark mode, ambient glows, and tactical micro-animations.
- **Backend**: Node.js, Express.js (High-performance API).
- **Database**: MongoDB Atlas (Cloud-native NoSQL).
- **Authentication**: JSON Web Tokens (JWT) with secure state persistence and BcryptJS hashing.
- **State Management**: Zustand (Lightweight, atomic state orchestration).
- **Icons**: Lucide React (Tactical iconography).

### 🔑 Role-Based Access Control (RBAC)
TaskFlow utilizes two distinct roles to ensure data security and operational efficiency:

#### 1. Admin (Administrator)
- **Full Control**: Create, edit, and decommission Projects and Teams.
- **Task Management**: Create and assign tasks to any individual or any specific team.
- **Total Visibility**: Monitor all tasks across the workspace and track performance stats for every operative.
- **User Management**: Exclusive access to the organizational directory for project/team assignments.

#### 2. Member (Team Member)
- **Restricted Access**: Operational focus; cannot create projects or teams.
- **Personalized View**: Visibility restricted to tasks assigned directly to them or their respective teams.
- **Status Updates**: Full control over task lifecycle (Todo → In Progress → Completed) for assigned objectives.
- **Project Context**: View details for projects where they are an active member.

---

## 🛠️ Working Flow

### 1. Onboarding & Authentication
Users create an account and are assigned a role. Authentication via JWT ensures secure communication with the backend, with sessions persisted for a seamless experience.

### 2. Project & Team Architecture (Admin Only)
- **Initialize Projects**: Admins define project parameters and select which members are assigned to the mission.
- **Form Teams**: Admins group members into functional units (e.g., "Design", "Devs") for streamlined collaboration and bulk assignments.

### 3. Task Lifecycle
- **Deployment**: Admin creates a task, selects a project, and chooses an Assignment Type (Individual or Team).
- **Execution**: Members monitor their objectives via the Dashboard and update task status as they progress.
- **Completion**: Marking a task as "Completed" automatically updates project progress and admin performance analytics.

### 4. Performance Intelligence (Admin Only)
Admins access the **Team Management** module to view real-time performance data. This includes total task volume, completion counts, and visual progress tracking for every member in the organization.

---

## 📂 Project Structure

```text
TaskFlow/
├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components & Layouts
│   │   ├── store/         # Zustand state management (Auth, etc.)
│   │   ├── pages/         # Dashboard, Projects, Tasks, Team views
│   │   └── index.css      # Tailwind v4 configuration & Custom Styles
├── server/                # Node.js Backend
│   ├── controllers/       # Business Logic (Auth, Projects, Tasks, Teams)
│   ├── models/            # Mongoose Schemas (User, Project, Task, Team)
│   ├── routes/            # API Endpoint definitions
│   └── index.js           # Main Entry Point
```

---

## 📡 Key API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register a new user |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/v1/auth/me` | Auth | Get current user profile |
| `PUT` | `/api/v1/auth/profile` | Auth | Update current user profile |
| `GET` | `/api/v1/dashboard` | Auth | Get workspace analytics & stats |
| `GET` | `/api/v1/projects` | Auth | Get projects relevant to the user |
| `POST` | `/api/v1/projects` | Admin | Create a new organizational project |
| `PUT` | `/api/v1/projects/:id` | Admin | Update project (title, members, team) |
| `DELETE` | `/api/v1/projects/:id` | Admin | Delete a project |
| `POST` | `/api/v1/projects/:id/members` | Admin | Add member to project by email |
| `DELETE` | `/api/v1/projects/:id/members/:memberId` | Admin | Remove member from project |
| `GET` | `/api/v1/tasks` | Auth | Get tasks (filter by status, priority, project) |
| `POST` | `/api/v1/tasks` | Admin | Create and assign a new task |
| `PUT` | `/api/v1/tasks/:id` | Auth | Update task (members: status only) |
| `DELETE` | `/api/v1/tasks/:id` | Auth | Delete task (admin or creator only) |
| `GET` | `/api/v1/teams` | Auth | View existing teams |
| `POST` | `/api/v1/teams` | Admin | Create a new team |

---

## 🔮 Future Roadmap

- **💬 Real-time Tactical Chat**: Integrated messaging system for project-level and team-level communication.
- **📱 Mobile Command**: Native iOS and Android applications for on-the-go workspace management.
- **🤖 AI Task Orchestrator**: Automated task prioritization and deadline risk assessment using machine learning.
- **📁 Advanced Asset Management**: Deep integration for cloud-based file attachments and versioning.
- **🌍 Multi-Workspace Architecture**: Support for managing multiple independent organizations under one account.

---

## 👤 Maintainer & Links

- **Created by**: [Ansh Khare](https://github.com/ansh35)
- **Live Deployment**: **[TaskFlow Production](https://anshprimetradeai-production.up.railway.app)**
- **API Documentation**: **[Interactive Swagger Docs](https://content-quietude-production.up.railway.app/api-docs)**


---

*Architecting the future of collaborative intelligence.*
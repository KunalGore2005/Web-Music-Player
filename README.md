# Web Music Player

## 📖 Overview

A fully-featured **Web Music Player** project built to demonstrate authentication, tracks management, album creation, and fluid responsive design. The project comprises a **React/Vite** frontend using **Tailwind CSS** for styling, and an **Express/Node.js** backend connected to a **MongoDB** database.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Single-page app framework
- **Vite** - Built tool and dev server
- **Tailwind CSS v4** - Utility-first styling with custom theme definitions and fluid responsiveness
- **React Router DOM v7** - Routing logic
- **Lucide React** - Rich, modern icons
- **Context API** - Authentication & player states

### Backend
- **Node.js** & **Express** - Restful API architecture
- **MongoDB** (via **Mongoose**) - Relational document database
- **JWT (JSON Web Tokens)** - Authentication and stateless sessions (with credentials)
- **Cookie Parser** - Reading credentials from secure HttpOnly cookies
- **Dotenv** - Configuration loading

---

## 🚀 Getting Started

Follow these steps to clone and run the project locally on your system.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes packaged with Node.js)
- **MongoDB** (either installed locally or using a MongoDB Atlas cloud URI)
- **Git**

### 1. Clone the Repository
Clone the repository using Git and navigate into the project directory:
```bash
git clone https://github.com/your-username/web-music-player.git
cd web-music-player
```

### 2. Backend Setup
1. Open a new terminal and navigate to the backend folder:
   ```bash
   cd Backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend` directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_phrase
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend should now be running at `http://localhost:3000`.

### 3. Frontend Setup
1. Open a second terminal window and navigate to the frontend folder:
   ```bash
   cd Frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Frontend` directory:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
4. Start the frontend dev server:
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:5173`. Open this URL in your web browser.

---

## 📚 How to Use

1. **Register/Login**: Navigate to `/register` or `/login` to create a user account. You can sign up as a **Listener** (regular user) or an **Artist**.
2. **Browse Music**: Listeners and Artists can browse all uploaded tracks and albums on the Home screen, view individual album details, and add tracks to the active queue.
3. **Control Player**: Control track play, pause, progression tracking, and volume adjustment from the persistent player bar at the bottom.
4. **Artist Studio**: Users registered as Artists can access the **Artist Studio** `/studio` to upload new music files (MP3s) and organize their tracks into albums.

---

## 📄 License

This project is open-source and licensed under the **MIT License**.

```text
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

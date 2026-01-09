# 🗳️ Live Polling System

A real-time, interactive polling application built for classrooms and live events. This system allows teachers to create polls instantly and students to vote in real-time, with live leaderboards and engagement features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-live-green.svg)

## ✨ Key Features

- **Real-Time Interaction**: Polls and results update instantly using Socket.io. No page refreshes needed.
- **Teacher Dashboard**: 
  - Create single or multi-select polls.
  - View live voting percentages as they happen.
  - Controls to end polls and show results.
- **Student Lobby**:
  - Join easily with a Room Code or QR Code.
  - Instant voting interface.
  - Floating emoji reactions for engagement.
  - Live chat widget to ask questions.
- **Gamification**:
  - Live Leaderboard showing top scorers.
  - Points awarded for correct answers.
  - Medals for top 3 participants.
- **Resilience**:
  - Automatic reconnection handling.
  - Session state persistence (reload without losing your spot).

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, Framer Motion, Socket.io-client
- **Backend**: Node.js, Express, Socket.io, MongoDB (Mongoose)
- **Tools**: QRCode.react, Canvas Confetti

## 🚀 Getting Started

Follow these steps to run the application locally.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URI)

### 1. Clone the Repository
```bash
git clone https://github.com/jakkakarthik2004/Live-Polling-System.git
cd Live-Polling-System
```

### 2. Backend Setup
Navigate to the `server` directory and install dependencies.
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder with your configuration:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://54.144.33.173:5173
```

Start the backend server:
```bash
npm run dev
```
*Server runs on port 5000 by default.*

### 3. Frontend Setup
Open a new terminal, navigate to the `client` directory, and install dependencies.
```bash
cd client
npm install
```

Start the React development server:
```bash
npm run dev
```
*Client runs on http://54.144.33.173:5173 by default.*

## 📱 Usage Guide

1. **Teacher**: Open the app and select "I'm a Teacher". Create a room.
2. **Students**: Open the app and select "I'm a Student". Scan the QR code or enter the Room Code displayed on the teacher's screen.
3. **Polling**: The teacher creates a question. It instantly appears on all student devices.
4. **Results**: As students vote, the teacher sees the bars move. When the poll ends, the correct answer is revealed and the leaderboard updates.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request for any improvements.
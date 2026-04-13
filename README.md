# tictactoe-multiplayer

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd tictactoe-multiplayer
```

### 2. Start the backend

```bash
cd backend
npm install
node server.js
```

Backend runs on `http://localhost:4000`

### 3. Start the frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

### 4. Play

Open `http://localhost:3000` in two browser tabs (or one normal + one incognito), enter a name in each, click **Find Match** — the game starts automatically when both players are ready.

## Features

- Real-time multiplayer via WebSockets
- Matchmaking queue — auto-pairs two players
- Player names and avatars
- Win / draw / loss tracking per session
- Points system — 100 pts for a win, 20 pts for a draw
- Winning cells highlighted on game end
- Opponent disconnect handling

## Points System

| Result | Points |
|--------|--------|
| Win    | +100   |
| Draw   | +20    |
| Loss   | +0     |

## Running in GitHub Codespaces

1. Open the repo in Codespaces
2. In the **PORTS** tab, make port `4000` visibility **Public**
3. Copy the forwarded URL for port 4000
4. Create `frontend/.env` with `REACT_APP_SERVER_URL=<that URL>`
5. Start backend and frontend in separate terminals

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| `backend/` | `node server.js` | Start production server |
| `backend/` | `npx nodemon server.js` | Start with auto-reload |
| `frontend/` | `npm start` | Start dev server |
| `frontend/` | `npm run build` | Production build |
EOF

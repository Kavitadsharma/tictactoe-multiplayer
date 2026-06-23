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
npm start
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

## Environment Variables

### Backend (.env)
```
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_SERVER_URL=http://localhost:4000
```

## Features

- Real-time multiplayer via WebSockets
- Matchmaking queue — auto-pairs two players
- Player names and avatars
- Win / draw / loss tracking per session
- Points system — 100 pts for a win, 20 pts for a draw
- Winning cells highlighted on game end
- Opponent disconnect handling

## Deployment

### Deploy Backend on Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com)
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Set configurations:
   - **Name**: `tictactoe-backend`
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
6. Add environment variables in Render dashboard:
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-vercel-app.vercel.app` (add after deploying frontend)
7. Click **Create Web Service**
8. Copy the backend URL (e.g., `https://tictactoe-backend.onrender.com`)

### Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project** → Import your GitHub repo
3. Select the repository and click Import
4. Framework preset: **Create React App**
5. Add environment variable:
   - `REACT_APP_SERVER_URL`: `https://tictactoe-backend.onrender.com` (or your Render backend URL)
6. Click **Deploy**
7. Once deployed, update your Render backend's `FRONTEND_URL` to the Vercel URL

### CORS Configuration

CORS is configured to accept requests from your frontend URL. Make sure to set:
- **Backend**: `FRONTEND_URL` environment variable to your frontend deployment URL
- **Frontend**: `REACT_APP_SERVER_URL` environment variable to your backend deployment URL


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

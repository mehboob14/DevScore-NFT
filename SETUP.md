# DevScore NFT - Setup & Running Guide

This project has both a frontend (React/TypeScript with Vite) and a backend (Python/FastAPI) component.

## Prerequisites

- **Node.js & npm** (for frontend)
- **Python 3.11+** (for backend)
- **PowerShell** (for running scripts)

All dependencies have been installed. Follow the steps below to run the project.

---

## Quick Start - Run Everything

### Option 1: PowerShell Script (Windows)

Run the included setup script to start both frontend and backend automatically:

```powershell
.\run-dev.ps1
```

This will:

- Start the backend FastAPI server on `http://localhost:8000`
- Start the frontend Vite dev server on `http://localhost:8080`
- Open both in your browser automatically

---

## Manual Setup & Running

### Backend Setup

1. **Navigate to backend folder:**

   ```powershell
   cd backend
   ```

2. **Activate virtual environment:**

   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. **Start the FastAPI server:**

   ```powershell
   uvicorn main:app --reload --port 8000
   ```

   The API will be available at:

   - Main API: `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. **In a new terminal, navigate to project root:**

   ```powershell
   cd c:\Users\Admin\Desktop\devscore_nfg\devscore-nft
   ```

2. **Start Vite dev server:**

   ```powershell
   npm run dev
   ```

   The frontend will be available at:

   - Application: `http://localhost:8080`

---

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend

- `uvicorn main:app --reload --port 8000` - Start development server with auto-reload
- `pytest` - Run tests
- `black .` - Format code
- `isort .` - Sort imports

---

## Project Structure

```
devscore-nft/
├── src/                    # Frontend React/TypeScript code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # External service integrations (Supabase)
│   └── lib/              # Utility functions
├── backend/              # Python FastAPI backend
│   ├── main.py           # Main FastAPI app
│   ├── score_engine.py   # DevScore calculation logic
│   ├── qubic_client.py   # Qubic blockchain integration
│   └── venv/             # Python virtual environment
└── public/               # Static assets
```

---

## Environment Variables

The `.env` file is already configured with Supabase credentials:

- `VITE_SUPABASE_PROJECT_ID`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_URL`

---

## Troubleshooting

### Backend issues:

- If `uvicorn` command not found, make sure virtual environment is activated: `.\venv\Scripts\Activate.ps1`
- If port 8000 is in use, specify a different port: `uvicorn main:app --port 8001`

### Frontend issues:

- If port 8080 is in use, edit `vite.config.ts` to change the port
- Clear node_modules and reinstall if you encounter module issues: `rm -r node_modules; npm install`

### Python virtual environment:

- If virtual environment is broken, delete `backend/venv` folder and recreate: `python -m venv venv`
- Then reinstall dependencies: `pip install -r requirements.txt`

---

## Next Steps

1. Start the backend: `cd backend ; .\venv\Scripts\Activate.ps1 ; uvicorn main:app --reload`
2. Start the frontend in a new terminal: `npm run dev`
3. Open `http://localhost:8080` in your browser
4. Check API docs at `http://localhost:8000/docs`

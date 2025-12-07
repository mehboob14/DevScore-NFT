# ✅ DevScore NFT - Setup Complete!

## Installation Status

### Frontend Dependencies ✓

- **392 packages** installed successfully
- Location: `node_modules/`
- Package Manager: npm
- Key dependencies:
  - React 18.3.1
  - React Router DOM 6.30.1
  - Vite 5.4.19
  - TypeScript 5.8.3
  - Tailwind CSS 3.4.17
  - Supabase JS Client 2.86.2
  - shadcn/ui components
  - Radix UI components

### Backend Dependencies ✓

- **All Python packages** installed successfully
- Location: `backend/venv/`
- Virtual Environment: Active and ready
- Key dependencies:
  - FastAPI 0.109.0
  - Uvicorn 0.27.0 (with standard extras)
  - Pydantic 2.5.3
  - Python-dotenv 1.0.0
  - httpx 0.26.0 (for API calls)
  - aiohttp 3.9.1 (for async HTTP)
  - python-jose 3.3.0 (security)
  - passlib 1.7.4 (password hashing)
  - pytest 7.4.4 (testing)
  - black 24.1.1 (code formatting)
  - isort 5.13.2 (import sorting)

### Environment Configuration ✓

- `.env` file configured with Supabase credentials
- CORS enabled for development

---

## 🚀 How to Run

### Method 1: Quick Start (Windows)

Simply double-click or run:

```
run-dev.bat
```

This will automatically open:

- Backend server on http://localhost:8000
- Frontend on http://localhost:8080

### Method 2: PowerShell

```powershell
.\run-dev.ps1
```

### Method 3: Manual (Recommended for Development)

**Terminal 1 - Backend:**

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**

```powershell
npm run dev
```

---

## 📍 Access Points

| Service           | URL                         | Purpose                |
| ----------------- | --------------------------- | ---------------------- |
| Frontend App      | http://localhost:8080       | Main application       |
| Backend API       | http://localhost:8000       | API endpoints          |
| API Documentation | http://localhost:8000/docs  | Interactive Swagger UI |
| Alternative Docs  | http://localhost:8000/redoc | ReDoc documentation    |

---

## 📁 Project Structure

```
devscore-nft/
├── src/                          # Frontend source code
│   ├── components/              # React components
│   │   ├── auth/               # Authentication components
│   │   ├── cards/              # Card components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Page components
│   ├── integrations/           # External integrations
│   │   └── supabase/          # Supabase client
│   └── lib/                    # Utilities
├── backend/                     # Backend source code
│   ├── main.py                 # FastAPI app entry point
│   ├── score_engine.py         # DevScore calculation
│   ├── qubic_client.py         # Blockchain integration
│   ├── nostromo_integration.py # Additional integration
│   ├── requirements.txt        # Python dependencies
│   └── venv/                   # Python virtual environment
├── public/                      # Static assets
├── supabase/                    # Supabase configuration
├── package.json                # Frontend dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
├── tailwind.config.ts          # Tailwind CSS config
├── run-dev.bat                 # Quick start (batch)
├── run-dev.ps1                 # Quick start (PowerShell)
└── SETUP.md                    # This file

```

---

## 🔧 Available Commands

### Frontend

| Command             | Purpose                  |
| ------------------- | ------------------------ |
| `npm run dev`       | Start development server |
| `npm run build`     | Build for production     |
| `npm run build:dev` | Development build        |
| `npm run lint`      | Run ESLint               |
| `npm run preview`   | Preview production build |

### Backend

| Command                                 | Purpose                           |
| --------------------------------------- | --------------------------------- |
| `uvicorn main:app --reload --port 8000` | Start dev server with auto-reload |
| `uvicorn main:app --port 8000`          | Start production server           |
| `pytest`                                | Run tests                         |
| `black .`                               | Format code                       |
| `isort .`                               | Sort imports                      |

---

## ⚙️ Development Setup

### Python Virtual Environment

The backend uses a Python virtual environment for isolation:

- Location: `backend/venv/`
- Activate (PowerShell): `backend\venv\Scripts\Activate.ps1`
- Activate (CMD): `backend\venv\Scripts\activate.bat`
- Deactivate: `deactivate`

### Frontend Node Modules

- Location: `node_modules/`
- Size: ~392 packages
- To reinstall: `rm -r node_modules; npm install`

---

## 🔍 Testing & Debugging

### Backend API Testing

1. Go to http://localhost:8000/docs
2. Use the interactive Swagger UI to test endpoints
3. Or use http://localhost:8000/redoc for documentation

### Frontend Debugging

- Open DevTools: F12 in browser
- Vite provides HMR (Hot Module Replacement)
- Check console for errors

### Python Debugging

- Logs appear in terminal where uvicorn is running
- Add print statements or use debugger
- Check `backend/venv/Scripts/` for additional tools

---

## 🐛 Troubleshooting

### Port Already in Use

If ports 8000 or 8080 are in use:

- **Backend**: `uvicorn main:app --port 8001`
- **Frontend**: Edit `vite.config.ts` port setting

### Virtual Environment Issues

```powershell
# Recreate virtual environment
cd backend
Remove-Item venv -Recurse
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Node Modules Issues

```powershell
# Clear and reinstall
Remove-Item node_modules -Recurse
npm install
```

### Backend Import Errors

Ensure virtual environment is activated before running uvicorn:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
```

---

## ✨ Next Steps

1. **Start Development Servers**

   ```powershell
   .\run-dev.bat
   ```

2. **Open Frontend**

   - Navigate to http://localhost:8080

3. **Test Backend API**

   - Go to http://localhost:8000/docs

4. **Begin Development**
   - Edit files in `src/` for frontend
   - Edit files in `backend/` for backend
   - Changes auto-reload with HMR/uvicorn --reload

---

## 📚 Resources

- [React Documentation](https://react.dev)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)

---

**Setup Date:** December 7, 2025  
**Status:** ✅ Ready to Run  
**Last Verified:** All dependencies installed and configured

# DevScore

A blockchain-backed reputation engine that collects developer activity from GitHub and Discord, calculates a score, and mints it as an NFT on the Qubic testnet.

## Features

- **GitHub Integration**: Track commits, pull requests, and issues
- **Discord Activity**: Monitor community engagement
- **DevScore Calculation**: Algorithmic reputation scoring (0-1000)
- **NFT Minting**: Immutable proof of developer reputation on Qubic blockchain
- **Leaderboard**: Compete with other developers globally
- **Profile Management**: Connect accounts and view your stats

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

### Backend
- FastAPI (Python)
- SQLite for data storage
- Qubic SDK integration (placeholder)

## Quick Start

### Frontend

The frontend runs on Lovable's cloud infrastructure. Simply access the app URL.

For local development:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend

The backend requires Python 3.9+ and must be run separately:

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## Project Structure

```
devscope/
├── src/                    # Frontend source
│   ├── components/         # React components
│   │   ├── cards/          # Card components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Shadcn UI components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   └── lib/                # Utilities
├── backend/                # Backend source
│   ├── main.py             # FastAPI application
│   ├── score_engine.py     # Scoring algorithm
│   ├── qubic_client.py     # Qubic blockchain client
│   ├── nostromo_integration.py  # Nostromo Launchpad
│   └── requirements.txt    # Python dependencies
└── README.md
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/users/register` | POST | Register new user |
| `/api/activity/{wallet}` | GET | Fetch developer activity |
| `/api/calculate-score` | POST | Calculate DevScore |
| `/api/mint-nft` | POST | Mint DevScore NFT |
| `/api/dashboard/{wallet}` | GET | Get dashboard data |
| `/api/leaderboard` | GET | Get top developers |

## Score Calculation

The DevScore is calculated based on:

| Activity | Points | Max Contribution |
|----------|--------|------------------|
| Commits | 2 per commit | 400 |
| Pull Requests | 5 per PR | 250 |
| Issues | 3 per issue | 150 |
| Discord Messages | 0.5 per message | 200 |

**Maximum Score: 1000**

### Tiers

| Score Range | Tier |
|-------------|------|
| 800-1000 | Elite Developer |
| 600-799 | Senior Developer |
| 400-599 | Mid Developer |
| 200-399 | Junior Developer |
| 0-199 | Newcomer |

## Qubic Integration

The project uses placeholder implementations for Qubic blockchain integration. When deploying to production:

1. Replace `qubic_client.py` with actual Qubic SDK calls
2. Configure Nostromo Launchpad credentials
3. Deploy smart contracts via `nostromo_integration.py`

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Qubic Configuration
QUBIC_NETWORK=testnet
QUBIC_API_KEY=your_api_key

# Nostromo Launchpad
NOSTROMO_API_KEY=your_nostromo_key

# GitHub API (for real activity fetching)
GITHUB_TOKEN=your_github_token

# Discord API
DISCORD_BOT_TOKEN=your_discord_token
```

## Development

### Frontend Development

```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
```

### Backend Development

```bash
# Run with auto-reload
uvicorn main:app --reload

# Run tests
pytest

# Format code
black .
isort .
```

## Deployment

### Frontend
Deploy via Lovable's publish feature or any static hosting service.

### Backend
1. Set up a Python hosting environment (e.g., Railway, Render, AWS)
2. Configure environment variables
3. Run with: `uvicorn main:app --host 0.0.0.0 --port 8000`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for any purpose.

## Links

- [Qubic Documentation](https://docs.qubic.org/)
- [Nostromo Launchpad](https://nostromo.qubic.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

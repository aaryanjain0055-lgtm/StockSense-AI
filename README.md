# StockSense AI

StockSense AI is a full-stack stock market intelligence and decision-support platform focused on the Indian equity market.

The system combines market data, technical analysis, fundamental analysis, analyst information, news sentiment, machine-learning experimentation, and explainable multi-factor scoring.

The production system deliberately separates experimental machine-learning research from the final explainable analytical signal.

---

## Core Features

### Market Intelligence

- Market dashboard
- Stock search
- Market indices
- Top gainers and losers
- Historical price data
- Company information
- Financial information
- Market news

### Technical Analysis

- RSI
- MACD
- MACD signal line
- MACD histogram
- EMA 20
- EMA 50
- Relative volume
- Trend classification

### Fundamental Analysis

The platform evaluates available company and financial information to produce an explainable fundamental score.

### News Sentiment

StockSense AI analyzes available stock-related news and produces:

- sentiment score
- sentiment classification
- article-level analysis
- aggregate sentiment interpretation

### Explainable Production Analysis

The production prediction endpoint combines:

- Technical score
- Fundamental score
- Analyst score
- Sentiment score

The final output contains:

- overall score
- classification
- signal
- confidence
- factor agreement
- weighted contributions
- explanations
- risk flags
- model-governance information

---

## Machine Learning Research

The project contains experimental research pipelines for:

- Logistic Regression
- Random Forest
- Histogram Gradient Boosting
- Multiclass classification
- Two-stage classification
- Regression modelling
- Confidence threshold analysis
- Walk-forward validation
- Regression walk-forward validation
- Baseline comparison
- Temporal train-validation-test splitting

The experiments showed that the tested ML models did not provide sufficiently stable predictive performance across validation and test periods.

For this reason, experimental ML models are retained for research and benchmarking but are not allowed to override the production analytical score.

This is an intentional model-governance decision.

---

## Technology Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- scikit-learn
- pandas
- NumPy
- SciPy
- yfinance
- Uvicorn

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- Zustand
- Lucide React

### Deployment Preparation

- Backend Dockerfile
- Frontend multi-stage Dockerfile
- Nginx SPA configuration
- Docker Compose configuration
- Environment-based API configuration

---

## Project Structure

```text
StockSense-AI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── data/
│   │   ├── db/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── services/
│   ├── scripts/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── store/
│   │   └── types/
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
├── .gitignore
└── README.md
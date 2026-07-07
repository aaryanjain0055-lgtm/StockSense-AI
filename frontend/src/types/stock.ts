// ======================================================
// PRODUCTION PREDICTION TYPES
// ======================================================

export interface ProductionSignal {
  score: number;
  classification: string;
  signal: string;
  confidence: string;
  factor_agreement: string;
}


// ======================================================
// FACTOR AGREEMENT
// ======================================================

export interface FactorAgreement {
  status: string;
  positive_factors: number;
  negative_factors: number;
  neutral_factors: number;
  total_factors: number;
}


// ======================================================
// TECHNICAL DETAILS
// ======================================================

export interface TechnicalDetails {
  rsi: number;
  rsi_signal: string;

  macd: number;
  macd_signal_line: number;
  macd_histogram: number;
  macd_signal: string;

  ema20: number;
  ema50: number;

  relative_volume: number;

  trend: string;
}


// ======================================================
// FACTOR SCORE
// ======================================================

export interface FactorScore {
  score: number;
  reasons: string[];
  details?: TechnicalDetails;
}


// ======================================================
// FACTOR SCORES
// ======================================================

export interface FactorScores {
  technical: FactorScore;
  fundamental: FactorScore;
  analyst: FactorScore;
  sentiment: FactorScore;
}


// ======================================================
// WEIGHTED CONTRIBUTIONS
// ======================================================

export interface WeightedContributions {
  technical: number;
  fundamental: number;
  analyst: number;
  sentiment: number;
}


// ======================================================
// EXPLANATION
// ======================================================

export interface ExplanationItem {
  factor: string;
  score: number;
  reasons: string[];
}


// ======================================================
// RISK FLAGS
// ======================================================

export interface RiskFlag {
  level: string;
  category: string;
  message: string;
}


// ======================================================
// MODEL GOVERNANCE
// ======================================================

export interface ModelStatus {
  status: string;
  used_for_final_signal: boolean;
}


export interface ModelGovernance {
  production_mode: string;

  classification_model: ModelStatus;

  regression_model: ModelStatus;

  reason: string;
}


// ======================================================
// COMPLETE PRODUCTION PREDICTION RESPONSE
// ======================================================

export interface ProductionPredictionResponse {
  symbol: string;

  generated_at: string;

  production_signal: ProductionSignal;

  factor_agreement: FactorAgreement;

  factor_scores: FactorScores;

  weighted_contributions: WeightedContributions;

  explanation: ExplanationItem[];

  risk_flags: RiskFlag[];

  model_governance: ModelGovernance;

  methodology: string;

  disclaimer: string;
}


// ======================================================
// STOCK SEARCH TYPES
// ======================================================

export interface StockSearchResult {
  symbol: string;
  name?: string;
  exchange?: string;
  sector?: string;
}


// ======================================================
// BASIC STOCK INFORMATION
// ======================================================

export interface StockInfo {
  symbol: string;
  name?: string;

  current_price?: number;

  previous_close?: number;

  change?: number;

  change_percent?: number;

  market_cap?: number;

  sector?: string;

  industry?: string;
}


// ======================================================
// TECHNICAL ANALYSIS RESPONSE
// ======================================================

export interface RSIData {
  value: number;
  signal: string;
}


export interface MACDData {
  value: number;
  signal_line: number;
  histogram: number;
  signal: string;
}


export interface MovingAverages {
  ema20: number;
  ema50: number;
  sma20: number;
  sma50: number;
}


export interface BollingerBands {
  upper: number;
  middle: number;
  lower: number;
}


export interface VolumeData {
  current: number;
  average_20d: number;
  relative_volume: number;
}


export interface TechnicalAnalysisResponse {
  symbol: string;

  current_price: number;

  rsi: RSIData;

  macd: MACDData;

  moving_averages: MovingAverages;

  bollinger_bands: BollingerBands;

  atr: number;

  support: number;

  resistance: number;

  volume: VolumeData;

  trend: string;
}


// ======================================================
// NEWS SENTIMENT TYPES
// ======================================================

export interface ArticleSentiment {
  label: string;

  raw_score?: number;

  normalized_score?: number;

  score?: number;

  confidence: number;

  positive_keywords: string[];

  negative_keywords: string[];
}


export interface NewsArticle {
  title: string;

  summary: string;

  publisher: string;

  published_at: string;

  url: string;

  thumbnail?: string;

  sentiment: ArticleSentiment;
}


export interface SentimentDistribution {
  positive: number;
  negative: number;
  neutral: number;
}


export interface SentimentDistributionPercent {
  positive: number;
  negative: number;
  neutral: number;
}


export interface NewsSentimentResponse {
  symbol: string;

  article_count: number;

  overall_sentiment: string;

  average_score: number;

  distribution: SentimentDistribution;

  distribution_percent?: SentimentDistributionPercent;

  articles: NewsArticle[];
}
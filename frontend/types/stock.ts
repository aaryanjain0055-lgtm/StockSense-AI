export type ConfidenceLevel =
  | "LOW"
  | "MODERATE"
  | "HIGH";

export type ProductionSignal = {
  score: number;
  classification: string;
  signal: string;
  confidence: ConfidenceLevel | string;
  factor_agreement: string;
};

export type FactorAgreement = {
  status: string;
  positive_factors: number;
  negative_factors: number;
  neutral_factors: number;
  total_factors: number;
};

export type TechnicalDetails = {
  rsi?: number;
  rsi_signal?: string;

  macd?: number;
  macd_signal_line?: number;
  macd_histogram?: number;
  macd_signal?: string;

  ema20?: number;
  ema50?: number;

  relative_volume?: number;

  trend?: string;
};

export type FactorScore = {
  score: number;
  reasons: string[];
  details?: TechnicalDetails;
};

export type FactorScores = {
  technical: FactorScore;
  fundamental: FactorScore;
  analyst: FactorScore;
  sentiment: FactorScore;
};

export type WeightedContributions = {
  technical: number;
  fundamental: number;
  analyst: number;
  sentiment: number;
};

export type ExplanationItem = {
  factor: string;
  score: number;
  reasons: string[];
};

export type RiskFlag = {
  level: string;
  category: string;
  message: string;
};

export type ModelStatus = {
  status: string;
  used_for_final_signal: boolean;
};

export type ModelGovernance = {
  production_mode: string;

  classification_model: ModelStatus;

  regression_model: ModelStatus;

  reason: string;
};

export type ProductionPredictionResponse = {
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
};
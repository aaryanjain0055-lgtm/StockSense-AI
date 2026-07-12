import api from "./api";


export type PortfolioHolding = {
  id: number;
  portfolio_id: number;
  symbol: string;
  company_name: string | null;
  quantity: number;
  average_buy_price: number;
  purchase_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};


export type Portfolio = {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  holdings: PortfolioHolding[];
};


export type PortfolioHoldingAnalytics = {
  id: number;
  symbol: string;
  company_name: string | null;
  quantity: number;
  average_buy_price: number;
  current_price: number | null;
  invested_value: number;
  current_value: number | null;
  profit_loss: number | null;
  profit_loss_percent: number | null;
  data_status: string;
};


export type PortfolioAnalytics = {
  portfolio_id: number;
  portfolio_name: string;
  total_invested: number;
  priced_invested_value: number;
  total_current_value: number;
  total_profit_loss: number;
  total_profit_loss_percent: number;
  holdings_count: number;
  priced_holdings_count: number;
  unavailable_holdings_count: number;
  analytics_status: string;
  holdings: PortfolioHoldingAnalytics[];
};


export type CreatePortfolioPayload = {
  name: string;
  description?: string | null;
};


export type UpdatePortfolioPayload = {
  name?: string;
  description?: string | null;
};


export type CreateHoldingPayload = {
  symbol: string;
  company_name?: string | null;
  quantity: number;
  average_buy_price: number;
  purchase_date?: string | null;
  notes?: string | null;
};


export type UpdateHoldingPayload = {
  company_name?: string | null;
  quantity?: number;
  average_buy_price?: number;
  purchase_date?: string | null;
  notes?: string | null;
};


export async function getPortfolios(): Promise<
  Portfolio[]
> {
  const response = await api.get(
    "/portfolio",
  );

  return response.data;
}


export async function getPortfolio(
  portfolioId: number,
): Promise<Portfolio> {
  const response = await api.get(
    `/portfolio/${portfolioId}`,
  );

  return response.data;
}


export async function createPortfolio(
  payload: CreatePortfolioPayload,
): Promise<Portfolio> {
  const response = await api.post(
    "/portfolio",
    payload,
  );

  return response.data;
}


export async function updatePortfolio(
  portfolioId: number,
  payload: UpdatePortfolioPayload,
): Promise<Portfolio> {
  const response = await api.patch(
    `/portfolio/${portfolioId}`,
    payload,
  );

  return response.data;
}


export async function deletePortfolio(
  portfolioId: number,
): Promise<void> {
  await api.delete(
    `/portfolio/${portfolioId}`,
  );
}


export async function addHolding(
  portfolioId: number,
  payload: CreateHoldingPayload,
): Promise<PortfolioHolding> {
  const response = await api.post(
    `/portfolio/${portfolioId}/holdings`,
    payload,
  );

  return response.data;
}


export async function updateHolding(
  portfolioId: number,
  holdingId: number,
  payload: UpdateHoldingPayload,
): Promise<PortfolioHolding> {
  const response = await api.patch(
    `/portfolio/${portfolioId}/holdings/${holdingId}`,
    payload,
  );

  return response.data;
}


export async function deleteHolding(
  portfolioId: number,
  holdingId: number,
): Promise<void> {
  await api.delete(
    `/portfolio/${portfolioId}/holdings/${holdingId}`,
  );
}


export async function getPortfolioAnalytics(
  portfolioId: number,
): Promise<PortfolioAnalytics> {
  const response = await api.get(
    `/portfolio/${portfolioId}/analytics/live`,
  );

  return response.data;
}
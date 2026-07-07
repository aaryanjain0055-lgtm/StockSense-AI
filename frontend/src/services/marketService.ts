import api from "./api";


export async function getQuote(symbol: string) {
  const response = await api.get(
    `/market/quote/${symbol}`
  );

  return response.data;
}


export async function getHistory(
  symbol: string,
  period: string = "6mo"
) {
  const response = await api.get(
    `/historical/${symbol}`,
    {
      params: {
        period,
      },
    }
  );

  return response.data;
}


export async function searchStocks(query: string) {
  const response = await api.get(
    "/market/search",
    {
      params: {
        query,
      },
    }
  );

  return response.data;
}


export async function getDashboard() {
  const response = await api.get(
    "/market/dashboard"
  );

  return response.data;
}


export async function getTopGainers() {
  const response = await api.get(
    "/market/top-gainers"
  );

  return response.data;
}


export async function getTopLosers() {
  const response = await api.get(
    "/market/top-losers"
  );

  return response.data;
}


export async function getTechnicalAnalysis(
  symbol: string
) {
  const response = await api.get(
    `/technical/${symbol}`
  );

  return response.data;
}


export async function getFinancialAnalysis(
  symbol: string
) {
  const response = await api.get(
    `/financial/${symbol}`
  );

  return response.data;
}


export async function getCompanyIntelligence(
  symbol: string
) {
  const response = await api.get(
    `/company/${symbol}`
  );

  return response.data;
}


export async function getStockNews(
  symbol: string,
  limit: number = 10
) {
  const response = await api.get(
    `/news/${symbol}`,
    {
      params: {
        limit,
      },
    }
  );

  return response.data;
}


export async function getStockSentiment(
  symbol: string,
  limit: number = 10
) {
  const response = await api.get(
    `/sentiment/${symbol}`,
    {
      params: {
        limit,
      },
    }
  );

  return response.data;
}
export async function getStockScore(
  symbol: string
) {
  const response = await api.get(
    `/analysis/score/${symbol}`
  );

  return response.data;
}
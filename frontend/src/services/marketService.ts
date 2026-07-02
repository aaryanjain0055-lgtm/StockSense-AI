import api from "./api";

export async function getQuote(symbol: string) {
  const response = await api.get(`/market/quote/${symbol}`);
  return response.data;
}

export async function getHistory(symbol: string) {
  const response = await api.get(`/historical/${symbol}?period=6mo`);
  return response.data;
}
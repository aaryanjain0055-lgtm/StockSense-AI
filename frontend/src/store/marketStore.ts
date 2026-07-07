import { create } from "zustand";

type MarketState = {
  selectedSymbol: string;
  selectedCompany: string;

  setSelectedStock: (
    symbol: string,
    company: string
  ) => void;
};

export const useMarketStore = create<MarketState>((set) => ({
  selectedSymbol: "RELIANCE.NS",

  selectedCompany: "Reliance Industries Limited",

  setSelectedStock: (symbol, company) =>
    set({
      selectedSymbol: symbol,
      selectedCompany: company,
    }),
}));
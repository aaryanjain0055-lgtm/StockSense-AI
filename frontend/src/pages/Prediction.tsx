import {
  useCallback,
  useEffect,
  useState,
} from "react";

import PageHeader from "../components/common/PageHeader";
import StockSearch from "../components/common/StockSearch";

import PredictionCard from "../components/prediction/PredictionCard";
import PredictionChart from "../components/prediction/PredictionChart";
import HistoricalAccuracy from "../components/prediction/HistoricalAccuracy";
import ModelComparison from "../components/prediction/ModelComparison";
import FeatureImportance from "../components/prediction/FeatureImportance";
import RiskAnalysis from "../components/prediction/RiskAnalysis";
import AIRecommendation from "../components/prediction/AIRecommendation";

import {
  getProductionPrediction,
  type ProductionPredictionResponse,
} from "../services/predictionService";


const DEFAULT_SYMBOL = "RELIANCE.NS";


export default function Prediction() {
  const [
    symbol,
    setSymbol,
  ] = useState(DEFAULT_SYMBOL);


  const [
    prediction,
    setPrediction,
  ] =
    useState<ProductionPredictionResponse | null>(
      null,
    );


  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null,
    );


  const loadPrediction =
    useCallback(
      async (
        selectedSymbol: string,
      ) => {
        const normalizedSymbol =
          selectedSymbol
            .trim()
            .toUpperCase();


        if (!normalizedSymbol) {
          return;
        }


        try {
          setLoading(true);

          setError(null);


          const result =
            await getProductionPrediction(
              normalizedSymbol,
            );


          setPrediction(result);

          setSymbol(
            result.symbol,
          );
        } catch (requestError) {
          console.error(
            "Prediction request failed:",
            requestError,
          );


          setPrediction(null);


          setError(
            `Unable to load production analysis for ${normalizedSymbol}.`,
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );


  useEffect(() => {
    loadPrediction(
      DEFAULT_SYMBOL,
    );
  }, [loadPrediction]);


  useEffect(() => {
    function handleGlobalSelection(
      event: Event,
    ) {
      const customEvent =
        event as CustomEvent<{
          symbol?: string;
        }>;


      const selectedSymbol =
        customEvent.detail
          ?.symbol;


      if (
        typeof selectedSymbol !==
          "string" ||
        !selectedSymbol.trim()
      ) {
        return;
      }


      loadPrediction(
        selectedSymbol,
      );
    }


    window.addEventListener(
      "stock-symbol-selected",
      handleGlobalSelection,
    );


    return () => {
      window.removeEventListener(
        "stock-symbol-selected",
        handleGlobalSelection,
      );
    };
  }, [loadPrediction]);


  function handleStockSelect(
    selectedSymbol: string,
  ) {
    loadPrediction(
      selectedSymbol,
    );
  }


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <PageHeader
        title="AI Stock Analysis"
        subtitle="Explainable multi-factor stock analysis using technical, fundamental, analyst and news sentiment factors."
      />


      <StockSearch
        onSelect={
          handleStockSelect
        }
      />


      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            padding:
              "10px 14px",
            background:
              "#111827",
            border:
              "1px solid #1e293b",
            borderRadius: 10,
          }}
        >
          <span
            style={{
              color: "#64748b",
              fontSize: 12,
              marginRight: 8,
            }}
          >
            ANALYZING
          </span>


          <strong
            style={{
              color: "#60a5fa",
              fontSize: 14,
            }}
          >
            {symbol}
          </strong>
        </div>


        {prediction && (
          <div
            style={{
              color: "#64748b",
              fontSize: 12,
            }}
          >
            Generated{" "}
            {new Date(
              prediction.generated_at,
            ).toLocaleString()}
          </div>
        )}
      </div>


      {loading && (
        <div
          style={{
            minHeight: 320,
            display: "grid",
            placeItems: "center",
            background: "#111827",
            border:
              "1px solid #1e293b",
            borderRadius: 16,
            color: "#94a3b8",
          }}
        >
          Loading production analysis for{" "}
          {symbol}...
        </div>
      )}


      {!loading &&
        error && (
          <div
            style={{
              minHeight: 240,
              display: "grid",
              placeItems:
                "center",
              padding: 24,
              background:
                "#111827",
              border:
                "1px solid #7f1d1d",
              borderRadius: 16,
              color: "#f87171",
              textAlign:
                "center",
            }}
          >
            {error}
          </div>
        )}


      {!loading &&
        !error &&
        prediction && (
          <>
            <PredictionCard
              prediction={
                prediction
              }
            />


            <PredictionChart />


            <HistoricalAccuracy />


            <ModelComparison />


            <FeatureImportance
              prediction={
                prediction
              }
            />


            <RiskAnalysis
              prediction={
                prediction
              }
            />


            <AIRecommendation
              prediction={
                prediction
              }
            />
          </>
        )}
    </div>
  );
}
import PageHeader from "../components/common/PageHeader";
import SearchBar from "../components/common/SearchBar";

import PredictionCard from "../components/prediction/PredictionCard";
import PredictionChart from "../components/prediction/PredictionChart";
import HistoricalAccuracy from "../components/prediction/HistoricalAccuracy";
import ModelComparison from "../components/prediction/ModelComparison";
import FeatureImportance from "../components/prediction/FeatureImportance";
import RiskAnalysis from "../components/prediction/RiskAnalysis";
import AIRecommendation from "../components/prediction/AIRecommendation";

export default function Prediction() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <PageHeader
        title="🤖 AI Prediction"
        subtitle="Machine Learning based stock prediction and explainable AI."
      />

      <SearchBar placeholder="Search stock for prediction..." />

      <PredictionCard />

      <PredictionChart />

      <HistoricalAccuracy />

      <ModelComparison />

      <FeatureImportance />

      <RiskAnalysis />

      <AIRecommendation />
    </div>
  );
}
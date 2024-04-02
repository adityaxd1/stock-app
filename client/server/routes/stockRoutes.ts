import { Router } from "express";
import {
  getEarningChartDataController,
  getHighChartsData,
  getInsightsController,
  getLatestStockNewsController,
  getLineChartDataController,
  getRecommendedChartDataController,
  getStockChartDataController,
  searchStockController,
  stockDetailsController,
} from "../controller/stockController";

const stockRouter = Router();

stockRouter.get("/search", searchStockController);
stockRouter.get("/details/:symbol", stockDetailsController);
stockRouter.get("/latest-news/:symbol", getLatestStockNewsController);
stockRouter.get("/highcharts/:ticker", getHighChartsData);

stockRouter.get("/stock-chart/:stockTicker", getStockChartDataController);
// Get recommended chart data for a stock
stockRouter.get("/recommended-chart/:stockTicker", getRecommendedChartDataController);

// Get earning chart data for a stock
stockRouter.get("/earning-chart/:stockTicker", getEarningChartDataController);

// Get line chart data for a stock
stockRouter.get("/line-chart/:stockTicker", getLineChartDataController);

stockRouter.get("/insights/:symbol", getInsightsController);

export default stockRouter;

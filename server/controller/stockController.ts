import { NextFunction, Request, Response } from "express";
import { errorResp, successResp } from "../lib/helper/responseBuilder";
import axios, { AxiosError } from "axios";
import API_KEYS from "../lib/config/API_KEYS";
import util from "node:util";
import dbCollections from "../lib/config/db_collections";

const API_BASE = `https://finnhub.io/api/v1`;

export async function searchStockController(req: Request, res: Response) {
  try {
    const { search } = req.query;
    if (!search)
      return errorResp(
        res,
        null,
        "Please Include 'search=text' as Query Parameter"
      );

    const data = await axios.get(
      `${API_BASE}/search?q=${search}&token=${API_KEYS.FINNHUB}`
    );

    return successResp(res, data.data);
  } catch (e) {
    return errorResp(res, (e as AxiosError).cause, (e as AxiosError).stack);
  }
}

export async function stockDetailsController(req: Request, res: Response) {
  try {
    const symbol = req.params.symbol;
    const profile = await axios.get(
      `${API_BASE}/stock/profile2?symbol=${symbol}&token=${API_KEYS.FINNHUB}`
    );
    const peers = await axios.get(
      `${API_BASE}/stock/peers?symbol=${symbol}&token=${API_KEYS.FINNHUB}`
    );
    const quote = await axios.get(
      `${API_BASE}/quote?symbol=${symbol}&token=${API_KEYS.FINNHUB}`
    );
    const is_in_wishlist = await dbCollections().WISHLIST.findOne({ symbol });

    return successResp(res, {
      profile: profile.data,
      peers: peers.data,
      quote: quote.data,
      is_in_wishlist: Boolean(is_in_wishlist),
    });
  } catch (e) {
    console.log((e as AxiosError).response);
    return errorResp(res, (e as AxiosError).response?.data);
  }
}

export async function getLatestStockNewsController(
  req: Request,
  res: Response
) {
  const padZero = (v: number) => (v >= 10 ? `${v}` : `0${v}`);
  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;

  try {
    const symbol = req.params.symbol;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    const toDate = new Date();

    const newsUrl = `${API_BASE}/company-news?symbol=${symbol}&from=${formatDate(
      fromDate
    )}&to=${formatDate(toDate)}&token=${API_KEYS.FINNHUB}`;

    const newsResponse = await axios.get(newsUrl);
    console.log("News data retrieved:", newsResponse.data);
    const newsWithImage = newsResponse.data.filter(
      (newsItem: any) => newsItem.image
    );
    const limitedNewsWithImage = newsWithImage.slice(0, 20);
    return successResp(res, { news: limitedNewsWithImage });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error status:", error.response?.status);
      console.error("Axios error data:", error.response?.data);
      return errorResp(res, {
        status: error.response?.status || 500,
        msg:
          error.response?.data?.message ||
          "Something went wrong with the API call",
        success: false,
        error: true,
      });
    } else {
      console.error(
        "Non-Axios error:",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      return errorResp(res, {
        status: 500,
        msg: "An internal server error occurred",
        success: false,
        error: true,
      });
    }
  }
}

export async function get_price_quoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { symbol } = req.params;
    const quote = await axios.get(
      `${API_BASE}/quote?symbol=${symbol}&token=${API_KEYS.FINNHUB}`
    );
    return successResp(res, quote.data);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function getHighChartsData(req: Request, res: Response) {
  try {
    const { ticker } = req.params;
    const dateToday = new Date();
    const dateTo = new Date();
    dateTo.setDate(dateToday.getDate() - 182);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${formatDate(
      dateTo
    )}/${formatDate(dateToday)}?adjusted=true&sort=asc&apiKey=${
      API_KEYS.HIGHCHARTS_API_KEY
    }`;

    const highChartsResponse = await axios.get(url);

    if (highChartsResponse.status === 200) {
      const highChartsData = highChartsResponse.data;
      return successResp(res, highChartsData);
    } else {
      return errorResp(
        res,
        { error: "Failed to fetch data from Polygon" },
        highChartsResponse.status.toString()
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error status:", error.response?.status);
      console.error("Axios error data:", error.response?.data);
      return errorResp(res, {
        status: error.response?.status || 500,
        msg:
          error.response?.data?.message ||
          "Something went wrong with the Polygon API call",
        success: false,
        error: true,
      });
    } else {
      console.error(
        "Non-Axios error:",
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      return errorResp(res, {
        status: 500,
        msg: "An internal server error occurred",
        success: false,
        error: true,
      });
    }
  }
}




export async function getRecommendedChartDataController(req: Request, res: Response) {
  try {
    const { stockTicker } = req.params;
    const url = `${API_BASE}/stock/recommendation?symbol=${stockTicker}&token=${API_KEYS.FINNHUB}`;

    const data = await axios.get(url);
    return successResp(res, data.data);
  } catch (error) {
    return errorResp(res, error);
  }
}

export async function getEarningChartDataController(req: Request, res: Response) {
  try {
    const { stockTicker } = req.params;
    const url = `${API_BASE}/stock/earnings?symbol=${stockTicker}&token=${API_KEYS.FINNHUB}`;

    const data = await axios.get(url);
    return successResp(res, data.data);
  } catch (error) {
    return errorResp(res, error);
  }
}

export async function getStockChartDataController(req:Request, res:Response) {
  try {
    const { stockTicker } = req.params;
    const toDate = new Date().toISOString().split('T')[0]; // Current date
    const fromDate = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 6 months ago

    const url = `https://api.polygon.io/v2/aggs/ticker/${stockTicker}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${API_KEYS.HIGHCHARTS_API_KEY}`;

    const data = await axios.get(url);
    return successResp(res, data.data);
  } catch (error) {
    return errorResp(res, error);
  }
}

export async function getLineChartDataController(req:Request, res:Response) {
  try {
    const { stockTicker } = req.params;
    const toDate = new Date().toISOString().split('T')[0]; // Current date
    const fromDate = new Date(Date.now() - 3*24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 24 hours ago
    const url = `https://api.polygon.io/v2/aggs/ticker/${stockTicker}/range/1/hour/${fromDate}/${toDate}?adjusted=true&sort=asc&apiKey=${API_KEYS.HIGHCHARTS_API_KEY}`;
    console.log(url)
    const data = await axios.get(url);
    return successResp(res, data.data);
  } catch (error) {
    return errorResp(res, error);
  }
}

export async function getInsightsController(req:Request, res:Response) {
  try {
    const { symbol } = req.params;
    const fromDate = '2022-01-01'; // Start date for insights

    const url = `https://finnhub.io/api/v1/stock/insider-sentiment?symbol=${symbol}&from=${fromDate}&token=${API_KEYS.FINNHUB}`;

    const response = await axios.get(url);
    return successResp(res, response.data);
  } catch (error) {
    return errorResp(res, error);
  }
}

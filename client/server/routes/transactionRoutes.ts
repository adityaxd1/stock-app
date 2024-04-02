import { Router } from "express";
import { buy_controller, sell_controller, get_wallet_balance_controller, get_portfolio_controller, get_all_transaction_history_controller, get_total_stock_quantity_controller } from "../controller/transactionController";

const transactionRouter = Router();

// Existing transaction-related APIs
transactionRouter.post("/buy", buy_controller);
transactionRouter.post("/sell", sell_controller);
transactionRouter.get("/wallet-balance", get_wallet_balance_controller);
transactionRouter.get("/portfolio", get_portfolio_controller);
transactionRouter.get("/transaction-history", get_all_transaction_history_controller);

// New API for getting total quantity of a specific stock
transactionRouter.post("/total-stock-quantity", get_total_stock_quantity_controller);

export default transactionRouter;

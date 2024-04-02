import { NextFunction, Request, Response } from "express";
import dbCollections from "../lib/config/db_collections";
import { errorResp, successResp } from "../lib/helper/responseBuilder";
import { ObjectId } from "mongodb";

// Buy API Controller
export async function buy_controller(req: Request, res: Response, next: NextFunction) {
  try {
    const { stock_id, price, units } = req.body;

    // Validate request parameters
    if (!stock_id || !price || !units) 
      return errorResp(res, null, "Please provide stock_id, price, and units.");

    // Calculate total amount
    const amount = price * units;

    // Update transaction history
    const transaction = {
      stock_id: stock_id,
      price,
      units,
      type: "BUY"
    };
    await dbCollections().TRANSACTION_HISTORY.insertOne(transaction);

    // Update wallet balance
    await dbCollections().USERS.updateOne({}, { $inc: { wallet_balance: -amount } });

    return successResp(res, { message: "Transaction successful.", amount });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

// Sell API Controller
export async function sell_controller(req: Request, res: Response, next: NextFunction) {
  try {
    const { stock_id, price, units } = req.body;

    // Validate request parameters
    if (!stock_id || !price || !units) 
      return errorResp(res, null, "Please provide stock_id, price, and units.");

    // Update transaction history
    const transaction = {
      stock_id: stock_id,
      price,
      units,
      type: "SELL"
    };
    await dbCollections().TRANSACTION_HISTORY.insertOne(transaction);

    // Update wallet balance
    await dbCollections().USERS.updateOne({}, { $inc: { wallet_balance: price * units } });

    return successResp(res, { message: "Transaction successful.", amount: price * units });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

// Get Wallet Balance API Controller
export async function get_wallet_balance_controller(req: Request, res: Response, next: NextFunction) {
  try {
    let user = await dbCollections().USERS.findOne();
    let wallet_balance = 0;

    if (!user) {
      // If user doesn't exist, create a new user entry with wallet_balance 25000
      await dbCollections().USERS.insertOne({ wallet_balance: 25000 });
      wallet_balance = 25000;
    } else {
      wallet_balance = user.wallet_balance;
    }

    return successResp(res, { wallet_balance });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

// Get Portfolio API Controller
export async function get_portfolio_controller(req: Request, res: Response, next: NextFunction) {
  try {
    const portfolio = await dbCollections().TRANSACTION_HISTORY.aggregate([
      {
        $group: {
          _id: "$stock_id",
          total_units_bought: {
            $sum: { $cond: [{ $eq: ["$type", "BUY"] }, "$units", 0] }
          },
          total_units_sold: {
            $sum: { $cond: [{ $eq: ["$type", "SELL"] }, "$units", 0] }
          },
          total_buy_amount: {
            $sum: {
              $cond: [{ $eq: ["$type", "BUY"] }, { $multiply: ["$units", "$price"] }, 0]
            }
          }
        }
      },
      {
        $project: {
          total_units: { $subtract: ["$total_units_bought", "$total_units_sold"] },
          avg_buy_price: {
            $cond: [
              { $eq: ["$total_units_bought", 0] },
              0,
              { $divide: ["$total_buy_amount", "$total_units_bought"] }
            ]
          }
        }
      },
      {
        $match: {
          total_units: { $ne: 0 } // Exclude items with total quantity of 0
        }
      }
    ]).toArray();
    return successResp(res, portfolio);
  } catch (err) {
    console.log(err);
    next(err);
  }
}



// Get All Transaction History API Controller
export async function get_all_transaction_history_controller(req: Request, res: Response, next: NextFunction) {
  try {
    const transaction_history = await dbCollections().TRANSACTION_HISTORY.find({}).toArray();
    return successResp(res, transaction_history);
  } catch (err) {
    console.log(err);
    next(err);
  }

}

export async function get_total_stock_quantity_controller(req: Request, res: Response, next: NextFunction) {
  try {
    const { stock_id } = req.body;

    // Validate request parameters
    if (!stock_id) 
      return errorResp(res, null, "Please provide stock_id.");

    // Calculate total quantity of the stock in portfolio
    const totalBought = await dbCollections().TRANSACTION_HISTORY.aggregate([
      { $match: { stock_id: stock_id, type: "BUY" } },
      { $group: { _id: "$stock_id", total_bought: { $sum: "$units" } } }
    ]).toArray();

    const totalSold = await dbCollections().TRANSACTION_HISTORY.aggregate([
      { $match: { stock_id: stock_id, type: "SELL" } },
      { $group: { _id: "$stock_id", total_sold: { $sum: "$units" } } }
    ]).toArray();

    const totalBoughtQuantity = totalBought.length > 0 ? totalBought[0].total_bought : 0;
    const totalSoldQuantity = totalSold.length > 0 ? totalSold[0].total_sold : 0;

    const totalQuantity = totalBoughtQuantity - totalSoldQuantity;

    return successResp(res, { total_quantity: totalQuantity });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

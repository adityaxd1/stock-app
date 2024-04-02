import { NextFunction, Request, Response } from "express";
import dbCollections from "../lib/config/db_collections";
import { errorResp, successResp } from "../lib/helper/responseBuilder";
import { ObjectId } from "mongodb";

export async function add_to_wishlist_controller(req: Request, res: Response, next: NextFunction) {
  try {
    const { symbol, about } = req.body;

    if (!symbol) return errorResp(res, null, "Please pass the symbol as request body");

    const if_exist = await dbCollections().WISHLIST.findOne({ symbol });
    if (if_exist) return errorResp(res, null, "This item is already exist on database");

    const inserted_result = await dbCollections().WISHLIST.insertOne({ symbol, about });
    return successResp(res, inserted_result);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function get_all_wishlist_controller(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await dbCollections().WISHLIST.find({}).toArray();
    return successResp(res, result);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function remove_one_wishlist_controller(req: Request, res: Response, next: NextFunction) {
  try {
    const { symbol } = req.params;
    console.log(req.params);
    if (!symbol) errorResp(res, null, "please send the wishlist id as request url paramater");

    const removed_result = await dbCollections().WISHLIST.deleteOne({ symbol: symbol });

    return successResp(res, { ...removed_result, symbol });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

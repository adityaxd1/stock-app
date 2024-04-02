import { Router } from "express";
import { searchStockController } from "../controller/stockController";
import { add_to_wishlist_controller, get_all_wishlist_controller, remove_one_wishlist_controller } from "../controller/wishListController";

const wishListRouter = Router();

wishListRouter.post("/add", add_to_wishlist_controller);
wishListRouter.get("/get-all", get_all_wishlist_controller);
wishListRouter.get("/get-one/:id", searchStockController);
wishListRouter.delete("/remove/:symbol", remove_one_wishlist_controller);

export default wishListRouter;

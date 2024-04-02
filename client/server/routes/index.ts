import { Express } from "express";
import stockRouter from "./stockRoutes";
import wishListRouter from "./wishlistRoutes";
import transactionRouter from "./transactionRoutes"; // Import the new transaction routes

const routesArr = [
  {
    path: "/stock",
    handler: stockRouter,
  },
  {
    path: "/wishlist",
    handler: wishListRouter,
  },
  {
    path: "/transaction", // Change the path for transaction routes
    handler: transactionRouter, // Use the transaction router for this path
  },
  {
    path: "/portfolio",
    handler: wishListRouter, // Assuming you want portfolio to use the same handler as wishlist
  },
];

export default function routes(app: Express) {
  routesArr.forEach((_route) => {
    app.use(`/api${_route.path}`, _route.handler);
  });
}

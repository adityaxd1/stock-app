export default function dbCollections() {
  if (!db) throw "Database doesn't Exist";

  return {
    WISHLIST: db.collection("wishlist"),
    PORTFOLIO: db.collection("portfolio"),
    TRANSACTION_HISTORY: db.collection("transaction_history"),
    USERS:db.collection("users"),
  };
}

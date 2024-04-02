import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
import { Db, MongoClient, ServerApiVersion } from "mongodb";

declare global {
  var mongoClient: MongoClient | undefined;
  var db: Db | undefined;
}

const APP = express();
const PORT = process.env.PORT || 8080;
const URI = `mongodb+srv://adityac:azs2Lao0vRYsyXJy@cluster0.nistlfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const URI = `mongodb+srv://adityac:y3F2i7CbtWykPnZ5@cluster0.q6hmq2a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const dbClient = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// Connecting Database;
dbClient
  .connect()
  .then((db) => {
    global.mongoClient = db;
    global.db = db.db("");
    console.log("database connected Successfully");
  })
  .catch((e) => {
    db = undefined;
    mongoClient = undefined;
    console.log(e);
  });

APP.use([cors(), express.json(), express.urlencoded({ extended: true }), morgan("dev")]);

//Connecting All Route;
routes(APP);

APP.get("/", (req, res) => {
  res.json("Hi, Server Working Perfectly");
});

APP.listen(PORT, () => console.log(`Listening... http://localhost:8080`));

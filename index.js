require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = process.env.URI;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const db = client.db("pc-builder");
    const productCollection = db.collection("product");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.findOne({ _id: new ObjectId(id) });
      // console.log(result);
      res.send(result);
    });
    app.get("/category/:category", async (req, res) => {
      const category = req.params.category;

      const formattedCategory = category.split("-").join(" ");
      // console.log(formattedCategory);
      const result = await productCollection
        .find({ category: { $regex: new RegExp(formattedCategory, "i") } })
        .toArray();
      if (result.length > 0) {
        res.json(result);
      } else {
        res
          .status(404)
          .json({ error: `No products found in the category: ${category}` });
      }
    });
    app.get("/category", async (req, res) => {
      // const formattedCategory = category.split("-").join(" ");
      // console.log(formattedCategory);
      // const result = await productCollection
      //   .find({ category: { $regex: new RegExp(formattedCategory, "i") } })
      //   .toArray();
      const result = await productCollection.distinct("category");
      if (result.length > 0) {
        res.json(result);
      } else {
        res
          .status(404)
          .json({ error: `No products found in the category: ${category}` });
      }
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// user: dbuser2
// pass: AePiAMx4t5uNW1BB

const uri =
  "mongodb+srv://pc_builder:Hh8NbTrPrUOVY5le@cluster0.yjrqbh5.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const productCollection = client.db("pc-builder").collection("product");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.findOne({ _id: new ObjectId(id) });

      res.send(result);
    });
    app.get("/category/:category", async (req, res) => {
      const category = req.params.category;

      const formattedCategory = category.split("-").join(" ");

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
    // await client.close();
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello from node mongo crud server");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

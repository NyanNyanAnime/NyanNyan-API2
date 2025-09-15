const router = require("./routes/route");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Welcome to the Anime API",
  });
});

app.use("/anime", router);


app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});

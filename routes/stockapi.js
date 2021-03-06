const router = require("express").Router();
const models = require("../models");
const moment = require("moment");
const axios = require("axios");

router.post("/api/userstocks/:username/:symbol/:amount", (req, res) => {
  if (req.params.amount > 0) {
    models.Stock.findOneAndUpdate(
      { username: req.params.username, symbol: req.params.symbol },
      { amount: req.params.amount },
      { upsert: true },
      (err, docs) => {
        if (err) {
          res.status(400).send(err.message);
        } else {
          res.json(docs);
        }
      }
    );
  }
  else {
      models.Stock.findOneAndRemove(
        { username: req.params.username, symbol: req.params.symbol },
        (err, docs) => {
            if (err) {
              res.status(400).send(err.message);
            } else {
              res.json(docs);
            }
          }
      );
  }
});

router.post("/api/balance/:username/:amount", (req, res) => {
  models.User.findOneAndUpdate(
    { email: req.params.username },
    { balance: req.params.amount },
    (err, docs) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.json(docs);
      }
    }
  );
});

router.get("/api/userstocks/:username", (req, res) => {
  models.Stock.find({ username: req.params.username }, (err, docs) => {
    if (err) {
      res.status(400).send(err.message);
    } else {
      res.json(docs);
    }
  });
});

router.get("/api/symbols", (req, res) => {
  const searchUrl =
    "https://finnhub.io/api/v1/stock/symbol?exchange=US" +
    "&token=" +
    process.env.FINN_API_KEY;

  axios.get(searchUrl).then((response) => {
    res.json(response.data);
  });
});

router.get("/api/stocks/:symbol", (req, res) => {
  const searchUrl =
    "https://finnhub.io/api/v1/quote?symbol=" +
    req.params.symbol.toUpperCase() +
    "&token=" +
    process.env.FINN_API_KEY;

  console.log(searchUrl);

  axios.get(searchUrl).then((response) => {
    res.json(response.data);
  });
});

// Get a list of all supported stock symbols
router.get("/api/stocks/", (req, res) => {
  const searchUrl =
    "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=" +
    process.env.FINN_API_KEY;

  axios.get(searchUrl).then((response) => {
    res.json(response.data);
  });
});

router.get("/api/company/:symbol", (req, res) => {
  const searchUrl =
    "https://finnhub.io/api/v1/stock/profile2?symbol=" +
    req.params.symbol.toUpperCase() +
    "&token=" +
    process.env.FINN_API_KEY;

  axios.get(searchUrl).then((response) => {
    res.json(response.data);
  });
});

router.get("/api/financials/:symbol", (req, res) => {
  const searchUrl =
    "https://finnhub.io/api/v1/stock/metric?symbol=" +
    req.params.symbol.toUpperCase() +
    "&metric=all&token=" +
    process.env.FINN_API_KEY;

  axios.get(searchUrl).then((response) => {
    res.json(response.data);
  });
});

router.get("/api/stocksnews/:symbol", (req, res) => {
  const toString = moment().format("YYYY-MM-DD");
  const fromString = moment().subtract(1, "months").format("YYYY-MM-DD");

  const searchUrl =
    "https://finnhub.io/api/v1/company-news?symbol=" +
    req.params.symbol.toUpperCase() +
    "&token=" +
    process.env.FINN_API_KEY +
    "&from=" +
    fromString +
    "&to=" +
    toString;

  axios.get(searchUrl).then((response) => {
    res.json(response.data);
  });
});

router.get("/api/candles/:symbol", (req, res) => {
  const msPerYear = 31530000000;
  const toTime = Math.floor(Date.now() / 1000);
  const fromTime = Math.floor((Date.now() - msPerYear) / 1000);

  const searchUrl =
    "https://finnhub.io/api/v1/stock/candle?resolution=1&symbol=" +
    req.params.symbol.toUpperCase() +
    "&token=" +
    process.env.FINN_API_KEY +
    "&from=" +
    fromTime +
    "&to=" +
    toTime;

  console.log(searchUrl);

  axios.get(searchUrl).then((response) => {
    res.json(response.data);
  });
});

router.get("/api/news/", (req, res) => {
  const searchUrl =
    "https://finnhub.io/api/v1/news?category=general&token=" +
    process.env.FINN_API_KEY;

  axios.get(searchUrl).then((response) => {
    res.json(response.data);
  });
});

module.exports = router;

require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const url = "https://api.petfinder.com/v2/animals";
let token = "";

const weatherKey = "f0acb6d9e0139fb20b34cb331a5c0451";
let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=46&lon=66&units=metric&appid=${weatherKey}`;

app.get("/", (req, res) => res.send("🎉"));

app.get("/test", (req, res) => {
  axios.get(weatherUrl).then((response) => {
    res.json(response.data);
  });
});

app.get("/petfinder", async (req, res) => {
  axios
    .get(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then((response) => {
      console.log("1️⃣✅");
      res.json(response.data);
    })
    .catch(function (error) {
      console.log("1️⃣❌");
      axios
        .post(
          "https://api.petfinder.com/v2/oauth2/token",
          {
            grant_type: "client_credentials",
            client_id: process.env.PETFINDER_APIKEY,
            client_secret: process.env.PETFINDER_SECRET,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => {
          console.log("2️⃣✅");
          token = response.data.access_token;

          axios
            .get(url, {
              headers: {
                Authorization: "Bearer " + token,
              },
            })
            .then((response) => {
              console.log("3️⃣✅");
              res.json(response.data);
            })
            .catch(function (error) {
              console.log("3️⃣❌");
            });
        })
        .catch(function (error) {
          console.log("2️⃣❌");
        });
    });
});

app.listen(port, () =>
  console.log(`BC PROJECT 1 SERVER is listening at http://localhost:${port}`)
);

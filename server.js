require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();
const url = "https://api.petfinder.com/v2/animals";
let token = "";

app.get("/", async (req, res) => {
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

app.listen(3000);

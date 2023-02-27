require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

let token = "";

const tokenConfig = {
  url: "https://api.petfinder.com/v2/oauth2/token",
  data: {
    grant_type: "client_credentials",
    client_id: process.env.PETFINDER_APIKEY,
    client_secret: process.env.PETFINDER_SECRET,
  },
  options: {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  },
};

const getAnimalsUrl = "https://api.petfinder.com/v2/animals";

app.get("/", (req, res) => res.send("🎉"));

app.get("/animals", async (req, res) => {
  const result = await getData();
  res.json(result);
});

app.get("/token", async (req, res) => {
  let result = await getToken();
  res.json(result);
});

const getData = async () => {
  let result;
  try {
    const response = await axios.get(getAnimalsUrl, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    result = response.data;
  } catch (error) {
    result = {
      message: "There was a problem, couldn't get animals.",
      token: token,
      error: error,
    };
  }

  return result || { message: "1️⃣ No result provided" };
};

const getToken = async () => {
  let result;
  try {
    const response = await axios.post(
      tokenConfig.url,
      tokenConfig.data,
      tokenConfig.options
    );
    result = response.data;
    token = result.access_token;
  } catch (error) {
    result = {
      message: "There was a problem refreshing the token.",
      error: error,
    };
  }

  return result.access_token || { message: "2️⃣ No result provided" };
};

app.listen(port, () =>
  console.log(`BC PROJECT 1 SERVER is listening at http://localhost:${port}`)
);

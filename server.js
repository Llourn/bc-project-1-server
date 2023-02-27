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

// app.get("/animals", async (req, res) => {
//   let result = await getAnimals();
//   res.json(result);
// });

// app.get("/token", async (req, res) => {
//   let result = await refreshToken();
//   res.json(result);
// });

app.get("/animals", async (req, res) => {
  let result = await initiateCallChain();
  res.json(result);
});

const getAnimals = async () => {
  let result;
  try {
    const response = await axios.get(getAnimalsUrl, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    result = response.data;
  } catch (error) {
    result = error;
  }

  return result || { message: "No result provided: getAnimals()" };
};

const refreshToken = async () => {
  let result;
  try {
    const response = await axios.post(
      tokenConfig.url,
      tokenConfig.data,
      tokenConfig.options
    );
    result = response;
    token = result.data.access_token;
  } catch (error) {
    result = error;
  }

  return result || { message: "No result provided: refreshToken()" };
};

const initiateCallChain = async () => {
  let result;

  result = await getAnimals();

  if (result?.code === "ERR_BAD_REQUEST") {
    result = await refreshToken();
  }

  if (result?.status !== 200) {
    return result;
  }

  result = await getAnimals();

  return result;
};

app.listen(port, () =>
  console.log(`BC PROJECT 1 SERVER is listening at http://localhost:${port}`)
);

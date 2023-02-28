require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

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

const acceptedTypes = [
  "Dog",
  "Cat",
  "Rabbit",
  "Small-Furry",
  "Horse",
  "Bird",
  "Scales-Fins-Other",
  "Barnyard",
];

let animalSearchParams = "";

let typeToSearch = "";

const getAnimalsUrl = "https://api.petfinder.com/v2/animals";

app.get("/", async (req, res) => {
  res.send("🦄");
});

app.get("/animals", async (req, res) => {
  animalSearchParams = req.originalUrl.split("?")[1];
  let result = await initiateCallChain(getAnimals);

  res.json(result);
});

app.get("/types", async (req, res) => {
  let result = await initiateCallChain(getTypes);
  res.json(result);
});

app.get("/:type/breeds", async (req, res) => {
  typeToSearch = req.params.type.toLowerCase();
  if (acceptedTypes.includes(typeToSearch)) {
    let result = await initiateCallChain(getBreeds);
    res.json(result);
  } else {
    res.json({
      message:
        typeToSearch +
        " is not a valid animal type. Please choose a valid animal type.",
    });
  }
});

const getAnimals = async () => {
  let result;
  try {
    const response = await axios.get(getAnimalsUrl + "?" + animalSearchParams, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    result = response.data;
  } catch (error) {
    result = error;
  }

  return result || { message: "No result provided: getAnimalsV2()" };
};

const getBreeds = async () => {
  let result;
  try {
    const response = await axios.get(
      `https://api.petfinder.com/v2/types/${typeToSearch}/breeds`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    result = response.data;
  } catch (error) {
    result = error;
  }

  return result || { message: "No result provided: getTypes()" };
};

const getTypes = async () => {
  let result;
  try {
    const response = await axios.get("https://api.petfinder.com/v2/types", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    result = response.data;
  } catch (error) {
    result = error;
  }

  return result || { message: "No result provided: getTypes()" };
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

const initiateCallChain = async (getData) => {
  let result;

  result = await getData();

  if (result?.code === "ERR_BAD_REQUEST") {
    result = await refreshToken();
  }

  if (result?.status !== 200) {
    return result;
  }

  result = await getData();

  return result;
};

app.listen(port, () =>
  console.log(`BC PROJECT 1 SERVER is listening at http://localhost:${port}`)
);

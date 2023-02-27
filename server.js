require("dotenv").config();
const axios = require("axios");
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const url = "https://api.petfinder.com/v2/animals";

const makeToken = (token) => {
  return `Bearer ${token}`;
};

let token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJSYXc2d1lmSTdsUEF4aHl0N1JKMzV2a25XQ1JkMVVnY2dBRDFVc2RWU0lWbnJ6b1c1RiIsImp0aSI6ImQ3YWVhM2NmYmI4MjY4ZDg3MzAyNjQ0MmJjZDExMDM0MDE0YzQ1NTExYTc0OTJkYzVjN2FkYWUwN2RiZWI2MDUyNWFiMjYwZWUxNTdkMjhlIiwiaWF0IjoxNjc3NTAwMDMyLCJuYmYiOjE2Nzc1MDAwMzIsImV4cCI6MTY3NzUwMzYzMiwic3ViIjoiIiwic2NvcGVzIjpbXX0.XisUEMbbIL68wt137G3BAJJ5xxqyToAwnCpK3973A-k8veZ_K5W1cUe5uBPDkS1vdPcp-buy3eJYRTTclVb0lsKvluynfL0pUzHIfSkP7vmY1hAXMNLueLoZexdkvTfNAr1MFWrHLUKVoGVuAPF74aSMVrxtWPzaWQ_EB-ZDdf1UK8MyvFj2iOTJ8Z14vFBK3AS00LsKf_htjttWbML8lkgBqM5WSnThV7DNHP1RvOL6y0vVbfgd6rl9F_YcdTLfO1vkizzi2HjgKt5HKBdZWOvg5fWEmciCWLHR8rqAED2hx9TEOcqI6s_l7cP0Jd4sTMSfRXUsfTGe1HzKkYb7xg";

const weatherKey = "f0acb6d9e0139fb20b34cb331a5c0451";
let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=46&lon=66&units=metric&appid=${weatherKey}`;

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

const getAnimals = {
  url: "https://api.petfinder.com/v2/animals",
  options: {
    headers: {
      Authorization: "Bearer " + token,
    },
  },
};

// Object.defineProperty(getAnimals.options.headers, "Authorization", {
//   get: function () {
//     return "Bearer " + token;
//   },
// });

app.get("/", (req, res) => res.send("🎉"));

app.get("/test", async (req, res) => {
  // const weatherResponse = await axios.get(weatherUrl);
  // res.json(weatherResponse.data);

  const data = await getData();
  res.json(data);
});

app.get("/token", async (req, res) => {
  let firstTry = await axios.get(url, {
    headers: {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJSYXc2d1lmSTdsUEF4aHl0N1JKMzV2a25XQ1JkMVVnY2dBRDFVc2RWU0lWbnJ6b1c1RiIsImp0aSI6IjNhYmU1YjQ2NDVjZDVkMWUyYWRiNDgyNTk0ZGMxMDk5MjdjMDllNjZhNWVkOWUyODVjY2JhNzE3ZGZhN2Y2ZmM0OWFjMjI2MTEzM2RhYzNjIiwiaWF0IjoxNjc3NDQzNTIwLCJuYmYiOjE2Nzc0NDM1MjAsImV4cCI6MTY3NzQ0NzEyMCwic3ViIjoiIiwic2NvcGVzIjpbXX0.SQSUODzSMsyFpCqyy25usYQeiqK9dBbntKvmOm2JUk0p1p_cMxN_F-jqR0kWUw7hBxIVqXneAZ-QVoZbvnl7B8RhHB3wShNi-kAtHkGSl6paydC7E7nxqXSqVVtVceezR8fSMYwRuVTtQoQNPdUunLBTcGBi287YISX_hc0Y2gqjKg2vRlAY5TAzVK-kZpza6_iakSHpz84UlLC7cW2cB41SGq0VPmhCn7E9gCu-qKjp2fdTRC-xcuPHS3LCJQjZ5eSZFDCL8KzSur3OT3_oQZqZgP9MvSInNcPZkACLe2CGwfQw41WTRk7R3IWq5mk8hojImRZFfmG4r5idw1f3zg",
    },
  });
  console.log(firstTry.data);

  // res.json(firstTry.data);

  res.json({
    message: "No luck",
  });
});

// YOU LEFT OFF THINKING IT WOULD BE A GOOD IDEA TO CREATE A FUNCTION CALL FOR THIS AND USE ASYNC AWAIT
// INSTEAD OF PROMISES. GIVE THAT A SHOT WHEN YOU'RE BRAIN IS LESS MUSHY https://rapidapi.com/guides/axios-async-await
const getData = async () => {
  let result;
  let newToken;
  try {
    const firstAnimalAttempt = await axios.get(getAnimals.url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    result = firstAnimalAttempt.data;
    console.log("1️⃣ ✅");
  } catch (error) {
    console.log("1️⃣ ❌");
    result = {
      message: "There was a problem 1️⃣",
      error: error,
    };
  }

  if (result?.error) {
    newToken = await getToken();
  }

  console.log(token === newToken);
  console.log(getAnimals);

  if (newToken) {
    token = newToken;
    result = await getDataAgain();
  }

  // console.log(result || "1️⃣ 🚫");
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
  } catch (error) {
    console.log("2️⃣ ❌");
    result = {
      message: "There was a problem 2️⃣",
      error: error,
    };
  }

  // console.log(result || "2️⃣ 🚫");
  return result.access_token || { message: "2️⃣ No result provided" };
};

const getDataAgain = async () => {
  let result;
  try {
    console.log(getAnimals.options.headers.Authorization);
    const response = await axios.get(getAnimals.url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    result = response.data;
    console.log("3️⃣ ✅");
  } catch (error) {
    console.log("3️⃣ ❌");
    result = {
      message: "There was a problem 3️⃣",
      error: error,
    };
  }

  // console.log(result || "3️⃣ 🚫");
  return result || { message: "3️⃣ No result provided" };
};

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

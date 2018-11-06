const http = require('http');

export default function fetchBattleResults(battleId) {
  return new Promise(function(resolve, reject) {
    http.get(
      {
        hostname: "elmaonline.net",
        port: 80,
        path: "/API/battle/" + battleId,
        agent: false // create a new agent just for this one request
      },
      res => {
        const { statusCode } = res;
        const contentType = res.headers["content-type"];

        let error;
        if (statusCode !== 200) {
          error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(
            "Invalid content-type.\n" +
              `Expected application/json but received ${contentType}`
          );
        }
        if (error) {
          console.error(error.message);
          // consume response data to free up memory
          res.resume();
          return;
        }

        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", chunk => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            const parsedData = JSON.parse(rawData);

            resolve(parsedData);
          } catch (e) {
            console.error(e.message);
          }
        });
      }
    )
  });
}
const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketMatchDetails.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

const convertToResponseData = (obj) => {
  return {
    playerId: obj.player_id,
    playerName: obj.player_name,
  };
};

const convertToResponseDataOfPlayer = (obj) => {
  return {
    playerId: obj.player_id,
    playerName: obj.player_name,
  };
};

///API 1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
      player_details`;
  const player = await db.all(getPlayersQuery);
  response.send(player.map((each) => convertToResponseData(each)));
});

//API 2

//API 2
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getStateQuery = `
    SELECT
      *
    FROM
      player_details
    WHERE
      player_id = ${playerId};`;
  const player = await db.get(getStateQuery);
  response.send(convertToResponseDataOfPlayer(player));
});

///API 3
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName } = request.body;

  const updatePlayerQuery = `
    UPDATE
      player_details
    SET
      
      player_name='${playerName}'
    WHERE
      player_id = ${playerId};`;
  const player = await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

initializeDBAndServer();
module.exports = app;

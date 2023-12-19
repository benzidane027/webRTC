let INDEX_OF = 0;
const USER_LIST = [];

setInterval(() => {
  for (user_ws of USER_LIST) {
    console.log("send %s", INDEX_OF);
    user_ws.conn.send("hello " + INDEX_OF);
  }
  INDEX_OF++;
}, 2000);

var connection = (ws) => {
  ws.on("error", console.error);
  ws.on("message", function message(data) {
    if (!USER_LIST.map((v, i) => v.id).includes(JSON.parse(data).id)) {

      USER_LIST.push({
        id: JSON.parse(data).id,
        conn: ws,
      });
      console.log("new connection has been added");
    }
    else{
      console.log("already has a connection");
    }
   // console.log("receiveeeed : %s", data);
  });
};
var close = (ws) => {
  console.log("\n******************************\n");
  console.log("users has been left");
  console.log("\n******************************\n");
};
var error = (ws) => {
  console.log("\n******************************\n");
  console.log("Error on the connection");
  console.log("\n******************************\n");
};
module.exports = { connection, close, error };

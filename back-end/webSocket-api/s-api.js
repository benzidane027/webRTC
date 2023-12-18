

var conn=function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
      console.log('receiveeeed : %s', data);
    });

    ws.send('something');
  }


  module.exports = conn



var connection=(ws)=> {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
      console.log('receiveeeed : %s', data);
    });

    ws.send('something');
  }

  var close=(ws)=> {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
      console.log('receiveeeed : %s', data);
    });

    ws.send('something');
  }
  var error=(ws)=> {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
      console.log('receiveeeed : %s', data);
    });

    ws.send('something');
  }


  module.exports = {connection}

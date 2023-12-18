var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({users: [{name: 'helow world'}]});
});
router.get("/test",(req,res)=>{
 // res.json({users: [{name: }]});

  fs.readFile(path.join(__dirname,"..","html","index.html"),(err,data)=>{
      res.writeHead(200, { 'Content-Type':  'text/html' });
      res.write(data);
      res.end();
  })

})

module.exports = router;

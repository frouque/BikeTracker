var express = require('express');
var router = express.Router();

var data = "";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../BikeTrackerReactClient/build', 'index.html'));
  // res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  console.log(req.body);
});

module.exports = router;

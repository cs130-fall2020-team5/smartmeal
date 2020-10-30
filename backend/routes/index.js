var express = require('express');
var router = express.Router();

/* placeholder */
router.get('/', function(req, res, next) {
  res.json({ message: "Success" })
  res.status(200);
});

module.exports = router;

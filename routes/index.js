var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var datetime = new Date();
	res.json({
		"message": "app work properly",
		"timestamp": datetime
	});
});

module.exports = router;

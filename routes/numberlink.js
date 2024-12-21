var express = require('express');
var router = express.Router();

/* GET numberlink page. */
router.get('/', function (req, res, next) {
    res.render('numberlink', { title: 'Numberlink' });
});

module.exports = router;

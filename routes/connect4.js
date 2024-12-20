var express = require('express');
var router = express.Router();

/* GET return to home page. */
router.get('/', function (req, res, next) {
    res.redirect('/')
});

/* GET co-op page. */
router.get('/local-coop', function (req, res, next) {
    res.render('connect-4', { title: 'Connect 4', isCoop: true });
});

/* GET ai page. */
router.get('/ai', function (req, res, next) {
    res.render('connect-4', { title: 'Connect 4', isCoop: false });
});

module.exports = router;

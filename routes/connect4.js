var express = require('express');
var router = express.Router();

/* GET return to home page. */
router.get('/', function (req, res, next) {
    res.redirect('/')
});

/* GET co-op page. */
router.get('/local-coop', function (req, res, next) {
    res.send('co-op unfinished');
});

/* GET ai page. */
router.get('/ai', function (req, res, next) {
    res.send('ai unfinished');
});

module.exports = router;

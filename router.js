var express = require('express');
var router = express.Router();

var path = require('path');
var database = require('./db');
var db = database();

/** these methods always return what tests returns */

/** get all tests */
router.get('/test', (req, res, next) => {
    return res.send(db.loadAll());
});

/** delete test with given id */
router.post('/test', (req, res, next) => {
    var test = db.delete(req.body);
    db.flush();
    return res.send(test);
});


/** create new test */
router.post('/test', (req, res, next) => {
    var test = db.save(req.body);
    db.flush();
    return res.send(test);
});

router.get('/reloaddb', (req, res, next) => {
    db.reload();
    return res.send();
});

/** route other requests to files */
router.get('*', (req, res, next) => {
    var file = req.url == '/' ? 'index.html' : req.url;
    var filePath = path.join(__dirname, 'public', file);
    //we assume the file does exist
    return res.sendFile(filePath);
});

module.exports = router;
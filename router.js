var path = require('path');
var database = require('./db');
var db = database();
var _ = require('underscore');

/** these methods always return what tests returns */

module.exports = function createRoutes(app, authMiddleware){
    if(!authMiddleware || authMiddleware === null){
        authMiddleware = function(req, res, next) {
            console.log('dummy authMiddleware')
            next();
        }
    }

    app.get('/abadmin', authMiddleware, (req, res) => {
        var filePath = path.join(__dirname, 'public', 'index.html');
        //we assume the file does exist
        return res.sendfile(filePath);
    });

    /** get all tests */
    app.get('/abadmin/test', authMiddleware, (req, res) => {
        return res.send(db.loadAll());
    });

    /** delete test with given id */
    app.post('/abadmin/test/:id', authMiddleware, (req, res) => {
        var test = db.delete({id: req.params.id});
        db.flush();
        return res.send(test);
    });


    /** create new test */
    app.post('/abadmin/test', authMiddleware, (req, res) => {
        var test = db.save(req.body);
        db.flush();

        return res.send(test);
    });

    app.get('/abadmin/reloaddb', authMiddleware, (req, res) => {
        db.reload();
        return res.send();
    });

    /** route other requests to files */
    app.get('/abadmin/*', authMiddleware, (req, res) => {
        var file = req.originalUrl.replace('/abadmin', '')
        var filePath = path.join(__dirname, 'public', file);

        //we assume the file does exist
        return res.sendfile(filePath);
    });
}
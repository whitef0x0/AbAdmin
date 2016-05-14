var _ = require('underscore');
var database = require('./db');
var db = database();

module.exports = (req, res, next) => {
    if (res.render) {
        var render = res.render;
        res.render = function(template, data, callback) {
            var changed = updateVisitedPage(req, res, template);
            var tmp = getNextTemplate(req, res, template);
            changed = changed || tmp.changed;
            if(tmp.changed){
                template = tmp.template;
            }
            if (changed) {
                db.flush();
            }

            res.render = render;
            res.render(template, data, callback);

        }
    }
    next();
}

/**
 * Update variation based on the visiting page and cookies
 */
var updateVisitedPage = (req, res, template) => {
    var test = db.getByVisitingTemplate(template);
    var changed = false;
    if (test) {
        var cookies = req.cookies;
        var cookieKey = `abadmin.${test.page.template}`;
        if (cookies && cookies[cookieKey]) {
            var cookie = cookies[cookieKey];
            var allVariations = _.union([test.page], test.variations);
            var pageRef = _.find(allVariations, (variation) => {
                return variation.template == cookie;
            });
            if (pageRef) {
                pageRef.returns++;
                changed = true;
            }
        }
    }
    return changed;
}


var getNextTemplate = (req, res, template) => {
    var test = db.getByTemplate(template);
    var newTemplate = template;
    var ret = {
        changed: false,
        template: ''
    };
    if (test) {
        //check if user has already visited this page
        //and display the same template
        var cookies = req.cookies;
        var cookieKey = `abadmin.${test.page.template}`;
        if (cookies && cookies[cookieKey]) {
            ret.template = cookies[cookieKey];
            return ret;
        }

        //user did not visit the page, 
        //find the template
        var pageRef = test.page;
        var allVariations = _.union([test.page], test.variations);
        if (test.dynamicWeight) {
            pageRef = _.max(allVariations, calculatePercentage);
        } else {
            pageRef = _.min(allVariations, calculateHits);
        }
        //db holds references and should auto update
        pageRef.hits++;
        ret.changed = true;
        ret.template = pageRef.template;

        res.cookie(cookieKey, pageRef.template, {
            maxAge: 9999999999,
            path: '/'
        });
    }
    return ret;
};


/** calculate hits based on weight */
var calculateHits = function(page) {
    return page.hits / page.weight;
}

/** calculate percentage for given page (or variation) */
var calculatePercentage = function(page) {
    if (page.hits == 0 && page.returns == 0) {
        return 101;
    }
    var hits = page.hits > 0 ? page.hits : 1;
    var returns = page.returns > 0 ? page.returns : 1;
    return returns / hits;
};
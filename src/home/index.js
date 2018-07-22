var express = require('express');
var router = express.Router();
var remoteQuery = require('./query').query;
/* router.get('/', function (req, res) {
    res.render('index', {
        title: '首页'
    })
})

router.get('/performance', function (req, res) {
    res.render('performance', {
        title: '性能对比'
    })
}) */
router.get('/query', function(req, res, next){
    var querystr = req.query.querystr;
    var isD3 = req.query.isD3;
    remoteQuery(querystr, isD3, function(result){
        res.json(result);
    });
    
})

module.exports = router;
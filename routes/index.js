var express = require('express');
var router = express.Router();
var fs = require('fs');
let path = require('path');
//const model = require('/models/model');
const root = path.join(__dirname, '/../public');
/* GET home page. */
router.get('/', function (req, res, next) {
  const path = root + '/data/articles.json';
  getArticles = () => {
    return new Promise(function (resolve) {
      fs.readFile(path, function (err, data) {
        if (err) {
          throw err;
        }
        resolve(JSON.parse(data));
      });
    });
  };
  getArticles().then((articles) => {
    res.render('index', {title: 'Blog', articles: articles});
  });

});
router.post('/', function (req, res, next) {

  res.render('index', {title: 'Blog'});
});

module.exports = router;

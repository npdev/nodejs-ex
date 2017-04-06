let router = new (require('express').Router)();
const models = require('../models');

router.get('/', (req, res, next) => {
  //Создадим новый handler который сидит по пути `/`
  models.Post.find({}).exec().then((posts) => {
    res.render('index', {
      title: 'Hello Blog',
      posts: posts
    });
    // Отправим рендер образа под именем index
  }).catch(next);
});

module.exports = router;

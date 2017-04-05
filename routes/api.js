let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/admin', (req, res, next) => {
  res.render('admin', { title: 'Admin Panel' });
});

/*
 * POST to adduser.
 */
router.post('/admin/addpost', function(req, res, next) {
    var db = req.db;
    var collection = db.get('post');
    

    console.log(req.body);
    var item = {
      title: req.body.title,
      author: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
      },
      content: req.body.content
    };

    collection.insert(item, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * GET posts list.
*/

router.get('/posts', function(req, res) {
    var db = req.db;
    var collection = db.get('post');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

router.get('/posts/:id', function(req, res) {
    var id = req.params.id;
    console.log('Retrieving post: ' + id + ' from post ');
    var db = req.db;
    var collection = db.get('post');
    collection.findOne({ _id: req.params.id},{},function(e,docs){
        res.json(docs);
    });
});

module.exports = router;

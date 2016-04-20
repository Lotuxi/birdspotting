var express = require('express');
var router = express.Router();

var Bird = require('../models/bird.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  Bird.find(function(err, birdDocs){
    if (err) { return next(err); }
    return res.render('index', { birds: birdDocs , error : req.flash('error') });
  });
});

router.post('/', function(req, res, next) {

  for (var att in req.body) {
    if (req.body[att] === '') {
      delete(req.body[att])
    }
  }
  console.log(req.body.datesSeen)
  var date = req.body.datesSeen || Date.now() ;

  req.body.datesSeen = [];
  req.body.datesSeen.push(date)


  //create new birds
  var newSighting = Bird(req.body);

  //request that is save.
  newSighting.save(function(err){
    if (err) {
      if (err.name == "ValidationError") {
        req.flash('error', 'Invalid data');
        return res.redirect('/')
      }

      if (err.code == 11000) {
        req.flash('error', 'A bird with that name already exisits')
        return res.redirect('/')
      }
      return next(err);
    }
    res.status(201);
    return res.redirect('/');
  });
});

router.post('/addDate', function(req, res, next) {

  var newSighting = req.body.datesSeen
  if (!newSighting || newSighting == '') {
    return res.redirect('/');
  }

  Bird.findOne( {name : req.body.name }, function( err, bird) {
    if (err) { return next(err) }
    if (!bird) { return next(new Error('No bird found with name ' + req.body.name))}

    bird.datesSeen.push(newSighting);

    bird.save(function(err) {
      if (err) { return next(err); }
      res.redirect('/')
    });
  });
});

router.post('/deleteBird', function(err, bird) {

  var deleteBird = function(err, birdDocs) {
    birdDocs.collection('restaurants').deleteMany(
        { "bird": bird },
        function(err) {
          console.log("removed bird " +bird);
          callback();
        }
    );
  };
});

module.exports = router;

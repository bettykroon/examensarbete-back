var express = require('express');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.app.locals.db.collection("inventory").find({visible: true}).toArray()
  .then(result => {
    res.json(result);
  })
});

router.get('/notAvailable', function(req, res, next) {
  req.app.locals.db.collection("inventory").find({visible: false}).toArray()
  .then(result => {
    res.json(result);
  })
});

router.get('/:cocktail', function(req, res, next) {
  if(req.params.cocktail === "cocktailkombo") {
    req.app.locals.db.collection("inventory").findOne({category: req.params.cocktail})
    .then(result => {
      res.json(result);
    })
  }
  else {
    req.app.locals.db.collection("inventory").findOne({drinkName: req.params.cocktail})
    .then(result => {
      res.json(result);
    })
  }
});

router.put('/remove', (req, res) => {
  req.app.locals.db.collection("inventory").updateOne(
    {_id: ObjectId(req.body.id)},
    {$set: {visible: false}}
  )
})

router.put('/update', (req, res) => {
  req.app.locals.db.collection("inventory").updateOne(
    {_id: ObjectId(req.body._id)},
    {$set: {
      drinkName: req.body.drinkName, 
      category: req.body.category, 
      inStock: req.body.inStock, 
      quantity: req.body.quantity, 
      visible: req.body.visible,
      price: req.body.price,
      description: req.body.description
    }}
  )
})

module.exports = router;

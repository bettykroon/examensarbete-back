var express = require('express');
var router = express.Router();
var CryptoJS = require('crypto-js');

/* GET users listing. */
router.post('/', (req,res) => {
    req.app.locals.db.collection("admin").findOne({username: req.body.username})
    .then(result => {
        if(result) {
            let psw = CryptoJS.AES.decrypt(result.password, "saltkey").toString(CryptoJS.enc.Utf8);
        
            if(req.body.password === psw){
                res.json(result._id)
            } else {
                res.json("wrong")
            }
        } else {
            res.json("wrong")
        }
    })
})

module.exports = router;
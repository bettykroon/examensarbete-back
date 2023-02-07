var express = require('express');
var router = express.Router();
var CryptoJS = require('crypto-js');
var multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
});
  
const upload = multer({ storage });

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

router.post('/addImage', upload.single('image'), (req, res) => {
    const file = req.file;
    console.log(file.filename + " was saved to disk.");

    res.send({
        success: true,
        message: "File uploaded successfully"
    });
})

module.exports = router;
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config({path: './secret.env'});
const cors = require('cors');
const PORT = 3030;

var indexRouter = require('./routes/index');
var inventoryRouter = require('./routes/inventory');
var klarnaRouter = require('./routes/klarna');
var adminRouter = require('./routes/admin');

var app = express();
app.use(cors({origin: true})); 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/inventory', inventoryRouter);
app.use('/klarna', klarnaRouter);
app.use('/admin', adminRouter);

app.use('/uploads', express.static('uploads'));

const MongoClient = require('mongodb').MongoClient;

const url = process.env.DB_URL;

MongoClient.connect(url, {
    useUnifiedTopology: true
})
.then(client => {
    console.log("UPPKOPPLAD!!!");

    const db = client.db(process.env.DB);
    app.locals.db = db;
})

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
  });

module.exports = app;

var path = require("path")
var express = require("express")
var logger = require("morgan")
var bodyParser = require("body-parser") // simplifies access to request body
var firebase = require('firebase')
var app = express()
const session = require('express-session');
const FirebaseStore = require('connect-session-firebase')(session);

app.set("views", path.resolve(__dirname, "views")) // path to views
app.set("view engine", "ejs")
app.locals.message = ""
// 3 set up an http request logger to log every request automagically
app.use(logger("dev"))     // app.use() establishes middleware functions
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/assets'))



firebase.initializeApp({
    apiKey: "AIzaSyCK-3hPn60PbTsGJb-uNUwdZtF22ew3LpY",
    authDomain: "northwest-library.firebaseapp.com",
    databaseURL: "https://northwest-library.firebaseio.com/"
})

var ref = firebase.database().ref('node-client');

app
    .use(session({
        store: new FirebaseStore({
            database: ref.database
        }),
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true
    }));


const routes = require('./routes/index.js')
app.use('/',routes)


app.listen(8080,() => {
    console.log("Listening on 8080")
})
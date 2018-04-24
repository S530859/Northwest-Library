var path = require("path")
var express = require("express")
var logger = require("morgan")
var bodyParser = require("body-parser") // simplifies access to request body
var firebase = require('firebase')
var app = express.Router()
const session = require('express-session');
const FirebaseStore = require('connect-session-firebase')(session);

app.get('/', (req,res) => {
    var ref = firebase.database().ref('node-client/Books')
    ref.once("value", (data) => {
        res.render('Admin/books', {
            user: firebase.auth().currentUser.displayName,
            books: data.val()
        })
    })
})


app.get('/books', (req,res) => {
    var ref = firebase.database().ref('node-client/Books')
    ref.once("value", (data) => {
        res.render('Admin/books', {
            user: firebase.auth().currentUser.displayName,
            books: data.val()
        })
    })
    
})

app.get('/addBook', (req,res) => {
    res.render('Admin/addBook', {
        user: firebase.auth().currentUser.displayName
    })
})



app.get('/userReq', (req,res) => {
    res.render('Admin/userReq', {
        user: firebase.auth().currentUser.displayName
    })
})

var multer = require('multer')
var upload = multer({dest:'./uploads/'});

app.post('/addBook',upload.single('file'),(req,res) => {
   var key =  firebase.database().ref('node-client/Books').push().key
   firebase.database().ref('node-client/Books').child(key).set({
       title: req.body.title,
       published: req.body.published,
       author: req.body.author,
       image: req.body.url
   })
   res.redirect('books')
   
})



module.exports = app
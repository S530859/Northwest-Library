var path = require("path")
var express = require("express")
var logger = require("morgan")
var bodyParser = require("body-parser") // simplifies access to request body
var firebase = require('firebase')
var app = express.Router()
const session = require('express-session');
const FirebaseStore = require('connect-session-firebase')(session);



app.get('/', (req,res) => {
    // res.render('User/all', {
    //     user: req.session.user.displayName
    // })
   // firebase.auth().currentUser
    res.redirect('allBooks')
})

app.get('/allBooks', (req,res) => {
    var ref = firebase.database().ref('node-client/Books')
    ref.once("value", (data) => {
        res.render('User/allBooks', {
            user: firebase.auth().currentUser,
            books: data.val()
        })
    })
})

app.get('/about', (req,res) => {
    res.render('User/about', {
        user: firebase.auth().currentUser.displayName

    })
})

app.get('/contact', (req,res) => {
    res.render('User/contact', {
        user: firebase.auth().currentUser.displayName

    })
})

app.get('/edit', (req,res) => {
    res.render('User/edit', {
        user: firebase.auth().currentUser.displayName
    })
})

app.post('/edit',(req,res) => {
    firebase.auth().currentUser.updateProfile({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        displayName: `${req.body.lastname}  ${req.body.firstname}`
    }).then(() => {
        res.render('User/edit', {
            user: firebase.auth().currentUser.displayName
        })
    })


})
app.get('/myBooks', (req,res) => {
    var ref = firebase.database().ref('node-client/roles/'+ firebase.auth().currentUser.uid +'/books')
    ref.once("value", (data) => {

        var ref1 = firebase.database().ref('node-client/Books')
           ref1.once('value',(data1) => {       
               res.render('User/myBooks', {
                user: firebase.auth().currentUser,
                userBooks: data.val(),
                Books: data1.val() 
            })

           })
       
    })
})



module.exports = app



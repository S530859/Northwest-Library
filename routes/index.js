var path = require("path")
var express = require("express")
var logger = require("morgan")
var bodyParser = require("body-parser") // simplifies access to request body
var firebase = require('firebase')
var app = express()
const session = require('express-session');
const FirebaseStore = require('connect-session-firebase')(session);
const router = express.Router()

var ref = firebase.database().ref('node-client');

var selfRef= ref.child("roles");
// var key = selfRef.push().key;

router.get('/',(req,res) => {
      
    if(req.session.user){
        res.render('home',{
            user: req.session.user.displayName
        })
    }else{
       res.render('cover')
    }

})

router.get('/login', (req,res) => {
    res.render('login')
})


router.post('/register', (req,res) => {
 firebase.auth().createUserWithEmailAndPassword(req.body.email,req.body.passwd)
    .then((user)=> {
                // console.log(user)
                 user.updateProfile({
                             displayName: `${req.body.lastname}  ${req.body.firstname}`,
                             
                                 })
                selfRef.child(user.uid).set({
                    isAdmin: false
                })

                              
        })
        .catch((err) => {
            console.log(err)
            })
    
        res.redirect('/login')

})

router.post('/login', (req, res) => {
        firebase.auth().signInWithEmailAndPassword(req.body.username, req.body.password)
            .then((success) => {
                

                let user = firebase.auth().currentUser;
                let isAdmin = false;
                let userRole = ref.child(`roles/${user.uid}`)
                userRole.once('value').then((snapshot) => {
                   isAdmin = snapshot.val().isAdmin
                   if(isAdmin){
                    res.redirect('/admin/')
                  
        
                    }else {
        
                       res.redirect('/user/')
                         
                    }
                })
                req.session.user = user
                
                if(req.body.remember){
                    req.session.cookie.expires = false
                }
               
                    
           

            })
            .catch((err) => {
                console.log(err)
            })             
})

router.get('/logout', (req,res) => {
        firebase.auth().signOut()
        req.session.destroy()
        res.redirect('/')
})
router.use('/user',require('../controllers/UserController.js'))
router.use('/admin',require('../controllers/AdminController.js'))
module.exports = router
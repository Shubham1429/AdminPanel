const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const passport = require('passport');
 
const User = require('../models/user');
const Uploads = require('../models/Upload');    
const { ensureAuthenticated } = require('../config/auth');
    
    
//Routing Before Login//

//Routing Handle Get Request
app.get('/', function(req, res, next) {  res.render('index', { title: 'Express' });});
app.get('/index', function(req, res, next) {  res.render('index', { title: 'Express' });});
app.get('/about', (req, res, next) => {  res.render('about', { title: 'Express' });});
app.get('/blog_single', (req, res, next) =>{ res.render('blog_single', { title: 'Express'});});
app.get('/blog', (req, res, next) =>{ res.render('blog', { title: 'Express'});});
app.get('/contact', (req, res, next) =>{ res.render('contact', { title: 'Express'});});
app.get('/Login',   (req, res, next) =>{ res.render('Login', { title: 'Express'});});
app.get('/project', (req, res, next) =>{ res.render('project', { title: 'Express'});});
app.get('/services', (req, res, next) =>{ res.render('services', { title: 'Express'});});
app.get('/register', (req, res, next) =>{ res.render('register', { title: 'Express'});});

app.get('/logout',ensureAuthenticated, (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are Logged out');
    res.redirect('/login');
})

app.get('/edit-profile', ensureAuthenticated, function(req, res) {
    res.render('edit-profile', {
        name : req.user.name // get the user out of session and pass to template
    });
});

/* Product Upload*/

app.get('/mentor',function(req,res){
    //product table
   
    Uploads.find(function(err,data){
        if(err){
            console.log(err)
        }
        else {
            
            console.log('Data is coming');
            console.log(data)
            res.render('mentor',{ records:data });
            console.log('upload successfull')
        }
    
    })
})

//-----------------------//

//Register Handle
app.post('/register', (req, res) =>{
    const { name, email, password, password2 } = req.body;
    let errors = [];
    
    //Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg:'Please fill in all Fields'});
    }

    //Check password match
    if(password !== password2) {
        errors.push({ msg: 'Password do not match'});
    }

    //Check Password Length
    if(password.length < 6){
        errors.push({ msg: 'Password should be atleast 6 Characters'});
    }

    if(errors.length > 0){   
        res.render('register', {
           errors,
           name,
           email,
           password,
           password2
        });
    }
    else{
        //Vali dation Pass
       
        User.findOne({ email: email}) 
        .then(users => {
            if(users) {
                //User Exists
                errors.push({ msg: 'Email is already registered'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                 });
            }
            else {
                const newUser = new User({
                    name,
                    email,
                    password
                });
                
                //Hash Password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) 
                            throw err;
                        // Set password to hash
                        newUser.password = hash;

                        //Save user
                        newUser.save()
                            .then(users => {
                                req.flash('success_msg', 'You are now registered and can Login');
                                res.redirect('login');
                                
                            })
                            .catch(err => console.log(err));
                }))
               
            }
        
        });

          
    }
});

// ---------------------facebook -------------------------------
    
// send to facebook to do the authentication
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/edit-profile',
            failureRedirect : '/'
        }));

    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { 
        scope : ['public_profile', 'email']
    }));
  
      // handle the callback after facebook has authenticated the user
      app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/edit-profile',
            failureRedirect : '/'
        })); // route for facebook authentication and login
 
        app.get('/connect/facebook', passport.authorize('facebook', { 
            scope : ['public_profile', 'email'] 
        }));
      
          // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/edit-profile',
                failureRedirect : '/'
            }));
              
        app.get('/unlink/facebook', function(req, res) {
            var user            = req.user;
            user.facebook.token = undefined;
            user.save(function(err) {
            res.redirect('/dashboard');
            });
        });


//-----------Login Handle-------------//

app.post('/login',  (req, res, next) =>{
    passport.authenticate('local', {
        successRedirect: '/edit-profile',
        failureRedirect: 'login',
        failureFlash: true
    })(req, res, next);
});

module.exports = app;
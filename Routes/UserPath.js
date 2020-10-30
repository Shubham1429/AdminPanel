var express = require('express');

var app = express();
 
const User = require('../models/user');
const Uploads = require('../models/Upload');
//const bcrypt = require('bcryptjs');
const { ensureAuthenticated } = require('../config/auth');


//------Routing After Login------------//
//Get Request Handle

app.get('/logout',ensureAuthenticated, (req, res) => {
    //req.logOut();
    req.flash('success_msg', 'You are Logged out');
    res.redirect('/login');
})

app.get('/index', ensureAuthenticated, function(req, res) {
    res.render('./AfterLogin/index1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/about', ensureAuthenticated, function(req, res) {
    res.render('./AfterLogin/about1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/blog-single', ensureAuthenticated, function(req, res) {
    res.render('./AfterLogin/blog-single1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/blog', ensureAuthenticated, function(req, res) {
    res.render('./AfterLogin/blog1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/contact', ensureAuthenticated, function(req, res) {
    res.render('./AfterLogin/contact1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/mentor', ensureAuthenticated, function(req, res) {

        name = req.user.name;
        //product table
       
        Uploads.find(function(err,data){
            if(err){
                console.log(err)
            }
            else {
                
                console.log('Data is coming');
                console.log(data)
                res.render('./AfterLogin/mentor1',{ records:data, name : req.user.name });
                console.log('upload successfull')
            }
        
        })
    })
    // res.render('mentor1', {
    //     name : req.user.name // get the user out of session and pass to template
    // });


app.get('/services', ensureAuthenticated, function(req, res) {
    res.render('./AfterLogin/services1', {
        name : req.user.name // get the user out of session and pass to template
    });
});

app.get('/project', ensureAuthenticated, function(req, res) {
    res.render('./AfterLogin/project1', {
        name : req.user.name // get the user out of session and pass to template
    });
});




module.exports = app;
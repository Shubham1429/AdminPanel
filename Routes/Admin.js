const express = require('express');
const app = express();

    
const Uploads = require('../models/Upload');
    

    
var upmod = Uploads.find({});


//---------Uploading Config------//
var multer = require('multer');
DIR = './Public/Upload/'
const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,DIR)
    },
    filename: function(req,file,cb) {
        cb(null,file.fieldname + "-" + Date.now()+ "-"+ file.originalname)
    }
}) 
const upload = multer({
    storage: storage
}).single('file');
//-----------------------//

app.get('/', function(req, res, next) {
    upmod.exec(function(err,data){
  if(err) throw err;
  res.render('./Admin/admin', { title: 'Mentor Details', records:data, success:'' });
    });
    
  });
        
app.post('/adminsub', upload, function(req, res, next) {
    var mentDetail = new Uploads({
      name: req.body.name,
      position: req.body.position,
      image:"Upload/" + res.req.file.filename,
    });
  
    mentDetail.save(function(err,req1){
      if(err) throw err;
      upmod.exec(function(err,data){
        if(err) throw err;
        else{
            req.flash('success_msg', 'Data Uploaded');
            res.render('./Admin/admin', { title: 'Employee Records', records:data});
            }
        });
        })  
    });

app.get('/edit', function(req, res, next) {
    //var id=req.params.id;
    var edit= Uploads.find(req.body.id);
    edit.exec(function(err,data){
    if(err) throw err;
    res.render('./Admin/edit', { title: 'Edit Record', records:data });
    });    
});

app.post('/update', upload,function(req, res, next) {
 
    if(req.file){
        var dataRecords={
            name: req.body.name,
            position: req.body.position,
            image:"Upload/" + res.req.file.filename,
        }
    }
    else{
        var dataRecords={
            name: req.body.name,
            position: req.body.position,
            
        }
    }
    var update= Uploads.findOneAndUpdate(req.body.id, dataRecords);
    update.exec(function(err,data){
        if(err) 
            throw err;
    upmod.exec(function(err,data){
        if(err) 
            throw err;
        res.redirect("./Admin/admin");  });
    });
});

app.get('/delete', function(req, res, next) {
    //var id=req.params.id;
    var del= Uploads.findOneAndDelete(req.body.id);
    
    del.exec(function(err){
        if(err) 
            throw err;
    upmod.exec(function(err,data){
        if(err) 
            throw err;
        else{
            req.flash('success_msg', 'Data Deleted');
            res.render('./Admin/admin', { title: 'Employee Records', records:data});
            }
        });
    });  
});

module.exports = app;
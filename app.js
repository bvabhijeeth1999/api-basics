const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true});

//creating schema for articles.
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

//creating model.
const Article = mongoose.model("Article",articleSchema);

app.get("/articles",function(req,res){
  Article.find({},function(err,results){
    if(!err){
      res.send(results);
    }
    else{
      res.send(err);
    }
  });
});

app.post("/articles",function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
      if(err){
        res.send(err);
      }
      else{
        res.send("successfully saved the article to the database!!");
      }
  });
});

app.delete("/articles",function(req,res){
  Article.deleteMany({},function(err){
    if(!err){
      res.send("successfully deleted all articles");
    }
    else{
      res.send(err);
    }
  });
});

app.get("/articles/:title",function(req,res){
  Article.findOne({title: req.params.title},function(err,results){
    if(results){
      res.send(results);
    }
    else{
      res.sendStatus(404);
    }
  });
});

app.put("/articles/:title",function(req,res){
  Article.update({title: req.params.title},{title: req.body.title,content: req.body.content},{overwrite: true},function(err){
    if(!err){
      res.send("successfully updated article");
    }
    else{
      res.send(err);
    }
  });
});




app.listen(3000,function(){
  console.log("Server is running on port 3000");
});

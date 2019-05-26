const express = require('express');
const router = express.Router();
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');

//bring in models
let Article = require('../models/article');


//load edit single article
router.get('/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
     res.render('edit_article', {
       title:'Edit Article',
       article:article
     });
  });
});

// add route
router.get('/add', function(req, res)
{
  res.render('add_article', {
    title: 'Add article'
  });
});

//add submit post route
router.post('/add', function(req, res){
  req.checkBody('title', 'Title is required field!').notEmpty();
  req.checkBody('author', 'Author is required field!').notEmpty();
  req.checkBody('body', 'Body is required field!').notEmpty();

  let errors = req.validationErrors();
  if(errors){
    res.render('add_article', {
      title:'Add Article',
      errors:errors
    });
  }
  else{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      }
      else{
        req.flash('success', 'Article Added');
        res.redirect('/');
      }
    });
  }



});

//update article
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }
    else{
      req.flash('warning' , 'Article Edited');
      res.redirect('/');
    }
  });
});

router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err)
    {
      console.log(err);
    }
    res.send('Success');
  });
});

//get single article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
     res.render('article', {
       article:article
     });
  });
});

module.exports = router;

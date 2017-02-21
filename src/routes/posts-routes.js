const express = require('express');

const {PORT, DATABASE_URL} = require('../config');
const {Posts} = require('../models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blog-posts');

router.get('/:id', (req, res) => {
	Posts.findById(req.params.id).exec().then(post => res.json(post.apiRepr()))
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error'})
    });
});

router.get('/', (req, res) => {
	Posts.find().exec().then(posts => {
		console.log(posts);
		res.json({
			posts: posts.map(
				(post) => post.apiRepr())
		});
	})
	.catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i < requiredFields.length; i++) {
		if(!(requiredFields[i] in req.body)) {
			const msg = `Missing ${field} in request body`;
			console.log(msg);
			return res.satus(400).send(msg);
		}
	}
	Posts.create({
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		created: req.body.created})
		.then(post => res.status(201).json(post.apiRepr()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal serve error'});
    });
});

router.delete('/:id', (req, res) => {
	Posts.findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
		console.log(`Deleting blogpost ${req.params.id}`);
		res.status(204).end();
	})
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.put('/:id', jsonParser, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message = (
		`Request path id (${req.params.id}) and request body id ` +
		`(${req.body.id}) must match`);
		console.error(message);
		res.status(400).json({message: message});
  }
  const toUpdate = {};
  const updateableFields = ['title', 'content', 'author'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Posts
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .exec()
    .then(post => {
		console.log(`Updating blog post ${req.params.id}`);
		res.status(204).end();
	})
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;
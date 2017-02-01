const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router();
const {BlogPosts} = require('../models/index');
//seed some data
const createPosts = require('../seed/createPosts')();

router.get('/', (req, res) => {
	res.json(BlogPosts.get()); 
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for (let i=0; i < requiredFields.length; i++) {
		if(!(requiredFields[i] in req.body)) {
			const msg = `Missing ${field} in request body`;
			console.log(msg);
			return res.satus(400).send(msg);
		}
	}
	const blogPost = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(blogPost);
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleting blogpost ${req.params.id}`);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate', 'id'];
	for (let i=0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if(!(field in req.body)) {
			const msg = `Missing ${field} in request body`;
			console.log(msg);
			return res.status(400).send(msg);
		}
	}
	if (req.params.id !== req.body.id) {
		const msg = `Request path id (${req.params.id}) and 
		request body id (${req.body.id}) must match`;
		console.error(msg);
		return res.status(400).send(msg);
	}
	console.log(`Updating shopping list item ${req.params.id}`);
	const updatedItem = BlogPosts.update({
		id: req.params.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: (req.body.publishDate || Date.now())
	});
	res.status(204).json(updatedItem);
});

module.exports = router;
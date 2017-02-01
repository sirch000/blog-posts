const {BlogPosts} = require('../models/index');

module.exports = function createPosts() {
    BlogPosts.create('JavaScript and You', 'text1', 'blake sager', null);
    BlogPosts.create('Assembly for Dummies', 'text2', 'blake sager', null);
    BlogPosts.create('Who moved my trackpad?', 'text3', 'blake sager', null);
}

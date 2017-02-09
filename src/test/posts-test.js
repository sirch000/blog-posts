const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();

chai.use(chaiHttp);


describe('Blog Posts', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list blog posts on GET', function() {
    return chai.request(app)
      .get('/posts')
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.at.least(1);

        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        });
      });
  });

  it('should add a blog post on POST', function() {
    const newPost = {title: 'today', content: 'blah blah blah blah blah', author: 'Franky Frank', publishDate: 1485909234602};
    return chai.request(app)
      .post('/posts')
      .send(newPost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'title', 'content');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id}));
      });
  });

  it('should update blog post on PUT', function() {
    const updateData = {
      title: 'today',
      author: 'Stevey Steve',
      content: 'blah blah blah blah blah',
      publishDate: 1485909234602
    };

    return chai.request(app)
      .get('/posts')
      .then(function(res) {
          //console.log(res.body);
        updateData.id = res.body[3].id;
        console.log('ID', updateData.id);
        return chai.request(app)
          .put(`/posts/${updateData.id}`)
          .send(updateData);
          console.log(updateData);
      })
      .then(function(res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal(updateData);
      });
  });

  it('should delete items on DELETE', function() {
    return chai.request(app)
      .get('/posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/posts/${res.body[0].id}`);
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});
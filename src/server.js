const express = require('express');
const morgan = require('morgan');
const blogPostRouter = require('./routes/index');

const app = express();

app.use(morgan('common'));

app.use('/posts', blogPostRouter);

app.listen(process.env.PORT || 8081, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8081}`);
});
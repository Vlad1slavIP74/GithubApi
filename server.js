const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./router/api/find');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('json spaces', 3);

const db = require('./mongoose/config').mongoURI;

mongoose
  .connect(db)
  .then(() => console.log('Connected'))
  .catch(err => console.log(err));



app.use('/api/users', users);

const server = app.listen(3001, (error) => {
  if (error) return console.log(err);
  console.log('OK server run on port 3001');
});

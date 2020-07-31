const express = require('express');
const cors = require('cors');
// Morgan: Logger
const morgan = require('morgan');
// Helmet: Basic Security
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to URL shortener',
  });
})

app.get('/:id', (req, res) => {
  // TODO: redirect to url
});

app.get('/url/:id', (req, res) => {
  //TODO: retrieve information of url
});

app.post('/url', (req, res) => {
  // TODO: create a short url
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
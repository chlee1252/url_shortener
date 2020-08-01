const express = require('express');
const cors = require('cors');
// Morgan: Logger
const morgan = require('morgan');
// Helmet: Basic Security
const helmet = require('helmet');
// Yup: Create Schema Validation
const yup = require('yup');
const monk = require('monk');
const { nanoid } = require('nanoid'); 

require('dotenv').config();

const db = monk(process.env.MONGO_URI);
const urls = db.get('urls');
urls.createIndex({ alias: 1 }, { unique: true })
// urls.createIndex('name');
 
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

app.get('/:id', async (req, res, next) => {
  const { id: alias } = req.params;
  try {
    const url = await urls.findOne({ alias });
    if (url) {
      res.redirect(url.url);
    }
    res.redirect(`/?error=${alias} not found`);
  } catch (err) {
    res.redirect('/?error=Link not found');
    // next(err);
  }
});

// app.get('/url/:id', (req, res) => {
//   //TODO: retrieve information of url
// });

const schema = yup.object().shape({
  alias: yup.string().trim().matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

app.post('/url', async (req, res, next) => {
  let { alias, url } = req.body;
  try {
    await schema.validate({
      alias,
      url,
    });
    if (!alias) { 
      alias = nanoid(5); 
    } 

    alias = alias.toLowerCase();
    const newURL = {
      url,
      alias,
    }
    const created = await urls.insert(newURL);
    res.json(created);
  } catch (err) {
    if (err.message.startsWith('E11000')) {
      err.message = 'Alias in use.';
    }
    next(err);
  }
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message:error.message,
    stack: process.env.NODE_ENV == 'production' ? '❌' : error.stack,
  })
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
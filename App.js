// RUN PACKAGES
const config = require('./config.json');

const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');

// SETUP APP
const app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/public'));



//MULTER CONFIG: to get file photos to temp server storage
const multerConfig = {

  //specify diskStorage (another option is memory)
  storage: multer.diskStorage({

    //specify destination
    destination: function (req, file, next) {
      next(null, `./public/${config.IMAGE_FOLDER}`);
    },

    //specify the filename to be unique
    filename: function (req, file, next) {
      console.log(file);
      //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
      const ext = file.mimetype.split('/')[1];
      //set the file fieldname to a unique name containing the original name, current datetime and the extension.
      next(null, Math.random().toString(36).substring(3) + '.' + ext);
    }
  }),

  // filter out and prevent non-image files.
  fileFilter: function (req, file, next) {

    if (!file) {
      next();
    }

    // only permit image mimetypes
    const image = file.mimetype.startsWith('image/');
    if (image) {
      next(null, true);
    } else {
      //TODO:  A better message response to user on failure.
      return next();
    }
  }
};


/* ROUTES
 **********/


// Add headers
app.use(function (req, res, next) {
  console.log(req.headers.api_key)
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'api_key');

  if (req.headers.api_key === config.API_KEY) {
    next();
  } else {
    res.end('WRONG KEY')
  }
});


app.get('/', function (req, res) {
  res.render('index.html');
})

app.post(config.API_VERSION + '/newCat',
  multer(multerConfig).single('photo'),
  function (req, res) {
    res.send({
      url: `https://fkn.cat/${config.IMAGE_FOLDER}/${req.file.filename}`,
    });
  }
)

app.post(config.API_VERSION + '/killCat',
  function (req, res) {
    console.log(req.headers.kill_cat);
    fs.unlink(`./public/${config.IMAGE_FOLDER}/${req.headers.kill_cat}`, function (err) {
      if (err) {
        res.send(err)
      } else {
        res.send(`Killed Cat ${req.headers.kill_cat}`);
      }
    })
  }
)

app.get(config.API_VERSION + '/listCats',
  function (req, res) {
    let images = [];
    fs.readdir(`./public/${config.IMAGE_FOLDER}`, (err, files) => {
      files.forEach(file => {
        images.push(file);
      });
      res.send(images);
    })
  }
)

app.get(config.API_VERSION + '/recentCat',
  function (req, res) {
    let images = [];
    fs.readdir(`./public/${config.IMAGE_FOLDER}`, (err, files) => {
      files.forEach(file => {
        images.push(file);
      });
      res.send(images);
    })
  }
)

app.get('/:cat',
  function (req, res) {
    let images = [];
    fs.readdir(`./public/${config.IMAGE_FOLDER}`, (err, files) => {
      files.forEach(file => {
        images.push(file);
      });
      res.send(images);
    })
  }
)

// RUN SERVER
app.listen(config.APP_PORT, function () {
  console.log(`Server listening on port ${config.APP_PORT}`);
});

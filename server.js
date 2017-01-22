const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

// set up support for partials
hbs.registerPartials(__dirname + '/views/partials');

// set up handlebars
app.set('view engine', 'hbs');

// maintenance middleware
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// set up middleware to host public files
app.use(express.static(__dirname + '/public'));

// create our own middleware
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// register a helper for hbs to get the current year
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
})

// register another helper
hbs.registerHelper('scareamIt', (text) => {
    return text.toUpperCase();
});


// set up route handlers
app.get('/', (req, res) => {
  // res.send('<h1>Hello Express!</h1>');
  // res.send({
  //   name: 'Mukul',
  //   likes: [
  //     'football',
  //     'car'
  //   ]
  // });
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website',
  });
});

app.get('/about', (req,res) => {
  // res.send('About page');
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req,res) => {
  res.send({
    erroMessage: 'Unable to handle request'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects page'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

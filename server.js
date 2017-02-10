const http = require('http');
const pjsonLoader = require('pjson-loader');
const express = require('express');
const bundler = require('./server/bundler.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const opensesameProfile = require('opensesame-profile');


const app = express();
const server = http.createServer(app);

// Use cors when in the test environment.
// Run with: NODE_ENV=test npm start.
if (app.get('env') === 'test') {
    console.log('in test env');
    app.use(cors({
        origin: true,
        credentials: true,
        preflightContinue: true
    }));
}


//Check out the documentation and examples here https://github.com/EikosPartners/opensesame-profile
//you can give opensesame-profile an express app object
opensesameProfile({
   secret: 'testSecret',
   middleware: function (req, res, next) {
       // Can do route authorization here.
       next();
   },
   httpsOnly: false
}, app);


app.use(express.static('public'));
app.use(bodyParser.json());

// pjson setup.
pjsonLoader.load(app, {
    jsonTransform: (req, res, data) => {
        // Transform data before return:
        return data;
    }
}, (err) => {
    if (err) {
        console.log(err);
    }
});

bundler(app);

/* GET home page. */
app.get('/', (req, res, next) => {
    res.sendFile('index.html', { root: 'public' });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Listening on %j...', server.address());
});

module.exports = app;
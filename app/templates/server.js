const http = require('http');
const pjsonLoader = require('pjson-loader');
const express = require('express');
const bundler = require('./server/bundler.js');
const bodyParser = require('body-parser');
const cors = require('cors');
{{extra_deps}}

const app = express();
const server = http.createServer(app);

{{profile_services}}

app.use(express.static('public'));
app.use(bodyParser.json());

// Use cors when in the test environment.
// Run with: NODE_ENV=test npm start.
if (app.get('env') === 'test') {
    app.use(cors());
}

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

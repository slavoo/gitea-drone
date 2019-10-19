const express = require('express');
const logger = require('morgan');
const { morgan } = require('./config');
var routes = require('./routes');

const app = express();

app.use(logger(morgan.format));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', routes);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        status: err.status,
        message: err.message,
    });
});

module.exports = app;

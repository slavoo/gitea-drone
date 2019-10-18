const express = require('express')
const app = express()
const port = 5555

let FakeDroneServer = function (expectedReposCallbacks) {

    for (let key in expectedReposCallbacks) {
        console.log('setting up a mock for ' + key);
        app.post('/api/repos/' + key, (req, res) => {
            expectedReposCallbacks[key].postCount++;
            res.send({ resp: 'fake' });
        })

        app.delete('/api/repos/' + key, (req, res) => {
            expectedReposCallbacks[key].deleteCount++;
            res.send('response doesn\'t matter at this point!');
        })
    }

    app.post('/api/user/repos', (req, res) => {
        res.sendStatus(200);
    });

    app.use((req, res, next) => {
        const err = new Error(`Not Found: (${req.method}) ${req.url} `);
        err.status = 404;
        next(err);
    });

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

module.exports = FakeDroneServer;
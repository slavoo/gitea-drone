const express = require('express')
const app = express()
const port = 5555

let FakeDroneServer = function (repoStats) {

    for (let repo in repoStats) {
        console.log('setting up a mock for ' + repo);
        app.post('/api/repos/' + repo, (req, res) => {
            repoStats[repo].postCount++;
            res.send({ resp: 'fake' });
        });

        app.delete('/api/repos/' + repo, (req, res) => {
            repoStats[repo].deleteCount++;
            res.send('response doesn\'t matter at this point!');
        });
    }

    app.post('/api/user/repos', (req, res) => {
        res.sendStatus(200);
    });

    app.use((req, res, next) => {
        const err = new Error(`Not Found: (${req.method}) ${req.url} `);
        err.status = 404;
        res.send(err);
    });

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

module.exports = FakeDroneServer;
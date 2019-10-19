process.env.DRONE_URL = 'http://localhost:5555/';
process.env.DRONE_TOKEN = 'dummy-token';

let chai = require('chai');
let chaiHttp = require('chai-http');
let FakeDroneServer = require('../stubs/drone-mock')
let app = require('../../app')

chai.should();
chai.use(chaiHttp);

var requester = chai.request(app).keepOpen()

let expectedRepos = {
    'owner/testrepo': {
        postCount: 0,
        deleteCount: 0
    }
}

new FakeDroneServer(expectedRepos);

describe('gitea-org-events', function () {
    it('should ignore when event type is not defined', done => {
        requester
            .post('/gitea/api/v1/org/events')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.message.should.equal("unsupported event type: undefined");
                Object.keys(res.body).length.should.equal(1);
                done();
            });
    });

    it('should ignore when event is repository and action is not defined', done => {
        requester
            .post('/gitea/api/v1/org/events')
            .set('x-gitea-event', 'repository')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.message.should.equal("unsupported repository action: undefined");
                Object.keys(res.body).length.should.equal(1);
                done();
            });
    });

    it('should call drone when event is repository and action is created', done => {
        let initialPostCount = expectedRepos['owner/testrepo'].postCount;
        let initialDeleteCount = expectedRepos['owner/testrepo'].deleteCount;
        requester
            .post('/gitea/api/v1/org/events')
            .set('x-gitea-event', 'repository')
            .send({
                action: 'created',
                repository: { full_name: 'owner/testrepo' }
            })
            .end((err, res) => {
                res.should.have.status(204);

                let finalPostCount = expectedRepos['owner/testrepo'].postCount;
                let finalDeleteCount = expectedRepos['owner/testrepo'].deleteCount;

                finalPostCount.should.be.equal(initialPostCount + 1);
                finalDeleteCount.should.be.equal(initialDeleteCount);
                done();
            });
    });

    it('should call drone when event is "repository" and action is "deleted"', done => {
        let initialPostCount = expectedRepos['owner/testrepo'].postCount;
        let initialDeleteCount = expectedRepos['owner/testrepo'].deleteCount;
        requester
            .post('/gitea/api/v1/org/events')
            .set('x-gitea-event', 'repository')
            .send({
                action: 'deleted',
                repository: { full_name: 'owner/testrepo' }
            })
            .end((err, res) => {
                res.should.have.status(204);

                let finalPostCount = expectedRepos['owner/testrepo'].postCount;
                let finalDeleteCount = expectedRepos['owner/testrepo'].deleteCount;

                finalPostCount.should.be.equal(initialPostCount);
                finalDeleteCount.should.be.equal(initialDeleteCount + 1);
                done();
            });
    });

    it('should return status ok when healthz is called', done => {
        requester
            .get('/_healthz')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;

                res.body.status.should.be.equal('ok');
                done();
            });
    });
});

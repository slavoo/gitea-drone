process.env.DRONE_URL = 'http://localhost:5555/';
process.env.DRONE_TOKEN = 'dummy-token';

import chai from 'chai';
import chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

import { FakeDroneServer, HttpAction } from '../stubs/drone-mock';
import { AppServer } from '../../app/app-server';
import { Request, Response } from 'express';

describe('gitea-org-events', () => {

    let requester: ChaiHttp.Agent;
    let droneApiMock: FakeDroneServer;

    before(() => {
        let app = new AppServer().innerApp;

        requester = chai.request(app).keepOpen()

        droneApiMock = new FakeDroneServer();
        droneApiMock.start(5555);
    });


    after(() => {
        droneApiMock.close();
    });

    it('should ignore when event type is not defined', done => {
        requester
            .post('/api/v1/sources/gitea/web-hook-events')
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
            .post('/api/v1/sources/gitea/web-hook-events')
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

        let giteaOwner = 'test1';
        let repoName = 'repo-created';

        droneApiMock.expect(HttpAction.Post, giteaOwner, repoName, (req: Request, res: Response) => {
            req.headers.authorization.should.equal(`Bearer ${process.env.DRONE_TOKEN}`);
            res.send({ status: 'ok' });
        });

        requester
            .post('/api/v1/sources/gitea/web-hook-events')
            .set('x-gitea-event', 'repository')
            .send({
                action: 'created',
                repository: { full_name: `${giteaOwner}/${repoName}` }
            })
            .end((err, res) => {
                res.should.have.status(204);

                droneApiMock.getCallCount(HttpAction.Post, giteaOwner, repoName).should.equal(1);

                done();
            });
    });

    it('should call drone when event is "repository" and action is "deleted"', done => {
        let giteaOwner = 'test2';
        let repoName = 'repo-deleted';

        droneApiMock.expect(HttpAction.Delete, giteaOwner, repoName, (req: Request, res: Response) => {
            req.headers.authorization.should.equal(`Bearer ${process.env.DRONE_TOKEN}`);
            res.send({ status: 'ok' });
        });

        requester
            .post('/api/v1/sources/gitea/web-hook-events')
            .set('x-gitea-event', 'repository')
            .send({
                action: 'deleted',
                repository: { full_name: `${giteaOwner}/${repoName}` }
            })
            .end((err, res) => {
                res.should.have.status(204);

                droneApiMock.getCallCount(HttpAction.Delete, giteaOwner, repoName).should.equal(1);

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

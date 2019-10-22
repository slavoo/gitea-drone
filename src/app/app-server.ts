import express from 'express';
import logger from 'morgan';
import { morgan } from './config';
import { Server } from '@overnightjs/core';
import { GiteaWebHookDispatcher } from './controllers/gitea-web-hook-dispatcher';
import { Healthz } from './controllers/healthz';

export class AppServer extends Server {

    public get innerApp(): any {
        return this.app;
    }

    constructor() {
        super(process.env.NODE_ENV === 'development'); // setting showLogs to true
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(logger(morgan.format));

        this.setupControllers();
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            console.log('Server listening on port: ' + port);
        })
    }

    private setupControllers(): void {
        super.addControllers([new GiteaWebHookDispatcher(), new Healthz()]);
    }
}

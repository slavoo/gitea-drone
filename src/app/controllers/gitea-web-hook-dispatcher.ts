import { Controller, Post } from '@overnightjs/core';
import { Request, Response } from 'express';
import { DroneClient } from '../clients/drone-client';

@Controller('api/v1/sources/gitea/web-hook-events')
export class GiteaWebHookDispatcher {
    constructor(private droneClient: DroneClient = new DroneClient()) {
    }

    @Post()
    private post(req: Request, res: Response) {
        const event = req.header('x-gitea-event');

        if (event !== 'repository') {
            console.debug(`unsupported event type: ${event}`);
            res.send({ message: `unsupported event type: ${event}` });
            return;
        }

        const action = req.body.action;

        const fullName = req.body && req.body.repository && req.body.repository.full_name;

        switch (action) {
            case 'created':

                console.info(`activating gitea repository in drone: ${fullName}`);

                this.droneClient.activateRepo(
                    fullName,
                    () => {
                        console.info('repository activated.');
                        res.sendStatus(204);
                        return;
                    },
                    (msg: string) => {
                        console.error(`activation failed: ${msg}`);
                        res.status(500).send({ message: msg });
                        return;
                    }
                );

                break;
            case 'deleted':
                console.info(`removing gitea repository from drone: ${req.body.repository.full_name}`);

                this.droneClient.deleteRepo(
                    fullName,
                    () => {
                        console.info('repository removed');
                        res.sendStatus(204);
                        return;
                    },
                    (msg: string) => {
                        console.error(`removing failed: ${msg}`);
                        res.status(500).send({ message: msg });
                        return;
                    }
                );

                break;
            default:
                console.debug(`unsupported repository action: ${action}`);
                res.send({ message: `unsupported repository action: ${action}` });
                return;
        }
    }
}

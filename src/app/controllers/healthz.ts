import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('')
export class Healthz {

    @Get('_healthz')
    private healthz(req: Request, res: Response): void {
        res.send({ status: 'ok' });
    }
}

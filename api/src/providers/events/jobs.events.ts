import jobs from '@jobs/index';
import { Server } from 'socket.io';

import { IPrefereceCompleted } from '@interfaces/events/mercadopago/completed.preference';
export default class JobsEvents {
    static events(ioSocket: Server): void {

        jobs.payments.on('global:completed', (id_job, data) => {
            const parseData = JSON.parse(data) as IPrefereceCompleted;
            ioSocket.emit(`order_payment:${id_job}`, parseData);
        });

        jobs.payments.on('global:error', (data) => {
            console.error(data);
        });
    }
}

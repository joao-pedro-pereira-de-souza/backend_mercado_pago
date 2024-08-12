import jobs from '@jobs/index';

import { IPrefereceCompleted } from '@interfaces/events/mercadopago/completed.preference';
export default class JobsEvents {
    static events(): void {

        jobs.payments.on('global:completed', (id_job, data) => {
            console.log({ id_job, data });

            const parseData = JSON.parse(data) as IPrefereceCompleted;
            console.log({ mercadopago: parseData.data?.preference });
        });

        jobs.payments.on('global:error', (data) => {
            console.error(data);
        });
    }
}

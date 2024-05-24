import Queue from 'bull';

import jobs from '../proccess';

const AllJobs = Object.values(jobs).map((queue) => {
    return new Queue(queue.name, {
        ...queue.connection,
        ...queue.configs,
    });
});

export default {
    process() {
        AllJobs.forEach((queue) => {
            const queueConfigFind = Object.values(jobs).find(
                (job) => job.name === queue.name
            );

            if (queueConfigFind) {
                queue.process(queueConfigFind.handle);

                queue.on('active', () => {
                    const message = `O processo ${queueConfigFind.name} foi inicializado com sucesso ✅`;
                    console.log(message);
                });

                queue.on('completed', () => {
                    const message = `O processo ${queueConfigFind.name} foi finalizado com sucesso ✅`;
                    console.log(message);
                });

                queue.on('error', (job: any, err: any) => {
                    const message = `Ocorreu um erro no processo ${queueConfigFind.name} 🟥`;
                    console.log(message, err);
                    console.log({
                        error: err,
                        data: job,
                    });
                });
            }
        });
    },
};

import Queue from "bull";
import jobs from "../controllers";
import logger from "@configs/logger";

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

        queue.on("active", (job) => {
          const message = `O processo ${queueConfigFind.name} foi inicializado com sucesso ✅`;
          logger.info(message, { job });
        });

        queue.on("completed", (job) => {
          const message = `O processo ${queueConfigFind.name} foi finalizado com sucesso ✅`;
          logger.info(message, { job });
        });

        queue.on("error", (job: any, err: any) => {
          const message = `Ocorreu um erro no processo ${queueConfigFind.name} 🟥`;
          logger.error({ message, data: { job, error: err } });
        });
      }
    });
  },
};

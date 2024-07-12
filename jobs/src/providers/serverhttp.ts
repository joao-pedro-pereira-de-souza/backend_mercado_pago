import express from "express";
import cors from "cors";

export default class ProviderHttp {
  static http() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.post("/payments/success", (req, res, next) => {
      try {
        const { body, params, query } = req;

        console.log({
          body,
          params,
          query,
        });
        return res.status(201).json({
          body,
          params,
          query,
        });
      } catch (error) {
        console.log(error);
      }
    });

    app.post("/payments/failure", (req, res, next) => {
      try {
        const { body, params, query } = req;

        console.log({
          body,
          params,
          query,
        });

        return res.status(201).json({
          body,
          params,
          query,
        });
      } catch (error) {
        console.log(error);
      }
    });

    const server = app.listen(process.env.PORT);

    console.log({ address: server.address() });
    return {
      app,
      server,
    };
  }
}

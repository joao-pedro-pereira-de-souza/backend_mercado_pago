import 'dotenv/config';

import { app, server, io} from '@middlewares/setup';

import listener from '@functions/listener';
import ProvidersEvents from '@root/src/providers/events';

if (process.env.NODE_ENV !== 'test') {
    const providersEvents = new ProvidersEvents(io);
    server.listen(process.env.PORT, listener);

    providersEvents.start();
}


export {
    server,
    app
};

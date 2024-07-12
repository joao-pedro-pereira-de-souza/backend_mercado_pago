import 'dotenv/config';

import {Server} from 'http';
import {app} from '@middlewares/setup';
import listener from '@functions/listener';
import ProvidersEvents from '@root/src/providers/events';

let server: Server ;
if (process.env.NODE_ENV !== 'test') {
    server = app.listen(process.env.PORT, listener);
}


ProvidersEvents.start();

export {
    server,
    app
};

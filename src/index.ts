import 'dotenv/config';

import { app } from '@middlewares/setup';
import listener from '@functions/listener';

if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT, listener);
}

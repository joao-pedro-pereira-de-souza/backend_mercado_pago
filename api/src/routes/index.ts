
import { Router } from 'express';

import mainController from '@controllers/main_controller';
import RoutesUser from './user_route';
import RoutesAuth from './auth_route';
import RoutesProduct from './product_route';
import RoutesPaymentWebhook from './payment_wehook_route';

export function Routes (app: Router) {
    app.get('/', mainController.main);
    RoutesUser(app);
    RoutesAuth(app);
    RoutesProduct(app);
    RoutesPaymentWebhook(app);

}

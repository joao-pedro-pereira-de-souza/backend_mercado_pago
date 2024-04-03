
import { Router } from 'express';

import mainController from '@controllers/main_controller';
import RoutesUser from './user_route';

export function Routes (app: Router) {
    app.get('/', mainController.main);
    RoutesUser(app);

}


import { Router } from 'express';

import mainController from '@controllers/mainController';
export function Routes (app: Router) {
    app.get('/', mainController.main);

}

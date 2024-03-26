
import { Router } from 'express';

import mainController from '@controllers/mainController';
export default (app: Router) => {
    app.get('/', mainController.main);

};

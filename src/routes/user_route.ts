import { Router } from 'express';
import userController from '@controllers/user_controller';

function RoutesUser(app: Router) {
    app.get('/users', userController.list);
    app.post('/users', userController.create);
}

export default RoutesUser;

import { Router } from 'express';
import authController from '@controllers/auth_controller';

function RoutesAuth(app: Router) {
    app.post('/auth', authController.auth);
}

export default RoutesAuth;

import { Router } from 'express';
import paymentWebhootController from '@controllers/payment_webhook_controller';

function RoutesPaymentsWebhook(app: Router) {
    app.post('/payments/webhooks/success', paymentWebhootController.success);
    app.post('/payments/webhooks/failure', paymentWebhootController.failure);
}

export default RoutesPaymentsWebhook;

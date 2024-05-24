import { Router } from 'express';
import productController from '@controllers/product_controller';

function RoutesProducts(app: Router) {
    app.post('/products/payments', productController.payment);
}

export default RoutesProducts;

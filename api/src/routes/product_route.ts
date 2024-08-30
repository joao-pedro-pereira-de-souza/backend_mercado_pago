import { Router } from 'express';
import productController from '@controllers/product_controller';

function RoutesProducts(app: Router) {
    app.post('/products/payments', productController.payment);
    app.get('/products/options', productController.getAllGroupedByType);
}

export default RoutesProducts;

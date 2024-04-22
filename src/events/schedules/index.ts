import cron from 'node-cron';
import MercadoPagoServices from '@services/products';

cron.schedule('*/10 * * * * *', () => {
    MercadoPagoServices.loadProducts();
});

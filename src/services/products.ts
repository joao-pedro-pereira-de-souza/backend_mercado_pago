import productRepository from '@repositories/product_repository';

import mercadopagoLib from '@libs/mercadopago';

class ProductsServices {

    async loadProducts() {

        const productsDB = await productRepository.findOptionProductBee(
            'a6cc4b84-49ad-4955-8ec9-9c2060df976e'
        );

        return productsDB;
    }

}

export default new ProductsServices();

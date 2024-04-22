import productRepository from '@repositories/product_repository';

import mercadopagoLib from '@libs/mercadopago';

class ProductsServices {

    async loadProducts() {

        const productsDB = await productRepository.findManyProductsNotIntegratedMercadopago();

        const productsMercadoPago = await mercadopagoLib.products.getOnePagePreferences();

        if (productsDB.length && !productsMercadoPago.elements?.length ) {

        }
    }

}

export default new ProductsServices();

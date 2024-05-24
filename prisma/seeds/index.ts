import prisma from '../connection';
import products from './products.json';

async function Main() {

    const productBee = products.find((item) => item.type === 'product_bee');

    const isProductExists = await prisma.product.findFirst({
        where: { type: 'product_bee', deleted_at: null },
        include: {
            options: true
        }
    });

    if (productBee && !isProductExists) {

        console.log({options: productBee.options});
        await prisma.product.create({
            data: {
                type: productBee.type,
                options: {
                    createMany: {
                        data: productBee.options
                    }
                }
            }
        });

    }

}
Main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

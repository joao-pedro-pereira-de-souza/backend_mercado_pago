
import connection from '../../configs/redis';
import configs from '../../configs/bull_configs';

async function main(data: any) {
    console.log({ data });
}

export default {
    name: 'payments',
    async handle(data: any) {
        await main(data);
    },
    connection,
    configs,
};

import bcrypt from 'bcryptjs';

class HashCrypto {

    generate(value: string): string {
        return bcrypt.hashSync(value, 10);
    }

    compare(value_input: string, hash_compare: string ): boolean {
        return bcrypt.compareSync(value_input, hash_compare);
    }
}

export default new HashCrypto();

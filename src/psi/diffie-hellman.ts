import { gcd, lcm, modInv, modPow, prime, randBetween, toZn } from "bigint-crypto-utils";

export interface DiffieHellmanPublicKey {
    p : bigint,
    g : bigint
}

export class DiffieHellmanCryptosystem {
    static async keyGen(B: number) : Promise<DiffieHellmanPublicKey> {
        const p = await prime(B);
        const g = 2n;
        return {p, g};
    }

    static wrap(pub: DiffieHellmanPublicKey, x : bigint) : bigint {
        return modPow(pub.g, x, pub.p);
    }
}
import { eGcd, randBetween } from "bigint-crypto-utils";

/**
 * A class for supporting shared secret key manipulation.
 * 
 * This class implements Shamir's method of using polynomials over
 * a modular field to support (k,n) shared secrets. This means the
 * secret is encoded so that of n parts, any k are sufficient to
 * recover the secret.
 * 
 * The secret is provided as a BigInt, which must be less than the
 * prime modulus, which must also be provided. (The MersennePrimes
 * module provides a useful selection.)
 * 
 * The secret is used to create a ShamirPoly object with the `make`
 * function. From this object, we can generate an arbitrary number of
 * "shares", which are the partial secrets, k of which must be combined
 * to recover the original secret. The shares are numbered, >= 1. The
 * numbers need not be consecutive, but they must be less than the
 * prime modulus.
 * 
 * To recover the key, k of the shares and their numbers must be provided
 * along with the prime modulus.
 * 
 * Example:
 * 
 * ```ts
 * const secret = 12345n;
 * const k = 3;
 * const prime = 2n ** 127n - 1n;
 * 
 * const S = ShamirPoly.make(secret, k, prime);
 * 
 * const parts = [];
 * for (let i = 1n; i <= 10n; ++i) {
 *     parts.push([i, S.share(i)]);
 * }
 * 
 * const recovered_1 = ShamirPoly.recover([parts[0], parts[1], parts[2]]);
 * console.log(`secret = ${secret}, recovered = ${recovered_1}`);
 * const recovered_2 = ShamirPoly.recover([parts[3], parts[4], parts[5]]);
 * console.log(`secret = ${secret}, recovered = ${recovered_2}`);
 * const recovered_3 = ShamirPoly.recover([parts[9], parts[2], parts[7]]);
 * console.log(`secret = ${secret}, recovered = ${recovered_3}`);
 * ```
 * 
 * All algorithms due to https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing
 */
export class ShamirPoly {
    /**
     * The polynomial used to encode the secret. It includes the
     * secret as its first element. This should be saved if new
     * shares need to be created. Since it contains the secret,
     * if it is stored, it should be stored securely!
     */
    poly: bigint[];

    /**
     * The prime modulus used for creating shares. The same value
     * is required for recovering the secret. It is not sensitive,
     * in the sense, that while it is needed to create shares or
     * recover the secret, knowing it does not reveal information
     * about the secret.
     */
    prime: bigint;

    /**
     * Constructor.
     * 
     * Used to recreate a ShamirPolynomial previously created with
     * the `make` function.
     * 
     * @param poly is the polynomial used to create shares.
     * @param prime is the prime modulus (e.g. 2n ** 127n - 1n).
     */
    constructor(poly: bigint[], prime: bigint) {
        this.poly = poly;
        this.prime = prime;
    }

    /**
     * Create a new ShamirPoly, which can be used to create shares.
     * 
     * @param secret is the entity to be shared in a secure way. It must be greater than 0 and less than the prime modulus.
     * @param min is the minimum number of shares required to recover the secret. It must be >= 2.
     * @param prime is the prime modulus used for sharing and recovering the secret. Larger values are more secure, but slower and bigger to store.
     * @returns 
     */
    static make(secret: bigint, min: number, prime: bigint): ShamirPoly {
        const poly: bigint[] = [secret];
        for (let i = 0; i < min - 1; ++i) {
            poly.push(randBetween(prime - 1n));
        }
        return new ShamirPoly(poly, prime);
    }

    /**
     * Create a new share of the secret.
     * @param i is the number of the share. Must be > 0 and < the prime modulus. It is needed along with the share for recovery.
     * @returns the corresponding share of the secret.
     */
    share(i: bigint): bigint {
        if (i <= 0n) {
            throw new Error(`cannot share 0. must be 1 or greater`);
        }
        return ShamirPoly.eval_at(this.poly, i, this.prime);
    }

    /**
     * Recover the secret from parts. The minimum number required is determined when the
     * ShamirPoly is created.
     * 
     * @param parts a list of tuples consisting of the share number and the share.
     * @param prime the prime modulus for the shared secret.
     * @returns the recovered secret. If insufficient shares are provided, or they are invalid, undefined behaviour results. An exception may arise, or an arbitrary value may be returned.
     */
    static recover(parts: [bigint,bigint][], prime: bigint): bigint {
        const xs: bigint[] = [];
        const ys: bigint[] = [];
        for (const [x,y] of parts) {
            xs.push(x);
            ys.push(y);
        }
        return ShamirPoly.lagrange_interpolate(0n, xs, ys, prime);
    }

    private static eval_at(poly: bigint[], x: bigint, p: bigint): bigint {
        let a = 0n;
        for (const c of [...poly].reverse()) {
            a *= x;
            a += c;
            a %= p;
        }
        return a;
    }

    static lagrange_interpolate(x: bigint, xs: bigint[], ys: bigint[], p: bigint): bigint {
        const k = xs.length;
        const nums: bigint[] = [];
        const dens: bigint[] = [];
        for (let i = 0; i < k; ++i) {
            const cur = xs[i];
            const others = [...xs];
            others.splice(i,1);
            nums.push(ShamirPoly.prod(others.map((o) => x - o)));
            dens.push(ShamirPoly.prod(others.map((o) => cur - o)));
        }
        const den = ShamirPoly.prod(dens);
        const num = ShamirPoly.sum(ShamirPoly.range(k).map((i) => ShamirPoly.divmod(nums[i] * den * ys[i] % p, dens[i], p)))
        return (ShamirPoly.divmod(num, den, p) % p + p) % p;
    }

    static divmod(num: bigint, den: bigint, p: bigint): bigint {
        if (den < 0) {
            num = -num;
            den = -den;
        }
        const inv = eGcd(den, p).x;
        const res = num * inv;
        return res;
    }

    private static sum(xs: bigint[]): bigint {
        let a = 0n;
        for (const x of xs) {
            a += x;
        }
        return a;
    }

    private static prod(xs: bigint[]): bigint {
        let a = 1n;
        for (const x of xs) {
            a *= x;
        }
        return a;
    }

    private static range(k: number): number[] {
        const res: number[] = [];
        for (let i = 0; i < k; ++i) {
            res.push(i);
        }
        return res;
    }
}
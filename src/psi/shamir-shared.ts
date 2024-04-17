import { eGcd, randBetween } from "bigint-crypto-utils";

export class ShamirPoly {
    private poly: bigint[];
    prime: bigint;

    constructor(poly: bigint[], prime: bigint) {
        this.poly = poly;
        this.prime = prime;
    }

    static make(secret: bigint, min: number, prime: bigint): ShamirPoly {
        const poly: bigint[] = [secret];
        for (let i = 0; i < min - 1; ++i) {
            poly.push(randBetween(prime - 1n));
        }
        return new ShamirPoly(poly, prime);
    }

    share(i: bigint): bigint {
        if (i == 0n) {
            throw new Error(`cannot share 0. must be 1 or greater`);
        }
        return ShamirPoly.eval_at(this.poly, i, this.prime);
    }

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
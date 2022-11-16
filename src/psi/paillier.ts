import { gcd, lcm, modInv, modPow, prime, randBetween, toZn } from "bigint-crypto-utils";

export interface PaillierPublicKey {
  n: bigint;
  g: bigint;
  nn: bigint;
}

export interface PaillierPrivateKey extends PaillierPublicKey {
  lambda: bigint;
  mu: bigint;
}

export interface PaillierEncryptum {
  value: bigint;
}

export function modPowX(b: number | bigint, e: number | bigint, n: number | bigint): bigint {
  if (typeof b === "number") b = BigInt(b);
  if (typeof e === "number") e = BigInt(e);
  if (typeof n === "number") n = BigInt(n);

  if (n <= 0n) {
    throw new RangeError("n must be > 0");
  } else if (n === 1n) {
    return 0n;
  }

  b = toZn(b, n);

  if (e < 0n) {
    return modInv(modPow(b, e >= 0 ? e : -e, n), n);
  }

  let r = 1n;
  while (e > 0) {
    if ((e & 1n) === 1n) {
      r = (r * b) % n;
    }
    //e = e / 2n;
    e >>= 1n;
    b = (b * b) % n;
  }
  return r;
}

export class PaillierCryptosystem {
  static async keyGen(B: number): Promise<{ pub: PaillierPublicKey; priv: PaillierPrivateKey }> {
    const pp: Promise<bigint> = prime(B);
    const qq: Promise<bigint> = prime(B);
    const p: bigint = await pp;
    const pm1 = p - 1n;
    const q: bigint = await qq;
    const qm1 = q - 1n;
    const n: bigint = p * q;
    const nn = n * n;
    const psi = pm1 * qm1;
    //const lam : bigint = lcm(pm1, qm1);
    //const g : bigint = randBetween(nn);
    //const w : bigint = modPow(g, lam, nn) / n;
    //const mu : bigint = modInv(w, n);
    const g = n + 1n;
    const lambda = psi;
    const mu = modInv(psi, n);

    const pub: PaillierPublicKey = { n, g, nn };
    const priv: PaillierPrivateKey = { n, g, nn, lambda, mu };
    return { pub, priv };
  }

  static enc(pub: PaillierPublicKey, m: bigint): PaillierEncryptum {
    const r: bigint = randBetween(pub.n);
    return { value: (modPowX(pub.g, m, pub.nn) * modPowX(r, pub.n, pub.nn)) % pub.nn };
  }

  static async encAsync(pub: PaillierPublicKey, m: bigint): Promise<PaillierEncryptum> {
    const r: bigint = randBetween(pub.n);
    return { value: (modPowX(pub.g, m, pub.nn) * modPowX(r, pub.n, pub.nn)) % pub.nn };
  }

  static dec(priv: PaillierPrivateKey, c: PaillierEncryptum): bigint {
    return ((modPow(c.value, priv.lambda, priv.nn) / priv.n) * priv.mu) % priv.n;
  }

  static add(pub: PaillierPublicKey, x: PaillierEncryptum, y: number | bigint | PaillierEncryptum): PaillierEncryptum {
    let v: PaillierEncryptum;
    if (typeof y === "number") {
      y = BigInt(y);
    }
    if (typeof y == "bigint") {
      v = PaillierCryptosystem.enc(pub, y);
    } else {
      v = y;
    }
    return { value: (x.value * v.value) % pub.nn };
  }

  static mul(pub: PaillierPublicKey, x: PaillierEncryptum, y: number | bigint): PaillierEncryptum {
    if (typeof y === "number") {
      y = BigInt(y);
    }
    return { value: modPow(x.value, y, pub.nn) };
  }
}

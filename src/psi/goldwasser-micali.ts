import { gcd, lcm, modInv, modPow, prime, randBetween, toZn } from "bigint-crypto-utils";

export function legendre(a: bigint, p: bigint): bigint {
  a = a % p;
  if (a == 0n) {
    return a;
  }
  return modPow(a, (p - 1n) >> 1n, p) == 1n ? 1n : -1n;
}

export function jacobi(a: bigint, n: bigint): bigint {
  a = a % n;
  let t: bigint = 1n;

  while (a != 0n) {
    while (a % 2n == 0n) {
      a = a >> 1n;
      const r: bigint = n % 8n;
      if (r == 3n || r == 5n) {
        t = -t;
      }
    }
    const r: bigint = n;
    n = a;
    a = r;
    if (a % 4n == 3n || n % 4n == 3n) {
      t = -t;
    }
    a = a % n;
  }
  if (n == 1n) {
    return t;
  } else {
    return 0n;
  }
}

export function nonResidue(p: bigint, q: bigint, N: bigint): bigint {
  let a: bigint = 0n;
  while (legendre(a, p) != -1n || legendre(a, q) != -1n) {
    a = randBetween(p);
  }
  return a;
}

export interface GoldwasserMicaliPublicKey {
  x: bigint;
  N: bigint;
}

export interface GoldwasserMicaliPrivateKey extends GoldwasserMicaliPublicKey {
  p: bigint;
  q: bigint;
}

export interface GoldwasserMicaliEncryptum {
  value: bigint;
}

export class GoldwasserMicaliCryptosystem {
  static async keyGen(B: number): Promise<{ pub: GoldwasserMicaliPublicKey; priv: GoldwasserMicaliPrivateKey }> {
    const pp: Promise<bigint> = prime(B);
    const qq: Promise<bigint> = prime(B);
    const p: bigint = await pp;
    const pm1 = p - 1n;
    const q: bigint = await qq;
    const qm1 = q - 1n;
    const N: bigint = p * q;
    const x: bigint = nonResidue(p, q, N);
    const pub: GoldwasserMicaliPublicKey = { N, x };
    const priv: GoldwasserMicaliPrivateKey = { N, x, p, q };
    return { pub, priv };
  }

  static encrypt(pub: GoldwasserMicaliPublicKey, bit: bigint): GoldwasserMicaliEncryptum {
    let y = randBetween(pub.N);
    while (gcd(y, pub.N) != 1n) {
      y = randBetween(pub.N);
    }
    return { value: (modPow(y, 2, pub.N) * modPow(pub.x, bit, pub.N)) % pub.N };
  }

  static decrypt(priv: GoldwasserMicaliPrivateKey, c: GoldwasserMicaliEncryptum): bigint {
    return legendre(c.value, priv.p) == 1n && legendre(c.value, priv.q) == 1n ? 0n : 1n;
  }

  static xor(
    pub: GoldwasserMicaliPublicKey,
    lhs: GoldwasserMicaliEncryptum,
    rhs: GoldwasserMicaliEncryptum
  ): GoldwasserMicaliEncryptum {
    return { value: (lhs.value * rhs.value) % pub.N };
  }
}

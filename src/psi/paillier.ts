import { gcd, lcm, modInv, modPow, prime, randBetween, toZn } from "bigint-crypto-utils";

/**
 * Public key for the Paillier cryptosystem.
 */
export interface PaillierPublicKey {
  n: bigint;
  g: bigint;
  nn: bigint;
}

/**
 * Private key for the Paillier cryptosystem.
 */
export interface PaillierPrivateKey extends PaillierPublicKey {
  lambda: bigint;
  mu: bigint;
}

/**
 * A value encrypted with the Paillier cryptosystem. We wrap them
 * to avoid accidentally mixing encrypted and unencrypted values.
 */
export interface PaillierEncryptum {
  value: bigint;
}

/**
 * Efficiently compute `(b ** e) % n`. This implementation is more efficient than
 * the library implementation, but makes more assumptions about the inputs. Algorithm
 * from https://en.wikipedia.org/wiki/Modular_exponentiation
 *
 * @param b is the base for the power (if number, must be an integer)
 * @param e is the exponent for the power (if number, must be a positive integer)
 * @param n is the modulus (if number, must be an integer)
 * @returns `(b ** e) % n`
 */
export function modPowX(b: number | bigint, e: number | bigint, n: number | bigint): bigint {
  if (typeof b === "number") b = BigInt(b);
  if (typeof e === "number") e = BigInt(e);
  if (typeof n === "number") n = BigInt(n);

  if (e < 0n) {
    throw new RangeError("e must be >= 0");
  }

  if (n <= 0n) {
    throw new RangeError("n must be > 0");
  } else if (n === 1n) {
    return 0n;
  }

  b = toZn(b, n);

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

/**
 * Functions for manipulating values in the Paillier cryptosystem.
 *
 * The Paillier cryptosystem is a probabilistic public key cryptosystem that
 * supports homomorphic addition and multiplication.
 *
 * Example:
 *
 * ```ts
 * const {pub, priv} = await PaillierCryptosystem.keyGen(1024);
 * const x : PaillierEncryptum = PaillierCryptosystem.encrypt(pub, 17);
 *
 * const y : PaillierEncryptum = PaillierCryptosystem.encrypt(pub, 3);
 * const twenty = PaillierCryptosystem.add(x, y);
 * console.log(PaillierCryptosystem.decrypt(twenty));
 *
 * const fiftyOne : PaillierEncryptum = PaillierCryptosystem.mul(x, 3);
 * console.log(PaillierCryptosystem.decrypt(fiftyOne));
 * ```
 *
 * All algorithms due to https://en.wikipedia.org/wiki/Paillier_cryptosystem
 */
export class PaillierCryptosystem {
  /**
   * Generate public and private keys for the Paillier cryptosystem.
   *
   * @param B is the number of bits for the constituent primes.
   * @returns the public and private keys.
   */
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
    const g = n + 1n;
    const lambda = psi;
    const mu = modInv(psi, n);

    const pub: PaillierPublicKey = { n, g, nn };
    const priv: PaillierPrivateKey = { n, g, nn, lambda, mu };
    return { pub, priv };
  }

  /**
   * Encrypt a value.
   *
   * For a public key generated with `B` bit primes, the message must be an
   * integer in the range `[0, 2**(2*B))`.
   *
   * The encryption algorithm uses a random integer `2*B` bits in length,
   * so the result is non-deterministic.
   *
   * @param pub is the public key
   * @param m is the message (integer)
   * @returns the encrypted message (integer)
   */
  static encrypt(pub: PaillierPublicKey, m: bigint): PaillierEncryptum {
    const r: bigint = randBetween(pub.n);
    return { value: (modPowX(pub.g, m, pub.nn) * modPowX(r, pub.n, pub.nn)) % pub.nn };
  }

  /**
   * Encrypt a value asynchronously. Appropriate for large `B` (> 2048).
   *
   * For a public key generated with `B` bit primes, the message must be an
   * integer in the range `[0, 2**(2*B))`.
   *
   * The encryption algorithm uses a random integer `2*B` bits in length,
   * so the result is non-deterministic.
   *
   * @param pub is the public key
   * @param m is the message (integer)
   * @returns the encrypted message (integer)
   */
  static async encryptAsync(pub: PaillierPublicKey, m: bigint): Promise<PaillierEncryptum> {
    const r: bigint = randBetween(pub.n);
    return { value: (modPowX(pub.g, m, pub.nn) * modPowX(r, pub.n, pub.nn)) % pub.nn };
  }

  /**
   * Decrypt a message.
   *
   * @param priv is the private key.
   * @param c is the encrypted message.
   * @returns the decrypted message.
   */
  static decrypt(priv: PaillierPrivateKey, c: PaillierEncryptum): bigint {
    return ((modPow(c.value, priv.lambda, priv.nn) / priv.n) * priv.mu) % priv.n;
  }

  /**
   * Homomorphic addition: produce the encrypted sum of two messages.
   *
   * @param pub is the public key.
   * @param x is an encrypted value.
   * @param y is an integer which may be a number, bigint or a previously encrypted value.
   * @returns the encryption of the sum of the unencrypted `x` and `y`.
   */
  static add(pub: PaillierPublicKey, x: PaillierEncryptum, y: number | bigint | PaillierEncryptum): PaillierEncryptum {
    let v: PaillierEncryptum;
    if (typeof y === "number") {
      y = BigInt(y);
    }
    if (typeof y == "bigint") {
      v = PaillierCryptosystem.encrypt(pub, y);
    } else {
      v = y;
    }
    return { value: (x.value * v.value) % pub.nn };
  }

  /**
   *
   * @param pub is the public key.
   * @param x is an encrypted value
   * @param y is an integer
   * @returns the encryption of `x*y`.
   */
  static mul(pub: PaillierPublicKey, x: PaillierEncryptum, y: number | bigint): PaillierEncryptum {
    if (typeof y === "number") {
      y = BigInt(y);
    }
    return { value: modPow(x.value, y, pub.nn) };
  }
}

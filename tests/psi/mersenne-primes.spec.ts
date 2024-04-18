import { MersennePrimes } from "../../src/psi/mersenne-primes";

import * as mocha from "mocha";
import * as chai from "chai";
import { gcd, modPow, randBetween } from "bigint-crypto-utils";

const expect = chai.expect;

function smallTest(n: bigint): boolean {
  const smallPrimes: bigint[] = [
    2n,
    3n,
    5n,
    7n,
    11n,
    13n,
    17n,
    19n,
    23n,
    29n,
    31n,
    37n,
    41n,
    43n,
    47n,
    53n,
    59n,
    61n,
    67n,
    71n,
    73n,
    79n,
    83n,
    89n,
    97n,
  ];
  for (let i = 0; i < smallPrimes.length && smallPrimes[i] < n; ++i) {
    const a = smallPrimes[i];
    if (n % a == 0n) {
      return false;
    }
  }
  return true;
}

function fermatTest(n: bigint, a: bigint): boolean {
  return modPow(a, n - 1n, n) == 1n;
}

describe("small Mersenne primes", () => {
  it("p2", () => {
    const p = MersennePrimes.p2();
    expect(smallTest(p)).to.be.true;
  });

  it("p3", () => {
    const p = MersennePrimes.p3();
    expect(smallTest(p)).to.be.true;
  });

  it("p5", () => {
    const p = MersennePrimes.p5();
    expect(smallTest(p)).to.be.true;
  });

  it("p7", () => {
    const p = MersennePrimes.p7();
    expect(smallTest(p)).to.be.true;
  });
});

describe("medium Mersenne primes", () => {
  it("p13", () => {
    const p = MersennePrimes.p13();
    expect(smallTest(p)).to.be.true;
    for (let a = 11n; a * a <= p; a += 2n) {
      expect(p % a == 0n).to.be.false;
    }
  });

  it("p17", () => {
    const p = MersennePrimes.p17();
    expect(smallTest(p)).to.be.true;
    for (let a = 11n; a * a <= p; a += 2n) {
      expect(p % a == 0n).to.be.false;
    }
  });

  it("p19", () => {
    const p = MersennePrimes.p19();
    expect(smallTest(p)).to.be.true;
    for (let a = 11n; a * a <= p; a += 2n) {
      expect(p % a == 0n).to.be.false;
    }
  });
});

describe("larger Mersenne primes", () => {
  it("p31", () => {
    const p = MersennePrimes.p31();
    expect(smallTest(p)).to.be.true;
    for (let a = 11n; a < 128n && a * a <= p; a += 2n) {
      expect(p % a == 0n).to.be.false;
    }
    for (let i = 0; i < 50; ++i) {
      let a = randBetween(p);
      expect(gcd(a, p) == 1n).to.be.true;
      expect(fermatTest(p, a)).to.be.true;
    }
  });

  it("p61", () => {
    const p = MersennePrimes.p61();
    expect(smallTest(p)).to.be.true;
    for (let a = 11n; a < 128n && a * a <= p; a += 2n) {
      expect(p % a == 0n).to.be.false;
    }
    for (let i = 0; i < 50; ++i) {
      let a = randBetween(p);
      expect(gcd(a, p) == 1n).to.be.true;
      expect(fermatTest(p, a)).to.be.true;
    }
  });

  it("p89", () => {
    const p = MersennePrimes.p89();
    expect(smallTest(p)).to.be.true;
    for (let a = 11n; a < 128n && a * a <= p; a += 2n) {
      expect(p % a == 0n).to.be.false;
    }
    for (let i = 0; i < 50; ++i) {
      let a = randBetween(p);
      expect(gcd(a, p) == 1n).to.be.true;
      expect(fermatTest(p, a)).to.be.true;
    }
  });

  it("p107", () => {
    const p = MersennePrimes.p107();
    expect(smallTest(p)).to.be.true;
    for (let a = 11n; a < 128n && a * a <= p; a += 2n) {
      expect(p % a == 0n).to.be.false;
    }
    for (let i = 0; i < 50; ++i) {
      let a = randBetween(p);
      expect(gcd(a, p) == 1n).to.be.true;
      expect(fermatTest(p, a)).to.be.true;
    }
  });

  it("p127", () => {
    const p = MersennePrimes.p127();
    expect(smallTest(p)).to.be.true;
    for (let a = 11n; a < 128n && a * a <= p; a += 2n) {
      expect(p % a == 0n).to.be.false;
    }
    for (let i = 0; i < 50; ++i) {
      let a = randBetween(p);
      expect(gcd(a, p) == 1n).to.be.true;
      expect(fermatTest(p, a)).to.be.true;
    }
  });

  it("p521", () => {
    const p = MersennePrimes.p521();
    expect(smallTest(p)).to.be.true;
    for (let a = 11n; a < 128n && a * a <= p; a += 2n) {
      expect(p % a == 0n).to.be.false;
    }
    for (let i = 0; i < 50; ++i) {
      let a = randBetween(p);
      expect(gcd(a, p) == 1n).to.be.true;
      expect(fermatTest(p, a)).to.be.true;
    }
  });

  it("p607", () => {
    const p = MersennePrimes.p607();
    expect(smallTest(p)).to.be.true;
    for (let a = 11n; a < 128n && a * a <= p; a += 2n) {
      expect(p % a == 0n).to.be.false;
    }
    for (let i = 0; i < 50; ++i) {
      let a = randBetween(p);
      expect(gcd(a, p) == 1n).to.be.true;
      expect(fermatTest(p, a)).to.be.true;
    }
  });

});

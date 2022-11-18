import {
  GoldwasserMicaliCryptosystem,
  GoldwasserMicaliPrivateKey,
  GoldwasserMicaliPublicKey,
  legendre,
} from "./../../src/psi/goldwasser-micali";
import { jacobi } from "../../src/psi/goldwasser-micali";

import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;

describe("tests on jacobi", () => {
  it("trivial tests", () => {
    expect(jacobi(1n, 17n)).to.eql(1n);
    expect(jacobi(2n, 17n)).to.eql(1n);
    expect(jacobi(3n, 17n)).to.eql(-1n);
    expect(jacobi(4n, 17n)).to.eql(1n);
    expect(jacobi(5n, 17n)).to.eql(-1n);
    expect(jacobi(6n, 17n)).to.eql(-1n);
    expect(jacobi(17n, 17n)).to.eql(0n);
  });
});

describe("tests on legendre", () => {
  it("trivial tests", () => {
    expect(legendre(1n, 17n)).to.eql(1n);
    expect(legendre(2n, 17n)).to.eql(1n);
    expect(legendre(3n, 17n)).to.eql(-1n);
    expect(legendre(4n, 17n)).to.eql(1n);
    expect(legendre(5n, 17n)).to.eql(-1n);
    expect(legendre(6n, 17n)).to.eql(-1n);
  });
});

describe("Goldwasser-Micali encryption/decryption", async () => {
  it("fixed key tests", () => {
    const pub: GoldwasserMicaliPublicKey = { N: 853972440679n, x: 400005n };
    const priv: GoldwasserMicaliPrivateKey = { N: 853972440679n, x: 400005n, p: 314159n, q: 2718281n };
    for (let i = 0; i < 10; ++i) {
      const c0a = GoldwasserMicaliCryptosystem.encrypt(pub, 0n);
      const c0b = GoldwasserMicaliCryptosystem.encrypt(pub, 0n);
      const c1a = GoldwasserMicaliCryptosystem.encrypt(pub, 1n);
      const c1b = GoldwasserMicaliCryptosystem.encrypt(pub, 1n);
      const r0 = GoldwasserMicaliCryptosystem.xor(pub, c0a, c0b);
      expect(GoldwasserMicaliCryptosystem.decrypt(priv, r0)).to.eql(0n);
      const r1 = GoldwasserMicaliCryptosystem.xor(pub, c0a, c1a);
      expect(GoldwasserMicaliCryptosystem.decrypt(priv, r1)).to.eql(1n);
      const r2 = GoldwasserMicaliCryptosystem.xor(pub, c1b, c0b);
      expect(GoldwasserMicaliCryptosystem.decrypt(priv, r2)).to.eql(1n);
      const r3 = GoldwasserMicaliCryptosystem.xor(pub, c1a, c1b);
      expect(GoldwasserMicaliCryptosystem.decrypt(priv, r3)).to.eql(0n);
    }
  });
  it("more tests", async () => {
    const { pub, priv } = await GoldwasserMicaliCryptosystem.keyGen(256);
    for (let i = 0; i < 10; ++i) {
      const c0 = GoldwasserMicaliCryptosystem.encrypt(pub, 0n);
      expect(GoldwasserMicaliCryptosystem.decrypt(priv, c0)).to.eql(0n);
      const c1 = GoldwasserMicaliCryptosystem.encrypt(pub, 1n);
      expect(GoldwasserMicaliCryptosystem.decrypt(priv, c1)).to.eql(1n);
    }
  });
  it("xor tests", async () => {
    const { pub, priv } = await GoldwasserMicaliCryptosystem.keyGen(256);
    const c0a = GoldwasserMicaliCryptosystem.encrypt(pub, 0n);
    const c0b = GoldwasserMicaliCryptosystem.encrypt(pub, 0n);
    const c1a = GoldwasserMicaliCryptosystem.encrypt(pub, 1n);
    const c1b = GoldwasserMicaliCryptosystem.encrypt(pub, 1n);
    const r0 = GoldwasserMicaliCryptosystem.xor(pub, c0a, c0b);
    expect(GoldwasserMicaliCryptosystem.decrypt(priv, r0)).to.eql(0n);
    const r1 = GoldwasserMicaliCryptosystem.xor(pub, c0a, c1a);
    expect(GoldwasserMicaliCryptosystem.decrypt(priv, r1)).to.eql(1n);
    const r2 = GoldwasserMicaliCryptosystem.xor(pub, c1b, c0b);
    expect(GoldwasserMicaliCryptosystem.decrypt(priv, r2)).to.eql(1n);
    const r3 = GoldwasserMicaliCryptosystem.xor(pub, c1a, c1b);
    expect(GoldwasserMicaliCryptosystem.decrypt(priv, r3)).to.eql(0n);
  });
});

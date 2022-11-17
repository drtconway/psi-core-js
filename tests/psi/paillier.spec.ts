import { PaillierCryptosystem } from "../../src/psi/paillier";

import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;

describe("basic construction", async () => {

  it("simple enc/dec", async () => {
    const { pub, priv } = await PaillierCryptosystem.keyGen(256);
    const x1 = PaillierCryptosystem.encrypt(pub, 1n);
    const y1 = PaillierCryptosystem.decrypt(priv, x1);
    expect(y1).to.eql(1n);
    const x13 = PaillierCryptosystem.encrypt(pub, 13n);
    const y13 = PaillierCryptosystem.decrypt(priv, x13);
    expect(y13).to.eql(13n);
  });

  it("homomorphic addition", async () => {
    const { pub, priv } = await PaillierCryptosystem.keyGen(256);

    if (true) {
        const x1 = PaillierCryptosystem.encrypt(pub, 23n);
        const x2 = PaillierCryptosystem.add(pub, x1, 7);
        const y1 = PaillierCryptosystem.decrypt(priv, x2);
        expect(y1).to.eql(30n);
    }

    if (true) {
        const x1 = PaillierCryptosystem.encrypt(pub, 23n);
        const x2 = PaillierCryptosystem.add(pub, x1, 7n);
        const y1 = PaillierCryptosystem.decrypt(priv, x2);
        expect(y1).to.eql(30n);
    }

    if (true) {
        const x1 = PaillierCryptosystem.encrypt(pub, 23n);
        const w1 = PaillierCryptosystem.encrypt(pub, 7n);
        const x2 = PaillierCryptosystem.add(pub, x1, w1);
        const y1 = PaillierCryptosystem.decrypt(priv, x2);
        expect(y1).to.eql(30n);
    }
});

  it("homomorphic multiplication", async () => {
    const { pub, priv } = await PaillierCryptosystem.keyGen(256);

    if (true) {
        const x1 = PaillierCryptosystem.encrypt(pub, 23n);
        const x2 = PaillierCryptosystem.mul(pub, x1, 7);
        const y1 = PaillierCryptosystem.decrypt(priv, x2);
        expect(y1).to.eql(161n);
    }

    if (true) {
        const x1 = PaillierCryptosystem.encrypt(pub, 23n);
        const x2 = PaillierCryptosystem.mul(pub, x1, 7n);
        const y1 = PaillierCryptosystem.decrypt(priv, x2);
        expect(y1).to.eql(161n);
    }
  });

});

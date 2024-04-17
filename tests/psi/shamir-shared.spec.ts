import { ShamirPoly } from "../../src/psi/shamir-shared";

import * as mocha from "mocha";
import * as chai from "chai";
import { MersennePrimes } from "../../src/psi/mersenne-primes";

const expect = chai.expect;

describe("basic tests", () => {

  it("divmod 1", () => {
    expect(ShamirPoly.divmod(43162192916902356880153528760047544077n, 2n, 170141183460469231731687303715884105727n)).to.eql(-3671833291815424753689207168691991666526832052578664379221806029902856542451n);
    expect(ShamirPoly.divmod(21864025477267021657371061012497927669n, -1n, 170141183460469231731687303715884105727n)).to.eql(-21864025477267021657371061012497927669n);
    expect(ShamirPoly.divmod(565858037631686434588593264948301389n, 2n, 170141183460469231731687303715884105727n)).to.eql(-48137878096636932061709116006483852075584800564874710473212594243494326707n);
  });

  it("lagrange 1", () => {
    const xs = [1n, 2n, 3n];
    const ys = [132896678868000543584246051743406269364n, 40713293742011722794807570844596199126n, 63732211542972001095059164735338001974n];
    const res = ShamirPoly.lagrange_interpolate(0n, xs, ys, 170141183460469231731687303715884105727n);
    expect(res).to.eql(1234n);
  });

  it("lagrange 2", () => {
    const xs = [4n, 5n, 6n];
    const ys = [31812248810412146753313529699747572181n, 115094589004801391501257969453709015474n, 143438048665670503607205180281338226126n];
    const res = ShamirPoly.lagrange_interpolate(0n, xs, ys, 170141183460469231731687303715884105727n);
    expect(res).to.eql(1234n);
    });

  it("static poly 1", () => {
    const prime = MersennePrimes.p127();
    const poly: bigint[] = [1234n, 133048951677418510430394477312234177594n, 77473121818638445183579743178772154970n];
    const S = new ShamirPoly(poly, prime);
    const k_1 = S.share(1n);
    expect(k_1).to.eql(40380890035587723882286916775122228071n);
    const k_2 = S.share(2n);
    expect(k_2).to.eql(65566840247983106400046016191904659121n);
    const k_3 = S.share(3n);
    expect(k_3).to.eql(75557850637186147553277298250347294384n);
    const recovered = ShamirPoly.recover([[1n, k_1], [2n, k_2], [3n, k_3]], prime);
    expect(recovered).to.eql(1234n);
  });

  it("construction 1", () => {
    const prime = MersennePrimes.p127();
    const secret = 12345n;
    const S = ShamirPoly.make(secret, 2, prime);
    const k_1 = S.share(1n);
    const k_2 = S.share(2n);
    const recovered = ShamirPoly.recover([[1n, k_1], [2n, k_2]], prime);
    expect(recovered).to.eql(secret);
  });

  it("construction 2", () => {
    const prime = MersennePrimes.p521();
    const secret = 12345n;
    const S = ShamirPoly.make(secret, 2, prime);
    const k_1 = S.share(1n);
    const k_2 = S.share(2n);
    const recovered = ShamirPoly.recover([[1n, k_1], [2n, k_2]], prime);
    expect(recovered).to.eql(secret);
  });

});

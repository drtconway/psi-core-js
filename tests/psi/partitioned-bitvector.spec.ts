import { PartitionedBitVector } from "./../../src/psi/partitioned-bitvector";

import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;

describe("basic tests", () => {
  it("create 1", () => {
    const P = new PartitionedBitVector(12345n, 2, ["foo", "bar", "baz", "qux", "quux"]);
    const p = P.encode(["foo", "qux", "quux"]);
    expect(p.partitions[0]).to.eql(0);
    expect(p.lengths[1]).to.eql(3);
    expect(p.values[1]).to.eql(5n);
  });
  it("bigger example", () => {
    const vocab: string[] = [
      "Abnormality of humoral immunity",
      "Abnormality of intrinsic muscle of tongue",
      "Abnormality of levator labii superioris alaeque nasi muscle",
      "Abnormality of levator labii superioris",
      "Abnormality of macular pigmentation",
      "Abnormality of male external genitalia",
      "Abnormality of mouth size",
      "Abnormality of muscle of facial expression",
      "Abnormality of muscle size",
      "Abnormality of nasal musculature",
      "Abnormality of neutrophil morphology",
      "Abnormality of ophthalmic artery",
      "Abnormality of pattern reversal visual evoked potentials",
      "Abnormality of peripheral somatosensory evoked potentials",
      "Abnormality of pineal physiology",
      "Abnormality of prenatal development or birth",
      "Abnormality of radial epiphyses",
      "Abnormality of renin-angiotensin system",
      "Abnormality of styloglossus muscle",
      "Abnormality of the Achilles tendon",
      "Abnormality of the anterior commissure",
      "Abnormality of the back musculature",
      "Abnormality of the choanae",
      "Abnormality of the clivus",
      "Abnormality of the epiphyses of the proximal phalanges of the hand",
      "Abnormality of the epiphysis of the 1st metatarsal",
      "Abnormality of the epiphysis of the distal phalanx of the 4th toe",
      "Abnormality of the epiphysis of the distal phalanx of the hallux",
      "Abnormality of the epiphysis of the middle phalanx of the 4th toe",
      "Abnormality of the epiphysis of the proximal phalanx of the 2nd finger",
      "Abnormality of the epiphysis of the proximal phalanx of the 4th finger",
    ];
    const P = new PartitionedBitVector(12345n, 5, vocab);
    const p = P.encode(["Abnormality of styloglossus muscle"]);
    expect(p.partitions[0]).to.eql(0);
    expect(p.lengths[0]).to.eql(6);
    expect(p.values[0]).to.eql(32n);
  });
});

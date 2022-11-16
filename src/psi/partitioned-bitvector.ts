import { createHash } from "crypto";

export class PartitionedBitVector {
  key: string;
  N: number;
  lengths: number[];
  index: {[term:string]: [number, number]};

  constructor(key: bigint, N: number, vocab: readonly string[]) {
    this.key = key.toString();
    this.N = N;
    const pairs: [bigint, string][] = [];
    for (const term of vocab) {
      pairs.push([this.hash(term), term]);
    }
    pairs.sort();
    this.lengths = [];
    this.index = {};
    for (let i = 0; i < N; ++i) {
      this.lengths.push(0);
    }
    const n = BigInt(N);
    for (const item of pairs) {
      const h = item[0];
      const t = item[1];
      const i = Number(h % n);
      const j = this.lengths[i]++;
      this.index[t] = [i, j];
    }
  }

  hash(x: string): bigint {
    const H = createHash("sha256");
    H.update(this.key);
    H.update(x);
    let res: bigint = 0n;
    for (const byte of H.digest()) {
      res = (res << 8n) | BigInt(byte);
    }
    return res;
  }

  encode(terms: readonly string[]) : {partitions: number[], lengths: number[], values: bigint[]} {
    const vectors: bigint[] = [];
    for (let i = 0; i < this.N; ++i) {
      vectors.push(0n);
    }
    for (const term of terms) {
      if (!(term in this.index)) {
        throw new Error(`term not in vocabulary: ${term}`);
      }
      const w = this.index[term];
      const i : number = w[0];
      const j : bigint = BigInt(w[1]);
      vectors[i] |= (1n << j);
    }

    const res : {partitions: number[], lengths: number[], values: bigint[]} = {partitions: [], lengths: [], values: []};
    for (let i = 0; i < this.N; ++i) {
      if (vectors[i] == 0n) {
        continue;
      }
      res.partitions.push(i);
      res.lengths.push(this.lengths[i]);
      res.values.push(vectors[i]);
    }
    return res;
  }
}

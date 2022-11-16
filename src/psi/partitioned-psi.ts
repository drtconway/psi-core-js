import { PaillierCryptosystem, PaillierPublicKey, PaillierEncryptum } from "./paillier";
import { PartitionedBitVector } from "./partitioned-bitvector";

export interface PartitionedPSIEncryptum {
  partitions: number[];
  vectors: PaillierEncryptum[][];
}

export class PartitionedPSI {
  partition: PartitionedBitVector;
  index: string[][][];

  constructor(partitionKey: bigint, numPartitions: number, vocabulary: readonly string[]) {
    this.partition = new PartitionedBitVector(partitionKey, numPartitions, vocabulary);
    this.index = [];
    for (let i = 0; i < numPartitions; ++i) {
      const tmp: string[][] = [];
      for (let j = 0; j < this.partition.lengths[i]; ++j) {
        tmp.push([]);
      }
      this.index.push(tmp);
    }
  }

  encode(pub: PaillierPublicKey, terms: readonly string[]): PartitionedPSIEncryptum {
    const items = this.partition.encode(terms);
    const res: PartitionedPSIEncryptum = { partitions: [], vectors: [] };
    for (let i = 0; i < items.partitions.length; ++i) {
      const p = items.partitions[i];
      const n = items.lengths[i];
      const w = items.values[i];
      const N = BigInt(n);
      const vector: PaillierEncryptum[] = [];
      for (let j = 0n; j < N; ++j) {
        const bit = (w >> j) & 1n;
        vector.push(PaillierCryptosystem.enc(pub, bit));
      }
      res.partitions.push(p);
      res.vectors.push(vector);
    }
    return res;
  }

  cardinality(pub: PaillierPublicKey, other: PartitionedPSIEncryptum, terms: readonly string[]): PaillierEncryptum {
    const items = this.partition.encode(terms);
    let res: PaillierEncryptum = PaillierCryptosystem.enc(pub, 0n);
    let selfPartitionNum: number = 0;
    let otherPartitionNum: number = 0;
    while (selfPartitionNum < items.partitions.length && otherPartitionNum < other.partitions.length) {
      const lhsPartition = items.partitions[selfPartitionNum];
      const rhsPartition = other.partitions[otherPartitionNum];
      if (lhsPartition < rhsPartition) {
        selfPartitionNum += 1;
        continue;
      }
      if (lhsPartition > rhsPartition) {
        otherPartitionNum += 1;
        continue;
      }
      const val = items.values[selfPartitionNum];
      const vec = other.vectors[otherPartitionNum];
      const N = vec.length;
      for (let i = 0; i < N; ++i) {
        if (((1n << BigInt(i)) & val) != 0n) {
          res = PaillierCryptosystem.add(pub, res, vec[i]);
        }
      }
      selfPartitionNum += 1;
      otherPartitionNum += 1;
    }
    return res;
  }

  addSet(label: string, terms: readonly string[]): void {
    const items = this.partition.encode(terms);
    for (let i = 0; i < items.partitions.length; ++i) {
      const p = items.partitions[i];
      const n = items.lengths[i];
      const w = items.values[i];
      const vector: PaillierEncryptum[] = [];
      for (let j = 0; j < n; ++j) {
        if (((1n << BigInt(j)) & w) != 0n) {
          this.index[p][j].push(label);
        }
      }
    }
  }

  cardinalityAll(pub: PaillierPublicKey, other: PartitionedPSIEncryptum): { [label: string]: PaillierEncryptum } {
    const res: { [label: string]: PaillierEncryptum } = {};
    for (let otherPartitionNum = 0; otherPartitionNum < other.partitions.length; ++otherPartitionNum) {
      const p = other.partitions[otherPartitionNum];
      const vec = other.vectors[otherPartitionNum];
      for (let i = 0; i < this.index[p].length; ++i) {
        for (const label of this.index[p][i]) {
          if (!(label in res)) {
            res[label] = PaillierCryptosystem.enc(pub, 0n);
          }
          res[label] = PaillierCryptosystem.add(pub, res[label], vec[i]);
        }
      }
    }
    return res;
  }
}

export class BitVector {
  W: number;
  N: number;
  data: Uint32Array;
  constructor(n?: number) {
    if (!n) {
      n = 0;
    }
    this.W = (n + 31) >> 5;
    this.N = n;
    this.data = new Uint32Array(this.W);
  }

  size(): number {
    return this.N;
  }

  get(idx: number): boolean {
    const w = idx >> 5;
    const b = idx & 31;
    return ((this.data[w] >> b) & 1) > 0;
  }

  set(idx: number, bit: boolean): void {
    const w = idx >> 5;
    const b = idx & 31;
    const v = 1 << b;
    const u = bit ? v : 0;
    const x = this.data[w] - (this.data[w] & v);
    this.data[w] = x | u;
  }

  *each1(): Generator<number> {
    for (let w = 0; w < this.data.length; ++w) {
      for (let b = 0; b < 32; ++b) {
        if (this.data[w] & (1 << b)) {
          yield w * 32 + b;
        }
      }
    }
  }
}

import { BitVector } from "./bitvector";
import { PaillierCryptosystem, PaillierPublicKey, PaillierEncryptum } from "./paillier";

export interface RuanSet {
    items: BitVector
};

export class RuanPSI {
    terms: string[];
    index: {[term:string]: number};

    constructor(terms: Set<string>) {
        this.terms = Array.from(terms).sort();
        this.index = {}
        let i = 0;
        for (const term in terms) {
            this.index[term] = i++;
        }
    }

    prepare(pub: PaillierPublicKey, terms: Set<string>) : PaillierEncryptum[] {
        for (const term in terms) {
            if (!(term in this.index)) {
                throw new Error(`term ${term} not in vocabulary.`);
            }
        }
        const res: PaillierEncryptum[] = [];
        for (let i = 0; i < this.terms.length; ++i) {
            const b_i : bigint = (terms.has(this.terms[i]) ? 1n : 0n);
            res.push(PaillierCryptosystem.enc(pub, b_i));
        }
        return res;
    }

    cardinality(pub: PaillierPublicKey, terms: Set<string>, other: PaillierEncryptum[]) : PaillierEncryptum {
        for (const term in terms) {
            if (!(term in this.index)) {
                throw new Error(`term ${term} not in vocabulary.`);
            }
        }
        if (other.length != this.terms.length) {
            throw new Error(`other set has a domain of size ${other.length} which is different to this set with domain of size ${this.terms.length}`);
        }
        let res = PaillierCryptosystem.enc(pub, 0n);
        for (let i = 0; i < this.terms.length; ++i) {
            const b_i : bigint = (terms.has(this.terms[i]) ? 1n : 0n);
            const t = PaillierCryptosystem.mul(pub, other[i], b_i);
            res = PaillierCryptosystem.add(pub, res, t);
        }
        return res;
    }

    intersect(pub: PaillierPublicKey, terms: Set<string>, other: PaillierEncryptum[]) : PaillierEncryptum[] {
        for (const term in terms) {
            if (!(term in this.index)) {
                throw new Error(`term ${term} not in vocabulary.`);
            }
        }
        if (other.length != this.terms.length) {
            throw new Error(`other set has a domain of size ${other.length} which is different to this set with domain of size ${this.terms.length}`);
        }
        const res: PaillierEncryptum[] = [];
        for (let i = 0; i < this.terms.length; ++i) {
            const b_i : bigint = (terms.has(this.terms[i]) ? 1n : 0n);
            const t = PaillierCryptosystem.mul(pub, other[i], b_i);
            res.push(t);
        }
        return res;
    }
};
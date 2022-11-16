import { RuanPSI } from "./../../src/psi/ruan-psi";
import { PaillierCryptosystem } from "../../src/psi/paillier";

import * as mocha from "mocha";
import * as chai from "chai";

const expect = chai.expect;

describe("basic private set intersection cardinality", async () => {
  it("empty set", async () => {
    const { pub, priv } = await PaillierCryptosystem.keyGen(256);
    const R = new RuanPSI(new Set<string>());
    const c = R.prepare(pub, new Set<string>());
    const r = R.cardinality(pub, new Set<string>(), c);
    const n = PaillierCryptosystem.dec(priv, r);
    expect(n).to.eql(0n);
  });
  it("small set", async () => {
    const { pub, priv } = await PaillierCryptosystem.keyGen(256);
    const R = new RuanPSI(new Set<string>(["foo", "bar", "baz", "qux"]));

    if (true) {
      const c = R.prepare(pub, new Set<string>());
      const r = R.cardinality(pub, new Set<string>(), c);
      const n = PaillierCryptosystem.dec(priv, r);
      expect(n).to.eql(0n);
    }

    if (true) {
      const c = R.prepare(pub, new Set<string>(["foo"]));
      const r = R.cardinality(pub, new Set<string>(), c);
      const n = PaillierCryptosystem.dec(priv, r);
      expect(n).to.eql(0n);
    }

    if (true) {
      const c = R.prepare(pub, new Set<string>());
      const r = R.cardinality(pub, new Set<string>(["foo"]), c);
      const n = PaillierCryptosystem.dec(priv, r);
      expect(n).to.eql(0n);
    }

    if (true) {
      const c = R.prepare(pub, new Set<string>(["foo"]));
      const r = R.cardinality(pub, new Set<string>(["foo"]), c);
      const n = PaillierCryptosystem.dec(priv, r);
      expect(n).to.eql(1n);
    }

    if (true) {
      const c = R.prepare(pub, new Set<string>(["foo", "baz", "qux"]));
      const r = R.cardinality(pub, new Set<string>(["foo", "qux"]), c);
      const n = PaillierCryptosystem.dec(priv, r);
      expect(n).to.eql(2n);
    }

    if (true) {
      const c = R.prepare(pub, new Set<string>(["foo", "qux"]));
      const r = R.cardinality(pub, new Set<string>(["foo", "baz", "qux"]), c);
      const n = PaillierCryptosystem.dec(priv, r);
      expect(n).to.eql(2n);
    }
  });

  it("larger set", async () => {
    const T: string[] = [
      "3-4 finger cutaneous syndactyly",
      "4-5 finger syndactyly",
      "Abdominal aortic aneurysm",
      "Abdominal aortic calcification",
      "Abdominal aortic dissection",
      "Abdominal mass",
      "Abetalipoproteinemia",
      "Abnormal 4th finger morphology",
      "Abnormal 4th metacarpal morphology",
      "Abnormal A-type atrial natriuretic peptide level",
      "Abnormal Bowman capsule morphology",
      "Abnormal CD25 upregulation upon TCR activation",
      "Abnormal CSF amyloid level",
      "Abnormal CSF aromatic amino acid concentration",
      "Abnormal Descemet membrane morphology",
      "Abnormal OCT-measured macular thickness",
      "Abnormal PR interval",
      "Abnormal Schwann cell morphology",
      "Abnormal VLDL cholesterol concentration",
      "Abnormal alpha-beta T cell morphology",
      "Abnormal appendicular skeleton morphology",
      "Abnormal ascending aorta morphology",
      "Abnormal basal ganglia MRI signal intensity",
      "Abnormal blood inorganic cation concentration",
      "Abnormal bone collagen fibril morphology",
      "Abnormal brainstem MRI signal intensity",
      "Abnormal bulbus cordis morphology",
      "Abnormal capillary morphology",
      "Abnormal capillary physiology",
      "Abnormal celiac artery morphology",
      "Abnormal cell proliferation",
      "Abnormal cerebral artery morphology",
      "Abnormal cerebral subcortex morphology",
      "Abnormal cerebral ventricle morphology",
      "Abnormal chylomicron concentration",
      "Abnormal circulating 18-hydroxycorticosterone level",
      "Abnormal circulating IgD level",
      "Abnormal circulating branched chain amino acid concentration",
      "Abnormal circulating carboxylic acid concentration",
      "Abnormal circulating dehydroepiandrosterone concentration",
      "Abnormal circulating eicosanoid concentration",
      "Abnormal circulating free T3 concentration",
      "Abnormal circulating hyaluronic acid concentration",
      "Abnormal circulating lipoprotein lipase concentration",
      "Abnormal circulating long-chain fatty-acid concentration",
      "Abnormal circulating prealbumin concentration",
      "Abnormal circulating properdin level",
      "Abnormal circulating protein concentration",
      "Abnormal circulating proteinogenic amino acid derivative concentration",
      "Abnormal circulating serine family amino acid concentration",
      "Abnormal circulating short-chain fatty-acid concentration",
      "Abnormal circulating valine concentration",
      "Abnormal consumption behavior",
      "Abnormal cricoid cartilage morphology",
      "Abnormal cutaneous collagen fibril morphology",
      "Abnormal cystatin C level",
      "Abnormal cytokine signaling",
      "Abnormal dense granules",
      "Abnormal dentin morphology",
      "Abnormal diffusion weighted cerebral MRI morphology",
      "Abnormal electrooculogram",
      "Abnormal embryonic development",
      "Abnormal endocardium morphology",
      "Abnormal esophagus morphology",
      "Abnormal eyebrow morphology",
      "Abnormal eyelid physiology",
      "Abnormal fecal pH",
      "Abnormal femoral metaphysis morphology",
      "Abnormal fetal physiology",
      "Abnormal fifth cranial nerve physiology",
      "Abnormal forearm bone morphology",
      "Abnormal glucose homeostasis",
      "Abnormal greater palatine artery morphology",
      "Abnormal hand bone ossification",
      "Abnormal hand diaphysis morphology",
      "Abnormal homeostasis",
      "Abnormal humeral head morphology",
      "Abnormal ileum morphology",
      "Abnormal inferior rectus muscle physiology",
      "Abnormal internal genitalia",
      "Abnormal intramembranous ossification",
      "Abnormal involuntary eye movements",
      "Abnormal jejunum morphology",
      "Abnormal lacrimal duct morphology",
      "Abnormal lacrimal punctum morphology",
      "Abnormal large intestine physiology",
      "Abnormal larynx physiology",
      "Abnormal light-adapted single flash electroretinogram",
      "Abnormal localization of kidney",
      "Abnormal lower-limb motor evoked potentials",
      "Abnormal lymphatic vessel morphology",
      "Abnormal male germ cell morphology",
      "Abnormal middle phalanx morphology of the hand",
      "Abnormal mitochondria in muscle tissue",
      "Abnormal mitochondrial shape",
      "Abnormal morphology of musculature of pharynx",
      "Abnormal morphology of phalanx of the 2nd toe",
      "Abnormal morphology of the choroidal vasculature",
      "Abnormal morphology of the conjunctival vasculature",
      "Abnormal morphology of the proximal phalanx of the 3rd toe",
      "Abnormal muscle fiber calpain-3",
      "Abnormal musculoskeletal physiology",
      "Abnormal neuron branching",
      "Abnormal number of incisors",
      "Abnormal number of tubercles",
      "Abnormal ocular adnexa physiology",
      "Abnormal oral glucose tolerance",
      "Abnormal periauricular region morphology",
      "Abnormal peripheral myelination",
      "Abnormal pharynx morphology",
      "Abnormal platelet ATP dense granule secretion",
      "Abnormal platelet function",
      "Abnormal platelet granules",
      "Abnormal platelet lysosome secretion",
      "Abnormal platelet volume",
      "Abnormal proerythroblast morphology",
      "Abnormal prolactin level",
      "Abnormal proportion of CD4-positive helper T cells",
      "Abnormal proportion of central memory CD4-positive, alpha-beta T cells",
      "Abnormal proportion of gamma-delta T cells",
      "Abnormal pulmonary valve morphology",
      "Abnormal renal insterstitial morphology",
      "Abnormal renal pelvis morphology",
      "Abnormal response to short acting pulmonary vasodilator",
      "Abnormal sacral segmentation",
      "Abnormal sarcomere morphology",
      "Abnormal sex determination",
      "Abnormal skinfold thickness measurement",
      "Abnormal speech prosody",
      "Abnormal stool composition",
      "Abnormal subcutaneous fat tissue distribution",
      "Abnormal sudomotor regulation",
      "Abnormal superoxide dismutase level",
      "Abnormal synovial bursa morphology",
      "Abnormal thalamic size",
      "Abnormal thoracic spine morphology",
      "Abnormal timing of flash visual evoked potentials",
      "Abnormal toenail morphology",
      "Abnormal total iron binding capacity",
      "Abnormal triceps skinfold thickness",
      "Abnormal tricuspid chordae tendinae morphology",
      "Abnormal ulnar metaphysis morphology",
      "Abnormal umbilical cord blood vessel morphology",
      "Abnormal upper limb bone morphology",
      "Abnormal urinary nucleobase concentration",
      "Abnormal urine magnesium concentration",
      "Abnormal urine output",
      "Abnormal uterus morphology",
      "Abnormal uvea morphology",
      "Abnormal vasa vasorum morphology",
      "Abnormal vena cava morphology",
      "Abnormal waist to hip ratio",
      "Abnormal zygomatic arch morphology",
      "Abnormality of B cell physiology",
      "Abnormality of DNA repair",
      "Abnormality of binocular vision",
      "Abnormality of buccinator muscle",
      "Abnormality of cervical plexus",
      "Abnormality of chemokine secretion",
      "Abnormality of dental structure",
      "Abnormality of dorsoventral patterning of the limbs",
      "Abnormality of external jugular vein",
      "Abnormality of female external genitalia",
      "Abnormality of hair texture",
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
      "Abnormality of the external nose",
      "Abnormality of the extrinsic pathway",
      "Abnormality of the humeroradial joint",
      "Abnormality of the knee",
      "Abnormality of the lower limb",
      "Abnormality of the lunate bone",
      "Abnormality of the lymph nodes",
      "Abnormality of the middle phalanx of the 4th toe",
      "Abnormality of the nasal alae",
      "Abnormality of the nasal tip",
      "Abnormality of the neck",
      "Abnormality of the parathyroid physiology",
      "Abnormality of the phalanges of the toes",
      "Abnormality of the pharynx",
      "Abnormality of the proximal humeral epiphysis",
      "Abnormality of the proximal phalanx of the thumb",
      "Abnormality of the sublingual glands",
      "Abnormality of the twelfth cranial nerve",
      "Abnormality of the voice",
      "Abnormality of urine bicarbonate level",
      "Abnormally prominent line of Schwalbe",
      "Abnormally shaped carpal bones",
      "Absence of bactericidal oxidative respiratory burst in phagocytes",
      "Absence of intermediate von Willibrand factor multimers",
      "Absence of intrinsic factor",
      "Absence of the third cerebral ventricle",
      "Absent Birbeck granules in Langerhans cells",
      "Absent cervical vertebra",
      "Absent coronary sinus",
      "Absent epiphyses of the 3rd toe",
      "Absent epiphysis of the 1st metacarpal",
      "Absent epiphysis of the middle phalanx of the 2nd finger",
      "Absent epiphysis of the proximal phalanx of the 4th toe",
      "Absent epiphysis of the proximal phalanx of the hallux",
      "Absent glenoid fossa",
      "Absent humerus",
      "Absent keratohyalin granules",
      "Absent nail of hallux",
      "Absent nasal septal cartilage",
      "Absent neutrophil lactoferrin",
      "Absent or minimally ossified vertebral bodies",
      "Absent ossification of the trapezium",
      "Absent peripheral lymph nodes in presence of infection",
      "Absent pigmentation of the limbs",
      "Absent platelet dense granules",
      "Absent proximal phalanx of the 3rd toe",
      "Absent proximal phalanx of thumb",
      "Absent retinal pigment epithelium",
      "Absent styloid process of ulna",
      "Absent urinary urothione",
      "Absent/hypoplastic coccyx",
    ];
    const key0 = performance.now();
    const { pub, priv } = await PaillierCryptosystem.keyGen(256);
    const key1 = performance.now();
    const R = new RuanPSI(new Set<string>(T));
    for (let n = 0; n < 1; ++n) {
      const t: Set<string> = new Set<string>();
      const u: Set<string> = new Set<string>();
      let v = 0;
      for (let i = 0; i < T.length; ++i) {
        if (Math.random() < 0.5) {
          t.add(T[i]);
        }
        if (Math.random() < 0.25) {
          u.add(T[i]);
        }
        if (t.has(T[i]) && u.has(T[i])) {
          v += 1;
        }
      }
      const now0 = performance.now();
      const c = R.prepare(pub, new Set<string>(t));
      const now1 = performance.now();
      const r = R.cardinality(pub, new Set<string>(u), c);
      const now2 = performance.now();
      const j = PaillierCryptosystem.dec(priv, r);
      const now3 = performance.now();
      expect(j).to.eql(BigInt(v));
    }
  }).timeout(20000);
});

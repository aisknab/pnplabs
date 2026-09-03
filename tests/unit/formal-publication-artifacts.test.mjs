import test from "node:test";
import assert from "node:assert/strict";
import { cpSync, linkSync, mkdtempSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { verifyReleaseSeal } from "../../tools/verify-release-seal.mjs";
import { writeMirrorFileAtomically } from "../../tools/sync-public-access-docs.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const canonicalRelease = JSON.parse(readFileSync(path.join(root, "downloads/formal-publication-release.json"), "utf8"));
const canonicalSeal = JSON.parse(readFileSync(path.join(root, "downloads/release-seal.json"), "utf8"));
const SEALED_PATHS = [
  "downloads/release-seal.json",
  "downloads/SHA256SUMS",
  "downloads/canonical_proof_report.pdf",
  "downloads/canonical-proof-report.pdf",
  "downloads/canonical_proof_report.tex",
  "downloads/canonical-proof-report.tex",
  "downloads/formal-publication-release.json",
  "downloads/source-checker-release.json",
  "public/pnp-status.json",
  "public/pnp-theorem-inventory.json",
  "public/pnp-proof-progress.json"
];

const LOCKED_NAND_SOURCE_PARSER_HASHES = {
  "PNP.Concrete.LockedNAND.SourceParser.acceptedTape_outputBits": "d701ab9e34ecabc1d16ea08faa44671e875b59bd6133b11e2fcf7e020d3e1634",
  "PNP.Concrete.LockedNAND.SourceParser.allInput_exact": "78d0acb8ae788b9216e67ac5be635c1d0f34953e1bc57c9b6e884d7f04d54a03",
  "PNP.Concrete.LockedNAND.SourceParser.canonicalSteps_le_validWorkBound": "28467e05ff2e43332360757992c3cd5850a45f3ef7d3fb48bebac47ad090a2ff",
  "PNP.Concrete.LockedNAND.SourceParser.compiledBoundedDecide_accept_iff": "55182cfbf83ffaf4a839519e7fceccc72378c5a5b0993dda4a48fb16888cb82c",
  "PNP.Concrete.LockedNAND.SourceParser.compiledBoundedDecide_ne_timeout": "f8a1ccfa5a54373f004c1973a2115fe51bd6f53403cc6f72de4dfc3e01cc6ad9",
  "PNP.Concrete.LockedNAND.SourceParser.compiledMachineOutput_eq_validatedSourceBytes": "adc61884c960f3eb7c1a6a32e3383b23f33f581685509f7f40c4d4c14e05bcf0",
  "PNP.Concrete.LockedNAND.SourceParser.compiledStart_blankEquivalent": "453d8927f184e5f25c348ce8a7d80b1668044759e265c0f9306b2ce03e9642da",
  "PNP.Concrete.LockedNAND.SourceParser.decodeCircuitTokens_eq_none_iff_failure": "12ba3b565d2c3c1d7d7e49e902ea626da22e434b85fe2305dc8b203c46d98485",
  "PNP.Concrete.LockedNAND.SourceParser.illFormed_exact": "9a5f16bda1ce85f865517b78762bdf5c665748edb297920d211ac2aca6016625",
  "PNP.Concrete.LockedNAND.SourceParser.machine_acceptState_ne_rejectState": "9cd9ae748e010284b27d3cde34af163c0250dfc15dd20dde8bb8d7971849cc74",
  "PNP.Concrete.LockedNAND.SourceParser.malformed_exact": "62e8161b3a17d5aab547da24f4eb7e53db5f645a42f5fd79a748d20d7ad73c89",
  "PNP.Concrete.LockedNAND.SourceParser.rules_length": "eee4e770ed3bd75cd5a13135decf7feac2c03dc8c76bc3f09e24520a831d72a8",
  "PNP.Concrete.LockedNAND.SourceParser.rules_pairwise_query_distinct": "3b03582def97acf6905f685fff8c51a7aa89a339fa30842cb33f6cb3053fa879",
  "PNP.Concrete.LockedNAND.SourceParser.statePrograms_length": "e9c49bf192094aadf7c4fe4047ffa0eb700e81962aa17d16ea2ad26594e40c7e",
  "PNP.Concrete.LockedNAND.SourceParser.validFinalConfiguration_isHalted": "29e6b966bbdbec361b56a604a2a4f9bf9a7e67029089eaa25546bf7eb34a49e4",
  "PNP.Concrete.LockedNAND.SourceParser.validFinalConfiguration_state": "df16e89b9b9047047bcf3ef4edae078a0aabc845e1d82a4a0c990b2b3464868d",
  "PNP.Concrete.LockedNAND.SourceParser.validRawBound_eq": "6a31cd6fb0d34dab788f6be4ad428f9bbcac5c4fd35ef29bf90d33cf39743bc4",
  "PNP.Concrete.LockedNAND.SourceParser.validRawTimePolynomial_eval": "2eece133162707f053182b7b838877dd2f63eea10dfc2005e4a1fc001302dc43",
  "PNP.Concrete.LockedNAND.SourceParser.validatedSourceBytesPolynomialTimeFunction_output": "c80a0e9b2352eb5029cc5538d2962a0bbd9fb3cbea93641eba66d6386255d899",
  "PNP.Concrete.LockedNAND.SourceParser.wellFormed_exact": "df3b9bffacae9dd23069ac927ea471b6e72d1a548cd9e0c2a53885386348905f"
};

const LOCKED_NAND_TARGET_EMITTER_HASHES = {
  "PNP.Concrete.LockedNAND.RawBuilder.rawLockedInstance_of_elaborate": "410e04af4a9b137bd47635b19e695c71147c4405583b0736a39ba58ad388506b",
  "PNP.Concrete.LockedNAND.RawBuilder.targetBytes_of_elaborated": "f9a282f4879b6d5596f53e5a3b99ee98db4f5e1f2722fecac4a6e10f4c762deb",
  "PNP.Concrete.LockedNAND.TargetEmitterSpec.targetBytes_validatedSourceBytes_eq_buildLockedNANDInstance": "67c5835f004ab60ad25c0eda51d4ca58c31d5fa55aa572a04e7c519363198566",
  "PNP.Concrete.LockedNAND.TargetEmitterSpec.targetBytes_size_le": "8763f76ef018efee23d75d56ced5fcb95931c1988c21cb968320e4e7e33000d1",
  "PNP.Concrete.LockedNAND.TargetEmitterController.rules_length_literal": "be15b34e4ded6214d8b15c45725d47d41325610196625956d9ae05ce6f77cdde",
  "PNP.Concrete.LockedNAND.TargetEmitterController.rules_pairwise": "e47261dd3ffee0b8214691a1ee4800727b2f8d0ab200855c55c954da3b9461d1",
  "PNP.Concrete.LockedNAND.TargetEmitterController.machine_accept_ne_reject": "973fef5626508cec7d4669f64acbf335e59db1d9018ed03ceaa8739b341dfe3e",
  "PNP.Concrete.LockedNAND.TargetEmitterController.graph_wellFormed": "35f63a3f9e96ad6d23de3451840976260c470d151b10d07ed08e6697d6391062",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerTotalTrace.malformed_bounded_exact": "0c157c96053eed2509d59b5005f954827252bd8f2ec7c1f19f48e0fd2d462f52",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerTotalTrace.decoded_bounded_exact": "218c43a2a0d38a10db5f7398e274e0fb17b44d29d96c6a4bb3ef6f0dd36b68be",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerTotalTrace.allInput_bounded_exact": "425554a8a20634d54973646a441992513bd246a2a711b96f303713fa7e081f30",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.controllerWorkTimePolynomial_eval": "4ec2fa481ee9f6724dec27746336a71e98d6842620b6d2b45273072c7731706e",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.allInputWorkTimePolynomial_eval": "5adb93ae0b5b9996c74070ccfa46b0198346a7002d229fd3bd36e1c99c54773e",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.compiledRawTimePolynomial_eval": "527d372415697449e6c2e5eb64ee377d796e8c51a76160f367d9bcafe2ccbdcd",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.controller_complete_path_polynomial": "ad1d4ddbef30a832fb196b55e1fcf5ce8abc50c21bd49db72e918ccfe70b47e6",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.controllerUniformEnvelope_le_workBound": "95c0eb505393381addefd66169dbac9c06371fe60e65a3f86c30715c220a8fb3",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledStart_blankEquivalent": "b3b81f2ee30d2e4aa571de167efaa0a2f16536c1e50a60abeaa56bd97b907334",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledMachineOutput_eq_targetBytes": "ae3a4411ddd6004296482add2919f8df4cce41198af5adf1c547f23dcfed94db",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledBoundedDecide_accept_iff": "d4f25aa62fce0ca4a0a0f29c9f96556f2ac5f86db468086d73f59b9fa8088d07",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledBoundedDecide_ne_timeout": "cc085d777394cfe297cc82a90518b701a3378e8d7e541cd20ef862fab423fad9",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.rawTargetBytesPolynomialTimeFunction_output": "b0305c68a488f79ea0628f6e269e19acf6a86513c963e4b457bfc1e689e053f8",
  "PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.strictLockedNANDPolynomialTimeFunction_output": "fa0bf3e4613cf4bd3d15ff0e6423798455fc4690673e81e5cf84a0cc7932716e"
};

const LOCKED_NAND_POLYNOMIAL_REDUCTION_HASHES = {
  "PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_function": "3e8000fd18d8836c1ae1ded6b3d0bb46d0ea618c31ba32c7f1425773e62d09c3",
  "PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_output": "06df8e094590a5b0bf522a9daf5921a28667c7d44e73d447d9366ae201ca3ef4",
  "PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_correct": "94955e4d9826f8364e0ecae478eb33cc92620403673db079c7f4a961c15b3739",
  "PNP.Concrete.LockedNAND.encodedNANDSAT_reducesTo_encodedLockedNANDThreshold": "6c133d95b3eb1d8d04f89be467dfbe6405883cb352654eacc5b8a23b99857f4d",
  "PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_hasRawRefinement": "9f0b15fadf98e634edafe5d6a2025d1d92424a6876a018802153a96b934b1061"
};

const CNF_TO_NAND_SEMANTIC_COMPILER_HASHES = {
  "PNP.Concrete.CNFToNAND.encodeCNF_of_decodeEncodedCNF": "a56dccb2670f82612e631706445aed45fcb7870cec9ce8870554c815c5d4aa90",
  "PNP.Concrete.CNFToNAND.compileFormula_inputCount": "0566e8b291362fd0023cc14515b93a449204aa5d451206dd3aca5e152b5abe74",
  "PNP.Concrete.CNFToNAND.compileFormula_output_is_gate": "9ff1cc16506ef47f17bdd42960f6f4b85e4c4e9ecd9de910b92483316228ed10",
  "PNP.Concrete.CNFToNAND.compileFormula_wellFormed": "9439a0166de39d674eda4a8abe58c327e24770275a66ef2e9743c35d6787eb21",
  "PNP.Concrete.CNFToNAND.decodeValidCircuit_encode_compileFormula": "940fc051622b0bb5c58436f9ca129af5511112177e0782b7294148ece316f0d1",
  "PNP.Concrete.CNFToNAND.compiledFormulaCircuit_eval_eq_true_iff": "b7eb59df8c9fb1db41a4ec32ea35d39cae0db546f0bb81c943d588f374980a86",
  "PNP.Concrete.CNFToNAND.compiledFormulaCircuit_satisfiable_iff": "e88dc11492aa681196b6526402055d972f7fed4f6118b5e93d6f1033321f8aa9",
  "PNP.Concrete.CNFToNAND.compileFormula_satisfiable_iff": "18b7fb6b9f883d2856b4e38cf6591445faa85f25e4bab179c264abc520716d2d",
  "PNP.Concrete.CNFToNAND.formula_satisfiable_iff_encoded_compileFormula": "9e6f42889012c0fbd90718bce18ce1619d598934ced43411bc1a775bb80227dd",
  "PNP.Concrete.CNFToNAND.compileFormula_gateCount_exact": "6dc747fb980879b6d3287df260f0479a7be14e1dd332e1aa6b1a93663479b5cf",
  "PNP.Concrete.CNFToNAND.compileFormula_gateCount_le": "fa1d6ec0c97350b579845b511886aa2d22fda309dd836d1eecbf297d361306c8",
  "PNP.Concrete.CNFToNAND.cnfToNANDOutputSizePolynomial_eval": "b9f50a2ab6dc7e2b96c7a56a96ca0dffaa550fe6a5c04dc500cf87ea14f1b58b",
  "PNP.Concrete.CNFToNAND.compileEncodedCNFToNAND_of_decoded": "0cf6b70c9198e4411b395824caf260f261c87f685be51973e6f101067a30a719",
  "PNP.Concrete.CNFToNAND.compileEncodedCNFToNAND_of_malformed": "02fc5a015699e63deae7a9fbe7beebdca95cd10a82d60f59975d6b8e14e88c05",
  "PNP.Concrete.CNFToNAND.compileEncodedCNFToNAND_size_le": "68456996b2894d4cbc340933f7402800819efedf189f30d36bfb28caaec3fa0a",
  "PNP.Concrete.CNFToNAND.empty_not_encodedNANDSAT": "6b3b3fc1a2556e9a85328c445ae1f7eacb64ea34ae093d5871e5e2a94560e9b2",
  "PNP.Concrete.CNFToNAND.compileEncodedCNFToNAND_correct": "00ca8667e061fcec81bba0b667b00c5d079bac3be6d822bbef8143128e3ef378",
  "PNP.Concrete.CNFToNAND.buildLockedNANDFromCNF_correct": "bec1b560f9aca586a63372b66d117b7e41bb2830244651a046c8c5604cb83bb7"
};

const CNF_TO_NAND_POLYNOMIAL_REDUCTION_HASHES = {
  "PNP.Concrete.CNFSourceParser.allInput_exact": "fabf09b239a30206fd954638cb4b6bcab14a01d8de061fd14256a533dba6c434",
  "PNP.Concrete.CNFSourceParser.compiledMachineOutput_eq_validatedCNFBytes": "eac4855420429c6ccc98e381534f870f8a14fbb9e04d200940934892e674f997",
  "PNP.Concrete.CNFSourceParser.compiledBoundedDecide_ne_timeout": "b53d4b484be3ed5e2d1f7374561a0e2e9774c54cbf8a4358e2aa2d20aa0dba28",
  "PNP.Concrete.CNFToNANDCarrierEncoder.canonical_exact": "1011b1659187ad69f11c8ec1041beb3960095d7770a5060a86d4fcc02c6ae767",
  "PNP.Concrete.CNFToNANDCarrierEncoder.canonicalWorkSteps_polynomial_bound": "35abeeed863b558d7609db62e3fcbdfcf4d4519195d8a8c9d95e5c5a214a8418",
  "PNP.Concrete.CNFToNANDWorkspace.exact_execution_output": "c18b2463f9ba766aa9919b784868275d63ec6d121704e07f162099aa2c5671ea",
  "PNP.Concrete.CNFToNANDController.rules_length_literal": "b7a6f2c3f91c9f54be6d9e9e1026b33b8c0111d74be783e40fcca363b3dace40",
  "PNP.Concrete.CNFToNANDControllerTotalTrace.canonical_path": "13d4e3c6ae39fae86825806e6d8e98c2b5f9729930d4bab787bb4aa445856f65",
  "PNP.Concrete.CNFToNANDControllerTotalTrace.canonical_bounded_exact": "31bc22ce4c93dbbc0fa17e89354e6c64088b8df5d9ec6fe2354ae28cb3df483f",
  "PNP.Concrete.CNFToNANDCompilerMachine.rules_length_literal": "d0b8f3d3224541b58d7a779edb0fb108e5cd286191a297a297e572141409780b",
  "PNP.Concrete.CNFToNANDCompilerTotalTrace.malformed_bounded_exact": "86a5b7354a461736a5ec98db75864d8fc923fac4e0efaa08740dee8d82db9d8d",
  "PNP.Concrete.CNFToNANDCompilerTotalTrace.decoded_bounded_exact": "be2c9ff9aca1e3be1615dd8c7b2a56294794d42f2b46e8838a6b3cc56070f852",
  "PNP.Concrete.CNFToNANDCompilerTotalTrace.allInput_bounded_exact": "341e4379db02ad188111d7d0f4998f8353f1456d43cbaf88a4c16d0e69414161",
  "PNP.Concrete.CNFToNANDCompilerPolynomialBound.allInputWorkTimePolynomial_eval": "45b7598b215b193e767ccb5acd47eb7ee54499c56f31c64476e08a494e4251f1",
  "PNP.Concrete.CNFToNANDCompilerPolynomialBound.compiledRawTimePolynomial_eval": "4a97fa944421808923a6e288992ea71c047875ba291142a4a594b3fb25eeaf34",
  "PNP.Concrete.CNFToNANDCompilerCompiled.compiledMachineOutput_eq_compileEncodedCNFToNAND": "6878d3576e74856d76fead6619d8eb6df64b25935b0eea6921f08221de19094f",
  "PNP.Concrete.CNFToNANDCompilerCompiled.compiledBoundedDecide_accept_iff": "53e14a9b3fe9b9f3e1c7d917405e8ea049909de164dc1ac44a1b82c3353a7461",
  "PNP.Concrete.CNFToNANDCompilerCompiled.compiledBoundedDecide_ne_timeout": "a733db3c994ab97ceb089f9e8d3c92d74ad835caf7417e6becd25c52b533803d",
  "PNP.Concrete.CNFToNANDCompilerCompiled.cnfToNANDPolynomialTimeFunction_output": "a5f03860069e91fd93687f187af204dc6d5cb836217f57a97c7f6c65b92de90f",
  "PNP.Concrete.CNFToNAND.cnfToNANDPolynomialReduction_function": "b386bdd8592653d91dfd1807ec89c37a16742b7802157198a423c8935b944762",
  "PNP.Concrete.CNFToNAND.cnfToNANDPolynomialReduction_output": "9b669178316dc83edb173c6d413caaa362b896de656e95f50799cfa78a991cbf",
  "PNP.Concrete.CNFToNAND.cnfToNANDPolynomialReduction_correct": "b8d9bdee2a2b5b00f542cee4ccee1f22353c8333e1f3cb58492b3c9c6a441e6d",
  "PNP.Concrete.CNFToNAND.cnfSAT_reducesTo_encodedNANDSAT": "c02c6c4348f7da3bc683db412dc9bde7ebf34e2350f2742cda2e07272117214c",
  "PNP.Concrete.CNFToNAND.cnfToNANDPolynomialReduction_hasRawRefinement": "d7a790335337e9ba0a3eaba84b27b8dec690a0abe9fea69d5a6017f7ac445935",
  "PNP.Concrete.CNFToNAND.cnfToLockedNANDPolynomialReduction_output": "f2f51f52a39307bd2d5508960084e0ddf23ad9502a87ec169509d75734d5d5fe",
  "PNP.Concrete.CNFToNAND.cnfToLockedNANDPolynomialReduction_correct": "ed49b9d58aa5d515626030b14b58bd94a9fa17dc3f0fb10258e84a1ecfa9ef9b",
  "PNP.Concrete.CNFToNAND.cnfSAT_reducesTo_encodedLockedNANDThreshold": "835669097f31eea9bfae1571e7dbfea5e310489c4fd18cb41edbfa561fb924e6",
  "PNP.Concrete.CNFToNAND.cnfToLockedNANDPolynomialReduction_hasRawRefinement": "73ef05c12f8b87d3867e46b3a2c555adad77f1a9c49c0f1c7827cea11e7965cf"
};

const RESIDUAL_GAIN_CHAIN_THEOREM_SHA256 = {
  "PNP.DirectWire.StrictEquivalentGain.strictResidualDescent": "f936c792a4f8f45d27da4512b16ba28222dc64b81f50016c9d30433fbfadae6e",
  "PNP.DirectWire.strictGainChainBool_eq_true_iff": "816e54e4531107de91901686549b1c2e040df4feef9b16b066592bd999a04898",
  "PNP.DirectWire.StrictGainChain.end_equivalent": "16d9be66d41e255a85e99776eae299ede9b96fbb4a52b092975ba2668e955782",
  "PNP.DirectWire.StrictGainChain.end_referenceMinimum_eq": "f5d2b9c7314081efa5545b0244c69f7cb1913724d67882b0973241106edd37c0",
  "PNP.DirectWire.StrictGainChain.end_residualSlack_add_length_le": "3d9578eb0b87eaae79f3d0fefb693d4e45a44bfda7c9237e38fdc4429db8a968",
  "PNP.DirectWire.StrictGainChain.length_le_residualSlack": "a9ae79ffa40af537d1e2b54bcec4f2733bddbf7c20b0799dc031e61d410cf20e",
  "PNP.DirectWire.strictGainChainBool_length_le_residualSlack": "20c5ad2948288e7607ef952b5f155133fb4b9ed18e4e8690bddbf993c8c8b535",
  "PNP.DirectWire.strictGainChainBool_length_le_of_residualSlack_le": "a3963469939a052165f47d2aca5171bf5fa934483d25ab91451df2674a9b0f87",
  "PNP.DirectWire.StrictGainChain.eq_nil_of_residualSlack_eq_zero": "f0ad692f62354727bdb5e3f44617f8ad5decf5ad1b25d0c03912dbec38d38d07",
  "PNP.DirectWire.strictGainChainBool_eq_nil_of_residualSlack_eq_zero": "66812e7f8c2f41711af1788bbf9871959030891d88554aa9a5b6beb56ef1a65b",
  "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_residualSlack_le_four": "2e2c9cab0c3977704f66cb272e972e949cd7bbd899487c1cc9ba3527ef2d9e0a",
  "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidateImplementation_residualSlack_le_four": "0a138524071766b4eb12d0de6550bcf776d948bb4df133619387a4f9781e98ff",
  "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_strictGainChain_length_le_four": "dc3962312e29cc2ea9b36aeb4b6fc2fa4626d7e72053838d317636a61b68fe9c",
  "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_strictGainChainBool_length_le_four": "6424411112c8f2316541d234cf90b37cb807b7ec38cca84e52edfe6af98fe750"
};

const RESIDUAL_GAIN_STOPPING_THEOREM_SHA256 = {
  "PNP.DirectWire.referenceMinimumImplementation_gateCount_eq_referenceMinimum": "d94a3b2887fb9c25feef33c7474419851d6516b8647e2638ac67e526c4512480",
  "PNP.DirectWire.referenceMinimumImplementation_equivalent": "dbbb97229e4cc25be761758a73728b6801d96cacc8c1b2f8c1dd2950c29bdf64",
  "PNP.DirectWire.referenceMinimumImplementation_isSemanticallyMinimum": "f3c4b31840dc29d0636cb49760894393c06801381abf74353dc57d3a0755affa",
  "PNP.DirectWire.referenceMinimumImplementation_residualSlack_eq_zero": "20d2abe2e74494d70b5e7516f3727e8cf19893cb4449a0c78b2d6280489feca9",
  "PNP.DirectWire.referenceMinimumImplementation_strictEquivalentGain_of_residualSlack_pos": "2eab777e2469136148219b5883ecc42b8cc630d9d71c2ede182b46bddf642198",
  "PNP.DirectWire.residualSlack_pos_iff_exists_strictEquivalentGain": "fcdc9fe1d4bd4c75f9b08a2a2ced36009344d52c11cb14506eb325f516e40612",
  "PNP.DirectWire.residualSlack_eq_zero_iff_forall_not_strictEquivalentGain": "9b656ab2415d453f6db8fcf47f45d82e22d51383e6f7885cdb7fb78139409094",
  "PNP.DirectWire.isSemanticallyMinimum_iff_forall_not_strictEquivalentGain": "c292c91ea97e54e8fa2d1ca5989b2ffd67d386e81ecfc138d66bcbe9635c7991",
  "PNP.DirectWire.StrictGainChain.end_residualSlack_eq_zero_of_no_strictEquivalentGain": "7e70d84ebd96fc91004f391498a0ba3869902abc56060ab5517dc38d0f0b06cd",
  "PNP.DirectWire.strictGainChainBool_end_residualSlack_eq_zero_of_no_strictEquivalentGain": "0f14074de58498b3edef73c065b3520fa9827229b32643a865338c16ae05f592"
};

const RESIDUAL_TERMINAL_FULL_BRIDGE_THEOREM_SHA256 = {
  "PNP.DirectWire.terminalize_implementation": "f8b947cab5adb66f9a7314b3522f9e96a083ff752df2bb7f26e09bf8159a40c5",
  "PNP.DirectWire.terminalize_gateCount": "05ffc10d0fcfd63531119a3a7ff69baf871d270412c93d345e45dc1167dc1aee",
  "PNP.DirectWire.TerminalFullRealization.realize_equivalent": "28387dc9783f19113dfc9ec147d7d0d8b6906753e823698e024c3fd14edc0ac7",
  "PNP.DirectWire.TerminalFullRealization.realize_semantics": "16d7dd8e293e851e41d5d0552dfadbd8f9eb8df41f5f1731d062960e1d8ff3c1",
  "PNP.DirectWire.referenceMinimumTerminalFullRealization_gateCount": "611b799ecb526556008906dfaa5964738cbbfdcc7aea67d8b7ead15e27e4b034",
  "PNP.DirectWire.terminalFullMinimum_eq_referenceMinimum": "1953784d386ebbde2afe37cdcf4967bd4864109a7e6a54ceac1e6b3a1eb1cc5d",
  "PNP.DirectWire.terminalFullMinimum_spec": "d4c836a72896091bb8a0215b7f9c274803f9ca36b28ee2ada0f0d37177280520",
  "PNP.DirectWire.isTerminalFullMinimum_iff_eq_terminalFullMinimum": "670efe7841d43136a86f95b26c7657f988977bb44ed3b7ad4bf6927bc827cf50",
  "PNP.DirectWire.isTerminalFullMinimum_iff_eq_referenceMinimum": "a2314e7b4616021b9be832aabb457aacb4cb9d8118c4450ab9968b897071623a",
  "PNP.DirectWire.WholeSpanResidualWitness.strictResidualDescent": "bbeb896c3ba81d61e882ef600de8617bae37133f66c8cb7f905ebaa65d5460ce",
  "PNP.DirectWire.residualSlack_pos_iff_exists_wholeSpanResidualWitness": "5985189a869a695293db92b5eb83f0df69950e46cfc724717aecf640e46ef55b",
  "PNP.DirectWire.residualSlack_eq_zero_iff_no_wholeSpanResidualWitness": "10aff27f1c17c1ccac09b400590400a56f9c6db6ab744db6f311c0e1f5083513",
  "PNP.DirectWire.StrictEquivalentGain.strictResidualDescent": "f936c792a4f8f45d27da4512b16ba28222dc64b81f50016c9d30433fbfadae6e"
};

const RESIDUAL_TERMINAL_MODE_FIREWALL_THEOREM_SHA256 = {
  "PNP.DirectWire.TerminalFullCarrierRealization.project_realization": "e18ceb7862c428c17a83e7709f12149179b9618aecdb92de9885dec5a7a6cf8a",
  "PNP.DirectWire.TerminalFullCarrierRealization.project_implementation": "4adb38449d826339de7be4ef2f076ee3a96bf5da4b0fff319ef956391012acf5",
  "PNP.DirectWire.TerminalFullCarrierRealization.project_gateCount": "cf7fb7ec364e8a65984ac9001ea5f4653959f2d0599ad0706aed74bd970a3551",
  "PNP.DirectWire.TerminalFullCarrierRealization.project_equivalent": "79c2680c1645a5bb087ae3786eba52204e2297ebcc8049a8f4103603c9343a08",
  "PNP.DirectWire.TerminalFullCarrierRealization.project_semantics": "bcc4254513f072db91e3757f0c3962d757480d72d4270b91139a6bf57a325ee6",
  "PNP.DirectWire.TerminalCheckedFullLift.fullRealization_realization": "1f98a1fbc39672b171e5d1a5f6f1716c785dbcf128c24c3071802e7fbf5d0caf",
  "PNP.DirectWire.TerminalCheckedFullLift.fullRealization_profileEqual": "ee608d7e17b2846b5a87c15b8e6874ac7de023798ebdd827994e9503dc43d7c1",
  "PNP.DirectWire.terminalCheckedFullLift_iff_fullProfileEqual": "a038fc4300e2f93af3cdac76907511237e0dd6d6b9e0d3015a7301b82ce8d899",
  "PNP.DirectWire.TerminalQuotientComparison.checkedFullLift_of_keepsAll": "22011cdf57634577ca660f526487e3a2a309c716c5ab419a201bc323c0c566ca",
  "PNP.DirectWire.TerminalFullCarrierRealization.obligationsDischarged": "44dd06dc5c2d17056eaf5271522830951da6a77bd69fdd28a098880780361d38",
  "PNP.DirectWire.TerminalCheckedFullLift.obligationsDischarged": "619562c57b2ccbe271d44d8902d27c8788a9ee262dfab89059b6bf8164fda69b",
  "PNP.DirectWire.terminalQuotientEqualityNotConstructive": "d9f2582756a57c87b345e1b462ae765c654e719dc56171939ecbf3de8a2c0e1c"
};

const RESIDUAL_TERMINAL_PROJECTION_MINIMUM_THEOREM_SHA256 = {
  "PNP.DirectWire.terminalFullProfileMatchBool_complete": "ce2551dced7c7b0f50749844f9113fcc9d9de4daf288a07f3932874ac5a9467f",
  "PNP.DirectWire.terminalQuotientProfileMatchBool_complete": "bbbe9447463d113efe13ac57c0fbadc387eda47aeb1eef6c08c06e70f885e4c2",
  "PNP.DirectWire.terminalFullProfileMinimumRealization_gateCount": "798da3be48963130ca415d60dbaea20fc06087f64068798e5c62634178d98259",
  "PNP.DirectWire.terminalQuotientProfileMinimumComparison_gateCount": "32349bacfe9e5efd16f42006fe912234b0c7459b66db9905e5c5867a696dba80",
  "PNP.DirectWire.terminalFullProfileMinimum_le": "56059f1da9c8fe821569dc651bb112eef6ad0f056a6496c668ff45250ada6f0e",
  "PNP.DirectWire.terminalQuotientProfileMinimum_le": "ce8486f3b736f1bac59f6a388c73a32d5bfdb4ec64f0994b1ba94fb1c57ab753",
  "PNP.DirectWire.terminalFullProfileMinimum_spec": "aa0ecb861cb6454b659931d96a1bb107edc42902fb0be66ca287b369f2659bfc",
  "PNP.DirectWire.terminalQuotientProfileMinimum_spec": "494e3230379f9fb0bbe634f68987117605fffe8dbcfe130311b2724e9b65c73a",
  "PNP.DirectWire.terminalProjectionMinimum_mono": "c3e9aa3c01a5a9702c311df28dcbadd2a8e8005776418307147b424cc988f034",
  "PNP.DirectWire.terminalQuotientMinimum_add_projectionDefect": "2487f2fa58c556c6166f02e57ed79ed5c1d0e6c2a9ac86fa96630ef10a66d4a0",
  "PNP.DirectWire.terminalProjectionDefect_eq_zero_iff_minima_eq": "0abc70a2376500b301bb104cc45264d70640a8212175fb9c1dba9817bb91059c",
  "PNP.DirectWire.terminalProjectionDefect_eq_zero_iff_exists_checkedFullLiftAtMinimum": "8c1b490e05aca8450c836267b85afeb88f838b5d5b26301599b8392bd0178a17",
  "PNP.DirectWire.terminalProfileMinima_eq_of_keepsAll": "973db9a1c04cce7aa637d65512904844dc9a26e645ed2720d89d3818cdc79c3a",
  "PNP.DirectWire.terminalProjectionDefect_pos_no_checkedFullLiftAtMinimum": "6cb0a806515c14a4b43fdbe133833861a3cb21fdf0d48cd350f93ad8507eace2"
};

const RESIDUAL_TERMINAL_PROJECTION_TRANSFER_THEOREM_SHA256 = {
  "PNP.DirectWire.terminalProjectionDefect_int": "4d4ea43bca6e64d8e7b2867003d8cc32e5b00dc0686a7f99dfb1f1bd369f82bf",
  "PNP.DirectWire.TerminalProjectionFourCorners.transferIdentity": "8a834cd3525cc543e7ec42d58e23836853ad71d0bc2ff97655f7dab1562880ac",
  "PNP.DirectWire.TerminalProjectionFourCorners.constantCutEquation_of_defects": "3924c2b0c70aa6dd413da7141d59aae08668cfdec5ba70273d495e58ff838623",
  "PNP.DirectWire.TerminalProjectionFourCorners.projectionExcess_pos_of_constantCut": "7f7c6eacac8e119e2ee7b56ca03e323fdf7f191d56c0ff5476883dba1a61e7d0"
};

const RESIDUAL_TERMINAL_SATURATION_THEOREM_SHA256 = {
  "PNP.DirectWire.mem_allTerminalPrimitiveRecords": "06dc32945403e76a76eed4fdbe31b1962c878af2cd8c136103fa1243d304a9a6",
  "PNP.DirectWire.terminalSaturate_extensive": "80a5d112df19cb4fd03210ffdd06be067829549a28e2da0746230f79994761fc",
  "PNP.DirectWire.terminalSaturate_closed": "3f4566c23897191ee812427490e9ce9a4df87e90983775289f60a9472895bdf5",
  "PNP.DirectWire.terminalSaturate_least": "0cc287c76c18cfe0b0ce632d92b85e6a8173b9cd0841b8fdfafeffc9cb025790",
  "PNP.DirectWire.terminalSaturate_monotone": "d1bc557a4eb268ad67b96377c3cb668d1d141234cc1548155252f2429f9123ba",
  "PNP.DirectWire.terminalSaturate_idempotent": "60fbcc602264e47fa5fea3bd772bfa344a1a0d6d2086baf3c7ac7b453b7efda0",
  "PNP.DirectWire.terminalSaturate_fixed_iff_closed": "ac4339ee65e025371c429d3de428d39118f9d8d5eba92749fa7b08f8013bd22a"
};

const RESIDUAL_TERMINAL_PHYSICAL_SUPPORT_THEOREM_SHA256 = {
  "PNP.DirectWire.mem_allTerminalSaturationRuleKinds": "03a4d65b659d07d57238bad64dad52372af05333832ea659ac16aec3beadeed3",
  "PNP.DirectWire.terminalSaturationEdge_eq_true_iff": "de000096df6c020f18c90908546b029eea14d9a53f698ead470acea3d19ad1a5",
  "PNP.DirectWire.terminalSaturateRecords_extensive": "533849d672d9c5ee45392918c55c9ca1368d31e648907bf7dc84e91216c94931",
  "PNP.DirectWire.terminalSaturateRecords_sound": "9747453dfa3c380e960cc892ea527f61558d97b8e050260fba2a4e1a213f8abe",
  "PNP.DirectWire.terminalSaturateRecords_closed": "f1b4202a9fa0e8d76c6289201eac729860a7f4735c9700c4299f71e1f1792e6d",
  "PNP.DirectWire.mem_terminalSaturateRecords_iff": "055750aa6beee13c31f532a3f37f67c915a0f6a20ddac7d6f83e5058869db36b",
  "PNP.DirectWire.mem_allTerminalSupportWires": "685c10956690b6971338b1bc1b27dc7b29a585384c6fb58e725d179f71174579",
  "PNP.DirectWire.mem_terminalBoundaryPorts_iff": "96d01f7650e0584503501f4278dc196e1b1a2ea658abf237e99978715d942ef0",
  "PNP.DirectWire.mem_terminalInterfacePorts_iff": "e8b19b45e351818396a7f70d83d1e975bdd50458ad3169fcc68e1a06f7c1c56f",
  "PNP.DirectWire.completeTerminalPhysicalSupport_incoming_complete": "e541fac972a4f9402aab6b47c6aa6164cdf54d5a490beb750a8ddf498719e789",
  "PNP.DirectWire.completeTerminalPhysicalSupport_outgoing_complete": "5955b959132cd6a3f3bf734ea8f62513554f476a2ee7b46a65ff716e9a328b7a",
  "PNP.DirectWire.completeTerminalPhysicalSupport_compatible": "54f14acec8c40024eb7982e02373e24a80e864b0478a7815105f94362601b1fd",
  "PNP.DirectWire.completeSaturatedTerminalPhysicalSupport_records": "619c37407e969a13746611f68b4169ba34a8cac4e6d8a01d5388808eec58fe91",
  "PNP.DirectWire.completeSaturatedTerminalPhysicalSupport_compatible": "831f8ce697624f2e413d5da6a56fde592b2157793a1dd1f4f85060154faafc58"
};

const RESIDUAL_TERMINAL_SUPPORT_EXTRACTION_THEOREM_SHA256 = {
  "PNP.DirectWire.mem_terminalSelectedGateIndices_iff": "9c17551f7f7d9a8da15cb364397d6124d284c2f2d6597c72e44461b723cbee9b",
  "PNP.DirectWire.mem_terminalSelectedGates_iff": "4bd3f8070d99be857317178480d36c74f3a0e4f31b38ac203b0e0167d8bfe4ad",
  "PNP.DirectWire.terminalSelectedGateIndices_nodup": "61042ae3ce4e89b93b89e0cfd634831bb8bdbb32b9aa56270133925cc619e3a2",
  "PNP.DirectWire.terminalSelectedGates_nodup": "9b66acf625cac6a8ff1dc61776a5d7587ebc450c52d25fc6d9ce489743d06218",
  "PNP.DirectWire.extractTerminalSupport_records": "5c4d36bde8f73c2538145253d02166c3a57a0a124642c946c6e730c2f433b922",
  "PNP.DirectWire.extractTerminalSupport_boundary": "e5f448249f881d286621474e9eaf1c283c948e158786b0dc5e099dd7654067f6",
  "PNP.DirectWire.extractTerminalSupport_selectedGates": "bfcf20601e79aa73d4a356d3bc10249b8fea78489c9d7974096b823db8eacf77",
  "PNP.DirectWire.extractTerminalSupport_interface": "39cecfce2d2b432bf93c505270fb0aa619c977c3b740fec778a7458d85522575",
  "PNP.DirectWire.extractTerminalSupport_gateCount": "ac685755287b72523e0364367da6709e68ee888eea8b800e7a32cae01fd46091",
  "PNP.DirectWire.terminalOpenGateEvaluation_induced_selected": "bb2f6309a3166fab1809dba2022e3902612f4350c980db84b15cb992a3c0159a",
  "PNP.DirectWire.terminalOpenSupportSemantics_induced": "e46d98fddc9009109b870a6ce1efd69aecdbc9e9c9408a92d0f9adf214c89031",
  "PNP.DirectWire.extractTerminalSupport_semantics": "9e21282b463db32c23206cdc717d1129077f7c192c813f7ee6bdf6d646970760",
  "PNP.DirectWire.extractTerminalSupport_induced": "019211d25600c1bb6cdbb87609891df9b1bbf7076767ea8ed434a7b9cbede608",
  "PNP.DirectWire.extractSaturatedTerminalSupport_records": "bc3c27d3ad32a56496072c6a07b6e5b6f334101f8d9e1e38e600bc2811e66e77",
  "PNP.DirectWire.extractSaturatedTerminalSupport_gateCount": "18f51c1d2f3a9ddcbf0b625bd5fdb4e48755c43a1d194ab591bd81574cadfa0c",
  "PNP.DirectWire.extractSaturatedTerminalSupport_semantics": "fddf804df49f57bab852950d3e8f3987b9cb8e273eb6cf93ee36c0633d51c529",
  "PNP.DirectWire.extractSaturatedTerminalSupport_induced": "38e1f0d81a820f97d9af5f6453c1f4e52db7893f837b07e0e72e2819975ba7e1",
  "PNP.DirectWire.mem_terminalSaturateRecords_iff": "055750aa6beee13c31f532a3f37f67c915a0f6a20ddac7d6f83e5058869db36b",
  "PNP.DirectWire.completeTerminalPhysicalSupport_incoming_complete": "e541fac972a4f9402aab6b47c6aa6164cdf54d5a490beb750a8ddf498719e789",
  "PNP.DirectWire.completeTerminalPhysicalSupport_compatible": "54f14acec8c40024eb7982e02373e24a80e864b0478a7815105f94362601b1fd",
  "PNP.DirectWire.completeSaturatedTerminalPhysicalSupport_compatible": "831f8ce697624f2e413d5da6a56fde592b2157793a1dd1f4f85060154faafc58"
};

const RESIDUAL_TERMINAL_PROPER_SUPPORT_THEOREM_SHA256 = {
  "PNP.DirectWire.canonicalTerminalSupportSeed_mem": "c0d249acf0ac350b3173daa5b316e6c5a50ef9111348c17a7d1ff15391f28eeb",
  "PNP.DirectWire.mem_canonicalTerminalSupportSeed_iff": "e537f808ddf8f8bce5d0acde5b27fffcd52909e02fad5790fec09b62049d7f7c",
  "PNP.DirectWire.terminalProperPositiveSupportBool_eq_true_iff": "5bd6aa86a355145db2233320bf06c2f430e597dc571c2e0ebee05dadc98e5cf1",
  "PNP.DirectWire.findTerminalProperPositiveSupport_sound": "f9f82d916f1cf7f161bfb2299bcc257c59cd9cdee26dc02592e180afd24ec163",
  "PNP.DirectWire.findTerminalProperPositiveSupport_exists_of_seed": "719584be55ea7342fedd114cb9f425309232e24c3364f89e2a76f8d3fe015399",
  "PNP.DirectWire.findTerminalProperPositiveSupport_eq_none_iff": "05def77103a3282116ffcf39df9cf74aa6ac1ab79148d80c3a0ef3326cb456b5",
  "PNP.DirectWire.findTerminalProperPositiveSupport_unique": "3751b0d5526329014e7cdfb7abf7fef92e2b453263c731fc35cab79bd541f6a7",
  "PNP.DirectWire.TerminalProperPositiveSupport.saturatedRecords_closed": "adef8bf222cacc7e570bc02c5852d644eeec183dcb278c2105bfd655d6bda5e7",
  "PNP.DirectWire.TerminalProperPositiveSupport.physically_compatible": "eb5bd2849c564caa6047404b4426b65d081a1153214db68e0023023a291f15e0",
  "PNP.DirectWire.TerminalProperPositiveSupport.gateCount_bounds": "0ca36fed9df04a741d077954694c84cb6f272661927d4eb1da533f0017238adc",
  "PNP.DirectWire.TerminalProperPositiveSupport.extracted_semantics": "56da805f2e24576e8611631f0d698fe7978557b40a05c0851f058e728303c897",
  "PNP.DirectWire.TerminalProperPositiveSupport.extracted_induced": "f441745ae9aa20dde6d5e64b85193524563bba872224c1250601bba1e583ab65",
  "PNP.DirectWire.TerminalProperPositiveSupport.minimumReplacement_equivalent": "89e2c756c4efeaa1f9a8dc6213ec81d907ee091b97ad3ec1c13dd57720c5949c",
  "PNP.DirectWire.TerminalProperPositiveSupport.referenceMinimum_lt_gateCount": "3c2723813d8698079c9b31f8120b34ec63d9f8d0ad9d5c19726be9ae656c52d7",
  "PNP.DirectWire.TerminalProperPositiveSupport.minimumReplacement_size_lt": "2fc0253f766510bc57b7f490782fac0ea4fc6a1f1d05845a3299c71e8793be23",
  "PNP.DirectWire.mem_terminalSaturateRecords_iff": "055750aa6beee13c31f532a3f37f67c915a0f6a20ddac7d6f83e5058869db36b",
  "PNP.DirectWire.completeSaturatedTerminalPhysicalSupport_compatible": "831f8ce697624f2e413d5da6a56fde592b2157793a1dd1f4f85060154faafc58",
  "PNP.DirectWire.extractSaturatedTerminalSupport_gateCount": "18f51c1d2f3a9ddcbf0b625bd5fdb4e48755c43a1d194ab591bd81574cadfa0c",
  "PNP.DirectWire.extractSaturatedTerminalSupport_semantics": "fddf804df49f57bab852950d3e8f3987b9cb8e273eb6cf93ee36c0633d51c529",
  "PNP.DirectWire.extractSaturatedTerminalSupport_induced": "38e1f0d81a820f97d9af5f6453c1f4e52db7893f837b07e0e72e2819975ba7e1",
  "PNP.DirectWire.Candidate.referenceMinimumReplacement_equivalent": "b6bf39e59f49dd4ba9f43c3e11de934664e2fedb1567862c01e728b90c945704",
  "PNP.DirectWire.Candidate.referenceMinimumReplacement_size": "557ed42fa22eb5375b09ff387166d33a42b42e36cea1a8eeffdd757d2e7886e2"
};

const RESIDUAL_TERMINAL_SUPPORT_SQUARE_THEOREM_SHA256 = {
  "PNP.DirectWire.TerminalSaturatedSupportSquare.mem_meetRecords_iff": "128e80b0165ddfa2cb35006b81a9e5ebd84c910c1108b77bbb21825390b18095",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.leftRecords_closed": "f59ac3baa2ecc92a3aa3b2b5add6b056aae0194cacf649481e6e9df5e8378f5d",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.rightRecords_closed": "7b265271f42eeea6c4cefd9bccacbeb36aafdf55fd37e749635944d4e2073b41",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.meetRecords_closed": "a60d0d31382781261fe6cb2505c68e2767728986db3dd4c47de761206e8416ae",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.mem_joinRecords_iff": "61300043ed1912b7e150c540f0d5ed2137c52e8bae13fe709d6ebed1204b3b51",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.joinRecords_closed": "c73b5108af3e8e3cf169f00d35d00da1d08139c5ec0bc7bb679f1c7f5a800e8b",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.records_closed": "0fb6aed85d2c9d9f5ef89004077552853e3ffaec207f7c2884e033c73067df4f",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.meetRecords_subset_left": "c994d62c2b0f7ed1e5e26ceec8ce6bf9594addbc1fb0dfd7c4264f4702fec5d5",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.meetRecords_subset_right": "d6f06e67286e70ffb4af835cb8e09e3600f731dd47dcc8131decee81c0d261f1",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.leftRecords_subset_join": "0aa25bc4ddcb8832ca9a7ce6e26e41af0ce2a5dab1338553d64cc0c0fa5ccad9",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.rightRecords_subset_join": "7e4b9187bd89b2c5db617c7bb1dbfef0f3789fa233c0ce1fb415261e7b5605e9",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.meetRecords_greatest": "af0233192d9e0c27444c419dc31c006f2097e08f5d28f0c6c76f71c7d520a697",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.joinRecords_least": "902f681c1a3eabe125dafd498dd2832504b1c103d8679054511cdba36a03043d",
  "PNP.DirectWire.terminalSaturateRecords_mem_congr": "0a28a7b60b3958417a6db73a790d6dc1e1ad9decd72cca332c6efac7f14d2137",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.records_congr": "e0a6da317d20f33e135e6feecb6a46a39e514484b6c4c19f8ff0844a709125cc",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.physically_compatible": "2a19ccf8594f3749b91d263b915e1d2156a90ad2681ca6ed527f124de4b564f3",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.extracted_gateCount": "a99ae5f9cd9e1ddcbc3770186f6d61f4f98af03e90926a531c30376c654d65fa",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.extracted_semantics": "7f7a07fdd91014d1e2304d31b437b56984e47da385ef28b783e3049b0db0a589",
  "PNP.DirectWire.TerminalSaturatedSupportSquare.extracted_induced": "583980a05d4a79162b2e6f8118ba306e144738330527743d60199b88ddfdda88",
  "PNP.DirectWire.mem_terminalSaturateRecords_iff": "055750aa6beee13c31f532a3f37f67c915a0f6a20ddac7d6f83e5058869db36b",
  "PNP.DirectWire.completeTerminalPhysicalSupport_compatible": "54f14acec8c40024eb7982e02373e24a80e864b0478a7815105f94362601b1fd",
  "PNP.DirectWire.extractTerminalSupport_semantics": "9e21282b463db32c23206cdc717d1129077f7c192c813f7ee6bdf6d646970760",
  "PNP.DirectWire.extractTerminalSupport_induced": "019211d25600c1bb6cdbb87609891df9b1bbf7076767ea8ed434a7b9cbede608"
};

const RESIDUAL_TERMINAL_GOVERNED_SUPPORT_THEOREMS = {
  "PNP.DirectWire.mem_allTerminalProfileRoles": { hash: "95b57d90a6a83f87c9c36e1ec306cb05fc10870bbab4a206ac751e6f5c12ee0e", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.mem_terminalProfileCoordinatesForRole_iff": { hash: "a6e7958f1f9227d3f0a83ea18c49f88fc81b1f06b16a30436b5f0c73c008dc4c", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.terminalProfileCoordinatesForRole_nodup": { hash: "a5c0d1eac8e390d94a274c75fe0b03b11379680654fea2948246c73ba52852ee", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.completeTerminalGovernedSupport_records": { hash: "fc56858cdef8cb222781fd1998b550ce993c72dc40f1994527dd22f1e61addf4", axioms: [], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalGovernedCompletedSupport.frontier_boundary": { hash: "e340ac8efd05f6760b8c8f18e88a5e80c53c81599e3876913898c167f2308b13", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalGovernedCompletedSupport.frontier_interface": { hash: "d4415e5f4b90980b4170664d526e3c51eec5c6c9013e814e9f4529451fc23792", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalGovernedCompletedSupport.mem_profileCoordinates_iff": { hash: "aff01078ce9ceea7e18afb1ca3c079fec1400eed49b73bb891d347e5883a0178", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalGovernedCompletedSupport.profileCoordinates_nodup": { hash: "f289e58b7c7eeda0ae808b7de5927e2b43f2e426642c45eac7077e2727589d7a", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalGovernedCompletedSupport.mem_own_profile_role_iff": { hash: "ca2efaf1a8993528a20716d0d5b0440e45ed65cd53a39b023002d2c0e862e529", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalGovernedCompletedSupport.profile_role_unique": { hash: "5b437c2f9018649967a5750b40149e52bf06b09ce9d681744cefbd3f722ad055", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalGovernedCompletedSupport.profileCoordinates_disjoint": { hash: "55d53c267bcf9232db61b1b3b519cd2faf9b9d834e30996ab0cfa039c48535c9", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalGovernedCompletedSupport.profile_record_covered_iff": { hash: "ca1b74c7b2a1845ece0b2bad47f9d7773c18fc67539bb477e576b4d155ef92bd", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalGovernedCompletedSupport.required_mem": { hash: "6e9f933d9c34be75ad59d4d7cf8409352d0223c6693361d9d3c3c5b922b6213c", axioms: [], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalGovernedCompletedSupport.required_profile_mem": { hash: "042278fe2f7807016f398ab5e580071f05241e4ecd431b2c23ca133e3852cb69", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.completeSaturatedTerminalGovernedSupport_records": { hash: "9c9d5dd949b1d8b43d815cadac92c5861dd9cd429a75f372a65ebe6c6c07d889", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.completeSaturatedTerminalGovernedSupport_compatible": { hash: "e535f50fdb9045d5e1e45ee4a0fb3490d10e2fe831b53095cb18edbcba3348e8", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_records": { hash: "4e804d18a19d04ab70775d69514903fb5e32f712a54eedf77d4fafe429f07236", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_compatible": { hash: "3d8b72bef8f77704e577cd3377720c41c0e035818fa7d598406e385d8fd05e5d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_profile_iff": { hash: "9736ce34b616c8b00ac7ca4ba123c3c093dc464c1f07a7a0635b5b5bbe28a9dd", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_required_mem": { hash: "89af8357b78aece85e9130d05174823c0b21ac461e57e3decd86c3cc10f29b79", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_required_profile_mem": { hash: "aba462df754b833c8351179b8f7ceb65c9493ef7e982e279451065239301043b", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.completeTerminalPhysicalSupport_compatible": { hash: "54f14acec8c40024eb7982e02373e24a80e864b0478a7815105f94362601b1fd", axioms: ["propext"], module: "PNP.ResidualTerminalPhysicalSupportCompletion" },
  "PNP.DirectWire.terminalSaturateRecords_closed": { hash: "f1b4202a9fa0e8d76c6289201eac729860a7f4735c9700c4299f71e1f1792e6d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalExecutableSaturation" },
  "PNP.DirectWire.mem_terminalSaturateRecords_iff": { hash: "055750aa6beee13c31f532a3f37f67c915a0f6a20ddac7d6f83e5058869db36b", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalExecutableSaturation" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.records_closed": { hash: "0fb6aed85d2c9d9f5ef89004077552853e3ffaec207f7c2884e033c73067df4f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSupportSquareClosure" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.physically_compatible": { hash: "2a19ccf8594f3749b91d263b915e1d2156a90ad2681ca6ed527f124de4b564f3", axioms: ["propext"], module: "PNP.ResidualTerminalSupportSquareClosure" }
};

const RESIDUAL_TERMINAL_GOVERNED_SUPPORT_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_GOVERNED_SUPPORT_THEOREMS).map(([name, row]) => [name, row.hash])
);

const RESIDUAL_TERMINAL_FRONTIER_PUSHOUT_THEOREMS = {
  "PNP.DirectWire.allTerminalSupportWires_nodup": { hash: "664c5fd299e2cc6704863d0e451dc55da67d4efc52c9f5140bf75dbcec239a03", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalGovernedFrontier.extensionality": { hash: "d7408981a1fba26e2939240e6969b97a88484b2fe7fbc2cc3d18e2487258e2d8", axioms: [], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.mem_terminalBoundaryFrontierPushout_iff": { hash: "6917c9d5b8c2dd5597ada2d19b520b3f670c1b2d0aff6e036d5e30af88f364a9", axioms: ["propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.mem_terminalInterfaceFrontierPushout_iff": { hash: "d66f50c4ddb7c57a1d87173e653a7f5e4ed95b5bc3df5a98796f481f364c3cb3", axioms: ["propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.mem_terminalProfileFrontierPushout_iff": { hash: "2b1fd94df7f19005b5a743deb9497359d1c89328fdd96666ac7a80b6600e8f6b", axioms: ["propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.terminalBoundaryFrontierPushout_nodup": { hash: "bd2dca3adfba6b71888f5a7712942ddddb2902b348df144d8fd0aae98983c213", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.terminalInterfaceFrontierPushout_nodup": { hash: "65e1394f56ba5d990fe995323e9dc178be50bed77eb2d0bb755dd900d33b86f2", axioms: ["propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.terminalProfileFrontierPushout_nodup": { hash: "8a6d654f7c16696ab68b3fbfcf95fd2572b178ac9fcbcdb52a01a040a7eba33e", axioms: ["propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_boundary_eq_pushout": { hash: "fb610ad67207523593e2fae63b1abce6cc222856384e598291bb0c4c60b1141b", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_interface_eq_pushout": { hash: "a9131b4338a42738b99eef6ac0cbe022265c5601b377b3a4c80f07c40880ad3f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_meet_profile_iff": { hash: "16a72a7de67ce24ac6ce262776e5bb3d26657d36b50dcb037dfd8ddc26bcfc75", axioms: ["propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_profile_iff": { hash: "00632937ee93f2c36555285245036f31796b4ba205caa3123b3ee671a9f9439a", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_profile_eq_pushout": { hash: "241f816fc36eba885ba175a69e4fbe176014f7eee252baa0c6a116d01f3c21d3", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.side_profile_mem_join": { hash: "b4ef1ac961410ae481ba19fa998f9b9334ff8635c1a2fcbe9cdf7b4be4c83786", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.left_boundary_disposition": { hash: "18438e5d5fc88ccc8709cb46c24dce6f0441954a791d4fe8e9c3fe50eb342807", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.right_boundary_disposition": { hash: "fe47e35d2ec3f24a6a2a50997a176ac5bdbf4b765fb333831c7ab3b4589c1125", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.side_interface_disposition": { hash: "8c44ddf2248725d3f73ec432fe5ea59ab8c73b9eab920068e3d3f51926e8fd2f", axioms: ["propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governed_frontier_pushout": { hash: "95d0548c06161609bda41bae89fc2a721d24cb0f5b72f8a09cdc509d81a77696", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.terminalGateSelected_eq_true_iff": { hash: "a129ddd3377a4fb391f461cbcf4de1003c4041e053861490042eda4ff62224a0", axioms: ["propext"], module: "PNP.ResidualTerminalPhysicalSupportCompletion" },
  "PNP.DirectWire.terminalWireExternal_eq_true_iff": { hash: "601cdb43c7e05546f6f14bb70a1ce17ee91c0029709f35984d3e356ed2d58663", axioms: ["propext"], module: "PNP.ResidualTerminalPhysicalSupportCompletion" },
  "PNP.DirectWire.terminalBoundaryWire_eq_true_iff": { hash: "d389d2551b491f93d8b2ea55d046962f2d35ca88f9c837386f0a8a5dbdf204b7", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPhysicalSupportCompletion" },
  "PNP.DirectWire.terminalGateHasExternalConsumer_eq_true_iff": { hash: "ccb9ef3b2d23683e27f139a14d444e4d6daf2d9952a6b3f07374606ce6c2ac33", axioms: ["propext"], module: "PNP.ResidualTerminalPhysicalSupportCompletion" },
  "PNP.DirectWire.terminalInterfaceGate_eq_true_iff": { hash: "59e178a302e1774ca2749bc75996f04086db27eacd706d03a8fe5ed5ca90f410", axioms: ["propext"], module: "PNP.ResidualTerminalPhysicalSupportCompletion" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.mem_meetRecords_iff": { hash: "128e80b0165ddfa2cb35006b81a9e5ebd84c910c1108b77bbb21825390b18095", axioms: ["propext"], module: "PNP.ResidualTerminalSupportSquareClosure" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.mem_joinRecords_iff": { hash: "61300043ed1912b7e150c540f0d5ed2137c52e8bae13fe709d6ebed1204b3b51", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSupportSquareClosure" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.records_closed": { hash: "0fb6aed85d2c9d9f5ef89004077552853e3ffaec207f7c2884e033c73067df4f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSupportSquareClosure" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.physically_compatible": { hash: "2a19ccf8594f3749b91d263b915e1d2156a90ad2681ca6ed527f124de4b564f3", axioms: ["propext"], module: "PNP.ResidualTerminalSupportSquareClosure" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_profile_iff": { hash: "9736ce34b616c8b00ac7ca4ba123c3c093dc464c1f07a7a0635b5b5bbe28a9dd", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" }
};

const RESIDUAL_TERMINAL_FRONTIER_PUSHOUT_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_FRONTIER_PUSHOUT_THEOREMS).map(([name, row]) => [name, row.hash])
);

const RESIDUAL_TERMINAL_PROJECTION_SQUARE_THEOREMS = {
  "PNP.DirectWire.TerminalGovernedFrontier.project_boundary": { hash: "f8abfe8e5e7778e39d4ea46149f12ed08827441c1f1ce1bbe00ecc7d5ceaf698", axioms: [], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalGovernedFrontier.project_interface": { hash: "4020d8b6d84f93d5d938a18d2e4c475032451fed79766070f075fe342b318b81", axioms: [], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalGovernedFrontier.mem_project_profiles_iff": { hash: "fd0592b431230d38989160e13731461a76bc3fbc527eacde8c65cbf97fdb424b", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalGovernedFrontier.project_profiles_nodup": { hash: "1bb562b19e1f365951831fc3104f4eacd540a574e71c05ddb3228382e2d81de5", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalGovernedFrontier.project_idempotent": { hash: "50e354bfbc108c3ae963cd3eb19b73055f3ac8eb653bc69ae6357d200ebd8b3f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.mem_terminalProjectedGovernedFrontierPushout_profiles_iff": { hash: "39c9d3b8078740dd0140667219de0c5d66b35bff11f787b8d692e8857ecdaff9", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalGovernedFrontier.project_pushout": { hash: "1e27fb54a4b5c0f3f02bf26d3cd38b89596da3aa57312b928c817bc36a599c90", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.projectedFrontier_boundary": { hash: "28d9df62f589b2ab8943c4106a692612cc291504a1f3d57b95ee6240f4cf5343", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.projectedFrontier_interface": { hash: "9a3bb52ded9dfc28a8c1d8c18303ba392f4ddcba000ba9e4fe4e63fd8b372939", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.mem_projectedFrontier_profiles_iff": { hash: "facc10a1bb53afa05adaf689dcb650f13eaa85f7b573d7a07578a2aef59e1bbd", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.projectedFrontier_profiles_nodup": { hash: "dc3922479745fff935163a6cfa0a9664ae2306589197c6bcbd0b24a2c2c86b08", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.forgotten_not_mem_projectedFrontier": { hash: "c872d6eafff42e0de60e67d52555c203f589a05422392e32f8fa1ef7f7586865", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.projected_meet_profile_iff": { hash: "9e63a2390bccaf3706b0328f2f867bc4911f383ed779faf94bd921eeae68d52e", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.projected_join_profile_iff": { hash: "06481e6e71aa58357ca562058451bea6c64ad44b9c3c69349bb0a1b3219240a2", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.projected_join_eq_pushout": { hash: "ef58638ca6c8567b96f1299b00f33412139dc543934901fd2350fe5717662485", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governed_projection_compatible": { hash: "e3fb053b19b683438233a65de339ae965d22c26408840ef9b1d5073a978d3982", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalProjectionSquare" },
  "PNP.DirectWire.TerminalGovernedFrontier.extensionality": { hash: "d7408981a1fba26e2939240e6969b97a88484b2fe7fbc2cc3d18e2487258e2d8", axioms: [], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.mem_terminalProfileFrontierPushout_iff": { hash: "2b1fd94df7f19005b5a743deb9497359d1c89328fdd96666ac7a80b6600e8f6b", axioms: ["propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.terminalProfileFrontierPushout_nodup": { hash: "8a6d654f7c16696ab68b3fbfcf95fd2572b178ac9fcbcdb52a01a040a7eba33e", axioms: ["propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_profile_iff": { hash: "9736ce34b616c8b00ac7ca4ba123c3c093dc464c1f07a7a0635b5b5bbe28a9dd", axioms: ["propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_meet_profile_iff": { hash: "16a72a7de67ce24ac6ce262776e5bb3d26657d36b50dcb037dfd8ddc26bcfc75", axioms: ["propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_profile_iff": { hash: "00632937ee93f2c36555285245036f31796b4ba205caa3123b3ee671a9f9439a", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governed_frontier_pushout": { hash: "95d0548c06161609bda41bae89fc2a721d24cb0f5b72f8a09cdc509d81a77696", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" }
};

const RESIDUAL_TERMINAL_PROJECTION_SQUARE_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_PROJECTION_SQUARE_THEOREMS).map(([name, row]) => [name, row.hash])
);

const RESIDUAL_TERMINAL_SIDE_TIGHT_MINIMUM_THEOREMS = {
  "PNP.DirectWire.TerminalFourCornerSizes.componentwiseLE_refl": { hash: "880ac00551719c408bab7c36100da06ab24e6c1082444c481247ca810e71eef3", axioms: [], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalFourCornerSizes.numericallySideTight_iff_eq": { hash: "5129d3bead161bf2fe04630876952c6e84b6ef24561195f8210a115aa6ed4b9b", axioms: [], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalFourCornerSizes.sideTightBool_eq_true_iff": { hash: "a848261642cfdea4df9e4447b325c84c022398c8bb53c45cc08ee5fa01cff359", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalFourCornerSizes.tightValue?_eq_some_iff": { hash: "1e18d14b6a1e2d3ca1cec68ce583ec931d7fdfde04961be055af3da383adb516", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalFourCornerSizes.tightValue?_sound": { hash: "574a7dbebbed80312757727409867ff60e735560b283257bf497db349d78b3bb", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalFourCornerSizes.tightValue?_complete": { hash: "7cd287618f14242dd084dc26658322b35ccbb7bc9517e2790feacd942983e1ab", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalFourCornerSizes.incidenceValue_eq_minimum_add_slacks": { hash: "5bccfcc0defe6d9cff4171aac17a7bf87395ca8fc36fb513f02b87f1cc71489b", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.fullMinimumSizes_incidenceValue": { hash: "b97b13db2e6f7c85367618fdbff02012e3e35dac248b9477f1f3d0d83e2d5d41", axioms: [], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalFullFourCornerBasis.minimum_componentwiseLE_sizes": { hash: "0fbb68b6581fdd7d689d1a673577167804c1f46559fecec89780691859473f4c", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalFullFourCornerBasis.incidenceValue_eq_fullDelta_add_slacks": { hash: "fd67bd71430658938e496d5614df7d7613a529616708ba4e8a6d40bf1fb7e1b1", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonicalFullBasis_sizes": { hash: "4eada640b465615c6e3e7fb50d2425f3fb0367ceaf1116f730c7eb8529d4dbe0", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonicalFullBasis_numericallySideTight": { hash: "30667d03f2b79304ef3ba521fdfb603ddbc0fed9d7a500b5cb82b873b5d848b8", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonicalFullBasis_tightValue?": { hash: "d4f43cea0b57df4a8bc140c107bde3caa14f6dbbd3bb0ff44ea4a57b1fdf9b99", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.quotientMinimumSizes_incidenceValue": { hash: "b367ab312ac141381b359cc844f80378acc7421d8016d8c3b33f24cbe5fa2792", axioms: [], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalQuotientFourCornerBasis.minimum_componentwiseLE_sizes": { hash: "422eab229d2226a474a7742b61dfc18b3ca46e4966d9eed60e596d7b00118ce3", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalQuotientFourCornerBasis.incidenceValue_eq_quotientDelta_add_slacks": { hash: "d39a83cb2b7ddd1d27dd22e66f95521652967e323c3dfbac0549d6bb2fdf35d0", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonicalQuotientBasis_sizes": { hash: "4a5100e98955c56996c16f6a36e1368d5633f3aac3f8b2cf05124ceb3512c735", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonicalQuotientBasis_numericallySideTight": { hash: "cf09d5ab284e8ab70e5a292eacf1365ba8ed36726befdaac7437a9391a18e446", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonicalQuotientBasis_tightValue?": { hash: "118d0bde5404a21c201d076f3d09a8db27cc34a7657ac592df9687f226e8fb62", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonical_numericallySideTight_values": { hash: "4288f8f3bd740dcdb96a2f0b1178e6b86a473f0d06e8c2977381838ab6f538ac", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.terminalFullProfileMinimumRealization_gateCount": { hash: "798da3be48963130ca415d60dbaea20fc06087f64068798e5c62634178d98259", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" },
  "PNP.DirectWire.terminalQuotientProfileMinimumComparison_gateCount": { hash: "32349bacfe9e5efd16f42006fe912234b0c7459b66db9905e5c5867a696dba80", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" },
  "PNP.DirectWire.terminalFullProfileMinimum_le": { hash: "56059f1da9c8fe821569dc651bb112eef6ad0f056a6496c668ff45250ada6f0e", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" },
  "PNP.DirectWire.terminalQuotientProfileMinimum_le": { hash: "ce8486f3b736f1bac59f6a388c73a32d5bfdb4ec64f0994b1ba94fb1c57ab753", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" }
};

const RESIDUAL_TERMINAL_SIDE_TIGHT_MINIMUM_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_SIDE_TIGHT_MINIMUM_THEOREMS).map(([name, row]) => [name, row.hash])
);

const RESIDUAL_TERMINAL_FOUR_CORNER_CARRIER_THEOREMS = {
  "PNP.DirectWire.TerminalFourCornerCarrier.boundaryDisposition?_eq_some_iff": { hash: "a17a6f8030c70a14adb2df79307260e0a6604d74971edeb56d0b120fa7ea8fee", axioms: ["propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.interfaceDisposition?_eq_some_iff": { hash: "4280ddc44a0c8bd9cb3286891884e90420fcec78a4c33e53ac76db5aef07020a", axioms: ["propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.boundary_nodup": { hash: "54671c6f5618cde6eec3363ab984e4718fca3982586eb90a2c20a7af622c0772", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.interface_nodup": { hash: "712283c4673524aa982002f212e6ac6422678d26f87efef00f13514d9bc81deb", axioms: ["propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.profile_nodup": { hash: "ef0d11e47a02a1f40941ab31106f6e596879a68310f4997770b47728aad16e71", axioms: ["propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.extracted_boundary": { hash: "82eeef9f22f94e43cd96eaf5985d16ed367bd91e27c59abe11a0d578e1e6f810", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.extracted_interface": { hash: "1688342912bbc29d92352e2e705d9f29b82e6075dcf3706373348a5685731de8", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.corner_compatible": { hash: "f0dc36448e05cd05364dfe86e8ba290aa0feea227329cbf1c2cba58032f53b9c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.meet_profile_transport": { hash: "401a598c9f5d9f9a5db940695710f9d44df9a2317cf498b08d9b95a59af08e10", axioms: ["propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.side_profile_transport": { hash: "e7c7d3f5c7b2d1ed33543e8f1af2408e4740ad83a42a1e1651feeb46e66e1198", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.join_profile_transport": { hash: "d7d6c936c9c8ef7e3e2686f007dd9be1f2ae3e5f33be82c6cfca82d1879f74fc", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.boundary_retained": { hash: "9fa1a39fdef6b542f9d7a3233f64174aeffaea06204939fcf3355f50638ac046", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.boundary_internalized": { hash: "3ed6dfbb4eef0a6f7ffb86db87db8e195ad65d0096f697c15e8bea9fbe8bea33", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.interface_retained": { hash: "76695a77e24b135a658ce669486a0eb591e9986d578901b7e0b46671ed2df3e0", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.interface_internalized": { hash: "baa7cb59491626b993a2f8fd7009685a934df1c830ac20fb7ad28f8302c785e8", axioms: ["propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.projection_compatible": { hash: "004398c5eefef33046884bdb902545d35c5a86c8cdf4f0ff941f28500ab35ac5", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.complete_transport": { hash: "5976aa24e0dfafa1d0bab889dbee53df1ca2686923df8b5dab9c0752888ecb27", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_compatible": { hash: "3d8b72bef8f77704e577cd3377720c41c0e035818fa7d598406e385d8fd05e5d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalGovernedSupportCompletion" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_meet_profile_iff": { hash: "16a72a7de67ce24ac6ce262776e5bb3d26657d36b50dcb037dfd8ddc26bcfc75", axioms: ["propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.side_profile_mem_join": { hash: "b4ef1ac961410ae481ba19fa998f9b9334ff8635c1a2fcbe9cdf7b4be4c83786", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_profile_iff": { hash: "00632937ee93f2c36555285245036f31796b4ba205caa3123b3ee671a9f9439a", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.left_boundary_disposition": { hash: "18438e5d5fc88ccc8709cb46c24dce6f0441954a791d4fe8e9c3fe50eb342807", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.right_boundary_disposition": { hash: "fe47e35d2ec3f24a6a2a50997a176ac5bdbf4b765fb333831c7ab3b4589c1125", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.side_interface_disposition": { hash: "8c44ddf2248725d3f73ec432fe5ea59ab8c73b9eab920068e3d3f51926e8fd2f", axioms: ["propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_boundary_eq_pushout": { hash: "fb610ad67207523593e2fae63b1abce6cc222856384e598291bb0c4c60b1141b", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_interface_eq_pushout": { hash: "a9131b4338a42738b99eef6ac0cbe022265c5601b377b3a4c80f07c40880ad3f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governed_projection_compatible": { hash: "e3fb053b19b683438233a65de339ae965d22c26408840ef9b1d5073a978d3982", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalProjectionSquare" }
};

const RESIDUAL_TERMINAL_FOUR_CORNER_CARRIER_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_FOUR_CORNER_CARRIER_THEOREMS).map(([name, row]) => [name, row.hash])
);

const RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMA_THEOREMS = {
  "PNP.DirectWire.terminalSupportWireAt_ambientIndex": { hash: "baa6ebaeadcc573a190c2d129568a658e30533b249f7a3c6eafe36cecc8eeb31", axioms: [], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalSupportWire.ambientIndex_terminalSupportWireAt": { hash: "86fa5b9e65c494e7be9a7a74b2492aa8c80501fdcfb6797698794c525f58bddd", axioms: [], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalSupportWire.ambientIndex_injective": { hash: "420732b62abdf78f5ebe14c4f81218eef8b815cc71668b609bf8b534469339a2", axioms: [], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.boundaryIndex?_eq_some_iff": { hash: "a5d142c0ab5e4d5809895394a0e4aa27bc69c6167690e62ae72afa3d790a6f51", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.interfaceIndex?_eq_some_iff": { hash: "c96c26a35dbac2dd661438e54b893a6edf9dfc2ad925bce62cb9c0b7f65e415c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.boundaryIndex?_ambient_get": { hash: "01e4969304b1a8da5ca710f3b97fb6db22ed897d59758873f82863ed7579b1e1", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.interfaceIndex?_get": { hash: "4f42d217e9a4b21e4211b9345a06838aa0f46ef81bf9d5a54698dcf0d57c03f9", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.boundaryAdapter_semantics_get": { hash: "7296a16167d0e637f40f1b86fd0d74e1e7fbbed0843e29fdf5dcbfea8dde75aa", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.ambientizeCandidate_semantics_present": { hash: "72b55886beb152e1380e567bdda9257dacface6ea6dad200180fb9516004d215", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.ambientizeCandidate_semantics_absent": { hash: "61ad7c80d2de3a313b16b8058bfbf9758be998baf4a1832a69b97ce8353f344f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.localizeCandidate_semantics": { hash: "b4c050d17e30ee714a072d299af755549f1d9e64b35e353a38b017dceb988876", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.localize_ambientize_semantics": { hash: "8344965d10d1e6b3bb2d4ca424bb7a782bc1cd9b6e8312e621e70a525a5ca6e9", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.ambientizeCandidate_gateCount": { hash: "69fb8806dbd2fd724b0643b43c6099c6fb35c1a64d7ae224031253546595d5f8", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.localizeCandidate_gateCount": { hash: "e21e7d1af5ebce164fa69a466e49b523da43befcf51d8e532661fae7d2daace5", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.ambientizeCandidate_equivalent": { hash: "42d5de3ba77b231662262fe2429c4a985801ef4810ae568ac8181cdc432f3943", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.localizeCandidate_equivalent": { hash: "2c80a21f5d0d8cf703a0738383b24b9cf3362877037845d9033bc388dfca248d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.localize_ambientize_equivalent": { hash: "d7c7d0e9fe6d7306139ba4c93b27f765af68ed068922e0dc422f3672c900047c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.localizeImplementation_gateCount": { hash: "b16686cdf9678693fcade96a65d91386ab39381301b9fcfbaf1b8f629ec933ec", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.ambient_referenceMinimum_eq_corner": { hash: "de788866dd3f749d769ace9e19bddb3b2b9259dfb83934aafc49331763e855df", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.optimizationCorners_at": { hash: "b9e345e70b97da10e3a55f6ef406521874d0f96f17725c30f1a2f6edcb328b4f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.optimizationCorners_role": { hash: "e1948b30f1ae25554a87cfb71e4d6854aec359c832ea175fbd6780196821331d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.optimizationCorners_projection": { hash: "10db8957f72550e86f288ca7e17278051a4772ba5eba1781d4478235568aaf32", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.localizeRealization_gateCount": { hash: "86d6d702677203a11d3513e88751863984e5d0c75b77645b9a0e046082966d06", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.fourCornerOptimaCarrierCompatible": { hash: "0c8b453d9b62cca81206e8097b11fe630fb81467c30842548b9fabb1b2725304", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.complete_transport": { hash: "5976aa24e0dfafa1d0bab889dbee53df1ca2686923df8b5dab9c0752888ecb27", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonicalFullBasis_sizes": { hash: "4eada640b465615c6e3e7fb50d2425f3fb0367ceaf1116f730c7eb8529d4dbe0", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonicalQuotientBasis_sizes": { hash: "4a5100e98955c56996c16f6a36e1368d5633f3aac3f8b2cf05124ceb3512c735", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.terminalFullProfileMinimumRealization_gateCount": { hash: "798da3be48963130ca415d60dbaea20fc06087f64068798e5c62634178d98259", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" },
  "PNP.DirectWire.terminalQuotientProfileMinimumComparison_gateCount": { hash: "32349bacfe9e5efd16f42006fe912234b0c7459b66db9905e5c5867a696dba80", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" },
  "PNP.DirectWire.referenceMinimum_le_of_equivalent": { hash: "f08f2f21b3b60f906c7aa7f7b2d1d5e0dd39106078324c1a0898fd739614efae", axioms: [], module: "PNP.NANDMinimum" }
};

const RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMA_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMA_THEOREMS).map(([name, row]) => [name, row.hash])
);

const RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMUM_COHERENCE_THEOREMS = {
  "PNP.DirectWire.TerminalOptimumLegTransport.recordsSubset": { hash: "506a2ab9eaa978c106fd713b1eedeb34b6ddca2a8b5863fda8aad1595a1d5857", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalOptimumLegTransport.profileTransport": { hash: "ba4e1e374205d15ef1fef813ec06ea2ef6f437b78a17707beb657e5bc3bfe266", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalOptimumLegTransport.ambientCoordinate_exact": { hash: "58ccdb01bc7d5d4009f5ff91a79e30761ff9c2412d44079666234fd23bad15d5", axioms: [], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalOptimumLegTransport.retainedOutput?_eq_some_iff": { hash: "3ca872ed3070e25f52506eb992876b903dd80f3d141f0cbe00dcb4f917db0aea", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalOptimumLegTransport.retained_or_internalized": { hash: "33ab10a138405195706d2917e58736ff22a742d316600b62aacc94a671faee4a", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalFourCornerCarrier.optimumTransportTheta": { hash: "e11bb3cfbc27c2e39c731d4e7fa5842859dcbc4d9a61c6031790f9d1893a37a2", axioms: [], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumCoherenceFailure?_sound": { hash: "f34159b818fab99a0eaba5f7efc5c7016e02d2dca51e5e9d5b0ef2baa7fc31bc", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumModeMismatch?_sound": { hash: "e0839eb9e393f9e2d6a03976dc1d8518cff735298274d6ce4e0d14d6977e5796", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalFourCornerCarrier.noFailure_iff_coherentOptimumTuple": { hash: "9a9baca321ea735cf5e48f17587acf7dad8c46d2fcac08729fc811c7bf2069bd", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalFourCornerCarrier.classifyOptimumCoherence_exhaustive": { hash: "5508c5cb130ca54056c44d276865590baaa5530df0b6e4ec3ac946c02bd61af9", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalFourCornerCarrier.fourCornerOptimumCoherenceDichotomy": { hash: "dbda182bed221380c62b320a31510636262e22cba6f71508812634a8e206fd23", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalFourCornerCarrier.fourCornerOptimaCarrierCompatible": { hash: "0c8b453d9b62cca81206e8097b11fe630fb81467c30842548b9fabb1b2725304", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.complete_transport": { hash: "5976aa24e0dfafa1d0bab889dbee53df1ca2686923df8b5dab9c0752888ecb27", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.meet_profile_transport": { hash: "401a598c9f5d9f9a5db940695710f9d44df9a2317cf498b08d9b95a59af08e10", axioms: ["propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.side_profile_transport": { hash: "e7c7d3f5c7b2d1ed33543e8f1af2408e4740ad83a42a1e1651feeb46e66e1198", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalFourCornerCarrier.interfaceIndex?_eq_some_iff": { hash: "c96c26a35dbac2dd661438e54b893a6edf9dfc2ad925bce62cb9c0b7f65e415c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonicalFullBasis_numericallySideTight": { hash: "30667d03f2b79304ef3ba521fdfb603ddbc0fed9d7a500b5cb82b873b5d848b8", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonicalQuotientBasis_numericallySideTight": { hash: "cf09d5ab284e8ab70e5a292eacf1365ba8ed36726befdaac7437a9391a18e446", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonical_numericallySideTight_values": { hash: "4288f8f3bd740dcdb96a2f0b1178e6b86a473f0d06e8c2977381838ab6f538ac", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSideTightMinimum" }
};

const RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMUM_COHERENCE_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMUM_COHERENCE_THEOREMS).map(([name, row]) => [name, row.hash])
);

const RESIDUAL_TERMINAL_FOUR_CORNER_SIDE_TIGHT_COMPLETION_THEOREMS = {
  "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumRoute?_coherence": { hash: "eb47244a19f5a8663be3e71301e900265ed532feadf78b29a410176a49fa347a", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumRoute?_quotientPromotion": { hash: "23b0dc68d549029c4c4b18dd4305c9f1ead913e3bb883f76784bfeb794757473", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerOptimumRoutedFailure.sound": { hash: "2ea820659559ee4037840bc0f4ff94c7f8e92d118ea6c496a35c8c2f52a6bc2d", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerCarrier.noOptimumCoherenceRoute_iff_noFailure": { hash: "8023984a339982677c5937ffdc949187093d769cf9700a308a507800d2165d92", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerCarrier.noOptimumPromotionRoute_iff_noModeMismatch": { hash: "50f3c61c1d98dfa4d6dce25a5f7563d52cd798bab7ea7330d48626bf6803a9eb", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumRoute?_sound": { hash: "fc2eece754495bece99cff522ce50fce00822d9edbd1b30450b0b9e68c04914d", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionOrFirstRoute": { hash: "022a92d15e9c67472fe21b214ad61f734b78e5de9493ba42ada16f7de4adafbc", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerOptimumRoutedFailure.excludesCoherentOptimum": { hash: "4fb542909519be84208977b31cb4d80107b26453c16a2f6c9efd385944b2bfef", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionExists": { hash: "1fe20aab68ffbadb70969c980700cd6a6a77c53b9a90ddca8c618891863ab9a4", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionExistsEachMode": { hash: "31764bb11ecf298e542f86d66fb163538777611b54e33a9d7536d3cbc78e52fd", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletion_fullValue": { hash: "42a01007d1f7ebbeb9c82905ad90c0767b1b5e70fe95ad6612ffe674b063b74d", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletion_quotientValue": { hash: "9ec1a48c714b7b95fce7428d5f892f5c0ab4d3f9f8797496f0531b0c4b38ae56", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumCoherenceFailure?_sound": { hash: "f34159b818fab99a0eaba5f7efc5c7016e02d2dca51e5e9d5b0ef2baa7fc31bc", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumModeMismatch?_sound": { hash: "e0839eb9e393f9e2d6a03976dc1d8518cff735298274d6ce4e0d14d6977e5796", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalFourCornerCarrier.noFailure_iff_coherentOptimumTuple": { hash: "9a9baca321ea735cf5e48f17587acf7dad8c46d2fcac08729fc811c7bf2069bd", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalFourCornerCarrier.fourCornerOptimaCarrierCompatible": { hash: "0c8b453d9b62cca81206e8097b11fe630fb81467c30842548b9fabb1b2725304", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.optimumTransportTheta": { hash: "e11bb3cfbc27c2e39c731d4e7fa5842859dcbc4d9a61c6031790f9d1893a37a2", axioms: [], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonicalFullBasis_numericallySideTight": { hash: "30667d03f2b79304ef3ba521fdfb603ddbc0fed9d7a500b5cb82b873b5d848b8", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonicalQuotientBasis_numericallySideTight": { hash: "cf09d5ab284e8ab70e5a292eacf1365ba8ed36726befdaac7437a9391a18e446", axioms: ["propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.canonical_numericallySideTight_values": { hash: "4288f8f3bd740dcdb96a2f0b1178e6b86a473f0d06e8c2977381838ab6f538ac", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalSideTightMinimum" },
};

const RESIDUAL_TERMINAL_FOUR_CORNER_SIDE_TIGHT_COMPLETION_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_FOUR_CORNER_SIDE_TIGHT_COMPLETION_THEOREMS).map(([name, row]) => [name, row.hash])
);

const RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_THEOREMS = {
  "PNP.DirectWire.TerminalOptimumCoherenceMode.minimumAt_le_current": { hash: "6c4809c980c1db6594fcf6f245e24dbc193fa9c846635c3f9bdbbb1499df8aaa", axioms: ["propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.mem_minimumImplementationsAt_sound": { hash: "3d49ba6e76035e93207da04f7cc351cedf024d30efcb5a826f6d34552f6a64a5", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.mem_minimumImplementationsAt_complete": { hash: "b9eebae3442c7490b366c64f129bff33be7b6fe1de59c11e466482e89a6c6d0f", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.mem_minimumImplementationsAt_iff": { hash: "a473241e90752a2117efbb2df0a16400aea4affba7f0287a3941b25097d0424e", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalProjectionFourCorners.mem_minimumImplementationBases_iff": { hash: "c654d12ee2ef6faf1e42a5193afee03e41fe32f38321fc0e7dbd3661d3721829", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.tightBasisBool_eq_true_iff": { hash: "3c76bfac012bfee03a64ae2d635ce12f42194f41f279784fd4543aaaebaad300", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.mem_tightBasisFamily_sound": { hash: "e18e651e881debd70be534ccc9bbcf32c8db8499cc8b516970da92cdbe6c6ecc", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.mem_tightBasisFamily_complete": { hash: "f2f95759eb14f30cdfaa7ad173f325ff4fc13152b0236deb213a30f67fae2b66", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.mem_tightBasisFamily_iff": { hash: "444b7f59074e4ef386c04cdb1c917f8eeba5cca6cd50894aff7a82abeff5e877", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.canonicalImplementationBasis_at": { hash: "50d2ae7c306e621301a1a71831d3cc07cb55c86bfdf4158b65769f0caf11e4a3", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.canonicalImplementationBasis_sizes": { hash: "a3a79b0d6e5d6cb6a56a8cc365fc611661df47e62781322367260f361de74b4b", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.canonicalImplementationBasis_isTightCoherent": { hash: "b24e97c1e2219daeaf197d2f106660a20e225ed0ea6194672f118233a62f9dee", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.canonicalImplementationBasis_mem_tightFamily": { hash: "c777345eaecc95749978bb08477f9b20a4d15fcc3ed16b2db6359c1ac1274e13", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.tightBasis_incidenceValue_eq_delta": { hash: "f9c4269ad9aef9cf22898abeca683841a0b07a976074610ac61e159f7c4f0da3", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.mem_tightBasisValues_eq_delta": { hash: "66d896dc9993b760660b204d1e42b8c7f3f20c89e244fb13bf4cd8543d28c5f8", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_eq_delta": { hash: "cf899f2ca453722f04ad1e9648edefd3772303ffc70f7a3e35e9116d7e0fed55", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_full": { hash: "15b31bdefa9557e49c23e97eed5540a4ded842e6dfd6e8de3918bb1819d157d3", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_quotient": { hash: "4a49571efc6e506071fe848b68683172739162cfaff84516f7a1df21a12bff73", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.firstBasisCoherenceFailure?_sound": { hash: "71ac14a1fd03c250d1c1f3b3bb8c5ff9a0a35e6b6ef436b1c0e6df1b3d56aee3", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumCoherenceFailure?_eq_basis": { hash: "fee448e50ef580e58823afaa0d44537cc65e5deede514535e40ce14f826c09b7", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.mem_allBoundedCandidates": { hash: "32b216ecf3faa1be6eb7d6e9f3f32f3de24ed3b5d3d49e1c303a38cad32f6aae", axioms: [], module: "PNP.NANDEnumerator" },
  "PNP.DirectWire.terminalFullProfileMatchBool_complete": { hash: "ce2551dced7c7b0f50749844f9113fcc9d9de4daf288a07f3932874ac5a9467f", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" },
  "PNP.DirectWire.terminalQuotientProfileMatchBool_complete": { hash: "bbbe9447463d113efe13ac57c0fbadc387eda47aeb1eef6c08c06e70f885e4c2", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" },
  "PNP.DirectWire.terminalFullProfileMinimum_le": { hash: "56059f1da9c8fe821569dc651bb112eef6ad0f056a6496c668ff45250ada6f0e", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" },
  "PNP.DirectWire.terminalQuotientProfileMinimum_le": { hash: "ce8486f3b736f1bac59f6a388c73a32d5bfdb4ec64f0994b1ba94fb1c57ab753", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" },
  "PNP.DirectWire.TerminalFourCornerSizes.numericallySideTight_iff_eq": { hash: "5129d3bead161bf2fe04630876952c6e84b6ef24561195f8210a115aa6ed4b9b", axioms: [], module: "PNP.ResidualTerminalSideTightMinimum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumCoherenceFailure?_sound": { hash: "f34159b818fab99a0eaba5f7efc5c7016e02d2dca51e5e9d5b0ef2baa7fc31bc", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerOptimumCoherence" },
  "PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionExists": { hash: "1fe20aab68ffbadb70969c980700cd6a6a77c53b9a90ddca8c618891863ab9a4", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
};

const RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_SCOPE = "all-finite-computed-terminal-support-squares-observers-and-full-or-quotient-modes-complete-tight-basis-family-and-signed-maximum-under-exact-local-route-silence";
const RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_MILESTONE_SCOPE = "For every finite computed terminal support square, every explicit observer, and either full or quotient mode, Lean enumerates the complete finite tight-basis family, retains every exact profile-constrained minimum implementation at each corner, filters the full Cartesian product with the arbitrary-family coherence query, and proves under exact local route silence that the signed maximum equals the selected delta.";
const RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_NON_CLAIM = "This milestone closes the remaining local BN2 tight-basis maximum under computed local route silence. It does not prove universal route silence, connect a local obstruction to the complete global no-outcome route system, prove BN2 square legitimacy, derive the terminal dependency system, establish SaturatePositive, Package E, BCELReady or BCEL/BN2-BN6, complete obstruction routing, prove ZeroSlack, PCCMin, polynomial runtime, SAT in P, remove a project assumption, or prove P = NP.";

const RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_THEOREMS).map(([name, row]) => [name, row.hash])
);

const RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_THEOREMS = {
  "PNP.DirectWire.TerminalComputedBN2SquareLegitimate.cornerCompatible": { hash: "353ae46eab6aa34d13a35841d9645d0872fee705b8bad037d3e767e56a72b071", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalComputedBN2SquareLegitimate.meetProfile": { hash: "5496541d05e720818b80d4c5cb9e01cb19b1e6f39912fb077bfe010ca07a4da3", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalComputedBN2SquareLegitimate.joinProfile": { hash: "da482fc3256cea5a7c74a0407cf8c610ec1cb2e784a98cf71dd0a6e12da3035c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalComputedBN2SquareLegitimate.projectionCompatible": { hash: "7fbd5e63bac42fecd0eec47c5f26007f532a180f5e7635f0f8e552c68973efe3", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalFourCornerCarrier.computedBN2SquareLegitimate": { hash: "dd1706be5a716430a81242763f216fb58c687178a7363aad9733ad2868c2c47e", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalComputedBN2SquareQuantities.sharedRole": { hash: "50c7efac8a8400444fd8326e3d68ef103e2d5f7e5f05c15d089c510600b962e1", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalComputedBN2SquareQuantities.sharedProjection": { hash: "cc534e9461c576cd0619a60217f19a2f8051d10ea4227dd07c315fbb462be0f4", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalComputedBN2SquareQuantities.referenceMinimumPreserved": { hash: "999c06f0d20fc5781833e93f931b6ce3c9f58a82107feaa510ddffd386263326", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalComputedBN2SquareQuantities.transferIdentity": { hash: "716cb27271f5ee1c30b788d038c193a87b74e25984381192c602ce0e3a2fecf1", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalFourCornerCarrier.computedBN2SquareQuantities": { hash: "caf7e7aa90a62c6d1a8604bc57c4d94a08169cea4db44ee8632409404bbcbc90", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalFourCornerCarrier.computedBN2LocalConclusion": { hash: "2ac8a3a6ac748ef68e77c51608c765fe3eedab375e2151ffe3bada21cd4258e1", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalFourCornerCarrier.computedBN2LocalConclusionOrFirstRoute": { hash: "7ef5bbf275ada25d79cc41ab25ac3dee6b2463060159468d057f1b621c01ff7d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalFourCornerCarrier.complete_transport": { hash: "5976aa24e0dfafa1d0bab889dbee53df1ca2686923df8b5dab9c0752888ecb27", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerCarrier" },
  "PNP.DirectWire.TerminalSaturatedSupportSquare.governed_frontier_pushout": { hash: "95d0548c06161609bda41bae89fc2a721d24cb0f5b72f8a09cdc509d81a77696", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFrontierPushout" },
  "PNP.DirectWire.TerminalFourCornerCarrier.fourCornerOptimaCarrierCompatible": { hash: "0c8b453d9b62cca81206e8097b11fe630fb81467c30842548b9fabb1b2725304", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerOptimumCompatibility" },
  "PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionExistsEachMode": { hash: "31764bb11ecf298e542f86d66fb163538777611b54e33a9d7536d3cbc78e52fd", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_full": { hash: "15b31bdefa9557e49c23e97eed5540a4ded842e6dfd6e8de3918bb1819d157d3", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_quotient": { hash: "4a49571efc6e506071fe848b68683172739162cfaff84516f7a1df21a12bff73", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerTightBasisMaximum" },
  "PNP.DirectWire.TerminalFourCornerOptimumRoutedFailure.sound": { hash: "2ea820659559ee4037840bc0f4ff94c7f8e92d118ea6c496a35c8c2f52a6bc2d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalProjectionFourCorners.transferIdentity": { hash: "8a834cd3525cc543e7ec42d58e23836853ad71d0bc2ff97655f7dab1562880ac", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalProjectionTransfer" },
};
const RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_SCOPE = "all-finite-computed-terminal-support-squares-explicit-terminal-dependency-systems-direct-wire-candidates-observers-and-forgetful-projections-with-local-route-silence-or-proof-bearing-first-failure";
const RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_MILESTONE_SCOPE = "For every finite computed terminal support square built from two finite seeds under one explicit terminal dependency system, direct-wire candidate, observer, and forgetful projection, Lean constructs the exact compatible governed frontier and projection square, keeps full and quotient minimum quantities on the same carrier, and returns either the complete local conclusion under exact local route silence or the deterministic full-then-quotient proof-bearing first coherence route.";
const RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_NON_CLAIM = "This milestone packages computed structural legitimacy and the exact local no-route conclusion. It does not derive the terminal dependency system from an arbitrary circuit, prove universal route silence, connect a local failure to the complete global no-outcome route system, identify a BCEL anchor square, establish SaturatePositive, Package E, BCELReady or later BCEL/BN2-BN6 conclusions, prove ZeroSlack, PCCMin, polynomial runtime, SAT in P, remove a project assumption, or prove P = NP.";

const RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_THEOREMS = {
  "PNP.DirectWire.TerminalBCELAnchorProblem.mem_anchorRecords_iff": { hash: "e5e4b4afb6377b6691fb406fdcc8221ff33b65f4a0df4fa5d4ad1b737c3b7cea", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.TerminalBCELAnchorProblem.anchorRecords_nodup": { hash: "fcff38687dc840da329f49a4f3af94c6b5f5e601e0ffc866e361046fd288bd75", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.TerminalBCELAnchorProblem.anchorRecords_mem_allAnchorSubfamilies": { hash: "eddd4feeee1f031180ebb22a8fa3f131a810a304f9d4d32158da942be455bd35", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.findTerminalPositiveAnchorNucleus_sound": { hash: "74f17cfdd50e47efca2f17d577a03a787dc2130b0c80c17d89d9072158127a41", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.findTerminalPositiveAnchorNucleus_eq_none_iff": { hash: "48f0fba6f848150d9d90accc26e1725106ae65af18675224858e776d998dfbd1", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.findTerminalPositiveAnchorNucleus_exists_of_whole_positive": { hash: "57c834d566c9012d0fbe3fc41d649e9239d987d9288de0360c3075a9f02059d6", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.findTerminalPositiveAnchorNucleus_unique": { hash: "8765f001c204a0dd9c74c9046d08466e0001c55fa70768c77fbcffec0fd8188d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.TerminalBCELAnchorAlgebraCheck.disagrees_eq_true_iff": { hash: "21e976f8ea4278400684f1d163bbe5e6856d67f44adb163cdca70d074b556124", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.terminalBCELAnchorAlgebraCheck_mem": { hash: "0c887972254ae42d2251cc26fdb984a43f6fd45fa97e047cbff8cfa3cce3d92b", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.mem_allTerminalBCELAnchorAlgebraChecks_governed": { hash: "d1022687265c7a43cb8b892f7c225c6c744fd2c3566fa1010034cf54f46195e1", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.firstTerminalBCELAnchorAlgebraMismatch?_sound": { hash: "d4b5e1289cb026a70ebc8f12dc383dc282932ddead691b52fadf721ccaf60490", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.firstTerminalBCELAnchorAlgebraMismatch?_eq_none_iff": { hash: "7d72814a0e0b99036ed2fe416923d71323facdc499a8c0c45ec6624ba66c7f0c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.terminalBCELProperCutSeedBool_eq_true_iff": { hash: "562ac1b728198665ad38ff6b5a9f2d9df0f72cfe9fda2edbc29ef1d3660e6bb9", axioms: ["propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.mem_allTerminalBCELProperCutSeeds_iff": { hash: "9fe0044ae6a825aa8e819157cc1e5a3bc18c1c00afc62020ce5386bd577c347d", axioms: ["propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.TerminalBCELCutDefectCheck.disagrees_eq_true_iff": { hash: "21d996875cdbdfa43f717ee01fbad02bd3b0b6663933e6cb1e26125f524ef0dd", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.terminalBCELCutDefectCheck_mem": { hash: "ee8f2ddc31eb92b7d340feb65ad9c74c28a50e9e784a44a07c0dc4968fe4c5b5", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.mem_allTerminalBCELCutDefectChecks_proper": { hash: "45b38adcd92627f85a5067e0041e82c115c7d43d82dc4af3eed47036c5c6ceaf", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.firstTerminalBCELCutDefectMismatch?_sound": { hash: "3387f69ddabe75b1ff558c5ed2d67a9760b588b45c1387abe364df1f79999bc2", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.firstTerminalBCELCutDefectMismatch?_eq_none_all": { hash: "498c140b8de89e8fc500957671377032c6114b2a21bb2371dff3b9e1327920a7", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.firstTerminalBCELCutRoute?_sound": { hash: "4529fac6c828fd8e7acb6c02dc4e7601011845f81036e26fca08ab813cb0190c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.firstTerminalBCELCutRoute?_eq_none_noRoutes": { hash: "e55c042d003211d3c737082814d8555ddbdd0a3465812dfef73566761808c2ad", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.computedBCELCutConclusionOfNoFailures": { hash: "8ad5f859c27f0c8b2c9e703d3815582c828455191fda12adfabd7fc12c83c2f6", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.strictSubfamily_defect_zero": { hash: "e0c733dabf361e5ac836d92c4adda2525bc8699b26feb5d480e74d9f84986e23", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.anchorSizeAtLeastTwo": { hash: "19082f2ea2f7b1145571e2ddf2092ec6624852e09bf11f9820d8fa6daad5d68f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.properCutConstantEquation": { hash: "cd65d823551841cf3046ee9a2350229ddee98947f9e8875fc27c61f271502d3e", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.properCutLocalConclusion": { hash: "000808b27a16bc73cb544180e9969aa442390aa75173b3c6c46025605e9d563e", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.classifyTerminalBCELAnchorNucleus_exhaustive": { hash: "b0091a1de2e0cdbeb98dc26355b00259a989cce68429f56f8e5f0083366c87be", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBCELAnchorNucleus" },
  "PNP.DirectWire.allTerminalPrimitiveRecords_nodup": { hash: "762735aa6ef686276db73e4375da9633ce1881e66062b5f3a459243938aa9206", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalExecutableSaturation" },
  "PNP.DirectWire.filter_mem_terminalListSubsets": { hash: "78efb08f842b84558613fc90cb018d67f3a5ccda8ee0c22a4191cec1d779cff4", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalProperSupport" },
  "PNP.DirectWire.mem_allTerminalPrimitiveRecords": { hash: "06dc32945403e76a76eed4fdbe31b1962c878af2cd8c136103fa1243d304a9a6", axioms: [], module: "PNP.ResidualTerminalSaturation" },
  "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumRoute?_sound": { hash: "fc2eece754495bece99cff522ce50fce00822d9edbd1b30450b0b9e68c04914d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerOptimumRoutedFailure.sound": { hash: "2ea820659559ee4037840bc0f4ff94c7f8e92d118ea6c496a35c8c2f52a6bc2d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFourCornerSideTightCompletion" },
  "PNP.DirectWire.TerminalFourCornerCarrier.computedBN2SquareLegitimate": { hash: "dd1706be5a716430a81242763f216fb58c687178a7363aad9733ad2868c2c47e", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalFourCornerCarrier.computedBN2LocalConclusion": { hash: "2ac8a3a6ac748ef68e77c51608c765fe3eedab375e2151ffe3bada21cd4258e1", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN2SquareLegitimacy" },
  "PNP.DirectWire.TerminalProjectionFourCorners.constantCutEquation_of_defects": { hash: "3924c2b0c70aa6dd413da7141d59aae08668cfdec5ba70273d495e58ff838623", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalProjectionTransfer" },
  "PNP.DirectWire.TerminalProjectionFourCorners.projectionExcess_pos_of_constantCut": { hash: "7f7c6eacac8e119e2ee7b56ca03e323fdf7f191d56c0ff5476883dba1a61e7d0", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalProjectionTransfer" },
};
const RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_SCOPE = "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-computed-governed-proper-positive-supports-forgetful-projections-executable-ambient-observers-and-positive-whole-support-projection-defect";
const RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_MILESTONE_SCOPE = "For every finite direct-wire candidate, explicit terminal dependency system, computed governed proper-positive support, forgetful projection, executable ambient observer, and positive whole-support projection defect, Lean computes the canonical minimum-cardinality positive anchor nucleus and returns either an insufficient nucleus, the exact first anchor-algebra mismatch, the exact first proper-cut defect mismatch, the proof-bearing first full-before-quotient local route, or exact constant-cut and local BN2 conclusions for every proper cut.";
const RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_NON_CLAIM = "This milestone assumes a positive whole-support projection defect and an explicit terminal dependency system. It does not derive either premise, identify manuscript activation or charge equivalence classes absent from the terminal model, connect a local failure to the complete global no-outcome route system, establish SaturatePositive, Package E, BCELReady or later BCEL/BN2-BN6 conclusions, prove ZeroSlack, PCCMin, polynomial runtime, SAT in P, remove a project assumption, or prove P = NP.";

const RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_THEOREMS = {
  "PNP.DirectWire.TerminalBCELAnchorProblem.wholeCorners_projectionDefect": { hash: "fbee489cf66528eb5de3ea666c16cfb7221542c1fa7517f89abd254e42722969", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationPositivityFirewall" },
  "PNP.DirectWire.TerminalProjectionPositivityLoss.minima_eq": { hash: "7d39c3e10341eea3705465cef7be52efa324670f71c9c414da8ad2f6193c232c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationPositivityFirewall" },
  "PNP.DirectWire.classifyTerminalSaturationPositivity_loss_of_zero": { hash: "fbfd655a027482cf0a1972df545cdd20956e3f83f964bd9f906f9b67db8f3a05", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationPositivityFirewall" },
  "PNP.DirectWire.classifyTerminalSaturationPositivity_bcel_of_positive": { hash: "8df5cb84391282920fd645d31c0799614ba07666c52afc87b1bcb51dc4a90080", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationPositivityFirewall" },
  "PNP.DirectWire.terminalSaturationPositivity_no_checkedFullLiftAtMinimum": { hash: "4e36c01f1002f0fcfccb4e0defe1f7e6cef7c550d08b265420aadf097997e877", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationPositivityFirewall" },
  "PNP.DirectWire.classifyTerminalSaturationPositivity_exhaustive": { hash: "8a414da78f16be40c2530a341a02eefe740d96b21387641d0dbad3e171d0307d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationPositivityFirewall" },
  "PNP.DirectWire.terminalProjectionDefect_eq_zero_iff_minima_eq": { hash: "0abc70a2376500b301bb104cc45264d70640a8212175fb9c1dba9817bb91059c", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" },
  "PNP.DirectWire.terminalFullProfileMinimumRealization_gateCount": { hash: "798da3be48963130ca415d60dbaea20fc06087f64068798e5c62634178d98259", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" },
  "PNP.DirectWire.terminalProjectionDefect_pos_no_checkedFullLiftAtMinimum": { hash: "6cb0a806515c14a4b43fdbe133833861a3cb21fdf0d48cd350f93ad8507eace2", axioms: ["propext"], module: "PNP.ResidualTerminalProjectionMinimum" },
  "PNP.DirectWire.TerminalProperPositiveSupport.saturatedRecords_closed": { hash: "adef8bf222cacc7e570bc02c5852d644eeec183dcb278c2105bfd655d6bda5e7", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalProperSupport" },
  "PNP.DirectWire.TerminalProperPositiveSupport.physically_compatible": { hash: "eb5bd2849c564caa6047404b4426b65d081a1153214db68e0023023a291f15e0", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalProperSupport" },
  "PNP.DirectWire.TerminalProperPositiveSupport.extracted_semantics": { hash: "56da805f2e24576e8611631f0d698fe7978557b40a05c0851f058e728303c897", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalProperSupport" },
};
const RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_SCOPE = "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-computed-governed-proper-positive-supports-forgetful-projections-and-executable-ambient-observers-total-zero-or-positive-whole-support-projection-defect-classification";
const RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_MILESTONE_SCOPE = "For every finite direct-wire candidate, explicit terminal dependency system, computed governed proper-positive support, forgetful projection, and executable ambient observer, Lean computes the whole-support defect: zero projection defect returns an attained quotient minimum with a checked full lift, while positive defect delegates exactly to the existing fail-closed BCEL anchor-nucleus classifier.";
const RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_NON_CLAIM = "This closes only projectionPositivityNotLostSilently in the current finite terminal model. It assumes an explicit terminal dependency system and an already computed governed proper-positive support. It does not discharge transparentSaturationCostBalanced, interfaceExposureRoutesToE, originKernelObligationClosureRouted, or firstNontransparentStepRecorded; establish full SaturatePositive, Package E, BCELReady or later BCEL/BN2-BN6 conclusions; prove ZeroSlack, PCCMin, polynomial runtime, SAT in P; remove a project assumption; or prove P = NP.";

const RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_THEOREMS = {
  "PNP.DirectWire.terminalSaturateTrace_eventsLinked": { hash: "0a2c3c3837e55a3fc6482b86ad0b384afaf0b6756ad836db6d8d97cf70475f33", axioms: ["propext"], module: "PNP.ResidualTerminalExecutableSaturation" },
  "PNP.DirectWire.terminalSaturateTrace_records": { hash: "ca6777bcf22e71b8a9fd6c6ba9b642bf5cff1e9da0678951e0727270703395e0", axioms: ["propext"], module: "PNP.ResidualTerminalExecutableSaturation" },
  "PNP.DirectWire.terminalCandidateSaturationSystem_profileSystem": { hash: "c5a0f51477e004b664a703c7689792b7d08d17198c667336c5aaca09af859a5a", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalCandidateSaturation" },
  "PNP.DirectWire.TerminalTransparentSaturationStep.uniqueMaterializerOwner": { hash: "1d99a8ebcdcb8ab4a92ead32a2165c1d9db4ac1578d92a5e641e419119b5716f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalTransparentSaturationStep.supportCostBalanced": { hash: "5047cdebb2104dc764d1676f5bdd821d8e45f91e2fba2deb1211fd6585363449", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalTransparentSaturationStep.fullCostBalanced": { hash: "4c0a1dffcb5ac72d2743c8b92781c0737ea9b1644c00e4fda6e1036494124ce2", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalTransparentSaturationStep.quotientCostBounded": { hash: "3697d87145c0de4be320b907304b0285aba779420f291e96a0e49e4b4ac4b837", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalTransparentSaturationStep.fullSlack_preserved": { hash: "79cc2719509883de624fd7048b32a6b35a0b42d66a2cfdd03e61ca163e93edbb", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalTransparentSaturationStep.projectionDefect_mono": { hash: "22b7cd1069ba4d5e2353c2c2017d58b7e672de723bbd845ddc2a527bd31b96e1", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalTransparentSaturationStep.fullPositive_preserved": { hash: "69b951a411b9579cdc5ebf2519fc6f304f3866f59fdbf803cdfccc0bc3e853f4", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalSaturationEventsLinked.fullSlack_preserved": { hash: "45847001ac67c7472e6b13432d4602ab47695181c8526459ba3253fb4ad1a34f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalSaturationEventsLinked.projectionDefect_mono": { hash: "36c7582fb28d35c3bb9a1086fdb5ffa5604778969adb14bd6b49c4e4f1362e32", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalSaturationEventsLinked.fullPositive_preserved": { hash: "da0af342efe39c484b1a5effd9124924581ed638b1e577f511dc6508e9469ffc", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalSaturationBalanceOutcome.balanced_event": { hash: "130f1fd981cf6b36eec26e96b2595146850c8388a6076fe4504b9c0915203741", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalSaturationBalanceOutcome.balanced_fullSlack_preserved": { hash: "fa9685981cb6b2db8c729a5fe506fffa0f32a43acdfb26f75b50a85ce7213c4c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalSaturationBalanceOutcome.balanced_projectionDefect_mono": { hash: "896b644460ba7b1d32ffa7624285c8b9ff501d0dcfe46e10e304ba3aa4160a55", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" },
  "PNP.DirectWire.TerminalSaturationBalanceOutcome.balanced_fullPositive_preserved": { hash: "41f32ac41a2fa7a60fe34c561ce71c85a606043eab735f60917ff80b161b669f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalSaturationCostBalance" }
};
const RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_SCOPE = "all-finite-direct-wire-candidates-executable-observers-forgetful-projections-candidate-derived-dependency-system-rule-labelled-exact-cost-balance-or-first-nontransparent-step";
const RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_MILESTONE_SCOPE = "For every finite direct-wire candidate, executable ambient observer, forgetful projection, and finite terminal seed, Lean computes the candidate-derived dependency system and deterministic rule-labelled saturation trace, then returns proof that every event is exactly cost-balanced with preserved full slack and nondecreasing projection defect, or records the exact first nontransparent event and complete transparent prefix.";
const RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_NON_CLAIM = "This closes only the finite terminal forms of transparentSaturationCostBalanced and firstNontransparentStepRecorded. The executable observer and forgetful projection remain explicit model inputs, and a nontransparent event is recorded rather than routed. It does not discharge interfaceExposureRoutesToE or originKernelObligationClosureRouted; establish full SaturatePositive, Package E, BCELReady or later BCEL/BN2-BN6 conclusions; prove ZeroSlack, PCCMin, polynomial runtime, SAT in P; remove a project assumption; or prove P = NP.";

const RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_THEOREMS = {
  "PNP.DirectWire.terminalInterfaceExposureCoordinate?_sound": { hash: "fd588e1aab5d670afcc23cadd40cc3dcf03214f8f4d222b955116e80a5c8f125", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalInterfaceExposureRouting" },
  "PNP.DirectWire.terminalCandidateInterfaceExposureCoordinate?_shape": { hash: "0f6ea712760c01fdb762902ad020dcf4a9f3c45dba0e2a91790b6bfd327cace7", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalInterfaceExposureRouting" },
  "PNP.DirectWire.terminalCandidateInterfaceExposureCoordinate?_edge": { hash: "d168a3362f7b52afd52451d87eff1eedb6302016786c4c763e0965ebcea08880", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalInterfaceExposureRouting" },
  "PNP.DirectWire.terminalInterfaceOutgoingCoordinate_eventCost_zero": { hash: "74c702f16d6714a455bad571c647ae4903581a174b7c31b1e37b426b10a78160", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalInterfaceExposureRouting" },
  "PNP.DirectWire.TerminalInterfaceExposureERoute.sound": { hash: "57ae2f434a17a9c5c9a91cd17844f55fa7d72086827598e9bcf6ce7d2441803e", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalInterfaceExposureRouting" },
  "PNP.DirectWire.TerminalInterfaceExposureZeroCostRetract.eventCost_zero": { hash: "c098e9bfd76067bbc7a2d4223c0107dae920d3378e47a002f58e71f24ed0404b", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalInterfaceExposureRouting" },
  "PNP.DirectWire.TerminalInterfaceExposureZeroCostRetract.fullSlack_preserved": { hash: "e47bd2a49bb380282d5c6b7b950390dbfea623a55c0c6a5b93a9875215cff293", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalInterfaceExposureRouting" },
  "PNP.DirectWire.terminalInterfaceExposure_transparent_or_eRoute": { hash: "71207620ad161eb833ad413ed00fccd4d14af5c5720f812c7ecff00eca892336", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalInterfaceExposureRouting" },
  "PNP.DirectWire.TerminalFirstInterfaceExposureRoute.sound": { hash: "cef4ceb9d4650c0847c740c6126132dc9fa78100d83502b1c887cd6d3d31b8d0", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalInterfaceExposureRouting" },
  "PNP.DirectWire.classifyTerminalSaturationInterfaceRouting_exhaustive": { hash: "3f2cf5f03389537c02418758fd531dfa427be40d6773ddfa5fd6104c3a798c38", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalInterfaceExposureRouting" }
};
const RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_SCOPE = "all-finite-direct-wire-candidates-executable-observers-forgetful-projections-candidate-derived-interface-consumer-transparent-or-local-e-route-with-exact-first-failure";
const RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_MILESTONE_SCOPE = "For every finite direct-wire candidate, executable ambient observer, forgetful projection, and finite terminal seed, Lean recognizes only an exact candidate-derived interface-consumer edge. Each recognized event is transparently cost-balanced or produces a proof-bearing local E-route; the production trace result records the exact first nontransparent event and complete transparent prefix, while non-interface first failures remain fail-closed.";
const RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_NON_CLAIM = "This closes only the finite local form of interfaceExposureRoutesToE. The proof-bearing local E-route is an exposure-obligation coordinate, not a full Package E VerifyDW acceptance, a verified global gain, or global route completeness. The executable observer and forgetful projection remain explicit model inputs. It does not discharge originKernelObligationClosureRouted; establish full SaturatePositive, Package E, BCELReady or later BCEL/BN2-BN6 conclusions; prove ZeroSlack, PCCMin, polynomial runtime, SAT in P; remove a project assumption; or prove P = NP.";

const RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_THEOREMS = {
  "PNP.DirectWire.terminalOriginKernelObligationCoordinate?_sound": { hash: "fe2fafdfcb67fecf4c1b2b544645b0f6af7ec9a5b5761ee8d6a23ba2ae140a60", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalOriginKernelObligationRouting" },
  "PNP.DirectWire.terminalCandidateOriginKernelObligationCoordinate?_shape": { hash: "5473c0dae862ab3face4f83003143ffb94887a88cdac6edba739f2470fe9b0eb", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalOriginKernelObligationRouting" },
  "PNP.DirectWire.terminalCandidateOriginKernelObligationCoordinate?_edge": { hash: "12fcaaad403c4bf2f0ed3e218fac247139db20db8b103bd35c751664ebfad8be", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalOriginKernelObligationRouting" },
  "PNP.DirectWire.TerminalOriginKernelObligationClosureRoute.sound": { hash: "a6ccf72ac02146fb0d00f77f1bd68f5d10e95bd3a9575881976593dbca19ab17", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalOriginKernelObligationRouting" },
  "PNP.DirectWire.terminalOriginKernelObligation_safe_or_route": { hash: "996fad4b79e3d3e5b0cce63e094b597d9ee731556df3c73f38bbb9761343330f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalOriginKernelObligationRouting" },
  "PNP.DirectWire.TerminalSaturationClosureSafeStep.transparent": { hash: "cb47374327a74960b19f7f9bb46af7bd0ad6b766608187d755f10edddd74d4bd", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalOriginKernelObligationRouting" },
  "PNP.DirectWire.classifyTerminalSaturationClosureRouting_exhaustive": { hash: "bff24fddcdc569451d7963003194317f0d018bdd4906314ff791d8effd8fac92", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalOriginKernelObligationRouting" },
  "PNP.DirectWire.TerminalFiniteSaturatePositiveOutcome.sound": { hash: "5acc708881d1450e3e86abe5c1e0152ee6000d58ed0b5999c249d6efafcab69b", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFiniteSaturatePositive" },
  "PNP.DirectWire.classifyTerminalFiniteSaturatePositive_exhaustive": { hash: "2f114bbe06ba71cfb038dcc5ff686516e7af0461d9a85e6dbda0e1104a814655", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalFiniteSaturatePositive" }
};
const RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_ORIGIN_KERNEL_OBLIGATION_ROUTING_SCOPE = "all-finite-direct-wire-candidates-executable-observers-forgetful-projections-candidate-derived-origin-kernel-obligation-closures-with-exact-safety-or-first-route";
const RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_SCOPE = "all-finite-direct-wire-candidates-executable-observers-forgetful-projections-proof-bearing-positive-full-slack-candidate-bcel-anchor-problems-total-finite-saturate-positive-composition";
const RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_MILESTONE_SCOPE = "For every finite direct-wire candidate, executable ambient observer, forgetful projection, and proof-bearing candidate BCEL anchor problem whose normalized seed has positive full slack, Lean recognizes exact candidate-derived origin, kernel, and obligation closures in both gate/profile orientations; checks cost transparency, obligation discharge, and forgotten-profile stability; preserves positive full slack across an all-safe trace into the checked-lift or BCEL firewall; or returns the exact first interface, closure, or other fail-closed nontransparent route with its complete safe prefix.";
const RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_NON_CLAIM = "This closes the finite local form of originKernelObligationClosureRouted and composes the five reconstructed terminal sub-obligations only for an explicit proof-bearing problem. A local route is not a complete global outcome, Package E VerifyDW acceptance, verified gain, or global route-completeness result. The positive initial full-slack premise remains explicit. It does not establish manuscript-wide SaturatePositive, BCELReady, RankWF, ZeroSlack, PCCMin, polynomial runtime, SAT in P; remove a project assumption; or prove P = NP.";

const RESIDUAL_TERMINAL_RANK_WF_THEOREMS = {
  "PNP.DirectWire.TerminalResidualRank.coordinates_mk": { hash: "57af7b4eb47b5cbe545130dc28fcd2f55639b943e825554d8bf737d697e523da", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.TerminalResidualRank.coordinates_length": { hash: "f7c47ca67c9e7cacf3b19d070b7fb357070a24c89e0dbb0c1d71a5f60ba61986", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRankLTBool_eq_true_iff": { hash: "2e5d299f8e31bf5acbdd94d3c4b59aa41a65c8068df3a6e0f7db1adb98fc638f", axioms: ["propext"], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRankLTBool_eq_false_iff": { hash: "820ef336efa299fccbd7cb1c821f08e32bc0b48236a3899c1325a5e986fa575a", axioms: ["propext"], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRankLexLT_wellFounded": { hash: "150edb34b098834a1bbf25c81962f15d26a019b4ef771b8dd0ff230eeba73322", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRank_accessible": { hash: "eff808821047b3ef8c355aa6b0d5ed7d5cfb5e82d31e271ef00259d34124daa9", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRank_induction": { hash: "cc8b7d24d41d0004ebf5c5dfba80dd253e8525e4da0ba5938c8fdd046b411068", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRank_witnessType_lt": { hash: "2e375926b8965ff0c03cb1db89f9b60ec9cf3f495f379220cd73e8c917532489", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRank_spanType_lt": { hash: "c468941041e0df2788ecc3ad46c121402523c3641cc296108079cc50bd54dca3", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRank_mode_lt": { hash: "350a6ebed3907c37c22c0837ad0ac5f48a24ac67cb3d9cba5ce7738be68129c1", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRank_frontierDefect_lt": { hash: "af32c68cf5b32ff213f822571b28b4aedf5739381e41dca936426c1b2c97af65", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRank_projectionDefect_lt": { hash: "4af50f8b8cbf83c711b554bb95a7722d1c40d1848ba76ca2b3287457701dc454", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRank_saturationDefect_lt": { hash: "c80058655b00ef3a4aead9cd73eaeb2b00657cdaa0844bbeb837d1a64e5dc58a", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRank_anchorCount_lt": { hash: "dc8ee9116a92beb686e2d28a84c78ed5cc0d333fdbc015a365615d5507eac4cb", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRank_chargeSize_lt": { hash: "bba66c1a0a7249c35dd7ecc9cf53a7303ce0187058cb0fd25342e6d7154e11ba", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRank_profileSize_lt": { hash: "42228d10e71af76dd08669f00511a1b43bebb0085ccff8b5d14b848e5903a07f", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.terminalResidualRank_canonicalCode_lt": { hash: "b3783268f850ea30f5e444e8a78a09ed278d1224990bbe725a89681dbd59d10e", axioms: [], module: "PNP.ResidualTerminalRankWF" },
  "PNP.DirectWire.TerminalResidualRankDescent.sound": { hash: "4c4bf650e6b68d7ec6d654c4fe37ad523959cb254bb5cb871cda50c79515ada5", axioms: [], module: "PNP.ResidualTerminalRankWF" }
};
const RESIDUAL_TERMINAL_RANK_WF_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_RANK_WF_THEOREMS).map(([name, row]) => [name, row.hash])
);

const RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_THEOREMS = {
  "PNP.DirectWire.terminalListSubsets_sublist": { hash: "ea0fefb3d241ebd81df124fbdb49a8409c1e6e77a111af3b6d4755e78c0c4d75", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN3RequestEnvelope" },
  "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.requestAtoms_nodup": { hash: "70d9d0ef627ae3aee1ec6acd2c18851d0ff7b95205b10b44d2a94bf1a10c0782", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN3RequestEnvelope" },
  "PNP.DirectWire.terminalBN3RequestPredicateBool_eq_true_iff": { hash: "d23816d817a4215617f422ba2115ef3479ad37d3874677a233d95d394420a845", axioms: ["propext"], module: "PNP.ResidualTerminalBN3RequestEnvelope" },
  "PNP.DirectWire.terminalBN3RequestPredicate_monotone": { hash: "46738bea433318a3dd0010b1f7fa4a2c7a459e1f1c9e0afc4a3689f102a69bdf", axioms: [], module: "PNP.ResidualTerminalBN3RequestEnvelope" },
  "PNP.DirectWire.terminalBN3RequestPredicate_stable": { hash: "764cfe5b3bc264ca81e21e70e7e37126cc0b0364c3ddef55ad697d04e74b0da4", axioms: [], module: "PNP.ResidualTerminalBN3RequestEnvelope" },
  "PNP.DirectWire.terminalBN3MinimalConsumer_exact": { hash: "a1189497569adab96a59946dd9d36f8a29d2e42f032edeac1b3fff4730c27cc4", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN3RequestEnvelope" },
  "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.mem_activeRequestAtoms_iff_properCut": { hash: "28274a11c24513babce9f9e4c688d850cd5cb0bf4d7c9651bb57271ec1b146b0", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN3RequestEnvelope" },
  "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.activeRequestAtoms_nodup": { hash: "10d73bb885691775aa9ad252db596e67947b09caf7bf57cb64bb8abff1872f01", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN3RequestEnvelope" },
  "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.canonicalRequestBasis_jointlySideTight": { hash: "67b597e0839d1fccc67284f54d88fb1fcc8990a5fe42360ea07992525b752a68", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN3RequestEnvelope" },
  "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.computedBN3RequestEnvelope": { hash: "f07860cfece7a85bb738c2b951cd6b43b92bbd5ce6365d520888a011b1069ed0", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN3RequestEnvelope" },
  "PNP.DirectWire.classifyTerminalBN3RequestEnvelope_exhaustive": { hash: "c88c263df187c383ee764d7c39926988cd8994bb894c33aa7482b2924c53c8de", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN3RequestEnvelope" }
};
const RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_SCOPE = "successful-computed-finite-bcel-anchor-nuclei-canonical-stable-request-identities-exact-singleton-minimal-consumers-duplicate-free-incidence-and-jointly-side-tight-full-or-quotient-basis-family";
const RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_MILESTONE_SCOPE = "From every successful computed finite BCEL anchor nucleus, Lean uses one canonical duplicate-free primitive-record identity list across every proper cut; gives exact executable monotone request membership stable under extensional transport and exact singleton minimal consumers; accounts active incidences without duplicates; selects one canonical full or quotient side-tight coherent basis for every proper cut; and preserves all upstream proof-bearing classifier failures in a total outcome.";
const RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_NON_CLAIM = "This establishes one exact candidate-derived finite BN3 envelope only after the existing computed BCEL anchor-nucleus classifier succeeds. Proper cuts are enumerated through all subsets, so the construction is exponential reference computation rather than a polynomial algorithm. It does not derive the terminal dependency system, map local routes into the manuscript's complete global outcome system, construct BN4-BN6, prove selector or realizer completeness, establish global ZeroSlack or PCCMin, prove SAT in P, remove a project assumption, or prove P = NP.";
const RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_THEOREMS = {
  "PNP.DirectWire.terminalBN4ActivationCode_active_iff": { hash: "8afb6c83f2c71153fa2c1973ce6ce66a1568db44d90e332e767be92d9b6d9049", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" },
  "PNP.DirectWire.terminalBN4ActivationCode_eq_iff_activation": { hash: "f93b4fd8727f8007268397889168591d99ef685c28745dc9974ab0ffdb0410e4", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" },
  "PNP.DirectWire.terminalBN4ActivationKey_eq_iff": { hash: "b2ad109751baa42293aefadde7bf9abd710ee92d29861446fce5e76d5b1f1c75", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" },
  "PNP.DirectWire.terminalBN4IntegerMassLedger_exact": { hash: "546e462e0ef7dde2e206b4aa76a5423fdb6e90288d386d5b1e7b40ab4e499307", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" },
  "PNP.DirectWire.TerminalBN4KeyCancellation.residual_key_eq": { hash: "4f9cfd1be354f2d98412ce0a576b6ac70776fe36e14802c144f55f6f8ec9acfa", axioms: ["propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" },
  "PNP.DirectWire.TerminalBN4KeyCancellation.residual_mass_positive": { hash: "18a3f982541deffbab7328288f27c9234355cb44cb6582e2a5ea214813cbdd57", axioms: ["propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" },
  "PNP.DirectWire.TerminalBN4KeyCancellation.no_opposite_sign_residual": { hash: "1068875545d4960dffa31dc9b4a07eea73dadb4f959c91c44631809a9b09c712", axioms: ["propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" },
  "PNP.DirectWire.TerminalBN4KeyCancellation.residual_signedContribution_exact": { hash: "09061be38da7ae908439addb860433baa3ab6b3b5cb5fe941a98069f898e40f5", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" },
  "PNP.DirectWire.terminalBN4CancelAtKey_signedContribution_exact": { hash: "32a8c0b81eea0c08a8ad9f2b81a061205c821f47dd02b20a0eaa3e4c49e19bb9", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" },
  "PNP.DirectWire.terminalBN4CanonicalKeys_nodup": { hash: "3bcc443216fe3c17d072c30bc90b0006609e6a3f7222656ac47a622a6c7e3767", axioms: ["propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" },
  "PNP.DirectWire.terminalBN4CellsUseCanonicalAtoms_iff": { hash: "ed064aad0541a0234527b9e064b4b9cddadaa699a26517e9bd8b662c0ea27b23", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" },
  "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.computedBN4ActivationCancellation": { hash: "d57599983f9df1f99d9e2784ffb08941c3bf5361754b826e5bf0e6915f3aef7d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" },
  "PNP.DirectWire.classifyTerminalBN4ActivationCancellation_exhaustive": { hash: "bf2a3ab3f2cc83cb4e4d11885d8b7d012b14fe0b813604648990a6f547505f00", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN4ActivationCancellation" }
};
const RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_SCOPE = "successful-computed-finite-bn3-envelope-explicit-typed-cell-ledgers-activation-exact-complete-key-same-key-cancellation-and-exact-integer-mass-residuals";
const RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_MILESTONE_SCOPE = "After a successful computed finite BN3 envelope, Lean gives every request atom a canonical singleton activation code; proves activation-code equality exactly equivalent to equality of activation functions without enumerating cuts; checks equality of a complete typed key containing the atom, explicit semantic signature, and explicit transport type; totals positive and negative natural mass only at that same complete key; classifies a canonical balanced, positive, or negative residual; proves exact integer mass conservation, complete-key preservation, positive residual mass, and absence of opposite-sign residual pairs; computes duplicate-free ledger keys; and preserves all upstream failure branches while rejecting foreign request atoms.";
const RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_NON_CLAIM = "This is a finite cancellation kernel over an explicit typed cell ledger. It does not derive cells, semantic signatures, or transport types from four-corner bases and is not the full historical BN4 theorem. It supplies no polynomial construction or size bound; does not construct PkgC or BN6; does not complete global routes, selectors, or realizers; does not establish ZeroSlack or PCCMin; does not put SAT in P; does not remove a project assumption; and does not prove P = NP.";
const RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_THEOREMS = {
  "PNP.DirectWire.terminalBN5ShadowCoordinate_eq_iff": { hash: "8bff617398ee48e2e0b703c252fe76e54989a81857c112937a71e1544db6ce92", axioms: [], module: "PNP.ResidualTerminalBN5FullShadowLocalization" },
  "PNP.DirectWire.terminalBN5FullUnits_length": { hash: "7310efd9f63c51b5578b5b680e2f132235c239111bc3e0fc532131a8a08e846d", axioms: ["propext"], module: "PNP.ResidualTerminalBN5FullShadowLocalization" },
  "PNP.DirectWire.terminalBN5FullUnits_key_eq": { hash: "7de16fa934c64198752a28206304e046a6a0d894436f6624ca8aa688447459d9", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN5FullShadowLocalization" },
  "PNP.DirectWire.TerminalBN5HallDeficit.neighbor_card_lt_full_card": { hash: "d39739401d983bac70c43eb4ea55463b5880586f7f617626023feab137f7e890", axioms: [], module: "PNP.ResidualTerminalBN5FullShadowLocalization" },
  "PNP.DirectWire.TerminalBN5HallDeficit.fullSubset_coordinate_eq": { hash: "935e457ede4a6d839787b1c563f1fe9b5c48813b2e1d8dbcfac865dabbb44bf3", axioms: ["propext"], module: "PNP.ResidualTerminalBN5FullShadowLocalization" },
  "PNP.DirectWire.TerminalBN5HallDeficit.neighbor_coordinate_eq": { hash: "7a044d854c4d37be35b31bea28997ea235d7e088d18f859df8d6c7316b6cda5f", axioms: ["propext"], module: "PNP.ResidualTerminalBN5FullShadowLocalization" },
  "PNP.DirectWire.classifyTerminalBN5ShadowMatching_exhaustive": { hash: "daa39d3dc5252bc6eafa09474a9f1f91642c40957251fe7d69b1db28bbd35e29", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN5FullShadowLocalization" },
  "PNP.DirectWire.TerminalBN4KeyCancellation.negativeResidualMass?_positive": { hash: "dd8fcb3c7caa6eefd822407110d5621906a6a3f812f651d52ff2d0a5d6c07c9d", axioms: ["propext"], module: "PNP.ResidualTerminalBN5FullShadowLocalization" },
  "PNP.DirectWire.TerminalBN5HallDeficit.namedLocalRoute_eq_x1Hall": { hash: "76b66e4be0893605464be5e7498b300a796a6913b5194e09577eae4b00b17e04", axioms: [], module: "PNP.ResidualTerminalBN5FullShadowLocalization" },
  "PNP.DirectWire.classifyTerminalBN5FullShadowLocalization_active": { hash: "022b89b6ed7a65c81d886a4467cea34ee98e37c50fae199996774070ca7b52d4", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN5FullShadowLocalization" },
  "PNP.DirectWire.TerminalBN5HallDeficit.unmatchedShadowNotSilent": { hash: "1472e6b4b8992222aac9a8a93b52fd0cce8b696f13bc5d2403ff321462be823f", axioms: [], module: "PNP.ResidualTerminalBN5FullShadowLocalization" },
  "PNP.DirectWire.classifyTerminalBN5FullShadowLocalization_exhaustive": { hash: "be1af480ae6864a553e86c154bcbc67ac7b72b01df96b5580c9b9eadeebb4cc3", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN5FullShadowLocalization" }
};
const RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_SCOPE = "all-finite-exact-coordinate-negative-unit-refinements-computed-cut-silence-complete-multiplicity-coverage-or-strict-hall-deficit-with-local-x1-nonsilence";
const RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_MILESTONE_SCOPE = "For every explicit finite negative-unit refinement and quotient-shadow ledger, Lean preserves the complete exact-coordinate data, validates the negative mass refinement, computes whether the cut is silent, and otherwise returns either complete multiplicity coverage or a strict Hall deficit with a literal smaller shadow-neighbor fibre, complete-coordinate preservation, and a proof-bearing local X1 route that prevents active unmatched units from disappearing silently.";
const RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_NON_CLAIM = "This kernel starts from explicit finite inputs: one complete BN4 key, a negative cancellation result, a payload list, a cut, and a quotient-shadow coordinate list. It does not derive payloads or shadows from four-corner bases, connect complete matching back to a BN4 contradiction, or prove the full CritC/Q/E/L/X2/X3/X4 diagnosis, so it is not the full historical BN5 theorem. It does not construct PkgC or BN6; complete global routes, selectors, or realizers; establish polynomial generation or runtime, ZeroSlack, or PCCMin; put SAT in P; remove a project assumption; or prove P = NP.";
const RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_THEOREMS = {
  "PNP.DirectWire.terminalPkgCPairNeedsRestoration_eq_true_iff": { hash: "184ddf69a99d22a191c773492f5544b457d72987222ef40fc00edadd977a95e2", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCSeparatingConsumers" },
  "PNP.DirectWire.firstTerminalPkgCSeparatingPair?_sound": { hash: "d13683190a71031aa6df3b201dc1507fe83dd005867b9c5d8a4f8738ad3fd6bf", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCSeparatingConsumers" },
  "PNP.DirectWire.firstTerminalPkgCSeparatingPair?_eq_none_iff": { hash: "4b671f164446da2714ecf89d93203f53cf07380f60cfd5d70b7301f6c831cbdc", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCSeparatingConsumers" },
  "PNP.DirectWire.TerminalPkgCSeparatingPair.quotientUnits_length": { hash: "207c3a318d1e4bbde2a33bc01afd96f674b6973a0cf5d595e3739af8f3b0e6c9", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCSeparatingConsumers" },
  "PNP.DirectWire.TerminalPkgCSeparatingPair.quotientUnits_nonempty": { hash: "1be63df6d57723d5183ecc39a11d3ed346430ecaf57c118399b2358a5862bfbc", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCSeparatingConsumers" },
  "PNP.DirectWire.terminalPkgC_restorationEdge_preservesCoordinate": { hash: "614c064c69d3e39441036d8b1e70a6f2f5f15b2e6523b1ae094ed34b7bae1e8d", axioms: [], module: "PNP.ResidualTerminalPkgCSeparatingConsumers" },
  "PNP.DirectWire.TerminalBN5HallDeficit.pkgCRestorationNotSilent": { hash: "bec861192dedeca58ccdb1b9764e428715730d5b66c2dd5bdd3f688957ff7b27", axioms: [], module: "PNP.ResidualTerminalPkgCSeparatingConsumers" },
  "PNP.DirectWire.terminalPkgC_separatingConsumers_restorationDichotomy": { hash: "690a8f82885a284547a453cbfd6858ef8d8d7c4201e710f79a9eca9faa92df81", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCSeparatingConsumers" },
  "PNP.DirectWire.classifyTerminalPkgCSeparatingConsumers_exhaustive": { hash: "a05d8069e347cf7f63b59aef148e10f5587461d09bd0fff8f400b7cc7b4f1d2f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCSeparatingConsumers" }
};
const RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_SCOPE = "all-finite-explicit-minimal-consumer-antichains-pkgc-separating-consumer-first-pair-canonical-atoms-exact-coordinate-restoration-or-strict-hall-local-q";
const RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_MILESTONE_SCOPE = "For an arbitrary finite explicit minimal-consumer antichain, Lean canonically scans for the first disjoint pair that is not singleton-singleton. Absence proves exactly V54's singletonization premise. A found pair's atoms are canonically indexed into exact-coordinate quotient units and an explicit full-restoration universe is classified into complete multiplicity coverage or a strict Hall deficit with a deterministic local Q route.";
const RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_NON_CLAIM = "The restoration coordinate universe remains explicit. This theorem does not derive consumers or restorations from a terminal candidate, connect complete coverage back to a BN4 or BN5 contradiction, embed the Hall route into the complete global outcome system, prove global route silence, or establish the full historical PkgC theorem. It does not prove full BN6 or Packet selector-realizer completeness, polynomial generation or runtime, ZeroSlack or PCCMin, SAT in P, remove a project assumption, or prove P = NP.";

const RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_THEOREMS = {
  "PNP.DirectWire.TerminalPkgCSeparatingPair.fullRestorationCandidates_length": { hash: "e8ebfbe79ccfd79fd39fa8fb08f4acc15b21ac3db9921fa8d5b52e0e2a5a79fc", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCTypedRestoration" },
  "PNP.DirectWire.TerminalPkgCSeparatingPair.fullRestorationCandidates_coordinates": { hash: "57100efabcf0df012a064db5aff2245ac10175a4a707f4e77828ae0a8019853f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCTypedRestoration" },
  "PNP.DirectWire.TerminalPkgCTypedRestorer.coordinateUniverse_coordinates": { hash: "4920e21b59be97f91a2a1c65a03e7ec45568c7cefac10befd5e3a2eb7bc9dbe1", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCTypedRestoration" },
  "PNP.DirectWire.terminalBN5FullMultiplicity_indexed_eq": { hash: "ad9719c4739ea079ecad2f390c8d47b5e1d598d4c3a07e8b2dd0934af7c338dd", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCTypedRestoration" },
  "PNP.DirectWire.terminalBN5ShadowMultiplicity_indexed_eq": { hash: "e8a05bdc4278abd66b3bdd3bd58a0163a6ccc107019a302fd49613ebffc83cbd", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCTypedRestoration" },
  "PNP.DirectWire.TerminalPkgCSeparatingPair.typedRestoration_exactCoverage": { hash: "51e6dff93008693f5b2daa3c8b8369933abaff1550bb3482c9ec02b3f7ca4d73", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCTypedRestoration" },
  "PNP.DirectWire.terminalBN5CompleteMultiplicityMatching_not_hallDeficit": { hash: "ccad95b996ac06b5c602110f765022263fab1d9db31c979f0fd7b46f9c615929", axioms: [], module: "PNP.ResidualTerminalPkgCTypedRestoration" },
  "PNP.DirectWire.terminalPkgC_typedRestoration_realization": { hash: "0b26c740c02a95570364ba233ce3671bb5250dae0d99237e06e0374e017b5301", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCTypedRestoration" },
  "PNP.DirectWire.classifyTerminalPkgCTypedRestoration_exhaustive": { hash: "8a161f64784fb6fc510c7cf8820556b4e774432191713bd1369944b99db13583", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCTypedRestoration" }
};
const RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_SCOPE = "all-finite-explicit-minimal-consumer-antichains-typed-full-restoration-candidates-coordinate-preserving-exact-multiplicity-coverage-no-hall-or-singletonized";
const RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_MILESTONE_SCOPE = "For an arbitrary finite explicit minimal-consumer antichain and a typed coordinate-preserving restoration operation, Lean materializes typed full-restoration candidates for every atom of the canonical first disjoint nonsingleton pair, proves exact candidate count and positional coordinate preservation, derives complete equality-fibre multiplicity coverage, excludes a strict Hall deficit for that graph, and otherwise proves V54 singletonization.";
const RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_NON_CLAIM = "The typed restoration operation remains explicit caller data. This milestone does not construct it from a terminal candidate or prove its full semantic adequacy. It does not connect complete restoration to a BN4 or BN5 contradiction, embed local routes into the complete global outcome system, prove global PkgC route silence or the full historical PkgC theorem, establish full BN6 or Packet selector-realizer completeness, polynomial generation or runtime, ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP.";

const RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_THEOREMS = {
  "PNP.DirectWire.terminalPkgCRestorationCancellationCellsForAtom_key_eq": { hash: "5ae8e007ae6df7f2c31cc9206969f2e8a072aad3286a9ac7f725151f52a813b3", axioms: [], module: "PNP.ResidualTerminalPkgCSameKeyCancellation" },
  "PNP.DirectWire.terminalPkgCRestorationCancellationCellsForAtom_balanced": { hash: "c33bffa228c261859ecbf843b325ad9f6d3ca9b0a9015c79d4b92a38e24feb22", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCSameKeyCancellation" },
  "PNP.DirectWire.terminalPkgCRestorationCancellationCellsForAtoms_length": { hash: "e27a9056fc4becad48acccfbdd79394cf84b3ba2f9fadae0110fe89d08fb637c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCSameKeyCancellation" },
  "PNP.DirectWire.terminalPkgCRestorationCancellationCellsForAtoms_balanced": { hash: "935e170044233eb06f9abea0e550c455372e73fb13f592096393f9fabf077a92", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCSameKeyCancellation" },
  "PNP.DirectWire.TerminalPkgCSeparatingPair.restorationCancellationCells_length": { hash: "2479de06e3fe85fd636bca248b0596f524b09d68c18625e2423131431530e075", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCSameKeyCancellation" },
  "PNP.DirectWire.TerminalPkgCSeparatingPair.restorationCancellation_balanced": { hash: "d319561914eba29a5673945a4e85a7923e0c47396e0c9f243d90b8057be2ac6e", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCSameKeyCancellation" },
  "PNP.DirectWire.TerminalPkgCSeparatingPair.restorationCancellation_residualCells_empty": { hash: "6cf6d44aa6e244a8f245a79fee4834e0bb2e1836b9353278f522256176499fb6", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCSameKeyCancellation" },
  "PNP.DirectWire.TerminalPkgCSeparatingPair.restorationCancellation_signedMass_zero": { hash: "0524782f70301d75c278d5bda7865945e932e2fce0f4a2eff65a284118312a48", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCSameKeyCancellation" },
  "PNP.DirectWire.terminalPkgC_typedRestoration_sameKeyCancellation": { hash: "b8acb10618219c2980c026a7bdfa92bddd5da3810f449e8249bd820f31abb1e7", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCSameKeyCancellation" },
  "PNP.DirectWire.terminalPkgC_sameKeyCancellation_silence_singletonizes": { hash: "c0feb56a30d17811ddf2d13bb7a645ac55d8e99af90d1ccd9cad99409745c229", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCSameKeyCancellation" },
  "PNP.DirectWire.classifyTerminalPkgCSameKeyCancellation_exhaustive": { hash: "c8c63bd0d8f1c967d9e4809d87f62692c9532dd52ea3f895b372baf3aacdfe95", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPkgCSameKeyCancellation" }
};
const RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_SCOPE = "all-finite-explicit-minimal-consumer-antichains-typed-exact-coordinate-restoration-canonical-opposite-sign-bn4-ledger-every-key-balanced-empty-residual-or-singletonized-under-cancellation-silence";
const RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_MILESTONE_SCOPE = "For an arbitrary finite explicit minimal-consumer antichain and typed exact-BN5-coordinate restoration operation, Lean mechanically pairs every quotient atom with its restored full candidate as opposite-sign unit cells, proves the complete BN5 coordinate gives the same nested BN4 key, proves exact cell count and positive/negative multiplicity equality at every BN4 key, computes an empty canonical residual and zero signed mass at every key, and derives V54 singletonization from exact absence of every such proof-bearing cancellation outcome.";
const RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_NON_CLAIM = "The typed restoration operation and its complete coordinate maps remain explicit inputs, and the generated opposite-sign cells are not yet proved to be the cells of the terminal candidate's ambient BN4 ledger. This milestone does not construct semantic restorations from a terminal candidate, embed cancellation or Hall outcomes into the complete global route system, prove global route silence or the full historical PkgC theorem, establish full BN6 or Packet selector-realizer completeness, polynomial generation or runtime, ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP.";
const RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_THEOREMS = {
  "PNP.DirectWire.terminalBN4PositiveMass_perm": { hash: "85bd3e3748cd1d2bb7a6a749fccbe75077fe4106abdb04f09f33a565d1490e1a", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCAmbientBN4Ledger" },
  "PNP.DirectWire.terminalBN4NegativeMass_perm": { hash: "a435189ebdd2cadb72ffdc828902e5742a70454f3ac0ea4e5c3662a77ec0617a", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCAmbientBN4Ledger" },
  "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.generatedCell_mem_ambient": { hash: "0400f254d1878e4f48c958624f668122b42c962f74a364f3bf71d78e5ebf566a", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCAmbientBN4Ledger" },
  "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.cellMultiplicity": { hash: "aff33101668df454702b45e679f747daafe4d20a52bb22ccbef17cd29c09e0fc", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalPkgCAmbientBN4Ledger" },
  "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.length_eq": { hash: "ea024f99fd89e753345fa4f243a4fb33e1bc0c921ca934756d7f67e377f37fc3", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalPkgCAmbientBN4Ledger" },
  "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.positiveMass_decomposition": { hash: "36fcc5e8b04c550b486db6de05bb45c390de48ef4bbb5d82437ee188b144a73d", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCAmbientBN4Ledger" },
  "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.negativeMass_decomposition": { hash: "440dcc6be267fba103c1d2513b91f8ef08358945423bafc22f60a2a914156a52", axioms: ["propext"], module: "PNP.ResidualTerminalPkgCAmbientBN4Ledger" },
  "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.signedMass_eq_remainder": { hash: "9ecef4614b102d75ab6cdd46548c476d8bec4826e01626ce7915670ea83367e7", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalPkgCAmbientBN4Ledger" },
  "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.residualSignedContribution_eq_remainder": { hash: "4cbbe3e3b8dc8fff891e3c1b51be4e243c20e57dd608ae0f89105ea24126c6d5", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalPkgCAmbientBN4Ledger" },
  "PNP.DirectWire.classifyTerminalPkgCAmbientBN4LedgerBinding_exhaustive": { hash: "f1d936219b9bd109c053dd7ab1ba812ab43a2d0ca1e58bc03540240620b24c89", axioms: [], module: "PNP.ResidualTerminalPkgCAmbientBN4Ledger" },
  "PNP.DirectWire.TerminalPkgCComputedAmbientBN4Cancellation.generatedCell_usesCanonicalAtom": { hash: "6a7666c50b1f30c2cb77e5c753fcb3a38425a2e0f22d26995a255d7d3722044e", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalPkgCAmbientBN4Ledger" },
  "PNP.DirectWire.terminalPkgC_computedAmbientBN4_silence_singletonizes": { hash: "4b96422cac84512b54cddd07166448c40e646f83b6ad0a4ec521b8bb64e3ce6b", axioms: ["Quot.sound","propext"], module: "PNP.ResidualTerminalPkgCAmbientBN4Ledger" }
};
const RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_SCOPE = "all-finite-explicit-ambient-bn4-ledgers-exact-multiset-embedding-balanced-generated-subledger-removal-preserves-remainder-signed-mass-and-candidate-derived-canonical-atom-linkage";
const RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_MILESTONE_SCOPE = "For arbitrary finite explicit BN4 cell ledgers, Lean proves that a proof-bearing exact multiset embedding identifies the generated PkgC opposite-sign cancellation ledger with an ambient subledger and preserves every duplicate. Positive and negative mass decompose at every complete key; removing the balanced generated subledger leaves the ambient signed mass and executable residual signed contribution exactly equal to an explicit remainder. A successful candidate-derived BN4 kernel additionally proves every embedded generated cell uses its canonical request-atom space, and complete bindings plus exact absence of every computed bridge imply V54 singletonization.";
const RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_NON_CLAIM = "The ambient ledger, typed restoration operation, exact permutation certificate or canonical serialization, and successful candidate-derived BN4 kernel remain explicit proof-bearing inputs. This milestone does not derive the ambient ledger or restorer from a terminal candidate, prove the restorer's semantic adequacy, embed local cancellation or Hall outcomes into the complete global route system, prove global PkgC route silence or the full historical PkgC theorem, establish full BN6 or Packet selector-realizer completeness, polynomial generation or runtime, ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP.";
const RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_RESIDUAL_REDUCTION_ID =
  "residual-terminal-pkgc-ambient-bn4-residual-reduction";
const RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_RESIDUAL_REDUCTION_SCOPE =
  "all-finite-explicit-ambient-bn4-ledgers-exact-balanced-subledger-removal-preserves-per-key-and-complete-canonical-executable-residual-ledgers-with-empty-remainder-corollary";
const RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_RESIDUAL_REDUCTION_MILESTONE_SCOPE = "For arbitrary finite explicit ambient BN4 ledgers, Lean proves that removing an exactly embedded balanced PkgC generated subledger preserves the executable residual cell at every complete key and the complete canonical executable residual ledger over the ambient key universe. Every remainder key occurs in that universe; a fail-closed canonical classifier constructs the exact reduction without caller-provided proof bits; and an empty remainder yields an empty ambient residual ledger, including for the existing candidate-derived computed bridge.";
const RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_RESIDUAL_REDUCTION_NON_CLAIM = "The ambient ledger, typed restoration operation, exact embedding, and explicit remainder remain proof-bearing inputs. This milestone does not derive those inputs from an arbitrary terminal candidate, prove that the remainder is empty or route-producing, establish restoration semantic adequacy or complete global route silence, reconstruct the full historical PkgC/BN6/Packet path, prove polynomial generation or runtime, establish ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP.";
const RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_THEOREMS = {
  "PNP.DirectWire.TerminalV54ConsumerSystem.requestActive_monotone": { hash: "2b4b2abc251a6f227f312189bef5f8af6ad139173a5b56bd041b5c0490c56009", axioms: [], module: "PNP.ResidualTerminalConsumerAntichainNormalForm" },
  "PNP.DirectWire.TerminalV54ConsumerSystem.requestActive_empty_false": { hash: "6a1188e91a30e61ffbabab94b6419a4e0d9980de8723c4bf3e717c82735e95c9", axioms: ["propext"], module: "PNP.ResidualTerminalConsumerAntichainNormalForm" },
  "PNP.DirectWire.TerminalV54ConsumerSystem.consumer_is_minimal": { hash: "962b718805829299b8f72bb3623e64290a082100336661f4bf8c35c7e7b2ad01", axioms: [], module: "PNP.ResidualTerminalConsumerAntichainNormalForm" },
  "PNP.DirectWire.TerminalV54ConsumerSystem.cutActive_has_disjoint_consumers": { hash: "85e9ce925cd90213f31797bde659b24a409759777dd994270114a8b1d4476bc6", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConsumerAntichainNormalForm" },
  "PNP.DirectWire.terminalV54_cutActivation_nonzero_iff_disjoint_consumers": { hash: "49b42196b9207ded24b4c2c90443a4e704e7ac89eb72742ad2b08d9e492c0b9e", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConsumerAntichainNormalForm" },
  "PNP.DirectWire.terminalV54_consumerAntichain_normal_form_iff": { hash: "8551d1d8aaab04e96fe846f653c9f7327144623374ab9d7d18a401fb448c0de6", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConsumerAntichainNormalForm" },
  "PNP.DirectWire.terminalV54_consumerAntichain_normal_form": { hash: "2f11e9bb5314944cd0ee20579865210e16792d95a20e754c72d18f401c0bdbf9", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConsumerAntichainNormalForm" }
};
const RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_SCOPE = "all-finite-minimal-consumer-antichains-monotone-empty-false-nonzero-iff-disjoint-and-pkgc-singletonized-exact-v54-consumer-antichain-cut-indicator";
const RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_MILESTONE_SCOPE = "For an arbitrary finite carrier and its explicit minimal-consumer antichain, Lean proves monotonicity and empty-request inactivity, proves that nonzero two-sided cut activation is equivalent to the existence of a disjoint consumer pair, and under the exact singletonized-disjoint-pair premise proves literal equality with the corresponding footprint cut indicator.";
const RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_NON_CLAIM = "This finite kernel starts from an explicit minimal-consumer antichain and an explicit proof that every disjoint consumer pair is singletonized. It does not construct PkgC, derive that singletonization premise, or connect the footprint back to the full BN6 proof. It does not construct complete global routes, selectors, or realizers; establish polynomial generation or runtime, ZeroSlack, or PCCMin; put SAT in P; remove a project assumption; or prove P = NP.";
const RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_THEOREMS = {
  "PNP.DirectWire.TerminalV53Hypergraph.cell_partition": { hash: "d16379065824e05c2fb07404dc6102c1e715431af0412428fe58762e7c443163", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConstantCutHypergraphRigidity" },
  "PNP.DirectWire.TerminalV53Hypergraph.cut_partition": { hash: "e2a434fd77b4beb8c1165f6bedd35df5dbe529b00362ce5915acddd46c44239e", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConstantCutHypergraphRigidity" },
  "PNP.DirectWire.TerminalV53Hypergraph.pair_complement_identity": { hash: "5fbeb36fa268a1891851320dda5716ced89a17d9234e1b39380faded0ca97b5c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConstantCutHypergraphRigidity" },
  "PNP.DirectWire.TerminalV53Hypergraph.pairWeights_equal_of_shared": { hash: "aaf54c3a5054d667fb42dc481a8c11bfabe9fd097491bca8e218b5e1257c8b9d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConstantCutHypergraphRigidity" },
  "PNP.DirectWire.TerminalV53Hypergraph.pairWeight_eq_zero_of_four": { hash: "5763916217506b3ec2ffbfb4ac6beeac75a09978651daa42ce1e586084d893b2", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConstantCutHypergraphRigidity" },
  "PNP.DirectWire.TerminalV53Hypergraph.properFootprintWeight_eq_zero_of_four": { hash: "5875a9ea0aaab8e4d1598a79262ccae893e25e64f8e280c86145e3e5f2353d82", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConstantCutHypergraphRigidity" },
  "PNP.DirectWire.TerminalV53Hypergraph.twoAnchor_fullWeight": { hash: "f69d38ce0fc3179c4b64601fc7bc972e5b4d40becc39af61ca811b442f1ec692", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConstantCutHypergraphRigidity" },
  "PNP.DirectWire.TerminalV53Hypergraph.threeAnchor_rigidity": { hash: "7042a91984504430f872f5496b3492f33cdf368f7e6cee2d6f21689ce411e574", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConstantCutHypergraphRigidity" },
  "PNP.DirectWire.TerminalV53Hypergraph.fourAnchor_rigidity": { hash: "046214923b999ee22b3da8460b12de05b47f0f15631fb0f76478b282d6dac585", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConstantCutHypergraphRigidity" },
  "PNP.DirectWire.terminalV53_constantCut_hypergraph_rigidity": { hash: "5b5dd2a2dc158dcc4e91ca9f08de3c94a134e530eafc96a096279a6ab48c8b07", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalConstantCutHypergraphRigidity" }
};
const RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_SCOPE = "all-finite-nonnegative-weighted-hypergraphs-constant-cut-hypergraph-rigidity-v53-q2-q3-q4-classification";
const RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_MILESTONE_SCOPE = "For an arbitrary finite duplicate-free carrier and sparse nonnegative weighted hypergraph with positive listed cells, exact equality of every nonempty proper cut proves the complete V53 q=2, q=3, and q>=4 classification: full-span weight D; one common pair weight p with w_A + 2p = D; or zero weight on every proper footprint with full-span weight D.";
const RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_NON_CLAIM = "This theorem consumes an explicit sparse positive hypergraph and an explicit proof that every nonempty proper cut has the same positive value. It does not construct PkgC, derive the hypergraph from a terminal candidate or the V54 consumer system, build BN6 cells or payloads, complete global routes, selectors, or realizers, establish polynomial generation or runtime, prove ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP.";
const RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_THEOREMS = {
  "PNP.DirectWire.TerminalBN6GroupedCell.massPositive": { hash: "52dcb7f7bc53bd8efa1f550ea96f76596b5a267dc1570fc2c7d516bc9177018d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN6HypergraphPacket" },
  "PNP.DirectWire.TerminalBN6GroupedCell.crosses_iff_footprintCrosses": { hash: "046aa9fa7795d8b905a24e3812d93bfcd64a461a5a0de1ffa175e7016e91851b", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN6HypergraphPacket" },
  "PNP.DirectWire.TerminalBN6GroupedCell.crossesBool_eq_cutActivationBool": { hash: "ae3cb49dfb2c70dde2e96d5b48a86a5a1f5787715d4e2480f26dde6a5ed521dc", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN6HypergraphPacket" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.cutWeight_eq_activationWeight": { hash: "938b6617e45e2d77005a52cb207b3049a852a9bb27647ba5cbc44bcf7da8b15c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN6HypergraphPacket" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.constantProperCuts": { hash: "34b06191ae4d2b810e5073bffd5a361d9ce5a8c0a64a0bf88bc561e61cbe4f3e", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN6HypergraphPacket" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.footprintWeight_eq_groupedMass": { hash: "f97902c2a9421081048eae6a85ffa03a1ecc2eda72ba6aacb43bbbed125652c0", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN6HypergraphPacket" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.hasPayloadAt_of_footprintWeight_positive": { hash: "c9f5cfab81884d8636e41bff0dd401fb27e8a4a99c5918ce41027a55e26291f4", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN6HypergraphPacket" },
  "PNP.DirectWire.terminalBN6_hypergraph_packet": { hash: "1275e898a6b23670bfbc97c3684c2da75a6b413059e4d2d9c0f0c1cd967a11ba", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalBN6HypergraphPacket" }
};
const RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_SCOPE = "all-finite-explicit-grouped-v54-activation-to-v53-grouped-hypergraph-packet-bn6-pair-mixed-triple-fullspan-with-payload-witnesses";
const RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_MILESTONE_SCOPE = "For an arbitrary finite duplicate-free anchor carrier and explicit already-grouped family of positive payload-bearing survivor cells, V54 activation is transported exactly into the constructed V53 hypergraph cut sum. A positive BCEL constant-cut premise then yields the complete pair, mixed three-anchor balanced-triple/full-span, or four-or-more-anchor full-span classification with original payload witnesses.";
const RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_NON_CLAIM = "This finite bridge consumes explicit exact footprint grouping, PkgC singletonization proofs, positive atom ledgers, payload data, and the BCEL constant-cut equation. It does not construct PkgC, derive or group survivors from a terminal candidate, establish full historical BN6 or Packet selector/realizer completeness, complete global routes, prove polynomial generation or runtime, ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP.";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_THEOREMS = {
  "PNP.DirectWire.TerminalBN6GroupedFamily.hasPacketSelectorSeedAt_of_hasPayloadAt": { hash: "9896a194aa243404922a3a870bfc5d982f103bbdb3e1c3bdfd42352bb91a3c27", axioms: ["propext"], module: "PNP.ResidualTerminalPacketSelectorSeeds" },
  "PNP.DirectWire.TerminalBN6PacketConclusion.selectorSeeds": { hash: "ab62ea35d210a818af73fc38bac3e21d13e7026d2416a9567faba5c0c026b771", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorSeeds" },
  "PNP.DirectWire.terminalBN6_packet_selector_seeds": { hash: "a32e4bc92d0af4fa404d1a8ab6640820c431aa1731198ddb4e605483c15ab386", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorSeeds" }
};
const RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_SCOPE = "all-finite-explicit-bn6-packet-conclusions-payload-backed-pair-balanced-triple-or-fullspan-selector-seed-input-extraction";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_MILESTONE_SCOPE = "For an arbitrary finite exact BN6 packet conclusion, Lean extracts a carrier-contained payload-backed raw selector seed at the positive pair footprint, at every positive pair footprint of a balanced triple, or at the positive full-span footprint. The mixed three-anchor positive alternative is handled without asserting that both masses are positive, and the construction fixes no carrier cardinality.";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_NON_CLAIM = "This milestone consumes an exact finite BN6 packet conclusion and preserves only carrier containment, selector-relevant footprint size, and original grouped cell-and-atom payload evidence. It does not prove selector-universe membership, selector faithfulness or compatibility, construct a realizer or route, establish enumeration or polynomial generation/runtime, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP.";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_THEOREMS = {
  "PNP.DirectWire.TerminalBN6GroupedFamily.packetPayloadSelectorUniverse_nodup": { hash: "3401f384c5a0d5c441b9d9f97de53b94cb7f41d3a6ac4e6f584b3355a3da298c", axioms: ["propext"], module: "PNP.ResidualTerminalPacketSelectorUniverse" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.mem_packetPayloadSelectorUniverse_iff": { hash: "00957feaa27e826691c08111fd4d5ecdb434d5e4f124044834754de6c1a93ede", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorUniverse" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.hasPacketPayloadSelectorAt_of_seed": { hash: "f0aa84ec2d71e332787930b2537fe596ff41531cc123dfcca1368740071eb675", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorUniverse" },
  "PNP.DirectWire.TerminalPacketSelectorSeedConclusion.payloadSelectors": { hash: "702f9a375f4655329e29abb5fc8d7c9740dce6aa4800b79baaf87598b0cec4a5", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorUniverse" },
  "PNP.DirectWire.TerminalBN6PacketConclusion.payloadSelectors": { hash: "29b99133c361ab757f954bcf66824d27abb33a60b66d27ffe0004f8df7379c3d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorUniverse" },
  "PNP.DirectWire.terminalBN6_packet_payload_selectors": { hash: "c0d4ac0c1a982783e14ed87ce4294376f90e47b06dd6101d04cb0a63f21b722b", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorUniverse" }
};
const RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_SCOPE = "all-finite-explicit-bn6-grouped-families-exact-grouped-footprint-payload-selector-universe-membership";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_MILESTONE_SCOPE = "For every arbitrary finite explicit grouped BN6 family, Lean enumerates the exact duplicate-free list of grouped footprints, proves membership equivalent to an original grouped cell at that footprint, and upgrades every payload-backed pair, balanced-triple pair, or full-span seed to membership in that same finite universe.";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_NON_CLAIM = "This finite universe is exactly the grouped-footprint list already present in an explicit BN6 family. It is not the manuscript's encoded or polynomial selector universe, and payload retention is not manuscript-level selector faithfulness. It does not prove selector compatibility, construct a realizer or route, derive the grouped family from a terminal candidate, establish polynomial enumeration or size bounds, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP.";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_THEOREMS = {
  "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_mem_universe": { hash: "98e1a54f9b5c284a69eda1f4a3a1d29b5b38a5fd89bfcfa535631dc2f021ab75", axioms: ["propext"], module: "PNP.ResidualTerminalPacketSelectorHandles" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_injective": { hash: "1fc064e3c2db978ad7c35921e17175380d363c0bc088e23b9408130dc06d219c", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorHandles" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_sublist_carrier": { hash: "7294ad9daeaf3f227270abd33ac4a928439cf5cb26a3c0024eb528eb5e7f729b", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorHandles" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_large": { hash: "915190c19d8ca08503970e0a5584066b3b78d03b3fac3eb1843fa6b928c58bef", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorHandles" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_hasPayloadAt": { hash: "ed046c2c9acf3cff3b7407252153f6b9a1aadef915423dc3a34d21c876309377", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorHandles" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_hasPacketPayloadSelectorAt": { hash: "49e929e54895b806526c0c673dea7bfecded831ea49c99fa25ba134b8e700576", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorHandles" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.hasFinitePacketSelectorHandleAt_iff_payloadSelector": { hash: "33dd9082f2e0d292658f769ed8a860e893c7f8cbf5748f307acd6e69fa5f54cf", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorHandles" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.existsUnique_packetSelectorHandle_iff_payloadSelector": { hash: "b454db2db1a0c83d9f5a6c9cdb10564db3bdf6bcd094cc08363c3de0484d8fab", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorHandles" },
  "PNP.DirectWire.TerminalPacketPayloadSelectorConclusion.selectorHandles": { hash: "e59ea8ae3f7553b01568560e50fa8558fdd6f3919fce8a837e88430acd0fff8f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorHandles" },
  "PNP.DirectWire.TerminalBN6PacketConclusion.selectorHandles": { hash: "8dfc9b2a4357d6313c47c6f8352f22c2fffc3018e53f9fc3d3654ac78b748950", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorHandles" },
  "PNP.DirectWire.terminalBN6_packet_selector_handles": { hash: "e8a07c5f17493ec6d905cf7dd28ad46f4a4e24ad24fc3ab75f918a7a279576c8", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorHandles" }
};
const RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_SCOPE = "all-finite-explicit-bn6-grouped-families-canonical-indexed-grouped-footprint-handles-unique-decoding-payload-carrier-and-size-compatibility";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_MILESTONE_SCOPE = "For every arbitrary finite explicit grouped BN6 family, Lean defines canonical indexed grouped-footprint handles, proves exact decoding is injective and every payload selector has a unique handle, retains original payload evidence, and proves every decoded footprint remains carrier-contained and has length at least two across the pair, balanced-triple, and full-span Packet branches.";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_NON_CLAIM = "These handles are input-relative list positions, not the manuscript's bit encoding or a polynomially enumerable selector universe. The milestone does not prove manuscript-level selector faithfulness or compatibility, construct a selector realizer or route, derive or group BN6 survivors from a terminal candidate, establish polynomial encoding length or runtime, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP.";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_THEOREMS = {
  "PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_encode": { hash: "0e4d125f4ada88d0f2f9d188a1ba2c69a17d675c555f0e6eed8dacedf4660f40", axioms: ["propext"], module: "PNP.ResidualTerminalPacketSelectorCodec" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.encodePacketSelectorHandle_injective": { hash: "be5a7248d1de95c8adb730c061003887a2a0afd7667cd8e085560ffdddc52b7f", axioms: ["propext"], module: "PNP.ResidualTerminalPacketSelectorCodec" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.encodePacketSelectorHandle_length": { hash: "9e90b81134401241f8e9b448adb3588605e502d8a67b8eeea8d619b7e3b84140", axioms: ["propext"], module: "PNP.ResidualTerminalPacketSelectorCodec" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.encodePacketSelectorHandle_length_le_universe": { hash: "7f5caf0819a8e1696463e99993399a78d3bc6a786a64b13604e69f08c7c40485", axioms: ["propext"], module: "PNP.ResidualTerminalPacketSelectorCodec" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_canonical": { hash: "0a85db798dea4e5fc887c33e7db492fa102a081123cf1adfccd4cf30561f6165", axioms: ["propext"], module: "PNP.ResidualTerminalPacketSelectorCodec" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_payloadEvidence": { hash: "df145b8b2bac1ea58116085bc04500a96c44248cd6aac404e0d9b769565d608b", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorCodec" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.hasEncodedPacketSelectorAt_iff_payloadSelector": { hash: "accf0d6418551d74babe5b1ce76b0f490d217b463e57b7b725b9c9b01b84dd1b", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorCodec" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.existsUnique_encodedPacketSelector_iff_payloadSelector": { hash: "f8f44b0800ee90410e97ae05705549c3bb5f11cd7c5e63a7d6161f605ed40108", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorCodec" },
  "PNP.DirectWire.TerminalPacketPayloadSelectorConclusion.selectorCodes": { hash: "f518eec40806af1a781cddec358e0970e4bca8a5341865477865ad794d5c6ccc", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorCodec" },
  "PNP.DirectWire.TerminalBN6PacketConclusion.selectorCodes": { hash: "a52bf419363cbe01c1101984c07ee9cf551796860db78d53faeeafa00ee1d2aa", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorCodec" },
  "PNP.DirectWire.terminalBN6_packet_selector_codes": { hash: "031617e6b11b9c96848cfb9597d2afff584fc5e8dba4ad0d12b6a329a1b26ffe", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorCodec" }
};
const RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_SCOPE = "all-finite-explicit-bn6-grouped-families-canonical-unary-fail-closed-handle-codec-round-trip-unique-decoding-payload-carrier-size-and-explicit-universe-length-bound";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_MILESTONE_SCOPE = "For every arbitrary finite explicit grouped BN6 family, Lean gives each canonical input-relative selector handle a unary bitstring with fail-closed total decoding of missing delimiters, trailing data, and out-of-range indices, proves exact round trip, injectivity, canonical successful decoding, exact and explicit-universe-bounded length, retains payload, carrier, size, cell, and atom evidence, and gives every payload selector one unique accepted code across the pair, balanced-triple, and full-span Packet branches.";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_NON_CLAIM = "The code-length bound is relative to the explicit grouped-family list and does not bound that list by encoded circuit size. This milestone does not prove polynomial enumeration or runtime, encode atom or payload data, prove manuscript-level selector faithfulness or compatibility, construct a selector realizer or route, derive or group BN6 survivors from a terminal candidate, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP.";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_THEOREMS = {
  "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorCell_footprint": { hash: "585917f43db54d9d5be3852605dcfcc01256d09d34bde1ed3e7ff0b0e2500e0f", axioms: ["propext"], module: "PNP.ResidualTerminalPacketSelectorPayloadRealization" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadAtom_mem": { hash: "bc42f6f75392b9ce43345b06aba862a758d32d9a8670945f111f33960abdbe3d", axioms: ["propext"], module: "PNP.ResidualTerminalPacketSelectorPayloadRealization" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.realizePacketSelectorPayload_eq_none_iff": { hash: "cbc666a2d051af090a607a177509340486e60215434e7ed7b15692e6ffe0557b", axioms: ["propext"], module: "PNP.ResidualTerminalPacketSelectorPayloadRealization" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_eq_some_of_realize": { hash: "d09a9d1b541eed299f676de5b47dfd84fe9b54228b6b2c2789db4a989c033e0e", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorPayloadRealization" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.exists_realizePacketSelectorPayload_encode": { hash: "5b52d770dcba2dac6f9314dbf3620d01445d2a71b1b47f0fd52d65719a5312bd", axioms: ["propext"], module: "PNP.ResidualTerminalPacketSelectorPayloadRealization" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.realizePacketSelectorPayload_sound": { hash: "5a40df6a1b6f66efa77c827ff11ce46698aa0960a4891cd70d6196d8bfc156cf", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorPayloadRealization" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.isRealizedPacketSelectorAt_iff_encoded": { hash: "2d0a3ccb47c7b326c8fb44ce651fe5da452d986adc8435c71385fef772bc8870", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorPayloadRealization" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.hasRealizedPacketSelectorAt_iff_payloadSelector": { hash: "65968a464059a6b3d4805f2e451306e0fd37d46bf5a7cb30b720b632d376a444", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorPayloadRealization" },
  "PNP.DirectWire.TerminalPacketEncodedSelectorConclusion.selectorPayloadRealizations": { hash: "d369c4f09b76a34298569a24eb7a7586e5e538fa03c5c80061ce057319e7d977", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorPayloadRealization" },
  "PNP.DirectWire.TerminalBN6PacketConclusion.selectorPayloadRealizations": { hash: "c9ee54cb1fc4b623af2e96a88481a62ccf66e14f5aed608d8975ee4690c0b6c4", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorPayloadRealization" },
  "PNP.DirectWire.terminalBN6_packet_selector_payload_realizations": { hash: "87e78d7623809a2026145930b4df7438605f484d17f11e99f700abf99cd5338d", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorPayloadRealization" }
};
const RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_SCOPE = "all-finite-explicit-bn6-grouped-families-total-fail-closed-source-payload-realization-exact-original-cell-footprint-positive-atom-and-packet-branch-preservation";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_MILESTONE_SCOPE = "For every arbitrary finite explicit grouped BN6 family, Lean defines a total fail-closed function that maps each accepted canonical selector code to its exact decoded handle, original source cell, decoded footprint, and a canonical original positive payload atom. Successful results re-encode to the exact input, remain in the supplied family, retain strict atom positivity, are equivalent to the finite payload-selector predicate, and preserve the pair, balanced-triple, and full-span Packet branches.";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_NON_CLAIM = "This is source-payload materialization relative to a supplied explicit grouped family, not the manuscript's gain-or-blocker selector realizer. The unary code still encodes only a list position and does not serialize atom or payload data. This milestone does not construct a replacement circuit, prove selector faithfulness or compatibility, return a gain or typed blocker route, derive or group BN6 survivors from a terminal candidate, bound the selector family by encoded circuit size, prove polynomial generation or runtime, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP.";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_THEOREMS = {
  "PNP.DirectWire.TerminalBN6GroupedFamily.mem_packetSelectorCandidateImplementations_iff": { hash: "0a1d4dbb85050c296121e30083d309b23e37289eda64f25fe5ea507ff7c853a1", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorGainScan" },
  "PNP.DirectWire.TerminalPacketCandidateGainOutcome.sound": { hash: "14694f4db90e1f37a49a670edf367f06b8e088082d49e2ec5540d74fc0afb94b", axioms: [], module: "PNP.ResidualTerminalPacketSelectorGainScan" },
  "PNP.DirectWire.TerminalPacketCandidateGainOutcome.gain_strictResidualDescent": { hash: "7f468d2ffb1d31071c4971c5232e78017d81003e954da16b334313c69155902f", axioms: [], module: "PNP.ResidualTerminalPacketSelectorGainScan" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.scanPacketSelectorGains_eq_none_iff": { hash: "9b3bdfcd5e478fe239211cdc7e2b21841edbb05ef8a4191c72a6f910523bdf16", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorGainScan" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.exists_scanPacketSelectorGains_iff": { hash: "deb7e43236b3cb43db356945fb7a9662806163fbfd52593c9c0da9975c83789e", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorGainScan" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_eq_some_of_gainScan": { hash: "6eb7f2b430542b24beeb43e87a5f4f89fb924a60165e6d1a6962b7a252406d10", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorGainScan" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.scanPacketSelectorGains_sound": { hash: "aa97c40ce86ffa1fcde24c71191dd97ac4a4bd8bd842d05ff112ff65e02a9af2", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorGainScan" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.exists_scanPacketSelectorGains_encode": { hash: "5a8e39e629c17ddff71b06f625a74ec1143ff3e59ed85f3ff0eaa297da66e46f", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorGainScan" },
  "PNP.DirectWire.TerminalBN6GroupedFamily.hasPacketSelectorGainScanAt_iff_encoded": { hash: "22461d4ebcecae3bad666da8313baaf99ee302d0ea0e6dea80643dc280e66bed", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorGainScan" },
  "PNP.DirectWire.TerminalPacketEncodedSelectorConclusion.gainScans": { hash: "d281b4b953c16f80afa51d606669bbb64e41c12cb24decc77ba379b4b1299a58", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorGainScan" },
  "PNP.DirectWire.TerminalBN6PacketConclusion.gainScans": { hash: "c32f91d5404c84e2c5453226b2c4b5ee606c4d2cbc5fb2596f8818e8cefc6bdb", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorGainScan" },
  "PNP.DirectWire.terminalBN6_packet_selector_gain_scans": { hash: "54570f3b2c287367fd79ed45fe365049ee662b7c2af25faaa0a7f3fef02f4325", axioms: ["Quot.sound", "propext"], module: "PNP.ResidualTerminalPacketSelectorGainScan" }
};
const RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_HASHES = Object.fromEntries(
  Object.entries(RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_THEOREMS).map(([name, row]) => [name, row.hash])
);
const RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_SCOPE = "all-finite-explicit-bn6-grouped-families-direct-wire-implementation-payloads-total-fail-closed-exact-source-cell-checked-strict-gain-or-cell-local-no-gain-packet-branch-preservation";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_MILESTONE_SCOPE = "For every arbitrary finite explicit grouped BN6 family whose payloads are direct-wire implementations, Lean decodes each accepted canonical Packet selector, scans every original candidate payload in the exact selected source cell with the executable strict-equivalent-gain checker, and returns only a genuine source-atom StrictEquivalentGain or proof that the selected cell has no such candidate. Every gain strictly decreases residual slack, decoder rejection is exact, and the pair, balanced-triple, and full-span Packet alternatives are preserved.";
const RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_NON_CLAIM = "The candidate implementations and grouped BN6 family remain explicit input data. A local no-gain result excludes only payload candidates in one selected source cell; it is not a manuscript BotHN, BotBUD, or lower-rank BotSeed and does not imply global minimality or ZeroSlack. This milestone does not construct replacement candidates, prove selector faithfulness or compatibility, connect payload mass to charge surplus, derive or group survivors from a terminal candidate, bound the selector family by encoded circuit size, prove polynomial generation or runtime, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP.";

const RESIDUAL_TERMINAL_RANK_WF_SCOPE = "fixed-ten-coordinate-natural-lexicographic-order-executable-comparison-accessibility-induction-and-kernel-well-foundedness";
const RESIDUAL_TERMINAL_RANK_WF_MILESTONE_SCOPE = "For the fixed manuscript residual rank of exactly ten natural coordinates in the stated witness-type, span-type, mode, frontier-defect, projection-defect, saturation-defect, anchor-count, charge-size, profile-size, canonical-code priority order, Lean provides the exact lexicographic proposition, an equivalent executable comparison, all ten priority witnesses, proof-bearing descent, accessibility, induction, and kernel-checked well-foundedness.";
const RESIDUAL_TERMINAL_RANK_WF_NON_CLAIM = "This establishes the fixed residual rank domain and RankWF only. It does not map the current finite terminal routes into the manuscript's complete global outcome system, prove that any existing route strictly decreases the rank, establish route completeness or Package E, remove the explicit positive premise from the finite composition, establish full manuscript-wide SaturatePositive or BCELReady, prove ZeroSlack, PCCMin, polynomial runtime, SAT in P, remove a project assumption, or prove P = NP.";

function json(relativePath) {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
}

function releaseBoundaryPrefixForMilestone(release, milestone) {
  const suffix = "TheoremKernelTypeSha256";
  const requiredTheorems = new Set(milestone.requiredTheorems);
  const matchingField = Object.entries(release.earnedBoundary).find(
    ([key, value]) => key.endsWith(suffix)
      && value !== null
      && typeof value === "object"
      && !Array.isArray(value)
      && Object.keys(value).length === requiredTheorems.size
      && [...requiredTheorems].every((name) => Object.hasOwn(value, name))
  );
  assert.ok(matchingField, `missing earned-boundary fingerprint map for ${milestone.id}`);
  return matchingField[0].slice(0, -suffix.length);
}

function releaseBoundaryValue(release, prefix, suffix, required = true) {
  const expectedKey = `${prefix}${suffix}`.toLowerCase();
  const matchingFields = Object.entries(release.earnedBoundary).filter(
    ([key]) => key.toLowerCase() === expectedKey
  );
  assert.ok(matchingFields.length <= 1, `expected at most one release field for ${prefix}${suffix}`);
  if (required) {
    assert.equal(matchingFields.length, 1, `expected one release field for ${prefix}${suffix}`);
  }
  return matchingFields[0]?.[1];
}

const STATUS_STEM_WITHOUT_SCOPE_BY_RELEASE_PREFIX = Object.freeze({
  cookLevinBuilderFullScheduleCursorController:
    "ConcreteCookLevinBuilderFullScheduleCursorController",
  cookLevinBuilderArbitrarySlotHeaderRouter:
    "ConcreteCookLevinBuilderArbitrarySlotHeaderRouter",
  cookLevinBuilderArbitrarySlotPostHeaderDecoder:
    "ConcreteCookLevinBuilderArbitrarySlotPostHeaderDecoder",
  cookLevinBuilderPostHeaderRawDivider:
    "ConcreteCookLevinBuilderPostHeaderRawDivider",
  cookLevinBuilderPostHeaderRawLaunch:
    "ConcreteCookLevinBuilderPostHeaderRawLaunch",
  cookLevinBuilderPostHeaderRawTapeBridge:
    "ConcreteCookLevinBuilderPostHeaderRawTapeBridge",
  cookLevinBuilderPostDividerRawRouteClassifier:
    "ConcreteCookLevinBuilderPostDividerRawRouteClassifier",
  cookLevinBuilderPostDividerSelectedTokenLaunch:
    "ConcreteCookLevinBuilderPostDividerSelectedTokenLaunch",
  cookLevinBuilderCompleteScheduleIteration:
    "ConcreteCookLevinBuilderCompleteScheduleIteration",
  cookLevinBuilderPhysicalOptionalTokenDispatch:
    "ConcreteCookLevinBuilderPhysicalOptionalTokenDispatch",
  cookLevinBuilderPhysicalDispatchSchedule:
    "ConcreteCookLevinBuilderPhysicalDispatchSchedule",
  cookLevinBuilderPhysicalFinishRequest:
    "ConcreteCookLevinBuilderPhysicalFinishRequest",
  cookLevinBuilderPhysicalClassifierPipeline:
    "ConcreteCookLevinBuilderPhysicalClassifierPipeline",
  cookLevinBuilderPhysicalClassifierFinishRequest:
    "ConcreteCookLevinBuilderPhysicalClassifierFinishRequest",
  cookLevinBuilderPhysicalClassifierFinishWorkspaceOrientation:
    "ConcreteCookLevinBuilderPhysicalClassifierFinishWorkspaceOrientation",
  cookLevinBuilderPhysicalClassifierFinishMirroredDispatch:
    "ConcreteCookLevinBuilderPhysicalClassifierFinishMirroredDispatch",
  cookLevinBuilderPhysicalClassifierFirstBodySeparatorMirroredDispatch:
    "ConcreteCookLevinBuilderPhysicalClassifierFirstBodySeparatorMirroredDispatch",
  cookLevinBuilderPhysicalClassifierAllBodyStagedRequestMirroredDispatch:
    "ConcreteCookLevinBuilderPhysicalClassifierAllBodyStagedRequestMirroredDispatch",
  cookLevinBuilderPhysicalClassifierTerminalJoin:
    "ConcreteCookLevinBuilderPhysicalClassifierTerminalJoin",
});

function statusStemForReleaseBoundary(status, release, prefix) {
  const scope = releaseBoundaryValue(release, prefix, "Scope", false);
  if (scope === undefined) {
    const stem = STATUS_STEM_WITHOUT_SCOPE_BY_RELEASE_PREFIX[prefix];
    assert.ok(stem, `missing status-stem mapping for scopeless release boundary ${prefix}`);
    assert.equal(status[`lean${stem}Formalized`], true, `missing formalized status field for ${prefix}`);
    assert.equal(status[`lean${stem}AxiomAuditPassed`], true, `missing axiom-audit status field for ${prefix}`);
    return stem;
  }
  const scopeKeys = Object.keys(status).filter(
    (key) => key.startsWith("lean") && key.endsWith("Scope") && status[key] === scope
  );
  assert.equal(scopeKeys.length, 1, `expected one status scope field for ${prefix}`);
  return scopeKeys[0].slice("lean".length, -"Scope".length);
}

function copySealFixture(t) {
  const fixture = mkdtempSync(path.join(tmpdir(), "pnplabs-formal-seal-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  for (const relativePath of SEALED_PATHS) {
    const target = path.join(fixture, relativePath);
    mkdirSync(path.dirname(target), { recursive: true });
    cpSync(path.join(root, relativePath), target);
  }
  return fixture;
}

test("exact current artifact seal verifies every reviewed file", () => {
  const result = verifyReleaseSeal({ root });
  assert.equal(result.checked, canonicalSeal.files.length);
  assert.equal(result.coreCommit, canonicalRelease.source.commit);
});

test("current release pins the latest canonical earned boundary and remains fail closed", () => {
  const release = json("downloads/formal-publication-release.json");
  const latestStatusPayload = json("public/pnp-status.json");
  const latestUpdate = json("content/milestone-updates.json").entries[0];
  const latestMilestone = latestStatusPayload.formalPublicationMilestones.find(
    (row) => row.id === latestUpdate.milestoneId
  );
  assert.ok(latestMilestone, "latest milestone must come from the canonical status payload");
  const latestStem = releaseBoundaryPrefixForMilestone(release, latestMilestone);
  const latestStatusStem = `lean${statusStemForReleaseBoundary(latestStatusPayload, release, latestStem)}`;
  const latestTheoremHashes = Object.fromEntries(
    latestMilestone.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])
  );
  const latestAxiomClosure = [...new Set(latestMilestone.theoremRows.flatMap((row) => row.axioms))].sort();
  assert.equal(release.coordinate, canonicalRelease.coordinate);
  assert.equal(release.source.commit, canonicalRelease.source.commit);
  assert.match(release.source.proofCommit, /^[0-9a-f]{40}$/u);
  assert.equal(release.source.tree, canonicalRelease.source.tree);
  assert.equal(release.source.coordinateAloneIsAuthority, false);
  assert.equal(release.source.identityRequiresCommitTreeAndArtifactHashes, true);
  assert.ok(Number.isSafeInteger(release.artifacts.report.pageCount));
  assert.ok(release.artifacts.report.pageCount > 0);
  assert.equal(release.earnedBoundary.leanTheorem, "PNP.Concrete.FinalUniversalDesign.cnfSATInNP");
  assert.equal(release.earnedBoundary.kernelTypeSha256, "c9d66c135361cf8a8b25330d2558dfac209fde120e296140c7e7cb86bf1e1937");
  assert.deepEqual(release.earnedBoundary.axiomClosure, []);
  assert.equal(release.earnedBoundary.auditedDeclarationCount, 766);
  assert.equal(release.earnedBoundary.pipelineStateNamespacesFormalized, true);
  assert.equal(release.earnedBoundary.pipelineStateNamespaceAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineStateNamespaceAuditedDeclarationCount, 39);
  assert.equal(release.earnedBoundary.pipelineStageBridgesFormalized, true);
  assert.equal(release.earnedBoundary.pipelineStageBridgeAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineStageBridgeAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.pipelineStageLaunchFormalized, true);
  assert.equal(release.earnedBoundary.pipelineVerdictPreservationFormalized, true);
  assert.equal(release.earnedBoundary.pipelineInternalOutputHandoffComposed, true);
  assert.equal(release.earnedBoundary.pipelineCompiledRawCostMultiplier, 6);
  assert.equal(release.earnedBoundary.pipelineTargetTerminationFormalized, false);
  assert.equal(release.earnedBoundary.pipelineTerminalRawOutputPackingFormalized, true);
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerAuditedDeclarationCount, 69);
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerTheorem, "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq");
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerKernelTypeSha256, "2e8a41501c1bfb17ac78b70a93c2996db1ab607465c4a61a91236a4787b07b66");
  assert.deepEqual(release.earnedBoundary.pipelineTerminalOutputPackerAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerCompiledRawTimeBound, "18 * outputLength^2 + 36 * outputLength + 6");
  assert.equal(release.earnedBoundary.pipelineTerminalOutputPackerConnectedToBridge, true);
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeAuditedDeclarationCount, 59);
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeAcceptingOutputTheorem, "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents");
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeAcceptingOutputKernelTypeSha256, "f6ff227ee77408d4b833da4b277cbe24950b52f12bb8aaec3b8d0f48a4000001");
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeRejectingOutputTheorem, "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_rejecting_of_represents");
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeRejectingOutputKernelTypeSha256, "ebdf594cf57d6ab317bc692ac491746099ba5c955853b6deaf41b17240c1a9db");
  assert.deepEqual(release.earnedBoundary.pipelineTerminalBridgeAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineTerminalBridgeCompiledRawTimeBound, "18 * outputLength^2 + 36 * outputLength + 12");
  assert.equal(release.earnedBoundary.pipelineSuppliedAcceptTraceTheorem, "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineSuppliedAcceptTraceKernelTypeSha256, "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29");
  assert.equal(release.earnedBoundary.pipelineSuppliedRejectTraceTheorem, "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineSuppliedRejectTraceKernelTypeSha256, "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c");
  assert.equal(release.earnedBoundary.pipelineSuppliedAcceptMachineOutputTheorem, "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineSuppliedRejectMachineOutputTheorem, "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact");
  assert.equal(release.earnedBoundary.pipelinePriorTraceTransportToTerminalBridgeFormalized, true);
  assert.equal(release.earnedBoundary.pipelineInputFramerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineInputFramerAuditedDeclarationCount, 70);
  assert.equal(release.earnedBoundary.pipelineAllInputFramingFormalized, true);
  assert.equal(release.earnedBoundary.pipelineInputFramerWorkTraceTheorem, "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact");
  assert.equal(release.earnedBoundary.pipelineInputFramerWorkTraceKernelTypeSha256, "ad6e7cfe1206448f72a57135408a3c2e057411b4f418cdca0fd6a376a2863a1a");
  assert.equal(release.earnedBoundary.pipelineInputFramerRepresentedEndpointTheorem, "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents");
  assert.equal(release.earnedBoundary.pipelineInputFramerHaltedEndpointTheorem, "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted");
  assert.equal(release.earnedBoundary.pipelineInputFramerRawBoundTheorem, "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le");
  assert.equal(release.earnedBoundary.pipelineInputFramerOrdinaryStartTheorem, "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound");
  assert.equal(release.earnedBoundary.pipelineInputFramerBlankEquivalentTheorem, "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent");
  assert.equal(release.earnedBoundary.pipelineInputFramerAcceptTheorem, "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept");
  assert.equal(release.earnedBoundary.pipelineInputFramerNoTimeoutTheorem, "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout");
  assert.deepEqual(release.earnedBoundary.pipelineInputFramerAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineInputFramerEmptyWorkSteps, "4");
  assert.equal(release.earnedBoundary.pipelineInputFramerCompleteCellsWorkSteps, "4 * k * k + 9 * k + 7");
  assert.equal(release.earnedBoundary.pipelineInputFramerPartialCellWorkSteps, "4 * k * k + 9 * k + 5");
  assert.equal(release.earnedBoundary.pipelineInputFramerRawTimePolynomial, "6 * m * m + 39 * m + 75");
  assert.equal(release.earnedBoundary.pipelinePairedCompilerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelinePairedCompilerAuditedDeclarationCount, 28);
  assert.equal(release.earnedBoundary.pipelineCanonicalPairCompilationFormalized, true);
  assert.equal(release.earnedBoundary.pipelineMalformedInputBehaviorFormalized, true);
  assert.equal(release.earnedBoundary.pipelinePairedVerdictTheorem, "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq");
  assert.equal(release.earnedBoundary.pipelinePairedVerdictKernelTypeSha256, "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731");
  assert.equal(release.earnedBoundary.pipelinePairedMachineOutputTheorem, "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq");
  assert.equal(release.earnedBoundary.pipelinePairedMachineOutputKernelTypeSha256, "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267");
  assert.equal(release.earnedBoundary.pipelinePairedNoTimeoutTheorem, "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout");
  assert.equal(release.earnedBoundary.pipelinePairedNoTimeoutKernelTypeSha256, "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab");
  assert.equal(release.earnedBoundary.pipelinePairedAcceptsTheorem, "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff");
  assert.equal(release.earnedBoundary.pipelinePairedAcceptsKernelTypeSha256, "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9");
  assert.deepEqual(release.earnedBoundary.pipelinePairedCompilerAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelinePairedOutputSizePolynomial, "B(m) = m + p(m) + 1");
  assert.equal(release.earnedBoundary.pipelinePairedRawTimePolynomial, "Rpair(m) = inputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))");
  assert.equal(release.earnedBoundary.pipelineCompilerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineCompilerAuditedDeclarationCount, 29);
  assert.equal(release.earnedBoundary.pipelineAllInputCompilationFormalized, true);
  assert.equal(release.earnedBoundary.pipelineCompilerCorrectTheorem, "PNP.Concrete.PipelineCompiler.pipeline_correct");
  assert.equal(release.earnedBoundary.pipelineCompilerCorrectKernelTypeSha256, "e1ccd198403d41933324af1c52048c865943947c5bbd40dd94e11827b08c2303");
  assert.equal(release.earnedBoundary.pipelineVerdictTheorem, "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq");
  assert.equal(release.earnedBoundary.pipelineVerdictKernelTypeSha256, "1bafe91bba94e65a7ad654f4624f305c0ae01b3e6d656af0dd2e752d373ce87e");
  assert.equal(release.earnedBoundary.pipelineMachineOutputTheorem, "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq");
  assert.equal(release.earnedBoundary.pipelineMachineOutputKernelTypeSha256, "45e02fa1e6e6b0bcbc422c3b4fd797608b875727d22b79d6f7814e1f4f0d3da7");
  assert.equal(release.earnedBoundary.pipelineNoTimeoutTheorem, "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout");
  assert.equal(release.earnedBoundary.pipelineNoTimeoutKernelTypeSha256, "ed95c33d4fa998d79057537cd2adf847548a79b7ee9a45020b01620868273b3a");
  assert.equal(release.earnedBoundary.pipelineAcceptsTheorem, "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff");
  assert.equal(release.earnedBoundary.pipelineAcceptsKernelTypeSha256, "94e43c664b4d185e48553ab25541925830fec7086fcbbab5215dacdcde1af6a6");
  assert.equal(release.earnedBoundary.pipelineAllInputStuckTimeoutTheorem, "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineAllInputStuckTimeoutKernelTypeSha256, "a6edef0532eb89036d0e6813cffb94b321f9160a08035671eb411c813ef0a3de");
  assert.deepEqual(release.earnedBoundary.pipelineCompilerAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineOutputSizePolynomial, "B(m) = m + p(m) + 1");
  assert.equal(release.earnedBoundary.pipelineRawTimePolynomial, "R(m) = totalInputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))");
  assert.equal(release.earnedBoundary.pipelineRawRefinementFormalized, true);
  assert.equal(release.earnedBoundary.pipelineExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.pipelineSequentialNamespaceFormalized, true);
  assert.equal(release.earnedBoundary.pipelineSequentialNamespaceAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineSequentialNamespaceAuditedDeclarationCount, 26);
  assert.deepEqual(release.earnedBoundary.pipelineSequentialNamespaceAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineSequentialCompilationFormalized, true);
  assert.equal(release.earnedBoundary.pipelineSequentialCompilerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineSequentialCompilerAuditedDeclarationCount, 31);
  assert.equal(release.earnedBoundary.pipelineSequentialCorrectTheorem, "PNP.Concrete.PipelineSequentialCompiler.sequential_correct");
  assert.equal(release.earnedBoundary.pipelineSequentialCorrectKernelTypeSha256, "8943f2f2c396dfb2e6e8232244b9ecb386fe3a7259590ed96cedb82d1cc7b22a");
  assert.equal(release.earnedBoundary.pipelineSequentialVerdictTheorem, "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq");
  assert.equal(release.earnedBoundary.pipelineSequentialMachineOutputTheorem, "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq");
  assert.equal(release.earnedBoundary.pipelineSequentialNoTimeoutTheorem, "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout");
  assert.equal(release.earnedBoundary.pipelineSequentialAcceptsTheorem, "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff");
  assert.equal(release.earnedBoundary.pipelineSequentialStuckFirstTimeoutTheorem, "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact");
  assert.equal(release.earnedBoundary.pipelineSequentialRawTimePolynomial, "Rseq(m) = PipelineRaw(p)(m) + 6 + PipelineRaw(q)(m + p(m) + 1)");
  assert.deepEqual(release.earnedBoundary.pipelineSequentialCompilerAxiomClosure, []);
  assert.equal(release.earnedBoundary.pipelineRefinementAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.pipelineRefinementAuditedDeclarationCount, 16);
  assert.deepEqual(release.earnedBoundary.pipelineRefinementAxiomClosure, []);
  assert.equal(release.earnedBoundary.functionProgramRecursiveCompilationFormalized, true);
  assert.equal(release.earnedBoundary.decisionProgramRecursiveCompilationFormalized, true);
  assert.equal(release.earnedBoundary.polynomialTimeDeciderRawCompilationFormalized, true);
  assert.equal(release.earnedBoundary.functionProgramCompileHaltsTheorem, "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin");
  assert.equal(release.earnedBoundary.functionProgramCompileOutputTheorem, "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq");
  assert.equal(release.earnedBoundary.decisionProgramCompileHaltsTheorem, "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin");
  assert.equal(release.earnedBoundary.decisionProgramCompileVerdictTheorem, "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq");
  assert.equal(release.earnedBoundary.polynomialTimeDeciderCompileAcceptsTheorem, "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff");
  assert.equal(release.earnedBoundary.standardComplexityModelFormalized, true);
  assert.equal(release.earnedBoundary.concreteComplexityMachineLinkDischarged, true);
  assert.equal(release.earnedBoundary.cookLevinRawTapeBridgeFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinRawTapeBridgeAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinRawTapeBridgeAuditedDeclarationCount, 54);
  assert.equal(release.earnedBoundary.cookLevinSemanticReductionCorrectnessFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinSemanticTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language");
  assert.equal(release.earnedBoundary.cookLevinSemanticKernelTypeSha256, "985c8d12419343045c76abbcfa6def7d4e01ce816d97180dca14d7bf5c0be34d");
  assert.deepEqual(release.earnedBoundary.cookLevinRawTapeBridgeAxiomClosure, ["Classical.choice", "Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinFormulaSizeAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaSizeAuditedDeclarationCount, 108);
  assert.equal(release.earnedBoundary.cookLevinEncodedFormulaSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinEncodedFormulaSizeTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le");
  assert.equal(release.earnedBoundary.cookLevinEncodedFormulaSizeKernelTypeSha256, "c2b0a4afd8793022739cde9904d379a3c807fba07f0db0ab23e3b0b0563ed699");
  assert.deepEqual(release.earnedBoundary.cookLevinFormulaSizeAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinFormulaSizeProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleAuditedDeclarationCount, 79);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleAnswerIndependent, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleExactEmissionFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleExactLengthPolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleLengthTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length");
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleLengthKernelTypeSha256, "7460e8b8c59a2356dc8ece81571e7bcb76faf71a5ae0492d034b1d8c5d2408c4");
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleEmitTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula");
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleEmitKernelTypeSha256, "2376179dbf80f6e0bb76d8a6026518aa0d042e1eb79f3ec567474a730f742943");
  assert.deepEqual(release.earnedBoundary.cookLevinFormulaScheduleAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinFormulaScheduleProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleConstantTimeRawInterpretationFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinRawFormulaBuilderFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinFormulaScheduleFunctionProgramRawRefinementFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorAuditedDeclarationCount, 129);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorDirectCoordinateLookupFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorNestedOptionSemanticsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorExactTraversalFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorExactLengthPolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorDirectBitTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotDirect_eq");
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorPolynomialTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotCountDirect_eq_polynomial");
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorFullTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full");
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorOneStepShortTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_one_step_short");
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorExcessTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_excess");
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorEmitTheorem, "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinFormulaCursorTheoremKernelTypeSha256).length, 16);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorTheoremKernelTypeSha256[release.earnedBoundary.cookLevinFormulaCursorEmitTheorem], "2637f4e27b2a6e40a7e774b10fac91d379daebe9ff6930c72de43ee23bd054d0");
  assert.deepEqual(release.earnedBoundary.cookLevinFormulaCursorAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinFormulaCursorProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorConstantTimeRawInterpretationFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorRawBuilderFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinFormulaCursorFunctionProgramRawRefinementFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthAuditedDeclarationCount, 39);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthRuleCount, 19);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthWorkTimePolynomial, "2 * inputLength^2 + 4 * inputLength + 2");
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthRawTimePolynomial, "12 * inputLength^2 + 24 * inputLength + 12");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderInputLengthTheoremKernelTypeSha256).length, 10);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthFramerRunTheorem, "PNP.Concrete.CookLevin.BuilderInputLength.workRunExact_after_totalInputFramer");
  assert.equal(release.earnedBoundary.cookLevinBuilderInputLengthTheoremKernelTypeSha256[release.earnedBoundary.cookLevinBuilderInputLengthFramerRunTheorem], "3fdcf061036fc5b1c6caf667cda8718c9d738a7281d30be9785841b40f034c16");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderInputLengthAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderInputLengthProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixAuditedDeclarationCount, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixLiteralFramerLaunchFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixWorkTimePolynomial, "totalInputFramerWorkSteps(input) + 1 + 2 * inputLength^2 + 4 * inputLength + 2");
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixRawTimePolynomial, "18 * inputLength^2 + 63 * inputLength + 93");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderInputPrefixTheoremKernelTypeSha256).length, 14);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderInputPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixLaunchTheorem, "PNP.Concrete.CookLevin.BuilderInputPrefix.launch_workStep");
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixMalformedTimeoutTheorem, "PNP.Concrete.CookLevin.BuilderInputPrefix.malformedTallyScanSymbol_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixTheoremKernelTypeSha256[release.earnedBoundary.cookLevinBuilderInputPrefixExactWorkRunTheorem], "c4d91b64e983bc5a6713fa64ab86821edd442cc79cbf872b2fafe6f3194ab2b3");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderInputPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderInputPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixFormulaBitsEmittedFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixDirectCursorRawInterpretationFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderAuditedDeclarationCount, 68);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderAllTokensExactFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderFirstFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderInputPrefixComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderWorkTime, "2 * (max 1 inputLength + inputLength + priorTokenCount + 3)");
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderFirstTokenRawTimePolynomial, "24 * inputLength + 48");
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderRuleCount, 59);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderTokenAppenderTheoremKernelTypeSha256).length, 17);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderTokenAppender.appendToken_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderFormulaPrefixTheorem, "PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_bits_eq_encodedFormula_take_two");
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderTheoremKernelTypeSha256[release.earnedBoundary.cookLevinBuilderTokenAppenderExactWorkRunTheorem], "948f8fd82b0b7afb85ae562995bebfcf59e50896cb46765fd4fbb807dd6652ad");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderTokenAppenderAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderTokenAppenderProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderCompleteHeaderFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderTokenAppenderDynamicCursorInterpretationFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixAuditedDeclarationCount, 37);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixRawTimePolynomial, "18 * inputLength^2 + 87 * inputLength + 147");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixRuleCount, 184);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixTheoremKernelTypeSha256).length, 25);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixFormulaPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.finalTokenBits_eq_encodedFormula_take_two");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstTokenPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderUnaryPolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderUnaryPolynomialAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderUnaryPolynomialAuditedDeclarationCount, 74);
  assert.equal(release.earnedBoundary.cookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderUnaryPolynomialRuleCount, "9 * stateCount(widthPolynomial verifier)");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderUnaryPolynomialTheoremKernelTypeSha256).length, 10);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderUnaryPolynomialAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderUnaryPolynomialProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderAuditedDeclarationCount, 85);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderRuleCount, "363 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier)");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderCompleteHeaderTheoremKernelTypeSha256).length, 38);
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderCompleteHeader.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderFormulaHeaderTheorem, "PNP.Concrete.CookLevin.BuilderCompleteHeader.finalTokenBits_eq_encodedFormula_header");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderCompleteHeaderAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderCompleteHeaderProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixAuditedDeclarationCount, 60);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixRuleCount, "440 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderBodyStartPrefixTheoremKernelTypeSha256).length, 42);
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.bodyStartTokens_eq_canonical_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixNextTokenCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_two");
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixSeparatorSlotTheorem, "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.firstBodyTokenSlotDirect_eq_separator");
  assert.equal(release.earnedBoundary.cookLevinBuilderBodyStartPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.finalTokenBits_eq_encodedFormula_bodyStart");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderBodyStartPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderBodyStartPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount, 74);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixRuleCount, "585 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixTheoremKernelTypeSha256).length, 52);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixCanonicalFormulaPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixNextTokenCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_four");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixSignSlotTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralSignSlotDirect_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixZeroTerminatorSlotTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralZeroTerminatorSlotDirect_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_firstLiteral");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixAuditedDeclarationCount, 79);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCombinedAuditedDeclarationCount, 80);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixWorkTime, "BuilderFirstLiteralPrefix.workSteps(input) + 1 + BuilderUnaryPolynomial.workSteps(nextTokenSlotPolynomial verifier, input) + 1 + FirstClauseTailAppender.workSteps(input, firstLiteralTokens problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixRawTimePolynomial, "BuilderFirstLiteralPrefix.rawTimeBound + 1158 + 6 * BuilderUnaryPolynomial.workTimePolynomial(nextTokenSlotPolynomial verifier) + 192 * inputLength + 96 * FormulaWidth");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixRuleCount, "1138 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)");
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFirstClausePrefixTheoremKernelTypeSha256).length, 43);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCanonicalFormulaPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixNextTokenCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_twelve");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.finalTokenBits_eq_encodedFormula_firstClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixRulesDistinctTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rules_pairwise_query_distinct");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixTailRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_rawTimeBound");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixAcceptTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.boundedDecide_compile_accept");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixNoTimeoutTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.boundedDecide_compile_ne_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePrefixOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstClausePrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstClausePrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepAuditedDeclarationCount, 47);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepDirectPaddingOutcomeFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepSinglePaddingStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepWorkTime, "BuilderFirstClausePrefix.workSteps(input) + 1 + CursorAdvance.advanceWorkSteps(cursorWord problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepRawTimePolynomial, "BuilderFirstClausePrefix.rawTimeBound + 48 + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepRuleCount, /^1192 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepTheoremKernelTypeSha256).length, 31);
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.specification_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepDirectPaddingTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.directOutcome_is_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTokenSlot_eq_formulaVariableSlotBound_add_thirteen");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTokenBits_eq_encodedFormula_firstClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepMalformedScratchTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.malformedCursorScratch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderDynamicTokenCursorStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount, 84);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.match(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunWorkTime, /PaddingCountdown\.loopSteps/);
  assert.match(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunRawTimePolynomial, /countdownBoundPolynomial/);
  assert.match(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunRuleCount, /^1244 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunTheoremKernelTypeSha256).length, 48);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.specification_padding_run");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunSecondClauseStartTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalTokenSlot_eq_secondClauseStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunSecondClauseSeparatorTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.secondClauseStart_direct_eq_sep");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunRemainingCountTheorem, "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.remainingPaddingCount_eq");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunPredecessorTransportTheorem, "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact_of_unit_or_separator");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstClausePaddingRunProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepRuleCount, /^1366 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepSeparatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.specification_separator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.nextTokenSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepPredecessorDeadStepTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClauseSeparatorStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount, 87);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixRuleCount, /^1610 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixTheoremKernelTypeSha256).length, 58);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixSignSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_sign_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondClauseFirstLiteralTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseFirstLiteral");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_three");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixSignTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClauseFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount, 115);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixRawTimePolynomial, "BuilderSecondClauseFirstLiteralPrefix.rawTimeBound + 1026 + 72 * inputLength + 36 * FormulaWidth + 36 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixRuleCount, /^1976 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixTheoremKernelTypeSha256).length, 75);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixSignSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_sign_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixUnaryUnitSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondClauseSecondLiteralTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseSecondLiteral");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_six");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixSignTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixUnaryUnitTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralUnaryUnitSlot_direct_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClauseSecondLiteralPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixAuditedDeclarationCount, 57);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixClauseTerminatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixRawTimePolynomial, "BuilderSecondClauseSecondLiteralPrefix.rawTimeBound + 390 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClausePrefixRuleCount, /^2098 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondClausePrefixTheoremKernelTypeSha256).length, 41);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.secondClauseTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenBits_eq_encodedFormula_secondClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenSlot_eq_secondClauseStart_add_seven");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.clauseTerminatorSlot_direct_eq_finish");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.nextTokenSlot_direct_eq_padding");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClausePrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClausePrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunWorkTime, /PaddingCountdown\.loopSteps/);
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunRawTimePolynomial, /countEvaluator\.workSteps/);
  assert.match(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunRuleCount, /^2150 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunPaddingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_padding_run");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunTargetSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_target_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenBits_eq_encodedFormula_secondClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunRemainingCountTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_seven");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunThirdClauseCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenSlot_eq_thirdClauseStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunDirectPaddingTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.paddingSlot_direct_eq_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunDirectSeparatorTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.thirdClauseStart_direct_eq_sep");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.run_compile_rawTimeBound");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondClausePaddingRunProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepRawTimePolynomial, "BuilderSecondClausePaddingRun.rawTimeBound + 330 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepRuleCount, /^2272 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepSeparatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_separator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.thirdClauseStartTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenBits_eq_encodedFormula_thirdClauseStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenSlot_eq_thirdClauseStart_add_one");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.nextTokenSlot_direct_eq_f");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClauseSeparatorStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount, 87);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixWorkTime, "BuilderThirdClauseSeparatorStep.workSteps(problem) + 1 + BuilderThirdClauseFirstLiteralPrefix.suffixWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixRawTimePolynomial, "BuilderThirdClauseSeparatorStep.rawTimeBound + 732 + 48 * inputLength + 24 * FormulaWidth + 24 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixRuleCount, /^2516 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixTheoremKernelTypeSha256).length, 58);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixSignSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_sign_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseFirstLiteral");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_three");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixSignTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixSuffixRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rules_length");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClauseFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount, 145);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixWorkTime, "BuilderThirdClauseFirstLiteralPrefix.workSteps(problem) + 1 + BuilderThirdClauseSecondLiteralPrefix.suffixWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixRawTimePolynomial, "BuilderThirdClauseFirstLiteralPrefix.rawTimeBound + 1752 + 96 * inputLength + 48 * FormulaWidth + 48 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixRuleCount, /^3004 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixTheoremKernelTypeSha256).length, 92);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixSignSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_sign_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixFirstUnarySpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixSecondUnarySpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseSecondLiteral");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_seven");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixSignTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixFirstUnaryTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralFirstUnaryUnitSlot_direct_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixSecondUnaryTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSecondUnaryUnitSlot_direct_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixTrueTokenCursorRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixSecondLiteralSuffixRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClauseSecondLiteralPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixAuditedDeclarationCount, 57);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixClauseTerminatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixWorkTime, "BuilderThirdClauseSecondLiteralPrefix.workSteps(problem) + 1 + appenderWorkSteps(problem) + 1 + cursorWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixRawTimePolynomial, "BuilderThirdClauseSecondLiteralPrefix.rawTimeBound + 498 + 24 * inputLength + 12 * FormulaWidth + 12 * BuilderThirdClauseSeparatorStep.cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClausePrefixRuleCount, /^3126 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderThirdClausePrefixTheoremKernelTypeSha256).length, 41);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.thirdClauseTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenBits_eq_encodedFormula_thirdClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenSlot_eq_thirdClauseStart_add_eight");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixClauseTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.clauseTerminatorSlot_direct_eq_finish");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.nextTokenSlot_direct_eq_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePrefixFinishTokenCursorRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.rules_length");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClausePrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClausePrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunWorkTime, /PaddingCountdown\.loopSteps/);
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunRawTimePolynomial, /countEvaluator\.workSteps/);
  assert.match(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunRuleCount, /^3178 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunPaddingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_padding_run");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunTargetSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_target_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenBits_eq_encodedFormula_thirdClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunRemainingCountTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_eight");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunFourthClauseCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenSlot_eq_fourthClauseStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunDirectPaddingTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.paddingSlot_direct_eq_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunDirectSeparatorTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.fourthClauseStart_direct_eq_sep");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.run_compile_rawTimeBound");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderThirdClausePaddingRunProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepWorkTime, "BuilderThirdClausePaddingRun.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, thirdClauseTokens problem) + 1 + CursorAdvance.advanceWorkSteps(cursorWord problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepRawTimePolynomial, "BuilderThirdClausePaddingRun.rawTimeBound + 426 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepRuleCount, /^3300 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepSeparatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_separator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.fourthClauseStartTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenBits_eq_encodedFormula_fourthClauseStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenSlot_eq_fourthClauseStart_add_one");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.nextTokenSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepSuffixRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepPredecessorDeadStepTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFourthClauseSeparatorStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount, 115);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixWorkTime, "BuilderFourthClauseSeparatorStep.workSteps(problem) + 1 + BuilderFourthClauseFirstLiteralPrefix.suffixWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixRawTimePolynomial, "BuilderFourthClauseSeparatorStep.rawTimeBound + 1422 + 72 * inputLength + 36 * FormulaWidth + 36 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixRuleCount, /^3666 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixTheoremKernelTypeSha256).length, 75);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixSignSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_sign_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixUnaryUnitSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_unaryUnit_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.fourthClauseFirstLiteralTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseFirstLiteral");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenSlot_eq_fourthClauseStart_add_four");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixSignTokenTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixUnaryUnitTokenTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralUnaryUnitSlot_direct_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralTerminatorSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixSuffixRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixPredecessorDeadStepTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFourthClauseFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount, 147);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixWorkTime, "BuilderFourthClauseFirstLiteralPrefix.workSteps(problem) + 1 + BuilderFourthClauseSecondLiteralPrefix.suffixWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixRawTimePolynomial, "BuilderFourthClauseFirstLiteralPrefix.rawTimeBound + 2232 + 96 * inputLength + 48 * FormulaWidth + 48 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixRuleCount, /^4154 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixTheoremKernelTypeSha256).length, 92);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixSignSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_sign_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixSecondUnaryUnitSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseSecondLiteral");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenSlot_eq_fourthClauseStart_add_eight");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixSuffixRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixPredecessorDeadStepTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFourthClauseSecondLiteralPrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixAuditedDeclarationCount, 57);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixWorkTime, "BuilderFourthClauseSecondLiteralPrefix.workSteps(problem) + 1 + BuilderFourthClausePrefix.suffixWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixRawTimePolynomial, "BuilderFourthClauseSecondLiteralPrefix.rawTimeBound + 618 + 24 * inputLength + 12 * FormulaWidth + 12 * BuilderFourthClauseSeparatorStep.cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderFourthClausePrefixRuleCount, /^4276 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFourthClausePrefixTheoremKernelTypeSha256).length, 41);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.specification_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.fourthClauseTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTokenBits_eq_encodedFormula_fourthClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixAdvancedCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTokenSlot_eq_fourthClauseStart_add_nine");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixClauseTerminatorTokenTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.clauseTerminatorSlot_direct_eq_finish");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.nextTokenSlot_direct_eq_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixFinishTokenCursorRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.FinishTokenCursor.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePrefixPredecessorDeadStepTheorem, "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFourthClausePrefixAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFourthClausePrefixProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunWorkTime, "BuilderFourthClausePrefix.workSteps(problem) + 1 + BuilderUnaryPolynomial.workSteps(remainingPaddingPolynomial verifier, input) + 1 + PaddingCountdown.loopSteps(countControllerPrefixLength, remainingPaddingCount) + 1 + BuilderUnaryPolynomial.workSteps(fifthClauseSlotStartPolynomial verifier, input)");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunRawTimePolynomial, "BuilderFourthClausePrefix.rawTimeBound + 18 + 6 * countEvaluator.workSteps + 6 * (D * (2 * countRootPrefixLength + 8) + D * D) + 6 * targetEvaluator.workSteps");
  assert.match(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunRuleCount, /^4328 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunPaddingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.specification_padding_run");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunTargetSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.specification_target_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunRemainingCountTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_nine");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunFifthClauseCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTokenSlot_eq_fifthClauseSlotStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunDirectPaddingTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.paddingSlot_direct_eq_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunDirectFifthClausePaddingTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.fifthClauseSlotStart_direct_eq_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunMalformedRootTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.malformedCountdownRoot_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunMalformedScratchTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.malformedCountdownScratch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFourthClausePaddingRunProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunPaddingCountFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunWorkTime, "BuilderFourthClausePaddingRun.workSteps(problem) + 1 + BuilderUnaryPolynomial.workSteps(paddingPolynomial verifier, input) + 1 + PaddingCountdown.loopSteps(countControllerPrefixLength, paddingCount) + 1 + BuilderUnaryPolynomial.workSteps(sixthClauseSlotStartPolynomial verifier, input)");
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunRawTimePolynomial, "BuilderFourthClausePaddingRun.rawTimeBound + 18 + 6 * countEvaluator.workSteps + 6 * (D * (2 * countRootPrefixLength + 8) + D * D) + 6 * targetEvaluator.workSteps");
  assert.match(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunRuleCount, /^4380 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunPaddingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.specification_padding_run");
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunTargetSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.specification_target_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunPaddingCountTheorem, "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingCount_eq_formulaTokensPerClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunSixthClauseCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTokenSlot_eq_sixthClauseSlotStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunDirectPaddingTheorem, "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingSlot_direct_eq_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunDirectSixthClausePaddingTheorem, "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.sixthClauseSlotStart_direct_eq_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunMalformedRootTheorem, "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.malformedCountdownRoot_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunMalformedScratchTheorem, "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.malformedCountdownScratch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFifthClausePaddingRunProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunAuditedDeclarationCount, 68);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunPaddingCountFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunSecondConstraintSeparatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunWorkTime, "BuilderFifthClausePaddingRun.workSteps(problem) + 1 + BuilderUnaryPolynomial.workSteps(paddingPolynomial verifier, input) + 1 + PaddingCountdown.loopSteps(countControllerPrefixLength, paddingCount) + 1 + BuilderUnaryPolynomial.workSteps(secondConstraintStartPolynomial verifier, input)");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunRawTimePolynomial, "BuilderFifthClausePaddingRun.rawTimeBound + 18 + 6 * countEvaluator.workSteps + 6 * (D * (2 * countRootPrefixLength + 8) + D * D) + 6 * targetEvaluator.workSteps");
  assert.match(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunRuleCount, /^4432 \+ /);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunPaddingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.specification_padding_run");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunTargetSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.specification_target_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTokenBits_eq_encodedFormula_fourthClause");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunPaddingCountTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingCount_eq_remaining_first_constraint");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunSecondConstraintCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTokenSlot_eq_secondConstraintStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunDirectPaddingTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingSlot_direct_eq_padding");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunDirectSecondConstraintSeparatorTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.secondConstraintStart_direct_eq_sep");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunRulesDistinctTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rules_pairwise_query_distinct");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.run_compile_rawTimeBound");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunAcceptTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.boundedDecide_compile_accept");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunNoTimeoutTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.boundedDecide_compile_ne_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunMalformedRootTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.malformedCountdownRoot_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunMalformedScratchTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.malformedCountdownScratch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderFirstConstraintPaddingRunProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepSecondConstraintSeparatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepWorkTime, "BuilderFirstConstraintPaddingRun.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, fourthClauseTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepRawTimePolynomial, "BuilderFirstConstraintPaddingRun.rawTimeBound + 534 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepRuleCount, /^4554 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.appender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepCursorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.cursor_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepSeparatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_separator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTokenBits_eq_encodedFormula_secondConstraintStart");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.secondConstraintStartTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTokenSlot_eq_secondConstraintStart_add_one");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.nextTokenSlot_direct_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepAppenderEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.appenderEndpoint_before_cursor_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepMalformedAppenderOutputTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.malformedAppenderOutput_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepMalformedAppenderTallyTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.malformedAppenderTally_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepMalformedCursorScratchTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.malformedCursorScratch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintSeparatorStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepSecondConstraintFirstLiteralSignFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepWorkTime, "BuilderSecondConstraintSeparatorStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintStartTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepRawTimePolynomial, "BuilderSecondConstraintSeparatorStep.rawTimeBound + 546 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepRuleCount, /^4676 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.appender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepCursorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.cursor_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepSignSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_sign_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSign");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.secondConstraintFirstLiteralSignTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTokenSlot_eq_secondConstraintStart_add_two");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.nextTokenSlot_direct_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepAppenderEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.appenderEndpoint_before_cursor_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepMalformedAppenderOutputTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.malformedAppenderOutput_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepMalformedAppenderTallyTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.malformedAppenderTally_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepMalformedCursorScratchTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.malformedCursorScratch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSignStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSecondConstraintFirstLiteralFirstUnaryUnitFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepWorkTime, "BuilderSecondConstraintFirstLiteralSignStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintFirstLiteralSignTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRawTimePolynomial, "BuilderSecondConstraintFirstLiteralSignStep.rawTimeBound + 558 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRuleCount, /^4798 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.appender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCursorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.cursor_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFirstUnaryUnitSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_firstUnaryUnit_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralFirstUnary");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.secondConstraintFirstLiteralFirstUnaryTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_three");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.nextTokenSlot_direct_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAppenderEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.appenderEndpoint_before_cursor_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepMalformedAppenderOutputTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.malformedAppenderOutput_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepMalformedAppenderTallyTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.malformedAppenderTally_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepMalformedCursorScratchTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.malformedCursorScratch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondConstraintFirstLiteralSecondUnaryUnitFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepWorkTime, "BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintFirstLiteralFirstUnaryTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRawTimePolynomial, "BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rawTimeBound + 570 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRuleCount, /^4920 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.appender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCursorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.cursor_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondUnaryUnitSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_secondUnaryUnit_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSecondUnary");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.secondConstraintFirstLiteralSecondUnaryTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_four");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.nextTokenSlot_direct_eq_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAppenderEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.appenderEndpoint_before_cursor_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepMalformedAppenderOutputTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.malformedAppenderOutput_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepMalformedAppenderTallyTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.malformedAppenderTally_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepMalformedCursorScratchTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.malformedCursorScratch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepSecondConstraintFirstLiteralThirdUnaryUnitFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepWorkTime, "BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintFirstLiteralSecondUnaryTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRawTimePolynomial, "BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rawTimeBound + 582 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRuleCount, /^5042 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.appender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepCursorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.cursor_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepThirdUnaryUnitSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.specification_thirdUnaryUnit_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralThirdUnary");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.secondConstraintFirstLiteralThirdUnaryTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_five");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.nextTokenSlot_direct_eq_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAppenderEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.appenderEndpoint_before_cursor_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepMalformedAppenderOutputTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.malformedAppenderOutput_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepMalformedAppenderTallyTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.malformedAppenderTally_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepMalformedCursorScratchTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.malformedCursorScratch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAuditedDeclarationCount, 56);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepSecondConstraintFirstLiteralTerminatorFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepWorkTime, "BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintFirstLiteralThirdUnaryTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRawTimePolynomial, "BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.rawTimeBound + 594 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRuleCount, /^5164 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.appender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepCursorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.cursor_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepTerminatorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.specification_terminator_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepNextSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.specification_next_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralTerminator");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.secondConstraintFirstLiteralTerminatorTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.finalTokenSlot_eq_secondConstraintStart_add_six");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepNextTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.nextTokenSlot_direct_eq_finish_or_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAppenderEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.appenderEndpoint_before_cursor_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepMalformedAppenderOutputTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.malformedAppenderOutput_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepMalformedAppenderTallyTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.malformedAppenderTally_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepMalformedCursorScratchTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.malformedCursorScratch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralTerminatorStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAuditedDeclarationCount, 82);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSecondConstraintFirstLiteralSuccessorTokenFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepInputPrefixAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepWorkTime, "BuilderSecondConstraintFirstLiteralTerminatorStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRawTimePolynomial, "BuilderSecondConstraintFirstLiteralTerminatorStep.rawTimeBound + 600 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRuleCount, /^5284 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepWidthEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.widthEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepBranchAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.branchAppender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepTargetEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.targetEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSuccessorSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.specification_successor_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFollowingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.specification_following_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSuccessor");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.secondConstraintFirstLiteralSuccessorTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.finalTokenSlot_eq_secondConstraintStart_add_seven");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFollowingTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.followingTokenSlot_direct_eq_padding_or_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepWorkTime, "BuilderSecondConstraintFirstLiteralSuccessorTokenStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRawTimePolynomial, "BuilderSecondConstraintFirstLiteralSuccessorTokenStep.rawTimeBound + 612 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRuleCount, /^5404 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepWidthEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepOptionalAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepTargetEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepOpportunitySpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.specification_opportunity_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFollowingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.specification_following_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintPaddingOrUnary");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.secondConstraintPaddingOrUnaryTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_eight");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFollowingTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRulesDistinctTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.rules_pairwise_query_distinct");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAcceptTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.boundedDecide_compile_accept");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepNoTimeoutTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.boundedDecide_compile_ne_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepSecondPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepWorkTime, "BuilderSecondConstraintPaddingOrUnaryOpportunityStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRawTimePolynomial, "BuilderSecondConstraintPaddingOrUnaryOpportunityStep.rawTimeBound + 624 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRuleCount, /^5524 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepWidthEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepOptionalAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepTargetEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepOpportunitySpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.specification_opportunity_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFollowingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.specification_following_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintSecondPaddingOrUnary");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.secondConstraintSecondPaddingOrUnaryTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_nine");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFollowingTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRulesDistinctTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.rules_pairwise_query_distinct");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAcceptTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.boundedDecide_compile_accept");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepNoTimeoutTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.boundedDecide_compile_ne_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepThirdPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepWorkTime, "BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRawTimePolynomial, "BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.rawTimeBound + 636 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRuleCount, /^5644 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepWidthEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepOptionalAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepTargetEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepOpportunitySpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.specification_opportunity_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFollowingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.specification_following_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintThirdPaddingOrUnary");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.secondConstraintThirdPaddingOrUnaryTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_ten");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFollowingTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRulesDistinctTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.rules_pairwise_query_distinct");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAcceptTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.boundedDecide_compile_accept");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepNoTimeoutTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.boundedDecide_compile_ne_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFourthPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepWorkTime, "BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRawTimePolynomial, "BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.rawTimeBound + 648 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRuleCount, /^5764 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepWidthEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepOptionalAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepTargetEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepOpportunitySpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.specification_opportunity_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFollowingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.specification_following_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintFourthPaddingOrUnary");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.secondConstraintFourthPaddingOrUnaryTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_eleven");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFollowingTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_f");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRulesDistinctTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.rules_pairwise_query_distinct");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAcceptTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.boundedDecide_compile_accept");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepNoTimeoutTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.boundedDecide_compile_ne_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFifthPaddingOrTerminatorOpportunityFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepInputPrefixOptionalTerminatorAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepWorkTime, "BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRawTimePolynomial, "BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.rawTimeBound + 660 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRuleCount, /^5884 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepWidthEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.widthEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepOptionalAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.optionalAppender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepTargetEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.targetEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepOpportunitySpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.specification_opportunity_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFollowingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.specification_following_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintFifthPaddingOrTerminator");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.secondConstraintFifthPaddingOrTerminatorTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_twelve");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFollowingTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.followingTokenSlot_direct_eq_padding_or_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRulesDistinctTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.rules_pairwise_query_distinct");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.run_compile_rawTimeBound");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAcceptTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.boundedDecide_compile_accept");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepNoTimeoutTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.boundedDecide_compile_ne_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepSixthPaddingOrOpeningUnaryOpportunityFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepWorkTime, "BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRawTimePolynomial, "BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.rawTimeBound + 672 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRuleCount, /^6004 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepWidthEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.widthEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepOptionalAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.optionalAppender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepTargetEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.targetEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepOpportunitySpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.specification_opportunity_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFollowingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.specification_following_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintSixthPaddingOrOpeningUnary");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.secondConstraintSixthPaddingOrOpeningUnaryTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_thirteen");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFollowingTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRulesDistinctTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.rules_pairwise_query_distinct");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.run_compile_rawTimeBound");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAcceptTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.boundedDecide_compile_accept");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepNoTimeoutTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.boundedDecide_compile_ne_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepSeventhPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepWorkTime, "BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRawTimePolynomial, "BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.rawTimeBound + 684 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps");
  assert.match(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRuleCount, /^6124 \+ /u);
  assert.equal(Object.keys(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExactWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepPrefixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.prefix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepWidthEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepOptionalAppenderWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepTargetEvaluatorWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepSuffixWorkRunTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.suffix_workRunExact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepOpportunitySpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.specification_opportunity_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFollowingSpecificationTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.specification_following_step");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFormulaBitsTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintSeventhPaddingOrUnary");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepCanonicalPrefixTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.secondConstraintSeventhPaddingOrUnaryTokens_eq_canonical_formula_prefix");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFinalCoordinateTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_fourteen");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFollowingTokenTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRulesLengthTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.rules_length");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRulesDistinctTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.rules_pairwise_query_distinct");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepCompiledExactTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.run_compile_exact");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepCompiledBoundTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAcceptTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.boundedDecide_compile_accept");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepNoTimeoutTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.boundedDecide_compile_ne_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepPrefixEndpointTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.prefixEndpoint_before_launch_timeout");
  assert.equal(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepOneStepShortTheorem, "PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.work_one_step_short_timeout");
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.lockedNANDCarrierLayoutFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDCarrierTraceAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.lockedNANDCarrierTraceAuditedDeclarationCount, 71);
  assert.equal(release.earnedBoundary.lockedNANDCarrierTraceScope, "arbitrary-finite-topological-nand-circuits-carrier-separation-and-trace-equivalence");
  assert.equal(Object.keys(release.earnedBoundary.lockedNANDCarrierTraceTheoremKernelTypeSha256).length, 8);
  assert.equal(release.earnedBoundary.lockedNANDTraceEquivalenceTheorem, "PNP.DirectWire.LockedNANDTrace.traceEquivalence");
  assert.equal(release.earnedBoundary.lockedNANDSatisfiableTraceTheorem, "PNP.DirectWire.LockedNANDTrace.satisfiable_iff_trace_extension");
  assert.deepEqual(release.earnedBoundary.lockedNANDCarrierTraceAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.lockedNANDCarrierTraceProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.lockedNANDGlobalCandidateAssemblyFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDGlobalBaselineCandidateFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDGlobalCandidateAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.lockedNANDGlobalCandidateAuditedDeclarationCount, 71);
  assert.equal(release.earnedBoundary.lockedNANDGlobalCandidateScope, "arbitrary-finite-topological-nand-circuits-exact-baseline-and-four-gate-extension");
  assert.equal(Object.keys(release.earnedBoundary.lockedNANDGlobalCandidateTheoremKernelTypeSha256).length, 11);
  assert.equal(release.earnedBoundary.lockedNANDBaselineCandidateSizeTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_size");
  assert.equal(release.earnedBoundary.lockedNANDFullCandidateSizeTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_size");
  assert.equal(release.earnedBoundary.lockedNANDFullCandidateFinalSemanticsTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_semantics");
  assert.equal(release.earnedBoundary.lockedNANDBaselineCandidateFinalLockIrrelevantTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_finalLock_irrelevant");
  assert.deepEqual(release.earnedBoundary.lockedNANDGlobalCandidateAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.lockedNANDGlobalCandidateProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.lockedNANDGlobalBaselineDistinctFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDGlobalBaselineDistinctAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.lockedNANDGlobalBaselineDistinctAuditedDeclarationCount, 5);
  assert.equal(release.earnedBoundary.lockedNANDGlobalBaselineDistinctScope, "arbitrary-finite-topological-nand-circuits-global-baseline-output-conditions-and-exact-reference-minimum");
  assert.equal(Object.keys(release.earnedBoundary.lockedNANDGlobalBaselineDistinctTheoremKernelTypeSha256).length, 5);
  assert.equal(release.earnedBoundary.lockedNANDBaselineOutputNonconstantTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_outputNonconstant");
  assert.equal(release.earnedBoundary.lockedNANDBaselineOutputNotPositiveProjectionTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_outputNotPositiveProjection");
  assert.equal(release.earnedBoundary.lockedNANDBaselineOutputPairwiseDistinctTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_outputPairwiseDistinct");
  assert.equal(release.earnedBoundary.lockedNANDBaselineOutputConditionsTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_outputConditions");
  assert.equal(release.earnedBoundary.lockedNANDBaselineReferenceMinimumTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_referenceMinimum");
  assert.deepEqual(release.earnedBoundary.lockedNANDGlobalBaselineDistinctAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.lockedNANDGlobalBaselineDistinctProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.lockedNANDUnsatisfiableFinalZeroFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDUnsatisfiableFinalZeroAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.lockedNANDUnsatisfiableFinalZeroAuditedDeclarationCount, 2);
  assert.equal(release.earnedBoundary.lockedNANDUnsatisfiableFinalZeroScope, "arbitrary-finite-topological-nand-circuits-whole-carrier-unsatisfiable-final-zero-and-exact-reference-minimum");
  assert.equal(Object.keys(release.earnedBoundary.lockedNANDUnsatisfiableFinalZeroTheoremKernelTypeSha256).length, 2);
  assert.equal(release.earnedBoundary.lockedNANDUnsatisfiableFinalZeroTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_eq_false_of_unsatisfiable");
  assert.equal(release.earnedBoundary.lockedNANDUnsatisfiableReferenceMinimumTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_referenceMinimum_eq_baseline_of_unsatisfiable");
  assert.deepEqual(release.earnedBoundary.lockedNANDUnsatisfiableFinalZeroAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.lockedNANDUnsatisfiableFinalZeroProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.lockedNANDGlobalSemanticThresholdFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDGlobalSemanticThresholdAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.lockedNANDGlobalSemanticThresholdAuditedDeclarationCount, 8);
  assert.equal(release.earnedBoundary.lockedNANDGlobalSemanticThresholdScope, "arbitrary-finite-topological-nand-circuits-complete-six-field-premises-and-typed-semantic-threshold");
  assert.equal(Object.keys(release.earnedBoundary.lockedNANDGlobalSemanticThresholdTheoremKernelTypeSha256).length, 8);
  assert.equal(release.earnedBoundary.lockedNANDFinalNonconstantOfSatisfiableTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_nonconstant_of_satisfiable");
  assert.equal(release.earnedBoundary.lockedNANDFinalNotPositiveProjectionOfSatisfiableTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_notPositiveProjection_of_satisfiable");
  assert.equal(release.earnedBoundary.lockedNANDFinalDistinctFromBaselineOfSatisfiableTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_distinctFromBaseline_of_satisfiable");
  assert.equal(release.earnedBoundary.lockedNANDSatisfiableFinalConditionsTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_satisfiableFinalConditions");
  assert.equal(release.earnedBoundary.lockedNANDReferenceMinimumBoundsOfSatisfiableTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_referenceMinimum_bounds_of_satisfiable");
  assert.equal(release.earnedBoundary.lockedNANDResidualSlackLeFourTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_residualSlack_le_four");
  assert.equal(release.earnedBoundary.lockedNANDSatisfiableIffReferenceMinimumGeSuccTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_satisfiable_iff_referenceMinimum_ge_succ");
  assert.deepEqual(release.earnedBoundary.lockedNANDGlobalSemanticThresholdAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.lockedNANDGlobalSemanticThresholdProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.lockedNANDEncodedSemanticReductionFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDEncodedSemanticReductionAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.lockedNANDEncodedSemanticReductionAuditedDeclarationCount, 50);
  assert.equal(release.earnedBoundary.lockedNANDEncodedSemanticReductionScope, "strict-version-zero-codec-direct-normalization-semantics-complete-candidate-bytes-and-fail-closed-semantic-reduction");
  assert.equal(Object.keys(release.earnedBoundary.lockedNANDEncodedSemanticReductionTheoremKernelTypeSha256).length, 11);
  assert.deepEqual(release.earnedBoundary.lockedNANDEncodedSemanticReductionAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.lockedNANDEncodedSemanticReductionProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.lockedNANDCanonicalEncodingFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDCompleteCandidateCodecFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDNormalizationSemanticsFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDParserMachineFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserAuditedDeclarationCount, 380);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserEmptyAxiomDeclarationCount, 247);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserPropextOnlyDeclarationCount, 58);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserPropextQuotSoundDeclarationCount, 75);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserScope, "literal-228-state-2052-rule-strict-version-zero-all-input-parser-byte-preserving-or-empty-with-compiled-cubic-bound");
  assert.equal(release.earnedBoundary.lockedNANDSourceParserStateCount, 228);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserRuleCount, 2052);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserSymbolCount, 9);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserAllInputExactFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserExactOutputFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserCompiledNonTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserPolynomialTimeMachineFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserPolynomialTimeFunctionFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserRawRefinementFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserWorkBound, "4096 * (n + 1)^3");
  assert.equal(release.earnedBoundary.lockedNANDSourceParserCompiledRawTimeBound, "6 * 4096 * (n + 1)^3");
  assert.deepEqual(release.earnedBoundary.lockedNANDSourceParserTheoremKernelTypeSha256, LOCKED_NAND_SOURCE_PARSER_HASHES);
  assert.deepEqual(release.earnedBoundary.lockedNANDSourceParserAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.lockedNANDSourceParserProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.lockedNANDSourceParserAllInputTheorem, "PNP.Concrete.LockedNAND.SourceParser.allInput_exact");
  assert.equal(release.earnedBoundary.lockedNANDSourceParserAcceptIffTheorem, "PNP.Concrete.LockedNAND.SourceParser.compiledBoundedDecide_accept_iff");
  assert.equal(release.earnedBoundary.lockedNANDSourceParserNoTimeoutTheorem, "PNP.Concrete.LockedNAND.SourceParser.compiledBoundedDecide_ne_timeout");
  assert.equal(release.earnedBoundary.lockedNANDSourceParserOutputTheorem, "PNP.Concrete.LockedNAND.SourceParser.compiledMachineOutput_eq_validatedSourceBytes");
  assert.equal(release.earnedBoundary.lockedNANDSourceParserPolynomialFunctionTheorem, "PNP.Concrete.LockedNAND.SourceParser.validatedSourceBytesPolynomialTimeFunction_output");
  assert.equal(release.earnedBoundary.lockedNANDEmitterMachineFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterAuditedDeclarationCount, 3295);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterEmptyAxiomDeclarationCount, 2224);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterPropextOnlyDeclarationCount, 429);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterPropextQuotSoundDeclarationCount, 642);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterRuleCount, 1387921);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterSymbolCount, 9);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterAllInputExactFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterExactTargetBytesFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterCompiledNonTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterPolynomialTimeMachineFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterPolynomialTimeFunctionFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterRawRefinementFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterStrictParserCompositionFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterOutputSizeBoundFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterWorkBound, "allInputWorkBound(n)");
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterCompiledRawTimeBound, "6 * allInputWorkBound(n)");
  assert.equal(release.earnedBoundary.lockedNANDTargetEmitterOutputSizeBound, "4 * (409 * (n + 1) + (100 * (n + 1)) * (403 * (n + 1)) + (100 * (n + 1)) * (201 * (n + 1)))");
  assert.deepEqual(release.earnedBoundary.lockedNANDTargetEmitterTheoremKernelTypeSha256, LOCKED_NAND_TARGET_EMITTER_HASHES);
  assert.deepEqual(release.earnedBoundary.lockedNANDTargetEmitterAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.lockedNANDTargetEmitterProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.lockedNANDPolynomialReductionFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDPolynomialReductionAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.lockedNANDPolynomialReductionAuditedDeclarationCount, 16);
  assert.equal(release.earnedBoundary.lockedNANDPolynomialReductionEmptyAxiomDeclarationCount, 2);
  assert.equal(release.earnedBoundary.lockedNANDPolynomialReductionPropextOnlyDeclarationCount, 2);
  assert.equal(release.earnedBoundary.lockedNANDPolynomialReductionPropextQuotSoundDeclarationCount, 12);
  assert.equal(
    release.earnedBoundary.lockedNANDPolynomialReductionScope,
    "strict-version-zero-parser-emitter-polynomial-reduction-with-exact-language-equivalence-and-recursive-raw-refinement"
  );
  assert.equal(release.earnedBoundary.lockedNANDPolynomialReductionExactFunctionFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDPolynomialReductionExactOutputFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDPolynomialReductionLanguageEquivalenceFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDPolynomialReductionWitnessFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDPolynomialReductionRawRefinementFormalized, true);
  assert.deepEqual(
    release.earnedBoundary.lockedNANDPolynomialReductionTheoremKernelTypeSha256,
    LOCKED_NAND_POLYNOMIAL_REDUCTION_HASHES
  );
  assert.deepEqual(release.earnedBoundary.lockedNANDPolynomialReductionAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.lockedNANDPolynomialReductionProjectAxiomClosure, []);
  assert.equal(
    release.earnedBoundary.lockedNANDPolynomialReductionFunctionTheorem,
    "PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_function"
  );
  assert.equal(
    release.earnedBoundary.lockedNANDPolynomialReductionOutputTheorem,
    "PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_output"
  );
  assert.equal(
    release.earnedBoundary.lockedNANDPolynomialReductionCorrectTheorem,
    "PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_correct"
  );
  assert.equal(
    release.earnedBoundary.lockedNANDPolynomialReductionWitnessTheorem,
    "PNP.Concrete.LockedNAND.encodedNANDSAT_reducesTo_encodedLockedNANDThreshold"
  );
  assert.equal(
    release.earnedBoundary.lockedNANDPolynomialReductionRawRefinementTheorem,
    "PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_hasRawRefinement"
  );
  assert.equal(release.earnedBoundary.cnfToNANDSemanticCompilerFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDSemanticCompilerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cnfToNANDSemanticCompilerAuditedDeclarationCount, 68);
  assert.equal(release.earnedBoundary.cnfToNANDSemanticCompilerEmptyAxiomDeclarationCount, 28);
  assert.equal(release.earnedBoundary.cnfToNANDSemanticCompilerPropextOnlyDeclarationCount, 19);
  assert.equal(release.earnedBoundary.cnfToNANDSemanticCompilerPropextQuotSoundDeclarationCount, 21);
  assert.equal(release.earnedBoundary.cnfToNANDExactCodecCanonicalityFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDTypedTopologicalCompilationFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDWellFormedOutputFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDExactSemanticsFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDEdgeSemanticsFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDExactGateCountFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialOutputSizeBoundFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDAllBitstringFailClosedFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDLockedThresholdCompositionFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDFiniteMachineFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialTimeFunctionFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionFormalized, true);
  assert.deepEqual(release.earnedBoundary.cnfToNANDSemanticCompilerTheoremKernelTypeSha256, CNF_TO_NAND_SEMANTIC_COMPILER_HASHES);
  assert.deepEqual(release.earnedBoundary.cnfToNANDSemanticCompilerAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cnfToNANDSemanticCompilerProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionAuditedDeclarationCount, 1316);
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionEmptyAxiomDeclarationCount, 864);
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionPropextOnlyDeclarationCount, 151);
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionPropextQuotSoundDeclarationCount, 301);
  assert.equal(release.earnedBoundary.cnfToNANDAllInputExactFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDExactMachineOutputFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDCompiledNonTimeoutFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDRawRefinementFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDDirectReductionFormalized, true);
  assert.equal(release.earnedBoundary.cnfToNANDLockedReductionCompositionFormalized, true);
  assert.deepEqual(release.earnedBoundary.cnfToNANDPolynomialReductionTheoremKernelTypeSha256, CNF_TO_NAND_POLYNOMIAL_REDUCTION_HASHES);
  assert.deepEqual(release.earnedBoundary.cnfToNANDPolynomialReductionAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.cnfToNANDPolynomialReductionProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionParserAllInputExactTheorem, "PNP.Concrete.CNFSourceParser.allInput_exact");
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionExactMachineOutputTheorem, "PNP.Concrete.CNFToNANDCompilerCompiled.compiledMachineOutput_eq_compileEncodedCNFToNAND");
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionCompiledNonTimeoutTheorem, "PNP.Concrete.CNFToNANDCompilerCompiled.compiledBoundedDecide_ne_timeout");
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionPolynomialTimeFunctionOutputTheorem, "PNP.Concrete.CNFToNANDCompilerCompiled.cnfToNANDPolynomialTimeFunction_output");
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionDirectReductionTheorem, "PNP.Concrete.CNFToNAND.cnfToNANDPolynomialReduction_correct");
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionDirectReductionWitnessTheorem, "PNP.Concrete.CNFToNAND.cnfSAT_reducesTo_encodedNANDSAT");
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionDirectRawRefinementTheorem, "PNP.Concrete.CNFToNAND.cnfToNANDPolynomialReduction_hasRawRefinement");
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionLockedReductionTheorem, "PNP.Concrete.CNFToNAND.cnfToLockedNANDPolynomialReduction_correct");
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionLockedReductionWitnessTheorem, "PNP.Concrete.CNFToNAND.cnfSAT_reducesTo_encodedLockedNANDThreshold");
  assert.equal(release.earnedBoundary.cnfToNANDPolynomialReductionLockedRawRefinementTheorem, "PNP.Concrete.CNFToNAND.cnfToLockedNANDPolynomialReduction_hasRawRefinement");
  assert.equal(release.earnedBoundary.residualGainChainVerifierFormalized, true);
  assert.equal(release.earnedBoundary.residualGainChainAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualGainChainAuditedDeclarationCount, 16);
  assert.equal(release.earnedBoundary.residualGainChainEmptyAxiomDeclarationCount, 12);
  assert.equal(release.earnedBoundary.residualGainChainPropextQuotSoundDeclarationCount, 4);
  assert.equal(release.earnedBoundary.residualGainChainSemanticInvariantFormalized, true);
  assert.equal(release.earnedBoundary.residualGainChainSlackIterationBoundFormalized, true);
  assert.equal(release.earnedBoundary.residualGainChainPolynomialRuntimeFormalized, false);
  assert.equal(release.earnedBoundary.residualGainChainScope, "all-finite-proof-bearing-or-executably-verified-strict-equivalent-gain-chains-with-locked-family-four-step-specialization");
  assert.deepEqual(release.earnedBoundary.residualGainChainTheoremKernelTypeSha256, RESIDUAL_GAIN_CHAIN_THEOREM_SHA256);
  assert.deepEqual(release.earnedBoundary.residualGainChainAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualGainChainProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualGainChainAggregateSlackBoundTheorem, "PNP.DirectWire.StrictGainChain.end_residualSlack_add_length_le");
  assert.equal(release.earnedBoundary.lockedNANDStrictGainChainLengthLeFourTheorem, "PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_strictGainChain_length_le_four");
  assert.equal(release.earnedBoundary.residualGainStoppingSpecificationFormalized, true);
  assert.equal(release.earnedBoundary.residualGainStoppingAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualGainStoppingAuditedDeclarationCount, 12);
  assert.equal(release.earnedBoundary.residualGainStoppingEmptyAxiomDeclarationCount, 12);
  assert.equal(release.earnedBoundary.residualGainStoppingScope, "all-finite-direct-wire-implementations-with-global-strict-equivalent-gain-quantification-and-proof-supplied-chain-endpoint-stopping");
  assert.equal(release.earnedBoundary.residualGainReferenceMinimumWitnessFormalized, true);
  assert.equal(release.earnedBoundary.residualGainPositiveIffGlobalStrictGainFormalized, true);
  assert.equal(release.earnedBoundary.residualGainZeroIffGlobalNoStrictGainFormalized, true);
  assert.equal(release.earnedBoundary.residualGainSemanticMinimumIffGlobalNoStrictGainFormalized, true);
  assert.equal(release.earnedBoundary.residualGainChainGlobalStoppingConsequenceFormalized, true);
  assert.equal(release.earnedBoundary.residualGainChainExactMinimumPackagingFormalized, true);
  assert.deepEqual(release.earnedBoundary.residualGainStoppingTheoremKernelTypeSha256, RESIDUAL_GAIN_STOPPING_THEOREM_SHA256);
  assert.deepEqual(release.earnedBoundary.residualGainStoppingAxiomClosure, []);
  assert.deepEqual(release.earnedBoundary.residualGainStoppingProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalFullBridgeFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFullBridgeAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalFullBridgeAuditedDeclarationCount, 22);
  assert.equal(release.earnedBoundary.residualTerminalFullBridgeEmptyAxiomDeclarationCount, 22);
  assert.equal(release.earnedBoundary.residualTerminalizationExactFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFullMinimumSpecificationFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalMuBridgeFormalized, true);
  assert.equal(release.earnedBoundary.residualWholeSpanPositiveWitnessIffFormalized, true);
  assert.equal(release.earnedBoundary.residualWholeSpanStrictDescentFormalized, true);
  assert.equal(release.earnedBoundary.residualWholeSpanZeroAbsenceIffFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalQuotientCarrierFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalProperSupportFormalized, true);
  assert.deepEqual(release.earnedBoundary.residualTerminalFullBridgeTheoremKernelTypeSha256, RESIDUAL_TERMINAL_FULL_BRIDGE_THEOREM_SHA256);
  assert.deepEqual(release.earnedBoundary.residualTerminalFullBridgeAxiomClosure, []);
  assert.deepEqual(release.earnedBoundary.residualTerminalFullBridgeProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalModeFirewallFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalModeFirewallAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalModeFirewallAuditedDeclarationCount, 29);
  assert.equal(release.earnedBoundary.residualTerminalModeFirewallEmptyAxiomDeclarationCount, 29);
  assert.equal(release.earnedBoundary.residualTerminalProfileProjectionExactFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalCheckedFullLiftFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalQuotientEqualityNotConstructiveFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalObligationDischargePreservedFormalized, true);
  assert.deepEqual(release.earnedBoundary.residualTerminalModeFirewallTheoremKernelTypeSha256, RESIDUAL_TERMINAL_MODE_FIREWALL_THEOREM_SHA256);
  assert.deepEqual(release.earnedBoundary.residualTerminalModeFirewallAxiomClosure, []);
  assert.deepEqual(release.earnedBoundary.residualTerminalModeFirewallProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualProjectionMinimumFormalized, true);
  assert.equal(release.earnedBoundary.residualProjectionMinimumAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualProjectionMinimumAuditedDeclarationCount, 27);
  assert.equal(release.earnedBoundary.residualProjectionMinimumEmptyAxiomDeclarationCount, 9);
  assert.equal(release.earnedBoundary.residualProjectionMinimumPropextOnlyDeclarationCount, 18);
  assert.equal(release.earnedBoundary.residualProjectionMinimumExecutableFullScanFormalized, true);
  assert.equal(release.earnedBoundary.residualProjectionMinimumExecutableQuotientScanFormalized, true);
  assert.equal(release.earnedBoundary.residualProjectionMinimumAttainmentFormalized, true);
  assert.equal(release.earnedBoundary.residualProjectionMinimumUniversalLowerBoundsFormalized, true);
  assert.equal(release.earnedBoundary.residualProjectionMinimumMonotonicityFormalized, true);
  assert.equal(release.earnedBoundary.residualProjectionDefectDecompositionFormalized, true);
  assert.equal(release.earnedBoundary.residualProjectionDefectZeroIffCheckedLiftAtMinimumFormalized, true);
  assert.deepEqual(release.earnedBoundary.residualProjectionMinimumTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PROJECTION_MINIMUM_THEOREM_SHA256);
  assert.deepEqual(release.earnedBoundary.residualProjectionMinimumAxiomClosure, ["propext"]);
  assert.deepEqual(release.earnedBoundary.residualProjectionMinimumProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualProjectionTransferFormalized, true);
  assert.equal(release.earnedBoundary.residualProjectionTransferAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualProjectionTransferSignedDeltasFormalized, true);
  assert.equal(release.earnedBoundary.residualProjectionTransferIdentityFormalized, true);
  assert.equal(release.earnedBoundary.residualProjectionTransferConstantCutFormalized, true);
  assert.deepEqual(release.earnedBoundary.residualProjectionTransferTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PROJECTION_TRANSFER_THEOREM_SHA256);
  assert.deepEqual(release.earnedBoundary.residualProjectionTransferAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualProjectionTransferProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualProjectionDefectIntTheorem, "PNP.DirectWire.terminalProjectionDefect_int");
  assert.equal(release.earnedBoundary.residualProjectionTransferIdentityTheorem, "PNP.DirectWire.TerminalProjectionFourCorners.transferIdentity");
  assert.equal(release.earnedBoundary.residualProjectionTransferConstantCutTheorem, "PNP.DirectWire.TerminalProjectionFourCorners.constantCutEquation_of_defects");
  assert.equal(release.earnedBoundary.residualProjectionTransferPositiveExcessTheorem, "PNP.DirectWire.TerminalProjectionFourCorners.projectionExcess_pos_of_constantCut");
  assert.equal(
    release.earnedBoundary.residualProjectionTransferScope,
    "all-finite-direct-wire-four-corner-terminal-profile-families-sharing-one-computed-observer-and-one-explicit-projection"
  );
  assert.equal(release.earnedBoundary.residualTerminalSaturationFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSaturationAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalSaturationAuditedDeclarationCount, 18);
  assert.equal(release.earnedBoundary.residualTerminalSaturationEmptyAxiomDeclarationCount, 15);
  assert.equal(release.earnedBoundary.residualTerminalSaturationPropextQuotSoundDeclarationCount, 3);
  assert.equal(release.earnedBoundary.residualTerminalPrimitiveUniverseFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSaturationExtensiveFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSaturationLeastFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSaturationMonotoneFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSaturationIdempotentFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSaturationScope, "all-finite-terminal-primitive-record-universes-with-explicit-boolean-rule-tagged-dependencies");
  assert.deepEqual(release.earnedBoundary.residualTerminalSaturationTheoremKernelTypeSha256, RESIDUAL_TERMINAL_SATURATION_THEOREM_SHA256);
  assert.deepEqual(release.earnedBoundary.residualTerminalSaturationAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalSaturationProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalPrimitiveUniverseTheorem, "PNP.DirectWire.mem_allTerminalPrimitiveRecords");
  assert.equal(release.earnedBoundary.residualTerminalSaturationExtensiveTheorem, "PNP.DirectWire.terminalSaturate_extensive");
  assert.equal(release.earnedBoundary.residualTerminalSaturationClosedTheorem, "PNP.DirectWire.terminalSaturate_closed");
  assert.equal(release.earnedBoundary.residualTerminalSaturationLeastTheorem, "PNP.DirectWire.terminalSaturate_least");
  assert.equal(release.earnedBoundary.residualTerminalSaturationMonotoneTheorem, "PNP.DirectWire.terminalSaturate_monotone");
  assert.equal(release.earnedBoundary.residualTerminalSaturationIdempotentTheorem, "PNP.DirectWire.terminalSaturate_idempotent");
  assert.equal(release.earnedBoundary.residualTerminalSaturationFixedPointTheorem, "PNP.DirectWire.terminalSaturate_fixed_iff_closed");
  assert.equal(release.earnedBoundary.residualTerminalExecutableSaturationFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPhysicalSupportCompletionFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPhysicalBoundaryFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPhysicalInterfaceFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPhysicalCompatibilityFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPhysicalSupportCompletionAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalPhysicalSupportCompletionAuditedDeclarationCount, 35);
  assert.equal(release.earnedBoundary.residualTerminalPhysicalSupportCompletionEmptyAxiomDeclarationCount, 8);
  assert.equal(release.earnedBoundary.residualTerminalPhysicalSupportCompletionPropextOnlyDeclarationCount, 24);
  assert.equal(release.earnedBoundary.residualTerminalPhysicalSupportCompletionPropextQuotSoundDeclarationCount, 3);
  assert.equal(release.earnedBoundary.residualTerminalPhysicalSupportCompletionScope, "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-finite-seed-lists");
  assert.deepEqual(release.earnedBoundary.residualTerminalPhysicalSupportCompletionTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PHYSICAL_SUPPORT_THEOREM_SHA256);
  assert.deepEqual(release.earnedBoundary.residualTerminalPhysicalSupportCompletionAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalPhysicalSupportCompletionProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalSupportExtractionFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSupportExtractionAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalSupportExtractionAuditedDeclarationCount, 34);
  assert.equal(release.earnedBoundary.residualTerminalSupportExtractionEmptyAxiomDeclarationCount, 3);
  assert.equal(release.earnedBoundary.residualTerminalSupportExtractionPropextOnlyDeclarationCount, 11);
  assert.equal(release.earnedBoundary.residualTerminalSupportExtractionPropextQuotSoundDeclarationCount, 20);
  assert.equal(release.earnedBoundary.residualTerminalOpenSemanticsFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalInducedRecoveryFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSupportExtractionScope, "all-finite-direct-wire-candidates-terminal-record-lists-boundary-valuations-and-interface-coordinates");
  assert.deepEqual(release.earnedBoundary.residualTerminalSupportExtractionTheoremKernelTypeSha256, RESIDUAL_TERMINAL_SUPPORT_EXTRACTION_THEOREM_SHA256);
  assert.deepEqual(release.earnedBoundary.residualTerminalSupportExtractionAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalSupportExtractionProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalSelectedGateIndicesMembershipTheorem, "PNP.DirectWire.mem_terminalSelectedGateIndices_iff");
  assert.equal(release.earnedBoundary.residualTerminalExtractBoundaryTheorem, "PNP.DirectWire.extractTerminalSupport_boundary");
  assert.equal(release.earnedBoundary.residualTerminalExtractInterfaceTheorem, "PNP.DirectWire.extractTerminalSupport_interface");
  assert.equal(release.earnedBoundary.residualTerminalExtractSemanticsTheorem, "PNP.DirectWire.extractTerminalSupport_semantics");
  assert.equal(release.earnedBoundary.residualTerminalExtractInducedTheorem, "PNP.DirectWire.extractTerminalSupport_induced");
  assert.equal(release.earnedBoundary.residualTerminalExtractSaturatedSemanticsTheorem, "PNP.DirectWire.extractSaturatedTerminalSupport_semantics");
  assert.equal(release.earnedBoundary.residualTerminalSaturatedPhysicalCompatibilityReuseTheorem, "PNP.DirectWire.completeSaturatedTerminalPhysicalSupport_compatible");
  assert.equal(release.earnedBoundary.residualTerminalProperSupportFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalProperSupportSearchCompleteFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalProperSupportExactLocalGainFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalProperSupportAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalProperSupportAuditedDeclarationCount, 37);
  assert.equal(release.earnedBoundary.residualTerminalProperSupportEmptyAxiomDeclarationCount, 6);
  assert.equal(release.earnedBoundary.residualTerminalProperSupportPropextOnlyDeclarationCount, 3);
  assert.equal(release.earnedBoundary.residualTerminalProperSupportPropextQuotSoundDeclarationCount, 28);
  assert.equal(release.earnedBoundary.residualTerminalProperSupportScope, "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-canonical-primitive-record-seeds-with-exhaustive-reference-minimum-local-gain");
  assert.deepEqual(release.earnedBoundary.residualTerminalProperSupportTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PROPER_SUPPORT_THEOREM_SHA256);
  assert.deepEqual(release.earnedBoundary.residualTerminalProperSupportAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalProperSupportProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalSupportSquareClosureFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSupportSquareMeetJoinExactFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSupportSquarePhysicalCompatibilityFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSupportSquareSemanticExtractionFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSupportSquareClosureAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalSupportSquareClosureAuditedDeclarationCount, 40);
  assert.equal(release.earnedBoundary.residualTerminalSupportSquareClosureEmptyAxiomDeclarationCount, 6);
  assert.equal(release.earnedBoundary.residualTerminalSupportSquareClosurePropextOnlyDeclarationCount, 13);
  assert.equal(release.earnedBoundary.residualTerminalSupportSquareClosurePropextQuotSoundDeclarationCount, 21);
  assert.equal(release.earnedBoundary.residualTerminalSupportSquareClosureScope, "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-pairs-of-finite-terminal-seeds");
  assert.deepEqual(release.earnedBoundary.residualTerminalSupportSquareClosureTheoremKernelTypeSha256, RESIDUAL_TERMINAL_SUPPORT_SQUARE_THEOREM_SHA256);
  assert.deepEqual(release.earnedBoundary.residualTerminalSupportSquareClosureAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalSupportSquareClosureProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalSupportCompletionFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalGovernedSupportCompletionFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalGovernedProfilePartitionFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalGovernedSupportCompletionAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalGovernedSupportCompletionAuditedDeclarationCount, 42);
  assert.equal(release.earnedBoundary.residualTerminalGovernedSupportCompletionEmptyAxiomDeclarationCount, 9);
  assert.equal(release.earnedBoundary.residualTerminalGovernedSupportCompletionPropextOnlyDeclarationCount, 26);
  assert.equal(release.earnedBoundary.residualTerminalGovernedSupportCompletionPropextQuotSoundDeclarationCount, 7);
  assert.equal(release.earnedBoundary.residualTerminalGovernedSupportCompletionScope, "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-finite-seed-lists-and-saturated-support-square-corners");
  assert.deepEqual(release.earnedBoundary.residualTerminalGovernedSupportCompletionTheoremKernelTypeSha256, RESIDUAL_TERMINAL_GOVERNED_SUPPORT_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalGovernedSupportCompletionAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalGovernedSupportCompletionProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalFrontierPushoutFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFrontierBoundaryGlueExactFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFrontierInterfaceGlueExactFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFrontierProfileGlueExactFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFrontierInternalizationFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFrontierPushoutAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalFrontierPushoutAuditedDeclarationCount, 39);
  assert.equal(release.earnedBoundary.residualTerminalFrontierPushoutEmptyAxiomDeclarationCount, 4);
  assert.equal(release.earnedBoundary.residualTerminalFrontierPushoutPropextOnlyDeclarationCount, 22);
  assert.equal(release.earnedBoundary.residualTerminalFrontierPushoutPropextQuotSoundDeclarationCount, 13);
  assert.equal(release.earnedBoundary.residualTerminalFrontierPushoutScope, "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-computed-saturated-support-squares");
  assert.deepEqual(release.earnedBoundary.residualTerminalFrontierPushoutTheoremKernelTypeSha256, RESIDUAL_TERMINAL_FRONTIER_PUSHOUT_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalFrontierPushoutAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalFrontierPushoutProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalProjectionSquareFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalProjectionPhysicalInvariantFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalProjectionProfileExactFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalProjectionMeetJoinCommuteFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalProjectionPushoutCommuteFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalProjectionSquareAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalProjectionSquareAuditedDeclarationCount, 33);
  assert.equal(release.earnedBoundary.residualTerminalProjectionSquareEmptyAxiomDeclarationCount, 6);
  assert.equal(release.earnedBoundary.residualTerminalProjectionSquarePropextOnlyDeclarationCount, 21);
  assert.equal(release.earnedBoundary.residualTerminalProjectionSquarePropextQuotSoundDeclarationCount, 6);
  assert.equal(release.earnedBoundary.residualTerminalProjectionSquareScope, "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-computed-saturated-support-squares-and-forgetful-terminal-projections");
  assert.deepEqual(release.earnedBoundary.residualTerminalProjectionSquareTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PROJECTION_SQUARE_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalProjectionSquareAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalProjectionSquareProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalProjectionFrontierBoundaryTheorem, "PNP.DirectWire.TerminalGovernedFrontier.project_boundary");
  assert.equal(release.earnedBoundary.residualTerminalSquareProjectionCompatibleTheorem, "PNP.DirectWire.TerminalSaturatedSupportSquare.governed_projection_compatible");
  assert.equal(release.earnedBoundary.residualTerminalSideTightMinimumArithmeticFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSideTightSignedSlackIdentityFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSideTightFailClosedGateFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSideTightCanonicalFullBasisFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSideTightCanonicalQuotientBasisFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSideTightMinimumAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalSideTightMinimumAuditedDeclarationCount, 43);
  assert.equal(release.earnedBoundary.residualTerminalSideTightMinimumEmptyAxiomDeclarationCount, 19);
  assert.equal(release.earnedBoundary.residualTerminalSideTightMinimumPropextOnlyDeclarationCount, 17);
  assert.equal(release.earnedBoundary.residualTerminalSideTightMinimumPropextQuotSoundDeclarationCount, 7);
  assert.equal(release.earnedBoundary.residualTerminalSideTightMinimumScope, "all-finite-terminal-projection-four-corner-families-and-independently-attained-full-and-quotient-minimum-bases");
  assert.deepEqual(release.earnedBoundary.residualTerminalSideTightMinimumTheoremKernelTypeSha256, RESIDUAL_TERMINAL_SIDE_TIGHT_MINIMUM_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalSideTightMinimumAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalSideTightMinimumProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalSideTightIdentityTheorem, "PNP.DirectWire.TerminalFourCornerSizes.incidenceValue_eq_minimum_add_slacks");
  assert.equal(release.earnedBoundary.residualTerminalSideTightFullBasisTheorem, "PNP.DirectWire.TerminalFullFourCornerBasis.incidenceValue_eq_fullDelta_add_slacks");
  assert.equal(release.earnedBoundary.residualTerminalSideTightQuotientBasisTheorem, "PNP.DirectWire.TerminalQuotientFourCornerBasis.incidenceValue_eq_quotientDelta_add_slacks");
  assert.equal(release.earnedBoundary.residualTerminalSideTightFailClosedSoundnessTheorem, "PNP.DirectWire.TerminalFourCornerSizes.tightValue?_sound");
  assert.equal(release.earnedBoundary.residualTerminalSideTightFailClosedCompletenessTheorem, "PNP.DirectWire.TerminalFourCornerSizes.tightValue?_complete");
  assert.equal(release.earnedBoundary.residualTerminalSideTightCanonicalValuesTheorem, "PNP.DirectWire.TerminalProjectionFourCorners.canonical_numericallySideTight_values");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierTransportFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierExactEndpointsFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierInjectiveCoordinatesFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierProfileTransportFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierFailClosedPhysicalTransportFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierAuditedDeclarationCount, 38);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierEmptyAxiomDeclarationCount, 5);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierPropextOnlyDeclarationCount, 12);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierPropextQuotSoundDeclarationCount, 21);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierScope, "all-finite-computed-saturated-terminal-support-squares-and-canonical-physical-profile-transport-coordinates");
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerCarrierTheoremKernelTypeSha256, RESIDUAL_TERMINAL_FOUR_CORNER_CARRIER_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerCarrierAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerCarrierProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierBoundaryQueryTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.boundaryDisposition?_eq_some_iff");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierInterfaceQueryTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.interfaceDisposition?_eq_some_iff");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierExactBoundaryTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.extracted_boundary");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierExactInterfaceTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.extracted_interface");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierMeetProfileTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.meet_profile_transport");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierSideProfileTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.side_profile_transport");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierJoinProfileTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.join_profile_transport");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierProjectionCompatibleTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.projection_compatible");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCarrierCompleteTransportTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.complete_transport");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaCarrierCompatibleFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaFaithfulAmbientizationFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaReferenceMinimumPreservedFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaLocalizedMinimaFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaSharedObserverProjectionFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaAuditedDeclarationCount, 57);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaEmptyAxiomDeclarationCount, 13);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaPropextOnlyDeclarationCount, 5);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaPropextQuotSoundDeclarationCount, 39);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaCarrierScope, "all-finite-computed-saturated-terminal-support-squares-one-reversible-ambient-carrier-and-shared-observer-projection");
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerOptimaTheoremKernelTypeSha256, RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMA_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerOptimaAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerOptimaProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaAmbientRoundTripTheorem, "PNP.DirectWire.TerminalSupportWire.ambientIndex_terminalSupportWireAt");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaAmbientInjectiveTheorem, "PNP.DirectWire.TerminalSupportWire.ambientIndex_injective");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaBoundaryQueryTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.boundaryIndex?_eq_some_iff");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaInterfaceQueryTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.interfaceIndex?_eq_some_iff");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaAmbientizePresentTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.ambientizeCandidate_semantics_present");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaAmbientizeAbsentTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.ambientizeCandidate_semantics_absent");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaLocalizeRoundTripTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.localize_ambientize_semantics");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaReferenceMinimumTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.ambient_referenceMinimum_eq_corner");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaSharedProjectionTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.optimizationCorners_projection");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaLocalizedGateCountTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.localizeRealization_gateCount");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimaCompatibilityTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.fourCornerOptimaCarrierCompatible");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumCoherenceClassifierFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumFirstFailureFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumRetainedSemanticsFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumProfileTransportFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumModeFirewallFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumSideTightTupleFactsFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumCoherenceAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumCoherenceAuditedDeclarationCount, 37);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumCoherenceEmptyAxiomDeclarationCount, 12);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumCoherencePropextOnlyDeclarationCount, 3);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumCoherencePropextQuotSoundDeclarationCount, 22);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumCoherenceScope, "all-finite-computed-terminal-support-squares-observers-projections-and-full-or-quotient-modes-coherent-tuple-or-deterministic-first-failure");
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerOptimumCoherenceTheoremKernelTypeSha256, RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMUM_COHERENCE_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerOptimumCoherenceAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerOptimumCoherenceProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumCoherenceClassifierTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.fourCornerOptimumCoherenceDichotomy");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumFirstFailureTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumCoherenceFailure?_sound");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumRetainedSemanticsTheorem, "PNP.DirectWire.TerminalOptimumLegTransport.retained_or_internalized");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumProfileTransportTheorem, "PNP.DirectWire.TerminalOptimumLegTransport.profileTransport");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumModeFirewallTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumModeMismatch?_sound");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumSideTightTupleFactsTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.noFailure_iff_coherentOptimumTuple");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumLocalRouteClassifierFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumRouteSoundnessFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumRouteSilenceFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumSideTightCompletionUnderRouteSilenceFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumExactCompletionValuesFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumPromotionFirewallRetained, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerSideTightCompletionAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerSideTightCompletionAuditedDeclarationCount, 28);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerSideTightCompletionEmptyAxiomDeclarationCount, 2);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerSideTightCompletionPropextOnlyDeclarationCount, 2);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerSideTightCompletionPropextQuotSoundDeclarationCount, 24);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerSideTightCompletionScope, "all-finite-computed-terminal-support-squares-observers-and-full-or-quotient-modes-side-tight-coherent-completion-under-exact-local-route-silence");
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerSideTightCompletionTheoremKernelTypeSha256, RESIDUAL_TERMINAL_FOUR_CORNER_SIDE_TIGHT_COMPLETION_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerSideTightCompletionAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerSideTightCompletionProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalCoherentFourCornerBasisFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalCoherentFourCornerBasisScope, "conditional-on-exact-mode-appropriate-local-route-silence-not-universal-bn2-square-legitimacy");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumRouteCoherenceTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumRoute?_coherence");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumRoutePromotionTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumRoute?_quotientPromotion");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumRoutedFailureSoundnessTheorem, "PNP.DirectWire.TerminalFourCornerOptimumRoutedFailure.sound");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumCombinedRouteSoundnessTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumRoute?_sound");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumRouteOrCompletionTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionOrFirstRoute");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumRouteExclusionTheorem, "PNP.DirectWire.TerminalFourCornerOptimumRoutedFailure.excludesCoherentOptimum");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumCompletionTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionExists");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumCompletionEachModeTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionExistsEachMode");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumFullValueTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletion_fullValue");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerOptimumQuotientValueTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletion_quotientValue");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerArbitraryFamilyCoherenceFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisFamilyComplete, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerSignedTightBasisMaximumFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumEqualsDeltaFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumAuditedDeclarationCount, 45);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumEmptyAxiomDeclarationCount, 12);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumPropextOnlyDeclarationCount, 5);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumPropextQuotSoundDeclarationCount, 28);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumScope, RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumTheoremKernelTypeSha256, RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalFourCornerMinimumAtBoundTheorem, "PNP.DirectWire.TerminalOptimumCoherenceMode.minimumAt_le_current");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerMinimumFamilyCompletenessTheorem, "PNP.DirectWire.TerminalProjectionFourCorners.mem_minimumImplementationsAt_iff");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisFamilyCompletenessTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.mem_tightBasisFamily_iff");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerCanonicalTightBasisMemberTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.canonicalImplementationBasis_mem_tightFamily");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisValuesTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.mem_tightBasisValues_eq_delta");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_eq_delta");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumFullTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_full");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerTightBasisMaximumQuotientTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_quotient");
  assert.equal(release.earnedBoundary.residualTerminalFourCornerArbitraryFamilyCoherenceTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.firstBasisCoherenceFailure?_sound");

  assert.equal(release.earnedBoundary.residualTerminalSquareLegitimacyFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSquareStructuralCompatibilityFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSquareFrontierPushoutFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSquareSharedQuantityCarrierFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSquareLocalConclusionUnderRouteSilenceFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSquareFailClosedRouteDichotomyFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSquareLegitimacyAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalSquareLegitimacyAuditedDeclarationCount, 15);
  assert.equal(release.earnedBoundary.residualTerminalSquareLegitimacyEmptyAxiomDeclarationCount, 0);
  assert.equal(release.earnedBoundary.residualTerminalSquareLegitimacyPropextOnlyDeclarationCount, 0);
  assert.equal(release.earnedBoundary.residualTerminalSquareLegitimacyPropextQuotSoundDeclarationCount, 15);
  assert.equal(release.earnedBoundary.residualTerminalSquareLegitimacyScope, RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalSquareLegitimacyTheoremKernelTypeSha256, RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalSquareLegitimacyAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalSquareLegitimacyProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalSquareLegitimacyTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.computedBN2SquareLegitimate");
  assert.equal(release.earnedBoundary.residualTerminalSquareLocalConclusionTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.computedBN2LocalConclusion");
  assert.equal(release.earnedBoundary.residualTerminalSquareLocalConclusionOrFirstRouteTheorem, "PNP.DirectWire.TerminalFourCornerCarrier.computedBN2LocalConclusionOrFirstRoute");
  assert.equal(release.earnedBoundary.residualTerminalSquareFrontierPushoutTheorem, "PNP.DirectWire.TerminalSaturatedSupportSquare.governed_frontier_pushout");

  assert.equal(release.earnedBoundary.residualTerminalComputedBCELAnchorNucleusFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalBCELMinimumPositiveNucleusFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalBCELAnchorAlgebraFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalBCELCutDefectFirewallFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalBCELCutRouteDichotomyFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalBCELConstantCutConclusionFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalBCELAnchorNucleusAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalBCELAnchorNucleusAuditedDeclarationCount, 79);
  assert.equal(release.earnedBoundary.residualTerminalBCELAnchorNucleusEmptyAxiomDeclarationCount, 7);
  assert.equal(release.earnedBoundary.residualTerminalBCELAnchorNucleusPropextOnlyDeclarationCount, 8);
  assert.equal(release.earnedBoundary.residualTerminalBCELAnchorNucleusPropextQuotSoundDeclarationCount, 64);
  assert.equal(release.earnedBoundary.residualTerminalBCELAnchorNucleusScope, RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalBCELAnchorNucleusTheoremKernelTypeSha256, RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalBCELAnchorNucleusAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalBCELAnchorNucleusProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalBCELAnchorNucleusSearchTheorem, "PNP.DirectWire.findTerminalPositiveAnchorNucleus_sound");
  assert.equal(release.earnedBoundary.residualTerminalBCELAnchorNucleusUniquenessTheorem, "PNP.DirectWire.findTerminalPositiveAnchorNucleus_unique");
  assert.equal(release.earnedBoundary.residualTerminalBCELAnchorAlgebraFirstMismatchTheorem, "PNP.DirectWire.firstTerminalBCELAnchorAlgebraMismatch?_sound");
  assert.equal(release.earnedBoundary.residualTerminalBCELCutDefectFirstMismatchTheorem, "PNP.DirectWire.firstTerminalBCELCutDefectMismatch?_sound");
  assert.equal(release.earnedBoundary.residualTerminalBCELCutRouteFirstFailureTheorem, "PNP.DirectWire.firstTerminalBCELCutRoute?_sound");
  assert.equal(release.earnedBoundary.residualTerminalBCELCutNoFailureConclusionTheorem, "PNP.DirectWire.computedBCELCutConclusionOfNoFailures");
  assert.equal(release.earnedBoundary.residualTerminalBCELAnchorNucleusClassifierTheorem, "PNP.DirectWire.classifyTerminalBCELAnchorNucleus_exhaustive");
  assert.equal(release.earnedBoundary.residualTerminalBCELAnchorSizeTheorem, "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.anchorSizeAtLeastTwo");
  assert.equal(release.earnedBoundary.residualTerminalBCELConstantCutTheorem, "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.properCutConstantEquation");
  assert.equal(release.earnedBoundary.residualTerminalBCELLocalConclusionTheorem, "PNP.DirectWire.TerminalComputedBCELAnchorNucleus.properCutLocalConclusion");

  assert.equal(release.earnedBoundary.residualTerminalSaturationPositivityFirewallFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSaturationPositivityFirewallAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalSaturationPositivityFirewallAuditedDeclarationCount, 20);
  assert.equal(release.earnedBoundary.residualTerminalSaturationPositivityFirewallEmptyAxiomDeclarationCount, 1);
  assert.equal(release.earnedBoundary.residualTerminalSaturationPositivityFirewallPropextOnlyDeclarationCount, 4);
  assert.equal(release.earnedBoundary.residualTerminalSaturationPositivityFirewallPropextQuotSoundDeclarationCount, 15);
  assert.equal(release.earnedBoundary.residualTerminalSaturationPositivityFirewallScope, RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalSaturationPositivityFirewallTheoremKernelTypeSha256, RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalSaturationPositivityFirewallAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalSaturationPositivityFirewallProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalSaturationPositivityFirewallWholeDefectTheorem, "PNP.DirectWire.TerminalBCELAnchorProblem.wholeCorners_projectionDefect");
  assert.equal(release.earnedBoundary.residualTerminalSaturationPositivityFirewallZeroBranchTheorem, "PNP.DirectWire.classifyTerminalSaturationPositivity_loss_of_zero");
  assert.equal(release.earnedBoundary.residualTerminalSaturationPositivityFirewallPositiveBranchTheorem, "PNP.DirectWire.classifyTerminalSaturationPositivity_bcel_of_positive");
  assert.equal(release.earnedBoundary.residualTerminalSaturationPositivityFirewallNoCheckedLiftTheorem, "PNP.DirectWire.terminalSaturationPositivity_no_checkedFullLiftAtMinimum");
  assert.equal(release.earnedBoundary.residualTerminalSaturationPositivityFirewallClassifierTheorem, "PNP.DirectWire.classifyTerminalSaturationPositivity_exhaustive");

  assert.equal(release.earnedBoundary.residualTerminalCandidateSaturationFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalanceFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFirstNontransparentStepFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalanceAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalanceAuditedDeclarationCount, 53);
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalanceEmptyAxiomDeclarationCount, 10);
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalancePropextOnlyDeclarationCount, 6);
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalancePropextQuotSoundDeclarationCount, 37);
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalanceScope, RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalSaturationCostBalanceTheoremKernelTypeSha256, RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalSaturationCostBalanceAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalSaturationCostBalanceProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalCandidateSaturationTraceLinkedTheorem, "PNP.DirectWire.terminalSaturateTrace_eventsLinked");
  assert.equal(release.earnedBoundary.residualTerminalCandidateSaturationTraceRecordsTheorem, "PNP.DirectWire.terminalSaturateTrace_records");
  assert.equal(release.earnedBoundary.residualTerminalCandidateSaturationProfileSystemTheorem, "PNP.DirectWire.terminalCandidateSaturationSystem_profileSystem");
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalanceUniqueOwnerTheorem, "PNP.DirectWire.TerminalTransparentSaturationStep.uniqueMaterializerOwner");
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalanceSupportCostTheorem, "PNP.DirectWire.TerminalTransparentSaturationStep.supportCostBalanced");
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalanceFullCostTheorem, "PNP.DirectWire.TerminalTransparentSaturationStep.fullCostBalanced");
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalanceQuotientCostTheorem, "PNP.DirectWire.TerminalTransparentSaturationStep.quotientCostBounded");
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalanceHistorySlackTheorem, "PNP.DirectWire.TerminalSaturationEventsLinked.fullSlack_preserved");
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalanceHistoryDefectTheorem, "PNP.DirectWire.TerminalSaturationEventsLinked.projectionDefect_mono");
  assert.equal(release.earnedBoundary.residualTerminalSaturationCostBalanceOutcomeTheorem, "PNP.DirectWire.TerminalSaturationBalanceOutcome.balanced_event");

  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureRoutingFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFiniteInterfaceExposureRoutesToEFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureZeroCostRetractFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFirstInterfaceExposureRouteFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureRoutingAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureRoutingAuditedDeclarationCount, 28);
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureRoutingEmptyAxiomDeclarationCount, 2);
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureRoutingPropextOnlyDeclarationCount, 1);
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureRoutingPropextQuotSoundDeclarationCount, 25);
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureRoutingScope, RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalInterfaceExposureRoutingTheoremKernelTypeSha256, RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalInterfaceExposureRoutingAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalInterfaceExposureRoutingProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureCoordinateSoundTheorem, "PNP.DirectWire.terminalInterfaceExposureCoordinate?_sound");
  assert.equal(release.earnedBoundary.residualTerminalCandidateInterfaceExposureShapeTheorem, "PNP.DirectWire.terminalCandidateInterfaceExposureCoordinate?_shape");
  assert.equal(release.earnedBoundary.residualTerminalCandidateInterfaceExposureEdgeTheorem, "PNP.DirectWire.terminalCandidateInterfaceExposureCoordinate?_edge");
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureOutgoingZeroCostTheorem, "PNP.DirectWire.terminalInterfaceOutgoingCoordinate_eventCost_zero");
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureERouteSoundTheorem, "PNP.DirectWire.TerminalInterfaceExposureERoute.sound");
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureRetractCostTheorem, "PNP.DirectWire.TerminalInterfaceExposureZeroCostRetract.eventCost_zero");
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureRetractSlackTheorem, "PNP.DirectWire.TerminalInterfaceExposureZeroCostRetract.fullSlack_preserved");
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureDichotomyTheorem, "PNP.DirectWire.terminalInterfaceExposure_transparent_or_eRoute");
  assert.equal(release.earnedBoundary.residualTerminalFirstInterfaceExposureRouteTheorem, "PNP.DirectWire.TerminalFirstInterfaceExposureRoute.sound");
  assert.equal(release.earnedBoundary.residualTerminalInterfaceExposureClassifierTheorem, "PNP.DirectWire.classifyTerminalSaturationInterfaceRouting_exhaustive");

  assert.equal(release.earnedBoundary.residualTerminalOriginKernelObligationRoutingFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFiniteOriginKernelObligationClosureRoutedFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFirstOriginKernelObligationRouteFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalOriginKernelObligationRoutingAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalOriginKernelObligationRoutingScope, RESIDUAL_TERMINAL_ORIGIN_KERNEL_OBLIGATION_ROUTING_SCOPE);
  assert.equal(release.earnedBoundary.residualTerminalFiniteSaturatePositiveCompositionFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalFiniteSaturatePositiveCompositionAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalFiniteSaturatePositiveCompositionAuditedDeclarationCount, 37);
  assert.equal(release.earnedBoundary.residualTerminalFiniteSaturatePositiveCompositionEmptyAxiomDeclarationCount, 7);
  assert.equal(release.earnedBoundary.residualTerminalFiniteSaturatePositiveCompositionPropextOnlyDeclarationCount, 1);
  assert.equal(release.earnedBoundary.residualTerminalFiniteSaturatePositiveCompositionPropextQuotSoundDeclarationCount, 29);
  assert.equal(release.earnedBoundary.residualTerminalFiniteSaturatePositiveCompositionScope, RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalFiniteSaturatePositiveCompositionTheoremKernelTypeSha256, RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalFiniteSaturatePositiveCompositionAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalFiniteSaturatePositiveCompositionProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalOriginKernelCoordinateSoundTheorem, "PNP.DirectWire.terminalOriginKernelObligationCoordinate?_sound");
  assert.equal(release.earnedBoundary.residualTerminalCandidateOriginKernelCoordinateShapeTheorem, "PNP.DirectWire.terminalCandidateOriginKernelObligationCoordinate?_shape");
  assert.equal(release.earnedBoundary.residualTerminalCandidateOriginKernelCoordinateEdgeTheorem, "PNP.DirectWire.terminalCandidateOriginKernelObligationCoordinate?_edge");
  assert.equal(release.earnedBoundary.residualTerminalOriginKernelRouteSoundTheorem, "PNP.DirectWire.TerminalOriginKernelObligationClosureRoute.sound");
  assert.equal(release.earnedBoundary.residualTerminalOriginKernelSafeOrRouteTheorem, "PNP.DirectWire.terminalOriginKernelObligation_safe_or_route");
  assert.equal(release.earnedBoundary.residualTerminalClosureSafeTransparentTheorem, "PNP.DirectWire.TerminalSaturationClosureSafeStep.transparent");
  assert.equal(release.earnedBoundary.residualTerminalClosureRoutingClassifierTheorem, "PNP.DirectWire.classifyTerminalSaturationClosureRouting_exhaustive");
  assert.equal(release.earnedBoundary.residualTerminalFiniteSaturatePositiveOutcomeSoundTheorem, "PNP.DirectWire.TerminalFiniteSaturatePositiveOutcome.sound");
  assert.equal(release.earnedBoundary.residualTerminalFiniteSaturatePositiveClassifierTheorem, "PNP.DirectWire.classifyTerminalFiniteSaturatePositive_exhaustive");

  assert.equal(release.earnedBoundary.residualTerminalRankWFFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalRankWFAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalRankWFAuditedDeclarationCount, 39);
  assert.equal(release.earnedBoundary.residualTerminalRankWFEmptyAxiomDeclarationCount, 37);
  assert.equal(release.earnedBoundary.residualTerminalRankWFPropextOnlyDeclarationCount, 2);
  assert.equal(release.earnedBoundary.residualTerminalRankWFPropextQuotSoundDeclarationCount, 0);
  assert.equal(release.earnedBoundary.residualTerminalRankWFScope, RESIDUAL_TERMINAL_RANK_WF_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalRankWFTheoremKernelTypeSha256, RESIDUAL_TERMINAL_RANK_WF_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalRankWFAxiomClosure, ["propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalRankWFProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalRankWFCoordinatesTheorem, "PNP.DirectWire.TerminalResidualRank.coordinates_mk");
  assert.equal(release.earnedBoundary.residualTerminalRankWFBooleanEquivalenceTheorem, "PNP.DirectWire.terminalResidualRankLTBool_eq_true_iff");
  assert.equal(release.earnedBoundary.residualTerminalRankWFWellFoundedTheorem, "PNP.DirectWire.terminalResidualRankLexLT_wellFounded");
  assert.equal(release.earnedBoundary.residualTerminalRankWFInductionTheorem, "PNP.DirectWire.terminalResidualRank_induction");
  assert.equal(release.earnedBoundary.residualTerminalRankWFDescentSoundTheorem, "PNP.DirectWire.TerminalResidualRankDescent.sound");

  assert.equal(release.earnedBoundary.residualTerminalBN3RequestEnvelopeFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalBN3RequestEnvelopeAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalBN3RequestEnvelopeAuditedDeclarationCount, 84);
  assert.equal(release.earnedBoundary.residualTerminalBN3RequestEnvelopeEmptyAxiomDeclarationCount, 8);
  assert.equal(release.earnedBoundary.residualTerminalBN3RequestEnvelopePropextOnlyDeclarationCount, 3);
  assert.equal(release.earnedBoundary.residualTerminalBN3RequestEnvelopePropextQuotSoundDeclarationCount, 73);
  assert.equal(release.earnedBoundary.residualTerminalBN3RequestEnvelopeScope, RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalBN3RequestEnvelopeTheoremKernelTypeSha256, RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalBN3RequestEnvelopeAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalBN3RequestEnvelopeProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalBN3RequestEnvelopeClassifierTheorem, "PNP.DirectWire.classifyTerminalBN3RequestEnvelope_exhaustive");

  assert.equal(release.earnedBoundary.residualTerminalBN4ActivationCancellationFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalBN4ActivationCancellationAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalBN4ActivationCancellationAuditedDeclarationCount, 33);
  assert.equal(release.earnedBoundary.residualTerminalBN4ActivationCancellationEmptyAxiomDeclarationCount, 11);
  assert.equal(release.earnedBoundary.residualTerminalBN4ActivationCancellationPropextOnlyDeclarationCount, 6);
  assert.equal(release.earnedBoundary.residualTerminalBN4ActivationCancellationPropextQuotSoundDeclarationCount, 16);
  assert.equal(release.earnedBoundary.residualTerminalBN4ActivationCancellationScope, RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalBN4ActivationCancellationTheoremKernelTypeSha256, RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalBN4ActivationCancellationAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalBN4ActivationCancellationProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalBN4ActivationCancellationClassifierTheorem, "PNP.DirectWire.classifyTerminalBN4ActivationCancellation_exhaustive");

  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationAuditedDeclarationCount, 40);
  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationEmptyAxiomDeclarationCount, 23);
  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationPropextOnlyDeclarationCount, 11);
  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationPropextQuotSoundDeclarationCount, 6);
  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationScope, RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationTheoremKernelTypeSha256, RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationCoordinateTheorem, "PNP.DirectWire.terminalBN5ShadowCoordinate_eq_iff");
  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationFullUnitsTheorem, "PNP.DirectWire.terminalBN5FullUnits_key_eq");
  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationHallDeficitTheorem, "PNP.DirectWire.TerminalBN5HallDeficit.neighbor_card_lt_full_card");
  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationMatchingClassifierTheorem, "PNP.DirectWire.classifyTerminalBN5ShadowMatching_exhaustive");
  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationActiveTheorem, "PNP.DirectWire.classifyTerminalBN5FullShadowLocalization_active");
  assert.equal(release.earnedBoundary.residualTerminalBN5FullShadowLocalizationClassifierTheorem, "PNP.DirectWire.classifyTerminalBN5FullShadowLocalization_exhaustive");

  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersAuditedDeclarationCount, 27);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersEmptyAxiomDeclarationCount, 11);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersPropextOnlyDeclarationCount, 6);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersPropextQuotSoundDeclarationCount, 10);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersScope, RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersPairNeedsRestorationTheorem, "PNP.DirectWire.terminalPkgCPairNeedsRestoration_eq_true_iff");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersFirstPairSoundTheorem, "PNP.DirectWire.firstTerminalPkgCSeparatingPair?_sound");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersFirstPairNoneIffTheorem, "PNP.DirectWire.firstTerminalPkgCSeparatingPair?_eq_none_iff");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersQuotientUnitsLengthTheorem, "PNP.DirectWire.TerminalPkgCSeparatingPair.quotientUnits_length");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersQuotientUnitsNonemptyTheorem, "PNP.DirectWire.TerminalPkgCSeparatingPair.quotientUnits_nonempty");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersRestorationEdgeTheorem, "PNP.DirectWire.terminalPkgC_restorationEdge_preservesCoordinate");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersRestorationNotSilentTheorem, "PNP.DirectWire.TerminalBN5HallDeficit.pkgCRestorationNotSilent");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersDichotomyTheorem, "PNP.DirectWire.terminalPkgC_separatingConsumers_restorationDichotomy");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSeparatingConsumersClassifierTheorem, "PNP.DirectWire.classifyTerminalPkgCSeparatingConsumers_exhaustive");

  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationAuditedDeclarationCount, 17);
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationEmptyAxiomDeclarationCount, 7);
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationPropextOnlyDeclarationCount, 3);
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationPropextQuotSoundDeclarationCount, 7);
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationScope, RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCTypedRestorationTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCTypedRestorationAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCTypedRestorationProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationFullCandidatesLengthTheorem, "PNP.DirectWire.TerminalPkgCSeparatingPair.fullRestorationCandidates_length");
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationFullCandidatesCoordinatesTheorem, "PNP.DirectWire.TerminalPkgCSeparatingPair.fullRestorationCandidates_coordinates");
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationCoordinateUniverseTheorem, "PNP.DirectWire.TerminalPkgCTypedRestorer.coordinateUniverse_coordinates");
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationFullMultiplicityTheorem, "PNP.DirectWire.terminalBN5FullMultiplicity_indexed_eq");
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationShadowMultiplicityTheorem, "PNP.DirectWire.terminalBN5ShadowMultiplicity_indexed_eq");
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationExactCoverageTheorem, "PNP.DirectWire.TerminalPkgCSeparatingPair.typedRestoration_exactCoverage");
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationNoHallDeficitTheorem, "PNP.DirectWire.terminalBN5CompleteMultiplicityMatching_not_hallDeficit");
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationRealizationTheorem, "PNP.DirectWire.terminalPkgC_typedRestoration_realization");
  assert.equal(release.earnedBoundary.residualTerminalPkgCTypedRestorationClassifierTheorem, "PNP.DirectWire.classifyTerminalPkgCTypedRestoration_exhaustive");

  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationAuditedDeclarationCount, 21);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationEmptyAxiomDeclarationCount, 4);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationPropextOnlyDeclarationCount, 5);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationPropextQuotSoundDeclarationCount, 12);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationScope, RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationAtomKeyTheorem, "PNP.DirectWire.terminalPkgCRestorationCancellationCellsForAtom_key_eq");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationAtomBalancedTheorem, "PNP.DirectWire.terminalPkgCRestorationCancellationCellsForAtom_balanced");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationAtomsLengthTheorem, "PNP.DirectWire.terminalPkgCRestorationCancellationCellsForAtoms_length");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationAtomsBalancedTheorem, "PNP.DirectWire.terminalPkgCRestorationCancellationCellsForAtoms_balanced");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationPairCellsLengthTheorem, "PNP.DirectWire.TerminalPkgCSeparatingPair.restorationCancellationCells_length");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationPairBalancedTheorem, "PNP.DirectWire.TerminalPkgCSeparatingPair.restorationCancellation_balanced");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationResidualCellsEmptyTheorem, "PNP.DirectWire.TerminalPkgCSeparatingPair.restorationCancellation_residualCells_empty");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationSignedMassZeroTheorem, "PNP.DirectWire.TerminalPkgCSeparatingPair.restorationCancellation_signedMass_zero");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationRealizationTheorem, "PNP.DirectWire.terminalPkgC_typedRestoration_sameKeyCancellation");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationSilenceSingletonizesTheorem, "PNP.DirectWire.terminalPkgC_sameKeyCancellation_silence_singletonizes");
  assert.equal(release.earnedBoundary.residualTerminalPkgCSameKeyCancellationClassifierTheorem, "PNP.DirectWire.classifyTerminalPkgCSameKeyCancellation_exhaustive");

  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerAuditedDeclarationCount, 17);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerEmptyAxiomDeclarationCount, 4);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerPropextOnlyDeclarationCount, 5);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerPropextQuotSoundDeclarationCount, 8);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerScope, RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerPositiveMassPermutationTheorem, "PNP.DirectWire.terminalBN4PositiveMass_perm");
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerNegativeMassPermutationTheorem, "PNP.DirectWire.terminalBN4NegativeMass_perm");
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerGeneratedCellMembershipTheorem, "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.generatedCell_mem_ambient");
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerMultiplicityTheorem, "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.cellMultiplicity");
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerLengthTheorem, "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.length_eq");
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerPositiveMassDecompositionTheorem, "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.positiveMass_decomposition");
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerNegativeMassDecompositionTheorem, "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.negativeMass_decomposition");
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerSignedMassRemainderTheorem, "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.signedMass_eq_remainder");
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerResidualContributionRemainderTheorem, "PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.residualSignedContribution_eq_remainder");
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerClassifierTheorem, "PNP.DirectWire.classifyTerminalPkgCAmbientBN4LedgerBinding_exhaustive");
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerCanonicalAtomTheorem, "PNP.DirectWire.TerminalPkgCComputedAmbientBN4Cancellation.generatedCell_usesCanonicalAtom");
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4LedgerSilenceSingletonizesTheorem, "PNP.DirectWire.terminalPkgC_computedAmbientBN4_silence_singletonizes");

  const status = json("public/pnp-status.json");
  const residualReduction = status.formalPublicationMilestones.find(
    (row) => row.id === RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_RESIDUAL_REDUCTION_ID
  );
  const residualReductionHashes = Object.fromEntries(
    residualReduction.theoremRows.map((row) => [row.name, row.actualKernelTypeSha256])
  );
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4ResidualReductionFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4ResidualReductionAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4ResidualReductionAuditedDeclarationCount, 13);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4ResidualReductionEmptyAxiomDeclarationCount, 0);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4ResidualReductionPropextOnlyDeclarationCount, 0);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4ResidualReductionPropextQuotSoundDeclarationCount, 13);
  assert.equal(release.earnedBoundary.residualTerminalPkgCAmbientBN4ResidualReductionScope, RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_RESIDUAL_REDUCTION_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCAmbientBN4ResidualReductionTheoremKernelTypeSha256, residualReductionHashes);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCAmbientBN4ResidualReductionAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalPkgCAmbientBN4ResidualReductionProjectAxiomClosure, []);
  const residualReductionIdentityFields = [
    "residualTerminalPkgCAmbientBN4ResidualReductionCellAdditionTheorem",
    "residualTerminalPkgCAmbientBN4ResidualReductionResidualCellsTheorem",
    "residualTerminalPkgCAmbientBN4ResidualReductionLedgerOverTheorem",
    "residualTerminalPkgCAmbientBN4ResidualReductionRemainderKeyCoverageTheorem",
    "residualTerminalPkgCAmbientBN4ResidualReductionCanonicalLedgerTheorem",
    "residualTerminalPkgCAmbientBN4ResidualReductionEmptyRemainderTheorem",
    "residualTerminalPkgCAmbientBN4ResidualReductionClassifierTheorem",
    "residualTerminalPkgCAmbientBN4ResidualReductionComputedBridgeTheorem"
  ];
  assert.deepEqual(
    residualReductionIdentityFields.map((field) => release.earnedBoundary[field]),
    residualReduction.requiredTheorems
  );

  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormAuditedDeclarationCount, 28);
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormEmptyAxiomDeclarationCount, 11);
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormPropextOnlyDeclarationCount, 9);
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormPropextQuotSoundDeclarationCount, 8);
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormScope, RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormTheoremKernelTypeSha256, RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormRequestMonotoneTheorem, "PNP.DirectWire.TerminalV54ConsumerSystem.requestActive_monotone");
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormEmptyFalseTheorem, "PNP.DirectWire.TerminalV54ConsumerSystem.requestActive_empty_false");
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormMinimalConsumerTheorem, "PNP.DirectWire.TerminalV54ConsumerSystem.consumer_is_minimal");
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormDisjointConsumerTheorem, "PNP.DirectWire.TerminalV54ConsumerSystem.cutActive_has_disjoint_consumers");
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormNonzeroIffTheorem, "PNP.DirectWire.terminalV54_cutActivation_nonzero_iff_disjoint_consumers");
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormIffTheorem, "PNP.DirectWire.terminalV54_consumerAntichain_normal_form_iff");
  assert.equal(release.earnedBoundary.residualTerminalV54ConsumerAntichainNormalFormTheorem, "PNP.DirectWire.terminalV54_consumerAntichain_normal_form");

  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityAuditedDeclarationCount, 58);
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityEmptyAxiomDeclarationCount, 9);
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityPropextOnlyDeclarationCount, 18);
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityPropextQuotSoundDeclarationCount, 31);
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityScope, RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityTheoremKernelTypeSha256, RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityCellPartitionTheorem, "PNP.DirectWire.TerminalV53Hypergraph.cell_partition");
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityCutPartitionTheorem, "PNP.DirectWire.TerminalV53Hypergraph.cut_partition");
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityPairComplementIdentityTheorem, "PNP.DirectWire.TerminalV53Hypergraph.pair_complement_identity");
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigiditySharedPairWeightsTheorem, "PNP.DirectWire.TerminalV53Hypergraph.pairWeights_equal_of_shared");
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityFourAnchorPairWeightZeroTheorem, "PNP.DirectWire.TerminalV53Hypergraph.pairWeight_eq_zero_of_four");
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityFourAnchorProperFootprintZeroTheorem, "PNP.DirectWire.TerminalV53Hypergraph.properFootprintWeight_eq_zero_of_four");
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityTwoAnchorFullWeightTheorem, "PNP.DirectWire.TerminalV53Hypergraph.twoAnchor_fullWeight");
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityThreeAnchorRigidityTheorem, "PNP.DirectWire.TerminalV53Hypergraph.threeAnchor_rigidity");
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityFourAnchorRigidityTheorem, "PNP.DirectWire.TerminalV53Hypergraph.fourAnchor_rigidity");
  assert.equal(release.earnedBoundary.residualTerminalV53ConstantCutHypergraphRigidityTheorem, "PNP.DirectWire.terminalV53_constantCut_hypergraph_rigidity");

  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketAuditedDeclarationCount, 21);
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketEmptyAxiomDeclarationCount, 4);
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketPropextOnlyDeclarationCount, 6);
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketPropextQuotSoundDeclarationCount, 11);
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketScope, RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalBN6HypergraphPacketTheoremKernelTypeSha256, RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalBN6HypergraphPacketAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalBN6HypergraphPacketProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketMassPositiveTheorem, "PNP.DirectWire.TerminalBN6GroupedCell.massPositive");
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketCrossesFootprintTheorem, "PNP.DirectWire.TerminalBN6GroupedCell.crosses_iff_footprintCrosses");
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketCrossesActivationTheorem, "PNP.DirectWire.TerminalBN6GroupedCell.crossesBool_eq_cutActivationBool");
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketCutWeightTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.cutWeight_eq_activationWeight");
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketConstantCutsTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.constantProperCuts");
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketGroupedMassTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.footprintWeight_eq_groupedMass");
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketPayloadWitnessTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.hasPayloadAt_of_footprintWeight_positive");
  assert.equal(release.earnedBoundary.residualTerminalBN6HypergraphPacketTheorem, "PNP.DirectWire.terminalBN6_hypergraph_packet");

  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorSeedsFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorSeedsAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorSeedsAuditedDeclarationCount, 5);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorSeedsEmptyAxiomDeclarationCount, 0);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorSeedsPropextOnlyDeclarationCount, 2);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorSeedsPropextQuotSoundDeclarationCount, 3);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorSeedsScope, RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorSeedsTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorSeedsAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorSeedsProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorSeedsPayloadTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.hasPacketSelectorSeedAt_of_hasPayloadAt");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorSeedsConclusionTheorem, "PNP.DirectWire.TerminalBN6PacketConclusion.selectorSeeds");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorSeedsTheorem, "PNP.DirectWire.terminalBN6_packet_selector_seeds");

  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniverseFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniverseAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniverseAuditedDeclarationCount, 9);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniverseEmptyAxiomDeclarationCount, 0);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniversePropextOnlyDeclarationCount, 3);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniversePropextQuotSoundDeclarationCount, 6);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniverseScope, RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorUniverseTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorUniverseAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorUniverseProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniverseNodupTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.packetPayloadSelectorUniverse_nodup");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniverseMembershipTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.mem_packetPayloadSelectorUniverse_iff");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniverseSeedUpgradeTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.hasPacketPayloadSelectorAt_of_seed");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniverseSeedConclusionTheorem, "PNP.DirectWire.TerminalPacketSelectorSeedConclusion.payloadSelectors");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniversePacketConclusionTheorem, "PNP.DirectWire.TerminalBN6PacketConclusion.payloadSelectors");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorUniverseTheorem, "PNP.DirectWire.terminalBN6_packet_payload_selectors");

  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesAuditedDeclarationCount, 16);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesEmptyAxiomDeclarationCount, 0);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesPropextOnlyDeclarationCount, 4);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesPropextQuotSoundDeclarationCount, 12);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesScope, RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorHandlesTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorHandlesAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorHandlesProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesUniverseMembershipTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_mem_universe");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesInjectiveTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_injective");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesCarrierTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_sublist_carrier");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesSizeTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_large");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesPayloadTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_hasPayloadAt");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesSelectorTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_hasPacketPayloadSelectorAt");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesExistenceTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.hasFinitePacketSelectorHandleAt_iff_payloadSelector");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesUniqueTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.existsUnique_packetSelectorHandle_iff_payloadSelector");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesPayloadConclusionTheorem, "PNP.DirectWire.TerminalPacketPayloadSelectorConclusion.selectorHandles");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesPacketConclusionTheorem, "PNP.DirectWire.TerminalBN6PacketConclusion.selectorHandles");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorHandlesTheorem, "PNP.DirectWire.terminalBN6_packet_selector_handles");

  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecAuditedDeclarationCount, 16);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecEmptyAxiomDeclarationCount, 0);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecPropextOnlyDeclarationCount, 9);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecPropextQuotSoundDeclarationCount, 7);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecScope, RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorCodecTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorCodecAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorCodecProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecRoundTripTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_encode");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecInjectiveTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.encodePacketSelectorHandle_injective");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecExactLengthTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.encodePacketSelectorHandle_length");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecUniverseBoundTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.encodePacketSelectorHandle_length_le_universe");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecCanonicalTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_canonical");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecPayloadEvidenceTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_payloadEvidence");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecExistenceTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.hasEncodedPacketSelectorAt_iff_payloadSelector");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecUniqueTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.existsUnique_encodedPacketSelector_iff_payloadSelector");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecPayloadConclusionTheorem, "PNP.DirectWire.TerminalPacketPayloadSelectorConclusion.selectorCodes");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecPacketConclusionTheorem, "PNP.DirectWire.TerminalBN6PacketConclusion.selectorCodes");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorCodecTheorem, "PNP.DirectWire.terminalBN6_packet_selector_codes");

  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationAuditedDeclarationCount, 21);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationEmptyAxiomDeclarationCount, 0);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationPropextOnlyDeclarationCount, 12);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationPropextQuotSoundDeclarationCount, 9);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationScope, RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationCellFootprintTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorCell_footprint");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationAtomMemberTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadAtom_mem");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationFailClosedTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.realizePacketSelectorPayload_eq_none_iff");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationDecodedHandleTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_eq_some_of_realize");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationEncodedExistenceTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.exists_realizePacketSelectorPayload_encode");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationSoundnessTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.realizePacketSelectorPayload_sound");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationEncodedIffTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.isRealizedPacketSelectorAt_iff_encoded");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationPayloadIffTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.hasRealizedPacketSelectorAt_iff_payloadSelector");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationEncodedConclusionTheorem, "PNP.DirectWire.TerminalPacketEncodedSelectorConclusion.selectorPayloadRealizations");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationPacketConclusionTheorem, "PNP.DirectWire.TerminalBN6PacketConclusion.selectorPayloadRealizations");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorPayloadRealizationTheorem, "PNP.DirectWire.terminalBN6_packet_selector_payload_realizations");

  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanFormalized, true);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanAuditedDeclarationCount, 20);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanEmptyAxiomDeclarationCount, 3);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanPropextOnlyDeclarationCount, 2);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanPropextQuotSoundDeclarationCount, 15);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanScope, RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_SCOPE);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorGainScanTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_HASHES);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorGainScanAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.residualTerminalPacketSelectorGainScanProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanCandidateMembershipTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.mem_packetSelectorCandidateImplementations_iff");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanOutcomeSoundnessTheorem, "PNP.DirectWire.TerminalPacketCandidateGainOutcome.sound");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanResidualDescentTheorem, "PNP.DirectWire.TerminalPacketCandidateGainOutcome.gain_strictResidualDescent");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanFailClosedTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.scanPacketSelectorGains_eq_none_iff");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanExistenceIffTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.exists_scanPacketSelectorGains_iff");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanDecodedHandleTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_eq_some_of_gainScan");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanSoundnessTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.scanPacketSelectorGains_sound");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanEncodedExistenceTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.exists_scanPacketSelectorGains_encode");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanEncodedIffTheorem, "PNP.DirectWire.TerminalBN6GroupedFamily.hasPacketSelectorGainScanAt_iff_encoded");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanEncodedConclusionTheorem, "PNP.DirectWire.TerminalPacketEncodedSelectorConclusion.gainScans");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanPacketConclusionTheorem, "PNP.DirectWire.TerminalBN6PacketConclusion.gainScans");
  assert.equal(release.earnedBoundary.residualTerminalPacketSelectorGainScanTheorem, "PNP.DirectWire.terminalBN6_packet_selector_gain_scans");

  assert.equal(releaseBoundaryValue(release, latestStem, "Formalized"), true);
  assert.equal(releaseBoundaryValue(release, latestStem, "AxiomAuditPassed"), true);
  assert.ok(Number.isSafeInteger(releaseBoundaryValue(release, latestStem, "AuditedDeclarationCount")));
  const latestAuditCategorySuffixes = [
    "EmptyAxiomDeclarationCount",
    "PropextOnlyDeclarationCount",
    "QuotSoundOnlyDeclarationCount",
    "PropextQuotSoundDeclarationCount",
  ];
  const latestAuditCategoryCounts = latestAuditCategorySuffixes
    .map((suffix) => releaseBoundaryValue(release, latestStem, suffix, false));
  const publishedLatestAuditCategoryCount = latestAuditCategoryCounts
    .filter((value) => value !== undefined).length;
  assert.ok(
    publishedLatestAuditCategoryCount === 0
      || publishedLatestAuditCategoryCount === latestAuditCategorySuffixes.length,
    "latest audit category counts must be either complete or omitted"
  );
  if (publishedLatestAuditCategoryCount > 0) {
    for (const [index, value] of latestAuditCategoryCounts.entries()) {
      assert.ok(Number.isSafeInteger(value), latestAuditCategorySuffixes[index]);
    }
    assert.equal(
      releaseBoundaryValue(release, latestStem, "AuditedDeclarationCount"),
      latestAuditCategoryCounts.reduce((sum, value) => sum + value, 0)
    );
  }
  const latestReleaseScope = releaseBoundaryValue(release, latestStem, "Scope", false);
  if (latestReleaseScope === undefined) {
    assert.equal(Object.hasOwn(latestStatusPayload, `${latestStatusStem}Scope`), false);
    assert.ok(latestMilestone.scope.length > 0, "scopeless status boundaries retain canonical milestone scope");
  } else {
    assert.equal(latestReleaseScope, latestStatusPayload[`${latestStatusStem}Scope`]);
  }
  assert.deepEqual(releaseBoundaryValue(release, latestStem, "TheoremKernelTypeSha256"), latestTheoremHashes);
  assert.deepEqual(releaseBoundaryValue(release, latestStem, "AxiomClosure"), latestAxiomClosure);
  assert.deepEqual(releaseBoundaryValue(release, latestStem, "ProjectAxiomClosure"), []);
  const latestReleaseTheorems = Object.entries(release.earnedBoundary)
    .filter(([key, value]) => key.endsWith("Theorem")
      && typeof value === "string"
      && latestMilestone.requiredTheorems.includes(value))
    .map(([_key, value]) => value)
    .sort();
  assert.deepEqual(latestReleaseTheorems, [...latestMilestone.requiredTheorems].sort());

  assert.equal(release.earnedBoundary.lockedNANDThresholdPublicationFormalized, true);
  assert.equal(release.earnedBoundary.lockedNANDThresholdPublicationAxiomAuditPassed, true);
  assert.equal(release.earnedBoundary.lockedNANDThresholdPublicationAuditedDeclarationCount, 1);
  assert.equal(release.earnedBoundary.lockedNANDThresholdPublicationEmptyAxiomDeclarationCount, 0);
  assert.equal(release.earnedBoundary.lockedNANDThresholdPublicationPropextOnlyDeclarationCount, 0);
  assert.equal(release.earnedBoundary.lockedNANDThresholdPublicationPropextQuotSoundDeclarationCount, 1);
  assert.equal(release.earnedBoundary.lockedNANDThresholdPublicationScope, "uniform-all-bitstring-cnf-sat-to-concrete-locked-nand-threshold-polynomial-reduction-and-report-facing-theorem");
  assert.deepEqual(release.earnedBoundary.lockedNANDThresholdPublicationTheoremKernelTypeSha256, {
    "PNP.Main.locked_nand_threshold": "951ec63c09e9a096aacc26332a97607dade4a1f412229f9185aff5c7f36aa591"
  });
  assert.deepEqual(release.earnedBoundary.lockedNANDThresholdPublicationAxiomClosure, ["Quot.sound", "propext"]);
  assert.deepEqual(release.earnedBoundary.lockedNANDThresholdPublicationProjectAxiomClosure, []);
  assert.equal(release.earnedBoundary.lockedNANDThresholdPublicationTheorem, "PNP.Main.locked_nand_threshold");
  assert.ok(release.earnedBoundary.scope.endsWith(`+plus-${latestUpdate.milestoneId}`));

  assert.equal(release.earnedBoundary.saturatePositiveFormalized, false);
  assert.equal(release.earnedBoundary.bcelReadyFormalized, false);
  assert.equal(release.earnedBoundary.residualRoutesGlobalGainCompletenessFormalized, false);
  assert.equal(release.earnedBoundary.zeroSlackCompletenessFormalized, false);
  assert.equal(release.earnedBoundary.pccMinPolynomialRuntimeFormalized, false);
  assert.equal(release.earnedBoundary.lockedNANDNormalizeIdempotentTheorem, "PNP.Concrete.LockedNAND.RawCircuit.normalize_idempotent");
  assert.equal(release.earnedBoundary.lockedNANDNormalizeEvalTheorem, "PNP.Concrete.LockedNAND.RawCircuit.normalize_eval");
  assert.equal(release.earnedBoundary.lockedNANDDecodeLockedInstanceRoundTripTheorem, "PNP.Concrete.LockedNAND.decodeLockedInstance_encodeLockedInstance");
  assert.equal(release.earnedBoundary.lockedNANDEncodedThresholdTheorem, "PNP.Concrete.LockedNAND.encoded_fullCandidate_threshold_iff_satisfiable");
  assert.equal(release.earnedBoundary.lockedNANDBuildCorrectTheorem, "PNP.Concrete.LockedNAND.buildLockedNANDInstance_correct");
  assert.equal(release.earnedBoundary.cookLevinBuilderDynamicCursorInterpretationFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderFormulaBitsEmittedFormalized, true);
  assert.equal(release.earnedBoundary.cookLevinBuilderDirectCursorRawInterpretationFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinCompleteRawFormulaBuilderFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinBuilderFunctionProgramRawRefinementFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinFormulaConstructionRuntimePolynomialFormalized, false);
  assert.equal(release.earnedBoundary.cookLevinPolynomialReductionFormalized, false);
  assert.equal(release.earnedBoundary.cnfSATInPFormalized, false);
  assert.equal(release.earnedBoundary.cnfSATNPCompletenessFormalized, false);
  assert.equal(release.earnedBoundary.pEqualsNPFormalized, false);
  assert.equal(release.publicationBoundary.derivedOnlyFromConcreteGate, true);
  assert.equal(release.publicationBoundary.concreteGatePassed, false);
  assert.equal(release.publicationBoundary.mathematicalTheoremEstablished, false);
  assert.equal(release.publicationBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(release.publicationBoundary.publicTheoremStatement, null);
  assert.equal(release.publicationBoundary.compatibilityRootPresent, false);
  assert.equal(release.publicationBoundary.concreteTargetPresent, true);
  assert.equal(release.publicationBoundary.projectSpecificAxiomsRemaining, false);
  assert.equal(release.publicationBoundary.remainingBlockerCount, 5);
});

test("status and inventory publish the canonical latest earned milestone", () => {
  const status = json("public/pnp-status.json");
  const inventory = json("public/pnp-theorem-inventory.json");
  const index = json("public/pnp-index.json");
  const latestUpdate = json("content/milestone-updates.json").entries[0];
  const milestones = status.formalPublicationMilestones;
  const latestPublicationMilestone = milestones.find(
    (row) => row.id === latestUpdate.milestoneId
  );
  assert.ok(latestPublicationMilestone, `missing latest milestone ${latestUpdate.milestoneId}`);
  const latestStem = releaseBoundaryPrefixForMilestone(canonicalRelease, latestPublicationMilestone);
  const latestStatusStem = `lean${statusStemForReleaseBoundary(status, canonicalRelease, latestStem)}`;
  const latestReleaseHashes = releaseBoundaryValue(
    canonicalRelease,
    latestStem,
    "TheoremKernelTypeSha256"
  );
  assert.equal(milestones.length, index.formalPublicationMilestoneCounts.total);
  assert.equal(milestones.filter((row) => row.earned === true).length, index.formalPublicationMilestoneCounts.earned);
  assert.equal(milestones.filter((row) => row.status === "not-formalized").length, index.formalPublicationMilestoneCounts.unearned);

  const parser = milestones.find((row) => row.id === "concrete-locked-nand-source-parser");
  assert.equal(parser.classification, "formalized-foundation-only");
  assert.equal(parser.status, "formalized-foundation-only");
  assert.equal(parser.earned, true);
  assert.equal(parser.allPresent, true);
  assert.equal(parser.allAssumptionFree, false);
  assert.equal(parser.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(parser.allKernelTypesMatch, true);
  assert.equal(parser.sourceClosureFingerprintMatches, true);
  assert.deepEqual(parser.requiredTheorems, Object.keys(LOCKED_NAND_SOURCE_PARSER_HASHES));
  assert.deepEqual(
    Object.fromEntries(parser.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    LOCKED_NAND_SOURCE_PARSER_HASHES
  );
  for (const row of parser.theoremRows) {
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, LOCKED_NAND_SOURCE_PARSER_HASHES[row.name], row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.kind, "theorem", row.name);
    assert.match(candidate.module, /^PNP\.Concrete\.LockedNANDSourceParser/u, row.name);
    assert.deepEqual(candidate.axioms, row.axioms, row.name);
  }
  assert.equal(status.leanConcreteLockedNANDParserMachineFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserAxiomAuditPassed, true);
  assert.equal(status.leanConcreteLockedNANDParserAuditedDeclarationCount, 380);
  assert.equal(status.leanConcreteLockedNANDParserAllInputExactFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserExactOutputFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserCompiledNonTimeoutFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserPolynomialTimeMachineFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized, true);
  assert.equal(status.leanConcreteLockedNANDParserRawRefinementFormalized, true);
  const emitter = milestones.find((row) => row.id === "concrete-locked-nand-target-emitter");
  assert.equal(emitter.classification, "formalized-foundation-only");
  assert.equal(emitter.status, "formalized-foundation-only");
  assert.equal(emitter.earned, true);
  assert.deepEqual(emitter.requiredTheorems, Object.keys(LOCKED_NAND_TARGET_EMITTER_HASHES));
  assert.deepEqual(
    Object.fromEntries(emitter.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    LOCKED_NAND_TARGET_EMITTER_HASHES
  );
  for (const row of emitter.theoremRows) {
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, LOCKED_NAND_TARGET_EMITTER_HASHES[row.name], row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
  }
  assert.equal(status.leanConcreteLockedNANDEmitterMachineFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterAxiomAuditPassed, true);
  assert.equal(status.leanConcreteLockedNANDEmitterAuditedDeclarationCount, 3295);
  assert.equal(status.leanConcreteLockedNANDEmitterAllInputExactFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterExactTargetBytesFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterCompiledNonTimeoutFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterPolynomialTimeMachineFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterPolynomialTimeFunctionFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterRawRefinementFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterStrictParserCompositionFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEmitterOutputSizeBoundFormalized, true);
  const reduction = milestones.find((row) => row.id === "concrete-locked-nand-polynomial-reduction");
  assert.equal(reduction.classification, "formalized-polynomial-reduction");
  assert.equal(reduction.status, "formalized-polynomial-reduction");
  assert.equal(reduction.earned, true);
  assert.equal(reduction.allPresent, true);
  assert.equal(reduction.allAssumptionFree, false);
  assert.equal(reduction.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(reduction.allKernelTypesMatch, true);
  assert.equal(reduction.sourceClosureFingerprintMatches, true);
  assert.deepEqual(reduction.requiredTheorems, Object.keys(LOCKED_NAND_POLYNOMIAL_REDUCTION_HASHES));
  assert.deepEqual(
    Object.fromEntries(reduction.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    LOCKED_NAND_POLYNOMIAL_REDUCTION_HASHES
  );
  for (const row of reduction.theoremRows) {
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, LOCKED_NAND_POLYNOMIAL_REDUCTION_HASHES[row.name], row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.kind, "theorem", row.name);
    assert.equal(candidate.module, "PNP.Concrete.LockedNANDPolynomialReduction", row.name);
    assert.deepEqual(candidate.axioms, ["Quot.sound", "propext"], row.name);
  }
  assert.equal(status.leanConcreteLockedNANDPolynomialReductionFormalized, true);
  assert.equal(status.leanConcreteLockedNANDPolynomialReductionAxiomAuditPassed, true);
  assert.equal(status.leanConcreteLockedNANDPolynomialReductionAuditedDeclarationCount, 16);
  assert.equal(status.leanConcreteLockedNANDPolynomialReductionExactFunctionFormalized, true);
  assert.equal(status.leanConcreteLockedNANDPolynomialReductionExactOutputFormalized, true);
  assert.equal(status.leanConcreteLockedNANDPolynomialReductionLanguageEquivalenceFormalized, true);
  assert.equal(status.leanConcreteLockedNANDPolynomialReductionWitnessFormalized, true);
  assert.equal(status.leanConcreteLockedNANDPolynomialReductionRawRefinementFormalized, true);
  assert.equal(
    status.leanConcreteLockedNANDPolynomialReductionScope,
    "strict-version-zero-parser-emitter-polynomial-reduction-with-exact-language-equivalence-and-recursive-raw-refinement"
  );
  const compiler = milestones.find((row) => row.id === "concrete-cnf-to-nand-semantic-compiler");
  assert.equal(compiler.classification, "formalized-semantic-boundary");
  assert.equal(compiler.status, "formalized-semantic-boundary");
  assert.equal(compiler.earned, true);
  assert.equal(compiler.allPresent, true);
  assert.equal(compiler.allAssumptionFree, false);
  assert.equal(compiler.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(compiler.allKernelTypesMatch, true);
  assert.equal(compiler.sourceClosureFingerprintMatches, true);
  assert.deepEqual(compiler.requiredTheorems, Object.keys(CNF_TO_NAND_SEMANTIC_COMPILER_HASHES));
  assert.deepEqual(
    Object.fromEntries(compiler.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    CNF_TO_NAND_SEMANTIC_COMPILER_HASHES
  );
  for (const row of compiler.theoremRows) {
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, CNF_TO_NAND_SEMANTIC_COMPILER_HASHES[row.name], row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.kind, "theorem", row.name);
    assert.equal(candidate.module, "PNP.Concrete.CNFToNAND", row.name);
    assert.deepEqual(candidate.axioms, row.axioms, row.name);
  }
  assert.equal(status.leanConcreteCNFToNANDSemanticCompilerFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDSemanticCompilerAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCNFToNANDSemanticCompilerAuditedDeclarationCount, 68);
  assert.equal(status.leanConcreteCNFToNANDExactCodecCanonicalityFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDTypedTopologicalCompilationFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDWellFormedOutputFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDExactSemanticsFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDEdgeSemanticsFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDExactGateCountFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDPolynomialOutputSizeBoundFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDAllBitstringFailClosedFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDLockedThresholdCompositionFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDFiniteMachineFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDPolynomialTimeFunctionFormalized, true);
  const polynomialCompiler = milestones.find((row) => row.id === "concrete-cnf-to-nand-polynomial-reduction");
  assert.equal(polynomialCompiler.classification, "formalized-polynomial-reduction");
  assert.equal(polynomialCompiler.status, "formalized-polynomial-reduction");
  assert.equal(polynomialCompiler.earned, true);
  assert.equal(polynomialCompiler.allPresent, true);
  assert.equal(polynomialCompiler.allAssumptionFree, false);
  assert.equal(polynomialCompiler.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(polynomialCompiler.allKernelTypesMatch, true);
  assert.equal(polynomialCompiler.sourceClosureFingerprintMatches, true);
  assert.deepEqual(polynomialCompiler.requiredTheorems, Object.keys(CNF_TO_NAND_POLYNOMIAL_REDUCTION_HASHES));
  assert.deepEqual(
    Object.fromEntries(polynomialCompiler.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    CNF_TO_NAND_POLYNOMIAL_REDUCTION_HASHES
  );
  for (const row of polynomialCompiler.theoremRows) {
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, CNF_TO_NAND_POLYNOMIAL_REDUCTION_HASHES[row.name], row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.kind, "theorem", row.name);
    assert.deepEqual(candidate.axioms, row.axioms, row.name);
  }
  assert.equal(status.leanConcreteCNFToNANDPolynomialReductionFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDPolynomialReductionAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCNFToNANDPolynomialReductionAuditedDeclarationCount, 1316);
  assert.equal(status.leanConcreteCNFToNANDAllInputExactFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDExactMachineOutputFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDCompiledNonTimeoutFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDRawRefinementFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDDirectReductionFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDLockedReductionCompositionFormalized, true);

  const residualGainChain = milestones.find((row) => row.id === "residual-gain-chain-bound");
  assert.equal(residualGainChain.classification, "formalized-iteration-bound-only");
  assert.equal(residualGainChain.status, "formalized-iteration-bound-only");
  assert.equal(residualGainChain.earned, true);
  assert.equal(residualGainChain.allPresent, true);
  assert.equal(residualGainChain.allAssumptionFree, false);
  assert.equal(residualGainChain.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(residualGainChain.allKernelTypesMatch, true);
  assert.equal(residualGainChain.sourceClosureFingerprintMatches, true);
  assert.deepEqual(residualGainChain.requiredTheorems, Object.keys(RESIDUAL_GAIN_CHAIN_THEOREM_SHA256));
  assert.deepEqual(
    Object.fromEntries(residualGainChain.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_GAIN_CHAIN_THEOREM_SHA256
  );
  assert.match(residualGainChain.scope, /endpoint residual slack plus its length/u);
  assert.match(residualGainChain.nonClaim, /does not find the next gain/u);
  assert.equal(status.leanResidualGainChainVerifierFormalized, true);
  assert.equal(status.leanResidualGainChainAxiomAuditPassed, true);
  assert.equal(status.leanResidualGainChainSemanticInvariantFormalized, true);
  assert.equal(status.leanResidualGainChainSlackIterationBoundFormalized, true);
  assert.equal(status.leanResidualGainChainPolynomialRuntimeFormalized, false);

  const residualGainStopping = milestones.find((row) => row.id === "residual-gain-stopping-specification");
  assert.equal(residualGainStopping.classification, "formalized-semantic-stopping-only");
  assert.equal(residualGainStopping.status, "formalized-semantic-stopping-only");
  assert.equal(residualGainStopping.earned, true);
  assert.equal(residualGainStopping.allPresent, true);
  assert.equal(residualGainStopping.allAssumptionFree, true);
  assert.equal(residualGainStopping.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(residualGainStopping.allKernelTypesMatch, true);
  assert.equal(residualGainStopping.sourceClosureFingerprintMatches, true);
  assert.deepEqual(residualGainStopping.requiredTheorems, Object.keys(RESIDUAL_GAIN_STOPPING_THEOREM_SHA256));
  assert.deepEqual(
    Object.fromEntries(residualGainStopping.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_GAIN_STOPPING_THEOREM_SHA256
  );
  assert.match(residualGainStopping.scope, /global absence/u);
  assert.match(residualGainStopping.nonClaim, /not a stopping algorithm/u);
  assert.equal(status.leanResidualGainStoppingSpecificationFormalized, true);
  assert.equal(status.leanResidualGainStoppingAxiomAuditPassed, true);
  assert.equal(status.leanResidualGainReferenceMinimumWitnessFormalized, true);
  assert.equal(status.leanResidualGainPositiveIffGlobalStrictGainFormalized, true);
  assert.equal(status.leanResidualGainZeroIffGlobalNoStrictGainFormalized, true);
  assert.equal(status.leanResidualGainSemanticMinimumIffGlobalNoStrictGainFormalized, true);
  assert.equal(status.leanResidualGainChainGlobalStoppingConsequenceFormalized, true);
  assert.equal(status.leanResidualGainChainExactMinimumPackagingFormalized, true);

  const residualTerminalFullBridge = milestones.find((row) => row.id === "residual-terminal-full-carrier-bridge");
  assert.equal(residualTerminalFullBridge.classification, "formalized-terminal-full-mode-semantic-bridge");
  assert.equal(residualTerminalFullBridge.status, "formalized-terminal-full-mode-semantic-bridge");
  assert.equal(residualTerminalFullBridge.earned, true);
  assert.equal(residualTerminalFullBridge.allPresent, true);
  assert.equal(residualTerminalFullBridge.allAssumptionFree, true);
  assert.equal(residualTerminalFullBridge.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(residualTerminalFullBridge.allKernelTypesMatch, true);
  assert.equal(residualTerminalFullBridge.sourceClosureFingerprintMatches, true);
  assert.deepEqual(residualTerminalFullBridge.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_FULL_BRIDGE_THEOREM_SHA256));
  assert.deepEqual(
    Object.fromEntries(residualTerminalFullBridge.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_FULL_BRIDGE_THEOREM_SHA256
  );
  assert.match(residualTerminalFullBridge.scope, /complete terminal realization/u);
  assert.match(residualTerminalFullBridge.nonClaim, /does not formalize the quotient carrier/u);
  assert.equal(status.leanResidualTerminalFullBridgeFormalized, true);
  assert.equal(status.leanResidualTerminalFullBridgeAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalizationExactFormalized, true);
  assert.equal(status.leanResidualTerminalFullMinimumSpecificationFormalized, true);
  assert.equal(status.leanResidualTerminalMuBridgeFormalized, true);
  assert.equal(status.leanResidualWholeSpanPositiveWitnessIffFormalized, true);
  assert.equal(status.leanResidualWholeSpanStrictDescentFormalized, true);
  assert.equal(status.leanResidualWholeSpanZeroAbsenceIffFormalized, true);
  assert.equal(status.leanResidualTerminalQuotientCarrierFormalized, true);
  assert.equal(status.leanResidualTerminalProperSupportFormalized, true);

  const residualTerminalModeFirewall = milestones.find((row) => row.id === "residual-terminal-mode-firewall");
  assert.equal(residualTerminalModeFirewall.classification, "formalized-terminal-mode-firewall");
  assert.equal(residualTerminalModeFirewall.status, "formalized-terminal-mode-firewall");
  assert.equal(residualTerminalModeFirewall.earned, true);
  assert.equal(residualTerminalModeFirewall.allPresent, true);
  assert.equal(residualTerminalModeFirewall.allAssumptionFree, true);
  assert.equal(residualTerminalModeFirewall.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(residualTerminalModeFirewall.allKernelTypesMatch, true);
  assert.equal(residualTerminalModeFirewall.sourceClosureFingerprintMatches, true);
  assert.deepEqual(residualTerminalModeFirewall.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_MODE_FIREWALL_THEOREM_SHA256));
  assert.deepEqual(
    Object.fromEntries(residualTerminalModeFirewall.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_MODE_FIREWALL_THEOREM_SHA256
  );
  assert.match(residualTerminalModeFirewall.scope, /forgotten profile coordinate agrees/u);
  assert.match(residualTerminalModeFirewall.nonClaim, /supplies no proper or governed supports/u);
  assert.equal(status.leanResidualTerminalModeFirewallFormalized, true);
  assert.equal(status.leanResidualTerminalModeFirewallAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalProfileProjectionExactFormalized, true);
  assert.equal(status.leanResidualTerminalCheckedFullLiftFormalized, true);
  assert.equal(status.leanResidualTerminalQuotientEqualityNotConstructiveFormalized, true);
  assert.equal(status.leanResidualTerminalObligationDischargePreservedFormalized, true);

  const residualTerminalProjectionMinimum = milestones.find((row) => row.id === "residual-terminal-projection-minimum");
  assert.equal(residualTerminalProjectionMinimum.classification, "formalized-terminal-projection-minimum");
  assert.equal(residualTerminalProjectionMinimum.earned, true);
  assert.equal(residualTerminalProjectionMinimum.allAssumptionFree, false);
  assert.equal(residualTerminalProjectionMinimum.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(residualTerminalProjectionMinimum.allKernelTypesMatch, true);
  assert.equal(residualTerminalProjectionMinimum.sourceClosureFingerprintMatches, true);
  assert.deepEqual(residualTerminalProjectionMinimum.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_PROJECTION_MINIMUM_THEOREM_SHA256));
  assert.deepEqual(
    Object.fromEntries(residualTerminalProjectionMinimum.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_PROJECTION_MINIMUM_THEOREM_SHA256
  );
  assert.match(residualTerminalProjectionMinimum.scope, /attained quotient-profile minimum/u);
  assert.match(residualTerminalProjectionMinimum.nonClaim, /no polynomial runtime/u);
  assert.equal(status.leanResidualProjectionMinimumFormalized, true);
  assert.equal(status.leanResidualProjectionMinimumAxiomAuditPassed, true);
  assert.equal(status.leanResidualProjectionMinimumMonotonicityFormalized, true);
  assert.equal(status.leanResidualProjectionDefectZeroIffCheckedLiftAtMinimumFormalized, true);
  assert.equal(status.leanPCCMinPolynomialRuntimeFormalized, false);

  const residualTerminalProjectionTransfer = milestones.find((row) => row.id === "residual-terminal-projection-transfer");
  assert.equal(residualTerminalProjectionTransfer.classification, "formalized-terminal-projection-transfer");
  assert.equal(residualTerminalProjectionTransfer.earned, true);
  assert.equal(residualTerminalProjectionTransfer.allAssumptionFree, false);
  assert.equal(residualTerminalProjectionTransfer.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(residualTerminalProjectionTransfer.allKernelTypesMatch, true);
  assert.equal(residualTerminalProjectionTransfer.sourceClosureFingerprintMatches, true);
  assert.deepEqual(residualTerminalProjectionTransfer.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_PROJECTION_TRANSFER_THEOREM_SHA256));
  assert.deepEqual(
    Object.fromEntries(residualTerminalProjectionTransfer.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_PROJECTION_TRANSFER_THEOREM_SHA256
  );
  assert.match(residualTerminalProjectionTransfer.scope, /exact Section 5\.2 transfer identity/u);
  assert.match(residualTerminalProjectionTransfer.nonClaim, /does not construct or certify a proper governed support square/u);
  const residualTerminalSaturation = milestones.find((row) => row.id === "residual-terminal-saturation-closure");
  assert.equal(residualTerminalSaturation.classification, "formalized-terminal-saturation-closure");
  assert.equal(residualTerminalSaturation.status, "formalized-terminal-saturation-closure");
  assert.equal(residualTerminalSaturation.earned, true);
  assert.equal(residualTerminalSaturation.allPresent, true);
  assert.equal(residualTerminalSaturation.allAssumptionFree, false);
  assert.equal(residualTerminalSaturation.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(residualTerminalSaturation.allKernelTypesMatch, true);
  assert.equal(residualTerminalSaturation.sourceClosureFingerprintMatches, true);
  assert.deepEqual(residualTerminalSaturation.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_SATURATION_THEOREM_SHA256));
  assert.deepEqual(
    Object.fromEntries(residualTerminalSaturation.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_SATURATION_THEOREM_SHA256
  );
  for (const row of residualTerminalSaturation.theoremRows) {
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, RESIDUAL_TERMINAL_SATURATION_THEOREM_SHA256[row.name], row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, "PNP.ResidualTerminalSaturation", row.name);
    assert.deepEqual(candidate.axioms, row.axioms, row.name);
  }
  assert.match(residualTerminalSaturation.scope, /least among closed supersets/u);
  assert.match(residualTerminalSaturation.nonClaim, /does not derive the dependency relation from an arbitrary circuit/u);
  assert.equal(status.leanResidualTerminalSaturationFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalPrimitiveUniverseFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationExtensiveFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationLeastFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationMonotoneFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationIdempotentFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationScope, "all-finite-terminal-primitive-record-universes-with-explicit-boolean-rule-tagged-dependencies");
  assert.equal(status.leanResidualTerminalSupportCompletionFormalized, true);
  assert.equal(status.leanResidualTerminalSquareLegitimacyFormalized, true);
  assert.equal(status.leanResidualTerminalProjectionSquareFormalized, true);
  assert.equal(status.leanResidualProjectionTransferFormalized, true);
  assert.equal(status.leanResidualProjectionTransferAxiomAuditPassed, true);
  assert.equal(status.leanResidualProjectionTransferSignedDeltasFormalized, true);
  assert.equal(status.leanResidualProjectionTransferIdentityFormalized, true);
  assert.equal(status.leanResidualProjectionTransferConstantCutFormalized, true);

  const residualTerminalPhysicalSupport = milestones.find((row) => row.id === "residual-terminal-physical-support-completion");
  assert.equal(residualTerminalPhysicalSupport.classification, "formalized-terminal-physical-support-completion");
  assert.equal(residualTerminalPhysicalSupport.status, "formalized-terminal-physical-support-completion");
  assert.equal(residualTerminalPhysicalSupport.earned, true);
  assert.equal(residualTerminalPhysicalSupport.allPresent, true);
  assert.equal(residualTerminalPhysicalSupport.allAssumptionFree, false);
  assert.equal(residualTerminalPhysicalSupport.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(residualTerminalPhysicalSupport.allKernelTypesMatch, true);
  assert.equal(residualTerminalPhysicalSupport.sourceClosureFingerprintMatches, true);
  assert.deepEqual(residualTerminalPhysicalSupport.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_PHYSICAL_SUPPORT_THEOREM_SHA256));
  assert.deepEqual(
    Object.fromEntries(residualTerminalPhysicalSupport.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_PHYSICAL_SUPPORT_THEOREM_SHA256
  );
  for (const row of residualTerminalPhysicalSupport.theoremRows) {
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, RESIDUAL_TERMINAL_PHYSICAL_SUPPORT_THEOREM_SHA256[row.name], row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.match(candidate.module, /^PNP\.ResidualTerminal(?:ExecutableSaturation|PhysicalSupportCompletion)$/u, row.name);
    assert.deepEqual(candidate.axioms, row.axioms, row.name);
  }
  assert.match(residualTerminalPhysicalSupport.scope, /canonically ordered incoming boundary and outgoing interface wires/u);
  assert.match(residualTerminalPhysicalSupport.nonClaim, /dependency system remains explicit data/u);
  assert.equal(status.leanResidualTerminalExecutableSaturationFormalized, true);
  assert.equal(status.leanResidualTerminalPhysicalSupportCompletionFormalized, true);
  assert.equal(status.leanResidualTerminalPhysicalBoundaryFormalized, true);
  assert.equal(status.leanResidualTerminalPhysicalInterfaceFormalized, true);
  assert.equal(status.leanResidualTerminalPhysicalCompatibilityFormalized, true);
  assert.equal(status.leanResidualTerminalPhysicalSupportCompletionAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalPhysicalSupportCompletionScope, "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-finite-seed-lists");

  const residualTerminalSupportExtraction = milestones.find((row) => row.id === "residual-terminal-support-extraction");
  assert.equal(residualTerminalSupportExtraction.classification, "formalized-terminal-support-extraction");
  assert.equal(residualTerminalSupportExtraction.status, "formalized-terminal-support-extraction");
  assert.equal(residualTerminalSupportExtraction.earned, true);
  assert.equal(residualTerminalSupportExtraction.allPresent, true);
  assert.equal(residualTerminalSupportExtraction.allAssumptionFree, false);
  assert.equal(residualTerminalSupportExtraction.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(residualTerminalSupportExtraction.allKernelTypesMatch, true);
  assert.equal(residualTerminalSupportExtraction.sourceClosureFingerprintMatches, true);
  assert.deepEqual(residualTerminalSupportExtraction.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_SUPPORT_EXTRACTION_THEOREM_SHA256));
  assert.deepEqual(
    Object.fromEntries(residualTerminalSupportExtraction.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_SUPPORT_EXTRACTION_THEOREM_SHA256
  );
  for (const row of residualTerminalSupportExtraction.theoremRows) {
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, RESIDUAL_TERMINAL_SUPPORT_EXTRACTION_THEOREM_SHA256[row.name], row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.match(candidate.module, /^PNP\.ResidualTerminal(?:SupportExtraction|ExecutableSaturation|PhysicalSupportCompletion)$/u, row.name);
    assert.deepEqual(candidate.axioms, row.axioms, row.name);
  }
  assert.match(residualTerminalSupportExtraction.scope, /including noncontiguous selections/u);
  assert.match(residualTerminalSupportExtraction.scope, /every boundary valuation/u);
  assert.match(residualTerminalSupportExtraction.nonClaim, /record list and terminal dependency system remain explicit inputs/u);
  assert.equal(status.leanResidualTerminalSupportExtractionFormalized, true);
  assert.equal(status.leanResidualTerminalOpenSemanticsFormalized, true);
  assert.equal(status.leanResidualTerminalInducedRecoveryFormalized, true);
  assert.equal(status.leanResidualTerminalSupportExtractionAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalSupportExtractionScope, "all-finite-direct-wire-candidates-terminal-record-lists-boundary-valuations-and-interface-coordinates");

  const residualTerminalProperSupport = milestones.find((row) => row.id === "residual-terminal-proper-positive-support-search");
  assert.equal(residualTerminalProperSupport.classification, "formalized-governed-proper-positive-support-search");
  assert.equal(residualTerminalProperSupport.status, "formalized-governed-proper-positive-support-search");
  assert.equal(residualTerminalProperSupport.earned, true);
  assert.equal(residualTerminalProperSupport.allPresent, true);
  assert.equal(residualTerminalProperSupport.allAssumptionFree, false);
  assert.equal(residualTerminalProperSupport.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(residualTerminalProperSupport.allKernelTypesMatch, true);
  assert.equal(residualTerminalProperSupport.sourceClosureFingerprintMatches, true);
  assert.deepEqual(residualTerminalProperSupport.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_PROPER_SUPPORT_THEOREM_SHA256));
  assert.deepEqual(
    Object.fromEntries(residualTerminalProperSupport.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_PROPER_SUPPORT_THEOREM_SHA256
  );
  for (const row of residualTerminalProperSupport.theoremRows) {
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, RESIDUAL_TERMINAL_PROPER_SUPPORT_THEOREM_SHA256[row.name], row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
  }
  assert.match(residualTerminalProperSupport.scope, /complete canonical finite universe of primitive-record seeds/u);
  assert.match(residualTerminalProperSupport.nonClaim, /exhaustive reference computation rather than a polynomial algorithm/u);
  assert.equal(status.leanResidualTerminalProperSupportFormalized, true);
  assert.equal(status.leanResidualTerminalProperSupportSearchCompleteFormalized, true);
  assert.equal(status.leanResidualTerminalProperSupportExactLocalGainFormalized, true);
  assert.equal(status.leanResidualTerminalProperSupportAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalProperSupportScope, "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-canonical-primitive-record-seeds-with-exhaustive-reference-minimum-local-gain");

  const residualTerminalSupportSquare = milestones.find((row) => row.id === "residual-terminal-saturated-support-square-closure");
  assert.equal(residualTerminalSupportSquare.classification, "formalized-terminal-saturated-support-square-closure");
  assert.equal(residualTerminalSupportSquare.status, "formalized-terminal-saturated-support-square-closure");
  assert.equal(residualTerminalSupportSquare.earned, true);
  assert.equal(residualTerminalSupportSquare.allPresent, true);
  assert.equal(residualTerminalSupportSquare.allAssumptionFree, false);
  assert.equal(residualTerminalSupportSquare.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(residualTerminalSupportSquare.allKernelTypesMatch, true);
  assert.equal(residualTerminalSupportSquare.sourceClosureFingerprintMatches, true);
  assert.deepEqual(residualTerminalSupportSquare.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_SUPPORT_SQUARE_THEOREM_SHA256));
  assert.deepEqual(
    Object.fromEntries(residualTerminalSupportSquare.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_SUPPORT_SQUARE_THEOREM_SHA256
  );
  for (const row of residualTerminalSupportSquare.theoremRows) {
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, RESIDUAL_TERMINAL_SUPPORT_SQUARE_THEOREM_SHA256[row.name], row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
  }
  assert.match(residualTerminalSupportSquare.scope, /canonical closed meet/u);
  assert.match(residualTerminalSupportSquare.nonClaim, /not the manuscript's obstruction routing/u);
  assert.equal(status.leanResidualTerminalSupportSquareClosureFormalized, true);
  assert.equal(status.leanResidualTerminalSupportSquareMeetJoinExactFormalized, true);
  assert.equal(status.leanResidualTerminalSupportSquarePhysicalCompatibilityFormalized, true);
  assert.equal(status.leanResidualTerminalSupportSquareSemanticExtractionFormalized, true);
  assert.equal(status.leanResidualTerminalSupportSquareClosureAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalSupportSquareClosureScope, "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-pairs-of-finite-terminal-seeds");

  const governedSupport = milestones.find((row) => row.id === "residual-terminal-governed-support-completion");
  assert.equal(governedSupport.classification, "formalized-terminal-governed-support-completion");
  assert.equal(governedSupport.status, "formalized-terminal-governed-support-completion");
  assert.equal(governedSupport.earned, true);
  assert.equal(governedSupport.allPresent, true);
  assert.equal(governedSupport.allAssumptionFree, false);
  assert.equal(governedSupport.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(governedSupport.allKernelTypesMatch, true);
  assert.equal(governedSupport.sourceClosureFingerprintMatches, true);
  assert.deepEqual(governedSupport.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_GOVERNED_SUPPORT_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(governedSupport.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_GOVERNED_SUPPORT_HASHES
  );
  for (const row of governedSupport.theoremRows) {
    const expected = RESIDUAL_TERMINAL_GOVERNED_SUPPORT_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.match(governedSupport.scope, /partition of selected profile coordinates among all ten terminal profile roles/u);
  assert.match(governedSupport.nonClaim, /governed finite completion of each saturated support-square corner/u);
  assert.equal(status.leanResidualTerminalGovernedSupportCompletionFormalized, true);
  assert.equal(status.leanResidualTerminalGovernedProfilePartitionFormalized, true);
  assert.equal(status.leanResidualTerminalGovernedSupportCompletionAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalGovernedSupportCompletionScope, "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-finite-seed-lists-and-saturated-support-square-corners");

  const frontierPushout = milestones.find((row) => row.id === "residual-terminal-governed-frontier-pushout");
  assert.equal(frontierPushout.classification, "formalized-terminal-governed-frontier-pushout");
  assert.equal(frontierPushout.status, "formalized-terminal-governed-frontier-pushout");
  assert.equal(frontierPushout.earned, true);
  assert.equal(frontierPushout.allPresent, true);
  assert.equal(frontierPushout.allAssumptionFree, false);
  assert.equal(frontierPushout.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(frontierPushout.allKernelTypesMatch, true);
  assert.equal(frontierPushout.sourceClosureFingerprintMatches, true);
  assert.deepEqual(frontierPushout.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_FRONTIER_PUSHOUT_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(frontierPushout.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_FRONTIER_PUSHOUT_HASHES
  );
  for (const row of frontierPushout.theoremRows) {
    const expected = RESIDUAL_TERMINAL_FRONTIER_PUSHOUT_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.match(frontierPushout.scope, /constructs the governed boundary, interface, and role-preserving profile pushout/u);
  assert.match(frontierPushout.nonClaim, /not projection compatibility/u);
  assert.equal(status.leanResidualTerminalFrontierPushoutFormalized, true);
  assert.equal(status.leanResidualTerminalFrontierBoundaryGlueExactFormalized, true);
  assert.equal(status.leanResidualTerminalFrontierInterfaceGlueExactFormalized, true);
  assert.equal(status.leanResidualTerminalFrontierProfileGlueExactFormalized, true);
  assert.equal(status.leanResidualTerminalFrontierInternalizationFormalized, true);
  assert.equal(status.leanResidualTerminalFrontierPushoutAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalFrontierPushoutScope, "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-computed-saturated-support-squares");

  const projectionSquare = milestones.find((row) => row.id === "residual-terminal-governed-projection-square");
  assert.equal(projectionSquare.classification, "formalized-terminal-governed-projection-square");
  assert.equal(projectionSquare.status, "formalized-terminal-governed-projection-square");
  assert.equal(projectionSquare.earned, true);
  assert.equal(projectionSquare.allPresent, true);
  assert.equal(projectionSquare.allAssumptionFree, false);
  assert.equal(projectionSquare.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(projectionSquare.allKernelTypesMatch, true);
  assert.equal(projectionSquare.sourceClosureFingerprintMatches, true);
  assert.deepEqual(projectionSquare.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_PROJECTION_SQUARE_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(projectionSquare.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_PROJECTION_SQUARE_HASHES
  );
  for (const row of projectionSquare.theoremRows) {
    const expected = RESIDUAL_TERMINAL_PROJECTION_SQUARE_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.match(projectionSquare.scope, /every forgetful terminal projection/u);
  assert.match(projectionSquare.nonClaim, /not side-tight four-corner minima/u);
  assert.equal(status.leanResidualTerminalProjectionSquareFormalized, true);
  assert.equal(status.leanResidualTerminalProjectionPhysicalInvariantFormalized, true);
  assert.equal(status.leanResidualTerminalProjectionProfileExactFormalized, true);
  assert.equal(status.leanResidualTerminalProjectionMeetJoinCommuteFormalized, true);
  assert.equal(status.leanResidualTerminalProjectionPushoutCommuteFormalized, true);
  assert.equal(status.leanResidualTerminalProjectionSquareAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalProjectionSquareScope, "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-computed-saturated-support-squares-and-forgetful-terminal-projections");

  const sideTightMinimum = milestones.find((row) => row.id === "residual-terminal-side-tight-minimum-arithmetic");
  assert.equal(sideTightMinimum.classification, "formalized-residual-terminal-side-tight-minimum-arithmetic");
  assert.equal(sideTightMinimum.status, "formalized-residual-terminal-side-tight-minimum-arithmetic");
  assert.equal(sideTightMinimum.earned, true);
  assert.equal(sideTightMinimum.allPresent, true);
  assert.equal(sideTightMinimum.allAssumptionFree, false);
  assert.equal(sideTightMinimum.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(sideTightMinimum.allKernelTypesMatch, true);
  assert.equal(sideTightMinimum.sourceClosureFingerprintMatches, true);
  assert.deepEqual(sideTightMinimum.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_SIDE_TIGHT_MINIMUM_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(sideTightMinimum.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_SIDE_TIGHT_MINIMUM_HASHES
  );
  for (const row of sideTightMinimum.theoremRows) {
    const expected = RESIDUAL_TERMINAL_SIDE_TIGHT_MINIMUM_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.match(sideTightMinimum.scope, /exact signed four-slack identity/u);
  assert.match(sideTightMinimum.nonClaim, /independently attained/u);
  assert.equal(status.leanResidualTerminalSideTightMinimumArithmeticFormalized, true);
  assert.equal(status.leanResidualTerminalSideTightSignedSlackIdentityFormalized, true);
  assert.equal(status.leanResidualTerminalSideTightFailClosedGateFormalized, true);
  assert.equal(status.leanResidualTerminalSideTightCanonicalFullBasisFormalized, true);
  assert.equal(status.leanResidualTerminalSideTightCanonicalQuotientBasisFormalized, true);
  assert.equal(status.leanResidualTerminalSideTightMinimumAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalSideTightMinimumScope, "all-finite-terminal-projection-four-corner-families-and-independently-attained-full-and-quotient-minimum-bases");

  const fourCornerCarrier = milestones.find((row) => row.id === "residual-terminal-four-corner-carrier-transport");
  assert.equal(fourCornerCarrier.classification, "formalized-residual-terminal-four-corner-carrier-transport");
  assert.equal(fourCornerCarrier.status, "formalized-residual-terminal-four-corner-carrier-transport");
  assert.equal(fourCornerCarrier.earned, true);
  assert.equal(fourCornerCarrier.allPresent, true);
  assert.equal(fourCornerCarrier.allAssumptionFree, false);
  assert.equal(fourCornerCarrier.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(fourCornerCarrier.allKernelTypesMatch, true);
  assert.equal(fourCornerCarrier.sourceClosureFingerprintMatches, true);
  assert.deepEqual(fourCornerCarrier.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_FOUR_CORNER_CARRIER_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(fourCornerCarrier.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_FOUR_CORNER_CARRIER_HASHES
  );
  for (const row of fourCornerCarrier.theoremRows) {
    const expected = RESIDUAL_TERMINAL_FOUR_CORNER_CARRIER_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.match(fourCornerCarrier.scope, /common ambient coordinates/u);
  assert.match(fourCornerCarrier.nonClaim, /does not transport four optimum realizers/u);
  assert.equal(status.leanResidualTerminalFourCornerCarrierTransportFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerCarrierExactEndpointsFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerCarrierInjectiveCoordinatesFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerCarrierProfileTransportFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerCarrierFailClosedPhysicalTransportFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerCarrierAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalFourCornerCarrierScope, "all-finite-computed-saturated-terminal-support-squares-and-canonical-physical-profile-transport-coordinates");

  const fourCornerOptima = milestones.find((row) => row.id === "residual-terminal-four-corner-optimum-carrier-compatibility");
  assert.equal(fourCornerOptima.classification, "formalized-residual-terminal-four-corner-optimum-carrier-compatibility");
  assert.equal(fourCornerOptima.status, "formalized-residual-terminal-four-corner-optimum-carrier-compatibility");
  assert.equal(fourCornerOptima.earned, true);
  assert.equal(fourCornerOptima.allPresent, true);
  assert.equal(fourCornerOptima.allAssumptionFree, false);
  assert.equal(fourCornerOptima.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(fourCornerOptima.allKernelTypesMatch, true);
  assert.equal(fourCornerOptima.sourceClosureFingerprintMatches, true);
  assert.deepEqual(fourCornerOptima.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMA_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(fourCornerOptima.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMA_HASHES
  );
  for (const row of fourCornerOptima.theoremRows) {
    const expected = RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMA_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.match(fourCornerOptima.scope, /one common ambient carrier/u);
  assert.match(fourCornerOptima.nonClaim, /independently attained full and quotient optima/u);
  assert.equal(status.leanResidualTerminalFourCornerOptimaCarrierCompatibleFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimaFaithfulAmbientizationFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimaReferenceMinimumPreservedFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimaLocalizedMinimaFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimaSharedObserverProjectionFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimaAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimaCarrierScope, "all-finite-computed-saturated-terminal-support-squares-one-reversible-ambient-carrier-and-shared-observer-projection");

  const fourCornerOptimumCoherence = milestones.find((row) => row.id === "residual-terminal-four-corner-optimum-coherence-dichotomy");
  assert.equal(fourCornerOptimumCoherence.classification, "formalized-residual-terminal-four-corner-optimum-coherence-dichotomy");
  assert.equal(fourCornerOptimumCoherence.status, "formalized-residual-terminal-four-corner-optimum-coherence-dichotomy");
  assert.equal(fourCornerOptimumCoherence.earned, true);
  assert.equal(fourCornerOptimumCoherence.allPresent, true);
  assert.equal(fourCornerOptimumCoherence.allAssumptionFree, false);
  assert.equal(fourCornerOptimumCoherence.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(fourCornerOptimumCoherence.allKernelTypesMatch, true);
  assert.equal(fourCornerOptimumCoherence.sourceClosureFingerprintMatches, true);
  assert.deepEqual(fourCornerOptimumCoherence.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMUM_COHERENCE_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(fourCornerOptimumCoherence.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMUM_COHERENCE_HASHES
  );
  for (const row of fourCornerOptimumCoherence.theoremRows) {
    const expected = RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMUM_COHERENCE_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.match(fourCornerOptimumCoherence.scope, /deterministic order/u);
  assert.match(fourCornerOptimumCoherence.nonClaim, /does not prove that every square is coherent/u);
  assert.equal(status.leanResidualTerminalFourCornerOptimumCoherenceClassifierFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimumFirstFailureFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimumRetainedSemanticsFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimumProfileTransportFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimumModeFirewallFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimumSideTightTupleFactsFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimumCoherenceAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimumCoherenceScope, "all-finite-computed-terminal-support-squares-observers-projections-and-full-or-quotient-modes-coherent-tuple-or-deterministic-first-failure");
  assert.equal(status.leanResidualTerminalCoherentFourCornerBasisFormalized, true);
  assert.equal(status.leanResidualTerminalCoherentFourCornerBasisScope, "conditional-on-exact-mode-appropriate-local-route-silence-not-universal-bn2-square-legitimacy");

  const fourCornerSideTightCompletion = milestones.find((row) => row.id === "residual-terminal-four-corner-side-tight-completion");
  assert.equal(fourCornerSideTightCompletion.classification, "formalized-residual-terminal-four-corner-side-tight-completion-under-local-route-silence");
  assert.equal(fourCornerSideTightCompletion.status, "formalized-residual-terminal-four-corner-side-tight-completion-under-local-route-silence");
  assert.equal(fourCornerSideTightCompletion.earned, true);
  assert.equal(fourCornerSideTightCompletion.allPresent, true);
  assert.equal(fourCornerSideTightCompletion.allAssumptionFree, false);
  assert.equal(fourCornerSideTightCompletion.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(fourCornerSideTightCompletion.allKernelTypesMatch, true);
  assert.equal(fourCornerSideTightCompletion.sourceClosureFingerprintMatches, true);
  assert.deepEqual(fourCornerSideTightCompletion.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_FOUR_CORNER_SIDE_TIGHT_COMPLETION_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(fourCornerSideTightCompletion.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_FOUR_CORNER_SIDE_TIGHT_COMPLETION_HASHES
  );
  for (const row of fourCornerSideTightCompletion.theoremRows) {
    const expected = RESIDUAL_TERMINAL_FOUR_CORNER_SIDE_TIGHT_COMPLETION_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.match(fourCornerSideTightCompletion.scope, /computed local route silence/u);
  assert.match(fourCornerSideTightCompletion.nonClaim, /does not prove universal route silence/u);
  assert.equal(status.leanResidualTerminalFourCornerOptimumLocalRouteClassifierFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimumRouteSoundnessFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimumRouteSilenceFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimumSideTightCompletionUnderRouteSilenceFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimumExactCompletionValuesFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerOptimumPromotionFirewallRetained, true);
  assert.equal(status.leanResidualTerminalFourCornerSideTightCompletionAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalFourCornerSideTightCompletionScope, "all-finite-computed-terminal-support-squares-observers-and-full-or-quotient-modes-side-tight-coherent-completion-under-exact-local-route-silence");

  const fourCornerTightBasisMaximum = milestones.find((row) => row.id === "residual-terminal-four-corner-tight-basis-maximum");
  assert.equal(fourCornerTightBasisMaximum.classification, "formalized-residual-terminal-four-corner-complete-tight-basis-maximum");
  assert.equal(fourCornerTightBasisMaximum.status, "formalized-residual-terminal-four-corner-complete-tight-basis-maximum");
  assert.equal(fourCornerTightBasisMaximum.earned, true);
  assert.equal(fourCornerTightBasisMaximum.allPresent, true);
  assert.equal(fourCornerTightBasisMaximum.allAssumptionFree, false);
  assert.equal(fourCornerTightBasisMaximum.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(fourCornerTightBasisMaximum.allKernelTypesMatch, true);
  assert.equal(fourCornerTightBasisMaximum.sourceClosureFingerprintMatches, true);
  assert.deepEqual(fourCornerTightBasisMaximum.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(fourCornerTightBasisMaximum.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_HASHES
  );
  for (const row of fourCornerTightBasisMaximum.theoremRows) {
    const expected = RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(fourCornerTightBasisMaximum.scope, RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_MILESTONE_SCOPE);
  assert.equal(fourCornerTightBasisMaximum.nonClaim, RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_NON_CLAIM);
  assert.equal(status.leanResidualTerminalFourCornerArbitraryFamilyCoherenceFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerTightBasisFamilyComplete, true);
  assert.equal(status.leanResidualTerminalFourCornerSignedTightBasisMaximumFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerTightBasisMaximumEqualsDeltaFormalized, true);
  assert.equal(status.leanResidualTerminalFourCornerTightBasisMaximumAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalFourCornerTightBasisMaximumScope, RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_SCOPE);

  const computedBN2SquareLegitimacy = milestones.find((row) => row.id === "residual-terminal-computed-bn2-square-legitimacy");
  assert.equal(computedBN2SquareLegitimacy.classification, "formalized-residual-terminal-computed-bn2-square-legitimacy");
  assert.equal(computedBN2SquareLegitimacy.status, "formalized-residual-terminal-computed-bn2-square-legitimacy");
  assert.equal(computedBN2SquareLegitimacy.earned, true);
  assert.equal(computedBN2SquareLegitimacy.allPresent, true);
  assert.equal(computedBN2SquareLegitimacy.allAssumptionFree, false);
  assert.equal(computedBN2SquareLegitimacy.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(computedBN2SquareLegitimacy.allKernelTypesMatch, true);
  assert.equal(computedBN2SquareLegitimacy.sourceClosureFingerprintMatches, true);
  assert.deepEqual(computedBN2SquareLegitimacy.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(computedBN2SquareLegitimacy.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_HASHES
  );
  for (const row of computedBN2SquareLegitimacy.theoremRows) {
    const expected = RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(computedBN2SquareLegitimacy.scope, RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_MILESTONE_SCOPE);
  assert.equal(computedBN2SquareLegitimacy.nonClaim, RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_NON_CLAIM);
  assert.equal(status.leanResidualTerminalSquareStructuralCompatibilityFormalized, true);
  assert.equal(status.leanResidualTerminalSquareFrontierPushoutFormalized, true);
  assert.equal(status.leanResidualTerminalSquareSharedQuantityCarrierFormalized, true);
  assert.equal(status.leanResidualTerminalSquareLocalConclusionUnderRouteSilenceFormalized, true);
  assert.equal(status.leanResidualTerminalSquareFailClosedRouteDichotomyFormalized, true);
  assert.equal(status.leanResidualTerminalSquareLegitimacyAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalSquareLegitimacyScope, RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_SCOPE);

  const computedBCELAnchorNucleus = milestones.find((row) => row.id === "residual-terminal-computed-bcel-anchor-nucleus");
  assert.equal(computedBCELAnchorNucleus.classification, "formalized-residual-terminal-computed-bcel-anchor-nucleus");
  assert.equal(computedBCELAnchorNucleus.status, "formalized-residual-terminal-computed-bcel-anchor-nucleus");
  assert.equal(computedBCELAnchorNucleus.earned, true);
  assert.equal(computedBCELAnchorNucleus.allPresent, true);
  assert.equal(computedBCELAnchorNucleus.allAssumptionFree, false);
  assert.equal(computedBCELAnchorNucleus.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(computedBCELAnchorNucleus.allKernelTypesMatch, true);
  assert.equal(computedBCELAnchorNucleus.sourceClosureFingerprintMatches, true);
  assert.deepEqual(computedBCELAnchorNucleus.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(computedBCELAnchorNucleus.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_HASHES
  );
  for (const row of computedBCELAnchorNucleus.theoremRows) {
    const expected = RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(computedBCELAnchorNucleus.scope, RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_MILESTONE_SCOPE);
  assert.equal(computedBCELAnchorNucleus.nonClaim, RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_NON_CLAIM);
  assert.equal(status.leanResidualTerminalComputedBCELAnchorNucleusFormalized, true);
  assert.equal(status.leanResidualTerminalBCELMinimumPositiveNucleusFormalized, true);
  assert.equal(status.leanResidualTerminalBCELAnchorAlgebraFormalized, true);
  assert.equal(status.leanResidualTerminalBCELCutDefectFirewallFormalized, true);
  assert.equal(status.leanResidualTerminalBCELCutRouteDichotomyFormalized, true);
  assert.equal(status.leanResidualTerminalBCELConstantCutConclusionFormalized, true);
  assert.equal(status.leanResidualTerminalBCELAnchorNucleusAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalBCELAnchorNucleusScope, RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_SCOPE);

  const saturationPositivityFirewall = milestones.find((row) => row.id === "residual-terminal-saturation-positivity-firewall");
  assert.equal(saturationPositivityFirewall.classification, "formalized-residual-terminal-saturation-positivity-firewall");
  assert.equal(saturationPositivityFirewall.status, "formalized-residual-terminal-saturation-positivity-firewall");
  assert.equal(saturationPositivityFirewall.earned, true);
  assert.equal(saturationPositivityFirewall.allPresent, true);
  assert.equal(saturationPositivityFirewall.allAssumptionFree, false);
  assert.equal(saturationPositivityFirewall.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(saturationPositivityFirewall.allKernelTypesMatch, true);
  assert.equal(saturationPositivityFirewall.sourceClosureFingerprintMatches, true);
  assert.deepEqual(saturationPositivityFirewall.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(saturationPositivityFirewall.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_HASHES
  );
  for (const row of saturationPositivityFirewall.theoremRows) {
    const expected = RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(saturationPositivityFirewall.scope, RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_MILESTONE_SCOPE);
  assert.equal(saturationPositivityFirewall.nonClaim, RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_NON_CLAIM);
  assert.equal(status.leanResidualTerminalSaturationPositivityFirewallFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationPositivityFirewallAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalSaturationPositivityFirewallScope, RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_SCOPE);

  const candidateSaturationCostBalance = milestones.find((row) => row.id === "residual-terminal-candidate-saturation-cost-balance");
  assert.equal(candidateSaturationCostBalance.classification, "formalized-residual-terminal-candidate-saturation-cost-balance");
  assert.equal(candidateSaturationCostBalance.status, "formalized-residual-terminal-candidate-saturation-cost-balance");
  assert.equal(candidateSaturationCostBalance.earned, true);
  assert.equal(candidateSaturationCostBalance.allPresent, true);
  assert.equal(candidateSaturationCostBalance.allAssumptionFree, false);
  assert.equal(candidateSaturationCostBalance.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(candidateSaturationCostBalance.allKernelTypesMatch, true);
  assert.equal(candidateSaturationCostBalance.sourceClosureFingerprintMatches, true);
  assert.deepEqual(candidateSaturationCostBalance.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(candidateSaturationCostBalance.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_HASHES
  );
  for (const row of candidateSaturationCostBalance.theoremRows) {
    const expected = RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(candidateSaturationCostBalance.scope, RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_MILESTONE_SCOPE);
  assert.equal(candidateSaturationCostBalance.nonClaim, RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_NON_CLAIM);
  assert.equal(status.leanResidualTerminalCandidateSaturationFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationCostBalanceFormalized, true);
  assert.equal(status.leanResidualTerminalFirstNontransparentStepFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationCostBalanceAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalSaturationCostBalanceScope, RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_SCOPE);

  const interfaceExposureRouting = milestones.find((row) => row.id === "residual-terminal-interface-exposure-routing");
  assert.equal(interfaceExposureRouting.classification, "formalized-residual-terminal-interface-exposure-routing");
  assert.equal(interfaceExposureRouting.status, "formalized-residual-terminal-interface-exposure-routing");
  assert.equal(interfaceExposureRouting.earned, true);
  assert.equal(interfaceExposureRouting.allPresent, true);
  assert.equal(interfaceExposureRouting.allAssumptionFree, false);
  assert.equal(interfaceExposureRouting.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(interfaceExposureRouting.allKernelTypesMatch, true);
  assert.equal(interfaceExposureRouting.sourceClosureFingerprintMatches, true);
  assert.deepEqual(interfaceExposureRouting.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(interfaceExposureRouting.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_HASHES
  );
  for (const row of interfaceExposureRouting.theoremRows) {
    const expected = RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(interfaceExposureRouting.scope, RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_MILESTONE_SCOPE);
  assert.equal(interfaceExposureRouting.nonClaim, RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_NON_CLAIM);
  assert.equal(status.leanResidualTerminalInterfaceExposureRoutingFormalized, true);
  assert.equal(status.leanResidualTerminalFiniteInterfaceExposureRoutesToEFormalized, true);
  assert.equal(status.leanResidualTerminalInterfaceExposureZeroCostRetractFormalized, true);
  assert.equal(status.leanResidualTerminalFirstInterfaceExposureRouteFormalized, true);
  assert.equal(status.leanResidualTerminalInterfaceExposureRoutingAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalInterfaceExposureRoutingScope, RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_SCOPE);

  const finiteSaturatePositiveComposition = milestones.find(
    (row) => row.id === "residual-terminal-finite-saturate-positive-composition"
  );
  assert.equal(finiteSaturatePositiveComposition.classification, "formalized-residual-terminal-finite-saturate-positive-composition");
  assert.equal(finiteSaturatePositiveComposition.status, "formalized-residual-terminal-finite-saturate-positive-composition");
  assert.equal(finiteSaturatePositiveComposition.earned, true);
  assert.equal(finiteSaturatePositiveComposition.allPresent, true);
  assert.equal(finiteSaturatePositiveComposition.allAssumptionFree, false);
  assert.equal(finiteSaturatePositiveComposition.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(finiteSaturatePositiveComposition.allKernelTypesMatch, true);
  assert.equal(finiteSaturatePositiveComposition.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    finiteSaturatePositiveComposition.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(finiteSaturatePositiveComposition.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_HASHES
  );
  for (const row of finiteSaturatePositiveComposition.theoremRows) {
    const expected = RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(finiteSaturatePositiveComposition.scope, RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_MILESTONE_SCOPE);
  assert.equal(finiteSaturatePositiveComposition.nonClaim, RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_NON_CLAIM);
  assert.equal(status.leanResidualTerminalOriginKernelObligationRoutingFormalized, true);
  assert.equal(status.leanResidualTerminalFiniteOriginKernelObligationClosureRoutedFormalized, true);
  assert.equal(status.leanResidualTerminalFirstOriginKernelObligationRouteFormalized, true);
  assert.equal(status.leanResidualTerminalOriginKernelObligationRoutingAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalOriginKernelObligationRoutingScope, RESIDUAL_TERMINAL_ORIGIN_KERNEL_OBLIGATION_ROUTING_SCOPE);
  assert.equal(status.leanResidualTerminalFiniteSaturatePositiveCompositionFormalized, true);
  assert.equal(status.leanResidualTerminalFiniteSaturatePositiveCompositionAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalFiniteSaturatePositiveCompositionScope, RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_SCOPE);

  const rankWF = milestones.find((row) => row.id === "residual-terminal-rank-wf");
  assert.equal(rankWF.classification, "formalized-residual-terminal-rank-wf");
  assert.equal(rankWF.status, "formalized-residual-terminal-rank-wf");
  assert.equal(rankWF.earned, true);
  assert.equal(rankWF.allPresent, true);
  assert.equal(rankWF.allAssumptionFree, false);
  assert.equal(rankWF.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(rankWF.allKernelTypesMatch, true);
  assert.equal(rankWF.sourceClosureFingerprintMatches, true);
  assert.deepEqual(rankWF.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_RANK_WF_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(rankWF.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_RANK_WF_HASHES
  );
  for (const row of rankWF.theoremRows) {
    const expected = RESIDUAL_TERMINAL_RANK_WF_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(rankWF.scope, RESIDUAL_TERMINAL_RANK_WF_MILESTONE_SCOPE);
  assert.equal(rankWF.nonClaim, RESIDUAL_TERMINAL_RANK_WF_NON_CLAIM);
  assert.equal(status.leanResidualTerminalRankWFFormalized, true);
  assert.equal(status.leanResidualTerminalRankWFAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalRankWFScope, RESIDUAL_TERMINAL_RANK_WF_SCOPE);

  const bn3RequestEnvelope = milestones.find((row) => row.id === "residual-terminal-bn3-request-envelope");
  assert.equal(bn3RequestEnvelope.classification, "formalized-residual-terminal-bn3-request-envelope");
  assert.equal(bn3RequestEnvelope.status, "formalized-residual-terminal-bn3-request-envelope");
  assert.equal(bn3RequestEnvelope.earned, true);
  assert.equal(bn3RequestEnvelope.allPresent, true);
  assert.equal(bn3RequestEnvelope.allAssumptionFree, false);
  assert.equal(bn3RequestEnvelope.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(bn3RequestEnvelope.allKernelTypesMatch, true);
  assert.equal(bn3RequestEnvelope.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    bn3RequestEnvelope.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(
      bn3RequestEnvelope.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])
    ),
    RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_HASHES
  );
  for (const row of bn3RequestEnvelope.theoremRows) {
    const expected = RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(bn3RequestEnvelope.scope, RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_MILESTONE_SCOPE);
  assert.equal(bn3RequestEnvelope.nonClaim, RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_NON_CLAIM);
  assert.equal(status.leanResidualTerminalBN3RequestEnvelopeFormalized, true);
  assert.equal(status.leanResidualTerminalBN3RequestEnvelopeAxiomAuditPassed, true);
  assert.equal(
    status.leanResidualTerminalBN3RequestEnvelopeScope,
    RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_SCOPE
  );

  const bn4ActivationCancellation = milestones.find(
    (row) => row.id === "residual-terminal-bn4-activation-cancellation"
  );
  assert.equal(bn4ActivationCancellation.classification, "formalized-residual-terminal-bn4-activation-cancellation");
  assert.equal(bn4ActivationCancellation.status, "formalized-residual-terminal-bn4-activation-cancellation");
  assert.equal(bn4ActivationCancellation.earned, true);
  assert.equal(bn4ActivationCancellation.allPresent, true);
  assert.equal(bn4ActivationCancellation.allAssumptionFree, false);
  assert.equal(bn4ActivationCancellation.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(bn4ActivationCancellation.allKernelTypesMatch, true);
  assert.equal(bn4ActivationCancellation.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    bn4ActivationCancellation.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(
      bn4ActivationCancellation.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])
    ),
    RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_HASHES
  );
  for (const row of bn4ActivationCancellation.theoremRows) {
    const expected = RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(bn4ActivationCancellation.scope, RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_MILESTONE_SCOPE);
  assert.equal(bn4ActivationCancellation.nonClaim, RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_NON_CLAIM);
  assert.equal(status.leanResidualTerminalBN4ActivationCancellationFormalized, true);
  assert.equal(status.leanResidualTerminalBN4ActivationCancellationAxiomAuditPassed, true);
  assert.equal(
    status.leanResidualTerminalBN4ActivationCancellationScope,
    RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_SCOPE
  );

  const bn5FullShadowLocalization = milestones.find(
    (row) => row.id === "residual-terminal-bn5-full-shadow-localization"
  );
  assert.equal(bn5FullShadowLocalization.classification, "formalized-residual-terminal-bn5-full-shadow-localization");
  assert.equal(bn5FullShadowLocalization.status, "formalized-residual-terminal-bn5-full-shadow-localization");
  assert.equal(bn5FullShadowLocalization.earned, true);
  assert.equal(bn5FullShadowLocalization.allPresent, true);
  assert.equal(bn5FullShadowLocalization.allAssumptionFree, false);
  assert.equal(bn5FullShadowLocalization.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(bn5FullShadowLocalization.allKernelTypesMatch, true);
  assert.equal(bn5FullShadowLocalization.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    bn5FullShadowLocalization.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(
      bn5FullShadowLocalization.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])
    ),
    RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_HASHES
  );
  for (const row of bn5FullShadowLocalization.theoremRows) {
    const expected = RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(bn5FullShadowLocalization.scope, RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_MILESTONE_SCOPE);
  assert.equal(bn5FullShadowLocalization.nonClaim, RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_NON_CLAIM);
  assert.equal(status.leanResidualTerminalBN5FullShadowLocalizationFormalized, true);
  assert.equal(status.leanResidualTerminalBN5FullShadowLocalizationAxiomAuditPassed, true);
  assert.equal(
    status.leanResidualTerminalBN5FullShadowLocalizationScope,
    RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_SCOPE
  );

  const pkgCSeparatingConsumers = milestones.find(
    (row) => row.id === "residual-terminal-pkgc-separating-consumers"
  );
  assert.equal(pkgCSeparatingConsumers.classification, "formalized-residual-terminal-pkgc-separating-consumers");
  assert.equal(pkgCSeparatingConsumers.status, "formalized-residual-terminal-pkgc-separating-consumers");
  assert.equal(pkgCSeparatingConsumers.earned, true);
  assert.equal(pkgCSeparatingConsumers.allPresent, true);
  assert.equal(pkgCSeparatingConsumers.allAssumptionFree, false);
  assert.equal(pkgCSeparatingConsumers.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(pkgCSeparatingConsumers.allKernelTypesMatch, true);
  assert.equal(pkgCSeparatingConsumers.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    pkgCSeparatingConsumers.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(
      pkgCSeparatingConsumers.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])
    ),
    RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_HASHES
  );
  for (const row of pkgCSeparatingConsumers.theoremRows) {
    const expected = RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(pkgCSeparatingConsumers.scope, RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_MILESTONE_SCOPE);
  assert.equal(pkgCSeparatingConsumers.nonClaim, RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_NON_CLAIM);
  assert.equal(status.leanResidualTerminalPkgCSeparatingConsumersFormalized, true);
  assert.equal(status.leanResidualTerminalPkgCSeparatingConsumersAxiomAuditPassed, true);
  assert.equal(
    status.leanResidualTerminalPkgCSeparatingConsumersScope,
    RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_SCOPE
  );

  const pkgCTypedRestoration = milestones.find(
    (row) => row.id === "residual-terminal-pkgc-typed-restoration"
  );
  assert.equal(pkgCTypedRestoration.classification, "formalized-residual-terminal-pkgc-typed-restoration");
  assert.equal(pkgCTypedRestoration.status, "formalized-residual-terminal-pkgc-typed-restoration");
  assert.equal(pkgCTypedRestoration.earned, true);
  assert.equal(pkgCTypedRestoration.allPresent, true);
  assert.equal(pkgCTypedRestoration.allAssumptionFree, false);
  assert.equal(pkgCTypedRestoration.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(pkgCTypedRestoration.allKernelTypesMatch, true);
  assert.equal(pkgCTypedRestoration.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    pkgCTypedRestoration.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(
      pkgCTypedRestoration.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])
    ),
    RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_HASHES
  );
  for (const row of pkgCTypedRestoration.theoremRows) {
    const expected = RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(pkgCTypedRestoration.scope, RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_MILESTONE_SCOPE);
  assert.equal(pkgCTypedRestoration.nonClaim, RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_NON_CLAIM);
  assert.equal(status.leanResidualTerminalPkgCTypedRestorationFormalized, true);
  assert.equal(status.leanResidualTerminalPkgCTypedRestorationAxiomAuditPassed, true);
  assert.equal(
    status.leanResidualTerminalPkgCTypedRestorationScope,
    RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_SCOPE
  );

  const pkgCSameKeyCancellation = milestones.find(
    (row) => row.id === "residual-terminal-pkgc-same-key-cancellation"
  );
  assert.equal(pkgCSameKeyCancellation.classification, "formalized-residual-terminal-pkgc-same-key-cancellation");
  assert.equal(pkgCSameKeyCancellation.status, "formalized-residual-terminal-pkgc-same-key-cancellation");
  assert.equal(pkgCSameKeyCancellation.earned, true);
  assert.equal(pkgCSameKeyCancellation.allPresent, true);
  assert.equal(pkgCSameKeyCancellation.allAssumptionFree, false);
  assert.equal(pkgCSameKeyCancellation.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(pkgCSameKeyCancellation.allKernelTypesMatch, true);
  assert.equal(pkgCSameKeyCancellation.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    pkgCSameKeyCancellation.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(
      pkgCSameKeyCancellation.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])
    ),
    RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_HASHES
  );
  for (const row of pkgCSameKeyCancellation.theoremRows) {
    const expected = RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(pkgCSameKeyCancellation.scope, RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_MILESTONE_SCOPE);
  assert.equal(pkgCSameKeyCancellation.nonClaim, RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_NON_CLAIM);
  assert.equal(status.leanResidualTerminalPkgCSameKeyCancellationFormalized, true);
  assert.equal(status.leanResidualTerminalPkgCSameKeyCancellationAxiomAuditPassed, true);
  assert.equal(
    status.leanResidualTerminalPkgCSameKeyCancellationScope,
    RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_SCOPE
  );

  const pkgCAmbientBN4Ledger = milestones.find(
    (row) => row.id === "residual-terminal-pkgc-ambient-bn4-ledger"
  );
  assert.equal(pkgCAmbientBN4Ledger.classification, "formalized-residual-terminal-pkgc-ambient-bn4-ledger");
  assert.equal(pkgCAmbientBN4Ledger.status, "formalized-residual-terminal-pkgc-ambient-bn4-ledger");
  assert.equal(pkgCAmbientBN4Ledger.earned, true);
  assert.equal(pkgCAmbientBN4Ledger.allPresent, true);
  assert.equal(pkgCAmbientBN4Ledger.allAssumptionFree, false);
  assert.equal(pkgCAmbientBN4Ledger.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(pkgCAmbientBN4Ledger.allKernelTypesMatch, true);
  assert.equal(pkgCAmbientBN4Ledger.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    pkgCAmbientBN4Ledger.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(
      pkgCAmbientBN4Ledger.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])
    ),
    RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_HASHES
  );
  for (const row of pkgCAmbientBN4Ledger.theoremRows) {
    const expected = RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(pkgCAmbientBN4Ledger.scope, RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_MILESTONE_SCOPE);
  assert.equal(pkgCAmbientBN4Ledger.nonClaim, RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_NON_CLAIM);
  assert.equal(status.leanResidualTerminalPkgCAmbientBN4LedgerFormalized, true);
  assert.equal(status.leanResidualTerminalPkgCAmbientBN4LedgerAxiomAuditPassed, true);
  assert.equal(
    status.leanResidualTerminalPkgCAmbientBN4LedgerScope,
    RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_SCOPE
  );

  const pkgCAmbientBN4ResidualReduction = milestones.find(
    (row) => row.id === RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_RESIDUAL_REDUCTION_ID
  );
  assert.equal(pkgCAmbientBN4ResidualReduction.classification, "formalized-residual-terminal-pkgc-ambient-bn4-residual-reduction");
  assert.equal(pkgCAmbientBN4ResidualReduction.status, "formalized-residual-terminal-pkgc-ambient-bn4-residual-reduction");
  assert.equal(pkgCAmbientBN4ResidualReduction.earned, true);
  assert.equal(pkgCAmbientBN4ResidualReduction.allPresent, true);
  assert.equal(pkgCAmbientBN4ResidualReduction.allAssumptionFree, false);
  assert.equal(pkgCAmbientBN4ResidualReduction.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(pkgCAmbientBN4ResidualReduction.allKernelTypesMatch, true);
  assert.equal(pkgCAmbientBN4ResidualReduction.sourceClosureFingerprintMatches, true);
  assert.equal(pkgCAmbientBN4ResidualReduction.requiredTheorems.length, 8);
  assert.equal(new Set(pkgCAmbientBN4ResidualReduction.requiredTheorems).size, 8);
  assert.equal(pkgCAmbientBN4ResidualReduction.theoremRows.length, 8);
  for (const row of pkgCAmbientBN4ResidualReduction.theoremRows) {
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.deepEqual(row.axioms, ["Quot.sound", "propext"], row.name);
    assert.match(row.actualKernelTypeSha256, /^[0-9a-f]{64}$/u, row.name);
    assert.equal(row.expectedKernelTypeSha256, row.actualKernelTypeSha256, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, "PNP.ResidualTerminalPkgCAmbientBN4ResidualReduction", row.name);
    assert.deepEqual(candidate.axioms, row.axioms, row.name);
  }
  assert.equal(pkgCAmbientBN4ResidualReduction.scope, RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_RESIDUAL_REDUCTION_MILESTONE_SCOPE);
  assert.equal(pkgCAmbientBN4ResidualReduction.nonClaim, RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_RESIDUAL_REDUCTION_NON_CLAIM);
  assert.equal(status.leanResidualTerminalPkgCAmbientBN4ResidualReductionFormalized, true);
  assert.equal(status.leanResidualTerminalPkgCAmbientBN4ResidualReductionAxiomAuditPassed, true);
  assert.equal(
    status.leanResidualTerminalPkgCAmbientBN4ResidualReductionScope,
    RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_RESIDUAL_REDUCTION_SCOPE
  );

  const v54ConsumerAntichainNormalForm = milestones.find(
    (row) => row.id === "residual-terminal-consumer-antichain-normal-form"
  );
  assert.equal(v54ConsumerAntichainNormalForm.classification, "formalized-residual-terminal-v54-consumer-antichain-normal-form");
  assert.equal(v54ConsumerAntichainNormalForm.status, "formalized-residual-terminal-v54-consumer-antichain-normal-form");
  assert.equal(v54ConsumerAntichainNormalForm.earned, true);
  assert.equal(v54ConsumerAntichainNormalForm.allPresent, true);
  assert.equal(v54ConsumerAntichainNormalForm.allAssumptionFree, false);
  assert.equal(v54ConsumerAntichainNormalForm.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(v54ConsumerAntichainNormalForm.allKernelTypesMatch, true);
  assert.equal(v54ConsumerAntichainNormalForm.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    v54ConsumerAntichainNormalForm.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(
      v54ConsumerAntichainNormalForm.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])
    ),
    RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_HASHES
  );
  for (const row of v54ConsumerAntichainNormalForm.theoremRows) {
    const expected = RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(v54ConsumerAntichainNormalForm.scope, RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_MILESTONE_SCOPE);
  assert.equal(v54ConsumerAntichainNormalForm.nonClaim, RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_NON_CLAIM);
  assert.equal(status.leanResidualTerminalConsumerAntichainNormalFormFormalized, true);
  assert.equal(status.leanResidualTerminalConsumerAntichainNormalFormAxiomAuditPassed, true);
  assert.equal(
    status.leanResidualTerminalConsumerAntichainNormalFormScope,
    RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_SCOPE
  );

  const v53ConstantCutHypergraphRigidity = milestones.find(
    (row) => row.id === "residual-terminal-constant-cut-hypergraph-rigidity"
  );
  assert.equal(v53ConstantCutHypergraphRigidity.classification, "formalized-residual-terminal-v53-constant-cut-hypergraph-rigidity");
  assert.equal(v53ConstantCutHypergraphRigidity.status, "formalized-residual-terminal-v53-constant-cut-hypergraph-rigidity");
  assert.equal(v53ConstantCutHypergraphRigidity.earned, true);
  assert.equal(v53ConstantCutHypergraphRigidity.allPresent, true);
  assert.equal(v53ConstantCutHypergraphRigidity.allAssumptionFree, false);
  assert.equal(v53ConstantCutHypergraphRigidity.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(v53ConstantCutHypergraphRigidity.allKernelTypesMatch, true);
  assert.equal(v53ConstantCutHypergraphRigidity.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    v53ConstantCutHypergraphRigidity.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(
      v53ConstantCutHypergraphRigidity.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])
    ),
    RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_HASHES
  );
  for (const row of v53ConstantCutHypergraphRigidity.theoremRows) {
    const expected = RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(v53ConstantCutHypergraphRigidity.scope, RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_MILESTONE_SCOPE);
  assert.equal(v53ConstantCutHypergraphRigidity.nonClaim, RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_NON_CLAIM);
  assert.equal(status.leanResidualTerminalConstantCutHypergraphRigidityFormalized, true);
  assert.equal(status.leanResidualTerminalConstantCutHypergraphRigidityAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalConstantCutHypergraphRigidityScope, RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_SCOPE);

  const bn6HypergraphPacket = milestones.find(
    (row) => row.id === "residual-terminal-bn6-hypergraph-packet"
  );
  assert.equal(bn6HypergraphPacket.classification, "formalized-residual-terminal-bn6-hypergraph-packet");
  assert.equal(bn6HypergraphPacket.status, "formalized-residual-terminal-bn6-hypergraph-packet");
  assert.equal(bn6HypergraphPacket.earned, true);
  assert.equal(bn6HypergraphPacket.allPresent, true);
  assert.equal(bn6HypergraphPacket.allAssumptionFree, false);
  assert.equal(bn6HypergraphPacket.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(bn6HypergraphPacket.allKernelTypesMatch, true);
  assert.equal(bn6HypergraphPacket.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    bn6HypergraphPacket.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(bn6HypergraphPacket.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_HASHES
  );
  for (const row of bn6HypergraphPacket.theoremRows) {
    const expected = RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(bn6HypergraphPacket.scope, RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_MILESTONE_SCOPE);
  assert.equal(bn6HypergraphPacket.nonClaim, RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_NON_CLAIM);
  assert.equal(status.leanResidualTerminalBN6HypergraphPacketFormalized, true);
  assert.equal(status.leanResidualTerminalBN6HypergraphPacketAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalBN6HypergraphPacketScope, RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_SCOPE);

  const packetSelectorSeeds = milestones.find(
    (row) => row.id === "residual-terminal-packet-selector-seeds"
  );
  assert.equal(packetSelectorSeeds.classification, "formalized-residual-terminal-packet-selector-seeds");
  assert.equal(packetSelectorSeeds.status, "formalized-residual-terminal-packet-selector-seeds");
  assert.equal(packetSelectorSeeds.earned, true);
  assert.equal(packetSelectorSeeds.allPresent, true);
  assert.equal(packetSelectorSeeds.allAssumptionFree, false);
  assert.equal(packetSelectorSeeds.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(packetSelectorSeeds.allKernelTypesMatch, true);
  assert.equal(packetSelectorSeeds.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    packetSelectorSeeds.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(packetSelectorSeeds.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_HASHES
  );
  for (const row of packetSelectorSeeds.theoremRows) {
    const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(packetSelectorSeeds.scope, RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_MILESTONE_SCOPE);
  assert.equal(packetSelectorSeeds.nonClaim, RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_NON_CLAIM);
  assert.equal(status.leanResidualTerminalPacketSelectorSeedsFormalized, true);
  assert.equal(status.leanResidualTerminalPacketSelectorSeedsAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalPacketSelectorSeedsScope, RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_SCOPE);

  const packetSelectorUniverse = milestones.find(
    (row) => row.id === "residual-terminal-packet-selector-universe"
  );
  const packetSelectorHandles = milestones.find(
    (row) => row.id === "residual-terminal-packet-selector-handles"
  );
  const packetSelectorCodec = milestones.find(
    (row) => row.id === "residual-terminal-packet-selector-codec"
  );
  const packetSelectorPayloadRealization = milestones.find(
    (row) => row.id === "residual-terminal-packet-selector-payload-realization"
  );
  const packetSelectorGainScan = milestones.find(
    (row) => row.id === "residual-terminal-packet-selector-gain-scan"
  );
  assert.equal(packetSelectorUniverse.classification, "formalized-residual-terminal-packet-selector-universe");
  assert.equal(packetSelectorUniverse.status, packetSelectorUniverse.classification);
  assert.equal(packetSelectorUniverse.earned, true);
  assert.equal(packetSelectorUniverse.allPresent, true);
  assert.equal(packetSelectorUniverse.allAssumptionFree, false);
  assert.equal(packetSelectorUniverse.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(packetSelectorUniverse.allKernelTypesMatch, true);
  assert.equal(packetSelectorUniverse.sourceClosureFingerprintMatches, true);
  assert.deepEqual(packetSelectorUniverse.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(packetSelectorUniverse.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_HASHES
  );
  for (const row of packetSelectorUniverse.theoremRows) {
    const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(packetSelectorUniverse.scope, RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_MILESTONE_SCOPE);
  assert.equal(packetSelectorUniverse.nonClaim, RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_NON_CLAIM);
  assert.equal(status.leanResidualTerminalPacketSelectorUniverseFormalized, true);
  assert.equal(status.leanResidualTerminalPacketSelectorUniverseAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalPacketSelectorUniverseScope, RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_SCOPE);

  assert.equal(packetSelectorHandles.classification, "formalized-residual-terminal-packet-selector-handles");
  assert.equal(packetSelectorHandles.status, packetSelectorHandles.classification);
  assert.equal(packetSelectorHandles.earned, true);
  assert.equal(packetSelectorHandles.allPresent, true);
  assert.equal(packetSelectorHandles.allAssumptionFree, false);
  assert.equal(packetSelectorHandles.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(packetSelectorHandles.allKernelTypesMatch, true);
  assert.equal(packetSelectorHandles.sourceClosureFingerprintMatches, true);
  assert.deepEqual(packetSelectorHandles.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(packetSelectorHandles.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_HASHES
  );
  for (const row of packetSelectorHandles.theoremRows) {
    const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(packetSelectorHandles.scope, RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_MILESTONE_SCOPE);
  assert.equal(packetSelectorHandles.nonClaim, RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_NON_CLAIM);
  assert.equal(status.leanResidualTerminalPacketSelectorHandlesFormalized, true);
  assert.equal(status.leanResidualTerminalPacketSelectorHandlesAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalPacketSelectorHandlesScope, RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_SCOPE);

  assert.equal(packetSelectorCodec.classification, "formalized-residual-terminal-packet-selector-codec");
  assert.equal(packetSelectorCodec.status, packetSelectorCodec.classification);
  assert.equal(packetSelectorCodec.earned, true);
  assert.equal(packetSelectorCodec.allPresent, true);
  assert.equal(packetSelectorCodec.allAssumptionFree, false);
  assert.equal(packetSelectorCodec.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(packetSelectorCodec.allKernelTypesMatch, true);
  assert.equal(packetSelectorCodec.sourceClosureFingerprintMatches, true);
  assert.deepEqual(packetSelectorCodec.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_THEOREMS));
  assert.deepEqual(
    Object.fromEntries(packetSelectorCodec.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_HASHES
  );
  for (const row of packetSelectorCodec.theoremRows) {
    const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(packetSelectorCodec.scope, RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_MILESTONE_SCOPE);
  assert.equal(packetSelectorCodec.nonClaim, RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_NON_CLAIM);
  assert.equal(status.leanResidualTerminalPacketSelectorCodecFormalized, true);
  assert.equal(status.leanResidualTerminalPacketSelectorCodecAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalPacketSelectorCodecScope, RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_SCOPE);

  assert.equal(packetSelectorPayloadRealization.classification, "formalized-residual-terminal-packet-selector-payload-realization");
  assert.equal(packetSelectorPayloadRealization.status, packetSelectorPayloadRealization.classification);
  assert.equal(packetSelectorPayloadRealization.earned, true);
  assert.equal(packetSelectorPayloadRealization.allPresent, true);
  assert.equal(packetSelectorPayloadRealization.allAssumptionFree, false);
  assert.equal(packetSelectorPayloadRealization.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(packetSelectorPayloadRealization.allKernelTypesMatch, true);
  assert.equal(packetSelectorPayloadRealization.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    packetSelectorPayloadRealization.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(packetSelectorPayloadRealization.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_HASHES
  );
  for (const row of packetSelectorPayloadRealization.theoremRows) {
    const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(packetSelectorPayloadRealization.scope, RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_MILESTONE_SCOPE);
  assert.equal(packetSelectorPayloadRealization.nonClaim, RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_NON_CLAIM);
  assert.equal(status.leanResidualTerminalPacketSelectorPayloadRealizationFormalized, true);
  assert.equal(status.leanResidualTerminalPacketSelectorPayloadRealizationAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalPacketSelectorPayloadRealizationScope, RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_SCOPE);
  assert.equal(index.claimBoundary.leanResidualTerminalPacketSelectorPayloadRealizationFormalized, status.leanResidualTerminalPacketSelectorPayloadRealizationFormalized);
  assert.equal(index.claimBoundary.leanResidualTerminalPacketSelectorPayloadRealizationAxiomAuditPassed, status.leanResidualTerminalPacketSelectorPayloadRealizationAxiomAuditPassed);
  assert.equal(index.claimBoundary.leanResidualTerminalPacketSelectorPayloadRealizationScope, status.leanResidualTerminalPacketSelectorPayloadRealizationScope);

  assert.equal(packetSelectorGainScan.classification, "formalized-residual-terminal-packet-selector-gain-scan");
  assert.equal(packetSelectorGainScan.status, packetSelectorGainScan.classification);
  assert.equal(packetSelectorGainScan.earned, true);
  assert.equal(packetSelectorGainScan.allPresent, true);
  assert.equal(packetSelectorGainScan.allAssumptionFree, false);
  assert.equal(packetSelectorGainScan.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(packetSelectorGainScan.allKernelTypesMatch, true);
  assert.equal(packetSelectorGainScan.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    packetSelectorGainScan.requiredTheorems,
    Object.keys(RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_THEOREMS)
  );
  assert.deepEqual(
    Object.fromEntries(packetSelectorGainScan.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_HASHES
  );
  for (const row of packetSelectorGainScan.theoremRows) {
    const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_THEOREMS[row.name];
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, expected.hash, row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.equal(candidate.module, expected.module, row.name);
    assert.deepEqual(candidate.axioms, expected.axioms, row.name);
  }
  assert.equal(packetSelectorGainScan.scope, RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_MILESTONE_SCOPE);
  assert.equal(packetSelectorGainScan.nonClaim, RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_NON_CLAIM);
  assert.equal(status.leanResidualTerminalPacketSelectorGainScanFormalized, true);
  assert.equal(status.leanResidualTerminalPacketSelectorGainScanAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalPacketSelectorGainScanScope, RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_SCOPE);
  assert.equal(index.claimBoundary.leanResidualTerminalPacketSelectorGainScanFormalized, status.leanResidualTerminalPacketSelectorGainScanFormalized);
  assert.equal(index.claimBoundary.leanResidualTerminalPacketSelectorGainScanAxiomAuditPassed, status.leanResidualTerminalPacketSelectorGainScanAxiomAuditPassed);
  assert.equal(index.claimBoundary.leanResidualTerminalPacketSelectorGainScanScope, status.leanResidualTerminalPacketSelectorGainScanScope);

  assert.match(latestPublicationMilestone.classification, /^formalized-/u);
  assert.equal(latestPublicationMilestone.status, latestPublicationMilestone.classification);
  assert.equal(latestPublicationMilestone.earned, true);
  assert.equal(latestPublicationMilestone.allPresent, true);
  assert.equal(
    latestPublicationMilestone.allAssumptionFree,
    latestPublicationMilestone.theoremRows.every((row) => row.axioms.length === 0)
  );
  assert.equal(latestPublicationMilestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(latestPublicationMilestone.allKernelTypesMatch, true);
  assert.equal(latestPublicationMilestone.sourceClosureFingerprintMatches, true);
  assert.deepEqual(
    latestPublicationMilestone.requiredTheorems,
    latestPublicationMilestone.theoremRows.map((row) => row.name)
  );
  assert.deepEqual(
    Object.fromEntries(latestPublicationMilestone.theoremRows.map((row) => [row.name, row.expectedKernelTypeSha256])),
    latestReleaseHashes
  );
  for (const row of latestPublicationMilestone.theoremRows) {
    assert.equal(row.present, true, row.name);
    assert.equal(row.kind, "theorem", row.name);
    assert.equal(row.actualKernelTypeSha256, row.expectedKernelTypeSha256, row.name);
    assert.equal(row.expectedKernelTypeSha256, latestReleaseHashes[row.name], row.name);
    assert.equal(row.kernelTypeFingerprintMatches, true, row.name);
    const candidate = inventory.milestoneCandidates.find((entry) => entry.name === row.name);
    assert.ok(candidate?.module, row.name);
    assert.deepEqual(candidate.axioms, row.axioms, row.name);
  }
  assert.equal(latestPublicationMilestone.scope, latestPublicationMilestone.scope.trim());
  assert.match(latestPublicationMilestone.nonClaim, /P = NP/u);
  assert.equal(status[`${latestStatusStem}Formalized`], true);
  assert.equal(status[`${latestStatusStem}AxiomAuditPassed`], true);
  assert.equal(latestPublicationMilestone.scope.length > 0, true);
  const latestReleaseScope = releaseBoundaryValue(canonicalRelease, latestStem, "Scope", false);
  if (latestReleaseScope === undefined) {
    assert.equal(Object.hasOwn(status, `${latestStatusStem}Scope`), false);
    assert.equal(Object.hasOwn(index.claimBoundary, `${latestStatusStem}Scope`), false);
  } else {
    assert.equal(latestReleaseScope, status[`${latestStatusStem}Scope`]);
    assert.equal(index.claimBoundary[`${latestStatusStem}Scope`], status[`${latestStatusStem}Scope`]);
  }
  assert.equal(index.claimBoundary[`${latestStatusStem}Formalized`], status[`${latestStatusStem}Formalized`]);
  assert.equal(index.claimBoundary[`${latestStatusStem}AxiomAuditPassed`], status[`${latestStatusStem}AxiomAuditPassed`]);
  assert.equal(status.leanSaturatePositiveFormalized, false);
  assert.equal(status.leanBCELReadyFormalized, false);

  const lockedThreshold = milestones.find((row) => row.id === "global-locked-nand-threshold");
  assert.equal(lockedThreshold.classification, "formalized-concrete-locked-nand-threshold");
  assert.equal(lockedThreshold.status, "formalized-concrete-locked-nand-threshold");
  assert.equal(lockedThreshold.earned, true);
  assert.equal(lockedThreshold.allPresent, true);
  assert.equal(lockedThreshold.allAssumptionFree, false);
  assert.equal(lockedThreshold.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.equal(lockedThreshold.allKernelTypesMatch, true);
  assert.equal(lockedThreshold.sourceClosureFingerprintMatches, true);
  assert.deepEqual(lockedThreshold.requiredTheorems, ["PNP.Main.locked_nand_threshold"]);
  assert.equal(lockedThreshold.theoremRows[0].expectedKernelTypeSha256, "951ec63c09e9a096aacc26332a97607dade4a1f412229f9185aff5c7f36aa591");
  assert.deepEqual(lockedThreshold.theoremRows[0].axioms, ["Quot.sound", "propext"]);
  const lockedThresholdCandidate = inventory.milestoneCandidates.find(
    (row) => row.name === "PNP.Main.locked_nand_threshold"
  );
  assert.equal(lockedThresholdCandidate.module, "PNP.Concrete.LockedNANDThresholdPublication");
  assert.deepEqual(lockedThresholdCandidate.axioms, ["Quot.sound", "propext"]);

  assert.equal(inventory.declarationCount, index.claimBoundary.leanTheoremInventoryDeclarationCount);
  assert.equal(inventory.theoremCount, index.claimBoundary.leanTheoremInventoryTheoremCount);
  assert.equal(inventory.assumptionFreeTheoremCount, index.claimBoundary.leanTheoremInventoryAssumptionFreeTheoremCount);
  assert.equal(inventory.excludedPrivateDeclarationCount, index.claimBoundary.leanTheoremInventoryExcludedPrivateDeclarationCount);
  assert.equal(inventory.sourceClosureModuleCount, index.claimBoundary.leanTheoremInventorySourceClosureModuleCount);
  const earnedRequiredTheorems = status.formalPublicationMilestones
    .filter((row) => row.earned)
    .flatMap((row) => row.requiredTheorems);
  assert.equal(inventory.milestoneCandidates.length, new Set(earnedRequiredTheorems).size);
  assert.equal(Object.values(inventory.declarationKindCounts).reduce((sum, count) => sum + count, 0), inventory.declarationCount);
  assert.equal(inventory.declarationKindCounts.axiom, inventory.axiomCount);
  assert.equal(inventory.projectAxioms.length, inventory.axiomCount);
  assert.equal(new Set(inventory.projectAxioms).size, inventory.axiomCount);
  assert.equal(inventory.declarationKindCounts.theorem, inventory.theoremCount);
});

test("7072f8d report metadata is historical-only and cannot reactivate publication", () => {
  const historical = json("downloads/source-checker-release.json");
  assert.equal(historical.status, "historical-quarantined-not-current-authority");
  assert.equal(historical.authority, "historical-only");
  assert.equal(historical.currentArtifactEligible, false);
  assert.equal(historical.currentStatusAuthority, false);
  assert.equal(historical.mayActivateTheoremPublication, false);
  assert.equal(historical.historicalCanonicalReport.pageCount, 56);
  assert.notEqual(
    json("downloads/formal-publication-release.json").artifacts.report.pdf.sha256,
    historical.historicalCanonicalReport.pdfSha256
  );
});

test("seal rejects canonical artifact drift even when the file remains readable", (t) => {
  const fixture = copySealFixture(t);
  writeFileSync(path.join(fixture, "downloads/canonical_proof_report.tex"), "drift\n");
  assert.throws(
    () => verifyReleaseSeal({ root: fixture }),
    /byte count .* does not match/
  );
});

test("seal rejects extra or reordered manifest entries", (t) => {
  const fixture = copySealFixture(t);
  const sealPath = path.join(fixture, "downloads/release-seal.json");
  const seal = JSON.parse(readFileSync(sealPath, "utf8"));
  seal.files.reverse();
  writeFileSync(sealPath, `${JSON.stringify(seal, null, 2)}\n`);
  assert.throws(
    () => verifyReleaseSeal({ root: fixture }),
    /release seal entry drifted/
  );
});

test("sync mode rejects combining explicit read-only and write modes", () => {
  const result = spawnSync(
    process.execPath,
    ["tools/sync-public-access-docs.mjs", "--check", "--write"],
    { cwd: root, encoding: "utf8" }
  );
  assert.equal(result.status, 1);
  assert.match(result.stderr, /cannot combine --check with --write/);
});

test("exported verification helpers import without a script argv path", () => {
  const modules = [
    "./tools/verify-release-seal.mjs",
    "./tools/check-browser-report-integrity.mjs",
    "./tools/check-cross-repo-targets.mjs",
    "./tools/sync-public-access-docs.mjs",
    "./tools/reviewer-fixture-checker.mjs"
  ];
  const expression = `await Promise.all(${JSON.stringify(modules)}.map((name) => import(name)))`;
  const result = spawnSync(
    process.execPath,
    ["--input-type=module", "--eval", expression],
    { cwd: root, encoding: "utf8" }
  );
  assert.equal(result.status, 0, result.stderr);
});

test("automation invokes read-only sync and contains no commit or push step", () => {
  const workflow = readFileSync(path.join(root, ".github/workflows/sync-public-access-report.yml"), "utf8");
  const synchronizer = readFileSync(path.join(root, "tools/sync-public-access-docs.mjs"), "utf8");
  assert.match(workflow, /permissions:\n  contents: read/);
  assert.match(workflow, /sync-public-access-docs\.mjs --check/);
  assert.match(synchronizer, /verifyReleaseSeal\(\{ root \}\)/);
  assert.match(synchronizer, /checkPdfPageCount\(path\.join\(root, CORE_FILES\[0\]\.targets\[0\]\), expectedPageCount\)/);
  assert.match(synchronizer, /OLD_PDF_SHA256/);
  assert.match(synchronizer, /OLD_TEX_SHA256/);
  assert.doesNotMatch(workflow, /actual_pages=|sha256sum|node tools\/verify-release-seal\.mjs/);
  assert.doesNotMatch(workflow, /git (?:commit|push)/);
  assert.doesNotMatch(workflow, /contents: write/);
});

test("source-bound workflows pin the exact core commit from the publication release", () => {
  const expectedCoreCommit = json("downloads/formal-publication-release.json").source.commit;
  for (const name of [
    "pnp-upstream-status-consistency.yml",
    "sync-public-access-report.yml"
  ]) {
    const workflow = readFileSync(path.join(root, ".github/workflows", name), "utf8");
    const pinnedCoreCommit = workflow.match(/^\s*PNP_CORE_COMMIT:\s*([0-9a-f]{40})\s*$/mu)?.[1];
    assert.equal(pinnedCoreCommit, expectedCoreCommit, name);
  }
});

test("production audit is manual and deployment remains fail-closed outside GitHub Actions", () => {
  const workflow = readFileSync(
    path.join(root, ".github/workflows/production-deployment-consistency.yml"),
    "utf8"
  );
  assert.match(workflow, /workflow_dispatch:/);
  assert.doesNotMatch(workflow, /inputs:|\$\{\{\s*inputs\./);
  assert.match(workflow, /PRODUCTION_BASE_URL: https:\/\/pnplabs\.com\.au/);
  assert.match(workflow, /ref: refs\/heads\/main/);
  assert.doesNotMatch(workflow, /^\s+(?:push|pull_request|schedule):/m);
  assert.match(workflow, /npm run verify:production/);
  assert.doesNotMatch(workflow, /contents: write|git (?:commit|push)|systemctl|deploy-pnp/);

  const productionCheck = readFileSync(path.join(root, "tools/check-production-deployment.mjs"), "utf8");
  const deploymentProvenance = readFileSync(path.join(root, "tools/deployment-provenance.mjs"), "utf8");
  const publicationSync = readFileSync(path.join(root, "tools/sync-public-access-docs.mjs"), "utf8");
  for (const [label, source] of [
    ["production verifier", productionCheck],
    ["deployment provenance", deploymentProvenance],
    ["publication sync", publicationSync]
  ]) {
    assert.match(source, /checkBrowserReportIntegrity\(\{\s*root(?:\s*:|\s*\})/u, label);
  }

  const deploy = readFileSync(path.join(root, "deploy/deploy-pnp"), "utf8");
  assert.match(deploy, /merge-base --is-ancestor/);
  assert.match(deploy, /REPOSITORY_URL="https:\/\/github\.com\/aisknab\/pnplabs\.git"/);
  assert.doesNotMatch(deploy, /PNPLABS_REPOSITORY_URL/);
  assert.match(deploy, /LOCK_DIR="\/run\/pnplabs"/);
  assert.match(deploy, /install -d -m 0755 -o root -g root "\$LOCK_DIR"/);
  assert.match(deploy, /umask 077\nexec 9>"\$LOCK_FILE"\numask 022/);
  assert.match(deploy, /flock -n 9/);
  assert.match(deploy, /"\$@" 9>&-/);
  assert.match(deploy, /runuser -u "\$DEPLOY_USER"/);
  assert.match(deploy, /trap 'rollback 130' INT/);
  assert.match(deploy, /trap 'rollback 143' TERM/);
  assert.match(deploy, /for \(\(attempt = 1; attempt <= 30;/);
  assert.match(deploy, /as_deploy npm --prefix "\$release_dir" test/);
  assert.match(deploy, /npm --prefix "\$release_dir" run deployment:generate/);
  assert.match(deploy, /npm --prefix "\$release_dir" run deployment:check/);
  assert.match(deploy, /as_deploy node "\$release_dir\/tools\/check-production-deployment\.mjs"/);
  assert.match(deploy, /--expected-site-commit "\$resolved_commit"/);
  assert.match(deploy, /restored the previous release/);
  assert.match(deploy, /wait_for_origin "\/index\.html"/);
  assert.match(deploy, /systemctl stop "\$ORIGIN_SERVICE"/);
  assert.match(deploy, /as_origin \/usr\/bin\/test -r "\$previous_target\/server\.mjs"/);
  const freezeIndex = deploy.indexOf('chown -R -h root:root "$release_dir"');
  const activationIndex = deploy.lastIndexOf('mv -Tf "$next_link" "$CURRENT_LINK"');
  assert.ok(freezeIndex >= 0 && freezeIndex < activationIndex, "release must become root-owned before activation");
  assert.match(deploy, /chmod -R a-w,u\+rwX,go\+rX "\$release_dir"/);
  assert.match(deploy, /as_origin \/usr\/bin\/test -r "\$release_dir\/server\.mjs"/);

  const service = readFileSync(path.join(root, "deploy/pnplabs-origin.service"), "utf8");
  assert.match(service, /^User=pnplabs-origin$/m);
  assert.match(service, /^Environment=HOST=127\.0\.0\.1$/m);
  assert.match(service, /^NoNewPrivileges=true$/m);
  assert.match(service, /^ProtectSystem=strict$/m);
  assert.match(service, /^ReadOnlyPaths=\/srv\/pnplabs$/m);
  assert.match(service, /^ExecStart=\/usr\/local\/libexec\/pnplabs-origin-launcher$/m);
  const launcher = readFileSync(path.join(root, "deploy/pnplabs-origin-launcher"), "utf8");
  assert.match(launcher, /^#!\/bin\/bash/);
  assert.match(launcher, /readlink -f -- "\$\{current_link\}\/server\.mjs"/);
  assert.match(launcher, /exec \/usr\/bin\/env node "\$server_path"/);

  const staticHeaders = readFileSync(path.join(root, "_headers"), "utf8");
  assert.match(staticHeaders, /\/\*\n(?:  .+\n)*  Cache-Control: no-cache/);
  assert.doesNotMatch(staticHeaders, /immutable|max-age=31536000/);
});

test("every active workflow is read-only and pins credential-free actions", () => {
  for (const name of [
    "ci.yml",
    "pnp-public-payloads.yml",
    "pnp-upstream-status-consistency.yml",
    "pnp-verification-run-issue-ingest.yml",
    "pnp-verifier-run-import.yml",
    "production-deployment-consistency.yml",
    "sync-public-access-report.yml"
  ]) {
    const workflow = readFileSync(path.join(root, ".github/workflows", name), "utf8");
    assert.match(workflow, /permissions:\n  contents: read/, name);
    assert.doesNotMatch(workflow, /actions\/(?:checkout|setup-node)@v\d/, name);
    assert.match(workflow, /actions\/checkout@9c091bb21b7c1c1d1991bb908d89e4e9dddfe3e0/, name);
    assert.match(workflow, /actions\/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e/, name);
    const checkoutCount = (workflow.match(/actions\/checkout@/g) || []).length;
    const credentialCount = (workflow.match(/persist-credentials: false/g) || []).length;
    assert.equal(credentialCount, checkoutCount, `${name}: every checkout must drop credentials`);
  }
});

test("explicit write rejects a symlinked parent without touching the outside target", (t) => {
  const fixture = mkdtempSync(path.join(tmpdir(), "pnplabs-sync-root-"));
  const outside = mkdtempSync(path.join(tmpdir(), "pnplabs-sync-outside-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  writeFileSync(path.join(outside, "sentinel.json"), "outside\n");
  symlinkSync(outside, path.join(fixture, "public"));

  assert.throws(
    () => writeMirrorFileAtomically(
      fixture,
      path.join(fixture, "public", "sentinel.json"),
      Buffer.from("overwritten\n")
    ),
    /target parent must be a real directory/
  );
  assert.equal(readFileSync(path.join(outside, "sentinel.json"), "utf8"), "outside\n");
});

test("atomic replacement does not mutate an outside hardlink", (t) => {
  const fixture = mkdtempSync(path.join(tmpdir(), "pnplabs-sync-hardlink-root-"));
  const outside = mkdtempSync(path.join(tmpdir(), "pnplabs-sync-hardlink-outside-"));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  mkdirSync(path.join(fixture, "public"));
  const sentinel = path.join(outside, "sentinel.json");
  const mirror = path.join(fixture, "public", "mirror.json");
  writeFileSync(sentinel, "outside\n");
  linkSync(sentinel, mirror);

  writeMirrorFileAtomically(fixture, mirror, Buffer.from("current mirror\n"));
  assert.equal(readFileSync(sentinel, "utf8"), "outside\n");
  assert.equal(readFileSync(mirror, "utf8"), "current mirror\n");
});

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
  "public/pnp-theorem-inventory.json"
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

function json(relativePath) {
  return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
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

test("exact current artifact seal verifies eight reviewed files", () => {
  const result = verifyReleaseSeal({ root });
  assert.equal(result.checked, 8);
  assert.equal(result.coreCommit, "e6fcbad711f1bdfcc67d8e4c748f2a65d192b8a5");
});

test("current release is pinned, eighty-page, exposes the terminal saturation-positivity firewall, and fails closed", () => {
  const release = json("downloads/formal-publication-release.json");
  assert.equal(release.coordinate, "PNP-FORMAL-PUBLICATION-RELEASE-2026-08-09-100");
  assert.equal(release.source.commit, "e6fcbad711f1bdfcc67d8e4c748f2a65d192b8a5");
  assert.equal(release.source.proofCommit, "b3147f70cd27349fb93e233ec4a0d0673298c261");
  assert.equal(release.source.tree, "1a326290d19798563b9ed4680228ff595b620248");
  assert.equal(release.source.coordinateAloneIsAuthority, false);
  assert.equal(release.source.identityRequiresCommitTreeAndArtifactHashes, true);
  assert.equal(release.artifacts.report.pageCount, 80);
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
  assert.equal(release.earnedBoundary.cookLevinBuilderCompleteHeaderAuditedDeclarationCount, 84);
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
  assert.equal(release.earnedBoundary.lockedNANDEncodedSemanticReductionAuditedDeclarationCount, 48);
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
  assert.equal(release.publicationBoundary.projectSpecificAxiomsRemaining, true);
  assert.equal(release.publicationBoundary.remainingBlockerCount, 6);
});

test("status and inventory publish exactly 97 milestones with terminal saturation-positivity firewall pinned", () => {
  const status = json("public/pnp-status.json");
  const inventory = json("public/pnp-theorem-inventory.json");
  const milestones = status.formalPublicationMilestones;
  assert.equal(milestones.length, 97);
  assert.equal(milestones.filter((row) => row.earned === true).length, 94);
  assert.equal(milestones.filter((row) => row.status === "not-formalized").length, 3);

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
  assert.equal(status.leanSaturatePositiveFormalized, false);
  assert.equal(status.leanBCELReadyFormalized, false);

  assert.equal(inventory.declarationCount, 25571);
  assert.equal(inventory.theoremCount, 13587);
  assert.equal(inventory.assumptionFreeTheoremCount, 7043);
  assert.equal(inventory.excludedPrivateDeclarationCount, 14779);
  assert.equal(inventory.sourceClosureModuleCount, 233);
  assert.equal(inventory.milestoneCandidates.length, 2432);
  assert.deepEqual(inventory.declarationKindCounts, {
    axiom: 4,
    constructor: 746,
    definition: 10562,
    inductive: 336,
    opaque: 0,
    quotient: 0,
    recursor: 336,
    theorem: 13587
  });
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
  assert.match(workflow, /permissions:\n  contents: read/);
  assert.match(workflow, /sync-public-access-docs\.mjs --check/);
  assert.doesNotMatch(workflow, /git (?:commit|push)/);
  assert.doesNotMatch(workflow, /contents: write/);
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

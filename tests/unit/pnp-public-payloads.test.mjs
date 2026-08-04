import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { access, readFile, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const CORE_COMMIT = 'e355c176bd0e961b5db41dd11fc5b2ccfe6642fb';
const STATUS_COORDINATE = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-08-04-101';
const INVENTORY_COORDINATE = 'PNP-LEAN-THEOREM-INVENTORY-2026-08-04-101';
const INVENTORY_SHA256 = '58d8118f3aef8976a3f1bdb2063a6d08baa7f2fe01e7393881fc9776f738aac9';
const LOCKED_NAND_SOURCE_PARSER_THEOREM_SHA256 = {
  'PNP.Concrete.LockedNAND.SourceParser.acceptedTape_outputBits': 'd701ab9e34ecabc1d16ea08faa44671e875b59bd6133b11e2fcf7e020d3e1634',
  'PNP.Concrete.LockedNAND.SourceParser.allInput_exact': '78d0acb8ae788b9216e67ac5be635c1d0f34953e1bc57c9b6e884d7f04d54a03',
  'PNP.Concrete.LockedNAND.SourceParser.canonicalSteps_le_validWorkBound': '28467e05ff2e43332360757992c3cd5850a45f3ef7d3fb48bebac47ad090a2ff',
  'PNP.Concrete.LockedNAND.SourceParser.compiledBoundedDecide_accept_iff': '55182cfbf83ffaf4a839519e7fceccc72378c5a5b0993dda4a48fb16888cb82c',
  'PNP.Concrete.LockedNAND.SourceParser.compiledBoundedDecide_ne_timeout': 'f8a1ccfa5a54373f004c1973a2115fe51bd6f53403cc6f72de4dfc3e01cc6ad9',
  'PNP.Concrete.LockedNAND.SourceParser.compiledMachineOutput_eq_validatedSourceBytes': 'adc61884c960f3eb7c1a6a32e3383b23f33f581685509f7f40c4d4c14e05bcf0',
  'PNP.Concrete.LockedNAND.SourceParser.compiledStart_blankEquivalent': '453d8927f184e5f25c348ce8a7d80b1668044759e265c0f9306b2ce03e9642da',
  'PNP.Concrete.LockedNAND.SourceParser.decodeCircuitTokens_eq_none_iff_failure': '12ba3b565d2c3c1d7d7e49e902ea626da22e434b85fe2305dc8b203c46d98485',
  'PNP.Concrete.LockedNAND.SourceParser.illFormed_exact': '9a5f16bda1ce85f865517b78762bdf5c665748edb297920d211ac2aca6016625',
  'PNP.Concrete.LockedNAND.SourceParser.machine_acceptState_ne_rejectState': '9cd9ae748e010284b27d3cde34af163c0250dfc15dd20dde8bb8d7971849cc74',
  'PNP.Concrete.LockedNAND.SourceParser.malformed_exact': '62e8161b3a17d5aab547da24f4eb7e53db5f645a42f5fd79a748d20d7ad73c89',
  'PNP.Concrete.LockedNAND.SourceParser.rules_length': 'eee4e770ed3bd75cd5a13135decf7feac2c03dc8c76bc3f09e24520a831d72a8',
  'PNP.Concrete.LockedNAND.SourceParser.rules_pairwise_query_distinct': '3b03582def97acf6905f685fff8c51a7aa89a339fa30842cb33f6cb3053fa879',
  'PNP.Concrete.LockedNAND.SourceParser.statePrograms_length': 'e9c49bf192094aadf7c4fe4047ffa0eb700e81962aa17d16ea2ad26594e40c7e',
  'PNP.Concrete.LockedNAND.SourceParser.validFinalConfiguration_isHalted': '29e6b966bbdbec361b56a604a2a4f9bf9a7e67029089eaa25546bf7eb34a49e4',
  'PNP.Concrete.LockedNAND.SourceParser.validFinalConfiguration_state': 'df16e89b9b9047047bcf3ef4edae078a0aabc845e1d82a4a0c990b2b3464868d',
  'PNP.Concrete.LockedNAND.SourceParser.validRawBound_eq': '6a31cd6fb0d34dab788f6be4ad428f9bbcac5c4fd35ef29bf90d33cf39743bc4',
  'PNP.Concrete.LockedNAND.SourceParser.validRawTimePolynomial_eval': '2eece133162707f053182b7b838877dd2f63eea10dfc2005e4a1fc001302dc43',
  'PNP.Concrete.LockedNAND.SourceParser.validatedSourceBytesPolynomialTimeFunction_output': 'c80a0e9b2352eb5029cc5538d2962a0bbd9fb3cbea93641eba66d6386255d899',
  'PNP.Concrete.LockedNAND.SourceParser.wellFormed_exact': 'df3b9bffacae9dd23069ac927ea471b6e72d1a548cd9e0c2a53885386348905f',
};

const LOCKED_NAND_TARGET_EMITTER_THEOREM_SHA256 = {
  'PNP.Concrete.LockedNAND.RawBuilder.rawLockedInstance_of_elaborate': '410e04af4a9b137bd47635b19e695c71147c4405583b0736a39ba58ad388506b',
  'PNP.Concrete.LockedNAND.RawBuilder.targetBytes_of_elaborated': 'f9a282f4879b6d5596f53e5a3b99ee98db4f5e1f2722fecac4a6e10f4c762deb',
  'PNP.Concrete.LockedNAND.TargetEmitterSpec.targetBytes_validatedSourceBytes_eq_buildLockedNANDInstance': '67c5835f004ab60ad25c0eda51d4ca58c31d5fa55aa572a04e7c519363198566',
  'PNP.Concrete.LockedNAND.TargetEmitterSpec.targetBytes_size_le': '8763f76ef018efee23d75d56ced5fcb95931c1988c21cb968320e4e7e33000d1',
  'PNP.Concrete.LockedNAND.TargetEmitterController.rules_length_literal': 'be15b34e4ded6214d8b15c45725d47d41325610196625956d9ae05ce6f77cdde',
  'PNP.Concrete.LockedNAND.TargetEmitterController.rules_pairwise': 'e47261dd3ffee0b8214691a1ee4800727b2f8d0ab200855c55c954da3b9461d1',
  'PNP.Concrete.LockedNAND.TargetEmitterController.machine_accept_ne_reject': '973fef5626508cec7d4669f64acbf335e59db1d9018ed03ceaa8739b341dfe3e',
  'PNP.Concrete.LockedNAND.TargetEmitterController.graph_wellFormed': '35f63a3f9e96ad6d23de3451840976260c470d151b10d07ed08e6697d6391062',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerTotalTrace.malformed_bounded_exact': '0c157c96053eed2509d59b5005f954827252bd8f2ec7c1f19f48e0fd2d462f52',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerTotalTrace.decoded_bounded_exact': '218c43a2a0d38a10db5f7398e274e0fb17b44d29d96c6a4bb3ef6f0dd36b68be',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerTotalTrace.allInput_bounded_exact': '425554a8a20634d54973646a441992513bd246a2a711b96f303713fa7e081f30',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.controllerWorkTimePolynomial_eval': '4ec2fa481ee9f6724dec27746336a71e98d6842620b6d2b45273072c7731706e',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.allInputWorkTimePolynomial_eval': '5adb93ae0b5b9996c74070ccfa46b0198346a7002d229fd3bd36e1c99c54773e',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.compiledRawTimePolynomial_eval': '527d372415697449e6c2e5eb64ee377d796e8c51a76160f367d9bcafe2ccbdcd',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.controller_complete_path_polynomial': 'ad1d4ddbef30a832fb196b55e1fcf5ce8abc50c21bd49db72e918ccfe70b47e6',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.controllerUniformEnvelope_le_workBound': '95c0eb505393381addefd66169dbac9c06371fe60e65a3f86c30715c220a8fb3',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledStart_blankEquivalent': 'b3b81f2ee30d2e4aa571de167efaa0a2f16536c1e50a60abeaa56bd97b907334',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledMachineOutput_eq_targetBytes': 'ae3a4411ddd6004296482add2919f8df4cce41198af5adf1c547f23dcfed94db',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledBoundedDecide_accept_iff': 'd4f25aa62fce0ca4a0a0f29c9f96556f2ac5f86db468086d73f59b9fa8088d07',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledBoundedDecide_ne_timeout': 'cc085d777394cfe297cc82a90518b701a3378e8d7e541cd20ef862fab423fad9',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.rawTargetBytesPolynomialTimeFunction_output': 'b0305c68a488f79ea0628f6e269e19acf6a86513c963e4b457bfc1e689e053f8',
  'PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.strictLockedNANDPolynomialTimeFunction_output': 'fa0bf3e4613cf4bd3d15ff0e6423798455fc4690673e81e5cf84a0cc7932716e',
};

const LOCKED_NAND_POLYNOMIAL_REDUCTION_THEOREM_SHA256 = {
  'PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_function': '3e8000fd18d8836c1ae1ded6b3d0bb46d0ea618c31ba32c7f1425773e62d09c3',
  'PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_output': '06df8e094590a5b0bf522a9daf5921a28667c7d44e73d447d9366ae201ca3ef4',
  'PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_correct': '94955e4d9826f8364e0ecae478eb33cc92620403673db079c7f4a961c15b3739',
  'PNP.Concrete.LockedNAND.encodedNANDSAT_reducesTo_encodedLockedNANDThreshold': '6c133d95b3eb1d8d04f89be467dfbe6405883cb352654eacc5b8a23b99857f4d',
  'PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_hasRawRefinement': '9f0b15fadf98e634edafe5d6a2025d1d92424a6876a018802153a96b934b1061',
};

const CNF_TO_NAND_POLYNOMIAL_REDUCTION_THEOREM_SHA256 = {
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

async function readText(path) {
  return readFile(new URL(`../../${path}`, import.meta.url), 'utf8');
}

async function readBytes(path) {
  return readFile(new URL(`../../${path}`, import.meta.url));
}

async function readJson(path) {
  return JSON.parse(await readText(path));
}

const siblingRepo = new URL('../../../pnp/', import.meta.url);
const siblingGit = new URL('.git', siblingRepo);
let siblingAvailable = true;
try {
  await access(siblingGit);
} catch {
  siblingAvailable = false;
}

test('status and inventory are byte-identical to the pinned merged core publication', { skip: siblingAvailable ? false : 'sibling pnp checkout unavailable; upstream-consistency CI performs the remote comparison' }, async () => {
  for (const path of ['public/pnp-status.json', 'public/pnp-theorem-inventory.json']) {
    const site = await readText(path);
    const { stdout: source } = await execFileAsync('git', [
      '-C', fileURLToPath(siblingRepo), 'show', `${CORE_COMMIT}:${path}`,
    ], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    assert.equal(site, source, `${path} must match pinned merged core commit`);
  }
});

test('current status binds the compiled inventory and fails the concrete gate closed', async () => {
  const status = await readJson('public/pnp-status.json');
  const inventoryBytes = await readBytes('public/pnp-theorem-inventory.json');
  const inventory = JSON.parse(inventoryBytes);

  assert.equal(status.kind, 'PNPFormalReconstructionStatus0');
  assert.equal(status.coordinate, STATUS_COORDINATE);
  assert.equal(status.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-08-04-RESIDUAL-TERMINAL-SATURATION-100');
  assert.equal(status.formalPublicationMapCoordinate, 'PNP-FORMAL-PUBLICATION-MAP-2026-08-04-101');
  assert.equal(status.formalPublicationMapSha256, 'a86df7f8d45a5430bc1b7cc67dfac31e8663a9e81ed24abc0f25a2cd299b0b7c');
  assert.equal(status.leanSourceClosureSha256, '5cb2ae9d032d09c08f34424ccdf0b67452d75b8a933b60114c5267cc69385a7f');
  assert.equal(status.status, 'formal-reconstruction-in-progress');
  assert.equal(status.currentStatusAuthority, true);
  assert.equal(status.leanToolchain, 'leanprover/lean4:v4.31.0');

  assert.equal(inventory.kind, 'PNPLeanTheoremInventory0');
  assert.equal(inventory.coordinate, INVENTORY_COORDINATE);
  assert.equal(createHash('sha256').update(inventoryBytes).digest('hex'), INVENTORY_SHA256);
  assert.equal(status.leanTheoremInventoryCoordinate, INVENTORY_COORDINATE);
  assert.equal(status.leanTheoremInventorySha256, INVENTORY_SHA256);
  assert.equal(inventory.declarationCount, 24054);
  assert.equal(inventory.theoremCount, 12985);
  assert.equal(inventory.assumptionFreeTheoremCount, 6903);
  assert.equal(inventory.excludedPrivateDeclarationCount, 14317);
  assert.equal(inventory.sourceClosureModuleCount, 216);
  assert.equal(inventory.axiomCount, 4);
  assert.deepEqual(inventory.projectAxioms, [
    'PNP.CheckPCCPackexp',
    'PNP.GeneratePCCPack',
    'PNP.LockedNANDThreshold',
    'PNP.ResidualBandExactMinimization',
  ]);

  const gate = status.concretePublicationGate;
  assert.equal(status.abstractPEqualsNPPublicationEligible, false);
  assert.equal(status.publicationStatusDerivedOnlyFromConcreteGate, true);
  assert.equal(gate.abstractPEqualsNPIsPublicationIneligible, true);
  assert.equal(gate.unsetFingerprintIsIntentionalFailClosedMigrationGate, true);
  assert.equal(gate.expectedConcreteTargetKernelTypeSha256, null);
  assert.equal(gate.expectedSourceClosureSha256, null);
  assert.equal(gate.subchecks.concreteTargetKernelTypeFingerprintConfigured, false);
  assert.equal(gate.subchecks.concreteTargetKernelTypeFingerprintMatches, false);
  assert.equal(gate.subchecks.sourceClosureFingerprintConfigured, false);
  assert.equal(gate.subchecks.sourceClosureFingerprintMatches, false);
  assert.equal(gate.subchecks.concreteTargetPresent, true);
  assert.equal(inventory.concreteTargetCandidate?.name, 'PNP.Main.ConcretePEqualsNP');
  assert.equal(inventory.concreteTargetCandidate?.kind, 'definition');
  assert.deepEqual(inventory.concreteTargetCandidate?.axioms, []);
  assert.equal(gate.subchecks.compatibilityRootPresent, false);
  assert.equal(gate.passed, false);

  for (const key of [
    'mathematicalTheoremEstablished',
    'publicTheoremEmissionAllowed',
    'finalTheoremReady',
    'satInPConclusionAccepted',
    'pEqualsNPConclusionAccepted',
    'rootLeanTheoremPresent',
    'rootLeanTheoremBuilt',
    'rootLeanTheoremAxiomAuditPassed',
  ]) assert.equal(status[key], false, key);
  assert.equal(status.publicTheoremStatement, null);
  assert.equal(status.publicTheoremConclusion, null);
  assert.equal(status.projectSpecificAxiomsRemaining, true);
  assert.deepEqual(status.projectSpecificAxiomInventory, inventory.projectAxioms);
  assert.equal(status.remainingBlockers.length, 6);
  assert.equal(status.leanConcreteCNFSATMembershipFormalized, true);
  assert.equal(status.leanConcreteCNFSATMembershipTheorem, 'PNP.Concrete.FinalUniversalDesign.cnfSATInNP');
  assert.equal(status.leanConcreteCNFVerifierCorrectnessFormalized, true);
  assert.equal(status.leanConcreteCNFVerifierNoTimeoutFormalized, true);
  assert.equal(status.leanConcreteCNFWorkAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCNFWorkAuditedDeclarationCount, 766);
  assert.equal(status.leanConcretePipelineTerminalOutputPackingFormalized, true);
  assert.equal(status.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount, 69);
  assert.equal(status.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized, true);
  assert.equal(status.leanConcretePipelineTerminalBridgeAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineTerminalBridgeAuditedDeclarationCount, 59);
  assert.equal(status.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized, true);
  assert.equal(status.leanConcretePipelineInputFramerAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineInputFramerAuditedDeclarationCount, 70);
  assert.equal(status.leanConcretePipelineAllInputFramingFormalized, true);
  assert.equal(status.leanConcretePipelinePairedCompilerAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelinePairedCompilerAuditedDeclarationCount, 28);
  assert.equal(status.leanConcretePipelineCanonicalPairCompilationFormalized, true);
  assert.equal(status.leanConcretePipelineCompilerAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineCompilerAuditedDeclarationCount, 29);
  assert.equal(status.leanConcretePipelineAllInputCompilationFormalized, true);
  assert.equal(status.leanConcretePipelineMalformedInputBehaviorFormalized, true);
  assert.equal(status.leanConcretePipelineRawRefinementFormalized, true);
  assert.equal(status.leanConcretePipelineExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcretePipelineSequentialNamespaceFormalized, true);
  assert.equal(status.leanConcretePipelineSequentialNamespaceAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineSequentialNamespaceAuditedDeclarationCount, 26);
  assert.equal(status.leanConcretePipelineSequentialCompilationFormalized, true);
  assert.equal(status.leanConcretePipelineSequentialCompilerAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineSequentialCompilerAuditedDeclarationCount, 31);
  assert.equal(status.leanConcretePipelineSequentialVerdictAndOutputPreservationFormalized, true);
  assert.equal(status.leanConcretePipelineSequentialExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcretePipelineSequentialStuckFirstTimeoutFormalized, true);
  assert.equal(status.leanConcretePipelineRefinementAxiomAuditPassed, true);
  assert.equal(status.leanConcretePipelineRefinementAuditedDeclarationCount, 16);
  assert.equal(status.leanConcreteFunctionProgramRecursiveCompilationFormalized, true);
  assert.equal(status.leanConcreteDecisionProgramRecursiveCompilationFormalized, true);
  assert.equal(status.leanConcretePolynomialTimeDeciderRawCompilationFormalized, true);
  assert.equal(status.standardComplexityModelFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthAuditedDeclarationCount, 39);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixAuditedDeclarationCount, 40);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderAuditedDeclarationCount, 68);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixAuditedDeclarationCount, 37);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderUnaryPolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderUnaryPolynomialAuditedDeclarationCount, 74);
  assert.equal(status.leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderAuditedDeclarationCount, 84);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixAuditedDeclarationCount, 60);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount, 74);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderDynamicCursorFormalized, false);
  assert.equal(status.leanConcreteCookLevinFormulaBuilderFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(status.leanConcreteCookLevinBuilderPolynomialReductionFormalized, false);
  assert.equal(gate.subchecks.standardComplexityModelEligible, true);
  assert.equal(status.leanConcreteCNFSATInPFormalized, false);
  assert.equal(status.leanConcreteCNFNPCompletenessFormalized, false);

  const membership = inventory.milestoneCandidates.find((candidate) => candidate.name === status.leanConcreteCNFSATMembershipTheorem);
  assert.equal(membership.kind, 'theorem');
  assert.equal(membership.module, 'PNP.Concrete.CNFWorkUniversalCorrectness');
  assert.deepEqual(membership.axioms, []);
  assert.equal(membership.kernelType, 'Lean.Expr.app (Lean.Expr.const `PNP.Concrete.InNP []) (Lean.Expr.const `PNP.Concrete.CNFSAT [])');

  const cookLevinBridge = inventory.milestoneCandidates.find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language');
  assert.equal(cookLevinBridge.kind, 'theorem');
  assert.equal(cookLevinBridge.module, 'PNP.Concrete.CookLevinRawTapeBridge');
  assert.deepEqual(cookLevinBridge.axioms, ['Classical.choice', 'Quot.sound', 'propext']);
  const formulaSize = inventory.milestoneCandidates.find((candidate) => candidate.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le');
  assert.equal(formulaSize.kind, 'theorem');
  assert.equal(formulaSize.module, 'PNP.Concrete.CookLevinFormulaSize');
  assert.deepEqual(formulaSize.axioms, ['Quot.sound', 'propext']);
  for (const name of [
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula',
  ]) {
    const schedule = inventory.milestoneCandidates.find((candidate) => candidate.name === name);
    assert.equal(schedule.kind, 'theorem', name);
    assert.equal(schedule.module, 'PNP.Concrete.CookLevinFormulaSchedule', name);
    assert.deepEqual(schedule.axioms, ['Quot.sound', 'propext'], name);
  }
  for (const absent of ['PNP.Concrete.cnfSATNPComplete', 'PNP.Concrete.cnfSATInP', 'PNP.Main.p_eq_np']) {
    assert.equal(inventory.milestoneCandidates.some((candidate) => candidate.name === absent), false, absent);
  }
  const builderMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-input-length');
  assert.equal(builderMilestone.requiredTheorems.length, 10);
  for (const theoremRow of builderMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderInputLength', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const builderPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-input-prefix');
  assert.equal(builderPrefixMilestone.requiredTheorems.length, 14);
  for (const theoremRow of builderPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderInputPrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const builderTokenMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-token-appender');
  assert.equal(builderTokenMilestone.requiredTheorems.length, 17);
  for (const theoremRow of builderTokenMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderTokenAppender', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const firstTokenMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-first-token-prefix');
  assert.equal(firstTokenMilestone.requiredTheorems.length, 25);
  for (const theoremRow of firstTokenMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderFirstTokenPrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const completeHeaderMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-complete-header');
  assert.equal(completeHeaderMilestone.requiredTheorems.length, 48);
  for (const theoremRow of completeHeaderMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.ok([
      'PNP.Concrete.CookLevinBuilderUnaryPolynomial',
      'PNP.Concrete.CookLevinBuilderCompleteHeader',
    ].includes(builder.module), theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const bodyStartMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-body-start-prefix');
  assert.equal(bodyStartMilestone.requiredTheorems.length, 42);
  for (const theoremRow of bodyStartMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderBodyStartPrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const firstLiteralMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-first-literal-prefix');
  assert.equal(firstLiteralMilestone.requiredTheorems.length, 52);
  for (const theoremRow of firstLiteralMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderFirstLiteralPrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const firstClauseMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-first-clause-prefix');
  assert.equal(firstClauseMilestone.requiredTheorems.length, 43);
  for (const theoremRow of firstClauseMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name === 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rule_source_ne_acceptState'
      ? 'PNP.Concrete.CookLevinBuilderFirstLiteralPrefix'
      : 'PNP.Concrete.CookLevinBuilderFirstClausePrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const dynamicCursorStepMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-dynamic-token-cursor-step');
  assert.equal(dynamicCursorStepMilestone.requiredTheorems.length, 31);
  for (const theoremRow of dynamicCursorStepMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  const firstClausePaddingRunMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-first-clause-padding-run');
  assert.equal(firstClausePaddingRunMilestone.requiredTheorems.length, 48);
  for (const theoremRow of firstClausePaddingRunMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name === 'PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact_of_unit_or_separator'
      ? 'PNP.Concrete.CookLevinBuilderCompleteHeader'
      : 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount, 84);
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized, true);
  const secondClauseSeparatorStepMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-clause-separator-step');
  assert.equal(secondClauseSeparatorStepMilestone.requiredTheorems.length, 40);
  for (const theoremRow of secondClauseSeparatorStepMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  const secondClauseFirstLiteralPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-clause-first-literal-prefix');
  assert.equal(secondClauseFirstLiteralPrefixMilestone.requiredTheorems.length, 58);
  for (const theoremRow of secondClauseFirstLiteralPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderSecondClauseFirstLiteralPrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount, 87);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  const secondClauseSecondLiteralPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-clause-second-literal-prefix');
  assert.equal(secondClauseSecondLiteralPrefixMilestone.requiredTheorems.length, 75);
  for (const theoremRow of secondClauseSecondLiteralPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount, 115);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  const secondClausePrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-clause-prefix');
  assert.equal(secondClausePrefixMilestone.requiredTheorems.length, 41);
  for (const theoremRow of secondClausePrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderSecondClausePrefix', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixAuditedDeclarationCount, 57);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixClauseTerminatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  const secondClausePaddingRunMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-clause-padding-run');
  assert.equal(secondClausePaddingRunMilestone.requiredTheorems.length, 39);
  for (const theoremRow of secondClausePaddingRunMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    assert.equal(builder.module, theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.')
      ? 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun'
      : 'PNP.Concrete.CookLevinBuilderSecondClausePaddingRun', theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  const thirdClauseSeparatorStepMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-third-clause-separator-step');
  assert.equal(thirdClauseSeparatorStepMilestone.requiredTheorems.length, 40);
  for (const theoremRow of thirdClauseSeparatorStepMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep'
        : 'PNP.Concrete.CookLevinBuilderThirdClauseSeparatorStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  const thirdClauseFirstLiteralPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-third-clause-first-literal-prefix');
  assert.equal(thirdClauseFirstLiteralPrefixMilestone.requiredTheorems.length, 58);
  for (const theoremRow of thirdClauseFirstLiteralPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseFirstLiteralPrefix'
        : 'PNP.Concrete.CookLevinBuilderThirdClauseFirstLiteralPrefix';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount, 87);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  const thirdClauseSecondLiteralPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-third-clause-second-literal-prefix');
  assert.equal(thirdClauseSecondLiteralPrefixMilestone.requiredTheorems.length, 92);
  for (const theoremRow of thirdClauseSecondLiteralPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderThirdClauseSecondLiteralPrefix';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount, 145);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  const thirdClausePrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-third-clause-prefix');
  assert.equal(thirdClausePrefixMilestone.requiredTheorems.length, 41);
  for (const theoremRow of thirdClausePrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderThirdClausePrefix';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixAuditedDeclarationCount, 57);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixClauseTerminatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  const thirdClausePaddingRunMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-third-clause-padding-run');
  assert.equal(thirdClausePaddingRunMilestone.requiredTheorems.length, 39);
  for (const theoremRow of thirdClausePaddingRunMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.')
      ? 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun'
      : 'PNP.Concrete.CookLevinBuilderThirdClausePaddingRun';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  const fourthClauseSeparatorStepMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-separator-step');
  assert.equal(fourthClauseSeparatorStepMilestone.requiredTheorems.length, 40);
  for (const theoremRow of fourthClauseSeparatorStepMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep'
        : 'PNP.Concrete.CookLevinBuilderFourthClauseSeparatorStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  const fourthClauseFirstLiteralPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-first-literal-prefix');
  assert.equal(fourthClauseFirstLiteralPrefixMilestone.requiredTheorems.length, 75);
  for (const theoremRow of fourthClauseFirstLiteralPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix'
        : 'PNP.Concrete.CookLevinBuilderFourthClauseFirstLiteralPrefix';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount, 115);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  const fourthClauseSecondLiteralPrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-second-literal-prefix');
  assert.equal(fourthClauseSecondLiteralPrefixMilestone.requiredTheorems.length, 92);
  for (const theoremRow of fourthClauseSecondLiteralPrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.')
        ? 'PNP.Concrete.CookLevinBuilderThirdClauseSecondLiteralPrefix'
        : 'PNP.Concrete.CookLevinBuilderFourthClauseSecondLiteralPrefix';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount, 147);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  const fourthClausePrefixMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-prefix');
  assert.equal(fourthClausePrefixMilestone.requiredTheorems.length, 41);
  for (const theoremRow of fourthClausePrefixMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : 'PNP.Concrete.CookLevinBuilderFourthClausePrefix';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePrefixFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePrefixAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePrefixAuditedDeclarationCount, 57);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  const fourthClausePaddingRunMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-fourth-clause-padding-run');
  assert.equal(fourthClausePaddingRunMilestone.requiredTheorems.length, 39);
  for (const theoremRow of fourthClausePaddingRunMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.')
      ? 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun'
      : 'PNP.Concrete.CookLevinBuilderFourthClausePaddingRun';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFourthClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  const fifthClausePaddingRunMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-fifth-clause-padding-run');
  assert.equal(fifthClausePaddingRunMilestone.requiredTheorems.length, 39);
  for (const theoremRow of fifthClausePaddingRunMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.')
      ? 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun'
      : 'PNP.Concrete.CookLevinBuilderFifthClausePaddingRun';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunPaddingCountFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFifthClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  const firstConstraintPaddingRunMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-first-constraint-padding-run');
  assert.equal(firstConstraintPaddingRunMilestone.requiredTheorems.length, 39);
  assert.match(firstConstraintPaddingRunMilestone.nonClaim, /observes but does not emit that separator/);
  for (const theoremRow of firstConstraintPaddingRunMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.')
      ? 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun'
      : 'PNP.Concrete.CookLevinBuilderFirstConstraintPaddingRun';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAuditedDeclarationCount, 68);
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunPaddingCountFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunSecondConstraintSeparatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintSeparatorMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-separator-step');
  assert.equal(secondConstraintSeparatorMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintSeparatorMilestone.scope, /emits exactly the Sep beginning the second scheduled constraint/u);
  assert.match(secondConstraintSeparatorMilestone.nonClaim, /does not emit the following T/u);
  for (const theoremRow of secondConstraintSeparatorMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintSeparatorStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepSecondConstraintSeparatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintFirstLiteralSignMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-sign-step');
  assert.equal(secondConstraintFirstLiteralSignMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintFirstLiteralSignMilestone.scope, /emits exactly the positive sign beginning the second scheduled constraint's first literal/u);
  assert.match(secondConstraintFirstLiteralSignMilestone.nonClaim, /does not emit the following unary T/u);
  for (const theoremRow of secondConstraintFirstLiteralSignMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralSignStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAuditedDeclarationCount, 56);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepSecondConstraintFirstLiteralSignFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintFirstLiteralFirstUnaryMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-first-unary-unit-step');
  assert.equal(secondConstraintFirstLiteralFirstUnaryMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintFirstLiteralFirstUnaryMilestone.scope, /emits exactly the first unary T of the second scheduled constraint's first variable index/u);
  assert.match(secondConstraintFirstLiteralFirstUnaryMilestone.nonClaim, /does not emit the following second unary T/u);
  for (const theoremRow of secondConstraintFirstLiteralFirstUnaryMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAuditedDeclarationCount, 56);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSecondConstraintFirstLiteralFirstUnaryUnitFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintFirstLiteralSecondUnaryMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-second-unary-unit-step');
  assert.equal(secondConstraintFirstLiteralSecondUnaryMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintFirstLiteralSecondUnaryMilestone.scope, /emits exactly the second unary T of the second scheduled constraint's first variable index/u);
  assert.match(secondConstraintFirstLiteralSecondUnaryMilestone.nonClaim, /does not emit the following third unary T/u);
  for (const theoremRow of secondConstraintFirstLiteralSecondUnaryMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAuditedDeclarationCount, 56);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondConstraintFirstLiteralSecondUnaryUnitFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintFirstLiteralThirdUnaryMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-third-unary-unit-step');
  assert.equal(secondConstraintFirstLiteralThirdUnaryMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintFirstLiteralThirdUnaryMilestone.scope, /emits exactly the third and final unary T of the second scheduled constraint's first variable index/u);
  assert.match(secondConstraintFirstLiteralThirdUnaryMilestone.nonClaim, /does not emit the following terminating F/u);
  for (const theoremRow of secondConstraintFirstLiteralThirdUnaryMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAuditedDeclarationCount, 56);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepSecondConstraintFirstLiteralThirdUnaryUnitFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintFirstLiteralTerminatorMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-terminator-step');
  assert.equal(secondConstraintFirstLiteralTerminatorMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintFirstLiteralTerminatorMilestone.scope, /emits exactly the terminating F of the second scheduled constraint's first literal/u);
  assert.match(secondConstraintFirstLiteralTerminatorMilestone.nonClaim, /does not emit the following Finish in the width-one case or the following positive T in wider cases/u);
  for (const theoremRow of secondConstraintFirstLiteralTerminatorMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
      ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.')
        ? 'PNP.Concrete.CookLevinBuilderSecondClauseFirstLiteralPrefix'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAuditedDeclarationCount, 56);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepSecondConstraintFirstLiteralTerminatorFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintFirstLiteralSuccessorMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-first-literal-successor-token-step');
  assert.equal(secondConstraintFirstLiteralSuccessorMilestone.requiredTheorems.length, 40);
assert.match(secondConstraintFirstLiteralSuccessorMilestone.scope, /emits Finish exactly when tapeWidth is one and T at every wider width/u);
assert.match(secondConstraintFirstLiteralSuccessorMilestone.nonClaim, /does not emit the following padding opportunity at width one or unary T at wider widths/u);
  for (const theoremRow of secondConstraintFirstLiteralSuccessorMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
      ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
      : 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAuditedDeclarationCount, 82);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSecondConstraintFirstLiteralSuccessorTokenFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepInputPrefixAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintPaddingOrUnaryMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-padding-or-unary-opportunity-step');
  assert.equal(secondConstraintPaddingOrUnaryMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintPaddingOrUnaryMilestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(secondConstraintPaddingOrUnaryMilestone.scope, /at every wider width it appends exactly the first unary T of the second literal/u);
  assert.match(secondConstraintPaddingOrUnaryMilestone.nonClaim, /does not consume the following padding opportunity at width one or second unary T at wider widths/u);
  for (const theoremRow of secondConstraintPaddingOrUnaryMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
      ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
      : 'PNP.Concrete.CookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintSecondPaddingOrUnaryMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-second-padding-or-unary-opportunity-step');
  assert.equal(secondConstraintSecondPaddingOrUnaryMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintSecondPaddingOrUnaryMilestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(secondConstraintSecondPaddingOrUnaryMilestone.scope, /at every wider width it appends exactly the second unary T of the second literal/u);
  assert.match(secondConstraintSecondPaddingOrUnaryMilestone.nonClaim, /does not consume the following padding opportunity at width one or third unary T at wider widths/u);
  for (const theoremRow of secondConstraintSecondPaddingOrUnaryMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
      ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepSecondPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintThirdPaddingOrUnaryMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-third-padding-or-unary-opportunity-step');
  assert.equal(secondConstraintThirdPaddingOrUnaryMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintThirdPaddingOrUnaryMilestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(secondConstraintThirdPaddingOrUnaryMilestone.scope, /at every wider width it appends exactly the third unary T of the second literal/u);
  assert.match(secondConstraintThirdPaddingOrUnaryMilestone.nonClaim, /does not consume the following padding opportunity at width one or fourth unary T at wider widths/u);
  for (const theoremRow of secondConstraintThirdPaddingOrUnaryMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
      ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepThirdPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintFourthPaddingOrUnaryMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-fourth-padding-or-unary-opportunity-step');
  assert.equal(secondConstraintFourthPaddingOrUnaryMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintFourthPaddingOrUnaryMilestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(secondConstraintFourthPaddingOrUnaryMilestone.scope, /at every wider width it appends exactly the fourth unary T of the second literal/u);
  assert.match(secondConstraintFourthPaddingOrUnaryMilestone.nonClaim, /does not consume the following padding opportunity at width one or terminating F at wider widths/u);
  for (const theoremRow of secondConstraintFourthPaddingOrUnaryMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
      ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFourthPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintFifthPaddingOrTerminatorMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-fifth-padding-or-terminator-opportunity-step');
  assert.equal(secondConstraintFifthPaddingOrTerminatorMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintFifthPaddingOrTerminatorMilestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(secondConstraintFifthPaddingOrTerminatorMilestone.scope, /at every wider width it appends exactly the terminating F of the second literal/u);
  assert.match(secondConstraintFifthPaddingOrTerminatorMilestone.nonClaim, /does not consume the following padding opportunity at width one or opening unary T at wider widths/u);
  for (const theoremRow of secondConstraintFifthPaddingOrTerminatorMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
      ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
      : 'PNP.Concrete.CookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFifthPaddingOrTerminatorOpportunityFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepInputPrefixOptionalTerminatorAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  const secondConstraintSixthPaddingOrOpeningUnaryMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-sixth-padding-or-opening-unary-opportunity-step');
  assert.equal(secondConstraintSixthPaddingOrOpeningUnaryMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintSixthPaddingOrOpeningUnaryMilestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(secondConstraintSixthPaddingOrOpeningUnaryMilestone.scope, /at every wider width it appends exactly the opening positive T of the following literal/u);
  assert.match(secondConstraintSixthPaddingOrOpeningUnaryMilestone.nonClaim, /does not consume the following padding opportunity at width one or first unary-index T at wider widths/u);
  for (const theoremRow of secondConstraintSixthPaddingOrOpeningUnaryMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
      ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepSixthPaddingOrOpeningUnaryOpportunityFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);

  const packer = inventory.milestoneCandidates.find((candidate) => candidate.name === 'PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq');
  assert.equal(packer.kind, 'theorem');
  assert.equal(packer.module, 'PNP.Concrete.TerminalOutputPacker');
  assert.deepEqual(packer.axioms, []);
  const terminalBridge = inventory.milestoneCandidates.find((candidate) => candidate.name === 'PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents');
  assert.equal(terminalBridge.kind, 'theorem');
  assert.equal(terminalBridge.module, 'PNP.Concrete.PipelineTerminalBridge');
  assert.deepEqual(terminalBridge.axioms, []);
  for (const name of [
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout',
    'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff',
  ]) {
    const paired = inventory.milestoneCandidates.find((candidate) => candidate.name === name);
    assert.equal(paired.kind, 'theorem', name);
    assert.equal(paired.module, 'PNP.Concrete.PipelinePairedCompiler', name);
    assert.deepEqual(paired.axioms, [], name);
  }
  for (const name of [
    'PNP.Concrete.PipelineCompiler.pipeline_correct',
    'PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_ne_timeout',
    'PNP.Concrete.PipelineCompiler.pipeline_accepts_iff',
    'PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact',
  ]) {
    const compiler = inventory.milestoneCandidates.find((candidate) => candidate.name === name);
    assert.equal(compiler.kind, 'theorem', name);
    assert.equal(compiler.module, 'PNP.Concrete.PipelineCompiler', name);
    assert.deepEqual(compiler.axioms, [], name);
  }
  for (const name of [
    'PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact',
    'PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents',
    'PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted',
    'PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le',
    'PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound',
    'PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent',
    'PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept',
    'PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout',
  ]) {
    const framer = inventory.milestoneCandidates.find((candidate) => candidate.name === name);
    assert.equal(framer.kind, 'theorem', name);
    assert.equal(framer.module, 'PNP.Concrete.PipelineInputFramer', name);
    assert.deepEqual(framer.axioms, [], name);
  }
  for (const [name, module] of [
    ['PNP.Concrete.PipelineSequentialCompiler.sequential_correct', 'PNP.Concrete.PipelineSequentialCompiler'],
    ['PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq', 'PNP.Concrete.PipelineSequentialCompiler'],
    ['PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq', 'PNP.Concrete.PipelineSequentialCompiler'],
    ['PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout', 'PNP.Concrete.PipelineSequentialCompiler'],
    ['PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff', 'PNP.Concrete.PipelineSequentialCompiler'],
    ['PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact', 'PNP.Concrete.PipelineSequentialCompiler'],
    ['PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin', 'PNP.Concrete.PipelineRefinement'],
    ['PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq', 'PNP.Concrete.PipelineRefinement'],
    ['PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin', 'PNP.Concrete.PipelineRefinement'],
    ['PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq', 'PNP.Concrete.PipelineRefinement'],
    ['PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff', 'PNP.Concrete.PipelineRefinement'],
  ]) {
    const compiler = inventory.milestoneCandidates.find((candidate) => candidate.name === name);
    assert.equal(compiler.kind, 'theorem', name);
    assert.equal(compiler.module, module, name);
    assert.deepEqual(compiler.axioms, [], name);
  }
  assert.equal(inventory.milestoneCandidates.length, 2152);

  const secondConstraintSeventhPaddingOrUnaryMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-builder-second-constraint-seventh-padding-or-unary-opportunity-step');
  assert.equal(secondConstraintSeventhPaddingOrUnaryMilestone.requiredTheorems.length, 40);
  assert.match(secondConstraintSeventhPaddingOrUnaryMilestone.scope, /At tapeWidth one it consumes padding and emits no token/u);
  assert.match(secondConstraintSeventhPaddingOrUnaryMilestone.scope, /at every wider width it appends exactly the first unary-index T of the following literal/u);
  assert.match(secondConstraintSeventhPaddingOrUnaryMilestone.nonClaim, /does not consume the following padding opportunity at width one or second unary-index T at wider widths/u);
  for (const theoremRow of secondConstraintSeventhPaddingOrUnaryMilestone.theoremRows) {
    const builder = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(builder.kind, 'theorem', theoremRow.name);
    const expectedModule = theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
      ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
      : theoremRow.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep';
    assert.equal(builder.module, expectedModule, theoremRow.name);
    assert.deepEqual(builder.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepSeventhPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);

  const lockedNANDCarrierTraceMilestone = status.formalPublicationMilestones.find((row) => row.id === 'locked-nand-global-carrier-trace-equivalence');
  assert.equal(lockedNANDCarrierTraceMilestone.requiredTheorems.length, 8);
  assert.equal(lockedNANDCarrierTraceMilestone.classification, 'formalized');
  assert.equal(lockedNANDCarrierTraceMilestone.earned, true);
  assert.match(lockedNANDCarrierTraceMilestone.scope, /arbitrary finite topological NAND circuits/u);
  assert.match(lockedNANDCarrierTraceMilestone.nonClaim, /does not assemble the complete exposed candidates/u);
  for (const theoremRow of lockedNANDCarrierTraceMilestone.theoremRows) {
    const theorem = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(theorem.kind, 'theorem', theoremRow.name);
    assert.equal(theorem.module, 'PNP.LockedNANDCarrierTrace', theoremRow.name);
    assert.deepEqual(theorem.axioms, ['Quot.sound', 'propext'], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanLockedNANDCarrierLayoutFormalized, true);
  assert.equal(status.leanLockedNANDCarrierTraceAxiomAuditPassed, true);
  assert.equal(status.leanLockedNANDCarrierTraceAuditedDeclarationCount, 71);

  const lockedNANDGlobalCandidateMilestone = status.formalPublicationMilestones.find((row) => row.id === 'locked-nand-global-candidate-assembly');
  assert.equal(lockedNANDGlobalCandidateMilestone.requiredTheorems.length, 11);
  assert.equal(lockedNANDGlobalCandidateMilestone.classification, 'formalized');
  assert.equal(lockedNANDGlobalCandidateMilestone.earned, true);
  assert.match(lockedNANDGlobalCandidateMilestone.scope, /B\/B baseline and B\+4\/B\+1 extension/u);
  assert.match(lockedNANDGlobalCandidateMilestone.nonClaim, /does not prove global BaselineDistinct/u);
  for (const theoremRow of lockedNANDGlobalCandidateMilestone.theoremRows) {
    const theorem = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(theorem.kind, 'theorem', theoremRow.name);
    assert.equal(theorem.module, 'PNP.LockedNANDGlobalCandidates', theoremRow.name);
    assert.deepEqual(theorem.axioms, ['Quot.sound', 'propext'], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanLockedNANDGlobalCandidateAssemblyFormalized, true);
  assert.equal(status.leanLockedNANDGlobalBaselineCandidateFormalized, true);
  assert.equal(status.leanLockedNANDGlobalCandidateAxiomAuditPassed, true);
  assert.equal(status.leanLockedNANDGlobalCandidateAuditedDeclarationCount, 71);

  const lockedNANDGlobalBaselineDistinctMilestone = status.formalPublicationMilestones.find((row) => row.id === 'locked-nand-global-baseline-distinct');
  assert.equal(lockedNANDGlobalBaselineDistinctMilestone.requiredTheorems.length, 5);
  assert.equal(lockedNANDGlobalBaselineDistinctMilestone.classification, 'formalized');
  assert.equal(lockedNANDGlobalBaselineDistinctMilestone.earned, true);
  assert.match(lockedNANDGlobalBaselineDistinctMilestone.scope, /nonconstant, nonprojections, pairwise semantically distinct/u);
  assert.match(lockedNANDGlobalBaselineDistinctMilestone.nonClaim, /does not prove either whole-carrier final-output branch law/u);
  for (const theoremRow of lockedNANDGlobalBaselineDistinctMilestone.theoremRows) {
    const theorem = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(theorem.kind, 'theorem', theoremRow.name);
    assert.equal(theorem.module, 'PNP.LockedNANDGlobalCandidates', theoremRow.name);
    assert.deepEqual(theorem.axioms, ['Quot.sound', 'propext'], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanLockedNANDGlobalBaselineDistinctFormalized, true);
  assert.equal(status.leanLockedNANDGlobalBaselineDistinctAxiomAuditPassed, true);
  assert.equal(status.leanLockedNANDGlobalBaselineDistinctAuditedDeclarationCount, 5);
  assert.equal(status.leanLockedNANDGlobalBaselineDistinctScope, 'arbitrary-finite-topological-nand-circuits-global-baseline-output-conditions-and-exact-reference-minimum');

  const lockedNANDUnsatisfiableFinalZeroMilestone = status.formalPublicationMilestones.find((row) => row.id === 'locked-nand-global-unsatisfiable-final-zero');
  assert.equal(lockedNANDUnsatisfiableFinalZeroMilestone.requiredTheorems.length, 2);
  assert.equal(lockedNANDUnsatisfiableFinalZeroMilestone.classification, 'formalized');
  assert.equal(lockedNANDUnsatisfiableFinalZeroMilestone.earned, true);
  assert.match(lockedNANDUnsatisfiableFinalZeroMilestone.scope, /unsatisfiability makes the full final coordinate identically false/u);
  assert.match(lockedNANDUnsatisfiableFinalZeroMilestone.nonClaim, /does not prove satisfiable FinalLockSeparation/u);
  for (const theoremRow of lockedNANDUnsatisfiableFinalZeroMilestone.theoremRows) {
    const theorem = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(theorem.kind, 'theorem', theoremRow.name);
    assert.equal(theorem.module, 'PNP.LockedNANDGlobalUnsatisfiableFinalZero', theoremRow.name);
    assert.deepEqual(theorem.axioms, ['Quot.sound', 'propext'], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanLockedNANDUnsatisfiableFinalZeroFormalized, true);
  assert.equal(status.leanLockedNANDUnsatisfiableFinalZeroAxiomAuditPassed, true);
  assert.equal(status.leanLockedNANDUnsatisfiableFinalZeroAuditedDeclarationCount, 2);
  assert.equal(status.leanLockedNANDUnsatisfiableFinalZeroScope, 'arbitrary-finite-topological-nand-circuits-whole-carrier-unsatisfiable-final-zero-and-exact-reference-minimum');
  const lockedNANDGlobalSemanticThresholdMilestone = status.formalPublicationMilestones.find((row) => row.id === 'locked-nand-global-semantic-threshold');
  assert.equal(lockedNANDGlobalSemanticThresholdMilestone.requiredTheorems.length, 8);
  assert.equal(lockedNANDGlobalSemanticThresholdMilestone.classification, 'formalized');
  assert.equal(lockedNANDGlobalSemanticThresholdMilestone.earned, true);
  assert.match(lockedNANDGlobalSemanticThresholdMilestone.scope, /crosses the exact source-derived minimum threshold exactly when the source circuit is satisfiable/u);
  assert.match(lockedNANDGlobalSemanticThresholdMilestone.nonClaim, /does not construct or compile the report's encoded polynomial-time SAT-to-locked-NAND builder/u);
  for (const theoremRow of lockedNANDGlobalSemanticThresholdMilestone.theoremRows) {
    const theorem = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(theorem.kind, 'theorem', theoremRow.name);
    assert.equal(
      theorem.module,
      theoremRow.name === 'PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_referenceMinimum_eq_baseline_of_unsatisfiable'
        ? 'PNP.LockedNANDGlobalUnsatisfiableFinalZero'
        : 'PNP.LockedNANDGlobalSemanticThreshold',
      theoremRow.name
    );
    assert.deepEqual(theorem.axioms, ['Quot.sound', 'propext'], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanLockedNANDDerivedFinalOutputLawsFormalized, true);
  assert.equal(status.leanLockedNANDResidualSlackAtMostFourFormalized, true);
  assert.equal(status.leanLockedNANDSatisfiableFinalConditionsFormalized, true);
  assert.equal(status.leanLockedNANDGlobalSemanticThresholdFormalized, true);
  assert.equal(status.leanLockedNANDGlobalSemanticThresholdAxiomAuditPassed, true);
  assert.equal(status.leanLockedNANDGlobalSemanticThresholdAuditedDeclarationCount, 8);
  assert.equal(status.leanLockedNANDGlobalSemanticThresholdScope, 'arbitrary-finite-topological-nand-circuits-complete-six-field-premises-and-typed-semantic-threshold');
  assert.deepEqual(status.leanLockedNANDThresholdMissingInstantiationInventory, []);

  const encodedSemanticMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-locked-nand-encoded-semantic-boundary');
  assert.equal(encodedSemanticMilestone.requiredTheorems.length, 11);
  assert.equal(encodedSemanticMilestone.classification, 'formalized-semantic-boundary');
  assert.equal(encodedSemanticMilestone.earned, true);
  assert.match(encodedSemanticMilestone.scope, /strict version-zero bit grammar/u);
  assert.match(encodedSemanticMilestone.nonClaim, /not a parser\/validator machine/u);
  for (const theoremRow of encodedSemanticMilestone.theoremRows) {
    const theorem = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(theorem.kind, 'theorem', theoremRow.name);
    assert.equal(
      theorem.module,
      [
        'PNP.Concrete.LockedNAND.decodeElaboratedCircuit_encodeCircuit_ofCircuit',
        'PNP.Concrete.LockedNAND.encoded_fullCandidate_threshold_iff_satisfiable',
        'PNP.Concrete.LockedNAND.buildLockedNANDInstance_correct',
      ].includes(theoremRow.name)
        ? 'PNP.Concrete.LockedNANDReduction'
        : 'PNP.Concrete.LockedNANDEncoding',
      theoremRow.name
    );
    assert.deepEqual(
      theorem.axioms,
      theoremRow.name === 'PNP.Concrete.LockedNAND.RawCircuit.normalize_eval'
          || theoremRow.name === 'PNP.Concrete.LockedNAND.encoded_fullCandidate_threshold_iff_satisfiable'
          || theoremRow.name === 'PNP.Concrete.LockedNAND.buildLockedNANDInstance_correct'
        ? ['Quot.sound', 'propext']
        : ['propext'],
      theoremRow.name
    );
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteLockedNANDEncodedSemanticReductionFormalized, true);
  assert.equal(status.leanConcreteLockedNANDEncodedSemanticReductionAxiomAuditPassed, true);
  assert.equal(status.leanConcreteLockedNANDEncodedSemanticReductionAuditedDeclarationCount, 48);
  assert.equal(status.leanConcreteLockedNANDCanonicalEncodingFormalized, true);
  assert.equal(status.leanConcreteLockedNANDCompleteCandidateCodecFormalized, true);
  assert.equal(status.leanConcreteLockedNANDNormalizationSemanticsFormalized, true);
  const sourceParserMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-locked-nand-source-parser');
  assert.equal(sourceParserMilestone.requiredTheorems.length, 20);
  assert.equal(sourceParserMilestone.classification, 'formalized-foundation-only');
  assert.equal(sourceParserMilestone.earned, true);
  assert.match(sourceParserMilestone.scope, /literal nine-symbol finite work machine/u);
  assert.match(sourceParserMilestone.scope, /accepts exactly ValidEncodedCircuit/u);
  assert.match(sourceParserMilestone.nonClaim, /does not emit the locked-NAND target/u);
  for (const theoremRow of sourceParserMilestone.theoremRows) {
    const theorem = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(theorem.kind, 'theorem', theoremRow.name);
    assert.match(theorem.module, /^PNP\.Concrete\.LockedNANDSourceParser/u, theoremRow.name);
    assert.deepEqual(theorem.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
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
  assert.equal(status.leanConcreteLockedNANDParserScope, 'literal-228-state-2052-rule-strict-version-zero-all-input-parser-byte-preserving-or-empty-with-compiled-cubic-bound');
  const targetEmitterMilestone = status.formalPublicationMilestones.find((row) => row.id === 'concrete-locked-nand-target-emitter');
  assert.equal(targetEmitterMilestone.requiredTheorems.length, 22);
  assert.equal(targetEmitterMilestone.classification, 'formalized-foundation-only');
  assert.equal(targetEmitterMilestone.earned, true);
  assert.deepEqual(targetEmitterMilestone.requiredTheorems, Object.keys(LOCKED_NAND_TARGET_EMITTER_THEOREM_SHA256));
  for (const theoremRow of targetEmitterMilestone.theoremRows) {
    const theorem = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(theorem.kind, 'theorem', theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, LOCKED_NAND_TARGET_EMITTER_THEOREM_SHA256[theoremRow.name], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
    assert.deepEqual(theorem.axioms, theoremRow.axioms, theoremRow.name);
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
  const polynomialReductionMilestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-locked-nand-polynomial-reduction');
  assert.equal(polynomialReductionMilestone.requiredTheorems.length, 5);
  assert.equal(polynomialReductionMilestone.classification, 'formalized-polynomial-reduction');
  assert.equal(polynomialReductionMilestone.status, 'formalized-polynomial-reduction');
  assert.equal(polynomialReductionMilestone.earned, true);
  assert.deepEqual(
    polynomialReductionMilestone.requiredTheorems,
    Object.keys(LOCKED_NAND_POLYNOMIAL_REDUCTION_THEOREM_SHA256)
  );
  for (const theoremRow of polynomialReductionMilestone.theoremRows) {
    const theorem = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(theorem.kind, 'theorem', theoremRow.name);
    assert.equal(theorem.module, 'PNP.Concrete.LockedNANDPolynomialReduction', theoremRow.name);
    assert.deepEqual(theorem.axioms, ['Quot.sound', 'propext'], theoremRow.name);
    assert.equal(
      theoremRow.actualKernelTypeSha256,
      LOCKED_NAND_POLYNOMIAL_REDUCTION_THEOREM_SHA256[theoremRow.name],
      theoremRow.name
    );
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
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
    'strict-version-zero-parser-emitter-polynomial-reduction-with-exact-language-equivalence-and-recursive-raw-refinement'
  );


  const cnfToNANDReductionMilestone = status.formalPublicationMilestones
    .find((row) => row.id === 'concrete-cnf-to-nand-polynomial-reduction');
  assert.equal(cnfToNANDReductionMilestone.requiredTheorems.length, 28);
  assert.equal(cnfToNANDReductionMilestone.classification, 'formalized-polynomial-reduction');
  assert.equal(cnfToNANDReductionMilestone.status, 'formalized-polynomial-reduction');
  assert.equal(cnfToNANDReductionMilestone.earned, true);
  assert.deepEqual(
    cnfToNANDReductionMilestone.requiredTheorems,
    Object.keys(CNF_TO_NAND_POLYNOMIAL_REDUCTION_THEOREM_SHA256)
  );
  for (const theoremRow of cnfToNANDReductionMilestone.theoremRows) {
    const theorem = inventory.milestoneCandidates.find((candidate) => candidate.name === theoremRow.name);
    assert.equal(theorem.kind, 'theorem', theoremRow.name);
    assert.deepEqual(theorem.axioms, theoremRow.axioms, theoremRow.name);
    assert.equal(
      theoremRow.actualKernelTypeSha256,
      CNF_TO_NAND_POLYNOMIAL_REDUCTION_THEOREM_SHA256[theoremRow.name],
      theoremRow.name
    );
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanConcreteCNFToNANDSemanticCompilerAuditedDeclarationCount, 68);
  assert.equal(status.leanConcreteCNFToNANDFiniteMachineFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDPolynomialTimeFunctionFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDPolynomialReductionFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDPolynomialReductionAxiomAuditPassed, true);
  assert.equal(status.leanConcreteCNFToNANDPolynomialReductionAuditedDeclarationCount, 1316);
  assert.equal(status.leanConcreteCNFToNANDAllInputExactFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDExactMachineOutputFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDCompiledNonTimeoutFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDRawRefinementFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDDirectReductionFormalized, true);
  assert.equal(status.leanConcreteCNFToNANDLockedReductionCompositionFormalized, true);
  const residualGainChainMilestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-gain-chain-bound');
  assert.equal(residualGainChainMilestone.requiredTheorems.length, 14);
  assert.equal(residualGainChainMilestone.classification, 'formalized-iteration-bound-only');
  assert.equal(residualGainChainMilestone.status, 'formalized-iteration-bound-only');
  assert.equal(residualGainChainMilestone.earned, true);
  assert.deepEqual(residualGainChainMilestone.requiredTheorems, Object.keys(RESIDUAL_GAIN_CHAIN_THEOREM_SHA256));
  for (const theoremRow of residualGainChainMilestone.theoremRows) {
    assert.equal(theoremRow.actualKernelTypeSha256, RESIDUAL_GAIN_CHAIN_THEOREM_SHA256[theoremRow.name], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
  }
  assert.equal(status.leanResidualGainChainVerifierFormalized, true);
  assert.equal(status.leanResidualGainChainAxiomAuditPassed, true);
  assert.equal(status.leanResidualGainChainSemanticInvariantFormalized, true);
  assert.equal(status.leanResidualGainChainSlackIterationBoundFormalized, true);
  assert.equal(status.leanResidualGainChainPolynomialRuntimeFormalized, false);

  const residualGainStoppingMilestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-gain-stopping-specification');
  assert.equal(residualGainStoppingMilestone.requiredTheorems.length, 10);
  assert.equal(residualGainStoppingMilestone.classification, 'formalized-semantic-stopping-only');
  assert.equal(residualGainStoppingMilestone.status, 'formalized-semantic-stopping-only');
  assert.equal(residualGainStoppingMilestone.earned, true);
  assert.equal(residualGainStoppingMilestone.allAssumptionFree, true);
  assert.deepEqual(residualGainStoppingMilestone.requiredTheorems, Object.keys(RESIDUAL_GAIN_STOPPING_THEOREM_SHA256));
  for (const theoremRow of residualGainStoppingMilestone.theoremRows) {
    assert.equal(theoremRow.actualKernelTypeSha256, RESIDUAL_GAIN_STOPPING_THEOREM_SHA256[theoremRow.name], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
    assert.deepEqual(theoremRow.axioms, [], theoremRow.name);
  }
  assert.equal(status.leanResidualGainStoppingSpecificationFormalized, true);
  assert.equal(status.leanResidualGainStoppingAxiomAuditPassed, true);
  assert.equal(status.leanResidualGainReferenceMinimumWitnessFormalized, true);
  assert.equal(status.leanResidualGainPositiveIffGlobalStrictGainFormalized, true);
  assert.equal(status.leanResidualGainZeroIffGlobalNoStrictGainFormalized, true);
  assert.equal(status.leanResidualGainSemanticMinimumIffGlobalNoStrictGainFormalized, true);
  assert.equal(status.leanResidualGainChainGlobalStoppingConsequenceFormalized, true);
  assert.equal(status.leanResidualGainChainExactMinimumPackagingFormalized, true);

  const residualTerminalFullBridgeMilestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-terminal-full-carrier-bridge');
  assert.equal(residualTerminalFullBridgeMilestone.requiredTheorems.length, 13);
  assert.equal(residualTerminalFullBridgeMilestone.classification, 'formalized-terminal-full-mode-semantic-bridge');
  assert.equal(residualTerminalFullBridgeMilestone.status, 'formalized-terminal-full-mode-semantic-bridge');
  assert.equal(residualTerminalFullBridgeMilestone.earned, true);
  assert.equal(residualTerminalFullBridgeMilestone.allAssumptionFree, true);
  assert.deepEqual(residualTerminalFullBridgeMilestone.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_FULL_BRIDGE_THEOREM_SHA256));
  for (const theoremRow of residualTerminalFullBridgeMilestone.theoremRows) {
    assert.equal(theoremRow.actualKernelTypeSha256, RESIDUAL_TERMINAL_FULL_BRIDGE_THEOREM_SHA256[theoremRow.name], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
    assert.deepEqual(theoremRow.axioms, [], theoremRow.name);
  }
  assert.equal(status.leanResidualTerminalFullBridgeFormalized, true);
  assert.equal(status.leanResidualTerminalFullBridgeAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalizationExactFormalized, true);
  assert.equal(status.leanResidualTerminalFullMinimumSpecificationFormalized, true);
  assert.equal(status.leanResidualTerminalMuBridgeFormalized, true);
  assert.equal(status.leanResidualWholeSpanPositiveWitnessIffFormalized, true);
  assert.equal(status.leanResidualWholeSpanStrictDescentFormalized, true);
  assert.equal(status.leanResidualWholeSpanZeroAbsenceIffFormalized, true);
  assert.equal(status.leanResidualTerminalQuotientCarrierFormalized, true);
  assert.equal(status.leanResidualTerminalProperSupportFormalized, false);

  const residualTerminalModeFirewallMilestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-terminal-mode-firewall');
  assert.equal(residualTerminalModeFirewallMilestone.requiredTheorems.length, 12);
  assert.equal(residualTerminalModeFirewallMilestone.classification, 'formalized-terminal-mode-firewall');
  assert.equal(residualTerminalModeFirewallMilestone.status, 'formalized-terminal-mode-firewall');
  assert.equal(residualTerminalModeFirewallMilestone.earned, true);
  assert.equal(residualTerminalModeFirewallMilestone.allAssumptionFree, true);
  assert.deepEqual(residualTerminalModeFirewallMilestone.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_MODE_FIREWALL_THEOREM_SHA256));
  for (const theoremRow of residualTerminalModeFirewallMilestone.theoremRows) {
    assert.equal(theoremRow.actualKernelTypeSha256, RESIDUAL_TERMINAL_MODE_FIREWALL_THEOREM_SHA256[theoremRow.name], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
    assert.deepEqual(theoremRow.axioms, [], theoremRow.name);
  }
  assert.equal(status.leanResidualTerminalModeFirewallFormalized, true);
  assert.equal(status.leanResidualTerminalModeFirewallAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalProfileProjectionExactFormalized, true);
  assert.equal(status.leanResidualTerminalCheckedFullLiftFormalized, true);
  assert.equal(status.leanResidualTerminalQuotientEqualityNotConstructiveFormalized, true);
  assert.equal(status.leanResidualTerminalObligationDischargePreservedFormalized, true);

  const residualTerminalProjectionMinimumMilestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-terminal-projection-minimum');
  assert.equal(residualTerminalProjectionMinimumMilestone.requiredTheorems.length, 14);
  assert.equal(residualTerminalProjectionMinimumMilestone.classification, 'formalized-terminal-projection-minimum');
  assert.equal(residualTerminalProjectionMinimumMilestone.status, 'formalized-terminal-projection-minimum');
  assert.equal(residualTerminalProjectionMinimumMilestone.earned, true);
  assert.equal(residualTerminalProjectionMinimumMilestone.allAssumptionFree, false);
  assert.deepEqual(residualTerminalProjectionMinimumMilestone.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_PROJECTION_MINIMUM_THEOREM_SHA256));
  for (const theoremRow of residualTerminalProjectionMinimumMilestone.theoremRows) {
    assert.equal(theoremRow.actualKernelTypeSha256, RESIDUAL_TERMINAL_PROJECTION_MINIMUM_THEOREM_SHA256[theoremRow.name], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
    assert.deepEqual(theoremRow.axioms, ['propext'], theoremRow.name);
  }
  assert.equal(status.leanResidualProjectionMinimumFormalized, true);
  assert.equal(status.leanResidualProjectionMinimumAxiomAuditPassed, true);
  assert.equal(status.leanResidualProjectionMinimumExecutableFullScanFormalized, true);
  assert.equal(status.leanResidualProjectionMinimumExecutableQuotientScanFormalized, true);
  assert.equal(status.leanResidualProjectionMinimumAttainmentFormalized, true);
  assert.equal(status.leanResidualProjectionMinimumUniversalLowerBoundsFormalized, true);
  assert.equal(status.leanResidualProjectionMinimumMonotonicityFormalized, true);
  assert.equal(status.leanResidualProjectionDefectDecompositionFormalized, true);
  assert.equal(status.leanResidualProjectionDefectZeroIffCheckedLiftAtMinimumFormalized, true);
  assert.equal(status.leanPCCMinPolynomialRuntimeFormalized, false);

  const residualTerminalProjectionTransferMilestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-terminal-projection-transfer');
  assert.equal(residualTerminalProjectionTransferMilestone.requiredTheorems.length, 4);
  assert.equal(residualTerminalProjectionTransferMilestone.classification, 'formalized-terminal-projection-transfer');
  assert.equal(residualTerminalProjectionTransferMilestone.status, 'formalized-terminal-projection-transfer');
  assert.equal(residualTerminalProjectionTransferMilestone.earned, true);
  assert.equal(residualTerminalProjectionTransferMilestone.allAssumptionFree, false);
  assert.deepEqual(residualTerminalProjectionTransferMilestone.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_PROJECTION_TRANSFER_THEOREM_SHA256));
  for (const theoremRow of residualTerminalProjectionTransferMilestone.theoremRows) {
    assert.equal(theoremRow.actualKernelTypeSha256, RESIDUAL_TERMINAL_PROJECTION_TRANSFER_THEOREM_SHA256[theoremRow.name], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
    assert.equal(theoremRow.axioms.every((axiom) => ['Quot.sound', 'propext'].includes(axiom)), true, theoremRow.name);
  }
  assert.equal(status.leanResidualProjectionTransferFormalized, true);
  assert.equal(status.leanResidualProjectionTransferAxiomAuditPassed, true);
  assert.equal(status.leanResidualProjectionTransferSignedDeltasFormalized, true);
  assert.equal(status.leanResidualProjectionTransferIdentityFormalized, true);
  assert.equal(status.leanResidualProjectionTransferConstantCutFormalized, true);

  const residualTerminalSaturationMilestone = status.formalPublicationMilestones
    .find((row) => row.id === 'residual-terminal-saturation-closure');
  assert.equal(residualTerminalSaturationMilestone.requiredTheorems.length, 7);
  assert.equal(residualTerminalSaturationMilestone.classification, 'formalized-terminal-saturation-closure');
  assert.equal(residualTerminalSaturationMilestone.status, 'formalized-terminal-saturation-closure');
  assert.equal(residualTerminalSaturationMilestone.earned, true);
  assert.equal(residualTerminalSaturationMilestone.allAssumptionFree, false);
  assert.equal(residualTerminalSaturationMilestone.axiomClosureUsesOnlyLeanStandardAllowlist, true);
  assert.deepEqual(residualTerminalSaturationMilestone.requiredTheorems, Object.keys(RESIDUAL_TERMINAL_SATURATION_THEOREM_SHA256));
  for (const theoremRow of residualTerminalSaturationMilestone.theoremRows) {
    assert.equal(theoremRow.actualKernelTypeSha256, RESIDUAL_TERMINAL_SATURATION_THEOREM_SHA256[theoremRow.name], theoremRow.name);
    assert.equal(theoremRow.actualKernelTypeSha256, theoremRow.expectedKernelTypeSha256, theoremRow.name);
    assert.equal(theoremRow.axioms.every((axiom) => ['Quot.sound', 'propext'].includes(axiom)), true, theoremRow.name);
  }
  assert.equal(status.leanResidualTerminalSaturationFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationAxiomAuditPassed, true);
  assert.equal(status.leanResidualTerminalPrimitiveUniverseFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationExtensiveFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationLeastFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationMonotoneFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationIdempotentFormalized, true);
  assert.equal(status.leanResidualTerminalSaturationScope, 'all-finite-terminal-primitive-record-universes-with-explicit-boolean-rule-tagged-dependencies');
  assert.equal(status.leanResidualTerminalSupportCompletionFormalized, false);
  assert.equal(status.leanResidualTerminalSquareLegitimacyFormalized, false);
  assert.equal(status.leanResidualTerminalProjectionSquareFormalized, false);

  assert.equal(status.formalPublicationMilestones.length, 81);
  assert.deepEqual(status.formalPublicationMilestones.map((row) => row.earned), [...Array(78).fill(true), false, false, false]);
  for (const row of status.formalPublicationMilestones.slice(0, 78)) {
    assert.equal(row.allPresent, true, row.id);
    assert.equal(row.allKernelTypesMatch, true, row.id);
    assert.equal(row.sourceClosureFingerprintMatches, true, row.id);
    assert.equal(row.theoremRows.every((theorem) => theorem.axioms.every((axiom) => ['Classical.choice', 'Quot.sound', 'propext'].includes(axiom))), true, row.id);
  }
  assert.equal(status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-tableau-cnf-semantics').allAssumptionFree, false);
  assert.equal(status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-raw-tape-bridge').allAssumptionFree, false);
  assert.equal(status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-formula-size').earned, true);
  assert.equal(status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-formula-schedule').earned, true);
  const cursor = status.formalPublicationMilestones.find((row) => row.id === 'concrete-cook-levin-formula-cursor');
  assert.equal(cursor.earned, true);
  assert.equal(cursor.requiredTheorems.length, 16);
  assert.equal(builderMilestone.earned, true);
  assert.equal(builderPrefixMilestone.earned, true);
  assert.equal(builderTokenMilestone.earned, true);
  assert.equal(completeHeaderMilestone.earned, true);
  assert.equal(bodyStartMilestone.earned, true);
  assert.equal(firstLiteralMilestone.earned, true);
  assert.equal(secondClauseFirstLiteralPrefixMilestone.earned, true);
  assert.equal(secondClausePaddingRunMilestone.earned, true);
  assert.equal(thirdClausePaddingRunMilestone.earned, true);
  assert.equal(fourthClauseSeparatorStepMilestone.earned, true);
  assert.equal(fourthClauseSecondLiteralPrefixMilestone.earned, true);
  assert.equal(fourthClausePaddingRunMilestone.earned, true);
  assert.equal(secondConstraintFirstLiteralSignMilestone.earned, true);
  assert.equal(status.formalPublicationMilestones.at(-1).nonClaim.includes('ineligible'), true);

  for (const command of [
    'lake build PNP',
    'node scripts/export-lean-theorem-inventory.mjs --check',
    'node scripts/generate-formal-publication.mjs --check',
    'npm run report:check',
  ]) assert.ok(status.verificationCommands.includes(command), command);
});

test('formal publication release pins the terminal saturation closure boundary', async () => {
  const release = await readJson('downloads/formal-publication-release.json');
  const parser = release.earnedBoundary;

  assert.equal(release.coordinate, 'PNP-FORMAL-PUBLICATION-RELEASE-2026-08-04-84');
  assert.equal(release.artifacts.report.pageCount, 73);
  assert.equal(release.artifacts.theoremInventory.declarationCount, 24054);
  assert.equal(release.artifacts.theoremInventory.theoremCount, 12985);
  assert.equal(release.artifacts.theoremInventory.assumptionFreeTheoremCount, 6903);
  assert.equal(release.artifacts.theoremInventory.projectAxiomCount, 4);

  assert.equal(parser.cnfToNANDSemanticCompilerAuditedDeclarationCount, 68);
  assert.equal(parser.cnfToNANDFiniteMachineFormalized, true);
  assert.equal(parser.cnfToNANDPolynomialTimeFunctionFormalized, true);
  assert.equal(parser.cnfToNANDPolynomialReductionFormalized, true);
  assert.equal(parser.cnfToNANDPolynomialReductionAxiomAuditPassed, true);
  assert.equal(parser.cnfToNANDPolynomialReductionAuditedDeclarationCount, 1316);
  assert.equal(parser.cnfToNANDPolynomialReductionEmptyAxiomDeclarationCount, 864);
  assert.equal(parser.cnfToNANDPolynomialReductionPropextOnlyDeclarationCount, 151);
  assert.equal(parser.cnfToNANDPolynomialReductionPropextQuotSoundDeclarationCount, 301);
  assert.equal(parser.cnfToNANDAllInputExactFormalized, true);
  assert.equal(parser.cnfToNANDExactMachineOutputFormalized, true);
  assert.equal(parser.cnfToNANDCompiledNonTimeoutFormalized, true);
  assert.equal(parser.cnfToNANDRawRefinementFormalized, true);
  assert.equal(parser.cnfToNANDDirectReductionFormalized, true);
  assert.equal(parser.cnfToNANDLockedReductionCompositionFormalized, true);
  assert.deepEqual(
    parser.cnfToNANDPolynomialReductionTheoremKernelTypeSha256,
    CNF_TO_NAND_POLYNOMIAL_REDUCTION_THEOREM_SHA256
  );
  assert.deepEqual(parser.cnfToNANDPolynomialReductionAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(parser.cnfToNANDPolynomialReductionProjectAxiomClosure, []);
  assert.equal(parser.residualGainChainVerifierFormalized, true);
  assert.equal(parser.residualGainChainAxiomAuditPassed, true);
  assert.equal(parser.residualGainChainAuditedDeclarationCount, 16);
  assert.equal(parser.residualGainChainEmptyAxiomDeclarationCount, 12);
  assert.equal(parser.residualGainChainPropextQuotSoundDeclarationCount, 4);
  assert.equal(parser.residualGainChainSemanticInvariantFormalized, true);
  assert.equal(parser.residualGainChainSlackIterationBoundFormalized, true);
  assert.equal(parser.residualGainChainPolynomialRuntimeFormalized, false);
  assert.deepEqual(parser.residualGainChainTheoremKernelTypeSha256, RESIDUAL_GAIN_CHAIN_THEOREM_SHA256);
  assert.deepEqual(parser.residualGainChainAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(parser.residualGainChainProjectAxiomClosure, []);
  assert.equal(parser.residualGainStoppingSpecificationFormalized, true);
  assert.equal(parser.residualGainStoppingAxiomAuditPassed, true);
  assert.equal(parser.residualGainStoppingAuditedDeclarationCount, 12);
  assert.equal(parser.residualGainStoppingEmptyAxiomDeclarationCount, 12);
  assert.equal(parser.residualGainReferenceMinimumWitnessFormalized, true);
  assert.equal(parser.residualGainPositiveIffGlobalStrictGainFormalized, true);
  assert.equal(parser.residualGainZeroIffGlobalNoStrictGainFormalized, true);
  assert.equal(parser.residualGainSemanticMinimumIffGlobalNoStrictGainFormalized, true);
  assert.equal(parser.residualGainChainGlobalStoppingConsequenceFormalized, true);
  assert.equal(parser.residualGainChainExactMinimumPackagingFormalized, true);
  assert.deepEqual(parser.residualGainStoppingTheoremKernelTypeSha256, RESIDUAL_GAIN_STOPPING_THEOREM_SHA256);
  assert.deepEqual(parser.residualGainStoppingAxiomClosure, []);
  assert.deepEqual(parser.residualGainStoppingProjectAxiomClosure, []);
  assert.equal(parser.residualTerminalFullBridgeFormalized, true);
  assert.equal(parser.residualTerminalFullBridgeAxiomAuditPassed, true);
  assert.equal(parser.residualTerminalFullBridgeAuditedDeclarationCount, 22);
  assert.equal(parser.residualTerminalFullBridgeEmptyAxiomDeclarationCount, 22);
  assert.equal(parser.residualTerminalizationExactFormalized, true);
  assert.equal(parser.residualTerminalFullMinimumSpecificationFormalized, true);
  assert.equal(parser.residualTerminalMuBridgeFormalized, true);
  assert.equal(parser.residualWholeSpanPositiveWitnessIffFormalized, true);
  assert.equal(parser.residualWholeSpanStrictDescentFormalized, true);
  assert.equal(parser.residualWholeSpanZeroAbsenceIffFormalized, true);
  assert.equal(parser.residualTerminalQuotientCarrierFormalized, true);
  assert.equal(parser.residualTerminalProperSupportFormalized, false);
  assert.deepEqual(parser.residualTerminalFullBridgeTheoremKernelTypeSha256, RESIDUAL_TERMINAL_FULL_BRIDGE_THEOREM_SHA256);
  assert.deepEqual(parser.residualTerminalFullBridgeAxiomClosure, []);
  assert.deepEqual(parser.residualTerminalFullBridgeProjectAxiomClosure, []);
  assert.equal(parser.residualTerminalModeFirewallFormalized, true);
  assert.equal(parser.residualTerminalModeFirewallAxiomAuditPassed, true);
  assert.equal(parser.residualTerminalModeFirewallAuditedDeclarationCount, 29);
  assert.equal(parser.residualTerminalModeFirewallEmptyAxiomDeclarationCount, 29);
  assert.equal(parser.residualTerminalProfileProjectionExactFormalized, true);
  assert.equal(parser.residualTerminalCheckedFullLiftFormalized, true);
  assert.equal(parser.residualTerminalQuotientEqualityNotConstructiveFormalized, true);
  assert.equal(parser.residualTerminalObligationDischargePreservedFormalized, true);
  assert.deepEqual(parser.residualTerminalModeFirewallTheoremKernelTypeSha256, RESIDUAL_TERMINAL_MODE_FIREWALL_THEOREM_SHA256);
  assert.deepEqual(parser.residualTerminalModeFirewallAxiomClosure, []);
  assert.deepEqual(parser.residualTerminalModeFirewallProjectAxiomClosure, []);
  assert.equal(parser.residualTerminalQuotientEqualityNotConstructiveTheorem, 'PNP.DirectWire.terminalQuotientEqualityNotConstructive');
  assert.equal(parser.residualProjectionMinimumFormalized, true);
  assert.equal(parser.residualProjectionMinimumAxiomAuditPassed, true);
  assert.equal(parser.residualProjectionMinimumAuditedDeclarationCount, 27);
  assert.equal(parser.residualProjectionMinimumEmptyAxiomDeclarationCount, 9);
  assert.equal(parser.residualProjectionMinimumPropextOnlyDeclarationCount, 18);
  assert.equal(parser.residualProjectionMinimumExecutableFullScanFormalized, true);
  assert.equal(parser.residualProjectionMinimumExecutableQuotientScanFormalized, true);
  assert.equal(parser.residualProjectionMinimumAttainmentFormalized, true);
  assert.equal(parser.residualProjectionMinimumUniversalLowerBoundsFormalized, true);
  assert.equal(parser.residualProjectionMinimumMonotonicityFormalized, true);
  assert.equal(parser.residualProjectionDefectDecompositionFormalized, true);
  assert.equal(parser.residualProjectionDefectZeroIffCheckedLiftAtMinimumFormalized, true);
  assert.deepEqual(parser.residualProjectionMinimumTheoremKernelTypeSha256, RESIDUAL_TERMINAL_PROJECTION_MINIMUM_THEOREM_SHA256);
  assert.deepEqual(parser.residualProjectionMinimumAxiomClosure, ['propext']);
  assert.deepEqual(parser.residualProjectionMinimumProjectAxiomClosure, []);
  assert.equal(parser.residualProjectionTransferFormalized, true);
  assert.equal(parser.residualProjectionTransferAxiomAuditPassed, true);
  assert.equal(parser.residualProjectionTransferSignedDeltasFormalized, true);
  assert.equal(parser.residualProjectionTransferIdentityFormalized, true);
  assert.equal(parser.residualProjectionTransferConstantCutFormalized, true);
  assert.equal(parser.residualProjectionTransferScope, 'all-finite-direct-wire-four-corner-terminal-profile-families-sharing-one-computed-observer-and-one-explicit-projection');
  assert.equal(parser.residualTerminalSaturationFormalized, true);
  assert.equal(parser.residualTerminalSaturationAxiomAuditPassed, true);
  assert.equal(parser.residualTerminalSaturationAuditedDeclarationCount, 18);
  assert.equal(parser.residualTerminalSaturationEmptyAxiomDeclarationCount, 15);
  assert.equal(parser.residualTerminalSaturationPropextQuotSoundDeclarationCount, 3);
  assert.equal(parser.residualTerminalPrimitiveUniverseFormalized, true);
  assert.equal(parser.residualTerminalSaturationExtensiveFormalized, true);
  assert.equal(parser.residualTerminalSaturationLeastFormalized, true);
  assert.equal(parser.residualTerminalSaturationMonotoneFormalized, true);
  assert.equal(parser.residualTerminalSaturationIdempotentFormalized, true);
  assert.equal(parser.residualTerminalSaturationScope, 'all-finite-terminal-primitive-record-universes-with-explicit-boolean-rule-tagged-dependencies');
  assert.deepEqual(parser.residualTerminalSaturationTheoremKernelTypeSha256, RESIDUAL_TERMINAL_SATURATION_THEOREM_SHA256);
  assert.deepEqual(parser.residualTerminalSaturationAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(parser.residualTerminalSaturationProjectAxiomClosure, []);
  assert.equal(parser.residualTerminalPrimitiveUniverseTheorem, 'PNP.DirectWire.mem_allTerminalPrimitiveRecords');
  assert.equal(parser.residualTerminalSaturationExtensiveTheorem, 'PNP.DirectWire.terminalSaturate_extensive');
  assert.equal(parser.residualTerminalSaturationClosedTheorem, 'PNP.DirectWire.terminalSaturate_closed');
  assert.equal(parser.residualTerminalSaturationLeastTheorem, 'PNP.DirectWire.terminalSaturate_least');
  assert.equal(parser.residualTerminalSaturationMonotoneTheorem, 'PNP.DirectWire.terminalSaturate_monotone');
  assert.equal(parser.residualTerminalSaturationIdempotentTheorem, 'PNP.DirectWire.terminalSaturate_idempotent');
  assert.equal(parser.residualTerminalSaturationFixedPointTheorem, 'PNP.DirectWire.terminalSaturate_fixed_iff_closed');
  assert.equal(parser.residualTerminalSupportCompletionFormalized, false);
  assert.equal(parser.residualTerminalSquareLegitimacyFormalized, false);
  assert.equal(parser.residualTerminalProjectionSquareFormalized, false);
  assert.equal(parser.pccMinPolynomialRuntimeFormalized, false);

  assert.equal(release.publicationBoundary.concreteGatePassed, false);
  assert.equal(release.publicationBoundary.mathematicalTheoremEstablished, false);
  assert.equal(release.publicationBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(release.publicationBoundary.projectSpecificAxiomsRemaining, true);
  assert.equal(release.publicationBoundary.remainingBlockerCount, 6);

  assert.equal(parser.lockedNANDParserMachineFormalized, true);
  assert.equal(parser.lockedNANDSourceParserFormalized, true);
  assert.equal(parser.lockedNANDSourceParserAxiomAuditPassed, true);
  assert.equal(parser.lockedNANDSourceParserAuditedDeclarationCount, 380);
  assert.equal(parser.lockedNANDSourceParserEmptyAxiomDeclarationCount, 247);
  assert.equal(parser.lockedNANDSourceParserPropextOnlyDeclarationCount, 58);
  assert.equal(parser.lockedNANDSourceParserPropextQuotSoundDeclarationCount, 75);
  assert.equal(
    parser.lockedNANDSourceParserEmptyAxiomDeclarationCount
      + parser.lockedNANDSourceParserPropextOnlyDeclarationCount
      + parser.lockedNANDSourceParserPropextQuotSoundDeclarationCount,
    parser.lockedNANDSourceParserAuditedDeclarationCount
  );
  assert.equal(parser.lockedNANDSourceParserStateCount, 228);
  assert.equal(parser.lockedNANDSourceParserRuleCount, 2052);
  assert.equal(parser.lockedNANDSourceParserSymbolCount, 9);
  assert.equal(parser.lockedNANDSourceParserAllInputExactFormalized, true);
  assert.equal(parser.lockedNANDSourceParserExactOutputFormalized, true);
  assert.equal(parser.lockedNANDSourceParserCompiledNonTimeoutFormalized, true);
  assert.equal(parser.lockedNANDSourceParserPolynomialTimeMachineFormalized, true);
  assert.equal(parser.lockedNANDSourceParserPolynomialTimeFunctionFormalized, true);
  assert.equal(parser.lockedNANDSourceParserRawRefinementFormalized, true);
  assert.equal(parser.lockedNANDSourceParserWorkBound, '4096 * (n + 1)^3');
  assert.equal(parser.lockedNANDSourceParserCompiledRawTimeBound, '6 * 4096 * (n + 1)^3');
  assert.equal(parser.lockedNANDSourceParserScope, 'literal-228-state-2052-rule-strict-version-zero-all-input-parser-byte-preserving-or-empty-with-compiled-cubic-bound');
  assert.deepEqual(parser.lockedNANDSourceParserTheoremKernelTypeSha256, LOCKED_NAND_SOURCE_PARSER_THEOREM_SHA256);
  assert.deepEqual(parser.lockedNANDSourceParserAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(parser.lockedNANDSourceParserProjectAxiomClosure, []);
  assert.equal(parser.lockedNANDSourceParserAllInputTheorem, 'PNP.Concrete.LockedNAND.SourceParser.allInput_exact');
  assert.equal(parser.lockedNANDSourceParserAcceptIffTheorem, 'PNP.Concrete.LockedNAND.SourceParser.compiledBoundedDecide_accept_iff');
  assert.equal(parser.lockedNANDSourceParserNoTimeoutTheorem, 'PNP.Concrete.LockedNAND.SourceParser.compiledBoundedDecide_ne_timeout');
  assert.equal(parser.lockedNANDSourceParserOutputTheorem, 'PNP.Concrete.LockedNAND.SourceParser.compiledMachineOutput_eq_validatedSourceBytes');
  assert.equal(parser.lockedNANDSourceParserPolynomialFunctionTheorem, 'PNP.Concrete.LockedNAND.SourceParser.validatedSourceBytesPolynomialTimeFunction_output');
  assert.equal(parser.lockedNANDEmitterMachineFormalized, true);
  assert.equal(parser.lockedNANDTargetEmitterFormalized, true);
  assert.equal(parser.lockedNANDTargetEmitterAxiomAuditPassed, true);
  assert.equal(parser.lockedNANDTargetEmitterAuditedDeclarationCount, 3295);
  assert.equal(parser.lockedNANDTargetEmitterEmptyAxiomDeclarationCount, 2224);
  assert.equal(parser.lockedNANDTargetEmitterPropextOnlyDeclarationCount, 429);
  assert.equal(parser.lockedNANDTargetEmitterPropextQuotSoundDeclarationCount, 642);
  assert.equal(parser.lockedNANDTargetEmitterRuleCount, 1387921);
  assert.equal(parser.lockedNANDTargetEmitterSymbolCount, 9);
  assert.equal(parser.lockedNANDTargetEmitterAllInputExactFormalized, true);
  assert.equal(parser.lockedNANDTargetEmitterExactTargetBytesFormalized, true);
  assert.equal(parser.lockedNANDTargetEmitterCompiledNonTimeoutFormalized, true);
  assert.equal(parser.lockedNANDTargetEmitterPolynomialTimeMachineFormalized, true);
  assert.equal(parser.lockedNANDTargetEmitterPolynomialTimeFunctionFormalized, true);
  assert.equal(parser.lockedNANDTargetEmitterRawRefinementFormalized, true);
  assert.equal(parser.lockedNANDTargetEmitterStrictParserCompositionFormalized, true);
  assert.equal(parser.lockedNANDTargetEmitterOutputSizeBoundFormalized, true);
  assert.equal(parser.lockedNANDTargetEmitterWorkBound, 'allInputWorkBound(n)');
  assert.equal(parser.lockedNANDTargetEmitterCompiledRawTimeBound, '6 * allInputWorkBound(n)');
  assert.equal(parser.lockedNANDTargetEmitterOutputSizeBound, '4 * (409 * (n + 1) + (100 * (n + 1)) * (403 * (n + 1)) + (100 * (n + 1)) * (201 * (n + 1)))');
  assert.deepEqual(parser.lockedNANDTargetEmitterTheoremKernelTypeSha256, LOCKED_NAND_TARGET_EMITTER_THEOREM_SHA256);
  assert.deepEqual(parser.lockedNANDTargetEmitterAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(parser.lockedNANDTargetEmitterProjectAxiomClosure, []);
  assert.equal(parser.lockedNANDPolynomialReductionFormalized, true);
  assert.equal(parser.lockedNANDPolynomialReductionAxiomAuditPassed, true);
  assert.equal(parser.lockedNANDPolynomialReductionAuditedDeclarationCount, 16);
  assert.equal(parser.lockedNANDPolynomialReductionEmptyAxiomDeclarationCount, 2);
  assert.equal(parser.lockedNANDPolynomialReductionPropextOnlyDeclarationCount, 2);
  assert.equal(parser.lockedNANDPolynomialReductionPropextQuotSoundDeclarationCount, 12);
  assert.equal(
    parser.lockedNANDPolynomialReductionScope,
    'strict-version-zero-parser-emitter-polynomial-reduction-with-exact-language-equivalence-and-recursive-raw-refinement'
  );
  assert.equal(parser.lockedNANDPolynomialReductionExactFunctionFormalized, true);
  assert.equal(parser.lockedNANDPolynomialReductionExactOutputFormalized, true);
  assert.equal(parser.lockedNANDPolynomialReductionLanguageEquivalenceFormalized, true);
  assert.equal(parser.lockedNANDPolynomialReductionWitnessFormalized, true);
  assert.equal(parser.lockedNANDPolynomialReductionRawRefinementFormalized, true);
  assert.deepEqual(
    parser.lockedNANDPolynomialReductionTheoremKernelTypeSha256,
    LOCKED_NAND_POLYNOMIAL_REDUCTION_THEOREM_SHA256
  );
  assert.deepEqual(parser.lockedNANDPolynomialReductionAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(parser.lockedNANDPolynomialReductionProjectAxiomClosure, []);
});

test('current status inventories publication workflows while PNPLabs operational audit remains separate', async () => {
  const status = await readJson('public/pnp-status.json');
  const operationalWorkflows = new Set(['production-deployment-consistency.yml']);
  const names = (await readdir(new URL('../../.github/workflows/', import.meta.url)))
    .filter((name) => name.endsWith('.yml'))
    .filter((name) => !operationalWorkflows.has(name))
    .sort()
    .map((name) => `.github/workflows/${name}`);
  assert.deepEqual([...status.activeCompanionWorkflows].sort(), names);
  assert.deepEqual([...operationalWorkflows], ['production-deployment-consistency.yml']);
});

test('payload index describes current inventory/report and quarantines legacy surfaces', async () => {
  const index = await readJson('public/pnp-index.json');
  assert.equal(index.version, 84);
  assert.equal(index.sourceCommitRef, CORE_COMMIT);
  assert.equal(index.sourceProofCommitRef, '341fdff1b887ef56f7f51560dd8f213185a1a581');
  assert.equal(index.sourceTree, '2ab1d800d697d4f6f0fa360615f4315ff277c022');
  assert.equal(index.statusCoordinate, STATUS_COORDINATE);
  assert.equal(index.publicSurfaceBaselineCoordinate, 'PUBLIC-SURFACE-BASELINE-2026-08-04-RESIDUAL-TERMINAL-SATURATION-100');
  assert.equal(index.leanTheoremInventoryCoordinate, INVENTORY_COORDINATE);
  assert.equal(index.leanTheoremInventorySha256, INVENTORY_SHA256);
  assert.equal(index.canonicalReportCoordinate, 'PNP-CANONICAL-FORMAL-RECONSTRUCTION-REPORT-2026-08-04-101');
  assert.equal(index.canonicalReportPages, 73);
  assert.equal(index.formalPublicationRelease, '/downloads/formal-publication-release.json');
  assert.equal(index.status, 'formal-reconstruction-current-gate-closed');
  assert.equal(index.claimBoundary.mathematicalTheoremEstablished, false);
  assert.equal(index.claimBoundary.publicTheoremEmissionAllowed, false);
  assert.equal(index.claimBoundary.publicTheoremStatement, null);
  assert.equal(index.claimBoundary.abstractPEqualsNPPublicationEligible, false);
  assert.equal(index.claimBoundary.publicationStatusDerivedOnlyFromConcreteGate, true);
  assert.equal(index.claimBoundary.concretePublicationGatePassed, false);
  assert.equal(index.claimBoundary.leanTheoremInventoryDeclarationCount, 24054);
  assert.equal(index.claimBoundary.leanTheoremInventoryTheoremCount, 12985);
  assert.equal(index.claimBoundary.leanTheoremInventoryAssumptionFreeTheoremCount, 6903);
  assert.equal(index.claimBoundary.leanTheoremInventoryExcludedPrivateDeclarationCount, 14317);
  assert.equal(index.claimBoundary.leanTheoremInventorySourceClosureModuleCount, 216);
  assert.equal(index.claimBoundary.leanConcreteCNFSATMembershipFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStateNamespaceFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStateNamespaceAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStateNamespaceAuditedDeclarationCount, 39);
  assert.equal(index.claimBoundary.leanConcretePipelineStageBridgesFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStageBridgesAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineStageBridgesAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcretePipelineStageLaunchFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineVerdictPreservationFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineInternalOutputHandoffComposed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalOutputPackingFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount, 69);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalBridgeAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineTerminalBridgeAuditedDeclarationCount, 59);
  assert.equal(index.claimBoundary.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineInputFramerAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineInputFramerAuditedDeclarationCount, 70);
  assert.equal(index.claimBoundary.leanConcretePipelineAllInputFramingFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelinePairedCompilerAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelinePairedCompilerAuditedDeclarationCount, 28);
  assert.equal(index.claimBoundary.leanConcretePipelineCanonicalPairCompilationFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineCompilerAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineCompilerAuditedDeclarationCount, 29);
  assert.equal(index.claimBoundary.leanConcretePipelineAllInputCompilationFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineMalformedInputBehaviorFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineRawRefinementFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineSequentialNamespaceFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePipelineSequentialCompilerAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineSequentialCompilerAuditedDeclarationCount, 31);
  assert.equal(index.claimBoundary.leanConcretePipelineRefinementAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcretePipelineRefinementAuditedDeclarationCount, 16);
  assert.equal(index.claimBoundary.leanConcreteFunctionProgramRecursiveCompilationFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteDecisionProgramRecursiveCompilationFormalized, true);
  assert.equal(index.claimBoundary.leanConcretePolynomialTimeDeciderRawCompilationFormalized, true);
  assert.equal(index.claimBoundary.standardComplexityModelFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinRawTapeBridgeFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinRawTapeBridgeAuditedDeclarationCount, 54);
  assert.equal(index.claimBoundary.leanConcreteCookLevinSemanticTheorem, 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinRawTapeBridgeAxiomClosure, ['Classical.choice', 'Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaSizeAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaSizeAuditedDeclarationCount, 108);
  assert.equal(index.claimBoundary.leanConcreteCookLevinEncodedFormulaSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinEncodedFormulaSizeTheorem, 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le');
  assert.equal(index.claimBoundary.leanConcreteCookLevinEncodedFormulaSizeKernelTypeSha256, 'c2b0a4afd8793022739cde9904d379a3c807fba07f0db0ab23e3b0b0563ed699');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinFormulaSizeAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinFormulaSizeProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleAuditedDeclarationCount, 79);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleAnswerIndependent, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleLengthTheorem, 'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length');
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleLengthKernelTypeSha256, '7460e8b8c59a2356dc8ece81571e7bcb76faf71a5ae0492d034b1d8c5d2408c4');
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleEmitTheorem, 'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula');
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleEmitKernelTypeSha256, '2376179dbf80f6e0bb76d8a6026518aa0d042e1eb79f3ec567474a730f742943');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinFormulaScheduleAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinFormulaScheduleProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleConstantTimeRawInterpretationFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinRawFormulaBuilderFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaScheduleRawRefinementFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorAuditedDeclarationCount, 129);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorDirectCoordinateLookupFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorNestedOptionSemanticsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorExactTraversalFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorExactLengthPolynomialFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinFormulaCursorTheoremKernelTypeSha256).length, 16);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorTheoremKernelTypeSha256['PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula'], '2637f4e27b2a6e40a7e774b10fac91d379daebe9ff6930c72de43ee23bd054d0');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinFormulaCursorAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinFormulaCursorProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorConstantTimeRawInterpretationFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorRawBuilderFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaCursorRawRefinementFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthAuditedDeclarationCount, 39);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthRuleCount, 19);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthWorkTimePolynomial, '2 * inputLength^2 + 4 * inputLength + 2');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthRawTimePolynomial, '12 * inputLength^2 + 24 * inputLength + 12');
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthTheoremKernelTypeSha256).length, 10);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderInputLengthProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixAuditedDeclarationCount, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixWorkTimePolynomial, 'totalInputFramerWorkSteps(input) + 1 + 2 * inputLength^2 + 4 * inputLength + 2');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixRawTimePolynomial, '18 * inputLength^2 + 63 * inputLength + 93');
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixTheoremKernelTypeSha256).length, 14);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixFormulaBitsEmittedFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixDirectCursorRawInterpretationFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderAuditedDeclarationCount, 68);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixAuditedDeclarationCount, 37);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixRuleCount, 184);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixRawTimePolynomial, '18 * inputLength^2 + 87 * inputLength + 147');
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixTheoremKernelTypeSha256).length, 25);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstTokenPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialAuditedDeclarationCount, 74);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialTheoremKernelTypeSha256).length, 10);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderUnaryPolynomialProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderAuditedDeclarationCount, 84);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderTheoremKernelTypeSha256).length, 38);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderCompleteHeaderProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixAuditedDeclarationCount, 60);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderInputPrefixAppenderComposed, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixTheoremKernelTypeSha256).length, 42);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderBodyStartPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderBodyStartPrefix.bodyStartTokens_eq_canonical_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixNextTokenCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderBodyStartPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_two');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderBodyStartPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount, 74);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixTheoremKernelTypeSha256).length, 52);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixCanonicalFormulaPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixNextTokenCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_four');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixSignSlotTheorem, 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralSignSlotDirect_eq_t');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixZeroTerminatorSlotTheorem, 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralZeroTerminatorSlotDirect_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_firstLiteral');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixAuditedDeclarationCount, 79);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixCombinedAuditedDeclarationCount, 80);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixTheoremKernelTypeSha256).length, 43);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixCanonicalFormulaPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixNextTokenCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_twelve');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePrefix.finalTokenBits_eq_encodedFormula_firstClause');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepAuditedDeclarationCount, 47);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepDirectPaddingOutcomeFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepSinglePaddingStepFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepTheoremKernelTypeSha256).length, 31);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepDirectPaddingTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.directOutcome_is_padding');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTokenSlot_eq_formulaVariableSlotBound_add_thirteen');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderDynamicTokenCursorStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount, 84);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunTheoremKernelTypeSha256).length, 48);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalTokenSlot_eq_secondClauseStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseSeparatorTheorem, 'PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.secondClauseStart_direct_eq_sep');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunPredecessorTransportTheorem, 'PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact_of_unit_or_separator');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstClausePaddingRunProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepSeparatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.specification_separator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.secondClauseStartTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.nextTokenSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepPredecessorDeadStepTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSeparatorStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount, 87);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixTheoremKernelTypeSha256).length, 58);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondClauseFirstLiteralTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseFirstLiteral');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_three');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixSignTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixTerminatorTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount, 115);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixTheoremKernelTypeSha256).length, 75);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixUnaryUnitSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondClauseSecondLiteralTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseSecondLiteral');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_six');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixSignTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixUnaryUnitTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralUnaryUnitSlot_direct_eq_t');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixTerminatorTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixAuditedDeclarationCount, 57);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixClauseTerminatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixRawTimePolynomial, 'BuilderSecondClauseSecondLiteralPrefix.rawTimeBound + 390 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixRuleCount, /^2098 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixTheoremKernelTypeSha256).length, 41);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixNextSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_next_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.secondClauseTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenBits_eq_encodedFormula_secondClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenSlot_eq_secondClauseStart_add_seven');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixTerminatorTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.clauseTerminatorSlot_direct_eq_finish');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePrefix.nextTokenSlot_direct_eq_padding');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunRawTimePolynomial, /countEvaluator\.workSteps/);
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunRuleCount, /^2150 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunPaddingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_padding_run');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenBits_eq_encodedFormula_secondClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingCountTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_seven');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenSlot_eq_thirdClauseStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunDirectSeparatorTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.thirdClauseStart_direct_eq_sep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondClausePaddingRunProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepRawTimePolynomial, 'BuilderSecondClausePaddingRun.rawTimeBound + 330 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepRuleCount, /^2272 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepSeparatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_separator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenBits_eq_encodedFormula_thirdClauseStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenSlot_eq_thirdClauseStart_add_one');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.nextTokenSlot_direct_eq_f');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSeparatorStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount, 87);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixWorkTime, 'BuilderThirdClauseSeparatorStep.workSteps(problem) + 1 + BuilderThirdClauseFirstLiteralPrefix.suffixWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRawTimePolynomial, 'BuilderThirdClauseSeparatorStep.rawTimeBound + 732 + 48 * inputLength + 24 * FormulaWidth + 24 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRuleCount, /^2516 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixTheoremKernelTypeSha256).length, 58);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseFirstLiteral');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_three');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixSignTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixTerminatorTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount, 145);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixWorkTime, 'BuilderThirdClauseFirstLiteralPrefix.workSteps(problem) + 1 + BuilderThirdClauseSecondLiteralPrefix.suffixWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRawTimePolynomial, 'BuilderThirdClauseFirstLiteralPrefix.rawTimeBound + 1752 + 96 * inputLength + 48 * FormulaWidth + 48 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRuleCount, /^3004 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixTheoremKernelTypeSha256).length, 92);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFirstUnarySpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixSecondUnarySpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseSecondLiteral');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_seven');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixSignTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFirstUnaryTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralFirstUnaryUnitSlot_direct_eq_t');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixSecondUnaryTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSecondUnaryUnitSlot_direct_eq_t');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixTerminatorTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixAuditedDeclarationCount, 57);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixClauseTerminatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixWorkTime, 'BuilderThirdClauseSecondLiteralPrefix.workSteps(problem) + 1 + appenderWorkSteps(problem) + 1 + cursorWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixRawTimePolynomial, 'BuilderThirdClauseSecondLiteralPrefix.rawTimeBound + 498 + 24 * inputLength + 12 * FormulaWidth + 12 * BuilderThirdClauseSeparatorStep.cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixRuleCount, /^3126 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixTheoremKernelTypeSha256).length, 41);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixNextSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_next_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.thirdClauseTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenBits_eq_encodedFormula_thirdClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenSlot_eq_thirdClauseStart_add_eight');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixClauseTerminatorTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.clauseTerminatorSlot_direct_eq_finish');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.nextTokenSlot_direct_eq_padding');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixFinishTokenCursorRulesLengthTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.rules_length');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunRawTimePolynomial, /countEvaluator\.workSteps/);
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunRuleCount, /^3178 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunPaddingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_padding_run');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunTargetSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_target_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenBits_eq_encodedFormula_thirdClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingCountTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_eight');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenSlot_eq_fourthClauseStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunDirectSeparatorTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.fourthClauseStart_direct_eq_sep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderThirdClausePaddingRunProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepWorkTime, 'BuilderThirdClausePaddingRun.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, thirdClauseTokens problem) + 1 + CursorAdvance.advanceWorkSteps(cursorWord problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepRawTimePolynomial, 'BuilderThirdClausePaddingRun.rawTimeBound + 426 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepRuleCount, /^3300 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepSeparatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_separator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepNextSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_next_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.fourthClauseStartTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenBits_eq_encodedFormula_fourthClauseStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenSlot_eq_fourthClauseStart_add_one');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.nextTokenSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepPredecessorDeadStepTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSeparatorStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount, 115);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixWorkTime, 'BuilderFourthClauseSeparatorStep.workSteps(problem) + 1 + BuilderFourthClauseFirstLiteralPrefix.suffixWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRawTimePolynomial, 'BuilderFourthClauseSeparatorStep.rawTimeBound + 1422 + 72 * inputLength + 36 * FormulaWidth + 36 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRuleCount, /^3666 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixTheoremKernelTypeSha256).length, 75);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixUnaryUnitSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_unaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseFirstLiteral');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenSlot_eq_fourthClauseStart_add_four');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixSuffixRulesLengthTheorem, 'PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixPredecessorDeadStepTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount, 147);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixWorkTime, 'BuilderFourthClauseFirstLiteralPrefix.workSteps(problem) + 1 + BuilderFourthClauseSecondLiteralPrefix.suffixWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRawTimePolynomial, 'BuilderFourthClauseFirstLiteralPrefix.rawTimeBound + 2232 + 96 * inputLength + 48 * FormulaWidth + 48 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRuleCount, /^4154 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixTheoremKernelTypeSha256).length, 92);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixSecondUnaryUnitSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseSecondLiteral');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenSlot_eq_fourthClauseStart_add_eight');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixSuffixRulesLengthTheorem, 'PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixPredecessorDeadStepTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixAuditedDeclarationCount, 57);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixWorkTime, 'BuilderFourthClauseSecondLiteralPrefix.workSteps(problem) + 1 + BuilderFourthClausePrefix.suffixWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixRawTimePolynomial, 'BuilderFourthClauseSecondLiteralPrefix.rawTimeBound + 618 + 24 * inputLength + 12 * FormulaWidth + 12 * BuilderFourthClauseSeparatorStep.cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixRuleCount, /^4276 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixTheoremKernelTypeSha256).length, 41);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePrefix.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePrefix.specification_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTokenBits_eq_encodedFormula_fourthClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixAdvancedCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTokenSlot_eq_fourthClauseStart_add_nine');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePrefix.nextTokenSlot_direct_eq_padding');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixFinishTokenCursorRulesLengthTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePrefix.FinishTokenCursor.rules_length');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixPredecessorDeadStepTheorem, 'PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePrefixProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunRemainingPaddingCountFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunWorkTime, 'BuilderFourthClausePrefix.workSteps(problem) + 1 + BuilderUnaryPolynomial.workSteps(remainingPaddingPolynomial verifier, input) + 1 + PaddingCountdown.loopSteps(countControllerPrefixLength, remainingPaddingCount) + 1 + BuilderUnaryPolynomial.workSteps(fifthClauseSlotStartPolynomial verifier, input)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunRawTimePolynomial, 'BuilderFourthClausePrefix.rawTimeBound + 18 + 6 * countEvaluator.workSteps + 6 * (D * (2 * countRootPrefixLength + 8) + D * D) + 6 * targetEvaluator.workSteps');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunRuleCount, /^4328 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunPaddingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.specification_padding_run');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunTargetSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.specification_target_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunRemainingCountTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_nine');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunFifthClauseCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTokenSlot_eq_fifthClauseSlotStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunDirectPaddingTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.paddingSlot_direct_eq_padding');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunDirectFifthClausePaddingTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.fifthClauseSlotStart_direct_eq_padding');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunMalformedRootTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.malformedCountdownRoot_timeout');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunMalformedScratchTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.malformedCountdownScratch_timeout');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunOneStepShortTheorem, 'PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.work_one_step_short_timeout');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFourthClausePaddingRunProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunAuditedDeclarationCount, 68);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunPaddingCountFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunWorkTime, 'BuilderFourthClausePaddingRun.workSteps(problem) + 1 + BuilderUnaryPolynomial.workSteps(paddingPolynomial verifier, input) + 1 + PaddingCountdown.loopSteps(countControllerPrefixLength, paddingCount) + 1 + BuilderUnaryPolynomial.workSteps(sixthClauseSlotStartPolynomial verifier, input)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunRawTimePolynomial, 'BuilderFourthClausePaddingRun.rawTimeBound + 18 + 6 * countEvaluator.workSteps + 6 * (D * (2 * countRootPrefixLength + 8) + D * D) + 6 * targetEvaluator.workSteps');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunRuleCount, /^4380 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunPaddingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.specification_padding_run');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunTargetSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.specification_target_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunPaddingCountTheorem, 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingCount_eq_formulaTokensPerClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunSixthClauseCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTokenSlot_eq_sixthClauseSlotStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunDirectPaddingTheorem, 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingSlot_direct_eq_padding');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunDirectSixthClausePaddingTheorem, 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.sixthClauseSlotStart_direct_eq_padding');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunMalformedRootTheorem, 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.malformedCountdownRoot_timeout');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunMalformedScratchTheorem, 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.malformedCountdownScratch_timeout');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunOneStepShortTheorem, 'PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.work_one_step_short_timeout');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFifthClausePaddingRunProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAuditedDeclarationCount, 68);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunPaddingCountFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunDirectPaddingBlockFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunSecondConstraintSeparatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunNoEmissionSpecificationFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunWorkTime, 'BuilderFifthClausePaddingRun.workSteps(problem) + 1 + BuilderUnaryPolynomial.workSteps(paddingPolynomial verifier, input) + 1 + PaddingCountdown.loopSteps(countControllerPrefixLength, paddingCount) + 1 + BuilderUnaryPolynomial.workSteps(secondConstraintStartPolynomial verifier, input)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunRawTimePolynomial, 'BuilderFifthClausePaddingRun.rawTimeBound + 18 + 6 * countEvaluator.workSteps + 6 * (D * (2 * countRootPrefixLength + 8) + D * D) + 6 * targetEvaluator.workSteps');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunRuleCount, /^4432 \+ /);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunTheoremKernelTypeSha256).length, 39);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunPaddingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.specification_padding_run');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunTargetSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.specification_target_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTokenBits_eq_encodedFormula_fourthClause');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunPaddingCountTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingCount_eq_remaining_first_constraint');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunSecondConstraintCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTokenSlot_eq_secondConstraintStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunDirectPaddingTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingSlot_direct_eq_padding');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunDirectSecondConstraintSeparatorTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.secondConstraintStart_direct_eq_sep');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunRulesLengthTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rules_length');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunRulesDistinctTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rules_pairwise_query_distinct');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunCompiledExactTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.run_compile_exact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunCompiledBoundTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.run_compile_rawTimeBound');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAcceptTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.boundedDecide_compile_accept');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunNoTimeoutTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.boundedDecide_compile_ne_timeout');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunMalformedRootTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.malformedCountdownRoot_timeout');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunMalformedScratchTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.malformedCountdownScratch_timeout');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunOneStepShortTheorem, 'PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.work_one_step_short_timeout');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderFirstConstraintPaddingRunProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepSecondConstraintSeparatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepWorkTime, 'BuilderFirstConstraintPaddingRun.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, fourthClauseTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepRawTimePolynomial, 'BuilderFirstConstraintPaddingRun.rawTimeBound + 534 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepRuleCount, /^4554 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepSeparatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_separator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepNextSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_next_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTokenBits_eq_encodedFormula_secondConstraintStart');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTokenSlot_eq_secondConstraintStart_add_one');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.nextTokenSlot_direct_eq_t');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepSecondConstraintFirstLiteralSignFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepWorkTime, 'BuilderSecondConstraintSeparatorStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintStartTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepRawTimePolynomial, 'BuilderSecondConstraintSeparatorStep.rawTimeBound + 546 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepRuleCount, /^4676 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepSignSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_sign_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepNextSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_next_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSign');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTokenSlot_eq_secondConstraintStart_add_two');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.nextTokenSlot_direct_eq_t');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSecondConstraintFirstLiteralFirstUnaryUnitFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepWorkTime, 'BuilderSecondConstraintFirstLiteralSignStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintFirstLiteralSignTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRawTimePolynomial, 'BuilderSecondConstraintFirstLiteralSignStep.rawTimeBound + 558 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRuleCount, /^4798 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFirstUnaryUnitSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_firstUnaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepNextSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_next_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralFirstUnary');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_three');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.nextTokenSlot_direct_eq_t');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondConstraintFirstLiteralSecondUnaryUnitFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepWorkTime, 'BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintFirstLiteralFirstUnaryTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRawTimePolynomial, 'BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rawTimeBound + 570 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRuleCount, /^4920 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondUnaryUnitSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_secondUnaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepNextSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_next_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSecondUnary');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_four');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.nextTokenSlot_direct_eq_t');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepSecondConstraintFirstLiteralThirdUnaryUnitFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepWorkTime, 'BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintFirstLiteralSecondUnaryTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRawTimePolynomial, 'BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rawTimeBound + 582 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRuleCount, /^5042 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepThirdUnaryUnitSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.specification_thirdUnaryUnit_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepNextSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.specification_next_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralThirdUnary');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_five');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.nextTokenSlot_direct_eq_f');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAuditedDeclarationCount, 56);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepSecondConstraintFirstLiteralTerminatorFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepWorkTime, 'BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintFirstLiteralThirdUnaryTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRawTimePolynomial, 'BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.rawTimeBound + 594 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRuleCount, /^5164 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepTerminatorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.specification_terminator_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepNextSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.specification_next_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralTerminator');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.finalTokenSlot_eq_secondConstraintStart_add_six');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepNextTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.nextTokenSlot_direct_eq_finish_or_t');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAuditedDeclarationCount, 82);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSecondConstraintFirstLiteralSuccessorTokenFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepInputPrefixAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepWorkTime, 'BuilderSecondConstraintFirstLiteralTerminatorStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRawTimePolynomial, 'BuilderSecondConstraintFirstLiteralTerminatorStep.rawTimeBound + 600 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRuleCount, /^5284 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSuccessorSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.specification_successor_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFollowingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.specification_following_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSuccessor');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.finalTokenSlot_eq_secondConstraintStart_add_seven');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFollowingTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.followingTokenSlot_direct_eq_padding_or_t');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepWorkTime, 'BuilderSecondConstraintFirstLiteralSuccessorTokenStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRawTimePolynomial, 'BuilderSecondConstraintFirstLiteralSuccessorTokenStep.rawTimeBound + 612 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRuleCount, /^5404 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepPrefixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.prefix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepWidthEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepOptionalAppenderWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepTargetEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepSuffixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.suffix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepOpportunitySpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.specification_opportunity_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFollowingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.specification_following_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintPaddingOrUnary');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.secondConstraintPaddingOrUnaryTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_eight');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFollowingTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepSecondPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepWorkTime, 'BuilderSecondConstraintPaddingOrUnaryOpportunityStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRawTimePolynomial, 'BuilderSecondConstraintPaddingOrUnaryOpportunityStep.rawTimeBound + 624 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRuleCount, /^5524 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepPrefixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.prefix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepWidthEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepOptionalAppenderWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepTargetEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepSuffixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.suffix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepOpportunitySpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.specification_opportunity_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFollowingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.specification_following_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintSecondPaddingOrUnary');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.secondConstraintSecondPaddingOrUnaryTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_nine');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFollowingTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepThirdPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepWorkTime, 'BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRawTimePolynomial, 'BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.rawTimeBound + 636 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRuleCount, /^5644 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepPrefixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.prefix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepWidthEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepOptionalAppenderWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepTargetEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepSuffixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.suffix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepOpportunitySpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.specification_opportunity_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFollowingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.specification_following_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintThirdPaddingOrUnary');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.secondConstraintThirdPaddingOrUnaryTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_ten');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFollowingTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFourthPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepWorkTime, 'BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRawTimePolynomial, 'BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.rawTimeBound + 648 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRuleCount, /^5764 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepPrefixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.prefix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepWidthEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepOptionalAppenderWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepTargetEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepSuffixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.suffix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepOpportunitySpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.specification_opportunity_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFollowingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.specification_following_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintFourthPaddingOrUnary');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.secondConstraintFourthPaddingOrUnaryTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_eleven');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFollowingTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_f');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFifthPaddingOrTerminatorOpportunityFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepInputPrefixOptionalTerminatorAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepWorkTime, 'BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRawTimePolynomial, 'BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.rawTimeBound + 660 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRuleCount, /^5884 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepPrefixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.prefix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepWidthEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.widthEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepOptionalAppenderWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.optionalAppender_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepTargetEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.targetEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepSuffixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.suffix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepOpportunitySpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.specification_opportunity_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFollowingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.specification_following_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintFifthPaddingOrTerminator');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.secondConstraintFifthPaddingOrTerminatorTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_twelve');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFollowingTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.followingTokenSlot_direct_eq_padding_or_t');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepSixthPaddingOrOpeningUnaryOpportunityFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepWorkTime, 'BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRawTimePolynomial, 'BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.rawTimeBound + 672 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRuleCount, /^6004 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepPrefixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.prefix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepWidthEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.widthEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepOptionalAppenderWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.optionalAppender_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepTargetEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.targetEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepSuffixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.suffix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepOpportunitySpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.specification_opportunity_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFollowingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.specification_following_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintSixthPaddingOrOpeningUnary');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.secondConstraintSixthPaddingOrOpeningUnaryTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_thirteen');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFollowingTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAuditedDeclarationCount, 82);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepSeventhPaddingOrUnaryOpportunityFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepWorkTime, 'BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.workSteps(problem) + 1 + widthWorkSteps(problem) + 1 + branchWorkSteps(problem) + 1 + targetWorkSteps(problem)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRawTimePolynomial, 'BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.rawTimeBound + 684 + 24 * inputLength + 12 * FormulaWidth + 12 * width + 12 * widthRootPrefixLength + 6 * widthWorkSteps + 6 * targetWorkSteps');
  assert.match(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRuleCount, /^6124 \+ /u);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepTheoremKernelTypeSha256).length, 40);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExactWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepPrefixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.prefix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepWidthEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepOptionalAppenderWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepTargetEvaluatorWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepSuffixWorkRunTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.suffix_workRunExact');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepOpportunitySpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.specification_opportunity_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFollowingSpecificationTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.specification_following_step');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFormulaBitsTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintSeventhPaddingOrUnary');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepCanonicalPrefixTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.secondConstraintSeventhPaddingOrUnaryTokens_eq_canonical_formula_prefix');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFinalCoordinateTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_fourteen');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFollowingTokenTheorem, 'PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t');
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderWorkTime, '2 * (max 1 inputLength + inputLength + priorTokenCount + 3)');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderFirstTokenRawTimePolynomial, '24 * inputLength + 48');
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderRuleCount, 59);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderTheoremKernelTypeSha256).length, 17);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderCompleteHeaderFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderTokenAppenderDynamicCursorInterpretationFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderFormulaBitsEmittedFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCookLevinCompleteRawFormulaBuilderFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinBuilderRawRefinementFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinFormulaConstructionRuntimePolynomialFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCookLevinPolynomialReductionFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCNFSATInPFormalized, false);
  assert.equal(index.claimBoundary.leanConcreteCNFNPCompletenessFormalized, false);
  assert.equal(index.claimBoundary.remainingBlockers.length, 6);
  assert.equal(index.claimBoundary.leanLockedNANDGlobalCandidateAssemblyFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDGlobalBaselineCandidateFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDGlobalCandidateAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanLockedNANDGlobalCandidateAuditedDeclarationCount, 71);
  assert.equal(Object.keys(index.claimBoundary.leanLockedNANDGlobalCandidateTheoremKernelTypeSha256).length, 11);
  assert.equal(index.claimBoundary.leanLockedNANDGlobalBaselineDistinctFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDGlobalBaselineDistinctAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanLockedNANDGlobalBaselineDistinctAuditedDeclarationCount, 5);
  assert.equal(Object.keys(index.claimBoundary.leanLockedNANDGlobalBaselineDistinctTheoremKernelTypeSha256).length, 5);
  assert.equal(index.claimBoundary.leanLockedNANDUnsatisfiableFinalZeroFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDUnsatisfiableFinalZeroAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanLockedNANDUnsatisfiableFinalZeroAuditedDeclarationCount, 2);
  assert.equal(Object.keys(index.claimBoundary.leanLockedNANDUnsatisfiableFinalZeroTheoremKernelTypeSha256).length, 2);
  assert.equal(index.claimBoundary.leanLockedNANDUnsatisfiableFinalZeroTheorem, 'PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_eq_false_of_unsatisfiable');
  assert.equal(index.claimBoundary.leanLockedNANDUnsatisfiableReferenceMinimumTheorem, 'PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_referenceMinimum_eq_baseline_of_unsatisfiable');
  assert.deepEqual(index.claimBoundary.leanLockedNANDUnsatisfiableFinalZeroAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanLockedNANDUnsatisfiableFinalZeroProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanLockedNANDGlobalSemanticThresholdFormalized, true);
  assert.equal(index.claimBoundary.leanLockedNANDGlobalSemanticThresholdAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanLockedNANDGlobalSemanticThresholdAuditedDeclarationCount, 8);
  assert.equal(Object.keys(index.claimBoundary.leanLockedNANDGlobalSemanticThresholdTheoremKernelTypeSha256).length, 8);
  assert.equal(index.claimBoundary.leanLockedNANDSatisfiableIffReferenceMinimumGeSuccTheorem, 'PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_satisfiable_iff_referenceMinimum_ge_succ');
  assert.equal(index.claimBoundary.leanLockedNANDResidualSlackLeFourTheorem, 'PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_residualSlack_le_four');
  assert.deepEqual(index.claimBoundary.leanLockedNANDGlobalSemanticThresholdAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanLockedNANDGlobalSemanticThresholdProjectAxiomClosure, []);
  assert.deepEqual(index.claimBoundary.leanLockedNANDThresholdMissingInstantiationInventory, []);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEncodedSemanticReductionFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEncodedSemanticReductionAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEncodedSemanticReductionAuditedDeclarationCount, 48);
  assert.equal(Object.keys(index.claimBoundary.leanConcreteLockedNANDEncodedSemanticReductionTheoremKernelTypeSha256).length, 11);
  assert.deepEqual(index.claimBoundary.leanConcreteLockedNANDEncodedSemanticReductionAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteLockedNANDEncodedSemanticReductionProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDParserMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDParserAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDParserAuditedDeclarationCount, 380);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDParserAllInputExactFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDParserExactOutputFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDParserCompiledNonTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDParserPolynomialTimeMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDParserRawRefinementFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDParserScope, 'literal-228-state-2052-rule-strict-version-zero-all-input-parser-byte-preserving-or-empty-with-compiled-cubic-bound');
  assert.equal(Object.keys(index.claimBoundary.leanConcreteLockedNANDSourceParserTheoremKernelTypeSha256).length, 20);
  assert.deepEqual(index.claimBoundary.leanConcreteLockedNANDSourceParserAxiomClosure, ['Quot.sound', 'propext']);
  assert.deepEqual(index.claimBoundary.leanConcreteLockedNANDSourceParserProjectAxiomClosure, []);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEmitterMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEmitterAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEmitterAuditedDeclarationCount, 3295);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEmitterAllInputExactFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEmitterExactTargetBytesFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEmitterCompiledNonTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEmitterPolynomialTimeMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEmitterPolynomialTimeFunctionFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEmitterRawRefinementFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEmitterStrictParserCompositionFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDEmitterOutputSizeBoundFormalized, true);
  assert.deepEqual(index.claimBoundary.leanConcreteLockedNANDTargetEmitterTheoremKernelTypeSha256, LOCKED_NAND_TARGET_EMITTER_THEOREM_SHA256);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDPolynomialReductionFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDPolynomialReductionAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDPolynomialReductionAuditedDeclarationCount, 16);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDPolynomialReductionExactFunctionFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDPolynomialReductionExactOutputFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDPolynomialReductionLanguageEquivalenceFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDPolynomialReductionWitnessFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteLockedNANDPolynomialReductionRawRefinementFormalized, true);
  assert.deepEqual(
    index.claimBoundary.leanConcreteLockedNANDPolynomialReductionTheoremKernelTypeSha256,
    LOCKED_NAND_POLYNOMIAL_REDUCTION_THEOREM_SHA256
  );

  assert.equal(index.claimBoundary.leanConcreteCNFToNANDSemanticCompilerAuditedDeclarationCount, 68);
  assert.equal(index.claimBoundary.leanConcreteCNFToNANDFiniteMachineFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCNFToNANDPolynomialTimeFunctionFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCNFToNANDPolynomialReductionFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCNFToNANDPolynomialReductionAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanConcreteCNFToNANDPolynomialReductionAuditedDeclarationCount, 1316);
  assert.equal(index.claimBoundary.leanConcreteCNFToNANDAllInputExactFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCNFToNANDExactMachineOutputFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCNFToNANDCompiledNonTimeoutFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCNFToNANDRawRefinementFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCNFToNANDDirectReductionFormalized, true);
  assert.equal(index.claimBoundary.leanConcreteCNFToNANDLockedReductionCompositionFormalized, true);
  assert.deepEqual(
    index.claimBoundary.leanConcreteCNFToNANDPolynomialReductionTheoremKernelTypeSha256,
    CNF_TO_NAND_POLYNOMIAL_REDUCTION_THEOREM_SHA256
  );
  assert.equal(index.claimBoundary.leanResidualGainChainVerifierFormalized, true);
  assert.equal(index.claimBoundary.leanResidualGainChainAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanResidualGainChainSemanticInvariantFormalized, true);
  assert.equal(index.claimBoundary.leanResidualGainChainSlackIterationBoundFormalized, true);
  assert.equal(index.claimBoundary.leanResidualGainChainPolynomialRuntimeFormalized, false);

  assert.equal(index.claimBoundary.leanResidualGainStoppingSpecificationFormalized, true);
  assert.equal(index.claimBoundary.leanResidualGainStoppingAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanResidualGainReferenceMinimumWitnessFormalized, true);
  assert.equal(index.claimBoundary.leanResidualGainPositiveIffGlobalStrictGainFormalized, true);
  assert.equal(index.claimBoundary.leanResidualGainZeroIffGlobalNoStrictGainFormalized, true);
  assert.equal(index.claimBoundary.leanResidualGainSemanticMinimumIffGlobalNoStrictGainFormalized, true);
  assert.equal(index.claimBoundary.leanResidualGainChainGlobalStoppingConsequenceFormalized, true);
  assert.equal(index.claimBoundary.leanResidualGainChainExactMinimumPackagingFormalized, true);

  assert.equal(index.claimBoundary.leanResidualTerminalFullBridgeFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalFullBridgeAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanResidualTerminalizationExactFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalFullMinimumSpecificationFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalMuBridgeFormalized, true);
  assert.equal(index.claimBoundary.leanResidualWholeSpanPositiveWitnessIffFormalized, true);
  assert.equal(index.claimBoundary.leanResidualWholeSpanStrictDescentFormalized, true);
  assert.equal(index.claimBoundary.leanResidualWholeSpanZeroAbsenceIffFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalQuotientCarrierFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalProperSupportFormalized, false);
  assert.equal(index.claimBoundary.leanResidualTerminalSaturationFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalSaturationAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanResidualTerminalPrimitiveUniverseFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalSaturationExtensiveFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalSaturationLeastFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalSaturationMonotoneFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalSaturationIdempotentFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalSaturationScope, 'all-finite-terminal-primitive-record-universes-with-explicit-boolean-rule-tagged-dependencies');
  assert.equal(index.claimBoundary.leanResidualTerminalSupportCompletionFormalized, false);
  assert.equal(index.claimBoundary.leanResidualTerminalSquareLegitimacyFormalized, false);
  assert.equal(index.claimBoundary.leanResidualTerminalProjectionSquareFormalized, false);
  assert.equal(index.claimBoundary.leanResidualTerminalModeFirewallFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalModeFirewallAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanResidualTerminalProfileProjectionExactFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalCheckedFullLiftFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalQuotientEqualityNotConstructiveFormalized, true);
  assert.equal(index.claimBoundary.leanResidualTerminalObligationDischargePreservedFormalized, true);
  assert.equal(index.claimBoundary.leanResidualProjectionMinimumFormalized, true);
  assert.equal(index.claimBoundary.leanResidualProjectionMinimumAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanResidualProjectionMinimumMonotonicityFormalized, true);
  assert.equal(index.claimBoundary.leanResidualProjectionDefectZeroIffCheckedLiftAtMinimumFormalized, true);
  assert.equal(index.claimBoundary.leanResidualProjectionTransferFormalized, true);
  assert.equal(index.claimBoundary.leanResidualProjectionTransferAxiomAuditPassed, true);
  assert.equal(index.claimBoundary.leanResidualProjectionTransferSignedDeltasFormalized, true);
  assert.equal(index.claimBoundary.leanResidualProjectionTransferIdentityFormalized, true);
  assert.equal(index.claimBoundary.leanResidualProjectionTransferConstantCutFormalized, true);
  assert.equal(index.claimBoundary.leanPCCMinPolynomialRuntimeFormalized, false);

  assert.deepEqual(index.formalPublicationMilestoneCounts, { earned: 78, unearned: 3, total: 81 });
  assert.equal(index.earnedMilestones.length, 78);
  assert.ok(index.earnedMilestones.includes('residual-terminal-mode-firewall'));
  assert.ok(index.earnedMilestones.includes('residual-terminal-projection-minimum'));
  assert.ok(index.earnedMilestones.includes('residual-terminal-projection-transfer'));
  assert.ok(index.earnedMilestones.includes('residual-terminal-saturation-closure'));
  assert.ok(index.earnedMilestones.includes('locked-nand-global-carrier-trace-equivalence'));
  assert.ok(index.earnedMilestones.includes('locked-nand-global-candidate-assembly'));
  assert.ok(index.earnedMilestones.includes('locked-nand-global-baseline-distinct'));
  assert.ok(index.earnedMilestones.includes('locked-nand-global-unsatisfiable-final-zero'));
  assert.ok(index.earnedMilestones.includes('locked-nand-global-semantic-threshold'));
  assert.ok(index.earnedMilestones.includes('concrete-locked-nand-encoded-semantic-boundary'));
  assert.ok(index.earnedMilestones.includes('concrete-locked-nand-source-parser'));
  assert.ok(index.earnedMilestones.includes('concrete-locked-nand-target-emitter'));
  assert.ok(index.earnedMilestones.includes('concrete-locked-nand-polynomial-reduction'));
  assert.ok(index.earnedMilestones.includes('concrete-cnf-to-nand-semantic-compiler'));
  assert.ok(index.earnedMilestones.includes('concrete-cnf-to-nand-polynomial-reduction'));
  assert.ok(index.earnedMilestones.includes('residual-gain-chain-bound'));
  assert.ok(index.earnedMilestones.includes('residual-gain-stopping-specification'));
  assert.ok(index.earnedMilestones.includes('residual-terminal-full-carrier-bridge'));
  assert.ok(index.earnedMilestones.includes('concrete-cnf-universal-verifier'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-raw-tape-bridge'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-formula-size'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-formula-schedule'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-formula-cursor'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-fourth-clause-separator-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-fourth-clause-first-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-fourth-clause-second-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-fourth-clause-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-fourth-clause-padding-run'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-fifth-clause-padding-run'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-first-constraint-padding-run'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-first-literal-sign-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-first-literal-first-unary-unit-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-first-literal-second-unary-unit-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-first-literal-third-unary-unit-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-first-literal-terminator-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-first-literal-successor-token-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-padding-or-unary-opportunity-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-second-padding-or-unary-opportunity-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-third-padding-or-unary-opportunity-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-fourth-padding-or-unary-opportunity-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-fifth-padding-or-terminator-opportunity-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-sixth-padding-or-opening-unary-opportunity-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-seventh-padding-or-unary-opportunity-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-constraint-separator-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-input-length'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-input-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-token-appender'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-third-clause-first-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-third-clause-second-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-third-clause-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-third-clause-padding-run'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-first-token-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-complete-header'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-body-start-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-first-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-first-clause-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-dynamic-token-cursor-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-first-clause-padding-run'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-clause-separator-step'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-clause-first-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-clause-second-literal-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-clause-prefix'));
  assert.ok(index.earnedMilestones.includes('concrete-cook-levin-builder-second-clause-padding-run'));
  assert.deepEqual(index.unearnedMilestones, ['global-locked-nand-threshold', 'global-zeroslack-pccmin', 'concrete-publication-root']);
  assert.equal(index.payloads.find((entry) => entry.id === 'pnp-status').status, 'current');
  assert.equal(index.payloads.find((entry) => entry.id === 'pnp-theorem-inventory').status, 'current');
  for (const id of ['pnp-one-command-upload', 'pnp-verification-runs', 'pnp-verifier-run-comparison-matrix', 'pnp-verifier-run-matrix-summary']) {
    assert.equal(index.payloads.find((entry) => entry.id === id).status, 'historical-frozen');
  }
  for (const command of [
    'lake build PNP',
    'npm run pnp:verify -- --no-write',
    'node scripts/export-lean-theorem-inventory.mjs --check',
    'node scripts/generate-formal-publication.mjs --check',
    'npm run report:check',
    'node --test audits/lean-concrete-machine0.test.mjs',
    'node --test audits/lean-concrete-complexity0.test.mjs',
    'node --test audits/lean-concrete-cnf0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-raw-tape-bridge0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-formula-size0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-formula-schedule0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-formula-cursor0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-builder-input-length0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-builder-input-prefix0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-builder-token-appender0.test.mjs',
    'node --test audits/lean-concrete-cook-levin-builder-first-token-prefix0.test.mjs',
    'node --test audits/lean-concrete-terminal-output-packer0.test.mjs',
    'node --test audits/lean-concrete-pipeline-terminal-bridge0.test.mjs',
    'node --test audits/lean-concrete-pipeline-paired-compiler0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteBitStringAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteMachineAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteComplexityAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteTerminalOutputPackerAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineTerminalBridgeAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelinePairedCompilerAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinRawTapeBridgeAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinFormulaSizeAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderInputLengthAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderInputPrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderTokenAppenderAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFirstTokenPrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinFormulaSize.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinFormulaScheduleAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinFormulaSchedule.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinFormulaCursorAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinFormulaCursor.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderInputPrefix.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderTokenAppender.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFirstTokenPrefix.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderUnaryPolynomialAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderCompleteHeaderAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderCompleteHeader.lean',
    'node --test audits/lean-concrete-cook-levin-builder-first-clause-padding-run0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFirstClausePaddingRunAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFirstClausePaddingRun.lean',
    'node --test audits/lean-concrete-cook-levin-builder-second-clause-separator-step0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderSecondClauseSeparatorStep.lean',
    'node --test audits/lean-concrete-cook-levin-builder-second-clause-first-literal-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderSecondClauseFirstLiteralPrefix.lean',
    'node --test audits/lean-concrete-cook-levin-builder-second-clause-second-literal-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderSecondClauseSecondLiteralPrefix.lean',
    'node --test audits/lean-concrete-cook-levin-builder-second-clause-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderSecondClausePrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderSecondClausePrefix.lean',
    'node --test audits/lean-concrete-cook-levin-builder-third-clause-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderThirdClausePrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderThirdClausePrefix.lean',
    'node --test audits/lean-concrete-cook-levin-builder-third-clause-padding-run0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderThirdClausePaddingRunAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderThirdClausePaddingRun.lean',
    'node --test audits/lean-concrete-cook-levin-builder-fourth-clause-separator-step0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFourthClauseSeparatorStep.lean',
    'node --test audits/lean-concrete-cook-levin-builder-fourth-clause-first-literal-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFourthClauseFirstLiteralPrefix.lean',
    'node --test audits/lean-concrete-cook-levin-builder-fourth-clause-second-literal-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFourthClauseSecondLiteralPrefix.lean',
    'node --test audits/lean-concrete-cook-levin-builder-fourth-clause-prefix0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFourthClausePrefixAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFourthClausePrefix.lean',
    'node --test audits/lean-concrete-cook-levin-builder-fourth-clause-padding-run0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFourthClausePaddingRunAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFourthClausePaddingRun.lean',
    'node --test audits/lean-concrete-cook-levin-builder-fifth-clause-padding-run0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFifthClausePaddingRunAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFifthClausePaddingRun.lean',
    'node --test audits/lean-concrete-cook-levin-builder-first-constraint-padding-run0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteCookLevinBuilderFirstConstraintPaddingRunAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcreteCookLevinBuilderFirstConstraintPaddingRun.lean',
    'node --test audits/lean-concrete-cook-levin-builder-second-constraint-first-literal-sign-step0.test.mjs',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcretePipelinePairedCompiler.lean',
    'node --test audits/lean-concrete-pipeline-compiler0.test.mjs',
    'node --test audits/lean-concrete-pipeline-sequential-state-namespace0.test.mjs',
    'node --test audits/lean-concrete-pipeline-sequential-compiler0.test.mjs',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineCompilerAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcretePipelineCompiler.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineSequentialStateNamespaceAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcretePipelineSequentialCompilerAxiomAudit.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcretePipelineSequentialCompiler.lean',
    'lake env lean -DwarningAsError=true lean-regression/PNPConcretePipelineRefinementRecursive.lean',
    'lake env lean -DwarningAsError=true lean-audit/PNPConcreteTargetAxiomAudit.lean',
  ]) {
    assert.ok(index.verificationCommands.includes(command), command);
  }
});

test('status page has a conservative complete static fallback', async () => {
  const html = await readText('status.html');
  for (const fragment of [
    'Formal status · 2026-08-04',
    'mathematicalTheoremEstablished = false',
    'publicTheoremEmissionAllowed = false',
    'publicTheoremStatement = null',
    'concretePublicationGate.passed = false',
    '24,054',
    '12,985',
    '6,903',
    '<strong>14,317</strong> private compiler auxiliaries excluded',
    '<strong>215</strong> modules',
    'Seventy-eight scoped milestones',
    'PNP.Concrete.FinalUniversalDesign.cnfSATInNP',
    'This does not prove CNF-SAT in P, NP-completeness, or P = NP.',
    'encodedFormula_mem_CNFSAT_iff_language',
    'formulaBitSchedule_emit_eq_encodedFormula',
    'BuilderTokenAppender.appendToken_workRunExact',
    '18*n*n + 87*n + 147',
    'BuilderCompleteHeader.workRunExact',
    'BuilderBodyStartPrefix.workRunExact',
    'BuilderFirstLiteralPrefix.workRunExact',
    'BuilderFirstClausePrefix.workRunExact',
    'BuilderDynamicTokenCursorStep.workRunExact',
    'BuilderFirstClausePaddingRun.workRunExact',
    'BuilderSecondClauseSeparatorStep.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 13))',
    'nextTokenSlot_direct_eq_f',
    '1366',
    'BuilderSecondClauseFirstLiteralPrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 15))',
    'secondClauseStart + 3',
    '1610',
    'BuilderSecondClauseSecondLiteralPrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 18))',
    'secondClauseStart + 6',
    '1976',
    'BuilderSecondClausePrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 19))',
    'secondClauseStart + 7',
    '2098',
    'BuilderSecondClausePaddingRun.workRunExact',
    'C - 7',
    'V + 1 + 2*C',
    '2150',
    'BuilderThirdClauseSeparatorStep.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 20))',
    'BuilderSecondClausePaddingRun.rawTimeBound + 330',
    '2272',
    'BuilderThirdClauseFirstLiteralPrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 22))',
    'thirdClauseStart + 3',
    'BuilderThirdClauseSeparatorStep.rawTimeBound + 732',
    '2516',
    'BuilderThirdClauseSecondLiteralPrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 26))',
    'thirdClauseStart + 7',
    'BuilderThirdClauseFirstLiteralPrefix.rawTimeBound + 1752',
    '3004',
    'BuilderThirdClausePrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 27))',
    'thirdClauseStart + 8',
    'BuilderThirdClauseSecondLiteralPrefix.rawTimeBound + 498',
    '3126',
    'BuilderThirdClausePaddingRun.workRunExact',
    'FormulaTokensPerClause - 8',
    'FormulaVariableSlotBound + 1 + 3 * FormulaTokensPerClause',
    '3178',
    'BuilderFourthClauseSeparatorStep.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 28))',
    'FormulaVariableSlotBound + 1 + 3 * FormulaTokensPerClause + 1',
    'BuilderThirdClausePaddingRun.rawTimeBound + 426',
    '3300',
    'BuilderFourthClauseFirstLiteralPrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 31))',
    'FormulaVariableSlotBound + 1 + 3 * FormulaTokensPerClause + 4',
    'BuilderFourthClauseSeparatorStep.rawTimeBound + 1422',
    '3666',
    'BuilderFourthClauseSecondLiteralPrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 35))',
    'BuilderFourthClausePrefix.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 36))',
    'FormulaVariableSlotBound + 1 + 3 * FormulaTokensPerClause + 9',
    'BuilderFourthClauseSecondLiteralPrefix.rawTimeBound + 618',
    '4276',
    'BuilderFourthClausePaddingRun.workRunExact',
    'FormulaTokensPerClause - 9',
    'FormulaVariableSlotBound + 1 + 4 * FormulaTokensPerClause',
    'BuilderFourthClausePrefix.rawTimeBound + 18',
    '4328',
    'BuilderFifthClausePaddingRun.workRunExact',
    'FormulaVariableSlotBound + 1 + 5 * FormulaTokensPerClause',
    'BuilderFourthClausePaddingRun.rawTimeBound + 18',
    '4380',
    'BuilderFirstConstraintPaddingRun.workRunExact',
    '(FormulaVariableSlotBound - 2) * (FormulaVariableSlotBound + 2) * FormulaTokensPerClause',
    'FormulaVariableSlotBound + 1 + FormulaClauseSlotsPerConstraint * FormulaTokensPerClause',
    'BuilderFifthClausePaddingRun.rawTimeBound + 18',
    '4464',
    'BuilderSecondConstraintSeparatorStep.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 37))',
    'FormulaVariableSlotBound + 1 + FormulaClauseSlotsPerConstraint * FormulaTokensPerClause + 1',
    'BuilderFirstConstraintPaddingRun.rawTimeBound + 534',
    '4554',
    'BuilderSecondConstraintFirstLiteralSignStep.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 38))',
    'FormulaVariableSlotBound + 1 + FormulaClauseSlotsPerConstraint * FormulaTokensPerClause + 2',
    'BuilderSecondConstraintSeparatorStep.rawTimeBound + 546',
    '4676',
    'BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.workRunExact',
    'encodedFormula.take (2 * (FormulaWidth + 39))',
    'FormulaVariableSlotBound + 1 + FormulaClauseSlotsPerConstraint * FormulaTokensPerClause + 3',
    'BuilderSecondConstraintFirstLiteralSignStep.rawTimeBound + 558',
    '4798',
    'BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep',
    'encodedFormula.take (2 * (FormulaWidth + 40))',
    'FormulaVariableSlotBound + 1 + FormulaClauseSlotsPerConstraint * FormulaTokensPerClause + 4',
    'BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rawTimeBound + 570',
    '4920',
    'third and final unary T',
    'encodedFormula.take (2 * (FormulaWidth + 41))',
    'FormulaVariableSlotBound + 1 + FormulaClauseSlotsPerConstraint * FormulaTokensPerClause + 5',
    'BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rawTimeBound + 582',
    '5042',
    'Formalized foundation: Cook-Levin second-constraint first-literal terminator step',
    'terminating F of the second scheduled constraint&#39;s first literal',
    'encodedFormula.take (2 * (FormulaWidth + 42))',
    'FormulaVariableSlotBound + 1 + FormulaClauseSlotsPerConstraint * FormulaTokensPerClause + 6',
    'BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.rawTimeBound + 594',
    '5164',
    'Formalized foundation: Cook-Levin second-constraint first-literal successor token step',
    'emits Finish exactly when tapeWidth is one and T at every wider width',
    'encodedFormula.take (2 * (FormulaWidth + 43))',
    'FormulaVariableSlotBound + 1 + FormulaClauseSlotsPerConstraint * FormulaTokensPerClause + 7',
    'BuilderSecondConstraintFirstLiteralTerminatorStep.rawTimeBound + 600',
    '5284',
    'Formalized foundation: Cook-Levin second-constraint second padding-or-unary opportunity step',
    'encodedFormula.take (2 * (FormulaWidth + 43 + if tapeWidth = 1 then 0 else 2))',
    'FormulaVariableSlotBound + 1 + FormulaClauseSlotsPerConstraint * FormulaTokensPerClause + 9',
    'BuilderSecondConstraintPaddingOrUnaryOpportunityStep.rawTimeBound + 624',
    '5524',
    'Formalized foundation: Cook-Levin second-constraint seventh padding-or-unary opportunity step',
    'first unary-index T of the following literal',
    'encodedFormula.take (2 * (FormulaWidth + 43 + if tapeWidth = 1 then 0 else 7))',
    'FormulaVariableSlotBound + 1 + FormulaClauseSlotsPerConstraint * FormulaTokensPerClause + 13',
    'BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.rawTimeBound + 672',
    '6124',
    'FormulaVariableSlotBound + 1 + 3 * FormulaTokensPerClause + 8',
    'BuilderFourthClauseFirstLiteralPrefix.rawTimeBound + 2232',
    '4154',
    'FormulaTokensPerClause - 12',
    'T^FormulaWidth F Sep T F T T F T T T F Finish',
    'T^FormulaWidth F Sep T F T T F T T T F Finish Sep F F F T F',
    'T^FormulaWidth F Sep T F T T F T T T F Finish Sep F F F T F Finish',
    'formulaVariableSlotBound + 12',
    'three global milestones',
    'PNP.Main.ConcretePEqualsNP',
    'PNP.Main.p_eq_np',
    'null never matches null',
    'PNP.PEqualsNP',
    'Formal.ResidualBandMinimizer',
    'Formal.RootTheoremAndAxiomAudit',
    'PNP.CheckPCCPackexp',
    'Formalized: Locked-NAND global unsatisfiable final-zero branch',
    "full candidate's final coordinate false on the entire carrier",
    'fixes the exhaustive reference minimum at <code>B</code>',
    'Formalized: Locked-NAND global semantic threshold',
    'one answer-independent full candidate supplies all six typed semantic premises',
    'residual slack is at most <code>4</code>',
    'encoded polynomial-time SAT-to-locked-NAND builder',
    'Formalized foundation: Concrete strict-v0 locked-NAND source parser',
    '228 states',
    '2,052 pairwise-query-distinct rules',
    'rules accept exactly <code>ValidEncodedCircuit</code>',
    'preserve valid bytes byte-for-byte, reject invalid bytes with empty output',
    '6 * 4096 * (n + 1)^3',
    'leanConcreteLockedNANDParserMachineFormalized = true',
    'Formalized foundation: Concrete strict-v0 locked-NAND target emitter',
    '1,387,921 pairwise-query-distinct rules',
    'quadratic output-size bound',
    'leanConcreteLockedNANDEmitterMachineFormalized = true',
    'leanConcreteLockedNANDEmitterAxiomAuditPassed = true',
    'leanConcreteLockedNANDPolynomialReductionFormalized = true',
    'leanConcreteCNFToNANDSemanticCompilerFormalized = true',
    'leanConcreteCNFToNANDSemanticCompilerAxiomAuditPassed = true',
    'leanConcreteCNFToNANDSemanticCompilerAuditedDeclarationCount = 68',
    'leanConcreteCNFToNANDExactSemanticsFormalized = true',
    'leanConcreteCNFToNANDPolynomialOutputSizeBoundFormalized = true',
    'leanConcreteCNFToNANDFiniteMachineFormalized = true',
    'leanConcreteCNFToNANDPolynomialTimeFunctionFormalized = true',
    'leanConcreteCNFToNANDPolynomialReductionFormalized = true',
    'leanConcreteCNFToNANDPolynomialReductionAxiomAuditPassed = true',
    'leanConcreteCNFToNANDPolynomialReductionAuditedDeclarationCount = 1316',
    'leanConcreteCNFToNANDAllInputExactFormalized = true',
    'leanConcreteCNFToNANDExactMachineOutputFormalized = true',
    'leanConcreteCNFToNANDCompiledNonTimeoutFormalized = true',
    'leanConcreteCNFToNANDRawRefinementFormalized = true',
    'leanConcreteCNFToNANDDirectReductionFormalized = true',
    'leanConcreteCNFToNANDLockedReductionCompositionFormalized = true',
    'Formalized polynomial reduction: Strict-v0 locked-NAND translation',
    'Formalized semantic boundary: General CNF-to-NAND compiler',
    'Formalized polynomial reduction: Fixed all-input CNF-to-NAND compiler',
    'Formalized iteration bound: Universal verified residual-gain chains',
    'leanResidualGainChainVerifierFormalized = true',
    'leanResidualGainChainSlackIterationBoundFormalized = true',
    'leanResidualGainChainPolynomialRuntimeFormalized = false',
    'Formalized terminal projection transfer identity',
    'TerminalProjectionFourCorners.transferIdentity',
    'Formalized terminal saturation closure',
    'terminalSaturate_closed',
    'EncodedNANDSAT',
    'EncodedLockedNANDThreshold',
    'Historical 57-page manuscript',
    '7072f8d0bda6d44d240f9bb3fad624fd357e1278',
  ]) assert.equal(html.includes(fragment), true, `missing status fragment: ${fragment}`);
  assert.equal((html.match(/data-earned="true"/g) || []).length, 78);
  assert.equal((html.match(/data-earned="false"/g) || []).length, 3);
});

test('static inventory prose matches the compiled declaration boundary', async () => {
  const readme = await readText('README.md');
  const paper = await readText('paper.html');
  const guide = await readText('docs/reviewer_guide.md');
  const reproducibility = await readText('docs/reproducibility.md');
  assert.equal(readme.includes('24,054** exported public declarations across **215** modules'), true);
  assert.equal(readme.includes('23,601** exported public declarations across **109** modules'), false);
  assert.equal(paper.includes('Exactly 14,317 private compiler auxiliaries are excluded.'), true);
  assert.equal(guide.includes('Exactly 14,317 private compiler auxiliaries are excluded explicitly.'), true);
  for (const fragment of ['24,054', '12,985', '6,903', '14,317', '215 modules', 'seventy-three A4 pages', 'fixed 135,070-rule', '28 reviewed theorem pins', 'PolynomialTimeFunction', 'cnfSAT_reducesTo_encodedNANDSAT']) {
    assert.equal(reproducibility.includes(fragment), true, `missing reproducibility fragment: ${fragment}`);
  }
  assert.equal(reproducibility.includes('forty-four A4 pages'), false);
  assert.equal(paper.includes('One thousand and thirty-five'), false);
  assert.equal(guide.includes('One thousand and thirty-five'), false);
});

test('older public-review payloads remain explicitly superseded and non-authoritative', async () => {
  for (const path of [
    'public/pnp-public-review.json',
    'public/pnp-theorem-emission-gate.json',
    'public/pnp-external-review-status.json',
  ]) {
    const payload = await readJson(path);
    assert.equal(payload.historical, true, `${path}: historical flag`);
    assert.equal(payload.currentStatusAuthority, false, `${path}: authority flag`);
    assert.equal(payload.currentClaimBoundary.mathematicalTheoremEstablished, false, `${path}: theorem boundary`);
    assert.equal(payload.currentClaimBoundary.publicTheoremEmissionAllowed, false, `${path}: emission boundary`);
  }
});

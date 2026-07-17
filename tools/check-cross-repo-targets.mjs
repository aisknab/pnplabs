#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_TARGETS = "docs/audit_targets.json";
const DEFAULT_RELEASE_MANIFEST = "downloads/formal-publication-release.json";
const DEFAULT_SOURCE_DIR = "../pnp";
const REVIEWED_CORE_COMMIT = "f5b7b31b549260c6366302e616c71565e8857112";
const REVIEWED_CORE_TREE = "763d06f43fab168650f9d7e94d1ee3906af8c3dd";
const REVIEWED_PROOF_COMMIT = "49bd7e8aa354f2cb95f0988f57bc9da3e44f8308";

const FORMULA_CURSOR_THEOREM_HASHES = {
  "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaConstraintSlotDirect_eq": "46a46409172b2443dcc6eb4dccf939737ce3fb25583a957acfdfb34dde7c0edc",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaClauseSlotDirect_eq": "0ed670f82237e1984c35dec8edbc2b3ad392759310b5ba0b12311fc799531a98",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaTokenSlotDirect_eq": "4675f18d3c1f1fa7fb16c2dec7b1e370589ef6977367eb8e4da97b2a03452d1a",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotDirect_eq": "6a3c74f3924ed7defe38713b118e0fecc8a1e71f50b20d2ac1dc0c6535bf6e2c",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotCountDirect_eq_polynomial": "d052a795eb5e0222326ef849c5e75ced764d2a5b74578da3e8ffdb290d731744",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_prefix": "5672cb875db23988aaf749a0890d3f08128b2e9276a969572dbf5b3e404b25a4",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_to_end": "2690d352f8f9072a49db1ba6e585ea5fd68b7952a96296938f44118747e06963",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full": "d54831f37ccf2283f0ad8fe79a413232964587f85fdbc983983a17f64c9c6f7d",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.step_at_end": "624fcdaccb799650b10aa88c54da820c3de33c67600f1207d5a7d540717d7288",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_one_step_short": "699d81f19687395eaa6c82629cceb0c27fa58b1da009ffe2317e8b1840a309f1",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.step_after_one_step_short": "e6b99c99d82e9edce84ecafe5584d4dcb310221adf0ab171013479c90fe61807",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_excess": "9bdcf90c8a8628fcb4c49d6b358f5d19d7cf6e88a2bedf8e532b577d2fc5f063",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula": "2637f4e27b2a6e40a7e774b10fac91d379daebe9ff6930c72de43ee23bd054d0"
};

const BUILDER_INPUT_LENGTH_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderInputLength.finalTape_represents": { hash: "824e9a4f2785da71c1b5810e4995984e220b131bf643bd4f0271ed53628970dd", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputLength.inputTape_eq_totalInputFramerFinalTape": { hash: "59e20384fa787f70aabd8222780edaa8660715675d896e71c763e6549520ab2b", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputLength.malformedScanSymbol_timeout": { hash: "d8ec5d9a5ff569cacf7daef576030f255222680883e9b4159e6e72b624dca031", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputLength.rawTimeBound_exact": { hash: "e81660fecf035c3c8a89eeb0a6e6a77c717152d3d452689d173b69b648fbcd9f", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputLength.run_compile": { hash: "629c5a35979a7aadb823a0adbd06a2728d3fbc22f569906c986d377a205cc1f9", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputLength.tallySizeBound_exact": { hash: "194c981ca92498b47b4396539cdb8f8221a7b944a7144bd5e54d8ed98e4a8d13", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputLength.workBoundedDecide_accept": { hash: "0b5a2b65a9a4aa8e4c361a003bd34e79f8c914f2b4b0aa6e5f58eb9450ba44d7", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputLength.workRunExact": { hash: "ca6d55f38eae1850bd532a9cfbb86bf6fa2bc45edf9acc34537e7793b1c75f98", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputLength.workRunExact_after_totalInputFramer": { hash: "3fdcf061036fc5b1c6caf667cda8718c9d738a7281d30be9785841b40f034c16", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputLength.work_one_step_short_timeout": { hash: "9a70e81fe0f85ea22e9fd2b41166dc4f7281245501f8cd70bbac7895936bfa4d", axioms: ["Quot.sound", "propext"] }
};

const BUILDER_INPUT_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderInputPrefix.boundedDecide_compile_accept": { hash: "6fbd596723b2a97d405d1d8129e20901d51008c773af5d80b4633a819fead57d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.finalTape_represents": { hash: "14cba9d7647fcef8f062c2ab6e3d16e84eed233e1ec53491382991421795e2cc", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.finalTape_tally_length": { hash: "92f992615d4bde8569d585f54ec0d7963cb5ec043e81b410433c1d3f6e190dfe", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.findWorkRule_framer_of_some": { hash: "3e82d88005087443565389d5dda84a673b4eaecf637e60eff5cc4cb414679b18", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.findWorkRule_tally_of_some": { hash: "e88f5a2d04ae75d874e6be87f837e3eb73a70aaad095ef44c8bc40383ac90dab", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.framerState_ne_tallyState": { hash: "b37cc329b82a3489b6cbbf59f49d6f85494e1cba3b6d74afd111177f882691f0", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.launch_workStep": { hash: "7ddf442477605b69a2a48fa9de34c9d3e231fc125fb2ffbe2f862464c0646bd9", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.malformedTallyScanSymbol_timeout": { hash: "e6799395b2907abc1740c4fd7d96fc9ac8f1ee24670e4b7aceb39a0927fbdd66", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.rawTimeBound_eval": { hash: "d875640901af586ab3e6ab4507d62c25b94e34ef8c87082fb35fcf58c757dc1c", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.rawTimeBound_le": { hash: "0bb31c2ccec14489cb58eef73d58cd55053f684ece8105a311c516723178fd1d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.run_compile_exact": { hash: "963473ed4426824bdbf27defba1524964c2a5b245c428a885c4207eb76f48ee6", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.run_compile_rawTimeBound": { hash: "7a9d88bb8b61f9d4629a16f11b0bb0e54c61845d2e9a2775aa8b5c7998ce58c9", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.workRunExact": { hash: "c4d91b64e983bc5a6713fa64ab86821edd442cc79cbf872b2fafe6f3194ab2b3", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderInputPrefix.work_one_step_short_timeout": { hash: "a395f5f859d7689faa0236d2660746c52e438e6e174aa34b698725f7eae40538", axioms: ["Quot.sound", "propext"] }
};

const BUILDER_TOKEN_APPENDER_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderTokenAppender.appendToken_workRunExact": { hash: "948f8fd82b0b7afb85ae562995bebfcf59e50896cb46765fd4fbb807dd6652ad", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_after_builderInputPrefix": { hash: "b071c352d94a07f866d7dd896f2560811ab683ebebc12e8cb5dd6028ef14b67c", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_bits_eq_encodedFormula_take_two": { hash: "ec6b91deab6fce74d77615e9bb608951c3529188c58e4d9290ed2355c6c25d37", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_one_step_short_timeout": { hash: "3112873ce39d7952562aa66452c80baf6e56f647ce56c457b24edc459eeb052b", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_workBoundedDecide_accept": { hash: "23ace21eaed3a3e226bc16d77ebeaf2416838269f4e4f233086ad362477243a2", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_workRunExact": { hash: "c093013dda065d76876c9b2d5d12277bbba75e9f52bc6a6392af73678e6d0d30", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.firstTokenRawTimeBound_eval": { hash: "59d7e1ad5320076b4ab338c933a9a0aef6de24a4984e4e25d7032a963390665a", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.firstTokenRawTimeBound_le": { hash: "6a47d56dfbcfcf4f1bc020e0c95d40d43d3a2e5262057b5b16c7a4db4fdaa6aa", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.formulaBitSlotDirect_one": { hash: "27be5d30b95df20a12a45442dad465247c3c23cf4f1a3e6d3f59fda0682754da", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.formulaBitSlotDirect_zero": { hash: "1589919e0094b5821d750d0d9154127882bbbe625d4b3aeec65af0983c9a7723", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.malformedOutputSymbol_timeout": { hash: "d9416d1038b4c06c953eb76bc65b70502116755996e472b2a26e8f86bcd7ab7b", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.malformedTallySymbol_timeout": { hash: "12e0272c93877309b01628ef8b4eeeaa650d78af497ef32db0026c81d047f000", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.rules_pairwise_query_distinct": { hash: "1bea64179365014dea81f39f44b83ecd9678afe2d60d18ade4aacaf75f753e84", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.run_compile_firstHeaderToken_rawTimeBound": { hash: "b1bb91e0379f44e2a437edd4ab9400e502bdfb65ace8cfe5bfe98bda5472fc54", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.tokenSymbol_bits": { hash: "6f0f84cab420ed4b5f77917601bf43a462acde6e7180c900d6005dcff5ae9bb4", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.workspaceTape_empty_eq_builderInputLength_finalTape": { hash: "4aa69d06c926b72df86bff105aa7fb5c28ea5f195d1fc0f47b2b10d4a2d00697", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderTokenAppender.workspaceTape_represents": { hash: "a7d351e50bf68c0dee332075988183ad271e3935a4629dd8e769571317e38df7", axioms: ["propext"] }
};

const BUILDER_FIRST_TOKEN_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.appenderState_injective": {
    "hash": "4d586fd6d8c0376788f22ecca4287c3afd7a288414818605ef7123e618dd75ef",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.appender_workRunExact": {
    "hash": "0ed4be02d600690bdfc2e63df388293f7f95b9595dad123d95d9982c3002b1c4",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.boundedDecide_compile_accept": {
    "hash": "fcbb1fdfa414748d2b4b0d95cd8d7cf0b2cd2a8f70c27736bd89b28de5cb7239",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.boundedDecide_compile_ne_timeout": {
    "hash": "2ed20a7cbaa7ead3464b5b4d42b9152148e1304435dce43cee2d938151166a59",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.finalTape_represents": {
    "hash": "15935440cd484d960867195e70ae0258bf2447e20dba2b31f486d74137035e6c",
    "axioms": [
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.finalTokenBits_eq_encodedFormula_take_two": {
    "hash": "4eec4d282e49848a0bc68d4a284cfd9c050c932480528c80551b72f2cbeb4156",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.findWorkRule_appender_of_some": {
    "hash": "61b8e5b7d7b5fb0f77d6c4f68f263fb486e428b73dec22aa6093c8c9e0864b16",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.findWorkRule_prefix_of_some": {
    "hash": "c8c9a2051594bed587fdd023947c6e43cd918d90bca64cdc219438cdebf3302e",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.launch_workStep": {
    "hash": "0b2e07cf2bc4e38e5a180ca2c015d6abed8c500015560f24ee6dd8af97c80e9a",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.malformedAppenderOutput_timeout": {
    "hash": "10a6acc6d8ae63c39ea9eda2dd1a6f444b682c069147f399b5169a5579af43da",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.malformedAppenderTally_timeout": {
    "hash": "bea9b1af2a58cd4bcc6a92d765fc020011011627ad62ce97d64e9d8d5a26e45d",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.malformedPrefixTally_timeout": {
    "hash": "298f5fb0c413cb2c5e04acad7d55012a7b2c233c791d642668660a0bd6223460",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.prefixEndpoint_before_launch_timeout": {
    "hash": "3e54e49000af51d437285920388df0b02bf66ffc42159ec62bfabcebe98ef028",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.prefixState_injective": {
    "hash": "67a4eefa8e7adcda050546ecc51d054801588972825dcd6fc93e65fffa424cbb",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.prefixState_ne_appenderState": {
    "hash": "21a12c743b42814ba1359177b7ed7c4a5e57c503b586edcf9f11f8c84e43b870",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.prefix_workRunExact": {
    "hash": "e80d3027c17d20a521a06677e962f24fc17b40a99f07323adb32f969cb08e8c3",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.rawTimeBound_eval": {
    "hash": "0abbda7efc456db86b04ab428e715a8a7d38498e91b33f8981a4fcd0a6b211bd",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.rawTimeBound_le": {
    "hash": "0cf16edd626dc59814841c4d69bc60314f92d2b8b6e6efc9434f650d5b1b5ef3",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.rules_length": {
    "hash": "4401fe9afa6c0d86da417c2a86e2d1e9b2547420d0d3c5f4fbd87994e95a0f0c",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.rules_pairwise_query_distinct": {
    "hash": "9f398dd21e449dd33ab15b7042e733ca4e571ff6c9783e0c73496f140c80ec09",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.run_compile_exact": {
    "hash": "fc84cc06cfbee5e401ad10899b3aa1ef5473bd13a0d00f9c32084311822f667f",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.run_compile_rawTimeBound": {
    "hash": "7202852763b3ce77623a4caaf47ee882984f7bef2e44447bb2915230e4a4da77",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.run_compile_rawTimeBound_blankEquivalent": {
    "hash": "905dfc8c2ed911830608e2613778425953e20e170740ea9ff7078707e7791280",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.workRunExact": {
    "hash": "2d4407e3035aba885bd1b32a5e40436b964a5195c2e1fb94dec4e02468f41121",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.work_one_step_short_timeout": {
    "hash": "dc295c3c0ec862af3753abadfe7ee14feb27aae104cd363b4d48edef3a628526",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  }
};

const BUILDER_UNARY_POLYNOMIAL_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.compilerStepsPolynomial_eval": {
    "hash": "e8ba40cff79c206d1ff4cc17fd19ca657a91220604d6d8650b18d0dd3723ae8a",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.machine_acceptState_ne_rejectState": {
    "hash": "b071f4655135bde62760a8eb1c70525f2f56c83d6d978cc46d666985fcbf79fd",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.root_prefix_length": {
    "hash": "63d509ffccc23f5549deabc978f04c4a2269994a95490b3c13f89c530d03f97c",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.root_register_length": {
    "hash": "49373598c7a971ff8196bad12235bdbfe15e5eb13d63d11907de8ecf3c4ebc7b",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.rule_source_lt_acceptState": {
    "hash": "4b47394ee3407cf5b1df5eacfbb201c8ea78e13f64dd670ac0267012fdf6d6a5",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.rules_length": {
    "hash": "a05908359c91165996b10d9f388a8c44dba2441b73d54bf331f177be10695d41",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.rules_pairwise_query_distinct": {
    "hash": "302bcd6850123af14e3e950ff7b6d6f215d7450618a197320203efb980adb3d7",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.scratchWord_symbol": {
    "hash": "6bf3560d458359238838b75c0b7536efbed139eb229e5f132732676dea36f6c9",
    "axioms": [
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.workRunExact": {
    "hash": "fe24046dec0a444efdb14a9a7dbe256990bca1def23693b60b1f720e77002614",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.workTimePolynomial_eval": {
    "hash": "83eafebda5765f41f5c54f68a0881dee462df6d3f84cbbf9ed10eaf4c43a98f5",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  }
};

const BUILDER_COMPLETE_HEADER_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.machine_acceptState_ne_rejectState": {
    "hash": "379a3a3721a7030216b39e3707282a3c3199f000a025c52df3606f149731bd63",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.rules_length": {
    "hash": "c056016a5eacf86d4584ad8cb93d3576129ff27e0f45cb8f342e8afba38710d6",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.rules_pairwise_query_distinct": {
    "hash": "c8a9066c28e5fc5cda2e9814496da861d5139096cd0c604a7a037e1089c3ddc5",
    "axioms": []
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact": {
    "hash": "c4d0566d741659c5998cdc4592dc8e3698ab08090afb566a8778d24e0697b21e",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.boundedDecide_compile_accept": {
    "hash": "035c54895c1a2cd5ece8efb2c2cd59d1a7794a06aea10fb85181e5446d3a7386",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.boundedDecide_compile_ne_timeout": {
    "hash": "7dfd5963a576d63731b31e5de2d04e1d041be92977d2e7eccdd8af7dc19c7c2d",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.controllerF_launch_workStep": {
    "hash": "dddb32a49bd975c21e423fd3735ef56c4b084222d6d25ccb080aea437002983a",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.controllerState_injective": {
    "hash": "9b0247bc7341a3c32585ae998c8e4084620952a6429c2ac3627d2a4184da426b",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.controllerT_launch_workStep": {
    "hash": "894b12a51183e0b1c12123de29a3fcdbff33df88a4b962a335f32e0b2cfec08a",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.evaluatorController_launch_workStep": {
    "hash": "7557050ca0f7b577c2f567fb75d34885062667a920230a933af3fa2eb2a2c6ba",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.evaluatorState_injective": {
    "hash": "f66ae6054576dc73fa29d07ee3dafdcc5a8972dd9190a399a70bf222fccbe341",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.fAppenderState_injective": {
    "hash": "4080ac22da8b6e8dbcb126140c1d183ddb3a2520d9f3d9f1d6c02a52dd4ede9b",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.finalTape_represents": {
    "hash": "22482e96662861b732d4dc60694d6f270bf34c3b44b067f87b1c3865d93cbe5f",
    "axioms": [
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.finalTokenBits_eq_encodedFormula_header": {
    "hash": "dcd5a2612e153307bdfb372062095ff227607d9d4ff0e2216fec4f81fce0bb6b",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.findWorkRule_controller_of_some": {
    "hash": "ab8fa19788a981a61991c42d05a79bbe570f9d8cd4d34fea5e81d42125ca0002",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.findWorkRule_evaluator_of_some": {
    "hash": "1d7b7fe09406920d4446d6ce85c58dc5180a09c827f6bb1bf02a41f33e662efc",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.findWorkRule_fAppender_of_some": {
    "hash": "828f0afdbea64da5baae29d97d8b4293298fc0d7ac8667b990d785162692a423",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.findWorkRule_prefix_of_some": {
    "hash": "581fe3f3ff87a5a8ef66c86512d6e345c9f438651229fa6c68362efe940bf4f4",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.findWorkRule_tAppender_of_some": {
    "hash": "82554ed9cd60d923d524abcc5f74b01ada92c91a02b86c2e2fcf731267e81dc3",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.headerTokens_eq_encodeUnaryTokens": {
    "hash": "f9dd3c528e834c2a72b537899c4e14e6c0df4fdb83d8ebd7b786080f98506a5a",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.machine_acceptState_ne_rejectState": {
    "hash": "856ea2d398ad1299fe5e4aa1009f06aa73ce95b1edd5062c87557c6ea2672231",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.prefixEndpoint_before_launch_timeout": {
    "hash": "6ed88c11c08d8d397337e4266ab94d46cfa638f615b25a192026ee0c8b1a3638",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.prefixEvaluator_launch_workStep": {
    "hash": "cd1b07b422dd6974b818e6096c7a2bd89d3845bbff5c4c2c2a23359a54ea4196",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.prefixState_injective": {
    "hash": "9fc602302ffb56828f5c163af9c0cf786440f24c646ac4748bd4811e73f4c086",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.rawTimeBound_eval": {
    "hash": "575cdc78f382f89d36929d88698233bdc9bc2cd525f736edb04a461d9343ee94",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.rawTimeBound_le": {
    "hash": "92ab531fb5a2f556c5e32479fd4381a78eb25f90b314d66b0f991b335f0484de",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.rules_length": {
    "hash": "b281973da7b0d34f8628d4a1ddb988b8c3b14c508bb35475e3774dd8f3373c8b",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.rules_pairwise_query_distinct": {
    "hash": "e64615d83b58dd026258d3bb06ed4ce25e965fe11c96bf5ae5c6ba9d86b79a11",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.run_compile_exact": {
    "hash": "1caaa6706ac038e9d29929c6979c19e11b98dc896bace7f21c562279175335d9",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.run_compile_rawTimeBound": {
    "hash": "c2d05cd0142f3d1993dac6fe089a008de5a3bd4e6e3e538970917ed1a14bdd53",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.run_compile_rawTimeBound_blankEquivalent": {
    "hash": "ae4798dd4fced741aabca98d305f15bb555ad27ac37113da97d47ad7dab5bf4d",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.tAppenderState_injective": {
    "hash": "bab9105a2d67b44def3a5ff116073448fe4fb681cca8e06ad546a4e825795ff5",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.tController_launch_workStep": {
    "hash": "2e6d12b83f303e5ea15765babd8deab50b63441e8855ab2277d6e9d8bfb81cec",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.width_eq_FormulaWidth": {
    "hash": "fb28bef0b6212abb3f4a97fefa98c3f4c3a1e39fd4f535f76c05aee260918922",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.width_positive": {
    "hash": "ae7dc821fe4ded8bff9adbbfbab602877fdca4fa48ff1a113fd30cd6095d55cd",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.workBoundedDecide_accept": {
    "hash": "ef44aadc014e557e07f2090474ad62aa6fda4dc2a566c9875338f1afcec7ba17",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.workRunExact": {
    "hash": "5f19f96b8d4aeb063d03b39718071ad27e3b02f3612a8db8f4d4e7bffbc96466",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.work_one_step_short_timeout": {
    "hash": "6d8455b8361566ef1b5bf8872555bd18c7b8c76e84c854b934d948fdcfadfa1e",
    "axioms": [
      "Quot.sound",
      "propext"
    ]
  }
};

const BUILDER_BODY_START_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.appenderState_injective": { hash: "c33488f7f1255236fb0d631f8c1fd46544ffb76277a4ee0305cc9bca84e85d08", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.appender_workRunExact": { hash: "9c755f18d1dfe5355dbcf902acaf35977213ffb721f9df5c2705994d812384ad", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.bodyStartTokens_eq_canonical_prefix": { hash: "f5e01b21fdcb06cc7e5cbde02b9da1cc7158b602b4a8aa0ae527b305bd0ccfcc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.boundedDecide_compile_accept": { hash: "e4612d54abb54bdbc3fa12b317c135e6a107c4818d10fb955b390ef4faff0418", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.boundedDecide_compile_ne_timeout": { hash: "6dd42fe3920937893791532aaa924248cc856c20fda43f68f37cfa4836807f3f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.cursorAppender_launch_workStep": { hash: "82dd6adc4627de36291d5bd6a2108b13746e4eda3ae582b2f5bd56fa472d9485", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.cursorDeadState_timeout": { hash: "6c5957a269ff917bceccede72231b3343f2ac9e06a84c452dc0887fd29946b64", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.cursorEndpoint_before_launch_timeout": { hash: "e99c1305c473df5dc3ff15ddae51968c9b9d719d35ecea09fa9809999874b0a6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.cursorState_injective": { hash: "421624606c3841355401f86fd510e6ce00bd61faa6d67faf59d4d71967121bed", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.cursorState_ne_appenderState": { hash: "e231f6786ec584fb67c5aeabe16a59a4e998634a35d58a53978c1505c5897d28", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.cursor_workRunExact": { hash: "d2902524cef936d4584989f85f8b66fa403e1631e00164f3145225a602334df7", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.finalOutside_contains_nextTokenSlot": { hash: "80588924a143cd5fd965f5d9e79d1a07593e282c58b52eaf4eeaf08b9f5e1896", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.finalTape_represents": { hash: "c29fd803a11ab3d68ed12a7dc75b24ced64ec6db2214a74f98996485373da09d", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.finalTokenBits_eq_encodedFormula_bodyStart": { hash: "1bd6392c3c57a3c53e1c0ea700d8c37a67bc83758e95134c72db8d528e0d3b7f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.findWorkRule_appender_of_some": { hash: "846a7fd589388487b89b9be363fa838f00d62085ed9b0701b9789780489d85f8", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.findWorkRule_cursor_of_some": { hash: "f541658b5601018476735befa2c56054b9578df5fefd6b89f5982babc7b1a299", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.findWorkRule_header_of_some": { hash: "3ad8d0de18da75888b9e1acc4fc0259e0f334872faf75d6f07a7002f7f0cfefe", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.firstBodyTokenSlotDirect_eq_separator": { hash: "14ed4e3a04ef1a25dacfced086f131d0a9ca32b33f20e68e4f469a1bf0895b54", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.headerCursor_launch_workStep": { hash: "1042596fc69e7caf75cd9a200914ddda7d38887e0d69a6449f577cd6c7ea4d95", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.headerEndpoint_before_launch_timeout": { hash: "3e822c9ceb6c93b14a2be2bc2820c8d756bfa7aba759116ea786203a803e342c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.headerRejectEndpoint_timeout": { hash: "7066dc0a6d97b0ba1de016b3c9e0411dbddaae85b3d200b116dae4c2a238cac0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.headerState_injective": { hash: "6809ad9a3e53224190763f0c3f1a44cf6b51be71589ad1db4a1426cc6e5cee29", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.headerState_ne_appenderState": { hash: "a726e1857388047de6829f0d4744e2282bd6b503e2f4d3b26fba0e3ff77929b8", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.headerState_ne_cursorState": { hash: "a14587342fefedd1abe19190211c2198e70d3a4297a3f76f371c1beb28c21a60", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.header_workRunExact": { hash: "b9187bd36473966d53ec087bf6788e710366362fa0adaedac4330a9617c228bd", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.machine_acceptState_ne_rejectState": { hash: "584a79687212d3a0c0f22ffd89696ea8c523d7788c5f45b34ddf3054f2e622a7", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.malformedAppenderOutput_timeout": { hash: "134078d25b71b04071ed3960be3d9e25b1a9f73efc388820278e86629bad6b24", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.malformedAppenderTally_timeout": { hash: "63ff37a7325ec92751d394c9509a930c818076a6e0d9c134ff6e087184b7b0af", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.nextBitCursor_nextSlot": { hash: "789119bb75142ff180043965e0a89c1e16f6269167b650a0b38966b234deb29b", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_two": { hash: "d6646001b71db25b02190c75b55d3c767aa331244379504421cb3813166a82ba", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.rawTimeBound_eval": { hash: "8a0f33f895ef550741b2feed3e685fbd4b205c78b027f3377a0cd5eb5b9eb50d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.rawTimeBound_le": { hash: "1e97432ba79e7e51458fc31b9424913d4c31a9150a7a14d44a1fdd79a03fff21", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.rule_source_ne_acceptState": { hash: "95e62c04caa14e105e8c778c3cd955dc0000090dc7ccbed3ab61d0c41a22277f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.rule_source_ne_rejectState": { hash: "aebee131cad6a94d3ef8a037528a696fee64258cd409be40df0624049d872b29", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.rules_length": { hash: "1027191f94c78b274c3d8740ecd7bc83c709b965c99230e83a8a3a877adc2aa3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.rules_pairwise_query_distinct": { hash: "32143d0b5fde6d61fb853795510732563dcff935baf2a35a55299771686be708", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.run_compile_exact": { hash: "ce708c4288c6117267344b9473c7825dd5ec80553391f9b079b1f96dedcfc41b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.run_compile_rawTimeBound": { hash: "d294007089f681f74f48aa64f16edc92ff17a1621a42af227b6b5dd4474fe1c4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.run_compile_rawTimeBound_blankEquivalent": { hash: "fbde3d053b6737cc5d6ad8279befd985b3aaab68510c3b6ef2b6f997fc20d344", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.workBoundedDecide_accept": { hash: "9353985e12fbb3de51ed35fd77ac781e25cd0df7346454626f5a744f73b22a6a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.workRunExact": { hash: "a1aa7b3af052b6311cdf177874aed2cf7a76fb427f88272d31d40cde4eb4a2db", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.work_one_step_short_timeout": { hash: "0577a56507618c8358f7c233f355f831f690868fe0e8777a2b5daf735985d0ca", axioms: ["Quot.sound","propext"] }
};

const BUILDER_FIRST_LITERAL_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.boundedDecide_compile_accept": { hash: "abde80b5fd506e56a8e12c9f065228395b67c5f43463c306e74405a004657ef1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.boundedDecide_compile_ne_timeout": { hash: "c0e26a45f7d69b953efe8d788ccbee094f52e1ace4c7dbac159cdcf1a0c8e8f3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluatorDeadState_timeout": { hash: "6b418c72abcae9d08877a07bb2147b0e4fe0d4d3e9b8bebd91c92354d76a5b7c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluatorEndpoint_before_launch_timeout": { hash: "fe650b1d01c4aa6941ec2904730bee7149d9af77bdb7f899ca37eaa79d8f5ac5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluatorState_injective": { hash: "299b593c8d94450c5a846e2c2d82b21067649d537a02450ec461280cd98fcbf4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluatorState_ne_fAppenderState": { hash: "953ccd50cd73eb3aa48ae4ac2c20c398067f9fe186f6a1699f13068f8c787c0a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluatorState_ne_tAppenderState": { hash: "5e4eaf98a1c4143091235a41ec2792c0faa60d81b7f25ba969ffc8a04cf13a4d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluatorT_launch_workStep": { hash: "d948f20229cbb58059e464415550d81a87d0c611fe9457bfc306c7cb7fdfa0da", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluator_workRunExact": { hash: "dee0f08bb15fd35f56d21fb54d5fc72f0172556217c3c13a09b3eb6802092354", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.fAppenderState_injective": { hash: "2e4755d0df94e970b815e79a723b34674a128601c089617fafd126f055bb23d6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.fAppender_workRunExact": { hash: "b9794f6e2bbdf0bedbc056b1a1b4df507c66dad1974c7114c35f99f5ad537bce", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalOutside_contains_nextTokenSlot": { hash: "fc240107c069d1a9d543a32eeaad014dafa3796f809daba6950b8fcbc2cddd34", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalTape_represents": { hash: "10dff0a8f285e5dbee9cb5e7caac7da8d759b36d46eda6520018d31b8cec3215", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_firstLiteral": { hash: "e56d4ba55eba855a0362f38a39df4afa1b8c1233b14befa7d7157065954ac097", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.findWorkRule_evaluator_of_some": { hash: "60bd57a3c9168560c910f034d67666912c75f9523512046d14438bff8ba68c28", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.findWorkRule_fAppender_of_some": { hash: "b525569be2cd8af8753a325a083905c0c816cb686f1afd1844e6cb4fdadb725e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.findWorkRule_prefix_of_some": { hash: "3652deb26c506bf40cb5c5daa30e1da5205cdbbbce13181056899aea62959e3b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.findWorkRule_tAppender_of_some": { hash: "c50f6c9140177b8b2e62329a7c3d915af96bd1c7d2bb580ad28fb5656e933377", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralSignSlotDirect_eq_t": { hash: "570966f1f4ff829dd15f49056abf71948fdb901dacc19ac2582c0597e7c1c39e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_formula_prefix": { hash: "fd729b0c13ea09ed59a26eb1dc9dffb06f6473241522b44a4e6d2c44202e1df8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_prefix": { hash: "af77804256829bd81dd915e0739cb47ba49510f535a83b64633e87b076a7f286", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralZeroTerminatorSlotDirect_eq_f": { hash: "288c0ead5dadea820cecf265643a395af21ab241e8f637892f45b5eedf265d93", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.machine_acceptState_ne_rejectState": { hash: "850679993d2c0498609f68687e11a8ff2c11b405bbed8bdc6d2633cd7cc110ba", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.malformedAppenderOutput_timeout": { hash: "fe491a81c3445062899c556f81a7b78e86722843172705b9f92ea590d62f77b6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.malformedAppenderTally_timeout": { hash: "d99ff827748e93471a6f7944df5fee71f700ac45cd71b95213e19597f8080b17", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.malformedFAppenderOutput_timeout": { hash: "c611df708087210c88ef21ce4a94e8d6ea8b6ef427ebbe07d14ba7a237846ec6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.malformedFAppenderTally_timeout": { hash: "81c3c8d3c9a7ebf5a0a3b0fb8bbcb9a5f6ace38bca6cde7d06a3a5274f84f4c6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.nextBitCursor_nextSlot": { hash: "e1d1274624933ba762def5600c94fc1ac1e6cd317fa635c07f22a0bb8cf63988", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_four": { hash: "d7db21b8548073cea80e467db499530e8997ccaab63eb13efedda301f8c92cbb", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixEndpoint_before_launch_timeout": { hash: "842ec96a6d8c92ff2d43ca6e534a608c998882374bf8c0a290522a165ee9bd56", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixEvaluator_launch_workStep": { hash: "4c9611a7426546ea9f93cd598ea2fe83d59f009624d844fad563c8302a5a3c0a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixRejectEndpoint_timeout": { hash: "425d6d9e7ef55d52b2d143d5e3f4f75fa3c28b835b389f5095dcab47e7eb93c9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixState_injective": { hash: "072aad5d368bdb0ea39a35f45be473142fd8093329f576a3ea06872cf2999c73", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixState_ne_evaluatorState": { hash: "c2670d65bffb045c1bc594eb83227be0a7c5b2b7564ed5905d05d7af5a9395e8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixState_ne_fAppenderState": { hash: "9f836f2af8c22c868484cf083975dd23f3ec3fef0b1a36d9ca1830ae50f4b90e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixState_ne_tAppenderState": { hash: "0bc7a7a2084ada084071e0a26005a9d6b7cf8a2f2dde8ce803005377553f7897", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefix_workRunExact": { hash: "0660b7a9cd4f02b4def92a047cb756fa2d9e5071dd2a611de030b768d9c0c764", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rawTimeBound_eval": { hash: "f0364bdb4dcd544abb41ac552c6f106e74592c14cca3928cf0f9e0e28d764e2c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rawTimeBound_le": { hash: "72013a7ba4bce0eb78463e9e2cea87717e78b3f67e1640b04ec178f902e81d8e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rules_length": { hash: "a91a926cd30787c83b947d7bccba6ca6da5a5d9a43fdbc9545e0cc1bac5d0c6b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rules_pairwise_query_distinct": { hash: "f032dddcff5df10d054a34c57403753dd0ff857727bef8c12c19937d7b381cf6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.run_compile_exact": { hash: "08e4acb687f8b4d3ecd729f6def88eb87ff4e7be7f58454b7c839e7a031572c5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.run_compile_rawTimeBound": { hash: "163e0625ef3b803751abd145f5e91167b18d359bd967e017f213a5fe3745a538", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.run_compile_rawTimeBound_blankEquivalent": { hash: "48e4b1609a18520f9f8b934db04462c29eff8a8c7fae5f03f60b59223e7b7bed", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.tAppenderEndpoint_before_launch_timeout": { hash: "6b303cf6b180f459c0ae89ad38e0b430c485a1bb7c977527796f9393fecdcad0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.tAppenderState_injective": { hash: "c4433dee7b7048d20c1e8b5617f1dfdc48dca1abe6f96fa765f051ee41433ddf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.tAppenderState_ne_fAppenderState": { hash: "7bc737b722414e1f842f5be12df1a3fe02cab3acadc09c39943b7015b28920e0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.tAppender_workRunExact": { hash: "68ed69d2fb7be0255698eedf43eb8288531e95220585e029770f7bc8912d4957", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.tF_launch_workStep": { hash: "354457ec5f30ddfa30c2208ca2469a91c3fc0dbeea1df19938a517532a36323d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.workBoundedDecide_accept": { hash: "e301fcca24e8a85c18d07cf5db7147eb05f7c4fd10b004c006a92924709e82a1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.workRunExact": { hash: "41c05960af2e2232db3467056d1ef90e3e6f7e0f52384cf966634d43003c2a6d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.work_one_step_short_timeout": { hash: "93ffd7e3c0744c61e4ace7afa7735ebc7b04403ea8350e126c29bb09963ff762", axioms: ["Quot.sound","propext"] }
};

const BUILDER_FIRST_CLAUSE_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.finalTape_represents": { hash: "22f2b5433d277971dd68d297a0ef268965c668881c237b7b0beaaea393fc3393", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.machine_acceptState_ne_rejectState": { hash: "bc337e8ad3997c97419ede5fe2d70226bfc7b2008c7ffc388133177ca20bed06", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.rules_length": { hash: "406a7220601b34561d5544d8a3ad63daf6e061a67b981c0aa4474daab5a28687", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.rules_pairwise_query_distinct": { hash: "bf298a4cf07463028c72611fa3877d6ffe142c5f4eeee7347a335cb3e7f51981", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.tailTokens_length": { hash: "a708f41ce5c68b8e15664a129bed9934f5d408982f70a0e8fb79465a87891c92", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.workRunExact": { hash: "bf995a85cfdc05b179729f9d33611e2c3f09b702352992be5817c46003b48078", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.WorkChain.firstState_injective": { hash: "c5c9f3319bd695d183a00fbc00cd79fa457d8417a571e722821adc3f507b4261", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.WorkChain.firstState_ne_secondState": { hash: "0a22a174773f3447d193691e8a1b378951fb658032d78d399e27b79d40eaa723", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.WorkChain.launch_workStep": { hash: "1760eb5177652fa1a02b59b7cf1a37ed4ca1fb783bfe4bea0311ea3caea1bcc2", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.WorkChain.rules_pairwise_query_distinct": { hash: "f8153e8e9da3ca7dd92ba447232c26fd7a4843739b79d0982f02aeb984ed7a06", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.WorkChain.secondState_injective": { hash: "76a0bc867c072bcbd29c57141948164594cc820160cc2bc182005b7078874135", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.WorkChain.workRunExact": { hash: "5e3eaf5c23c94955d8a484a39a94c7cba9c417870a04322802dc1c348363679e", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.boundedDecide_compile_accept": { hash: "e9820a79411acae9b5ffc1c8d10992f11f0c5c4bd0dab460bdb71c894775f01c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.boundedDecide_compile_ne_timeout": { hash: "b48b5baab66329dba6dceab5628c791f4e325819b14f313d030296cb10f15879", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.evaluatorEndpoint_before_launch_timeout": { hash: "cef64675d9c44b9d0d5700564b49c8135f8f0c77196030146e45ede006b1e47b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.evaluatorTail_launch_workStep": { hash: "71c7eadb1e22463256d16ef96aa8df55f4c6ba8a12accbb0fcbc2feecdfd89c3", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.evaluator_workRunExact": { hash: "fabf060459dda7904b22240461a340e90487f0894cb999c2a1f8fb7ee32300fe", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.finalTape_represents": { hash: "c3a70724c5ac0adcc84a86747f77646d26aa287ed15ef867efcc221088a38033", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.finalTokenBits_eq_encodedFormula_firstClause": { hash: "4d9ae3a7efb96cc072cd31936478059f23790df135bd6e59131d606a3b96c93b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_formula_prefix": { hash: "00d450af73d7ebe355da565a2a948cda6eda18bb8233c39e1970c8ccdc8f7947", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_prefix": { hash: "b8da44ff1f5ef41cea4c84b1e087f49466d644a7a2529e9cf42d0f1b90898649", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.launch_workStep": { hash: "f2a7d225009e1f292128027f475502c1cc8b874d7c51a152e2e259856efd9f80", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.machine_acceptState_ne_rejectState": { hash: "eaafd8881be1336d30c046d3a0b26a9770104022b3638da5e408fa0fc83ec8a2", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.malformedAppenderOutput_timeout": { hash: "83717d081ffd2415f74bd690a2a3df0a4fdc9e9cebc4f0f014ba921cf0a05179", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.malformedAppenderTally_timeout": { hash: "5281aeab7e5560738d5f38d41f7a1f731a2b833fd184a33d694057b8f6e4b49b", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextBitCursor_nextSlot": { hash: "f5f9a639bac36a4347a2ff1bb8669f84cff8a21cd9a828f955cb4d04d1cabfc5", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_twelve": { hash: "a326db076a3b3bc8d4d7fcdd5e95a2ad3c860ba5e00cf32ecf8658dbd20b90af", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.prefixEndpoint_before_launch_timeout": { hash: "5b7650f771ca1a4ab2392119204ac085c9110d78c41bfd2dd4f65082e6ed20b9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.prefix_workRunExact": { hash: "1822772859a9164452bd909471883edfa6f9bd0f61db8f5146c337b9646c7880", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rawTimeBound_eval": { hash: "1aa76aa45b4214d5296c2b1c3c037cdf29630b3a3b719e6a011c896d8407f7f0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rawTimeBound_le": { hash: "05ff6942c8b20411b17d4dbb6e9a089718dc3b6cb0f4d9d4d7839747fbfd300b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rules_length": { hash: "1b35f70e051041e999b94afdb04b225b682555f89f1777ff881ca27eda76c5a1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rules_pairwise_query_distinct": { hash: "4a9de6a3362b284492fe63fccafe3b38c75f459139aba179a931e8a57f112e57", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_exact": { hash: "d3218310545ba82889ba289bb1400f9a1da5cc5feb764df5d68ab3b78ea5a01b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_rawTimeBound": { hash: "110cfecab08644f17e88bffaf579be0fc23a82ac6ee41551842e94d242140ba3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_rawTimeBound_blankEquivalent": { hash: "42444be55dd623ca14f7f11e7f22ad2c0e5e89956996c6a77c5123d84d7a78a5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.tail_workRunExact": { hash: "62bc1486e5f8cb4550554467a3568eb5f0c58581a69791ea713757e7187bc635", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.workBoundedDecide_accept": { hash: "8e0bd1d16f4c86cabb7896da1d5989c839c75de4f32e5f966d04a6be5a300977", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.workRunExact": { hash: "d88b1cfe2eb57dcc18901fdd4cdbe45f817ef2ad83cb715662035894166a8c1f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.work_one_step_short_timeout": { hash: "049cffe772b2e1048dfafef75e842b07941262528e532c1cba3cf86d2457a89c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rule_source_ne_acceptState": { hash: "9e9ee0c03e377d2c653eff8d205e0fd00dc2eb120b35075afb357238c52277b3", axioms: ["Quot.sound","propext"] }
};

const KIND_TO_REF = new Map([
  ["current core publication file", "currentCoreRef"],
  ["pnplabs current core mirror", "publicCheckout"],
  ["pnplabs current release metadata", "publicCheckout"],
  ["pnplabs quarantined historical metadata", "publicCheckout"],
  ["historical source snapshot", "historicalSourceRef"],
  ["historical documentation snapshot", "historicalDocsRef"],
  ["historical generated-artifact snapshot", "historicalArtifactRef"]
]);

export class AuditTargetValidationError extends Error {
  constructor(failures, result = {}) {
    super(`audit target validation failed with ${failures.length} failure(s)`);
    this.name = "AuditTargetValidationError";
    this.failures = failures;
    this.result = result;
  }
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function safeRelativePath(value, label, failures) {
  if (typeof value !== "string" || value === "" || path.isAbsolute(value) || value.includes("\\") || value.split("/").includes("..")) {
    failures.push(`${label}: unsafe relative path ${String(value)}`);
    return false;
  }
  return true;
}

function runGit(sourceDir, args, encoding = "utf8") {
  const result = spawnSync("git", ["-C", sourceDir, ...args], {
    encoding,
    maxBuffer: 16 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"]
  });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr
  };
}

function gitText(sourceDir, args, label, failures) {
  const result = runGit(sourceDir, args, "utf8");
  if (!result.ok) {
    failures.push(`${label}: git ${args.join(" ")} failed: ${(result.stderr || result.stdout || "unknown failure").trim()}`);
    return null;
  }
  return result.stdout.trim();
}

function gitBlob(sourceDir, ref, targetPath, label, failures) {
  const result = runGit(sourceDir, ["show", `${ref}:${targetPath}`], null);
  if (!result.ok) {
    const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString("utf8") : result.stderr;
    failures.push(`${label}: missing path ${ref}:${targetPath}: ${(stderr || "git show failed").trim()}`);
    return null;
  }
  return result.stdout;
}

function validateTargetManifest(manifest, failures) {
  if (manifest.kind !== "PNPLabsCrossRepositoryAuditTargets0" || manifest.version !== 2) {
    failures.push("audit target manifest kind/version mismatch");
  }
  const ids = new Set();
  for (const target of manifest.targets || []) {
    if (!target.id || ids.has(target.id)) failures.push(`duplicate or missing target id: ${target.id || "<missing>"}`);
    ids.add(target.id);
    const requiredRef = KIND_TO_REF.get(target.kind);
    if (!requiredRef) failures.push(`${target.id || "<unknown>"}: unsupported target kind ${target.kind}`);
    else if (target.refClass !== requiredRef) failures.push(`${target.id}: ${target.kind} must use ${requiredRef}, not ${target.refClass}`);
    if (!manifest.refs?.[target.refClass]) failures.push(`${target.id}: unknown refClass ${target.refClass}`);
    safeRelativePath(target.path, target.id || "target", failures);
    if (target.mirrorOf && target.refClass !== "publicCheckout") failures.push(`${target.id}: only public-checkout targets may declare mirrorOf`);
  }
  for (const target of manifest.targets || []) {
    if (target.mirrorOf && !ids.has(target.mirrorOf)) failures.push(`${target.id}: unknown mirrorOf target ${target.mirrorOf}`);
  }
  for (const [refClass, ref] of Object.entries(manifest.refs || {})) {
    if (refClass.startsWith("historical") && ref.status !== "historical-quarantined-not-current-authority") {
      failures.push(`${refClass}: historical ref is not explicitly quarantined`);
    }
  }
}

function validateReleaseManifest(manifest, expectedIdentity, failures) {
  if (manifest.kind !== "PNPFormalPublicationRelease0" || manifest.version !== 0) failures.push("formal-publication manifest kind/version mismatch");
  if (manifest.status !== "current-formal-reconstruction-publication-theorem-gate-closed" || manifest.authority !== "current") failures.push("formal-publication manifest authority mismatch");
  if (manifest.source?.commit !== expectedIdentity.commit || manifest.source?.proofCommit !== expectedIdentity.proofCommit || manifest.source?.tree !== expectedIdentity.tree || manifest.source?.ref !== expectedIdentity.commit) failures.push("formal-publication manifest core/proof pin mismatch");
  if (manifest.source?.coordinateAloneIsAuthority !== false || manifest.source?.identityRequiresCommitTreeAndArtifactHashes !== true) failures.push("formal-publication manifest identity policy mismatch");
  if (typeof manifest.source?.formalPublicationMapCoordinate !== "string" || !/^[0-9a-f]{64}$/.test(manifest.source?.formalPublicationMapSha256 || "") || !/^[0-9a-f]{64}$/.test(manifest.source?.leanSourceClosureSha256 || "")) failures.push("formal-publication manifest publication-map identity mismatch");
  const boundary = manifest.publicationBoundary || {};
  if (boundary.derivedOnlyFromConcreteGate !== true || boundary.concreteGatePassed !== false || boundary.mathematicalTheoremEstablished !== false || boundary.publicTheoremEmissionAllowed !== false || boundary.publicTheoremStatement !== null) failures.push("formal-publication manifest does not fail closed");
  if (boundary.compatibilityRootPresent !== false || boundary.concreteTargetPresent !== true || boundary.projectSpecificAxiomsRemaining !== true || boundary.remainingBlockerCount !== 6) failures.push("formal-publication manifest blocker boundary mismatch");
  if (manifest.artifacts?.report?.pageCount !== 22) failures.push("formal-publication report must have exactly twenty-two pages");
  const earned = manifest.earnedBoundary || {};
  if (earned.pipelineStateNamespacesFormalized !== true || earned.pipelineStateNamespaceAxiomAuditPassed !== true || earned.pipelineStateNamespaceAuditedDeclarationCount !== 39) failures.push("formal-publication pipeline namespace boundary mismatch");
  if (earned.pipelineStageBridgesFormalized !== true || earned.pipelineStageBridgeAxiomAuditPassed !== true || earned.pipelineStageBridgeAuditedDeclarationCount !== 56 || earned.pipelineStageLaunchFormalized !== true || earned.pipelineVerdictPreservationFormalized !== true || earned.pipelineInternalOutputHandoffComposed !== true) failures.push("formal-publication pipeline stage-bridge boundary mismatch");
  if (earned.pipelineTargetTerminationFormalized !== false || earned.pipelineTerminalRawOutputPackingFormalized !== true || earned.pipelineTerminalOutputPackerAxiomAuditPassed !== true || earned.pipelineTerminalOutputPackerAuditedDeclarationCount !== 69) failures.push("formal-publication terminal-output packer boundary mismatch");
  if (earned.pipelineTerminalOutputPackerTheorem !== "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq" || earned.pipelineTerminalOutputPackerKernelTypeSha256 !== "2e8a41501c1bfb17ac78b70a93c2996db1ab607465c4a61a91236a4787b07b66" || earned.pipelineTerminalOutputPackerCompiledRawTimeBound !== "18 * outputLength^2 + 36 * outputLength + 6" || earned.pipelineTerminalOutputPackerConnectedToBridge !== true || !Array.isArray(earned.pipelineTerminalOutputPackerAxiomClosure) || earned.pipelineTerminalOutputPackerAxiomClosure.length !== 0) failures.push("formal-publication terminal-output packer evidence mismatch");
  if (earned.pipelineTerminalBridgeAxiomAuditPassed !== true || earned.pipelineTerminalBridgeAuditedDeclarationCount !== 59 || earned.pipelineTerminalBridgeAcceptingOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents" || earned.pipelineTerminalBridgeAcceptingOutputKernelTypeSha256 !== "f6ff227ee77408d4b833da4b277cbe24950b52f12bb8aaec3b8d0f48a4000001") failures.push("formal-publication accepting terminal-bridge evidence mismatch");
  if (earned.pipelineTerminalBridgeRejectingOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_rejecting_of_represents" || earned.pipelineTerminalBridgeRejectingOutputKernelTypeSha256 !== "ebdf594cf57d6ab317bc692ac491746099ba5c955853b6deaf41b17240c1a9db" || earned.pipelineTerminalBridgeCompiledRawTimeBound !== "18 * outputLength^2 + 36 * outputLength + 12") failures.push("formal-publication rejecting terminal-bridge evidence mismatch");
  if (earned.pipelineSuppliedAcceptTraceTheorem !== "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact" || earned.pipelineSuppliedAcceptTraceKernelTypeSha256 !== "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29" || earned.pipelineSuppliedRejectTraceTheorem !== "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact" || earned.pipelineSuppliedRejectTraceKernelTypeSha256 !== "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c") failures.push("formal-publication supplied trace evidence mismatch");
  if (earned.pipelineSuppliedAcceptMachineOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact" || earned.pipelineSuppliedAcceptMachineOutputKernelTypeSha256 !== "dacbb94707b8cab5e553ca3cbc01c02130827940ef487f4981c96799ab6d1a01" || earned.pipelineSuppliedRejectMachineOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact" || earned.pipelineSuppliedRejectMachineOutputKernelTypeSha256 !== "05a89482ad3ab866041fd93caf8a2a9727df0956794e3b5a1849df74dc4eb7bd") failures.push("formal-publication supplied output evidence mismatch");
  if (!Array.isArray(earned.pipelineTerminalBridgeAxiomClosure) || earned.pipelineTerminalBridgeAxiomClosure.length !== 0 || earned.pipelinePriorTraceTransportToTerminalBridgeFormalized !== true) failures.push("formal-publication terminal-bridge supplied-trace boundary mismatch");
  if (earned.pipelineInputFramerAxiomAuditPassed !== true || earned.pipelineInputFramerAuditedDeclarationCount !== 70 || earned.pipelineAllInputFramingFormalized !== true || !Array.isArray(earned.pipelineInputFramerAxiomClosure) || earned.pipelineInputFramerAxiomClosure.length !== 0) failures.push("formal-publication all-input framer audit boundary mismatch");
  if (earned.pipelineInputFramerWorkTraceTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact" || earned.pipelineInputFramerWorkTraceKernelTypeSha256 !== "ad6e7cfe1206448f72a57135408a3c2e057411b4f418cdca0fd6a376a2863a1a") failures.push("formal-publication all-input framer trace evidence mismatch");
  if (earned.pipelineInputFramerRepresentedEndpointTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents" || earned.pipelineInputFramerRepresentedEndpointKernelTypeSha256 !== "8f1fa6f45f267d60eadad754d9c88e4ea58631b881152af0a51244f5f7d207af" || earned.pipelineInputFramerHaltedEndpointTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted" || earned.pipelineInputFramerHaltedEndpointKernelTypeSha256 !== "beca62f878cccce7434d899512cf9aaea25b222d113ec60df90da0fde8801faa") failures.push("formal-publication all-input framer endpoint evidence mismatch");
  if (earned.pipelineInputFramerRawBoundTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le" || earned.pipelineInputFramerRawBoundKernelTypeSha256 !== "bac4d4c78cb57e3ab70f752e2895a2f7ddd3c5356a6d1c457dd5832413d89eab" || earned.pipelineInputFramerRawTimePolynomial !== "6 * m * m + 39 * m + 75") failures.push("formal-publication all-input framer polynomial evidence mismatch");
  if (earned.pipelineInputFramerOrdinaryStartTheorem !== "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound" || earned.pipelineInputFramerOrdinaryStartKernelTypeSha256 !== "4efe0f62d185b7ac19d73aebb09008e97f00c96a8252e263c901f8a6add7c45b" || earned.pipelineInputFramerBlankEquivalentTheorem !== "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent" || earned.pipelineInputFramerBlankEquivalentKernelTypeSha256 !== "1eaa31ea98226c202722a0e67aa796b7b461ccf5367f35fff194973bb609ce8a") failures.push("formal-publication all-input framer ordinary-start evidence mismatch");
  if (earned.pipelineInputFramerAcceptTheorem !== "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept" || earned.pipelineInputFramerAcceptKernelTypeSha256 !== "3ef9f8377ec7ad7ebb70aa41b978cdb22f2c1c029b26e1e4c241ce00c20781d4" || earned.pipelineInputFramerNoTimeoutTheorem !== "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout" || earned.pipelineInputFramerNoTimeoutKernelTypeSha256 !== "48b9ee1743a6881a663fb7a1cc59984c371ff853524f9b18bad58014c229f9fe") failures.push("formal-publication all-input framer verdict evidence mismatch");
  if (earned.pipelineInputFramerEmptyWorkSteps !== "4" || earned.pipelineInputFramerCompleteCellsWorkSteps !== "4 * k * k + 9 * k + 7" || earned.pipelineInputFramerPartialCellWorkSteps !== "4 * k * k + 9 * k + 5") failures.push("formal-publication all-input framer branch-cost evidence mismatch");
  if (earned.pipelinePairedCompilerAxiomAuditPassed !== true || earned.pipelinePairedCompilerAuditedDeclarationCount !== 28 || earned.pipelineCanonicalPairCompilationFormalized !== true) failures.push("formal-publication canonical-pair compiler boundary mismatch");
  if (earned.pipelinePairedVerdictTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq" || earned.pipelinePairedVerdictKernelTypeSha256 !== "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731") failures.push("formal-publication canonical-pair verdict evidence mismatch");
  if (earned.pipelinePairedMachineOutputTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq" || earned.pipelinePairedMachineOutputKernelTypeSha256 !== "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267") failures.push("formal-publication canonical-pair output evidence mismatch");
  if (earned.pipelinePairedNoTimeoutTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout" || earned.pipelinePairedNoTimeoutKernelTypeSha256 !== "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab") failures.push("formal-publication canonical-pair timeout evidence mismatch");
  if (earned.pipelinePairedAcceptsTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff" || earned.pipelinePairedAcceptsKernelTypeSha256 !== "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9") failures.push("formal-publication canonical-pair language evidence mismatch");
  if (!Array.isArray(earned.pipelinePairedCompilerAxiomClosure) || earned.pipelinePairedCompilerAxiomClosure.length !== 0 || earned.pipelinePairedOutputSizePolynomial !== "B(m) = m + p(m) + 1" || earned.pipelinePairedRawTimePolynomial !== "Rpair(m) = inputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))") failures.push("formal-publication canonical-pair polynomial evidence mismatch");
  if (earned.pipelineCompilerAxiomAuditPassed !== true || earned.pipelineCompilerAuditedDeclarationCount !== 29 || earned.pipelineAllInputCompilationFormalized !== true || !Array.isArray(earned.pipelineCompilerAxiomClosure) || earned.pipelineCompilerAxiomClosure.length !== 0) failures.push("formal-publication all-input compiler audit boundary mismatch");
  if (earned.pipelineCompilerCorrectTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_correct" || earned.pipelineCompilerCorrectKernelTypeSha256 !== "e1ccd198403d41933324af1c52048c865943947c5bbd40dd94e11827b08c2303") failures.push("formal-publication all-input compiler correctness evidence mismatch");
  if (earned.pipelineVerdictTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq" || earned.pipelineVerdictKernelTypeSha256 !== "1bafe91bba94e65a7ad654f4624f305c0ae01b3e6d656af0dd2e752d373ce87e") failures.push("formal-publication all-input compiler verdict evidence mismatch");
  if (earned.pipelineMachineOutputTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq" || earned.pipelineMachineOutputKernelTypeSha256 !== "45e02fa1e6e6b0bcbc422c3b4fd797608b875727d22b79d6f7814e1f4f0d3da7") failures.push("formal-publication all-input compiler output evidence mismatch");
  if (earned.pipelineNoTimeoutTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout" || earned.pipelineNoTimeoutKernelTypeSha256 !== "ed95c33d4fa998d79057537cd2adf847548a79b7ee9a45020b01620868273b3a") failures.push("formal-publication all-input compiler timeout evidence mismatch");
  if (earned.pipelineAcceptsTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff" || earned.pipelineAcceptsKernelTypeSha256 !== "94e43c664b4d185e48553ab25541925830fec7086fcbbab5215dacdcde1af6a6") failures.push("formal-publication all-input compiler language evidence mismatch");
  if (earned.pipelineAllInputStuckTimeoutTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact" || earned.pipelineAllInputStuckTimeoutKernelTypeSha256 !== "a6edef0532eb89036d0e6813cffb94b321f9160a08035671eb411c813ef0a3de") failures.push("formal-publication all-input compiler stuck-timeout evidence mismatch");
  if (earned.pipelineOutputSizePolynomial !== "B(m) = m + p(m) + 1" || earned.pipelineRawTimePolynomial !== "R(m) = totalInputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))") failures.push("formal-publication all-input compiler polynomial evidence mismatch");
  if (earned.pipelineExternalInputSizePolynomialFormalized !== true || earned.pipelineMalformedInputBehaviorFormalized !== true || earned.pipelineRawRefinementFormalized !== true) failures.push("formal-publication all-input compiler boundary mismatch");
  if (earned.pipelineSequentialNamespaceFormalized !== true || earned.pipelineSequentialNamespaceAxiomAuditPassed !== true || earned.pipelineSequentialNamespaceAuditedDeclarationCount !== 26 || !Array.isArray(earned.pipelineSequentialNamespaceAxiomClosure) || earned.pipelineSequentialNamespaceAxiomClosure.length !== 0) failures.push("formal-publication sequential namespace boundary mismatch");
  if (earned.pipelineSequentialCompilationFormalized !== true || earned.pipelineSequentialCompilerAxiomAuditPassed !== true || earned.pipelineSequentialCompilerAuditedDeclarationCount !== 31 || earned.pipelineSequentialVerdictAndOutputPreservationFormalized !== true || earned.pipelineSequentialExternalInputSizePolynomialFormalized !== true || earned.pipelineSequentialStuckFirstTimeoutFormalized !== true || !Array.isArray(earned.pipelineSequentialCompilerAxiomClosure) || earned.pipelineSequentialCompilerAxiomClosure.length !== 0) failures.push("formal-publication sequential compiler boundary mismatch");
  if (earned.pipelineSequentialCorrectTheorem !== "PNP.Concrete.PipelineSequentialCompiler.sequential_correct" || earned.pipelineSequentialCorrectKernelTypeSha256 !== "8943f2f2c396dfb2e6e8232244b9ecb386fe3a7259590ed96cedb82d1cc7b22a") failures.push("formal-publication sequential correctness evidence mismatch");
  if (earned.pipelineSequentialVerdictTheorem !== "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq" || earned.pipelineSequentialVerdictKernelTypeSha256 !== "dd282c364787b165c9be9ca80b712c3ebf61ac95d097218300a65433a690e386") failures.push("formal-publication sequential verdict evidence mismatch");
  if (earned.pipelineSequentialMachineOutputTheorem !== "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq" || earned.pipelineSequentialMachineOutputKernelTypeSha256 !== "8d954e0e65847ff071a3a79a7be1c7f7d5a2f1696e3f94be3a7288500598b9d7") failures.push("formal-publication sequential output evidence mismatch");
  if (earned.pipelineSequentialNoTimeoutTheorem !== "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout" || earned.pipelineSequentialNoTimeoutKernelTypeSha256 !== "116c522c8a64988fd815b32bad08df882534b94b87cfa42a705fd1d8158d45af") failures.push("formal-publication sequential timeout evidence mismatch");
  if (earned.pipelineSequentialAcceptsTheorem !== "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff" || earned.pipelineSequentialAcceptsKernelTypeSha256 !== "7a6d0d03c735c83a2fb0c764a174a79402ec196a98169614b15dbee442df099e") failures.push("formal-publication sequential language evidence mismatch");
  if (earned.pipelineSequentialStuckFirstTimeoutTheorem !== "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact" || earned.pipelineSequentialStuckFirstTimeoutKernelTypeSha256 !== "5f5f0889b807ea0ccefdfb911ba8b583de9999f2a627745bc9317c0c6ff21a34") failures.push("formal-publication sequential stuck-first evidence mismatch");
  if (earned.pipelineSequentialOutputSizePolynomial !== "Bseq(m) = m + p(m) + 1" || earned.pipelineSequentialRawTimePolynomial !== "Rseq(m) = PipelineRaw(p)(m) + 6 + PipelineRaw(q)(m + p(m) + 1)") failures.push("formal-publication sequential polynomial evidence mismatch");
  if (earned.pipelineRefinementAxiomAuditPassed !== true || earned.pipelineRefinementAuditedDeclarationCount !== 16 || !Array.isArray(earned.pipelineRefinementAxiomClosure) || earned.pipelineRefinementAxiomClosure.length !== 0 || earned.functionProgramRecursiveCompilationFormalized !== true || earned.decisionProgramRecursiveCompilationFormalized !== true || earned.polynomialTimeDeciderRawCompilationFormalized !== true) failures.push("formal-publication recursive refinement boundary mismatch");
  if (earned.functionProgramCompileHaltsTheorem !== "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin" || earned.functionProgramCompileHaltsKernelTypeSha256 !== "53bd33de652a55facc74179863672a789f40f9ba6dea293c2de29fcc866b5a3d") failures.push("formal-publication function-program halting evidence mismatch");
  if (earned.functionProgramCompileOutputTheorem !== "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq" || earned.functionProgramCompileOutputKernelTypeSha256 !== "e3bb23c7f245cb516803a91468e3a3b220338c36a11790ffa5045b8c41332a24") failures.push("formal-publication function-program output evidence mismatch");
  if (earned.decisionProgramCompileHaltsTheorem !== "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin" || earned.decisionProgramCompileHaltsKernelTypeSha256 !== "4057fc9d48be85dd7f961ce7acf5bef68ddb4ed0c8b6798617b31deb9da8c7c5") failures.push("formal-publication decision-program halting evidence mismatch");
  if (earned.decisionProgramCompileVerdictTheorem !== "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq" || earned.decisionProgramCompileVerdictKernelTypeSha256 !== "8b390dd6677d6e789499b7b713855652a5e1db2c64809ddf43d079deb4099965") failures.push("formal-publication decision-program verdict evidence mismatch");
  if (earned.polynomialTimeDeciderCompileAcceptsTheorem !== "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff" || earned.polynomialTimeDeciderCompileAcceptsKernelTypeSha256 !== "ebc638eb12e60d97a7d33b0cdce5a6322594342547f65128c0a3f11503fa35ba" || earned.standardComplexityModelFormalized !== true || earned.concreteComplexityMachineLinkDischarged !== true) failures.push("formal-publication polynomial-time decider compilation evidence mismatch");
  if (earned.cookLevinRawTapeBridgeFormalized !== true || earned.cookLevinRawTapeBridgeAxiomAuditPassed !== true || earned.cookLevinRawTapeBridgeAuditedDeclarationCount !== 54 || earned.cookLevinSemanticReductionCorrectnessFormalized !== true) failures.push("formal-publication Cook-Levin raw-tape boundary mismatch");
  if (earned.cookLevinSemanticTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language" || earned.cookLevinSemanticKernelTypeSha256 !== "985c8d12419343045c76abbcfa6def7d4e01ce816d97180dca14d7bf5c0be34d") failures.push("formal-publication Cook-Levin theorem identity mismatch");
  if (JSON.stringify(earned.cookLevinRawTapeBridgeAxiomClosure) !== JSON.stringify(["Classical.choice", "Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinProjectAxiomClosure) || earned.cookLevinProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin axiom closure mismatch");
  if (earned.cookLevinFormulaSizeAxiomAuditPassed !== true || earned.cookLevinFormulaSizeAuditedDeclarationCount !== 108 || earned.cookLevinEncodedFormulaSizePolynomialFormalized !== true) failures.push("formal-publication Cook-Levin formula-size boundary mismatch");
  if (earned.cookLevinEncodedFormulaSizeTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le" || earned.cookLevinEncodedFormulaSizeKernelTypeSha256 !== "c2b0a4afd8793022739cde9904d379a3c807fba07f0db0ab23e3b0b0563ed699") failures.push("formal-publication Cook-Levin formula-size identity mismatch");
  if (JSON.stringify(earned.cookLevinFormulaSizeAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinFormulaSizeProjectAxiomClosure) || earned.cookLevinFormulaSizeProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin formula-size axiom closure mismatch");
  if (earned.cookLevinFormulaScheduleFormalized !== true || earned.cookLevinFormulaScheduleAxiomAuditPassed !== true || earned.cookLevinFormulaScheduleAuditedDeclarationCount !== 79 || earned.cookLevinFormulaScheduleAnswerIndependent !== true || earned.cookLevinFormulaScheduleExactEmissionFormalized !== true || earned.cookLevinFormulaScheduleExactLengthPolynomialFormalized !== true) failures.push("formal-publication Cook-Levin formula-schedule boundary mismatch");
  if (earned.cookLevinFormulaScheduleLengthTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length" || earned.cookLevinFormulaScheduleLengthKernelTypeSha256 !== "7460e8b8c59a2356dc8ece81571e7bcb76faf71a5ae0492d034b1d8c5d2408c4") failures.push("formal-publication Cook-Levin formula-schedule length identity mismatch");
  if (earned.cookLevinFormulaScheduleEmitTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula" || earned.cookLevinFormulaScheduleEmitKernelTypeSha256 !== "2376179dbf80f6e0bb76d8a6026518aa0d042e1eb79f3ec567474a730f742943") failures.push("formal-publication Cook-Levin formula-schedule emit identity mismatch");
  if (JSON.stringify(earned.cookLevinFormulaScheduleAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinFormulaScheduleProjectAxiomClosure) || earned.cookLevinFormulaScheduleProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin formula-schedule axiom closure mismatch");
  if (earned.cookLevinFormulaScheduleConstantTimeRawInterpretationFormalized !== false || earned.cookLevinRawFormulaBuilderFormalized !== false || earned.cookLevinFormulaScheduleFunctionProgramRawRefinementFormalized !== false || earned.cookLevinFormulaConstructionRuntimePolynomialFormalized !== false || earned.cookLevinPolynomialReductionFormalized !== false) failures.push("formal-publication overstates Cook-Levin construction complexity");
  if (earned.cookLevinFormulaCursorFormalized !== true || earned.cookLevinFormulaCursorAxiomAuditPassed !== true || earned.cookLevinFormulaCursorAuditedDeclarationCount !== 129 || earned.cookLevinFormulaCursorDirectCoordinateLookupFormalized !== true || earned.cookLevinFormulaCursorNestedOptionSemanticsFormalized !== true || earned.cookLevinFormulaCursorExactTraversalFormalized !== true || earned.cookLevinFormulaCursorExactLengthPolynomialFormalized !== true) failures.push("formal-publication Cook-Levin formula-cursor boundary mismatch");
  if (earned.cookLevinFormulaCursorDirectBitTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotDirect_eq" || earned.cookLevinFormulaCursorPolynomialTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotCountDirect_eq_polynomial" || earned.cookLevinFormulaCursorFullTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full" || earned.cookLevinFormulaCursorOneStepShortTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_one_step_short" || earned.cookLevinFormulaCursorExcessTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_excess" || earned.cookLevinFormulaCursorEmitTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula") failures.push("formal-publication Cook-Levin formula-cursor theorem identity mismatch");
  if (JSON.stringify(earned.cookLevinFormulaCursorAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinFormulaCursorProjectAxiomClosure) || earned.cookLevinFormulaCursorProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin formula-cursor axiom closure mismatch");
  const cursorHashes = earned.cookLevinFormulaCursorTheoremKernelTypeSha256;
  if (!cursorHashes || Object.keys(cursorHashes).length !== 13 || !Object.entries(FORMULA_CURSOR_THEOREM_HASHES).every(([name, hash]) => cursorHashes[name] === hash)) failures.push("formal-publication Cook-Levin formula-cursor fingerprint mismatch");
  if (earned.cookLevinFormulaCursorConstantTimeRawInterpretationFormalized !== false || earned.cookLevinFormulaCursorRawBuilderFormalized !== false || earned.cookLevinFormulaCursorFunctionProgramRawRefinementFormalized !== false) failures.push("formal-publication overstates the Cook-Levin formula cursor");
  if (earned.cookLevinBuilderInputLengthFormalized !== true || earned.cookLevinBuilderInputLengthAxiomAuditPassed !== true || earned.cookLevinBuilderInputLengthAuditedDeclarationCount !== 39 || earned.cookLevinBuilderInputLengthCompiledRawMachineFormalized !== true || earned.cookLevinBuilderInputLengthExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized !== true || earned.cookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized !== true) failures.push("formal-publication Cook-Levin builder input-length boundary mismatch");
  if (earned.cookLevinBuilderInputLengthWorkTimePolynomial !== "2 * inputLength^2 + 4 * inputLength + 2" || earned.cookLevinBuilderInputLengthRawTimePolynomial !== "12 * inputLength^2 + 24 * inputLength + 12" || earned.cookLevinBuilderInputLengthRuleCount !== 19) failures.push("formal-publication Cook-Levin builder input-length cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderInputLengthAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderInputLengthProjectAxiomClosure) || earned.cookLevinBuilderInputLengthProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin builder input-length axiom closure mismatch");
  const builderHashes = earned.cookLevinBuilderInputLengthTheoremKernelTypeSha256;
  if (!builderHashes || Object.keys(builderHashes).length !== 10 || !Object.entries(BUILDER_INPUT_LENGTH_THEOREMS).every(([name, evidence]) => builderHashes[name] === evidence.hash)) failures.push("formal-publication Cook-Levin builder input-length fingerprint mismatch");
  if (earned.cookLevinBuilderInputPrefixFormalized !== true || earned.cookLevinBuilderInputPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderInputPrefixAuditedDeclarationCount !== 40 || earned.cookLevinBuilderInputPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized !== true || earned.cookLevinBuilderInputPrefixLiteralFramerLaunchFormalized !== true) failures.push("formal-publication Cook-Levin builder input-prefix boundary mismatch");
  if (earned.cookLevinBuilderInputPrefixWorkTimePolynomial !== "totalInputFramerWorkSteps(input) + 1 + 2 * inputLength^2 + 4 * inputLength + 2" || earned.cookLevinBuilderInputPrefixRawTimePolynomial !== "18 * inputLength^2 + 63 * inputLength + 93") failures.push("formal-publication Cook-Levin builder input-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderInputPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderInputPrefixProjectAxiomClosure) || earned.cookLevinBuilderInputPrefixProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin builder input-prefix axiom closure mismatch");
  const builderPrefixHashes = earned.cookLevinBuilderInputPrefixTheoremKernelTypeSha256;
  if (!builderPrefixHashes || Object.keys(builderPrefixHashes).length !== 14 || !Object.entries(BUILDER_INPUT_PREFIX_THEOREMS).every(([name, evidence]) => builderPrefixHashes[name] === evidence.hash)) failures.push("formal-publication Cook-Levin builder input-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderInputPrefixFormulaBitsEmittedFormalized !== false || earned.cookLevinCompleteRawFormulaBuilderFormalized !== false || earned.cookLevinBuilderFunctionProgramRawRefinementFormalized !== false || earned.cookLevinPolynomialReductionFormalized !== false) failures.push("formal-publication overstates the Cook-Levin builder input prefix");
  if (earned.cookLevinBuilderTokenAppenderFormalized !== true || earned.cookLevinBuilderTokenAppenderAxiomAuditPassed !== true || earned.cookLevinBuilderTokenAppenderAuditedDeclarationCount !== 68 || earned.cookLevinBuilderTokenAppenderCompiledRawMachineFormalized !== true || earned.cookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderTokenAppenderAllTokensExactFormalized !== true || earned.cookLevinBuilderTokenAppenderFirstFormulaBitsFormalized !== true || earned.cookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized !== true || earned.cookLevinBuilderTokenAppenderInputPrefixComposed !== true) failures.push("formal-publication Cook-Levin builder token-appender boundary mismatch");
  if (earned.cookLevinBuilderTokenAppenderWorkTime !== "2 * (max 1 inputLength + inputLength + priorTokenCount + 3)" || earned.cookLevinBuilderTokenAppenderFirstTokenRawTimePolynomial !== "24 * inputLength + 48" || earned.cookLevinBuilderTokenAppenderRuleCount !== 59) failures.push("formal-publication Cook-Levin builder token-appender cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderTokenAppenderAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderTokenAppenderProjectAxiomClosure) || earned.cookLevinBuilderTokenAppenderProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin builder token-appender axiom closure mismatch");
  const builderTokenHashes = earned.cookLevinBuilderTokenAppenderTheoremKernelTypeSha256;
  if (!builderTokenHashes || Object.keys(builderTokenHashes).length !== 17 || !Object.entries(BUILDER_TOKEN_APPENDER_THEOREMS).every(([name, evidence]) => builderTokenHashes[name] === evidence.hash)) failures.push("formal-publication Cook-Levin builder token-appender fingerprint mismatch");
  if (earned.cookLevinBuilderTokenAppenderCompleteHeaderFormalized !== false || earned.cookLevinBuilderTokenAppenderDynamicCursorInterpretationFormalized !== false || earned.cookLevinCompleteRawFormulaBuilderFormalized !== false || earned.cookLevinBuilderFunctionProgramRawRefinementFormalized !== false || earned.cookLevinPolynomialReductionFormalized !== false) failures.push("formal-publication overstates the Cook-Levin builder token appender");
  if (earned.cookLevinBuilderFirstTokenPrefixFormalized !== true || earned.cookLevinBuilderFirstTokenPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderFirstTokenPrefixAuditedDeclarationCount !== 37 || earned.cookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized !== true) failures.push("formal-publication Cook-Levin builder first-token-prefix boundary mismatch");
  if (earned.cookLevinBuilderFirstTokenPrefixWorkTime !== "BuilderInputPrefix.workSteps(input) + 1 + BuilderTokenAppender.workSteps(input, [])" || earned.cookLevinBuilderFirstTokenPrefixRawTimePolynomial !== "18 * inputLength^2 + 87 * inputLength + 147" || earned.cookLevinBuilderFirstTokenPrefixRuleCount !== 184) failures.push("formal-publication Cook-Levin builder first-token-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFirstTokenPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFirstTokenPrefixProjectAxiomClosure) || earned.cookLevinBuilderFirstTokenPrefixProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin builder first-token-prefix axiom closure mismatch");
  const firstTokenHashes = earned.cookLevinBuilderFirstTokenPrefixTheoremKernelTypeSha256;
  if (!firstTokenHashes || Object.keys(firstTokenHashes).length !== 25 || !Object.entries(BUILDER_FIRST_TOKEN_PREFIX_THEOREMS).every(([name, evidence]) => firstTokenHashes[name] === evidence.hash)) failures.push("formal-publication Cook-Levin builder first-token-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderUnaryPolynomialFormalized !== true || earned.cookLevinBuilderUnaryPolynomialAxiomAuditPassed !== true || earned.cookLevinBuilderUnaryPolynomialAuditedDeclarationCount !== 74 || earned.cookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized !== true || earned.cookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized !== true) failures.push("formal-publication Cook-Levin builder unary-polynomial boundary mismatch");
  if (earned.cookLevinBuilderUnaryPolynomialRuleCount !== "9 * stateCount(widthPolynomial verifier)") failures.push("formal-publication Cook-Levin builder unary-polynomial cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderUnaryPolynomialAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderUnaryPolynomialProjectAxiomClosure) || earned.cookLevinBuilderUnaryPolynomialProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin builder unary-polynomial axiom closure mismatch");
  const unaryHashes = earned.cookLevinBuilderUnaryPolynomialTheoremKernelTypeSha256;
  if (!unaryHashes || Object.keys(unaryHashes).length !== 10 || !Object.entries(BUILDER_UNARY_POLYNOMIAL_THEOREMS).every(([name, evidence]) => unaryHashes[name] === evidence.hash)) failures.push("formal-publication Cook-Levin builder unary-polynomial fingerprint mismatch");
  if (earned.cookLevinBuilderCompleteHeaderFormalized !== true || earned.cookLevinBuilderCompleteHeaderAxiomAuditPassed !== true || earned.cookLevinBuilderCompleteHeaderAuditedDeclarationCount !== 83 || earned.cookLevinBuilderCompleteHeaderCompiledRawMachineFormalized !== true || earned.cookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderCompleteHeaderExactFormulaBitsFormalized !== true || earned.cookLevinBuilderCompleteHeaderInputPrefixAppenderComposed !== true || earned.cookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized !== true) failures.push("formal-publication Cook-Levin builder complete-header boundary mismatch");
  if (earned.cookLevinBuilderCompleteHeaderRuleCount !== "363 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier)") failures.push("formal-publication Cook-Levin builder complete-header cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderCompleteHeaderAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderCompleteHeaderProjectAxiomClosure) || earned.cookLevinBuilderCompleteHeaderProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin builder complete-header axiom closure mismatch");
  const completeHeaderHashes = earned.cookLevinBuilderCompleteHeaderTheoremKernelTypeSha256;
  if (!completeHeaderHashes || Object.keys(completeHeaderHashes).length !== 38 || !Object.entries(BUILDER_COMPLETE_HEADER_THEOREMS).every(([name, evidence]) => completeHeaderHashes[name] === evidence.hash)) failures.push("formal-publication Cook-Levin builder complete-header fingerprint mismatch");
  if (earned.cookLevinBuilderBodyStartPrefixFormalized !== true || earned.cookLevinBuilderBodyStartPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderBodyStartPrefixAuditedDeclarationCount !== 60 || earned.cookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized !== true || earned.cookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized !== true || earned.cookLevinBuilderInputPrefixAppenderComposed !== true) failures.push("formal-publication Cook-Levin builder body-start-prefix boundary mismatch");
  if (earned.cookLevinBuilderBodyStartPrefixRuleCount !== "440 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)") failures.push("formal-publication Cook-Levin builder body-start-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderBodyStartPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderBodyStartPrefixProjectAxiomClosure) || earned.cookLevinBuilderBodyStartPrefixProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin builder body-start-prefix axiom closure mismatch");
  const bodyStartHashes = earned.cookLevinBuilderBodyStartPrefixTheoremKernelTypeSha256;
  if (!bodyStartHashes || Object.keys(bodyStartHashes).length !== 42 || !Object.entries(BUILDER_BODY_START_PREFIX_THEOREMS).every(([name, evidence]) => bodyStartHashes[name] === evidence.hash)) failures.push("formal-publication Cook-Levin builder body-start-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderBodyStartPrefixExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.workRunExact" || earned.cookLevinBuilderBodyStartPrefixCanonicalPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.bodyStartTokens_eq_canonical_prefix" || earned.cookLevinBuilderBodyStartPrefixNextTokenCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_two" || earned.cookLevinBuilderBodyStartPrefixSeparatorSlotTheorem !== "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.firstBodyTokenSlotDirect_eq_separator" || earned.cookLevinBuilderBodyStartPrefixFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.finalTokenBits_eq_encodedFormula_bodyStart") failures.push("formal-publication Cook-Levin builder body-start-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderFirstLiteralPrefixFormalized !== true || earned.cookLevinBuilderFirstLiteralPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount !== 74 || earned.cookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized !== true || earned.cookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || earned.cookLevinBuilderInputPrefixAppenderComposed !== true) failures.push("formal-publication Cook-Levin builder first-literal-prefix boundary mismatch");
  if (earned.cookLevinBuilderFirstLiteralPrefixRuleCount !== "585 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)") failures.push("formal-publication Cook-Levin builder first-literal-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFirstLiteralPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFirstLiteralPrefixProjectAxiomClosure) || earned.cookLevinBuilderFirstLiteralPrefixProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin builder first-literal-prefix axiom closure mismatch");
  const firstLiteralHashes = earned.cookLevinBuilderFirstLiteralPrefixTheoremKernelTypeSha256;
  if (!firstLiteralHashes || Object.keys(firstLiteralHashes).length !== 52 || !Object.entries(BUILDER_FIRST_LITERAL_PREFIX_THEOREMS).every(([name, evidence]) => firstLiteralHashes[name] === evidence.hash)) failures.push("formal-publication Cook-Levin builder first-literal-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderFirstLiteralPrefixExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.workRunExact" || earned.cookLevinBuilderFirstLiteralPrefixCanonicalPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_prefix" || earned.cookLevinBuilderFirstLiteralPrefixCanonicalFormulaPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_formula_prefix" || earned.cookLevinBuilderFirstLiteralPrefixNextTokenCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_four" || earned.cookLevinBuilderFirstLiteralPrefixSignSlotTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralSignSlotDirect_eq_t" || earned.cookLevinBuilderFirstLiteralPrefixZeroTerminatorSlotTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralZeroTerminatorSlotDirect_eq_f" || earned.cookLevinBuilderFirstLiteralPrefixFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_firstLiteral") failures.push("formal-publication Cook-Levin builder first-literal-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderFirstClausePrefixFormalized !== true || earned.cookLevinBuilderFirstClausePrefixAxiomAuditPassed !== true || earned.cookLevinBuilderFirstClausePrefixAuditedDeclarationCount !== 77 || earned.cookLevinBuilderFirstClausePrefixCombinedAuditedDeclarationCount !== 78 || earned.cookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized !== true || earned.cookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized !== true || earned.cookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized !== true) failures.push("formal-publication Cook-Levin builder first-clause-prefix boundary mismatch");
  if (earned.cookLevinBuilderFirstClausePrefixWorkTime !== "BuilderFirstLiteralPrefix.workSteps(input) + 1 + BuilderUnaryPolynomial.workSteps(nextTokenSlotPolynomial verifier, input) + 1 + FirstClauseTailAppender.workSteps(input, firstLiteralTokens problem)" || earned.cookLevinBuilderFirstClausePrefixRawTimePolynomial !== "BuilderFirstLiteralPrefix.rawTimeBound + 1158 + 6 * BuilderUnaryPolynomial.workTimePolynomial(nextTokenSlotPolynomial verifier) + 192 * inputLength + 96 * FormulaWidth" || earned.cookLevinBuilderFirstClausePrefixRuleCount !== "1138 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)") failures.push("formal-publication Cook-Levin builder first-clause-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFirstClausePrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFirstClausePrefixProjectAxiomClosure) || earned.cookLevinBuilderFirstClausePrefixProjectAxiomClosure.length !== 0) failures.push("formal-publication Cook-Levin builder first-clause-prefix axiom closure mismatch");
  const firstClauseHashes = earned.cookLevinBuilderFirstClausePrefixTheoremKernelTypeSha256;
  if (!firstClauseHashes || Object.keys(firstClauseHashes).length !== 41 || !Object.entries(BUILDER_FIRST_CLAUSE_PREFIX_THEOREMS).every(([name, evidence]) => firstClauseHashes[name] === evidence.hash)) failures.push("formal-publication Cook-Levin builder first-clause-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderFirstClausePrefixExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.workRunExact" || earned.cookLevinBuilderFirstClausePrefixCanonicalPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_prefix" || earned.cookLevinBuilderFirstClausePrefixCanonicalFormulaPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_formula_prefix" || earned.cookLevinBuilderFirstClausePrefixNextTokenCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_twelve" || earned.cookLevinBuilderFirstClausePrefixFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.finalTokenBits_eq_encodedFormula_firstClause" || earned.cookLevinBuilderFirstClausePrefixRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rules_length" || earned.cookLevinBuilderFirstClausePrefixRulesDistinctTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rules_pairwise_query_distinct" || earned.cookLevinBuilderFirstClausePrefixTailRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.rules_length" || earned.cookLevinBuilderFirstClausePrefixCompiledExactTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_exact" || earned.cookLevinBuilderFirstClausePrefixCompiledBoundTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_rawTimeBound" || earned.cookLevinBuilderFirstClausePrefixAcceptTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.boundedDecide_compile_accept" || earned.cookLevinBuilderFirstClausePrefixNoTimeoutTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.boundedDecide_compile_ne_timeout" || earned.cookLevinBuilderFirstClausePrefixOneStepShortTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.work_one_step_short_timeout") failures.push("formal-publication Cook-Levin builder first-clause-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderDynamicCursorInterpretationFormalized !== false || earned.cookLevinCompleteRawFormulaBuilderFormalized !== false || earned.cookLevinBuilderFunctionProgramRawRefinementFormalized !== false || earned.cookLevinPolynomialReductionFormalized !== false || earned.cnfSATNPCompletenessFormalized !== false || earned.cnfSATInPFormalized !== false || earned.pEqualsNPFormalized !== false) failures.push("formal-publication overstates the Cook-Levin builder first-clause prefix");
  if (earned.cookLevinBuilderFormulaBitsEmittedFormalized !== true || earned.cookLevinBuilderDirectCursorRawInterpretationFormalized !== false || earned.cookLevinCompleteRawFormulaBuilderFormalized !== false || earned.cookLevinBuilderFunctionProgramRawRefinementFormalized !== false || earned.cookLevinPolynomialReductionFormalized !== false) failures.push("formal-publication overstates the Cook-Levin builder");
  if (manifest.historicalArchive?.status !== "historical-quarantined-not-current-authority" || manifest.historicalArchive?.currentArtifactEligible !== false || manifest.historicalArchive?.mayActivateTheoremPublication !== false) failures.push("formal-publication historical archive is not quarantined");
}

function validateLocalArtifactHashes(root, release, failures) {
  const expected = [];
  const artifacts = release.artifacts || {};
  if (artifacts.status) expected.push({ path: artifacts.status.publicPath, ...artifacts.status });
  if (artifacts.theoremInventory) expected.push({ path: artifacts.theoremInventory.publicPath, ...artifacts.theoremInventory });
  for (const type of ["pdf", "tex"]) {
    const report = artifacts.report?.[type];
    for (const publicPath of report?.publicPaths || []) expected.push({ path: publicPath, bytes: report.bytes, sha256: report.sha256 });
  }
  for (const item of expected) {
    if (!safeRelativePath(item.path, "release artifact", failures)) continue;
    const filePath = path.resolve(root, item.path);
    if (!existsSync(filePath)) {
      failures.push(`release artifact missing: ${item.path}`);
      continue;
    }
    const info = lstatSync(filePath);
    if (!info.isFile() || info.isSymbolicLink()) {
      failures.push(`release artifact must be a regular non-symlink file: ${item.path}`);
      continue;
    }
    const content = readFileSync(filePath);
    if (content.length !== item.bytes || sha256(content) !== item.sha256) failures.push(`release artifact identity mismatch: ${item.path}`);
  }
}

function validateCurrentPayloads(contents, failures) {
  const statusBuffer = contents.get("public.status");
  const inventoryBuffer = contents.get("public.inventory");
  if (statusBuffer) {
    const status = JSON.parse(statusBuffer.toString("utf8"));
    if (status.concretePublicationGate?.passed !== false || status.publicationStatusDerivedOnlyFromConcreteGate !== true || status.mathematicalTheoremEstablished !== false || status.publicTheoremEmissionAllowed !== false || status.publicTheoremStatement !== null) failures.push("public status does not fail closed");
    if (status.leanConcreteCNFSATMembershipFormalized !== true || status.leanConcreteCNFSATMembershipTheorem !== "PNP.Concrete.FinalUniversalDesign.cnfSATInNP") failures.push("public status does not expose the earned CNF-SAT NP-membership theorem");
    if (status.leanConcreteCNFWorkAxiomAuditPassed !== true || status.leanConcreteCNFWorkAuditedDeclarationCount !== 766) failures.push("public status CNF work audit mismatch");
    if (status.leanConcretePipelineStateNamespaceFormalized !== true || status.leanConcretePipelineStateNamespaceAxiomAuditPassed !== true || status.leanConcretePipelineStateNamespaceAuditedDeclarationCount !== 39) failures.push("public status pipeline namespace mismatch");
    if (status.leanConcretePipelineStageBridgesFormalized !== true || status.leanConcretePipelineStageBridgesAxiomAuditPassed !== true || status.leanConcretePipelineStageBridgesAuditedDeclarationCount !== 56 || status.leanConcretePipelineStageLaunchFormalized !== true || status.leanConcretePipelineVerdictPreservationFormalized !== true || status.leanConcretePipelineInternalOutputHandoffComposed !== true) failures.push("public status pipeline stage-bridge mismatch");
    if (status.leanConcretePipelineTerminalOutputPackingFormalized !== true || status.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed !== true || status.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount !== 69) failures.push("public status terminal-output packer mismatch");
    if (status.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized !== true || status.leanConcretePipelineTerminalBridgeAxiomAuditPassed !== true || status.leanConcretePipelineTerminalBridgeAuditedDeclarationCount !== 59) failures.push("public status terminal-bridge suffix mismatch");
    if (status.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized !== true) failures.push("public status supplied-trace transport mismatch");
    if (status.leanConcretePipelineInputFramerAxiomAuditPassed !== true || status.leanConcretePipelineInputFramerAuditedDeclarationCount !== 70 || status.leanConcretePipelineAllInputFramingFormalized !== true) failures.push("public status all-input framer mismatch");
    if (status.leanConcretePipelinePairedCompilerAxiomAuditPassed !== true || status.leanConcretePipelinePairedCompilerAuditedDeclarationCount !== 28 || status.leanConcretePipelineCanonicalPairCompilationFormalized !== true) failures.push("public status canonical-pair compiler mismatch");
    if (status.leanConcretePipelineCompilerAxiomAuditPassed !== true || status.leanConcretePipelineCompilerAuditedDeclarationCount !== 29 || status.leanConcretePipelineAllInputCompilationFormalized !== true) failures.push("public status all-input compiler audit mismatch");
    if (status.leanConcretePipelineExternalInputSizePolynomialFormalized !== true || status.leanConcretePipelineMalformedInputBehaviorFormalized !== true || status.leanConcretePipelineRawRefinementFormalized !== true) failures.push("public status all-input compiler boundary mismatch");
    if (status.leanConcretePipelineSequentialNamespaceFormalized !== true || status.leanConcretePipelineSequentialNamespaceAxiomAuditPassed !== true || status.leanConcretePipelineSequentialNamespaceAuditedDeclarationCount !== 26) failures.push("public status sequential namespace mismatch");
    if (status.leanConcretePipelineSequentialCompilationFormalized !== true || status.leanConcretePipelineSequentialCompilerAxiomAuditPassed !== true || status.leanConcretePipelineSequentialCompilerAuditedDeclarationCount !== 31 || status.leanConcretePipelineSequentialVerdictAndOutputPreservationFormalized !== true || status.leanConcretePipelineSequentialExternalInputSizePolynomialFormalized !== true || status.leanConcretePipelineSequentialStuckFirstTimeoutFormalized !== true) failures.push("public status sequential compiler mismatch");
    if (status.leanConcretePipelineRefinementAxiomAuditPassed !== true || status.leanConcretePipelineRefinementAuditedDeclarationCount !== 16 || status.leanConcreteFunctionProgramRecursiveCompilationFormalized !== true || status.leanConcreteDecisionProgramRecursiveCompilationFormalized !== true || status.leanConcretePolynomialTimeDeciderRawCompilationFormalized !== true || status.standardComplexityModelFormalized !== true) failures.push("public status recursive refinement mismatch");
    const formulaSizeMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-size");
    if (!formulaSizeMilestone || formulaSizeMilestone.earned !== true || formulaSizeMilestone.allPresent !== true || formulaSizeMilestone.allKernelTypesMatch !== true || formulaSizeMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true) failures.push("public status Cook-Levin formula-size mismatch");
    const formulaScheduleMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-schedule");
    if (!formulaScheduleMilestone || formulaScheduleMilestone.earned !== true || formulaScheduleMilestone.allPresent !== true || formulaScheduleMilestone.allKernelTypesMatch !== true || formulaScheduleMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true) failures.push("public status Cook-Levin formula-schedule mismatch");
    const formulaCursorMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-cursor");
    if (!formulaCursorMilestone || formulaCursorMilestone.earned !== true || formulaCursorMilestone.allPresent !== true || formulaCursorMilestone.allKernelTypesMatch !== true || formulaCursorMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || formulaCursorMilestone.requiredTheorems?.length !== 13) failures.push("public status Cook-Levin formula-cursor mismatch");
    const builderMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-input-length");
    if (!builderMilestone || builderMilestone.earned !== true || builderMilestone.allPresent !== true || builderMilestone.allKernelTypesMatch !== true || builderMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || builderMilestone.requiredTheorems?.length !== 10) failures.push("public status Cook-Levin builder input-length mismatch");
    if (status.leanConcreteCookLevinBuilderInputLengthFormalized !== true || status.leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderInputLengthAuditedDeclarationCount !== 39 || status.leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized !== true) failures.push("public status Cook-Levin builder input-length evidence mismatch");
    const builderPrefixMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-input-prefix");
    if (!builderPrefixMilestone || builderPrefixMilestone.earned !== true || builderPrefixMilestone.allPresent !== true || builderPrefixMilestone.allKernelTypesMatch !== true || builderPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || builderPrefixMilestone.requiredTheorems?.length !== 14) failures.push("public status Cook-Levin builder input-prefix mismatch");
    if (status.leanConcreteCookLevinBuilderInputPrefixFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderInputPrefixAuditedDeclarationCount !== 40 || status.leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized !== true) failures.push("public status Cook-Levin builder input-prefix evidence mismatch");
    const builderTokenMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-token-appender");
    if (!builderTokenMilestone || builderTokenMilestone.earned !== true || builderTokenMilestone.allPresent !== true || builderTokenMilestone.allKernelTypesMatch !== true || builderTokenMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || builderTokenMilestone.requiredTheorems?.length !== 17) failures.push("public status Cook-Levin builder token-appender mismatch");
    if (status.leanConcreteCookLevinBuilderTokenAppenderFormalized !== true || status.leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderTokenAppenderAuditedDeclarationCount !== 68 || status.leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized !== true || status.leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed !== true) failures.push("public status Cook-Levin builder token-appender evidence mismatch");
    const firstTokenMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-token-prefix");
    if (!firstTokenMilestone || firstTokenMilestone.earned !== true || firstTokenMilestone.allPresent !== true || firstTokenMilestone.allKernelTypesMatch !== true || firstTokenMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstTokenMilestone.requiredTheorems?.length !== 25) failures.push("public status Cook-Levin builder first-token-prefix mismatch");
    if (status.leanConcreteCookLevinBuilderFirstTokenPrefixFormalized !== true || status.leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFirstTokenPrefixAuditedDeclarationCount !== 37 || status.leanConcreteCookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized !== true) failures.push("public status Cook-Levin builder first-token-prefix evidence mismatch");
    const completeHeaderMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-complete-header");
    if (!completeHeaderMilestone || completeHeaderMilestone.earned !== true || completeHeaderMilestone.allPresent !== true || completeHeaderMilestone.allKernelTypesMatch !== true || completeHeaderMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || completeHeaderMilestone.requiredTheorems?.length !== 48) failures.push("public status Cook-Levin builder complete-header mismatch");
    if (status.leanConcreteCookLevinBuilderUnaryPolynomialFormalized !== true || status.leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderUnaryPolynomialAuditedDeclarationCount !== 74 || status.leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized !== true) failures.push("public status Cook-Levin builder unary-polynomial evidence mismatch");
    if (status.leanConcreteCookLevinBuilderCompleteHeaderFormalized !== true || status.leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderCompleteHeaderAuditedDeclarationCount !== 83 || status.leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderCompleteHeaderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) failures.push("public status Cook-Levin builder complete-header evidence mismatch");
    const bodyStartMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-body-start-prefix");
    if (!bodyStartMilestone || bodyStartMilestone.earned !== true || bodyStartMilestone.allPresent !== true || bodyStartMilestone.allKernelTypesMatch !== true || bodyStartMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || bodyStartMilestone.requiredTheorems?.length !== 42) failures.push("public status Cook-Levin builder body-start-prefix mismatch");
    if (status.leanConcreteCookLevinBuilderBodyStartPrefixFormalized !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixAuditedDeclarationCount !== 60 || status.leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) failures.push("public status Cook-Levin builder body-start-prefix evidence mismatch");
    const firstLiteralMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-literal-prefix");
    if (!firstLiteralMilestone || firstLiteralMilestone.earned !== true || firstLiteralMilestone.allPresent !== true || firstLiteralMilestone.allKernelTypesMatch !== true || firstLiteralMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstLiteralMilestone.requiredTheorems?.length !== 52) failures.push("public status Cook-Levin builder first-literal-prefix mismatch");
    if (status.leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount !== 74 || status.leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) failures.push("public status Cook-Levin builder first-literal-prefix evidence mismatch");
    const firstClauseMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-clause-prefix");
    if (!firstClauseMilestone || firstClauseMilestone.earned !== true || firstClauseMilestone.allPresent !== true || firstClauseMilestone.allKernelTypesMatch !== true || firstClauseMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstClauseMilestone.requiredTheorems?.length !== 41) failures.push("public status Cook-Levin builder first-clause-prefix mismatch");
    if (status.leanConcreteCookLevinBuilderFirstClausePrefixFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixAuditedDeclarationCount !== 77 || status.leanConcreteCookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) failures.push("public status Cook-Levin builder first-clause-prefix evidence mismatch");
    if (status.leanConcreteCNFSATInPFormalized !== false || status.leanConcreteCNFNPCompletenessFormalized !== false) failures.push("public status overstates the CNF-SAT result");
  }
  if (inventoryBuffer) {
    const inventory = JSON.parse(inventoryBuffer.toString("utf8"));
    if (inventory.compatibilityRootCandidate !== null || inventory.concreteTargetCandidate?.name !== "PNP.Main.ConcretePEqualsNP") failures.push("public inventory publication boundary mismatch");
    if (inventory.declarationCount !== 7746 || inventory.theoremCount !== 3725 || inventory.assumptionFreeTheoremCount !== 2865 || inventory.excludedPrivateDeclarationCount !== 2286 || inventory.sourceClosureModuleCount !== 70 || inventory.axiomCount !== 4) failures.push("public inventory count boundary mismatch");
    const cookLevinBridge = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language");
    if (!cookLevinBridge || cookLevinBridge.kind !== "theorem" || cookLevinBridge.module !== "PNP.Concrete.CookLevinRawTapeBridge" || JSON.stringify(cookLevinBridge.axioms) !== JSON.stringify(["Classical.choice", "Quot.sound", "propext"])) failures.push("public inventory Cook-Levin raw-tape theorem mismatch");
    const formulaSize = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le");
    if (!formulaSize || formulaSize.kind !== "theorem" || formulaSize.module !== "PNP.Concrete.CookLevinFormulaSize" || JSON.stringify(formulaSize.axioms) !== JSON.stringify(["Quot.sound", "propext"])) failures.push("public inventory Cook-Levin formula-size theorem mismatch");
    for (const name of [
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula"
    ]) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinFormulaSchedule" || JSON.stringify(theorem.axioms) !== JSON.stringify(["Quot.sound", "propext"])) failures.push(`public inventory Cook-Levin formula-schedule theorem mismatch: ${name}`);
    }
    for (const [name, hash] of Object.entries(FORMULA_CURSOR_THEOREM_HASHES)) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinFormulaCursor" || JSON.stringify(theorem.axioms) !== JSON.stringify(["Quot.sound", "propext"])) failures.push(`public inventory Cook-Levin formula-cursor theorem mismatch: ${name}`);
      const rawTypeHash = theorem?.kernelType ? sha256(Buffer.from(
        `PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n` +
        `milestone-theorem-type:${name}\n${theorem.kernelType}`, "utf8"
      )) : null;
      if (rawTypeHash !== hash) failures.push(`public inventory Cook-Levin formula-cursor fingerprint mismatch: ${name}`);
    }
    for (const [name, evidence] of Object.entries(BUILDER_INPUT_LENGTH_THEOREMS)) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderInputLength" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) failures.push(`public inventory Cook-Levin builder input-length theorem mismatch: ${name}`);
      const rawTypeHash = theorem?.kernelType ? sha256(Buffer.from(
        `PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n` +
        `milestone-theorem-type:${name}\n${theorem.kernelType}`, "utf8"
      )) : null;
      if (rawTypeHash !== evidence.hash) failures.push(`public inventory Cook-Levin builder input-length fingerprint mismatch: ${name}`);
    }
    for (const [name, evidence] of Object.entries(BUILDER_INPUT_PREFIX_THEOREMS)) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderInputPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) failures.push(`public inventory Cook-Levin builder input-prefix theorem mismatch: ${name}`);
      const rawTypeHash = theorem?.kernelType ? sha256(Buffer.from(
        `PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n` +
        `milestone-theorem-type:${name}\n${theorem.kernelType}`, "utf8"
      )) : null;
      if (rawTypeHash !== evidence.hash) failures.push(`public inventory Cook-Levin builder input-prefix fingerprint mismatch: ${name}`);
    }
    for (const [name, evidence] of Object.entries(BUILDER_TOKEN_APPENDER_THEOREMS)) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderTokenAppender" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) failures.push(`public inventory Cook-Levin builder token-appender theorem mismatch: ${name}`);
      const rawTypeHash = theorem?.kernelType ? sha256(Buffer.from(
        `PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n` +
        `milestone-theorem-type:${name}\n${theorem.kernelType}`, "utf8"
      )) : null;
      if (rawTypeHash !== evidence.hash) failures.push(`public inventory Cook-Levin builder token-appender fingerprint mismatch: ${name}`);
    }
    for (const [name, evidence] of Object.entries(BUILDER_FIRST_TOKEN_PREFIX_THEOREMS)) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderFirstTokenPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) failures.push(`public inventory Cook-Levin builder first-token-prefix theorem mismatch: ${name}`);
      const rawTypeHash = theorem?.kernelType ? sha256(Buffer.from(
        `PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n` +
        `milestone-theorem-type:${name}\n${theorem.kernelType}`, "utf8"
      )) : null;
      if (rawTypeHash !== evidence.hash) failures.push(`public inventory Cook-Levin builder first-token-prefix fingerprint mismatch: ${name}`);
    }
    for (const [name, evidence] of Object.entries(BUILDER_UNARY_POLYNOMIAL_THEOREMS)) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderUnaryPolynomial" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) failures.push(`public inventory Cook-Levin builder unary-polynomial theorem mismatch: ${name}`);
      const rawTypeHash = theorem?.kernelType ? sha256(Buffer.from(
        `PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n` +
        `milestone-theorem-type:${name}\n${theorem.kernelType}`, "utf8"
      )) : null;
      if (rawTypeHash !== evidence.hash) failures.push(`public inventory Cook-Levin builder unary-polynomial fingerprint mismatch: ${name}`);
    }
    for (const [name, evidence] of Object.entries(BUILDER_COMPLETE_HEADER_THEOREMS)) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderCompleteHeader" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) failures.push(`public inventory Cook-Levin builder complete-header theorem mismatch: ${name}`);
      const rawTypeHash = theorem?.kernelType ? sha256(Buffer.from(
        `PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n` +
        `milestone-theorem-type:${name}\n${theorem.kernelType}`, "utf8"
      )) : null;
      if (rawTypeHash !== evidence.hash) failures.push(`public inventory Cook-Levin builder complete-header fingerprint mismatch: ${name}`);
    }
    for (const [name, evidence] of Object.entries(BUILDER_BODY_START_PREFIX_THEOREMS)) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderBodyStartPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) failures.push(`public inventory Cook-Levin builder body-start-prefix theorem mismatch: ${name}`);
      const rawTypeHash = theorem?.kernelType ? sha256(Buffer.from(
        `PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n` +
        `milestone-theorem-type:${name}\n${theorem.kernelType}`, "utf8"
      )) : null;
      if (rawTypeHash !== evidence.hash) failures.push(`public inventory Cook-Levin builder body-start-prefix fingerprint mismatch: ${name}`);
    }
    for (const [name, evidence] of Object.entries(BUILDER_FIRST_LITERAL_PREFIX_THEOREMS)) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderFirstLiteralPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) failures.push(`public inventory Cook-Levin builder first-literal-prefix theorem mismatch: ${name}`);
      const rawTypeHash = theorem?.kernelType ? sha256(Buffer.from(
        `PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n` +
        `milestone-theorem-type:${name}\n${theorem.kernelType}`, "utf8"
      )) : null;
      if (rawTypeHash !== evidence.hash) failures.push(`public inventory Cook-Levin builder first-literal-prefix fingerprint mismatch: ${name}`);
    }
    for (const [name, evidence] of Object.entries(BUILDER_FIRST_CLAUSE_PREFIX_THEOREMS)) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name === "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rule_source_ne_acceptState"
        ? "PNP.Concrete.CookLevinBuilderFirstLiteralPrefix"
        : "PNP.Concrete.CookLevinBuilderFirstClausePrefix";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) failures.push(`public inventory Cook-Levin builder first-clause-prefix theorem mismatch: ${name}`);
      const rawTypeHash = theorem?.kernelType ? sha256(Buffer.from(
        `PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n` +
        `milestone-theorem-type:${name}\n${theorem.kernelType}`, "utf8"
      )) : null;
      if (rawTypeHash !== evidence.hash) failures.push(`public inventory Cook-Levin builder first-clause-prefix fingerprint mismatch: ${name}`);
    }
    if (inventory.milestoneCandidates?.some((candidate) => candidate.name === "PNP.Concrete.cnfSATNPComplete" || candidate.name === "PNP.Concrete.cnfSATInP" || candidate.name === "PNP.Main.p_eq_np")) failures.push("public inventory overstates the Cook-Levin milestone");
    const packer = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq");
    if (!packer || packer.kind !== "theorem" || packer.module !== "PNP.Concrete.TerminalOutputPacker" || packer.axioms?.length !== 0) failures.push("public inventory terminal-output packer theorem mismatch");
    const terminalBridge = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents");
    if (!terminalBridge || terminalBridge.kind !== "theorem" || terminalBridge.module !== "PNP.Concrete.PipelineTerminalBridge" || terminalBridge.axioms?.length !== 0) failures.push("public inventory terminal-bridge theorem mismatch");
    const suppliedTrace = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact");
    const suppliedOutput = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact");
    if (!suppliedTrace || suppliedTrace.kind !== "theorem" || suppliedTrace.axioms?.length !== 0 || !suppliedOutput || suppliedOutput.kind !== "theorem" || suppliedOutput.axioms?.length !== 0) failures.push("public inventory supplied terminal-trace mismatch");
    const pairedVerdict = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq");
    const pairedOutput = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq");
    const pairedTimeout = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout");
    const pairedAccepts = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff");
    if (!pairedVerdict || pairedVerdict.kind !== "theorem" || pairedVerdict.axioms?.length !== 0 || !pairedOutput || pairedOutput.kind !== "theorem" || pairedOutput.axioms?.length !== 0 || !pairedTimeout || pairedTimeout.kind !== "theorem" || pairedTimeout.axioms?.length !== 0 || !pairedAccepts || pairedAccepts.kind !== "theorem" || pairedAccepts.axioms?.length !== 0) failures.push("public inventory canonical-pair compiler mismatch");
    for (const name of [
      "PNP.Concrete.PipelineCompiler.pipeline_correct",
      "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq",
      "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq",
      "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout",
      "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff",
      "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact"
    ]) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineCompiler" || theorem.axioms?.length !== 0) failures.push(`public inventory all-input compiler mismatch: ${name}`);
    }
    for (const name of [
      "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le",
      "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound",
      "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent",
      "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept",
      "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout"
    ]) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineInputFramer" || theorem.axioms?.length !== 0) failures.push(`public inventory all-input framer mismatch: ${name}`);
    }
    for (const name of [
      "PNP.Concrete.PipelineSequentialCompiler.sequential_correct",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact"
    ]) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineSequentialCompiler" || theorem.axioms?.length !== 0) failures.push(`public inventory sequential compiler mismatch: ${name}`);
    }
    for (const [name, module] of [
      ["PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin", "PNP.Concrete.PipelineRefinement"],
      ["PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq", "PNP.Concrete.PipelineRefinement"],
      ["PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin", "PNP.Concrete.PipelineRefinement"],
      ["PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq", "PNP.Concrete.PipelineRefinement"],
      ["PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff", "PNP.Concrete.PipelineRefinement"]
    ]) {
      const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== module || theorem.axioms?.length !== 0) failures.push(`public inventory recursive refinement mismatch: ${name}`);
    }
    if (inventory.milestoneCandidates?.length !== 549) failures.push("public inventory reviewed theorem-candidate count mismatch");
  }
}

export function validateAuditTargets(options = {}) {
  const root = path.resolve(options.root || process.cwd());
  const targetsPath = path.resolve(root, options.targetsPath || DEFAULT_TARGETS);
  const releaseManifestPath = path.resolve(root, options.releaseManifestPath || DEFAULT_RELEASE_MANIFEST);
  const sourceDir = path.resolve(root, options.sourceDir || process.env.PNP_SOURCE_DIR || DEFAULT_SOURCE_DIR);
  const requireSource = options.requireSource === true;
  const expectedIdentity = options.expectedCoreIdentity || { commit: REVIEWED_CORE_COMMIT, proofCommit: REVIEWED_PROOF_COMMIT, tree: REVIEWED_CORE_TREE };
  const targetManifest = readJson(targetsPath);
  const releaseManifest = readJson(releaseManifestPath);
  const failures = [];
  const result = { skipped: false, sourceDir, checkedTargets: 0, mirroredTargets: 0, refs: {} };
  const contents = new Map();

  validateTargetManifest(targetManifest, failures);
  validateReleaseManifest(releaseManifest, expectedIdentity, failures);
  validateLocalArtifactHashes(root, releaseManifest, failures);

  for (const target of targetManifest.targets || []) {
    if (target.refClass !== "publicCheckout" || !safeRelativePath(target.path, target.id, failures)) continue;
    const localPath = path.resolve(root, target.path);
    if (!existsSync(localPath)) {
      failures.push(`${target.id}: missing public file ${target.path}`);
      continue;
    }
    const info = lstatSync(localPath);
    if (!info.isFile() || info.isSymbolicLink()) {
      failures.push(`${target.id}: public target must be a regular non-symlink file`);
      continue;
    }
    contents.set(target.id, readFileSync(localPath));
    result.checkedTargets += 1;
  }

  validateCurrentPayloads(contents, failures);
  if (failures.length > 0) throw new AuditTargetValidationError(failures, result);

  if (!existsSync(path.join(sourceDir, ".git"))) {
    const message = `cross-repo target check skipped: ${sourceDir} is not a git checkout`;
    if (requireSource) throw new AuditTargetValidationError([message], result);
    return { ...result, skipped: true, skipReason: message };
  }

  const usedRefs = new Set((targetManifest.targets || []).filter((target) => target.refClass !== "publicCheckout").map((target) => target.refClass));
  for (const refClass of usedRefs) {
    const refInfo = targetManifest.refs?.[refClass];
    if (!refInfo) continue;
    const tagObject = gitText(sourceDir, ["rev-parse", refInfo.ref], `${refClass} ${refInfo.ref}`, failures);
    const commit = gitText(sourceDir, ["rev-parse", `${refInfo.ref}^{commit}`], `${refClass} ${refInfo.ref}`, failures);
    const tree = gitText(sourceDir, ["rev-parse", `${refInfo.ref}^{tree}`], `${refClass} ${refInfo.ref}`, failures);
    if (tagObject && commit && tree) {
      result.refs[refClass] = { ref: refInfo.ref, tagObject, commit, tree };
      if (commit !== refInfo.expectedCommit) failures.push(`${refClass}: commit ${commit} differs from ${refInfo.expectedCommit}`);
      if (refInfo.expectedTagObject && tagObject !== refInfo.expectedTagObject) failures.push(`${refClass}: tag object ${tagObject} differs from ${refInfo.expectedTagObject}`);
      if (refInfo.expectedTree && tree !== refInfo.expectedTree) failures.push(`${refClass}: tree ${tree} differs from ${refInfo.expectedTree}`);
    }
  }

  const currentRef = targetManifest.refs?.currentCoreRef;
  if (currentRef?.expectedCommit !== expectedIdentity.commit || currentRef?.expectedTree !== expectedIdentity.tree) failures.push("audit target current core ref differs from reviewed identity");

  for (const target of targetManifest.targets || []) {
    if (target.refClass === "publicCheckout") continue;
    const refInfo = targetManifest.refs[target.refClass];
    const blob = gitBlob(sourceDir, refInfo.ref, target.path, target.id, failures);
    if (blob !== null) {
      contents.set(target.id, blob);
      result.checkedTargets += 1;
    }
  }

  for (const target of targetManifest.targets || []) {
    if (!target.mirrorOf) continue;
    const local = contents.get(target.id);
    const upstream = contents.get(target.mirrorOf);
    if (!local || !upstream) continue;
    if (!local.equals(upstream)) failures.push(`${target.id}: ${target.path} drifted from ${target.mirrorOf}`);
    else result.mirroredTargets += 1;
  }

  const map = contents.get("core.publication_map");
  if (map && sha256(map) !== releaseManifest.source?.formalPublicationMapSha256) failures.push("core publication map digest differs from release manifest");
  if (map) {
    const publicationMap = JSON.parse(map.toString("utf8"));
    if (publicationMap.coordinate !== releaseManifest.source?.formalPublicationMapCoordinate) failures.push("core publication map coordinate differs from release manifest");
    if (publicationMap.milestoneSourceClosureSha256 !== releaseManifest.source?.leanSourceClosureSha256) failures.push("core publication source closure differs from release manifest");
    const pins = publicationMap.earnedMilestoneTheoremKernelTypeSha256 || {};
    const earned = releaseManifest.earnedBoundary || {};
    for (const [field, theoremField] of [
      ["pipelineSuppliedAcceptTraceKernelTypeSha256", "pipelineSuppliedAcceptTraceTheorem"],
      ["pipelineSuppliedRejectTraceKernelTypeSha256", "pipelineSuppliedRejectTraceTheorem"],
      ["pipelineSuppliedAcceptMachineOutputKernelTypeSha256", "pipelineSuppliedAcceptMachineOutputTheorem"],
      ["pipelineSuppliedRejectMachineOutputKernelTypeSha256", "pipelineSuppliedRejectMachineOutputTheorem"],
      ["pipelinePairedVerdictKernelTypeSha256", "pipelinePairedVerdictTheorem"],
      ["pipelinePairedMachineOutputKernelTypeSha256", "pipelinePairedMachineOutputTheorem"],
      ["pipelinePairedNoTimeoutKernelTypeSha256", "pipelinePairedNoTimeoutTheorem"],
      ["pipelinePairedAcceptsKernelTypeSha256", "pipelinePairedAcceptsTheorem"],
      ["pipelineInputFramerWorkTraceKernelTypeSha256", "pipelineInputFramerWorkTraceTheorem"],
      ["pipelineInputFramerRepresentedEndpointKernelTypeSha256", "pipelineInputFramerRepresentedEndpointTheorem"],
      ["pipelineInputFramerHaltedEndpointKernelTypeSha256", "pipelineInputFramerHaltedEndpointTheorem"],
      ["pipelineInputFramerRawBoundKernelTypeSha256", "pipelineInputFramerRawBoundTheorem"],
      ["pipelineInputFramerOrdinaryStartKernelTypeSha256", "pipelineInputFramerOrdinaryStartTheorem"],
      ["pipelineInputFramerBlankEquivalentKernelTypeSha256", "pipelineInputFramerBlankEquivalentTheorem"],
      ["pipelineInputFramerAcceptKernelTypeSha256", "pipelineInputFramerAcceptTheorem"],
      ["pipelineInputFramerNoTimeoutKernelTypeSha256", "pipelineInputFramerNoTimeoutTheorem"],
      ["pipelineSequentialCorrectKernelTypeSha256", "pipelineSequentialCorrectTheorem"],
      ["pipelineSequentialVerdictKernelTypeSha256", "pipelineSequentialVerdictTheorem"],
      ["pipelineSequentialMachineOutputKernelTypeSha256", "pipelineSequentialMachineOutputTheorem"],
      ["pipelineSequentialNoTimeoutKernelTypeSha256", "pipelineSequentialNoTimeoutTheorem"],
      ["pipelineSequentialAcceptsKernelTypeSha256", "pipelineSequentialAcceptsTheorem"],
      ["pipelineSequentialStuckFirstTimeoutKernelTypeSha256", "pipelineSequentialStuckFirstTimeoutTheorem"],
      ["functionProgramCompileHaltsKernelTypeSha256", "functionProgramCompileHaltsTheorem"],
      ["functionProgramCompileOutputKernelTypeSha256", "functionProgramCompileOutputTheorem"],
      ["decisionProgramCompileHaltsKernelTypeSha256", "decisionProgramCompileHaltsTheorem"],
      ["decisionProgramCompileVerdictKernelTypeSha256", "decisionProgramCompileVerdictTheorem"],
      ["polynomialTimeDeciderCompileAcceptsKernelTypeSha256", "polynomialTimeDeciderCompileAcceptsTheorem"],
      ["cookLevinSemanticKernelTypeSha256", "cookLevinSemanticTheorem"],
    ]) {
      if (pins[earned[theoremField]] !== earned[field]) failures.push(`core publication map fingerprint mismatch: ${field}`);
    }
    const builderPins = earned.cookLevinBuilderInputLengthTheoremKernelTypeSha256 || {};
    for (const [name, evidence] of Object.entries(BUILDER_INPUT_LENGTH_THEOREMS)) {
      if (builderPins[name] !== evidence.hash || pins[name] !== evidence.hash) {
        failures.push(`core publication map builder input-length fingerprint mismatch: ${name}`);
      }
    }
    const builderPrefixPins = earned.cookLevinBuilderInputPrefixTheoremKernelTypeSha256 || {};
    for (const [name, evidence] of Object.entries(BUILDER_INPUT_PREFIX_THEOREMS)) {
      if (builderPrefixPins[name] !== evidence.hash || pins[name] !== evidence.hash) {
        failures.push(`core publication map builder input-prefix fingerprint mismatch: ${name}`);
      }
    }
    const builderTokenPins = earned.cookLevinBuilderTokenAppenderTheoremKernelTypeSha256 || {};
    for (const [name, evidence] of Object.entries(BUILDER_TOKEN_APPENDER_THEOREMS)) {
      if (builderTokenPins[name] !== evidence.hash || pins[name] !== evidence.hash) {
        failures.push(`core publication map builder token-appender fingerprint mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_FIRST_TOKEN_PREFIX_THEOREMS)) {
      if (pins[name] !== evidence.hash) {
        failures.push(`core publication map builder first-token-prefix fingerprint mismatch: ${name}`);
      }
    }
    const unaryPins = earned.cookLevinBuilderUnaryPolynomialTheoremKernelTypeSha256 || {};
    for (const [name, evidence] of Object.entries(BUILDER_UNARY_POLYNOMIAL_THEOREMS)) {
      if (unaryPins[name] !== evidence.hash || pins[name] !== evidence.hash) {
        failures.push(`core publication map builder unary-polynomial fingerprint mismatch: ${name}`);
      }
    }
    const completeHeaderPins = earned.cookLevinBuilderCompleteHeaderTheoremKernelTypeSha256 || {};
    for (const [name, evidence] of Object.entries(BUILDER_COMPLETE_HEADER_THEOREMS)) {
      if (completeHeaderPins[name] !== evidence.hash || pins[name] !== evidence.hash) {
        failures.push(`core publication map builder complete-header fingerprint mismatch: ${name}`);
      }
    }
    const bodyStartPins = earned.cookLevinBuilderBodyStartPrefixTheoremKernelTypeSha256 || {};
    for (const [name, evidence] of Object.entries(BUILDER_BODY_START_PREFIX_THEOREMS)) {
      if (bodyStartPins[name] !== evidence.hash || pins[name] !== evidence.hash) {
        failures.push(`core publication map builder body-start-prefix fingerprint mismatch: ${name}`);
      }
    }
    const firstLiteralPins = earned.cookLevinBuilderFirstLiteralPrefixTheoremKernelTypeSha256 || {};
    for (const [name, evidence] of Object.entries(BUILDER_FIRST_LITERAL_PREFIX_THEOREMS)) {
      if (firstLiteralPins[name] !== evidence.hash || pins[name] !== evidence.hash) {
        failures.push(`core publication map builder first-literal-prefix fingerprint mismatch: ${name}`);
      }
    }
    const firstClauseMilestone = publicationMap.milestones?.find((milestone) =>
      milestone.id === "concrete-cook-levin-builder-first-clause-prefix");
    if (!firstClauseMilestone
        || firstClauseMilestone.classification !== "formalized-foundation-only"
        || firstClauseMilestone.requiredTheorems?.length !== 41
        || !firstClauseMilestone.nonClaim?.includes("does not implement a dynamic formula cursor or remaining formula-body emission")) {
      failures.push("core publication map builder first-clause-prefix milestone mismatch");
    }
    const firstClausePins = earned.cookLevinBuilderFirstClausePrefixTheoremKernelTypeSha256 || {};
    for (const [name, evidence] of Object.entries(BUILDER_FIRST_CLAUSE_PREFIX_THEOREMS)) {
      if (!firstClauseMilestone?.requiredTheorems?.includes(name)
          || firstClausePins[name] !== evidence.hash
          || pins[name] !== evidence.hash) {
        failures.push(`core publication map builder first-clause-prefix fingerprint mismatch: ${name}`);
      }
    }
  }

  if (failures.length > 0) throw new AuditTargetValidationError(failures, result);
  return result;
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--targets") {
      options.targetsPath = argv[++index];
    } else if (arg === "--release-manifest") {
      options.releaseManifestPath = argv[++index];
    } else if (arg === "--source-dir") {
      options.sourceDir = argv[++index];
    } else if (arg === "--require-source") {
      options.requireSource = true;
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }
  return options;
}

function main() {
  try {
    const result = validateAuditTargets(parseArgs(process.argv.slice(2)));
    if (result.skipped) {
      console.log(`SKIP ${result.skipReason}`);
      return;
    }
    for (const [refClass, info] of Object.entries(result.refs)) {
      console.log(`ok ${refClass} ${info.ref} object=${info.tagObject} commit=${info.commit}`);
    }
    console.log(`checked ${result.checkedTargets} audit target(s); verified ${result.mirroredTargets} exact mirror(s)`);
  } catch (error) {
    if (error instanceof AuditTargetValidationError) {
      for (const failure of error.failures) console.error(`FAIL ${failure}`);
      process.exit(1);
    }
    console.error(error.stack || String(error));
    process.exit(2);
  }
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) main();

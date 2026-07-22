#!/usr/bin/env node
import { createHash } from "node:crypto";
import { lstatSync, readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const CORE_COMMIT = "2079ea0df337d413c2402a3820087aea4aca9efa";
const CORE_TREE = "60b3b6663d381c5e95029cc20c66ab31928e784c";
const PROOF_COMMIT = "e46ac7407301ed71483f34a5300e894557315863";
const OLD_PDF_SHA256 = "53437127d4d111562689c093857de86e846c6ad4a8cf0bc0674ff0bc822e603d";
const OLD_TEX_SHA256 = "414d2a2474291c0cc2bf1098f6c937b0bf13c53243774394516bd8def355d4c7";

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
  "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula": "2637f4e27b2a6e40a7e774b10fac91d379daebe9ff6930c72de43ee23bd054d0",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaTokenCursor.step_at_end": "4c5507901831dc9a683645271296f346499409ffbf7d6775b36db2382af9d887",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaTokenCursor.step_of_done": "72a7018658fadc646c07637bc07792502fdcab845760af862081e618f879732e",
  "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaTokenCursor.step_of_lt": "8d0bc1d099f14e3764d3d01a3f7e54b21c962538012dfd8dcd04eb282434a90b"
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
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextTokenSlot_direct_eq_padding": { hash: "2d0cc97f02277527826bdf698d6c432c264f8f05f330c3d59b953d43bed4560b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_twelve": { hash: "a326db076a3b3bc8d4d7fcdd5e95a2ad3c860ba5e00cf32ecf8658dbd20b90af", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.prefixEndpoint_before_launch_timeout": { hash: "5b7650f771ca1a4ab2392119204ac085c9110d78c41bfd2dd4f65082e6ed20b9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.prefix_workRunExact": { hash: "1822772859a9164452bd909471883edfa6f9bd0f61db8f5146c337b9646c7880", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rawTimeBound_eval": { hash: "1aa76aa45b4214d5296c2b1c3c037cdf29630b3a3b719e6a011c896d8407f7f0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rawTimeBound_le": { hash: "05ff6942c8b20411b17d4dbb6e9a089718dc3b6cb0f4d9d4d7839747fbfd300b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rule_source_ne_acceptState": { hash: "24df7c2af1e4e889eebd4ae404a2910eb4f997ca76b1a0a95c889913e85c708a", axioms: ["Quot.sound","propext"] },
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

const BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.advance_workRunExact": { hash: "73d62bec018a0b0559ac1ce94fd6c50ffa9ec274f2b4f50acd499504f77a6105", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.machine_acceptState_ne_rejectState": { hash: "c57dfe6eb354a46c2c164fec7b67af45c82353a861830c7952067fdabb1c0759", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.rule_source_ne_acceptState": { hash: "bbe0dcc36c89e305d530d54c024ed5a7b537bb201edad9d3ae92c5f64095cffd", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.rules_length": { hash: "b02f52c09bd428c7838dc78ccfaaf23c31fd3c8b4c45c760223eaaeea0dd9a02", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.rules_pairwise_query_distinct": { hash: "8a04f4ff1e3365d2cc22c6c16ac5b272975eef6a311fd2ab83e69debdead73cb", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.boundedDecide_compile_accept": { hash: "901cf2886b892152597a882f8b5679915a7cdfe67e1246afa3a6115af903818f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.boundedDecide_compile_ne_timeout": { hash: "26a57d24de6a20d43437833898e732c49479d4cc930389220c1b6972742e84fc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.cursor_workRunExact": { hash: "fc6dd3918533f783c35a14f0289f9345458bd9ca4c4c82d5a59e153c9dd14878", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.directOutcome_is_padding": { hash: "73ad355a9be8c1d0a23bba8e3831114ab0c3b7de7a8901a10daed48df4d3d591", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalConfiguration_state": { hash: "8063b56eca8a900d56814882d1d26e5f2ae306d6714be3fd45522fa304aa0ae5", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalOutside_contains_finalTokenSlot": { hash: "a5a9f92fa3b72b97bca10d27a19452cb00ccfb0f3f0c688fd54c0ff47c25f1f8", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTape_represents": { hash: "660c6f2a32458c4421725b400a96fdc3fa2489cf958790846adb3e05768f6ec2", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTokenBits_eq_encodedFormula_firstClause": { hash: "7f8a45027795f77a403341c39e05a37186167110c6a40479c7959cb1485b2db9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTokenSlot_eq_formulaVariableSlotBound_add_thirteen": { hash: "09db09316526d3c2099fa959eb6f70d58a3f97da7e9655697aa72cb1f5210adb", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.launch_workStep": { hash: "db1830580631410e8ea6f4ea2e219328c78099d42b40e8f25768eaa2dbefc8a3", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.machine_acceptState_ne_rejectState": { hash: "6a260fa783d661f49e6356cd9297d4542c22744e87efcf21c0375a70e0324a1b", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.malformedCursorScratch_timeout": { hash: "b46645dde4dd465c74823fc3b1190c81aef1252f8905dc4f424ce39639159019", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.prefixEndpoint_before_launch_timeout": { hash: "719b2dd7de30d466621d6ea1d3fc56538dffc26fc65ef546b2ecc6a070d0fe0f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.prefix_workRunExact": { hash: "3dba8a351f0cddbefa4cdb6274b18267c72fb03230de87deba72b731d627b6b6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.rawTimeBound_eval": { hash: "fe38e113589697ad66cccedc9388b07db7a9203e44a53b089eeb56ddb3b15db5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.rawTimeBound_le": { hash: "66232ad0af42f702d0821ebbbe1f3f1cf8e768544b756ad74a1969309e76ca4f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.rule_source_ne_acceptState": { hash: "e4f020ac4c12b23c214cdfad297d3339bad7d64e1ab5fc00fde83bd8dd47f0e6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.rules_length": { hash: "677fe90dec9fba2b577e53c97af51fd48c2152477261340ab806cb1a6d13e292", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.rules_pairwise_query_distinct": { hash: "bf777f224633381721484ad7c606e5c17949871def2a2bcfffe8f22c7160fd5c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.run_compile_exact": { hash: "4a39908a5bf732b07eae0c0e08d231434226aaf2e4ddd307c06af43d0b4b159b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.run_compile_rawTimeBound": { hash: "f3e32edec6dce1317d55ffdc9c7133fb66fa21ee480c299d3a2123ae444ee4a1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.run_compile_rawTimeBound_blankEquivalent": { hash: "141ff984ba5cf6262ede2acc30da2deac4a452d6ec21a6adc8f34d5a237528da", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.specification_step": { hash: "d6bbfcc73242448477527f4789ea33ca7c75d414fe8c8784a6ed7c2431f6fcef", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.workBoundedDecide_accept": { hash: "62e07c109602b2a0d43ca421f76fe5749eb1734a73ea3c52ab5229cb729df811", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.workRunExact": { hash: "f006a48886d5739f9c32d3484b008139fd93ad0fb6b3f1dd5e514156dd2e1b6b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.work_one_step_short_timeout": { hash: "4ce587c120d3f35f95139e4ffb8429dea355b69013632f8553c8efc6807eac77", axioms: ["Quot.sound","propext"] }
};

const BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopSteps_le": { hash: "972da09f44b6d35d56ce775bd4a46687be45609dacd0670bc983d603715bf278", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact": { hash: "ff60669772a7f137755431c1300c4368e8004a05b1d36972a768b50d1846cf5a", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopback_workStep": { hash: "c4723ecdca30bf9a3ec9797c56874abc8b9f1cfbd65889335726dc2a6b0f0b1a", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.machine_acceptState_ne_rejectState": { hash: "141397c47a14ffd189a708c81631b4704274e8bd9c6224352b414e5692f4984b", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.rule_source_ne_acceptState": { hash: "c6432580573471996de17c362352f9a7c0fb9d020ce13a2784b86749670f5f8a", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.rules_length": { hash: "2ea4fc29b83d48e26d186b01dc00f4886dbcc9fee12cdd9ae64cd59d256311d4", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.rules_pairwise_query_distinct": { hash: "cdc15d853749c15dce08d976059dcf160826b7e4fe74f2f5009ce8a420797b88", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.boundedDecide_compile_accept": { hash: "e39243d2bfbcded22a4784a2cb348873d877568f9636e408a0b2963a8bc1ba71", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.boundedDecide_compile_ne_timeout": { hash: "683401b0cbdd6626029a522af08e9efb6f905c1672e0b0df46ad7dbd3e9e6d44", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.countEvaluator_workRunExact": { hash: "71cd0dd02776cb5bb9bd69b463d0d61d40fe51aac0e588c4aaed2345b6dd57a3", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.countdownBoundPolynomial_eval": { hash: "652f8f688e3f7fcf171a672c08b2f41cef4b163a4693587fe43e0df23d275363", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.countdown_workRunExact": { hash: "5a5784bd9eae3d4b34aab4958e5f73f055f7dedba1ab8bf900873cf1dfa69e58", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalConfiguration_state": { hash: "23f2aad8af11097409e9e173949f3f73eee92ad3ae54837759fb3761c5173a0a", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalOutside_contains_finalTokenSlot": { hash: "4fb2793b466c69af2ff8b12aa0acde5d2653ffbce0feef82611707020c261fae", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalTape_represents": { hash: "188c5db36d88a890cd09efd764bfe3f1c4c11158aa3459f9283966d05e0d2bfe", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalTokenBits_eq_encodedFormula_firstClause": { hash: "be4c50824caf8e0d2c866fcb1cfedaf3b78917fcd739bcb257db3bb001181ea6", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalTokenSlot_eq_secondClauseStart": { hash: "621a4a8742f77f2d833877d2051ef29d3156ba020ef1357a104265c5a8f86dfc", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.formulaVariablePredecessorPolynomial_eval": { hash: "50dea04320c15a07b60361b734a2e50fc0387616709fbeff897d3d2d0dcaa5b5", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.formulaVariablePredecessorPolynomial_eval_add_one": { hash: "84097ca5448477f5a55b1af1ccf5e200cc8c8dcfbcfdb76c7ff5f8951f9b3105", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.formulaVariableSlotBound_at_least_three": { hash: "df6876815223d99af21f1a5b45427486718bb51e9c22186f38d1efac2ff13343", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.launch_workStep": { hash: "c43657a609c6f60730395877f6b731f326758e8fd35571ce82dd712a7a4ecee8", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.machine_acceptState_ne_rejectState": { hash: "2dbdb022faf1c6d0d8330bc72ca83012c5263c98275913314ba8ce42155b8b64", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.malformedCountdownRoot_timeout": { hash: "caa63372fc9c8849501f35c5551be51e369c07817a745e5c57b39b5a6ee31815", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.malformedCountdownScratch_timeout": { hash: "f4bbb61e24a3dd26a57d172cecfa41a5d45e0173cbcbdcb53755ef4a49d8f247", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.paddingSlot_direct_eq_padding": { hash: "6741e59e9ee38871c591ce02391cf45dc09cc670985679c3665204f007e55618", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.predecessorSlot_add_remainingPaddingCount": { hash: "a86252b6f3e9928ded66ed8572dc7d6d1aafe07bec62d1c70a3a4a61a331ccef", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.prefixEndpoint_before_launch_timeout": { hash: "1b2bd5c2957e4c261ac8735ef70324f0e6707b2c7389e59b14defd0d58a459a0", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.prefix_workRunExact": { hash: "48ec90138765579c2ea436557755937751534e99e172111447a7e5a042293d26", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.rawTimeBound_eval": { hash: "f27b474bb6bf60d418fd730dfd27a53de3ffb759da3de5f7c2b94e0f01ab5fa3", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.rawTimeBound_le": { hash: "2ccd4be736eb298a4daecd114f53f3b65a51ba63e3c84bef74126ff77a4a1ff4", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.remainingPaddingCount_eq": { hash: "f384b0c9cea79aa5468c573fead1419df3714a8bbf8f800f89caa8eff14ed858", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_twelve": { hash: "70a70e503fe3b05d4e3cfa9a8e46d5da98ecedafa9fc4f568ff6df0f8d2b4010", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.remainingPaddingCount_positive": { hash: "44da0e3154aa94e6fc159104ad2db17d8239428cc8baaef9ca3f2399a53b5dc8", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.rule_source_ne_acceptState": { hash: "26e454d39810398d58b911bffb8e8d7e4ac814f5e8ccef1d3d186277a3ebecc9", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.rules_length": { hash: "b620ba5f5a07e6f0c6fbaf6baafe240fae963e1a74b8ca013516471ac966a5cb", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.rules_pairwise_query_distinct": { hash: "e11c10761e8b817bd88bd41b0ff450f646206bb6966439eab6515ee2fe837355", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.run_compile_exact": { hash: "e68816d69a85b2def550200d94cd0e5cb0db6ccd6d2252b06028c98e0ece2038", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.run_compile_rawTimeBound": { hash: "7a5ebc1782a7e7e2030a823043c5f841c6fde30e6cec541db07ddfdc42351818", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.run_compile_rawTimeBound_blankEquivalent": { hash: "47e7af16f3406e59d03d62d1da48d1f1dc94c68a295728f2c390f10948d20249", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.secondClauseStart_direct_eq_sep": { hash: "76ed970dae96c3473a5e60a7c69503509ebc33512920a12e9ea13a8d31643a55", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.secondClauseStart_eq": { hash: "6ff2d21f017ef811b361045094d910cc027bac021d176c7d416d2992f5df3cd0", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.specification_padding_run": { hash: "945896a9f7268ddafb199f286c09e8040d1698449dd8bae8aae48404ffda8908", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.specification_target_step": { hash: "7b995feae808b0cf56eb263ad0201ce0062f37dea260bfd845e49e15b725c4de", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.targetEvaluator_workRunExact": { hash: "c88ca687979f41ae48e662486e2920bbb6253df510ab1b1b1ccf0a0212753604", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.workBoundedDecide_accept": { hash: "a10b7df091f941dd40f42e69ec94306deda2bdcfa02daf6f59294956ff969b9c", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.workRunExact": { hash: "a023c1357be86f78812d0c237385168e0118446d37a7f7d975dcb303e49a6bd5", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.work_one_step_short_timeout": { hash: "acf0af0b30b9f36c737d02adc55054f9ff2607fe3907fe981ff2ae7039e39985", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact_of_unit_or_separator": { hash: "8976755a7cd89869e4821eecc80f47fb278a39be59b2bdbf679cb530d4aaf6cf", axioms: ["Quot.sound", "propext"] }
};
const BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.machine_acceptState_ne_rejectState": { hash: "eee6920f72c0fa3566bb3cc5fec3951b18a9b2aa1b50b5cf34436d0183ab750b", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rule_source_ne_acceptState": { hash: "7374475130eed22d8cc19092f72edf903e2c68e024a2f87b3ab4220e8cce98ef", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length": { hash: "f7a8b37c7c3b3404f9144c91f3ce51689b46abf2e61945b6fb89b3d865f98200", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_pairwise_query_distinct": { hash: "c17b7f7fa8d40cb373b90f541f7700eb91c2bc21b5a0a7f5a02ba842283f879d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.appenderEndpoint_before_cursor_launch_timeout": { hash: "ad2bdaefe4b1a274d5cb9407b0539835eb2210d144b4ea86f7d85b9bbaadcd72", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.appender_workRunExact": { hash: "041233d96532747c766da102026ffaf1d8b403eaa9b0513a714527720f1dc44b", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.boundedDecide_compile_accept": { hash: "c4298a6d3b6a1ef142f27fc9aa0842dcb0deffa6e85ad6adc96b17fd60efe093", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.boundedDecide_compile_ne_timeout": { hash: "a12669106e0f84d29214f2e9b48a31a3467d4bdf846d5a54bc35c14dd0bc5f91", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.cursor_workRunExact": { hash: "add03922450efbddd2d1b15ff9f2e4fb8ebfdb8a1f8cb6cb68b2e879387c92e8", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.finalConfiguration_state": { hash: "fe9073951354db20bb8ecfa177a6db08bf6890fdbee1beb192dac02395c478ec", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.finalOutside_contains_finalTokenSlot": { hash: "c3a3b0711d37b8996d60ee537c82643e6b3ed1d6bee27e3e95361b8095fa4079", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.finalTape_represents": { hash: "a9200b1c787cd0030be51e420ecbfdfb9a7ddd58bd8076dc4e119f417bf57416", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.finalTokenBits_eq_encodedFormula_secondClauseStart": { hash: "ce2a825b6e9366f92397e5f7015afacd4ad5ed1fff7494c1a0f767f7b2487844", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.finalTokenSlot_eq_secondClauseStart_add_one": { hash: "07ea92a40b861b6db507f5b11f87c4e36999c41302fc0148e79f813a4162da4e", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.machine_acceptState_ne_rejectState": { hash: "60e9b6e2de2741ffb443676ad086ec302833d1e560f4d1caed5e813427862b07", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.malformedAppenderOutput_timeout": { hash: "cd10007760e109295471085a04540c479e17a1f4c1b0a8ac01b72df83098c6c3", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.malformedAppenderTally_timeout": { hash: "4373fe245f29c25303c7a0cab7b9cbc71e92b20373d76cae417e35c3742619b7", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.malformedCursorScratch_timeout": { hash: "e47294ed1b355650fdd2c0785d546d17c548e76d829ec1bb18eb91bc259a0bd3", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.nextTokenSlot_direct_eq_f": { hash: "b587c523f0db61e1f3e5b9a3ce12fa608b1101023177f6b71e538cfa80e2406e", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.prefixEndpoint_before_launch_timeout": { hash: "59c60e19b68301bacc341a5a6aa3cddc9c7b958d358b75e02d5108e35bd38d7d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.prefixSeparator_launch_workStep": { hash: "8fac74a09b0ebc68f20e6cb371e29189240cdbef96e41a8210fc271ed285eaa9", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.prefix_workRunExact": { hash: "97c7b4932f0eddff60e61d57aee3dc12cff984284bb0e8424da2d03a77060dfb", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.rawTimeBound_eval": { hash: "fe2db6747290530cfa9bc1205adfee86e14a22a37067403aad6e8671a5e31c0d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.rawTimeBound_le": { hash: "556a1d604cbca65510f121125a0546a3be4e0136b8a3ed1689d475dceb5f1eb4", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.rule_source_ne_acceptState": { hash: "ec0bc3f9ed6144a3e5ff1d7ac946825dbc2163429efad0a006600c63fa384e24", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.rules_length": { hash: "6e623bef5bf80af1784ab7f1352a927b26cba62b1c4536989791818940dd3dd8", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.rules_pairwise_query_distinct": { hash: "50a40c918c41166208defa5d39af1d28333cf7c1e611e242952fb16d39cdd4ab", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.run_compile_exact": { hash: "4c30ded5a63f249dfde6fe018751d682d9d92104d228e7a41cb1db4bba54c646", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.run_compile_rawTimeBound": { hash: "f3fafc7b760fca812f10d86a76e19cafd04f5efad95d03ff6c511e8d01bc1fc6", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.run_compile_rawTimeBound_blankEquivalent": { hash: "67631612fcdb742cec22ca207382ea75377da949666d4d0a5b0e22c7ee1f3770", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.secondClauseStartTokens_eq_canonical_formula_prefix": { hash: "7a63afe5199e3202d5b8474faac2f826bfb5089909fbdae6d4900db4f62b355e", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.separatorCursor_launch_workStep": { hash: "bfed9045ac59241b1fab9a90c27e29c072561d078dd907b73e8a6ae2cd464960", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.specification_next_step": { hash: "dcd66bc35eda47dde62642a3f980870d522dfc0809c19b599e0154bff65f3789", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.specification_separator_step": { hash: "3d03f943e9a26f9a1ea6fc935f0ae39d8cce633659feca3196794de6c1f76101", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.suffix_workRunExact": { hash: "fa36b7e47fb3f9305636d442ee21a60e16e79ba2bbc17813ee0ee04db001ef2a", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.workBoundedDecide_accept": { hash: "202715328b0eca18c9de92dbf65776abf88a222ed5a5980001d60e7264a74814", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.workRunExact": { hash: "2ee6f43c4bd4e5a1b315be73c2d7942cb6a2990867886b07b871050816be24d2", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.work_one_step_short_timeout": { hash: "02abd6e7f0e79e68631af54ffd7d1f4a66feb0c5129c5d7614bf5988e1383469", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound", "propext"] }
};
const BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.machine_acceptState_ne_rejectState": { hash: "100d797c35b0c6669b7073cdb854d4081c9d53d8688205e876159170ec7db7ec", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rule_source_ne_acceptState": { hash: "bf196201e146f446a56416af0eb05e5a515f1ac5832d224c313b343ca814ba15", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rules_length": { hash: "9a8f723b4a8b1cac430edc51c0820def765e54ced9d39e1f44d4ce3c067ddf43", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rules_pairwise_query_distinct": { hash: "24a4a64c8cbb3a4bc76886e3ba8db047c1e5bcb5ef87e7c05029d09e09da3360", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.machine_acceptState_ne_rejectState": { hash: "2dc79ae4c9843605442a27c12d6767cab9e0e4fee9b5ea179177128ecc77ce8a", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rule_source_ne_acceptState": { hash: "e4d2f92edde5f7d135e1449a07249349da4b9bc16b173dfa5e5b66fd1d19ea2f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rules_length": { hash: "a502886839be2e262df7418abf74efbc75148b689509d23f2037351a65fd5e5f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rules_pairwise_query_distinct": { hash: "f4d2b3a0f1821d864b4a7878facc2f6cbe74af602aeb84ad82d289f76f4e78ed", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.boundedDecide_compile_accept": { hash: "0e55891093f05e7eea469deba762a4b44ca8a0d2ec35ee873375280d0fd54b83", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.boundedDecide_compile_ne_timeout": { hash: "17522b2dc74650740eab5fcfcdd00a2cb1f6edd3e5f72215b469bd4db3e4bfad", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalConfiguration_state": { hash: "73f80da065cb320433f369c881ac9d60ca691ce9a0e3289f11750e8b1ad94f88", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalOutside_contains_finalTokenSlot": { hash: "3da9c768dc03280cb17a1e45e5cdfbc3d90db67871e806cf841bda39bcb79b98", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTape_represents": { hash: "a6192b6cceb1ea40803e4fc4d07ed145e71d92595f3f3e702b0fb54592c64c9b", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseFirstLiteral": { hash: "161833de4939798583ea4074346868af4c4136646d71abdd91dc8d6f391c4ced", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_three": { hash: "2a3444c8efc604426912738585d3f406eebf5f87d6975097e57e2cc57ee5f3d3", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstAppenderEndpoint_before_cursor_launch_timeout": { hash: "2703602947af4c56aa6576d9a1b681d0bd9cb37605b37055285b4a9c8812f604", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstAppender_workRunExact": { hash: "2aea5ff6c759f6029fc9c4489990ba04972de21a1ac2393519326fa050afa9c0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstCursorEndpoint_before_secondAppender_launch_timeout": { hash: "1d5c957bd3b5f256691b5ce417cda7e24e3cd6b3847a0d83891d44b57a7ff922", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstCursor_workRunExact": { hash: "5944a010936da5707ac67279a3df6d52d8653aae9db4b354634c5a1981c440d9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstFalseTokenCursor_launch_workStep": { hash: "cc7944dfb6723a2238ae3f723633208830cff1ae8e99292088f2f3aac1273769", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstFalseTokenCursor_workRunExact": { hash: "88dd18ca9d86432f386d9b06033334c273d1437ba7199cdd07aa449f39dde613", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f": { hash: "cdade0ae1a9b56dc832f0faf7d534317f4a990961c6a51e67ef1801f6888f045", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralSuffix_launch_workStep": { hash: "3fe9a5c1a19239464ec06179c47a43210dbfcc838a58ea72ddf9d60c54cff454", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f": { hash: "19c0e7c8f5af50160bf699b64b5b2ae90a0740535d6006e6e45c58a22a06d759", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.machine_acceptState_ne_rejectState": { hash: "f1d8027247d44ce6f4de81ee134b59d2111c0e8e7d418b8329829af13c9b9a50", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedFirstAppenderOutput_timeout": { hash: "7296a53857d9845a9bdf02732b9369f240a51b0ca51b1a57afdb3aa14cf3dbc6", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedFirstAppenderTally_timeout": { hash: "f90c959e57f04b13419d8263b6352ddfa2771306a3401a47236aff72c0036b82", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedFirstCursorScratch_timeout": { hash: "bbc7b3e53117621c93a9c223ef5813020cdcd49e476842837b45f6c2f97f712c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedSecondAppenderOutput_timeout": { hash: "6d1dec47fffa07c133033ffd222b40f4e81fd4002bf941fc6e2bd9ac52965b5e", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedSecondAppenderTally_timeout": { hash: "4a9ad69b446ff5c14af17ab9484eaf7b0de50fedc11d82fa73778c7e6322fa2a", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedSecondCursorScratch_timeout": { hash: "8b756393188842e1c85446b5cfd1aca7f98c16a2cbedf26217da617d3b3e78ed", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f": { hash: "a8f80b5480c0944aed93b57b106c4ed788b4094828c964132b72a54dadbf1ccf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.prefixEndpoint_before_launch_timeout": { hash: "b6f30c49f248dd0b160ffd796fa592a5c0fa1a9f7014f6575c00f421446da9bc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.prefixFirstLiteral_launch_workStep": { hash: "33a22605a9ce5ed35dcb8a3f5df247dc03a3fca5fc8a700e9b1ba96e787cf07e", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.prefix_workRunExact": { hash: "fb1e67c6f52501f46884408720260f239f232de8d46a07e406c7fd14789948de", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.rawTimeBound_eval": { hash: "c2d929c11c18ee4ee79c054a12515d4d2f8b9cbe48d217cff0375ca0c8bc3d24", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.rawTimeBound_le": { hash: "51aa060502927aa8379573a616d180caafac054e815eb70f124fcf7930cf7cf8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.rule_source_ne_acceptState": { hash: "8e465fb54c8f65f1afa98a1188ecdd9e8b896a21d2db6cebf91ae541f51e2e9b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.rules_length": { hash: "27258f4ca994e7e6b89787485f049baa80a804f9f27f78135f9369883f25660e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.rules_pairwise_query_distinct": { hash: "1d1df2514d3163c3664a9564c06f57e4b13dab841834ae3add90b49b2b973b91", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.run_compile_exact": { hash: "e0ec5f1b9e09ea4ef60bad776dacdef963ce8fddbdda9eb130204d6c3e433ee8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.run_compile_rawTimeBound": { hash: "706cc82c251a8b23667d0d6f55afa33632ddf4a40508d904145d9fe84a8ee38f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.run_compile_rawTimeBound_blankEquivalent": { hash: "e97c42c2de755d0975eb78c942b49f1bd01c1475ac6ef4279811b9654b5b5f55", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondAppenderEndpoint_before_cursor_launch_timeout": { hash: "362a532215ec262421b0acac5a0da4217a7f30c8e12ac2ca182c5a42899c3a32", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondAppender_workRunExact": { hash: "0591597c370817cdb3ab8d41a71b3649e071fab6098f3eff7b961bba7513facc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondClauseFirstLiteralTokens_eq_canonical_formula_prefix": { hash: "9290801476914985467e829a62d75789ccf15138eff699e9df42deb6f46307b0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondCursor_workRunExact": { hash: "e2d37fd99924ce8c5bd65b2d57fc34ad11d9c6edea08bb8c85109827fd7a20d8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondFalseTokenCursor_launch_workStep": { hash: "31114235018173eb2d48b6ec1b8a793e4834db8a97b51bf727282f35873191bd", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondFalseTokenCursor_workRunExact": { hash: "fdadbadbb2f5c61ea900283d7dc192127a9feac5b8204733bb6c5ad73ac6e2fe", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_sign_step": { hash: "eb03f0a33b7bf17b325b1c30b4630bcd57f5359cf886c08a34908dc853482468", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step": { hash: "344795f60c1c7223a0ec43b780ed860015fae9a7f3e3497d98f41c07e6f021e1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_next_step": { hash: "a94f13a59f138c64b43494c172934b8cdd2affdcc630226c70fa445a2a75a4c8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.suffix_workRunExact": { hash: "30fcd83616da9d1f70de469678636beb6805f25dea936108de95a9fb13f77874", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.workBoundedDecide_accept": { hash: "f2129f92a4df336d76a7c9cd2e544d9005a56d063c6e688af45d383c3d630a59", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.workRunExact": { hash: "05216d68daabdec4c5423408f6ff238ceafc2086300bfe90c30ea4667f93119f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.work_one_step_short_timeout": { hash: "585b1e68fa85cf5f22511e05ba75f3b9be59ec77f7eaf003c4e710efccdecc80", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound","propext"] }
};

const BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.machine_acceptState_ne_rejectState": { hash: "b7990bde018b28a015cc58d4e8b7d7c545fbcfcce4546f677144d49f83ab5eba", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rule_source_ne_acceptState": { hash: "e96386b50a163500c445b72a4296a5288dae2c16353452b162ab1e979e455964", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length": { hash: "2d234c9f975861fc313f3e73b43205a601b5eae3c45b0415c3341841e7079643", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_pairwise_query_distinct": { hash: "a4589a4364ceac618674be6c720ce13ca618a4797c16e48bd399e0e8dae2d824", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.machine_acceptState_ne_rejectState": { hash: "4dac552c93dffe9e77d712891185d1d12585926292dfb3773386e749c4a20646", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rule_source_ne_acceptState": { hash: "d94f787a19844fb8e755e09249bcc56e75751d9b2c40143e02660a62d7b4ad04", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rules_length": { hash: "e5b32823754bf6c535394d67f89795dab7d13d83fc26601606d2d3b97ad1355d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rules_pairwise_query_distinct": { hash: "b1aa2a7114f99c3a80df8a2837b9d8590374aa0c0db075381da329db16842aec", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState": { hash: "8751719f745f8345308450a6fa63c4555415c822188cbbcac76ae752890895e8", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState": { hash: "11ea0df62f1691605a85227e5f0b315f3232a811aac074053c18d465743d560b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length": { hash: "54722218e5109a54d5d89bcf6b9011921f507daba1452870f0f22142f426de1d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct": { hash: "f01f1614a6efad7479051b52b3f910046c73ad4c6b60f7275a62b0cdec42731e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.boundedDecide_compile_accept": { hash: "a99d19298691ae0c52ba5b7abe3d76efa6388fd21a396301e2aa9aa24946e27c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.boundedDecide_compile_ne_timeout": { hash: "ab343814b980ac2abb9b85999decb30c840e208ffc6d7b38efff6ecad0c11598", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalConfiguration_state": { hash: "6835e67494845c746edae5ba87593a54439c9fc7e9f3b0ba33c1baffbfc3f7c7", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalOutside_contains_finalTokenSlot": { hash: "76725c0d19af01b237553271cdaa27e4526d896cb930e852d48a0f00801c4c27", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTape_represents": { hash: "de595b88d647eb31e6b3ce61f51ef91ea9a5d8427f86879efd991aa8a924919c", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseSecondLiteral": { hash: "59de0969559f83ab2d1b8ea598901994bb2f042283db447d480bdf97002953c8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_six": { hash: "e225bf2871d9069fc177600ef2447bd1b4685442667e7f2eb02a3db7cdb3b9b0", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.firstAppender_workRunExact": { hash: "d4919d2e5ffbc94e8cd7796dfdf8467ff39991ba29be09b07de0809a4aaace50", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.firstCursor_workRunExact": { hash: "9dee6e148eb673ceb724643554f67232143c8804c983b13a8cb05a9969fc7657", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.machine_acceptState_ne_rejectState": { hash: "670fd22b174b41f4a7205df3e91ceea0d8391305e8a7b112065d70bb3dff23c3", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedSignAppenderOutput_timeout": { hash: "a9658d5fdf407d1bec42f4798fe809d0087b778fcedeea05d5aeefeb67fe839f", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedSignAppenderTally_timeout": { hash: "420ad28121ed1aaa4a97633dac57eee195ea872865e6f30e6a3645ea3ef00fc9", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedSignCursorScratch_timeout": { hash: "28e7692f3dc7c6ac41f51dc2273f6cc668cc2e0ff48a704d623119262481a129", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedTerminatorAppenderOutput_timeout": { hash: "83b208fa77e4f44fdadd9214a2d65ed42f4cd01073c9e3bc9204ca70d5ff1cd4", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedTerminatorAppenderTally_timeout": { hash: "9b1c305ee489fbb04a132c2df00d88b72e0733224297750c6731f61e3f848404", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedTerminatorCursorScratch_timeout": { hash: "e13c174172a52e352d3d56297db0823c4e2919a8002e30737cf62921035c383a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedUnaryAppenderOutput_timeout": { hash: "ad6fbbcd67043cfa149b26446ef1906e17e3a75961808a979478534cd8416a76", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedUnaryAppenderTally_timeout": { hash: "346e1681a7192ca3aa13acd1c546227b91f0116665ed62a82959a333bd8ff1cf", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedUnaryCursorScratch_timeout": { hash: "65cbe491e02a47181e65d4a0e084a52bd6519164d9307b74f24eed67ff61148c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish": { hash: "ab541eaec279a0477d26e5410d78d6cae745a6c9275bedbd0d69dfe4618cc62e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.prefixEndpoint_before_launch_timeout": { hash: "fbc14361233b5e2ba63e04b1babfd73110300da66053ec9993058e7c3e2eddef", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.prefixSecondLiteral_launch_workStep": { hash: "f613663e4c09b3e5bd0ac168a13b21c8029f9debe5d3f6a4e78a6aa10c39579b", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.prefix_workRunExact": { hash: "0b33e153bce1445ddb70af07260f3bc04d805005ff874a333c5db62b6fda2bf8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.rawTimeBound_eval": { hash: "2597c83cd782a1485e13e8b47e3d8f836364752c4ac115fdac588fe1f40b3acb", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.rawTimeBound_le": { hash: "b1809abf592b46d5e4d0f5f046ebc5f6dff25d635e682cacc08bdde4060863ef", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.rule_source_ne_acceptState": { hash: "8f466f143f7523d84b04c4965340a840cac57a0d84ea9c22641cc6001e2cc110", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.rules_length": { hash: "7fd57db2be6bdfb71a42ce6c53ee37df800b0ee1d7cf31b2d8835e5863d937ae", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.rules_pairwise_query_distinct": { hash: "13e597540a85f0d4f4fc38c3ee2d39a8897df508a3fa701f727a596ebc988bf6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.run_compile_exact": { hash: "1434e0adbb5a0a0b94f0aa6f5901e8e959b9cf94cc2cd4523b666f362cdd0852", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.run_compile_rawTimeBound": { hash: "ca9bd60487d54bae7c45827179c44415dc11d330e58e7bd242d7592240e252d5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.run_compile_rawTimeBound_blankEquivalent": { hash: "1f0fbba6a80b68cca3e1133cb2d10a0067ce89eb5596937315062245ca22133e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondAppender_workRunExact": { hash: "b00cce816ee53729b413c69ae23f7121829bfbc52551dae6929eca21c5de1f35", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondClauseSecondLiteralTokens_eq_canonical_formula_prefix": { hash: "8ee5794e98a1952b6d0fab68c25e50b32a749e03970e7f21bd0533569700124f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondCursor_workRunExact": { hash: "0e35d9fa14dd681cfe13899d164300e9e0adc76a3ddc8b3e2fbdbf8e838a82a3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f": { hash: "e819b9b37402e19383e35a467e2cedd4bd826a0023523c1c8bfa304a8dd47927", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralSuffix_launch_workStep": { hash: "6971f259a43bbe0f63079f408004c1cac04fec87e55953b1c4862fb53cf55454", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f": { hash: "c92538857695ed04554b5f3104fef62d0fddfe022b741040e99ecf1df4850534", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralUnaryUnitSlot_direct_eq_t": { hash: "3438be5a57961905e753eda0fdb1d51884dd5e9e0648e766d97ec0e039c2f916", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.signAppenderCursor_launch_workStep": { hash: "e9519feaf7d70029600f45d4e13cbcc4c62a2630602478c1985733055fa7604e", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.signAppenderEndpoint_before_cursor_launch_timeout": { hash: "64e438ae7e751646aaa4be4be3e821dce9cae5a09a11cdd05778d882ae04dc97", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.signCursorEndpoint_before_unary_launch_timeout": { hash: "b2dd0dfd3870e44c09e684a162dbb668d972fae96dbca014a2301f9f36878564", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.signTokenCursor_workRunExact": { hash: "9496a8e67f9c8fa7687452a99d8432abbf2d57242e23b72f9f93a5b8d1c18ae7", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_next_step": { hash: "c74a7eaa1aeeb237c307d7748427badbf072ad9e15570cf81aed3b0e2e92aae9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_sign_step": { hash: "9b3117bf74ea488fc9870203d6bc6ee11bc8847b9e576ed9f57f272aea539395", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step": { hash: "07d2664059f61f0b17f12c4701b40748a65c2a283bfcff872eafb17238bbb19e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step": { hash: "8bc23af10eb7b5fb7e3e6c8f3379770d43f41b44fb33406f7d2c38ff3f667992", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.suffix_workRunExact": { hash: "6309751f40b1cf21c176128185daa6e4aa8a16bcdfa35caa2074a861a30694d2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.terminatorAppenderCursor_launch_workStep": { hash: "44ee2916d3527618ef79c81297b144aca3c91cb452fe55b5544adea81c4f2ced", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.terminatorAppenderEndpoint_before_cursor_launch_timeout": { hash: "3949262088492110721a49cfdcfd1ceb2f98c77745173a4ebf49848b3bdf94db", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.terminatorTokenCursor_workRunExact": { hash: "e4fe9002bcb7ca08cc864189b4f427cc8bbfd5680ea8134f113bf86fc5faa651", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.thirdAppender_workRunExact": { hash: "201b95e59a303f033256b57eb0e71da6be31aaf29eb55296375aeb91479173b2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.thirdCursor_workRunExact": { hash: "0f1b30acfbd522aa8445e45162cb8ba72b3347e185c8322ccdbeff2beb5afec8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.trueFalseSuffix_launch_workStep": { hash: "3579e039b667ea12cbbd2f1a0fcb2d142956188a00e0b421d41a0d6d59226746", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.trueFalseSuffix_workRunExact": { hash: "ed059e54f87c9b6773d86e6ec2f94c7fcbd05969c87baf0fd778bfa4d5bc9507", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.unaryAppenderCursor_launch_workStep": { hash: "0e1f2080fe9bf89c6ba58b64b168227ae2f7c5a396161be6ce37005d4209b8b4", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.unaryAppenderEndpoint_before_cursor_launch_timeout": { hash: "78458ed1e79d4d681219fe61635cc9cd66c191b4e9581df8c18461898a390958", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.unaryCursorEndpoint_before_terminator_launch_timeout": { hash: "e0c29ad519cc50be3a8c107b9838e22032c3c98ede036ec1b8c416067937017f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.unaryTokenCursor_workRunExact": { hash: "23414bcc9c451db68c05d5a25bea509f59642bba5130894a1dd20c8a8be9f86b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.workBoundedDecide_accept": { hash: "9b0d11bd94ed812f99b31b6c5071dac0dd9d18b4b3e8f079f2bea6107f317554", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.workRunExact": { hash: "f21f548fedbfd5f24ecbf212501084502a6a216a621a82569be93954292404b8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.work_one_step_short_timeout": { hash: "7c680eae6fe8ca4f6d2800d87f8dba0a7750d4280d7caa42351d1ffcf18e8bf0", axioms: ["Quot.sound","propext"] }
};

const BUILDER_SECOND_CLAUSE_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.FinishTokenCursor.machine_acceptState_ne_rejectState": { hash: "c92ef301f714bebdfe7524e5cc6c2cfa753ba472dcee929636e806ab21bc1969", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.FinishTokenCursor.rule_source_ne_acceptState": { hash: "e653092c4b310f8a8514b74bd8cf42f0f95e4e46ab6cbf778072dd070ff5a1d7", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.FinishTokenCursor.rules_length": { hash: "6ad06c9953ddbf0f2a89a691370014b413047e245f4daac510c0533036c79859", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.FinishTokenCursor.rules_pairwise_query_distinct": { hash: "1b6050b2237706ea1f262f0a4fac2134e0fec2d493d75cef02acc910a734a758", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.appenderEndpoint_before_cursor_launch_timeout": { hash: "e35dbab8d230099bece5f0e2dfc0784bf402b94acf4bed6c53bcff987e37902f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.appender_workRunExact": { hash: "729edebb0d87989b6a48d66e786ae4007afa2f627b42f3c15a9b74ad013234f9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.boundedDecide_compile_accept": { hash: "7ff18ece4c5faa4253103657c391cc2725fbd5409886220e8787da29140230c9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.boundedDecide_compile_ne_timeout": { hash: "72d53addfeeb64519f63f2bd5386c833e92ac2447cd4594a01dc591873e29e31", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.clauseTerminatorSlot_direct_eq_finish": { hash: "d7e761fee2cfed73e104e481a810cc43956d37026c193c86afcbd3e9fa2269a4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.cursor_workRunExact": { hash: "c41f968ea22b71746151e21fe902d244e870cb1f7ed0f215fe01bdea9cb4c917", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalConfiguration_state": { hash: "8c884ec1ab79fd4b9a37da4ae8a4f9d81344f7fd1d48bb68209258946221e12d", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalOutside_contains_finalTokenSlot": { hash: "3c6d7acd8631b3496257021a1ba2681bf95a05b49e026b1e89913414c6c263f5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTape_represents": { hash: "424695b161d5e2c6e85dda3ef82bba02fe6d110bb8077da84afa38b2faf3282a", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenBits_eq_encodedFormula_secondClause": { hash: "89155cfc9f2690463d40d18fbb583e2d7114a7ea1452a1bb09a1c3f8611838a7", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenSlot_eq_secondClauseStart_add_seven": { hash: "7a6dad36e00cfe8fcbe4e0f33cc8342d94a1e67f628b390eb20fb3d23b73df3a", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finishTokenCursor_launch_workStep": { hash: "c7553d415b963f721ceeccf11c55a172cfaa585967c13d785f1a1394eae49fd4", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.machine_acceptState_ne_rejectState": { hash: "0080495a18fac7a71dace5e7ad23cc2785fced8672ee8b6f41e5048f6075a0c1", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.malformedAppenderOutput_timeout": { hash: "facc9ffc626d76637c794e20cd222ab2e8326ffc92e2c0e19eee61fa7bb70b4b", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.malformedAppenderTally_timeout": { hash: "4c0828846ac3dc16c83ec58e627134755784f0efe25c6aec9a2a6522082dd143", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.malformedCursorScratch_timeout": { hash: "597f1c8fd8e136d412e4bd970fa2a5989526b3bceb84e7aedfe70a2bf4dd4030", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.nextTokenSlot_direct_eq_padding": { hash: "2986d1bf8c4d10b71ba9deed762ab6c0f073b50acf4c2f8503c9ff79c5db87e6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.prefixEndpoint_before_launch_timeout": { hash: "04fb9ae42f1326437788608d0bddb58bcb83ce02140b6238d7330b65a2bcaf10", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.prefixFinish_launch_workStep": { hash: "cf78b77bb5663a43e32510f4625f031c80af7cc3ee7379b74dd3ec0f03534ce2", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.prefix_workRunExact": { hash: "a3b9b5619487f16c7891a16e21e1d0daf05586f8f40e3cf60b018cc6f90ec933", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.rawTimeBound_eval": { hash: "c8fd020e5a95df4849ae73af2634f081ab9bd54fcef9e89a337b72ef84bc1aae", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.rawTimeBound_le": { hash: "d53a117102d056edf4dae59981cb92269dceadf6d416a205d48b0452a7d35c19", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.rule_source_ne_acceptState": { hash: "4a5b7b66480a16262b24f209122c0b7799c24f5f92f893d8339fbfbdf77ca7ed", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.rules_length": { hash: "7550fa5770ba848aacbceb558f95324be3a8e2bcfbcddf3618e56a9e2d79a684", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.rules_pairwise_query_distinct": { hash: "da5dd9b4c5336a5f5e77f38e2a0b1cf4e492d61c1092534c63749f3e8f686556", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.run_compile_exact": { hash: "cd0e9aa6bb6822d06d7caf195f15d729c4e76febe1e06231a8bf9267cb10ef3d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.run_compile_rawTimeBound": { hash: "2da8b5eb7ecbc3d30396ededf15ec2cd929707db131f63cdb4d7f008c2972f2d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.run_compile_rawTimeBound_blankEquivalent": { hash: "4b783be22065343707a37662810fbdf7d4285dcf98af296746117a44f5f83e70", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.secondClauseTokens_eq_canonical_formula_prefix": { hash: "3ed7b48cecd3468ee7e5bf71fbbbe6e423c926ffe5d9983fc4ee77e846e4cc9e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_next_step": { hash: "fe8e0a7076e5f4f86dc345478b1b5423dbb9c4d81bac9b1cb136db37cf1dba25", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_terminator_step": { hash: "edc48c47e4adf6e67bccb378eca4169ac1829b3baa597cf7786a4d9f5bf0cfe6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.suffix_workRunExact": { hash: "c39a6c60938fad838aec1b4fc66e0bde9b38a9a7e06c2b3d62d402cc110c2602", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.workBoundedDecide_accept": { hash: "05f3ee214b1493a51f149da6274efd4690a96c821ea2d1bac97d3dc489623de1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.workRunExact": { hash: "998dde8748b1b84c8333f43326fa8b4b152d8a0d44c3cf24a31e6a32f14e79b3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.work_one_step_short_timeout": { hash: "7c837ea2afb2ba39fa9f54f1e3b9f8daad9a5c7168c2a6545b4693a29368b671", axioms: ["Quot.sound","propext"] }
};

const BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopSteps_le": { hash: "972da09f44b6d35d56ce775bd4a46687be45609dacd0670bc983d603715bf278", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact": { hash: "ff60669772a7f137755431c1300c4368e8004a05b1d36972a768b50d1846cf5a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.boundedDecide_compile_accept": { hash: "bbdc3d48dbccda039431114ac172ad2c6e336c06d968cbe83a675eb2369eb18c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.boundedDecide_compile_ne_timeout": { hash: "bed32851f17567dbf385ed19775db2adb6e27137a48299f9d3df032c7aed1c78", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.countEvaluator_workRunExact": { hash: "5366f43b45df84edbb6f02951d64ab5fb4af5b89e90bb17bc9c006512b73cf27", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.countdownBoundPolynomial_eval": { hash: "1d0d11696062794bda139c4a244ad85a37535c8613c4a1a1c85378b2ab1683e4", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.countdown_workRunExact": { hash: "eb5c0d900e07603bffdcd8041819f07cb01c818141ba4f26d313ec15b253cc26", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalConfiguration_state": { hash: "9fa42991e64e972a9139359c62eeee0492be28796dc8d4989b03f13e6c4cc74d", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalOutside_contains_finalTokenSlot": { hash: "9854c124c563ce9964d2cb998d49a0dae63c1457af57e3272746e268bf14b954", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTape_represents": { hash: "0076d1b19393970036a9c314ae4477216103dc159c9d073ae6d8a73d260149fa", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenBits_eq_encodedFormula_secondClause": { hash: "e71f29f960fade9b8d9feadb0bd32e0811a9d025cb2217e342462bd9cf4477db", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenSlot_eq_thirdClauseStart": { hash: "0d522e7fc504c64ac13ff7e00837c5bb9de273594dd88dc8425b22c4b7a86fe5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.launch_workStep": { hash: "1ce5d0f6cc0d9871756955e77a02b33d770e08c95bee935a5a3c3084f04619c1", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.machine_acceptState_ne_rejectState": { hash: "f9e17b81e926146d85a2eb9229315a8488b2288ab75828a76418056cfe63f4d2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.malformedCountdownRoot_timeout": { hash: "4196f68a2bfd23c516eb1dcebe368a8cab1a1488a3dc8ca77c5ae7a8a15f8ef0", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.malformedCountdownScratch_timeout": { hash: "88839c44b6ef92aafffeb2e9a675bae541814fca8849b043ab118bedf6ed7b13", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.paddingSlot_direct_eq_padding": { hash: "4cd1101e05b508bd86726220c119276d53b570e1e3ef99e6e8725024df1a7d82", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.predecessorSlot_add_remainingPaddingCount": { hash: "5bd50e6159f09af08b231fa85725e89c3ad359a1b9fdca3fa4f0e60335b3609c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.prefixEndpoint_before_launch_timeout": { hash: "b175b7b55a12726f907c6947ef67d64dbb3dd3a278b63a9cf87de884f265646b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.prefix_workRunExact": { hash: "620c375c2835eb783729a0c6d2a34a9cfa58cd98fe11ed0370782f7d1486a9c4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.rawTimeBound_eval": { hash: "0cac86ee3f2cda05ec89ac7db2687210ee38236c6d2335c0da90ce199b0de78b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.rawTimeBound_le": { hash: "cf0cce4b652de3c60c21c910334da7792b7cf5de4f021f10d1dca702fcc787e1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.remainingPaddingCount_eq": { hash: "5daaf955bdc57a8a8698940fb247afec253d636e0d479692953fb7cccbefde77", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_seven": { hash: "e22998a9b398e7122a7f889e7ad25233dff6edd61418eb075178f05edd27c6de", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.remainingPaddingCount_positive": { hash: "b66fefc89dce672649f1d76ef3e01e991909486c51729a4559f5ba4668826474", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.rule_source_ne_acceptState": { hash: "c19afcb79c517e2e5e7f0774b4374355c5de535e1a3d37933235e372776f00b8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.rules_length": { hash: "7356c01f33dbcf3630631afb14cb71b1531541442755ecf6971d2328f88c7acd", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.rules_pairwise_query_distinct": { hash: "d46ee4a24be5e5d5e092142ca96e63aa6a255a02a0450613ffcf726fa7b03f4e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.run_compile_exact": { hash: "3fa0ca7054d9563a88488dc97e60d97cbfc6dc654abbb8fc5e8a040161487ec9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.run_compile_rawTimeBound": { hash: "c2f0857602baa434e36126c55b87ecaad5fa79904c8b432255adf1eead3de1a4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.run_compile_rawTimeBound_blankEquivalent": { hash: "e57460bfcf11e0f6b186936a2ccc4f235f0edb05bb0c5b61533c90acf8982c94", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_padding_run": { hash: "2e750bcd50273ce84d67c967bc858f8f48391c6af63c4ea990dea28cddad7904", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_target_step": { hash: "9cac7fffd995e0f6f4fc4794759257e3c77aff54ee9cdbfa1c49702451e2f2a2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.targetEvaluator_workRunExact": { hash: "fb5877140490d31de813cb234f25c7269dbf351c9ecc1e7cc87e5b65750038f6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.thirdClauseStart_direct_eq_sep": { hash: "490e8fef586147e9804a8d9075c60861522433002558de06324459923841d418", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.thirdClauseStart_eq": { hash: "c3a85a0d06934ff58874f9241daa9c7a6932dd62dc02549f0da7fb2057f86d05", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.workBoundedDecide_accept": { hash: "8a56178f1b2be071c434be96d5c522f3421e4e325b39ace4ad34f0ecde4dd4b8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.workRunExact": { hash: "c224517433caa01b1e94882a88bd538589f9ee801070e9e8bd053ffe46e4b48e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.work_one_step_short_timeout": { hash: "b35db2da7e6d91bfcfb2696a74f6b41233788dd178f306fb3838f182e049a772", axioms: ["Quot.sound","propext"] },
};

const BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.machine_acceptState_ne_rejectState": { hash: "eee6920f72c0fa3566bb3cc5fec3951b18a9b2aa1b50b5cf34436d0183ab750b", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rule_source_ne_acceptState": { hash: "7374475130eed22d8cc19092f72edf903e2c68e024a2f87b3ab4220e8cce98ef", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length": { hash: "f7a8b37c7c3b3404f9144c91f3ce51689b46abf2e61945b6fb89b3d865f98200", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_pairwise_query_distinct": { hash: "c17b7f7fa8d40cb373b90f541f7700eb91c2bc21b5a0a7f5a02ba842283f879d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.appenderEndpoint_before_cursor_launch_timeout": { hash: "3c7d516545e52f84a697d3fc76b4e95f9f3c3b512da286ff7ab06b1ecfa8d669", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.appender_workRunExact": { hash: "8d2a05243ed841aaef9ae166df6b942d2c21d591d2f50b5b20f10b3ee4f5040f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.boundedDecide_compile_accept": { hash: "e7aab491624afd81b65c59d3dadaef7afd40a495e9e0fffa009d5944c7fa8267", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.boundedDecide_compile_ne_timeout": { hash: "8ca44e82291aa99fcb918b4e4b98ff8815ae8b742de3245b36e529659582ac6c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.cursor_workRunExact": { hash: "f252365f166141d91b067b9b713650987cc10cbc74152b2909ce653a089fb12d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalConfiguration_state": { hash: "822176ed69223c098ffe06b2fc5187c70b8c8e950cb516edff48b6608901ea9f", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalOutside_contains_finalTokenSlot": { hash: "b228338a40b4e0c1543fc18ea99aae9ca49a0762faf8eef6f8a2e6059a1c37e6", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTape_represents": { hash: "760750c3f1194cb9eee2377777b950b9ebac7e542783cc3e7a6e8c864921d091", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenBits_eq_encodedFormula_thirdClauseStart": { hash: "85d5bb8c8d33475f46e8501b810e375d64db6c81d1a6177c9f246863c6dac8f9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenSlot_eq_thirdClauseStart_add_one": { hash: "155a77cd94f583aea6f7932071615ec360680e4d258afaffff06ebc83bff8246", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.machine_acceptState_ne_rejectState": { hash: "7bebac4c742c7d56a6021bd383b32b33e4bd2f3f3d082c1fa340f58721aac7ee", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.malformedAppenderOutput_timeout": { hash: "193170fa9ffa8556d8611a132a3dabd71338107efd85a273cdb45f6d218e2a8f", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.malformedAppenderTally_timeout": { hash: "09ed62823965d59ce2a07d6b579212d663ba930b85e5131fb62bd4907a347085", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.malformedCursorScratch_timeout": { hash: "e5b87fb34a6564e480f1df45c987879ba9db3f13879fc20ef15493dd426e589b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.nextTokenSlot_direct_eq_f": { hash: "c3f905ac4e0b3c8b33037ba867bac27e1ec1fdca19d1fee221e0e5aa0d5a4408", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.prefixEndpoint_before_launch_timeout": { hash: "2c5a665669bdfb7052e5ab9b8b5f2875f567d35c7058390da2ae1e17081e8e21", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.prefixSeparator_launch_workStep": { hash: "97bb27aab4e553fae8df89075fe65e25db1bc92b4e0ab14e7fa2a1064df975bb", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.prefix_workRunExact": { hash: "7bb2cfe206f16a72dd85123954c1544483ce15ecc1cd92513e5d19ab978c21f5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.rawTimeBound_eval": { hash: "26455a47a169f2ab21aa86619bb14c22d852a5474416617186aada9c0a45fcbb", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.rawTimeBound_le": { hash: "abd8c20e8f57369d14d0e71004279aa81aa926f9c9f962f7517c1404625b90df", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.rule_source_ne_acceptState": { hash: "75ee6db8b58b2b3cdc04b16788fb3e5f90ac5267d4b05624105a84c5dd419d9a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.rules_length": { hash: "7e4e36172ba08839d194b54ea20ce54465d7cbbd635fbc498d669711ffa97ee0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.rules_pairwise_query_distinct": { hash: "28b241ffa6d977b311bc06bfc08b9787981c44edcf1cc3287a12c9fd7a50d3c2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.run_compile_exact": { hash: "a0033107c250aaf5a4045c8c1e60fba5d7ea68ae2bbb82b874acfcc2fd727522", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.run_compile_rawTimeBound": { hash: "8fe71472f2f3c2b62ef6ab20b8ec8d4f30dad5920a4fce317a75571c3297861e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.run_compile_rawTimeBound_blankEquivalent": { hash: "eac7d9f6b0b7830afb9c000953178df7320543cb2fd6a71e63aba9de0e4b1ea1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.separatorCursor_launch_workStep": { hash: "5ff049408cdd8157f510c783b29f2ef069dd601f4cde7d24adaead11e87b7509", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_next_step": { hash: "8f82c5f8e62614a846684b61369953d13a76bea29ef47f8ac6ad26f31c70b813", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_separator_step": { hash: "d001a6bafa4d99be9dcfd03776bc3bf7d8acf281d1f0a00a630b1c1cb57ffe7c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.suffix_workRunExact": { hash: "2c4e77121ab22418fb90f0dcb48f0d4b11bc0edda7a0602a5674c096f3a2d284", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.thirdClauseStartTokens_eq_canonical_formula_prefix": { hash: "d3a1d340250aba265a75676baf27e41a7d66d3f4a75e49553eb6083c994c9f66", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.workBoundedDecide_accept": { hash: "a9792042832f1ca6bb8c66f2b35d21c866858cdad9aa5e306a51e39d204f15c7", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.workRunExact": { hash: "af4a88cbefc4d741864dfa237e619ba257f585842dba8c8ae7c52fdf9c704ff1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.work_one_step_short_timeout": { hash: "545fdd856efa6b261596bf853d98eb82a38a618b75ec70e7751d6b5a2ba2449f", axioms: ["Quot.sound","propext"] },
};

const BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.machine_acceptState_ne_rejectState": { hash: "100d797c35b0c6669b7073cdb854d4081c9d53d8688205e876159170ec7db7ec", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rule_source_ne_acceptState": { hash: "bf196201e146f446a56416af0eb05e5a515f1ac5832d224c313b343ca814ba15", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rules_length": { hash: "9a8f723b4a8b1cac430edc51c0820def765e54ced9d39e1f44d4ce3c067ddf43", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rules_pairwise_query_distinct": { hash: "24a4a64c8cbb3a4bc76886e3ba8db047c1e5bcb5ef87e7c05029d09e09da3360", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.machine_acceptState_ne_rejectState": { hash: "2dc79ae4c9843605442a27c12d6767cab9e0e4fee9b5ea179177128ecc77ce8a", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rule_source_ne_acceptState": { hash: "e4d2f92edde5f7d135e1449a07249349da4b9bc16b173dfa5e5b66fd1d19ea2f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rules_length": { hash: "a502886839be2e262df7418abf74efbc75148b689509d23f2037351a65fd5e5f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rules_pairwise_query_distinct": { hash: "f4d2b3a0f1821d864b4a7878facc2f6cbe74af602aeb84ad82d289f76f4e78ed", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.boundedDecide_compile_accept": { hash: "1083fb50b85c2eb4bd8965ebe4fd5cd1add5bb3b9eb5f50f5bae5debe7a80176", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.boundedDecide_compile_ne_timeout": { hash: "b8998789592f31eaa71114aade359a23a3eeb997be108ea73db652f3d5874e49", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalConfiguration_state": { hash: "30d417308d16b7ba743c3269bf7e00e39113a17f28f8c96e0ec9fbc2e1c8abe8", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalOutside_contains_finalTokenSlot": { hash: "b0256a9f5c6455673f712da415cab56221a35f55e0ef333ae551e6396e9b957c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTape_represents": { hash: "4ed7727092630a39d8da50060c84338c9f17d959f5817d770401b22d035cb311", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseFirstLiteral": { hash: "aa32c1b77b98f4c6ea952104a0a950e086b6a375e3684b4557998c05ee93d252", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_three": { hash: "53ee38e1ef7e949de3082d1cb7de3b244a6506c0729eee081c23ccb2cebc284f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstAppenderEndpoint_before_cursor_launch_timeout": { hash: "f619484b4292b970d8968135d186cc293bf6a8eb5a37c55ebd8cf9a4ed57d682", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstAppender_workRunExact": { hash: "0aba1695fd933a81f877d1feb2b47dce1476ab4378e33d3d838a807ab8e2dcc2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstCursorEndpoint_before_secondAppender_launch_timeout": { hash: "f3e724f24ea96a79af09d52c2501f4a1bf5f2c55a949269a1ba9f0a8388a4e70", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstCursor_workRunExact": { hash: "5b999df397c26f41bc19c40ccf72a8106ec31a2b853777d77e0c3a39e53c4762", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstFalseTokenCursor_launch_workStep": { hash: "d80f3fe3881cbe1d90d483256e1728cd7a94c192ff3e9848be57ab93a344e4bb", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstFalseTokenCursor_workRunExact": { hash: "5bb0d558c83e6c3dfcf4b035d6b791daff3a9285c22f73683277d30bf52ffcd1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f": { hash: "f3ade16c48fd3450c83bb34e4ee944560d30deab8885fb1a668d554092bdf96e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralSuffix_launch_workStep": { hash: "07f2f9e32cd6032a2762815bce9602a64a56b8c53f6d1fcff3f0de9fa8f6ac4d", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f": { hash: "adb17a823fefb7625c561a6f785d8e454e824703123f2efa31a79b6e01431d56", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.machine_acceptState_ne_rejectState": { hash: "36f2cb38c9eff77b43f0ba637bef01266bdee93851617073ae5aafd856095795", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedFirstAppenderOutput_timeout": { hash: "5210d7e07b447d604ce6dad734984c91a7a5e244d8c5db8d3c6376d5acf7e336", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedFirstAppenderTally_timeout": { hash: "5314abe6e09c3157b5e5ed525de3911a8d64aa79b8ef4345e32fbc53a43970c7", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedFirstCursorScratch_timeout": { hash: "956b2aadd56af4bf1cf7d4aed00f765d81aa5955ff00ca2e49bb5408e49b373c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedSecondAppenderOutput_timeout": { hash: "aaa5e36357e90581bc5587ed5cee51a84f6ab1320774851f997888e8e3fe43ea", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedSecondAppenderTally_timeout": { hash: "3c9e2918fcf975b25a253dfabf250974eb0bbc1ae34271248b1465141ddc8a44", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedSecondCursorScratch_timeout": { hash: "e7fdb4759b8a0b286da96dd7bde6495427abc3512d0892eb2a70f4c8dc696092", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f": { hash: "8f7b6f1644b01d67d8d825cde4fb1096eb4f1c1c1f6b09ce7936b67c83f32ea5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.prefixEndpoint_before_launch_timeout": { hash: "6ba174820755f7cf7bc5d88980ecc36776b4dc8bf9abd63b99af676c23a9318e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.prefixFirstLiteral_launch_workStep": { hash: "45555fd22b4d093d59e5a3ee4bcf83c82cf72fef1bf234067b509232d41c57e7", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.prefix_workRunExact": { hash: "9a04a17fe4271fc78e5ceacb2b85fad1988eb42f2f01e17ff132ce0a66c39732", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.rawTimeBound_eval": { hash: "391d0fbf52e06d81d81d8477daafe756384f4c427bd09a001af53928d554e86b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.rawTimeBound_le": { hash: "b1a90e2d1b4e215684406e9e158595bbc9eb753606518fb1821d22a0097fa8aa", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.rule_source_ne_acceptState": { hash: "3ecddcfe51834fe3b09dd23158040bcf1921fa83d5c0712e3438e832f5d0f158", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.rules_length": { hash: "b110cff2fd9b5d39c9e7453fd91410f308c83504e3e5bde451026366255cbddc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.rules_pairwise_query_distinct": { hash: "0e76455eef96aa9257fe87eeccf85cf422d8a36b5444ae6c1c6ab5ae657a592d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.run_compile_exact": { hash: "b917638bdb6d294678a6c8e6ae18d389d979cffc5d239a52195c042cb80a61a2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.run_compile_rawTimeBound": { hash: "deffe2b95b1483b37a01c0ac3fa322f50fabfaa2b064aa9e2cedf23a9d72df81", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.run_compile_rawTimeBound_blankEquivalent": { hash: "b4b6ffd4b17f6e85c280b0d674f3e4eb905ff07780f18ea57f4c8864813297cc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.secondAppenderEndpoint_before_cursor_launch_timeout": { hash: "9dd64d8a94d0fa736cf1860048c08ddea3c20139867af1ed14cf56a1614ae572", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.secondAppender_workRunExact": { hash: "bde3f77d49a9a3f27c5b9a7528f9cfe07bcf30101db006cbd09da3fe595111ac", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.secondCursor_workRunExact": { hash: "3ee0b6bd708584eb532a44b3a7209ca09bcbf0ec256270dd146fb343fffd94b2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.secondFalseTokenCursor_launch_workStep": { hash: "25b69232c775d7a5fbffd6225345e1f7293a11bdd57be95bb3bee6b8dc953a99", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.secondFalseTokenCursor_workRunExact": { hash: "8567823d416bf7144828400a4b45541f3e53aa9049d0d4357b19b13e12ecc805", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_sign_step": { hash: "193ecb39fec5e294efee2dbe0d24197fc94d965ba3012ebd35694edd013e2d42", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step": { hash: "789608fc7adc92e986511b827b35d119cbb4258920d3835bf3d440ee1d740194", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_next_step": { hash: "760a1f1cbd557cc4875198de16364e8cfed512a2ae87eb1bf722d208cbce7a48", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.suffix_workRunExact": { hash: "1c4fd727ca2ce5252b961eb660a50fcce613d641da14f4c069e87c5b83ac8712", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.thirdClauseFirstLiteralTokens_eq_canonical_formula_prefix": { hash: "7021e06ba4475f4cf8bb6427d6ecd80eb4b9a48c4d6c1e941ced1a838b0ccee7", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.workBoundedDecide_accept": { hash: "19e9f2d65fba85ceed2a94f62d9c4ee1bfb8b02966ae31eb64b545d8047f7562", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.workRunExact": { hash: "b325a2050c25cd0c62f451fcdcede3a53c55c36d6d878d21d2aecdec6fb9b391", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.work_one_step_short_timeout": { hash: "5df5289a7db4588834094a4cacd58c119ada4223e0520f96adf7859558da9e8c", axioms: ["Quot.sound","propext"] },
};
const BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.workRunExact",
  SignSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_sign_step",
  TerminatorSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step",
  NextSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_next_step",
  CanonicalPrefixTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.thirdClauseFirstLiteralTokens_eq_canonical_formula_prefix",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseFirstLiteral",
  AdvancedCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_three",
  SignTokenTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f",
  TerminatorTokenTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f",
  NextTokenTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.rules_pairwise_query_distinct",
  SuffixRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rules_length",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.boundedDecide_compile_ne_timeout",
  MalformedFirstAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedFirstAppenderTally_timeout",
  MalformedFirstAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedFirstAppenderOutput_timeout",
  MalformedFirstCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedFirstCursorScratch_timeout",
  MalformedSecondAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedSecondAppenderTally_timeout",
  MalformedSecondAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedSecondAppenderOutput_timeout",
  MalformedSecondCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedSecondCursorScratch_timeout",
  PrefixEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.prefixEndpoint_before_launch_timeout",
  FirstAppenderEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstAppenderEndpoint_before_cursor_launch_timeout",
  FirstCursorEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstCursorEndpoint_before_secondAppender_launch_timeout",
  SecondAppenderEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.secondAppenderEndpoint_before_cursor_launch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.work_one_step_short_timeout",
  PredecessorDeadStepTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep",
  PredecessorMalformedDispatchTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead",
};

const BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.machine_acceptState_ne_rejectState": { hash: "8fff0deaec53f5a65511d71280710ba0f173a9c29105f4a44816c944a6d902e2", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rule_source_ne_acceptState": { hash: "a2332cf53cd21df06d4623cce0fff20390c085c2d75087b37f09d3fecac13bcc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length": { hash: "daeee97bef14e7b9da38db32598477761de45a502f977767a6af5282d3fb6287", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_pairwise_query_distinct": { hash: "69d90ce121a4865a8bddfbe3d87a050fdb3eec4a25b6f07917d7e50df477fb49", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.machine_acceptState_ne_rejectState": { hash: "d7f010a04896557a4724b08d9864a75a82c47c858a263c47f18a4e815583374d", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rule_source_ne_acceptState": { hash: "a73b7d581b349f55dddec4249c95ae42031f21236a4e2cccaa6f7ca5cef9152f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rules_length": { hash: "c4f22e145dc3e95fb4096192bdd1dc7996326238abd8b9f0ed8790ed49ed5e1b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rules_pairwise_query_distinct": { hash: "39bfa3fdd5d6bb5b6b6af287cf75d2ac55a4e73d36b5047f7e9e9768081b8be0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState": { hash: "e9a10b67ec25633a1e1b3794d6917995cf450156443a8c713c8e86ad31de381d", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState": { hash: "1be14ab7c2ac8af326935ccd5ed8b126bddbef4e2bc59d59ee5ab1b6a7da4a55", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rules_length": { hash: "be09322866d115726f8c55e69b9c83cb7463b210c30f8c7ff1f1d729ca3dc3a0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct": { hash: "05657bf834bc60b9b1ca0d0a3b1ea109d18c305a4e1bee00c54a14527d770d37", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.machine_acceptState_ne_rejectState": { hash: "8d4211045dc0806f3976c3f55a559cf32a69fb4100338643eab97ce84de94167", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rule_source_ne_acceptState": { hash: "8e9108e5f6471b363bf10f3c602a53440ec7368bc67b82786240f558943188e3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rules_length": { hash: "7f4bf14a2359d0ee35e4f57922e3ba9096e3c5d7e50178f51ea916c6bcee995d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rules_pairwise_query_distinct": { hash: "9e26e1191f0082df0ec51f05dab169ca9a5297562a00a7345f01bed0cae54abd", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.boundedDecide_compile_accept": { hash: "98cab88c694e3d67a54974ca12e783822a9c82cb4e6ffec502b4e6e8c9721d98", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.boundedDecide_compile_ne_timeout": { hash: "32b363e59ffe504c4b239fa27a2a7baf119c76aaa287c39e9c6c92855e286977", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalConfiguration_state": { hash: "f63821646093b13e95f975f432e328825808da0c75e099b73499bfb4b882506e", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalOutside_contains_finalTokenSlot": { hash: "871fcded01679f5f2ea7ab67bc6015958c779b2b8b34f817beea39c4e52446cb", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTape_represents": { hash: "2be57105e84ab1777da459e501e59a99724595473919e27798ea46d6a196734e", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseSecondLiteral": { hash: "228f9e00d3ca355305dd3c0d7e30c08120222c279b70b61d870c88cbe546448e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_seven": { hash: "c2ac1b4ae33609ac396136043ff69fe15eda248ef83e1bd049a1de251d299c2d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.firstAppender_workRunExact": { hash: "3cafa5e042c6b253c331cfc0b92f5bfbfe92aa6dc53c3252fa6b6fd3ae968e21", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.firstCursor_workRunExact": { hash: "81cdec8ed4e0ccb8060b6258b4eeed2fffe71ca8b9dd4761f06374fe55f1e1cf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.firstUnaryAppenderEndpoint_before_cursor_launch_timeout": { hash: "31253e727c71d46f548b767620e52c1f89ef972f26b67af16dc23cba1777b905", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.firstUnaryCursorEndpoint_before_secondUnary_launch_timeout": { hash: "a60db3959fb4c24cf161b4b346f39a1bb5cce337ea3a9db525d5802a38aae203", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.fourthAppender_workRunExact": { hash: "f850bd819f9bae736bb34e4183d5dabc3345fff448f19d4ddc2e13b175adff8a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.fourthCursor_workRunExact": { hash: "47262030909efa4a8d872fc4d8be8490ff017ceced1cb08116bb41b79f1a6ae6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.machine_acceptState_ne_rejectState": { hash: "ba7bd4c50a06bc08db2f7cf59f04e06457bd19c7fcc34fab03dee678024f6976", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedFirstUnaryAppenderOutput_timeout": { hash: "24e3f538525bc1c2db7377225576357ce80254b9cf4c94cb930fd656dc13ff26", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedFirstUnaryAppenderTally_timeout": { hash: "fe107d24791b7d7775eac3a5a38b95ac8d4cf608a6c67be527e946ce4573f376", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedFirstUnaryCursorScratch_timeout": { hash: "0af7263c6933a1f99f44aeb6de19e34a044aecb3cc36cc1759c9b2ce310377d9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSecondUnaryAppenderOutput_timeout": { hash: "b1ceaca968c62c604d2fe9daf0c76f7077eaf37d01f5058e2fa31c50f04a0a31", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSecondUnaryAppenderTally_timeout": { hash: "7ad759a42d1f31d5800c51725820a565a643af4fb8e0a5c27c4e64ad577e4148", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSecondUnaryCursorScratch_timeout": { hash: "1c031f5f2eaa3fc0434ac489233fc8cfdf16bb3a9dc9a68412ca647cf4e9244d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSignAppenderOutput_timeout": { hash: "32b817e1dd70035648eb001dbd63b83159a8eb5b0a190849fd59b12ff3a7d1ab", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSignAppenderTally_timeout": { hash: "92ba20a89087245d368439b7747ec5b5570839f208a5ecf52e56f39212c18eb6", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSignCursorScratch_timeout": { hash: "5d6134ce9aa4aa6738dd64c002ab49f2facf695a206b7df7e84781eb8486cfe1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedTerminatorAppenderOutput_timeout": { hash: "db9c71424ec7111e779ad4e9c57ea8df2f153a367b7456f6b4324383bcc10817", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedTerminatorAppenderTally_timeout": { hash: "e5e970e2ccc830fe1ad2f8124fa378c67a13a7a98f869a75f1cc3d21f03382b3", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedTerminatorCursorScratch_timeout": { hash: "0ae4f9a927eda19ebeb5275f2dde6d429c2a528c9bca66ca64b073ffa3272d8c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish": { hash: "c8267e3e8e6f3fa8764ae05f8314567fd82724023a295d9e5b31ae689b26190f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.prefixEndpoint_before_launch_timeout": { hash: "9f29ac10d8a195eb0fcdbe0c9d687cdc8cfa80a1abbee3493a7b7ff687bd61ca", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.prefixSecondLiteral_launch_workStep": { hash: "ed445de5c100cfda2463d27815fd2574d7b3ea20aaaf84aaea02019f54d9e7b0", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.prefix_workRunExact": { hash: "b8a8e871a84accff431273d00e0d1f3f06e0517e2e98fd426cdbe9581a578afc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.rawTimeBound_eval": { hash: "ee8f7e20efb4e8b593187e1b5bd851f38a98da205c47d14a6f80d27089088359", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.rawTimeBound_le": { hash: "1ba2c2ddad6178b8177f9a96f2ffcb57e40e04f0d65816aa60f49994e90eed25", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.rule_source_ne_acceptState": { hash: "bdd47bc5c304db63299752fd748c49409763e2c26ccff548293e3f92bcae0ff2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.rules_length": { hash: "9a1593af4affb682f7aef7b228e5e9fd63ccea2be0940705f3fd4e59f02e5236", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.rules_pairwise_query_distinct": { hash: "62f816580991323eed604ac6a280b136814791162b80fc68f4ee8bd68d90176e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.run_compile_exact": { hash: "a83ac2db757b685e3f57c169058fb2e70f466fd3e5b47c92fcfe3cfa64ae4a0e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.run_compile_rawTimeBound": { hash: "b85a60d50e9a59b835da5139248cf468aa1ffdd390f3e025eae8ab1705365186", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.run_compile_rawTimeBound_blankEquivalent": { hash: "2f8f0c14ee8408584bed7b0f3fb6c048c989fdc5a9c3cb940b624abcb3cc2591", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondAppender_workRunExact": { hash: "595f1f5e9afbb39d6d2c523a34db12deb33aca58f8054599c9418910f214e45d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondCursor_workRunExact": { hash: "88477ee975ff9af7dfde2803d054c249c66858db8c84ce7e2b3b0c1dc2b071ed", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralFirstUnaryUnitSlot_direct_eq_t": { hash: "aa33d80705bcc438db138ab74ac13d95daa85eb1690c05642670be1849265952", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSecondUnaryUnitSlot_direct_eq_t": { hash: "17224affe49ff7066d877f52a6945d2215cd1831b6088671026380f13a0bc3c2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f": { hash: "cccea21dbea3e84940f57eef6cc9a54c3a7cf330a908db483b9a3eedba31096f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSuffix_launch_workStep": { hash: "f36f5554de117969875f511c0aef636345b3073b8e1308081db887a1675742fe", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f": { hash: "30bc72d2c5ca33e10781379212ab3b68978296cffd87d63db9dfd862c00d0719", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondUnaryAppenderCursor_launch_workStep": { hash: "4a45a9a4779a87ff158872a2b22d083177027021f2c43c0f52b1d6ae10d806cf", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondUnaryAppenderEndpoint_before_cursor_launch_timeout": { hash: "786b8d4bbc9fded145c0e8f6def3632cf573d3f1fb99b6216e9318aa1863a027", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondUnaryCursorEndpoint_before_terminator_launch_timeout": { hash: "422a1ab70f9a047a7f01c204ad46e72e7aeecada3db2b5c1ad247282a6d1bc14", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondUnaryTokenCursor_workRunExact": { hash: "b10ab82adb36216f36532a8b17c05e70b840cad5fd6a355b49f542b41c51f2ec", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.signAppenderCursor_launch_workStep": { hash: "d3f7335eba9608f13da71ea82a23b40cc612e09976071eb486fcd2b1430db55b", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.signAppenderEndpoint_before_cursor_launch_timeout": { hash: "c9399dd634bc3019ee859194f1fa11f09f1b2fc481a3755d6dae22d150c7e6fc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.signCursorEndpoint_before_firstUnary_launch_timeout": { hash: "d5551b3f237b01fb83f0c6dec873c8eac4c1641084b03db5a48dc7bb283920c3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.signTokenCursor_workRunExact": { hash: "569585946dc68fcc34e844724304fa8d3cb6fa95a706d595daf9265e6323125d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_next_step": { hash: "b30e7534b7c6f7a24c6c597f4209fdc2938be9c2c8c0e8e62714f87c9aa14123", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step": { hash: "85066cefeec0fee2dc1b8af10803d3a923924a1b038b4b081a747266bd536c20", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_sign_step": { hash: "8a9ba9a935acba0b42636b1184fc264dc3b09f2bafa96a0f689a37a0d48fcd25", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step": { hash: "8c63935fffe7e6e4dc4854f9141071efece97078c9dc825f2c1bad6db2864dfc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step": { hash: "e072dd5d10aff4c9cec7d2caf16f28449da2724dcd7c39d5c6332f98331bb437", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.suffix_workRunExact": { hash: "08f8ac9452d01ef6e7cfd21d6c147e7333153a6ad1cdef4ea9bf8fd19d145bbb", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.terminatorAppenderCursor_launch_workStep": { hash: "0cac1213636ce6e3923884298aee4b452aa01a64765d1501468f1a0c73273f71", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.terminatorAppenderEndpoint_before_cursor_launch_timeout": { hash: "249c0c06ed4a9f2f1b4680dbb43caea5794e69dcf41ee17e82182f23176adb80", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.terminatorTokenCursor_workRunExact": { hash: "e372fdcb9f8dc001ad3aa5a76ce36b8f6e4053cf4367812fb80786a216b0d8e1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.thirdAppender_workRunExact": { hash: "14003ef359e8b762ea11e68ee7c4e1d18cbcfe307c52347e1ab06561a9c3ebba", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.thirdClauseSecondLiteralTokens_eq_canonical_formula_prefix": { hash: "22a28179327aef145697ff44091c3cf8de3075b32ab8ac247c8751c3215b6ab1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.thirdCursor_workRunExact": { hash: "b855449979a186de0e1a5a586da7686147b5fa23ad6a9d88ac2fac98d9b4955f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.trueFalseSuffix_launch_workStep": { hash: "335570d1018ccf331f569bf5959acc65f149394cea71da4fd033b7c3769720ab", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.trueFalseSuffix_workRunExact": { hash: "8d2b81c68b60dfcfc85b9a75708d29708b9a004189e2f6516ca035ad824e9556", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.trueTrueFalseSuffix_launch_workStep": { hash: "34030be15086b691fbc43c1276e6b11417958dc8bac78d14f1c13b43cc0fec11", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.trueTrueFalseSuffix_workRunExact": { hash: "1a539f923f2b827ab38bffcc46514cd089ac44f3ecbf415cc6082b40d16d4a50", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.unaryAppenderCursor_launch_workStep": { hash: "a018a073150aabddc23cad44ca879a4474722816c28f98d44ca130f56129bf80", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.unaryTokenCursor_workRunExact": { hash: "46c8403a72c9a3545fa51cf257df415c9b1156124447726ea9c860d5c0ecc610", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.workBoundedDecide_accept": { hash: "9901e31de205242b357c3c744b19a8a3041c0c67093d21c426d3a670b0b438b0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.workRunExact": { hash: "e76c8efd848f186c9542b3ce97ea44c131cb52260d22c54ed2cd8253ae3cf134", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.work_one_step_short_timeout": { hash: "eee9961fb0c51273c236b5dad937489993bf3db729f00571db6aaef13ac1a1fc", axioms: ["Quot.sound","propext"] },
};
const BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.workRunExact",
  SignSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_sign_step",
  FirstUnarySpecificationTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step",
  SecondUnarySpecificationTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step",
  TerminatorSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step",
  NextSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_next_step",
  CanonicalPrefixTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.thirdClauseSecondLiteralTokens_eq_canonical_formula_prefix",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseSecondLiteral",
  AdvancedCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_seven",
  SignTokenTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f",
  FirstUnaryTokenTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralFirstUnaryUnitSlot_direct_eq_t",
  SecondUnaryTokenTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSecondUnaryUnitSlot_direct_eq_t",
  TerminatorTokenTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f",
  NextTokenTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.rules_pairwise_query_distinct",
  TrueTokenCursorRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rules_length",
  TrueFalseSuffixRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rules_length",
  TrueTrueFalseSuffixRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rules_length",
  SecondLiteralSuffixRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.boundedDecide_compile_ne_timeout",
  PrefixEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.prefixEndpoint_before_launch_timeout",
  SignAppenderEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.signAppenderEndpoint_before_cursor_launch_timeout",
  SignCursorEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.signCursorEndpoint_before_firstUnary_launch_timeout",
  FirstUnaryAppenderEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.firstUnaryAppenderEndpoint_before_cursor_launch_timeout",
  FirstUnaryCursorEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.firstUnaryCursorEndpoint_before_secondUnary_launch_timeout",
  SecondUnaryAppenderEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondUnaryAppenderEndpoint_before_cursor_launch_timeout",
  SecondUnaryCursorEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondUnaryCursorEndpoint_before_terminator_launch_timeout",
  TerminatorAppenderEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.terminatorAppenderEndpoint_before_cursor_launch_timeout",
  MalformedSignAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSignAppenderTally_timeout",
  MalformedSignAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSignAppenderOutput_timeout",
  MalformedSignCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSignCursorScratch_timeout",
  MalformedFirstUnaryAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedFirstUnaryAppenderTally_timeout",
  MalformedFirstUnaryAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedFirstUnaryAppenderOutput_timeout",
  MalformedFirstUnaryCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedFirstUnaryCursorScratch_timeout",
  MalformedSecondUnaryAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSecondUnaryAppenderTally_timeout",
  MalformedSecondUnaryAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSecondUnaryAppenderOutput_timeout",
  MalformedSecondUnaryCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSecondUnaryCursorScratch_timeout",
  MalformedTerminatorAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedTerminatorAppenderTally_timeout",
  MalformedTerminatorAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedTerminatorAppenderOutput_timeout",
  MalformedTerminatorCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedTerminatorCursorScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.work_one_step_short_timeout",
  PredecessorDeadStepTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep",
  PredecessorMalformedDispatchTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead",
};

const BUILDER_THIRD_CLAUSE_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.machine_acceptState_ne_rejectState": { hash: "085381a296da46be4e957d68e063026810db4855c2fe2f74a8ad13705a2c6a43", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.rule_source_ne_acceptState": { hash: "c9bca6b81c8c7ef40929c045d8e7527cc5f673f645dd087785f5e677148af184", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.rules_length": { hash: "13f07acc2df0542753393765f038d0a567a15fbc61e31fbd22b7407d59eb589d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.rules_pairwise_query_distinct": { hash: "14a7b49176c64cbc29d038c4cbd6f5bcade9a660e4bb2b2d308182fb3ae369c8", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.appenderEndpoint_before_cursor_launch_timeout": { hash: "5333ea3774ad1d00eaedcd2bbcd295b6c372ccccf906fa78ad196c2efd45b37c", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.appender_workRunExact": { hash: "86b7e16c9bb3ff5782deb385e0b2654a82a46b87348600d8417dfe5406da80f3", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.boundedDecide_compile_accept": { hash: "4879b56d09425763782427481cc0698af9a90ba59c54e1dd8ce461d6163334f5", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.boundedDecide_compile_ne_timeout": { hash: "fb51a3a95ccaecdba08da7ee2415f4df8cfbeaf567ae68a8f6650703da7b731b", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.clauseTerminatorSlot_direct_eq_finish": { hash: "469513eb11e5474d00e27321b86942e61dae005fefffe81c5ecd11a198cd9055", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.cursor_workRunExact": { hash: "4a3d019f45b85fb97bb24b640c943524087cfd95259083d83f82d1c53bfeefe7", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalConfiguration_state": { hash: "47f8564a92976c270f5905b67532dc6c62dd8ac1b40100e39c9602d55294c46f", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalOutside_contains_finalTokenSlot": { hash: "edbe14a3caced903a3b1ff04834d355dc8a964a4181314ad491e815166c4a1d7", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTape_represents": { hash: "19a1d224dc1815de31a20e318031cfc4dcb36fbafb5f998cb7f048ce5007d265", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenBits_eq_encodedFormula_thirdClause": { hash: "a8711d3a0e1d183e8a18b0d4490c753d64b07747639d50d4e96814d11133c47b", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenSlot_eq_thirdClauseStart_add_eight": { hash: "5751378f4a8db7806c76121fa9db3ba23bf0051d7fa58a108becc64467e2f3db", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finishTokenCursor_launch_workStep": { hash: "c27bdc9f389fc095349896236e5ff5f1086891be758029cfe8411c103e952088", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.machine_acceptState_ne_rejectState": { hash: "39df940577968fde13b2b47b606747ed2b196f08b77a2f8adbd5c06dc99a7c30", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.malformedAppenderOutput_timeout": { hash: "85b5cfbc421c0baf4def6cb648d7a3e77dc7e62166dda88c2415cb43328d7ae2", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.malformedAppenderTally_timeout": { hash: "e46a74465a167cb4ecb34580720b0b83c3e7a0d4591c0cf8f323c72b3d47d2ef", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.malformedCursorScratch_timeout": { hash: "f3c43228d9fc2b650d435352117d3434df5adfacabd6d2c26183485a20009557", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.nextTokenSlot_direct_eq_padding": { hash: "cf94e231582120a0b1e638929359b7b343b32c77be2562cb3a5afd68e9681fce", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.prefixEndpoint_before_launch_timeout": { hash: "bf0c0daa8d899381ffd4ec937ec540e521dc17935d5b3e36f4d3ccccd40f528a", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.prefixFinish_launch_workStep": { hash: "f1a2da449333f7a3e872abb128448c047b2cd0f14b89bdcaaca306cfc747380d", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.prefix_workRunExact": { hash: "e9b6513e6a432072be40e4a6e0855e82e5a16ace99ae19d33307be0ecc37ca6d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.rawTimeBound_eval": { hash: "0fb6da98fab563b511af87602a7dc92ec646a2498619b92e53fb9e73c473fd02", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.rawTimeBound_le": { hash: "0c6e16ad24372dd734027089e09167ac3e9f8b52d10a12e91cbd4ca4956d21b1", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.rule_source_ne_acceptState": { hash: "9bad8e5e20457c730807972c3ef54356d066493d294318afbda32e18111d17dc", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.rules_length": { hash: "5ccd5111f0e6490ca7f841abb7e3135a9059639a966d5d9a917301e9734c00af", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.rules_pairwise_query_distinct": { hash: "5d2bda00893162af9c4c265d90beded2927e4cc425c7ff56649697d882bc7dab", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.run_compile_exact": { hash: "386d6372459efb419def9197f97025a83daec0539177c8f6be7c7abfe247703a", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.run_compile_rawTimeBound": { hash: "888185e7abf7d0158c969bc03bc47c81b03e382b1189829d679584727975caeb", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.run_compile_rawTimeBound_blankEquivalent": { hash: "0b6ec6cab92f3035f0da87262007b5ebdedb6cf27bdbe5c8177ad2b4501b0975", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_next_step": { hash: "a7d47c19e2a6423fa06cb6968206f527d8c0838b7bca4a6078fe014c50264867", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_terminator_step": { hash: "cb975c3f55a9a9e42e94e42234e831506ad6dc3307d2fda9716a18755814b8bf", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.suffix_workRunExact": { hash: "c4cf3144bdbecb6c1ca5920afac7c992931b4b251de4e0f09ed89e58b9d15bdb", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.thirdClauseTokens_eq_canonical_formula_prefix": { hash: "adf0ef05eaf503599e482f976d8bee54ecc8158ef042ccbf5cf656457c82c765", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.workBoundedDecide_accept": { hash: "34d15063d2b9f9959a4cf20e51e73dee9bedbb93a99e09dfa66136039322f37f", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.workRunExact": { hash: "29a8862876d69b1c90f8382f325c9a4f81c906eecaf3a2e6ad74f6d07117239f", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.work_one_step_short_timeout": { hash: "2357eca86e6707f27b61bcc0fa33e711ad024622b95263478917f280025126ea", axioms: ["Quot.sound", "propext"] },
};

const BUILDER_THIRD_CLAUSE_PREFIX_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.workRunExact",
  TerminatorSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_terminator_step",
  NextSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_next_step",
  CanonicalPrefixTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.thirdClauseTokens_eq_canonical_formula_prefix",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenBits_eq_encodedFormula_thirdClause",
  AdvancedCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenSlot_eq_thirdClauseStart_add_eight",
  ClauseTerminatorTokenTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.clauseTerminatorSlot_direct_eq_finish",
  NextTokenTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.nextTokenSlot_direct_eq_padding",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.rules_pairwise_query_distinct",
  FinishTokenCursorRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.rules_length",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.boundedDecide_compile_ne_timeout",
  PrefixEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.prefixEndpoint_before_launch_timeout",
  AppenderEndpointTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.appenderEndpoint_before_cursor_launch_timeout",
  MalformedAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.malformedAppenderTally_timeout",
  MalformedAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.malformedAppenderOutput_timeout",
  MalformedCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.malformedCursorScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePrefix.work_one_step_short_timeout",
  PredecessorDeadStepTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep",
  PredecessorMalformedDispatchTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead",
};

const BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopSteps_le": { hash: "972da09f44b6d35d56ce775bd4a46687be45609dacd0670bc983d603715bf278", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact": { hash: "ff60669772a7f137755431c1300c4368e8004a05b1d36972a768b50d1846cf5a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.boundedDecide_compile_accept": { hash: "249619b7b1570265253cdee788574d80a05aaa0242c5c3ba31a31e662d64c923", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.boundedDecide_compile_ne_timeout": { hash: "80a6a5d3c928355ad98edbea3d9675ee42269b2b8defdebef910f83b340c9263", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.countEvaluator_workRunExact": { hash: "5913f826d1190b662b8647a483e06128bcfec9de44cb36b66bdc97c552799252", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.countdownBoundPolynomial_eval": { hash: "c23d59fe9a6f879f4ba99597d155184d132e6c1b5a9df2f93c687a62db4ac4ac", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.countdown_workRunExact": { hash: "4cadccfc1078724596bae46160e344852270eea712f1bb0d245ffbb5a7974aa7", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalConfiguration_state": { hash: "98e8fc89dcc30ed871cdf756fab18f87d7b2e94dc88fe000be7259b2f2973972", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalOutside_contains_finalTokenSlot": { hash: "35a2ea6fa44b064e38abd9b96fb505e29ea50589bb4748f6466d2099da49a669", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTape_represents": { hash: "0a4457eab8230b8583001e4151c9459d60f50971dc1cd0cfbdd9711c36fe0441", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenBits_eq_encodedFormula_thirdClause": { hash: "2988eef4e435028d78489115eeb7c28a88334f000563c64dbe0110888c347858", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenSlot_eq_fourthClauseStart": { hash: "d603123516ad69a4531919b3f3b22341858323a63cdad7aa1a45517370804b59", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.fourthClauseStart_direct_eq_sep": { hash: "8bf000c7e607b87ad395dbff9d833fd4158127c97aec8b37f56d0aebe6a6071c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.fourthClauseStart_eq": { hash: "f43ac8e50e0d1ddd14f8de0d28f1a6d3fe5386b584cc75927332c727c56db4e0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.launch_workStep": { hash: "86b12940f025d5f9de17cfb0d8d3b81fbbbc99e26fd15a3a06a500cec7fbd5ef", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.machine_acceptState_ne_rejectState": { hash: "4c79f1781807f48a0a56e974f1ed6c649c26989dc219d5fb958465d65bc1b47f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.malformedCountdownRoot_timeout": { hash: "04c6dcb17614f29dfc1eebe3fd8c0fce0174653c2028bab46eba5d4bdd4c807f", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.malformedCountdownScratch_timeout": { hash: "4fdb556d8158bf65a3d0e7a536475b005adc09037a58a3048d2cc24bfb97e8e4", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.paddingSlot_direct_eq_padding": { hash: "e9277e87bf95bccc32d8dab0aff308e082e481397687d863a7f09c057838e134", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.predecessorSlot_add_remainingPaddingCount": { hash: "7d7af0212477c437f6a59989757321fde88a915dc48fac55e051a439d719d0d8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.prefixEndpoint_before_launch_timeout": { hash: "0991a439e29ee54ccb1b4d44bec5b170616c0d9034d9c7c76504173ac4e40674", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.prefix_workRunExact": { hash: "f2661ddadce96b42143d386748160fb213c56f790a74ea71456e948ea0e76529", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.rawTimeBound_eval": { hash: "b5a20219d4686f94f3eca8614a2c7ccf168339aeed4ed15c8ef2d5c74004b4ca", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.rawTimeBound_le": { hash: "4c2507af0df6c20bc18d90027d2cea598d3a094e1fcf0e34f87a7dce87b02c79", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.remainingPaddingCount_eq": { hash: "fe3b47bfbbad07a39d205644b4f84cf5c0519a577e5b82219d621192a12e6860", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_eight": { hash: "ce7bd592722a6ea242af9102abe295af9499f27678ceee935ab411c40d231229", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.remainingPaddingCount_positive": { hash: "d898e69b239ffdbdae05fc682c90965f126a1f1b41774c95da03af2db8e8337a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.rule_source_ne_acceptState": { hash: "00a7adbb12a9d382b1dfbdfe383965d302b11bf327059076591a44104b835ce0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.rules_length": { hash: "4e78d1ad72a2b134a42d76a22e124e493866f4d5cca9158bc85628067d01282a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.rules_pairwise_query_distinct": { hash: "e7ef104c5e23f906cf29ac34e59f0b348caee4a11343fb676a9091b85b392bf2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.run_compile_exact": { hash: "49d7e0cd137a9ca58691fe3d6cd60d8750def0da941a1e1e83239cff76053b85", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.run_compile_rawTimeBound": { hash: "5ed7455a66395afbf20467693127bfdfc2a95127312336ddf64f656256201b6f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.run_compile_rawTimeBound_blankEquivalent": { hash: "2d73b2a250ea33ab11a036b72676ce1375cfc606ca7b9c3a01e581a077e90857", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_padding_run": { hash: "279edcb8496ae6338653d8ec36d4439080d0bf535b988b6e780b532c852b06ee", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_target_step": { hash: "828e185b5bc315c839fe74a79e0436c0e884351d78289443aa2bbf86805b6da9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.targetEvaluator_workRunExact": { hash: "e192253998613fc225dcd6b79b3ca96659981dd35d77d5308134427ac812f967", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.workBoundedDecide_accept": { hash: "8d6703ae70de3e00dc93cc6f265ce97e372a690d9a04fdffb17ee6b9fbca8a73", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.workRunExact": { hash: "87a47c4a0da0c5f643342d9cc23e6332eb5794c6d4fb7e285af1dc4c61ee3ef8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.work_one_step_short_timeout": { hash: "ee53851ecb0eb5818f0eedf5da88dd61a986676940d7211ec4823875a9d2564f", axioms: ["Quot.sound","propext"] },
};

const BUILDER_THIRD_CLAUSE_PADDING_RUN_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.workRunExact",
  PaddingSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_padding_run",
  TargetSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_target_step",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenBits_eq_encodedFormula_thirdClause",
  RemainingCountTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_eight",
  FourthClauseCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenSlot_eq_fourthClauseStart",
  DirectPaddingTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.paddingSlot_direct_eq_padding",
  DirectSeparatorTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.fourthClauseStart_direct_eq_sep",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.rules_pairwise_query_distinct",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.boundedDecide_compile_ne_timeout",
  MalformedRootTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.malformedCountdownRoot_timeout",
  MalformedScratchTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.malformedCountdownScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.work_one_step_short_timeout",
};

const BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.appenderEndpoint_before_cursor_launch_timeout": { hash: "8c7dbe7904d5dd76eeb8f0c2cbad8944517b464a4d272ebf481f380b745f124c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.appender_workRunExact": { hash: "923cfc6f0f3dbe936b6b2627c356671cd8da3c9daa1f723f76e29f52f9dce70f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.boundedDecide_compile_accept": { hash: "e1f882712954b2f12aaa8e34ca68cced069de79e2134d257e7ac4c8a559b2d02", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.boundedDecide_compile_ne_timeout": { hash: "57473b49eb78fe9b74c8f8de65b27667d1b274e4c9d6670922cf4d3cf58dcd4e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.cursor_workRunExact": { hash: "3da5d2e52bed12ccdff61d48adf68dc25e6207bb608c0fca7b1db18efffeb4b1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalConfiguration_state": { hash: "e80c112dbbb37b009ac5817f6bb48aa65d28a700303592f46044cccc73d1391e", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalOutside_contains_finalTokenSlot": { hash: "93342453e5501b8930df4e7a85578d4dcb871dc546cd2a34fdfcd4b237070d37", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTape_represents": { hash: "1ddd676aed348637e112bbf689a7cf4bcdaa25f60560e1140ce389565b63cde1", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenBits_eq_encodedFormula_fourthClauseStart": { hash: "4f7f376eaa4d116bbb2bfe1d5829c16e9f3bcde17a2663737eb08c55476ad358", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenSlot_eq_fourthClauseStart_add_one": { hash: "b6d33623e3fbf7e8527d263cdcf4808b9cbcbffe94794c16e214329ed1cf1523", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.fourthClauseStartTokens_eq_canonical_formula_prefix": { hash: "1cd2cc9e619c0981112c685f7bfe6e5dae1b5e247ab764c5c0527d267e2e1ae9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.machine_acceptState_ne_rejectState": { hash: "59d3b5b9d120f5a4ad400ec786b5e91ded76db1a3a42a0acd5c27fecf9551b12", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.malformedAppenderOutput_timeout": { hash: "072fad47fe11e0883118fbd76cdd7d62579b4cf1d5e9c2bf14d9cc51e8172339", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.malformedAppenderTally_timeout": { hash: "f257955721f774cc27968596fcf9086cf99696e3cbad73a4d20288ef2cd64dce", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.malformedCursorScratch_timeout": { hash: "b94dd4da07d392e1b36d9df16069c2d08f8c4e26b2b90e089fbaba278b41528b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.nextTokenSlot_direct_eq_f": { hash: "1548a9fa843d9a27ab5a01f6963e96291a62e6be0cb881b04d5c5099cd8b8927", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.prefixEndpoint_before_launch_timeout": { hash: "1e45e9387fc47880a2b7ac9d265e48708eb86235e1fe38a24e9e387eff88b607", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.prefixSeparator_launch_workStep": { hash: "400645444248ccf6db6ad2164ff200b71ed37bb767efafc9e1c2625cb245a1a6", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.prefix_workRunExact": { hash: "596c409712a58dea94b2c94629d974d765de54406d958c345b67314370750017", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.rawTimeBound_eval": { hash: "6c873cb716d26f84e9a34f040073a9f16499591e4b073cd227958770162ce48b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.rawTimeBound_le": { hash: "ef35a0073f8ebe104a81c2a83698c413aeeddfcb9495092bff920f230c35345c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.rule_source_ne_acceptState": { hash: "434439ee8ada8b595e3f13f383427a507fff515a35206c85b60fb204329af266", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.rules_length": { hash: "597bc6eb8066b3165bf71c79606a648b9fe779a658c0c52bdfdaae4c83f5541b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.rules_pairwise_query_distinct": { hash: "362135763c4ecfa80c05af2b7eec1f6748c6c85594a7a11f14ea14693f1e5574", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.run_compile_exact": { hash: "da621856ebe60fd28b9415879b0184d443c7a0c2b5749c998e9cdc7449984ebe", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.run_compile_rawTimeBound": { hash: "af8f2c669032549e58b87d8b0cc9d836f237785adbbb047e91cba475844850d7", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.run_compile_rawTimeBound_blankEquivalent": { hash: "bc3c2b6d92fdf3427e89842aa722ee568d2d1211c448fe77ca6b397e64157867", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.separatorCursor_launch_workStep": { hash: "6394c0e1101b85531da2621007d29bf8016ca1dbfe5ac67d8c8e8f7665c042a7", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_next_step": { hash: "b362f4ab496d5284b80dc490248dc43bbc91b0ab701616744cb498685f056726", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_separator_step": { hash: "76329e6caff5f9602529486bf8c2c6d44ca8773c620d05e3482005b0c3938211", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.suffix_workRunExact": { hash: "6f35aae20eb89b2ab2879cb55e8a98290a21834345a7a00f0035c7fb10721c1c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.workBoundedDecide_accept": { hash: "d64b4cc454d8a1f4c9ea4de4eac80c684e68e36e2837741227b3eaad81dacaeb", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.workRunExact": { hash: "6b7cdb57771609eb203509b19a2c9af8c1983f720cfeb573428ed7a465f9a606", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.work_one_step_short_timeout": { hash: "24c2aca571f257b69837f58221d1790f0fa8d670fcdda6164df9543c6e460626", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.machine_acceptState_ne_rejectState": { hash: "eee6920f72c0fa3566bb3cc5fec3951b18a9b2aa1b50b5cf34436d0183ab750b", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rule_source_ne_acceptState": { hash: "7374475130eed22d8cc19092f72edf903e2c68e024a2f87b3ab4220e8cce98ef", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length": { hash: "f7a8b37c7c3b3404f9144c91f3ce51689b46abf2e61945b6fb89b3d865f98200", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_pairwise_query_distinct": { hash: "c17b7f7fa8d40cb373b90f541f7700eb91c2bc21b5a0a7f5a02ba842283f879d", axioms: ["Quot.sound","propext"] },
};

const BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.workRunExact",
  SeparatorSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_separator_step",
  NextSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_next_step",
  CanonicalPrefixTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.fourthClauseStartTokens_eq_canonical_formula_prefix",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenBits_eq_encodedFormula_fourthClauseStart",
  AdvancedCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenSlot_eq_fourthClauseStart_add_one",
  NextTokenTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.nextTokenSlot_direct_eq_f",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.rules_pairwise_query_distinct",
  SuffixRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.boundedDecide_compile_ne_timeout",
  MalformedAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.malformedAppenderTally_timeout",
  MalformedAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.malformedAppenderOutput_timeout",
  MalformedCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.malformedCursorScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.work_one_step_short_timeout",
  PredecessorDeadStepTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep",
  PredecessorMalformedDispatchTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead",
};

const BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.boundedDecide_compile_accept": { hash: "f4e01a6670d052c2ee3106f98fb4edd40556111ab4bb37ae0733dd752cd748e5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.boundedDecide_compile_ne_timeout": { hash: "e71aee56802564005a07a4eca3f4e28ffe6e3d9e6acbf01bebdd820d93d50e2e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalConfiguration_state": { hash: "12dda75ea36626553e5d20fe0be4b9aa6abbc3b9ef4e380231048ced79bb5b2c", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalOutside_contains_finalTokenSlot": { hash: "29b00a49f4068ef67b7c3967a8a15d47f159b5e7bbb8350ea1b2acf7ac1b9538", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTape_represents": { hash: "d0b2c5270aafa775a3852d1ebcf289a6deced2ff8352d5282d93cfd0b683cb5b", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseFirstLiteral": { hash: "4d5da58fc1215123e09fae9cb1964563772c46927e4cf5b86fafba9bafd38007", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenSlot_eq_fourthClauseStart_add_four": { hash: "7ee5e5a1e3ae37aea0ced69a887e77f528e8cd10d3dac653450a4d03467db4d4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstAppender_workRunExact": { hash: "a1df980f0dfd804c9fdd6afe47118d7f1d5b4644860974c0015a0c713effecdd", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstCursor_workRunExact": { hash: "62201649633346830882940b0e85b9a51ab9eb5a17f6ab0b38019653aaa54d1a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f": { hash: "efdb7df072877b6e4873cab4660b5cd6cf8498b3cbf61f7ad4d7811cc70d4e9b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralSuffix_launch_workStep": { hash: "607359d3b97d2612728213ab73fd1513fa220ccdd1b052772bb2de221d489f87", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralTerminatorSlot_direct_eq_f": { hash: "9c4b02fd717456eb80862e57a81e5c4b906b8ab8ac9fdac678fe16afcfa9cb1a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralUnaryUnitSlot_direct_eq_t": { hash: "5f98519801b7800d4a180bfe2363c96337506bfe1259aa5cb955547d1f1fbdd4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.fourthClauseFirstLiteralTokens_eq_canonical_formula_prefix": { hash: "7c44bc0dddb659a5ab95577a6035ba94d3c315af19010668ade751f6bdaddee1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.machine_acceptState_ne_rejectState": { hash: "cf372994e251d39c724e79bbcc6ac0c13dea725c72191f4688917df5abedb991", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedSignAppenderOutput_timeout": { hash: "0762ba5e5bfd9e6d1d34a18f796886d55e61f07afe832603d61aa4eb8a440eb5", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedSignAppenderTally_timeout": { hash: "8f67c7ee3aacdb43f496d760257739165fb7f05b8971a033f14a9afb2dfbc809", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedSignCursorScratch_timeout": { hash: "84f8f5350d1f2662e1b1b27d5a4a4195d8020f59e897dbbccb8743a49941c0ae", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedTerminatorAppenderOutput_timeout": { hash: "fa7fa1405f69b3d315a6d8366d2138cbea38c28c828ff6043d680883e4205a22", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedTerminatorAppenderTally_timeout": { hash: "7c0ebeebdb5c11cc8b12da61e647e5056690bc60dd243ae51e6c64c1d918c7b4", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedTerminatorCursorScratch_timeout": { hash: "f5f8228645119cec1436f4b7dfef08dd05e3fc688fac7427be0ba5422bb442dd", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedUnaryAppenderOutput_timeout": { hash: "a57821e05b35ee51a48bf04bb594e46fd19350f2f639af9f3a28b663d77107c3", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedUnaryAppenderTally_timeout": { hash: "58a246ba28e955dacd94ed0409263cd23696ff47bcaccbe29e2faf909d7333cf", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedUnaryCursorScratch_timeout": { hash: "603d35a48bc0bbcd91eafca23d3df4423a1f1ecfc52f8380540dfe192b77d909", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f": { hash: "b8c236f037758f948c559004b484993a320e9b7887029f2b2537b4ed71a12dd8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.prefixEndpoint_before_launch_timeout": { hash: "c14df12273929fa91955cd0de3c6cd53764691e14cb58d6eed285de2b15fdc20", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.prefixFirstLiteral_launch_workStep": { hash: "c9668c9830425a0c8eb7bef9a3cf1c69b17c930252964ec1140b305a91a23b1d", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.prefix_workRunExact": { hash: "3ec5ec291415f81eb151f8f885bcd75137bc510e974f002b2ba6ce260a216d34", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.rawTimeBound_eval": { hash: "20b8c57f1f95e41af517e92ae1a86d69db8a0f4d94ade37efc8891ee5bc4cdcc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.rawTimeBound_le": { hash: "ce5e44986211dd3285ff635d6ac0a9c6d1a628063575ec04cf73186f95694ded", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.rule_source_ne_acceptState": { hash: "8921366d525e5e906edbdb42f66efc7226eccd25d2beee3bcd0b49172e8d777a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.rules_length": { hash: "b6dda580b8be9e153a37fcba4a5c45ef3d51659d6375a6d22e106f20716b71c8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.rules_pairwise_query_distinct": { hash: "a48227acd95ecb2f07b8252e26451bece3cb2856181f6e6d7318efa8d2e654ef", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.run_compile_exact": { hash: "7c5b965d1f011909e88a1edf341478ab399369e1d44244753a2745fe28a572dc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.run_compile_rawTimeBound": { hash: "8fc4a4cbd10999d77277cd2600d36b88ff63ade9ae77fd9db3e2ab8b2b0bdc8c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.run_compile_rawTimeBound_blankEquivalent": { hash: "6b20c18ad9f52181a0bc7b2e83bdf1e5613addb00345276ac5873fa23fdc497b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.secondAppender_workRunExact": { hash: "fe794bd26e5a8c81baedfb73884245f75e4cd780e292f51f6eff32f31da1baf0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.secondCursor_workRunExact": { hash: "4943a58a694ef412a86290b3d06c463b6fe1386b72d3acf9c85fea516be03e63", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.signAppenderCursor_launch_workStep": { hash: "923eb42798991d8a182bfc859b12c35db76afdc00797df193ba5cb5420d6e6e9", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.signAppenderEndpoint_before_cursor_launch_timeout": { hash: "c863bb816df4a9b86a2b7037d5bbe3d71ca2e5b58859ba1cfce01625d613d256", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.signCursorEndpoint_before_unary_launch_timeout": { hash: "572115b1656b62dfaf09b4fe873f18d7ffef7ae120b57f387c0a3347bb83da88", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.signTokenCursor_workRunExact": { hash: "224e9c533080cebd2d622438cd410cd5358b965e337becb30029e863278e5ce1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_sign_step": { hash: "9c27a3de5f3100725d4a7daa3a077de32c8801c11abcc6ce04532bd3b0c80fa3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step": { hash: "3a44eafffa63e0d8f5aaa70773295e3bc105681e0fc4ce3aa5d8963428b794de", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_unaryUnit_step": { hash: "810c53236344f347319d131b92833ea88a52993162aaa29a1eae6b3893ebab56", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_next_step": { hash: "23f88459cef75a54dc2d261cdf756d5c4a30885d5a21f5b8bebe06eb1c6fce1d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.suffix_workRunExact": { hash: "9c2cd35a146b3000cb3f7e2836b1201baf99059af435b5d86977d6e7dcd8aeef", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.terminatorAppenderCursor_launch_workStep": { hash: "c1d49b1c7cf32accb5230f38a1db94b6d85519083a888f743e84073fa11ea493", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.terminatorAppenderEndpoint_before_cursor_launch_timeout": { hash: "b85bffa88eabcef8ca9ade875ba492100c15cd7cb19307467ca6bd9d2dce2d0a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.terminatorTokenCursor_workRunExact": { hash: "b0e349b164919227de38a978f86a716bfe509d1ee250127ea7a92b65b80e4d7e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.thirdAppender_workRunExact": { hash: "8fca97aea2b811e4a71ee5dd7849ba4be92c55c55a678a2e42d55988859aa724", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.thirdCursor_workRunExact": { hash: "d3182204c5807ef2c2820d8fcf08f1dad27bd5f1cbfecb71fe75cabed01cf6a3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.trueFalseSuffix_launch_workStep": { hash: "1880ec7b940325abeeabf18658b1b9fd4ecfed2507019db5d4eed75bcd2490a9", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.trueFalseSuffix_workRunExact": { hash: "489c26dff0d9c475519267daf93725c6dba648702a3a94aceb34a6f14219cc47", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.unaryAppenderCursor_launch_workStep": { hash: "1a2e20236139732eb27b13b40c0cd29b519ba72a8cff64425efed1da99e67748", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.unaryAppenderEndpoint_before_cursor_launch_timeout": { hash: "29909d766b270a659cbbab4c7f86630c6c57bf6a695d85af9463997db436f761", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.unaryCursorEndpoint_before_terminator_launch_timeout": { hash: "eef438fdfb790dc9b996833feb6d24a95c4600582ae9308b274f0f28b5948385", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.unaryTokenCursor_workRunExact": { hash: "9c7c870c3b9242ab8752ed20e0ae4b8d513703f45e4a2cdb789b9a280add10b2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.workBoundedDecide_accept": { hash: "04e4803c4c61209fed42d18946dcdf9bb23bd3e11f04088c694f3dc6efcac236", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.workRunExact": { hash: "30077aed0e818d21deb114a959f61d3c1b0c495eae1d683216050b2e24454422", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.work_one_step_short_timeout": { hash: "307aabbf77522a7241f75a46ec91a3c06655a4a2df27481f9acc617c336ac413", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.machine_acceptState_ne_rejectState": { hash: "b7990bde018b28a015cc58d4e8b7d7c545fbcfcce4546f677144d49f83ab5eba", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rule_source_ne_acceptState": { hash: "e96386b50a163500c445b72a4296a5288dae2c16353452b162ab1e979e455964", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length": { hash: "2d234c9f975861fc313f3e73b43205a601b5eae3c45b0415c3341841e7079643", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_pairwise_query_distinct": { hash: "a4589a4364ceac618674be6c720ce13ca618a4797c16e48bd399e0e8dae2d824", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.machine_acceptState_ne_rejectState": { hash: "4dac552c93dffe9e77d712891185d1d12585926292dfb3773386e749c4a20646", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rule_source_ne_acceptState": { hash: "d94f787a19844fb8e755e09249bcc56e75751d9b2c40143e02660a62d7b4ad04", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rules_length": { hash: "e5b32823754bf6c535394d67f89795dab7d13d83fc26601606d2d3b97ad1355d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rules_pairwise_query_distinct": { hash: "b1aa2a7114f99c3a80df8a2837b9d8590374aa0c0db075381da329db16842aec", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState": { hash: "8751719f745f8345308450a6fa63c4555415c822188cbbcac76ae752890895e8", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState": { hash: "11ea0df62f1691605a85227e5f0b315f3232a811aac074053c18d465743d560b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length": { hash: "54722218e5109a54d5d89bcf6b9011921f507daba1452870f0f22142f426de1d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct": { hash: "f01f1614a6efad7479051b52b3f910046c73ad4c6b60f7275a62b0cdec42731e", axioms: ["Quot.sound","propext"] },
};

const BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.workRunExact",
  SignSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_sign_step",
  UnaryUnitSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_unaryUnit_step",
  TerminatorSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step",
  NextSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_next_step",
  CanonicalPrefixTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.fourthClauseFirstLiteralTokens_eq_canonical_formula_prefix",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseFirstLiteral",
  AdvancedCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenSlot_eq_fourthClauseStart_add_four",
  SignTokenTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f",
  UnaryUnitTokenTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralUnaryUnitSlot_direct_eq_t",
  TerminatorTokenTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralTerminatorSlot_direct_eq_f",
  NextTokenTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.rules_pairwise_query_distinct",
  TrueTokenCursorRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length",
  TrueFalseSuffixRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rules_length",
  SuffixRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.boundedDecide_compile_ne_timeout",
  MalformedSignAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedSignAppenderTally_timeout",
  MalformedSignAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedSignAppenderOutput_timeout",
  MalformedUnaryAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedUnaryAppenderTally_timeout",
  MalformedUnaryAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedUnaryAppenderOutput_timeout",
  MalformedTerminatorAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedTerminatorAppenderTally_timeout",
  MalformedTerminatorAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedTerminatorAppenderOutput_timeout",
  MalformedSignCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedSignCursorScratch_timeout",
  MalformedUnaryCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedUnaryCursorScratch_timeout",
  MalformedTerminatorCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedTerminatorCursorScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.work_one_step_short_timeout",
  PredecessorDeadStepTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep",
  PredecessorMalformedDispatchTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead",
};

const BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.boundedDecide_compile_accept": { hash: "04c75a103ab4043385b34aa24b51a1ddce2a77eef74d0131d082a04e6ddf66a5", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.boundedDecide_compile_ne_timeout": { hash: "92defd9abfb28f6c424f31384a23d2a06727b7d38e76ac26fe0b1cf290079e04", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalConfiguration_state": { hash: "58fec5570e0c11e3ede75f9847666e0879e3388aeb77e5a1af9b1c0d11056572", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalOutside_contains_finalTokenSlot": { hash: "82bbc985f3a9c51574253b99e3cdf0c35d0175b0c10ba3db53acdeeb43e55293", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTape_represents": { hash: "f0a6ff369c8c38bd66ee4b6e2e0970ecc4e9286881b399c5b0ababf3e3894d84", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseSecondLiteral": { hash: "f5758c2bf65a629d9676d190d3f2efd786f501fff65b3d3f9d1dc64a8a0dccc3", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenSlot_eq_fourthClauseStart_add_eight": { hash: "893ee57aedb4339e0abaac813de7e044a996f57c041e5d2bf086b585fc7dac2a", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.firstAppender_workRunExact": { hash: "4554f1f6eff5f468ebb2c9fcf72a4f9d3540122b521c8d1a3cb11a03b8016979", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.firstCursor_workRunExact": { hash: "f7e044211a190179baf3123ea171da64c8126f18279ef7dd9babbc31f31666de", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.firstUnaryAppenderEndpoint_before_cursor_launch_timeout": { hash: "41dfee61b863791ac4a2cca60740b75fab29653d6e7067d8e8012a7d5f00652e", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.firstUnaryCursorEndpoint_before_secondUnary_launch_timeout": { hash: "6d9c01d54da3c4c7e9177c2ca5a23764e8f96d2f32a1a99464bbf202e4660610", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.fourthAppender_workRunExact": { hash: "b500f11904023b7a8b6fe1d43419f86d2810d456dee7f753e10ea76c4cb3c2ce", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.fourthClauseSecondLiteralTokens_eq_canonical_formula_prefix": { hash: "4800b25b7a070391a6684ec3aa0fd7545ff6d618a56a1a230ff6cdcde77337d3", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.fourthCursor_workRunExact": { hash: "ec32d14d55a896e866e2a7a9cec03b3482b529a11b8225d44c6be8110a02a35b", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.machine_acceptState_ne_rejectState": { hash: "31684edd51adf16c1948ab2a838ef7f5e412e21be7f9f2b6e1f3c1596b763069", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedFirstUnaryAppenderOutput_timeout": { hash: "828eab94740385bedd71ee85dfc5216b36884793702e23b8ecb53d8599d86cda", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedFirstUnaryAppenderTally_timeout": { hash: "7b9b6f716f7a71f7a387191ff7c65ae132925b8857da3b97cfd1341fdc3c8394", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedFirstUnaryCursorScratch_timeout": { hash: "4299f6022a84de8e5f523d3f298184aeea1c4a5497fa609c87361d2a141b167d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSecondUnaryAppenderOutput_timeout": { hash: "beefc36068b914d691025fa7c7e7050db761821c1bcb26dacf79952f65e0646c", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSecondUnaryAppenderTally_timeout": { hash: "a185a47b29882b4a62c0cdd49b4a0ab7ac9977c3a423aa66a7409e65ed38109d", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSecondUnaryCursorScratch_timeout": { hash: "b0b649862df7e67c58cc3c9f881553f3821dd23c62a512cd96823af0db255d4e", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSignAppenderOutput_timeout": { hash: "b23f6a40b04763d69a177c0914427d8e2f887a7780e99b6e7d0d035941661f66", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSignAppenderTally_timeout": { hash: "8615b305e0ab139578300040b69b32e9220060cd54fd6f16ff3c608088b32cbf", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSignCursorScratch_timeout": { hash: "18dc4272fb56608a9917ec4c4c7eeda6e1a65282766f8b04256cc1b49aae6d8c", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedTerminatorAppenderOutput_timeout": { hash: "5c920e49df40de9a57a4b35933d1282639fcc60349cc215cd63c35cc3ccb9bc9", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedTerminatorAppenderTally_timeout": { hash: "d71f3c11c832035ba50c64aebfc79e584afdbac5d8c07573fac62974edf6dd27", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedTerminatorCursorScratch_timeout": { hash: "fb645851658df231a7950e779031c68486d5fdab57fa6dcc326ebfabdb87d723", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish": { hash: "230f6c6cb8c1cf410c3d5c8e3ac7c6f69f74cc2dfc5fecdc0a2b73bb9994b8b5", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.prefixEndpoint_before_launch_timeout": { hash: "671f661c230d78bdd42a594d0c472ded6436118d9336e2767150100927b3378d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.prefixSecondLiteral_launch_workStep": { hash: "2131a2edc69df0de1caf1a888072f0454d20de94eaeb0ecf2d05735e583ff091", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.prefix_workRunExact": { hash: "3276ba51a30514b7aab9793c5dc792aa3d0421b892bb9fc228f0b947faf539d3", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.rawTimeBound_eval": { hash: "19fb481a31034127c7ca0accf3c82780fb767f20b4fbe1bc4f774e71d8aba43c", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.rawTimeBound_le": { hash: "47d042ef44f27bd1bde398a7e1a8c0df86c8c8ae0c9c7091964da8266375809d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.rule_source_ne_acceptState": { hash: "160995e4143c9ad934acb937874eec7b979ec503b4043a8c157be70028971b3a", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.rules_length": { hash: "118f07b6b404d4c1507df56364bec37be579238a3541f21a0e398611ecd9fd5b", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.rules_pairwise_query_distinct": { hash: "ab7ccbbe959de0228beb9c046938906a071af571877b88ca52bfe45475f0143f", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.run_compile_exact": { hash: "1ede52cc246dcd1dfbda6480618bbbf5c57a13a2ebe0a502ee605964220b8574", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.run_compile_rawTimeBound": { hash: "b93bef2303af67eae873096da7ce53095e2a1db8253a6437177dc9e1fc5a7ebb", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.run_compile_rawTimeBound_blankEquivalent": { hash: "09ffa35ff0c88f00e394b170f397f690c20a20608ed1df68036a39b4086761e8", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondAppender_workRunExact": { hash: "8ed1737b95f207a82647bb7e4c378bc380b34dd2772f76ca959773082d9834ae", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondCursor_workRunExact": { hash: "e5ae3f340a508e8866466f952fd90ec2fc925e6c171fc5fce10db8fb993f0859", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralFirstUnaryUnitSlot_direct_eq_t": { hash: "e4270e85de1dd5af1c4edaf9c8f2c4dee8751d5eb5505ea13691b50d47ba15f5", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralSecondUnaryUnitSlot_direct_eq_t": { hash: "cda83cc330b42f67ab411fd6367ecd6bc2f957f24e461791fdb1ee38b57d2583", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f": { hash: "ca1bb97c4d785dfda560ebd6649e8ddedff150990492dab4a0f8ac2491ec041c", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralSuffix_launch_workStep": { hash: "47eb12b0be11766917962e43543808e5486ab11d62a228c3f4ae5e2191a827d8", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f": { hash: "831fc5e3aa7d213777054a2d47b8294a6467f2f6aeb7c2526961c7884a5be715", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondUnaryAppenderCursor_launch_workStep": { hash: "3f9668429cd8a9eef5868d719007a78df4b59176d9e6b7ec1ec045e70ba4ff60", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondUnaryAppenderEndpoint_before_cursor_launch_timeout": { hash: "64ebe133389278caa2e53c0304159020fe467ed0ee0db1a4b4d29afe16c573e2", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondUnaryCursorEndpoint_before_terminator_launch_timeout": { hash: "658e5e2471609ccf0ffa36e8abc8f387fec7c6dab63e8f1654319bac3878eecf", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondUnaryTokenCursor_workRunExact": { hash: "44ab2332a3621f614bed938f6965ec4ecf728517834aa221314c084ccc7c22e0", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.signAppenderCursor_launch_workStep": { hash: "2fdccc2da06f1bd50d48585af6db97f4130cc3e7a49426eac036937d9a2f15d3", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.signAppenderEndpoint_before_cursor_launch_timeout": { hash: "fc89e19f9049b640803e61ce601957f01875e230217d40b20a857f7ab1097b84", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.signCursorEndpoint_before_firstUnary_launch_timeout": { hash: "08a3dd5453de70255dc4bbfb7580be99c6c5a30ca16250dfb1e3c0f791f86833", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.signTokenCursor_workRunExact": { hash: "1ee9ff16669b895de57a0d537cc847bfa0b6192d4bd38ed24c7bc16582ce4351", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_next_step": { hash: "bcf99476959f80ef005dba66482650c1f16b60ecafa29504aed02cde41980111", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step": { hash: "120480a9bae175e1794082824e8bf862cead122541a9007b361cc4a5dde232f4", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_sign_step": { hash: "27aec5db2e0859b46d2ce548d22fde37e256d58d5cad3e75d021284409c16048", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step": { hash: "a4a5db2f619a00cf5267887bf750b8b45f1e387e0d40d68999865b38c605cd59", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step": { hash: "1407e9a9dae25445d23ffb3d53737d1573f5d389c99b50ee764ab8fe024ff356", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.suffix_workRunExact": { hash: "8ce7874a466832d2cb7aca4b28c43d63732bfc405a7225a968effbc264ec342f", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.terminatorAppenderCursor_launch_workStep": { hash: "4ac507832e231eb277ca31cd7e0b6d356be7b6795651a40ae2238de2d427ceb9", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.terminatorAppenderEndpoint_before_cursor_launch_timeout": { hash: "d9023a111f3d3da89c38b40a1989259e7e3099aecad9ff120b0723b1e08c66c5", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.terminatorTokenCursor_workRunExact": { hash: "beec20ea6215677e606c9da3bc8641a11e91f613f7fd1b6f6f2893198759b805", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.thirdAppender_workRunExact": { hash: "6151a13a3aee64c108f3fe4d28aa9966614bd71382e40e90154c2f93b236d1ef", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.thirdCursor_workRunExact": { hash: "0fa6f6e7488f82b22eaef1cf56b000f86f009746f6d7cc2bd8abb6c276bb4544", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.trueFalseSuffix_launch_workStep": { hash: "18f33f397ffb3b19042aaba4816913fd2491435131c764619369ded46aca20d0", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.trueFalseSuffix_workRunExact": { hash: "ae7b620f1b35bd0104dba9fec879cede8ea8d7bdf3386b431c20f34c5de66070", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.trueTrueFalseSuffix_launch_workStep": { hash: "8d5018c263c6bba395ceabfd9e0d0ef2928ea6395c451acc53eb8114bb62724d", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.trueTrueFalseSuffix_workRunExact": { hash: "d3251d5639a1d97fe5917b6fae8450ca0a0b2b6bd669ba0e1c60fca6b11a26f3", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.unaryAppenderCursor_launch_workStep": { hash: "955201a9cc379f65e30e8bb34aa79aae46ac57d2169f601dac440a3692ea4689", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.unaryTokenCursor_workRunExact": { hash: "b5072922fc9818539a5c85c4dd83e58e0b40d42000906103fc831609a261ff4b", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.workBoundedDecide_accept": { hash: "ef7be673b30e5bd1e64b3a97946eb87cddc3745de1f8fa82cb4ebd5415c76eb9", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.workRunExact": { hash: "6f4c63ea6518eacff20d45cf77903e0f259f27a7ad1c900eff972273fceea28a", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.work_one_step_short_timeout": { hash: "5c0689ef7ebefd4b9c66c9d1e0c7ce1f4e7d42bbe06c909e4d58963d6810e522", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.machine_acceptState_ne_rejectState": { hash: "8fff0deaec53f5a65511d71280710ba0f173a9c29105f4a44816c944a6d902e2", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rule_source_ne_acceptState": { hash: "a2332cf53cd21df06d4623cce0fff20390c085c2d75087b37f09d3fecac13bcc", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length": { hash: "daeee97bef14e7b9da38db32598477761de45a502f977767a6af5282d3fb6287", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_pairwise_query_distinct": { hash: "69d90ce121a4865a8bddfbe3d87a050fdb3eec4a25b6f07917d7e50df477fb49", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.machine_acceptState_ne_rejectState": { hash: "d7f010a04896557a4724b08d9864a75a82c47c858a263c47f18a4e815583374d", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rule_source_ne_acceptState": { hash: "a73b7d581b349f55dddec4249c95ae42031f21236a4e2cccaa6f7ca5cef9152f", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rules_length": { hash: "c4f22e145dc3e95fb4096192bdd1dc7996326238abd8b9f0ed8790ed49ed5e1b", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rules_pairwise_query_distinct": { hash: "39bfa3fdd5d6bb5b6b6af287cf75d2ac55a4e73d36b5047f7e9e9768081b8be0", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState": { hash: "e9a10b67ec25633a1e1b3794d6917995cf450156443a8c713c8e86ad31de381d", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState": { hash: "1be14ab7c2ac8af326935ccd5ed8b126bddbef4e2bc59d59ee5ab1b6a7da4a55", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rules_length": { hash: "be09322866d115726f8c55e69b9c83cb7463b210c30f8c7ff1f1d729ca3dc3a0", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct": { hash: "05657bf834bc60b9b1ca0d0a3b1ea109d18c305a4e1bee00c54a14527d770d37", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.machine_acceptState_ne_rejectState": { hash: "8d4211045dc0806f3976c3f55a559cf32a69fb4100338643eab97ce84de94167", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rule_source_ne_acceptState": { hash: "8e9108e5f6471b363bf10f3c602a53440ec7368bc67b82786240f558943188e3", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rules_length": { hash: "7f4bf14a2359d0ee35e4f57922e3ba9096e3c5d7e50178f51ea916c6bcee995d", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rules_pairwise_query_distinct": { hash: "9e26e1191f0082df0ec51f05dab169ca9a5297562a00a7345f01bed0cae54abd", axioms: ["Quot.sound", "propext"] },
};

const BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.workRunExact",
  SignSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_sign_step",
  FirstUnaryUnitSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step",
  SecondUnaryUnitSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step",
  TerminatorSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step",
  NextSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_next_step",
  CanonicalPrefixTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.fourthClauseSecondLiteralTokens_eq_canonical_formula_prefix",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseSecondLiteral",
  AdvancedCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenSlot_eq_fourthClauseStart_add_eight",
  SignTokenTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f",
  FirstUnaryUnitTokenTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralFirstUnaryUnitSlot_direct_eq_t",
  SecondUnaryUnitTokenTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralSecondUnaryUnitSlot_direct_eq_t",
  TerminatorTokenTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f",
  NextTokenTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.rules_pairwise_query_distinct",
  TrueTokenCursorRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rules_length",
  TrueFalseSuffixRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rules_length",
  TrueTrueFalseSuffixRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rules_length",
  SuffixRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.boundedDecide_compile_ne_timeout",
  MalformedSignAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSignAppenderTally_timeout",
  MalformedSignAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSignAppenderOutput_timeout",
  MalformedFirstUnaryAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedFirstUnaryAppenderTally_timeout",
  MalformedFirstUnaryAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedFirstUnaryAppenderOutput_timeout",
  MalformedSecondUnaryAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSecondUnaryAppenderTally_timeout",
  MalformedSecondUnaryAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSecondUnaryAppenderOutput_timeout",
  MalformedTerminatorAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedTerminatorAppenderTally_timeout",
  MalformedTerminatorAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedTerminatorAppenderOutput_timeout",
  MalformedSignCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSignCursorScratch_timeout",
  MalformedFirstUnaryCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedFirstUnaryCursorScratch_timeout",
  MalformedSecondUnaryCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSecondUnaryCursorScratch_timeout",
  MalformedTerminatorCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedTerminatorCursorScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.work_one_step_short_timeout",
  PredecessorDeadStepTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep",
  PredecessorMalformedDispatchTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead",
};

const BUILDER_FOURTH_CLAUSE_PREFIX_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.FinishTokenCursor.machine_acceptState_ne_rejectState": { hash: "d1b4614551fca900c3a41a77cb586bc1156b49be570406646abfeca3ec746727", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.FinishTokenCursor.rule_source_ne_acceptState": { hash: "099a4f315f2931616552f289617686a314867d012e4a6478055b82929c992066", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.FinishTokenCursor.rules_length": { hash: "29de843b9f577f39e8c08bae3255e607304104037558a03b60bb30e086b3ce31", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.FinishTokenCursor.rules_pairwise_query_distinct": { hash: "572715d1f7fe044eaca73872f3744cf1f802487cb6bafcc5320014ebb7bd37c1", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.appenderEndpoint_before_cursor_launch_timeout": { hash: "878b0bd1539df3f33c733cfc2a3d4eecc3aa713a35c3983e81a86a0e6940c3ac", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.appender_workRunExact": { hash: "57410537009f4a5560ce65e76aa790224dade6d960d4f0dba1e19fb80a6f3396", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.boundedDecide_compile_accept": { hash: "0e052362dd73fc59afee9e8613eb1d62a70c1e2fd66c935a9f491c8c7af14979", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.boundedDecide_compile_ne_timeout": { hash: "ff61311a7fbc601cd154d8e997adf0abfaa5e0a576728a859cf177791f7608bc", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.clauseTerminatorSlot_direct_eq_finish": { hash: "ccc4bcfa9a81572d3742c0ad56ce8eabacfb455b62b48225e336693beb722150", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.cursor_workRunExact": { hash: "5f479e9912ed28ed8a540681ca2c76d0caad8ccd669aab4986269dbd601a7169", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalConfiguration_state": { hash: "d47a5624bcfc6e2fb7460d1a739659ae18c361673e4e905144e437c63558db38", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalOutside_contains_finalTokenSlot": { hash: "e5bde3bbef097ce45663b1f17dbd56d5c223cb7ea8d3e766f30cbe328e4add75", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTape_represents": { hash: "376a03008e8179b7c3b484747c476013d4e8bae1617954f71aa2ac1cd8744aa6", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTokenBits_eq_encodedFormula_fourthClause": { hash: "52de8c80e35a85307cd97bbede5d00e8ac58ad1e3059098ae539d2a1bcd28d63", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTokenSlot_eq_fourthClauseStart_add_nine": { hash: "6b663999511ae2abe7b41b4a759b5aa91b87ca19103051b3482bc9e490a28489", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finishTokenCursor_launch_workStep": { hash: "4e32ce0265f0d7700b11c2b61288c1194b0588d29717bbfe9692a712940a5565", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.fourthClauseTokens_eq_canonical_formula_prefix": { hash: "f5af9c2feeef4c262bc22329d3d990150b11a0c48e0012bd3a618aa32642c368", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.machine_acceptState_ne_rejectState": { hash: "50c018d3f15c2a164829b16b0fe2ca32e64c805692c8f13fcf596e90ceebcce9", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.malformedAppenderOutput_timeout": { hash: "9e5f625915248b16b8dd0f1cf7d49dc2b677042e124cdf516d93760627a756a3", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.malformedAppenderTally_timeout": { hash: "2e175fcc8fdb75ae3d4205ce7755b99135d507b7cc88c4cfbfc9f1414986be6e", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.malformedCursorScratch_timeout": { hash: "72d38f305b2f9b9bf1c27c04f8347c29d04c1f13242d31ef04402f9495e4e9fd", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.nextTokenSlot_direct_eq_padding": { hash: "54b9312ad8a9b18c67cac645d001998a643421b34d0fb2b58d6d61ede5314a8e", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.prefixEndpoint_before_launch_timeout": { hash: "ef2ff5e0ee17fb34efdf831948eb0fbebf896133be96eef41e7db93ed7d67396", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.prefixFinish_launch_workStep": { hash: "9989fbd32dbd87acdfbfa3ed268b161ed72551c4dd4834b068e92ecaff977d29", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.prefix_workRunExact": { hash: "3738025f114ce30215b351257c711f28a49792cfc515824de43838177446afff", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.rawTimeBound_eval": { hash: "6f1e9b871dddc4d8c6c3186d01a3973a181a2470e0c465d5bb2f43dfdbb1847c", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.rawTimeBound_le": { hash: "377993cf0fb47ad28cca0773dcf44e6350af5f592cac3a157905a5d06b22f4e9", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.rule_source_ne_acceptState": { hash: "2a8881dcb8a68b1f67019b2ee4290da37c40a30fb33525c3ff914eab076d88fa", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.rules_length": { hash: "9f6e18040cf51d9a1a8611c0793901dd40fee32c85c87be0b070199922efbbd0", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.rules_pairwise_query_distinct": { hash: "d803f70ac45ab90010de99fc0be91e1f2c11a78b49573d7da71b5cb8053c127c", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.run_compile_exact": { hash: "f284e7b47d28b13c0ea8beec07a334d690392c2107aa65c6c75b7f842110d6e5", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.run_compile_rawTimeBound": { hash: "81cba5ccbd644d54378976069fa5ddfe229733142f1709d01449d4e08b720c27", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.run_compile_rawTimeBound_blankEquivalent": { hash: "7c60d776e0e68ec7c83dc4fe0057b541260fd663b2334bc27aab049ab1869008", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.specification_next_step": { hash: "70ea9284c37f6089f5fb7a8b4552a4c7d5d580f528b2dc6970c2dde5bc611cf6", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.specification_terminator_step": { hash: "402361d5149d7098ed666f369ec34c454f4d8a4f3c4225916cd606defa3952c0", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.suffix_workRunExact": { hash: "8e5f0929129901d10c47ac9124056295fb85d5e7c5e936cc9e1b3377dc784843", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.workBoundedDecide_accept": { hash: "1d0e1d25d634b9f6b70cfba55e959bed21497bb688634c3135a7d631097b3ebf", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.workRunExact": { hash: "91a6316e03b7ba0e5ee147efe438769e57e3abcda8f7f0c8f01c61ad763ac392", axioms: ["Quot.sound", "propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.work_one_step_short_timeout": { hash: "ad9a7c851ddec845e6556e79cc7c6b8b0d80a63a853585e9d47c8f3299f61118", axioms: ["Quot.sound", "propext"] },
};

const BUILDER_FOURTH_CLAUSE_PADDING_RUN_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopSteps_le": { hash: "972da09f44b6d35d56ce775bd4a46687be45609dacd0670bc983d603715bf278", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact": { hash: "ff60669772a7f137755431c1300c4368e8004a05b1d36972a768b50d1846cf5a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.boundedDecide_compile_accept": { hash: "9acee05fa4512869a18bae9a297d313d80d88528f621af9651f8e1dfc3172b5b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.boundedDecide_compile_ne_timeout": { hash: "5520b9bc98fece7a257cd6f2ccd345bc15c722be0df4801f3b49815f63eafa10", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.countEvaluator_workRunExact": { hash: "b28730bda8a54aaee384efc5b2015235b28007931a5c54d0927f943d46cd036f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.countdownBoundPolynomial_eval": { hash: "e1ede27183b7814ca216cf36cdbaee89deec439dc1dea6890ba559e431adfc9c", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.countdown_workRunExact": { hash: "1c93ba1a46248fc7e8199286eee95d1279ae632ce9d6c0f7d1ee0e45514b9038", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.fifthClauseSlotStart_direct_eq_padding": { hash: "fb8f5c3fbe2559381f2a28424083c52062217f134af5a1db352f33ab4b54c0af", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.fifthClauseSlotStart_eq": { hash: "fcc08bc84a107f2c54bb874c7261c06f03ecaf32b7e98870c29900990c0302f8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalConfiguration_state": { hash: "982e9fbbdf71f09c3ce0e7ae2610943e3cf5e78ffec8f8914baca2ef550d85d8", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalOutside_contains_finalTokenSlot": { hash: "3c68cf911868f3f582169dd08d44d2afb04eed85770d442d9ad7511a8a216ba4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTape_represents": { hash: "fa458f6cd22392e25aa831091c82a051dcc6980b6a0cbb5a1b1c605b2459d32b", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause": { hash: "14885a1b3a2cf43dc131d9bff4901137060f894263f6f51a53338cbdfc97a8e4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTokenSlot_eq_fifthClauseSlotStart": { hash: "95595ed49e8a7fc08f4dc3c58b500d4e3b00aaedbde112c7e3937d5b27ac4983", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.launch_workStep": { hash: "e61f94120eb9e1759c67e9626470939a3ea20eff209a13ac68bf237f85491bb2", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.machine_acceptState_ne_rejectState": { hash: "fbc2ce90b22affcffa45e39f23a1c74ed4c928db57ea96bee0aabbdc1625376a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.malformedCountdownRoot_timeout": { hash: "0271388ca1bf65acc9ff1391417abc6b5eb6ff9d189c5eb2f9658d7db75a5207", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.malformedCountdownScratch_timeout": { hash: "3c88f67d8aad5bbd508e5271bcffc84a05dc1c0e8f1ffcfb2b2884aa009f22ba", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.paddingSlot_direct_eq_padding": { hash: "0e208441e0c7d12a256dc8c7e89ac267ff776eb20d8aa2ccfa5e48b2c2927a71", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.predecessorSlot_add_remainingPaddingCount": { hash: "b018da2019da895cb3796c4c24fccb61d085ba830b75df16d9f1a6146f0946b5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.prefixEndpoint_before_launch_timeout": { hash: "6f2dc10eb099ef9d51fda2c7b792a74f0d49e2deeb5a268b7098877cfa31f339", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.prefix_workRunExact": { hash: "e8f779b71c5012a9db625675e1fa129686a7893d044caedd6e60a83d8fd3d70c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.rawTimeBound_eval": { hash: "2c8d74b5ed3eb7b40831fe61bb4319c5c7d3bce51586171a38a7c9280859bc89", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.rawTimeBound_le": { hash: "94c39cfae3d42fa0cc79afeab45dcfb307c9f2148c2cc57a11a3dc50edac49c2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.remainingPaddingCount_eq": { hash: "5062223b78e762517bce485533b24a381dff7000b22fcd60b4c1d093bf72b4c9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_nine": { hash: "01f10c080a3ed147b813835e76af337e41a2c42cf3c6cb697336e7a304f60363", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.remainingPaddingCount_positive": { hash: "fec5d1fc00efa399b168d3aae0db54a1f6c43405cb318fa086adc8707483acfe", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.rule_source_ne_acceptState": { hash: "7341d7b321fb64c876dda543b67deeee3d9d2129e4bf2da1f57a8bb0777e07e4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.rules_length": { hash: "c5b954268d25cbeade7b274324386962570873682ee17a2475ab201de0cec9fd", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.rules_pairwise_query_distinct": { hash: "11d1d5abbd72b763455f68f42c06e4327f70c416491c5195121189289245bd6e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.run_compile_exact": { hash: "fad4b552da1f6712455bde735026b4c42f601c9b0c80b3c0cc3c21a2297e6daa", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.run_compile_rawTimeBound": { hash: "453a63125881996562ae744bb166f0d21c87128c9862a8f611a2ce72448b4e76", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.run_compile_rawTimeBound_blankEquivalent": { hash: "a869d1d3e1104db35e1ec1f82a0e23c8abb5b3525ed3f5e7e9291795581cc6cb", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.specification_padding_run": { hash: "f57b82447f23a30652fe23e690f295bbe4fdbd55a1aed88cd90c53cabb71aede", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.specification_target_step": { hash: "5e99b1dbdd5b8130ab454ca4a8757eecab585145bf58e04e26594dbe42b8f969", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.targetEvaluator_workRunExact": { hash: "1d4621d21a41eed9361c0a83c5926975327e8b2e918b29f94745022a26aed419", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.workBoundedDecide_accept": { hash: "4118131aa2a4b9013e6cc2e6e3ab3bb656837cff5e351ffd2ea57539bbf95e03", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.workRunExact": { hash: "0f15cc26c89f1acb106b3c9cbef205bc3620d47ff5cf213baadf3576d0bce9d9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.work_one_step_short_timeout": { hash: "fcbadd548f98f16fc4c24fe7c7a11c7ddabfda7a8af048fc9916b2fc4ec14073", axioms: ["Quot.sound","propext"] },
};

const BUILDER_FOURTH_CLAUSE_PADDING_RUN_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.workRunExact",
  PaddingSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.specification_padding_run",
  TargetSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.specification_target_step",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause",
  RemainingCountTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_nine",
  FifthClauseCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTokenSlot_eq_fifthClauseSlotStart",
  DirectPaddingTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.paddingSlot_direct_eq_padding",
  DirectFifthClausePaddingTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.fifthClauseSlotStart_direct_eq_padding",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.rules_pairwise_query_distinct",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.boundedDecide_compile_ne_timeout",
  MalformedRootTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.malformedCountdownRoot_timeout",
  MalformedScratchTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.malformedCountdownScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.work_one_step_short_timeout",
};


const BUILDER_FOURTH_CLAUSE_PREFIX_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.workRunExact",
  TerminatorSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.specification_terminator_step",
  NextSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.specification_next_step",
  CanonicalPrefixTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.fourthClauseTokens_eq_canonical_formula_prefix",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTokenBits_eq_encodedFormula_fourthClause",
  AdvancedCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTokenSlot_eq_fourthClauseStart_add_nine",
  ClauseTerminatorTokenTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.clauseTerminatorSlot_direct_eq_finish",
  NextTokenTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.nextTokenSlot_direct_eq_padding",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.rules_pairwise_query_distinct",
  FinishTokenCursorRulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.FinishTokenCursor.rules_length",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.boundedDecide_compile_ne_timeout",
  PrefixEndpointTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.prefixEndpoint_before_launch_timeout",
  AppenderEndpointTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.appenderEndpoint_before_cursor_launch_timeout",
  MalformedAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.malformedAppenderTally_timeout",
  MalformedAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.malformedAppenderOutput_timeout",
  MalformedCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.malformedCursorScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderFourthClausePrefix.work_one_step_short_timeout",
  PredecessorDeadStepTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep",
  PredecessorMalformedDispatchTheorem: "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead",
};

const BUILDER_FIFTH_CLAUSE_PADDING_RUN_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopSteps_le": { hash: "972da09f44b6d35d56ce775bd4a46687be45609dacd0670bc983d603715bf278", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact": { hash: "ff60669772a7f137755431c1300c4368e8004a05b1d36972a768b50d1846cf5a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.boundedDecide_compile_accept": { hash: "d3979f5e0d490cfdee709b0772daefc1faf8f22b9eb5a98691f2091545867988", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.boundedDecide_compile_ne_timeout": { hash: "4ddb06788e69d475ba473e1d058dc945783dccffc270590fb860bf1bb5d17981", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.countEvaluator_workRunExact": { hash: "7e42fdfdad7502dc26d9ea2ae4862f90e323ea3d5027d5e01bf7ac30c62ed629", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.countdownBoundPolynomial_eval": { hash: "925ba628a137d2389539d4171b6c648d64576d1c347af1c2c9003e200ba7655e", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.countdown_workRunExact": { hash: "904e936b34ecfdc60f5fd33f7e63c4564d98224882c8db5ba2357c6142a33160", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.sixthClauseSlotStart_direct_eq_padding": { hash: "9a29793b21f2fe3186c5f09bb753fb55c9d839bdd2a9e2155edbfcb9d085b534", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.sixthClauseSlotStart_eq": { hash: "e21d4d531aa55cf88bcbded5c850f385fa4896a833f4b01d682364d2c57c7b38", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalConfiguration_state": { hash: "f3b35d12ccc6554be17db79e6bca93bdb32872289fc9a14ae547423fc1f05f4c", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalOutside_contains_finalTokenSlot": { hash: "3a6294636ac88405dc1752be425834bb78fd2494a9f795891d1503bd4c41b1e0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTape_represents": { hash: "bc3ff104ab65256f2dd125d85428bccbb6c31dc9b309e31907b95915e00593b6", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause": { hash: "4784634e836036979fedf7fc4eee139412095862749635acbf9bb1db29b491a2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTokenSlot_eq_sixthClauseSlotStart": { hash: "54267c1b3e5ab05679838db25f0297e8e7becdc32487806717471fcdfad02c8c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.launch_workStep": { hash: "54b6aa4fec94c1f2a2927505b9f1c105ed00b58b4a41d4309b36160bc14231a4", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.machine_acceptState_ne_rejectState": { hash: "815a1fd2428c0133a66f49e0dd48da7cdb062babaf4ae9d3ad36d84cd92eb4b0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.malformedCountdownRoot_timeout": { hash: "7448d3b305c16b2d861c08f7bfcd511edfc9876bf5001aeed3629b7bb80815d6", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.malformedCountdownScratch_timeout": { hash: "3339d5d7581d20e80a8b6c848ca3a8edb6b631dd17d37a2319fa6fcdcb76c0ae", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingSlot_direct_eq_padding": { hash: "72b67c01032ce5c773b4a4efddac7e1e13d06918a41ed46e0772bb53083800ff", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.predecessorSlot_add_paddingCount": { hash: "b7cc1e9f1554188b3f1c1a3f38e1ad0a7e94b176a03c96577a742a8a392102d5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.prefixEndpoint_before_launch_timeout": { hash: "1b357b4a92c9dced281e1322c47d6abf2b9f8838fdd3bdac825325d7a7031aa7", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.prefix_workRunExact": { hash: "f389f5f08cddc0ebbd699c304837a5c5bc1da390885c04b617e5d7d8bc2a5f86", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.rawTimeBound_eval": { hash: "bda404cb6532658eff69761a9c871f45522e4fc1368683997b766f6ddd8a9858", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.rawTimeBound_le": { hash: "58743e4f6475545ba3d032850a62c38b3cd91b6b77649d025f9896903d1e8087", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingCount_eq": { hash: "083f595938257e7336b6150604c7edc76c99e9006c166d843596042b920a41da", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingCount_eq_formulaTokensPerClause": { hash: "807ba4584b561134dd773e3581d15671f0ad3d95cd727dfbbbdcf49a002c1b07", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingCount_positive": { hash: "7755d65ee5ccbce18d9c6624b634b53ecff7f3f1d8cda10c523146d5bb0919a8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.rule_source_ne_acceptState": { hash: "74529525b90db36979f07534e39de4831d7c566caca3318c2639342029f62553", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.rules_length": { hash: "09373a631451d72e19bf403e5cd2aef671bcf67ddd7a987b6854cc9ba03c0714", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.rules_pairwise_query_distinct": { hash: "23c36363073ec68fab1e5190b427837a532d281620c701500f8cc520422b5f9f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.run_compile_exact": { hash: "0b4668aa455e593b187d7ccc88aa15e638fc3a6d9a5e83aa324ab8e8a72bed00", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.run_compile_rawTimeBound": { hash: "bd564f5a85729d0e55dc2eff6c89bdb3cf7818b78c7a071f755affcb98e6b6e3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.run_compile_rawTimeBound_blankEquivalent": { hash: "073f969cc8a9e0d27162149df59343e269e3610711ec9e8f868e1fb04be6ca49", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.specification_padding_run": { hash: "6bd891f67e08c3d9180bbd70d0a17f55728a1e681eca1abe904414638d5d8b2f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.specification_target_step": { hash: "1c04822e047dcb82a5c6d5eb25a5871b6ca1e895a2badaedec29964895bc4016", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.targetEvaluator_workRunExact": { hash: "02e2d1d498c4a1c24909fa54715762eeab4524846a797626096625d2a8bc29f1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.workBoundedDecide_accept": { hash: "711bb71aaf3be7b7f26b4075ed0d2f36c36a54d4f1832fa1fcedbd6928db5de4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.workRunExact": { hash: "7363ad1bf9d11b6a8967d58d5df02b3970ff2df0028d3c8e8562b35e9a6461ec", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.work_one_step_short_timeout": { hash: "6526f3f4553449188d0c0086860c6c69b7ed66f258b0bcfc328759f1261237fe", axioms: ["Quot.sound","propext"] },
};

const BUILDER_FIFTH_CLAUSE_PADDING_RUN_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.workRunExact",
  PaddingSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.specification_padding_run",
  TargetSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.specification_target_step",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause",
  PaddingCountTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingCount_eq_formulaTokensPerClause",
  SixthClauseCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTokenSlot_eq_sixthClauseSlotStart",
  DirectPaddingTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingSlot_direct_eq_padding",
  DirectSixthClausePaddingTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.sixthClauseSlotStart_direct_eq_padding",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.rules_pairwise_query_distinct",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.boundedDecide_compile_ne_timeout",
  MalformedRootTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.malformedCountdownRoot_timeout",
  MalformedScratchTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.malformedCountdownScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.work_one_step_short_timeout",
};


const BUILDER_FIRST_CONSTRAINT_PADDING_RUN_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopSteps_le": { hash: "972da09f44b6d35d56ce775bd4a46687be45609dacd0670bc983d603715bf278", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact": { hash: "ff60669772a7f137755431c1300c4368e8004a05b1d36972a768b50d1846cf5a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.boundedDecide_compile_accept": { hash: "d063ed370c52932399e35def06cbc186de1756b587c5270dca02a0f2e11bf360", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.boundedDecide_compile_ne_timeout": { hash: "178fa91774e3fc39425cb93f7fb473b3301a97e993e0c603796dbfdd233d1bb4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.countEvaluator_workRunExact": { hash: "0f297436297f2fd9a36ccf253d79642ee1031d251297a62976e5bdb3edbf23c1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.countdownBoundPolynomial_eval": { hash: "d25a43302bd7720ecb9dc77ada3a5fb76dd3f661edb301998d276032134c7221", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.countdown_workRunExact": { hash: "b5a4816d1c86bc922f28af6aeff88880daa1d21efbe1e4897b5fee441a220dcb", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.secondConstraintStart_direct_eq_sep": { hash: "3935a0b3d837a9d0100b99f3a04a0613b717a7f5fe324ef3727f8c4a94474d8b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.secondConstraintStart_eq": { hash: "cb988d7acbbc1524bfa2ccfbd1b47e44a0437547e0c3a588ec7eeb4410fe63d8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalConfiguration_state": { hash: "0d12fc497b9bcc80ab038510f2faf8d27ce2f44e1ff3fc53370c398e6eb76ca8", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalOutside_contains_finalTokenSlot": { hash: "955c4296671c4222943773b29f638249828139179af5b62866e36850d4bb80f9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTape_represents": { hash: "a171dd033b905d08ddc08e75ffbb92180d4a8bb47b5528dd687cdcbb9831c412", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTokenBits_eq_encodedFormula_fourthClause": { hash: "7e6edbccbf9e8fe5e539428ae89ff334a3892de8f18b76d597932d5833910809", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTokenSlot_eq_secondConstraintStart": { hash: "8aa76319b194c84fb73af74a16274429586f2bba4a197783f53e39b80b01f146", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.launch_workStep": { hash: "2fb294a3699331c66d333449a4fef8af1ed89833cad800ca74dd30aad913ee55", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.machine_acceptState_ne_rejectState": { hash: "45b351017a6288ba05e7f9d121e34a3bad213093e6b1299ca4a6b1a3d713a6d3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.malformedCountdownRoot_timeout": { hash: "410b9f0882c178812dc70ce76738f4ca7346c84734f54942c59d52a9e1d8f7e9", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.malformedCountdownScratch_timeout": { hash: "9c2f753cb7dfd97cbc67bb1986b32014baec978c118947dcd9120e4fd6591469", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingSlot_direct_eq_padding": { hash: "639e1b345151140fba344cdbcb572c245547bba74552f9622da731df2a317557", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.predecessorSlot_add_paddingCount": { hash: "e301a77095d89e8cc0f4a46db4f25731a30897cf64f0034ef3390cca5144fa85", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.prefixEndpoint_before_launch_timeout": { hash: "1def2c783b872b5052e9dbfda047cdf01f65d9e9afa19215b7551c81afad4f68", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.prefix_workRunExact": { hash: "c3985b4979d0a63981b75a62b4647326a5ce49c5ffce58c23affdde8773ebba8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rawTimeBound_eval": { hash: "8580c21203e487bbc1d057e91891f5b190fc7a7326bf4fb80ca5accfdd7aa51f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rawTimeBound_le": { hash: "0f144eea3e680c782b39a91429641d0ece71b58bd6ea6250f0d67c848fb76650", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingCount_eq": { hash: "b772f9a8361196d8ffa8b1c6d26664a0f6a18dc1a4b1f9032ad110b060489298", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingCount_eq_remaining_first_constraint": { hash: "990b2dcfbc447ca94d9830aafe34b5c5ac7f2fcda0954d0a66558589eb4a77d6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingCount_positive": { hash: "284bfabe0b56124a352725af2ebd29e4174c3bb11fd8678d8265c96af147ee45", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rule_source_ne_acceptState": { hash: "7b458aa116c23f5177bbc424b47fac306c8b5ef120217c4eac3ba416da13a50a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rules_length": { hash: "a752d658b4c304c5f6f52db023cd9a797a79c82407c78e53e694b5d36b278db3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rules_pairwise_query_distinct": { hash: "18ce17ad370172549bfa684d6b7a30175b0d60649b4ab1f30123516615de63bb", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.run_compile_exact": { hash: "5d9a76acde81b9ca312c46b78d282dda4e6b5b4fb558733e903482853ee39400", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.run_compile_rawTimeBound": { hash: "fadc94fc47c31ee2fe4d673ae603346898be223687e6c70c727f4041e1ee1839", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.run_compile_rawTimeBound_blankEquivalent": { hash: "93f7aae93c34b7b13781504f1d25d609f3aef90ec5cd05acfff98c0d41c59f3c", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.specification_padding_run": { hash: "b7117f6639941d7ab1ae3240668e29ee167ed53445a10ac260e7914e56a86eef", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.specification_target_step": { hash: "d7ff00c63f3316dd7bbc5cd2bae74be76a5602bc69c3ed32f9d8dc003c9ba29a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.targetEvaluator_workRunExact": { hash: "1bf4f7612bdc1de4c994bade577fe823d34c2c1da6fa81e566e4b902a86be7b7", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.workBoundedDecide_accept": { hash: "544186abf6db45bf1dadec3253fa9e214c80d88b4dcc016d7124acdec4a0e6f2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.workRunExact": { hash: "9182f0d678ba27d6b7bdb64886b6ae78ae4f06bb71eaea327a95e71abb76d17b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.work_one_step_short_timeout": { hash: "94a37c7fbbae6b29faea9739d6845249a43a32b2285459539a6d70e55794906e", axioms: ["Quot.sound","propext"] },
};

const BUILDER_FIRST_CONSTRAINT_PADDING_RUN_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.workRunExact",
  PaddingSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.specification_padding_run",
  TargetSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.specification_target_step",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTokenBits_eq_encodedFormula_fourthClause",
  PaddingCountTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingCount_eq_remaining_first_constraint",
  SecondConstraintCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTokenSlot_eq_secondConstraintStart",
  DirectPaddingTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingSlot_direct_eq_padding",
  DirectSecondConstraintSeparatorTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.secondConstraintStart_direct_eq_sep",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rules_pairwise_query_distinct",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.boundedDecide_compile_ne_timeout",
  MalformedRootTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.malformedCountdownRoot_timeout",
  MalformedScratchTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.malformedCountdownScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.work_one_step_short_timeout",
};


const BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.machine_acceptState_ne_rejectState": { hash: "eee6920f72c0fa3566bb3cc5fec3951b18a9b2aa1b50b5cf34436d0183ab750b", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rule_source_ne_acceptState": { hash: "7374475130eed22d8cc19092f72edf903e2c68e024a2f87b3ab4220e8cce98ef", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length": { hash: "f7a8b37c7c3b3404f9144c91f3ce51689b46abf2e61945b6fb89b3d865f98200", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_pairwise_query_distinct": { hash: "c17b7f7fa8d40cb373b90f541f7700eb91c2bc21b5a0a7f5a02ba842283f879d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.appenderEndpoint_before_cursor_launch_timeout": { hash: "eb9666e7b431996a7d32e798f2938d31f832c7429d3be69d326aff29530f6cbb", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.appender_workRunExact": { hash: "16d746cfd526c2df803d4c7b13961931a2dd8b79a35ac995ca5e3c86e5abcc09", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.boundedDecide_compile_accept": { hash: "fc071fd4babfabb76fd0384001c6e98c048481da842babd82c35d0b457993eb9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.boundedDecide_compile_ne_timeout": { hash: "9e54089e6d436cc8b38d290d01674aedb91c6c282bfd93bf089da50bcc6d333e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.cursor_workRunExact": { hash: "c184166c2e679d2d50ac97958afd5dbffec2905b37c2404bd4bec96e662d1b8a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalConfiguration_state": { hash: "a1c11bfe089550f286425006bf8189ab9c5f2e3ed6e8a10d6b835e3f193d6638", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalOutside_contains_finalTokenSlot": { hash: "811bf00aed48041d704f9b2ab27d12ad91fa6814d3b37ceead5931c89131e990", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTape_represents": { hash: "10ec17602092f489f35452ae4ccf65df533111a2c8e734f7920c79fbbdf9e0a1", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTokenBits_eq_encodedFormula_secondConstraintStart": { hash: "2eadc94f25123a0bab6fd1cf59f2e442c84ff0fb5a8bfaf41fbc6b40f9ed7f75", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTokenSlot_eq_secondConstraintStart_add_one": { hash: "a3529c003691e50c83c34cdcc99b5f0ca254b2659a6c9483e9cb563c1e40e06d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.machine_acceptState_ne_rejectState": { hash: "926aab9b9ba000be58f5228d6cfa9611f0349e5fd6c93a1ea7bc6f10ff9d3d20", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.malformedAppenderOutput_timeout": { hash: "e3f30329252b647714570b71639722dc0c660806e9e311b7fc823f71fb227bf5", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.malformedAppenderTally_timeout": { hash: "6a7e8e7e50aad6109f5ce32c5d70b88a2989b8a39e58f4afd5e9571305248207", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.malformedCursorScratch_timeout": { hash: "1eb71237613af5598dcf54d0346010ec44d2994fe8923c317f64f39f0b58f820", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.nextTokenSlot_direct_eq_t": { hash: "407b9e61d0b2a9ef873bfa58c65f621191e8e8ea018398689c9d83764f102f99", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.prefixEndpoint_before_launch_timeout": { hash: "1b5bdfd0f093d0c78c95288af36231728482ad26d0f6db20d936619fc2b014af", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.prefixSeparator_launch_workStep": { hash: "c1f23a6262d2733031c887688442778c762db0a0c86e60d4dd766897071a0b75", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.prefix_workRunExact": { hash: "05ce5495de963ecd03c458aab04d41c32e9220a6d67443b4ac4e250e1b866517", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.rawTimeBound_eval": { hash: "53f6d484c653a0d090e63ab549397c784e393f82b057178b3fd72d2758c6b6d6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.rawTimeBound_le": { hash: "d28fdf29615ee46887946545bba7ce4b93471d900560cc11678fc93208208620", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.rule_source_ne_acceptState": { hash: "e3ea0599e5f6615ca654fb887723ee54de28fcf1df81045b661f671cbc283859", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.rules_length": { hash: "75dea177eae80332ab0207f6cbe927c433429f57effde980ab01fad922b76952", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.rules_pairwise_query_distinct": { hash: "bdb4622f308892c9da6cfd33546c5b05f14462f2aa47f38412f57effd452fdd8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.run_compile_exact": { hash: "0f9916e728eef9ffd6cb3eb45d89d607433a98766f2c2849ea337c57a5bc4298", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.run_compile_rawTimeBound": { hash: "fb9e16b13cfb4cb7724a9c0c7880d12ede01d6df9c274dee61044ea4422d7215", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.run_compile_rawTimeBound_blankEquivalent": { hash: "cb72725167fcb6dd2f23d56d177893e72bce964513c911d7289001e2d728fe01", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.secondConstraintStartTokens_eq_canonical_formula_prefix": { hash: "665280230db3da72c2b7e041a511bf86d070834c933a3d23de8fda4ade98b56e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.separatorCursor_launch_workStep": { hash: "819ac4109b39752296f303fff7410b8b31306fa3f271e05c1013bf724ec3c7d4", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_next_step": { hash: "3700f98a292c88a39a199d8304bc8882a4b6cf97dbb0415306fbc3c3aeacfffb", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_separator_step": { hash: "a9d7ec294af9cfe8b84a4c8c8d987c1fc4a02514c682a6030518af82beef7ee7", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.suffix_workRunExact": { hash: "d87d0c0c1ff63cab97fee0167b026a41b1db66d01b4cc1f26c5835f8205049c1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.workBoundedDecide_accept": { hash: "0d805271278807d6b15306e8545d9b3882cbecf2d6ae628630a544a482ff2197", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.workRunExact": { hash: "d3052938ed779208f1213415d0764d3e534089f0d5875524d1d624023b7d5355", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.work_one_step_short_timeout": { hash: "381732429388f6b4fbed79b0ea327645859d3fdcb84651ccfcbd30adf91b0a30", axioms: ["Quot.sound","propext"] },
};

const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState": { hash: "8751719f745f8345308450a6fa63c4555415c822188cbbcac76ae752890895e8", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState": { hash: "11ea0df62f1691605a85227e5f0b315f3232a811aac074053c18d465743d560b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length": { hash: "54722218e5109a54d5d89bcf6b9011921f507daba1452870f0f22142f426de1d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct": { hash: "f01f1614a6efad7479051b52b3f910046c73ad4c6b60f7275a62b0cdec42731e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.appenderEndpoint_before_cursor_launch_timeout": { hash: "6fbaca3e1d2cf206d8c6f3e1ac2a502c96c07c2a9691f9e2e14915b7916c3563", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.appender_workRunExact": { hash: "9405319fdb10500746d0335c9b8ba1f17e6189f010474c6a108f7516dc8324b3", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.boundedDecide_compile_accept": { hash: "211f78b4f4df914c81351ce03ec7f15beacb14387c0ec7733bd89917986ae873", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.boundedDecide_compile_ne_timeout": { hash: "d10e89eeda73c1fdef882461f0756a1e15e08f5613268a3d1632b1dd70379d47", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.cursor_workRunExact": { hash: "f9507e52347bf4e64eb59d55fe5499a8f2e3393b229a825a53e9a3f17b748d3b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalConfiguration_state": { hash: "30560599a4e93085d918483d2f735bdae083a51483138eed3aa84450732e1e1c", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalOutside_contains_finalTokenSlot": { hash: "fcdb2f024e96745a8ef438ea0f8e632b535d871cf2cf2e20b0bc75002f910bae", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTape_represents": { hash: "5080d5087dad2f15adff7028da001f1a72cb8723c6fc932a2e8ec7ee76b056ff", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSign": { hash: "31803cc4136babbe756aa9e8b05ce0f8eeb82d4cf0b6e859a832541c38c5c5a6", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTokenSlot_eq_secondConstraintStart_add_two": { hash: "9e12ff647421e89b1342a93b37303f9447c1e941729e3e0f399709ab6b1ebcbe", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.machine_acceptState_ne_rejectState": { hash: "86ec64893892fd9f47df33ad37d14d2f95c1516222ad66efd42d9ba1e04e4d6e", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.malformedAppenderOutput_timeout": { hash: "b5ef06bc1a51bd99df58c87049798fdeba804a3515cafbbad92713f39048aba7", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.malformedAppenderTally_timeout": { hash: "6d1e6258d424ef1dac8e4d0a174dd51b9af61ab63ba66c304ef6d029cb612f7a", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.malformedCursorScratch_timeout": { hash: "119be3566e9bd0aca34b768bbc1c027366c435b391be5b5331e13814ad402331", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.nextTokenSlot_direct_eq_t": { hash: "69cacf7771ad233ddbb0efe53d58c5559b1f03458da0c3d322ce68d9df99cd0f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.prefixEndpoint_before_launch_timeout": { hash: "2fc534c2299ec8125cf37a98999011f0c39fde6f030dadf6f80fd2d8c9fcad94", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.prefixSign_launch_workStep": { hash: "775c8e9d305c053a954a3daf12724d23bc3171b7783d9a031bdc6ddfc16a66ce", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.prefix_workRunExact": { hash: "a5fe74a6d0b9d32cf0b1e813dabdf82b9e5440139f126ce9e697957aad0e95f2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.rawTimeBound_eval": { hash: "7a20de2dd6cb163a3bb71a0ed727a371d4332a96c0db15fa7a56cd2b8caff93e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.rawTimeBound_le": { hash: "e08747bf26b7f9dd044766df4de78774caf278646b1afa216e6e28d0d61849f2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.rule_source_ne_acceptState": { hash: "0db76d877297d4bf1e4d0babf385ead3d15d9e7d096ae26250b25f326d4fd32f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.rules_length": { hash: "907c682a758a4a6972cd13eafb74e8ce6cbcbe9b1d2c80b85cc738b46129049f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.rules_pairwise_query_distinct": { hash: "04180d0b62373446042a935b35b37beed0e7731fc5811c3e807a6a827bb23050", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.run_compile_exact": { hash: "7a4614abe536a9dc7525904cf338dd6eb5cdbeff29cd564931aa29676aa7e3d4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.run_compile_rawTimeBound": { hash: "9556f35a72f5ea52c7817e6a746a937df52b61b2480385d3004dccd69c3dc989", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.run_compile_rawTimeBound_blankEquivalent": { hash: "7d74301d25bde976647a6f96e2ec009d7ca7d38739f33077b13add9c5478cdf5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.secondConstraintFirstLiteralSignTokens_eq_canonical_formula_prefix": { hash: "e2568ec28e32c518641b4bf6eb08662ee342c688d69b731645973504c4ee6a44", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_next_step": { hash: "bd11d588a52d3c18ff3312f9f95644f2a36a0c5ed957380fdde72838037284b5", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_sign_step": { hash: "b23e109d626394572ca8f7b4d53a5ce2a6b49c11dc96f9d4e5b14300f07b1da2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.suffix_workRunExact": { hash: "07beecf536541e8aa55075fff55c456c91108ec6d2b0d5d99c5710c33b8f7794", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.trueTokenCursor_launch_workStep": { hash: "884b421a4819a446a7ef374a0e3f2200c714feeacd2f8cafdb71a2b388ede903", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.workBoundedDecide_accept": { hash: "80fc7a505b6be74ad42102121d3b8e3783b60e9a4c33ef7de48b4a088e932752", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.workRunExact": { hash: "014629e4eda6ce0023acf35a14258b5b15d1b05060eb526f64acbbcd3a7c16e2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.work_one_step_short_timeout": { hash: "8ccc8f114cc27a53afc423f5cae8088a0c8283666e04bc21fa788613830da960", axioms: ["Quot.sound","propext"] },
};

const BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.workRunExact",
  PrefixWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.prefix_workRunExact",
  AppenderWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.appender_workRunExact",
  CursorWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.cursor_workRunExact",
  SuffixWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.suffix_workRunExact",
  SeparatorSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_separator_step",
  NextSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_next_step",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTokenBits_eq_encodedFormula_secondConstraintStart",
  CanonicalPrefixTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.secondConstraintStartTokens_eq_canonical_formula_prefix",
  FinalCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTokenSlot_eq_secondConstraintStart_add_one",
  NextTokenTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.nextTokenSlot_direct_eq_t",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.rules_pairwise_query_distinct",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.boundedDecide_compile_ne_timeout",
  PrefixEndpointTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.prefixEndpoint_before_launch_timeout",
  AppenderEndpointTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.appenderEndpoint_before_cursor_launch_timeout",
  MalformedAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.malformedAppenderOutput_timeout",
  MalformedAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.malformedAppenderTally_timeout",
  MalformedCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.malformedCursorScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.work_one_step_short_timeout",
};

const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.workRunExact",
  PrefixWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.prefix_workRunExact",
  AppenderWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.appender_workRunExact",
  CursorWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.cursor_workRunExact",
  SuffixWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.suffix_workRunExact",
  SignSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_sign_step",
  NextSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_next_step",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSign",
  CanonicalPrefixTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.secondConstraintFirstLiteralSignTokens_eq_canonical_formula_prefix",
  FinalCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTokenSlot_eq_secondConstraintStart_add_two",
  NextTokenTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.nextTokenSlot_direct_eq_t",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.rules_pairwise_query_distinct",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.boundedDecide_compile_ne_timeout",
  PrefixEndpointTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.prefixEndpoint_before_launch_timeout",
  AppenderEndpointTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.appenderEndpoint_before_cursor_launch_timeout",
  MalformedAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.malformedAppenderOutput_timeout",
  MalformedAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.malformedAppenderTally_timeout",
  MalformedCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.malformedCursorScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.work_one_step_short_timeout",
};


const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState": { hash: "8751719f745f8345308450a6fa63c4555415c822188cbbcac76ae752890895e8", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState": { hash: "11ea0df62f1691605a85227e5f0b315f3232a811aac074053c18d465743d560b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length": { hash: "54722218e5109a54d5d89bcf6b9011921f507daba1452870f0f22142f426de1d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct": { hash: "f01f1614a6efad7479051b52b3f910046c73ad4c6b60f7275a62b0cdec42731e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.appenderEndpoint_before_cursor_launch_timeout": { hash: "dbf043048ccfce2a6f8e676e5071286095d3dafb79882a8eb9a2cf5baf5d50c9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.appender_workRunExact": { hash: "5244df7176f83557262062f37176b769704cb5e89ab85825b3506c8a66fe3756", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.boundedDecide_compile_accept": { hash: "da85e8d0f3636ccf965695ecfa7b6994bcb63d7e35b10a27446e631018aecf7a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.boundedDecide_compile_ne_timeout": { hash: "3f849567f3ad43257063c46b6ebf4397834e9f3e0db9234593adc0d8de36fb92", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.cursor_workRunExact": { hash: "56bfc65ba65366bdd088eff5d7a3ee523d6823a076014d437ac3df565106eca2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalConfiguration_state": { hash: "120d31363d94c068b683090a35795cf7039785349322d8cd1a22d515f5360fe3", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalOutside_contains_finalTokenSlot": { hash: "b136c99d3ffbb59183313385a165f736f221f9cf368697d61740a7f7c1c9f05c", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTape_represents": { hash: "b85b1aabafd38d0e26cef25cd37d0edfcabdcbe2d173b4810e0b8d9d608210ac", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralFirstUnary": { hash: "19d3254709b1c1fd4a764f1137de27b9cd98bc772c9ddcb2297bc4855c882af1", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_three": { hash: "263b0d90b6fd2df7ec342feb284f744ed80a114e4914de2152492106329a8724", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.machine_acceptState_ne_rejectState": { hash: "b8e6e38b6cfbcf55c2825cba9e92ce3487b13e93cb8ae1b93222d81d68329167", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.malformedAppenderOutput_timeout": { hash: "39127c04942e835d1304569431f3d843df0e0daa3b0754569ffffd082d99df05", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.malformedAppenderTally_timeout": { hash: "bea95dcdf8d3e6e42573d1be7477ec431f5e3713099214ed1a4d5f9d601efdc7", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.malformedCursorScratch_timeout": { hash: "81f83ccf0074565d07fbeb1603ec597d75d1336e65bb867053fd486c946f3b5b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.nextTokenSlot_direct_eq_t": { hash: "b002cf1d5b73781931707a957742dcb47a8830966071463da0611aeda30d377b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.prefixEndpoint_before_launch_timeout": { hash: "41e9e3b0408d7662465b0c5cb355e809f7f6354b99b265c061f97a64b7cfb1a4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.prefixFirstUnaryUnit_launch_workStep": { hash: "c6b442c1eba60428929c4f01d963cc6806a4ac8c97631c8d983faa2c56599a6a", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.prefix_workRunExact": { hash: "4382a7531842550f6e82cba5c411c061f363520febc014cc4320c8138baa80e9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rawTimeBound_eval": { hash: "6f03e6f07d2c3ccb6f07b8cff25a61c6aa171978c21e047e7e5bde6d59a55a95", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rawTimeBound_le": { hash: "1f5b4b6aba2ef19cb2d00f3d4a8034fb373af2f0b9e42e77776d05d382de22f9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rule_source_ne_acceptState": { hash: "2680d200f12429c24181bbd3ceebffc458ce87bcf5576736cbbd14682148f650", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rules_length": { hash: "90c9ee2b4c8f6c59cd7a874247eb17cab7b13f027144d6ff2740b858f08df212", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rules_pairwise_query_distinct": { hash: "d0a539543395dd1c61d6d1e3e4237dca39a506b16cd5f0fad05046ed5adfbe18", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.run_compile_exact": { hash: "7a20d408c5d1624c1fbbafefd13edb341cc12a7acd664b95d6f41ad3dd2b35b2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.run_compile_rawTimeBound": { hash: "398617fbb0c7bc751ccc113c71eb75472be57529af22ba9bf28016b71b17cfac", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.run_compile_rawTimeBound_blankEquivalent": { hash: "52a226cd176235f1ccca2d1dae1a6d63305c0733729a31589e1d66119aa2dbe4", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.secondConstraintFirstLiteralFirstUnaryTokens_eq_canonical_formula_prefix": { hash: "ff15ebc6a122abed84e8fe38fc3d9e55fb0efd4f80184141bfac80374a89d59d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_firstUnaryUnit_step": { hash: "6ab52101aee962214fe478e157f56d7da16f8601b8b6f96535f667080c595caf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_next_step": { hash: "f4c460e1b4cfebe42c00214dbc88602b0736be6fc0bcaaeb0f986fad6cb5e13f", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.suffix_workRunExact": { hash: "b5371c5a0845a73d4472a0d9604e9674fcc7d27a12492d804352ea2c483287a2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.trueTokenCursor_launch_workStep": { hash: "2e422a55440b705cd18ba767d0b7948d3837b90565bede7426974eea0e38837a", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.workBoundedDecide_accept": { hash: "a6345a7531ffdd7faf4fdd9658c70c5d3811970a33649d1cd4d50603f725fd3e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.workRunExact": { hash: "7c5d577bd40c86ab833dd83f890f2abf9a831bd46a599cf2a40ebb3f6c8aa573", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.work_one_step_short_timeout": { hash: "31ead161b9a3da5ea25282d27e2469230e3a46d3321932df3ad1454e84451f28", axioms: ["Quot.sound","propext"] },
};

const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.workRunExact",
  PrefixWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.prefix_workRunExact",
  AppenderWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.appender_workRunExact",
  CursorWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.cursor_workRunExact",
  SuffixWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.suffix_workRunExact",
  FirstUnaryUnitSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_firstUnaryUnit_step",
  NextSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_next_step",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralFirstUnary",
  CanonicalPrefixTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.secondConstraintFirstLiteralFirstUnaryTokens_eq_canonical_formula_prefix",
  FinalCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_three",
  NextTokenTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.nextTokenSlot_direct_eq_t",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rules_pairwise_query_distinct",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.boundedDecide_compile_ne_timeout",
  PrefixEndpointTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.prefixEndpoint_before_launch_timeout",
  AppenderEndpointTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.appenderEndpoint_before_cursor_launch_timeout",
  MalformedAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.malformedAppenderOutput_timeout",
  MalformedAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.malformedAppenderTally_timeout",
  MalformedCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.malformedCursorScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.work_one_step_short_timeout",
};


const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_THEOREMS = {
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep": { hash: "681cac71bc2a0b9c3c42250a3b3e4ef28bb743f8b409b0b440a64230655eabaf", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead": { hash: "bfde87bc9e3bc501eb3ca0f3edb197ab2b120fef845b632574bdf14209c72292", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState": { hash: "8751719f745f8345308450a6fa63c4555415c822188cbbcac76ae752890895e8", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState": { hash: "11ea0df62f1691605a85227e5f0b315f3232a811aac074053c18d465743d560b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length": { hash: "54722218e5109a54d5d89bcf6b9011921f507daba1452870f0f22142f426de1d", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct": { hash: "f01f1614a6efad7479051b52b3f910046c73ad4c6b60f7275a62b0cdec42731e", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.appenderEndpoint_before_cursor_launch_timeout": { hash: "188c9eaed1b69b978b400e124567a56f500b8c9fee2fd0b9ca329bf24c9d43c7", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.appender_workRunExact": { hash: "832c562b513eb035807ea8661ec2c202a06767f2a6198d2920ae1a1e572f16ff", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.boundedDecide_compile_accept": { hash: "17530db2d3c40ef42d646476b5e685fbcf7fda0f6d9afb10e5aea0ee2bde2f03", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.boundedDecide_compile_ne_timeout": { hash: "6a998c1fc677ac70b2b351de7c192215245f4a5982f4e30725505ad228f878cc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.cursor_workRunExact": { hash: "c6a4b687a532aeb601750c5a112b630dd982ed46f02ca864655f17e6a1327c0b", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalConfiguration_state": { hash: "bb69f5be6b17acde136d518285cfa1bc3b099ed90c6436d1d93fedfef4bba8b2", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalOutside_contains_finalTokenSlot": { hash: "acc4d26ae12d81c4ae39fba088879eec3c3c89df42b9117f0ceff0cb99b220b2", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTape_represents": { hash: "b559ffa7b239024986fd2b169711719a208983f929eb2424247c78735903aa6b", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSecondUnary": { hash: "2974125ede1c2e47afbf40c541a119f87a7f5f162e37fb5300615ca922a03c22", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_four": { hash: "f113f0e388bbbd7c2f1f00b544d7ab8d6ff6b73145a7d9696c5720cf6b29bb71", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.machine_acceptState_ne_rejectState": { hash: "3c7aafaab1f5418993bb673821a266119578a124e1cb597076b13cbbdb17ee8c", axioms: [] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.malformedAppenderOutput_timeout": { hash: "72fef2c4eeaba5da1f119792262bc49df5a50d46577e83f8e5ab1afc68f928ac", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.malformedAppenderTally_timeout": { hash: "24a29de0433b48d7e97ec92d529354128d6be6e8fea45f821e370c0d44b707e1", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.malformedCursorScratch_timeout": { hash: "d927f06e68549c2ac08deeb1dde0ada923539615530942b8e9c3a665bc73ae8a", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.nextTokenSlot_direct_eq_t": { hash: "52988dc63b205bab3a88bad7b1a4d01504c5f906eb8cc3aea6aaa74808782c22", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.prefixEndpoint_before_launch_timeout": { hash: "bb8c78a985e3669835a23715b0a9d49bdf38fca895abf4bce77de906c85c08c9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.prefixSecondUnaryUnit_launch_workStep": { hash: "ed9c52ba21828eb59bb637386a5d691cab70d4c502bb0cf1ee42c7c4fc18df04", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.prefix_workRunExact": { hash: "3ed86570abe8dcc9e93988ede991e2eb39dae5cd2196029091920a7f280e82f8", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rawTimeBound_eval": { hash: "d643e78ba28a49ba8d2d336519d0deb0ae466b9b1d4adbc6eb75f5ec61137400", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rawTimeBound_le": { hash: "d0695eaa1b89abbed5291046885ac1709846b4831c59ac62277ef57a756667a0", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rule_source_ne_acceptState": { hash: "b73cb0591bc91da3d385b1164c3729b46aa4fba2265a8df6fc20b9d596620a86", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rules_length": { hash: "1e53c32294940518e2fd94d6e425875f14f217508cf99d6ff98d810ef14debae", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rules_pairwise_query_distinct": { hash: "9d48fa37e146750f01c0b3e44af25871c9a1c64d610bf19f195cdfa2a0c481fa", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.run_compile_exact": { hash: "3e597828167ea8c553894ca1058b06b053050c8b7b8ed42e3f9bc0e5b0a161db", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.run_compile_rawTimeBound": { hash: "5641619775501350b6dcf7a7f8eafbf55519983b57109c00e8ae6cd4465225e9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.run_compile_rawTimeBound_blankEquivalent": { hash: "bf53444d3af1dface5402e4e353fc66d6b1b1fb6d95bac97777e71125a1f9ef9", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.secondConstraintFirstLiteralSecondUnaryTokens_eq_canonical_formula_prefix": { hash: "532a808fb1343c01516b82ca4fe05e6f751279cefac1db4c5210b79a35846bfc", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_next_step": { hash: "2a63af90255dc91a0fef730c86f24be76f27db9933038f64b10cf9b71b411df2", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_secondUnaryUnit_step": { hash: "01e4378db430e69cac4c38e188296a82f7235bb16d500597dbf670590c6d0219", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.suffix_workRunExact": { hash: "1c3df210d82b91f5c819a2d18781c9e672cf5964d8693763610220612bdb2b23", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.trueTokenCursor_launch_workStep": { hash: "d114481a7ee93822114ce2636635b47605d27bd41555492219f7d931a695eb2c", axioms: ["propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.workBoundedDecide_accept": { hash: "0f99ed0efceff149893496e1cb53f89a2934dce1868225ebd2ffc38b2db78761", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.workRunExact": { hash: "4fd9b288b5a39394fe80019ec3454ab6c73c621079ba373515ae5d92de577740", axioms: ["Quot.sound","propext"] },
  "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.work_one_step_short_timeout": { hash: "05fdec813a799f702ade75f1ef2bdbb928634cf4116936fd0c384bbebec2fe87", axioms: ["Quot.sound","propext"] },
};

const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_RELEASE_IDENTITIES = {
  ExactWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.workRunExact",
  PrefixWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.prefix_workRunExact",
  AppenderWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.appender_workRunExact",
  CursorWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.cursor_workRunExact",
  SuffixWorkRunTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.suffix_workRunExact",
  SecondUnaryUnitSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_secondUnaryUnit_step",
  NextSpecificationTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_next_step",
  FormulaBitsTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSecondUnary",
  CanonicalPrefixTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.secondConstraintFirstLiteralSecondUnaryTokens_eq_canonical_formula_prefix",
  FinalCoordinateTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_four",
  NextTokenTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.nextTokenSlot_direct_eq_t",
  RulesLengthTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rules_length",
  RulesDistinctTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rules_pairwise_query_distinct",
  CompiledExactTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.run_compile_exact",
  CompiledBoundTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.run_compile_rawTimeBound",
  AcceptTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.boundedDecide_compile_accept",
  NoTimeoutTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.boundedDecide_compile_ne_timeout",
  PrefixEndpointTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.prefixEndpoint_before_launch_timeout",
  AppenderEndpointTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.appenderEndpoint_before_cursor_launch_timeout",
  MalformedAppenderOutputTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.malformedAppenderOutput_timeout",
  MalformedAppenderTallyTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.malformedAppenderTally_timeout",
  MalformedCursorScratchTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.malformedCursorScratch_timeout",
  OneStepShortTheorem: "PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.work_one_step_short_timeout",
};

const EXPECTED_FILES = [
  {
    path: "downloads/canonical_proof_report.pdf",
    bytes: 367190,
    sha256: "fd3eedb22d4720f9c9bd2ff78edad54769465e39367c32ed64a7607dd0a57154",
    role: "current inventory-derived fifty-page formal-reconstruction report PDF"
  },
  {
    path: "downloads/canonical-proof-report.pdf",
    bytes: 367190,
    sha256: "fd3eedb22d4720f9c9bd2ff78edad54769465e39367c32ed64a7607dd0a57154",
    role: "exact hyphenated alias of current formal-reconstruction report PDF"
  },
  {
    path: "downloads/canonical_proof_report.tex",
    bytes: 114678,
    sha256: "825a9bf595288bc1f8021055c6965f5527c81c5b5a2b009c6d56698a350ec01a",
    role: "current inventory-derived formal-reconstruction report TeX"
  },
  {
    path: "downloads/canonical-proof-report.tex",
    bytes: 114678,
    sha256: "825a9bf595288bc1f8021055c6965f5527c81c5b5a2b009c6d56698a350ec01a",
    role: "exact hyphenated alias of current formal-reconstruction report TeX"
  },
  {
    path: "public/pnp-status.json",
    bytes: 1226926,
    sha256: "62645e7d64131ca2f2e1cfd5e67f5c6eb011022b9982c6df7beb1157c477ee2b",
    role: "exact current core formal-reconstruction status mirror"
  },
  {
    path: "public/pnp-theorem-inventory.json",
    bytes: 8132004,
    sha256: "232f95a1046a175eab3cecaaec3a0a9ed67515d123d407ddb08a813654d0f5a0",
    role: "exact current compiled Lean theorem inventory mirror"
  },
  {
    path: "downloads/formal-publication-release.json",
    bytes: 432112,
    sha256: "c444f56f40d5b5f494b372fa96cdcf29dab7774b9e5e9681c3d40793d45108a1",
    role: "current formal-publication release identity and fail-closed boundary"
  },
  {
    path: "downloads/source-checker-release.json",
    bytes: 1272,
    sha256: "c601c9ab282b3d9f9c98c1680cbc8c5592726032a0d79785a3edd80ce1d76441",
    role: "quarantined historical 7072f8d coordinate; never current theorem evidence"
  }
];

function fail(message) {
  throw new Error(message);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function milestoneTheoremKernelTypeSha256(name, kernelType) {
  return sha256(Buffer.from(
    `PNP-FORMAL-PUBLICATION-FINGERPRINT-v0\nleanprover/lean4:v4.31.0\n` +
    `milestone-theorem-type:${name}\n${kernelType}`, "utf8"
  ));
}

function exactKeys(value, expected, label) {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    fail(`${label}: keys ${actual.join(",")} do not match ${wanted.join(",")}`);
  }
}

function readCheckedFile(root, relativePath) {
  if (path.isAbsolute(relativePath) || relativePath.includes("\\")) {
    fail(`${relativePath}: release path must be a portable relative path`);
  }
  const resolved = path.resolve(root, relativePath);
  if (!resolved.startsWith(`${path.resolve(root)}${path.sep}`)) {
    fail(`${relativePath}: release path escapes repository root`);
  }
  const info = lstatSync(resolved);
  if (!info.isFile() || info.isSymbolicLink()) {
    fail(`${relativePath}: release entry must be a regular non-symlink file`);
  }
  return { buffer: readFileSync(resolved), bytes: info.size };
}

function parseJson(buffer, label) {
  try {
    return JSON.parse(buffer.toString("utf8"));
  } catch (error) {
    fail(`${label}: invalid JSON: ${error.message}`);
  }
}

function parseLedger(buffer) {
  const entries = [];
  const seen = new Set();
  for (const line of buffer.toString("utf8").split(/\r?\n/)) {
    if (line === "") continue;
    const match = line.match(/^([0-9a-f]{64})  ([A-Za-z0-9_./-]+)$/);
    if (!match) fail(`malformed SHA256SUMS line: ${line}`);
    if (seen.has(match[2])) fail(`duplicate SHA256SUMS path: ${match[2]}`);
    seen.add(match[2]);
    entries.push({ sha256: match[1], path: match[2] });
  }
  return entries;
}

function assertFailClosedStatus(status) {
  if (status.kind !== "PNPFormalReconstructionStatus0") fail("status kind mismatch");
  if (status.coordinate !== "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-23-73") fail("status coordinate mismatch");
  if (status.publicSurfaceBaselineCoordinate !== "PUBLIC-SURFACE-BASELINE-2026-07-23-COOK-LEVIN-BUILDER-SECOND-CONSTRAINT-FIRST-LITERAL-SECOND-UNARY-UNIT-STEP-72") fail("status public-surface coordinate mismatch");
  if (status.formalPublicationMapCoordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-23-73" || status.formalPublicationMapSha256 !== "bc674f2bc27576f0a40252eea49eb1a9fa51e5d3d11d518649ed3a7d26f8d415" || status.leanSourceClosureSha256 !== "f9b89038ba5eceee5e884ade0f8856cadef01ffa2513c5814c587e48820e2a59") fail("status source identity mismatch");
  if (status.currentStatusAuthority !== true) fail("status must be current authority");
  if (status.publicationStatusDerivedOnlyFromConcreteGate !== true) fail("status must derive publication only from the concrete gate");
  if (status.concretePublicationGate?.passed !== false) fail("concrete publication gate must remain false");
  if (status.mathematicalTheoremEstablished !== false) fail("mathematical theorem must remain unestablished");
  if (status.publicTheoremEmissionAllowed !== false) fail("public theorem emission must remain denied");
  if (status.publicTheoremStatement !== null) fail("public theorem statement must remain null");
  if (status.rootLeanTheoremPresent !== false) fail("root Lean theorem must remain absent");
  if (status.projectSpecificAxiomsRemaining !== true) fail("project-specific axioms must remain disclosed");
  if (!Array.isArray(status.remainingBlockers) || status.remainingBlockers.length !== 6) fail("status must retain all six formal blockers");
  if (status.leanConcreteCNFSATMembershipFormalized !== true || status.leanConcreteCNFSATMembershipTheorem !== "PNP.Concrete.FinalUniversalDesign.cnfSATInNP") fail("status CNF-SAT NP-membership theorem mismatch");
  if (status.leanConcreteCNFWorkAxiomAuditPassed !== true || status.leanConcreteCNFWorkAuditedDeclarationCount !== 766) fail("status CNF work audit mismatch");
  if (status.leanConcretePipelineStateNamespaceFormalized !== true || status.leanConcretePipelineStateNamespaceAxiomAuditPassed !== true || status.leanConcretePipelineStateNamespaceAuditedDeclarationCount !== 39) fail("status pipeline state-namespace boundary mismatch");
  if (status.leanConcretePipelineStageBridgesFormalized !== true || status.leanConcretePipelineStageBridgesAxiomAuditPassed !== true || status.leanConcretePipelineStageBridgesAuditedDeclarationCount !== 56) fail("status pipeline stage-bridge boundary mismatch");
  if (status.leanConcretePipelineStageLaunchFormalized !== true || status.leanConcretePipelineVerdictPreservationFormalized !== true || status.leanConcretePipelineInternalOutputHandoffComposed !== true) fail("status pipeline bridge composition boundary mismatch");
  if (status.leanConcretePipelineTerminalOutputPackingFormalized !== true || status.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed !== true || status.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount !== 69) fail("status terminal-output packer boundary mismatch");
  if (status.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized !== true || status.leanConcretePipelineTerminalBridgeAxiomAuditPassed !== true || status.leanConcretePipelineTerminalBridgeAuditedDeclarationCount !== 59) fail("status terminal-bridge suffix boundary mismatch");
  if (status.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized !== true) fail("status supplied-trace transport boundary mismatch");
  if (status.leanConcretePipelineInputFramerAxiomAuditPassed !== true || status.leanConcretePipelineInputFramerAuditedDeclarationCount !== 70 || status.leanConcretePipelineAllInputFramingFormalized !== true) fail("status all-input framer boundary mismatch");
  if (status.leanConcretePipelinePairedCompilerAxiomAuditPassed !== true || status.leanConcretePipelinePairedCompilerAuditedDeclarationCount !== 28) fail("status canonical-pair compiler audit boundary mismatch");
  if (status.leanConcretePipelineCanonicalPairCompilationFormalized !== true || status.leanConcretePipelineExternalInputSizePolynomialFormalized !== true) fail("status canonical-pair compiler boundary mismatch");
  if (status.leanConcretePipelineCompilerAxiomAuditPassed !== true || status.leanConcretePipelineCompilerAuditedDeclarationCount !== 29 || status.leanConcretePipelineAllInputCompilationFormalized !== true) fail("status all-input compiler audit boundary mismatch");
  if (status.leanConcretePipelineMalformedInputBehaviorFormalized !== true || status.leanConcretePipelineRawRefinementFormalized !== true) fail("status all-input compiler boundary mismatch");
  if (status.leanConcretePipelineSequentialNamespaceFormalized !== true || status.leanConcretePipelineSequentialNamespaceAxiomAuditPassed !== true || status.leanConcretePipelineSequentialNamespaceAuditedDeclarationCount !== 26) fail("status sequential namespace boundary mismatch");
  if (status.leanConcretePipelineSequentialCompilationFormalized !== true || status.leanConcretePipelineSequentialCompilerAxiomAuditPassed !== true || status.leanConcretePipelineSequentialCompilerAuditedDeclarationCount !== 31 || status.leanConcretePipelineSequentialVerdictAndOutputPreservationFormalized !== true || status.leanConcretePipelineSequentialExternalInputSizePolynomialFormalized !== true || status.leanConcretePipelineSequentialStuckFirstTimeoutFormalized !== true) fail("status sequential compiler boundary mismatch");
  if (status.leanConcretePipelineRefinementAxiomAuditPassed !== true || status.leanConcretePipelineRefinementAuditedDeclarationCount !== 16 || status.leanConcreteFunctionProgramRecursiveCompilationFormalized !== true || status.leanConcreteDecisionProgramRecursiveCompilationFormalized !== true || status.leanConcretePolynomialTimeDeciderRawCompilationFormalized !== true || status.standardComplexityModelFormalized !== true) fail("status recursive refinement boundary mismatch");
  const formulaSizeMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-size");
  if (!formulaSizeMilestone || formulaSizeMilestone.earned !== true || formulaSizeMilestone.allPresent !== true || formulaSizeMilestone.allKernelTypesMatch !== true || formulaSizeMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true) fail("status Cook-Levin formula-size boundary mismatch");
  const formulaScheduleMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-schedule");
  if (!formulaScheduleMilestone || formulaScheduleMilestone.earned !== true || formulaScheduleMilestone.allPresent !== true || formulaScheduleMilestone.allKernelTypesMatch !== true || formulaScheduleMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true) fail("status Cook-Levin formula-schedule boundary mismatch");
  const formulaCursorMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-cursor");
  if (!formulaCursorMilestone || formulaCursorMilestone.earned !== true || formulaCursorMilestone.allPresent !== true || formulaCursorMilestone.allKernelTypesMatch !== true || formulaCursorMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || formulaCursorMilestone.requiredTheorems?.length !== 16) fail("status Cook-Levin formula-cursor boundary mismatch");
  const builderMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-input-length");
  if (!builderMilestone || builderMilestone.earned !== true || builderMilestone.allPresent !== true || builderMilestone.allKernelTypesMatch !== true || builderMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || builderMilestone.requiredTheorems?.length !== 10) fail("status Cook-Levin builder input-length boundary mismatch");
  if (status.leanConcreteCookLevinBuilderInputLengthFormalized !== true || status.leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderInputLengthAuditedDeclarationCount !== 39 || status.leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized !== true) fail("status Cook-Levin builder input-length evidence mismatch");
  const builderPrefixMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-input-prefix");
  if (!builderPrefixMilestone || builderPrefixMilestone.earned !== true || builderPrefixMilestone.allPresent !== true || builderPrefixMilestone.allKernelTypesMatch !== true || builderPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || builderPrefixMilestone.requiredTheorems?.length !== 14) fail("status Cook-Levin builder input-prefix boundary mismatch");
  if (status.leanConcreteCookLevinBuilderInputPrefixFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderInputPrefixAuditedDeclarationCount !== 40 || status.leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized !== true) fail("status Cook-Levin builder input-prefix evidence mismatch");
  const builderTokenMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-token-appender");
  if (!builderTokenMilestone || builderTokenMilestone.earned !== true || builderTokenMilestone.allPresent !== true || builderTokenMilestone.allKernelTypesMatch !== true || builderTokenMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || builderTokenMilestone.requiredTheorems?.length !== 17) fail("status Cook-Levin builder token-appender boundary mismatch");
  if (status.leanConcreteCookLevinBuilderTokenAppenderFormalized !== true || status.leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderTokenAppenderAuditedDeclarationCount !== 68 || status.leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized !== true || status.leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed !== true) fail("status Cook-Levin builder token-appender evidence mismatch");
  const firstTokenMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-token-prefix");
  if (!firstTokenMilestone || firstTokenMilestone.earned !== true || firstTokenMilestone.allPresent !== true || firstTokenMilestone.allKernelTypesMatch !== true || firstTokenMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstTokenMilestone.requiredTheorems?.length !== 25) fail("status Cook-Levin builder first-token-prefix boundary mismatch");
  if (status.leanConcreteCookLevinBuilderFirstTokenPrefixFormalized !== true || status.leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFirstTokenPrefixAuditedDeclarationCount !== 37 || status.leanConcreteCookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized !== true) fail("status Cook-Levin builder first-token-prefix evidence mismatch");
  const completeHeaderMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-complete-header");
  if (!completeHeaderMilestone || completeHeaderMilestone.earned !== true || completeHeaderMilestone.allPresent !== true || completeHeaderMilestone.allKernelTypesMatch !== true || completeHeaderMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || completeHeaderMilestone.requiredTheorems?.length !== 48) fail("status Cook-Levin builder complete-header boundary mismatch");
  if (status.leanConcreteCookLevinBuilderUnaryPolynomialFormalized !== true || status.leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderUnaryPolynomialAuditedDeclarationCount !== 74 || status.leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized !== true) fail("status Cook-Levin builder unary-polynomial evidence mismatch");
  if (status.leanConcreteCookLevinBuilderCompleteHeaderFormalized !== true || status.leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderCompleteHeaderAuditedDeclarationCount !== 84 || status.leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderCompleteHeaderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder complete-header evidence mismatch");
  const bodyStartMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-body-start-prefix");
  if (!bodyStartMilestone || bodyStartMilestone.earned !== true || bodyStartMilestone.allPresent !== true || bodyStartMilestone.allKernelTypesMatch !== true || bodyStartMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || bodyStartMilestone.requiredTheorems?.length !== 42) fail("status Cook-Levin builder body-start-prefix boundary mismatch");
  if (status.leanConcreteCookLevinBuilderBodyStartPrefixFormalized !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixAuditedDeclarationCount !== 60 || status.leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder body-start-prefix evidence mismatch");
  const firstLiteralMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-literal-prefix");
  if (!firstLiteralMilestone || firstLiteralMilestone.earned !== true || firstLiteralMilestone.allPresent !== true || firstLiteralMilestone.allKernelTypesMatch !== true || firstLiteralMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstLiteralMilestone.requiredTheorems?.length !== 53) fail("status Cook-Levin builder first-literal-prefix boundary mismatch");
  if (status.leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount !== 74 || status.leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder first-literal-prefix evidence mismatch");
  const firstClauseMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-clause-prefix");
  if (!firstClauseMilestone || firstClauseMilestone.earned !== true || firstClauseMilestone.allPresent !== true || firstClauseMilestone.allKernelTypesMatch !== true || firstClauseMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstClauseMilestone.requiredTheorems?.length !== 43) fail("status Cook-Levin builder first-clause-prefix boundary mismatch");
  if (status.leanConcreteCookLevinBuilderFirstClausePrefixFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixAuditedDeclarationCount !== 79 || status.leanConcreteCookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder first-clause-prefix evidence mismatch");
  const dynamicTokenCursorMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-dynamic-token-cursor-step");
  if (!dynamicTokenCursorMilestone || dynamicTokenCursorMilestone.earned !== true || dynamicTokenCursorMilestone.allPresent !== true || dynamicTokenCursorMilestone.allKernelTypesMatch !== true || dynamicTokenCursorMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || dynamicTokenCursorMilestone.requiredTheorems?.length !== 31) fail("status Cook-Levin builder dynamic-token-cursor-step boundary mismatch");
  if (status.leanConcreteCookLevinBuilderFirstClausePaddingRunFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount !== 84 || status.leanConcreteCookLevinBuilderFirstClausePaddingRunCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePaddingRunExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized !== true || status.leanConcreteCookLevinBuilderFirstClausePaddingRunInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderFirstClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder first-clause-padding-run evidence mismatch");
  const firstClausePaddingRunMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-clause-padding-run");
  if (!firstClausePaddingRunMilestone || firstClausePaddingRunMilestone.earned !== true || firstClausePaddingRunMilestone.allPresent !== true || firstClausePaddingRunMilestone.allKernelTypesMatch !== true || firstClausePaddingRunMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstClausePaddingRunMilestone.requiredTheorems?.length !== 48) fail("status Cook-Levin builder first-clause-padding-run milestone mismatch");
  if (status.leanConcreteCookLevinBuilderDynamicTokenCursorStepFormalized !== true || status.leanConcreteCookLevinBuilderDynamicTokenCursorStepAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderDynamicTokenCursorStepAuditedDeclarationCount !== 47 || status.leanConcreteCookLevinBuilderDynamicTokenCursorStepCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderDynamicTokenCursorStepExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderDynamicTokenCursorStepDirectPaddingOutcomeFormalized !== true || status.leanConcreteCookLevinBuilderDynamicTokenCursorStepRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderDynamicTokenCursorStepInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicTokenCursorStepFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderDynamicTokenCursorStepSinglePaddingStepFormalized !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder dynamic-token-cursor-step evidence mismatch");
  const secondClauseSeparatorStepMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-second-clause-separator-step");
  if (!secondClauseSeparatorStepMilestone || secondClauseSeparatorStepMilestone.earned !== true || secondClauseSeparatorStepMilestone.allPresent !== true || secondClauseSeparatorStepMilestone.allKernelTypesMatch !== true || secondClauseSeparatorStepMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondClauseSeparatorStepMilestone.requiredTheorems?.length !== 40) fail("status Cook-Levin builder second-clause-separator-step milestone mismatch");
  if (status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount !== 56 || status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder second-clause-separator-step evidence mismatch");
  const secondClauseFirstLiteralPrefixMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-second-clause-first-literal-prefix");
  if (!secondClauseFirstLiteralPrefixMilestone || secondClauseFirstLiteralPrefixMilestone.earned !== true || secondClauseFirstLiteralPrefixMilestone.allPresent !== true || secondClauseFirstLiteralPrefixMilestone.allKernelTypesMatch !== true || secondClauseFirstLiteralPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondClauseFirstLiteralPrefixMilestone.requiredTheorems?.length !== 58) fail("status Cook-Levin builder second-clause-first-literal-prefix milestone mismatch");
  if (status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount !== 87 || status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder second-clause-first-literal-prefix evidence mismatch");
  const secondClauseSecondLiteralPrefixMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-second-clause-second-literal-prefix");
  if (!secondClauseSecondLiteralPrefixMilestone || secondClauseSecondLiteralPrefixMilestone.earned !== true || secondClauseSecondLiteralPrefixMilestone.allPresent !== true || secondClauseSecondLiteralPrefixMilestone.allKernelTypesMatch !== true || secondClauseSecondLiteralPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondClauseSecondLiteralPrefixMilestone.requiredTheorems?.length !== 75) fail("status Cook-Levin builder second-clause-second-literal-prefix milestone mismatch");
  if (status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount !== 115 || status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder second-clause-second-literal-prefix evidence mismatch");
  const secondClausePrefixMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-second-clause-prefix");
  if (!secondClausePrefixMilestone || secondClausePrefixMilestone.earned !== true || secondClausePrefixMilestone.allPresent !== true || secondClausePrefixMilestone.allKernelTypesMatch !== true || secondClausePrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondClausePrefixMilestone.requiredTheorems?.length !== 41) fail("status Cook-Levin builder second-clause-prefix milestone mismatch");
  if (status.leanConcreteCookLevinBuilderSecondClausePrefixFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderSecondClausePrefixAuditedDeclarationCount !== 57 || status.leanConcreteCookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePrefixClauseTerminatorFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized !== true) fail("status Cook-Levin builder second-clause-prefix evidence mismatch");
  const secondClausePaddingRunMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-second-clause-padding-run");
  if (!secondClausePaddingRunMilestone || secondClausePaddingRunMilestone.earned !== true || secondClausePaddingRunMilestone.allPresent !== true || secondClausePaddingRunMilestone.allKernelTypesMatch !== true || secondClausePaddingRunMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondClausePaddingRunMilestone.requiredTheorems?.length !== 39) fail("status Cook-Levin builder second-clause-padding-run boundary mismatch");
  if (status.leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePaddingRunAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount !== 68 || status.leanConcreteCookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized !== true || status.leanConcreteCookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder second-clause-padding-run evidence mismatch");
  const thirdClauseSeparatorStepMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-third-clause-separator-step");
  if (!thirdClauseSeparatorStepMilestone || thirdClauseSeparatorStepMilestone.earned !== true || thirdClauseSeparatorStepMilestone.allPresent !== true || thirdClauseSeparatorStepMilestone.allKernelTypesMatch !== true || thirdClauseSeparatorStepMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || thirdClauseSeparatorStepMilestone.requiredTheorems?.length !== 40) fail("status Cook-Levin builder third-clause-separator-step boundary mismatch");
  if (status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount !== 56 || status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder third-clause-separator-step evidence mismatch");
  const thirdClauseFirstLiteralPrefixMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-third-clause-first-literal-prefix");
  if (!thirdClauseFirstLiteralPrefixMilestone || thirdClauseFirstLiteralPrefixMilestone.earned !== true || thirdClauseFirstLiteralPrefixMilestone.allPresent !== true || thirdClauseFirstLiteralPrefixMilestone.allKernelTypesMatch !== true || thirdClauseFirstLiteralPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || thirdClauseFirstLiteralPrefixMilestone.requiredTheorems?.length !== 58) fail("status Cook-Levin builder third-clause-first-literal-prefix boundary mismatch");
  if (status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount !== 87 || status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder third-clause-first-literal-prefix evidence mismatch");
  const thirdClauseSecondLiteralPrefixMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-third-clause-second-literal-prefix");
  if (!thirdClauseSecondLiteralPrefixMilestone || thirdClauseSecondLiteralPrefixMilestone.earned !== true || thirdClauseSecondLiteralPrefixMilestone.allPresent !== true || thirdClauseSecondLiteralPrefixMilestone.allKernelTypesMatch !== true || thirdClauseSecondLiteralPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || thirdClauseSecondLiteralPrefixMilestone.requiredTheorems?.length !== 92) fail("status Cook-Levin builder third-clause-second-literal-prefix boundary mismatch");
  if (status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount !== 145 || status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder third-clause-second-literal-prefix evidence mismatch");
  const thirdClausePrefixMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-third-clause-prefix");
  if (!thirdClausePrefixMilestone || thirdClausePrefixMilestone.earned !== true || thirdClausePrefixMilestone.allPresent !== true || thirdClausePrefixMilestone.allKernelTypesMatch !== true || thirdClausePrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || thirdClausePrefixMilestone.requiredTheorems?.length !== 41) fail("status Cook-Levin builder third-clause-prefix boundary mismatch");
  if (status.leanConcreteCookLevinBuilderThirdClausePrefixFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderThirdClausePrefixAuditedDeclarationCount !== 57 || status.leanConcreteCookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePrefixClauseTerminatorFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder third-clause-prefix evidence mismatch");
  const thirdClausePaddingRunMilestone = status.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-third-clause-padding-run");
  if (!thirdClausePaddingRunMilestone || thirdClausePaddingRunMilestone.earned !== true || thirdClausePaddingRunMilestone.allPresent !== true || thirdClausePaddingRunMilestone.allKernelTypesMatch !== true || thirdClausePaddingRunMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || thirdClausePaddingRunMilestone.requiredTheorems?.length !== 39) fail("status Cook-Levin builder third-clause-padding-run boundary mismatch");
  if (status.leanConcreteCookLevinBuilderThirdClausePaddingRunFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePaddingRunAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount !== 68 || status.leanConcreteCookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized !== true || status.leanConcreteCookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder third-clause-padding-run evidence mismatch");
  const fourthClauseSeparatorStepMilestone = status.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-fourth-clause-separator-step");
  if (!fourthClauseSeparatorStepMilestone || fourthClauseSeparatorStepMilestone.earned !== true || fourthClauseSeparatorStepMilestone.allPresent !== true || fourthClauseSeparatorStepMilestone.allKernelTypesMatch !== true || fourthClauseSeparatorStepMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || fourthClauseSeparatorStepMilestone.requiredTheorems?.length !== 40) fail("status Cook-Levin builder fourth-clause-separator-step boundary mismatch");
  if (status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount !== 56 || status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder fourth-clause-separator-step evidence mismatch");
  const fourthClauseFirstLiteralPrefixMilestone = status.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-fourth-clause-first-literal-prefix");
  if (!fourthClauseFirstLiteralPrefixMilestone || fourthClauseFirstLiteralPrefixMilestone.earned !== true || fourthClauseFirstLiteralPrefixMilestone.allPresent !== true || fourthClauseFirstLiteralPrefixMilestone.allKernelTypesMatch !== true || fourthClauseFirstLiteralPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || fourthClauseFirstLiteralPrefixMilestone.requiredTheorems?.length !== 75) fail("status Cook-Levin builder fourth-clause-first-literal-prefix boundary mismatch");
  if (status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount !== 115 || status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder fourth-clause-first-literal-prefix evidence mismatch");
  const fourthClauseSecondLiteralPrefixMilestone = status.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-fourth-clause-second-literal-prefix");
  if (!fourthClauseSecondLiteralPrefixMilestone || fourthClauseSecondLiteralPrefixMilestone.earned !== true || fourthClauseSecondLiteralPrefixMilestone.allPresent !== true || fourthClauseSecondLiteralPrefixMilestone.allKernelTypesMatch !== true || fourthClauseSecondLiteralPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || fourthClauseSecondLiteralPrefixMilestone.requiredTheorems?.length !== 92) fail("status Cook-Levin builder fourth-clause-second-literal-prefix boundary mismatch");
  if (status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount !== 147 || status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder fourth-clause-second-literal-prefix evidence mismatch");
  const fourthClausePrefixMilestone = status.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-fourth-clause-prefix");
  if (!fourthClausePrefixMilestone || fourthClausePrefixMilestone.earned !== true || fourthClausePrefixMilestone.allPresent !== true || fourthClausePrefixMilestone.allKernelTypesMatch !== true || fourthClausePrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || fourthClausePrefixMilestone.requiredTheorems?.length !== 41) fail("status Cook-Levin builder fourth-clause-prefix boundary mismatch");
  if (status.leanConcreteCookLevinBuilderFourthClausePrefixFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePrefixAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFourthClausePrefixAuditedDeclarationCount !== 57 || status.leanConcreteCookLevinBuilderFourthClausePrefixCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePrefixExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePrefixExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePrefixInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder fourth-clause-prefix evidence mismatch");
  const fourthClausePaddingRunMilestone = status.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-fourth-clause-padding-run");
  if (!fourthClausePaddingRunMilestone || fourthClausePaddingRunMilestone.earned !== true || fourthClausePaddingRunMilestone.allPresent !== true || fourthClausePaddingRunMilestone.allKernelTypesMatch !== true || fourthClausePaddingRunMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || fourthClausePaddingRunMilestone.requiredTheorems?.length !== 39) fail("status Cook-Levin builder fourth-clause-padding-run boundary mismatch");
  if (status.leanConcreteCookLevinBuilderFourthClausePaddingRunFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePaddingRunAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFourthClausePaddingRunAuditedDeclarationCount !== 68 || status.leanConcreteCookLevinBuilderFourthClausePaddingRunCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePaddingRunExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePaddingRunExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePaddingRunRemainingPaddingCountFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePaddingRunDirectPaddingBlockFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized !== true || status.leanConcreteCookLevinBuilderFourthClausePaddingRunInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderFourthClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder fourth-clause-padding-run evidence mismatch");
  const fifthClausePaddingRunMilestone = status.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-fifth-clause-padding-run");
  if (!fifthClausePaddingRunMilestone || fifthClausePaddingRunMilestone.earned !== true || fifthClausePaddingRunMilestone.allPresent !== true || fifthClausePaddingRunMilestone.allKernelTypesMatch !== true || fifthClausePaddingRunMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || fifthClausePaddingRunMilestone.requiredTheorems?.length !== 39) fail("status Cook-Levin builder fifth-clause-padding-run boundary mismatch");
  if (status.leanConcreteCookLevinBuilderFifthClausePaddingRunFormalized !== true || status.leanConcreteCookLevinBuilderFifthClausePaddingRunAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFifthClausePaddingRunAuditedDeclarationCount !== 68 || status.leanConcreteCookLevinBuilderFifthClausePaddingRunCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFifthClausePaddingRunExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFifthClausePaddingRunExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFifthClausePaddingRunPaddingCountFormalized !== true || status.leanConcreteCookLevinBuilderFifthClausePaddingRunDirectPaddingBlockFormalized !== true || status.leanConcreteCookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized !== true || status.leanConcreteCookLevinBuilderFifthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized !== true || status.leanConcreteCookLevinBuilderFifthClausePaddingRunInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderFifthClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder fifth-clause-padding-run evidence mismatch");
  const firstConstraintPaddingRunMilestone = status.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-first-constraint-padding-run");
  if (!firstConstraintPaddingRunMilestone || firstConstraintPaddingRunMilestone.earned !== true || firstConstraintPaddingRunMilestone.allPresent !== true || firstConstraintPaddingRunMilestone.allKernelTypesMatch !== true || firstConstraintPaddingRunMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstConstraintPaddingRunMilestone.requiredTheorems?.length !== 39) fail("status Cook-Levin builder first-constraint-padding-run boundary mismatch");
  if (status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunFormalized !== true || status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAxiomAuditPassed !== true || status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAuditedDeclarationCount !== 68 || status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunCompiledRawMachineFormalized !== true || status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunExternalInputSizePolynomialFormalized !== true || status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunExactFormulaBitsFormalized !== true || status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunPaddingCountFormalized !== true || status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunDirectPaddingBlockFormalized !== true || status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunSecondConstraintSeparatorFormalized !== true || status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunRetainedAdvancedTokenCoordinateFormalized !== true || status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunNoEmissionSpecificationFormalized !== true || status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunInputPrefixAppenderComposed !== true || status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunFailClosedBoundaryTimeoutFormalized !== true || status.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || status.leanConcreteCookLevinFormulaBuilderFormalized !== false || status.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || status.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("status Cook-Levin builder first-constraint-padding-run evidence mismatch");
  const secondConstraintSeparatorMilestone = status.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-second-constraint-separator-step");
  if (!secondConstraintSeparatorMilestone || secondConstraintSeparatorMilestone.earned !== true || secondConstraintSeparatorMilestone.allPresent !== true || secondConstraintSeparatorMilestone.allKernelTypesMatch !== true || secondConstraintSeparatorMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondConstraintSeparatorMilestone.requiredTheorems?.length !== 40) fail("status Cook-Levin builder second-constraint-separator-step boundary mismatch");
  if (!(status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAxiomAuditPassed === true && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAuditedDeclarationCount === 56 && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepCompiledRawMachineFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExternalInputSizePolynomialFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExactFormulaBitsFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepSecondConstraintSeparatorFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepRetainedAdvancedTokenCoordinateFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepInputPrefixAppenderComposed === true && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFailClosedBoundaryTimeoutFormalized === true)) fail("status Cook-Levin builder second-constraint-separator-step evidence mismatch");
  const secondConstraintFirstLiteralSignMilestone = status.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-second-constraint-first-literal-sign-step");
  if (!secondConstraintFirstLiteralSignMilestone || secondConstraintFirstLiteralSignMilestone.earned !== true || secondConstraintFirstLiteralSignMilestone.allPresent !== true || secondConstraintFirstLiteralSignMilestone.allKernelTypesMatch !== true || secondConstraintFirstLiteralSignMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondConstraintFirstLiteralSignMilestone.requiredTheorems?.length !== 40) fail("status Cook-Levin builder second-constraint-first-literal-sign-step boundary mismatch");
  if (!(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomAuditPassed === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAuditedDeclarationCount === 56 && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepCompiledRawMachineFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExternalInputSizePolynomialFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExactFormulaBitsFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepSecondConstraintFirstLiteralSignFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepRetainedAdvancedTokenCoordinateFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepInputPrefixAppenderComposed === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFailClosedBoundaryTimeoutFormalized === true)) fail("status Cook-Levin builder second-constraint-first-literal-sign-step evidence mismatch");
  const secondConstraintFirstLiteralFirstUnaryUnitMilestone = status.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-second-constraint-first-literal-first-unary-unit-step");
  if (!secondConstraintFirstLiteralFirstUnaryUnitMilestone || secondConstraintFirstLiteralFirstUnaryUnitMilestone.earned !== true || secondConstraintFirstLiteralFirstUnaryUnitMilestone.allPresent !== true || secondConstraintFirstLiteralFirstUnaryUnitMilestone.allKernelTypesMatch !== true || secondConstraintFirstLiteralFirstUnaryUnitMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondConstraintFirstLiteralFirstUnaryUnitMilestone.requiredTheorems?.length !== 40) fail("status Cook-Levin builder second-constraint-first-literal-first-unary-unit-step boundary mismatch");
  if (!(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomAuditPassed === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAuditedDeclarationCount === 56 && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCompiledRawMachineFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExternalInputSizePolynomialFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactFormulaBitsFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSecondConstraintFirstLiteralFirstUnaryUnitFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepInputPrefixAppenderComposed === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFailClosedBoundaryTimeoutFormalized === true)) fail("status Cook-Levin builder second-constraint-first-literal-first-unary-unit-step evidence mismatch");
  const secondConstraintFirstLiteralSecondUnaryUnitMilestone = status.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-second-constraint-first-literal-second-unary-unit-step");
  if (!secondConstraintFirstLiteralSecondUnaryUnitMilestone || secondConstraintFirstLiteralSecondUnaryUnitMilestone.earned !== true || secondConstraintFirstLiteralSecondUnaryUnitMilestone.allPresent !== true || secondConstraintFirstLiteralSecondUnaryUnitMilestone.allKernelTypesMatch !== true || secondConstraintFirstLiteralSecondUnaryUnitMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondConstraintFirstLiteralSecondUnaryUnitMilestone.requiredTheorems?.length !== 40) fail("status Cook-Levin builder second-constraint-first-literal-second-unary-unit-step boundary mismatch");
  if (!(status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomAuditPassed === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAuditedDeclarationCount === 56 && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCompiledRawMachineFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExternalInputSizePolynomialFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactFormulaBitsFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondConstraintFirstLiteralSecondUnaryUnitFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepInputPrefixAppenderComposed === true && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFailClosedBoundaryTimeoutFormalized === true)) fail("status Cook-Levin builder second-constraint-first-literal-second-unary-unit-step evidence mismatch");
  if (status.leanConcreteCNFSATInPFormalized !== false || status.leanConcreteCNFNPCompletenessFormalized !== false) fail("status overstates the CNF-SAT result");
  if (status.leanTheoremInventorySha256 !== EXPECTED_FILES[5].sha256) fail("status inventory digest mismatch");
}

function assertInventory(inventory) {
  if (inventory.kind !== "PNPLeanTheoremInventory0") fail("inventory kind mismatch");
  if (inventory.coordinate !== "PNP-LEAN-THEOREM-INVENTORY-2026-07-23-73") fail("inventory coordinate mismatch");
  if (inventory.declarationCount !== 10587 || inventory.theoremCount !== 5920) fail("inventory declaration counts mismatch");
  if (inventory.assumptionFreeTheoremCount !== 3344 || inventory.excludedPrivateDeclarationCount !== 4043 || inventory.sourceClosureModuleCount !== 93 || inventory.axiomCount !== 4) fail("inventory theorem/module/axiom counts mismatch");
  if (inventory.compatibilityRootCandidate !== null || inventory.concreteTargetCandidate?.name !== "PNP.Main.ConcretePEqualsNP") fail("inventory publication boundary mismatch");
  if (!Array.isArray(inventory.projectAxioms) || inventory.projectAxioms.length !== 4) fail("inventory must disclose four project axioms");
  const membership = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.FinalUniversalDesign.cnfSATInNP");
  if (!membership || membership.kind !== "theorem" || membership.axioms?.length !== 0) fail("inventory CNF-SAT NP-membership theorem boundary mismatch");
  const cookLevinBridge = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language");
  if (!cookLevinBridge || cookLevinBridge.kind !== "theorem" || cookLevinBridge.module !== "PNP.Concrete.CookLevinRawTapeBridge" || JSON.stringify(cookLevinBridge.axioms) !== JSON.stringify(["Classical.choice", "Quot.sound", "propext"])) fail("inventory Cook-Levin raw-tape theorem boundary mismatch");
  const formulaSize = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le");
  if (!formulaSize || formulaSize.kind !== "theorem" || formulaSize.module !== "PNP.Concrete.CookLevinFormulaSize" || JSON.stringify(formulaSize.axioms) !== JSON.stringify(["Quot.sound", "propext"])) fail("inventory Cook-Levin formula-size theorem boundary mismatch");
  for (const name of [
    "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length",
    "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula"
  ]) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinFormulaSchedule" || JSON.stringify(theorem.axioms) !== JSON.stringify(["Quot.sound", "propext"])) fail(`inventory Cook-Levin formula-schedule theorem mismatch: ${name}`);
  }
  for (const [name, hash] of Object.entries(FORMULA_CURSOR_THEOREM_HASHES)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinFormulaCursor" || JSON.stringify(theorem.axioms) !== JSON.stringify(["Quot.sound", "propext"])) fail(`inventory Cook-Levin formula-cursor theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== hash) fail(`inventory Cook-Levin formula-cursor fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_INPUT_LENGTH_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderInputLength" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder input-length theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder input-length fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_INPUT_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderInputPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder input-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder input-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_TOKEN_APPENDER_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderTokenAppender" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder token-appender theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder token-appender fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_FIRST_TOKEN_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderFirstTokenPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder first-token-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder first-token-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_UNARY_POLYNOMIAL_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderUnaryPolynomial" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder unary-polynomial theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder unary-polynomial fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_COMPLETE_HEADER_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderCompleteHeader" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder complete-header theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder complete-header fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_BODY_START_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderBodyStartPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder body-start-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder body-start-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_FIRST_LITERAL_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderFirstLiteralPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder first-literal-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder first-literal-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_FIRST_CLAUSE_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name === "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rule_source_ne_acceptState"
      ? "PNP.Concrete.CookLevinBuilderFirstLiteralPrefix"
      : "PNP.Concrete.CookLevinBuilderFirstClausePrefix";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder first-clause-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder first-clause-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder dynamic-token-cursor-step theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder dynamic-token-cursor-step fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name === "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact_of_unit_or_separator"
      ? "PNP.Concrete.CookLevinBuilderCompleteHeader"
      : "PNP.Concrete.CookLevinBuilderFirstClausePaddingRun";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder first-clause-padding-run theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder first-clause-padding-run fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : "PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder second-clause-separator-step theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder second-clause-separator-step fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : "PNP.Concrete.CookLevinBuilderSecondClauseFirstLiteralPrefix";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder second-clause-first-literal-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder second-clause-first-literal-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : "PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder second-clause-second-literal-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder second-clause-second-literal-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_SECOND_CLAUSE_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : "PNP.Concrete.CookLevinBuilderSecondClausePrefix";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder second-clause-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder second-clause-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.")
      ? "PNP.Concrete.CookLevinBuilderFirstClausePaddingRun"
      : "PNP.Concrete.CookLevinBuilderSecondClausePaddingRun";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder second-clause-padding-run theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder second-clause-padding-run fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : name.startsWith("PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.")
        ? "PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep"
        : "PNP.Concrete.CookLevinBuilderThirdClauseSeparatorStep";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder third-clause-separator-step theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder third-clause-separator-step fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : name.startsWith("PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.")
        ? "PNP.Concrete.CookLevinBuilderSecondClauseFirstLiteralPrefix"
        : "PNP.Concrete.CookLevinBuilderThirdClauseFirstLiteralPrefix";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder third-clause-first-literal-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder third-clause-first-literal-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : "PNP.Concrete.CookLevinBuilderThirdClauseSecondLiteralPrefix";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder third-clause-second-literal-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder third-clause-second-literal-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_THIRD_CLAUSE_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : "PNP.Concrete.CookLevinBuilderThirdClausePrefix";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder third-clause-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder third-clause-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, evidence] of Object.entries(BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.")
      ? "PNP.Concrete.CookLevinBuilderFirstClausePaddingRun"
      : "PNP.Concrete.CookLevinBuilderThirdClausePaddingRun";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`inventory Cook-Levin builder third-clause-padding-run theorem mismatch: ${name}`);
    if (theorem && milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`inventory Cook-Levin builder third-clause-padding-run fingerprint mismatch: ${name}`);
  }
  for (const [name, row] of Object.entries(BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : name.startsWith("PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.")
        ? "PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep"
        : "PNP.Concrete.CookLevinBuilderFourthClauseSeparatorStep";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`inventory Cook-Levin builder fourth-clause-separator-step theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`inventory Cook-Levin builder fourth-clause-separator-step fingerprint mismatch: ${name}`);
  }
  for (const [name, row] of Object.entries(BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : name.startsWith("PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.")
        ? "PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix"
        : "PNP.Concrete.CookLevinBuilderFourthClauseFirstLiteralPrefix";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`inventory Cook-Levin builder fourth-clause-first-literal-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`inventory Cook-Levin builder fourth-clause-first-literal-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, row] of Object.entries(BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : name.startsWith("PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.")
        ? "PNP.Concrete.CookLevinBuilderThirdClauseSecondLiteralPrefix"
        : "PNP.Concrete.CookLevinBuilderFourthClauseSecondLiteralPrefix";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`inventory Cook-Levin builder fourth-clause-second-literal-prefix theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`inventory Cook-Levin builder fourth-clause-second-literal-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, row] of Object.entries(BUILDER_FOURTH_CLAUSE_PREFIX_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : "PNP.Concrete.CookLevinBuilderFourthClausePrefix";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`inventory Cook-Levin builder fourth-clause-prefix theorem mismatch: ${name}`);
    if (theorem && milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`inventory Cook-Levin builder fourth-clause-prefix fingerprint mismatch: ${name}`);
  }
  for (const [name, row] of Object.entries(BUILDER_FOURTH_CLAUSE_PADDING_RUN_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.")
      ? "PNP.Concrete.CookLevinBuilderFirstClausePaddingRun"
      : "PNP.Concrete.CookLevinBuilderFourthClausePaddingRun";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`inventory Cook-Levin builder fourth-clause-padding-run theorem mismatch: ${name}`);
    if (theorem && milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`inventory Cook-Levin builder fourth-clause-padding-run fingerprint mismatch: ${name}`);
  }
  for (const [name, row] of Object.entries(BUILDER_FIFTH_CLAUSE_PADDING_RUN_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.") ? "PNP.Concrete.CookLevinBuilderFirstClausePaddingRun" : "PNP.Concrete.CookLevinBuilderFifthClausePaddingRun";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`inventory Cook-Levin builder fifth-clause-padding-run theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`inventory Cook-Levin builder fifth-clause-padding-run fingerprint mismatch: ${name}`);
  }
  for (const [name, row] of Object.entries(BUILDER_FIRST_CONSTRAINT_PADDING_RUN_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.") ? "PNP.Concrete.CookLevinBuilderFirstClausePaddingRun" : "PNP.Concrete.CookLevinBuilderFirstConstraintPaddingRun";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`inventory Cook-Levin builder first-constraint-padding-run theorem mismatch: ${name}`);
    if (milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`inventory Cook-Levin builder first-constraint-padding-run fingerprint mismatch: ${name}`);
  }
  for (const [name, row] of Object.entries(BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
    ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
    : name.startsWith("PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.")
      ? "PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep"
      : "PNP.Concrete.CookLevinBuilderSecondConstraintSeparatorStep";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`inventory Cook-Levin builder second-constraint-separator-step theorem mismatch: ${name}`);
    if (theorem && milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`inventory Cook-Levin builder second-constraint-separator-step fingerprint mismatch: ${name}`);
  }
  for (const [name, row] of Object.entries(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
      ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
      : name.startsWith("PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.")
        ? "PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix"
        : "PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralSignStep";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`inventory Cook-Levin builder second-constraint-first-literal-sign-step theorem mismatch: ${name}`);
    if (theorem && milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`inventory Cook-Levin builder second-constraint-first-literal-sign-step fingerprint mismatch: ${name}`);
  }
  for (const [name, row] of Object.entries(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
    ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
    : name.startsWith("PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.")
      ? "PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix"
      : "PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStep";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`inventory Cook-Levin builder second-constraint-first-literal-first-unary-unit-step theorem mismatch: ${name}`);
    if (theorem && milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`inventory Cook-Levin builder second-constraint-first-literal-first-unary-unit-step fingerprint mismatch: ${name}`);
  }
  for (const [name, row] of Object.entries(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_THEOREMS)) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
    ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
    : name.startsWith("PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.")
      ? "PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix"
      : "PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStep";
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`inventory Cook-Levin builder second-constraint-first-literal-second-unary-unit-step theorem mismatch: ${name}`);
    if (theorem && milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`inventory Cook-Levin builder second-constraint-first-literal-second-unary-unit-step fingerprint mismatch: ${name}`);
  }
  if (inventory.milestoneCandidates?.some((candidate) => candidate.name === "PNP.Concrete.cnfSATNPComplete" || candidate.name === "PNP.Concrete.cnfSATInP" || candidate.name === "PNP.Main.p_eq_np")) fail("inventory overstates the Cook-Levin milestone");
  const packer = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq");
  if (!packer || packer.kind !== "theorem" || packer.module !== "PNP.Concrete.TerminalOutputPacker" || packer.axioms?.length !== 0) fail("inventory terminal-output packer theorem boundary mismatch");
  const terminalBridge = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents");
  if (!terminalBridge || terminalBridge.kind !== "theorem" || terminalBridge.module !== "PNP.Concrete.PipelineTerminalBridge" || terminalBridge.axioms?.length !== 0) fail("inventory terminal-bridge theorem boundary mismatch");
  const suppliedTrace = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact");
  const suppliedOutput = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact");
  if (!suppliedTrace || suppliedTrace.kind !== "theorem" || suppliedTrace.axioms?.length !== 0 || !suppliedOutput || suppliedOutput.kind !== "theorem" || suppliedOutput.axioms?.length !== 0) fail("inventory supplied terminal-trace boundary mismatch");
  const pairedVerdict = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq");
  const pairedOutput = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq");
  const pairedTimeout = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout");
  const pairedAccepts = inventory.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff");
  if (!pairedVerdict || pairedVerdict.kind !== "theorem" || pairedVerdict.axioms?.length !== 0 || !pairedOutput || pairedOutput.kind !== "theorem" || pairedOutput.axioms?.length !== 0 || !pairedTimeout || pairedTimeout.kind !== "theorem" || pairedTimeout.axioms?.length !== 0 || !pairedAccepts || pairedAccepts.kind !== "theorem" || pairedAccepts.axioms?.length !== 0) fail("inventory canonical-pair compiler boundary mismatch");
  for (const name of [
    "PNP.Concrete.PipelineCompiler.pipeline_correct",
    "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq",
    "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq",
    "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout",
    "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff",
    "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact"
  ]) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineCompiler" || theorem.axioms?.length !== 0) fail(`inventory all-input compiler theorem mismatch: ${name}`);
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
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineInputFramer" || theorem.axioms?.length !== 0) fail(`inventory all-input framer theorem mismatch: ${name}`);
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
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineSequentialCompiler" || theorem.axioms?.length !== 0) fail(`inventory sequential compiler theorem mismatch: ${name}`);
  }
  for (const name of [
    "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin",
    "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq",
    "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin",
    "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq",
    "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff"
  ]) {
    const theorem = inventory.milestoneCandidates?.find((candidate) => candidate.name === name);
    if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineRefinement" || theorem.axioms?.length !== 0) fail(`inventory recursive refinement theorem mismatch: ${name}`);
  }
  if (inventory.milestoneCandidates?.length !== 1581) fail("inventory reviewed theorem-candidate count mismatch");
}

function assertCurrentManifest(manifest) {
  if (manifest.kind !== "PNPFormalPublicationRelease0" || manifest.version !== 0) fail("current formal-publication manifest kind/version mismatch");
  if (manifest.coordinate !== "PNP-FORMAL-PUBLICATION-RELEASE-2026-07-23-56") fail("current formal-publication coordinate mismatch");
  if (manifest.status !== "current-formal-reconstruction-publication-theorem-gate-closed" || manifest.authority !== "current") fail("current formal-publication authority mismatch");
  if (manifest.source?.commit !== CORE_COMMIT || manifest.source?.proofCommit !== PROOF_COMMIT || manifest.source?.tree !== CORE_TREE || manifest.source?.ref !== CORE_COMMIT) fail("current manifest is not pinned to the reviewed core merge and proof commit");
  if (manifest.source?.coordinateAloneIsAuthority !== false || manifest.source?.identityRequiresCommitTreeAndArtifactHashes !== true) fail("current manifest identity policy mismatch");
  if (manifest.source?.formalPublicationMapCoordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-23-73" || manifest.source?.formalPublicationMapSha256 !== "bc674f2bc27576f0a40252eea49eb1a9fa51e5d3d11d518649ed3a7d26f8d415" || manifest.source?.leanSourceClosureSha256 !== "f9b89038ba5eceee5e884ade0f8856cadef01ffa2513c5814c587e48820e2a59") fail("current manifest publication-map identity mismatch");
  if (manifest.artifacts?.report?.pageCount !== 50) fail("current report must have fifty pages");
  if (manifest.artifacts?.report?.pdf?.sha256 !== EXPECTED_FILES[0].sha256 || manifest.artifacts?.report?.tex?.sha256 !== EXPECTED_FILES[2].sha256) fail("current report manifest digest mismatch");
  if (manifest.artifacts?.status?.sha256 !== EXPECTED_FILES[4].sha256 || manifest.artifacts?.theoremInventory?.sha256 !== EXPECTED_FILES[5].sha256) fail("current JSON manifest digest mismatch");
  const boundary = manifest.publicationBoundary || {};
  if (boundary.derivedOnlyFromConcreteGate !== true || boundary.concreteGatePassed !== false) fail("current manifest concrete gate boundary mismatch");
  if (boundary.mathematicalTheoremEstablished !== false || boundary.publicTheoremEmissionAllowed !== false || boundary.publicTheoremStatement !== null) fail("current manifest must fail closed");
  if (boundary.compatibilityRootPresent !== false || boundary.concreteTargetPresent !== true || boundary.projectSpecificAxiomsRemaining !== true || boundary.remainingBlockerCount !== 6) fail("current manifest blocker boundary mismatch");
  const earned = manifest.earnedBoundary || {};
  if (earned.leanTheorem !== "PNP.Concrete.FinalUniversalDesign.cnfSATInNP" || earned.kernelTypeSha256 !== "c9d66c135361cf8a8b25330d2558dfac209fde120e296140c7e7cb86bf1e1937" || earned.auditedDeclarationCount !== 766) fail("current manifest earned CNF-SAT boundary mismatch");
  if (!Array.isArray(earned.axiomClosure) || earned.axiomClosure.length !== 0 || earned.cnfSATInPFormalized !== false || earned.cnfSATNPCompletenessFormalized !== false || earned.pEqualsNPFormalized !== false) fail("current manifest CNF-SAT nonclaim boundary mismatch");
  if (earned.pipelineStateNamespacesFormalized !== true || earned.pipelineStateNamespaceAxiomAuditPassed !== true || earned.pipelineStateNamespaceAuditedDeclarationCount !== 39) fail("current manifest pipeline namespace boundary mismatch");
  if (earned.pipelineStageBridgesFormalized !== true || earned.pipelineStageBridgeAxiomAuditPassed !== true || earned.pipelineStageBridgeAuditedDeclarationCount !== 56 || earned.pipelineStageLaunchFormalized !== true || earned.pipelineVerdictPreservationFormalized !== true || earned.pipelineInternalOutputHandoffComposed !== true) fail("current manifest pipeline bridge boundary mismatch");
  if (earned.pipelineWorkCost !== "inputFramerWorkSteps + 1 + 3 * sourceSteps + 1 + framedOutputHandoffWorkSteps + 1 + terminalOutputPackerWorkSteps" || earned.pipelineCompiledRawCostMultiplier !== 6) fail("current manifest pipeline cost boundary mismatch");
  if (earned.pipelineTargetTerminationFormalized !== false || earned.pipelineTerminalRawOutputPackingFormalized !== true) fail("current manifest terminal-output boundary mismatch");
  if (earned.pipelineTerminalOutputPackerAxiomAuditPassed !== true || earned.pipelineTerminalOutputPackerAuditedDeclarationCount !== 69 || earned.pipelineTerminalOutputPackerTheorem !== "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq" || earned.pipelineTerminalOutputPackerKernelTypeSha256 !== "2e8a41501c1bfb17ac78b70a93c2996db1ab607465c4a61a91236a4787b07b66" || earned.pipelineTerminalOutputPackerCompiledRawTimeBound !== "18 * outputLength^2 + 36 * outputLength + 6") fail("current manifest terminal-output packer evidence mismatch");
  if (!Array.isArray(earned.pipelineTerminalOutputPackerAxiomClosure) || earned.pipelineTerminalOutputPackerAxiomClosure.length !== 0 || earned.pipelineTerminalOutputPackerConnectedToBridge !== true) fail("current manifest terminal-output packer composition boundary mismatch");
  if (earned.pipelineTerminalBridgeAxiomAuditPassed !== true || earned.pipelineTerminalBridgeAuditedDeclarationCount !== 59 || earned.pipelineTerminalBridgeAcceptingOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents" || earned.pipelineTerminalBridgeAcceptingOutputKernelTypeSha256 !== "f6ff227ee77408d4b833da4b277cbe24950b52f12bb8aaec3b8d0f48a4000001") fail("current manifest accepting terminal-bridge evidence mismatch");
  if (earned.pipelineTerminalBridgeRejectingOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_rejecting_of_represents" || earned.pipelineTerminalBridgeRejectingOutputKernelTypeSha256 !== "ebdf594cf57d6ab317bc692ac491746099ba5c955853b6deaf41b17240c1a9db" || earned.pipelineTerminalBridgeCompiledRawTimeBound !== "18 * outputLength^2 + 36 * outputLength + 12") fail("current manifest rejecting terminal-bridge evidence mismatch");
  if (earned.pipelineSuppliedTraceWorkCostTheorem !== "PNP.Concrete.PipelineTerminalBridge.suppliedTraceTerminalWorkSteps_eq" || earned.pipelineSuppliedTraceWorkCostKernelTypeSha256 !== "7d9b5bf70b1675c1843f538e046030753b7e0be7c3bd50ec5d64ce9eb5b0869e") fail("current manifest supplied-trace cost evidence mismatch");
  if (earned.pipelineSuppliedAcceptTraceTheorem !== "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact" || earned.pipelineSuppliedAcceptTraceKernelTypeSha256 !== "e225169a3de16b86bbd99c9b230a214425ea53886b6ed4dddd8b8d47ea290f29") fail("current manifest supplied accepting-trace evidence mismatch");
  if (earned.pipelineSuppliedRejectTraceTheorem !== "PNP.Concrete.PipelineTerminalBridge.rejectingSuppliedTrace_workRunExact_of_rawRunExact" || earned.pipelineSuppliedRejectTraceKernelTypeSha256 !== "31afb03af96fcb1c3c5f3d0e5a0fd4276b8b9707ae8cde7972a812c52b22938c") fail("current manifest supplied rejecting-trace evidence mismatch");
  if (earned.pipelineSuppliedAcceptVerdictTheorem !== "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_accept_of_rawRunExact" || earned.pipelineSuppliedAcceptVerdictKernelTypeSha256 !== "bbc633544f84f156eef71f1aa488a359c35ecb46b1ba1d0dfaa393d1e045fde4") fail("current manifest accepting-verdict evidence mismatch");
  if (earned.pipelineSuppliedRejectVerdictTheorem !== "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_reject_of_rawRunExact" || earned.pipelineSuppliedRejectVerdictKernelTypeSha256 !== "a2cee1b6edc38318bd4b57c82bbc6f708b3c6e676f42128be00f787477a6fbfe") fail("current manifest rejecting-verdict evidence mismatch");
  if (earned.pipelineStuckTimeoutTheorem !== "PNP.Concrete.PipelineTerminalBridge.workBoundedDecide_terminalBridge_timeout_of_stuck_rawRunExact" || earned.pipelineStuckTimeoutKernelTypeSha256 !== "0ce3f2337117d81a1a25b923c5604dcd9b8235e69598390825caae68c93d9488") fail("current manifest stuck-timeout evidence mismatch");
  if (earned.pipelineSuppliedAcceptMachineOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact" || earned.pipelineSuppliedAcceptMachineOutputKernelTypeSha256 !== "dacbb94707b8cab5e553ca3cbc01c02130827940ef487f4981c96799ab6d1a01") fail("current manifest accepting-output evidence mismatch");
  if (earned.pipelineSuppliedRejectMachineOutputTheorem !== "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_reject_of_rawRunExact" || earned.pipelineSuppliedRejectMachineOutputKernelTypeSha256 !== "05a89482ad3ab866041fd93caf8a2a9727df0956794e3b5a1849df74dc4eb7bd") fail("current manifest rejecting-output evidence mismatch");
  if (!Array.isArray(earned.pipelineTerminalBridgeAxiomClosure) || earned.pipelineTerminalBridgeAxiomClosure.length !== 0 || earned.pipelinePriorTraceTransportToTerminalBridgeFormalized !== true) fail("current manifest terminal-bridge supplied-trace boundary mismatch");
  if (earned.pipelineInputFramerAxiomAuditPassed !== true || earned.pipelineInputFramerAuditedDeclarationCount !== 70 || earned.pipelineAllInputFramingFormalized !== true || !Array.isArray(earned.pipelineInputFramerAxiomClosure) || earned.pipelineInputFramerAxiomClosure.length !== 0) fail("current manifest all-input framer audit boundary mismatch");
  if (earned.pipelineInputFramerWorkTraceTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact" || earned.pipelineInputFramerWorkTraceKernelTypeSha256 !== "ad6e7cfe1206448f72a57135408a3c2e057411b4f418cdca0fd6a376a2863a1a") fail("current manifest all-input framer trace evidence mismatch");
  if (earned.pipelineInputFramerRepresentedEndpointTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents" || earned.pipelineInputFramerRepresentedEndpointKernelTypeSha256 !== "8f1fa6f45f267d60eadad754d9c88e4ea58631b881152af0a51244f5f7d207af" || earned.pipelineInputFramerHaltedEndpointTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_isHalted" || earned.pipelineInputFramerHaltedEndpointKernelTypeSha256 !== "beca62f878cccce7434d899512cf9aaea25b222d113ec60df90da0fde8801faa") fail("current manifest all-input framer endpoint evidence mismatch");
  if (earned.pipelineInputFramerRawBoundTheorem !== "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le" || earned.pipelineInputFramerRawBoundKernelTypeSha256 !== "bac4d4c78cb57e3ab70f752e2895a2f7ddd3c5356a6d1c457dd5832413d89eab" || earned.pipelineInputFramerRawTimePolynomial !== "6 * m * m + 39 * m + 75") fail("current manifest all-input framer polynomial evidence mismatch");
  if (earned.pipelineInputFramerOrdinaryStartTheorem !== "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound" || earned.pipelineInputFramerOrdinaryStartKernelTypeSha256 !== "4efe0f62d185b7ac19d73aebb09008e97f00c96a8252e263c901f8a6add7c45b" || earned.pipelineInputFramerBlankEquivalentTheorem !== "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent" || earned.pipelineInputFramerBlankEquivalentKernelTypeSha256 !== "1eaa31ea98226c202722a0e67aa796b7b461ccf5367f35fff194973bb609ce8a") fail("current manifest all-input framer ordinary-start evidence mismatch");
  if (earned.pipelineInputFramerAcceptTheorem !== "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept" || earned.pipelineInputFramerAcceptKernelTypeSha256 !== "3ef9f8377ec7ad7ebb70aa41b978cdb22f2c1c029b26e1e4c241ce00c20781d4" || earned.pipelineInputFramerNoTimeoutTheorem !== "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout" || earned.pipelineInputFramerNoTimeoutKernelTypeSha256 !== "48b9ee1743a6881a663fb7a1cc59984c371ff853524f9b18bad58014c229f9fe") fail("current manifest all-input framer verdict evidence mismatch");
  if (earned.pipelineInputFramerEmptyWorkSteps !== "4" || earned.pipelineInputFramerCompleteCellsWorkSteps !== "4 * k * k + 9 * k + 7" || earned.pipelineInputFramerPartialCellWorkSteps !== "4 * k * k + 9 * k + 5") fail("current manifest all-input framer branch-cost evidence mismatch");
  if (earned.pipelinePairedCompilerAxiomAuditPassed !== true || earned.pipelinePairedCompilerAuditedDeclarationCount !== 28 || earned.pipelineCanonicalPairCompilationFormalized !== true) fail("current manifest canonical-pair compiler boundary mismatch");
  if (earned.pipelinePairedVerdictTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq" || earned.pipelinePairedVerdictKernelTypeSha256 !== "99b8ecf29c6542e9646f70d9f973e99bd5a2ed8a18563b929213a9af38474731") fail("current manifest canonical-pair verdict evidence mismatch");
  if (earned.pipelinePairedMachineOutputTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq" || earned.pipelinePairedMachineOutputKernelTypeSha256 !== "7640e6416b0b4ebf12fa4619cfcff4d242af337e82416c372875afbfb2986267") fail("current manifest canonical-pair output evidence mismatch");
  if (earned.pipelinePairedNoTimeoutTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout" || earned.pipelinePairedNoTimeoutKernelTypeSha256 !== "a59b8e38ee0be8c579aab8989c32c53cdf20c59168c6d8a5310db9b6bbb225ab") fail("current manifest canonical-pair timeout evidence mismatch");
  if (earned.pipelinePairedAcceptsTheorem !== "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff" || earned.pipelinePairedAcceptsKernelTypeSha256 !== "719c9d81b90ba7938ae9cd5485fc9d2cc0e0a14a6b98c118cfeba39d788a75d9") fail("current manifest canonical-pair language evidence mismatch");
  if (!Array.isArray(earned.pipelinePairedCompilerAxiomClosure) || earned.pipelinePairedCompilerAxiomClosure.length !== 0 || earned.pipelinePairedOutputSizePolynomial !== "B(m) = m + p(m) + 1" || earned.pipelinePairedRawTimePolynomial !== "Rpair(m) = inputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))") fail("current manifest canonical-pair polynomial evidence mismatch");
  if (earned.pipelineCompilerAxiomAuditPassed !== true || earned.pipelineCompilerAuditedDeclarationCount !== 29 || earned.pipelineAllInputCompilationFormalized !== true || !Array.isArray(earned.pipelineCompilerAxiomClosure) || earned.pipelineCompilerAxiomClosure.length !== 0) fail("current manifest all-input compiler audit boundary mismatch");
  if (earned.pipelineCompilerCorrectTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_correct" || earned.pipelineCompilerCorrectKernelTypeSha256 !== "e1ccd198403d41933324af1c52048c865943947c5bbd40dd94e11827b08c2303") fail("current manifest all-input compiler correctness evidence mismatch");
  if (earned.pipelineVerdictTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq" || earned.pipelineVerdictKernelTypeSha256 !== "1bafe91bba94e65a7ad654f4624f305c0ae01b3e6d656af0dd2e752d373ce87e") fail("current manifest all-input compiler verdict evidence mismatch");
  if (earned.pipelineMachineOutputTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq" || earned.pipelineMachineOutputKernelTypeSha256 !== "45e02fa1e6e6b0bcbc422c3b4fd797608b875727d22b79d6f7814e1f4f0d3da7") fail("current manifest all-input compiler output evidence mismatch");
  if (earned.pipelineNoTimeoutTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout" || earned.pipelineNoTimeoutKernelTypeSha256 !== "ed95c33d4fa998d79057537cd2adf847548a79b7ee9a45020b01620868273b3a") fail("current manifest all-input compiler timeout evidence mismatch");
  if (earned.pipelineAcceptsTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff" || earned.pipelineAcceptsKernelTypeSha256 !== "94e43c664b4d185e48553ab25541925830fec7086fcbbab5215dacdcde1af6a6") fail("current manifest all-input compiler language evidence mismatch");
  if (earned.pipelineAllInputStuckTimeoutTheorem !== "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact" || earned.pipelineAllInputStuckTimeoutKernelTypeSha256 !== "a6edef0532eb89036d0e6813cffb94b321f9160a08035671eb411c813ef0a3de") fail("current manifest all-input compiler stuck-timeout evidence mismatch");
  if (earned.pipelineOutputSizePolynomial !== "B(m) = m + p(m) + 1" || earned.pipelineRawTimePolynomial !== "R(m) = totalInputFramerRawTimeBound(m) + 6 + 18 * p(m) + 6 + framedOutputHandoffRawTimeBound(B(m)) + terminalBridgeRawTimeBound(B(m))") fail("current manifest all-input compiler polynomial evidence mismatch");
  if (earned.pipelineExternalInputSizePolynomialFormalized !== true || earned.pipelineMalformedInputBehaviorFormalized !== true || earned.pipelineRawRefinementFormalized !== true) fail("current manifest all-input compiler boundary mismatch");
  if (earned.pipelineSequentialNamespaceFormalized !== true || earned.pipelineSequentialNamespaceAxiomAuditPassed !== true || earned.pipelineSequentialNamespaceAuditedDeclarationCount !== 26 || !Array.isArray(earned.pipelineSequentialNamespaceAxiomClosure) || earned.pipelineSequentialNamespaceAxiomClosure.length !== 0) fail("current manifest sequential namespace boundary mismatch");
  if (earned.pipelineSequentialCompilationFormalized !== true || earned.pipelineSequentialCompilerAxiomAuditPassed !== true || earned.pipelineSequentialCompilerAuditedDeclarationCount !== 31 || earned.pipelineSequentialVerdictAndOutputPreservationFormalized !== true || earned.pipelineSequentialExternalInputSizePolynomialFormalized !== true || earned.pipelineSequentialStuckFirstTimeoutFormalized !== true || !Array.isArray(earned.pipelineSequentialCompilerAxiomClosure) || earned.pipelineSequentialCompilerAxiomClosure.length !== 0) fail("current manifest sequential compiler boundary mismatch");
  if (earned.pipelineSequentialCorrectTheorem !== "PNP.Concrete.PipelineSequentialCompiler.sequential_correct" || earned.pipelineSequentialCorrectKernelTypeSha256 !== "8943f2f2c396dfb2e6e8232244b9ecb386fe3a7259590ed96cedb82d1cc7b22a" || earned.pipelineSequentialVerdictTheorem !== "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq" || earned.pipelineSequentialVerdictKernelTypeSha256 !== "dd282c364787b165c9be9ca80b712c3ebf61ac95d097218300a65433a690e386") fail("current manifest sequential correctness evidence mismatch");
  if (earned.pipelineSequentialMachineOutputTheorem !== "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq" || earned.pipelineSequentialMachineOutputKernelTypeSha256 !== "8d954e0e65847ff071a3a79a7be1c7f7d5a2f1696e3f94be3a7288500598b9d7" || earned.pipelineSequentialNoTimeoutTheorem !== "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout" || earned.pipelineSequentialNoTimeoutKernelTypeSha256 !== "116c522c8a64988fd815b32bad08df882534b94b87cfa42a705fd1d8158d45af") fail("current manifest sequential output/timeout evidence mismatch");
  if (earned.pipelineSequentialAcceptsTheorem !== "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff" || earned.pipelineSequentialAcceptsKernelTypeSha256 !== "7a6d0d03c735c83a2fb0c764a174a79402ec196a98169614b15dbee442df099e" || earned.pipelineSequentialStuckFirstTimeoutTheorem !== "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact" || earned.pipelineSequentialStuckFirstTimeoutKernelTypeSha256 !== "5f5f0889b807ea0ccefdfb911ba8b583de9999f2a627745bc9317c0c6ff21a34") fail("current manifest sequential language/stuck evidence mismatch");
  if (earned.pipelineSequentialOutputSizePolynomial !== "Bseq(m) = m + p(m) + 1" || earned.pipelineSequentialRawTimePolynomial !== "Rseq(m) = PipelineRaw(p)(m) + 6 + PipelineRaw(q)(m + p(m) + 1)") fail("current manifest sequential polynomial evidence mismatch");
  if (earned.pipelineRefinementAxiomAuditPassed !== true || earned.pipelineRefinementAuditedDeclarationCount !== 16 || !Array.isArray(earned.pipelineRefinementAxiomClosure) || earned.pipelineRefinementAxiomClosure.length !== 0 || earned.functionProgramRecursiveCompilationFormalized !== true || earned.decisionProgramRecursiveCompilationFormalized !== true || earned.polynomialTimeDeciderRawCompilationFormalized !== true || earned.standardComplexityModelFormalized !== true || earned.concreteComplexityMachineLinkDischarged !== true) fail("current manifest recursive refinement boundary mismatch");
  if (earned.functionProgramCompileHaltsTheorem !== "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin" || earned.functionProgramCompileHaltsKernelTypeSha256 !== "53bd33de652a55facc74179863672a789f40f9ba6dea293c2de29fcc866b5a3d" || earned.functionProgramCompileOutputTheorem !== "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq" || earned.functionProgramCompileOutputKernelTypeSha256 !== "e3bb23c7f245cb516803a91468e3a3b220338c36a11790ffa5045b8c41332a24") fail("current manifest recursive function evidence mismatch");
  if (earned.decisionProgramCompileHaltsTheorem !== "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin" || earned.decisionProgramCompileHaltsKernelTypeSha256 !== "4057fc9d48be85dd7f961ce7acf5bef68ddb4ed0c8b6798617b31deb9da8c7c5" || earned.decisionProgramCompileVerdictTheorem !== "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq" || earned.decisionProgramCompileVerdictKernelTypeSha256 !== "8b390dd6677d6e789499b7b713855652a5e1db2c64809ddf43d079deb4099965") fail("current manifest recursive decision evidence mismatch");
  if (earned.polynomialTimeDeciderCompileAcceptsTheorem !== "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff" || earned.polynomialTimeDeciderCompileAcceptsKernelTypeSha256 !== "ebc638eb12e60d97a7d33b0cdce5a6322594342547f65128c0a3f11503fa35ba") fail("current manifest compiled decider evidence mismatch");
  if (earned.cookLevinRawTapeBridgeFormalized !== true || earned.cookLevinRawTapeBridgeAxiomAuditPassed !== true || earned.cookLevinRawTapeBridgeAuditedDeclarationCount !== 54 || earned.cookLevinSemanticReductionCorrectnessFormalized !== true) fail("current manifest Cook-Levin raw-tape boundary mismatch");
  if (earned.cookLevinSemanticTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language" || earned.cookLevinSemanticTheoremType !== "{language : PNP.Concrete.Language} (problem : PNP.Concrete.CookLevin.VerifierTableauProblem language) : PNP.Concrete.CNFSAT problem.encodedFormula ↔ language problem.input" || earned.cookLevinSemanticKernelTypeSha256 !== "985c8d12419343045c76abbcfa6def7d4e01ce816d97180dca14d7bf5c0be34d") fail("current manifest Cook-Levin semantic theorem mismatch");
  if (JSON.stringify(earned.cookLevinRawTapeBridgeAxiomClosure) !== JSON.stringify(["Classical.choice", "Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinProjectAxiomClosure) || earned.cookLevinProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin axiom closure mismatch");
  if (earned.cookLevinFormulaSizeAxiomAuditPassed !== true || earned.cookLevinFormulaSizeAuditedDeclarationCount !== 108 || earned.cookLevinEncodedFormulaSizePolynomialFormalized !== true) fail("current manifest Cook-Levin formula-size boundary mismatch");
  if (earned.cookLevinEncodedFormulaSizeTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le" || earned.cookLevinEncodedFormulaSizeKernelTypeSha256 !== "c2b0a4afd8793022739cde9904d379a3c807fba07f0db0ab23e3b0b0563ed699") fail("current manifest Cook-Levin formula-size identity mismatch");
  if (JSON.stringify(earned.cookLevinFormulaSizeAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinFormulaSizeProjectAxiomClosure) || earned.cookLevinFormulaSizeProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin formula-size axiom closure mismatch");
  if (earned.cookLevinFormulaScheduleFormalized !== true || earned.cookLevinFormulaScheduleAxiomAuditPassed !== true || earned.cookLevinFormulaScheduleAuditedDeclarationCount !== 79 || earned.cookLevinFormulaScheduleAnswerIndependent !== true || earned.cookLevinFormulaScheduleExactEmissionFormalized !== true || earned.cookLevinFormulaScheduleExactLengthPolynomialFormalized !== true) fail("current manifest Cook-Levin formula-schedule boundary mismatch");
  if (earned.cookLevinFormulaScheduleLengthTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length" || earned.cookLevinFormulaScheduleLengthKernelTypeSha256 !== "7460e8b8c59a2356dc8ece81571e7bcb76faf71a5ae0492d034b1d8c5d2408c4") fail("current manifest Cook-Levin formula-schedule length identity mismatch");
  if (earned.cookLevinFormulaScheduleEmitTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula" || earned.cookLevinFormulaScheduleEmitKernelTypeSha256 !== "2376179dbf80f6e0bb76d8a6026518aa0d042e1eb79f3ec567474a730f742943") fail("current manifest Cook-Levin formula-schedule emit identity mismatch");
  if (JSON.stringify(earned.cookLevinFormulaScheduleAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinFormulaScheduleProjectAxiomClosure) || earned.cookLevinFormulaScheduleProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin formula-schedule axiom closure mismatch");
  if (earned.cookLevinFormulaScheduleConstantTimeRawInterpretationFormalized !== false || earned.cookLevinRawFormulaBuilderFormalized !== false || earned.cookLevinFormulaScheduleFunctionProgramRawRefinementFormalized !== false || earned.cookLevinFormulaConstructionRuntimePolynomialFormalized !== false || earned.cookLevinPolynomialReductionFormalized !== false) fail("current manifest overstates Cook-Levin construction complexity");
  if (earned.cookLevinFormulaCursorFormalized !== true || earned.cookLevinFormulaCursorAxiomAuditPassed !== true || earned.cookLevinFormulaCursorAuditedDeclarationCount !== 129 || earned.cookLevinFormulaCursorDirectCoordinateLookupFormalized !== true || earned.cookLevinFormulaCursorNestedOptionSemanticsFormalized !== true || earned.cookLevinFormulaCursorExactTraversalFormalized !== true || earned.cookLevinFormulaCursorExactLengthPolynomialFormalized !== true) fail("current manifest Cook-Levin formula-cursor boundary mismatch");
  if (earned.cookLevinFormulaCursorDirectBitTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotDirect_eq" || earned.cookLevinFormulaCursorPolynomialTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotCountDirect_eq_polynomial" || earned.cookLevinFormulaCursorFullTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full" || earned.cookLevinFormulaCursorOneStepShortTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_one_step_short" || earned.cookLevinFormulaCursorExcessTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_excess" || earned.cookLevinFormulaCursorEmitTheorem !== "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula") fail("current manifest Cook-Levin formula-cursor theorem identity mismatch");
  if (JSON.stringify(earned.cookLevinFormulaCursorAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinFormulaCursorProjectAxiomClosure) || earned.cookLevinFormulaCursorProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin formula-cursor axiom closure mismatch");
  const cursorHashes = earned.cookLevinFormulaCursorTheoremKernelTypeSha256;
  if (!cursorHashes || Object.keys(cursorHashes).length !== 16 || !Object.entries(FORMULA_CURSOR_THEOREM_HASHES).every(([name, hash]) => cursorHashes[name] === hash)) fail("current manifest Cook-Levin formula-cursor fingerprint mismatch");
  if (earned.cookLevinFormulaCursorConstantTimeRawInterpretationFormalized !== false || earned.cookLevinFormulaCursorRawBuilderFormalized !== false || earned.cookLevinFormulaCursorFunctionProgramRawRefinementFormalized !== false) fail("current manifest overstates the Cook-Levin formula cursor");
  if (earned.cookLevinBuilderInputLengthFormalized !== true || earned.cookLevinBuilderInputLengthAxiomAuditPassed !== true || earned.cookLevinBuilderInputLengthAuditedDeclarationCount !== 39 || earned.cookLevinBuilderInputLengthCompiledRawMachineFormalized !== true || earned.cookLevinBuilderInputLengthExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized !== true || earned.cookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized !== true) fail("current manifest Cook-Levin builder input-length boundary mismatch");
  if (earned.cookLevinBuilderInputLengthWorkTimePolynomial !== "2 * inputLength^2 + 4 * inputLength + 2" || earned.cookLevinBuilderInputLengthRawTimePolynomial !== "12 * inputLength^2 + 24 * inputLength + 12" || earned.cookLevinBuilderInputLengthRuleCount !== 19) fail("current manifest Cook-Levin builder input-length cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderInputLengthAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderInputLengthProjectAxiomClosure) || earned.cookLevinBuilderInputLengthProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder input-length axiom closure mismatch");
  const builderHashes = earned.cookLevinBuilderInputLengthTheoremKernelTypeSha256;
  if (!builderHashes || Object.keys(builderHashes).length !== 10 || !Object.entries(BUILDER_INPUT_LENGTH_THEOREMS).every(([name, evidence]) => builderHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder input-length fingerprint mismatch");
  if (earned.cookLevinBuilderInputPrefixFormalized !== true || earned.cookLevinBuilderInputPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderInputPrefixAuditedDeclarationCount !== 40 || earned.cookLevinBuilderInputPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized !== true || earned.cookLevinBuilderInputPrefixLiteralFramerLaunchFormalized !== true) fail("current manifest Cook-Levin builder input-prefix boundary mismatch");
  if (earned.cookLevinBuilderInputPrefixWorkTimePolynomial !== "totalInputFramerWorkSteps(input) + 1 + 2 * inputLength^2 + 4 * inputLength + 2" || earned.cookLevinBuilderInputPrefixRawTimePolynomial !== "18 * inputLength^2 + 63 * inputLength + 93") fail("current manifest Cook-Levin builder input-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderInputPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderInputPrefixProjectAxiomClosure) || earned.cookLevinBuilderInputPrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder input-prefix axiom closure mismatch");
  const builderPrefixHashes = earned.cookLevinBuilderInputPrefixTheoremKernelTypeSha256;
  if (!builderPrefixHashes || Object.keys(builderPrefixHashes).length !== 14 || !Object.entries(BUILDER_INPUT_PREFIX_THEOREMS).every(([name, evidence]) => builderPrefixHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder input-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderInputPrefixFormulaBitsEmittedFormalized !== false || earned.cookLevinCompleteRawFormulaBuilderFormalized !== false || earned.cookLevinBuilderFunctionProgramRawRefinementFormalized !== false || earned.cookLevinPolynomialReductionFormalized !== false) fail("current manifest overstates the Cook-Levin builder input prefix");
  if (earned.cookLevinBuilderTokenAppenderFormalized !== true || earned.cookLevinBuilderTokenAppenderAxiomAuditPassed !== true || earned.cookLevinBuilderTokenAppenderAuditedDeclarationCount !== 68 || earned.cookLevinBuilderTokenAppenderCompiledRawMachineFormalized !== true || earned.cookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderTokenAppenderAllTokensExactFormalized !== true || earned.cookLevinBuilderTokenAppenderFirstFormulaBitsFormalized !== true || earned.cookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized !== true || earned.cookLevinBuilderTokenAppenderInputPrefixComposed !== true) fail("current manifest Cook-Levin builder token-appender boundary mismatch");
  if (earned.cookLevinBuilderTokenAppenderWorkTime !== "2 * (max 1 inputLength + inputLength + priorTokenCount + 3)" || earned.cookLevinBuilderTokenAppenderFirstTokenRawTimePolynomial !== "24 * inputLength + 48" || earned.cookLevinBuilderTokenAppenderRuleCount !== 59) fail("current manifest Cook-Levin builder token-appender cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderTokenAppenderAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderTokenAppenderProjectAxiomClosure) || earned.cookLevinBuilderTokenAppenderProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder token-appender axiom closure mismatch");
  const builderTokenHashes = earned.cookLevinBuilderTokenAppenderTheoremKernelTypeSha256;
  if (!builderTokenHashes || Object.keys(builderTokenHashes).length !== 17 || !Object.entries(BUILDER_TOKEN_APPENDER_THEOREMS).every(([name, evidence]) => builderTokenHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder token-appender fingerprint mismatch");
  if (earned.cookLevinBuilderTokenAppenderCompleteHeaderFormalized !== false || earned.cookLevinBuilderTokenAppenderDynamicCursorInterpretationFormalized !== false || earned.cookLevinCompleteRawFormulaBuilderFormalized !== false || earned.cookLevinBuilderFunctionProgramRawRefinementFormalized !== false || earned.cookLevinPolynomialReductionFormalized !== false) fail("current manifest overstates the Cook-Levin builder token appender");
  if (earned.cookLevinBuilderFirstTokenPrefixFormalized !== true || earned.cookLevinBuilderFirstTokenPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderFirstTokenPrefixAuditedDeclarationCount !== 37 || earned.cookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized !== true) fail("current manifest Cook-Levin builder first-token-prefix boundary mismatch");
  if (earned.cookLevinBuilderFirstTokenPrefixWorkTime !== "BuilderInputPrefix.workSteps(input) + 1 + BuilderTokenAppender.workSteps(input, [])" || earned.cookLevinBuilderFirstTokenPrefixRawTimePolynomial !== "18 * inputLength^2 + 87 * inputLength + 147" || earned.cookLevinBuilderFirstTokenPrefixRuleCount !== 184) fail("current manifest Cook-Levin builder first-token-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFirstTokenPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFirstTokenPrefixProjectAxiomClosure) || earned.cookLevinBuilderFirstTokenPrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder first-token-prefix axiom closure mismatch");
  const firstTokenHashes = earned.cookLevinBuilderFirstTokenPrefixTheoremKernelTypeSha256;
  if (!firstTokenHashes || Object.keys(firstTokenHashes).length !== 25 || !Object.entries(BUILDER_FIRST_TOKEN_PREFIX_THEOREMS).every(([name, evidence]) => firstTokenHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder first-token-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderUnaryPolynomialFormalized !== true || earned.cookLevinBuilderUnaryPolynomialAxiomAuditPassed !== true || earned.cookLevinBuilderUnaryPolynomialAuditedDeclarationCount !== 74 || earned.cookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized !== true || earned.cookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized !== true) fail("current manifest Cook-Levin builder unary-polynomial boundary mismatch");
  if (earned.cookLevinBuilderUnaryPolynomialRuleCount !== "9 * stateCount(widthPolynomial verifier)") fail("current manifest Cook-Levin builder unary-polynomial cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderUnaryPolynomialAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderUnaryPolynomialProjectAxiomClosure) || earned.cookLevinBuilderUnaryPolynomialProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder unary-polynomial axiom closure mismatch");
  const unaryHashes = earned.cookLevinBuilderUnaryPolynomialTheoremKernelTypeSha256;
  if (!unaryHashes || Object.keys(unaryHashes).length !== 10 || !Object.entries(BUILDER_UNARY_POLYNOMIAL_THEOREMS).every(([name, evidence]) => unaryHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder unary-polynomial fingerprint mismatch");
  if (earned.cookLevinBuilderCompleteHeaderFormalized !== true || earned.cookLevinBuilderCompleteHeaderAxiomAuditPassed !== true || earned.cookLevinBuilderCompleteHeaderAuditedDeclarationCount !== 84 || earned.cookLevinBuilderCompleteHeaderCompiledRawMachineFormalized !== true || earned.cookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderCompleteHeaderExactFormulaBitsFormalized !== true || earned.cookLevinBuilderCompleteHeaderInputPrefixAppenderComposed !== true || earned.cookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder complete-header boundary mismatch");
  if (earned.cookLevinBuilderCompleteHeaderRuleCount !== "363 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier)") fail("current manifest Cook-Levin builder complete-header cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderCompleteHeaderAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderCompleteHeaderProjectAxiomClosure) || earned.cookLevinBuilderCompleteHeaderProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder complete-header axiom closure mismatch");
  const completeHeaderHashes = earned.cookLevinBuilderCompleteHeaderTheoremKernelTypeSha256;
  if (!completeHeaderHashes || Object.keys(completeHeaderHashes).length !== 38 || !Object.entries(BUILDER_COMPLETE_HEADER_THEOREMS).every(([name, evidence]) => completeHeaderHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder complete-header fingerprint mismatch");
  if (earned.cookLevinBuilderBodyStartPrefixFormalized !== true || earned.cookLevinBuilderBodyStartPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderBodyStartPrefixAuditedDeclarationCount !== 60 || earned.cookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized !== true || earned.cookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized !== true || earned.cookLevinBuilderInputPrefixAppenderComposed !== true) fail("current manifest Cook-Levin builder body-start-prefix boundary mismatch");
  if (earned.cookLevinBuilderBodyStartPrefixRuleCount !== "440 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)") fail("current manifest Cook-Levin builder body-start-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderBodyStartPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderBodyStartPrefixProjectAxiomClosure) || earned.cookLevinBuilderBodyStartPrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder body-start-prefix axiom closure mismatch");
  const bodyStartHashes = earned.cookLevinBuilderBodyStartPrefixTheoremKernelTypeSha256;
  if (!bodyStartHashes || Object.keys(bodyStartHashes).length !== 42 || !Object.entries(BUILDER_BODY_START_PREFIX_THEOREMS).every(([name, evidence]) => bodyStartHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder body-start-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderBodyStartPrefixExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.workRunExact" || earned.cookLevinBuilderBodyStartPrefixCanonicalPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.bodyStartTokens_eq_canonical_prefix" || earned.cookLevinBuilderBodyStartPrefixNextTokenCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_two" || earned.cookLevinBuilderBodyStartPrefixSeparatorSlotTheorem !== "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.firstBodyTokenSlotDirect_eq_separator" || earned.cookLevinBuilderBodyStartPrefixFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.finalTokenBits_eq_encodedFormula_bodyStart") fail("current manifest Cook-Levin builder body-start-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderFirstLiteralPrefixFormalized !== true || earned.cookLevinBuilderFirstLiteralPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount !== 74 || earned.cookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized !== true || earned.cookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || earned.cookLevinBuilderInputPrefixAppenderComposed !== true) fail("current manifest Cook-Levin builder first-literal-prefix boundary mismatch");
  if (earned.cookLevinBuilderFirstLiteralPrefixRuleCount !== "585 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)") fail("current manifest Cook-Levin builder first-literal-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFirstLiteralPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFirstLiteralPrefixProjectAxiomClosure) || earned.cookLevinBuilderFirstLiteralPrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder first-literal-prefix axiom closure mismatch");
  const firstLiteralHashes = earned.cookLevinBuilderFirstLiteralPrefixTheoremKernelTypeSha256;
  if (!firstLiteralHashes || Object.keys(firstLiteralHashes).length !== 52 || !Object.entries(BUILDER_FIRST_LITERAL_PREFIX_THEOREMS).every(([name, evidence]) => firstLiteralHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder first-literal-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderFirstLiteralPrefixExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.workRunExact" || earned.cookLevinBuilderFirstLiteralPrefixCanonicalPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_prefix" || earned.cookLevinBuilderFirstLiteralPrefixCanonicalFormulaPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_formula_prefix" || earned.cookLevinBuilderFirstLiteralPrefixNextTokenCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_four" || earned.cookLevinBuilderFirstLiteralPrefixSignSlotTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralSignSlotDirect_eq_t" || earned.cookLevinBuilderFirstLiteralPrefixZeroTerminatorSlotTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralZeroTerminatorSlotDirect_eq_f" || earned.cookLevinBuilderFirstLiteralPrefixFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_firstLiteral") fail("current manifest Cook-Levin builder first-literal-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderFirstClausePrefixFormalized !== true || earned.cookLevinBuilderFirstClausePrefixAxiomAuditPassed !== true || earned.cookLevinBuilderFirstClausePrefixAuditedDeclarationCount !== 79 || earned.cookLevinBuilderFirstClausePrefixCombinedAuditedDeclarationCount !== 80 || earned.cookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized !== true || earned.cookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized !== true || earned.cookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized !== true) fail("current manifest Cook-Levin builder first-clause-prefix boundary mismatch");
  if (earned.cookLevinBuilderFirstClausePrefixWorkTime !== "BuilderFirstLiteralPrefix.workSteps(input) + 1 + BuilderUnaryPolynomial.workSteps(nextTokenSlotPolynomial verifier, input) + 1 + FirstClauseTailAppender.workSteps(input, firstLiteralTokens problem)" || earned.cookLevinBuilderFirstClausePrefixRawTimePolynomial !== "BuilderFirstLiteralPrefix.rawTimeBound + 1158 + 6 * BuilderUnaryPolynomial.workTimePolynomial(nextTokenSlotPolynomial verifier) + 192 * inputLength + 96 * FormulaWidth" || earned.cookLevinBuilderFirstClausePrefixRuleCount !== "1138 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(nextTokenSlotPolynomial verifier)") fail("current manifest Cook-Levin builder first-clause-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFirstClausePrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFirstClausePrefixProjectAxiomClosure) || earned.cookLevinBuilderFirstClausePrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder first-clause-prefix axiom closure mismatch");
  const firstClauseHashes = earned.cookLevinBuilderFirstClausePrefixTheoremKernelTypeSha256;
  if (!firstClauseHashes || Object.keys(firstClauseHashes).length !== 43 || !Object.entries(BUILDER_FIRST_CLAUSE_PREFIX_THEOREMS).every(([name, evidence]) => firstClauseHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder first-clause-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderFirstClausePrefixExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.workRunExact" || earned.cookLevinBuilderFirstClausePrefixCanonicalPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_prefix" || earned.cookLevinBuilderFirstClausePrefixCanonicalFormulaPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_formula_prefix" || earned.cookLevinBuilderFirstClausePrefixNextTokenCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_twelve" || earned.cookLevinBuilderFirstClausePrefixFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.finalTokenBits_eq_encodedFormula_firstClause" || earned.cookLevinBuilderFirstClausePrefixRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rules_length" || earned.cookLevinBuilderFirstClausePrefixRulesDistinctTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rules_pairwise_query_distinct" || earned.cookLevinBuilderFirstClausePrefixTailRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.rules_length" || earned.cookLevinBuilderFirstClausePrefixCompiledExactTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_exact" || earned.cookLevinBuilderFirstClausePrefixCompiledBoundTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_rawTimeBound" || earned.cookLevinBuilderFirstClausePrefixAcceptTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.boundedDecide_compile_accept" || earned.cookLevinBuilderFirstClausePrefixNoTimeoutTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.boundedDecide_compile_ne_timeout" || earned.cookLevinBuilderFirstClausePrefixOneStepShortTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePrefix.work_one_step_short_timeout") fail("current manifest Cook-Levin builder first-clause-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderDynamicTokenCursorStepFormalized !== true || earned.cookLevinBuilderDynamicTokenCursorStepAxiomAuditPassed !== true || earned.cookLevinBuilderDynamicTokenCursorStepAuditedDeclarationCount !== 47 || earned.cookLevinBuilderDynamicTokenCursorStepCompiledRawMachineFormalized !== true || earned.cookLevinBuilderDynamicTokenCursorStepExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderDynamicTokenCursorStepDirectPaddingOutcomeFormalized !== true || earned.cookLevinBuilderDynamicTokenCursorStepRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderDynamicTokenCursorStepInputPrefixAppenderComposed !== true || earned.cookLevinBuilderDynamicTokenCursorStepFailClosedBoundaryTimeoutFormalized !== true || earned.cookLevinBuilderDynamicTokenCursorStepSinglePaddingStepFormalized !== true) fail("current manifest Cook-Levin builder dynamic-token-cursor-step boundary mismatch");
  if (earned.cookLevinBuilderDynamicTokenCursorStepWorkTime !== "BuilderFirstClausePrefix.workSteps(input) + 1 + CursorAdvance.advanceWorkSteps(cursorWord problem)" || earned.cookLevinBuilderDynamicTokenCursorStepRawTimePolynomial !== "BuilderFirstClausePrefix.rawTimeBound + 48 + 12 * cursorWord.length" || earned.cookLevinBuilderDynamicTokenCursorStepRuleCount !== "1192 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier)") fail("current manifest Cook-Levin builder dynamic-token-cursor-step cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderDynamicTokenCursorStepAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderDynamicTokenCursorStepProjectAxiomClosure) || earned.cookLevinBuilderDynamicTokenCursorStepProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder dynamic-token-cursor-step axiom closure mismatch");
  const dynamicTokenCursorHashes = earned.cookLevinBuilderDynamicTokenCursorStepTheoremKernelTypeSha256;
  if (!dynamicTokenCursorHashes || Object.keys(dynamicTokenCursorHashes).length !== 31 || !Object.entries(BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREMS).every(([name, evidence]) => dynamicTokenCursorHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder dynamic-token-cursor-step fingerprint mismatch");
  if (earned.cookLevinBuilderDynamicTokenCursorStepExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.workRunExact" || earned.cookLevinBuilderDynamicTokenCursorStepSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.specification_step" || earned.cookLevinBuilderDynamicTokenCursorStepDirectPaddingTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.directOutcome_is_padding" || earned.cookLevinBuilderDynamicTokenCursorStepAdvancedCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTokenSlot_eq_formulaVariableSlotBound_add_thirteen" || earned.cookLevinBuilderDynamicTokenCursorStepFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTokenBits_eq_encodedFormula_firstClause" || earned.cookLevinBuilderDynamicTokenCursorStepRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.rules_length" || earned.cookLevinBuilderDynamicTokenCursorStepRulesDistinctTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.rules_pairwise_query_distinct" || earned.cookLevinBuilderDynamicTokenCursorStepAdvanceRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.rules_length" || earned.cookLevinBuilderDynamicTokenCursorStepCompiledExactTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.run_compile_exact" || earned.cookLevinBuilderDynamicTokenCursorStepCompiledBoundTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.run_compile_rawTimeBound" || earned.cookLevinBuilderDynamicTokenCursorStepAcceptTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.boundedDecide_compile_accept" || earned.cookLevinBuilderDynamicTokenCursorStepNoTimeoutTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.boundedDecide_compile_ne_timeout" || earned.cookLevinBuilderDynamicTokenCursorStepMalformedScratchTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.malformedCursorScratch_timeout" || earned.cookLevinBuilderDynamicTokenCursorStepOneStepShortTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.work_one_step_short_timeout") fail("current manifest Cook-Levin builder dynamic-token-cursor-step theorem identity mismatch");
  if (earned.cookLevinBuilderFirstClausePaddingRunFormalized !== true || earned.cookLevinBuilderFirstClausePaddingRunAxiomAuditPassed !== true || earned.cookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount !== 84 || earned.cookLevinBuilderFirstClausePaddingRunCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFirstClausePaddingRunExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized !== true || earned.cookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized !== true || earned.cookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized !== true || earned.cookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized !== true || earned.cookLevinBuilderFirstClausePaddingRunInputPrefixAppenderComposed !== true || earned.cookLevinBuilderFirstClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder first-clause-padding-run boundary mismatch");
  if (earned.cookLevinBuilderFirstClausePaddingRunWorkTime !== "BuilderDynamicTokenCursorStep.workSteps(problem) + 1 + BuilderUnaryPolynomial.workSteps(remainingPaddingPolynomial verifier, input) + 1 + PaddingCountdown.loopSteps(countControllerPrefixLength, remainingPaddingCount) + 1 + BuilderUnaryPolynomial.workSteps(secondClauseStartPolynomial verifier, input)" || earned.cookLevinBuilderFirstClausePaddingRunRawTimePolynomial !== "BuilderDynamicTokenCursorStep.rawTimeBound + 18 + 6 * BuilderUnaryPolynomial.workTimePolynomial(remainingPaddingPolynomial verifier) + 6 * countdownBoundPolynomial(verifier) + 6 * BuilderUnaryPolynomial.workTimePolynomial(secondClauseStartPolynomial verifier)" || earned.cookLevinBuilderFirstClausePaddingRunRuleCount !== "1244 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(secondClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder first-clause-padding-run cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFirstClausePaddingRunAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFirstClausePaddingRunProjectAxiomClosure) || earned.cookLevinBuilderFirstClausePaddingRunProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder first-clause-padding-run axiom closure mismatch");
  const firstClausePaddingRunHashes = earned.cookLevinBuilderFirstClausePaddingRunTheoremKernelTypeSha256;
  if (!firstClausePaddingRunHashes || Object.keys(firstClausePaddingRunHashes).length !== 48 || !Object.entries(BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREMS).every(([name, evidence]) => firstClausePaddingRunHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder first-clause-padding-run fingerprint mismatch");
  if (earned.cookLevinBuilderFirstClausePaddingRunExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.workRunExact" || earned.cookLevinBuilderFirstClausePaddingRunSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.specification_padding_run" || earned.cookLevinBuilderFirstClausePaddingRunTargetSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.specification_target_step" || earned.cookLevinBuilderFirstClausePaddingRunPaddingBlockTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.paddingSlot_direct_eq_padding" || earned.cookLevinBuilderFirstClausePaddingRunSecondClauseStartTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalTokenSlot_eq_secondClauseStart" || earned.cookLevinBuilderFirstClausePaddingRunSecondClauseSeparatorTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.secondClauseStart_direct_eq_sep" || earned.cookLevinBuilderFirstClausePaddingRunRemainingCountTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.remainingPaddingCount_eq" || earned.cookLevinBuilderFirstClausePaddingRunFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalTokenBits_eq_encodedFormula_firstClause" || earned.cookLevinBuilderFirstClausePaddingRunRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.rules_length" || earned.cookLevinBuilderFirstClausePaddingRunRulesDistinctTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.rules_pairwise_query_distinct" || earned.cookLevinBuilderFirstClausePaddingRunCountdownRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.rules_length" || earned.cookLevinBuilderFirstClausePaddingRunCompiledExactTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.run_compile_exact" || earned.cookLevinBuilderFirstClausePaddingRunCompiledBoundTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.run_compile_rawTimeBound" || earned.cookLevinBuilderFirstClausePaddingRunAcceptTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.boundedDecide_compile_accept" || earned.cookLevinBuilderFirstClausePaddingRunNoTimeoutTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.boundedDecide_compile_ne_timeout" || earned.cookLevinBuilderFirstClausePaddingRunMalformedScratchTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.malformedCountdownScratch_timeout" || earned.cookLevinBuilderFirstClausePaddingRunMalformedRootTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.malformedCountdownRoot_timeout" || earned.cookLevinBuilderFirstClausePaddingRunOneStepShortTheorem !== "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.work_one_step_short_timeout" || earned.cookLevinBuilderFirstClausePaddingRunPredecessorTransportTheorem !== "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact_of_unit_or_separator") fail("current manifest Cook-Levin builder first-clause-padding-run theorem identity mismatch");
  if (earned.cookLevinBuilderSecondClauseSeparatorStepFormalized !== true || earned.cookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed !== true || earned.cookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount !== 56 || earned.cookLevinBuilderSecondClauseSeparatorStepCompiledRawMachineFormalized !== true || earned.cookLevinBuilderSecondClauseSeparatorStepExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized !== true || earned.cookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized !== true || earned.cookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderSecondClauseSeparatorStepInputPrefixAppenderComposed !== true || earned.cookLevinBuilderSecondClauseSeparatorStepFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder second-clause-separator-step boundary mismatch");
  if (earned.cookLevinBuilderSecondClauseSeparatorStepWorkTime !== "BuilderFirstClausePaddingRun.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, firstClauseTokens problem) + 1 + CursorAdvance.advanceWorkSteps(cursorWord problem)" || earned.cookLevinBuilderSecondClauseSeparatorStepRawTimePolynomial !== "BuilderFirstClausePaddingRun.rawTimeBound + 246 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length" || earned.cookLevinBuilderSecondClauseSeparatorStepRuleCount !== "1366 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder second-clause-separator-step cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderSecondClauseSeparatorStepAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderSecondClauseSeparatorStepProjectAxiomClosure) || earned.cookLevinBuilderSecondClauseSeparatorStepProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder second-clause-separator-step axiom closure mismatch");
  const secondClauseSeparatorStepHashes = earned.cookLevinBuilderSecondClauseSeparatorStepTheoremKernelTypeSha256;
  if (!secondClauseSeparatorStepHashes || Object.keys(secondClauseSeparatorStepHashes).length !== 40 || !Object.entries(BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREMS).every(([name, evidence]) => secondClauseSeparatorStepHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder second-clause-separator-step fingerprint mismatch");
  if (earned.cookLevinBuilderSecondClauseSeparatorStepExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.workRunExact" || earned.cookLevinBuilderSecondClauseSeparatorStepSeparatorSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.specification_separator_step" || earned.cookLevinBuilderSecondClauseSeparatorStepNextSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.specification_next_step" || earned.cookLevinBuilderSecondClauseSeparatorStepCanonicalPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.secondClauseStartTokens_eq_canonical_formula_prefix" || earned.cookLevinBuilderSecondClauseSeparatorStepFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.finalTokenBits_eq_encodedFormula_secondClauseStart" || earned.cookLevinBuilderSecondClauseSeparatorStepAdvancedCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.finalTokenSlot_eq_secondClauseStart_add_one" || earned.cookLevinBuilderSecondClauseSeparatorStepNextTokenTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.nextTokenSlot_direct_eq_f" || earned.cookLevinBuilderSecondClauseSeparatorStepRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.rules_length" || earned.cookLevinBuilderSecondClauseSeparatorStepRulesDistinctTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.rules_pairwise_query_distinct" || earned.cookLevinBuilderSecondClauseSeparatorStepSuffixRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length" || earned.cookLevinBuilderSecondClauseSeparatorStepCompiledExactTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.run_compile_exact" || earned.cookLevinBuilderSecondClauseSeparatorStepCompiledBoundTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.run_compile_rawTimeBound" || earned.cookLevinBuilderSecondClauseSeparatorStepAcceptTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.boundedDecide_compile_accept" || earned.cookLevinBuilderSecondClauseSeparatorStepNoTimeoutTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.boundedDecide_compile_ne_timeout" || earned.cookLevinBuilderSecondClauseSeparatorStepMalformedAppenderTallyTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.malformedAppenderTally_timeout" || earned.cookLevinBuilderSecondClauseSeparatorStepMalformedAppenderOutputTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.malformedAppenderOutput_timeout" || earned.cookLevinBuilderSecondClauseSeparatorStepMalformedCursorScratchTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.malformedCursorScratch_timeout" || earned.cookLevinBuilderSecondClauseSeparatorStepOneStepShortTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.work_one_step_short_timeout" || earned.cookLevinBuilderSecondClauseSeparatorStepPredecessorDeadStepTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep" || earned.cookLevinBuilderSecondClauseSeparatorStepPredecessorMalformedDispatchTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead") fail("current manifest Cook-Levin builder second-clause-separator-step theorem identity mismatch");
  if (earned.cookLevinBuilderSecondClauseFirstLiteralPrefixFormalized !== true || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount !== 87 || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized !== true || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder second-clause-first-literal-prefix boundary mismatch");
  if (earned.cookLevinBuilderSecondClauseFirstLiteralPrefixWorkTime !== "BuilderSecondClauseSeparatorStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondClauseStartTokens problem) + 1 + CursorAdvance.advanceWorkSteps(firstCursorWord problem) + 1 + BuilderTokenAppender.workSteps(input, firstTokenOutput problem) + 1 + CursorAdvance.advanceWorkSteps(secondCursorWord problem)" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixRawTimePolynomial !== "BuilderSecondClauseSeparatorStep.rawTimeBound + 564 + 48 * inputLength + 24 * FormulaWidth + 24 * cursorWord.length" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixRuleCount !== "1610 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder second-clause-first-literal-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderSecondClauseFirstLiteralPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderSecondClauseFirstLiteralPrefixProjectAxiomClosure) || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder second-clause-first-literal-prefix axiom closure mismatch");
  const secondClauseFirstLiteralPrefixHashes = earned.cookLevinBuilderSecondClauseFirstLiteralPrefixTheoremKernelTypeSha256;
  if (!secondClauseFirstLiteralPrefixHashes || Object.keys(secondClauseFirstLiteralPrefixHashes).length !== 58 || !Object.entries(BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS).every(([name, evidence]) => secondClauseFirstLiteralPrefixHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder second-clause-first-literal-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderSecondClauseFirstLiteralPrefixExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.workRunExact" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixSignSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_sign_step" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixTerminatorSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixNextSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_next_step" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixCanonicalPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondClauseFirstLiteralTokens_eq_canonical_formula_prefix" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseFirstLiteral" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixAdvancedCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_three" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixSignTokenTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixTerminatorTokenTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixNextTokenTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.rules_length" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixRulesDistinctTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.rules_pairwise_query_distinct" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixFalseTokenCursorRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rules_length" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixSuffixRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rules_length" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixCompiledExactTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.run_compile_exact" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixCompiledBoundTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.run_compile_rawTimeBound" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixAcceptTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.boundedDecide_compile_accept" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixNoTimeoutTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.boundedDecide_compile_ne_timeout" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixMalformedFirstAppenderTallyTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedFirstAppenderTally_timeout" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixMalformedFirstAppenderOutputTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedFirstAppenderOutput_timeout" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixMalformedSecondAppenderTallyTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedSecondAppenderTally_timeout" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixMalformedSecondAppenderOutputTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedSecondAppenderOutput_timeout" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixMalformedFirstCursorScratchTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedFirstCursorScratch_timeout" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixMalformedSecondCursorScratchTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedSecondCursorScratch_timeout" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixOneStepShortTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.work_one_step_short_timeout" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixPredecessorDeadStepTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep" || earned.cookLevinBuilderSecondClauseFirstLiteralPrefixPredecessorMalformedDispatchTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead") fail("current manifest Cook-Levin builder second-clause-first-literal-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderSecondClauseSecondLiteralPrefixFormalized !== true || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount !== 115 || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized !== true || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder second-clause-second-literal-prefix boundary mismatch");
  if (earned.cookLevinBuilderSecondClauseSecondLiteralPrefixWorkTime !== "BuilderSecondClauseFirstLiteralPrefix.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondClauseFirstLiteralTokens problem) + 1 + CursorAdvance.advanceWorkSteps(firstCursorWord problem) + 1 + BuilderTokenAppender.workSteps(input, signTokenOutput problem) + 1 + CursorAdvance.advanceWorkSteps(secondCursorWord problem) + 1 + BuilderTokenAppender.workSteps(input, unaryTokenOutput problem) + 1 + CursorAdvance.advanceWorkSteps(thirdCursorWord problem)" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixRawTimePolynomial !== "BuilderSecondClauseFirstLiteralPrefix.rawTimeBound + 1026 + 72 * inputLength + 36 * FormulaWidth + 36 * cursorWord.length" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixRuleCount !== "1976 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder second-clause-second-literal-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderSecondClauseSecondLiteralPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderSecondClauseSecondLiteralPrefixProjectAxiomClosure) || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder second-clause-second-literal-prefix axiom closure mismatch");
  const secondClauseSecondLiteralPrefixHashes = earned.cookLevinBuilderSecondClauseSecondLiteralPrefixTheoremKernelTypeSha256;
  if (!secondClauseSecondLiteralPrefixHashes || Object.keys(secondClauseSecondLiteralPrefixHashes).length !== 75 || !Object.entries(BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS).every(([name, evidence]) => secondClauseSecondLiteralPrefixHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder second-clause-second-literal-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderSecondClauseSecondLiteralPrefixExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.workRunExact" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixSignSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_sign_step" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixUnaryUnitSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixTerminatorSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixNextSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_next_step" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixCanonicalPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondClauseSecondLiteralTokens_eq_canonical_formula_prefix" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseSecondLiteral" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixAdvancedCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_six" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixSignTokenTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixUnaryUnitTokenTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralUnaryUnitSlot_direct_eq_t" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixTerminatorTokenTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixNextTokenTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.rules_length" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixRulesDistinctTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.rules_pairwise_query_distinct" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixTrueTokenCursorRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixTrueFalseSuffixRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rules_length" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixSuffixRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixCompiledExactTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.run_compile_exact" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixCompiledBoundTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.run_compile_rawTimeBound" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixAcceptTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.boundedDecide_compile_accept" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixNoTimeoutTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.boundedDecide_compile_ne_timeout" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixMalformedSignAppenderTallyTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedSignAppenderTally_timeout" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixMalformedSignAppenderOutputTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedSignAppenderOutput_timeout" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixMalformedUnaryAppenderTallyTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedUnaryAppenderTally_timeout" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixMalformedUnaryAppenderOutputTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedUnaryAppenderOutput_timeout" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixMalformedTerminatorAppenderTallyTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedTerminatorAppenderTally_timeout" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixMalformedTerminatorAppenderOutputTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedTerminatorAppenderOutput_timeout" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixMalformedSignCursorScratchTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedSignCursorScratch_timeout" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixMalformedUnaryCursorScratchTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedUnaryCursorScratch_timeout" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixMalformedTerminatorCursorScratchTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedTerminatorCursorScratch_timeout" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixOneStepShortTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.work_one_step_short_timeout" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixPredecessorDeadStepTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep" || earned.cookLevinBuilderSecondClauseSecondLiteralPrefixPredecessorMalformedDispatchTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead") fail("current manifest Cook-Levin builder second-clause-second-literal-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderSecondClausePrefixFormalized !== true || earned.cookLevinBuilderSecondClausePrefixAxiomAuditPassed !== true || earned.cookLevinBuilderSecondClausePrefixAuditedDeclarationCount !== 57 || earned.cookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized !== true || earned.cookLevinBuilderSecondClausePrefixClauseTerminatorFormalized !== true || earned.cookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized !== true || earned.cookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder second-clause-prefix boundary mismatch");
  if (earned.cookLevinBuilderSecondClausePrefixWorkTime !== "BuilderSecondClauseSecondLiteralPrefix.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondClauseSecondLiteralTokens problem) + 1 + CursorAdvance.advanceWorkSteps(cursorWord problem)" || earned.cookLevinBuilderSecondClausePrefixRawTimePolynomial !== "BuilderSecondClauseSecondLiteralPrefix.rawTimeBound + 390 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length" || earned.cookLevinBuilderSecondClausePrefixRuleCount !== "2098 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder second-clause-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderSecondClausePrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderSecondClausePrefixProjectAxiomClosure) || earned.cookLevinBuilderSecondClausePrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder second-clause-prefix axiom closure mismatch");
  const secondClausePrefixHashes = earned.cookLevinBuilderSecondClausePrefixTheoremKernelTypeSha256;
  if (!secondClausePrefixHashes || Object.keys(secondClausePrefixHashes).length !== 41 || !Object.entries(BUILDER_SECOND_CLAUSE_PREFIX_THEOREMS).every(([name, evidence]) => secondClausePrefixHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder second-clause-prefix fingerprint mismatch");
  if (earned.cookLevinBuilderSecondClausePrefixExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.workRunExact" || earned.cookLevinBuilderSecondClausePrefixTerminatorSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_terminator_step" || earned.cookLevinBuilderSecondClausePrefixNextSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_next_step" || earned.cookLevinBuilderSecondClausePrefixCanonicalPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.secondClauseTokens_eq_canonical_formula_prefix" || earned.cookLevinBuilderSecondClausePrefixFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenBits_eq_encodedFormula_secondClause" || earned.cookLevinBuilderSecondClausePrefixAdvancedCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenSlot_eq_secondClauseStart_add_seven" || earned.cookLevinBuilderSecondClausePrefixTerminatorTokenTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.clauseTerminatorSlot_direct_eq_finish" || earned.cookLevinBuilderSecondClausePrefixNextTokenTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.nextTokenSlot_direct_eq_padding" || earned.cookLevinBuilderSecondClausePrefixRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.rules_length" || earned.cookLevinBuilderSecondClausePrefixRulesDistinctTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.rules_pairwise_query_distinct" || earned.cookLevinBuilderSecondClausePrefixFinishTokenCursorRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.FinishTokenCursor.rules_length" || earned.cookLevinBuilderSecondClausePrefixCompiledExactTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.run_compile_exact" || earned.cookLevinBuilderSecondClausePrefixCompiledBoundTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.run_compile_rawTimeBound" || earned.cookLevinBuilderSecondClausePrefixAcceptTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.boundedDecide_compile_accept" || earned.cookLevinBuilderSecondClausePrefixNoTimeoutTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.boundedDecide_compile_ne_timeout" || earned.cookLevinBuilderSecondClausePrefixMalformedAppenderTallyTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.malformedAppenderTally_timeout" || earned.cookLevinBuilderSecondClausePrefixMalformedAppenderOutputTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.malformedAppenderOutput_timeout" || earned.cookLevinBuilderSecondClausePrefixMalformedCursorScratchTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.malformedCursorScratch_timeout" || earned.cookLevinBuilderSecondClausePrefixOneStepShortTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.work_one_step_short_timeout" || earned.cookLevinBuilderSecondClausePrefixPredecessorDeadStepTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep" || earned.cookLevinBuilderSecondClausePrefixPredecessorMalformedDispatchTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead") fail("current manifest Cook-Levin builder second-clause-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderSecondClausePaddingRunFormalized !== true || earned.cookLevinBuilderSecondClausePaddingRunAxiomAuditPassed !== true || earned.cookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount !== 68 || earned.cookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized !== true || earned.cookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized !== true || earned.cookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized !== true || earned.cookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized !== true || earned.cookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized !== true || earned.cookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized !== true || earned.cookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed !== true || earned.cookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder second-clause-padding-run boundary mismatch");
  if (earned.cookLevinBuilderSecondClausePaddingRunWorkTime !== "BuilderSecondClausePrefix.workSteps(problem) + 1 + BuilderUnaryPolynomial.workSteps(remainingPaddingPolynomial verifier, input) + 1 + PaddingCountdown.loopSteps(countControllerPrefixLength, remainingPaddingCount) + 1 + BuilderUnaryPolynomial.workSteps(thirdClauseStartPolynomial verifier, input)" || earned.cookLevinBuilderSecondClausePaddingRunRawTimePolynomial !== "BuilderSecondClausePrefix.rawTimeBound + 18 + 6 * countEvaluator.workSteps + 6 * (D * (2 * countRootPrefixLength + 8) + D * D) + 6 * targetEvaluator.workSteps" || earned.cookLevinBuilderSecondClausePaddingRunRuleCount !== "2150 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder second-clause-padding-run cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderSecondClausePaddingRunAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderSecondClausePaddingRunProjectAxiomClosure) || earned.cookLevinBuilderSecondClausePaddingRunProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder second-clause-padding-run axiom closure mismatch");
  const secondClausePaddingRunHashes = earned.cookLevinBuilderSecondClausePaddingRunTheoremKernelTypeSha256;
  if (!secondClausePaddingRunHashes || Object.keys(secondClausePaddingRunHashes).length !== 39 || !Object.entries(BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREMS).every(([name, evidence]) => secondClausePaddingRunHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder second-clause-padding-run fingerprint mismatch");
  if (earned.cookLevinBuilderSecondClausePaddingRunExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.workRunExact" || earned.cookLevinBuilderSecondClausePaddingRunPaddingSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_padding_run" || earned.cookLevinBuilderSecondClausePaddingRunTargetSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_target_step" || earned.cookLevinBuilderSecondClausePaddingRunFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenBits_eq_encodedFormula_secondClause" || earned.cookLevinBuilderSecondClausePaddingRunRemainingCountTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_seven" || earned.cookLevinBuilderSecondClausePaddingRunThirdClauseCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenSlot_eq_thirdClauseStart" || earned.cookLevinBuilderSecondClausePaddingRunDirectPaddingTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.paddingSlot_direct_eq_padding" || earned.cookLevinBuilderSecondClausePaddingRunDirectSeparatorTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.thirdClauseStart_direct_eq_sep" || earned.cookLevinBuilderSecondClausePaddingRunRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.rules_length" || earned.cookLevinBuilderSecondClausePaddingRunRulesDistinctTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.rules_pairwise_query_distinct" || earned.cookLevinBuilderSecondClausePaddingRunCompiledExactTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.run_compile_exact" || earned.cookLevinBuilderSecondClausePaddingRunCompiledBoundTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.run_compile_rawTimeBound" || earned.cookLevinBuilderSecondClausePaddingRunAcceptTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.boundedDecide_compile_accept" || earned.cookLevinBuilderSecondClausePaddingRunNoTimeoutTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.boundedDecide_compile_ne_timeout" || earned.cookLevinBuilderSecondClausePaddingRunMalformedRootTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.malformedCountdownRoot_timeout" || earned.cookLevinBuilderSecondClausePaddingRunMalformedScratchTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.malformedCountdownScratch_timeout" || earned.cookLevinBuilderSecondClausePaddingRunOneStepShortTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.work_one_step_short_timeout") fail("current manifest Cook-Levin builder second-clause-padding-run theorem identity mismatch");
  if (earned.cookLevinBuilderThirdClauseSeparatorStepFormalized !== true || earned.cookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed !== true || earned.cookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount !== 56 || earned.cookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized !== true || earned.cookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized !== true || earned.cookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized !== true || earned.cookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed !== true || earned.cookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder third-clause-separator-step boundary mismatch");
  if (earned.cookLevinBuilderThirdClauseSeparatorStepWorkTime !== "BuilderSecondClausePaddingRun.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondClauseTokens problem) + 1 + CursorAdvance.advanceWorkSteps(cursorWord problem)" || earned.cookLevinBuilderThirdClauseSeparatorStepRawTimePolynomial !== "BuilderSecondClausePaddingRun.rawTimeBound + 330 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length" || earned.cookLevinBuilderThirdClauseSeparatorStepRuleCount !== "2272 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder third-clause-separator-step cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderThirdClauseSeparatorStepAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderThirdClauseSeparatorStepProjectAxiomClosure) || earned.cookLevinBuilderThirdClauseSeparatorStepProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder third-clause-separator-step axiom closure mismatch");
  const thirdClauseSeparatorStepHashes = earned.cookLevinBuilderThirdClauseSeparatorStepTheoremKernelTypeSha256;
  if (!thirdClauseSeparatorStepHashes || Object.keys(thirdClauseSeparatorStepHashes).length !== 40 || !Object.entries(BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREMS).every(([name, evidence]) => thirdClauseSeparatorStepHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder third-clause-separator-step fingerprint mismatch");
  if (earned.cookLevinBuilderThirdClauseSeparatorStepExactWorkRunTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.workRunExact" || earned.cookLevinBuilderThirdClauseSeparatorStepSeparatorSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_separator_step" || earned.cookLevinBuilderThirdClauseSeparatorStepNextSpecificationTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_next_step" || earned.cookLevinBuilderThirdClauseSeparatorStepCanonicalPrefixTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.thirdClauseStartTokens_eq_canonical_formula_prefix" || earned.cookLevinBuilderThirdClauseSeparatorStepFormulaBitsTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenBits_eq_encodedFormula_thirdClauseStart" || earned.cookLevinBuilderThirdClauseSeparatorStepAdvancedCoordinateTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenSlot_eq_thirdClauseStart_add_one" || earned.cookLevinBuilderThirdClauseSeparatorStepNextTokenTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.nextTokenSlot_direct_eq_f" || earned.cookLevinBuilderThirdClauseSeparatorStepRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.rules_length" || earned.cookLevinBuilderThirdClauseSeparatorStepRulesDistinctTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.rules_pairwise_query_distinct" || earned.cookLevinBuilderThirdClauseSeparatorStepSuffixRulesLengthTheorem !== "PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length" || earned.cookLevinBuilderThirdClauseSeparatorStepCompiledExactTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.run_compile_exact" || earned.cookLevinBuilderThirdClauseSeparatorStepCompiledBoundTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.run_compile_rawTimeBound" || earned.cookLevinBuilderThirdClauseSeparatorStepAcceptTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.boundedDecide_compile_accept" || earned.cookLevinBuilderThirdClauseSeparatorStepNoTimeoutTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.boundedDecide_compile_ne_timeout" || earned.cookLevinBuilderThirdClauseSeparatorStepMalformedAppenderTallyTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.malformedAppenderTally_timeout" || earned.cookLevinBuilderThirdClauseSeparatorStepMalformedAppenderOutputTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.malformedAppenderOutput_timeout" || earned.cookLevinBuilderThirdClauseSeparatorStepMalformedCursorScratchTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.malformedCursorScratch_timeout" || earned.cookLevinBuilderThirdClauseSeparatorStepOneStepShortTheorem !== "PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.work_one_step_short_timeout" || earned.cookLevinBuilderThirdClauseSeparatorStepPredecessorDeadStepTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep" || earned.cookLevinBuilderThirdClauseSeparatorStepPredecessorMalformedDispatchTheorem !== "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead") fail("current manifest Cook-Levin builder third-clause-separator-step theorem identity mismatch");
  if (earned.cookLevinBuilderThirdClauseFirstLiteralPrefixFormalized !== true || earned.cookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount !== 87 || earned.cookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized !== true || earned.cookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder third-clause-first-literal-prefix boundary mismatch");
  if (earned.cookLevinBuilderThirdClauseFirstLiteralPrefixWorkTime !== "BuilderThirdClauseSeparatorStep.workSteps(problem) + 1 + BuilderThirdClauseFirstLiteralPrefix.suffixWorkSteps(problem)" || earned.cookLevinBuilderThirdClauseFirstLiteralPrefixRawTimePolynomial !== "BuilderThirdClauseSeparatorStep.rawTimeBound + 732 + 48 * inputLength + 24 * FormulaWidth + 24 * cursorWord.length" || earned.cookLevinBuilderThirdClauseFirstLiteralPrefixRuleCount !== "2516 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder third-clause-first-literal-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderThirdClauseFirstLiteralPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderThirdClauseFirstLiteralPrefixProjectAxiomClosure) || earned.cookLevinBuilderThirdClauseFirstLiteralPrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder third-clause-first-literal-prefix axiom closure mismatch");
  const thirdClauseFirstLiteralPrefixHashes = earned.cookLevinBuilderThirdClauseFirstLiteralPrefixTheoremKernelTypeSha256;
  if (!thirdClauseFirstLiteralPrefixHashes || Object.keys(thirdClauseFirstLiteralPrefixHashes).length !== 58 || !Object.entries(BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS).every(([name, evidence]) => thirdClauseFirstLiteralPrefixHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder third-clause-first-literal-prefix fingerprint mismatch");
  if (!Object.entries(BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderThirdClauseFirstLiteralPrefix${suffix}`] === theorem)) fail("current manifest Cook-Levin builder third-clause-first-literal-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderThirdClauseSecondLiteralPrefixFormalized !== true || earned.cookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount !== 145 || earned.cookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized !== true || earned.cookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized !== true || earned.cookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder third-clause-second-literal-prefix boundary mismatch");
  if (earned.cookLevinBuilderThirdClauseSecondLiteralPrefixWorkTime !== "BuilderThirdClauseFirstLiteralPrefix.workSteps(problem) + 1 + BuilderThirdClauseSecondLiteralPrefix.suffixWorkSteps(problem)" || earned.cookLevinBuilderThirdClauseSecondLiteralPrefixRawTimePolynomial !== "BuilderThirdClauseFirstLiteralPrefix.rawTimeBound + 1752 + 96 * inputLength + 48 * FormulaWidth + 48 * cursorWord.length" || earned.cookLevinBuilderThirdClauseSecondLiteralPrefixRuleCount !== "3004 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder third-clause-second-literal-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderThirdClauseSecondLiteralPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderThirdClauseSecondLiteralPrefixProjectAxiomClosure) || earned.cookLevinBuilderThirdClauseSecondLiteralPrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder third-clause-second-literal-prefix axiom closure mismatch");
  const thirdClauseSecondLiteralPrefixHashes = earned.cookLevinBuilderThirdClauseSecondLiteralPrefixTheoremKernelTypeSha256;
  if (!thirdClauseSecondLiteralPrefixHashes || Object.keys(thirdClauseSecondLiteralPrefixHashes).length !== 92 || !Object.entries(BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS).every(([name, evidence]) => thirdClauseSecondLiteralPrefixHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder third-clause-second-literal-prefix fingerprint mismatch");
  if (!Object.entries(BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderThirdClauseSecondLiteralPrefix${suffix}`] === theorem)) fail("current manifest Cook-Levin builder third-clause-second-literal-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderThirdClausePrefixFormalized !== true || earned.cookLevinBuilderThirdClausePrefixAxiomAuditPassed !== true || earned.cookLevinBuilderThirdClausePrefixAuditedDeclarationCount !== 57 || earned.cookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized !== true || earned.cookLevinBuilderThirdClausePrefixClauseTerminatorFormalized !== true || earned.cookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized !== true || earned.cookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder third-clause-prefix boundary mismatch");
  if (earned.cookLevinBuilderThirdClausePrefixWorkTime !== "BuilderThirdClauseSecondLiteralPrefix.workSteps(problem) + 1 + appenderWorkSteps(problem) + 1 + cursorWorkSteps(problem)" || earned.cookLevinBuilderThirdClausePrefixRawTimePolynomial !== "BuilderThirdClauseSecondLiteralPrefix.rawTimeBound + 498 + 24 * inputLength + 12 * FormulaWidth + 12 * BuilderThirdClauseSeparatorStep.cursorWord.length" || earned.cookLevinBuilderThirdClausePrefixRuleCount !== "3126 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder third-clause-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderThirdClausePrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderThirdClausePrefixProjectAxiomClosure) || earned.cookLevinBuilderThirdClausePrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder third-clause-prefix axiom closure mismatch");
  const thirdClausePrefixHashes = earned.cookLevinBuilderThirdClausePrefixTheoremKernelTypeSha256;
  if (!thirdClausePrefixHashes || Object.keys(thirdClausePrefixHashes).length !== 41 || !Object.entries(BUILDER_THIRD_CLAUSE_PREFIX_THEOREMS).every(([name, evidence]) => thirdClausePrefixHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder third-clause-prefix fingerprint mismatch");
  if (!Object.entries(BUILDER_THIRD_CLAUSE_PREFIX_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderThirdClausePrefix${suffix}`] === theorem)) fail("current manifest Cook-Levin builder third-clause-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderThirdClausePaddingRunFormalized !== true || earned.cookLevinBuilderThirdClausePaddingRunAxiomAuditPassed !== true || earned.cookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount !== 68 || earned.cookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized !== true || earned.cookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized !== true || earned.cookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized !== true || earned.cookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized !== true || earned.cookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized !== true || earned.cookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized !== true || earned.cookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed !== true || earned.cookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder third-clause-padding-run boundary mismatch");
  if (earned.cookLevinBuilderThirdClausePaddingRunWorkTime !== "BuilderThirdClausePrefix.workSteps(problem) + 1 + BuilderUnaryPolynomial.workSteps(remainingPaddingPolynomial verifier, input) + 1 + PaddingCountdown.loopSteps(countControllerPrefixLength, remainingPaddingCount) + 1 + BuilderUnaryPolynomial.workSteps(fourthClauseStartPolynomial verifier, input)" || earned.cookLevinBuilderThirdClausePaddingRunRawTimePolynomial !== "BuilderThirdClausePrefix.rawTimeBound + 18 + 6 * countEvaluator.workSteps + 6 * (D * (2 * countRootPrefixLength + 8) + D * D) + 6 * targetEvaluator.workSteps" || earned.cookLevinBuilderThirdClausePaddingRunRuleCount !== "3178 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.fourthClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder third-clause-padding-run cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderThirdClausePaddingRunAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderThirdClausePaddingRunProjectAxiomClosure) || earned.cookLevinBuilderThirdClausePaddingRunProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder third-clause-padding-run axiom closure mismatch");
  const thirdClausePaddingRunHashes = earned.cookLevinBuilderThirdClausePaddingRunTheoremKernelTypeSha256;
  if (!thirdClausePaddingRunHashes || Object.keys(thirdClausePaddingRunHashes).length !== 39 || !Object.entries(BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREMS).every(([name, evidence]) => thirdClausePaddingRunHashes[name] === evidence.hash)) fail("current manifest Cook-Levin builder third-clause-padding-run fingerprint mismatch");
  if (!Object.entries(BUILDER_THIRD_CLAUSE_PADDING_RUN_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderThirdClausePaddingRun${suffix}`] === theorem)) fail("current manifest Cook-Levin builder third-clause-padding-run theorem identity mismatch");
  if (earned.cookLevinBuilderFourthClauseSeparatorStepFormalized !== true || earned.cookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed !== true || earned.cookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount !== 56 || earned.cookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized !== true || earned.cookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed !== true || earned.cookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder fourth-clause-separator-step boundary mismatch");
  if (earned.cookLevinBuilderFourthClauseSeparatorStepWorkTime !== "BuilderThirdClausePaddingRun.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, thirdClauseTokens problem) + 1 + CursorAdvance.advanceWorkSteps(cursorWord problem)" || earned.cookLevinBuilderFourthClauseSeparatorStepRawTimePolynomial !== "BuilderThirdClausePaddingRun.rawTimeBound + 426 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length" || earned.cookLevinBuilderFourthClauseSeparatorStepRuleCount !== "3300 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.fourthClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder fourth-clause-separator-step cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFourthClauseSeparatorStepAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFourthClauseSeparatorStepProjectAxiomClosure) || earned.cookLevinBuilderFourthClauseSeparatorStepProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder fourth-clause-separator-step axiom closure mismatch");
  const fourthClauseSeparatorStepHashes = earned.cookLevinBuilderFourthClauseSeparatorStepTheoremKernelTypeSha256;
  if (!fourthClauseSeparatorStepHashes || Object.keys(fourthClauseSeparatorStepHashes).length !== 40 || !Object.entries(BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREMS).every(([name, row]) => fourthClauseSeparatorStepHashes[name] === row.hash)) fail("current manifest Cook-Levin builder fourth-clause-separator-step fingerprint mismatch");
  if (!Object.entries(BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderFourthClauseSeparatorStep${suffix}`] === theorem)) fail("current manifest Cook-Levin builder fourth-clause-separator-step theorem identity mismatch");
  if (earned.cookLevinBuilderFourthClauseFirstLiteralPrefixFormalized !== true || earned.cookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount !== 115 || earned.cookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFourthClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFourthClauseFirstLiteralPrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized !== true || earned.cookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderFourthClauseFirstLiteralPrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder fourth-clause-first-literal-prefix boundary mismatch");
  if (earned.cookLevinBuilderFourthClauseFirstLiteralPrefixWorkTime !== "BuilderFourthClauseSeparatorStep.workSteps(problem) + 1 + BuilderFourthClauseFirstLiteralPrefix.suffixWorkSteps(problem)" || earned.cookLevinBuilderFourthClauseFirstLiteralPrefixRawTimePolynomial !== "BuilderFourthClauseSeparatorStep.rawTimeBound + 1422 + 72 * inputLength + 36 * FormulaWidth + 36 * cursorWord.length" || earned.cookLevinBuilderFourthClauseFirstLiteralPrefixRuleCount !== "3666 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.fourthClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder fourth-clause-first-literal-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFourthClauseFirstLiteralPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFourthClauseFirstLiteralPrefixProjectAxiomClosure) || earned.cookLevinBuilderFourthClauseFirstLiteralPrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder fourth-clause-first-literal-prefix axiom closure mismatch");
  const fourthClauseFirstLiteralPrefixHashes = earned.cookLevinBuilderFourthClauseFirstLiteralPrefixTheoremKernelTypeSha256;
  if (!fourthClauseFirstLiteralPrefixHashes || Object.keys(fourthClauseFirstLiteralPrefixHashes).length !== 75 || !Object.entries(BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS).every(([name, row]) => fourthClauseFirstLiteralPrefixHashes[name] === row.hash)) fail("current manifest Cook-Levin builder fourth-clause-first-literal-prefix fingerprint mismatch");
  if (!Object.entries(BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderFourthClauseFirstLiteralPrefix${suffix}`] === theorem)) fail("current manifest Cook-Levin builder fourth-clause-first-literal-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderFourthClauseSecondLiteralPrefixFormalized !== true || earned.cookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed !== true || earned.cookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount !== 147 || earned.cookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFourthClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFourthClauseSecondLiteralPrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized !== true || earned.cookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderFourthClauseSecondLiteralPrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder fourth-clause-second-literal-prefix boundary mismatch");
  if (earned.cookLevinBuilderFourthClauseSecondLiteralPrefixWorkTime !== "BuilderFourthClauseFirstLiteralPrefix.workSteps(problem) + 1 + BuilderFourthClauseSecondLiteralPrefix.suffixWorkSteps(problem)" || earned.cookLevinBuilderFourthClauseSecondLiteralPrefixRawTimePolynomial !== "BuilderFourthClauseFirstLiteralPrefix.rawTimeBound + 2232 + 96 * inputLength + 48 * FormulaWidth + 48 * cursorWord.length" || earned.cookLevinBuilderFourthClauseSecondLiteralPrefixRuleCount !== "4154 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.fourthClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder fourth-clause-second-literal-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFourthClauseSecondLiteralPrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFourthClauseSecondLiteralPrefixProjectAxiomClosure) || earned.cookLevinBuilderFourthClauseSecondLiteralPrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder fourth-clause-second-literal-prefix axiom closure mismatch");
  const fourthClauseSecondLiteralPrefixHashes = earned.cookLevinBuilderFourthClauseSecondLiteralPrefixTheoremKernelTypeSha256;
  if (!fourthClauseSecondLiteralPrefixHashes || Object.keys(fourthClauseSecondLiteralPrefixHashes).length !== 92 || !Object.entries(BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS).every(([name, row]) => fourthClauseSecondLiteralPrefixHashes[name] === row.hash)) fail("current manifest Cook-Levin builder fourth-clause-second-literal-prefix fingerprint mismatch");
  if (!Object.entries(BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderFourthClauseSecondLiteralPrefix${suffix}`] === theorem)) fail("current manifest Cook-Levin builder fourth-clause-second-literal-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderFourthClausePrefixFormalized !== true || earned.cookLevinBuilderFourthClausePrefixAxiomAuditPassed !== true || earned.cookLevinBuilderFourthClausePrefixAuditedDeclarationCount !== 57 || earned.cookLevinBuilderFourthClausePrefixCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFourthClausePrefixExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFourthClausePrefixExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized !== true || earned.cookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderFourthClausePrefixInputPrefixAppenderComposed !== true || earned.cookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder fourth-clause-prefix boundary mismatch");
  if (earned.cookLevinBuilderFourthClausePrefixWorkTime !== "BuilderFourthClauseSecondLiteralPrefix.workSteps(problem) + 1 + BuilderFourthClausePrefix.suffixWorkSteps(problem)" || earned.cookLevinBuilderFourthClausePrefixRawTimePolynomial !== "BuilderFourthClauseSecondLiteralPrefix.rawTimeBound + 618 + 24 * inputLength + 12 * FormulaWidth + 12 * BuilderFourthClauseSeparatorStep.cursorWord.length" || earned.cookLevinBuilderFourthClausePrefixRuleCount !== "4276 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.fourthClauseStartPolynomial verifier)") fail("current manifest Cook-Levin builder fourth-clause-prefix cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFourthClausePrefixAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFourthClausePrefixProjectAxiomClosure) || earned.cookLevinBuilderFourthClausePrefixProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder fourth-clause-prefix axiom closure mismatch");
  const fourthClausePrefixHashes = earned.cookLevinBuilderFourthClausePrefixTheoremKernelTypeSha256;
  if (!fourthClausePrefixHashes || Object.keys(fourthClausePrefixHashes).length !== 41 || !Object.entries(BUILDER_FOURTH_CLAUSE_PREFIX_THEOREMS).every(([name, row]) => fourthClausePrefixHashes[name] === row.hash)) fail("current manifest Cook-Levin builder fourth-clause-prefix fingerprint mismatch");
  if (!Object.entries(BUILDER_FOURTH_CLAUSE_PREFIX_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderFourthClausePrefix${suffix}`] === theorem)) fail("current manifest Cook-Levin builder fourth-clause-prefix theorem identity mismatch");
  if (earned.cookLevinBuilderFourthClausePaddingRunFormalized !== true || earned.cookLevinBuilderFourthClausePaddingRunAxiomAuditPassed !== true || earned.cookLevinBuilderFourthClausePaddingRunAuditedDeclarationCount !== 68 || earned.cookLevinBuilderFourthClausePaddingRunCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFourthClausePaddingRunExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFourthClausePaddingRunExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFourthClausePaddingRunRemainingPaddingCountFormalized !== true || earned.cookLevinBuilderFourthClausePaddingRunDirectPaddingBlockFormalized !== true || earned.cookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized !== true || earned.cookLevinBuilderFourthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized !== true || earned.cookLevinBuilderFourthClausePaddingRunInputPrefixAppenderComposed !== true || earned.cookLevinBuilderFourthClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder fourth-clause-padding-run boundary mismatch");
  if (earned.cookLevinBuilderFourthClausePaddingRunWorkTime !== "BuilderFourthClausePrefix.workSteps(problem) + 1 + BuilderUnaryPolynomial.workSteps(remainingPaddingPolynomial verifier, input) + 1 + PaddingCountdown.loopSteps(countControllerPrefixLength, remainingPaddingCount) + 1 + BuilderUnaryPolynomial.workSteps(fifthClauseSlotStartPolynomial verifier, input)" || earned.cookLevinBuilderFourthClausePaddingRunRawTimePolynomial !== "BuilderFourthClausePrefix.rawTimeBound + 18 + 6 * countEvaluator.workSteps + 6 * (D * (2 * countRootPrefixLength + 8) + D * D) + 6 * targetEvaluator.workSteps" || earned.cookLevinBuilderFourthClausePaddingRunRuleCount !== "4328 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.fourthClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFourthClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFourthClausePaddingRun.fifthClauseSlotStartPolynomial verifier)") fail("current manifest Cook-Levin builder fourth-clause-padding-run cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFourthClausePaddingRunAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFourthClausePaddingRunProjectAxiomClosure) || earned.cookLevinBuilderFourthClausePaddingRunProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder fourth-clause-padding-run axiom closure mismatch");
  const fourthClausePaddingRunHashes = earned.cookLevinBuilderFourthClausePaddingRunTheoremKernelTypeSha256;
  if (!fourthClausePaddingRunHashes || Object.keys(fourthClausePaddingRunHashes).length !== 39 || !Object.entries(BUILDER_FOURTH_CLAUSE_PADDING_RUN_THEOREMS).every(([name, row]) => fourthClausePaddingRunHashes[name] === row.hash)) fail("current manifest Cook-Levin builder fourth-clause-padding-run fingerprint mismatch");
  if (!Object.entries(BUILDER_FOURTH_CLAUSE_PADDING_RUN_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderFourthClausePaddingRun${suffix}`] === theorem)) fail("current manifest Cook-Levin builder fourth-clause-padding-run theorem identity mismatch");
  if (earned.cookLevinBuilderFifthClausePaddingRunFormalized !== true || earned.cookLevinBuilderFifthClausePaddingRunAxiomAuditPassed !== true || earned.cookLevinBuilderFifthClausePaddingRunAuditedDeclarationCount !== 68 || earned.cookLevinBuilderFifthClausePaddingRunCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFifthClausePaddingRunExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFifthClausePaddingRunExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFifthClausePaddingRunPaddingCountFormalized !== true || earned.cookLevinBuilderFifthClausePaddingRunDirectPaddingBlockFormalized !== true || earned.cookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized !== true || earned.cookLevinBuilderFifthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized !== true || earned.cookLevinBuilderFifthClausePaddingRunInputPrefixAppenderComposed !== true || earned.cookLevinBuilderFifthClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder fifth-clause-padding-run boundary mismatch");
  if (earned.cookLevinBuilderFifthClausePaddingRunWorkTime !== "BuilderFourthClausePaddingRun.workSteps(problem) + 1 + BuilderUnaryPolynomial.workSteps(paddingPolynomial verifier, input) + 1 + PaddingCountdown.loopSteps(countControllerPrefixLength, paddingCount) + 1 + BuilderUnaryPolynomial.workSteps(sixthClauseSlotStartPolynomial verifier, input)" || earned.cookLevinBuilderFifthClausePaddingRunRawTimePolynomial !== "BuilderFourthClausePaddingRun.rawTimeBound + 18 + 6 * countEvaluator.workSteps + 6 * (D * (2 * countRootPrefixLength + 8) + D * D) + 6 * targetEvaluator.workSteps" || earned.cookLevinBuilderFifthClausePaddingRunRuleCount !== "4380 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.fourthClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFourthClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFourthClausePaddingRun.fifthClauseSlotStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFifthClausePaddingRun.paddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFifthClausePaddingRun.sixthClauseSlotStartPolynomial verifier)") fail("current manifest Cook-Levin builder fifth-clause-padding-run cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFifthClausePaddingRunAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFifthClausePaddingRunProjectAxiomClosure) || earned.cookLevinBuilderFifthClausePaddingRunProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder fifth-clause-padding-run axiom closure mismatch");
  const fifthClausePaddingRunHashes = earned.cookLevinBuilderFifthClausePaddingRunTheoremKernelTypeSha256;
  if (!fifthClausePaddingRunHashes || Object.keys(fifthClausePaddingRunHashes).length !== 39 || !Object.entries(BUILDER_FIFTH_CLAUSE_PADDING_RUN_THEOREMS).every(([name, row]) => fifthClausePaddingRunHashes[name] === row.hash)) fail("current manifest Cook-Levin builder fifth-clause-padding-run fingerprint mismatch");
  if (!Object.entries(BUILDER_FIFTH_CLAUSE_PADDING_RUN_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderFifthClausePaddingRun${suffix}`] === theorem)) fail("current manifest Cook-Levin builder fifth-clause-padding-run theorem identity mismatch");
  if (earned.cookLevinBuilderFirstConstraintPaddingRunFormalized !== true || earned.cookLevinBuilderFirstConstraintPaddingRunAxiomAuditPassed !== true || earned.cookLevinBuilderFirstConstraintPaddingRunAuditedDeclarationCount !== 68 || earned.cookLevinBuilderFirstConstraintPaddingRunCompiledRawMachineFormalized !== true || earned.cookLevinBuilderFirstConstraintPaddingRunExternalInputSizePolynomialFormalized !== true || earned.cookLevinBuilderFirstConstraintPaddingRunExactFormulaBitsFormalized !== true || earned.cookLevinBuilderFirstConstraintPaddingRunPaddingCountFormalized !== true || earned.cookLevinBuilderFirstConstraintPaddingRunDirectPaddingBlockFormalized !== true || earned.cookLevinBuilderFirstConstraintPaddingRunSecondConstraintSeparatorFormalized !== true || earned.cookLevinBuilderFirstConstraintPaddingRunRetainedAdvancedTokenCoordinateFormalized !== true || earned.cookLevinBuilderFirstConstraintPaddingRunNoEmissionSpecificationFormalized !== true || earned.cookLevinBuilderFirstConstraintPaddingRunInputPrefixAppenderComposed !== true || earned.cookLevinBuilderFirstConstraintPaddingRunFailClosedBoundaryTimeoutFormalized !== true) fail("current manifest Cook-Levin builder first-constraint-padding-run boundary mismatch");
  if (earned.cookLevinBuilderFirstConstraintPaddingRunWorkTime !== "BuilderFifthClausePaddingRun.workSteps(problem) + 1 + BuilderUnaryPolynomial.workSteps(paddingPolynomial verifier, input) + 1 + PaddingCountdown.loopSteps(countControllerPrefixLength, paddingCount) + 1 + BuilderUnaryPolynomial.workSteps(secondConstraintStartPolynomial verifier, input)" || earned.cookLevinBuilderFirstConstraintPaddingRunRawTimePolynomial !== "BuilderFifthClausePaddingRun.rawTimeBound + 18 + 6 * countEvaluator.workSteps + 6 * (D * (2 * countRootPrefixLength + 8) + D * D) + 6 * targetEvaluator.workSteps" || earned.cookLevinBuilderFirstConstraintPaddingRunRuleCount !== "4432 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.fourthClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFourthClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFourthClausePaddingRun.fifthClauseSlotStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFifthClausePaddingRun.paddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFifthClausePaddingRun.sixthClauseSlotStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstConstraintPaddingRun.paddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstConstraintPaddingRun.secondConstraintStartPolynomial verifier)") fail("current manifest Cook-Levin builder first-constraint-padding-run cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderFirstConstraintPaddingRunAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderFirstConstraintPaddingRunProjectAxiomClosure) || earned.cookLevinBuilderFirstConstraintPaddingRunProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder first-constraint-padding-run axiom closure mismatch");
  const firstConstraintPaddingRunHashes = earned.cookLevinBuilderFirstConstraintPaddingRunTheoremKernelTypeSha256;
  if (!firstConstraintPaddingRunHashes || Object.keys(firstConstraintPaddingRunHashes).length !== 39 || !Object.entries(BUILDER_FIRST_CONSTRAINT_PADDING_RUN_THEOREMS).every(([name, row]) => firstConstraintPaddingRunHashes[name] === row.hash)) fail("current manifest Cook-Levin builder first-constraint-padding-run fingerprint mismatch");
  if (!Object.entries(BUILDER_FIRST_CONSTRAINT_PADDING_RUN_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderFirstConstraintPaddingRun${suffix}`] === theorem)) fail("current manifest Cook-Levin builder first-constraint-padding-run theorem identity mismatch");
  if (!(earned.cookLevinBuilderSecondConstraintSeparatorStepFormalized === true && earned.cookLevinBuilderSecondConstraintSeparatorStepAxiomAuditPassed === true && earned.cookLevinBuilderSecondConstraintSeparatorStepAuditedDeclarationCount === 56 && earned.cookLevinBuilderSecondConstraintSeparatorStepCompiledRawMachineFormalized === true && earned.cookLevinBuilderSecondConstraintSeparatorStepExternalInputSizePolynomialFormalized === true && earned.cookLevinBuilderSecondConstraintSeparatorStepExactFormulaBitsFormalized === true && earned.cookLevinBuilderSecondConstraintSeparatorStepSecondConstraintSeparatorFormalized === true && earned.cookLevinBuilderSecondConstraintSeparatorStepRetainedAdvancedTokenCoordinateFormalized === true && earned.cookLevinBuilderSecondConstraintSeparatorStepInputPrefixAppenderComposed === true && earned.cookLevinBuilderSecondConstraintSeparatorStepFailClosedBoundaryTimeoutFormalized === true)) fail("current manifest Cook-Levin builder second-constraint-separator-step boundary mismatch");
  if (earned.cookLevinBuilderSecondConstraintSeparatorStepWorkTime !== "BuilderFirstConstraintPaddingRun.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, fourthClauseTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)" || earned.cookLevinBuilderSecondConstraintSeparatorStepRawTimePolynomial !== "BuilderFirstConstraintPaddingRun.rawTimeBound + 534 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length" || earned.cookLevinBuilderSecondConstraintSeparatorStepRuleCount !== "4554 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.fourthClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFourthClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFourthClausePaddingRun.fifthClauseSlotStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFifthClausePaddingRun.paddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFifthClausePaddingRun.sixthClauseSlotStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstConstraintPaddingRun.paddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstConstraintPaddingRun.secondConstraintStartPolynomial verifier)") fail("current manifest Cook-Levin builder second-constraint-separator-step cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderSecondConstraintSeparatorStepAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderSecondConstraintSeparatorStepProjectAxiomClosure) || earned.cookLevinBuilderSecondConstraintSeparatorStepProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder second-constraint-separator-step axiom closure mismatch");
  const secondConstraintSeparatorHashes = earned.cookLevinBuilderSecondConstraintSeparatorStepTheoremKernelTypeSha256;
  if (!secondConstraintSeparatorHashes || Object.keys(secondConstraintSeparatorHashes).length !== 40 || !Object.entries(BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_THEOREMS).every(([name, row]) => secondConstraintSeparatorHashes[name] === row.hash)) fail("current manifest Cook-Levin builder second-constraint-separator-step fingerprint mismatch");
  if (!Object.entries(BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderSecondConstraintSeparatorStep${suffix}`] === theorem)) fail("current manifest Cook-Levin builder second-constraint-separator-step theorem identity mismatch");
  if (!(earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomAuditPassed === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepAuditedDeclarationCount === 56 && earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepCompiledRawMachineFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepExternalInputSizePolynomialFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepExactFormulaBitsFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepSecondConstraintFirstLiteralSignFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepRetainedAdvancedTokenCoordinateFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepInputPrefixAppenderComposed === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepFailClosedBoundaryTimeoutFormalized === true)) fail("current manifest Cook-Levin builder second-constraint-first-literal-sign-step boundary mismatch");
  if (earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepWorkTime !== "BuilderSecondConstraintSeparatorStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintStartTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)" || earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepRawTimePolynomial !== "BuilderSecondConstraintSeparatorStep.rawTimeBound + 546 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length" || !/^4676 \+ /u.test(earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepRuleCount)) fail("current manifest Cook-Levin builder second-constraint-first-literal-sign-step cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepProjectAxiomClosure) || earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder second-constraint-first-literal-sign-step axiom closure mismatch");
  const secondConstraintFirstLiteralSignHashes = earned.cookLevinBuilderSecondConstraintFirstLiteralSignStepTheoremKernelTypeSha256;
  if (!secondConstraintFirstLiteralSignHashes || Object.keys(secondConstraintFirstLiteralSignHashes).length !== 40 || !Object.entries(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_THEOREMS).every(([name, row]) => secondConstraintFirstLiteralSignHashes[name] === row.hash)) fail("current manifest Cook-Levin builder second-constraint-first-literal-sign-step fingerprint mismatch");
  if (!Object.entries(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderSecondConstraintFirstLiteralSignStep${suffix}`] === theorem)) fail("current manifest Cook-Levin builder second-constraint-first-literal-sign-step theorem identity mismatch");
  if (!(earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomAuditPassed === true && earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAuditedDeclarationCount === 56 && earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCompiledRawMachineFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExternalInputSizePolynomialFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactFormulaBitsFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSecondConstraintFirstLiteralFirstUnaryUnitFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepInputPrefixAppenderComposed === true && earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFailClosedBoundaryTimeoutFormalized === true)) fail("current manifest Cook-Levin builder second-constraint-first-literal-first-unary-unit-step boundary mismatch");
  if (earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepWorkTime !== "BuilderSecondConstraintFirstLiteralSignStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintFirstLiteralSignTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)" || earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRawTimePolynomial !== "BuilderSecondConstraintFirstLiteralSignStep.rawTimeBound + 558 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length" || earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRuleCount !== "4798 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.fourthClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFourthClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFourthClausePaddingRun.fifthClauseSlotStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFifthClausePaddingRun.paddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFifthClausePaddingRun.sixthClauseSlotStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstConstraintPaddingRun.paddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstConstraintPaddingRun.secondConstraintStartPolynomial verifier)") fail("current manifest Cook-Levin builder second-constraint-first-literal-first-unary-unit-step cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepProjectAxiomClosure) || earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder second-constraint-first-literal-first-unary-unit-step axiom closure mismatch");
  const secondConstraintFirstLiteralFirstUnaryUnitHashes = earned.cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepTheoremKernelTypeSha256;
  if (!secondConstraintFirstLiteralFirstUnaryUnitHashes || Object.keys(secondConstraintFirstLiteralFirstUnaryUnitHashes).length !== 40 || !Object.entries(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_THEOREMS).every(([name, row]) => secondConstraintFirstLiteralFirstUnaryUnitHashes[name] === row.hash)) fail("current manifest Cook-Levin builder second-constraint-first-literal-first-unary-unit-step fingerprint mismatch");
  if (!Object.entries(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStep${suffix}`] === theorem)) fail("current manifest Cook-Levin builder second-constraint-first-literal-first-unary-unit-step theorem identity mismatch");
  if (!(earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomAuditPassed === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAuditedDeclarationCount === 56 && earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCompiledRawMachineFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExternalInputSizePolynomialFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactFormulaBitsFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondConstraintFirstLiteralSecondUnaryUnitFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepInputPrefixAppenderComposed === true && earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFailClosedBoundaryTimeoutFormalized === true)) fail("current manifest Cook-Levin builder second-constraint-first-literal-second-unary-unit-step boundary mismatch");
  if (earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepWorkTime !== "BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.workSteps(problem) + 1 + BuilderTokenAppender.workSteps(input, secondConstraintFirstLiteralFirstUnaryTokens) + 1 + CursorAdvance.advanceWorkSteps(cursorWord)" || earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRawTimePolynomial !== "BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rawTimeBound + 570 + 24 * inputLength + 12 * FormulaWidth + 12 * cursorWord.length" || earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRuleCount !== "4920 + BuilderUnaryPolynomial.ruleCount(widthPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderBodyStartPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstLiteralPrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePrefix.nextTokenSlotPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstClausePaddingRun.secondClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderSecondClausePaddingRun.thirdClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderThirdClausePaddingRun.fourthClauseStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFourthClausePaddingRun.remainingPaddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFourthClausePaddingRun.fifthClauseSlotStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFifthClausePaddingRun.paddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFifthClausePaddingRun.sixthClauseSlotStartPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstConstraintPaddingRun.paddingPolynomial verifier) + BuilderUnaryPolynomial.ruleCount(BuilderFirstConstraintPaddingRun.secondConstraintStartPolynomial verifier)") fail("current manifest Cook-Levin builder second-constraint-first-literal-second-unary-unit-step cost mismatch");
  if (JSON.stringify(earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomClosure) !== JSON.stringify(["Quot.sound", "propext"]) || !Array.isArray(earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepProjectAxiomClosure) || earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepProjectAxiomClosure.length !== 0) fail("current manifest Cook-Levin builder second-constraint-first-literal-second-unary-unit-step axiom closure mismatch");
  const secondConstraintFirstLiteralSecondUnaryUnitHashes = earned.cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepTheoremKernelTypeSha256;
  if (!secondConstraintFirstLiteralSecondUnaryUnitHashes || Object.keys(secondConstraintFirstLiteralSecondUnaryUnitHashes).length !== 40 || !Object.entries(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_THEOREMS).every(([name, row]) => secondConstraintFirstLiteralSecondUnaryUnitHashes[name] === row.hash)) fail("current manifest Cook-Levin builder second-constraint-first-literal-second-unary-unit-step fingerprint mismatch");
  if (!Object.entries(BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_RELEASE_IDENTITIES).every(([suffix, theorem]) => earned[`cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStep${suffix}`] === theorem)) fail("current manifest Cook-Levin builder second-constraint-first-literal-second-unary-unit-step theorem identity mismatch");
  if (earned.cookLevinBuilderDynamicCursorInterpretationFormalized !== false || earned.cookLevinCompleteRawFormulaBuilderFormalized !== false || earned.cookLevinBuilderFunctionProgramRawRefinementFormalized !== false || earned.cookLevinPolynomialReductionFormalized !== false || earned.cnfSATNPCompletenessFormalized !== false || earned.cnfSATInPFormalized !== false || earned.pEqualsNPFormalized !== false) fail("current manifest overstates the Cook-Levin builder dynamic-token-cursor step");
  if (earned.cookLevinBuilderFormulaBitsEmittedFormalized !== true || earned.cookLevinBuilderDirectCursorRawInterpretationFormalized !== false || earned.cookLevinCompleteRawFormulaBuilderFormalized !== false || earned.cookLevinBuilderFunctionProgramRawRefinementFormalized !== false || earned.cookLevinPolynomialReductionFormalized !== false) fail("current manifest overstates the Cook-Levin builder");
  if (manifest.historicalArchive?.status !== "historical-quarantined-not-current-authority" || manifest.historicalArchive?.currentArtifactEligible !== false || manifest.historicalArchive?.mayActivateTheoremPublication !== false) fail("historical archive is not quarantined");
}

function assertHistoricalManifest(manifest) {
  if (manifest.kind !== "PNPHistoricalSourceCheckerReleaseReference0" || manifest.version !== 0) fail("historical manifest kind/version mismatch");
  if (manifest.status !== "historical-quarantined-not-current-authority" || manifest.authority !== "historical-only") fail("historical manifest authority mismatch");
  if (manifest.sourceCommit !== "7072f8d0bda6d44d240f9bb3fad624fd357e1278") fail("historical source coordinate mismatch");
  if (manifest.historicalCanonicalReport?.pdfSha256 !== OLD_PDF_SHA256 || manifest.historicalCanonicalReport?.texSha256 !== OLD_TEX_SHA256 || manifest.historicalCanonicalReport?.pageCount !== 56) fail("historical report coordinate mismatch");
  if (manifest.currentArtifactEligible !== false || manifest.currentStatusAuthority !== false || manifest.mayActivateTheoremPublication !== false) fail("historical metadata can influence current publication");
}

export function verifyReleaseSeal(options = {}) {
  const root = path.resolve(options.root || process.cwd());
  const log = options.log || (() => {});
  const sealFile = readCheckedFile(root, "downloads/release-seal.json");
  const ledgerFile = readCheckedFile(root, "downloads/SHA256SUMS");
  const seal = parseJson(sealFile.buffer, "downloads/release-seal.json");
  const ledger = parseLedger(ledgerFile.buffer);

  exactKeys(seal, [
    "kind", "version", "scope", "status", "generated_utc",
    "current_publication_coordinate", "current_core_commit", "current_core_tree",
    "theorem_gate_passed", "public_theorem_emission_allowed",
    "historical_metadata_status", "files"
  ], "release seal");
  if (seal.kind !== "PNPLabsFormalPublicationSeal0" || seal.version !== 0) fail("release seal kind/version mismatch");
  if (seal.status !== "file identity only; not theorem validation") fail("release seal must deny theorem validation");
  if (seal.current_publication_coordinate !== "PNP-FORMAL-PUBLICATION-RELEASE-2026-07-23-56") fail("release seal publication coordinate mismatch");
  if (seal.current_core_commit !== CORE_COMMIT || seal.current_core_tree !== CORE_TREE) fail("release seal core identity mismatch");
  if (seal.theorem_gate_passed !== false || seal.public_theorem_emission_allowed !== false) fail("release seal must fail closed");
  if (seal.historical_metadata_status !== "historical-quarantined-not-current-authority") fail("release seal historical status mismatch");
  if (!Array.isArray(seal.files) || seal.files.length !== EXPECTED_FILES.length) fail("release seal file set is not exact");
  if (ledger.length !== EXPECTED_FILES.length) fail("SHA256SUMS file set is not exact");

  const buffers = new Map();
  for (let index = 0; index < EXPECTED_FILES.length; index += 1) {
    const expected = EXPECTED_FILES[index];
    const entry = seal.files[index];
    exactKeys(entry, ["path", "bytes", "sha256", "role"], `release seal entry ${index}`);
    if (JSON.stringify(entry) !== JSON.stringify(expected)) fail(`${expected.path}: release seal entry drifted`);
    const ledgerEntry = ledger[index];
    if (ledgerEntry.path !== expected.path || ledgerEntry.sha256 !== expected.sha256) fail(`${expected.path}: SHA256SUMS ordering or digest drifted`);
    const file = readCheckedFile(root, expected.path);
    const actual = sha256(file.buffer);
    if (file.bytes !== expected.bytes) fail(`${expected.path}: byte count ${file.bytes} does not match ${expected.bytes}`);
    if (actual !== expected.sha256) fail(`${expected.path}: SHA-256 ${actual} does not match ${expected.sha256}`);
    buffers.set(expected.path, file.buffer);
    log(`ok ${expected.path} ${actual}`);
  }

  if (!buffers.get(EXPECTED_FILES[0].path).equals(buffers.get(EXPECTED_FILES[1].path))) fail("PDF aliases are not byte-identical");
  if (!buffers.get(EXPECTED_FILES[2].path).equals(buffers.get(EXPECTED_FILES[3].path))) fail("TeX aliases are not byte-identical");
  if (sha256(buffers.get(EXPECTED_FILES[0].path)) === OLD_PDF_SHA256 || sha256(buffers.get(EXPECTED_FILES[2].path)) === OLD_TEX_SHA256) fail("historical report bytes were restored into a current alias");

  assertFailClosedStatus(parseJson(buffers.get("public/pnp-status.json"), "public/pnp-status.json"));
  assertInventory(parseJson(buffers.get("public/pnp-theorem-inventory.json"), "public/pnp-theorem-inventory.json"));
  assertCurrentManifest(parseJson(buffers.get("downloads/formal-publication-release.json"), "downloads/formal-publication-release.json"));
  assertHistoricalManifest(parseJson(buffers.get("downloads/source-checker-release.json"), "downloads/source-checker-release.json"));

  return { checked: EXPECTED_FILES.length, coreCommit: CORE_COMMIT };
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  try {
    const result = verifyReleaseSeal({ log: console.log });
    console.log(`verified ${result.checked} exact public artefact files; this confirms file identity only`);
  } catch (error) {
    console.error(error.stack || String(error));
    process.exit(1);
  }
}

#!/usr/bin/env node
import { createHash, randomBytes } from "node:crypto";
import {
  closeSync,
  existsSync,
  fsyncSync,
  lstatSync,
  openSync,
  readFileSync,
  realpathSync,
  renameSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { verifyReleaseSeal } from "./verify-release-seal.mjs";

const CORE_COMMIT = "c9f4b9b684b18b5fed4a4256133bcfdb83f3ad75";
const CORE_TREE = "e69c76ac4a05c7895cde0ba70d6e1af22e5b7512";
const OLD_PDF_SHA256 = "2ea1b5b4f789fbdc8fa8c3fadf0c1370d10b1aa415340a711829e9aed271972c";
const OLD_TEX_SHA256 = "0d6d5d3270c20f985bd137016a572fc89c7fb95621c2a3008adc9f0b2e3b029d";

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

const CORE_FILES = [
  {
    sourcePath: "canonical_proof_report.pdf",
    targets: ["downloads/canonical_proof_report.pdf", "downloads/canonical-proof-report.pdf"],
    bytes: 351128,
    sha256: "ba99e0d0bda29e0a228f88cc74f1658a31992cf62b1d7e08ed9a1c1e0a222ab8"
  },
  {
    sourcePath: "canonical_proof_report.tex",
    targets: ["downloads/canonical_proof_report.tex", "downloads/canonical-proof-report.tex"],
    bytes: 96022,
    sha256: "d4dd8e112e1153bb7579f10afe461e95a498285158fd141f470ab52dae10c993"
  },
  {
    sourcePath: "public/pnp-status.json",
    targets: ["public/pnp-status.json"],
    bytes: 1013737,
    sha256: "66385722de2685d469eba26619080dc8659e3c87dcdaf5e677da7cf08ff9943a"
  },
  {
    sourcePath: "public/pnp-theorem-inventory.json",
    targets: ["public/pnp-theorem-inventory.json"],
    bytes: 6785365,
    sha256: "a273572123347ada7b362371a3f30fe17c8c0ac359e3d440d6fd4583eaffeedf"
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
    `milestone-theorem-type:${name}\n${kernelType}`,
    "utf8"
  ));
}

function isContained(root, candidate) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

function assertSafeMirrorTarget(root, targetPath, mustExist) {
  const relative = path.relative(root, targetPath);
  if (path.isAbsolute(relative) || relative === ".." || relative.startsWith(`..${path.sep}`)) {
    fail(`${targetPath}: target escapes repository root`);
  }
  const rootInfo = lstatSync(root);
  if (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()) fail(`${root}: repository root must be a real directory`);
  const rootReal = realpathSync(root);
  const parent = path.dirname(targetPath);
  const parentRelative = path.relative(root, parent);
  let cursor = root;
  for (const segment of parentRelative.split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, segment);
    if (!existsSync(cursor)) fail(`${cursor}: target parent is missing`);
    const info = lstatSync(cursor);
    if (!info.isDirectory() || info.isSymbolicLink()) fail(`${cursor}: target parent must be a real directory`);
  }
  const parentReal = realpathSync(parent);
  if (!isContained(rootReal, parentReal)) fail(`${targetPath}: resolved target parent escapes repository root`);
  if (!existsSync(targetPath)) {
    if (mustExist) fail(`${targetPath}: mirror target is missing`);
    return;
  }
  const targetInfo = lstatSync(targetPath);
  if (!targetInfo.isFile() || targetInfo.isSymbolicLink()) fail(`${targetPath}: mirror target must be a regular non-symlink file`);
}

export function writeMirrorFileAtomically(rootInput, targetInput, bytes) {
  const root = path.resolve(rootInput);
  const targetPath = path.resolve(targetInput);
  assertSafeMirrorTarget(root, targetPath, false);
  const parent = path.dirname(targetPath);
  const temporary = path.join(
    parent,
    `.${path.basename(targetPath)}.tmp-${process.pid}-${randomBytes(12).toString("hex")}`
  );
  let descriptor = null;
  try {
    descriptor = openSync(temporary, "wx", 0o644);
    writeFileSync(descriptor, bytes);
    fsyncSync(descriptor);
    closeSync(descriptor);
    descriptor = null;
    assertSafeMirrorTarget(root, targetPath, false);
    renameSync(temporary, targetPath);
  } finally {
    if (descriptor !== null) closeSync(descriptor);
    rmSync(temporary, { force: true });
  }
}

function git(sourceDir, args, encoding = "utf8") {
  const result = spawnSync("git", ["-C", sourceDir, ...args], {
    encoding,
    maxBuffer: 16 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"]
  });
  if (result.status !== 0) {
    const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString("utf8") : result.stderr;
    const stdout = Buffer.isBuffer(result.stdout) ? result.stdout.toString("utf8") : result.stdout;
    fail(`git ${args.join(" ")} failed: ${(stderr || stdout || "unknown failure").trim()}`);
  }
  return encoding === null ? result.stdout : result.stdout.trim();
}

function coreBlob(sourceDir, sourcePath) {
  return git(sourceDir, ["show", `${CORE_COMMIT}:${sourcePath}`], null);
}

function assertPinnedCore(sourceDir) {
  if (!existsSync(path.join(sourceDir, ".git"))) fail(`PNP_SOURCE_DIR is not a git checkout: ${sourceDir}`);
  if (git(sourceDir, ["cat-file", "-t", CORE_COMMIT]) !== "commit") fail("pinned core object is not a commit");
  if (git(sourceDir, ["rev-parse", `${CORE_COMMIT}^{commit}`]) !== CORE_COMMIT) fail("pinned core commit cannot be resolved exactly");
  if (git(sourceDir, ["rev-parse", `${CORE_COMMIT}^{tree}`]) !== CORE_TREE) fail("pinned core tree does not match the reviewed merge");

  const map = coreBlob(sourceDir, "publication/FORMAL_PUBLICATION_MAP.json");
  if (sha256(map) !== "1cbf9f3e53e0c57599123f60ef7049ffe8b0c45e96529ea8b7acacd4fa225172") {
    fail("pinned formal-publication map digest mismatch");
  }
  const publicationMap = JSON.parse(map.toString("utf8"));
  const rawTapeTheorem = "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language";
  const formulaSizeTheorem = "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le";
  const formulaScheduleLengthTheorem = "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length";
  const formulaScheduleEmitTheorem = "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula";
  const formulaCursorTheorems = {
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
  if (publicationMap.coordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-21-66"
      || publicationMap.milestoneSourceClosureSha256 !== "98a5d9fc7a5821a2d39b2b55be7fb99f5b2a23485f7464b6a404051a3046a423"
      || publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[rawTapeTheorem] !== "985c8d12419343045c76abbcfa6def7d4e01ce816d97180dca14d7bf5c0be34d") {
    fail("pinned formal-publication map Cook-Levin identity mismatch");
  }
  const rawTapeMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-raw-tape-bridge");
  if (!rawTapeMilestone
      || rawTapeMilestone.classification !== "formalized-foundation-only"
      || !rawTapeMilestone.requiredTheorems?.includes(rawTapeTheorem)
      || !rawTapeMilestone.nonClaim?.includes("does not yet prove external encoded-formula-size or formula-construction-runtime polynomials")) {
    fail("pinned formal-publication map Cook-Levin nonclaim mismatch");
  }
  const formulaSizeMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-size");
  if (!formulaSizeMilestone
      || formulaSizeMilestone.classification !== "formalized-foundation-only"
      || !formulaSizeMilestone.requiredTheorems?.includes(formulaSizeTheorem)
      || publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[formulaSizeTheorem] !== "c2b0a4afd8793022739cde9904d379a3c807fba07f0db0ab23e3b0b0563ed699"
      || !formulaSizeMilestone.nonClaim?.includes("does not implement or time a raw finite formula builder")) {
    fail("pinned formal-publication map Cook-Levin formula-size identity mismatch");
  }
  const formulaScheduleMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-schedule");
  if (!formulaScheduleMilestone
      || formulaScheduleMilestone.classification !== "formalized-foundation-only"
      || !formulaScheduleMilestone.requiredTheorems?.includes(formulaScheduleLengthTheorem)
      || !formulaScheduleMilestone.requiredTheorems?.includes(formulaScheduleEmitTheorem)
      || publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[formulaScheduleLengthTheorem] !== "7460e8b8c59a2356dc8ece81571e7bcb76faf71a5ae0492d034b1d8c5d2408c4"
      || publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[formulaScheduleEmitTheorem] !== "2376179dbf80f6e0bb76d8a6026518aa0d042e1eb79f3ec567474a730f742943"
      || !formulaScheduleMilestone.nonClaim?.includes("does not interpret a slot as a constant-time raw-machine action")) {
    fail("pinned formal-publication map Cook-Levin formula-schedule identity mismatch");
  }
  const formulaCursorMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-cursor");
  if (!formulaCursorMilestone
      || formulaCursorMilestone.classification !== "formalized-foundation-only"
      || !Object.keys(formulaCursorTheorems).every((name) => formulaCursorMilestone.requiredTheorems?.includes(name))
      || !Object.entries(formulaCursorTheorems).every(([name, hash]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === hash)
      || !formulaCursorMilestone.nonClaim?.includes("does not prove constant-time raw slot interpretation")) {
    fail("pinned formal-publication map Cook-Levin formula-cursor identity mismatch");
  }
  const builderMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-input-length");
  if (!builderMilestone
      || builderMilestone.classification !== "formalized-foundation-only"
      || !Object.keys(BUILDER_INPUT_LENGTH_THEOREMS).every((name) => builderMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_INPUT_LENGTH_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !builderMilestone.nonClaim?.includes("does not emit formula bits")) {
    fail("pinned formal-publication map Cook-Levin builder input-length identity mismatch");
  }
  const builderPrefixMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-input-prefix");
  if (!builderPrefixMilestone
      || builderPrefixMilestone.classification !== "formalized-foundation-only"
      || !Object.keys(BUILDER_INPUT_PREFIX_THEOREMS).every((name) => builderPrefixMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_INPUT_PREFIX_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !builderPrefixMilestone.nonClaim?.includes("emits no formula bit")) {
    fail("pinned formal-publication map Cook-Levin builder input-prefix identity mismatch");
  }
  const builderTokenMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-token-appender");
  if (!builderTokenMilestone
      || builderTokenMilestone.classification !== "formalized-foundation-only"
      || !Object.keys(BUILDER_TOKEN_APPENDER_THEOREMS).every((name) => builderTokenMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_TOKEN_APPENDER_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !builderTokenMilestone.nonClaim?.includes("audits the token appender independently")) {
    fail("pinned formal-publication map Cook-Levin builder token-appender identity mismatch");
  }
  const firstTokenMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-token-prefix");
  if (!firstTokenMilestone
      || firstTokenMilestone.classification !== "formalized-foundation-only"
      || firstTokenMilestone.requiredTheorems?.length !== 25
      || !Object.keys(BUILDER_FIRST_TOKEN_PREFIX_THEOREMS).every((name) => firstTokenMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_FIRST_TOKEN_PREFIX_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !firstTokenMilestone.nonClaim?.includes("does not compute the remaining width header")) {
    fail("pinned formal-publication map Cook-Levin builder first-token-prefix identity mismatch");
  }
  const completeHeaderMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-complete-header");
  if (!completeHeaderMilestone
      || completeHeaderMilestone.classification !== "formalized-foundation-only"
      || completeHeaderMilestone.requiredTheorems?.length !== 48
      || !Object.keys(BUILDER_UNARY_POLYNOMIAL_THEOREMS).every((name) => completeHeaderMilestone.requiredTheorems?.includes(name))
      || !Object.keys(BUILDER_COMPLETE_HEADER_THEOREMS).every((name) => completeHeaderMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_UNARY_POLYNOMIAL_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !Object.entries(BUILDER_COMPLETE_HEADER_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !completeHeaderMilestone.nonClaim?.includes("does not implement the dynamic formula cursor or body emission")) {
    fail("pinned formal-publication map Cook-Levin builder complete-header identity mismatch");
  }
  const bodyStartMilestone = publicationMap.milestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-body-start-prefix");
  if (!bodyStartMilestone
      || bodyStartMilestone.classification !== "formalized-foundation-only"
      || bodyStartMilestone.requiredTheorems?.length !== 42
      || !Object.keys(BUILDER_BODY_START_PREFIX_THEOREMS).every((name) => bodyStartMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_BODY_START_PREFIX_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !bodyStartMilestone.nonClaim?.includes("does not implement a dynamic formula cursor or subsequent body emission")) {
    fail("pinned formal-publication map Cook-Levin builder body-start-prefix identity mismatch");
  }
  const firstLiteralMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-first-literal-prefix");
  if (!firstLiteralMilestone
      || firstLiteralMilestone.classification !== "formalized-foundation-only"
      || firstLiteralMilestone.requiredTheorems?.length !== 52
      || !Object.keys(BUILDER_FIRST_LITERAL_PREFIX_THEOREMS).every((name) =>
        firstLiteralMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_FIRST_LITERAL_PREFIX_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !firstLiteralMilestone.nonClaim?.includes("does not implement a dynamic formula cursor or remaining body emission")) {
    fail("pinned formal-publication map Cook-Levin builder first-literal-prefix identity mismatch");
  }
  const firstClauseMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-first-clause-prefix");
  if (!firstClauseMilestone
      || firstClauseMilestone.classification !== "formalized-foundation-only"
      || firstClauseMilestone.requiredTheorems?.length !== 43
      || !Object.keys(BUILDER_FIRST_CLAUSE_PREFIX_THEOREMS).every((name) =>
        firstClauseMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_FIRST_CLAUSE_PREFIX_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !firstClauseMilestone.nonClaim?.includes("does not implement a dynamic formula cursor or remaining formula-body emission")) {
    fail("pinned formal-publication map Cook-Levin builder first-clause-prefix identity mismatch");
  }
  const dynamicTokenCursorMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-dynamic-token-cursor-step");
  if (!dynamicTokenCursorMilestone
      || dynamicTokenCursorMilestone.classification !== "formalized-foundation-only"
      || dynamicTokenCursorMilestone.requiredTheorems?.length !== 31
      || !Object.keys(BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREMS).every((name) =>
        dynamicTokenCursorMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !dynamicTokenCursorMilestone.nonClaim?.includes("not a general dynamic cursor loop or raw decoder")) {
    fail("pinned formal-publication map Cook-Levin builder dynamic-token-cursor-step identity mismatch");
  }
  const firstClausePaddingRunMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-first-clause-padding-run");
  if (!firstClausePaddingRunMilestone
      || firstClausePaddingRunMilestone.classification !== "formalized-foundation-only"
      || firstClausePaddingRunMilestone.requiredTheorems?.length !== 48
      || !Object.keys(BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREMS).every((name) =>
        firstClausePaddingRunMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !firstClausePaddingRunMilestone.nonClaim?.includes("not a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates")) {
    fail("pinned formal-publication map Cook-Levin builder first-clause-padding-run identity mismatch");
  }
  const secondClauseSeparatorStepMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-second-clause-separator-step");
  if (!secondClauseSeparatorStepMilestone
      || secondClauseSeparatorStepMilestone.classification !== "formalized-foundation-only"
      || secondClauseSeparatorStepMilestone.requiredTheorems?.length !== 40
      || !Object.keys(BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREMS).every((name) =>
        secondClauseSeparatorStepMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !secondClauseSeparatorStepMilestone.nonClaim?.includes("not a general dynamic formula cursor or raw decoder for arbitrary schedule coordinates")) {
    fail("pinned formal-publication map Cook-Levin builder second-clause-separator-step identity mismatch");
  }
  const secondClauseFirstLiteralPrefixMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-second-clause-first-literal-prefix");
  if (!secondClauseFirstLiteralPrefixMilestone
      || secondClauseFirstLiteralPrefixMilestone.classification !== "formalized-foundation-only"
      || secondClauseFirstLiteralPrefixMilestone.requiredTheorems?.length !== 58
      || !Object.keys(BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS).every((name) =>
        secondClauseFirstLiteralPrefixMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !secondClauseFirstLiteralPrefixMilestone.nonClaim?.includes("does not complete clause two")) {
    fail("pinned formal-publication map Cook-Levin builder second-clause-first-literal-prefix identity mismatch");
  }
  const secondClauseSecondLiteralPrefixMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-second-clause-second-literal-prefix");
  if (!secondClauseSecondLiteralPrefixMilestone
      || secondClauseSecondLiteralPrefixMilestone.classification !== "formalized-foundation-only"
      || secondClauseSecondLiteralPrefixMilestone.requiredTheorems?.length !== 75
      || !Object.keys(BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS).every((name) =>
        secondClauseSecondLiteralPrefixMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !secondClauseSecondLiteralPrefixMilestone.nonClaim?.includes("does not emit the clause terminator")) {
    fail("pinned formal-publication map Cook-Levin builder second-clause-second-literal-prefix identity mismatch");
  }
  const secondClausePrefixMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-second-clause-prefix");
  if (!secondClausePrefixMilestone
      || secondClausePrefixMilestone.classification !== "formalized-foundation-only"
      || secondClausePrefixMilestone.requiredTheorems?.length !== 41
      || !Object.keys(BUILDER_SECOND_CLAUSE_PREFIX_THEOREMS).every((name) =>
        secondClausePrefixMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_SECOND_CLAUSE_PREFIX_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !secondClausePrefixMilestone.nonClaim?.includes("does not traverse clause-two padding")) {
    fail("pinned formal-publication map Cook-Levin builder second-clause-prefix identity mismatch");
  }
  const secondClausePaddingRunMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-second-clause-padding-run");
  if (!secondClausePaddingRunMilestone
      || secondClausePaddingRunMilestone.classification !== "formalized-foundation-only"
      || secondClausePaddingRunMilestone.requiredTheorems?.length !== 39
      || !Object.keys(BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREMS).every((name) =>
        secondClausePaddingRunMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !secondClausePaddingRunMilestone.nonClaim?.includes("does not emit the third-clause separator")) {
    fail("pinned formal-publication map Cook-Levin builder second-clause-padding-run identity mismatch");
  }
  const thirdClauseSeparatorStepMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-third-clause-separator-step");
  if (!thirdClauseSeparatorStepMilestone
      || thirdClauseSeparatorStepMilestone.classification !== "formalized-foundation-only"
      || thirdClauseSeparatorStepMilestone.requiredTheorems?.length !== 40
      || !Object.keys(BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREMS).every((name) =>
        thirdClauseSeparatorStepMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !thirdClauseSeparatorStepMilestone.nonClaim?.includes("does not emit that F")) {
    fail("pinned formal-publication map Cook-Levin builder third-clause-separator-step identity mismatch");
  }
  const thirdClauseFirstLiteralPrefixMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-third-clause-first-literal-prefix");
  if (!thirdClauseFirstLiteralPrefixMilestone
      || thirdClauseFirstLiteralPrefixMilestone.classification !== "formalized-foundation-only"
      || thirdClauseFirstLiteralPrefixMilestone.requiredTheorems?.length !== 58
      || !Object.keys(BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS).every((name) =>
        thirdClauseFirstLiteralPrefixMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !thirdClauseFirstLiteralPrefixMilestone.nonClaim?.includes("does not emit that following F")) {
    fail("pinned formal-publication map Cook-Levin builder third-clause-first-literal-prefix identity mismatch");
  }
  const thirdClauseSecondLiteralPrefixMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-third-clause-second-literal-prefix");
  if (!thirdClauseSecondLiteralPrefixMilestone
      || thirdClauseSecondLiteralPrefixMilestone.classification !== "formalized-foundation-only"
      || thirdClauseSecondLiteralPrefixMilestone.requiredTheorems?.length !== 92
      || !Object.keys(BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS).every((name) =>
        thirdClauseSecondLiteralPrefixMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !thirdClauseSecondLiteralPrefixMilestone.nonClaim?.includes("does not emit the following Finish")) {
    fail("pinned formal-publication map Cook-Levin builder third-clause-second-literal-prefix identity mismatch");
  }
  const thirdClausePrefixMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-third-clause-prefix");
  if (!thirdClausePrefixMilestone
      || thirdClausePrefixMilestone.classification !== "formalized-foundation-only"
      || thirdClausePrefixMilestone.requiredTheorems?.length !== 41
      || !Object.keys(BUILDER_THIRD_CLAUSE_PREFIX_THEOREMS).every((name) =>
        thirdClausePrefixMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_THIRD_CLAUSE_PREFIX_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !thirdClausePrefixMilestone.nonClaim?.includes("does not traverse clause-three padding")) {
    fail("pinned formal-publication map Cook-Levin builder third-clause-prefix identity mismatch");
  }
  const thirdClausePaddingRunMilestone = publicationMap.milestones?.find((milestone) =>
    milestone.id === "concrete-cook-levin-builder-third-clause-padding-run");
  if (!thirdClausePaddingRunMilestone
      || thirdClausePaddingRunMilestone.classification !== "formalized-foundation-only"
      || thirdClausePaddingRunMilestone.requiredTheorems?.length !== 39
      || !Object.keys(BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREMS).every((name) =>
        thirdClausePaddingRunMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREMS).every(([name, evidence]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === evidence.hash)
      || !thirdClausePaddingRunMilestone.nonClaim?.includes("does not emit the fourth-clause separator")) {
    fail("pinned formal-publication map Cook-Levin builder third-clause-padding-run identity mismatch");
  }

  const fourthClauseSeparatorStepMilestone = publicationMap.milestones?.find((row) =>
    row.id === "concrete-cook-levin-builder-fourth-clause-separator-step");
  if (!fourthClauseSeparatorStepMilestone
      || fourthClauseSeparatorStepMilestone.classification !== "formalized-foundation-only"
      || fourthClauseSeparatorStepMilestone.requiredTheorems?.length !== 40
      || !Object.keys(BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREMS).every((name) =>
        fourthClauseSeparatorStepMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREMS).every(([name, row]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === row.hash)
      || !fourthClauseSeparatorStepMilestone.nonClaim?.includes("does not emit the following F")) {
    fail("pinned formal-publication map Cook-Levin builder fourth-clause-separator-step identity mismatch");
  }

  const fourthClauseFirstLiteralPrefixMilestone = publicationMap.milestones?.find((row) =>
    row.id === "concrete-cook-levin-builder-fourth-clause-first-literal-prefix");
  if (!fourthClauseFirstLiteralPrefixMilestone
      || fourthClauseFirstLiteralPrefixMilestone.classification !== "formalized-foundation-only"
      || fourthClauseFirstLiteralPrefixMilestone.requiredTheorems?.length !== 75
      || !Object.keys(BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS).every((name) =>
        fourthClauseFirstLiteralPrefixMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS).every(([name, row]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === row.hash)
      || !fourthClauseFirstLiteralPrefixMilestone.nonClaim?.includes("does not complete clause four")) {
    fail("pinned formal-publication map Cook-Levin builder fourth-clause-first-literal-prefix identity mismatch");
  }

  const fourthClauseSecondLiteralPrefixMilestone = publicationMap.milestones?.find((row) =>
    row.id === "concrete-cook-levin-builder-fourth-clause-second-literal-prefix");
  if (!fourthClauseSecondLiteralPrefixMilestone
      || fourthClauseSecondLiteralPrefixMilestone.classification !== "formalized-foundation-only"
      || fourthClauseSecondLiteralPrefixMilestone.requiredTheorems?.length !== 92
      || !Object.keys(BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS).every((name) =>
        fourthClauseSecondLiteralPrefixMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS).every(([name, row]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === row.hash)
      || !fourthClauseSecondLiteralPrefixMilestone.nonClaim?.includes("does not emit the following Finish")) {
    fail("pinned formal-publication map Cook-Levin builder fourth-clause-second-literal-prefix identity mismatch");
  }

  const fourthClausePrefixMilestone = publicationMap.milestones?.find((row) =>
    row.id === "concrete-cook-levin-builder-fourth-clause-prefix");
  if (!fourthClausePrefixMilestone
      || fourthClausePrefixMilestone.classification !== "formalized-foundation-only"
      || fourthClausePrefixMilestone.requiredTheorems?.length !== 41
      || !Object.keys(BUILDER_FOURTH_CLAUSE_PREFIX_THEOREMS).every((name) =>
        fourthClausePrefixMilestone.requiredTheorems?.includes(name))
      || !Object.entries(BUILDER_FOURTH_CLAUSE_PREFIX_THEOREMS).every(([name, row]) =>
        publicationMap.earnedMilestoneTheoremKernelTypeSha256?.[name] === row.hash)
      || !fourthClausePrefixMilestone.nonClaim?.includes("does not traverse clause-four padding")) {
    fail("pinned formal-publication map Cook-Levin builder fourth-clause-prefix identity mismatch");
  }

}

function checkPdfPageCount(pdfPath) {
  const result = spawnSync("pdfinfo", [pdfPath], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.status !== 0) fail(`pdfinfo failed for ${pdfPath}: ${(result.stderr || result.stdout || "pdfinfo unavailable").trim()}`);
  const match = result.stdout.match(/^Pages:\s+(\d+)\s*$/m);
  if (!match || Number(match[1]) !== 42) fail(`${pdfPath}: expected exactly forty-two pages`);
}

function assertCorePayloadBoundary(sourcePath, buffer) {
  if (!sourcePath.endsWith(".json")) return;
  const payload = JSON.parse(buffer.toString("utf8"));
  if (sourcePath === "public/pnp-status.json") {
    if (payload.coordinate !== "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-21-66" || payload.publicSurfaceBaselineCoordinate !== "PUBLIC-SURFACE-BASELINE-2026-07-21-COOK-LEVIN-BUILDER-FOURTH-CLAUSE-PREFIX-65") fail("core status coordinate mismatch");
    if (payload.formalPublicationMapCoordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-21-66" || payload.formalPublicationMapSha256 !== "1cbf9f3e53e0c57599123f60ef7049ffe8b0c45e96529ea8b7acacd4fa225172" || payload.leanSourceClosureSha256 !== "98a5d9fc7a5821a2d39b2b55be7fb99f5b2a23485f7464b6a404051a3046a423") fail("core status source identity mismatch");
    if (payload.concretePublicationGate?.passed !== false || payload.publicationStatusDerivedOnlyFromConcreteGate !== true) fail("core status concrete publication boundary mismatch");
    if (payload.mathematicalTheoremEstablished !== false || payload.publicTheoremEmissionAllowed !== false || payload.publicTheoremStatement !== null) fail("core status does not fail closed");
    if (payload.rootLeanTheoremPresent !== false || payload.projectSpecificAxiomsRemaining !== true || payload.remainingBlockers?.length !== 6) fail("core status blocker boundary mismatch");
    if (payload.leanConcreteCNFSATMembershipFormalized !== true || payload.leanConcreteCNFSATMembershipTheorem !== "PNP.Concrete.FinalUniversalDesign.cnfSATInNP") fail("core status CNF-SAT NP-membership boundary mismatch");
    if (payload.leanConcreteCNFWorkAxiomAuditPassed !== true || payload.leanConcreteCNFWorkAuditedDeclarationCount !== 766) fail("core status CNF work audit boundary mismatch");
    if (payload.leanConcretePipelineStateNamespaceFormalized !== true || payload.leanConcretePipelineStateNamespaceAxiomAuditPassed !== true || payload.leanConcretePipelineStateNamespaceAuditedDeclarationCount !== 39) fail("core status pipeline namespace boundary mismatch");
    if (payload.leanConcretePipelineStageBridgesFormalized !== true || payload.leanConcretePipelineStageBridgesAxiomAuditPassed !== true || payload.leanConcretePipelineStageBridgesAuditedDeclarationCount !== 56) fail("core status pipeline stage-bridge boundary mismatch");
    if (payload.leanConcretePipelineStageLaunchFormalized !== true || payload.leanConcretePipelineVerdictPreservationFormalized !== true || payload.leanConcretePipelineInternalOutputHandoffComposed !== true) fail("core status pipeline bridge composition boundary mismatch");
    if (payload.leanConcretePipelineTerminalOutputPackingFormalized !== true || payload.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed !== true || payload.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount !== 69) fail("core status terminal-output packer boundary mismatch");
    if (payload.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized !== true || payload.leanConcretePipelineTerminalBridgeAxiomAuditPassed !== true || payload.leanConcretePipelineTerminalBridgeAuditedDeclarationCount !== 59) fail("core status terminal-bridge suffix boundary mismatch");
    if (payload.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized !== true) fail("core status supplied-trace transport boundary mismatch");
    if (payload.leanConcretePipelineInputFramerAxiomAuditPassed !== true || payload.leanConcretePipelineInputFramerAuditedDeclarationCount !== 70 || payload.leanConcretePipelineAllInputFramingFormalized !== true) fail("core status all-input framer boundary mismatch");
    if (payload.leanConcretePipelinePairedCompilerAxiomAuditPassed !== true || payload.leanConcretePipelinePairedCompilerAuditedDeclarationCount !== 28) fail("core status canonical-pair compiler audit boundary mismatch");
    if (payload.leanConcretePipelineCanonicalPairCompilationFormalized !== true || payload.leanConcretePipelineExternalInputSizePolynomialFormalized !== true) fail("core status canonical-pair compiler boundary mismatch");
    if (payload.leanConcretePipelineCompilerAxiomAuditPassed !== true || payload.leanConcretePipelineCompilerAuditedDeclarationCount !== 29 || payload.leanConcretePipelineAllInputCompilationFormalized !== true) fail("core status all-input compiler audit boundary mismatch");
    if (payload.leanConcretePipelineMalformedInputBehaviorFormalized !== true || payload.leanConcretePipelineRawRefinementFormalized !== true) fail("core status all-input compiler boundary mismatch");
    if (payload.leanConcretePipelineSequentialNamespaceFormalized !== true || payload.leanConcretePipelineSequentialNamespaceAxiomAuditPassed !== true || payload.leanConcretePipelineSequentialNamespaceAuditedDeclarationCount !== 26) fail("core status sequential namespace boundary mismatch");
    if (payload.leanConcretePipelineSequentialCompilationFormalized !== true || payload.leanConcretePipelineSequentialCompilerAxiomAuditPassed !== true || payload.leanConcretePipelineSequentialCompilerAuditedDeclarationCount !== 31 || payload.leanConcretePipelineSequentialVerdictAndOutputPreservationFormalized !== true || payload.leanConcretePipelineSequentialExternalInputSizePolynomialFormalized !== true || payload.leanConcretePipelineSequentialStuckFirstTimeoutFormalized !== true) fail("core status sequential compiler boundary mismatch");
    if (payload.leanConcretePipelineRefinementAxiomAuditPassed !== true || payload.leanConcretePipelineRefinementAuditedDeclarationCount !== 16 || payload.leanConcreteFunctionProgramRecursiveCompilationFormalized !== true || payload.leanConcreteDecisionProgramRecursiveCompilationFormalized !== true || payload.leanConcretePolynomialTimeDeciderRawCompilationFormalized !== true || payload.standardComplexityModelFormalized !== true) fail("core status recursive refinement boundary mismatch");
    const formulaSizeMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-size");
    if (!formulaSizeMilestone || formulaSizeMilestone.earned !== true || formulaSizeMilestone.allPresent !== true || formulaSizeMilestone.allKernelTypesMatch !== true || formulaSizeMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true) fail("core status Cook-Levin formula-size boundary mismatch");
    const formulaScheduleMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-schedule");
    if (!formulaScheduleMilestone || formulaScheduleMilestone.earned !== true || formulaScheduleMilestone.allPresent !== true || formulaScheduleMilestone.allKernelTypesMatch !== true || formulaScheduleMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true) fail("core status Cook-Levin formula-schedule boundary mismatch");
    const formulaCursorMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-formula-cursor");
    if (!formulaCursorMilestone || formulaCursorMilestone.earned !== true || formulaCursorMilestone.allPresent !== true || formulaCursorMilestone.allKernelTypesMatch !== true || formulaCursorMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || formulaCursorMilestone.requiredTheorems?.length !== 16) fail("core status Cook-Levin formula-cursor boundary mismatch");
    const builderMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-input-length");
    if (!builderMilestone || builderMilestone.earned !== true || builderMilestone.allPresent !== true || builderMilestone.allKernelTypesMatch !== true || builderMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || builderMilestone.requiredTheorems?.length !== 10) fail("core status Cook-Levin builder input-length boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderInputLengthFormalized !== true || payload.leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderInputLengthAuditedDeclarationCount !== 39 || payload.leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized !== true) fail("core status Cook-Levin builder input-length evidence mismatch");
    const builderPrefixMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-input-prefix");
    if (!builderPrefixMilestone || builderPrefixMilestone.earned !== true || builderPrefixMilestone.allPresent !== true || builderPrefixMilestone.allKernelTypesMatch !== true || builderPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || builderPrefixMilestone.requiredTheorems?.length !== 14) fail("core status Cook-Levin builder input-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderInputPrefixFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderInputPrefixAuditedDeclarationCount !== 40 || payload.leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized !== true) fail("core status Cook-Levin builder input-prefix evidence mismatch");
    const builderTokenMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-token-appender");
    if (!builderTokenMilestone || builderTokenMilestone.earned !== true || builderTokenMilestone.allPresent !== true || builderTokenMilestone.allKernelTypesMatch !== true || builderTokenMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || builderTokenMilestone.requiredTheorems?.length !== 17) fail("core status Cook-Levin builder token-appender boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderTokenAppenderFormalized !== true || payload.leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderTokenAppenderAuditedDeclarationCount !== 68 || payload.leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized !== true || payload.leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed !== true) fail("core status Cook-Levin builder token-appender evidence mismatch");
    const firstTokenMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-token-prefix");
    if (!firstTokenMilestone || firstTokenMilestone.earned !== true || firstTokenMilestone.allPresent !== true || firstTokenMilestone.allKernelTypesMatch !== true || firstTokenMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstTokenMilestone.requiredTheorems?.length !== 25) fail("core status Cook-Levin builder first-token-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderFirstTokenPrefixFormalized !== true || payload.leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderFirstTokenPrefixAuditedDeclarationCount !== 37 || payload.leanConcreteCookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized !== true) fail("core status Cook-Levin builder first-token-prefix evidence mismatch");
    const completeHeaderMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-complete-header");
    if (!completeHeaderMilestone || completeHeaderMilestone.earned !== true || completeHeaderMilestone.allPresent !== true || completeHeaderMilestone.allKernelTypesMatch !== true || completeHeaderMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || completeHeaderMilestone.requiredTheorems?.length !== 48) fail("core status Cook-Levin builder complete-header boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderUnaryPolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderUnaryPolynomialAuditedDeclarationCount !== 74 || payload.leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized !== true) fail("core status Cook-Levin builder unary-polynomial evidence mismatch");
    if (payload.leanConcreteCookLevinBuilderCompleteHeaderFormalized !== true || payload.leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderCompleteHeaderAuditedDeclarationCount !== 84 || payload.leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderCompleteHeaderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder complete-header evidence mismatch");
    const bodyStartMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-body-start-prefix");
    if (!bodyStartMilestone || bodyStartMilestone.earned !== true || bodyStartMilestone.allPresent !== true || bodyStartMilestone.allKernelTypesMatch !== true || bodyStartMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || bodyStartMilestone.requiredTheorems?.length !== 42) fail("core status Cook-Levin builder body-start-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderBodyStartPrefixFormalized !== true || payload.leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderBodyStartPrefixAuditedDeclarationCount !== 60 || payload.leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder body-start-prefix evidence mismatch");
    const firstLiteralMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-literal-prefix");
    if (!firstLiteralMilestone || firstLiteralMilestone.earned !== true || firstLiteralMilestone.allPresent !== true || firstLiteralMilestone.allKernelTypesMatch !== true || firstLiteralMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstLiteralMilestone.requiredTheorems?.length !== 52) fail("core status Cook-Levin builder first-literal-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized !== true || payload.leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount !== 74 || payload.leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder first-literal-prefix evidence mismatch");
    const firstClauseMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-clause-prefix");
    if (!firstClauseMilestone || firstClauseMilestone.earned !== true || firstClauseMilestone.allPresent !== true || firstClauseMilestone.allKernelTypesMatch !== true || firstClauseMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstClauseMilestone.requiredTheorems?.length !== 43) fail("core status Cook-Levin builder first-clause-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderFirstClausePrefixFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderFirstClausePrefixAuditedDeclarationCount !== 79 || payload.leanConcreteCookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder first-clause-prefix evidence mismatch");
    const dynamicTokenCursorMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-dynamic-token-cursor-step");
    if (!dynamicTokenCursorMilestone || dynamicTokenCursorMilestone.earned !== true || dynamicTokenCursorMilestone.allPresent !== true || dynamicTokenCursorMilestone.allKernelTypesMatch !== true || dynamicTokenCursorMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || dynamicTokenCursorMilestone.requiredTheorems?.length !== 31) fail("core status Cook-Levin builder dynamic-token-cursor-step boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepAuditedDeclarationCount !== 47 || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepDirectPaddingOutcomeFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepSinglePaddingStepFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder dynamic-token-cursor-step evidence mismatch");
    const firstClausePaddingRunMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-clause-padding-run");
    if (!firstClausePaddingRunMilestone || firstClausePaddingRunMilestone.earned !== true || firstClausePaddingRunMilestone.allPresent !== true || firstClausePaddingRunMilestone.allKernelTypesMatch !== true || firstClausePaddingRunMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstClausePaddingRunMilestone.requiredTheorems?.length !== 48) fail("core status Cook-Levin builder first-clause-padding-run boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderFirstClausePaddingRunFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount !== 84 || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder first-clause-padding-run evidence mismatch");
    const secondClauseSeparatorStepMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-second-clause-separator-step");
    if (!secondClauseSeparatorStepMilestone || secondClauseSeparatorStepMilestone.earned !== true || secondClauseSeparatorStepMilestone.allPresent !== true || secondClauseSeparatorStepMilestone.allKernelTypesMatch !== true || secondClauseSeparatorStepMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondClauseSeparatorStepMilestone.requiredTheorems?.length !== 40) fail("core status Cook-Levin builder second-clause-separator-step boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderSecondClauseSeparatorStepFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount !== 56 || payload.leanConcreteCookLevinBuilderSecondClauseSeparatorStepCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseSeparatorStepInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderSecondClauseSeparatorStepFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder second-clause-separator-step evidence mismatch");
    const secondClauseFirstLiteralPrefixMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-second-clause-first-literal-prefix");
    if (!secondClauseFirstLiteralPrefixMilestone || secondClauseFirstLiteralPrefixMilestone.earned !== true || secondClauseFirstLiteralPrefixMilestone.allPresent !== true || secondClauseFirstLiteralPrefixMilestone.allKernelTypesMatch !== true || secondClauseFirstLiteralPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondClauseFirstLiteralPrefixMilestone.requiredTheorems?.length !== 58) fail("core status Cook-Levin builder second-clause-first-literal-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount !== 87 || payload.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder second-clause-first-literal-prefix evidence mismatch");
    const secondClauseSecondLiteralPrefixMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-second-clause-second-literal-prefix");
    if (!secondClauseSecondLiteralPrefixMilestone || secondClauseSecondLiteralPrefixMilestone.earned !== true || secondClauseSecondLiteralPrefixMilestone.allPresent !== true || secondClauseSecondLiteralPrefixMilestone.allKernelTypesMatch !== true || secondClauseSecondLiteralPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondClauseSecondLiteralPrefixMilestone.requiredTheorems?.length !== 75) fail("core status Cook-Levin builder second-clause-second-literal-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount !== 115 || payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder second-clause-second-literal-prefix evidence mismatch");
    const secondClausePrefixMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-second-clause-prefix");
    if (!secondClausePrefixMilestone || secondClausePrefixMilestone.earned !== true || secondClausePrefixMilestone.allPresent !== true || secondClausePrefixMilestone.allKernelTypesMatch !== true || secondClausePrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondClausePrefixMilestone.requiredTheorems?.length !== 41) fail("core status Cook-Levin builder second-clause-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderSecondClausePrefixFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderSecondClausePrefixAuditedDeclarationCount !== 57 || payload.leanConcreteCookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePrefixClauseTerminatorFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized !== true) fail("core status Cook-Levin builder second-clause-prefix evidence mismatch");
    const secondClausePaddingRunMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-second-clause-padding-run");
    if (!secondClausePaddingRunMilestone || secondClausePaddingRunMilestone.earned !== true || secondClausePaddingRunMilestone.allPresent !== true || secondClausePaddingRunMilestone.allKernelTypesMatch !== true || secondClausePaddingRunMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || secondClausePaddingRunMilestone.requiredTheorems?.length !== 39) fail("core status Cook-Levin builder second-clause-padding-run boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePaddingRunAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount !== 68 || payload.leanConcreteCookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized !== true || payload.leanConcreteCookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder second-clause-padding-run evidence mismatch");
    const thirdClauseSeparatorStepMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-third-clause-separator-step");
    if (!thirdClauseSeparatorStepMilestone || thirdClauseSeparatorStepMilestone.earned !== true || thirdClauseSeparatorStepMilestone.allPresent !== true || thirdClauseSeparatorStepMilestone.allKernelTypesMatch !== true || thirdClauseSeparatorStepMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || thirdClauseSeparatorStepMilestone.requiredTheorems?.length !== 40) fail("core status Cook-Levin builder third-clause-separator-step boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount !== 56 || payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder third-clause-separator-step evidence mismatch");
    const thirdClauseFirstLiteralPrefixMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-third-clause-first-literal-prefix");
    if (!thirdClauseFirstLiteralPrefixMilestone || thirdClauseFirstLiteralPrefixMilestone.earned !== true || thirdClauseFirstLiteralPrefixMilestone.allPresent !== true || thirdClauseFirstLiteralPrefixMilestone.allKernelTypesMatch !== true || thirdClauseFirstLiteralPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || thirdClauseFirstLiteralPrefixMilestone.requiredTheorems?.length !== 58) fail("core status Cook-Levin builder third-clause-first-literal-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount !== 87 || payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder third-clause-first-literal-prefix evidence mismatch");
    const thirdClauseSecondLiteralPrefixMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-third-clause-second-literal-prefix");
    if (!thirdClauseSecondLiteralPrefixMilestone || thirdClauseSecondLiteralPrefixMilestone.earned !== true || thirdClauseSecondLiteralPrefixMilestone.allPresent !== true || thirdClauseSecondLiteralPrefixMilestone.allKernelTypesMatch !== true || thirdClauseSecondLiteralPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || thirdClauseSecondLiteralPrefixMilestone.requiredTheorems?.length !== 92) fail("core status Cook-Levin builder third-clause-second-literal-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount !== 145 || payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder third-clause-second-literal-prefix evidence mismatch");
    const thirdClausePrefixMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-third-clause-prefix");
    if (!thirdClausePrefixMilestone || thirdClausePrefixMilestone.earned !== true || thirdClausePrefixMilestone.allPresent !== true || thirdClausePrefixMilestone.allKernelTypesMatch !== true || thirdClausePrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || thirdClausePrefixMilestone.requiredTheorems?.length !== 41) fail("core status Cook-Levin builder third-clause-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderThirdClausePrefixFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderThirdClausePrefixAuditedDeclarationCount !== 57 || payload.leanConcreteCookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePrefixClauseTerminatorFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder third-clause-prefix evidence mismatch");
    const thirdClausePaddingRunMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-third-clause-padding-run");
    if (!thirdClausePaddingRunMilestone || thirdClausePaddingRunMilestone.earned !== true || thirdClausePaddingRunMilestone.allPresent !== true || thirdClausePaddingRunMilestone.allKernelTypesMatch !== true || thirdClausePaddingRunMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || thirdClausePaddingRunMilestone.requiredTheorems?.length !== 39) fail("core status Cook-Levin builder third-clause-padding-run boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderThirdClausePaddingRunFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePaddingRunAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount !== 68 || payload.leanConcreteCookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized !== true || payload.leanConcreteCookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder third-clause-padding-run evidence mismatch");

    const fourthClauseSeparatorStepMilestone = payload.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-fourth-clause-separator-step");
    if (!fourthClauseSeparatorStepMilestone || fourthClauseSeparatorStepMilestone.earned !== true || fourthClauseSeparatorStepMilestone.allPresent !== true || fourthClauseSeparatorStepMilestone.allKernelTypesMatch !== true || fourthClauseSeparatorStepMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || fourthClauseSeparatorStepMilestone.requiredTheorems?.length !== 40) fail("core status Cook-Levin builder fourth-clause-separator-step boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount !== 56 || payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder fourth-clause-separator-step evidence mismatch");

    const fourthClauseFirstLiteralPrefixMilestone = payload.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-fourth-clause-first-literal-prefix");
    if (!fourthClauseFirstLiteralPrefixMilestone || fourthClauseFirstLiteralPrefixMilestone.earned !== true || fourthClauseFirstLiteralPrefixMilestone.allPresent !== true || fourthClauseFirstLiteralPrefixMilestone.allKernelTypesMatch !== true || fourthClauseFirstLiteralPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || fourthClauseFirstLiteralPrefixMilestone.requiredTheorems?.length !== 75) fail("core status Cook-Levin builder fourth-clause-first-literal-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount !== 115 || payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder fourth-clause-first-literal-prefix evidence mismatch");

    const fourthClauseSecondLiteralPrefixMilestone = payload.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-fourth-clause-second-literal-prefix");
    if (!fourthClauseSecondLiteralPrefixMilestone || fourthClauseSecondLiteralPrefixMilestone.earned !== true || fourthClauseSecondLiteralPrefixMilestone.allPresent !== true || fourthClauseSecondLiteralPrefixMilestone.allKernelTypesMatch !== true || fourthClauseSecondLiteralPrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || fourthClauseSecondLiteralPrefixMilestone.requiredTheorems?.length !== 92) fail("core status Cook-Levin builder fourth-clause-second-literal-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount !== 147 || payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder fourth-clause-second-literal-prefix evidence mismatch");

    const fourthClausePrefixMilestone = payload.formalPublicationMilestones?.find((row) => row.id === "concrete-cook-levin-builder-fourth-clause-prefix");
    if (!fourthClausePrefixMilestone || fourthClausePrefixMilestone.earned !== true || fourthClausePrefixMilestone.allPresent !== true || fourthClausePrefixMilestone.allKernelTypesMatch !== true || fourthClausePrefixMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || fourthClausePrefixMilestone.requiredTheorems?.length !== 41) fail("core status Cook-Levin builder fourth-clause-prefix boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderFourthClausePrefixFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClausePrefixAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderFourthClausePrefixAuditedDeclarationCount !== 57 || payload.leanConcreteCookLevinBuilderFourthClausePrefixCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClausePrefixExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClausePrefixExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderFourthClausePrefixInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder fourth-clause-prefix evidence mismatch");

    if (payload.leanConcreteCNFSATInPFormalized !== false || payload.leanConcreteCNFNPCompletenessFormalized !== false) fail("core status overstates the CNF-SAT result");
  } else if (sourcePath === "public/pnp-theorem-inventory.json") {
    if (payload.coordinate !== "PNP-LEAN-THEOREM-INVENTORY-2026-07-21-66") fail("core inventory coordinate mismatch");
    if (payload.compatibilityRootCandidate !== null || payload.concreteTargetCandidate?.name !== "PNP.Main.ConcretePEqualsNP") fail("core inventory publication boundary mismatch");
    if (payload.declarationCount !== 9758 || payload.theoremCount !== 5253 || payload.assumptionFreeTheoremCount !== 3229 || payload.excludedPrivateDeclarationCount !== 3571 || payload.sourceClosureModuleCount !== 86 || payload.axiomCount !== 4 || payload.milestoneCandidates?.length !== 1334) fail("core inventory counts mismatch");
    const cookLevinBridge = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language");
    if (!cookLevinBridge
        || cookLevinBridge.kind !== "theorem"
        || cookLevinBridge.module !== "PNP.Concrete.CookLevinRawTapeBridge"
        || JSON.stringify(cookLevinBridge.axioms) !== JSON.stringify(["Classical.choice", "Quot.sound", "propext"])) {
      fail("core inventory Cook-Levin raw-tape theorem boundary mismatch");
    }
    const formulaSize = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le");
    if (!formulaSize
        || formulaSize.kind !== "theorem"
        || formulaSize.module !== "PNP.Concrete.CookLevinFormulaSize"
        || JSON.stringify(formulaSize.axioms) !== JSON.stringify(["Quot.sound", "propext"])) {
      fail("core inventory Cook-Levin formula-size theorem boundary mismatch");
    }
    for (const name of [
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula"
    ]) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinFormulaSchedule" || JSON.stringify(theorem.axioms) !== JSON.stringify(["Quot.sound", "propext"])) {
        fail(`core inventory Cook-Levin formula-schedule theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_INPUT_LENGTH_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderInputLength" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder input-length theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_INPUT_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderInputPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder input-prefix theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_TOKEN_APPENDER_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderTokenAppender" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder token-appender theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_FIRST_TOKEN_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderFirstTokenPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder first-token-prefix theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_UNARY_POLYNOMIAL_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderUnaryPolynomial" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder unary-polynomial theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_COMPLETE_HEADER_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderCompleteHeader" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder complete-header theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_BODY_START_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderBodyStartPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder body-start-prefix theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_FIRST_LITERAL_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderFirstLiteralPrefix" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder first-literal-prefix theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_FIRST_CLAUSE_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name === "PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rule_source_ne_acceptState"
        ? "PNP.Concrete.CookLevinBuilderFirstLiteralPrefix"
        : "PNP.Concrete.CookLevinBuilderFirstClausePrefix";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder first-clause-prefix theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep" || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder dynamic-token-cursor-step theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_FIRST_CLAUSE_PADDING_RUN_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name === "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact_of_unit_or_separator"
        ? "PNP.Concrete.CookLevinBuilderCompleteHeader"
        : "PNP.Concrete.CookLevinBuilderFirstClausePaddingRun";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder first-clause-padding-run theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
        ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
        : "PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder second-clause-separator-step theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
        ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
        : "PNP.Concrete.CookLevinBuilderSecondClauseFirstLiteralPrefix";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder second-clause-first-literal-prefix theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
        ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
        : "PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder second-clause-second-literal-prefix theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_SECOND_CLAUSE_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
        ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
        : "PNP.Concrete.CookLevinBuilderSecondClausePrefix";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder second-clause-prefix theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_SECOND_CLAUSE_PADDING_RUN_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.")
        ? "PNP.Concrete.CookLevinBuilderFirstClausePaddingRun"
        : "PNP.Concrete.CookLevinBuilderSecondClausePaddingRun";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder second-clause-padding-run theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
        ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
        : name.startsWith("PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.")
          ? "PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep"
          : "PNP.Concrete.CookLevinBuilderThirdClauseSeparatorStep";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder third-clause-separator-step theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
        ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
        : name.startsWith("PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.")
          ? "PNP.Concrete.CookLevinBuilderSecondClauseFirstLiteralPrefix"
          : "PNP.Concrete.CookLevinBuilderThirdClauseFirstLiteralPrefix";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder third-clause-first-literal-prefix theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
        ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
        : "PNP.Concrete.CookLevinBuilderThirdClauseSecondLiteralPrefix";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder third-clause-second-literal-prefix theorem mismatch: ${name}`);
      }
    }
    for (const [name, evidence] of Object.entries(BUILDER_THIRD_CLAUSE_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
        ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
        : "PNP.Concrete.CookLevinBuilderThirdClausePrefix";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) {
        fail(`core inventory Cook-Levin builder third-clause-prefix theorem mismatch: ${name}`);
      }
    }
    for (const name of [
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaConstraintSlotDirect_eq",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaClauseSlotDirect_eq",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaTokenSlotDirect_eq",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotDirect_eq",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotCountDirect_eq_polynomial",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_prefix",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_to_end",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.step_at_end",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_one_step_short",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.step_after_one_step_short",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_excess",
      "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula"
    ]) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.CookLevinFormulaCursor" || JSON.stringify(theorem.axioms) !== JSON.stringify(["Quot.sound", "propext"])) {
        fail(`core inventory Cook-Levin formula-cursor theorem mismatch: ${name}`);
      }
    }
    for (const [name, row] of Object.entries(BUILDER_FOURTH_CLAUSE_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
        ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
        : "PNP.Concrete.CookLevinBuilderFourthClausePrefix";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`core inventory Cook-Levin builder fourth-clause-prefix theorem mismatch: ${name}`);
      if (theorem && milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`core inventory Cook-Levin builder fourth-clause-prefix fingerprint mismatch: ${name}`);
    }
    if (payload.milestoneCandidates?.some((candidate) => candidate.name === "PNP.Concrete.cnfSATNPComplete" || candidate.name === "PNP.Concrete.cnfSATInP" || candidate.name === "PNP.Main.p_eq_np")) fail("core inventory overstates the Cook-Levin milestone");
    const packer = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq");
    if (!packer || packer.kind !== "theorem" || packer.module !== "PNP.Concrete.TerminalOutputPacker" || packer.axioms?.length !== 0) fail("core inventory terminal-output packer theorem boundary mismatch");
    const terminalBridge = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents");
    if (!terminalBridge || terminalBridge.kind !== "theorem" || terminalBridge.module !== "PNP.Concrete.PipelineTerminalBridge" || terminalBridge.axioms?.length !== 0) fail("core inventory terminal-bridge theorem boundary mismatch");
    const suppliedTrace = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact");
    const suppliedOutput = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact");
    if (!suppliedTrace || suppliedTrace.kind !== "theorem" || suppliedTrace.axioms?.length !== 0 || !suppliedOutput || suppliedOutput.kind !== "theorem" || suppliedOutput.axioms?.length !== 0) fail("core inventory supplied terminal-trace boundary mismatch");
    const pairedVerdict = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq");
    const pairedOutput = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq");
    const pairedTimeout = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout");
    const pairedAccepts = payload.milestoneCandidates?.find((candidate) => candidate.name === "PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff");
    if (!pairedVerdict || pairedVerdict.kind !== "theorem" || pairedVerdict.axioms?.length !== 0 || !pairedOutput || pairedOutput.kind !== "theorem" || pairedOutput.axioms?.length !== 0 || !pairedTimeout || pairedTimeout.kind !== "theorem" || pairedTimeout.axioms?.length !== 0 || !pairedAccepts || pairedAccepts.kind !== "theorem" || pairedAccepts.axioms?.length !== 0) fail("core inventory canonical-pair compiler boundary mismatch");
    for (const name of [
      "PNP.Concrete.PipelineCompiler.pipeline_correct",
      "PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq",
      "PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq",
      "PNP.Concrete.PipelineCompiler.pipeline_ne_timeout",
      "PNP.Concrete.PipelineCompiler.pipeline_accepts_iff",
      "PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact"
    ]) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineCompiler" || theorem.axioms?.length !== 0) fail(`core inventory all-input compiler theorem mismatch: ${name}`);
    }
    for (const name of [
      "PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents",
      "PNP.Concrete.PipelineInputFramer.totalInputFramerRawTimeBound_le",
      "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound",
      "PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_rawTimeBound_blankEquivalent",
      "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_accept",
      "PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout"
    ]) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineInputFramer" || theorem.axioms?.length !== 0) fail(`core inventory all-input framer theorem mismatch: ${name}`);
    }
    for (const name of [
      "PNP.Concrete.PipelineSequentialCompiler.sequential_correct",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff",
      "PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact"
    ]) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineSequentialCompiler" || theorem.axioms?.length !== 0) fail(`core inventory sequential compiler theorem mismatch: ${name}`);
    }
    for (const name of [
      "PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin",
      "PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq",
      "PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin",
      "PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq",
      "PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff"
    ]) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== "PNP.Concrete.PipelineRefinement" || theorem.axioms?.length !== 0) fail(`core inventory recursive refinement theorem mismatch: ${name}`);
    }
    for (const [name, evidence] of Object.entries(BUILDER_THIRD_CLAUSE_PADDING_RUN_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.")
        ? "PNP.Concrete.CookLevinBuilderFirstClausePaddingRun"
        : "PNP.Concrete.CookLevinBuilderThirdClausePaddingRun";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(evidence.axioms)) fail(`core inventory Cook-Levin builder third-clause-padding-run theorem mismatch: ${name}`);
      if (theorem && milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== evidence.hash) fail(`core inventory Cook-Levin builder third-clause-padding-run fingerprint mismatch: ${name}`);
    }

    for (const [name, row] of Object.entries(BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
        ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
        : name.startsWith("PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.")
          ? "PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep"
          : "PNP.Concrete.CookLevinBuilderFourthClauseSeparatorStep";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`core inventory Cook-Levin builder fourth-clause-separator-step theorem mismatch: ${name}`);
      if (theorem && milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`core inventory Cook-Levin builder fourth-clause-separator-step fingerprint mismatch: ${name}`);
    }

    for (const [name, row] of Object.entries(BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
        ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
        : name.startsWith("PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.")
          ? "PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix"
          : "PNP.Concrete.CookLevinBuilderFourthClauseFirstLiteralPrefix";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`core inventory Cook-Levin builder fourth-clause-first-literal-prefix theorem mismatch: ${name}`);
      if (theorem && milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`core inventory Cook-Levin builder fourth-clause-first-literal-prefix fingerprint mismatch: ${name}`);
    }

    for (const [name, row] of Object.entries(BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_THEOREMS)) {
      const theorem = payload.milestoneCandidates?.find((candidate) => candidate.name === name);
      const expectedModule = name.startsWith("PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.")
        ? "PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep"
        : name.startsWith("PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.")
          ? "PNP.Concrete.CookLevinBuilderThirdClauseSecondLiteralPrefix"
          : "PNP.Concrete.CookLevinBuilderFourthClauseSecondLiteralPrefix";
      if (!theorem || theorem.kind !== "theorem" || theorem.module !== expectedModule || JSON.stringify(theorem.axioms) !== JSON.stringify(row.axioms)) fail(`core inventory Cook-Levin builder fourth-clause-second-literal-prefix theorem mismatch: ${name}`);
      if (theorem && milestoneTheoremKernelTypeSha256(name, theorem.kernelType) !== row.hash) fail(`core inventory Cook-Levin builder fourth-clause-second-literal-prefix fingerprint mismatch: ${name}`);
    }

    if (payload.milestoneCandidates?.length !== 1334) fail("core inventory reviewed theorem-candidate count mismatch");
  }
}

export function synchronizeFormalPublication(options = {}) {
  const root = path.resolve(options.root || process.cwd());
  const sourceDir = path.resolve(root, options.sourceDir || process.env.PNP_SOURCE_DIR || "../pnp");
  const write = options.write === true;
  const log = options.log || (() => {});
  assertPinnedCore(sourceDir);

  const mirrors = [];

  for (const artifact of CORE_FILES) {
    const blob = coreBlob(sourceDir, artifact.sourcePath);
    if (blob.length !== artifact.bytes || sha256(blob) !== artifact.sha256) fail(`${artifact.sourcePath}: pinned core bytes differ from reviewed identity`);
    assertCorePayloadBoundary(artifact.sourcePath, blob);
    for (const target of artifact.targets) {
      const targetPath = path.resolve(root, target);
      if (!targetPath.startsWith(`${root}${path.sep}`)) fail(`${target}: target escapes repository root`);
      assertSafeMirrorTarget(root, targetPath, !write);
      mirrors.push({ artifact, blob, target, targetPath });
    }
  }

  if (write) {
    for (const mirror of mirrors) writeMirrorFileAtomically(root, mirror.targetPath, mirror.blob);
  }

  for (const { artifact, blob, target, targetPath } of mirrors) {
      assertSafeMirrorTarget(root, targetPath, true);
      const local = readFileSync(targetPath);
      if (!local.equals(blob)) fail(`${target}: drifted from ${CORE_COMMIT}:${artifact.sourcePath}${write ? " after write" : ""}`);
      log(`ok ${target} = ${CORE_COMMIT}:${artifact.sourcePath}`);
  }

  if (sha256(readFileSync(path.join(root, CORE_FILES[0].targets[0]))) === OLD_PDF_SHA256) fail("historical 56-page PDF was restored into the current report");
  if (sha256(readFileSync(path.join(root, CORE_FILES[1].targets[0]))) === OLD_TEX_SHA256) fail("historical TeX was restored into the current report");
  checkPdfPageCount(path.join(root, CORE_FILES[0].targets[0]));
  verifyReleaseSeal({ root });

  return { status: write ? "written-and-verified" : "verified-read-only", coreCommit: CORE_COMMIT, coreTree: CORE_TREE };
}

function parseArgs(argv) {
  const options = {};
  let mode = null;
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--write") {
      if (mode) fail(`cannot combine --${mode} with --write`);
      mode = "write";
      options.write = true;
    } else if (argv[index] === "--check") {
      if (mode) fail(`cannot combine --${mode} with --check`);
      mode = "check";
      options.write = false;
    } else if (argv[index] === "--source-dir") {
      if (!argv[index + 1]) fail("--source-dir requires a path");
      options.sourceDir = argv[index + 1];
      index += 1;
    } else {
      fail(`unknown argument: ${argv[index]}`);
    }
  }
  return options;
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  try {
    const result = synchronizeFormalPublication({ ...parseArgs(process.argv.slice(2)), log: console.log });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.stack || String(error));
    process.exit(1);
  }
}

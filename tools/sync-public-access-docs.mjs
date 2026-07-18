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

const CORE_COMMIT = "bb51e4a9a502f41c360c995946025ef09e9afa97";
const CORE_TREE = "cfc53f876c30d7a79ed3ffaf67673ce3c8cf8327";
const OLD_PDF_SHA256 = "53437127d4d111562689c093857de86e846c6ad4a8cf0bc0674ff0bc822e603d";
const OLD_TEX_SHA256 = "414d2a2474291c0cc2bf1098f6c937b0bf13c53243774394516bd8def355d4c7";

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

const CORE_FILES = [
  {
    sourcePath: "canonical_proof_report.pdf",
    targets: ["downloads/canonical_proof_report.pdf", "downloads/canonical-proof-report.pdf"],
    bytes: 311223,
    sha256: "2e59c5111601eab9097e8fa23aa09ac4a8cc9ba3785d3fd568f6cf578ffc9965"
  },
  {
    sourcePath: "canonical_proof_report.tex",
    targets: ["downloads/canonical_proof_report.tex", "downloads/canonical-proof-report.tex"],
    bytes: 53798,
    sha256: "649ae65829ffa9663ee70cc009c0f0fc45b550376c1d63c45d8aeb5bfd83925e"
  },
  {
    sourcePath: "public/pnp-status.json",
    targets: ["public/pnp-status.json"],
    bytes: 462218,
    sha256: "c4f8caec0bee56d04616fe76fc686c7065083ec46407fa8b8cfef60eed91dc4b"
  },
  {
    sourcePath: "public/pnp-theorem-inventory.json",
    targets: ["public/pnp-theorem-inventory.json"],
    bytes: 3363988,
    sha256: "87d085a8712794527850a495741cf3cce9cb6b38151457c0873899043b9e4c8f"
  }
];

function fail(message) {
  throw new Error(message);
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
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
  if (sha256(map) !== "a9d7c7c47c9727b876e036e42f65f2cf08deb55f9b900d6c138daf2fffc969f8") {
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
  if (publicationMap.coordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-18-52"
      || publicationMap.milestoneSourceClosureSha256 !== "d7acbdace52e522810a2afb22915c9226f16363ebaec721646fda7ab4d3a3c06"
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
}

function checkPdfPageCount(pdfPath) {
  const result = spawnSync("pdfinfo", [pdfPath], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.status !== 0) fail(`pdfinfo failed for ${pdfPath}: ${(result.stderr || result.stdout || "pdfinfo unavailable").trim()}`);
  const match = result.stdout.match(/^Pages:\s+(\d+)\s*$/m);
  if (!match || Number(match[1]) !== 26) fail(`${pdfPath}: expected exactly twenty-six pages`);
}

function assertCorePayloadBoundary(sourcePath, buffer) {
  if (!sourcePath.endsWith(".json")) return;
  const payload = JSON.parse(buffer.toString("utf8"));
  if (sourcePath === "public/pnp-status.json") {
    if (payload.coordinate !== "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-18-52" || payload.publicSurfaceBaselineCoordinate !== "PUBLIC-SURFACE-BASELINE-2026-07-18-COOK-LEVIN-BUILDER-FIRST-CLAUSE-PADDING-RUN-51") fail("core status coordinate mismatch");
    if (payload.formalPublicationMapCoordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-18-52" || payload.formalPublicationMapSha256 !== "a9d7c7c47c9727b876e036e42f65f2cf08deb55f9b900d6c138daf2fffc969f8" || payload.leanSourceClosureSha256 !== "d7acbdace52e522810a2afb22915c9226f16363ebaec721646fda7ab4d3a3c06") fail("core status source identity mismatch");
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
    if (payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepAuditedDeclarationCount !== 45 || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepDirectPaddingOutcomeFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepRetainedAdvancedTokenCoordinateFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicTokenCursorStepSinglePaddingStepFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder dynamic-token-cursor-step evidence mismatch");
    const firstClausePaddingRunMilestone = payload.formalPublicationMilestones?.find((milestone) => milestone.id === "concrete-cook-levin-builder-first-clause-padding-run");
    if (!firstClausePaddingRunMilestone || firstClausePaddingRunMilestone.earned !== true || firstClausePaddingRunMilestone.allPresent !== true || firstClausePaddingRunMilestone.allKernelTypesMatch !== true || firstClausePaddingRunMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || firstClausePaddingRunMilestone.requiredTheorems?.length !== 48) fail("core status Cook-Levin builder first-clause-padding-run boundary mismatch");
    if (payload.leanConcreteCookLevinBuilderFirstClausePaddingRunFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount !== 84 || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderFirstClausePaddingRunFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinFormulaBuilderFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder first-clause-padding-run evidence mismatch");
    if (payload.leanConcreteCNFSATInPFormalized !== false || payload.leanConcreteCNFNPCompletenessFormalized !== false) fail("core status overstates the CNF-SAT result");
  } else if (sourcePath === "public/pnp-theorem-inventory.json") {
    if (payload.coordinate !== "PNP-LEAN-THEOREM-INVENTORY-2026-07-18-52") fail("core inventory coordinate mismatch");
    if (payload.compatibilityRootCandidate !== null || payload.concreteTargetCandidate?.name !== "PNP.Main.ConcretePEqualsNP") fail("core inventory publication boundary mismatch");
    if (payload.declarationCount !== 8006 || payload.theoremCount !== 3903 || payload.assumptionFreeTheoremCount !== 2921 || payload.excludedPrivateDeclarationCount !== 2444 || payload.sourceClosureModuleCount !== 72 || payload.axiomCount !== 4) fail("core inventory counts mismatch");
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
    if (payload.milestoneCandidates?.length !== 633) fail("core inventory reviewed theorem-candidate count mismatch");
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

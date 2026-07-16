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

const CORE_COMMIT = "62c35edef4bb64f2c665051e61d07c7b17f70ad3";
const CORE_TREE = "619759ec50764df68ea6b68ddbc84d0f8bd85448";
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

const CORE_FILES = [
  {
    sourcePath: "canonical_proof_report.pdf",
    targets: ["downloads/canonical_proof_report.pdf", "downloads/canonical-proof-report.pdf"],
    bytes: 296616,
    sha256: "afc2edd421ad3e4c04d1ade5a019dd63ba0c6fd75ecfc813dcb1effab528d063"
  },
  {
    sourcePath: "canonical_proof_report.tex",
    targets: ["downloads/canonical_proof_report.tex", "downloads/canonical-proof-report.tex"],
    bytes: 40058,
    sha256: "f33296d44b1c0bbb5d24525f101eac3307211714bb73de309eb42e727e33cd71"
  },
  {
    sourcePath: "public/pnp-status.json",
    targets: ["public/pnp-status.json"],
    bytes: 309501,
    sha256: "763756907512ae8321635720fd0f72487dfd7cd05a013d4a134f7276ca551643"
  },
  {
    sourcePath: "public/pnp-theorem-inventory.json",
    targets: ["public/pnp-theorem-inventory.json"],
    bytes: 2459012,
    sha256: "a27adf2ab77140e0e8b9c41429f0178ba97a2a76738669f6d6175e416bce2b28"
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
  if (sha256(map) !== "709e18b206c525588b524dcc7d327eb9b0b211be6f5986ff7b07d82ff2755c87") {
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
    "PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula": "2637f4e27b2a6e40a7e774b10fac91d379daebe9ff6930c72de43ee23bd054d0"
  };
  if (publicationMap.coordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-16-47"
      || publicationMap.milestoneSourceClosureSha256 !== "75ed4e71af40ea8b2efc0c271e1c53ed5c5e62a1113c887e3669c58848f8978b"
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
}

function checkPdfPageCount(pdfPath) {
  const result = spawnSync("pdfinfo", [pdfPath], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (result.status !== 0) fail(`pdfinfo failed for ${pdfPath}: ${(result.stderr || result.stdout || "pdfinfo unavailable").trim()}`);
  const match = result.stdout.match(/^Pages:\s+(\d+)\s*$/m);
  if (!match || Number(match[1]) !== 19) fail(`${pdfPath}: expected exactly nineteen pages`);
}

function assertCorePayloadBoundary(sourcePath, buffer) {
  if (!sourcePath.endsWith(".json")) return;
  const payload = JSON.parse(buffer.toString("utf8"));
  if (sourcePath === "public/pnp-status.json") {
    if (payload.coordinate !== "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-16-47" || payload.publicSurfaceBaselineCoordinate !== "PUBLIC-SURFACE-BASELINE-2026-07-16-COOK-LEVIN-BUILDER-COMPLETE-HEADER-46") fail("core status coordinate mismatch");
    if (payload.formalPublicationMapCoordinate !== "PNP-FORMAL-PUBLICATION-MAP-2026-07-16-47" || payload.formalPublicationMapSha256 !== "709e18b206c525588b524dcc7d327eb9b0b211be6f5986ff7b07d82ff2755c87" || payload.leanSourceClosureSha256 !== "75ed4e71af40ea8b2efc0c271e1c53ed5c5e62a1113c887e3669c58848f8978b") fail("core status source identity mismatch");
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
    if (!formulaCursorMilestone || formulaCursorMilestone.earned !== true || formulaCursorMilestone.allPresent !== true || formulaCursorMilestone.allKernelTypesMatch !== true || formulaCursorMilestone.axiomClosureUsesOnlyLeanStandardAllowlist !== true || formulaCursorMilestone.requiredTheorems?.length !== 13) fail("core status Cook-Levin formula-cursor boundary mismatch");
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
    if (payload.leanConcreteCookLevinBuilderCompleteHeaderFormalized !== true || payload.leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed !== true || payload.leanConcreteCookLevinBuilderCompleteHeaderAuditedDeclarationCount !== 83 || payload.leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized !== true || payload.leanConcreteCookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized !== true || payload.leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized !== true || payload.leanConcreteCookLevinBuilderCompleteHeaderInputPrefixAppenderComposed !== true || payload.leanConcreteCookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized !== true || payload.leanConcreteCookLevinBuilderDynamicCursorFormalized !== false || payload.leanConcreteCookLevinBuilderRawRefinementFormalized !== false || payload.leanConcreteCookLevinBuilderPolynomialReductionFormalized !== false) fail("core status Cook-Levin builder complete-header evidence mismatch");
    if (payload.leanConcreteCNFSATInPFormalized !== false || payload.leanConcreteCNFNPCompletenessFormalized !== false) fail("core status overstates the CNF-SAT result");
  } else if (sourcePath === "public/pnp-theorem-inventory.json") {
    if (payload.coordinate !== "PNP-LEAN-THEOREM-INVENTORY-2026-07-16-47") fail("core inventory coordinate mismatch");
    if (payload.compatibilityRootCandidate !== null || payload.concreteTargetCandidate?.name !== "PNP.Main.ConcretePEqualsNP") fail("core inventory publication boundary mismatch");
    if (payload.declarationCount !== 7418 || payload.theoremCount !== 3473 || payload.assumptionFreeTheoremCount !== 2764 || payload.excludedPrivateDeclarationCount !== 2032 || payload.sourceClosureModuleCount !== 67 || payload.axiomCount !== 4) fail("core inventory counts mismatch");
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
    if (payload.milestoneCandidates?.length !== 414) fail("core inventory reviewed theorem-candidate count mismatch");
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

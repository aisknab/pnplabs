// Purpose: support static-site navigation, release digest checks, and public source links.
document.querySelectorAll('link[data-deferred-style]').forEach((link) => {
  link.media = 'all';
  link.removeAttribute('data-deferred-style');
});

const menuButton = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');

const STATUS_COORDINATE = "PNP-FORMAL-RECONSTRUCTION-STATUS-2026-08-19-165";
const STATUS_SHA256 = '3c5cb857d110c76667de89771135577df4ffddbc2ab8593d78a6d1de1aad407c';
const FORMAL_PUBLICATION_MAP_COORDINATE = "PNP-FORMAL-PUBLICATION-MAP-2026-08-19-165";
const FORMAL_PUBLICATION_MAP_SHA256 = "9081640a169409986dd08f3f5cfb01fae463af141d6d0886f11f05ef661c5027";
const PUBLIC_SURFACE_COORDINATE = 'PUBLIC-SURFACE-BASELINE-2026-08-10-CONCRETE-LOCKED-NAND-THRESHOLD-121';
const INVENTORY_COORDINATE = "PNP-LEAN-THEOREM-INVENTORY-2026-08-19-165";
const INVENTORY_SHA256 = "c92f904095922ba6864a09dd9849505849ba8e4626c8bd36c6d2d0a25c6baabd";
const SOURCE_CLOSURE_SHA256 = "57e2c23813d166123744da7eb3adab5ddaac77820dc053bdbd24154bb0921776";

const INVENTORY_COUNTS = Object.freeze({
  declarations: 29332,
  theorems: 15196,
  assumptionFreeTheorems: 7526,
  excludedPrivateDeclarations: 15058,
  modules: 282,
  axioms: 4,
});

const PROJECT_AXIOMS = Object.freeze([
  'PNP.CheckPCCPackexp',
  'PNP.GeneratePCCPack',
  'PNP.LockedNANDThreshold',
  'PNP.ResidualBandExactMinimization',
]);

const LEAN_STANDARD_AXIOMS = Object.freeze([
  'Classical.choice',
  'Quot.sound',
  'propext',
]);

const BUILDER_UNARY_POLYNOMIAL_DECLARATIONS = Object.freeze([
  [
    "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.compilerStepsPolynomial_eval",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.machine_acceptState_ne_rejectState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.root_prefix_length",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.root_register_length",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.rule_source_lt_acceptState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.rules_length",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.rules_pairwise_query_distinct",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.scratchWord_symbol",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderUnaryPolynomial.workTimePolynomial_eval",
    [
      "Quot.sound",
      "propext"
    ]
  ]
]);

const BUILDER_COMPLETE_HEADER_DECLARATIONS = Object.freeze([
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.machine_acceptState_ne_rejectState",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.rules_length",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.rules_pairwise_query_distinct",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.boundedDecide_compile_accept",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.boundedDecide_compile_ne_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.controllerF_launch_workStep",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.controllerState_injective",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.controllerT_launch_workStep",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.evaluatorController_launch_workStep",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.evaluatorState_injective",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.fAppenderState_injective",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.finalTape_represents",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.finalTokenBits_eq_encodedFormula_header",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.findWorkRule_controller_of_some",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.findWorkRule_evaluator_of_some",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.findWorkRule_fAppender_of_some",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.findWorkRule_prefix_of_some",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.findWorkRule_tAppender_of_some",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.headerTokens_eq_encodeUnaryTokens",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.machine_acceptState_ne_rejectState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.prefixEndpoint_before_launch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.prefixEvaluator_launch_workStep",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.prefixState_injective",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.rawTimeBound_eval",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.rawTimeBound_le",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.rules_length",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.rules_pairwise_query_distinct",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.run_compile_exact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.run_compile_rawTimeBound",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.run_compile_rawTimeBound_blankEquivalent",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.tAppenderState_injective",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.tController_launch_workStep",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.width_eq_FormulaWidth",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.width_positive",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.workBoundedDecide_accept",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.work_one_step_short_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ]
]);

const BUILDER_BODY_START_PREFIX_DECLARATIONS = Object.freeze([
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.appenderState_injective",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.appender_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.bodyStartTokens_eq_canonical_prefix",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.boundedDecide_compile_accept",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.boundedDecide_compile_ne_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.cursorAppender_launch_workStep",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.cursorDeadState_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.cursorEndpoint_before_launch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.cursorState_injective",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.cursorState_ne_appenderState",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.cursor_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.finalOutside_contains_nextTokenSlot",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.finalTape_represents",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.finalTokenBits_eq_encodedFormula_bodyStart",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.findWorkRule_appender_of_some",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.findWorkRule_cursor_of_some",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.findWorkRule_header_of_some",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.firstBodyTokenSlotDirect_eq_separator",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.headerCursor_launch_workStep",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.headerEndpoint_before_launch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.headerRejectEndpoint_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.headerState_injective",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.headerState_ne_appenderState",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.headerState_ne_cursorState",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.header_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.machine_acceptState_ne_rejectState",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.malformedAppenderOutput_timeout",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.malformedAppenderTally_timeout",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.nextBitCursor_nextSlot",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_two",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.rawTimeBound_eval",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.rawTimeBound_le",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.rules_length",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.rules_pairwise_query_distinct",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.rule_source_ne_acceptState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.rule_source_ne_rejectState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.run_compile_exact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.run_compile_rawTimeBound",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.run_compile_rawTimeBound_blankEquivalent",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.workBoundedDecide_accept",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderBodyStartPrefix.work_one_step_short_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ]
]);

const BUILDER_FIRST_LITERAL_PREFIX_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.boundedDecide_compile_accept", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.boundedDecide_compile_ne_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluatorDeadState_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluatorEndpoint_before_launch_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluatorState_injective", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluatorState_ne_fAppenderState", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluatorState_ne_tAppenderState", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluatorT_launch_workStep", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.evaluator_workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.fAppenderState_injective", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.fAppender_workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalOutside_contains_nextTokenSlot", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_firstLiteral", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.findWorkRule_evaluator_of_some", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.findWorkRule_fAppender_of_some", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.findWorkRule_prefix_of_some", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.findWorkRule_tAppender_of_some", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralSignSlotDirect_eq_t", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_formula_prefix", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralTokens_eq_canonical_prefix", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.firstLiteralZeroTerminatorSlotDirect_eq_f", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.machine_acceptState_ne_rejectState", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.malformedAppenderOutput_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.malformedAppenderTally_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.malformedFAppenderOutput_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.malformedFAppenderTally_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.nextBitCursor_nextSlot", []],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_four", []],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixEndpoint_before_launch_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixEvaluator_launch_workStep", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixRejectEndpoint_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixState_injective", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixState_ne_evaluatorState", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixState_ne_fAppenderState", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefixState_ne_tAppenderState", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.prefix_workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rawTimeBound_eval", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rawTimeBound_le", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rules_length", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rules_pairwise_query_distinct", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.run_compile_exact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.run_compile_rawTimeBound", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.tAppenderEndpoint_before_launch_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.tAppenderState_injective", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.tAppenderState_ne_fAppenderState", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.tAppender_workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.tF_launch_workStep", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.workBoundedDecide_accept", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.work_one_step_short_timeout", ["Quot.sound", "propext"]],
]);

const BUILDER_FIRST_CLAUSE_PREFIX_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.rules_length", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.rules_pairwise_query_distinct", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.tailTokens_length", []],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.FirstClauseTailAppender.workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.WorkChain.firstState_injective", []],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.WorkChain.firstState_ne_secondState", []],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.WorkChain.launch_workStep", []],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.WorkChain.rules_pairwise_query_distinct", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.WorkChain.secondState_injective", []],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.WorkChain.workRunExact", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.boundedDecide_compile_accept", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.boundedDecide_compile_ne_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.evaluatorEndpoint_before_launch_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.evaluatorTail_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.evaluator_workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.finalTokenBits_eq_encodedFormula_firstClause", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_formula_prefix", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.firstClauseTokens_eq_canonical_prefix", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.malformedAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.malformedAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextBitCursor_nextSlot", []],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextTokenSlot_direct_eq_padding", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.nextTokenSlot_eq_formulaVariableSlotBound_add_twelve", []],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.prefixEndpoint_before_launch_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.prefix_workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rawTimeBound_eval", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rawTimeBound_le", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rule_source_ne_acceptState", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rules_length", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.rules_pairwise_query_distinct", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_exact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_rawTimeBound", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.tail_workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.workBoundedDecide_accept", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePrefix.work_one_step_short_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rule_source_ne_acceptState", ["Quot.sound", "propext"]],
]);

const BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.advance_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.cursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.directOutcome_is_padding", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTokenBits_eq_encodedFormula_firstClause", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.finalTokenSlot_eq_formulaVariableSlotBound_add_thirteen", []],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.malformedCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.specification_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);

const BUILDER_FIRST_CLAUSE_PADDING_RUN_DECLARATIONS = Object.freeze([
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopSteps_le",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopback_workStep",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.machine_acceptState_ne_rejectState",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.rule_source_ne_acceptState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.rules_length",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.rules_pairwise_query_distinct",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.boundedDecide_compile_accept",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.boundedDecide_compile_ne_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.countEvaluator_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.countdownBoundPolynomial_eval",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.countdown_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalConfiguration_state",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalOutside_contains_finalTokenSlot",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalTape_represents",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalTokenBits_eq_encodedFormula_firstClause",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.finalTokenSlot_eq_secondClauseStart",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.formulaVariablePredecessorPolynomial_eval",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.formulaVariablePredecessorPolynomial_eval_add_one",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.formulaVariableSlotBound_at_least_three",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.launch_workStep",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.machine_acceptState_ne_rejectState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.malformedCountdownRoot_timeout",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.malformedCountdownScratch_timeout",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.paddingSlot_direct_eq_padding",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.predecessorSlot_add_remainingPaddingCount",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.prefixEndpoint_before_launch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.prefix_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.rawTimeBound_eval",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.rawTimeBound_le",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.remainingPaddingCount_eq",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_twelve",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.remainingPaddingCount_positive",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.rule_source_ne_acceptState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.rules_length",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.rules_pairwise_query_distinct",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.run_compile_exact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.run_compile_rawTimeBound",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.run_compile_rawTimeBound_blankEquivalent",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.secondClauseStart_direct_eq_sep",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.secondClauseStart_eq",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.specification_padding_run",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.specification_target_step",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.targetEvaluator_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.workBoundedDecide_accept",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.work_one_step_short_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact_of_unit_or_separator",
    [
      "Quot.sound",
      "propext"
    ]
  ]
]);

const BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rule_source_ne_acceptState", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_pairwise_query_distinct", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.appenderEndpoint_before_cursor_launch_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.appender_workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.boundedDecide_compile_accept", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.boundedDecide_compile_ne_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.cursor_workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.finalTokenBits_eq_encodedFormula_secondClauseStart", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.finalTokenSlot_eq_secondClauseStart_add_one", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.malformedAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.malformedAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.malformedCursorScratch_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.nextTokenSlot_direct_eq_f", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.prefixEndpoint_before_launch_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.prefixSeparator_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.prefix_workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.rawTimeBound_eval", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.rawTimeBound_le", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.rule_source_ne_acceptState", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.rules_length", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.rules_pairwise_query_distinct", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.run_compile_exact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.run_compile_rawTimeBound", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.secondClauseStartTokens_eq_canonical_formula_prefix", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.separatorCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.specification_next_step", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.specification_separator_step", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.suffix_workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.workBoundedDecide_accept", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.workRunExact", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.work_one_step_short_timeout", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound", "propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound", "propext"]],
]);

const BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalOutside_contains_finalTokenSlot", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseFirstLiteral", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_three", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstCursorEndpoint_before_secondAppender_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstFalseTokenCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstFalseTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedFirstAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedFirstAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedFirstCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedSecondAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedSecondAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.malformedSecondCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.prefixFirstLiteral_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondClauseFirstLiteralTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondFalseTokenCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.secondFalseTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_sign_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.work_one_step_short_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
]);

const BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_DECLARATIONS = Object.freeze([
  [
    "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.machine_acceptState_ne_rejectState",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rule_source_ne_acceptState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_pairwise_query_distinct",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.machine_acceptState_ne_rejectState",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rule_source_ne_acceptState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rules_length",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rules_pairwise_query_distinct",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.boundedDecide_compile_accept",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.boundedDecide_compile_ne_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalConfiguration_state",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalOutside_contains_finalTokenSlot",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTape_represents",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_secondClauseSecondLiteral",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.finalTokenSlot_eq_secondClauseStart_add_six",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.firstAppender_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.firstCursor_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.machine_acceptState_ne_rejectState",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedSignAppenderOutput_timeout",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedSignAppenderTally_timeout",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedSignCursorScratch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedTerminatorAppenderOutput_timeout",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedTerminatorAppenderTally_timeout",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedTerminatorCursorScratch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedUnaryAppenderOutput_timeout",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedUnaryAppenderTally_timeout",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.malformedUnaryCursorScratch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.prefixEndpoint_before_launch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.prefixSecondLiteral_launch_workStep",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.prefix_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.rawTimeBound_eval",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.rawTimeBound_le",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.rule_source_ne_acceptState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.rules_length",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.rules_pairwise_query_distinct",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.run_compile_exact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.run_compile_rawTimeBound",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.run_compile_rawTimeBound_blankEquivalent",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondAppender_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondClauseSecondLiteralTokens_eq_canonical_formula_prefix",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondCursor_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralSuffix_launch_workStep",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.secondLiteralUnaryUnitSlot_direct_eq_t",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.signAppenderCursor_launch_workStep",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.signAppenderEndpoint_before_cursor_launch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.signCursorEndpoint_before_unary_launch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.signTokenCursor_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_next_step",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_sign_step",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.suffix_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.terminatorAppenderCursor_launch_workStep",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.terminatorAppenderEndpoint_before_cursor_launch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.terminatorTokenCursor_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.thirdAppender_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.thirdCursor_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.trueFalseSuffix_launch_workStep",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.trueFalseSuffix_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.unaryAppenderCursor_launch_workStep",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.unaryAppenderEndpoint_before_cursor_launch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.unaryCursorEndpoint_before_terminator_launch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.unaryTokenCursor_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.workBoundedDecide_accept",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.work_one_step_short_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ]
]);

const BUILDER_SECOND_CLAUSE_PREFIX_DECLARATIONS = Object.freeze([
  [
    "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.FinishTokenCursor.machine_acceptState_ne_rejectState",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.FinishTokenCursor.rule_source_ne_acceptState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.FinishTokenCursor.rules_length",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.FinishTokenCursor.rules_pairwise_query_distinct",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.appenderEndpoint_before_cursor_launch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.appender_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.boundedDecide_compile_accept",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.boundedDecide_compile_ne_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.clauseTerminatorSlot_direct_eq_finish",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.cursor_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalConfiguration_state",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalOutside_contains_finalTokenSlot",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTape_represents",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenBits_eq_encodedFormula_secondClause",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finalTokenSlot_eq_secondClauseStart_add_seven",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.finishTokenCursor_launch_workStep",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.machine_acceptState_ne_rejectState",
    []
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.malformedAppenderOutput_timeout",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.malformedAppenderTally_timeout",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.malformedCursorScratch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.nextTokenSlot_direct_eq_padding",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.prefixEndpoint_before_launch_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.prefixFinish_launch_workStep",
    [
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.prefix_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.rawTimeBound_eval",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.rawTimeBound_le",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.rule_source_ne_acceptState",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.rules_length",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.rules_pairwise_query_distinct",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.run_compile_exact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.run_compile_rawTimeBound",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.run_compile_rawTimeBound_blankEquivalent",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.secondClauseTokens_eq_canonical_formula_prefix",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_next_step",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.specification_terminator_step",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.suffix_workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.workBoundedDecide_accept",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.workRunExact",
    [
      "Quot.sound",
      "propext"
    ]
  ],
  [
    "PNP.Concrete.CookLevin.BuilderSecondClausePrefix.work_one_step_short_timeout",
    [
      "Quot.sound",
      "propext"
    ]
  ]
]);

const BUILDER_SECOND_CLAUSE_PADDING_RUN_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopSteps_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.countEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.countdownBoundPolynomial_eval", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.countdown_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalOutside_contains_finalTokenSlot", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenBits_eq_encodedFormula_secondClause", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.finalTokenSlot_eq_thirdClauseStart", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.malformedCountdownRoot_timeout", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.malformedCountdownScratch_timeout", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.paddingSlot_direct_eq_padding", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.predecessorSlot_add_remainingPaddingCount", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.remainingPaddingCount_eq", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_seven", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.remainingPaddingCount_positive", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_padding_run", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.specification_target_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.thirdClauseStart_direct_eq_sep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.thirdClauseStart_eq", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClausePaddingRun.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);

const BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.appenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.appender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.cursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenBits_eq_encodedFormula_thirdClauseStart", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.finalTokenSlot_eq_thirdClauseStart_add_one", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.malformedAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.malformedAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.malformedCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.nextTokenSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.prefixSeparator_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.separatorCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.specification_separator_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.thirdClauseStartTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSeparatorStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);

const BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FirstLiteralSuffix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalOutside_contains_finalTokenSlot", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseFirstLiteral", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_three", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstCursorEndpoint_before_secondAppender_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstFalseTokenCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstFalseTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.firstLiteralZeroTerminatorSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedFirstAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedFirstAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedFirstCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedSecondAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedSecondAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.malformedSecondCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.prefixFirstLiteral_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.secondAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.secondAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.secondCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.secondFalseTokenCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.secondFalseTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_sign_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.thirdClauseFirstLiteralTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseFirstLiteralPrefix.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);
const BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalOutside_contains_finalTokenSlot", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_thirdClauseSecondLiteral", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.finalTokenSlot_eq_thirdClauseStart_add_seven", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.firstAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.firstCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.firstUnaryAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.firstUnaryCursorEndpoint_before_secondUnary_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.fourthAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.fourthCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedFirstUnaryAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedFirstUnaryAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedFirstUnaryCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSecondUnaryAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSecondUnaryAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSecondUnaryCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSignAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSignAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedSignCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedTerminatorAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedTerminatorAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.malformedTerminatorCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.prefixSecondLiteral_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralFirstUnaryUnitSlot_direct_eq_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSecondUnaryUnitSlot_direct_eq_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondUnaryAppenderCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondUnaryAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondUnaryCursorEndpoint_before_terminator_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.secondUnaryTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.signAppenderCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.signAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.signCursorEndpoint_before_firstUnary_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.signTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_sign_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.terminatorAppenderCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.terminatorAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.terminatorTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.thirdAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.thirdClauseSecondLiteralTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.thirdCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.trueFalseSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.trueFalseSuffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.trueTrueFalseSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.trueTrueFalseSuffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.unaryAppenderCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.unaryTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);
const BUILDER_THIRD_CLAUSE_PREFIX_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.FinishTokenCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.appenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.appender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.clauseTerminatorSlot_direct_eq_finish", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.cursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalOutside_contains_finalTokenSlot", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenBits_eq_encodedFormula_thirdClause", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finalTokenSlot_eq_thirdClauseStart_add_eight", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.finishTokenCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.malformedAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.malformedAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.malformedCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.nextTokenSlot_direct_eq_padding", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.prefixFinish_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.specification_terminator_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.thirdClauseTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePrefix.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);

const BUILDER_THIRD_CLAUSE_PADDING_RUN_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopSteps_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.countEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.countdownBoundPolynomial_eval", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.countdown_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalOutside_contains_finalTokenSlot", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenBits_eq_encodedFormula_thirdClause", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.finalTokenSlot_eq_fourthClauseStart", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.fourthClauseStart_direct_eq_sep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.fourthClauseStart_eq", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.malformedCountdownRoot_timeout", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.malformedCountdownScratch_timeout", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.paddingSlot_direct_eq_padding", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.predecessorSlot_add_remainingPaddingCount", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.remainingPaddingCount_eq", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_eight", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.remainingPaddingCount_positive", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_padding_run", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.specification_target_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClausePaddingRun.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);

const BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.appenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.appender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.cursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenBits_eq_encodedFormula_fourthClauseStart", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.finalTokenSlot_eq_fourthClauseStart_add_one", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.fourthClauseStartTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.malformedAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.malformedAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.malformedCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.nextTokenSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.prefixSeparator_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.separatorCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.specification_separator_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSeparatorStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
]);

const BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalOutside_contains_finalTokenSlot", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseFirstLiteral", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.finalTokenSlot_eq_fourthClauseStart_add_four", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralSignSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralTerminatorSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.firstLiteralUnaryUnitSlot_direct_eq_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.fourthClauseFirstLiteralTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedSignAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedSignAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedSignCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedTerminatorAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedTerminatorAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedTerminatorCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedUnaryAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedUnaryAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.malformedUnaryCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.nextTokenSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.prefixFirstLiteral_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.secondAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.secondCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.signAppenderCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.signAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.signCursorEndpoint_before_unary_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.signTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_sign_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_terminator_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_firstLiteral_unaryUnit_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.terminatorAppenderCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.terminatorAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.terminatorTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.thirdAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.thirdCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.trueFalseSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.trueFalseSuffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.unaryAppenderCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.unaryAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.unaryCursorEndpoint_before_terminator_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.unaryTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseFirstLiteralPrefix.work_one_step_short_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueFalseSuffix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
]);

const BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalOutside_contains_finalTokenSlot", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenBits_eq_encodedFormula_fourthClauseSecondLiteral", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.finalTokenSlot_eq_fourthClauseStart_add_eight", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.firstAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.firstCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.firstUnaryAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.firstUnaryCursorEndpoint_before_secondUnary_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.fourthAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.fourthClauseSecondLiteralTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.fourthCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedFirstUnaryAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedFirstUnaryAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedFirstUnaryCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSecondUnaryAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSecondUnaryAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSecondUnaryCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSignAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSignAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedSignCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedTerminatorAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedTerminatorAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.malformedTerminatorCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.nextTokenSlot_direct_eq_finish", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.prefixSecondLiteral_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralFirstUnaryUnitSlot_direct_eq_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralSecondUnaryUnitSlot_direct_eq_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralSignSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondLiteralTerminatorSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondUnaryAppenderCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondUnaryAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondUnaryCursorEndpoint_before_terminator_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.secondUnaryTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.signAppenderCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.signAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.signCursorEndpoint_before_firstUnary_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.signTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_secondUnaryUnit_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_sign_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_terminator_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.specification_secondLiteral_unaryUnit_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.terminatorAppenderCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.terminatorAppenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.terminatorTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.thirdAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.thirdCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.trueFalseSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.trueFalseSuffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.trueTrueFalseSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.trueTrueFalseSuffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.unaryAppenderCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.unaryTokenCursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClauseSecondLiteralPrefix.work_one_step_short_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.SecondLiteralSuffix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueFalseSuffix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.TrueTrueFalseSuffix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
]);

const BUILDER_FOURTH_CLAUSE_PREFIX_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.FinishTokenCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.FinishTokenCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.FinishTokenCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.FinishTokenCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.appenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.appender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.clauseTerminatorSlot_direct_eq_finish", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.cursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalOutside_contains_finalTokenSlot", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTokenBits_eq_encodedFormula_fourthClause", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finalTokenSlot_eq_fourthClauseStart_add_nine", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.finishTokenCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.fourthClauseTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.malformedAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.malformedAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.malformedCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.nextTokenSlot_direct_eq_padding", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.prefixFinish_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.specification_terminator_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePrefix.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);

const BUILDER_FOURTH_CLAUSE_PADDING_RUN_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopSteps_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.countEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.countdownBoundPolynomial_eval", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.countdown_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.fifthClauseSlotStart_direct_eq_padding", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.fifthClauseSlotStart_eq", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalOutside_contains_finalTokenSlot", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.finalTokenSlot_eq_fifthClauseSlotStart", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.malformedCountdownRoot_timeout", []],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.malformedCountdownScratch_timeout", []],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.paddingSlot_direct_eq_padding", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.predecessorSlot_add_remainingPaddingCount", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.remainingPaddingCount_eq", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.remainingPaddingCount_eq_formulaTokensPerClause_sub_nine", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.remainingPaddingCount_positive", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.specification_padding_run", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.specification_target_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFourthClausePaddingRun.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);

const BUILDER_FIFTH_CLAUSE_PADDING_RUN_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopSteps_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.countEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.countdownBoundPolynomial_eval", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.countdown_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.sixthClauseSlotStart_direct_eq_padding", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.sixthClauseSlotStart_eq", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalOutside_contains_finalTokenSlot", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTokenBits_eq_encodedFormula_fourthClause", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.finalTokenSlot_eq_sixthClauseSlotStart", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.malformedCountdownRoot_timeout", []],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.malformedCountdownScratch_timeout", []],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingSlot_direct_eq_padding", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.predecessorSlot_add_paddingCount", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingCount_eq", []],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingCount_eq_formulaTokensPerClause", []],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.paddingCount_positive", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.specification_padding_run", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.specification_target_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFifthClausePaddingRun.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);


const BUILDER_FIRST_CONSTRAINT_PADDING_RUN_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loopSteps_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.PaddingCountdown.loop_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.countEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.countdownBoundPolynomial_eval", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.countdown_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.secondConstraintStart_direct_eq_sep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.secondConstraintStart_eq", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalOutside_contains_finalTokenSlot", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTokenBits_eq_encodedFormula_fourthClause", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.finalTokenSlot_eq_secondConstraintStart", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.malformedCountdownRoot_timeout", []],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.malformedCountdownScratch_timeout", []],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingSlot_direct_eq_padding", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.predecessorSlot_add_paddingCount", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingCount_eq", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingCount_eq_remaining_first_constraint", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.paddingCount_positive", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.specification_padding_run", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.specification_target_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderFirstConstraintPaddingRun.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);


const BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.SeparatorCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.appenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.appender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.cursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTokenBits_eq_encodedFormula_secondConstraintStart", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.finalTokenSlot_eq_secondConstraintStart_add_one", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.malformedAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.malformedAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.malformedCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.nextTokenSlot_direct_eq_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.prefixSeparator_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.secondConstraintStartTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.separatorCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.specification_separator_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeparatorStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);

const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.appenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.appender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.cursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSign", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.finalTokenSlot_eq_secondConstraintStart_add_two", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.malformedAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.malformedAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.malformedCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.nextTokenSlot_direct_eq_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.prefixSign_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.secondConstraintFirstLiteralSignTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.specification_sign_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.trueTokenCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSignStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);


const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.appenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.appender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.cursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralFirstUnary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_three", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.malformedAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.malformedAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.malformedCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.nextTokenSlot_direct_eq_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.prefixFirstUnaryUnit_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.secondConstraintFirstLiteralFirstUnaryTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_firstUnaryUnit_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.trueTokenCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);


const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.appenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.appender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.cursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSecondUnary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_four", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.malformedAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.malformedAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.malformedCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.nextTokenSlot_direct_eq_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.prefixSecondUnaryUnit_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.secondConstraintFirstLiteralSecondUnaryTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.specification_secondUnaryUnit_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.trueTokenCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);


const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.TrueTokenCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.appenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.appender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.cursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralThirdUnary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.finalTokenSlot_eq_secondConstraintStart_add_five", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.malformedAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.malformedAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.malformedCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.nextTokenSlot_direct_eq_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.prefixThirdUnaryUnit_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.secondConstraintFirstLiteralThirdUnaryTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.specification_thirdUnaryUnit_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.trueTokenCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);


const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.deadState_workStep", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.CursorAdvance.malformedScratch_enters_dead", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.FalseTokenCursor.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.appenderEndpoint_before_cursor_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.appender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.cursor_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.falseTokenCursor_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralTerminator", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.finalTokenSlot_eq_secondConstraintStart_add_six", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.malformedAppenderOutput_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.malformedAppenderTally_timeout", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.malformedCursorScratch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.nextTokenSlot_direct_eq_finish_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.prefixTerminator_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.secondConstraintFirstLiteralTerminatorTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.specification_next_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.specification_terminator_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);


const BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.WidthBranchAppender.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.WidthBranchAppender.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.WidthBranchAppender.rules_length", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.WidthBranchAppender.rules_pairwise_query_distinct", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.WidthBranchAppender.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.branchAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.finalTokenBits_eq_encodedFormula_secondConstraintFirstLiteralSuccessor", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.finalTokenSlot_eq_secondConstraintStart_add_seven", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.followingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.prefixSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.secondConstraintFirstLiteralSuccessorTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.specification_following_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.specification_successor_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.successorTokenSlot_eq_secondConstraintStart_add_seven", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.widthEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.width_eq_tapeWidth", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.width_positive", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralSuccessorTokenStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.encodeCNFTokens_eq_terminator_then_successor", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.followingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
]);

const BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.encodeCNFTokens_eq_terminator_then_successor_and_optional_unary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.secondFollowingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rules_length", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rules_pairwise_query_distinct", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintPaddingOrUnary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_eight", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.opportunitySlot_eq_secondConstraintStart_add_eight", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.prefixSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.secondConstraintPaddingOrUnaryTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.specification_following_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.specification_opportunity_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.width_eq_tapeWidth", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.width_positive", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);


const BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.encodeCNFTokens_eq_terminator_then_successor_and_two_optional_unary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.thirdFollowingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rules_length", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rules_pairwise_query_distinct", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintSecondPaddingOrUnary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_nine", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.opportunitySlot_eq_secondConstraintStart_add_nine", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.prefixSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.secondConstraintSecondPaddingOrUnaryTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.specification_following_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.specification_opportunity_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.width_eq_tapeWidth", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.width_positive", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);


const BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.encodeCNFTokens_eq_terminator_then_successor_and_three_optional_unary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.fourthFollowingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rules_length", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rules_pairwise_query_distinct", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintThirdPaddingOrUnary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_ten", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.opportunitySlot_eq_secondConstraintStart_add_ten", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.prefixSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.secondConstraintThirdPaddingOrUnaryTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.specification_following_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.specification_opportunity_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.width_eq_tapeWidth", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.width_positive", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);


const BUILDER_SECOND_CONSTRAINT_FOURTH_PADDING_OR_UNARY_OPPORTUNITY_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.encodeCNFTokens_eq_terminator_then_successor_and_four_optional_unary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.fifthFollowingTokenSlot_direct_eq_padding_or_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rules_length", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rules_pairwise_query_distinct", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintFourthPaddingOrUnary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_eleven", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_f", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.opportunitySlot_eq_secondConstraintStart_add_eleven", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.prefixSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.secondConstraintFourthPaddingOrUnaryTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.specification_following_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.specification_opportunity_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.width_eq_tapeWidth", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.width_positive", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);

const BUILDER_SECOND_CONSTRAINT_FIFTH_PADDING_OR_TERMINATOR_OPPORTUNITY_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.encodeCNFTokens_eq_terminator_then_successor_and_four_optional_unary_and_optional_terminator", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.sixthFollowingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.WidthOptionalTerminatorAppender.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.WidthOptionalTerminatorAppender.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.WidthOptionalTerminatorAppender.rules_length", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.WidthOptionalTerminatorAppender.rules_pairwise_query_distinct", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.WidthOptionalTerminatorAppender.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintFifthPaddingOrTerminator", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_twelve", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.followingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.opportunitySlot_eq_secondConstraintStart_add_twelve", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.optionalAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.prefixSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.secondConstraintFifthPaddingOrTerminatorTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.specification_following_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.specification_opportunity_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.widthEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.width_eq_tapeWidth", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.width_positive", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);

const BUILDER_SECOND_CONSTRAINT_SIXTH_PADDING_OR_OPENING_UNARY_OPPORTUNITY_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.encodeCNFTokens_eq_terminator_then_successor_and_four_optional_unary_and_optional_terminator_and_optional_opening_unary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.seventhFollowingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rules_length", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rules_pairwise_query_distinct", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintSixthPaddingOrOpeningUnary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_thirteen", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.opportunitySlot_eq_secondConstraintStart_add_thirteen", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.optionalAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.prefixSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.secondConstraintSixthPaddingOrOpeningUnaryTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.specification_following_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.specification_opportunity_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.widthEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.width_eq_tapeWidth", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.width_positive", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);

const BUILDER_SECOND_CONSTRAINT_SEVENTH_PADDING_OR_UNARY_OPPORTUNITY_STEP_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.encodeCNFTokens_eq_terminator_then_successor_and_four_optional_unary_and_optional_terminator_and_optional_opening_unary_and_optional_first_unary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.eighthFollowingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.machine_acceptState_ne_rejectState", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rules_length", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.rules_pairwise_query_distinct", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.boundedDecide_compile_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.boundedDecide_compile_ne_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.finalConfiguration_state", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.finalOutside_contains_finalTokenSlot", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.finalTape_represents", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.finalTokenBits_eq_encodedFormula_secondConstraintSeventhPaddingOrUnary", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.finalTokenSlot_eq_secondConstraintStart_add_fourteen", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.followingTokenSlot_direct_eq_padding_or_t", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.machine_acceptState_ne_rejectState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.opportunitySlot_eq_secondConstraintStart_add_fourteen", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.optionalAppender_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.prefixEndpoint_before_launch_timeout", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.prefixSuffix_launch_workStep", ["propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.prefix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.rawTimeBound_eval", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.rawTimeBound_le", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.rule_source_ne_acceptState", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.rules_length", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.rules_pairwise_query_distinct", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.run_compile_exact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.run_compile_rawTimeBound_blankEquivalent", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.secondConstraintSeventhPaddingOrUnaryTokens_eq_canonical_formula_prefix", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.specification_following_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.specification_opportunity_step", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.suffix_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.targetEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.widthEvaluator_workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.width_eq_tapeWidth", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.width_positive", []],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.workBoundedDecide_accept", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.workRunExact", ["Quot.sound","propext"]],
  ["PNP.Concrete.CookLevin.BuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.work_one_step_short_timeout", ["Quot.sound","propext"]],
]);

const LOCKED_NAND_CARRIER_TRACE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.LockedNANDTrace.carrierSeparation", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDTrace.finalLock_fresh", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDTrace.distinguishedChecks_length", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDTrace.tracePredicate_coherentExtension", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDTrace.trace_sound_of_predicate_true", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDTrace.traceEquivalence", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDTrace.satisfiable_iff_trace_extension", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDTrace.exists_coherent_trace", ["Quot.sound", "propext"]],
]);

const LOCKED_NAND_GLOBAL_CANDIDATE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.LockedNANDGlobalCandidates.macroGateCount_report_formula", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.nonemptyPrefixCandidate_semantics", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.rawBaselineGateCount_eq_lockedBaselineCount", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_size", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.baselinePrefixSource_semantics", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_size", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_initial_semantics", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_semantics", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_no_internal_constants", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_no_internal_constants", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_finalLock_irrelevant", ["Quot.sound", "propext"]],
]);

const LOCKED_NAND_GLOBAL_BASELINE_DISTINCT_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_outputNonconstant", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_outputNotPositiveProjection", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_outputPairwiseDistinct", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_outputConditions", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.baselineCandidate_referenceMinimum", ["Quot.sound", "propext"]],
]);

const LOCKED_NAND_GLOBAL_UNSATISFIABLE_FINAL_ZERO_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_eq_false_of_unsatisfiable", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_referenceMinimum_eq_baseline_of_unsatisfiable", ["Quot.sound", "propext"]],
]);

const LOCKED_NAND_GLOBAL_SEMANTIC_THRESHOLD_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_nonconstant_of_satisfiable", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_notPositiveProjection_of_satisfiable", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_final_distinctFromBaseline_of_satisfiable", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_satisfiableFinalConditions", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_referenceMinimum_bounds_of_satisfiable", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_residualSlack_le_four", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_satisfiable_iff_referenceMinimum_ge_succ", ["Quot.sound", "propext"]],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_referenceMinimum_eq_baseline_of_unsatisfiable", ["Quot.sound", "propext"]],
]);

const RESIDUAL_GAIN_CHAIN_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.StrictEquivalentGain.strictResidualDescent", [], "PNP.ResidualRoutes"],
  ["PNP.DirectWire.strictGainChainBool_eq_true_iff", [], "PNP.ResidualGainChain"],
  ["PNP.DirectWire.StrictGainChain.end_equivalent", [], "PNP.ResidualGainChain"],
  ["PNP.DirectWire.StrictGainChain.end_referenceMinimum_eq", [], "PNP.ResidualGainChain"],
  ["PNP.DirectWire.StrictGainChain.end_residualSlack_add_length_le", [], "PNP.ResidualGainChain"],
  ["PNP.DirectWire.StrictGainChain.length_le_residualSlack", [], "PNP.ResidualGainChain"],
  ["PNP.DirectWire.strictGainChainBool_length_le_residualSlack", [], "PNP.ResidualGainChain"],
  ["PNP.DirectWire.strictGainChainBool_length_le_of_residualSlack_le", [], "PNP.ResidualGainChain"],
  ["PNP.DirectWire.StrictGainChain.eq_nil_of_residualSlack_eq_zero", [], "PNP.ResidualGainChain"],
  ["PNP.DirectWire.strictGainChainBool_eq_nil_of_residualSlack_eq_zero", [], "PNP.ResidualGainChain"],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_residualSlack_le_four", ["Quot.sound", "propext"], "PNP.LockedNANDGlobalSemanticThreshold"],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidateImplementation_residualSlack_le_four", ["Quot.sound", "propext"], "PNP.LockedNANDResidualGainBound"],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_strictGainChain_length_le_four", ["Quot.sound", "propext"], "PNP.LockedNANDResidualGainBound"],
  ["PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_strictGainChainBool_length_le_four", ["Quot.sound", "propext"], "PNP.LockedNANDResidualGainBound"],
]);

const RESIDUAL_GAIN_STOPPING_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.referenceMinimumImplementation_gateCount_eq_referenceMinimum", [], "PNP.ResidualGainStopping"],
  ["PNP.DirectWire.referenceMinimumImplementation_equivalent", [], "PNP.ResidualGainStopping"],
  ["PNP.DirectWire.referenceMinimumImplementation_isSemanticallyMinimum", [], "PNP.ResidualGainStopping"],
  ["PNP.DirectWire.referenceMinimumImplementation_residualSlack_eq_zero", [], "PNP.ResidualGainStopping"],
  ["PNP.DirectWire.referenceMinimumImplementation_strictEquivalentGain_of_residualSlack_pos", [], "PNP.ResidualGainStopping"],
  ["PNP.DirectWire.residualSlack_pos_iff_exists_strictEquivalentGain", [], "PNP.ResidualGainStopping"],
  ["PNP.DirectWire.residualSlack_eq_zero_iff_forall_not_strictEquivalentGain", [], "PNP.ResidualGainStopping"],
  ["PNP.DirectWire.isSemanticallyMinimum_iff_forall_not_strictEquivalentGain", [], "PNP.ResidualGainStopping"],
  ["PNP.DirectWire.StrictGainChain.end_residualSlack_eq_zero_of_no_strictEquivalentGain", [], "PNP.ResidualGainStopping"],
  ["PNP.DirectWire.strictGainChainBool_end_residualSlack_eq_zero_of_no_strictEquivalentGain", [], "PNP.ResidualGainStopping"],
]);

const RESIDUAL_TERMINAL_FULL_BRIDGE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalize_implementation", [], "PNP.ResidualTerminalFullBridge"],
  ["PNP.DirectWire.terminalize_gateCount", [], "PNP.ResidualTerminalFullBridge"],
  ["PNP.DirectWire.TerminalFullRealization.realize_equivalent", [], "PNP.ResidualTerminalFullBridge"],
  ["PNP.DirectWire.TerminalFullRealization.realize_semantics", [], "PNP.ResidualTerminalFullBridge"],
  ["PNP.DirectWire.referenceMinimumTerminalFullRealization_gateCount", [], "PNP.ResidualTerminalFullBridge"],
  ["PNP.DirectWire.terminalFullMinimum_eq_referenceMinimum", [], "PNP.ResidualTerminalFullBridge"],
  ["PNP.DirectWire.terminalFullMinimum_spec", [], "PNP.ResidualTerminalFullBridge"],
  ["PNP.DirectWire.isTerminalFullMinimum_iff_eq_terminalFullMinimum", [], "PNP.ResidualTerminalFullBridge"],
  ["PNP.DirectWire.isTerminalFullMinimum_iff_eq_referenceMinimum", [], "PNP.ResidualTerminalFullBridge"],
  ["PNP.DirectWire.WholeSpanResidualWitness.strictResidualDescent", [], "PNP.ResidualTerminalFullBridge"],
  ["PNP.DirectWire.residualSlack_pos_iff_exists_wholeSpanResidualWitness", [], "PNP.ResidualTerminalFullBridge"],
  ["PNP.DirectWire.residualSlack_eq_zero_iff_no_wholeSpanResidualWitness", [], "PNP.ResidualTerminalFullBridge"],
  ["PNP.DirectWire.StrictEquivalentGain.strictResidualDescent", [], "PNP.ResidualRoutes"],
]);

const RESIDUAL_TERMINAL_MODE_FIREWALL_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalFullCarrierRealization.project_realization", [], "PNP.ResidualTerminalModeFirewall"],
  ["PNP.DirectWire.TerminalFullCarrierRealization.project_implementation", [], "PNP.ResidualTerminalModeFirewall"],
  ["PNP.DirectWire.TerminalFullCarrierRealization.project_gateCount", [], "PNP.ResidualTerminalModeFirewall"],
  ["PNP.DirectWire.TerminalFullCarrierRealization.project_equivalent", [], "PNP.ResidualTerminalModeFirewall"],
  ["PNP.DirectWire.TerminalFullCarrierRealization.project_semantics", [], "PNP.ResidualTerminalModeFirewall"],
  ["PNP.DirectWire.TerminalCheckedFullLift.fullRealization_realization", [], "PNP.ResidualTerminalModeFirewall"],
  ["PNP.DirectWire.TerminalCheckedFullLift.fullRealization_profileEqual", [], "PNP.ResidualTerminalModeFirewall"],
  ["PNP.DirectWire.terminalCheckedFullLift_iff_fullProfileEqual", [], "PNP.ResidualTerminalModeFirewall"],
  ["PNP.DirectWire.TerminalQuotientComparison.checkedFullLift_of_keepsAll", [], "PNP.ResidualTerminalModeFirewall"],
  ["PNP.DirectWire.TerminalFullCarrierRealization.obligationsDischarged", [], "PNP.ResidualTerminalModeFirewall"],
  ["PNP.DirectWire.TerminalCheckedFullLift.obligationsDischarged", [], "PNP.ResidualTerminalModeFirewall"],
  ["PNP.DirectWire.terminalQuotientEqualityNotConstructive", [], "PNP.ResidualTerminalModeFirewall"],
]);

const RESIDUAL_TERMINAL_PROJECTION_MINIMUM_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalFullProfileMatchBool_complete", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalQuotientProfileMatchBool_complete", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalFullProfileMinimumRealization_gateCount", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalQuotientProfileMinimumComparison_gateCount", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalFullProfileMinimum_le", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalQuotientProfileMinimum_le", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalFullProfileMinimum_spec", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalQuotientProfileMinimum_spec", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalProjectionMinimum_mono", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalQuotientMinimum_add_projectionDefect", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalProjectionDefect_eq_zero_iff_minima_eq", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalProjectionDefect_eq_zero_iff_exists_checkedFullLiftAtMinimum", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalProfileMinima_eq_of_keepsAll", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalProjectionDefect_pos_no_checkedFullLiftAtMinimum", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
]);

const RESIDUAL_TERMINAL_PROJECTION_TRANSFER_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalProjectionDefect_int", ["propext"], "PNP.ResidualTerminalProjectionTransfer"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.transferIdentity", ["Quot.sound", "propext"], "PNP.ResidualTerminalProjectionTransfer"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.constantCutEquation_of_defects", ["Quot.sound", "propext"], "PNP.ResidualTerminalProjectionTransfer"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.projectionExcess_pos_of_constantCut", ["Quot.sound", "propext"], "PNP.ResidualTerminalProjectionTransfer"],
]);

const RESIDUAL_TERMINAL_SATURATION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.mem_allTerminalPrimitiveRecords", [], "PNP.ResidualTerminalSaturation"],
  ["PNP.DirectWire.terminalSaturate_extensive", [], "PNP.ResidualTerminalSaturation"],
  ["PNP.DirectWire.terminalSaturate_closed", [], "PNP.ResidualTerminalSaturation"],
  ["PNP.DirectWire.terminalSaturate_least", [], "PNP.ResidualTerminalSaturation"],
  ["PNP.DirectWire.terminalSaturate_monotone", [], "PNP.ResidualTerminalSaturation"],
  ["PNP.DirectWire.terminalSaturate_idempotent", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturation"],
  ["PNP.DirectWire.terminalSaturate_fixed_iff_closed", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturation"],
]);

const RESIDUAL_TERMINAL_PHYSICAL_SUPPORT_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.mem_allTerminalSaturationRuleKinds", ["propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.terminalSaturationEdge_eq_true_iff", ["propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.terminalSaturateRecords_extensive", ["Quot.sound", "propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.terminalSaturateRecords_sound", ["propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.terminalSaturateRecords_closed", ["Quot.sound", "propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.mem_terminalSaturateRecords_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.mem_allTerminalSupportWires", [], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.mem_terminalBoundaryPorts_iff", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.mem_terminalInterfacePorts_iff", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.completeTerminalPhysicalSupport_incoming_complete", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.completeTerminalPhysicalSupport_outgoing_complete", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.completeTerminalPhysicalSupport_compatible", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.completeSaturatedTerminalPhysicalSupport_records", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.completeSaturatedTerminalPhysicalSupport_compatible", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
]);

const RESIDUAL_TERMINAL_SUPPORT_EXTRACTION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.mem_terminalSelectedGateIndices_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.mem_terminalSelectedGates_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.terminalSelectedGateIndices_nodup", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.terminalSelectedGates_nodup", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractTerminalSupport_records", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractTerminalSupport_boundary", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractTerminalSupport_selectedGates", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractTerminalSupport_interface", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractTerminalSupport_gateCount", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.terminalOpenGateEvaluation_induced_selected", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.terminalOpenSupportSemantics_induced", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractTerminalSupport_semantics", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractTerminalSupport_induced", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractSaturatedTerminalSupport_records", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractSaturatedTerminalSupport_gateCount", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractSaturatedTerminalSupport_semantics", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractSaturatedTerminalSupport_induced", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.mem_terminalSaturateRecords_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.completeTerminalPhysicalSupport_incoming_complete", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.completeTerminalPhysicalSupport_compatible", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.completeSaturatedTerminalPhysicalSupport_compatible", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
]);

const RESIDUAL_TERMINAL_PROPER_SUPPORT_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.canonicalTerminalSupportSeed_mem", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.mem_canonicalTerminalSupportSeed_iff", ["propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.terminalProperPositiveSupportBool_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.findTerminalProperPositiveSupport_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.findTerminalProperPositiveSupport_exists_of_seed", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.findTerminalProperPositiveSupport_eq_none_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.findTerminalProperPositiveSupport_unique", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.TerminalProperPositiveSupport.saturatedRecords_closed", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.TerminalProperPositiveSupport.physically_compatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.TerminalProperPositiveSupport.gateCount_bounds", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.TerminalProperPositiveSupport.extracted_semantics", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.TerminalProperPositiveSupport.extracted_induced", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.TerminalProperPositiveSupport.minimumReplacement_equivalent", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.TerminalProperPositiveSupport.referenceMinimum_lt_gateCount", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.TerminalProperPositiveSupport.minimumReplacement_size_lt", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.mem_terminalSaturateRecords_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.completeSaturatedTerminalPhysicalSupport_compatible", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.extractSaturatedTerminalSupport_gateCount", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractSaturatedTerminalSupport_semantics", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractSaturatedTerminalSupport_induced", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.Candidate.referenceMinimumReplacement_equivalent", [], "PNP.NANDSlack"],
  ["PNP.DirectWire.Candidate.referenceMinimumReplacement_size", [], "PNP.NANDSlack"],
]);

const RESIDUAL_TERMINAL_SUPPORT_SQUARE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.mem_meetRecords_iff",["propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.leftRecords_closed",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.rightRecords_closed",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.meetRecords_closed",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.mem_joinRecords_iff",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.joinRecords_closed",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.records_closed",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.meetRecords_subset_left",["propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.meetRecords_subset_right",["propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.leftRecords_subset_join",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.rightRecords_subset_join",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.meetRecords_greatest",["propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.joinRecords_least",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.terminalSaturateRecords_mem_congr",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.records_congr",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.physically_compatible",["propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.extracted_gateCount",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.extracted_semantics",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.extracted_induced",["Quot.sound","propext"],"PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.mem_terminalSaturateRecords_iff",["Quot.sound","propext"],"PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.completeTerminalPhysicalSupport_compatible",["propext"],"PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.extractTerminalSupport_semantics",["Quot.sound","propext"],"PNP.ResidualTerminalSupportExtraction"],
  ["PNP.DirectWire.extractTerminalSupport_induced",["Quot.sound","propext"],"PNP.ResidualTerminalSupportExtraction"],
]);

const RESIDUAL_TERMINAL_GOVERNED_SUPPORT_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.mem_allTerminalProfileRoles", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.mem_terminalProfileCoordinatesForRole_iff", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.terminalProfileCoordinatesForRole_nodup", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.completeTerminalGovernedSupport_records", [], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalGovernedCompletedSupport.frontier_boundary", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalGovernedCompletedSupport.frontier_interface", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalGovernedCompletedSupport.mem_profileCoordinates_iff", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalGovernedCompletedSupport.profileCoordinates_nodup", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalGovernedCompletedSupport.mem_own_profile_role_iff", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalGovernedCompletedSupport.profile_role_unique", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalGovernedCompletedSupport.profileCoordinates_disjoint", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalGovernedCompletedSupport.profile_record_covered_iff", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalGovernedCompletedSupport.required_mem", [], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalGovernedCompletedSupport.required_profile_mem", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.completeSaturatedTerminalGovernedSupport_records", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.completeSaturatedTerminalGovernedSupport_compatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_records", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_compatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_profile_iff", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_required_mem", ["Quot.sound", "propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_required_profile_mem", ["Quot.sound", "propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.completeTerminalPhysicalSupport_compatible", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.terminalSaturateRecords_closed", ["Quot.sound", "propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.mem_terminalSaturateRecords_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.records_closed", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.physically_compatible", ["propext"], "PNP.ResidualTerminalSupportSquareClosure"],
]);

const RESIDUAL_TERMINAL_FRONTIER_PUSHOUT_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.allTerminalSupportWires_nodup", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalGovernedFrontier.extensionality", [], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.mem_terminalBoundaryFrontierPushout_iff", ["propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.mem_terminalInterfaceFrontierPushout_iff", ["propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.mem_terminalProfileFrontierPushout_iff", ["propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.terminalBoundaryFrontierPushout_nodup", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.terminalInterfaceFrontierPushout_nodup", ["propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.terminalProfileFrontierPushout_nodup", ["propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_boundary_eq_pushout", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_interface_eq_pushout", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_meet_profile_iff", ["propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_profile_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_profile_eq_pushout", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.side_profile_mem_join", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.left_boundary_disposition", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.right_boundary_disposition", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.side_interface_disposition", ["propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governed_frontier_pushout", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.terminalGateSelected_eq_true_iff", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.terminalWireExternal_eq_true_iff", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.terminalBoundaryWire_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.terminalGateHasExternalConsumer_eq_true_iff", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.terminalInterfaceGate_eq_true_iff", ["propext"], "PNP.ResidualTerminalPhysicalSupportCompletion"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.mem_meetRecords_iff", ["propext"], "PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.mem_joinRecords_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.records_closed", ["Quot.sound", "propext"], "PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.physically_compatible", ["propext"], "PNP.ResidualTerminalSupportSquareClosure"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_profile_iff", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
]);

const RESIDUAL_TERMINAL_PROJECTION_SQUARE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalGovernedFrontier.project_boundary", [], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalGovernedFrontier.project_interface", [], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalGovernedFrontier.mem_project_profiles_iff", ["propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalGovernedFrontier.project_profiles_nodup", ["propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalGovernedFrontier.project_idempotent", ["Quot.sound", "propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.mem_terminalProjectedGovernedFrontierPushout_profiles_iff", ["propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalGovernedFrontier.project_pushout", ["propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.projectedFrontier_boundary", ["propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.projectedFrontier_interface", ["propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.mem_projectedFrontier_profiles_iff", ["propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.projectedFrontier_profiles_nodup", ["propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.forgotten_not_mem_projectedFrontier", ["propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.projected_meet_profile_iff", ["propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.projected_join_profile_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.projected_join_eq_pushout", ["Quot.sound", "propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governed_projection_compatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalProjectionSquare"],
  ["PNP.DirectWire.TerminalGovernedFrontier.extensionality", [], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.mem_terminalProfileFrontierPushout_iff", ["propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.terminalProfileFrontierPushout_nodup", ["propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_profile_iff", ["propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_meet_profile_iff", ["propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_profile_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governed_frontier_pushout", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
]);

const RESIDUAL_TERMINAL_SIDE_TIGHT_MINIMUM_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalFourCornerSizes.componentwiseLE_refl", [], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalFourCornerSizes.numericallySideTight_iff_eq", [], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalFourCornerSizes.sideTightBool_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalFourCornerSizes.tightValue?_eq_some_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalFourCornerSizes.tightValue?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalFourCornerSizes.tightValue?_complete", ["Quot.sound", "propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalFourCornerSizes.incidenceValue_eq_minimum_add_slacks", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.fullMinimumSizes_incidenceValue", [], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalFullFourCornerBasis.minimum_componentwiseLE_sizes", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalFullFourCornerBasis.incidenceValue_eq_fullDelta_add_slacks", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonicalFullBasis_sizes", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonicalFullBasis_numericallySideTight", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonicalFullBasis_tightValue?", ["Quot.sound", "propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.quotientMinimumSizes_incidenceValue", [], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalQuotientFourCornerBasis.minimum_componentwiseLE_sizes", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalQuotientFourCornerBasis.incidenceValue_eq_quotientDelta_add_slacks", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonicalQuotientBasis_sizes", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonicalQuotientBasis_numericallySideTight", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonicalQuotientBasis_tightValue?", ["Quot.sound", "propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonical_numericallySideTight_values", ["Quot.sound", "propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.terminalFullProfileMinimumRealization_gateCount", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalQuotientProfileMinimumComparison_gateCount", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalFullProfileMinimum_le", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalQuotientProfileMinimum_le", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
]);

const RESIDUAL_TERMINAL_FOUR_CORNER_CARRIER_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalFourCornerCarrier.boundaryDisposition?_eq_some_iff", ["propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.interfaceDisposition?_eq_some_iff", ["propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.boundary_nodup", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.interface_nodup", ["propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.profile_nodup", ["propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.extracted_boundary", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.extracted_interface", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.corner_compatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.meet_profile_transport", ["propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.side_profile_transport", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.join_profile_transport", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.boundary_retained", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.boundary_internalized", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.interface_retained", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.interface_internalized", ["propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.projection_compatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.complete_transport", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_compatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalGovernedSupportCompletion"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_meet_profile_iff", ["propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.side_profile_mem_join", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_profile_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.left_boundary_disposition", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.right_boundary_disposition", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.side_interface_disposition", ["propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_boundary_eq_pushout", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governedCompleted_join_interface_eq_pushout", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governed_projection_compatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalProjectionSquare"],
]);

const RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMA_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalSupportWireAt_ambientIndex", [], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalSupportWire.ambientIndex_terminalSupportWireAt", [], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalSupportWire.ambientIndex_injective", [], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.boundaryIndex?_eq_some_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.interfaceIndex?_eq_some_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.boundaryIndex?_ambient_get", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.interfaceIndex?_get", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.boundaryAdapter_semantics_get", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.ambientizeCandidate_semantics_present", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.ambientizeCandidate_semantics_absent", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.localizeCandidate_semantics", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.localize_ambientize_semantics", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.ambientizeCandidate_gateCount", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.localizeCandidate_gateCount", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.ambientizeCandidate_equivalent", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.localizeCandidate_equivalent", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.localize_ambientize_equivalent", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.localizeImplementation_gateCount", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.ambient_referenceMinimum_eq_corner", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.optimizationCorners_at", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.optimizationCorners_role", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.optimizationCorners_projection", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.localizeRealization_gateCount", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.fourCornerOptimaCarrierCompatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.complete_transport", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonicalFullBasis_sizes", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonicalQuotientBasis_sizes", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.terminalFullProfileMinimumRealization_gateCount", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalQuotientProfileMinimumComparison_gateCount", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.referenceMinimum_le_of_equivalent", [], "PNP.NANDMinimum"],
]);

const RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMUM_COHERENCE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalOptimumLegTransport.recordsSubset", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalOptimumLegTransport.profileTransport", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalOptimumLegTransport.ambientCoordinate_exact", [], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalOptimumLegTransport.retainedOutput?_eq_some_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalOptimumLegTransport.retained_or_internalized", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.optimumTransportTheta", [], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumCoherenceFailure?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumModeMismatch?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.noFailure_iff_coherentOptimumTuple", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.classifyOptimumCoherence_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.fourCornerOptimumCoherenceDichotomy", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.fourCornerOptimaCarrierCompatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.complete_transport", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.meet_profile_transport", ["propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.side_profile_transport", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.interfaceIndex?_eq_some_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonicalFullBasis_numericallySideTight", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonicalQuotientBasis_numericallySideTight", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonical_numericallySideTight_values", ["Quot.sound", "propext"], "PNP.ResidualTerminalSideTightMinimum"],
]);

const RESIDUAL_TERMINAL_FOUR_CORNER_SIDE_TIGHT_COMPLETION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumRoute?_coherence", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumRoute?_quotientPromotion", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerOptimumRoutedFailure.sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.noOptimumCoherenceRoute_iff_noFailure", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.noOptimumPromotionRoute_iff_noModeMismatch", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumRoute?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionOrFirstRoute", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerOptimumRoutedFailure.excludesCoherentOptimum", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionExists", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionExistsEachMode", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletion_fullValue", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletion_quotientValue", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumCoherenceFailure?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumModeMismatch?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.noFailure_iff_coherentOptimumTuple", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.fourCornerOptimaCarrierCompatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.optimumTransportTheta", [], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonicalFullBasis_numericallySideTight", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonicalQuotientBasis_numericallySideTight", ["propext"], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.canonical_numericallySideTight_values", ["Quot.sound", "propext"], "PNP.ResidualTerminalSideTightMinimum"],
]);

const RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalOptimumCoherenceMode.minimumAt_le_current", ["propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.mem_minimumImplementationsAt_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.mem_minimumImplementationsAt_complete", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.mem_minimumImplementationsAt_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.mem_minimumImplementationBases_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.tightBasisBool_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.mem_tightBasisFamily_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.mem_tightBasisFamily_complete", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.mem_tightBasisFamily_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.canonicalImplementationBasis_at", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.canonicalImplementationBasis_sizes", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.canonicalImplementationBasis_isTightCoherent", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.canonicalImplementationBasis_mem_tightFamily", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.tightBasis_incidenceValue_eq_delta", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.mem_tightBasisValues_eq_delta", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_eq_delta", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_full", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_quotient", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.firstBasisCoherenceFailure?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumCoherenceFailure?_eq_basis", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.mem_allBoundedCandidates", [], "PNP.NANDEnumerator"],
  ["PNP.DirectWire.terminalFullProfileMatchBool_complete", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalQuotientProfileMatchBool_complete", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalFullProfileMinimum_le", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalQuotientProfileMinimum_le", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.TerminalFourCornerSizes.numericallySideTight_iff_eq", [], "PNP.ResidualTerminalSideTightMinimum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumCoherenceFailure?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCoherence"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionExists", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
]);

const RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalComputedBN2SquareLegitimate.cornerCompatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalComputedBN2SquareLegitimate.meetProfile", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalComputedBN2SquareLegitimate.joinProfile", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalComputedBN2SquareLegitimate.projectionCompatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.computedBN2SquareLegitimate", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalComputedBN2SquareQuantities.sharedRole", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalComputedBN2SquareQuantities.sharedProjection", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalComputedBN2SquareQuantities.referenceMinimumPreserved", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalComputedBN2SquareQuantities.transferIdentity", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.computedBN2SquareQuantities", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.computedBN2LocalConclusion", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.computedBN2LocalConclusionOrFirstRoute", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.complete_transport", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerCarrier"],
  ["PNP.DirectWire.TerminalSaturatedSupportSquare.governed_frontier_pushout", ["Quot.sound", "propext"], "PNP.ResidualTerminalFrontierPushout"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.fourCornerOptimaCarrierCompatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerOptimumCompatibility"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.sideTightCompletionExistsEachMode", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_full", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.tightBasisMaximum?_quotient", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerTightBasisMaximum"],
  ["PNP.DirectWire.TerminalFourCornerOptimumRoutedFailure.sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.transferIdentity", ["Quot.sound", "propext"], "PNP.ResidualTerminalProjectionTransfer"],
]);

const RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalBCELAnchorProblem.mem_anchorRecords_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.TerminalBCELAnchorProblem.anchorRecords_nodup", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.TerminalBCELAnchorProblem.anchorRecords_mem_allAnchorSubfamilies", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.findTerminalPositiveAnchorNucleus_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.findTerminalPositiveAnchorNucleus_eq_none_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.findTerminalPositiveAnchorNucleus_exists_of_whole_positive", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.findTerminalPositiveAnchorNucleus_unique", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.TerminalBCELAnchorAlgebraCheck.disagrees_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.terminalBCELAnchorAlgebraCheck_mem", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.mem_allTerminalBCELAnchorAlgebraChecks_governed", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.firstTerminalBCELAnchorAlgebraMismatch?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.firstTerminalBCELAnchorAlgebraMismatch?_eq_none_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.terminalBCELProperCutSeedBool_eq_true_iff", ["propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.mem_allTerminalBCELProperCutSeeds_iff", ["propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.TerminalBCELCutDefectCheck.disagrees_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.terminalBCELCutDefectCheck_mem", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.mem_allTerminalBCELCutDefectChecks_proper", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.firstTerminalBCELCutDefectMismatch?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.firstTerminalBCELCutDefectMismatch?_eq_none_all", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.firstTerminalBCELCutRoute?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.firstTerminalBCELCutRoute?_eq_none_noRoutes", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.computedBCELCutConclusionOfNoFailures", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.TerminalComputedBCELAnchorNucleus.strictSubfamily_defect_zero", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.TerminalComputedBCELAnchorNucleus.anchorSizeAtLeastTwo", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.TerminalComputedBCELAnchorNucleus.properCutConstantEquation", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.TerminalComputedBCELAnchorNucleus.properCutLocalConclusion", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.classifyTerminalBCELAnchorNucleus_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalBCELAnchorNucleus"],
  ["PNP.DirectWire.allTerminalPrimitiveRecords_nodup", ["Quot.sound", "propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.filter_mem_terminalListSubsets", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.mem_allTerminalPrimitiveRecords", [], "PNP.ResidualTerminalSaturation"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.firstOptimumRoute?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerOptimumRoutedFailure.sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFourCornerSideTightCompletion"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.computedBN2SquareLegitimate", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalFourCornerCarrier.computedBN2LocalConclusion", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN2SquareLegitimacy"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.constantCutEquation_of_defects", ["Quot.sound", "propext"], "PNP.ResidualTerminalProjectionTransfer"],
  ["PNP.DirectWire.TerminalProjectionFourCorners.projectionExcess_pos_of_constantCut", ["Quot.sound", "propext"], "PNP.ResidualTerminalProjectionTransfer"],
]);

const RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalBCELAnchorProblem.wholeCorners_projectionDefect", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationPositivityFirewall"],
  ["PNP.DirectWire.TerminalProjectionPositivityLoss.minima_eq", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationPositivityFirewall"],
  ["PNP.DirectWire.classifyTerminalSaturationPositivity_loss_of_zero", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationPositivityFirewall"],
  ["PNP.DirectWire.classifyTerminalSaturationPositivity_bcel_of_positive", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationPositivityFirewall"],
  ["PNP.DirectWire.terminalSaturationPositivity_no_checkedFullLiftAtMinimum", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationPositivityFirewall"],
  ["PNP.DirectWire.classifyTerminalSaturationPositivity_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationPositivityFirewall"],
  ["PNP.DirectWire.terminalProjectionDefect_eq_zero_iff_minima_eq", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalFullProfileMinimumRealization_gateCount", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.terminalProjectionDefect_pos_no_checkedFullLiftAtMinimum", ["propext"], "PNP.ResidualTerminalProjectionMinimum"],
  ["PNP.DirectWire.TerminalProperPositiveSupport.saturatedRecords_closed", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.TerminalProperPositiveSupport.physically_compatible", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
  ["PNP.DirectWire.TerminalProperPositiveSupport.extracted_semantics", ["Quot.sound", "propext"], "PNP.ResidualTerminalProperSupport"],
]);

const RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalSaturateTrace_eventsLinked", ["propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.terminalSaturateTrace_records", ["propext"], "PNP.ResidualTerminalExecutableSaturation"],
  ["PNP.DirectWire.terminalCandidateSaturationSystem_profileSystem", ["Quot.sound", "propext"], "PNP.ResidualTerminalCandidateSaturation"],
  ["PNP.DirectWire.TerminalTransparentSaturationStep.uniqueMaterializerOwner", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalTransparentSaturationStep.supportCostBalanced", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalTransparentSaturationStep.fullCostBalanced", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalTransparentSaturationStep.quotientCostBounded", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalTransparentSaturationStep.fullSlack_preserved", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalTransparentSaturationStep.projectionDefect_mono", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalTransparentSaturationStep.fullPositive_preserved", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalSaturationEventsLinked.fullSlack_preserved", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalSaturationEventsLinked.projectionDefect_mono", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalSaturationEventsLinked.fullPositive_preserved", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalSaturationBalanceOutcome.balanced_event", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalSaturationBalanceOutcome.balanced_fullSlack_preserved", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalSaturationBalanceOutcome.balanced_projectionDefect_mono", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
  ["PNP.DirectWire.TerminalSaturationBalanceOutcome.balanced_fullPositive_preserved", ["Quot.sound", "propext"], "PNP.ResidualTerminalSaturationCostBalance"],
]);

const RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalInterfaceExposureCoordinate?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalInterfaceExposureRouting"],
  ["PNP.DirectWire.terminalCandidateInterfaceExposureCoordinate?_shape", ["Quot.sound", "propext"], "PNP.ResidualTerminalInterfaceExposureRouting"],
  ["PNP.DirectWire.terminalCandidateInterfaceExposureCoordinate?_edge", ["Quot.sound", "propext"], "PNP.ResidualTerminalInterfaceExposureRouting"],
  ["PNP.DirectWire.terminalInterfaceOutgoingCoordinate_eventCost_zero", ["Quot.sound", "propext"], "PNP.ResidualTerminalInterfaceExposureRouting"],
  ["PNP.DirectWire.TerminalInterfaceExposureERoute.sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalInterfaceExposureRouting"],
  ["PNP.DirectWire.TerminalInterfaceExposureZeroCostRetract.eventCost_zero", ["Quot.sound", "propext"], "PNP.ResidualTerminalInterfaceExposureRouting"],
  ["PNP.DirectWire.TerminalInterfaceExposureZeroCostRetract.fullSlack_preserved", ["Quot.sound", "propext"], "PNP.ResidualTerminalInterfaceExposureRouting"],
  ["PNP.DirectWire.terminalInterfaceExposure_transparent_or_eRoute", ["Quot.sound", "propext"], "PNP.ResidualTerminalInterfaceExposureRouting"],
  ["PNP.DirectWire.TerminalFirstInterfaceExposureRoute.sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalInterfaceExposureRouting"],
  ["PNP.DirectWire.classifyTerminalSaturationInterfaceRouting_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalInterfaceExposureRouting"],
]);

const RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalOriginKernelObligationCoordinate?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalOriginKernelObligationRouting"],
  ["PNP.DirectWire.terminalCandidateOriginKernelObligationCoordinate?_shape", ["Quot.sound", "propext"], "PNP.ResidualTerminalOriginKernelObligationRouting"],
  ["PNP.DirectWire.terminalCandidateOriginKernelObligationCoordinate?_edge", ["Quot.sound", "propext"], "PNP.ResidualTerminalOriginKernelObligationRouting"],
  ["PNP.DirectWire.TerminalOriginKernelObligationClosureRoute.sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalOriginKernelObligationRouting"],
  ["PNP.DirectWire.terminalOriginKernelObligation_safe_or_route", ["Quot.sound", "propext"], "PNP.ResidualTerminalOriginKernelObligationRouting"],
  ["PNP.DirectWire.TerminalSaturationClosureSafeStep.transparent", ["Quot.sound", "propext"], "PNP.ResidualTerminalOriginKernelObligationRouting"],
  ["PNP.DirectWire.classifyTerminalSaturationClosureRouting_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalOriginKernelObligationRouting"],
  ["PNP.DirectWire.TerminalFiniteSaturatePositiveOutcome.sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalFiniteSaturatePositive"],
  ["PNP.DirectWire.classifyTerminalFiniteSaturatePositive_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalFiniteSaturatePositive"],
]);

const RESIDUAL_TERMINAL_RANK_WF_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalResidualRank.coordinates_mk", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.TerminalResidualRank.coordinates_length", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRankLTBool_eq_true_iff", ["propext"], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRankLTBool_eq_false_iff", ["propext"], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRankLexLT_wellFounded", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRank_accessible", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRank_induction", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRank_witnessType_lt", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRank_spanType_lt", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRank_mode_lt", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRank_frontierDefect_lt", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRank_projectionDefect_lt", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRank_saturationDefect_lt", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRank_anchorCount_lt", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRank_chargeSize_lt", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRank_profileSize_lt", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.terminalResidualRank_canonicalCode_lt", [], "PNP.ResidualTerminalRankWF"],
  ["PNP.DirectWire.TerminalResidualRankDescent.sound", [], "PNP.ResidualTerminalRankWF"],
]);

const RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalListSubsets_sublist", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN3RequestEnvelope"],
  ["PNP.DirectWire.TerminalComputedBCELAnchorNucleus.requestAtoms_nodup", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN3RequestEnvelope"],
  ["PNP.DirectWire.terminalBN3RequestPredicateBool_eq_true_iff", ["propext"], "PNP.ResidualTerminalBN3RequestEnvelope"],
  ["PNP.DirectWire.terminalBN3RequestPredicate_monotone", [], "PNP.ResidualTerminalBN3RequestEnvelope"],
  ["PNP.DirectWire.terminalBN3RequestPredicate_stable", [], "PNP.ResidualTerminalBN3RequestEnvelope"],
  ["PNP.DirectWire.terminalBN3MinimalConsumer_exact", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN3RequestEnvelope"],
  ["PNP.DirectWire.TerminalComputedBCELAnchorNucleus.mem_activeRequestAtoms_iff_properCut", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN3RequestEnvelope"],
  ["PNP.DirectWire.TerminalComputedBCELAnchorNucleus.activeRequestAtoms_nodup", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN3RequestEnvelope"],
  ["PNP.DirectWire.TerminalComputedBCELAnchorNucleus.canonicalRequestBasis_jointlySideTight", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN3RequestEnvelope"],
  ["PNP.DirectWire.TerminalComputedBCELAnchorNucleus.computedBN3RequestEnvelope", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN3RequestEnvelope"],
  ["PNP.DirectWire.classifyTerminalBN3RequestEnvelope_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN3RequestEnvelope"],
]);

const RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalBN4ActivationCode_active_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
  ["PNP.DirectWire.terminalBN4ActivationCode_eq_iff_activation", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
  ["PNP.DirectWire.terminalBN4ActivationKey_eq_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
  ["PNP.DirectWire.terminalBN4IntegerMassLedger_exact", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
  ["PNP.DirectWire.TerminalBN4KeyCancellation.residual_key_eq", ["propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
  ["PNP.DirectWire.TerminalBN4KeyCancellation.residual_mass_positive", ["propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
  ["PNP.DirectWire.TerminalBN4KeyCancellation.no_opposite_sign_residual", ["propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
  ["PNP.DirectWire.TerminalBN4KeyCancellation.residual_signedContribution_exact", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
  ["PNP.DirectWire.terminalBN4CancelAtKey_signedContribution_exact", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
  ["PNP.DirectWire.terminalBN4CanonicalKeys_nodup", ["propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
  ["PNP.DirectWire.terminalBN4CellsUseCanonicalAtoms_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
  ["PNP.DirectWire.TerminalComputedBCELAnchorNucleus.computedBN4ActivationCancellation", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
  ["PNP.DirectWire.classifyTerminalBN4ActivationCancellation_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN4ActivationCancellation"],
]);

const RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalBN5ShadowCoordinate_eq_iff", [], "PNP.ResidualTerminalBN5FullShadowLocalization"],
  ["PNP.DirectWire.terminalBN5FullUnits_length", ["propext"], "PNP.ResidualTerminalBN5FullShadowLocalization"],
  ["PNP.DirectWire.terminalBN5FullUnits_key_eq", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN5FullShadowLocalization"],
  ["PNP.DirectWire.TerminalBN5HallDeficit.neighbor_card_lt_full_card", [], "PNP.ResidualTerminalBN5FullShadowLocalization"],
  ["PNP.DirectWire.TerminalBN5HallDeficit.fullSubset_coordinate_eq", ["propext"], "PNP.ResidualTerminalBN5FullShadowLocalization"],
  ["PNP.DirectWire.TerminalBN5HallDeficit.neighbor_coordinate_eq", ["propext"], "PNP.ResidualTerminalBN5FullShadowLocalization"],
  ["PNP.DirectWire.classifyTerminalBN5ShadowMatching_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN5FullShadowLocalization"],
  ["PNP.DirectWire.TerminalBN4KeyCancellation.negativeResidualMass?_positive", ["propext"], "PNP.ResidualTerminalBN5FullShadowLocalization"],
  ["PNP.DirectWire.TerminalBN5HallDeficit.namedLocalRoute_eq_x1Hall", [], "PNP.ResidualTerminalBN5FullShadowLocalization"],
  ["PNP.DirectWire.classifyTerminalBN5FullShadowLocalization_active", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN5FullShadowLocalization"],
  ["PNP.DirectWire.TerminalBN5HallDeficit.unmatchedShadowNotSilent", [], "PNP.ResidualTerminalBN5FullShadowLocalization"],
  ["PNP.DirectWire.classifyTerminalBN5FullShadowLocalization_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN5FullShadowLocalization"],
]);

const RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalPkgCPairNeedsRestoration_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCSeparatingConsumers"],
  ["PNP.DirectWire.firstTerminalPkgCSeparatingPair?_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCSeparatingConsumers"],
  ["PNP.DirectWire.firstTerminalPkgCSeparatingPair?_eq_none_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCSeparatingConsumers"],
  ["PNP.DirectWire.TerminalPkgCSeparatingPair.quotientUnits_length", ["propext"], "PNP.ResidualTerminalPkgCSeparatingConsumers"],
  ["PNP.DirectWire.TerminalPkgCSeparatingPair.quotientUnits_nonempty", ["propext"], "PNP.ResidualTerminalPkgCSeparatingConsumers"],
  ["PNP.DirectWire.terminalPkgC_restorationEdge_preservesCoordinate", [], "PNP.ResidualTerminalPkgCSeparatingConsumers"],
  ["PNP.DirectWire.TerminalBN5HallDeficit.pkgCRestorationNotSilent", [], "PNP.ResidualTerminalPkgCSeparatingConsumers"],
  ["PNP.DirectWire.terminalPkgC_separatingConsumers_restorationDichotomy", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCSeparatingConsumers"],
  ["PNP.DirectWire.classifyTerminalPkgCSeparatingConsumers_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCSeparatingConsumers"],
]);

const RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPkgCSeparatingPair.fullRestorationCandidates_length", ["propext"], "PNP.ResidualTerminalPkgCTypedRestoration"],
  ["PNP.DirectWire.TerminalPkgCSeparatingPair.fullRestorationCandidates_coordinates", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCTypedRestoration"],
  ["PNP.DirectWire.TerminalPkgCTypedRestorer.coordinateUniverse_coordinates", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCTypedRestoration"],
  ["PNP.DirectWire.terminalBN5FullMultiplicity_indexed_eq", ["propext"], "PNP.ResidualTerminalPkgCTypedRestoration"],
  ["PNP.DirectWire.terminalBN5ShadowMultiplicity_indexed_eq", ["propext"], "PNP.ResidualTerminalPkgCTypedRestoration"],
  ["PNP.DirectWire.TerminalPkgCSeparatingPair.typedRestoration_exactCoverage", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCTypedRestoration"],
  ["PNP.DirectWire.terminalBN5CompleteMultiplicityMatching_not_hallDeficit", [], "PNP.ResidualTerminalPkgCTypedRestoration"],
  ["PNP.DirectWire.terminalPkgC_typedRestoration_realization", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCTypedRestoration"],
  ["PNP.DirectWire.classifyTerminalPkgCTypedRestoration_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCTypedRestoration"],
]);

const RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalPkgCRestorationCancellationCellsForAtom_key_eq", [], "PNP.ResidualTerminalPkgCSameKeyCancellation"],
  ["PNP.DirectWire.terminalPkgCRestorationCancellationCellsForAtom_balanced", ["propext"], "PNP.ResidualTerminalPkgCSameKeyCancellation"],
  ["PNP.DirectWire.terminalPkgCRestorationCancellationCellsForAtoms_length", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCSameKeyCancellation"],
  ["PNP.DirectWire.terminalPkgCRestorationCancellationCellsForAtoms_balanced", ["propext"], "PNP.ResidualTerminalPkgCSameKeyCancellation"],
  ["PNP.DirectWire.TerminalPkgCSeparatingPair.restorationCancellationCells_length", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCSameKeyCancellation"],
  ["PNP.DirectWire.TerminalPkgCSeparatingPair.restorationCancellation_balanced", ["propext"], "PNP.ResidualTerminalPkgCSameKeyCancellation"],
  ["PNP.DirectWire.TerminalPkgCSeparatingPair.restorationCancellation_residualCells_empty", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCSameKeyCancellation"],
  ["PNP.DirectWire.TerminalPkgCSeparatingPair.restorationCancellation_signedMass_zero", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCSameKeyCancellation"],
  ["PNP.DirectWire.terminalPkgC_typedRestoration_sameKeyCancellation", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCSameKeyCancellation"],
  ["PNP.DirectWire.terminalPkgC_sameKeyCancellation_silence_singletonizes", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCSameKeyCancellation"],
  ["PNP.DirectWire.classifyTerminalPkgCSameKeyCancellation_exhaustive", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCSameKeyCancellation"],
]);

const RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.terminalBN4PositiveMass_perm", ["propext"], "PNP.ResidualTerminalPkgCAmbientBN4Ledger"],
  ["PNP.DirectWire.terminalBN4NegativeMass_perm", ["propext"], "PNP.ResidualTerminalPkgCAmbientBN4Ledger"],
  ["PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.generatedCell_mem_ambient", ["propext"], "PNP.ResidualTerminalPkgCAmbientBN4Ledger"],
  ["PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.cellMultiplicity", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCAmbientBN4Ledger"],
  ["PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.length_eq", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCAmbientBN4Ledger"],
  ["PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.positiveMass_decomposition", ["propext"], "PNP.ResidualTerminalPkgCAmbientBN4Ledger"],
  ["PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.negativeMass_decomposition", ["propext"], "PNP.ResidualTerminalPkgCAmbientBN4Ledger"],
  ["PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.signedMass_eq_remainder", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCAmbientBN4Ledger"],
  ["PNP.DirectWire.TerminalPkgCAmbientBN4LedgerEmbedding.residualSignedContribution_eq_remainder", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCAmbientBN4Ledger"],
  ["PNP.DirectWire.classifyTerminalPkgCAmbientBN4LedgerBinding_exhaustive", [], "PNP.ResidualTerminalPkgCAmbientBN4Ledger"],
  ["PNP.DirectWire.TerminalPkgCComputedAmbientBN4Cancellation.generatedCell_usesCanonicalAtom", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCAmbientBN4Ledger"],
  ["PNP.DirectWire.terminalPkgC_computedAmbientBN4_silence_singletonizes", ["Quot.sound", "propext"], "PNP.ResidualTerminalPkgCAmbientBN4Ledger"],
]);

const RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalV54ConsumerSystem.requestActive_monotone", [], "PNP.ResidualTerminalConsumerAntichainNormalForm"],
  ["PNP.DirectWire.TerminalV54ConsumerSystem.requestActive_empty_false", ["propext"], "PNP.ResidualTerminalConsumerAntichainNormalForm"],
  ["PNP.DirectWire.TerminalV54ConsumerSystem.consumer_is_minimal", [], "PNP.ResidualTerminalConsumerAntichainNormalForm"],
  ["PNP.DirectWire.TerminalV54ConsumerSystem.cutActive_has_disjoint_consumers", ["Quot.sound", "propext"], "PNP.ResidualTerminalConsumerAntichainNormalForm"],
  ["PNP.DirectWire.terminalV54_cutActivation_nonzero_iff_disjoint_consumers", ["Quot.sound", "propext"], "PNP.ResidualTerminalConsumerAntichainNormalForm"],
  ["PNP.DirectWire.terminalV54_consumerAntichain_normal_form_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalConsumerAntichainNormalForm"],
  ["PNP.DirectWire.terminalV54_consumerAntichain_normal_form", ["Quot.sound", "propext"], "PNP.ResidualTerminalConsumerAntichainNormalForm"],
]);

const RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalV53Hypergraph.cell_partition", ["Quot.sound", "propext"], "PNP.ResidualTerminalConstantCutHypergraphRigidity"],
  ["PNP.DirectWire.TerminalV53Hypergraph.cut_partition", ["Quot.sound", "propext"], "PNP.ResidualTerminalConstantCutHypergraphRigidity"],
  ["PNP.DirectWire.TerminalV53Hypergraph.pair_complement_identity", ["Quot.sound", "propext"], "PNP.ResidualTerminalConstantCutHypergraphRigidity"],
  ["PNP.DirectWire.TerminalV53Hypergraph.pairWeights_equal_of_shared", ["Quot.sound", "propext"], "PNP.ResidualTerminalConstantCutHypergraphRigidity"],
  ["PNP.DirectWire.TerminalV53Hypergraph.pairWeight_eq_zero_of_four", ["Quot.sound", "propext"], "PNP.ResidualTerminalConstantCutHypergraphRigidity"],
  ["PNP.DirectWire.TerminalV53Hypergraph.properFootprintWeight_eq_zero_of_four", ["Quot.sound", "propext"], "PNP.ResidualTerminalConstantCutHypergraphRigidity"],
  ["PNP.DirectWire.TerminalV53Hypergraph.twoAnchor_fullWeight", ["Quot.sound", "propext"], "PNP.ResidualTerminalConstantCutHypergraphRigidity"],
  ["PNP.DirectWire.TerminalV53Hypergraph.threeAnchor_rigidity", ["Quot.sound", "propext"], "PNP.ResidualTerminalConstantCutHypergraphRigidity"],
  ["PNP.DirectWire.TerminalV53Hypergraph.fourAnchor_rigidity", ["Quot.sound", "propext"], "PNP.ResidualTerminalConstantCutHypergraphRigidity"],
  ["PNP.DirectWire.terminalV53_constantCut_hypergraph_rigidity", ["Quot.sound", "propext"], "PNP.ResidualTerminalConstantCutHypergraphRigidity"],
]);

const RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalBN6GroupedCell.massPositive", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN6HypergraphPacket"],
  ["PNP.DirectWire.TerminalBN6GroupedCell.crosses_iff_footprintCrosses", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN6HypergraphPacket"],
  ["PNP.DirectWire.TerminalBN6GroupedCell.crossesBool_eq_cutActivationBool", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN6HypergraphPacket"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.cutWeight_eq_activationWeight", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN6HypergraphPacket"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.constantProperCuts", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN6HypergraphPacket"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.footprintWeight_eq_groupedMass", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN6HypergraphPacket"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.hasPayloadAt_of_footprintWeight_positive", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN6HypergraphPacket"],
  ["PNP.DirectWire.terminalBN6_hypergraph_packet", ["Quot.sound", "propext"], "PNP.ResidualTerminalBN6HypergraphPacket"],
]);

const RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalBN6GroupedFamily.hasPacketSelectorSeedAt_of_hasPayloadAt", ["propext"], "PNP.ResidualTerminalPacketSelectorSeeds", "9896a194aa243404922a3a870bfc5d982f103bbdb3e1c3bdfd42352bb91a3c27"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.selectorSeeds", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorSeeds", "ab62ea35d210a818af73fc38bac3e21d13e7026d2416a9567faba5c0c026b771"],
  ["PNP.DirectWire.terminalBN6_packet_selector_seeds", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorSeeds", "a32e4bc92d0af4fa404d1a8ab6640820c431aa1731198ddb4e605483c15ab386"],
]);

const RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetPayloadSelectorUniverse_nodup", ["propext"], "PNP.ResidualTerminalPacketSelectorUniverse", "3401f384c5a0d5c441b9d9f97de53b94cb7f41d3a6ac4e6f584b3355a3da298c"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.mem_packetPayloadSelectorUniverse_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorUniverse", "00957feaa27e826691c08111fd4d5ecdb434d5e4f124044834754de6c1a93ede"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.hasPacketPayloadSelectorAt_of_seed", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorUniverse", "f0aa84ec2d71e332787930b2537fe596ff41531cc123dfcca1368740071eb675"],
  ["PNP.DirectWire.TerminalPacketSelectorSeedConclusion.payloadSelectors", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorUniverse", "702f9a375f4655329e29abb5fc8d7c9740dce6aa4800b79baaf87598b0cec4a5"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.payloadSelectors", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorUniverse", "29b99133c361ab757f954bcf66824d27abb33a60b66d27ffe0004f8df7379c3d"],
  ["PNP.DirectWire.terminalBN6_packet_payload_selectors", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorUniverse", "c0d4ac0c1a982783e14ed87ce4294376f90e47b06dd6101d04cb0a63f21b722b"],
]);

const RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_mem_universe", ["propext"], "PNP.ResidualTerminalPacketSelectorHandles", "98e1a54f9b5c284a69eda1f4a3a1d29b5b38a5fd89bfcfa535631dc2f021ab75"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_injective", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorHandles", "1fc064e3c2db978ad7c35921e17175380d363c0bc088e23b9408130dc06d219c"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_sublist_carrier", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorHandles", "7294ad9daeaf3f227270abd33ac4a928439cf5cb26a3c0024eb528eb5e7f729b"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_large", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorHandles", "915190c19d8ca08503970e0a5584066b3b78d03b3fac3eb1843fa6b928c58bef"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_hasPayloadAt", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorHandles", "ed046c2c9acf3cff3b7407252153f6b9a1aadef915423dc3a34d21c876309377"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorFootprint_hasPacketPayloadSelectorAt", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorHandles", "49e929e54895b806526c0c673dea7bfecded831ea49c99fa25ba134b8e700576"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.hasFinitePacketSelectorHandleAt_iff_payloadSelector", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorHandles", "33dd9082f2e0d292658f769ed8a860e893c7f8cbf5748f307acd6e69fa5f54cf"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.existsUnique_packetSelectorHandle_iff_payloadSelector", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorHandles", "b454db2db1a0c83d9f5a6c9cdb10564db3bdf6bcd094cc08363c3de0484d8fab"],
  ["PNP.DirectWire.TerminalPacketPayloadSelectorConclusion.selectorHandles", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorHandles", "e59ea8ae3f7553b01568560e50fa8558fdd6f3919fce8a837e88430acd0fff8f"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.selectorHandles", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorHandles", "8dfc9b2a4357d6313c47c6f8352f22c2fffc3018e53f9fc3d3654ac78b748950"],
  ["PNP.DirectWire.terminalBN6_packet_selector_handles", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorHandles", "e8a07c5f17493ec6d905cf7dd28ad46f4a4e24ad24fc3ab75f918a7a279576c8"],
]);

const RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_encode", ["propext"], "PNP.ResidualTerminalPacketSelectorCodec", "0e4d125f4ada88d0f2f9d188a1ba2c69a17d675c555f0e6eed8dacedf4660f40"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.encodePacketSelectorHandle_injective", ["propext"], "PNP.ResidualTerminalPacketSelectorCodec", "be5a7248d1de95c8adb730c061003887a2a0afd7667cd8e085560ffdddc52b7f"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.encodePacketSelectorHandle_length", ["propext"], "PNP.ResidualTerminalPacketSelectorCodec", "9e90b81134401241f8e9b448adb3588605e502d8a67b8eeea8d619b7e3b84140"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.encodePacketSelectorHandle_length_le_universe", ["propext"], "PNP.ResidualTerminalPacketSelectorCodec", "7f5caf0819a8e1696463e99993399a78d3bc6a786a64b13604e69f08c7c40485"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_canonical", ["propext"], "PNP.ResidualTerminalPacketSelectorCodec", "0a85db798dea4e5fc887c33e7db492fa102a081123cf1adfccd4cf30561f6165"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_payloadEvidence", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorCodec", "df145b8b2bac1ea58116085bc04500a96c44248cd6aac404e0d9b769565d608b"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.hasEncodedPacketSelectorAt_iff_payloadSelector", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorCodec", "accf0d6418551d74babe5b1ce76b0f490d217b463e57b7b725b9c9b01b84dd1b"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.existsUnique_encodedPacketSelector_iff_payloadSelector", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorCodec", "f8f44b0800ee90410e97ae05705549c3bb5f11cd7c5e63a7d6161f605ed40108"],
  ["PNP.DirectWire.TerminalPacketPayloadSelectorConclusion.selectorCodes", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorCodec", "f518eec40806af1a781cddec358e0970e4bca8a5341865477865ad794d5c6ccc"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.selectorCodes", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorCodec", "a52bf419363cbe01c1101984c07ee9cf551796860db78d53faeeafa00ee1d2aa"],
  ["PNP.DirectWire.terminalBN6_packet_selector_codes", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorCodec", "031617e6b11b9c96848cfb9597d2afff584fc5e8dba4ad0d12b6a329a1b26ffe"],
]);

const RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorCell_footprint", ["propext"], "PNP.ResidualTerminalPacketSelectorPayloadRealization", "585917f43db54d9d5be3852605dcfcc01256d09d34bde1ed3e7ff0b0e2500e0f"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadAtom_mem", ["propext"], "PNP.ResidualTerminalPacketSelectorPayloadRealization", "bc42f6f75392b9ce43345b06aba862a758d32d9a8670945f111f33960abdbe3d"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.realizePacketSelectorPayload_eq_none_iff", ["propext"], "PNP.ResidualTerminalPacketSelectorPayloadRealization", "cbc666a2d051af090a607a177509340486e60215434e7ed7b15692e6ffe0557b"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_eq_some_of_realize", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorPayloadRealization", "d09a9d1b541eed299f676de5b47dfd84fe9b54228b6b2c2789db4a989c033e0e"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.exists_realizePacketSelectorPayload_encode", ["propext"], "PNP.ResidualTerminalPacketSelectorPayloadRealization", "5b52d770dcba2dac6f9314dbf3620d01445d2a71b1b47f0fd52d65719a5312bd"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.realizePacketSelectorPayload_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorPayloadRealization", "5a40df6a1b6f66efa77c827ff11ce46698aa0960a4891cd70d6196d8bfc156cf"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.isRealizedPacketSelectorAt_iff_encoded", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorPayloadRealization", "2d0a3ccb47c7b326c8fb44ce651fe5da452d986adc8435c71385fef772bc8870"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.hasRealizedPacketSelectorAt_iff_payloadSelector", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorPayloadRealization", "65968a464059a6b3d4805f2e451306e0fd37d46bf5a7cb30b720b632d376a444"],
  ["PNP.DirectWire.TerminalPacketEncodedSelectorConclusion.selectorPayloadRealizations", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorPayloadRealization", "d369c4f09b76a34298569a24eb7a7586e5e538fa03c5c80061ce057319e7d977"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.selectorPayloadRealizations", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorPayloadRealization", "c9ee54cb1fc4b623af2e96a88481a62ccf66e14f5aed608d8975ee4690c0b6c4"],
  ["PNP.DirectWire.terminalBN6_packet_selector_payload_realizations", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorPayloadRealization", "87e78d7623809a2026145930b4df7438605f484d17f11e99f700abf99cd5338d"],
]);

const RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalBN6GroupedFamily.mem_packetSelectorCandidateImplementations_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainScan", "0a1d4dbb85050c296121e30083d309b23e37289eda64f25fe5ea507ff7c853a1"],
  ["PNP.DirectWire.TerminalPacketCandidateGainOutcome.sound", [], "PNP.ResidualTerminalPacketSelectorGainScan", "14694f4db90e1f37a49a670edf367f06b8e088082d49e2ec5540d74fc0afb94b"],
  ["PNP.DirectWire.TerminalPacketCandidateGainOutcome.gain_strictResidualDescent", [], "PNP.ResidualTerminalPacketSelectorGainScan", "7f468d2ffb1d31071c4971c5232e78017d81003e954da16b334313c69155902f"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.scanPacketSelectorGains_eq_none_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainScan", "9b3bdfcd5e478fe239211cdc7e2b21841edbb05ef8a4191c72a6f910523bdf16"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.exists_scanPacketSelectorGains_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainScan", "deb7e43236b3cb43db356945fb7a9662806163fbfd52593c9c0da9975c83789e"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.decodePacketSelectorHandle_eq_some_of_gainScan", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainScan", "6eb7f2b430542b24beeb43e87a5f4f89fb924a60165e6d1a6962b7a252406d10"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.scanPacketSelectorGains_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainScan", "aa97c40ce86ffa1fcde24c71191dd97ac4a4bd8bd842d05ff112ff65e02a9af2"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.exists_scanPacketSelectorGains_encode", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainScan", "5a8e39e629c17ddff71b06f625a74ec1143ff3e59ed85f3ff0eaa297da66e46f"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.hasPacketSelectorGainScanAt_iff_encoded", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainScan", "22461d4ebcecae3bad666da8313baaf99ee302d0ea0e6dea80643dc280e66bed"],
  ["PNP.DirectWire.TerminalPacketEncodedSelectorConclusion.gainScans", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainScan", "d281b4b953c16f80afa51d606669bbb64e41c12cb24decc77ba379b4b1299a58"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.gainScans", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainScan", "c32f91d5404c84e2c5453226b2c4b5ee606c4d2cbc5fb2596f8818e8cefc6bdb"],
  ["PNP.DirectWire.terminalBN6_packet_selector_gain_scans", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainScan", "54570f3b2c287367fd79ed45fe365049ee662b7c2af25faaa0a7f3fef02f4325"],
]);

const RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_GAIN_SCAN_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalBN6GroupedFamily.mem_packetSelectorHandles", ["propext"], "PNP.ResidualTerminalPacketSelectorUniverseGainScan", "22cb55480f5bbe81fb8540e5e44baae06fe2a37d1f569a315d1ea6e613d77a1d"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorHandles_length", ["propext"], "PNP.ResidualTerminalPacketSelectorUniverseGainScan", "3d685cc640a9b0eebec7e777ba4eb0ba97e849864b1a49f983701f713c0f72db"],
  ["PNP.DirectWire.TerminalPacketSelectorHandleListGainOutcome.sound", ["propext"], "PNP.ResidualTerminalPacketSelectorUniverseGainScan", "ad8a3c4868e04bac82feacae9f4da4240351fbaea9de3366a0bab4243495af76"],
  ["PNP.DirectWire.TerminalPacketSelectorUniverseGainOutcome.sound", ["propext"], "PNP.ResidualTerminalPacketSelectorUniverseGainScan", "6f1bab3555fe49689a663406f474357fa987a15a5978be77aa0c592d2942b624"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.scanPacketSelectorUniverseGains_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorUniverseGainScan", "c52533b196e485c0bf91c0dff1f6ae39289c30946c7e8f792786953ca68c76a8"],
  ["PNP.DirectWire.TerminalPacketSelectorUniverseGainOutcome.gain_strictResidualDescent", ["propext"], "PNP.ResidualTerminalPacketSelectorUniverseGainScan", "211b3c22fb1a6c4c6bf9803a38a7d04902d79dd054ebda9e3d3ea492e00a4549"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.universeGain_source_and_code", ["propext"], "PNP.ResidualTerminalPacketSelectorUniverseGainScan", "908bfb961e16547356af3e1dacda10db97114f3f3658dcbc404fa57527ca38cc"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.universeNoGain_of_gainScan", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorUniverseGainScan", "b31b67e308423d933c862df8872bd70b331ac6fd86be0e1c658849a569e1f133"],
  ["PNP.DirectWire.TerminalPacketEncodedSelectorConclusion.universeGainScan_packet", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorUniverseGainScan", "373902d79d328259df3d62d93d2ab45f63191d236f52a3cc03eb2e50aeb1c418"],
  ["PNP.DirectWire.terminalBN6_packet_selector_universe_gain_scan_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorUniverseGainScan", "a9a9e9ccf505501b0576f0462c43d3d9283177b2079cae2c2a8d432a43153b8f"],
]);

const RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_COVERAGE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorGainCoverage.noStrictEquivalentGain", ["propext"], "PNP.ResidualTerminalPacketSelectorGainCoverage", "7b1ef90c27c9aceb97b855c14a94d198ef82637d27434fd2de966841a42dee32"],
  ["PNP.DirectWire.TerminalPacketSelectorGainCoverage.residualSlack_eq_zero_of_noGain", ["propext"], "PNP.ResidualTerminalPacketSelectorGainCoverage", "543a2c30236108717a975f337b6fe9e6419d61bf39adb4c0f55735df8b8473c2"],
  ["PNP.DirectWire.TerminalPacketSelectorCoveredGainOutcome.sound", ["propext"], "PNP.ResidualTerminalPacketSelectorGainCoverage", "def8db61dd5030d4c8c04c4dec62898c81955561bbdffcee39493ed2dc326380"],
  ["PNP.DirectWire.TerminalPacketSelectorCoveredGainOutcome.residualSlack_spec", ["propext"], "PNP.ResidualTerminalPacketSelectorGainCoverage", "59e59cd46feb3e8d7ccd20649d876a17ee8e240acf01b01d7d151cf4017f547c"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.scanCoveredPacketSelectorGains_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainCoverage", "7474e55f1b655cfc544b8edd7dbcee3afc58e8f6542eae2c327782eafead28b2"],
  ["PNP.DirectWire.TerminalPacketEncodedSelectorConclusion.coveredGainScan_packet", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainCoverage", "6e718e5038e7b09be9f0fba0772c7861094c45929f950fe9e859678ed2e1fffd"],
  ["PNP.DirectWire.terminalBN6_packet_selector_covered_gain_scan_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorGainCoverage", "bcc35fc1024c340c7eac8bb0d3359b66b3363df819002c8eea8bf4cd64272031"],
]);

const RESIDUAL_TERMINAL_PACKET_CHARGE_SURPLUS_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketChargeSurplus.matchedWeight_eq", ["propext"], "PNP.ResidualTerminalPacketChargeSurplus", "f93edb2a63467ca1efdd9589172a12b304c9ec0530b23032069613f9f8903eb6"],
  ["PNP.DirectWire.TerminalPacketChargeSurplus.supportWeight_eq_matched_add_unmatched", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketChargeSurplus", "d22021b63f150710925e2307d9e495054aab366505e184e22872610ec9ccbbcb"],
  ["PNP.DirectWire.TerminalPacketChargeSurplus.replacementWeight_eq_matched", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketChargeSurplus", "6b202ff6af0c4c616962b5f546846fb6ef6375594c413aa248d8a0e110d4187c"],
  ["PNP.DirectWire.TerminalPacketChargeSurplus.unmatchedWeight_pos", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketChargeSurplus", "8036cdeee6b28489069687c2506a605a255f331afbf445b1fe05acb74b94e63f"],
  ["PNP.DirectWire.TerminalPacketChargeSurplus.replacementLength_lt_supportLength", ["propext"], "PNP.ResidualTerminalPacketChargeSurplus", "0fddee3599dde5c5e14024968ff31be788f5e05dc7a0298a30bf0268b474c6ff"],
  ["PNP.DirectWire.TerminalPacketChargeSurplus.replacementWeight_lt_supportWeight", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketChargeSurplus", "7a862aad6ccb2a54aff55331b8294fe334c8fc005da680e1e2c44672d6205489"],
  ["PNP.DirectWire.TerminalPacketChargeSurplusRealization.strictEquivalentGain", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketChargeSurplus", "22429c08765b2229a69bfb2062cf775e2793a66521cbab4bb264038b34e2496e"],
  ["PNP.DirectWire.TerminalPacketChargeSurplusRealization.strictResidualDescent", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketChargeSurplus", "996f27da8b42eac154281a84232b7ae57a8f54fce85c34156640080beb462bd2"],
]);

const RESIDUAL_TERMINAL_PACKET_UNIT_CHARGE_BLUEPRINT_REALIZER_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.eraseFirstNat_sound", ["propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "41c42e3a2c2ba56552e198bf30327f62a00307e840f924f9e447da892d779cd9"],
  ["PNP.DirectWire.natOccurrencePermBool_sound", ["propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "349078e5fa3a02f777e3c0eb230db571f70d6781ef671e3c82a733798477eb2a"],
  ["PNP.DirectWire.natOccurrencePermBool_complete", ["propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "eb45baf4b6c3fe6dd72e03ac9496fa5a67f117319eacea62b6be281ffb024593"],
  ["PNP.DirectWire.natOccurrencePermBool_eq_true_iff", ["propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "5ffc15f71957aa9df73245db4ba1ecbc242cd930b6d9697bf5a182fbd8ffdcd3"],
  ["PNP.DirectWire.TerminalPacketUnitChargeBlueprint.check_eq_true_iff", ["propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "a7448288d95295a5d251ec278f99dfe638033e3a8d60a3e53f563477b451cb38"],
  ["PNP.DirectWire.unitChargeRange_sum", ["propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "f79d533d5caf48a6d09aa4448f33c4363dac8336e1124551d053346f554461ec"],
  ["PNP.DirectWire.TerminalPacketUnitChargeBlueprint.strictEquivalentGain_of_check", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "6fc060a0972995d9c384dbb99cf349e06ee0f8942cc255cb93f12d72fb2a5db9"],
  ["PNP.DirectWire.TerminalPacketUnitChargeBlueprint.strictResidualDescent_of_check", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "6f420ad19588056628c7aa6a57c25ce871412d9b199e0039a838035416a37e45"],
  ["PNP.DirectWire.TerminalPacketUnitChargeBlueprintAtomOutcome.sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "2382b52432df0a7a383730d348c56c60173c3bcd7b1bc3e806ec503cebd62f93"],
  ["PNP.DirectWire.TerminalPacketUnitChargeBlueprintRealizerOutcome.sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "a8e4eff50bd8b2f65944f10946c5108ddf8801d174b280816bc04bc787758b39"],
  ["PNP.DirectWire.TerminalPacketUnitChargeBlueprintRealizerOutcome.gain_descent", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "b3291ec4e2cf38ce492fdc0db625a10fd18cb6e861d6f24b257fa72049f92856"],
  ["PNP.DirectWire.TerminalPacketEncodedSelectorConclusion.unitChargeBlueprintRealizer_packet", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "9af5ac2e8f6287e6d0115015251b86c09d4583c85fe32eb0ca11fc4beecc3410"],
  ["PNP.DirectWire.terminalBN6_packet_unit_charge_blueprint_realizer_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketUnitChargeBlueprintRealizer", "c4b7dcbb96bd06db9db3f4b862d1586b6a7e96d4a8c9c0c4f9ae7a2a02de3912"],
]);

const RESIDUAL_TERMINAL_PACKET_TYPED_REALIZER_CONTRACT_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketTypedRealizerBot.check_eq_true_iff", ["propext"], "PNP.ResidualTerminalPacketTypedRealizerContract", "783ed4f17604f8ddb4c3c2fa4a4853898b68fe8fa1e75ef4196124c78ebc429e"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerClaim.check_eq_true_iff", ["propext"], "PNP.ResidualTerminalPacketTypedRealizerContract", "54c82cf8fd115ae869777235e75ff5fa161d351ff3ebd2ef85fd2b75e676fa41"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerEvidence.sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketTypedRealizerContract", "46f457bf3450394aa78f6f11438244bc9ca1e5cab17a0404179d0e2499dad3e4"],
  ["PNP.DirectWire.checkTerminalPacketFaithfulRealizerClaims_sound", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketTypedRealizerContract", "606778690b6c10ea92a29dc00118331efd7af642dda948804b288a4ad6f00224"],
  ["PNP.DirectWire.terminalBN6_packet_typed_realizer_contract", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketTypedRealizerContract", "22f72519a2e8ba68b7227d09432641c941d7744a39b3fae47fa69515f038cf76"],
]);

const RESIDUAL_TERMINAL_HB_BLOCKER_GRAPH_ACYCLICITY_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketHBDependencyGraph.checkRankEmbedding_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBBlockerGraphAcyclicity", "a32276f0c8b799900766c0a752e8e5d1de4f6ff226622e5a16d307d763975115"],
  ["PNP.DirectWire.TerminalPacketHBDependencyGraph.check_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBBlockerGraphAcyclicity", "2c9f567d1209679bac5cc47bfb8f6bb1845136bd6332b21a59309322aee11b43"],
  ["PNP.DirectWire.TerminalPacketHBDependencyGraph.depends_rank_lt", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBBlockerGraphAcyclicity", "7a16a5c655f82886d6faff81d29775c54c8d6e8ed0ebe9f9994dafa082c33a4e"],
  ["PNP.DirectWire.TerminalPacketHBDependencyGraph.depends_wellFounded", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBBlockerGraphAcyclicity", "a1493253f36ef68f1f50a34983edb6123da2de4f6f2ec9802596a5bf0050162e"],
  ["PNP.DirectWire.TerminalPacketHBDependencyGraph.noCycle", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBBlockerGraphAcyclicity", "ac9ec7b4a9b535599f6c803a8b8cdc5d57d317c01792960e06249a796e65692a"],
  ["PNP.DirectWire.TerminalPacketHBDependencyGraph.lowerSeed_rankTuple_lt_of_valid", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBBlockerGraphAcyclicity", "9881f5aef2ad8fc383da80d850b3c77846ee74ef905ecb975bdb293e716975b8"],
  ["PNP.DirectWire.terminalBN6_packet_typed_realizer_hb_acyclicity_contract", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBBlockerGraphAcyclicity", "676f6659a31ae0b9a854c9162f1d51762c1e8255b76c1d80021bf0f9c61d0886"],
]);

const RESIDUAL_TERMINAL_HB_DEPENDENCY_TABLE_CLOSURE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.mem_allTerminalPacketHBNodes", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBDependencyTableClosure", "88fdba9d4e6db862d111ec9c71deb2d8c03db04ddfb07cfeadca7d76da8fb089"],
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.edge_mem_toGraph_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBDependencyTableClosure", "7b4e6910383a38eaffdcfbe78d9d5b1ac8f7d7cac7fd24abd344ee878e440171"],
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.toGraph_depends_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBDependencyTableClosure", "ac6d0fe0e870fce5eeb4414f72b0731d4ef293f1337ff9e367d410d28c6f6d1b"],
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.rowCovered", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBDependencyTableClosure", "84f713c3ad8330c2cad27d49060815a8b109e098d4c46abee74dc0bc18572f64"],
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.check_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBDependencyTableClosure", "04cf8fba733851458892e17a260dc84cd690e6e027c88d4380ca33606ceca335"],
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.depends_rank_lt", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBDependencyTableClosure", "e649f2ea9b1458a21069742edf61e527f166463ee756ad561cf23d243dbf1af6"],
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.depends_wellFounded", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBDependencyTableClosure", "4414385e70cab392dfa85c0ec08c2c1f621530d5a227ce791eea8b8b750c7161"],
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.depends_induction", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBDependencyTableClosure", "43e488bde4020096ebb22635d00be0716f1b8b8552d24bd1930be5fb55021543"],
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.noCycle", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBDependencyTableClosure", "088c0ae7b22b89383e259db7a939a1b93fa921e1c26c6bb30b607b1fc93697ff"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerEvidence.hbTableSound", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBDependencyTableClosure", "f78565e502500f88f1a1cfe2e53d8d70c78d06a37b4dad0af58b8cc815a7114d"],
  ["PNP.DirectWire.terminalBN6_packet_typed_realizer_hb_dependency_table_closure_contract", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBDependencyTableClosure", "b8fa8701e2a8fabfbc70d83069fd54b8732e8aa670ab86992ef6c03c3bebc31a"],
]);

const RESIDUAL_TERMINAL_HB_ACTIVE_DEPENDENCY_CLOSURE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.checkActiveDependencyClosed_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBActiveDependencyClosure", "5c3919ecfb9d733958c127d6cd5c3f0cb06af25229aaebbecc28200700934518"],
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.checkNoOutcomeActiveClosure_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBActiveDependencyClosure", "14b532f9572c1e3e9024d5a0a594f39c629b1180d7660eb13fb7b2e6edea435f"],
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.noActive_of_noOutcomeActiveClosure", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBActiveDependencyClosure", "69c036adc81c3fad489dc446bb719f886885871f292fbd012ab87355c1c4d949"],
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.hnActive_eq_false", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBActiveDependencyClosure", "9d8b342b4697a8eb815cd4353092b7439bef4cb91547ef11f9bc43bd0d559ce4"],
  ["PNP.DirectWire.TerminalPacketHBDependencyTable.budgetActive_eq_false", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBActiveDependencyClosure", "58e82e3318d66431391f740396744ac679ab95ca23f1f67f90a4773c99605798"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerEvidence.hbActiveClosureSound", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBActiveDependencyClosure", "614947844ab205e0efa442fc2b8fa65b500d64cd7b0a6a1ade0d62106e0ab3b8"],
  ["PNP.DirectWire.terminalBN6_packet_typed_realizer_hb_active_dependency_closure_contract", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBActiveDependencyClosure", "e21c72385d24487dfbcd64d708d4d43e9fda3369754128352a65d965b4687879"],
]);

const RESIDUAL_TERMINAL_HB_SELECTOR_SILENCE_CLOSURE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.noFaithful_of_noStrictEquivalentGain", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBSelectorSilenceClosure", "bfc7dfbf112c6ea12d1bc9f80bf813aa4fa140f05315d57e5ceb12596cb1d5de"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.noFaithful_of_gainCoverageNoGain", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBSelectorSilenceClosure", "fd05e64f3dbf4438bccd34f960ebcf7c186892e9bb70aadc068351c494d806ad"],
  ["PNP.DirectWire.terminalBN6_packet_typed_realizer_hb_selector_silence_closure_contract", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBSelectorSilenceClosure", "bb80815c42a2ad17e8cfcb0d7764233806489e547875433c9ab8cb5c4191b899"],
  ["PNP.DirectWire.terminalBN6_packet_typed_realizer_hb_selector_silence_gain_coverage_contract", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBSelectorSilenceClosure", "353ae4076dfb315ae6c6e0b82396ab858e9a8755f84f89d44c257e744c43ad74"],
]);

const RESIDUAL_TERMINAL_HB_EXECUTABLE_SELECTOR_SILENCE_INDUCTION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketTypedRealizerClaim.isBotBool_eq_true_iff", [], "PNP.ResidualTerminalHBExecutableSelectorSilenceInduction", "2ff68cf7dd46a900b31bb45e2934db6940656dbc46c1f0edc06c0f9edff83499"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.checkSelectorSilent_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBExecutableSelectorSilenceInduction", "986270ac38886cc8c5772c43cb22ad422940385393e8a614153e590d7289d681"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.checkFaithful_of_selectorSilent", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBExecutableSelectorSilenceInduction", "c5fa7412d8f8f01e76cf07c557a35442866dcc8cc51d92f5061112c64b940be3"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.claim_eq_bot_of_selectorSilent", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBExecutableSelectorSilenceInduction", "793b46540495a634d566375f143ab6ab7a85b5bdd0e9bebc791a5f83e12be320"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.noFaithful_of_selectorSilent", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBExecutableSelectorSilenceInduction", "ffd3b7e3f436801bb5398c1360c86bd041c5bf8b207c9be0b83bc491232b0201"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.noFaithfulAtOrBelow_of_selectorSilent", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBExecutableSelectorSilenceInduction", "3e392d7466f9986e35656dd110a0b62bb1576961b0ec0c7b5e50569b1d51d018"],
  ["PNP.DirectWire.terminalBN6_packet_typed_realizer_hb_selector_silence_induction_contract", ["Quot.sound", "propext"], "PNP.ResidualTerminalHBExecutableSelectorSilenceInduction", "a2b84373303f881928ce4dd46bcb59d1569c3d41e63cab9360218d375ce77d90"],
]);

const RESIDUAL_TERMINAL_PACKET_SELECTOR_FAITHFULNESS_ROUTING_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.check_eq_true_iff", ["propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessRouting", "6494e15fc2f6bd3a2fcd87c2a94588ba0d9ab00a0ce58e7a140e73596ba89bac"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.firstRoute_eq_none_of_check", ["propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessRouting", "b8ec7bc6f95908e7d01d7d1f69f6cd1fc672a8d6d3725326c6f5a367eda18449"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.check_eq_false_of_firstRoute", ["propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessRouting", "b20244efafa29ed90265bc2e6afeb0bd37ff3e665b1e363765a4d460c785ba53"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFaithful_eq_true_iff", ["propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessRouting", "fbec83e97141a40af4736f1faaa334f8e48a3ead9941eceaa0fa0156a5d2d9e3"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRoute_eq_none", ["propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessRouting", "f943a8f317d63bbe7d1fe386c0ac93cfe48701fc7f41655d5cc18e3417b6f4fa"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.checkPacketSelectorRoutesClear_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessRouting", "708f48bfd74bd4da6b585cea59cbfa728dce1fac5ae627fe8487b43f7d7348d5"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.checkPacketSelectorFaithfulnessBinding_eq_true_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessRouting", "c17f7d216ed04db28b418d851aa7b5805328070e85f29c3999af8829d65ee3e6"],
  ["PNP.DirectWire.TerminalPacketSelectorHandleConclusion.existsHandle", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessRouting", "85578022b001c2bf43499f3cd1b8a655398eeca5f050f938ef76c76934233827"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsPacketSelectorHandle", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessRouting", "4ee2e6f3aff4f13fe61dc4009adc901244d1144ee33d38f46bcd59f73a107a9e"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsFaithfulHandle_of_routesClear", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessRouting", "33688388f34a9d463aa29174da608036b7433b2c2d7faf4ac5ff232be1b49ca1"],
  ["PNP.DirectWire.terminalBN6_packet_selector_faithfulness_hb_contradiction", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessRouting", "1a373a54ce5c7f264483ddaf34593ff550d2cae07c4afd19e918b27f3f7fe058"],
]);

const RESIDUAL_TERMINAL_PACKET_SELECTOR_FAITHFULNESS_TABLE_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorFaithfulness_rankOf", ["propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessTable", "088940164c00d7360b99be61fde51071bd7daef927cf505c209abc4ecbbeafdd"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorFaithfulness_hnActive", ["propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessTable", "bcc9dc25c2332e9576384f892c5a586b1c1f5612548289692cff843d782611db"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorFaithfulness_budgetActive", ["propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessTable", "cb7c8043a77f9b00a6fc0583da778a78ce649fd88a3d0bd4e110fea4b0d340b2"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorFaithfulness_claim", ["propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessTable", "3df43b9aa7cf6f84930dfda0e5d156eaf8107ac0c4cfda8ca1d97a78224ceaf8"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorFaithfulness_faithful", ["propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessTable", "0306f47499f7d56cd570b28ff422d39117337abf9563bddc0f74b1a23e3e30d0"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorFaithfulness_binding", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessTable", "2fddc41eb1fb1b8c5fd853e3806e9507886c8913a6ae40200c7da83c1dc26709"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsFaithfulHandle_of_computedTable", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessTable", "a66485e30b5d093a9a30a7a407d96f78a123a49d5f6ceea300b64d044aef1555"],
  ["PNP.DirectWire.terminalBN6_packet_computed_faithfulness_hb_contradiction", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFaithfulnessTable", "5da9aaf35e5e487d21ae0a21558aa8fcbf7815e7570f07b79b6597221af29a8d"],
]);

const RESIDUAL_TERMINAL_PACKET_SELECTOR_FIRST_ROUTE_OUTCOME_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.firstRoute_eq_none_iff_check_eq_true", ["propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteOutcome", "b625a59e34476438f381dda5275afae154e11f3c732ca4917c2c5405b3a0afb0"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.exists_firstRoute_iff_check_eq_false", ["propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteOutcome", "79da1d37a618b4c1cd3d5ba0523c2009a8180fb1f991f926a2ccff81e00c0867"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRoute_eq_none_iff", ["propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteOutcome", "4aec62315c14bee2482274c7032dce3f990a4d8fc89efc67d58f2049df72e888"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.exists_packetSelectorPayloadFirstRoute_iff", ["propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteOutcome", "85f9dcff475feec9607f7c2948e138369086c28f8ec9a1dde16f26ca968f539a"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsFaithfulOrFirstRoute", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteOutcome", "c4cd83be265db5731337023dcc23f5d6e785e62c159e00c7273cbe573d8dd32a"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsFirstRoute_of_computedTableSelectorSilence", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteOutcome", "3631f55536cc941ec835177ec51cf7b4ca58d7ecbb9f9c3a03cfee1e559c895f"],
  ["PNP.DirectWire.terminalBN6_packet_computed_faithfulness_hb_first_route", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteOutcome", "a7aa76d129b8ceb296249d5791fc3bc94e782b6eb5ee94c8e13e2e56ad7b1949"],
]);

const RESIDUAL_TERMINAL_PACKET_SELECTOR_FIRST_ROUTE_SEMANTICS_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.firstRoute_eq_some_iff_failureAt", ["propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteSemantics", "cf64142c05e65d744556593f434d6b70e8ebb265dec03116dde1e6bea8c7169f"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.failureAt_unique", ["propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteSemantics", "583184f10df9d315d4b5882fa198c97c43cffdaeecd00a49816740b1cdbfe256"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.check_eq_false_iff_exists_failureAt", ["propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteSemantics", "e3132c8d2bd9c4f4b8ae82d220aa96ad63813240587bc17e1e39bc2a08f30416"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRoute_eq_some_iff_failureAt", ["propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteSemantics", "86bc5031b8563b12ba78b3e98a49953134db1545329095fe5b99500dfe71d240"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsFirstRouteFailure_of_computedTableSelectorSilence", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteSemantics", "3950cae39552713ff72cda54ef5f88970e0b9dc179afb4e9f5c89ecb068f40e3"],
  ["PNP.DirectWire.terminalBN6_packet_computed_faithfulness_hb_first_route_failure", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketSelectorFirstRouteSemantics", "2ec660ddfa7e2d019866b1dc3a7e45b8d12893ef717610fcdf01d00cb3868967"],
]);

const RESIDUAL_TERMINAL_PACKET_DESCENT_ROUTE_REFLECTION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedDescent_valid_iff", ["propext"], "PNP.ResidualTerminalPacketDescentRouteReflection", "b4a207dc50b88188780ef5e054fd3fb205b51a1e46b82737ca7d248ccb9320f9"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedDescent_failureAt_descent_iff", ["propext"], "PNP.ResidualTerminalPacketDescentRouteReflection", "aff643834beadafd9029c2af8fc49086bcb8cf0b6a9223a2059dcb2b7b3ab5a6"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedDescent_firstRoute_eq_some_descent_iff", ["propext"], "PNP.ResidualTerminalPacketDescentRouteReflection", "b65d545a53dddcf53ebd4510dac1774ac991022456eeed86ea759f105b0884b9"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.rankDescent_of_withComputedDescent_check", ["propext"], "PNP.ResidualTerminalPacketDescentRouteReflection", "2766105081f26f84694afcf92145d4d0b10456cfcb086f8969822e5acab9a0f5"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedDescent_eq_some_iff", ["propext"], "PNP.ResidualTerminalPacketDescentRouteReflection", "b65d068dcde20d9c160cb6afd13aa217c6e5ea98f66b0d6a6e53e0cf7e66844b"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.not_rankDescent_of_computed_firstRoute_descent", ["propext"], "PNP.ResidualTerminalPacketDescentRouteReflection", "e22743c146ba75239e42aca1ffa1f5a878488d897c0062548c7b09eea5e8ae50"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorDescentFaithfulness_preserves", ["propext"], "PNP.ResidualTerminalPacketDescentRouteReflection", "d63e0357ba24057b73abb7c3cfb7c496fd0731c1f2d30d20b19cf6a6dce3a621"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsRankReflectedFirstRouteFailure_of_selectorSilence", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketDescentRouteReflection", "c7cd05bacdd75cfe4ca366abef0041c3ec75ee725bbb5a46e7da10aa6ae15435"],
  ["PNP.DirectWire.terminalBN6_packet_rank_reflected_hb_first_route_failure", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketDescentRouteReflection", "00cd9d32fea316bae09838a5d7ae952db0e0b51f604ffb51e46c567723f3bd7e"],
]);

const RESIDUAL_TERMINAL_PACKET_RANK_ROUTE_REFLECTION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedRankDescent_valid_iff", ["propext"], "PNP.ResidualTerminalPacketRankRouteReflection", "119299ae2b208b07b8a117396d7dbd4112b13ddd28787521af59f68c29911e60"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedRankDescent_failureAt_rank_iff_false", ["propext"], "PNP.ResidualTerminalPacketRankRouteReflection", "9fe0fdf15e480dea4955d44b02b28c05a8484ee54aa8ca3e74a3b661597d7ab3"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedRankDescent_firstRoute_ne_some_rank", ["propext"], "PNP.ResidualTerminalPacketRankRouteReflection", "7950b2e521fc50e68bc10195047ef1363eff44bb82b3ff219db3628d180a3316"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedRankDescent_failureAt_descent_iff", ["propext"], "PNP.ResidualTerminalPacketRankRouteReflection", "752a2cb196998e9a15f0c23c55cfd23e3b032749928b60e7b1be1bb5f8e8d36e"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedRankDescent_firstRoute_eq_some_descent_iff", ["propext"], "PNP.ResidualTerminalPacketRankRouteReflection", "bc95dd94ff38dc6c343873f0a43481c35e36940fc99d71b92502b2b80eb34f76"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.rankDescent_of_withComputedRankDescent_check", ["propext"], "PNP.ResidualTerminalPacketRankRouteReflection", "b2003264d53c0fb00d8056dbdf593e8c4f4c26e459c84517a28bbd6602e07a9a"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedRankDescent_eq_some_iff", ["propext"], "PNP.ResidualTerminalPacketRankRouteReflection", "9d6270fe2dbda1621fe94b239674d9369e61ffbe7b91806160d75d56a3db631c"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedRankDescent_firstRoute_ne_some_rank", ["propext"], "PNP.ResidualTerminalPacketRankRouteReflection", "7bea49aa95a5cb018f88a4385f7e85a5310f47bedf7d02c01ff6c32d69678620"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.not_rankDescent_of_computedRankDescent_firstRoute_descent", ["propext"], "PNP.ResidualTerminalPacketRankRouteReflection", "b2820595f2d30ac7213eee11258b3433acd069629c6fccb2c3fe9511ddac6aed"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorRankDescentFaithfulness_preserves", ["propext"], "PNP.ResidualTerminalPacketRankRouteReflection", "ee4c15e354aac6f6594230f3e763e438c61460d586c92c9ed718a365c5a48ff0"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsRankTagReflectedFirstRouteFailure_of_selectorSilence", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketRankRouteReflection", "45dfb3c3f9697134fd1a71609681f4f0f16a12d316c0d7a8237f2ea33d4f82c5"],
  ["PNP.DirectWire.terminalBN6_packet_rank_tag_reflected_hb_first_route_failure", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketRankRouteReflection", "d52207fc8e5eb2ec8dee120d435937b9a2d49d37d6c2dab252d327b6ad399bdf"],
]);

const RESIDUAL_TERMINAL_PACKET_EXACT_ROUTE_REFLECTION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedExactRouteRankDescent_valid_iff", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "025decf3f8024bc6b0290b8dbb7a0566da1ad2ca4f1f07eaa698ba60ec7a46b5"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedExactRouteRankDescent_failureAt_rank_iff_false", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "2e75d5c393be2bfc6d91049064e12cce054eae1f61fccf78dd43e1bd9e449cf5"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedExactRouteRankDescent_failureAt_exactRoute_iff_false", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "22111865261f70c9eb1c192c7710231c7c874181691db56b8af2828ef7e3de0c"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedExactRouteRankDescent_firstRoute_ne_some_rank", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "e419055dd0b4f83f191b5e02609363011a25c45208fc09096ba2815db5087d75"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedExactRouteRankDescent_firstRoute_ne_some_exactRoute", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "7afcee7e1a14107d74f2b2cb71f37072d2e4fb42b46421721935a64d7598c1af"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedExactRouteRankDescent_failureAt_descent_iff", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "19a5ddd13d54c8906fac04b4b90cd151e25b1f9630aa6aed94f83c042cc60ace"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedExactRouteRankDescent_firstRoute_eq_some_descent_iff", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "d9e2aab8f40148333dec6e0b93b642fcf87924471bc840f6e94cb41dfc3fffe6"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.rankDescent_of_withComputedExactRouteRankDescent_check", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "3bcd32fbf2d5cd8f5eb4a75320b1a3adbbabf18fbd9af55061730c21fb1dafd0"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorCanonicalSourceRoute", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "1059f12b1b7ea3fc95d8186e9cd5353e17f26bc20ba3324f961be9421d4ca348"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedExactRouteRankDescent_eq_some_iff", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "2e41b15294c69dfc7d91a881617f6314a3350d173a97666f24e25084807f565c"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedExactRouteRankDescent_firstRoute_ne_some_rank", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "1283f8a0958b7785f5eb3d30c94c0e93843eac9f74e60372d88e850ef5384c6a"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedExactRouteRankDescent_firstRoute_ne_some_exactRoute", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "0495273935847c75145aad4134ed4f4d7d4a67e28cf5e23af0a470f8491cf210"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.not_rankDescent_of_computedExactRouteRankDescent_firstRoute_descent", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "7766ded83fc3adc67442ed3a0643e74f00abce86a6a4f6768f25bef72db306fa"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorExactRouteRankDescentFaithfulness_preserves", ["propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "57538134a5b952422a030e182426d3f93bb6919f4c0ffdaddb8e3a8c13689e12"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsExactRouteReflectedFirstRouteFailure_of_selectorSilence", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "8816af58cb277525aa761f6ab86f6fc0fca29d468ad04be8b6d1df04b454c10d"],
  ["PNP.DirectWire.terminalBN6_packet_exact_route_reflected_hb_first_route_failure", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketExactRouteReflection", "927033b5faf21b78f6f33e8cd8544957243bf7037b2e08ab192905cbdbec7078"],
]);

const RESIDUAL_TERMINAL_PACKET_CHARGE_ROUTE_REFLECTION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedChargeExactRouteRankDescent_valid_iff", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "daf0d6573ade1ddea7679d3558ad39a494ea25fe2a2b9e5da975baedc79472fe"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedChargeExactRouteRankDescent_failureAt_charge_iff_false", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "f63b359ec21dfb294c9b8a4b3e50ad4489f7d6a02a5c398226d6601adcda7b07"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedChargeExactRouteRankDescent_failureAt_rank_iff_false", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "3c5ea508338d4d22c97fa66c75fac014f1fd9b71bc473e565f45d90d07725146"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedChargeExactRouteRankDescent_failureAt_exactRoute_iff_false", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "8be07899a011436a18bcf58a94a26751b7d2a5fa266b7640d7304ccbe90ab216"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedChargeExactRouteRankDescent_firstRoute_ne_some_charge", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "fa0deb1607ccf04e34445502d5f96f0e1e30a8b0fc191ada33025c08773d4499"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedChargeExactRouteRankDescent_firstRoute_ne_some_rank", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "1bc4f5d155628edc092cbd8a6ce89c765d927ff67494aee76e4244e14066e0bc"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedChargeExactRouteRankDescent_firstRoute_ne_some_exactRoute", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "ebb2204741f8838fa9a04f3dea8a1aa7cc06edd655f2e3399f6e5377fe52be27"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedChargeExactRouteRankDescent_failureAt_descent_iff", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "21e40fe99e90de6413d598529533c4d37f642f1b62bedf4ca616ce61b37b9ec4"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedChargeExactRouteRankDescent_firstRoute_eq_some_descent_iff", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "245ba86a7d5e32c9c6bb24d635937aa43a1bcd26398c4836fecb4204a1caac9d"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.rankDescent_of_withComputedChargeExactRouteRankDescent_check", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "46adeefc226fe676fea6bcab66d90646bfe1ba667d4ae840c5b5cc0fadb808ef"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorCanonicalPositiveCharge", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "38b4c8c30c513b26c545625477ac04e2d4ffd03c2dd72b09c1e1fc27046cc4a9"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedChargeExactRouteRankDescent_eq_some_iff", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "33ef42832d16483c7d8901865e1f51bcb004b028018225c5d0fb4fcd58a01499"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedChargeExactRouteRankDescent_firstRoute_ne_some_charge", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "261338ddeb1a75724c114f0dfb290f7f87f7c3a7b1a50b5cb9a44c1773ede51b"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedChargeExactRouteRankDescent_firstRoute_ne_some_rank", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "9a5e68fd48c12cc6d8bc4a629cd87c79fa1871c6978f608666515a5f3b3987d5"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedChargeExactRouteRankDescent_firstRoute_ne_some_exactRoute", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "98b6632e7f96a32561350dfa31863f46bccf463d6d739b09c1d6639c292016bd"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.not_rankDescent_of_computedChargeExactRouteRankDescent_firstRoute_descent", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "2197350be3bb30db0a1f92ddc2a2808fac12149377486fdeceb3a33fe2e52d9c"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorChargeExactRouteRankDescentFaithfulness_preserves", ["propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "a6069e89648da57cfa94a3b98a75ba8110214681c8c8228821dcb8419c80b3e1"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsChargeReflectedFirstRouteFailure_of_selectorSilence", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "c0e7de8081000b99ceadbc337e083add781109060a621c40c9207a89f5c6a040"],
  ["PNP.DirectWire.terminalBN6_packet_charge_reflected_hb_first_route_failure", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketChargeRouteReflection", "5705f2031ba7d3ac9bd60b0da8c12b41e400aabb775768344157ad7df2b74dc6"],
]);

const RESIDUAL_TERMINAL_PACKET_COLOUR_ROUTE_REFLECTION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedColourChargeExactRouteRankDescent_valid_iff",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","13cf60a9b59211b3d9016ee029573acfa7467dcda53a87e09c4af6972bfca699"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedColourChargeExactRouteRankDescent_failureAt_colour_iff",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","fdaeb023ecb7e24a21f6e0e860db14f81a4faff24b657609f866df957d226e84"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedColourChargeExactRouteRankDescent_failureAt_charge_iff_false",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","8f83961e142179b83e7b1e5eaaed6e87902d768de74891e534454417c647c6a3"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedColourChargeExactRouteRankDescent_failureAt_rank_iff_false",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","cf89f76816274f4cdb889d3b0ac4cf2273834f51c4b7361cafc6b904b8254aea"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedColourChargeExactRouteRankDescent_failureAt_exactRoute_iff_false",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","bd31b87708d85c1578269d4d3f62f4ad64dd2528effe0e91e8325abcdd738c64"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedColourChargeExactRouteRankDescent_firstRoute_ne_some_colour",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","9195c6af2d2f5c8bad9809705f0bb0b9a8bf2c5ed0df197f75fbf903e6d4078b"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedColourChargeExactRouteRankDescent_firstRoute_ne_some_charge",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","027489d455bd433b3b89d3c18035e353673ff84644fa7af9a0a63ebe924b7257"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedColourChargeExactRouteRankDescent_firstRoute_ne_some_rank",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","7406d63ed77542790d792d25df56dc2ab0014ba17a7c1863a33e620a36d186a1"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedColourChargeExactRouteRankDescent_firstRoute_ne_some_exactRoute",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","4d86dff39bbfe8dc952ad72e47b7b116ce7adeff55d581e2a6bdc50215af5ef2"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedColourChargeExactRouteRankDescent_failureAt_descent_iff",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","e9b973369fc100336963a092a46f0db73b956b327bb872f6b85758a6e762dadf"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.withComputedColourChargeExactRouteRankDescent_firstRoute_eq_some_descent_iff",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","85914d947e1896ec0f32f80e5a4e283401a0672ffe9d73fc94bf7a8debfc8c6e"],
  ["PNP.DirectWire.TerminalPacketSelectorFaithfulnessPayload.rankDescent_of_withComputedColourChargeExactRouteRankDescent_check",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","877f74124eed4b20fb262519aa2772031eabf9560b53426fbcc8d06a92f694ed"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorCanonicalColourEligibility",["Quot.sound","propext"],"PNP.ResidualTerminalPacketColourRouteReflection","6f421fd3f25c39d38dbf14406abd12a0fdc6fb38149d22fd7f29d8306e94f3ee"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedColourChargeExactRouteRankDescent_eq_some_iff",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","05f397f1ab24b451a6eb87dce58f2b186f4199ff1a3c171bf8283ddcf4ba06cb"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedColourChargeExactRouteRankDescent_firstRoute_ne_some_colour",["Quot.sound","propext"],"PNP.ResidualTerminalPacketColourRouteReflection","a1d6785a715bbcdac10abacf2cb5e0bff74993469f9c3f7a9276a5fbe7361f88"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedColourChargeExactRouteRankDescent_firstRoute_ne_some_charge",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","ffd8fc03864155f547f71fec0c208c3062e041f6c7b8f3896a842e5d60b38d09"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedColourChargeExactRouteRankDescent_firstRoute_ne_some_rank",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","244243e90ef4ea78f1f24e5b50807dc251098f775cccc5721a748aa16779b319"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedColourChargeExactRouteRankDescent_firstRoute_ne_some_exactRoute",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","f20a9c4076457f211e841301ab4d1d880be939dc6f88d46bb83851c29346645d"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.not_rankDescent_of_computedColourChargeExactRouteRankDescent_firstRoute_descent",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","6cc93d3fc82e20b552ea17ec5b8eceef3619979b5b48df11966624bff9e4c781"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorColourChargeExactRouteRankDescentFaithfulness_preserves",["propext"],"PNP.ResidualTerminalPacketColourRouteReflection","e36ad892e3f0784a8e4712b103ffbe871cb10aad4e2b4dd933190ccf12771106"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsColourReflectedFirstRouteFailure_of_selectorSilence",["Quot.sound","propext"],"PNP.ResidualTerminalPacketColourRouteReflection","d3548531645b9a8c557c7c8e19960eb58ee1c178e79bf5f36d93eb2bcede891a"],
  ["PNP.DirectWire.terminalBN6_packet_colour_reflected_hb_first_route_failure",["Quot.sound","propext"],"PNP.ResidualTerminalPacketColourRouteReflection","822b586ce4e908fb41fe4039ba7c96ae0d98dd1af685c5398856d7a8aed52983"],
]);

const RESIDUAL_TERMINAL_PACKET_FRONTIER_ROUTE_REFLECTION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorTypedFrontierPayload.frontierCheck_eq_true_iff", ["propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "778ea1b8492b6885dac7e4d0ca0282eae466af9607798e0dfb8014803d5d253f"],
  ["PNP.DirectWire.TerminalPacketSelectorTypedFrontierPayload.frontierCheck_eq_false_iff", ["propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "20487643be537fefe2c5822181b27af1bc894dddee437473b192c50ca1c9c89b"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedTypedFrontierColourChargeExactRouteRankDescent_fields", ["propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "4bf67af558d3c292ad47e0cf546fa458a44680ae883e136d36430eb2bd5d4871"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedTypedFrontierColourChargeExactRouteRankDescent_valid_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "5efa1169b2da66d6c71055b4c92088d73d56642a3cbc50839f0a20731b281a37"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedTypedFrontierColourChargeExactRouteRankDescent_failureAt_colour_iff_false", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "e84fc2617ce89d1297340d85501eb7b5bfa874172dda0c0957d4a32c976c9c57"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedTypedFrontierColourChargeExactRouteRankDescent_failureAt_frontier_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "1131ed511be88686def06bf36ab3043642a5cdfb06a6be9ec2d596c3a55c942d"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedTypedFrontierColourChargeExactRouteRankDescent_failureAt_charge_iff_false", ["propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "b2b050ecf18a038df1939976f3c48b7cdb030dc6ac3fce8d9565eebb86921aa7"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedTypedFrontierColourChargeExactRouteRankDescent_failureAt_rank_iff_false", ["propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "4eb742d4098486d5bd894029c301cefbcdebe1011075b27a58a0c7b1d2f38464"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedTypedFrontierColourChargeExactRouteRankDescent_failureAt_exactRoute_iff_false", ["propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "d1e8ce294444a36e042f0c620ae1dd0f7729d0ef8056dbc9a1c4cab16fa0e776"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedTypedFrontierColourChargeExactRouteRankDescent_failureAt_descent_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "17819b6773daf5687110cb29765c1f24f6840ffa788b7cb2b46396619595de04"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedTypedFrontierColourChargeExactRouteRankDescent_eq_some_iff", ["propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "76cbaf3b8df9487eb2424ac0ce356f040c310a7581f4f29cd4ca60e145b96d2a"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedTypedFrontierColourChargeExactRouteRankDescent_eq_some_frontier_iff", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "44c1825d8793af3ef40c4f504202ddb3d009d5b5ce4763b2e8c8ed83b66c4794"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedTypedFrontierColourChargeExactRouteRankDescent_ne_some_frontier_of_eq", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "8e22542fbffe63b6288e52405e6602cea825a3d936110505295485778ba724bf"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedTypedFrontierColourChargeExactRouteRankDescent_firstRoute_ne_some_colour", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "a3a13ef926b10d17c1575c94a83ddd29a41a46114a20dae4f95a2e0794fcb22f"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedTypedFrontierColourChargeExactRouteRankDescent_firstRoute_ne_some_charge", ["propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "e40891ae9a30caaca224f4714f373e95e2dae5b27ee7d056d03bf37c4cfc1b69"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedTypedFrontierColourChargeExactRouteRankDescent_firstRoute_ne_some_rank", ["propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "8c2327a5832c35bc3ee801b363258c0c785ca42e1f6bdb9e31e38b84730671b8"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedTypedFrontierColourChargeExactRouteRankDescent_firstRoute_ne_some_exactRoute", ["propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "3b6139366cf25599862ed7d56bd0944a3b860a07b86515e760acde61fea31e95"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.not_rankDescent_of_computedTypedFrontierColourChargeExactRouteRankDescent_firstRoute_descent", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "13cadc4e2f39f3348326668ed7e285f92966d77e27dfedd982c7bd04e191fb8c"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.rankDescent_of_packetSelectorPayloadFaithfulWithComputedTypedFrontierColourChargeExactRouteRankDescent", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "0d6aa22e4fd829d8b61aa50aee2584448904361e2a5a7a595d8207c72c4aa22d"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorTypedFrontierColourChargeExactRouteRankDescentFaithfulness_preserves", ["propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "2e47736ef79c72e16247210bad135d2073217694a632a34ff2131170aa1d79db"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorTypedFrontierColourChargeExactRouteRankDescentFaithfulness_faithful", ["propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "4f0a5780d3477a3312024459db150ecd0184b5ea82891d271756881ab68476f8"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsTypedFrontierReflectedFirstRouteFailure_of_selectorSilence", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "ce83e296a5ec8736a419f534a437090aa45fbba82143fed4c1be6766f45925e1"],
  ["PNP.DirectWire.terminalBN6_packet_typed_frontier_reflected_hb_first_route_failure", ["Quot.sound", "propext"], "PNP.ResidualTerminalPacketFrontierRouteReflection", "24de27f2195e119fdfc8ae82b5e8ab7a4f6ddc687199b416dbf4427eb42d693a"],
]);

const RESIDUAL_TERMINAL_PACKET_BN5_OBLIGATION_ROUTE_REFLECTION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorBN5ObligationPayload.frontierCheck_eq_true_iff", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "c15e40462a71f49e0b3b7386d071f5f43157d01415e0d4c357be390b28226e97"],
  ["PNP.DirectWire.TerminalPacketSelectorBN5ObligationPayload.frontierCheck_eq_false_iff", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "b7a986a303041ad8463205822c0ae291bdd5f22c673b2c33ad154ceafd7f7446"],
  ["PNP.DirectWire.TerminalPacketSelectorBN5ObligationPayload.obligationCheck_eq_true_iff", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "cdfd592c576587e16afc924368d69aec3b6a6d73f6bcc1d913994c4fed189498"],
  ["PNP.DirectWire.TerminalPacketSelectorBN5ObligationPayload.obligationCheck_eq_false_iff", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "c3ddee76c4e34db83bed18a82c806be45cb71eb427513bbcf2a93d197c4060b2"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationRoutes_fields", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "3cf0ef9de602f06ec6514c52280b75dfea972045f2892d9f3f266ba40bf5d785"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationRoutes_valid_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "93ee764911c88a9935d787492ec040ce7c5b8383071fe9fc42ee00f88378c354"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationRoutes_failureAt_colour_iff_false", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "a7e19015138e92d13a19a39bb0c5b564d4bd07a02cced504e050adb7d0777e83"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationRoutes_failureAt_frontier_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "bd9def126819e195d6e24d25113f0fedf7f707c58f8ee781998613a797f2e972"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationRoutes_failureAt_charge_iff_false", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "7c8b6330d74bdb59e79bee27ffce16e476d8e9ccef36869c4a7b023e4c84783e"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationRoutes_failureAt_obligation_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "76067f723f122edc2c205367daff7880ac92fcc351990ba84ac4e38bc83023a6"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationRoutes_failureAt_rank_iff_false", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "4db484271b183bc3e606efe8ebf9b7d7ee2b971b322d7df128434a268852e474"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationRoutes_failureAt_exactRoute_iff_false", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "167366acde0cfe8eb30231bae5ef2677ca445eba33db03dfea1e060035fc9fad"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationRoutes_failureAt_descent_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "71537a39e1d3f29b8bb87c8cb0a1f3bacc84fc4d11a958ffd4aceb59156bac3a"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationRoutes_eq_some_iff", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "e6625fb51d053e7ec7c6a4f3e46b19b2e3657a6d93d17a8c4e845f9cfddf1247"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationRoutes_eq_some_frontier_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "2bd7f6a34157268c55c02c0f5e9f1e8bf73a3d86787a0efb9ff7a2b3fbedf354"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationRoutes_eq_some_obligation_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "8163a944b0bcbf30f7eabc481c8879bbe21f995def76be0c6b34dde672305fc0"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationRoutes_firstRoute_ne_some_colour", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "274fcf129c6dd75232871a33696b93e50b2680d26911d12363e62eaf03154fe5"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationRoutes_firstRoute_ne_some_charge", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "704083e793cb3812c89931c84df20e341ef9c5335d6e7f2ec6357cc676f0d968"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationRoutes_firstRoute_ne_some_rank", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "777298de91af5c0b07e1003a9933aa6501d1709c270ea27da4ecf63f7c80008d"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationRoutes_firstRoute_ne_some_exactRoute", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "09d13af7f8a39023769591def58dfb65010ed471b62160f2e000d6a5ef050d19"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.not_rankDescent_of_computedBN5FrontierObligationRoutes_firstRoute_descent", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "1b8d4e18d60a3aa8a4f1720fb05425e1a08327c39b34cb189700af984042ecf0"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.rankDescent_of_packetSelectorPayloadFaithfulWithComputedBN5FrontierObligationRoutes", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "afae06baa988fb7e1f4354fa560b8f8e0dbba222e882bcc7fb37044c464357bb"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorBN5FrontierObligationFaithfulness_preserves", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "174ea11c74b87b136c34b1cbe831a9ebe22b54bc2e94dce595bac776bdb74093"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorBN5FrontierObligationFaithfulness_faithful", ["propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "c52edbe5793a2e738e6c6296a8088bcbedbbcb72c6b86bd50ba675e78099279f"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsBN5FrontierObligationReflectedFirstRouteFailure_of_selectorSilence", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "1e87cdb6552b35647c9e8a118c6e28e6a91ec94af77df7169867990152d2772b"],
  ["PNP.DirectWire.terminalBN6_packet_bn5_frontier_obligation_reflected_hb_first_route_failure", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN5ObligationRouteReflection", "71f310f4091f8d031041e67cbbe865a6d629dc8434fcefbc11d2cac15bf9c07b"],
]);
const RESIDUAL_TERMINAL_PACKET_BN4_ACTIVATION_ROUTE_REFLECTION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorBN5ObligationPayload.activationCheck_eq_true_iff", ["propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "867dc60cc56156ea58a390936d859c4a7e78e566e08a0e4f6b733a1dd0d98b3e"],
  ["PNP.DirectWire.TerminalPacketSelectorBN5ObligationPayload.activationCheck_eq_false_iff", ["propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "33227f5d456b764becbbd03f736dce6682d9fa5fde8af71acf2d727114d2bd59"],
  ["PNP.DirectWire.TerminalPacketSelectorBN5ObligationPayload.activationCheck_eq_true_iff_activation", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "520c930b8ecf4c0968b08c9a5ba290328cadd3873d97dd6fd91946f30b8daed0"],
  ["PNP.DirectWire.TerminalPacketSelectorBN5ObligationPayload.activationCheck_eq_false_iff_not_activation", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "36dd2bdc803bca6989ae8066d58dd769bc93e66a90929854caf24d018f2dd347"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationRoutes_fields", ["propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "a0c913b65e2ad91ebc2cc88433ccdb43b34d0a5f50aa7e658b7653d65d28069c"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationRoutes_valid_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "82bc09367b318712dff44391f52f1cf241e156f90d78071bde60d5b7a2b85bb2"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationRoutes_failureAt_colour_iff_false", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "145bc42a327b3cf875ae8ff9b0f5c3fba186679ded86dee95f0a830ffe9139cf"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationRoutes_failureAt_frontier_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "15bc8682283535971f9d0fd636432944d0083d1daacbead3f11e4d210449ce88"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationRoutes_failureAt_charge_iff_false", ["propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "71ca7ce5fe41dba1dd4eace717f98d373dd10f22d83ea4ed3329c3f081db3e7d"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationRoutes_failureAt_obligation_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "b7750f0fba4cd161bf61e0f1119fd0d663372458e2eeb074eba1a3193a13a7d3"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationRoutes_failureAt_activation_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "0831b041c48b5756d237702df66de658680ea61f69bc8c8d06c5d772e6b9403e"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationRoutes_failureAt_rank_iff_false", ["propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "4e791b0060da3278263ce7a3467ecf4db8fe74e8385aa76fc52d3c51d9677623"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationRoutes_failureAt_exactRoute_iff_false", ["propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "42bbb31c57dffa7cb42cace8ae48a7cf891a497a5e277ab19f4b1fe3d25fa990"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationRoutes_failureAt_descent_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "7360662ae21ed821756b6698b0d60710b33ac5d96a3103735922a7d10b23e179"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationRoutes_eq_some_iff", ["propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "018e603af22e51a13ffd8868bbda1d2a05ee8c8a8c46c80ac916f556bb964dcd"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationRoutes_eq_some_frontier_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "2d0f464bbd7d548790d9dc9b5ea36a0c54d97580166d75774b23db97319870f0"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationRoutes_eq_some_obligation_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "19039f985e21b04eac7dc9e73d7cfbf3c149ef0505e1c0c3ab2d35bbecb18036"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationRoutes_eq_some_activation_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "4def1541b1476e78ffdca27f5235e0e73705fc714263dd3b798ced5a81d45a24"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationActivationRoutes_firstRoute_ne_some_colour", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "df511f38d4027c7eb2145f67c1b864cb69795a1b04fa03f9069eaa423896e672"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationActivationRoutes_firstRoute_ne_some_charge", ["propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "de7dd10107a30def704279109aa08e1c8643b32f24481ec4503f86b11bd3e0c3"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationActivationRoutes_firstRoute_ne_some_rank", ["propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "cc269256b584d4404512211d141af4fa104de4f3f2dfd186af3d896c17750851"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationActivationRoutes_firstRoute_ne_some_exactRoute", ["propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "8b0d888392be3cbf603df918e3f793ece534ca009eb8efa8d3c71c10176010b4"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.not_rankDescent_of_computedBN5FrontierObligationActivationRoutes_firstRoute_descent", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "ac4c2916e58371fb305dc3e45156a76f5bd0c614f5cfba012f4df1e40729ba74"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.rankDescent_of_packetSelectorPayloadFaithfulWithComputedBN5FrontierObligationActivationRoutes", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "e58e47c9ba5e34aeefb3022ec0e85675eee95d05bca6562ae23372929c85a863"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorBN5FrontierObligationActivationFaithfulness_preserves", ["propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "7aff465daa6e5bf5070e20c83b4ad29a65663c09cb7a7342ba97597421decad8"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorBN5FrontierObligationActivationFaithfulness_faithful", ["propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "7752f2b774b0c7f9aae13bfee00180ba3e0a0dec7cb75ae6f186e04736119e12"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsBN4ActivationReflectedFirstRouteFailure_of_selectorSilence", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "f51b8b54f0154b14891ae93c2e11b1b8f869a18961d7a34cd10d0c9eb124d8b7"],
  ["PNP.DirectWire.terminalBN6_packet_bn4_activation_reflected_hb_first_route_failure", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketBN4ActivationRouteReflection", "9ba3eede1deb9433671ebf085abc57e786c9876a347d2b72be89a6012efd742a"],
]);
const RESIDUAL_TERMINAL_PACKET_DIRECTION_ROUTE_REFLECTION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorBN5DirectionPayload.directionCheck_eq_true_iff", ["propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "f49cf6910e0aaf04ec33049ad37ab94acba481413774c3d69b80a3644d80d44a"],
  ["PNP.DirectWire.TerminalPacketSelectorBN5DirectionPayload.directionCheck_eq_false_iff", ["propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "8dd892b0141ff4a91d81143dbe5b8679fc5d6aee592478efc1cec56eb9448e0d"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionRoutes_fields", ["propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "e40b05da0c72ac40d6333eb507588acb308a3cc459b0d90cc77984eb449c0ae6"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionRoutes_valid_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "bc0247d08f8e0a9899596a94040a802932c3727a5cbeb1e9fb607a494c87a9bb"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionRoutes_failureAt_colour_iff_false", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "47d880e50a7db5d783cab65a718525229cfd818eb4cbd0a54899e816fc86a165"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionRoutes_failureAt_frontier_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "8a534eb783da9f2681b3a2d75a4355318e66f55edf0504c8a9f463eab2e39dea"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionRoutes_failureAt_charge_iff_false", ["propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "552620333e89647dd22095ae23d0e26cdc1784e5c862022c897e95ddb2e6f8e8"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionRoutes_failureAt_obligation_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "d13490040b20da8b210dec81bd35ff9288e521aaa99bf66991d7b318847655eb"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionRoutes_failureAt_activation_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "9d8452d92b24b4ad3649cf537fd94dc21744886450ca4a8d07d5d1d8181f5373"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionRoutes_failureAt_direction_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "59ba56375d90890e2856f43ec2b8869f1180daac40012d15dc588da44caac4ea"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionRoutes_failureAt_rank_iff_false", ["propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "56f3536d3ae76f2734ba2639e93c76ad5f33760d54488b7afa9539796b07f9d6"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionRoutes_failureAt_exactRoute_iff_false", ["propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "1c9ac95a9da9a6488cb5a33c8cbc4c6fe554ee33fc60e8a68f31de8b1b22be9f"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionRoutes_failureAt_descent_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "2e16d6b51170d487ded1548df90e9b6eca561577d76174ff98eac85502ae6d54"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationDirectionRoutes_eq_some_iff", ["propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "366a0af6022be8f6f598ddc4095ef5f710f9990db5296efb274a03b952624e85"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationDirectionRoutes_eq_some_frontier_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "00dc8f0cc70e3e7aadce560810ae14a11f5d6ef4dd1d11144845533f71642a17"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationDirectionRoutes_eq_some_obligation_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "7c3c1e6bfd92c7f9663a0406111cef4fe499dfbd4dd2d4add58717febc82b4cd"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationDirectionRoutes_eq_some_activation_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "c2edbea385611c22241eaa72a02bfc92bf108b0f16c5dc51bd0ab73f207ee639"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationDirectionRoutes_eq_some_direction_iff", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "21cc8b86105452aab296a6b05bfde87d9a8f2471f9761b3755a50477ce63b730"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationActivationDirectionRoutes_firstRoute_ne_some_colour", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "2db255a0aa3ec4c4f1fe823eab202f9aad618e66c9a56e7d97b556d1a389fa88"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationActivationDirectionRoutes_firstRoute_ne_some_charge", ["propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "7474187b3657391e3e01cfe3bec1b3ed035396dfd6bca58f27418ac68df7bb6e"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationActivationDirectionRoutes_firstRoute_ne_some_rank", ["propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "472362ae24f6bc5b914d34916baa92a8cfe8ac86f945c403969efdff71a3ec05"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationActivationDirectionRoutes_firstRoute_ne_some_exactRoute", ["propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "c268e5894ea4ac0a9d49d7ad44dd26b4db902aa9b68f51a501a68354616847e0"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.not_rankDescent_of_computedBN5FrontierObligationActivationDirectionRoutes_firstRoute_descent", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "26a9bd70dda23654723e3d2caca3e30b15e57cd964e8c023359919e6f87640f2"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.rankDescent_of_packetSelectorPayloadFaithfulWithComputedBN5FrontierObligationActivationDirectionRoutes", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "02458233d9f014e44f139b47aa042721f8ba7e08595ba4d001cc328c04abe18e"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorBN5FrontierObligationActivationDirectionFaithfulness_preserves", ["propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "fdbcfa9db3090e7e23949ec5207b2c43cbedd2e869dab6bf1a7fb1456e56a7ef"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorBN5FrontierObligationActivationDirectionFaithfulness_faithful", ["propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "f2f000e8eb7cc1abbc29edd2d4f5287176e9af41b24566d146794ba5f799f8ac"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsDirectionReflectedFirstRouteFailure_of_selectorSilence", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "a2c906af5ab76293de2d408e951611969e18b622f05abd44cf151a5d604fa592"],
  ["PNP.DirectWire.terminalBN6_packet_direction_reflected_hb_first_route_failure", ["Quot.sound","propext"], "PNP.ResidualTerminalPacketDirectionRouteReflection", "27e2d0d594bdf7487a5cb18a0770ccf94d6943c95864ed21b7dee8c2e28c90c4"],
]);
const RESIDUAL_TERMINAL_PACKET_BUDGET_ROUTE_REFLECTION_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketSelectorBN5BudgetPayload.budgetCheck_eq_true_iff",["propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","9a5b6cd37382fdf78def0c24495475d62a38e9556e4e3a3dfea079e7938a6784"],
  ["PNP.DirectWire.TerminalPacketSelectorBN5BudgetPayload.budgetCheck_eq_false_iff",["propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","9adcd092ef11e13a0edc7e8881e5239eda948c7d77f2a9a66fe74ae124ebb9d0"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_fields",["propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","8a670bc055f97b138940434557b36763e4a1b0e76c0c14713680cbc4e52cbc73"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_valid_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","fc1a51608f81086617748ed2a37198581c28a37f3824d6fd9494c55f3c63af60"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_failureAt_colour_iff_false",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","0bd919fb8871d0af742536e113b672d90daa458f6caa48c2e0b9e76c31590ecd"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_failureAt_frontier_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","2b0abba123142f7486337e2d235437b390130e11c591ea6221abbe1f1687ef09"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_failureAt_charge_iff_false",["propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","25728062451ed71708c4173f7dda5f4ccdb88c46a359e538eaf5358a828134e2"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_failureAt_obligation_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","631812753250a4545cec2a891fbe32ce1e4c638fee744367ef1ee76248f0e8a7"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_failureAt_activation_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","11851156736436017ea5ee1096c72616de9c7fe650613e1cefc414e1d40eb924"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_failureAt_direction_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","beeaef4790706024b44dededb1d0134b77b7986bdd2d59a000a1ffb7ab960311"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_failureAt_budget_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","2c2169095336f7d189182db0eeabe61a7055090a9c26a2ef91e2255245b0a930"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_failureAt_rank_iff_false",["propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","53f03964d19cfbec8fb60ef029f70d297aeeb8417f74b182298e60677bc98868"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_failureAt_exactRoute_iff_false",["propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","557c8d1ff3f7df03bf7bb0d3dc1e5ccc9018d7a804def06bf9ccd6c73e13a0db"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_failureAt_descent_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","74a945602db46582c40d07447b8f979e7bdfb6a2b1da109a6215309de6fe8b08"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_eq_some_iff",["propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","4485ffa81de1cc5dfdfa6c666dfb3d3d93137ccddb22e240bc90525dad17094b"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_eq_some_frontier_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","556d65c936d144c54eebb406b1f5ceb69247c1089797b988e49896e7f954ab2c"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_eq_some_obligation_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","92f893d6190691015be6811c4cd8c7562e4a62f18a6911e472bdff1b5d59f759"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_eq_some_activation_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","2e7cf474f62070d82e9b2f0aed485705d387b935af53cfec4533e9be8178faf2"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_eq_some_direction_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","6ed4712863a070746f8b8cfe69b5767bcf3d28f5eb4b1dd05b8e283688fea3ce"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.packetSelectorPayloadFirstRouteWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes_eq_some_budget_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","2837158472f4d80ce817f51f40b0e20cdba44a273e24ffd30f57f8401177adb2"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationActivationDirectionBudgetRoutes_firstRoute_ne_some_colour",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","8cbae6339b9d5a8e9fd130b3568ee3bbc8f29d733329fec5b714f1477dba833f"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationActivationDirectionBudgetRoutes_firstRoute_ne_some_charge",["propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","b82aebceefa7508c0a92e90e4a04b5eb836b519b0db5c67322c9c4e18404809e"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationActivationDirectionBudgetRoutes_firstRoute_ne_some_rank",["propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","49e6103b75a8e0881fb83b8f4d6eb99589190413e4a02cafadca99f985a406fe"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.computedBN5FrontierObligationActivationDirectionBudgetRoutes_firstRoute_ne_some_exactRoute",["propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","b8b119cab9837647e92c67facbd9a691523a8b2b570f1a403eacff4d1d9e5754"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.not_rankDescent_of_computedBN5FrontierObligationActivationDirectionBudgetRoutes_firstRoute_descent",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","d3098e22029dc763a564c005fd5d8b03cf5eb2a7895fbf867c050e8f71bce8e2"],
  ["PNP.DirectWire.TerminalBN6GroupedFamily.rankDescent_of_packetSelectorPayloadFaithfulWithComputedBN5FrontierObligationActivationDirectionBudgetRoutes",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","2afc86acce8f98627175a418d30ca8da56a5d293f913a795596a6bcc3567793e"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorBN5FrontierObligationActivationDirectionBudgetFaithfulness_preserves",["propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","32a5bdd21561b3bea26b048cee03e1f195aba4dc6e9d8cd6c088676a431742d0"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.withComputedPacketSelectorBN5FrontierObligationActivationDirectionBudgetFaithfulness_faithful",["propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","bbcb4952562e8067944b54769bad107ca35ebb8b5d0e97df86484ac6a6c087d3"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsBudgetReflectedFirstRouteFailure_of_selectorSilence",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","7c7dc39f0076467549cfc0c8310dfc7f3cbc62ce0f27f18228b5306ca829d1cb"],
  ["PNP.DirectWire.terminalBN6_packet_budget_reflected_hb_first_route_failure",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetRouteReflection","ed64670e66b710acf2b80ab0f56d08219af5f4b66e17c847cdfae8cb0b39a3d7"],
]);
const RESIDUAL_TERMINAL_PACKET_BUDGET_HB_ACTIVITY_BINDING_DECLARATIONS = Object.freeze([
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.checkPacketBudgetHBActivityBinding_eq_true_iff",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetHBActivityBinding","6a6cd87546f8f2aef1a9ed997f529b7f02c78de3308a5af055ecd210f6e012eb"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.packetBudget_eq_of_checkedHBActivityBinding",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetHBActivityBinding","a85109f07cd409aadd8aa5252a34a88f45ff1b6e8077623d4e7a51d232db2eda"],
  ["PNP.DirectWire.TerminalPacketTypedRealizerTable.packetSelectorBudgetFirstRoute_ne_of_checkedHBActivityBinding",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetHBActivityBinding","838fbf43402969bcbe4142fce596591d4451d0396f049a114193d166237963bd"],
  ["PNP.DirectWire.TerminalBN6PacketConclusion.existsBudgetHBBoundFirstRouteFailure_of_selectorSilence",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetHBActivityBinding","c549af4b703d02dc667c55adba2f27ef6c987288a6cd2332f1674e3ebc3ea8fa"],
  ["PNP.DirectWire.terminalBN6_packet_budget_hb_activity_bound_first_route_failure",["Quot.sound","propext"],"PNP.ResidualTerminalPacketBudgetHBActivityBinding","3505d0a82f82f6b4e8e524dc5f0079a6aee3629d2175e66116ca11f43c25fc14"],
]);
const LOCKED_NAND_THRESHOLD_PUBLICATION_DECLARATIONS = Object.freeze([
  ["PNP.Main.locked_nand_threshold", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDThresholdPublication"],
]);
const LOCKED_NAND_THRESHOLD_PUBLICATION_KERNEL_TYPE_SHA256 =
  '951ec63c09e9a096aacc26332a97607dade4a1f412229f9185aff5c7f36aa591';

const LOCKED_NAND_ENCODED_SEMANTIC_REDUCTION_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.LockedNAND.RawCircuit.normalize_idempotent", ["propext"]],
  ["PNP.Concrete.LockedNAND.RawCircuit.normalize_eval", ["Quot.sound", "propext"]],
  ["PNP.Concrete.LockedNAND.RawCircuit.elaborate_ofCircuit", ["propext"]],
  ["PNP.Concrete.LockedNAND.RawCandidate.elaborate_ofCandidate", ["propext"]],
  ["PNP.Concrete.LockedNAND.RawLockedInstance.elaborate_ofCandidate", ["propext"]],
  ["PNP.Concrete.LockedNAND.decodeTokens_encodeTokens", ["propext"]],
  ["PNP.Concrete.LockedNAND.decodeCircuit_encodeCircuit", ["propext"]],
  ["PNP.Concrete.LockedNAND.decodeLockedInstance_encodeLockedInstance", ["propext"]],
  ["PNP.Concrete.LockedNAND.decodeElaboratedCircuit_encodeCircuit_ofCircuit", ["propext"]],
  ["PNP.Concrete.LockedNAND.encoded_fullCandidate_threshold_iff_satisfiable", ["Quot.sound", "propext"]],
  ["PNP.Concrete.LockedNAND.buildLockedNANDInstance_correct", ["Quot.sound", "propext"]],
]);

const LOCKED_NAND_SOURCE_PARSER_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.LockedNAND.SourceParser.acceptedTape_outputBits", ["propext"], "PNP.Concrete.LockedNANDSourceParserValidTrace"],
  ["PNP.Concrete.LockedNAND.SourceParser.allInput_exact", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDSourceParserCorrectness"],
  ["PNP.Concrete.LockedNAND.SourceParser.canonicalSteps_le_validWorkBound", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDSourceParserValidTrace"],
  ["PNP.Concrete.LockedNAND.SourceParser.compiledBoundedDecide_accept_iff", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDSourceParserCompiled"],
  ["PNP.Concrete.LockedNAND.SourceParser.compiledBoundedDecide_ne_timeout", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDSourceParserCompiled"],
  ["PNP.Concrete.LockedNAND.SourceParser.compiledMachineOutput_eq_validatedSourceBytes", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDSourceParserCompiled"],
  ["PNP.Concrete.LockedNAND.SourceParser.compiledStart_blankEquivalent", [], "PNP.Concrete.LockedNANDSourceParserCompiled"],
  ["PNP.Concrete.LockedNAND.SourceParser.decodeCircuitTokens_eq_none_iff_failure", ["propext"], "PNP.Concrete.LockedNANDSourceParserFailureShapes"],
  ["PNP.Concrete.LockedNAND.SourceParser.illFormed_exact", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDSourceParserCorrectness"],
  ["PNP.Concrete.LockedNAND.SourceParser.machine_acceptState_ne_rejectState", [], "PNP.Concrete.LockedNANDSourceParserMachine"],
  ["PNP.Concrete.LockedNAND.SourceParser.malformed_exact", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDSourceParserCorrectness"],
  ["PNP.Concrete.LockedNAND.SourceParser.rules_length", ["propext"], "PNP.Concrete.LockedNANDSourceParserMachine"],
  ["PNP.Concrete.LockedNAND.SourceParser.rules_pairwise_query_distinct", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDSourceParserMachine"],
  ["PNP.Concrete.LockedNAND.SourceParser.statePrograms_length", [], "PNP.Concrete.LockedNANDSourceParserMachine"],
  ["PNP.Concrete.LockedNAND.SourceParser.validFinalConfiguration_isHalted", [], "PNP.Concrete.LockedNANDSourceParserValidTrace"],
  ["PNP.Concrete.LockedNAND.SourceParser.validFinalConfiguration_state", [], "PNP.Concrete.LockedNANDSourceParserValidTrace"],
  ["PNP.Concrete.LockedNAND.SourceParser.validRawBound_eq", [], "PNP.Concrete.LockedNANDSourceParserValidTrace"],
  ["PNP.Concrete.LockedNAND.SourceParser.validRawTimePolynomial_eval", [], "PNP.Concrete.LockedNANDSourceParserCompiled"],
  ["PNP.Concrete.LockedNAND.SourceParser.validatedSourceBytesPolynomialTimeFunction_output", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDSourceParserCompiled"],
  ["PNP.Concrete.LockedNAND.SourceParser.wellFormed_exact", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDSourceParserValidTrace"],
]);

const LOCKED_NAND_TARGET_EMITTER_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.LockedNAND.RawBuilder.rawLockedInstance_of_elaborate", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDRawBuilder"],
  ["PNP.Concrete.LockedNAND.RawBuilder.targetBytes_of_elaborated", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDRawBuilder"],
  ["PNP.Concrete.LockedNAND.TargetEmitterSpec.targetBytes_validatedSourceBytes_eq_buildLockedNANDInstance", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterSpec"],
  ["PNP.Concrete.LockedNAND.TargetEmitterSpec.targetBytes_size_le", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterSpec"],
  ["PNP.Concrete.LockedNAND.TargetEmitterController.rules_length_literal", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterController"],
  ["PNP.Concrete.LockedNAND.TargetEmitterController.rules_pairwise", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterController"],
  ["PNP.Concrete.LockedNAND.TargetEmitterController.machine_accept_ne_reject", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterController"],
  ["PNP.Concrete.LockedNAND.TargetEmitterController.graph_wellFormed", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterController"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerTotalTrace.malformed_bounded_exact", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerTotalTrace"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerTotalTrace.decoded_bounded_exact", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerTotalTrace"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerTotalTrace.allInput_bounded_exact", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerTotalTrace"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.controllerWorkTimePolynomial_eval", ["propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerPolynomialBound"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.allInputWorkTimePolynomial_eval", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerPolynomialBound"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.compiledRawTimePolynomial_eval", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerPolynomialBound"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.controller_complete_path_polynomial", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerPolynomialBound"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerPolynomialBound.controllerUniformEnvelope_le_workBound", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerPolynomialBound"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledStart_blankEquivalent", ["propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerCompiled"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledMachineOutput_eq_targetBytes", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerCompiled"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledBoundedDecide_accept_iff", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerCompiled"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.compiledBoundedDecide_ne_timeout", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerCompiled"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.rawTargetBytesPolynomialTimeFunction_output", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerCompiled"],
  ["PNP.Concrete.LockedNAND.TargetEmitterControllerCompiled.strictLockedNANDPolynomialTimeFunction_output", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDTargetEmitterControllerCompiled"],
]);

const LOCKED_NAND_POLYNOMIAL_REDUCTION_DECLARATIONS = Object.freeze([
  ["PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_function", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDPolynomialReduction"],
  ["PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_output", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDPolynomialReduction"],
  ["PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_correct", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDPolynomialReduction"],
  ["PNP.Concrete.LockedNAND.encodedNANDSAT_reducesTo_encodedLockedNANDThreshold", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDPolynomialReduction"],
  ["PNP.Concrete.LockedNAND.strictLockedNANDPolynomialReduction_hasRawRefinement", ["Quot.sound", "propext"], "PNP.Concrete.LockedNANDPolynomialReduction"],
]);

const CNF_TO_NAND_SEMANTIC_COMPILER_DECLARATIONS = Object.freeze([
  [
    "PNP.Concrete.CNFToNAND.encodeCNF_of_decodeEncodedCNF",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.compileFormula_inputCount",
    [
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.compileFormula_output_is_gate",
    [
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.compileFormula_wellFormed",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.decodeValidCircuit_encode_compileFormula",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.compiledFormulaCircuit_eval_eq_true_iff",
    [
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.compiledFormulaCircuit_satisfiable_iff",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.compileFormula_satisfiable_iff",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.formula_satisfiable_iff_encoded_compileFormula",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.compileFormula_gateCount_exact",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.compileFormula_gateCount_le",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.cnfToNANDOutputSizePolynomial_eval",
    [],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.compileEncodedCNFToNAND_of_decoded",
    [
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.compileEncodedCNFToNAND_of_malformed",
    [
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.compileEncodedCNFToNAND_size_le",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.empty_not_encodedNANDSAT",
    [
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.compileEncodedCNFToNAND_correct",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ],
  [
    "PNP.Concrete.CNFToNAND.buildLockedNANDFromCNF_correct",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNAND"
  ]
]);

const CNF_TO_NAND_POLYNOMIAL_REDUCTION_DECLARATIONS = Object.freeze([
  [
    "PNP.Concrete.CNFSourceParser.allInput_exact",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFSourceParserCorrectness"
  ],
  [
    "PNP.Concrete.CNFSourceParser.compiledMachineOutput_eq_validatedCNFBytes",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFSourceParserCompiled"
  ],
  [
    "PNP.Concrete.CNFSourceParser.compiledBoundedDecide_ne_timeout",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFSourceParserCompiled"
  ],
  [
    "PNP.Concrete.CNFToNANDCarrierEncoder.canonical_exact",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDCarrierEncoder"
  ],
  [
    "PNP.Concrete.CNFToNANDCarrierEncoder.canonicalWorkSteps_polynomial_bound",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDCarrierEncoder"
  ],
  [
    "PNP.Concrete.CNFToNANDWorkspace.exact_execution_output",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDWorkspace"
  ],
  [
    "PNP.Concrete.CNFToNANDController.rules_length_literal",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDController"
  ],
  [
    "PNP.Concrete.CNFToNANDControllerTotalTrace.canonical_path",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDControllerTotalTrace"
  ],
  [
    "PNP.Concrete.CNFToNANDControllerTotalTrace.canonical_bounded_exact",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDControllerTotalTrace"
  ],
  [
    "PNP.Concrete.CNFToNANDCompilerMachine.rules_length_literal",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDCompilerMachine"
  ],
  [
    "PNP.Concrete.CNFToNANDCompilerTotalTrace.malformed_bounded_exact",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDCompilerTotalTrace"
  ],
  [
    "PNP.Concrete.CNFToNANDCompilerTotalTrace.decoded_bounded_exact",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDCompilerTotalTrace"
  ],
  [
    "PNP.Concrete.CNFToNANDCompilerTotalTrace.allInput_bounded_exact",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDCompilerTotalTrace"
  ],
  [
    "PNP.Concrete.CNFToNANDCompilerPolynomialBound.allInputWorkTimePolynomial_eval",
    [
      "propext"
    ],
    "PNP.Concrete.CNFToNANDCompilerPolynomialBound"
  ],
  [
    "PNP.Concrete.CNFToNANDCompilerPolynomialBound.compiledRawTimePolynomial_eval",
    [
      "propext"
    ],
    "PNP.Concrete.CNFToNANDCompilerPolynomialBound"
  ],
  [
    "PNP.Concrete.CNFToNANDCompilerCompiled.compiledMachineOutput_eq_compileEncodedCNFToNAND",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDCompilerCompiled"
  ],
  [
    "PNP.Concrete.CNFToNANDCompilerCompiled.compiledBoundedDecide_accept_iff",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDCompilerCompiled"
  ],
  [
    "PNP.Concrete.CNFToNANDCompilerCompiled.compiledBoundedDecide_ne_timeout",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDCompilerCompiled"
  ],
  [
    "PNP.Concrete.CNFToNANDCompilerCompiled.cnfToNANDPolynomialTimeFunction_output",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDCompilerCompiled"
  ],
  [
    "PNP.Concrete.CNFToNAND.cnfToNANDPolynomialReduction_function",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDPolynomialReduction"
  ],
  [
    "PNP.Concrete.CNFToNAND.cnfToNANDPolynomialReduction_output",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDPolynomialReduction"
  ],
  [
    "PNP.Concrete.CNFToNAND.cnfToNANDPolynomialReduction_correct",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDPolynomialReduction"
  ],
  [
    "PNP.Concrete.CNFToNAND.cnfSAT_reducesTo_encodedNANDSAT",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDPolynomialReduction"
  ],
  [
    "PNP.Concrete.CNFToNAND.cnfToNANDPolynomialReduction_hasRawRefinement",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDPolynomialReduction"
  ],
  [
    "PNP.Concrete.CNFToNAND.cnfToLockedNANDPolynomialReduction_output",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDPolynomialReduction"
  ],
  [
    "PNP.Concrete.CNFToNAND.cnfToLockedNANDPolynomialReduction_correct",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDPolynomialReduction"
  ],
  [
    "PNP.Concrete.CNFToNAND.cnfSAT_reducesTo_encodedLockedNANDThreshold",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDPolynomialReduction"
  ],
  [
    "PNP.Concrete.CNFToNAND.cnfToLockedNANDPolynomialReduction_hasRawRefinement",
    [
      "Quot.sound",
      "propext"
    ],
    "PNP.Concrete.CNFToNANDPolynomialReduction"
  ]
]);

const REMAINING_BLOCKERS = Object.freeze([
  'Formal.ConcreteSAT',
  'Formal.ResidualBandMinimizer',
  'Formal.ZeroSlack',
  'Formal.PolynomialRuntimeAndCertificateBounds',
  'Formal.RootTheoremAndAxiomAudit',
]);

const GATE_SUBCHECK_KEYS = Object.freeze([
  'standardComplexityModelEligible',
  'concreteTargetPresent',
  'concreteTargetIsDefinition',
  'concreteTargetKernelTypeFingerprintConfigured',
  'concreteTargetKernelTypeFingerprintMatches',
  'concreteTargetKernelValueFingerprintConfigured',
  'concreteTargetKernelValueFingerprintMatches',
  'compatibilityRootPresent',
  'compatibilityRootIsTheorem',
  'compatibilityRootHasExactConcreteType',
  'compatibilityRootKernelTypeFingerprintConfigured',
  'compatibilityRootKernelTypeFingerprintMatches',
  'axiomClosureFingerprintConfigured',
  'axiomClosureFingerprintMatches',
  'sourceClosureFingerprintConfigured',
  'sourceClosureFingerprintMatches',
  'axiomClosureUsesOnlyLeanStandardAllowlist',
]);

const FAIL_CLOSED_FORMAL_STATUS = Object.freeze({
  status: 'formal-reconstruction-in-progress',
  mathematicalTheoremEstablished: false,
  publicTheoremEmissionAllowed: false,
  publicTheoremStatement: null,
  finalTheoremReady: false,
  rootLeanTheoremPresent: false,
  rootLeanTheoremBuilt: false,
  rootLeanTheoremAxiomAuditPassed: false,
  projectSpecificAxiomsRemaining: true,
  leanConcreteCNFSATMembershipFormalized: false,
  leanConcretePipelineStateNamespaceAxiomAuditPassed: false,
  leanConcretePipelineStageBridgesFormalized: false,
  leanConcretePipelineStageBridgesAxiomAuditPassed: false,
  leanConcretePipelineTerminalOutputPackingFormalized: false,
  leanConcretePipelineTerminalOutputPackerAxiomAuditPassed: false,
  leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount: 0,
  leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized: false,
  leanConcretePipelineTerminalBridgeAxiomAuditPassed: false,
  leanConcretePipelineTerminalBridgeAuditedDeclarationCount: 0,
  leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized: false,
  leanConcretePipelineInputFramerAxiomAuditPassed: false,
  leanConcretePipelineInputFramerAuditedDeclarationCount: 0,
  leanConcretePipelineAllInputFramingFormalized: false,
  leanConcretePipelinePairedCompilerAxiomAuditPassed: false,
  leanConcretePipelinePairedCompilerAuditedDeclarationCount: 0,
  leanConcretePipelineCanonicalPairCompilationFormalized: false,
  leanConcretePipelineCompilerAxiomAuditPassed: false,
  leanConcretePipelineCompilerAuditedDeclarationCount: 0,
  leanConcretePipelineAllInputCompilationFormalized: false,
  leanConcretePipelineSequentialNamespaceAxiomAuditPassed: false,
  leanConcretePipelineSequentialCompilerAxiomAuditPassed: false,
  leanConcretePipelineSequentialCompilationFormalized: false,
  leanConcretePipelineRefinementAxiomAuditPassed: false,
  leanConcreteFunctionProgramRecursiveCompilationFormalized: false,
  leanConcreteDecisionProgramRecursiveCompilationFormalized: false,
  leanConcretePolynomialTimeDeciderRawCompilationFormalized: false,
  standardComplexityModelFormalized: false,
  leanConcretePipelineMalformedInputBehaviorFormalized: false,
  leanConcretePipelineRawRefinementFormalized: false,
  leanConcretePipelineExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderInputLengthFormalized: false,
  leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderInputPrefixFormalized: false,
  leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderTokenAppenderFormalized: false,
  leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderFirstTokenPrefixFormalized: false,
  leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderUnaryPolynomialFormalized: false,
  leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderCompleteHeaderFormalized: false,
  leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderBodyStartPrefixFormalized: false,
  leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized: false,
  leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized: false,
  leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized: false,
  leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized: false,
  leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized: false,
  leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePrefixFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePrefixAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderFourthClausePrefixCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePaddingRunFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePaddingRunAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderFourthClausePaddingRunCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePaddingRunExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePaddingRunExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePaddingRunRemainingPaddingCountFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePaddingRunDirectPaddingBlockFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized: false,
  leanConcreteCookLevinBuilderFourthClausePaddingRunInputPrefixAppenderComposed: false,
  leanConcreteCookLevinBuilderFourthClausePaddingRunFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderFifthClausePaddingRunFormalized: false,
  leanConcreteCookLevinBuilderFifthClausePaddingRunAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderFifthClausePaddingRunCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderFifthClausePaddingRunExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderFifthClausePaddingRunExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderFifthClausePaddingRunPaddingCountFormalized: false,
  leanConcreteCookLevinBuilderFifthClausePaddingRunDirectPaddingBlockFormalized: false,
  leanConcreteCookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized: false,
  leanConcreteCookLevinBuilderFifthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized: false,
  leanConcreteCookLevinBuilderFifthClausePaddingRunInputPrefixAppenderComposed: false,
  leanConcreteCookLevinBuilderFifthClausePaddingRunFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderFirstConstraintPaddingRunFormalized: false,
  leanConcreteCookLevinBuilderFirstConstraintPaddingRunAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderFirstConstraintPaddingRunCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderFirstConstraintPaddingRunExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderFirstConstraintPaddingRunExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderFirstConstraintPaddingRunPaddingCountFormalized: false,
  leanConcreteCookLevinBuilderFirstConstraintPaddingRunDirectPaddingBlockFormalized: false,
  leanConcreteCookLevinBuilderFirstConstraintPaddingRunSecondConstraintSeparatorFormalized: false,
  leanConcreteCookLevinBuilderFirstConstraintPaddingRunRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderFirstConstraintPaddingRunNoEmissionSpecificationFormalized: false,
  leanConcreteCookLevinBuilderFirstConstraintPaddingRunInputPrefixAppenderComposed: false,
  leanConcreteCookLevinBuilderFirstConstraintPaddingRunFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintSeparatorStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeparatorStepSecondConstraintSeparatorFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeparatorStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeparatorStepInputPrefixAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepSecondConstraintFirstLiteralSignFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepInputPrefixAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSecondConstraintFirstLiteralFirstUnaryUnitFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepInputPrefixAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondConstraintFirstLiteralSecondUnaryUnitFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepInputPrefixAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepSecondConstraintFirstLiteralThirdUnaryUnitFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepInputPrefixAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepSecondConstraintFirstLiteralTerminatorFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepInputPrefixAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSecondConstraintFirstLiteralSuccessorTokenFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepInputPrefixAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepPaddingOrUnaryOpportunityFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFourthPaddingOrUnaryOpportunityFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFifthPaddingOrTerminatorOpportunityFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepInputPrefixOptionalTerminatorAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepSixthPaddingOrOpeningUnaryOpportunityFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepInputPrefixOptionalAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepSeventhPaddingOrUnaryOpportunityFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized: false,
  leanLockedNANDCarrierLayoutFormalized: false,
  leanLockedNANDCarrierTraceAxiomAuditPassed: false,
  leanLockedNANDCarrierTraceAuditedDeclarationCount: 0,
  leanLockedNANDCarrierTraceScope: null,
  leanLockedNANDGlobalCandidateAssemblyFormalized: false,
  leanLockedNANDGlobalBaselineCandidateFormalized: false,
  leanLockedNANDGlobalCandidateAxiomAuditPassed: false,
  leanLockedNANDGlobalCandidateAuditedDeclarationCount: 0,
  leanLockedNANDGlobalCandidateScope: null,
  leanLockedNANDGlobalBaselineDistinctFormalized: false,
  leanLockedNANDGlobalBaselineDistinctAxiomAuditPassed: false,
  leanLockedNANDGlobalBaselineDistinctAuditedDeclarationCount: 0,
  leanLockedNANDGlobalBaselineDistinctScope: null,
  leanLockedNANDUnsatisfiableFinalZeroFormalized: false,
  leanLockedNANDUnsatisfiableFinalZeroAxiomAuditPassed: false,
  leanLockedNANDUnsatisfiableFinalZeroAuditedDeclarationCount: 0,
  leanLockedNANDUnsatisfiableFinalZeroScope: null,
  leanConcreteLockedNANDParserMachineFormalized: false,
  leanConcreteLockedNANDParserAxiomAuditPassed: false,
  leanConcreteLockedNANDParserAuditedDeclarationCount: 0,
  leanConcreteLockedNANDParserAllInputExactFormalized: false,
  leanConcreteLockedNANDParserExactOutputFormalized: false,
  leanConcreteLockedNANDParserCompiledNonTimeoutFormalized: false,
  leanConcreteLockedNANDParserPolynomialTimeMachineFormalized: false,
  leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized: false,
  leanConcreteLockedNANDParserRawRefinementFormalized: false,
  leanConcreteLockedNANDParserScope: null,
  leanConcreteLockedNANDEmitterMachineFormalized: false,
  leanConcreteLockedNANDEmitterAxiomAuditPassed: false,
  leanConcreteLockedNANDEmitterAuditedDeclarationCount: 0,
  leanConcreteLockedNANDEmitterAllInputExactFormalized: false,
  leanConcreteLockedNANDEmitterExactTargetBytesFormalized: false,
  leanConcreteLockedNANDEmitterCompiledNonTimeoutFormalized: false,
  leanConcreteLockedNANDEmitterPolynomialTimeMachineFormalized: false,
  leanConcreteLockedNANDEmitterPolynomialTimeFunctionFormalized: false,
  leanConcreteLockedNANDEmitterRawRefinementFormalized: false,
  leanConcreteLockedNANDEmitterStrictParserCompositionFormalized: false,
  leanConcreteLockedNANDEmitterOutputSizeBoundFormalized: false,
  leanConcreteLockedNANDEmitterScope: null,
  leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepThirdPaddingOrUnaryOpportunityFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAxiomAuditPassed: false,
  leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepSecondPaddingOrUnaryOpportunityFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized: false,
  leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed: false,
  leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized: false,
  leanConcreteCookLevinBuilderInputPrefixAppenderComposed: false,
  leanConcreteCNFToNANDSemanticCompilerFormalized: false,
  leanConcreteCNFToNANDSemanticCompilerAxiomAuditPassed: false,
  leanConcreteCNFToNANDSemanticCompilerAuditedDeclarationCount: 0,
  leanConcreteCNFToNANDExactCodecCanonicalityFormalized: false,
  leanConcreteCNFToNANDTypedTopologicalCompilationFormalized: false,
  leanConcreteCNFToNANDWellFormedOutputFormalized: false,
  leanConcreteCNFToNANDExactSemanticsFormalized: false,
  leanConcreteCNFToNANDEdgeSemanticsFormalized: false,
  leanConcreteCNFToNANDExactGateCountFormalized: false,
  leanConcreteCNFToNANDPolynomialOutputSizeBoundFormalized: false,
  leanConcreteCNFToNANDAllBitstringFailClosedFormalized: false,
  leanConcreteCNFToNANDLockedThresholdCompositionFormalized: false,
  leanConcreteCNFToNANDFiniteMachineFormalized: false,
  leanConcreteCNFToNANDPolynomialTimeFunctionFormalized: false,
  leanConcreteCNFToNANDPolynomialReductionFormalized: false,
  leanConcreteCNFToNANDPolynomialReductionAxiomAuditPassed: false,
  leanConcreteCNFToNANDPolynomialReductionAuditedDeclarationCount: 0,
  leanConcreteCNFToNANDAllInputExactFormalized: false,
  leanConcreteCNFToNANDExactMachineOutputFormalized: false,
  leanConcreteCNFToNANDCompiledNonTimeoutFormalized: false,
  leanConcreteCNFToNANDRawRefinementFormalized: false,
  leanConcreteCNFToNANDDirectReductionFormalized: false,
  leanConcreteCNFToNANDLockedReductionCompositionFormalized: false,
  leanConcreteCNFToNANDPolynomialReductionScope: null,
  leanConcreteCNFToNANDSemanticCompilerScope: null,
  leanResidualProjectionMinimumFormalized: false,
  leanResidualProjectionMinimumAxiomAuditPassed: false,
  leanResidualProjectionMinimumExecutableFullScanFormalized: false,
  leanResidualProjectionMinimumExecutableQuotientScanFormalized: false,
  leanResidualProjectionMinimumAttainmentFormalized: false,
  leanResidualProjectionMinimumUniversalLowerBoundsFormalized: false,
  leanResidualProjectionMinimumMonotonicityFormalized: false,
  leanResidualProjectionDefectDecompositionFormalized: false,
  leanResidualProjectionDefectZeroIffCheckedLiftAtMinimumFormalized: false,
  leanResidualProjectionMinimumScope: null,
  leanResidualProjectionTransferFormalized: false,
  leanResidualProjectionTransferAxiomAuditPassed: false,
  leanResidualProjectionTransferSignedDeltasFormalized: false,
  leanResidualProjectionTransferIdentityFormalized: false,
  leanResidualProjectionTransferConstantCutFormalized: false,
  leanResidualProjectionTransferScope: null,
  leanResidualTerminalProperSupportFormalized: false,
  leanResidualTerminalProperSupportSearchCompleteFormalized: false,
  leanResidualTerminalProperSupportExactLocalGainFormalized: false,
  leanResidualTerminalProperSupportAxiomAuditPassed: false,
  leanResidualTerminalProperSupportScope: null,
  leanResidualTerminalSupportSquareClosureFormalized: false,
  leanResidualTerminalSupportSquareMeetJoinExactFormalized: false,
  leanResidualTerminalSupportSquarePhysicalCompatibilityFormalized: false,
  leanResidualTerminalSupportSquareSemanticExtractionFormalized: false,
  leanResidualTerminalSupportSquareClosureAxiomAuditPassed: false,
  leanResidualTerminalSupportSquareClosureScope: null,
  leanResidualTerminalGovernedSupportCompletionFormalized: false,
  leanResidualTerminalGovernedProfilePartitionFormalized: false,
  leanResidualTerminalGovernedSupportCompletionAxiomAuditPassed: false,
  leanResidualTerminalGovernedSupportCompletionScope: null,
  leanResidualTerminalFrontierPushoutFormalized: false,
  leanResidualTerminalFrontierBoundaryGlueExactFormalized: false,
  leanResidualTerminalFrontierInterfaceGlueExactFormalized: false,
  leanResidualTerminalFrontierProfileGlueExactFormalized: false,
  leanResidualTerminalFrontierInternalizationFormalized: false,
  leanResidualTerminalFrontierPushoutAxiomAuditPassed: false,
  leanResidualTerminalFrontierPushoutScope: null,
  leanResidualTerminalSaturationFormalized: false,
  leanResidualTerminalSaturationAxiomAuditPassed: false,
  leanResidualTerminalPrimitiveUniverseFormalized: false,
  leanResidualTerminalSaturationExtensiveFormalized: false,
  leanResidualTerminalSaturationLeastFormalized: false,
  leanResidualTerminalSaturationMonotoneFormalized: false,
  leanResidualTerminalSaturationIdempotentFormalized: false,
  leanResidualTerminalSaturationScope: null,
  leanResidualTerminalExecutableSaturationFormalized: false,
  leanResidualTerminalPhysicalSupportCompletionFormalized: false,
  leanResidualTerminalPhysicalBoundaryFormalized: false,
  leanResidualTerminalPhysicalInterfaceFormalized: false,
  leanResidualTerminalPhysicalCompatibilityFormalized: false,
  leanResidualTerminalPhysicalSupportCompletionAxiomAuditPassed: false,
  leanResidualTerminalPhysicalSupportCompletionScope: null,
  leanResidualTerminalSupportExtractionFormalized: false,
  leanResidualTerminalSupportExtractionAxiomAuditPassed: false,
  leanResidualTerminalSupportExtractionScope: null,
  leanResidualTerminalOpenSemanticsFormalized: false,
  leanResidualTerminalInducedRecoveryFormalized: false,
  leanResidualTerminalSupportCompletionFormalized: false,
  leanResidualTerminalSquareLegitimacyFormalized: false,
  leanResidualTerminalSquareStructuralCompatibilityFormalized: false,
  leanResidualTerminalSquareFrontierPushoutFormalized: false,
  leanResidualTerminalSquareSharedQuantityCarrierFormalized: false,
  leanResidualTerminalSquareLocalConclusionUnderRouteSilenceFormalized: false,
  leanResidualTerminalSquareFailClosedRouteDichotomyFormalized: false,
  leanResidualTerminalSquareLegitimacyAxiomAuditPassed: false,
  leanResidualTerminalSquareLegitimacyScope: null,
  leanResidualTerminalComputedBCELAnchorNucleusFormalized: false,
  leanResidualTerminalBCELMinimumPositiveNucleusFormalized: false,
  leanResidualTerminalBCELAnchorAlgebraFormalized: false,
  leanResidualTerminalBCELCutDefectFirewallFormalized: false,
  leanResidualTerminalBCELCutRouteDichotomyFormalized: false,
  leanResidualTerminalBCELConstantCutConclusionFormalized: false,
  leanResidualTerminalBCELAnchorNucleusAxiomAuditPassed: false,
  leanResidualTerminalBCELAnchorNucleusScope: null,
  leanResidualTerminalSaturationPositivityFirewallFormalized: false,
  leanResidualTerminalSaturationPositivityFirewallAxiomAuditPassed: false,
  leanResidualTerminalSaturationPositivityFirewallScope: null,
  leanResidualTerminalCandidateSaturationFormalized: false,
  leanResidualTerminalSaturationCostBalanceFormalized: false,
  leanResidualTerminalFirstNontransparentStepFormalized: false,
  leanResidualTerminalSaturationCostBalanceAxiomAuditPassed: false,
  leanResidualTerminalSaturationCostBalanceScope: null,
  leanResidualTerminalInterfaceExposureRoutingFormalized: false,
  leanResidualTerminalFiniteInterfaceExposureRoutesToEFormalized: false,
  leanResidualTerminalInterfaceExposureZeroCostRetractFormalized: false,
  leanResidualTerminalFirstInterfaceExposureRouteFormalized: false,
  leanResidualTerminalInterfaceExposureRoutingAxiomAuditPassed: false,
  leanResidualTerminalInterfaceExposureRoutingScope: null,
  leanResidualTerminalOriginKernelObligationRoutingFormalized: false,
  leanResidualTerminalFiniteOriginKernelObligationClosureRoutedFormalized: false,
  leanResidualTerminalFirstOriginKernelObligationRouteFormalized: false,
  leanResidualTerminalOriginKernelObligationRoutingAxiomAuditPassed: false,
  leanResidualTerminalOriginKernelObligationRoutingScope: null,
  leanResidualTerminalFiniteSaturatePositiveCompositionFormalized: false,
  leanResidualTerminalFiniteSaturatePositiveCompositionAxiomAuditPassed: false,
  leanResidualTerminalFiniteSaturatePositiveCompositionScope: null,
  leanResidualTerminalRankWFFormalized: false,
  leanResidualTerminalRankWFAxiomAuditPassed: false,
  leanResidualTerminalRankWFScope: null,
  leanResidualTerminalBN3RequestEnvelopeFormalized: false,
  leanResidualTerminalBN3RequestEnvelopeAxiomAuditPassed: false,
  leanResidualTerminalBN3RequestEnvelopeScope: null,
  leanResidualTerminalBN4ActivationCancellationFormalized: false,
  leanResidualTerminalBN4ActivationCancellationAxiomAuditPassed: false,
  leanResidualTerminalBN4ActivationCancellationScope: null,
  leanResidualTerminalBN5FullShadowLocalizationFormalized: false,
  leanResidualTerminalBN5FullShadowLocalizationAxiomAuditPassed: false,
  leanResidualTerminalBN5FullShadowLocalizationScope: null,
  leanResidualTerminalPkgCSeparatingConsumersFormalized: false,
  leanResidualTerminalPkgCSeparatingConsumersAxiomAuditPassed: false,
  leanResidualTerminalPkgCSeparatingConsumersScope: null,
  leanResidualTerminalPkgCTypedRestorationFormalized: false,
  leanResidualTerminalPkgCTypedRestorationAxiomAuditPassed: false,
  leanResidualTerminalPkgCTypedRestorationScope: null,
  leanResidualTerminalPkgCSameKeyCancellationFormalized: false,
  leanResidualTerminalPkgCSameKeyCancellationAxiomAuditPassed: false,
  leanResidualTerminalPkgCSameKeyCancellationScope: null,
  leanResidualTerminalPkgCAmbientBN4LedgerFormalized: false,
  leanResidualTerminalPkgCAmbientBN4LedgerAxiomAuditPassed: false,
  leanResidualTerminalPkgCAmbientBN4LedgerScope: null,
  leanResidualTerminalPkgCAmbientBN4ResidualReductionFormalized: false,
  leanResidualTerminalPkgCAmbientBN4ResidualReductionAxiomAuditPassed: false,
  leanResidualTerminalPkgCAmbientBN4ResidualReductionScope: null,
  leanResidualTerminalConsumerAntichainNormalFormFormalized: false,
  leanResidualTerminalConsumerAntichainNormalFormAxiomAuditPassed: false,
  leanResidualTerminalConsumerAntichainNormalFormScope: null,
  leanResidualTerminalConstantCutHypergraphRigidityFormalized: false,
  leanResidualTerminalConstantCutHypergraphRigidityAxiomAuditPassed: false,
  leanResidualTerminalConstantCutHypergraphRigidityScope: null,
  leanResidualTerminalBN6HypergraphPacketFormalized: false,
  leanResidualTerminalBN6HypergraphPacketAxiomAuditPassed: false,
  leanResidualTerminalBN6HypergraphPacketScope: null,
  leanResidualTerminalPacketSelectorSeedsFormalized: false,
  leanResidualTerminalPacketSelectorSeedsAxiomAuditPassed: false,
  leanResidualTerminalPacketSelectorSeedsScope: null,
  leanResidualTerminalPacketSelectorUniverseFormalized: false,
  leanResidualTerminalPacketSelectorUniverseAxiomAuditPassed: false,
  leanResidualTerminalPacketSelectorUniverseScope: null,
  leanSaturatePositiveFormalized: false,
  leanBCELReadyFormalized: false,
  leanResidualTerminalProjectionSquareFormalized: false,
  leanResidualTerminalProjectionPhysicalInvariantFormalized: false,
  leanResidualTerminalProjectionProfileExactFormalized: false,
  leanResidualTerminalProjectionMeetJoinCommuteFormalized: false,
  leanResidualTerminalProjectionPushoutCommuteFormalized: false,
  leanResidualTerminalProjectionSquareAxiomAuditPassed: false,
  leanResidualTerminalProjectionSquareScope: null,
  leanResidualTerminalSideTightMinimumArithmeticFormalized: false,
  leanResidualTerminalSideTightSignedSlackIdentityFormalized: false,
  leanResidualTerminalSideTightFailClosedGateFormalized: false,
  leanResidualTerminalSideTightCanonicalFullBasisFormalized: false,
  leanResidualTerminalSideTightCanonicalQuotientBasisFormalized: false,
  leanResidualTerminalSideTightMinimumAxiomAuditPassed: false,
  leanResidualTerminalSideTightMinimumScope: null,
  leanResidualTerminalFourCornerCarrierTransportFormalized: false,
  leanResidualTerminalFourCornerCarrierExactEndpointsFormalized: false,
  leanResidualTerminalFourCornerCarrierInjectiveCoordinatesFormalized: false,
  leanResidualTerminalFourCornerCarrierProfileTransportFormalized: false,
  leanResidualTerminalFourCornerCarrierFailClosedPhysicalTransportFormalized: false,
  leanResidualTerminalFourCornerCarrierAxiomAuditPassed: false,
  leanResidualTerminalFourCornerCarrierScope: null,
  leanResidualTerminalFourCornerOptimaCarrierCompatibleFormalized: false,
  leanResidualTerminalFourCornerOptimaFaithfulAmbientizationFormalized: false,
  leanResidualTerminalFourCornerOptimaReferenceMinimumPreservedFormalized: false,
  leanResidualTerminalFourCornerOptimaLocalizedMinimaFormalized: false,
  leanResidualTerminalFourCornerOptimaSharedObserverProjectionFormalized: false,
  leanResidualTerminalFourCornerOptimaAxiomAuditPassed: false,
  leanResidualTerminalFourCornerOptimaCarrierScope: null,
  leanResidualTerminalFourCornerOptimumCoherenceClassifierFormalized: false,
  leanResidualTerminalFourCornerOptimumFirstFailureFormalized: false,
  leanResidualTerminalFourCornerOptimumRetainedSemanticsFormalized: false,
  leanResidualTerminalFourCornerOptimumProfileTransportFormalized: false,
  leanResidualTerminalFourCornerOptimumModeFirewallFormalized: false,
  leanResidualTerminalFourCornerOptimumSideTightTupleFactsFormalized: false,
  leanResidualTerminalFourCornerOptimumCoherenceAxiomAuditPassed: false,
  leanResidualTerminalFourCornerOptimumCoherenceScope: null,
  leanResidualTerminalFourCornerOptimumLocalRouteClassifierFormalized: false,
  leanResidualTerminalFourCornerOptimumRouteSoundnessFormalized: false,
  leanResidualTerminalFourCornerOptimumRouteSilenceFormalized: false,
  leanResidualTerminalFourCornerOptimumSideTightCompletionUnderRouteSilenceFormalized: false,
  leanResidualTerminalFourCornerOptimumExactCompletionValuesFormalized: false,
  leanResidualTerminalFourCornerOptimumPromotionFirewallRetained: false,
  leanResidualTerminalFourCornerSideTightCompletionAxiomAuditPassed: false,
  leanResidualTerminalFourCornerSideTightCompletionScope: null,
  leanResidualTerminalFourCornerArbitraryFamilyCoherenceFormalized: false,
  leanResidualTerminalFourCornerExactMinimumFamilyEnumerated: false,
  leanResidualTerminalFourCornerTightBasisFamilyComplete: false,
  leanResidualTerminalFourCornerSignedTightBasisMaximumFormalized: false,
  leanResidualTerminalFourCornerTightBasisMaximumEqualsDeltaFormalized: false,
  leanResidualTerminalFourCornerTightBasisMaximumAxiomAuditPassed: false,
  leanResidualTerminalFourCornerTightBasisMaximumScope: null,
  leanResidualTerminalCoherentFourCornerBasisFormalized: false,
  leanResidualTerminalCoherentFourCornerBasisScope: null,

  leanPCCMinPolynomialRuntimeFormalized: false,
  leanConcreteCNFSATInPFormalized: false,
  leanConcreteCNFNPCompletenessFormalized: false,
});

function formalStatusFields(payload) {
  return `status = "${payload.status}"
mathematicalTheoremEstablished = ${payload.mathematicalTheoremEstablished}
publicTheoremEmissionAllowed = ${payload.publicTheoremEmissionAllowed}
publicTheoremStatement = ${payload.publicTheoremStatement === null ? 'null' : JSON.stringify(payload.publicTheoremStatement)}
finalTheoremReady = ${payload.finalTheoremReady}
rootLeanTheoremPresent = ${payload.rootLeanTheoremPresent}
rootLeanTheoremBuilt = ${payload.rootLeanTheoremBuilt}
rootLeanTheoremAxiomAuditPassed = ${payload.rootLeanTheoremAxiomAuditPassed}
projectSpecificAxiomsRemaining = ${payload.projectSpecificAxiomsRemaining}
leanConcreteCNFSATMembershipFormalized = ${payload.leanConcreteCNFSATMembershipFormalized ?? false}
leanConcretePipelineStateNamespaceAxiomAuditPassed = ${payload.leanConcretePipelineStateNamespaceAxiomAuditPassed ?? false}
leanConcretePipelineStageBridgesFormalized = ${payload.leanConcretePipelineStageBridgesFormalized ?? false}
leanConcretePipelineStageBridgesAxiomAuditPassed = ${payload.leanConcretePipelineStageBridgesAxiomAuditPassed ?? false}
leanConcretePipelineTerminalOutputPackingFormalized = ${payload.leanConcretePipelineTerminalOutputPackingFormalized ?? false}
leanConcretePipelineTerminalOutputPackerAxiomAuditPassed = ${payload.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed ?? false}
leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount = ${payload.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount ?? 0}
leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized = ${payload.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized ?? false}
leanConcretePipelineTerminalBridgeAxiomAuditPassed = ${payload.leanConcretePipelineTerminalBridgeAxiomAuditPassed ?? false}
leanConcretePipelineTerminalBridgeAuditedDeclarationCount = ${payload.leanConcretePipelineTerminalBridgeAuditedDeclarationCount ?? 0}
leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized = ${payload.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized ?? false}
leanConcretePipelineInputFramerAxiomAuditPassed = ${payload.leanConcretePipelineInputFramerAxiomAuditPassed ?? false}
leanConcretePipelineInputFramerAuditedDeclarationCount = ${payload.leanConcretePipelineInputFramerAuditedDeclarationCount ?? 0}
leanConcretePipelineAllInputFramingFormalized = ${payload.leanConcretePipelineAllInputFramingFormalized ?? false}
leanConcretePipelinePairedCompilerAxiomAuditPassed = ${payload.leanConcretePipelinePairedCompilerAxiomAuditPassed ?? false}
leanConcretePipelinePairedCompilerAuditedDeclarationCount = ${payload.leanConcretePipelinePairedCompilerAuditedDeclarationCount ?? 0}
leanConcretePipelineCanonicalPairCompilationFormalized = ${payload.leanConcretePipelineCanonicalPairCompilationFormalized ?? false}
leanConcretePipelineCompilerAxiomAuditPassed = ${payload.leanConcretePipelineCompilerAxiomAuditPassed ?? false}
leanConcretePipelineCompilerAuditedDeclarationCount = ${payload.leanConcretePipelineCompilerAuditedDeclarationCount ?? 0}
leanConcretePipelineAllInputCompilationFormalized = ${payload.leanConcretePipelineAllInputCompilationFormalized ?? false}
leanConcretePipelineSequentialCompilationFormalized = ${payload.leanConcretePipelineSequentialCompilationFormalized ?? false}
leanConcretePipelineRefinementAxiomAuditPassed = ${payload.leanConcretePipelineRefinementAxiomAuditPassed ?? false}
leanConcreteFunctionProgramRecursiveCompilationFormalized = ${payload.leanConcreteFunctionProgramRecursiveCompilationFormalized ?? false}
leanConcreteDecisionProgramRecursiveCompilationFormalized = ${payload.leanConcreteDecisionProgramRecursiveCompilationFormalized ?? false}
leanConcretePolynomialTimeDeciderRawCompilationFormalized = ${payload.leanConcretePolynomialTimeDeciderRawCompilationFormalized ?? false}
standardComplexityModelFormalized = ${payload.standardComplexityModelFormalized ?? false}
leanConcretePipelineMalformedInputBehaviorFormalized = ${payload.leanConcretePipelineMalformedInputBehaviorFormalized ?? false}
leanConcretePipelineRawRefinementFormalized = ${payload.leanConcretePipelineRawRefinementFormalized ?? false}
leanConcretePipelineExternalInputSizePolynomialFormalized = ${payload.leanConcretePipelineExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderInputLengthFormalized = ${payload.leanConcreteCookLevinBuilderInputLengthFormalized ?? false}
leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderInputPrefixFormalized = ${payload.leanConcreteCookLevinBuilderInputPrefixFormalized ?? false}
leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderFormalized = ${payload.leanConcreteCookLevinBuilderTokenAppenderFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized = ${payload.leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed = ${payload.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed ?? false}
leanConcreteCookLevinBuilderFirstTokenPrefixFormalized = ${payload.leanConcreteCookLevinBuilderFirstTokenPrefixFormalized ?? false}
leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderUnaryPolynomialFormalized = ${payload.leanConcreteCookLevinBuilderUnaryPolynomialFormalized ?? false}
leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderCompleteHeaderFormalized = ${payload.leanConcreteCookLevinBuilderCompleteHeaderFormalized ?? false}
leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderBodyStartPrefixFormalized = ${payload.leanConcreteCookLevinBuilderBodyStartPrefixFormalized ?? false}
leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized = ${payload.leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized ?? false}
leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderFirstClausePrefixFormalized = ${payload.leanConcreteCookLevinBuilderFirstClausePrefixFormalized ?? false}
leanConcreteCookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized = ${payload.leanConcreteCookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized ?? false}
leanConcreteCookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderInputPrefixAppenderComposed = ${payload.leanConcreteCookLevinBuilderInputPrefixAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormalized = ${payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormalized ?? false}
leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized = ${payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized ?? false}
leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondClausePrefixFormalized = ${payload.leanConcreteCookLevinBuilderSecondClausePrefixFormalized ?? false}
leanConcreteCookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized = ${payload.leanConcreteCookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized ?? false}
leanConcreteCookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized = ${payload.leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized ?? false}
leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized = ${payload.leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized ?? false}
leanConcreteCookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized = ${payload.leanConcreteCookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized ?? false}
leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized = ${payload.leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized ?? false}
leanConcreteCookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized = ${payload.leanConcreteCookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized ?? false}
leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormalized = ${payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormalized ?? false}
leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized = ${payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized ?? false}
leanConcreteCookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormalized = ${payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormalized ?? false}
leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized = ${payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized ?? false}
leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormalized = ${payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormalized ?? false}
leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized = ${payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized ?? false}
leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderThirdClausePrefixFormalized = ${payload.leanConcreteCookLevinBuilderThirdClausePrefixFormalized ?? false}
leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized = ${payload.leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized ?? false}
leanConcreteCookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderThirdClausePaddingRunFormalized = ${payload.leanConcreteCookLevinBuilderThirdClausePaddingRunFormalized ?? false}
leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized = ${payload.leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized ?? false}
leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized = ${payload.leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized ?? false}
leanConcreteCookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormalized = ${payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormalized ?? false}
leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized = ${payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized ?? false}
leanConcreteCookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized = ${payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized ?? false}
leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized = ${payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized ?? false}
leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized = ${payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized ?? false}
leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized = ${payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized ?? false}
leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePrefixFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePrefixFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePaddingRunFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePaddingRunFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePaddingRunAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderFourthClausePaddingRunAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderFourthClausePaddingRunCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePaddingRunCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePaddingRunExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePaddingRunExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePaddingRunExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePaddingRunExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePaddingRunRemainingPaddingCountFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePaddingRunRemainingPaddingCountFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePaddingRunDirectPaddingBlockFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePaddingRunDirectPaddingBlockFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized ?? false}
leanConcreteCookLevinBuilderFourthClausePaddingRunInputPrefixAppenderComposed = ${payload.leanConcreteCookLevinBuilderFourthClausePaddingRunInputPrefixAppenderComposed ?? false}
leanConcreteCookLevinBuilderFourthClausePaddingRunFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderFourthClausePaddingRunFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderFifthClausePaddingRunFormalized = ${payload.leanConcreteCookLevinBuilderFifthClausePaddingRunFormalized ?? false}
leanConcreteCookLevinBuilderFifthClausePaddingRunAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderFifthClausePaddingRunAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderFifthClausePaddingRunCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderFifthClausePaddingRunCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderFifthClausePaddingRunExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderFifthClausePaddingRunExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderFifthClausePaddingRunExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderFifthClausePaddingRunExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderFifthClausePaddingRunPaddingCountFormalized = ${payload.leanConcreteCookLevinBuilderFifthClausePaddingRunPaddingCountFormalized ?? false}
leanConcreteCookLevinBuilderFifthClausePaddingRunDirectPaddingBlockFormalized = ${payload.leanConcreteCookLevinBuilderFifthClausePaddingRunDirectPaddingBlockFormalized ?? false}
leanConcreteCookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized = ${payload.leanConcreteCookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized ?? false}
leanConcreteCookLevinBuilderFifthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderFifthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized = ${payload.leanConcreteCookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized ?? false}
leanConcreteCookLevinBuilderFifthClausePaddingRunInputPrefixAppenderComposed = ${payload.leanConcreteCookLevinBuilderFifthClausePaddingRunInputPrefixAppenderComposed ?? false}
leanConcreteCookLevinBuilderFifthClausePaddingRunFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderFifthClausePaddingRunFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderFirstConstraintPaddingRunFormalized = ${payload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunFormalized ?? false}
leanConcreteCookLevinBuilderFirstConstraintPaddingRunAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderFirstConstraintPaddingRunCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderFirstConstraintPaddingRunExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderFirstConstraintPaddingRunExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderFirstConstraintPaddingRunPaddingCountFormalized = ${payload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunPaddingCountFormalized ?? false}
leanConcreteCookLevinBuilderFirstConstraintPaddingRunDirectPaddingBlockFormalized = ${payload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunDirectPaddingBlockFormalized ?? false}
leanConcreteCookLevinBuilderFirstConstraintPaddingRunSecondConstraintSeparatorFormalized = ${payload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunSecondConstraintSeparatorFormalized ?? false}
leanConcreteCookLevinBuilderFirstConstraintPaddingRunRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderFirstConstraintPaddingRunNoEmissionSpecificationFormalized = ${payload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunNoEmissionSpecificationFormalized ?? false}
leanConcreteCookLevinBuilderFirstConstraintPaddingRunInputPrefixAppenderComposed = ${payload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunInputPrefixAppenderComposed ?? false}
leanConcreteCookLevinBuilderFirstConstraintPaddingRunFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderFirstConstraintPaddingRunFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeparatorStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeparatorStepSecondConstraintSeparatorFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepSecondConstraintSeparatorFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeparatorStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeparatorStepInputPrefixAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepInputPrefixAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepSecondConstraintFirstLiteralSignFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepSecondConstraintFirstLiteralSignFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepInputPrefixAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepInputPrefixAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSecondConstraintFirstLiteralFirstUnaryUnitFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSecondConstraintFirstLiteralFirstUnaryUnitFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepInputPrefixAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepInputPrefixAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondConstraintFirstLiteralSecondUnaryUnitFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondConstraintFirstLiteralSecondUnaryUnitFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepInputPrefixAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepInputPrefixAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepSecondConstraintFirstLiteralThirdUnaryUnitFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepSecondConstraintFirstLiteralThirdUnaryUnitFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepInputPrefixAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepInputPrefixAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepSecondConstraintFirstLiteralTerminatorFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepSecondConstraintFirstLiteralTerminatorFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepInputPrefixAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepInputPrefixAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSecondConstraintFirstLiteralSuccessorTokenFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSecondConstraintFirstLiteralSuccessorTokenFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepInputPrefixAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepInputPrefixAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepPaddingOrUnaryOpportunityFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepPaddingOrUnaryOpportunityFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFourthPaddingOrUnaryOpportunityFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFourthPaddingOrUnaryOpportunityFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFifthPaddingOrTerminatorOpportunityFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFifthPaddingOrTerminatorOpportunityFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepInputPrefixOptionalTerminatorAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepInputPrefixOptionalTerminatorAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepSixthPaddingOrOpeningUnaryOpportunityFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepSixthPaddingOrOpeningUnaryOpportunityFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepInputPrefixOptionalAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepInputPrefixOptionalAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepSeventhPaddingOrUnaryOpportunityFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepSeventhPaddingOrUnaryOpportunityFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized ?? false}
leanLockedNANDCarrierLayoutFormalized = ${payload.leanLockedNANDCarrierLayoutFormalized ?? false}
leanLockedNANDCarrierTraceAxiomAuditPassed = ${payload.leanLockedNANDCarrierTraceAxiomAuditPassed ?? false}
leanLockedNANDCarrierTraceAuditedDeclarationCount = ${payload.leanLockedNANDCarrierTraceAuditedDeclarationCount ?? 0}
leanLockedNANDCarrierTraceScope = ${payload.leanLockedNANDCarrierTraceScope ?? 'null'}
leanLockedNANDGlobalCandidateAssemblyFormalized = ${payload.leanLockedNANDGlobalCandidateAssemblyFormalized ?? false}
leanLockedNANDGlobalBaselineCandidateFormalized = ${payload.leanLockedNANDGlobalBaselineCandidateFormalized ?? false}
leanLockedNANDGlobalCandidateAxiomAuditPassed = ${payload.leanLockedNANDGlobalCandidateAxiomAuditPassed ?? false}
leanLockedNANDGlobalCandidateAuditedDeclarationCount = ${payload.leanLockedNANDGlobalCandidateAuditedDeclarationCount ?? 0}
leanLockedNANDGlobalCandidateScope = ${payload.leanLockedNANDGlobalCandidateScope ?? 'null'}
leanLockedNANDGlobalBaselineDistinctFormalized = ${payload.leanLockedNANDGlobalBaselineDistinctFormalized ?? false}
leanLockedNANDGlobalBaselineDistinctAxiomAuditPassed = ${payload.leanLockedNANDGlobalBaselineDistinctAxiomAuditPassed ?? false}
leanLockedNANDGlobalBaselineDistinctAuditedDeclarationCount = ${payload.leanLockedNANDGlobalBaselineDistinctAuditedDeclarationCount ?? 0}
leanLockedNANDGlobalBaselineDistinctScope = ${payload.leanLockedNANDGlobalBaselineDistinctScope ?? 'null'}
leanLockedNANDUnsatisfiableFinalZeroFormalized = ${payload.leanLockedNANDUnsatisfiableFinalZeroFormalized ?? false}
leanLockedNANDUnsatisfiableFinalZeroAxiomAuditPassed = ${payload.leanLockedNANDUnsatisfiableFinalZeroAxiomAuditPassed ?? false}
leanLockedNANDUnsatisfiableFinalZeroAuditedDeclarationCount = ${payload.leanLockedNANDUnsatisfiableFinalZeroAuditedDeclarationCount ?? 0}
leanLockedNANDUnsatisfiableFinalZeroScope = ${payload.leanLockedNANDUnsatisfiableFinalZeroScope ?? 'null'}
leanConcreteLockedNANDParserMachineFormalized = ${payload.leanConcreteLockedNANDParserMachineFormalized ?? false}
leanConcreteLockedNANDParserAxiomAuditPassed = ${payload.leanConcreteLockedNANDParserAxiomAuditPassed ?? false}
leanConcreteLockedNANDParserAuditedDeclarationCount = ${payload.leanConcreteLockedNANDParserAuditedDeclarationCount ?? 0}
leanConcreteLockedNANDParserAllInputExactFormalized = ${payload.leanConcreteLockedNANDParserAllInputExactFormalized ?? false}
leanConcreteLockedNANDParserExactOutputFormalized = ${payload.leanConcreteLockedNANDParserExactOutputFormalized ?? false}
leanConcreteLockedNANDParserCompiledNonTimeoutFormalized = ${payload.leanConcreteLockedNANDParserCompiledNonTimeoutFormalized ?? false}
leanConcreteLockedNANDParserPolynomialTimeMachineFormalized = ${payload.leanConcreteLockedNANDParserPolynomialTimeMachineFormalized ?? false}
leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized = ${payload.leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized ?? false}
leanConcreteLockedNANDParserRawRefinementFormalized = ${payload.leanConcreteLockedNANDParserRawRefinementFormalized ?? false}
leanConcreteLockedNANDParserScope = ${payload.leanConcreteLockedNANDParserScope ?? 'null'}
leanConcreteLockedNANDEmitterMachineFormalized = ${payload.leanConcreteLockedNANDEmitterMachineFormalized ?? false}
leanConcreteLockedNANDEmitterAxiomAuditPassed = ${payload.leanConcreteLockedNANDEmitterAxiomAuditPassed ?? false}
leanConcreteLockedNANDEmitterAuditedDeclarationCount = ${payload.leanConcreteLockedNANDEmitterAuditedDeclarationCount ?? 0}
leanConcreteLockedNANDEmitterAllInputExactFormalized = ${payload.leanConcreteLockedNANDEmitterAllInputExactFormalized ?? false}
leanConcreteLockedNANDEmitterExactTargetBytesFormalized = ${payload.leanConcreteLockedNANDEmitterExactTargetBytesFormalized ?? false}
leanConcreteLockedNANDEmitterCompiledNonTimeoutFormalized = ${payload.leanConcreteLockedNANDEmitterCompiledNonTimeoutFormalized ?? false}
leanConcreteLockedNANDEmitterPolynomialTimeMachineFormalized = ${payload.leanConcreteLockedNANDEmitterPolynomialTimeMachineFormalized ?? false}
leanConcreteLockedNANDEmitterPolynomialTimeFunctionFormalized = ${payload.leanConcreteLockedNANDEmitterPolynomialTimeFunctionFormalized ?? false}
leanConcreteLockedNANDEmitterRawRefinementFormalized = ${payload.leanConcreteLockedNANDEmitterRawRefinementFormalized ?? false}
leanConcreteLockedNANDEmitterStrictParserCompositionFormalized = ${payload.leanConcreteLockedNANDEmitterStrictParserCompositionFormalized ?? false}
leanConcreteLockedNANDEmitterOutputSizeBoundFormalized = ${payload.leanConcreteLockedNANDEmitterOutputSizeBoundFormalized ?? false}
leanConcreteLockedNANDEmitterScope = ${payload.leanConcreteLockedNANDEmitterScope ?? 'null'}
leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepThirdPaddingOrUnaryOpportunityFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepThirdPaddingOrUnaryOpportunityFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAxiomAuditPassed = ${payload.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAxiomAuditPassed ?? false}
leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepSecondPaddingOrUnaryOpportunityFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepSecondPaddingOrUnaryOpportunityFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized ?? false}
leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed = ${payload.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed ?? false}
leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized = ${payload.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized ?? false}
leanConcreteCNFToNANDSemanticCompilerFormalized = ${payload.leanConcreteCNFToNANDSemanticCompilerFormalized ?? false}
leanConcreteCNFToNANDSemanticCompilerAxiomAuditPassed = ${payload.leanConcreteCNFToNANDSemanticCompilerAxiomAuditPassed ?? false}
leanConcreteCNFToNANDSemanticCompilerAuditedDeclarationCount = ${payload.leanConcreteCNFToNANDSemanticCompilerAuditedDeclarationCount ?? 0}
leanConcreteCNFToNANDExactCodecCanonicalityFormalized = ${payload.leanConcreteCNFToNANDExactCodecCanonicalityFormalized ?? false}
leanConcreteCNFToNANDTypedTopologicalCompilationFormalized = ${payload.leanConcreteCNFToNANDTypedTopologicalCompilationFormalized ?? false}
leanConcreteCNFToNANDWellFormedOutputFormalized = ${payload.leanConcreteCNFToNANDWellFormedOutputFormalized ?? false}
leanConcreteCNFToNANDExactSemanticsFormalized = ${payload.leanConcreteCNFToNANDExactSemanticsFormalized ?? false}
leanConcreteCNFToNANDEdgeSemanticsFormalized = ${payload.leanConcreteCNFToNANDEdgeSemanticsFormalized ?? false}
leanConcreteCNFToNANDExactGateCountFormalized = ${payload.leanConcreteCNFToNANDExactGateCountFormalized ?? false}
leanConcreteCNFToNANDPolynomialOutputSizeBoundFormalized = ${payload.leanConcreteCNFToNANDPolynomialOutputSizeBoundFormalized ?? false}
leanConcreteCNFToNANDAllBitstringFailClosedFormalized = ${payload.leanConcreteCNFToNANDAllBitstringFailClosedFormalized ?? false}
leanConcreteCNFToNANDLockedThresholdCompositionFormalized = ${payload.leanConcreteCNFToNANDLockedThresholdCompositionFormalized ?? false}
leanConcreteCNFToNANDFiniteMachineFormalized = ${payload.leanConcreteCNFToNANDFiniteMachineFormalized ?? false}
leanConcreteCNFToNANDPolynomialTimeFunctionFormalized = ${payload.leanConcreteCNFToNANDPolynomialTimeFunctionFormalized ?? false}
leanConcreteCNFToNANDPolynomialReductionFormalized = ${payload.leanConcreteCNFToNANDPolynomialReductionFormalized ?? false}
leanConcreteCNFToNANDPolynomialReductionAxiomAuditPassed = ${payload.leanConcreteCNFToNANDPolynomialReductionAxiomAuditPassed ?? false}
leanConcreteCNFToNANDPolynomialReductionAuditedDeclarationCount = ${payload.leanConcreteCNFToNANDPolynomialReductionAuditedDeclarationCount ?? 0}
leanConcreteCNFToNANDAllInputExactFormalized = ${payload.leanConcreteCNFToNANDAllInputExactFormalized ?? false}
leanConcreteCNFToNANDExactMachineOutputFormalized = ${payload.leanConcreteCNFToNANDExactMachineOutputFormalized ?? false}
leanConcreteCNFToNANDCompiledNonTimeoutFormalized = ${payload.leanConcreteCNFToNANDCompiledNonTimeoutFormalized ?? false}
leanConcreteCNFToNANDRawRefinementFormalized = ${payload.leanConcreteCNFToNANDRawRefinementFormalized ?? false}
leanConcreteCNFToNANDDirectReductionFormalized = ${payload.leanConcreteCNFToNANDDirectReductionFormalized ?? false}
leanConcreteCNFToNANDLockedReductionCompositionFormalized = ${payload.leanConcreteCNFToNANDLockedReductionCompositionFormalized ?? false}
leanResidualTerminalFullBridgeFormalized = ${payload.leanResidualTerminalFullBridgeFormalized ?? false}
leanResidualTerminalFullBridgeAxiomAuditPassed = ${payload.leanResidualTerminalFullBridgeAxiomAuditPassed ?? false}
leanResidualTerminalQuotientCarrierFormalized = ${payload.leanResidualTerminalQuotientCarrierFormalized ?? false}
leanResidualTerminalModeFirewallFormalized = ${payload.leanResidualTerminalModeFirewallFormalized ?? false}
leanResidualTerminalModeFirewallAxiomAuditPassed = ${payload.leanResidualTerminalModeFirewallAxiomAuditPassed ?? false}
leanResidualTerminalProfileProjectionExactFormalized = ${payload.leanResidualTerminalProfileProjectionExactFormalized ?? false}
leanResidualTerminalCheckedFullLiftFormalized = ${payload.leanResidualTerminalCheckedFullLiftFormalized ?? false}
leanResidualTerminalQuotientEqualityNotConstructiveFormalized = ${payload.leanResidualTerminalQuotientEqualityNotConstructiveFormalized ?? false}
leanResidualTerminalObligationDischargePreservedFormalized = ${payload.leanResidualTerminalObligationDischargePreservedFormalized ?? false}
leanResidualProjectionMinimumFormalized = ${payload.leanResidualProjectionMinimumFormalized ?? false}
leanResidualProjectionMinimumAxiomAuditPassed = ${payload.leanResidualProjectionMinimumAxiomAuditPassed ?? false}
leanResidualProjectionMinimumExecutableFullScanFormalized = ${payload.leanResidualProjectionMinimumExecutableFullScanFormalized ?? false}
leanResidualProjectionMinimumExecutableQuotientScanFormalized = ${payload.leanResidualProjectionMinimumExecutableQuotientScanFormalized ?? false}
leanResidualProjectionMinimumAttainmentFormalized = ${payload.leanResidualProjectionMinimumAttainmentFormalized ?? false}
leanResidualProjectionMinimumUniversalLowerBoundsFormalized = ${payload.leanResidualProjectionMinimumUniversalLowerBoundsFormalized ?? false}
leanResidualProjectionMinimumMonotonicityFormalized = ${payload.leanResidualProjectionMinimumMonotonicityFormalized ?? false}
leanResidualProjectionDefectDecompositionFormalized = ${payload.leanResidualProjectionDefectDecompositionFormalized ?? false}
leanResidualProjectionDefectZeroIffCheckedLiftAtMinimumFormalized = ${payload.leanResidualProjectionDefectZeroIffCheckedLiftAtMinimumFormalized ?? false}
leanResidualProjectionTransferFormalized = ${payload.leanResidualProjectionTransferFormalized ?? false}
leanResidualProjectionTransferAxiomAuditPassed = ${payload.leanResidualProjectionTransferAxiomAuditPassed ?? false}
leanResidualProjectionTransferSignedDeltasFormalized = ${payload.leanResidualProjectionTransferSignedDeltasFormalized ?? false}
leanResidualProjectionTransferIdentityFormalized = ${payload.leanResidualProjectionTransferIdentityFormalized ?? false}
leanResidualProjectionTransferConstantCutFormalized = ${payload.leanResidualProjectionTransferConstantCutFormalized ?? false}
leanResidualTerminalProperSupportFormalized = ${payload.leanResidualTerminalProperSupportFormalized ?? false}
leanResidualTerminalProperSupportSearchCompleteFormalized = ${payload.leanResidualTerminalProperSupportSearchCompleteFormalized ?? false}
leanResidualTerminalProperSupportExactLocalGainFormalized = ${payload.leanResidualTerminalProperSupportExactLocalGainFormalized ?? false}
leanResidualTerminalProperSupportAxiomAuditPassed = ${payload.leanResidualTerminalProperSupportAxiomAuditPassed ?? false}
leanResidualTerminalProperSupportScope = ${payload.leanResidualTerminalProperSupportScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalProperSupportScope)}
leanResidualTerminalSupportSquareClosureFormalized = ${payload.leanResidualTerminalSupportSquareClosureFormalized ?? false}
leanResidualTerminalSupportSquareMeetJoinExactFormalized = ${payload.leanResidualTerminalSupportSquareMeetJoinExactFormalized ?? false}
leanResidualTerminalSupportSquarePhysicalCompatibilityFormalized = ${payload.leanResidualTerminalSupportSquarePhysicalCompatibilityFormalized ?? false}
leanResidualTerminalSupportSquareSemanticExtractionFormalized = ${payload.leanResidualTerminalSupportSquareSemanticExtractionFormalized ?? false}
leanResidualTerminalSupportSquareClosureAxiomAuditPassed = ${payload.leanResidualTerminalSupportSquareClosureAxiomAuditPassed ?? false}
leanResidualTerminalSupportSquareClosureScope = ${payload.leanResidualTerminalSupportSquareClosureScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalSupportSquareClosureScope)}
leanResidualTerminalGovernedSupportCompletionFormalized = ${payload.leanResidualTerminalGovernedSupportCompletionFormalized ?? false}
leanResidualTerminalGovernedProfilePartitionFormalized = ${payload.leanResidualTerminalGovernedProfilePartitionFormalized ?? false}
leanResidualTerminalGovernedSupportCompletionAxiomAuditPassed = ${payload.leanResidualTerminalGovernedSupportCompletionAxiomAuditPassed ?? false}
leanResidualTerminalGovernedSupportCompletionScope = ${payload.leanResidualTerminalGovernedSupportCompletionScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalGovernedSupportCompletionScope)}
leanResidualTerminalFrontierPushoutFormalized = ${payload.leanResidualTerminalFrontierPushoutFormalized ?? false}
leanResidualTerminalFrontierBoundaryGlueExactFormalized = ${payload.leanResidualTerminalFrontierBoundaryGlueExactFormalized ?? false}
leanResidualTerminalFrontierInterfaceGlueExactFormalized = ${payload.leanResidualTerminalFrontierInterfaceGlueExactFormalized ?? false}
leanResidualTerminalFrontierProfileGlueExactFormalized = ${payload.leanResidualTerminalFrontierProfileGlueExactFormalized ?? false}
leanResidualTerminalFrontierInternalizationFormalized = ${payload.leanResidualTerminalFrontierInternalizationFormalized ?? false}
leanResidualTerminalFrontierPushoutAxiomAuditPassed = ${payload.leanResidualTerminalFrontierPushoutAxiomAuditPassed ?? false}
leanResidualTerminalFrontierPushoutScope = ${payload.leanResidualTerminalFrontierPushoutScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalFrontierPushoutScope)}
leanResidualTerminalSaturationFormalized = ${payload.leanResidualTerminalSaturationFormalized ?? false}
leanResidualTerminalSaturationAxiomAuditPassed = ${payload.leanResidualTerminalSaturationAxiomAuditPassed ?? false}
leanResidualTerminalPrimitiveUniverseFormalized = ${payload.leanResidualTerminalPrimitiveUniverseFormalized ?? false}
leanResidualTerminalSaturationExtensiveFormalized = ${payload.leanResidualTerminalSaturationExtensiveFormalized ?? false}
leanResidualTerminalSaturationLeastFormalized = ${payload.leanResidualTerminalSaturationLeastFormalized ?? false}
leanResidualTerminalSaturationMonotoneFormalized = ${payload.leanResidualTerminalSaturationMonotoneFormalized ?? false}
leanResidualTerminalSaturationIdempotentFormalized = ${payload.leanResidualTerminalSaturationIdempotentFormalized ?? false}
leanResidualTerminalExecutableSaturationFormalized = ${payload.leanResidualTerminalExecutableSaturationFormalized ?? false}
leanResidualTerminalPhysicalSupportCompletionFormalized = ${payload.leanResidualTerminalPhysicalSupportCompletionFormalized ?? false}
leanResidualTerminalPhysicalBoundaryFormalized = ${payload.leanResidualTerminalPhysicalBoundaryFormalized ?? false}
leanResidualTerminalPhysicalInterfaceFormalized = ${payload.leanResidualTerminalPhysicalInterfaceFormalized ?? false}
leanResidualTerminalPhysicalCompatibilityFormalized = ${payload.leanResidualTerminalPhysicalCompatibilityFormalized ?? false}
leanResidualTerminalPhysicalSupportCompletionAxiomAuditPassed = ${payload.leanResidualTerminalPhysicalSupportCompletionAxiomAuditPassed ?? false}
leanResidualTerminalPhysicalSupportCompletionScope = ${payload.leanResidualTerminalPhysicalSupportCompletionScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalPhysicalSupportCompletionScope)}
leanResidualTerminalSupportExtractionFormalized = ${payload.leanResidualTerminalSupportExtractionFormalized ?? false}
leanResidualTerminalSupportExtractionAxiomAuditPassed = ${payload.leanResidualTerminalSupportExtractionAxiomAuditPassed ?? false}
leanResidualTerminalSupportExtractionScope = ${payload.leanResidualTerminalSupportExtractionScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalSupportExtractionScope)}
leanResidualTerminalOpenSemanticsFormalized = ${payload.leanResidualTerminalOpenSemanticsFormalized ?? false}
leanResidualTerminalInducedRecoveryFormalized = ${payload.leanResidualTerminalInducedRecoveryFormalized ?? false}
leanResidualTerminalSupportCompletionFormalized = ${payload.leanResidualTerminalSupportCompletionFormalized ?? false}
leanResidualTerminalSquareLegitimacyFormalized = ${payload.leanResidualTerminalSquareLegitimacyFormalized ?? false}
leanResidualTerminalSquareStructuralCompatibilityFormalized = ${payload.leanResidualTerminalSquareStructuralCompatibilityFormalized ?? false}
leanResidualTerminalSquareFrontierPushoutFormalized = ${payload.leanResidualTerminalSquareFrontierPushoutFormalized ?? false}
leanResidualTerminalSquareSharedQuantityCarrierFormalized = ${payload.leanResidualTerminalSquareSharedQuantityCarrierFormalized ?? false}
leanResidualTerminalSquareLocalConclusionUnderRouteSilenceFormalized = ${payload.leanResidualTerminalSquareLocalConclusionUnderRouteSilenceFormalized ?? false}
leanResidualTerminalSquareFailClosedRouteDichotomyFormalized = ${payload.leanResidualTerminalSquareFailClosedRouteDichotomyFormalized ?? false}
leanResidualTerminalSquareLegitimacyAxiomAuditPassed = ${payload.leanResidualTerminalSquareLegitimacyAxiomAuditPassed ?? false}
leanResidualTerminalSquareLegitimacyScope = ${payload.leanResidualTerminalSquareLegitimacyScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalSquareLegitimacyScope)}
leanResidualTerminalComputedBCELAnchorNucleusFormalized = ${payload.leanResidualTerminalComputedBCELAnchorNucleusFormalized ?? false}
leanResidualTerminalBCELMinimumPositiveNucleusFormalized = ${payload.leanResidualTerminalBCELMinimumPositiveNucleusFormalized ?? false}
leanResidualTerminalBCELAnchorAlgebraFormalized = ${payload.leanResidualTerminalBCELAnchorAlgebraFormalized ?? false}
leanResidualTerminalBCELCutDefectFirewallFormalized = ${payload.leanResidualTerminalBCELCutDefectFirewallFormalized ?? false}
leanResidualTerminalBCELCutRouteDichotomyFormalized = ${payload.leanResidualTerminalBCELCutRouteDichotomyFormalized ?? false}
leanResidualTerminalBCELConstantCutConclusionFormalized = ${payload.leanResidualTerminalBCELConstantCutConclusionFormalized ?? false}
leanResidualTerminalBCELAnchorNucleusAxiomAuditPassed = ${payload.leanResidualTerminalBCELAnchorNucleusAxiomAuditPassed ?? false}
leanResidualTerminalBCELAnchorNucleusScope = ${payload.leanResidualTerminalBCELAnchorNucleusScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalBCELAnchorNucleusScope)}
leanResidualTerminalSaturationPositivityFirewallFormalized = ${payload.leanResidualTerminalSaturationPositivityFirewallFormalized ?? false}
leanResidualTerminalSaturationPositivityFirewallAxiomAuditPassed = ${payload.leanResidualTerminalSaturationPositivityFirewallAxiomAuditPassed ?? false}
leanResidualTerminalSaturationPositivityFirewallScope = ${payload.leanResidualTerminalSaturationPositivityFirewallScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalSaturationPositivityFirewallScope)}
leanResidualTerminalCandidateSaturationFormalized = ${payload.leanResidualTerminalCandidateSaturationFormalized ?? false}
leanResidualTerminalSaturationCostBalanceFormalized = ${payload.leanResidualTerminalSaturationCostBalanceFormalized ?? false}
leanResidualTerminalFirstNontransparentStepFormalized = ${payload.leanResidualTerminalFirstNontransparentStepFormalized ?? false}
leanResidualTerminalSaturationCostBalanceAxiomAuditPassed = ${payload.leanResidualTerminalSaturationCostBalanceAxiomAuditPassed ?? false}
leanResidualTerminalSaturationCostBalanceScope = ${payload.leanResidualTerminalSaturationCostBalanceScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalSaturationCostBalanceScope)}
leanResidualTerminalInterfaceExposureRoutingFormalized = ${payload.leanResidualTerminalInterfaceExposureRoutingFormalized ?? false}
leanResidualTerminalFiniteInterfaceExposureRoutesToEFormalized = ${payload.leanResidualTerminalFiniteInterfaceExposureRoutesToEFormalized ?? false}
leanResidualTerminalInterfaceExposureZeroCostRetractFormalized = ${payload.leanResidualTerminalInterfaceExposureZeroCostRetractFormalized ?? false}
leanResidualTerminalFirstInterfaceExposureRouteFormalized = ${payload.leanResidualTerminalFirstInterfaceExposureRouteFormalized ?? false}
leanResidualTerminalInterfaceExposureRoutingAxiomAuditPassed = ${payload.leanResidualTerminalInterfaceExposureRoutingAxiomAuditPassed ?? false}
leanResidualTerminalInterfaceExposureRoutingScope = ${payload.leanResidualTerminalInterfaceExposureRoutingScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalInterfaceExposureRoutingScope)}
leanResidualTerminalOriginKernelObligationRoutingFormalized = ${payload.leanResidualTerminalOriginKernelObligationRoutingFormalized ?? false}
leanResidualTerminalFiniteOriginKernelObligationClosureRoutedFormalized = ${payload.leanResidualTerminalFiniteOriginKernelObligationClosureRoutedFormalized ?? false}
leanResidualTerminalFirstOriginKernelObligationRouteFormalized = ${payload.leanResidualTerminalFirstOriginKernelObligationRouteFormalized ?? false}
leanResidualTerminalOriginKernelObligationRoutingAxiomAuditPassed = ${payload.leanResidualTerminalOriginKernelObligationRoutingAxiomAuditPassed ?? false}
leanResidualTerminalOriginKernelObligationRoutingScope = ${payload.leanResidualTerminalOriginKernelObligationRoutingScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalOriginKernelObligationRoutingScope)}
leanResidualTerminalFiniteSaturatePositiveCompositionFormalized = ${payload.leanResidualTerminalFiniteSaturatePositiveCompositionFormalized ?? false}
leanResidualTerminalFiniteSaturatePositiveCompositionAxiomAuditPassed = ${payload.leanResidualTerminalFiniteSaturatePositiveCompositionAxiomAuditPassed ?? false}
leanResidualTerminalFiniteSaturatePositiveCompositionScope = ${payload.leanResidualTerminalFiniteSaturatePositiveCompositionScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalFiniteSaturatePositiveCompositionScope)}
leanResidualTerminalRankWFFormalized = ${payload.leanResidualTerminalRankWFFormalized ?? false}
leanResidualTerminalRankWFAxiomAuditPassed = ${payload.leanResidualTerminalRankWFAxiomAuditPassed ?? false}
leanResidualTerminalRankWFScope = ${payload.leanResidualTerminalRankWFScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalRankWFScope)}
leanResidualTerminalBN3RequestEnvelopeFormalized = ${payload.leanResidualTerminalBN3RequestEnvelopeFormalized ?? false}
leanResidualTerminalBN3RequestEnvelopeAxiomAuditPassed = ${payload.leanResidualTerminalBN3RequestEnvelopeAxiomAuditPassed ?? false}
leanResidualTerminalBN3RequestEnvelopeScope = ${payload.leanResidualTerminalBN3RequestEnvelopeScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalBN3RequestEnvelopeScope)}
leanResidualTerminalBN4ActivationCancellationFormalized = ${payload.leanResidualTerminalBN4ActivationCancellationFormalized ?? false}
leanResidualTerminalBN4ActivationCancellationAxiomAuditPassed = ${payload.leanResidualTerminalBN4ActivationCancellationAxiomAuditPassed ?? false}
leanResidualTerminalBN4ActivationCancellationScope = ${payload.leanResidualTerminalBN4ActivationCancellationScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalBN4ActivationCancellationScope)}
leanResidualTerminalBN5FullShadowLocalizationFormalized = ${payload.leanResidualTerminalBN5FullShadowLocalizationFormalized ?? false}
leanResidualTerminalBN5FullShadowLocalizationAxiomAuditPassed = ${payload.leanResidualTerminalBN5FullShadowLocalizationAxiomAuditPassed ?? false}
leanResidualTerminalBN5FullShadowLocalizationScope = ${payload.leanResidualTerminalBN5FullShadowLocalizationScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalBN5FullShadowLocalizationScope)}
leanResidualTerminalPkgCSeparatingConsumersFormalized = ${payload.leanResidualTerminalPkgCSeparatingConsumersFormalized ?? false}
leanResidualTerminalPkgCSeparatingConsumersAxiomAuditPassed = ${payload.leanResidualTerminalPkgCSeparatingConsumersAxiomAuditPassed ?? false}
leanResidualTerminalPkgCSeparatingConsumersScope = ${payload.leanResidualTerminalPkgCSeparatingConsumersScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalPkgCSeparatingConsumersScope)}
leanResidualTerminalPkgCTypedRestorationFormalized = ${payload.leanResidualTerminalPkgCTypedRestorationFormalized ?? false}
leanResidualTerminalPkgCTypedRestorationAxiomAuditPassed = ${payload.leanResidualTerminalPkgCTypedRestorationAxiomAuditPassed ?? false}
leanResidualTerminalPkgCTypedRestorationScope = ${payload.leanResidualTerminalPkgCTypedRestorationScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalPkgCTypedRestorationScope)}
leanResidualTerminalPkgCSameKeyCancellationFormalized = ${payload.leanResidualTerminalPkgCSameKeyCancellationFormalized ?? false}
leanResidualTerminalPkgCSameKeyCancellationAxiomAuditPassed = ${payload.leanResidualTerminalPkgCSameKeyCancellationAxiomAuditPassed ?? false}
leanResidualTerminalPkgCSameKeyCancellationScope = ${payload.leanResidualTerminalPkgCSameKeyCancellationScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalPkgCSameKeyCancellationScope)}
leanResidualTerminalPkgCAmbientBN4LedgerFormalized = ${payload.leanResidualTerminalPkgCAmbientBN4LedgerFormalized ?? false}
leanResidualTerminalPkgCAmbientBN4LedgerAxiomAuditPassed = ${payload.leanResidualTerminalPkgCAmbientBN4LedgerAxiomAuditPassed ?? false}
leanResidualTerminalPkgCAmbientBN4LedgerScope = ${payload.leanResidualTerminalPkgCAmbientBN4LedgerScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalPkgCAmbientBN4LedgerScope)}
leanResidualTerminalPkgCAmbientBN4ResidualReductionFormalized = ${payload.leanResidualTerminalPkgCAmbientBN4ResidualReductionFormalized ?? false}
leanResidualTerminalPkgCAmbientBN4ResidualReductionAxiomAuditPassed = ${payload.leanResidualTerminalPkgCAmbientBN4ResidualReductionAxiomAuditPassed ?? false}
leanResidualTerminalPkgCAmbientBN4ResidualReductionScope = ${payload.leanResidualTerminalPkgCAmbientBN4ResidualReductionScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalPkgCAmbientBN4ResidualReductionScope)}
leanResidualTerminalConsumerAntichainNormalFormFormalized = ${payload.leanResidualTerminalConsumerAntichainNormalFormFormalized ?? false}
leanResidualTerminalConsumerAntichainNormalFormAxiomAuditPassed = ${payload.leanResidualTerminalConsumerAntichainNormalFormAxiomAuditPassed ?? false}
leanResidualTerminalConsumerAntichainNormalFormScope = ${payload.leanResidualTerminalConsumerAntichainNormalFormScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalConsumerAntichainNormalFormScope)}
leanResidualTerminalConstantCutHypergraphRigidityFormalized = ${payload.leanResidualTerminalConstantCutHypergraphRigidityFormalized ?? false}
leanResidualTerminalConstantCutHypergraphRigidityAxiomAuditPassed = ${payload.leanResidualTerminalConstantCutHypergraphRigidityAxiomAuditPassed ?? false}
leanResidualTerminalConstantCutHypergraphRigidityScope = ${payload.leanResidualTerminalConstantCutHypergraphRigidityScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalConstantCutHypergraphRigidityScope)}
leanResidualTerminalBN6HypergraphPacketFormalized = ${payload.leanResidualTerminalBN6HypergraphPacketFormalized ?? false}
leanResidualTerminalBN6HypergraphPacketAxiomAuditPassed = ${payload.leanResidualTerminalBN6HypergraphPacketAxiomAuditPassed ?? false}
leanResidualTerminalBN6HypergraphPacketScope = ${payload.leanResidualTerminalBN6HypergraphPacketScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalBN6HypergraphPacketScope)}
leanResidualTerminalPacketSelectorSeedsFormalized = ${payload.leanResidualTerminalPacketSelectorSeedsFormalized ?? false}
leanResidualTerminalPacketSelectorSeedsAxiomAuditPassed = ${payload.leanResidualTerminalPacketSelectorSeedsAxiomAuditPassed ?? false}
leanResidualTerminalPacketSelectorSeedsScope = ${payload.leanResidualTerminalPacketSelectorSeedsScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalPacketSelectorSeedsScope)}
leanResidualTerminalPacketSelectorUniverseFormalized = ${payload.leanResidualTerminalPacketSelectorUniverseFormalized ?? false}
leanResidualTerminalPacketSelectorUniverseAxiomAuditPassed = ${payload.leanResidualTerminalPacketSelectorUniverseAxiomAuditPassed ?? false}
leanResidualTerminalPacketSelectorUniverseScope = ${payload.leanResidualTerminalPacketSelectorUniverseScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalPacketSelectorUniverseScope)}
leanSaturatePositiveFormalized = ${payload.leanSaturatePositiveFormalized ?? false}
leanBCELReadyFormalized = ${payload.leanBCELReadyFormalized ?? false}
leanResidualTerminalProjectionSquareFormalized = ${payload.leanResidualTerminalProjectionSquareFormalized ?? false}
leanResidualTerminalProjectionPhysicalInvariantFormalized = ${payload.leanResidualTerminalProjectionPhysicalInvariantFormalized ?? false}
leanResidualTerminalProjectionProfileExactFormalized = ${payload.leanResidualTerminalProjectionProfileExactFormalized ?? false}
leanResidualTerminalProjectionMeetJoinCommuteFormalized = ${payload.leanResidualTerminalProjectionMeetJoinCommuteFormalized ?? false}
leanResidualTerminalProjectionPushoutCommuteFormalized = ${payload.leanResidualTerminalProjectionPushoutCommuteFormalized ?? false}
leanResidualTerminalProjectionSquareAxiomAuditPassed = ${payload.leanResidualTerminalProjectionSquareAxiomAuditPassed ?? false}
leanResidualTerminalProjectionSquareScope = ${payload.leanResidualTerminalProjectionSquareScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalProjectionSquareScope)}
leanResidualTerminalSideTightMinimumArithmeticFormalized = ${payload.leanResidualTerminalSideTightMinimumArithmeticFormalized ?? false}
leanResidualTerminalSideTightSignedSlackIdentityFormalized = ${payload.leanResidualTerminalSideTightSignedSlackIdentityFormalized ?? false}
leanResidualTerminalSideTightFailClosedGateFormalized = ${payload.leanResidualTerminalSideTightFailClosedGateFormalized ?? false}
leanResidualTerminalSideTightCanonicalFullBasisFormalized = ${payload.leanResidualTerminalSideTightCanonicalFullBasisFormalized ?? false}
leanResidualTerminalSideTightCanonicalQuotientBasisFormalized = ${payload.leanResidualTerminalSideTightCanonicalQuotientBasisFormalized ?? false}
leanResidualTerminalSideTightMinimumAxiomAuditPassed = ${payload.leanResidualTerminalSideTightMinimumAxiomAuditPassed ?? false}
leanResidualTerminalSideTightMinimumScope = ${payload.leanResidualTerminalSideTightMinimumScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalSideTightMinimumScope)}
leanResidualTerminalFourCornerCarrierTransportFormalized = ${payload.leanResidualTerminalFourCornerCarrierTransportFormalized ?? false}
leanResidualTerminalFourCornerCarrierExactEndpointsFormalized = ${payload.leanResidualTerminalFourCornerCarrierExactEndpointsFormalized ?? false}
leanResidualTerminalFourCornerCarrierInjectiveCoordinatesFormalized = ${payload.leanResidualTerminalFourCornerCarrierInjectiveCoordinatesFormalized ?? false}
leanResidualTerminalFourCornerCarrierProfileTransportFormalized = ${payload.leanResidualTerminalFourCornerCarrierProfileTransportFormalized ?? false}
leanResidualTerminalFourCornerCarrierFailClosedPhysicalTransportFormalized = ${payload.leanResidualTerminalFourCornerCarrierFailClosedPhysicalTransportFormalized ?? false}
leanResidualTerminalFourCornerCarrierAxiomAuditPassed = ${payload.leanResidualTerminalFourCornerCarrierAxiomAuditPassed ?? false}
leanResidualTerminalFourCornerCarrierScope = ${payload.leanResidualTerminalFourCornerCarrierScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalFourCornerCarrierScope)}
leanResidualTerminalFourCornerOptimaCarrierCompatibleFormalized = ${payload.leanResidualTerminalFourCornerOptimaCarrierCompatibleFormalized ?? false}
leanResidualTerminalFourCornerOptimaFaithfulAmbientizationFormalized = ${payload.leanResidualTerminalFourCornerOptimaFaithfulAmbientizationFormalized ?? false}
leanResidualTerminalFourCornerOptimaReferenceMinimumPreservedFormalized = ${payload.leanResidualTerminalFourCornerOptimaReferenceMinimumPreservedFormalized ?? false}
leanResidualTerminalFourCornerOptimaLocalizedMinimaFormalized = ${payload.leanResidualTerminalFourCornerOptimaLocalizedMinimaFormalized ?? false}
leanResidualTerminalFourCornerOptimaSharedObserverProjectionFormalized = ${payload.leanResidualTerminalFourCornerOptimaSharedObserverProjectionFormalized ?? false}
leanResidualTerminalFourCornerOptimaAxiomAuditPassed = ${payload.leanResidualTerminalFourCornerOptimaAxiomAuditPassed ?? false}
leanResidualTerminalFourCornerOptimaCarrierScope = ${payload.leanResidualTerminalFourCornerOptimaCarrierScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalFourCornerOptimaCarrierScope)}
leanResidualTerminalFourCornerOptimumCoherenceClassifierFormalized = ${payload.leanResidualTerminalFourCornerOptimumCoherenceClassifierFormalized ?? false}
leanResidualTerminalFourCornerOptimumFirstFailureFormalized = ${payload.leanResidualTerminalFourCornerOptimumFirstFailureFormalized ?? false}
leanResidualTerminalFourCornerOptimumRetainedSemanticsFormalized = ${payload.leanResidualTerminalFourCornerOptimumRetainedSemanticsFormalized ?? false}
leanResidualTerminalFourCornerOptimumProfileTransportFormalized = ${payload.leanResidualTerminalFourCornerOptimumProfileTransportFormalized ?? false}
leanResidualTerminalFourCornerOptimumModeFirewallFormalized = ${payload.leanResidualTerminalFourCornerOptimumModeFirewallFormalized ?? false}
leanResidualTerminalFourCornerOptimumSideTightTupleFactsFormalized = ${payload.leanResidualTerminalFourCornerOptimumSideTightTupleFactsFormalized ?? false}
leanResidualTerminalFourCornerOptimumCoherenceAxiomAuditPassed = ${payload.leanResidualTerminalFourCornerOptimumCoherenceAxiomAuditPassed ?? false}
leanResidualTerminalFourCornerOptimumCoherenceScope = ${payload.leanResidualTerminalFourCornerOptimumCoherenceScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalFourCornerOptimumCoherenceScope)}
leanResidualTerminalFourCornerOptimumLocalRouteClassifierFormalized = ${payload.leanResidualTerminalFourCornerOptimumLocalRouteClassifierFormalized ?? false}
leanResidualTerminalFourCornerOptimumRouteSoundnessFormalized = ${payload.leanResidualTerminalFourCornerOptimumRouteSoundnessFormalized ?? false}
leanResidualTerminalFourCornerOptimumRouteSilenceFormalized = ${payload.leanResidualTerminalFourCornerOptimumRouteSilenceFormalized ?? false}
leanResidualTerminalFourCornerOptimumSideTightCompletionUnderRouteSilenceFormalized = ${payload.leanResidualTerminalFourCornerOptimumSideTightCompletionUnderRouteSilenceFormalized ?? false}
leanResidualTerminalFourCornerOptimumExactCompletionValuesFormalized = ${payload.leanResidualTerminalFourCornerOptimumExactCompletionValuesFormalized ?? false}
leanResidualTerminalFourCornerOptimumPromotionFirewallRetained = ${payload.leanResidualTerminalFourCornerOptimumPromotionFirewallRetained ?? false}
leanResidualTerminalFourCornerSideTightCompletionAxiomAuditPassed = ${payload.leanResidualTerminalFourCornerSideTightCompletionAxiomAuditPassed ?? false}
leanResidualTerminalFourCornerSideTightCompletionScope = ${payload.leanResidualTerminalFourCornerSideTightCompletionScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalFourCornerSideTightCompletionScope)}
leanResidualTerminalFourCornerArbitraryFamilyCoherenceFormalized = ${payload.leanResidualTerminalFourCornerArbitraryFamilyCoherenceFormalized ?? false}
leanResidualTerminalFourCornerExactMinimumFamilyEnumerated = ${payload.leanResidualTerminalFourCornerExactMinimumFamilyEnumerated ?? false}
leanResidualTerminalFourCornerTightBasisFamilyComplete = ${payload.leanResidualTerminalFourCornerTightBasisFamilyComplete ?? false}
leanResidualTerminalFourCornerSignedTightBasisMaximumFormalized = ${payload.leanResidualTerminalFourCornerSignedTightBasisMaximumFormalized ?? false}
leanResidualTerminalFourCornerTightBasisMaximumEqualsDeltaFormalized = ${payload.leanResidualTerminalFourCornerTightBasisMaximumEqualsDeltaFormalized ?? false}
leanResidualTerminalFourCornerTightBasisMaximumAxiomAuditPassed = ${payload.leanResidualTerminalFourCornerTightBasisMaximumAxiomAuditPassed ?? false}
leanResidualTerminalFourCornerTightBasisMaximumScope = ${payload.leanResidualTerminalFourCornerTightBasisMaximumScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalFourCornerTightBasisMaximumScope)}
leanResidualTerminalCoherentFourCornerBasisFormalized = ${payload.leanResidualTerminalCoherentFourCornerBasisFormalized ?? false}
leanResidualTerminalCoherentFourCornerBasisScope = ${payload.leanResidualTerminalCoherentFourCornerBasisScope === null ? 'null' : JSON.stringify(payload.leanResidualTerminalCoherentFourCornerBasisScope)}

leanPCCMinPolynomialRuntimeFormalized = ${payload.leanPCCMinPolynomialRuntimeFormalized ?? false}
leanConcreteCNFSATInPFormalized = ${payload.leanConcreteCNFSATInPFormalized ?? false}
leanConcreteCNFNPCompletenessFormalized = ${payload.leanConcreteCNFNPCompletenessFormalized ?? false}
concretePublicationGate.passed = ${payload.concretePublicationGate?.passed ?? false}`;
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function isSha256(value) {
  return typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
}

function validateInventory(inventory) {
  if (inventory?.kind !== 'PNPLeanTheoremInventory0'
    || inventory.coordinate !== INVENTORY_COORDINATE
    || inventory.environmentProbeComplete !== true
    || inventory.rootModule !== 'PNP'
    || inventory.leanToolchain !== 'leanprover/lean4:v4.31.0'
    || inventory.declarationCount !== INVENTORY_COUNTS.declarations
    || inventory.theoremCount !== INVENTORY_COUNTS.theorems
    || inventory.assumptionFreeTheoremCount !== INVENTORY_COUNTS.assumptionFreeTheorems
    || inventory.excludedPrivateDeclarationCount !== INVENTORY_COUNTS.excludedPrivateDeclarations
    || inventory.sourceClosureModuleCount !== INVENTORY_COUNTS.modules
    || inventory.axiomCount !== INVENTORY_COUNTS.axioms
    || !sameJson(inventory.projectAxioms, PROJECT_AXIOMS)
    || inventory.compatibilityRootName !== 'PNP.Main.p_eq_np'
    || inventory.compatibilityRootCandidate !== null
    || inventory.concreteTargetName !== 'PNP.Main.ConcretePEqualsNP'
    || inventory.concreteTargetCandidate?.name !== 'PNP.Main.ConcretePEqualsNP'
    || inventory.concreteTargetCandidate.kind !== 'definition'
    || !sameJson(inventory.concreteTargetCandidate.axioms, [])
    || !Array.isArray(inventory.declarations)
    || inventory.declarations.length !== INVENTORY_COUNTS.declarations
    || !Array.isArray(inventory.sourceClosureModules)
    || inventory.sourceClosureModules.length !== INVENTORY_COUNTS.modules) return false;

  const kindCounts = inventory.declarationKindCounts;
  if (!kindCounts
    || Object.values(kindCounts).some((count) => !Number.isSafeInteger(count) || count < 0)
    || Object.values(kindCounts).reduce((total, count) => total + count, 0) !== INVENTORY_COUNTS.declarations
    || kindCounts.axiom !== INVENTORY_COUNTS.axioms
    || kindCounts.theorem !== INVENTORY_COUNTS.theorems) return false;

  const theoremRows = inventory.declarations.filter((row) => row?.kind === 'theorem');
  const membership = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.FinalUniversalDesign.cnfSATInNP');
  const cookLevinBridge = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_mem_CNFSAT_iff_language');
  const cookLevinFormulaSize = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.CookLevin.VerifierTableauProblem.encodedFormula_size_le');
  const cookLevinFormulaSchedule = [
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_length',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSchedule_emit_eq_encodedFormula',
  ].map((name) => inventory.milestoneCandidates?.find((row) => row?.name === name));
  const cookLevinFormulaCursor = [
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaConstraintSlotDirect_eq',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaClauseSlotDirect_eq',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaTokenSlotDirect_eq',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotDirect_eq',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.formulaBitSlotCountDirect_eq_polynomial',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_prefix',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_to_end',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.step_at_end',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_one_step_short',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.step_after_one_step_short',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_excess',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaBitCursor.run_full_emit_eq_encodedFormula',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaTokenCursor.step_at_end',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaTokenCursor.step_of_done',
    'PNP.Concrete.CookLevin.VerifierTableauProblem.FormulaTokenCursor.step_of_lt',
  ].map((name) => inventory.milestoneCandidates?.find((row) => row?.name === name));
  const cookLevinBuilderInputLength = [
    ['PNP.Concrete.CookLevin.BuilderInputLength.finalTape_represents', []],
    ['PNP.Concrete.CookLevin.BuilderInputLength.inputTape_eq_totalInputFramerFinalTape', []],
    ['PNP.Concrete.CookLevin.BuilderInputLength.malformedScanSymbol_timeout', []],
    ['PNP.Concrete.CookLevin.BuilderInputLength.rawTimeBound_exact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputLength.run_compile', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputLength.tallySizeBound_exact', []],
    ['PNP.Concrete.CookLevin.BuilderInputLength.workBoundedDecide_accept', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputLength.workRunExact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputLength.workRunExact_after_totalInputFramer', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputLength.work_one_step_short_timeout', ['Quot.sound', 'propext']],
  ].map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderInputPrefix = [
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.boundedDecide_compile_accept', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.finalTape_represents', []],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.finalTape_tally_length', ['propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.findWorkRule_framer_of_some', []],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.findWorkRule_tally_of_some', []],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.framerState_ne_tallyState', []],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.launch_workStep', []],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.malformedTallyScanSymbol_timeout', []],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.rawTimeBound_eval', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.rawTimeBound_le', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.run_compile_exact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.run_compile_rawTimeBound', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.workRunExact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderInputPrefix.work_one_step_short_timeout', ['Quot.sound', 'propext']],
  ].map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderTokenAppender = [
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.appendToken_workRunExact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_after_builderInputPrefix', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_bits_eq_encodedFormula_take_two', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_one_step_short_timeout', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_workBoundedDecide_accept', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstHeaderToken_workRunExact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstTokenRawTimeBound_eval', ['propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.firstTokenRawTimeBound_le', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.formulaBitSlotDirect_one', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.formulaBitSlotDirect_zero', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.malformedOutputSymbol_timeout', []],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.malformedTallySymbol_timeout', []],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.rules_pairwise_query_distinct', []],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.run_compile_firstHeaderToken_rawTimeBound', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.tokenSymbol_bits', []],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.workspaceTape_empty_eq_builderInputLength_finalTape', ['propext']],
    ['PNP.Concrete.CookLevin.BuilderTokenAppender.workspaceTape_represents', ['propext']],
  ].map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderFirstTokenPrefix = [
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.appenderState_injective', []],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.appender_workRunExact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.boundedDecide_compile_accept', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.boundedDecide_compile_ne_timeout', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.finalTape_represents', ['propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.finalTokenBits_eq_encodedFormula_take_two', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.findWorkRule_appender_of_some', []],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.findWorkRule_prefix_of_some', []],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.launch_workStep', []],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.malformedAppenderOutput_timeout', []],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.malformedAppenderTally_timeout', []],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.malformedPrefixTally_timeout', []],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.prefixEndpoint_before_launch_timeout', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.prefixState_injective', []],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.prefixState_ne_appenderState', []],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.prefix_workRunExact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.rawTimeBound_eval', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.rawTimeBound_le', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.rules_length', []],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.rules_pairwise_query_distinct', []],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.run_compile_exact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.run_compile_rawTimeBound', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.run_compile_rawTimeBound_blankEquivalent', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.workRunExact', ['Quot.sound', 'propext']],
    ['PNP.Concrete.CookLevin.BuilderFirstTokenPrefix.work_one_step_short_timeout', ['Quot.sound', 'propext']],
  ].map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderUnaryPolynomial = BUILDER_UNARY_POLYNOMIAL_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderCompleteHeader = BUILDER_COMPLETE_HEADER_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderBodyStartPrefix = BUILDER_BODY_START_PREFIX_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderFirstLiteralPrefix = BUILDER_FIRST_LITERAL_PREFIX_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderFirstClausePrefix = BUILDER_FIRST_CLAUSE_PREFIX_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderDynamicTokenCursorStep = BUILDER_DYNAMIC_TOKEN_CURSOR_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderFirstClausePaddingRun = BUILDER_FIRST_CLAUSE_PADDING_RUN_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondClauseSeparatorStep = BUILDER_SECOND_CLAUSE_SEPARATOR_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondClauseFirstLiteralPrefix = BUILDER_SECOND_CLAUSE_FIRST_LITERAL_PREFIX_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondClauseSecondLiteralPrefix = BUILDER_SECOND_CLAUSE_SECOND_LITERAL_PREFIX_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondClausePrefix = BUILDER_SECOND_CLAUSE_PREFIX_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondClausePaddingRun = BUILDER_SECOND_CLAUSE_PADDING_RUN_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderThirdClauseSeparatorStep = BUILDER_THIRD_CLAUSE_SEPARATOR_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderThirdClauseFirstLiteralPrefix = BUILDER_THIRD_CLAUSE_FIRST_LITERAL_PREFIX_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderThirdClauseSecondLiteralPrefix = BUILDER_THIRD_CLAUSE_SECOND_LITERAL_PREFIX_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderThirdClausePrefix = BUILDER_THIRD_CLAUSE_PREFIX_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderThirdClausePaddingRun = BUILDER_THIRD_CLAUSE_PADDING_RUN_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderFourthClauseSeparatorStep = BUILDER_FOURTH_CLAUSE_SEPARATOR_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderFourthClauseFirstLiteralPrefix = BUILDER_FOURTH_CLAUSE_FIRST_LITERAL_PREFIX_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderFourthClauseSecondLiteralPrefix = BUILDER_FOURTH_CLAUSE_SECOND_LITERAL_PREFIX_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderFourthClausePrefix = BUILDER_FOURTH_CLAUSE_PREFIX_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderFourthClausePaddingRun = BUILDER_FOURTH_CLAUSE_PADDING_RUN_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderFifthClausePaddingRun = BUILDER_FIFTH_CLAUSE_PADDING_RUN_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderFirstConstraintPaddingRun = BUILDER_FIRST_CONSTRAINT_PADDING_RUN_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintSeparatorStep = BUILDER_SECOND_CONSTRAINT_SEPARATOR_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintFirstLiteralSignStep = BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SIGN_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStep = BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_FIRST_UNARY_UNIT_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStep = BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SECOND_UNARY_UNIT_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStep = BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_THIRD_UNARY_UNIT_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintFirstLiteralTerminatorStep = BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_TERMINATOR_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStep = BUILDER_SECOND_CONSTRAINT_FIRST_LITERAL_SUCCESSOR_TOKEN_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep = BUILDER_SECOND_CONSTRAINT_PADDING_OR_UNARY_OPPORTUNITY_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep = BUILDER_SECOND_CONSTRAINT_SECOND_PADDING_OR_UNARY_OPPORTUNITY_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep = BUILDER_SECOND_CONSTRAINT_THIRD_PADDING_OR_UNARY_OPPORTUNITY_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep = BUILDER_SECOND_CONSTRAINT_FOURTH_PADDING_OR_UNARY_OPPORTUNITY_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep = BUILDER_SECOND_CONSTRAINT_FIFTH_PADDING_OR_TERMINATOR_OPPORTUNITY_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep = BUILDER_SECOND_CONSTRAINT_SIXTH_PADDING_OR_OPENING_UNARY_OPPORTUNITY_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep = BUILDER_SECOND_CONSTRAINT_SEVENTH_PADDING_OR_UNARY_OPPORTUNITY_STEP_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const lockedNANDCarrierTrace = LOCKED_NAND_CARRIER_TRACE_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const lockedNANDGlobalCandidates = LOCKED_NAND_GLOBAL_CANDIDATE_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const lockedNANDGlobalBaselineDistinct = LOCKED_NAND_GLOBAL_BASELINE_DISTINCT_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const lockedNANDGlobalUnsatisfiableFinalZero = LOCKED_NAND_GLOBAL_UNSATISFIABLE_FINAL_ZERO_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const lockedNANDGlobalSemanticThreshold = LOCKED_NAND_GLOBAL_SEMANTIC_THRESHOLD_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const lockedNANDEncodedSemanticReduction = LOCKED_NAND_ENCODED_SEMANTIC_REDUCTION_DECLARATIONS.map(([name, axioms]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
  }));
  const lockedNANDSourceParser = LOCKED_NAND_SOURCE_PARSER_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const lockedNANDTargetEmitter = LOCKED_NAND_TARGET_EMITTER_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const lockedNANDPolynomialReduction = LOCKED_NAND_POLYNOMIAL_REDUCTION_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const cnfToNANDSemanticCompiler = CNF_TO_NAND_SEMANTIC_COMPILER_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const cnfToNANDPolynomialReduction = CNF_TO_NAND_POLYNOMIAL_REDUCTION_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualGainChain = RESIDUAL_GAIN_CHAIN_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualGainStopping = RESIDUAL_GAIN_STOPPING_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalFullBridge = RESIDUAL_TERMINAL_FULL_BRIDGE_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalModeFirewall = RESIDUAL_TERMINAL_MODE_FIREWALL_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalProjectionMinimum = RESIDUAL_TERMINAL_PROJECTION_MINIMUM_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalProjectionTransfer = RESIDUAL_TERMINAL_PROJECTION_TRANSFER_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalSaturation = RESIDUAL_TERMINAL_SATURATION_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalPhysicalSupport = RESIDUAL_TERMINAL_PHYSICAL_SUPPORT_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalSupportExtraction = RESIDUAL_TERMINAL_SUPPORT_EXTRACTION_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalProperSupport = RESIDUAL_TERMINAL_PROPER_SUPPORT_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalSupportSquare = RESIDUAL_TERMINAL_SUPPORT_SQUARE_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalGovernedSupport = RESIDUAL_TERMINAL_GOVERNED_SUPPORT_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalFrontierPushout = RESIDUAL_TERMINAL_FRONTIER_PUSHOUT_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalProjectionSquare = RESIDUAL_TERMINAL_PROJECTION_SQUARE_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalSideTightMinimum = RESIDUAL_TERMINAL_SIDE_TIGHT_MINIMUM_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalFourCornerCarrier = RESIDUAL_TERMINAL_FOUR_CORNER_CARRIER_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalFourCornerOptima = RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMA_DECLARATIONS.map(([name, axioms, module]) => ({
    row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
    axioms,
    module,
  }));
  const residualTerminalFourCornerOptimumCoherence =
    RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMUM_COHERENCE_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalFourCornerSideTightCompletion =
    RESIDUAL_TERMINAL_FOUR_CORNER_SIDE_TIGHT_COMPLETION_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalFourCornerTightBasisMaximum =
    RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalComputedBN2SquareLegitimacy =
    RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalComputedBCELAnchorNucleus =
    RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalSaturationPositivityFirewall =
    RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalCandidateSaturationCostBalance =
    RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalInterfaceExposureRouting =
    RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalFiniteSaturatePositiveComposition =
    RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalRankWF =
    RESIDUAL_TERMINAL_RANK_WF_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalBN3RequestEnvelope =
    RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalBN4ActivationCancellation =
    RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalBN5FullShadowLocalization =
    RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalPkgCSeparatingConsumers =
    RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalPkgCTypedRestoration =
    RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalPkgCSameKeyCancellation =
    RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalPkgCAmbientBN4Ledger =
    RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalV54ConsumerAntichainNormalForm =
    RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalV53ConstantCutHypergraphRigidity =
    RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalBN6HypergraphPacket =
    RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));
  const residualTerminalPacketSelectorSeeds =
    RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketSelectorUniverse =
    RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketSelectorHandles =
    RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketSelectorCodec =
    RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketSelectorPayloadRealization =
    RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketSelectorGainScan =
    RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketSelectorUniverseGainScan =
    RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_GAIN_SCAN_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketSelectorGainCoverage =
    RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_COVERAGE_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketChargeSurplus =
    RESIDUAL_TERMINAL_PACKET_CHARGE_SURPLUS_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketUnitChargeBlueprintRealizer =
    RESIDUAL_TERMINAL_PACKET_UNIT_CHARGE_BLUEPRINT_REALIZER_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketTypedRealizerContract =
    RESIDUAL_TERMINAL_PACKET_TYPED_REALIZER_CONTRACT_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalHBBlockerGraphAcyclicity =
    RESIDUAL_TERMINAL_HB_BLOCKER_GRAPH_ACYCLICITY_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalHBDependencyTableClosure =
    RESIDUAL_TERMINAL_HB_DEPENDENCY_TABLE_CLOSURE_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalHBActiveDependencyClosure =
    RESIDUAL_TERMINAL_HB_ACTIVE_DEPENDENCY_CLOSURE_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalHBSelectorSilenceClosure =
    RESIDUAL_TERMINAL_HB_SELECTOR_SILENCE_CLOSURE_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalHBExecutableSelectorSilenceInduction =
    RESIDUAL_TERMINAL_HB_EXECUTABLE_SELECTOR_SILENCE_INDUCTION_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketSelectorFaithfulnessRouting =
    RESIDUAL_TERMINAL_PACKET_SELECTOR_FAITHFULNESS_ROUTING_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketSelectorFaithfulnessTable =
    RESIDUAL_TERMINAL_PACKET_SELECTOR_FAITHFULNESS_TABLE_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketSelectorFirstRouteOutcome =
    RESIDUAL_TERMINAL_PACKET_SELECTOR_FIRST_ROUTE_OUTCOME_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketSelectorFirstRouteSemantics =
    RESIDUAL_TERMINAL_PACKET_SELECTOR_FIRST_ROUTE_SEMANTICS_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketDescentRouteReflection =
    RESIDUAL_TERMINAL_PACKET_DESCENT_ROUTE_REFLECTION_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketRankRouteReflection =
    RESIDUAL_TERMINAL_PACKET_RANK_ROUTE_REFLECTION_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketExactRouteReflection =
    RESIDUAL_TERMINAL_PACKET_EXACT_ROUTE_REFLECTION_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketChargeRouteReflection =
    RESIDUAL_TERMINAL_PACKET_CHARGE_ROUTE_REFLECTION_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketColourRouteReflection =
    RESIDUAL_TERMINAL_PACKET_COLOUR_ROUTE_REFLECTION_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketFrontierRouteReflection =
    RESIDUAL_TERMINAL_PACKET_FRONTIER_ROUTE_REFLECTION_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketBN5ObligationRouteReflection =
    RESIDUAL_TERMINAL_PACKET_BN5_OBLIGATION_ROUTE_REFLECTION_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketBN4ActivationRouteReflection =
    RESIDUAL_TERMINAL_PACKET_BN4_ACTIVATION_ROUTE_REFLECTION_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketDirectionRouteReflection =
    RESIDUAL_TERMINAL_PACKET_DIRECTION_ROUTE_REFLECTION_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));


  const residualTerminalPacketBudgetRouteReflection =
    RESIDUAL_TERMINAL_PACKET_BUDGET_ROUTE_REFLECTION_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));
  const residualTerminalPacketBudgetHBActivityBinding =
    RESIDUAL_TERMINAL_PACKET_BUDGET_HB_ACTIVITY_BINDING_DECLARATIONS.map(([name, axioms, module, hash]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
      hash,
    }));

  const lockedNANDThresholdPublication =
    LOCKED_NAND_THRESHOLD_PUBLICATION_DECLARATIONS.map(([name, axioms, module]) => ({
      row: inventory.milestoneCandidates?.find((candidate) => candidate?.name === name),
      axioms,
      module,
    }));

  const bridge = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineStageBridges.workBoundedDecide_bridged_timeout_of_stuck_rawRunExact');
  const packer = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.TerminalOutputPacker.machineOutput_compileTerminalOutputPacker_eq');
  const terminalBridge = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineTerminalBridge.outputBits_compileTerminalBridge_accepting_of_represents');
  const suppliedTrace = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineTerminalBridge.acceptingSuppliedTrace_workRunExact_of_rawRunExact');
  const suppliedOutput = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineTerminalBridge.machineOutput_compileTerminalBridge_accept_of_rawRunExact');
  const pairedVerdict = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_boundedDecide_eq');
  const pairedOutput = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_machineOutput_eq');
  const pairedTimeout = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_ne_timeout');
  const pairedAccepts = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelinePairedCompiler.pairedPipeline_accepts_iff');
  const allInputCompilerTheorems = [
    'PNP.Concrete.PipelineCompiler.pipeline_correct',
    'PNP.Concrete.PipelineCompiler.pipeline_boundedDecide_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_machineOutput_eq',
    'PNP.Concrete.PipelineCompiler.pipeline_ne_timeout',
    'PNP.Concrete.PipelineCompiler.pipeline_accepts_iff',
    'PNP.Concrete.PipelineCompiler.pipeline_timeout_of_stuck_rawRunExact',
  ].map((name) => inventory.milestoneCandidates?.find((row) => row?.name === name));
  const sequentialCompilerTheorems = [
    'PNP.Concrete.PipelineSequentialCompiler.sequential_correct',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_boundedDecide_eq',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_machineOutput_eq',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_ne_timeout',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_accepts_iff',
    'PNP.Concrete.PipelineSequentialCompiler.sequential_timeout_of_stuck_first_rawRunExact',
  ].map((name) => inventory.milestoneCandidates?.find((row) => row?.name === name));
  const recursiveRefinementTheorems = [
    'PNP.Concrete.FunctionProgram.RawRefinement.compile_haltsWithin',
    'PNP.Concrete.FunctionProgram.RawRefinement.compile_output_eq',
    'PNP.Concrete.DecisionProgram.RawRefinement.compile_haltsWithin',
    'PNP.Concrete.DecisionProgram.RawRefinement.compile_verdict_eq',
    'PNP.Concrete.PolynomialTimeDecider.compileToMachine_accepts_iff',
  ].map((name) => inventory.milestoneCandidates?.find((row) => row?.name === name));
  const totalFramerTrace = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineInputFramer.totalInputFramer_workRunExact');
  const totalFramerEndpoint = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineInputFramer.totalInputFramerFinal_represents');
  const totalFramerBound = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineInputFramer.run_compileTotalInputFramer_encoded_rawTimeBound');
  const totalFramerNoTimeout = inventory.milestoneCandidates?.find((row) => row?.name === 'PNP.Concrete.PipelineInputFramer.boundedDecide_compileTotalInputFramer_ne_timeout');
  return membership?.kind === 'theorem'
    && membership.module === 'PNP.Concrete.CNFWorkUniversalCorrectness'
    && membership.kernelType === 'Lean.Expr.app (Lean.Expr.const `PNP.Concrete.InNP []) (Lean.Expr.const `PNP.Concrete.CNFSAT [])'
    && sameJson(membership.axioms, [])
    && cookLevinBridge?.kind === 'theorem'
    && cookLevinBridge.module === 'PNP.Concrete.CookLevinRawTapeBridge'
    && sameJson(cookLevinBridge.axioms, LEAN_STANDARD_AXIOMS)
    && cookLevinFormulaSize?.kind === 'theorem'
    && cookLevinFormulaSize.module === 'PNP.Concrete.CookLevinFormulaSize'
    && sameJson(cookLevinFormulaSize.axioms, ['Quot.sound', 'propext'])
    && cookLevinFormulaSchedule.every((row) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinFormulaSchedule'
      && sameJson(row.axioms, ['Quot.sound', 'propext']))
    && cookLevinFormulaCursor.every((row) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinFormulaCursor'
      && sameJson(row.axioms, ['Quot.sound', 'propext']))
    && cookLevinBuilderInputLength.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinBuilderInputLength'
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderInputPrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinBuilderInputPrefix'
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderTokenAppender.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinBuilderTokenAppender'
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderFirstTokenPrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinBuilderFirstTokenPrefix'
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderUnaryPolynomial.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinBuilderUnaryPolynomial'
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderCompleteHeader.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinBuilderCompleteHeader'
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderBodyStartPrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinBuilderBodyStartPrefix'
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderFirstLiteralPrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinBuilderFirstLiteralPrefix'
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderFirstClausePrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name === 'PNP.Concrete.CookLevin.BuilderFirstLiteralPrefix.rule_source_ne_acceptState'
        ? 'PNP.Concrete.CookLevinBuilderFirstLiteralPrefix'
        : 'PNP.Concrete.CookLevinBuilderFirstClausePrefix')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderDynamicTokenCursorStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderFirstClausePaddingRun.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name === 'PNP.Concrete.CookLevin.BuilderCompleteHeader.HeaderController.workRunExact_of_unit_or_separator'
        ? 'PNP.Concrete.CookLevinBuilderCompleteHeader'
        : 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondClauseSeparatorStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : 'PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondClauseFirstLiteralPrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : 'PNP.Concrete.CookLevinBuilderSecondClauseFirstLiteralPrefix')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondClauseSecondLiteralPrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondClausePrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : 'PNP.Concrete.CookLevinBuilderSecondClausePrefix')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondClausePaddingRun.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.')
        ? 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun'
        : 'PNP.Concrete.CookLevinBuilderSecondClausePaddingRun')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderThirdClauseSeparatorStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.')
          ? 'PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep'
          : 'PNP.Concrete.CookLevinBuilderThirdClauseSeparatorStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderThirdClauseFirstLiteralPrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.')
          ? 'PNP.Concrete.CookLevinBuilderSecondClauseFirstLiteralPrefix'
          : 'PNP.Concrete.CookLevinBuilderThirdClauseFirstLiteralPrefix')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderThirdClauseSecondLiteralPrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : 'PNP.Concrete.CookLevinBuilderThirdClauseSecondLiteralPrefix')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderThirdClausePrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : 'PNP.Concrete.CookLevinBuilderThirdClausePrefix')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderThirdClausePaddingRun.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.')
        ? 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun'
        : 'PNP.Concrete.CookLevinBuilderThirdClausePaddingRun')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderFourthClauseSeparatorStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.')
          ? 'PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep'
          : 'PNP.Concrete.CookLevinBuilderFourthClauseSeparatorStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderFourthClauseFirstLiteralPrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.')
          ? 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix'
          : 'PNP.Concrete.CookLevinBuilderFourthClauseFirstLiteralPrefix')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderFourthClauseSecondLiteralPrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderThirdClauseSecondLiteralPrefix.')
          ? 'PNP.Concrete.CookLevinBuilderThirdClauseSecondLiteralPrefix'
          : 'PNP.Concrete.CookLevinBuilderFourthClauseSecondLiteralPrefix')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderFourthClausePrefix.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : 'PNP.Concrete.CookLevinBuilderFourthClausePrefix')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderFourthClausePaddingRun.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.')
        ? 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun'
        : 'PNP.Concrete.CookLevinBuilderFourthClausePaddingRun')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderFifthClausePaddingRun.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.')
        ? 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun'
        : 'PNP.Concrete.CookLevinBuilderFifthClausePaddingRun')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderFirstConstraintPaddingRun.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderFirstClausePaddingRun.')
        ? 'PNP.Concrete.CookLevinBuilderFirstClausePaddingRun'
        : 'PNP.Concrete.CookLevinBuilderFirstConstraintPaddingRun')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintSeparatorStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSeparatorStep.')
          ? 'PNP.Concrete.CookLevinBuilderSecondClauseSeparatorStep'
          : 'PNP.Concrete.CookLevinBuilderSecondConstraintSeparatorStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintFirstLiteralSignStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.')
          ? 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix'
          : 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralSignStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.')
          ? 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix'
          : 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.')
          ? 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix'
          : 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseSecondLiteralPrefix.')
          ? 'PNP.Concrete.CookLevinBuilderSecondClauseSecondLiteralPrefix'
          : 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintFirstLiteralTerminatorStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderDynamicTokenCursorStep.')
        ? 'PNP.Concrete.CookLevinBuilderDynamicTokenCursorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondClauseFirstLiteralPrefix.')
          ? 'PNP.Concrete.CookLevinBuilderSecondClauseFirstLiteralPrefix'
          : 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.')
          ? 'PNP.Concrete.CookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep'
          : 'PNP.Concrete.CookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.')
          ? 'PNP.Concrete.CookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep'
          : 'PNP.Concrete.CookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.')
          ? 'PNP.Concrete.CookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep'
          : 'PNP.Concrete.CookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
        : 'PNP.Concrete.CookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.')
          ? 'PNP.Concrete.CookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep'
          : 'PNP.Concrete.CookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStep')
      && sameJson(row.axioms, axioms))
    && cookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintFirstLiteralTerminatorStep.')
        ? 'PNP.Concrete.CookLevinBuilderSecondConstraintFirstLiteralTerminatorStep'
        : row.name.startsWith('PNP.Concrete.CookLevin.BuilderSecondConstraintPaddingOrUnaryOpportunityStep.WidthOptionalAppender.')
          ? 'PNP.Concrete.CookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStep'
          : 'PNP.Concrete.CookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStep')
      && sameJson(row.axioms, axioms))
    && lockedNANDCarrierTrace.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.LockedNANDCarrierTrace'
      && sameJson(row.axioms, axioms))
    && lockedNANDGlobalCandidates.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.LockedNANDGlobalCandidates'
      && sameJson(row.axioms, axioms))
    && lockedNANDGlobalBaselineDistinct.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.LockedNANDGlobalCandidates'
      && sameJson(row.axioms, axioms))
    && lockedNANDGlobalUnsatisfiableFinalZero.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === 'PNP.LockedNANDGlobalUnsatisfiableFinalZero'
      && sameJson(row.axioms, axioms))
    && lockedNANDGlobalSemanticThreshold.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === (row.name === 'PNP.DirectWire.LockedNANDGlobalCandidates.fullCandidate_referenceMinimum_eq_baseline_of_unsatisfiable'
        ? 'PNP.LockedNANDGlobalUnsatisfiableFinalZero'
        : 'PNP.LockedNANDGlobalSemanticThreshold')
      && sameJson(row.axioms, axioms))
    && lockedNANDEncodedSemanticReduction.every(({ row, axioms }) => row?.kind === 'theorem'
      && row.module === ([
        'PNP.Concrete.LockedNAND.decodeElaboratedCircuit_encodeCircuit_ofCircuit',
        'PNP.Concrete.LockedNAND.encoded_fullCandidate_threshold_iff_satisfiable',
        'PNP.Concrete.LockedNAND.buildLockedNANDInstance_correct',
      ].includes(row.name)
        ? 'PNP.Concrete.LockedNANDReduction'
        : 'PNP.Concrete.LockedNANDEncoding')
      && sameJson(row.axioms, axioms))
    && lockedNANDSourceParser.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && lockedNANDTargetEmitter.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && lockedNANDPolynomialReduction.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && cnfToNANDSemanticCompiler.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && cnfToNANDPolynomialReduction.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualGainChain.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualGainStopping.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalFullBridge.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalModeFirewall.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalProjectionMinimum.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalProjectionTransfer.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalSaturation.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPhysicalSupport.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalSupportExtraction.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalProperSupport.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalSupportSquare.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalGovernedSupport.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalFrontierPushout.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalProjectionSquare.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalSideTightMinimum.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalFourCornerCarrier.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalFourCornerOptima.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalFourCornerOptimumCoherence.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalFourCornerSideTightCompletion.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalFourCornerTightBasisMaximum.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalComputedBN2SquareLegitimacy.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalComputedBCELAnchorNucleus.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalSaturationPositivityFirewall.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalCandidateSaturationCostBalance.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalInterfaceExposureRouting.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalFiniteSaturatePositiveComposition.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalRankWF.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalBN3RequestEnvelope.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalBN4ActivationCancellation.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalBN5FullShadowLocalization.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPkgCSeparatingConsumers.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPkgCTypedRestoration.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPkgCSameKeyCancellation.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPkgCAmbientBN4Ledger.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalV54ConsumerAntichainNormalForm.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalV53ConstantCutHypergraphRigidity.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalBN6HypergraphPacket.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketSelectorSeeds.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketSelectorUniverse.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketSelectorHandles.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketSelectorCodec.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketSelectorPayloadRealization.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketSelectorGainScan.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketSelectorUniverseGainScan.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketSelectorGainCoverage.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketChargeSurplus.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketUnitChargeBlueprintRealizer.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketTypedRealizerContract.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalHBBlockerGraphAcyclicity.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalHBDependencyTableClosure.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalHBActiveDependencyClosure.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalHBSelectorSilenceClosure.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalHBExecutableSelectorSilenceInduction.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketSelectorFaithfulnessRouting.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketSelectorFaithfulnessTable.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketSelectorFirstRouteOutcome.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketSelectorFirstRouteSemantics.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketDescentRouteReflection.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketRankRouteReflection.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketExactRouteReflection.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketChargeRouteReflection.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketColourRouteReflection.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketFrontierRouteReflection.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketBN5ObligationRouteReflection.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketBN4ActivationRouteReflection.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketDirectionRouteReflection.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))


    && residualTerminalPacketBudgetRouteReflection.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))
    && residualTerminalPacketBudgetHBActivityBinding.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))

    && lockedNANDThresholdPublication.every(({ row, axioms, module }) => row?.kind === 'theorem'
      && row.module === module
      && sameJson(row.axioms, axioms))

    && bridge?.kind === 'theorem'
    && bridge.module === 'PNP.Concrete.PipelineStageBridges'
    && sameJson(bridge.axioms, [])
    && packer?.kind === 'theorem'
    && packer.module === 'PNP.Concrete.TerminalOutputPacker'
    && sameJson(packer.axioms, [])
    && terminalBridge?.kind === 'theorem'
    && terminalBridge.module === 'PNP.Concrete.PipelineTerminalBridge'
    && sameJson(terminalBridge.axioms, [])
    && suppliedTrace?.kind === 'theorem'
    && sameJson(suppliedTrace.axioms, [])
    && suppliedOutput?.kind === 'theorem'
    && sameJson(suppliedOutput.axioms, [])
    && pairedVerdict?.kind === 'theorem'
    && pairedVerdict.module === 'PNP.Concrete.PipelinePairedCompiler'
    && sameJson(pairedVerdict.axioms, [])
    && pairedOutput?.kind === 'theorem'
    && sameJson(pairedOutput.axioms, [])
    && pairedTimeout?.kind === 'theorem'
    && sameJson(pairedTimeout.axioms, [])
    && pairedAccepts?.kind === 'theorem'
    && pairedAccepts.module === 'PNP.Concrete.PipelinePairedCompiler'
    && sameJson(pairedAccepts.axioms, [])
    && allInputCompilerTheorems.every((row) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.PipelineCompiler'
      && sameJson(row.axioms, []))
    && sequentialCompilerTheorems.every((row) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.PipelineSequentialCompiler'
      && sameJson(row.axioms, []))
    && recursiveRefinementTheorems.every((row) => row?.kind === 'theorem'
      && row.module === 'PNP.Concrete.PipelineRefinement'
      && sameJson(row.axioms, []))
    && totalFramerTrace?.kind === 'theorem'
    && totalFramerTrace.module === 'PNP.Concrete.PipelineInputFramer'
    && sameJson(totalFramerTrace.axioms, [])
    && totalFramerEndpoint?.kind === 'theorem'
    && sameJson(totalFramerEndpoint.axioms, [])
    && totalFramerBound?.kind === 'theorem'
    && sameJson(totalFramerBound.axioms, [])
    && totalFramerNoTimeout?.kind === 'theorem'
    && sameJson(totalFramerNoTimeout.axioms, [])
    && new Set(inventory.milestoneCandidates.map((row) => row.name)).size
      === inventory.milestoneCandidates.length
    && theoremRows.length === INVENTORY_COUNTS.theorems
    && theoremRows.filter((row) => Array.isArray(row.axioms) && row.axioms.length === 0).length === INVENTORY_COUNTS.assumptionFreeTheorems
    && inventory.declarations.filter((row) => row?.kind === 'axiom').length === INVENTORY_COUNTS.axioms
    && new Set(inventory.sourceClosureModules).size === INVENTORY_COUNTS.modules;
}

function deriveGateSubchecks(status, inventory) {
  const gate = status?.concretePublicationGate || {};
  const target = inventory?.concreteTargetCandidate;
  const root = inventory?.compatibilityRootCandidate;
  const typeConfigured = isSha256(gate.expectedConcreteTargetKernelTypeSha256);
  const valueConfigured = isSha256(gate.expectedConcreteTargetKernelValueSha256);
  const rootConfigured = isSha256(gate.expectedRootKernelTypeSha256);
  const axiomConfigured = isSha256(gate.expectedAxiomClosureSha256);
  const sourceConfigured = isSha256(gate.expectedSourceClosureSha256);
  const targetPresent = Boolean(target && target.name === gate.concreteTargetName);
  const rootPresent = Boolean(root && root.name === gate.compatibilityRootName);

  return {
    standardComplexityModelEligible: status?.standardComplexityModelFormalized === true,
    concreteTargetPresent: targetPresent,
    concreteTargetIsDefinition: targetPresent && target.kind === 'definition',
    concreteTargetKernelTypeFingerprintConfigured: typeConfigured,
    concreteTargetKernelTypeFingerprintMatches: typeConfigured && gate.actualConcreteTargetKernelTypeSha256 === gate.expectedConcreteTargetKernelTypeSha256,
    concreteTargetKernelValueFingerprintConfigured: valueConfigured,
    concreteTargetKernelValueFingerprintMatches: valueConfigured && gate.actualConcreteTargetKernelValueSha256 === gate.expectedConcreteTargetKernelValueSha256,
    compatibilityRootPresent: rootPresent,
    compatibilityRootIsTheorem: rootPresent && root.kind === 'theorem',
    compatibilityRootHasExactConcreteType: false,
    compatibilityRootKernelTypeFingerprintConfigured: rootConfigured,
    compatibilityRootKernelTypeFingerprintMatches: rootConfigured && gate.actualRootKernelTypeSha256 === gate.expectedRootKernelTypeSha256,
    axiomClosureFingerprintConfigured: axiomConfigured,
    axiomClosureFingerprintMatches: axiomConfigured && gate.actualAxiomClosureSha256 === gate.expectedAxiomClosureSha256,
    sourceClosureFingerprintConfigured: sourceConfigured,
    sourceClosureFingerprintMatches: sourceConfigured && gate.actualSourceClosureSha256 === gate.expectedSourceClosureSha256,
    axiomClosureUsesOnlyLeanStandardAllowlist: rootPresent
      && Array.isArray(gate.axiomClosure)
      && gate.axiomClosure.every((axiom) => gate.allowedLeanStandardAxioms?.includes(axiom)),
  };
}

function validateConcreteGate(status, inventory) {
  const gate = status?.concretePublicationGate;
  if (gate?.kind !== 'PNPConcretePublicationGate0'
    || gate.compatibilityRootName !== 'PNP.Main.p_eq_np'
    || gate.concreteTargetName !== 'PNP.Main.ConcretePEqualsNP'
    || gate.abstractPEqualsNPIsPublicationIneligible !== true
    || gate.unsetFingerprintIsIntentionalFailClosedMigrationGate !== true
    || !sameJson(gate.allowedLeanStandardAxioms, ['Classical.choice', 'Quot.sound', 'propext'])
    || !sameJson(Object.keys(gate.subchecks || {}), GATE_SUBCHECK_KEYS)) return false;

  const derived = deriveGateSubchecks(status, inventory);
  if (!sameJson(gate.subchecks, derived)) return false;
  const strictConjunction = GATE_SUBCHECK_KEYS.every((key) => derived[key] === true);
  return gate.passed === strictConjunction;
}

function validateMilestones(status, inventory) {
  const milestones = status?.formalPublicationMilestones;
  if (!Array.isArray(milestones) || milestones.length < 3
    || new Set(milestones.map((row) => row.id)).size !== milestones.length
    || !Array.isArray(inventory?.milestoneCandidates)) return false;

  const expectedCandidateNames = new Set(
    milestones.filter((row) => row.earned === true).flatMap((row) => row.requiredTheorems)
  );
  if (expectedCandidateNames.size !== inventory.milestoneCandidates.length
      || !inventory.milestoneCandidates.every((row) => expectedCandidateNames.has(row.name))) return false;
  const unearnedCount = milestones.filter((row) => row.status === 'not-formalized').length;
  if (unearnedCount !== 2) return false;

  return milestones.every((row) => {
    const shouldBeEarned = row.status !== 'not-formalized';
    const allAssumptionFree = row.theoremRows?.every((theorem) => sameJson(theorem.axioms, []));
    if (row.earned !== shouldBeEarned
      || row.sourceClosureFingerprintMatches !== true
      || !Array.isArray(row.theoremRows)
      || row.theoremRows.length !== row.requiredTheorems?.length
      || row.allAssumptionFree !== allAssumptionFree) return false;
    if (shouldBeEarned) {
      return row.allPresent === true
        && row.allKernelTypesMatch === true
        && row.theoremRows.every((theorem) => theorem.present === true
          && theorem.kind === 'theorem'
          && Array.isArray(theorem.axioms)
          && theorem.axioms.every((axiom) => LEAN_STANDARD_AXIOMS.includes(axiom))
          && isSha256(theorem.expectedKernelTypeSha256)
          && theorem.kernelTypeFingerprintMatches === true
          && theorem.actualKernelTypeSha256 === theorem.expectedKernelTypeSha256);
    }
    return row.status === 'not-formalized'
      && row.allPresent === false
      && row.allAssumptionFree === false
      && row.allKernelTypesMatch === false
      && row.theoremRows.every((theorem) => theorem.present === false
        && theorem.expectedKernelTypeSha256 === null
        && theorem.kernelTypeFingerprintMatches === false);
  });
}

function validateStatus(status, inventory) {
  const gatePassed = status?.concretePublicationGate?.passed === true;
  const sourceParserMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'concrete-locked-nand-source-parser'
  );
  const targetEmitterMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'concrete-locked-nand-target-emitter'
  );
  const polynomialReductionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'concrete-locked-nand-polynomial-reduction'
  );
  const cnfToNANDSemanticCompilerMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'concrete-cnf-to-nand-semantic-compiler'
  );
  const cnfToNANDPolynomialReductionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'concrete-cnf-to-nand-polynomial-reduction'
  );
  const residualGainChainMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-gain-chain-bound'
  );
  const residualGainStoppingMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-gain-stopping-specification'
  );
  const residualTerminalFullBridgeMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-full-carrier-bridge'
  );
  const residualTerminalModeFirewallMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-mode-firewall'
  );
  const residualTerminalProjectionMinimumMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-projection-minimum'
  );
  const residualTerminalProjectionTransferMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-projection-transfer'
  );
  const residualTerminalSaturationMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-saturation-closure'
  );
  const residualTerminalPhysicalSupportMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-physical-support-completion'
  );
  const residualTerminalSupportExtractionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-support-extraction'
  );
  const residualTerminalProperSupportMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-proper-positive-support-search'
  );
  const residualTerminalSupportSquareMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-saturated-support-square-closure'
  );
  const residualTerminalGovernedSupportMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-governed-support-completion'
  );
  const residualTerminalFrontierPushoutMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-governed-frontier-pushout'
  );
  const residualTerminalProjectionSquareMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-governed-projection-square'
  );
  const residualTerminalSideTightMinimumMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-side-tight-minimum-arithmetic'
  );
  const residualTerminalFourCornerCarrierMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-four-corner-carrier-transport'
  );
  const residualTerminalFourCornerOptimaMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-four-corner-optimum-carrier-compatibility'
  );
  const residualTerminalFourCornerOptimumCoherenceMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-four-corner-optimum-coherence-dichotomy'
  );
  const residualTerminalFourCornerSideTightCompletionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-four-corner-side-tight-completion'
  );
  const residualTerminalFourCornerTightBasisMaximumMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-four-corner-tight-basis-maximum'
  );
  const residualTerminalComputedBN2SquareLegitimacyMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-computed-bn2-square-legitimacy'
  );
  const residualTerminalComputedBCELAnchorNucleusMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-computed-bcel-anchor-nucleus'
  );
  const residualTerminalSaturationPositivityFirewallMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-saturation-positivity-firewall'
  );
  const residualTerminalCandidateSaturationCostBalanceMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-candidate-saturation-cost-balance'
  );
  const residualTerminalInterfaceExposureRoutingMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-interface-exposure-routing'
  );
  const residualTerminalFiniteSaturatePositiveCompositionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-finite-saturate-positive-composition'
  );
  const residualTerminalRankWFMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-rank-wf'
  );
  const residualTerminalBN3RequestEnvelopeMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-bn3-request-envelope'
  );
  const residualTerminalBN4ActivationCancellationMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-bn4-activation-cancellation'
  );
  const residualTerminalBN5FullShadowLocalizationMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-bn5-full-shadow-localization'
  );
  const residualTerminalPkgCSeparatingConsumersMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-pkgc-separating-consumers'
  );
  const residualTerminalPkgCTypedRestorationMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-pkgc-typed-restoration'
  );
  const residualTerminalPkgCSameKeyCancellationMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-pkgc-same-key-cancellation'
  );
  const residualTerminalPkgCAmbientBN4LedgerMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-pkgc-ambient-bn4-ledger'
  );
  const residualTerminalPkgCAmbientBN4ResidualReductionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-pkgc-ambient-bn4-residual-reduction'
  );
  const residualTerminalPkgCAmbientBN4ResidualReductionCandidates =
    residualTerminalPkgCAmbientBN4ResidualReductionMilestone?.requiredTheorems?.map((name) =>
      inventory?.milestoneCandidates?.find((candidate) => candidate.name === name)
    );
  const residualTerminalV54ConsumerAntichainNormalFormMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-consumer-antichain-normal-form'
  );
  const residualTerminalV53ConstantCutHypergraphRigidityMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-constant-cut-hypergraph-rigidity'
  );
  const residualTerminalBN6HypergraphPacketMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-bn6-hypergraph-packet'
  );
  const residualTerminalPacketSelectorSeedsMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-selector-seeds'
  );
  const residualTerminalPacketSelectorUniverseMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-selector-universe'
  );
  const residualTerminalPacketSelectorHandlesMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-selector-handles'
  );
  const residualTerminalPacketSelectorCodecMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-selector-codec'
  );
  const residualTerminalPacketSelectorPayloadRealizationMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-selector-payload-realization'
  );
  const residualTerminalPacketSelectorGainScanMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-selector-gain-scan'
  );
  const residualTerminalPacketSelectorUniverseGainScanMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-selector-universe-gain-scan'
  );
  const residualTerminalPacketSelectorGainCoverageMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-selector-gain-coverage'
  );
  const residualTerminalPacketChargeSurplusMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-charge-surplus'
  );
  const residualTerminalPacketUnitChargeBlueprintRealizerMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-unit-charge-blueprint-realizer'
  );
  const residualTerminalPacketTypedRealizerContractMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-typed-realizer-contract'
  );
  const residualTerminalHBBlockerGraphAcyclicityMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-hb-blocker-graph-acyclicity'
  );
  const residualTerminalHBDependencyTableClosureMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-hb-dependency-table-closure'
  );
  const residualTerminalHBActiveDependencyClosureMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-hb-active-dependency-closure'
  );
  const residualTerminalHBSelectorSilenceClosureMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-hb-selector-silence-closure'
  );
  const residualTerminalHBExecutableSelectorSilenceInductionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-hb-executable-selector-silence-induction'
  );
  const residualTerminalPacketSelectorFaithfulnessRoutingMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-selector-faithfulness-routing'
  );
  const residualTerminalPacketSelectorFaithfulnessTableMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-selector-faithfulness-table'
  );
  const residualTerminalPacketSelectorFirstRouteOutcomeMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-selector-first-route-outcome'
  );
  const residualTerminalPacketSelectorFirstRouteSemanticsMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-selector-first-route-semantics'
  );
  const residualTerminalPacketDescentRouteReflectionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-descent-route-reflection'
  );
  const residualTerminalPacketRankRouteReflectionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-rank-route-reflection'
  );
  const residualTerminalPacketExactRouteReflectionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-exact-route-reflection'
  );
  const residualTerminalPacketChargeRouteReflectionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-charge-route-reflection'
  );
  const residualTerminalPacketColourRouteReflectionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-colour-route-reflection'
  );
  const residualTerminalPacketFrontierRouteReflectionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-frontier-route-reflection'
  );
  const residualTerminalPacketBN5ObligationRouteReflectionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-bn5-obligation-route-reflection'
  );
  const residualTerminalPacketBN4ActivationRouteReflectionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-bn4-activation-route-reflection'
  );
  const residualTerminalPacketDirectionRouteReflectionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-direction-route-reflection'
  );


  const residualTerminalPacketBudgetRouteReflectionMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-budget-route-reflection'
  );
  const residualTerminalPacketBudgetHBActivityBindingMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'residual-terminal-packet-budget-hb-activity-binding'
  );

  const lockedNANDThresholdPublicationMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'global-locked-nand-threshold'
  );
  const globalZeroSlackPCCMinMilestone = status?.formalPublicationMilestones?.find(
    (row) => row.id === 'global-zeroslack-pccmin'
  );
  const lockedNANDThresholdPublicationTheoremRow =
    lockedNANDThresholdPublicationMilestone?.theoremRows?.find(
      (row) => row.name === 'PNP.Main.locked_nand_threshold'
    );

  return status?.kind === 'PNPFormalReconstructionStatus0'
    && status.coordinate === STATUS_COORDINATE
    && status.publicSurfaceBaselineCoordinate === PUBLIC_SURFACE_COORDINATE
    && status.currentStatusAuthority === true
    && status.status === 'formal-reconstruction-in-progress'
    && status.claimStatus === 'formal-reconstruction-in-progress'
    && status.leanToolchain === 'leanprover/lean4:v4.31.0'
    && status.leanTheoremInventoryCoordinate === INVENTORY_COORDINATE
    && status.leanTheoremInventorySha256 === INVENTORY_SHA256
    && status.leanTheoremInventoryGeneratedFromCompiledEnvironment === true
    && status.leanTheoremInventoryDeclarationCount === INVENTORY_COUNTS.declarations
    && status.leanTheoremInventoryTheoremCount === INVENTORY_COUNTS.theorems
    && status.leanTheoremInventoryAssumptionFreeTheoremCount === INVENTORY_COUNTS.assumptionFreeTheorems
    && status.leanTheoremInventoryExcludedPrivateDeclarationCount === INVENTORY_COUNTS.excludedPrivateDeclarations
    && status.leanTheoremInventorySourceClosureModuleCount === INVENTORY_COUNTS.modules
    && status.formalPublicationMapCoordinate === FORMAL_PUBLICATION_MAP_COORDINATE
    && status.formalPublicationMapSha256 === FORMAL_PUBLICATION_MAP_SHA256
    && status.concretePublicationGate?.actualSourceClosureSha256 === SOURCE_CLOSURE_SHA256
    && status.abstractPEqualsNPPublicationEligible === false
    && status.publicationStatusDerivedOnlyFromConcreteGate === true
    && validateConcreteGate(status, inventory)
    && validateMilestones(status, inventory)
    && sourceParserMilestone?.classification === 'formalized-foundation-only'
    && sourceParserMilestone.scope === "One literal nine-symbol finite work machine validates every strict version-zero source bitstring: it accepts exactly ValidEncodedCircuit, preserves valid bytes, clears invalid bytes, cannot time out within the proved compiled cubic bound, and supplies polynomial-time machine/function witnesses plus the validator's exact leaf RawRefinement."
    && sourceParserMilestone.nonClaim === "This source parser alone does not emit the locked-NAND target or establish the source-to-target PolynomialReduction. The downstream emitter now supplies its own runtime/output bounds and strict composition, but the abstract locked-NAND threshold assumption, CNFSAT-in-P result, NP-hardness or NP-completeness transport, and P = NP remain absent."
    && sameJson(
      sourceParserMilestone.requiredTheorems,
      LOCKED_NAND_SOURCE_PARSER_DECLARATIONS.map(([name]) => name)
    )
    && targetEmitterMilestone?.classification === 'formalized-foundation-only'
    && targetEmitterMilestone.scope === "One literal 1,387,921-rule grammar-only controller emits the exact direct locked-NAND target on every grammar-decoded circuit, rejects malformed grammar with empty output, cannot time out within an explicit all-input polynomial, has an explicit quadratic output-size bound, and supplies compiled polynomial-time machine/function witnesses, exact leaf RawRefinement, and strict parser/emitter composition computing buildLockedNANDInstance."
    && targetEmitterMilestone.nonClaim === "The standalone emitter intentionally accepts every grammar-decoded raw circuit, including intrinsically invalid references; strict fail-closed semantics come from parser composition. The standalone emitter does not itself package the language equivalence as PolynomialReduction; the downstream concrete reduction milestone now does. The abstract locked-NAND threshold assumption, CNFSAT-in-P result, NP-hardness transport, and P = NP remain absent."
    && sameJson(
      targetEmitterMilestone.requiredTheorems,
      LOCKED_NAND_TARGET_EMITTER_DECLARATIONS.map(([name]) => name)
    )
    && polynomialReductionMilestone?.classification === 'formalized-polynomial-reduction'
    && polynomialReductionMilestone.scope === "The existing strict parser/emitter composition is packaged as a concrete polynomial many-one reduction from EncodedNANDSAT to EncodedLockedNANDThreshold, with exact function identity, exact output, all-bitstring language equivalence, a ReducesTo witness, and recursive raw-machine refinement."
    && polynomialReductionMilestone.nonClaim === "The downstream all-input CNF compiler now identifies CNFSAT with this concrete source language through a fixed finite machine and a direct polynomial reduction, then composes with this reduction. This milestone does not discharge the abstract target-language assumption, prove the report-level locked-NAND threshold theorem, put CNFSAT in P, complete residual minimization or ZeroSlack, or prove P = NP."
    && sameJson(
      polynomialReductionMilestone.requiredTheorems,
      LOCKED_NAND_POLYNOMIAL_REDUCTION_DECLARATIONS.map(([name]) => name)
    )
    && cnfToNANDSemanticCompilerMilestone?.classification === 'formalized-semantic-boundary'
    && cnfToNANDSemanticCompilerMilestone.scope === "A total answer-independent compiler transforms every strict canonical CNF formula into an intrinsically topological well-formed NAND circuit, preserves satisfiability exactly, proves the exact gate count and a quadratic serialized-output bound, fails closed on every malformed bitstring, and composes semantically with the concrete locked-NAND threshold builder."
    && cnfToNANDSemanticCompilerMilestone.nonClaim === "This milestone is the pure semantic and size-bound layer; the subsequent all-input milestone supplies the finite-machine, PolynomialTimeFunction, RawRefinement, and PolynomialReduction interfaces. Neither layer decides CNF-SAT, proves CNFSAT is in deterministic polynomial time, discharges the abstract report-level locked-NAND premise, completes ZeroSlack/PCCMin, or proves P = NP."
    && sameJson(
      cnfToNANDSemanticCompilerMilestone.requiredTheorems,
      CNF_TO_NAND_SEMANTIC_COMPILER_DECLARATIONS.map(([name]) => name)
    )
    && cnfToNANDPolynomialReductionMilestone?.classification === "formalized-polynomial-reduction"
    && cnfToNANDPolynomialReductionMilestone.scope === "One fixed 135,070-rule three-node parser/carrier/controller work graph halts on every bitstring, rejects malformed CNF words with empty output, emits exactly compileEncodedCNFToNAND on every valid source, has one external encoded-input polynomial, compiles to a non-timeout PolynomialTimeFunction, retains literal RawRefinement, packages a direct PolynomialReduction from CNFSAT to EncodedNANDSAT, and composes it with the strict locked-NAND reduction to EncodedLockedNANDThreshold."
    && cnfToNANDPolynomialReductionMilestone.nonClaim === "This syntax-directed compiler does not itself decide CNF-SAT, put CNFSAT in deterministic polynomial time, establish SAT NP-hardness or CNFSAT NP-completeness, connect the concrete locked-NAND target to the abstract report-level threshold theorem, complete residual minimization or ZeroSlack/PCCMin, discharge any project assumption, or prove P = NP."
    && sameJson(
      cnfToNANDPolynomialReductionMilestone.requiredTheorems,
      CNF_TO_NAND_POLYNOMIAL_REDUCTION_DECLARATIONS.map(([name]) => name)
    )
    && residualGainChainMilestone?.classification === "formalized-iteration-bound-only"
    && residualGainChainMilestone.scope === "Every finite proof-bearing or executably verified chain of adjacent strict equivalent gains preserves semantics and the exhaustive reference minimum, while its endpoint residual slack plus its length is at most its starting residual slack. For the complete locked-NAND candidate, the existing residual-slack-at-most-four theorem specializes this to at most four verified gain steps."
    && residualGainChainMilestone.nonClaim === "This milestone bounds only a disclosed, independently verified sequence. It does not find the next gain, prove route or candidate-list completeness, justify stopping after fewer than the bound, construct ZeroSlack, compute an exact minimizer, establish polynomial checker or PCCMin runtime, put SAT in P, discharge a project assumption, or prove P = NP."
    && sameJson(
      residualGainChainMilestone.requiredTheorems,
      RESIDUAL_GAIN_CHAIN_DECLARATIONS.map(([name]) => name)
    )
    && residualGainStoppingMilestone?.classification === "formalized-semantic-stopping-only"
    && residualGainStoppingMilestone.scope === "For every finite direct-wire implementation, positive exhaustive-reference residual slack is equivalent to the existence of some strictly smaller semantically equivalent implementation; zero slack and semantic minimality are each equivalent to global absence of such an implementation. A verified chain endpoint with separately proved global no-gain evidence therefore has zero slack and packages an exact minimum result."
    && residualGainStoppingMilestone.nonClaim === "This is a semantic stopping criterion, not a stopping algorithm. It uses the exhaustive reference minimum as a mathematical witness and requires a proof quantifying over every finite implementation at the endpoint. It does not derive global absence from a finite scan, generate a route, prove candidate-list or route completeness, construct the manuscript's ZeroSlack certificate, establish polynomial checking or PCCMin runtime, put SAT in P, discharge a project assumption, or prove P = NP."
    && sameJson(
      residualGainStoppingMilestone.requiredTheorems,
      RESIDUAL_GAIN_STOPPING_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualGainStoppingSpecificationFormalized === true
    && status.leanResidualGainStoppingAxiomAuditPassed === true
    && status.leanResidualGainReferenceMinimumWitnessFormalized === true
    && status.leanResidualGainPositiveIffGlobalStrictGainFormalized === true
    && status.leanResidualGainZeroIffGlobalNoStrictGainFormalized === true
    && status.leanResidualGainSemanticMinimumIffGlobalNoStrictGainFormalized === true
    && status.leanResidualGainChainGlobalStoppingConsequenceFormalized === true
    && status.leanResidualGainChainExactMinimumPackagingFormalized === true
    && status.leanResidualGainStoppingScope === "all-finite-direct-wire-implementations-with-global-strict-equivalent-gain-quantification-and-proof-supplied-chain-endpoint-stopping"
    && residualTerminalFullBridgeMilestone?.classification === "formalized-terminal-full-mode-semantic-bridge"
    && residualTerminalFullBridgeMilestone.scope === "For every finite direct-wire implementation, terminalization preserves the exact whole implementation, gate count, and semantics at every input/output coordinate. An independently stated terminal minimum is attained, universally lower-bounds every complete terminal realization, and equals the exhaustive semantic reference minimum. Positive residual slack is equivalent to a cheaper whole-span full realization, every such realization gives strict residual descent, and zero slack is equivalent to absence of one."
    && residualTerminalFullBridgeMilestone.nonClaim === "This is the direct-wire terminal full-mode specialization of the manuscript bridge. It does not formalize the quotient carrier or quotient-to-full firewall, proper or governed supports, SaturatePositive, BCEL/BN2-BN6, packet or selector completeness, route generation, the ZeroSlack certificate, PCCMin, polynomial minimum search or checking, SAT in P, discharge a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalFullBridgeMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_FULL_BRIDGE_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalFullBridgeFormalized === true
    && status.leanResidualTerminalFullBridgeAxiomAuditPassed === true
    && status.leanResidualTerminalizationExactFormalized === true
    && status.leanResidualTerminalFullMinimumSpecificationFormalized === true
    && status.leanResidualTerminalMuBridgeFormalized === true
    && status.leanResidualWholeSpanPositiveWitnessIffFormalized === true
    && status.leanResidualWholeSpanStrictDescentFormalized === true
    && status.leanResidualWholeSpanZeroAbsenceIffFormalized === true
    && status.leanResidualTerminalFullBridgeScope === "all-finite-direct-wire-implementations-with-complete-multi-output-semantics-and-exhaustive-reference-minimum-witnesses"
    && status.leanResidualTerminalQuotientCarrierFormalized === true
    && status.leanResidualTerminalProperSupportFormalized === true
    && residualTerminalModeFirewallMilestone?.classification === "formalized-terminal-mode-firewall"
    && residualTerminalModeFirewallMilestone.scope === "For every finite direct-wire implementation, a computed finite profile observer records the ten terminal carrier roles and an explicit forgetful projection selects the quotient coordinates. Projection retains the exact implementation, gate count, and complete multi-output Boolean semantics. A quotient comparison has a checked full lift exactly when every forgotten profile coordinate agrees, lossless projections lift directly, and obligation discharge transports across a checked lift."
    && residualTerminalModeFirewallMilestone.nonClaim === "This is a terminal comparison/lifting firewall only. It supplies no proper or governed supports, arbitrary quotient construction, support or projection-defect minimum, saturation, Package E, BCEL/BN2-BN6, packet or selector completeness, global residual route, ZeroSlack certificate, PCCMin exactness or polynomial runtime, SAT-in-P result, discharged project assumption, or proof that P = NP."
    && sameJson(
      residualTerminalModeFirewallMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_MODE_FIREWALL_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalModeFirewallFormalized === true
    && status.leanResidualTerminalModeFirewallAxiomAuditPassed === true
    && status.leanResidualTerminalProfileProjectionExactFormalized === true
    && status.leanResidualTerminalCheckedFullLiftFormalized === true
    && status.leanResidualTerminalQuotientEqualityNotConstructiveFormalized === true
    && status.leanResidualTerminalObligationDischargePreservedFormalized === true
    && status.leanResidualTerminalModeFirewallScope === "all-finite-direct-wire-implementations-with-computed-finite-profile-observers-and-explicit-forgetful-projections"
    && residualTerminalProjectionMinimumMilestone?.classification === "formalized-terminal-projection-minimum"
    && residualTerminalProjectionMinimumMilestone.scope === "For every finite direct-wire implementation, computed finite terminal-profile observer, and explicit forgetful projection, complete enumeration through the current gate count computes an attained full-profile minimum and an attained quotient-profile minimum. Both minima universally lower-bound every matching realization, forgetting coordinates cannot increase the minimum, the full minimum decomposes as the quotient minimum plus a nonnegative projection defect, and that defect is zero exactly when an attained quotient minimum has a checked full lift."
    && residualTerminalProjectionMinimumMilestone.nonClaim === "These are exhaustive finite reference minima through the supplied implementation size. This milestone proves no polynomial runtime, proper or governed support construction, arbitrary manuscript quotient carrier, SaturatePositive, Package E, BCEL/BN2-BN6, complete residual routing, ZeroSlack certificate, PCCMin exactness, SAT-in-P result, discharged project assumption, or proof that P = NP."
    && sameJson(
      residualTerminalProjectionMinimumMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PROJECTION_MINIMUM_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualProjectionMinimumFormalized === true
    && status.leanResidualProjectionMinimumAxiomAuditPassed === true
    && status.leanResidualProjectionMinimumExecutableFullScanFormalized === true
    && status.leanResidualProjectionMinimumExecutableQuotientScanFormalized === true
    && status.leanResidualProjectionMinimumAttainmentFormalized === true
    && status.leanResidualProjectionMinimumUniversalLowerBoundsFormalized === true
    && status.leanResidualProjectionMinimumMonotonicityFormalized === true
    && status.leanResidualProjectionDefectDecompositionFormalized === true
    && status.leanResidualProjectionDefectZeroIffCheckedLiftAtMinimumFormalized === true
    && status.leanResidualProjectionMinimumScope === "all-finite-direct-wire-implementations-with-computed-finite-profile-observers-explicit-projections-and-exhaustive-search-through-the-current-gate-count"
    && residualTerminalProjectionTransferMilestone?.classification === "formalized-terminal-projection-transfer"
    && residualTerminalProjectionTransferMilestone.scope === "For every finite direct-wire four-corner terminal-profile family sharing one computed observer and one explicit projection, signed full and quotient minimum deltas obey the exact Section 5.2 transfer identity. The projection excess is the quotient delta minus the full delta; if meet and both side defects are zero while the join defect is D, the excess equals D and is positive whenever D is positive."
    && residualTerminalProjectionTransferMilestone.nonClaim === "This is signed arithmetic over four supplied corners. It does not construct or certify a proper governed support square, prove SaturatePositive, discharge Package E or BCEL/BN2-BN6, generate a complete residual route, prove ZeroSlack or PCCMin, establish polynomial runtime, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalProjectionTransferMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PROJECTION_TRANSFER_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualProjectionTransferFormalized === true
    && status.leanResidualProjectionTransferAxiomAuditPassed === true
    && status.leanResidualProjectionTransferSignedDeltasFormalized === true
    && status.leanResidualProjectionTransferIdentityFormalized === true
    && status.leanResidualProjectionTransferConstantCutFormalized === true
    && status.leanResidualProjectionTransferScope === "all-finite-direct-wire-four-corner-terminal-profile-families-sharing-one-computed-observer-and-one-explicit-projection"
    && residualTerminalSaturationMilestone?.classification === "formalized-terminal-saturation-closure"
    && residualTerminalSaturationMilestone.scope === "For every finite terminal primitive-record universe and every explicit Boolean dependency system tagged by the manuscript's ten closure mechanisms, the generated reflexive transitive closure contains the seed, is dependency-closed, is least among closed supersets, is monotone and idempotent, and has exactly the closed supports as fixed points."
    && residualTerminalSaturationMilestone.nonClaim === "This closure theorem does not derive the dependency relation from an arbitrary circuit, construct proper support, prove support completion or square legitimacy, instantiate a projection-compatible square, prove SaturatePositive or BCELReady, discharge Package E or BCEL/BN2-BN6, generate a complete residual route, prove ZeroSlack or PCCMin, establish polynomial runtime, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalSaturationMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_SATURATION_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalSaturationFormalized === true
    && status.leanResidualTerminalSaturationAxiomAuditPassed === true
    && status.leanResidualTerminalPrimitiveUniverseFormalized === true
    && status.leanResidualTerminalSaturationExtensiveFormalized === true
    && status.leanResidualTerminalSaturationLeastFormalized === true
    && status.leanResidualTerminalSaturationMonotoneFormalized === true
    && status.leanResidualTerminalSaturationIdempotentFormalized === true
    && status.leanResidualTerminalSaturationScope === "all-finite-terminal-primitive-record-universes-with-explicit-boolean-rule-tagged-dependencies"
    && status.leanResidualTerminalSupportCompletionFormalized === true
    && status.leanResidualTerminalSquareLegitimacyFormalized === true
    && status.leanResidualTerminalProjectionSquareFormalized === true
    && residualTerminalPhysicalSupportMilestone?.classification === "formalized-terminal-physical-support-completion"
    && residualTerminalPhysicalSupportMilestone.scope === "For every finite direct-wire candidate, explicit terminal dependency system, and finite seed list, a deterministic finite work list computes exactly the inductive saturation, then the actual program computes canonically ordered incoming boundary and outgoing interface wires. Lean proves no crossing wire is omitted or added and the composed physical support is compatible."
    && residualTerminalPhysicalSupportMilestone.nonClaim === "The terminal dependency system remains explicit data rather than an extracted profile frontier. This milestone does not construct proper positive support, prove support completion in the manuscript's full sense or square legitimacy, instantiate the required projection square, prove SaturatePositive, discharge Package E or BCEL/BN2-BN6, generate a complete residual route, prove ZeroSlack or PCCMin, establish polynomial runtime, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPhysicalSupportMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PHYSICAL_SUPPORT_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalExecutableSaturationFormalized === true
    && status.leanResidualTerminalPhysicalSupportCompletionFormalized === true
    && status.leanResidualTerminalPhysicalBoundaryFormalized === true
    && status.leanResidualTerminalPhysicalInterfaceFormalized === true
    && status.leanResidualTerminalPhysicalCompatibilityFormalized === true
    && status.leanResidualTerminalPhysicalSupportCompletionAxiomAuditPassed === true
    && status.leanResidualTerminalPhysicalSupportCompletionScope === "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-finite-seed-lists"
    && residualTerminalSupportExtractionMilestone?.classification === "formalized-terminal-support-extraction"
    && residualTerminalSupportExtractionMilestone.scope === "For every finite direct-wire candidate and finite terminal record list, including noncontiguous selections, the actual program is structurally extracted over its exact canonical incoming boundary and ordered outgoing interface. The extracted candidate equals an independently defined open-support function for every boundary valuation and recovers the original interface values on whole-circuit-induced boundaries; the construction also composes with executable terminal saturation."
    && residualTerminalSupportExtractionMilestone.nonClaim === "The record list and terminal dependency system remain explicit inputs rather than the manuscript's derived profile frontier. This milestone does not construct a proper positive support, prove full governed support completion or square legitimacy, instantiate the required projection square, prove SaturatePositive, discharge Package E or BCEL/BN2-BN6, generate a complete residual route, prove ZeroSlack or PCCMin, establish polynomial runtime, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalSupportExtractionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_SUPPORT_EXTRACTION_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalSupportExtractionFormalized === true
    && status.leanResidualTerminalSupportExtractionAxiomAuditPassed === true
    && status.leanResidualTerminalSupportExtractionScope === "all-finite-direct-wire-candidates-terminal-record-lists-boundary-valuations-and-interface-coordinates"
    && status.leanResidualTerminalOpenSemanticsFormalized === true
    && status.leanResidualTerminalInducedRecoveryFormalized === true
    && residualTerminalProperSupportMilestone?.classification === "formalized-governed-proper-positive-support-search"
    && residualTerminalProperSupportMilestone.scope === "For every finite direct-wire candidate and explicit terminal dependency system, Lean enumerates the complete canonical finite universe of primitive-record seeds, saturates and physically completes each seed, extracts its exact open support, and computes exact local gain from the exhaustive semantic reference minimum. The search returns a proof-bearing nonempty proper support with positive gain whenever one exists in that canonical seed universe, and its none result is equivalent to the absence of such a seed."
    && residualTerminalProperSupportMilestone.nonClaim === "The terminal dependency system remains explicit input rather than a profile frontier derived from the circuit, and the search is exhaustive reference computation rather than a polynomial algorithm. This milestone does not prove global gain completeness, full manuscript support completion or square legitimacy, instantiate a projection-compatible square, prove SaturatePositive or BCELReady, discharge Package E or BCEL/BN2-BN6, generate a complete residual route, prove ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalProperSupportMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PROPER_SUPPORT_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalProperSupportFormalized === true
    && status.leanResidualTerminalProperSupportSearchCompleteFormalized === true
    && status.leanResidualTerminalProperSupportExactLocalGainFormalized === true
    && status.leanResidualTerminalProperSupportAxiomAuditPassed === true
    && status.leanResidualTerminalProperSupportScope === "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-canonical-primitive-record-seeds-with-exhaustive-reference-minimum-local-gain"
    && status.leanResidualTerminalSupportCompletionFormalized === true
    && status.leanResidualTerminalSquareLegitimacyFormalized === true
    && status.leanResidualTerminalProjectionSquareFormalized === true
    && status.leanPCCMinPolynomialRuntimeFormalized === false
    && residualTerminalSupportSquareMilestone?.classification === "formalized-terminal-saturated-support-square-closure"
    && residualTerminalSupportSquareMilestone.scope === "For every finite direct-wire candidate, every explicit terminal dependency system, and every pair of finite terminal seeds, Lean computes saturated left and right corners, their canonical closed meet, and their closed saturated-union join. It proves the exact greatest-lower-bound and least-upper-bound laws, seed extensionality, computed physical compatibility, exact gate count, open-support semantics, and induced whole-circuit recovery for all four corners."
    && residualTerminalSupportSquareMilestone.nonClaim === "The terminal dependency system remains explicit input rather than a profile frontier derived from the circuit. This milestone proves finite closed-corner algebra and computed physical extraction, not the manuscript's obstruction routing, frontier pushout, projection-compatible square, side-tight four-corner minima, BN2 square legitimacy, SaturatePositive, Package E, BCEL/BN2-BN6, complete residual routing, ZeroSlack, PCCMin, polynomial runtime, SAT in P, removal of a project assumption, or P = NP."
    && sameJson(
      residualTerminalSupportSquareMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_SUPPORT_SQUARE_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalSupportSquareClosureFormalized === true
    && status.leanResidualTerminalSupportSquareMeetJoinExactFormalized === true
    && status.leanResidualTerminalSupportSquarePhysicalCompatibilityFormalized === true
    && status.leanResidualTerminalSupportSquareSemanticExtractionFormalized === true
    && status.leanResidualTerminalSupportSquareClosureAxiomAuditPassed === true
    && status.leanResidualTerminalSupportSquareClosureScope === "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-pairs-of-finite-terminal-seeds"
    && status.leanResidualTerminalSupportCompletionFormalized === true
    && status.leanResidualTerminalSquareLegitimacyFormalized === true
    && status.leanResidualTerminalProjectionSquareFormalized === true
    && status.leanPCCMinPolynomialRuntimeFormalized === false
    && residualTerminalGovernedSupportMilestone?.classification === "formalized-terminal-governed-support-completion"
    && residualTerminalGovernedSupportMilestone.scope === "For every finite direct-wire candidate, explicit terminal dependency system, finite seed list, and computed saturated support-square corner, Lean computes the exact physical boundary, ordered interface, and partition of selected profile coordinates among all ten terminal profile roles. It proves exact membership, no duplicates, pairwise disjointness, record coverage, dependency closure, physical compatibility, and retention of each exact corner."
    && residualTerminalGovernedSupportMilestone.nonClaim === "The terminal dependency system remains explicit input rather than a profile frontier derived from the circuit. This milestone computes a governed finite completion of each saturated support-square corner, not the manuscript's obstruction routing, frontier pushout, projection-compatible square, side-tight four-corner minima, BN2 square legitimacy, SaturatePositive, Package E, BCEL/BN2-BN6, complete residual routing, ZeroSlack, PCCMin, polynomial runtime, SAT in P, removal of a project assumption, or P = NP."
    && sameJson(
      residualTerminalGovernedSupportMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_GOVERNED_SUPPORT_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalGovernedSupportCompletionFormalized === true
    && status.leanResidualTerminalGovernedProfilePartitionFormalized === true
    && status.leanResidualTerminalGovernedSupportCompletionAxiomAuditPassed === true
    && status.leanResidualTerminalGovernedSupportCompletionScope === "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-finite-seed-lists-and-saturated-support-square-corners"
    && residualTerminalFrontierPushoutMilestone?.classification === "formalized-terminal-governed-frontier-pushout"
    && residualTerminalFrontierPushoutMilestone.scope === "For every finite direct-wire candidate, explicit terminal dependency system, and computed saturated support square, Lean constructs the governed boundary, interface, and role-preserving profile pushout from the two side completions alone. The independently completed join frontier equals that gluing, the meet profile is the exact shared overlap, and every side physical coordinate is either retained externally or witnessed as internalized."
    && residualTerminalFrontierPushoutMilestone.nonClaim === "The terminal dependency system remains explicit input rather than a profile frontier derived from the circuit. This milestone proves exact frontier gluing for computed saturated support squares, not projection compatibility, side-tight four-corner minima, BN2 square legitimacy, SaturatePositive, Package E, BCEL/BN2-BN6, complete obstruction routing, ZeroSlack, PCCMin, polynomial runtime, SAT in P, removal of a project assumption, or P = NP."
    && sameJson(
      residualTerminalFrontierPushoutMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_FRONTIER_PUSHOUT_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalFrontierPushoutFormalized === true
    && status.leanResidualTerminalFrontierBoundaryGlueExactFormalized === true
    && status.leanResidualTerminalFrontierInterfaceGlueExactFormalized === true
    && status.leanResidualTerminalFrontierProfileGlueExactFormalized === true
    && status.leanResidualTerminalFrontierInternalizationFormalized === true
    && status.leanResidualTerminalFrontierPushoutAxiomAuditPassed === true
    && status.leanResidualTerminalFrontierPushoutScope === "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-and-computed-saturated-support-squares"
    && residualTerminalProjectionSquareMilestone?.classification === "formalized-terminal-governed-projection-square"
    && residualTerminalProjectionSquareMilestone.scope === "For every finite direct-wire candidate, explicit terminal dependency system, computed saturated support square, and every forgetful terminal projection, Lean retains the exact physical frontier, filters all ten role profiles exactly, proves projected meet is the shared side overlap, and proves projected join is the side-only projected pushout without reading the join corner."
    && residualTerminalProjectionSquareMilestone.nonClaim === "The terminal dependency system remains explicit input rather than a profile frontier derived from the circuit. This milestone proves structural projection commutation for computed saturated support squares, not side-tight four-corner minima, BN2 square legitimacy, SaturatePositive, Package E, BCEL/BN2-BN6, complete obstruction routing, ZeroSlack, PCCMin, polynomial runtime, SAT in P, removal of a project assumption, or P = NP."
    && sameJson(
      residualTerminalProjectionSquareMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PROJECTION_SQUARE_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalProjectionSquareFormalized === true
    && status.leanResidualTerminalProjectionPhysicalInvariantFormalized === true
    && status.leanResidualTerminalProjectionProfileExactFormalized === true
    && status.leanResidualTerminalProjectionMeetJoinCommuteFormalized === true
    && status.leanResidualTerminalProjectionPushoutCommuteFormalized === true
    && status.leanResidualTerminalProjectionSquareAxiomAuditPassed === true
    && status.leanResidualTerminalProjectionSquareScope === "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-computed-saturated-support-squares-and-forgetful-terminal-projections"
    && residualTerminalSideTightMinimumMilestone?.classification === "formalized-residual-terminal-side-tight-minimum-arithmetic"
    && residualTerminalSideTightMinimumMilestone.scope === "For every finite terminal projection four-corner family and every independently attained typed full or quotient basis, Lean proves componentwise minimum bounds and the exact signed four-slack identity. A fail-closed Boolean and Option gate returns the corresponding existing delta only when meet, left, right, and join all attain their exact minima; both canonical independently attained minimum bases pass."
    && residualTerminalSideTightMinimumMilestone.nonClaim === "The canonical corner minima are independently attained. This milestone proves numerical arithmetic and fail-closed exactness, not construction of one coherent four-corner basis, coherent completion, maximization over a finite tight family, BN2 square legitimacy, SaturatePositive, Package E, BCELReady or BCEL/BN2-BN6, complete obstruction routing, ZeroSlack, PCCMin, polynomial runtime, SAT in P, removal of a project assumption, or P = NP."
    && sameJson(
      residualTerminalSideTightMinimumMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_SIDE_TIGHT_MINIMUM_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalSideTightMinimumArithmeticFormalized === true
    && status.leanResidualTerminalSideTightSignedSlackIdentityFormalized === true
    && status.leanResidualTerminalSideTightFailClosedGateFormalized === true
    && status.leanResidualTerminalSideTightCanonicalFullBasisFormalized === true
    && status.leanResidualTerminalSideTightCanonicalQuotientBasisFormalized === true
    && status.leanResidualTerminalSideTightMinimumAxiomAuditPassed === true
    && status.leanResidualTerminalSideTightMinimumScope === "all-finite-terminal-projection-four-corner-families-and-independently-attained-full-and-quotient-minimum-bases"
    && residualTerminalFourCornerCarrierMilestone?.classification === "formalized-residual-terminal-four-corner-carrier-transport"
    && residualTerminalFourCornerCarrierMilestone.scope === "For every finite computed saturated terminal support square, direct-wire candidate, and forgetful terminal projection, Lean derives all four exact governed and extracted endpoints in common ambient coordinates, proves duplicate-free boundary, interface, and profile lists, transports meet and join profiles exactly, and classifies each present side physical coordinate as identically retained or constructively internalized through fail-closed queries."
    && residualTerminalFourCornerCarrierMilestone.nonClaim === "This milestone supplies a checked common ambient carrier for the computed square. It does not transport four optimum realizers, prove the full four-corner optimum carrier-compatibility obligation, construct a coherent four-corner optimum, prove side-tight completion or BN2 square legitimacy, establish SaturatePositive, Package E, BCELReady or BCEL/BN2-BN6, complete obstruction routing, prove ZeroSlack, PCCMin, polynomial runtime, SAT in P, removal of a project assumption, or P = NP."
    && sameJson(
      residualTerminalFourCornerCarrierMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_FOUR_CORNER_CARRIER_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalFourCornerCarrierTransportFormalized === true
    && status.leanResidualTerminalFourCornerCarrierExactEndpointsFormalized === true
    && status.leanResidualTerminalFourCornerCarrierInjectiveCoordinatesFormalized === true
    && status.leanResidualTerminalFourCornerCarrierProfileTransportFormalized === true
    && status.leanResidualTerminalFourCornerCarrierFailClosedPhysicalTransportFormalized === true
    && status.leanResidualTerminalFourCornerCarrierAxiomAuditPassed === true
    && status.leanResidualTerminalFourCornerCarrierScope === "all-finite-computed-saturated-terminal-support-squares-and-canonical-physical-profile-transport-coordinates"
    && residualTerminalFourCornerOptimaMilestone?.classification === "formalized-residual-terminal-four-corner-optimum-carrier-compatibility"
    && residualTerminalFourCornerOptimaMilestone.scope === "For every finite computed saturated terminal support square and every explicit observer, Lean embeds all four exact corner candidates into one common ambient carrier, proves reversible semantic and gate-count preservation, proves exact ambient and corner reference minima agree, and localizes canonical full and quotient optima from one shared observer and projection without changing their exact minimum counts."
    && residualTerminalFourCornerOptimaMilestone.nonClaim === "This milestone compares independently attained full and quotient optima on one reversible common carrier. It does not prove coherent transport along the square legs, construct a coherent four-corner optimum, prove sideTightCompletionExists or BN2 square legitimacy, derive the terminal dependency system, establish SaturatePositive, Package E, BCELReady or BCEL/BN2-BN6, complete obstruction routing, prove ZeroSlack, PCCMin, polynomial runtime, SAT in P, removal of a project assumption, or P = NP."
    && sameJson(
      residualTerminalFourCornerOptimaMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMA_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalFourCornerOptimaCarrierCompatibleFormalized === true
    && status.leanResidualTerminalFourCornerOptimaFaithfulAmbientizationFormalized === true
    && status.leanResidualTerminalFourCornerOptimaReferenceMinimumPreservedFormalized === true
    && status.leanResidualTerminalFourCornerOptimaLocalizedMinimaFormalized === true
    && status.leanResidualTerminalFourCornerOptimaSharedObserverProjectionFormalized === true
    && status.leanResidualTerminalFourCornerOptimaAxiomAuditPassed === true
    && status.leanResidualTerminalFourCornerOptimaCarrierScope === "all-finite-computed-saturated-terminal-support-squares-one-reversible-ambient-carrier-and-shared-observer-projection"
    && residualTerminalFourCornerOptimumCoherenceMilestone?.classification === "formalized-residual-terminal-four-corner-optimum-coherence-dichotomy"
    && residualTerminalFourCornerOptimumCoherenceMilestone.scope === "For every finite computed terminal support square, every explicit observer, every terminal projection, and either full or quotient coherence mode, Lean checks the four square legs in a deterministic order and returns either one coherent canonical optimum tuple with exact transport, side-tight, and incidence facts or the exact deterministic first failure."
    && residualTerminalFourCornerOptimumCoherenceMilestone.nonClaim === "This milestone classifies coherent transport or its exact first failure. It does not prove that every square is coherent, construct the later no-outcome route, prove sideTightCompletionExists or BN2 square legitimacy, establish SaturatePositive, Package E, BCELReady or BCEL/BN2-BN6, complete obstruction routing, prove ZeroSlack, PCCMin, polynomial runtime, SAT in P, removal of a project assumption, or P = NP."
    && sameJson(
      residualTerminalFourCornerOptimumCoherenceMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_FOUR_CORNER_OPTIMUM_COHERENCE_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalFourCornerOptimumCoherenceClassifierFormalized === true
    && status.leanResidualTerminalFourCornerOptimumFirstFailureFormalized === true
    && status.leanResidualTerminalFourCornerOptimumRetainedSemanticsFormalized === true
    && status.leanResidualTerminalFourCornerOptimumProfileTransportFormalized === true
    && status.leanResidualTerminalFourCornerOptimumModeFirewallFormalized === true
    && status.leanResidualTerminalFourCornerOptimumSideTightTupleFactsFormalized === true
    && status.leanResidualTerminalFourCornerOptimumCoherenceAxiomAuditPassed === true
    && status.leanResidualTerminalFourCornerOptimumCoherenceScope === "all-finite-computed-terminal-support-squares-observers-projections-and-full-or-quotient-modes-coherent-tuple-or-deterministic-first-failure"
    && residualTerminalFourCornerSideTightCompletionMilestone?.classification === "formalized-residual-terminal-four-corner-side-tight-completion-under-local-route-silence"
    && residualTerminalFourCornerSideTightCompletionMilestone.scope === "For every finite computed terminal support square, every explicit observer, and either full or quotient coherence mode, the exact first local coherence query returns a proof-bearing sound route or, under computed local route silence, Lean supplies the complete checked side-tight coherent optimum tuple with exact minimum incidence value while retaining the separate quotient-promotion firewall."
    && residualTerminalFourCornerSideTightCompletionMilestone.nonClaim === "This milestone closes only the local completion edge under computed local route silence. It does not prove universal route silence, connect a local obstruction to the complete global no-outcome route system, prove BN2 square legitimacy, derive the terminal dependency system, enumerate or maximize the complete tight-basis family, establish SaturatePositive, Package E, BCELReady or BCEL/BN2-BN6, complete obstruction routing, prove ZeroSlack, PCCMin, polynomial runtime, SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalFourCornerSideTightCompletionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_FOUR_CORNER_SIDE_TIGHT_COMPLETION_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalFourCornerOptimumLocalRouteClassifierFormalized === true
    && status.leanResidualTerminalFourCornerOptimumRouteSoundnessFormalized === true
    && status.leanResidualTerminalFourCornerOptimumRouteSilenceFormalized === true
    && status.leanResidualTerminalFourCornerOptimumSideTightCompletionUnderRouteSilenceFormalized === true
    && status.leanResidualTerminalFourCornerOptimumExactCompletionValuesFormalized === true
    && status.leanResidualTerminalFourCornerOptimumPromotionFirewallRetained === true
    && status.leanResidualTerminalFourCornerSideTightCompletionAxiomAuditPassed === true
    && status.leanResidualTerminalFourCornerSideTightCompletionScope === "all-finite-computed-terminal-support-squares-observers-and-full-or-quotient-modes-side-tight-coherent-completion-under-exact-local-route-silence"
    && residualTerminalFourCornerTightBasisMaximumMilestone?.classification === "formalized-residual-terminal-four-corner-complete-tight-basis-maximum"
    && residualTerminalFourCornerTightBasisMaximumMilestone.scope === "For every finite computed terminal support square, every explicit observer, and either full or quotient mode, Lean enumerates the complete finite tight-basis family, retains every exact profile-constrained minimum implementation at each corner, filters the full Cartesian product with the arbitrary-family coherence query, and proves under exact local route silence that the signed maximum equals the selected delta."
    && residualTerminalFourCornerTightBasisMaximumMilestone.nonClaim === "This milestone closes the remaining local BN2 tight-basis maximum under computed local route silence. It does not prove universal route silence, connect a local obstruction to the complete global no-outcome route system, prove BN2 square legitimacy, derive the terminal dependency system, establish SaturatePositive, Package E, BCELReady or BCEL/BN2-BN6, complete obstruction routing, prove ZeroSlack, PCCMin, polynomial runtime, SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalFourCornerTightBasisMaximumMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_FOUR_CORNER_TIGHT_BASIS_MAXIMUM_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalFourCornerArbitraryFamilyCoherenceFormalized === true
    && status.leanResidualTerminalFourCornerExactMinimumFamilyEnumerated === true
    && status.leanResidualTerminalFourCornerTightBasisFamilyComplete === true
    && status.leanResidualTerminalFourCornerSignedTightBasisMaximumFormalized === true
    && status.leanResidualTerminalFourCornerTightBasisMaximumEqualsDeltaFormalized === true
    && status.leanResidualTerminalFourCornerTightBasisMaximumAxiomAuditPassed === true
    && status.leanResidualTerminalFourCornerTightBasisMaximumScope === "all-finite-computed-terminal-support-squares-observers-and-full-or-quotient-modes-complete-tight-basis-family-and-signed-maximum-under-exact-local-route-silence"
    && status.leanResidualTerminalCoherentFourCornerBasisFormalized === true
    && status.leanResidualTerminalCoherentFourCornerBasisScope === "conditional-on-exact-mode-appropriate-local-route-silence-not-universal-bn2-square-legitimacy"
    && residualTerminalComputedBN2SquareLegitimacyMilestone?.classification === "formalized-residual-terminal-computed-bn2-square-legitimacy"
    && residualTerminalComputedBN2SquareLegitimacyMilestone.status === "formalized-residual-terminal-computed-bn2-square-legitimacy"
    && residualTerminalComputedBN2SquareLegitimacyMilestone.scope === "For every finite computed terminal support square built from two finite seeds under one explicit terminal dependency system, direct-wire candidate, observer, and forgetful projection, Lean constructs the exact compatible governed frontier and projection square, keeps full and quotient minimum quantities on the same carrier, and returns either the complete local conclusion under exact local route silence or the deterministic full-then-quotient proof-bearing first coherence route."
    && residualTerminalComputedBN2SquareLegitimacyMilestone.nonClaim === "This milestone packages computed structural legitimacy and the exact local no-route conclusion. It does not derive the terminal dependency system from an arbitrary circuit, prove universal route silence, connect a local failure to the complete global no-outcome route system, identify a BCEL anchor square, establish SaturatePositive, Package E, BCELReady or later BCEL/BN2-BN6 conclusions, prove ZeroSlack, PCCMin, polynomial runtime, SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalComputedBN2SquareLegitimacyMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_COMPUTED_BN2_SQUARE_LEGITIMACY_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalSquareLegitimacyFormalized === true
    && status.leanResidualTerminalSquareStructuralCompatibilityFormalized === true
    && status.leanResidualTerminalSquareFrontierPushoutFormalized === true
    && status.leanResidualTerminalSquareSharedQuantityCarrierFormalized === true
    && status.leanResidualTerminalSquareLocalConclusionUnderRouteSilenceFormalized === true
    && status.leanResidualTerminalSquareFailClosedRouteDichotomyFormalized === true
    && status.leanResidualTerminalSquareLegitimacyAxiomAuditPassed === true
    && status.leanResidualTerminalSquareLegitimacyScope === "all-finite-computed-terminal-support-squares-explicit-terminal-dependency-systems-direct-wire-candidates-observers-and-forgetful-projections-with-local-route-silence-or-proof-bearing-first-failure"
    && residualTerminalComputedBCELAnchorNucleusMilestone?.classification === "formalized-residual-terminal-computed-bcel-anchor-nucleus"
    && residualTerminalComputedBCELAnchorNucleusMilestone.status === "formalized-residual-terminal-computed-bcel-anchor-nucleus"
    && residualTerminalComputedBCELAnchorNucleusMilestone.scope === "For every finite direct-wire candidate, explicit terminal dependency system, computed governed proper-positive support, forgetful projection, executable ambient observer, and positive whole-support projection defect, Lean computes the canonical minimum-cardinality positive anchor nucleus and returns either an insufficient nucleus, the exact first anchor-algebra mismatch, the exact first proper-cut defect mismatch, the proof-bearing first full-before-quotient local route, or exact constant-cut and local BN2 conclusions for every proper cut."
    && residualTerminalComputedBCELAnchorNucleusMilestone.nonClaim === "This milestone assumes a positive whole-support projection defect and an explicit terminal dependency system. It does not derive either premise, identify manuscript activation or charge equivalence classes absent from the terminal model, connect a local failure to the complete global no-outcome route system, establish SaturatePositive, Package E, BCELReady or later BCEL/BN2-BN6 conclusions, prove ZeroSlack, PCCMin, polynomial runtime, SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalComputedBCELAnchorNucleusMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_COMPUTED_BCEL_ANCHOR_NUCLEUS_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalComputedBCELAnchorNucleusFormalized === true
    && status.leanResidualTerminalBCELMinimumPositiveNucleusFormalized === true
    && status.leanResidualTerminalBCELAnchorAlgebraFormalized === true
    && status.leanResidualTerminalBCELCutDefectFirewallFormalized === true
    && status.leanResidualTerminalBCELCutRouteDichotomyFormalized === true
    && status.leanResidualTerminalBCELConstantCutConclusionFormalized === true
    && status.leanResidualTerminalBCELAnchorNucleusAxiomAuditPassed === true
    && status.leanResidualTerminalBCELAnchorNucleusScope === "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-computed-governed-proper-positive-supports-forgetful-projections-executable-ambient-observers-and-positive-whole-support-projection-defect"
    && residualTerminalSaturationPositivityFirewallMilestone?.classification === "formalized-residual-terminal-saturation-positivity-firewall"
    && residualTerminalSaturationPositivityFirewallMilestone.status === "formalized-residual-terminal-saturation-positivity-firewall"
    && residualTerminalSaturationPositivityFirewallMilestone.scope === "For every finite direct-wire candidate, explicit terminal dependency system, computed governed proper-positive support, forgetful projection, and executable ambient observer, Lean computes the whole-support defect: zero projection defect returns an attained quotient minimum with a checked full lift, while positive defect delegates exactly to the existing fail-closed BCEL anchor-nucleus classifier."
    && residualTerminalSaturationPositivityFirewallMilestone.nonClaim === "This closes only projectionPositivityNotLostSilently in the current finite terminal model. It assumes an explicit terminal dependency system and an already computed governed proper-positive support. It does not discharge transparentSaturationCostBalanced, interfaceExposureRoutesToE, originKernelObligationClosureRouted, or firstNontransparentStepRecorded; establish full SaturatePositive, Package E, BCELReady or later BCEL/BN2-BN6 conclusions; prove ZeroSlack, PCCMin, polynomial runtime, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalSaturationPositivityFirewallMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_SATURATION_POSITIVITY_FIREWALL_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalSaturationPositivityFirewallFormalized === true
    && status.leanResidualTerminalSaturationPositivityFirewallAxiomAuditPassed === true
    && status.leanResidualTerminalSaturationPositivityFirewallScope === "all-finite-direct-wire-candidates-explicit-terminal-dependency-systems-computed-governed-proper-positive-supports-forgetful-projections-and-executable-ambient-observers-total-zero-or-positive-whole-support-projection-defect-classification"
    && residualTerminalCandidateSaturationCostBalanceMilestone?.classification === "formalized-residual-terminal-candidate-saturation-cost-balance"
    && residualTerminalCandidateSaturationCostBalanceMilestone.status === "formalized-residual-terminal-candidate-saturation-cost-balance"
    && residualTerminalCandidateSaturationCostBalanceMilestone.scope === "For every finite direct-wire candidate, executable ambient observer, forgetful projection, and finite terminal seed, Lean computes the candidate-derived dependency system and deterministic rule-labelled saturation trace, then returns proof that every event is exactly cost-balanced with preserved full slack and nondecreasing projection defect, or records the exact first nontransparent event and complete transparent prefix."
    && residualTerminalCandidateSaturationCostBalanceMilestone.nonClaim === "This closes only the finite terminal forms of transparentSaturationCostBalanced and firstNontransparentStepRecorded. The executable observer and forgetful projection remain explicit model inputs, and a nontransparent event is recorded rather than routed. It does not discharge interfaceExposureRoutesToE or originKernelObligationClosureRouted; establish full SaturatePositive, Package E, BCELReady or later BCEL/BN2-BN6 conclusions; prove ZeroSlack, PCCMin, polynomial runtime, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalCandidateSaturationCostBalanceMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_CANDIDATE_SATURATION_COST_BALANCE_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalCandidateSaturationFormalized === true
    && status.leanResidualTerminalSaturationCostBalanceFormalized === true
    && status.leanResidualTerminalFirstNontransparentStepFormalized === true
    && status.leanResidualTerminalSaturationCostBalanceAxiomAuditPassed === true
    && status.leanResidualTerminalSaturationCostBalanceScope === "all-finite-direct-wire-candidates-executable-observers-forgetful-projections-candidate-derived-dependency-system-rule-labelled-exact-cost-balance-or-first-nontransparent-step"
    && residualTerminalInterfaceExposureRoutingMilestone?.classification === "formalized-residual-terminal-interface-exposure-routing"
    && residualTerminalInterfaceExposureRoutingMilestone.status === "formalized-residual-terminal-interface-exposure-routing"
    && residualTerminalInterfaceExposureRoutingMilestone.scope === "For every finite direct-wire candidate, executable ambient observer, forgetful projection, and finite terminal seed, Lean recognizes only an exact candidate-derived interface-consumer edge. Each recognized event is transparently cost-balanced or produces a proof-bearing local E-route; the production trace result records the exact first nontransparent event and complete transparent prefix, while non-interface first failures remain fail-closed."
    && residualTerminalInterfaceExposureRoutingMilestone.nonClaim === "This closes only the finite local form of interfaceExposureRoutesToE. The proof-bearing local E-route is an exposure-obligation coordinate, not a full Package E VerifyDW acceptance, a verified global gain, or global route completeness. The executable observer and forgetful projection remain explicit model inputs. It does not discharge originKernelObligationClosureRouted; establish full SaturatePositive, Package E, BCELReady or later BCEL/BN2-BN6 conclusions; prove ZeroSlack, PCCMin, polynomial runtime, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalInterfaceExposureRoutingMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_INTERFACE_EXPOSURE_ROUTING_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalInterfaceExposureRoutingFormalized === true
    && status.leanResidualTerminalFiniteInterfaceExposureRoutesToEFormalized === true
    && status.leanResidualTerminalInterfaceExposureZeroCostRetractFormalized === true
    && status.leanResidualTerminalFirstInterfaceExposureRouteFormalized === true
    && status.leanResidualTerminalInterfaceExposureRoutingAxiomAuditPassed === true
    && status.leanResidualTerminalInterfaceExposureRoutingScope === "all-finite-direct-wire-candidates-executable-observers-forgetful-projections-candidate-derived-interface-consumer-transparent-or-local-e-route-with-exact-first-failure"
    && residualTerminalFiniteSaturatePositiveCompositionMilestone?.classification === "formalized-residual-terminal-finite-saturate-positive-composition"
    && residualTerminalFiniteSaturatePositiveCompositionMilestone.status === "formalized-residual-terminal-finite-saturate-positive-composition"
    && residualTerminalFiniteSaturatePositiveCompositionMilestone.scope === "For every finite direct-wire candidate, executable ambient observer, forgetful projection, and proof-bearing candidate BCEL anchor problem whose normalized seed has positive full slack, Lean recognizes exact candidate-derived origin, kernel, and obligation closures in both gate/profile orientations; checks cost transparency, obligation discharge, and forgotten-profile stability; preserves positive full slack across an all-safe trace into the checked-lift or BCEL firewall; or returns the exact first interface, closure, or other fail-closed nontransparent route with its complete safe prefix."
    && residualTerminalFiniteSaturatePositiveCompositionMilestone.nonClaim === "This closes the finite local form of originKernelObligationClosureRouted and composes the five reconstructed terminal sub-obligations only for an explicit proof-bearing problem. A local route is not a complete global outcome, Package E VerifyDW acceptance, verified gain, or global route-completeness result. The positive initial full-slack premise remains explicit. It does not establish manuscript-wide SaturatePositive, BCELReady, RankWF, ZeroSlack, PCCMin, polynomial runtime, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalFiniteSaturatePositiveCompositionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_FINITE_SATURATE_POSITIVE_COMPOSITION_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalOriginKernelObligationRoutingFormalized === true
    && status.leanResidualTerminalFiniteOriginKernelObligationClosureRoutedFormalized === true
    && status.leanResidualTerminalFirstOriginKernelObligationRouteFormalized === true
    && status.leanResidualTerminalOriginKernelObligationRoutingAxiomAuditPassed === true
    && status.leanResidualTerminalOriginKernelObligationRoutingScope === "all-finite-direct-wire-candidates-executable-observers-forgetful-projections-candidate-derived-origin-kernel-obligation-closures-with-exact-safety-or-first-route"
    && status.leanResidualTerminalFiniteSaturatePositiveCompositionFormalized === true
    && status.leanResidualTerminalFiniteSaturatePositiveCompositionAxiomAuditPassed === true
    && status.leanResidualTerminalFiniteSaturatePositiveCompositionScope === "all-finite-direct-wire-candidates-executable-observers-forgetful-projections-proof-bearing-positive-full-slack-candidate-bcel-anchor-problems-total-finite-saturate-positive-composition"
    && residualTerminalRankWFMilestone?.classification === "formalized-residual-terminal-rank-wf"
    && residualTerminalRankWFMilestone.status === "formalized-residual-terminal-rank-wf"
    && residualTerminalRankWFMilestone.scope === "For the fixed manuscript residual rank of exactly ten natural coordinates in the stated witness-type, span-type, mode, frontier-defect, projection-defect, saturation-defect, anchor-count, charge-size, profile-size, canonical-code priority order, Lean provides the exact lexicographic proposition, an equivalent executable comparison, all ten priority witnesses, proof-bearing descent, accessibility, induction, and kernel-checked well-foundedness."
    && residualTerminalRankWFMilestone.nonClaim === "This establishes the fixed residual rank domain and RankWF only. It does not map the current finite terminal routes into the manuscript's complete global outcome system, prove that any existing route strictly decreases the rank, establish route completeness or Package E, remove the explicit positive premise from the finite composition, establish full manuscript-wide SaturatePositive or BCELReady, prove ZeroSlack, PCCMin, polynomial runtime, SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalRankWFMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_RANK_WF_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalRankWFFormalized === true
    && status.leanResidualTerminalRankWFAxiomAuditPassed === true
    && status.leanResidualTerminalRankWFScope === "fixed-ten-coordinate-natural-lexicographic-order-executable-comparison-accessibility-induction-and-kernel-well-foundedness"
    && residualTerminalBN3RequestEnvelopeMilestone?.classification === "formalized-residual-terminal-bn3-request-envelope"
    && residualTerminalBN3RequestEnvelopeMilestone.status === "formalized-residual-terminal-bn3-request-envelope"
    && residualTerminalBN3RequestEnvelopeMilestone.scope === "From every successful computed finite BCEL anchor nucleus, Lean uses one canonical duplicate-free primitive-record identity list across every proper cut; gives exact executable monotone request membership stable under extensional transport and exact singleton minimal consumers; accounts active incidences without duplicates; selects one canonical full or quotient side-tight coherent basis for every proper cut; and preserves all upstream proof-bearing classifier failures in a total outcome."
    && residualTerminalBN3RequestEnvelopeMilestone.nonClaim === "This establishes one exact candidate-derived finite BN3 envelope only after the existing computed BCEL anchor-nucleus classifier succeeds. Proper cuts are enumerated through all subsets, so the construction is exponential reference computation rather than a polynomial algorithm. It does not derive the terminal dependency system, map local routes into the manuscript's complete global outcome system, construct BN4-BN6, prove selector or realizer completeness, establish global ZeroSlack or PCCMin, prove SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalBN3RequestEnvelopeMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_BN3_REQUEST_ENVELOPE_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalBN3RequestEnvelopeFormalized === true
    && status.leanResidualTerminalBN3RequestEnvelopeAxiomAuditPassed === true
    && status.leanResidualTerminalBN3RequestEnvelopeScope === "successful-computed-finite-bcel-anchor-nuclei-canonical-stable-request-identities-exact-singleton-minimal-consumers-duplicate-free-incidence-and-jointly-side-tight-full-or-quotient-basis-family"
    && residualTerminalBN4ActivationCancellationMilestone?.classification === "formalized-residual-terminal-bn4-activation-cancellation"
    && residualTerminalBN4ActivationCancellationMilestone.status === "formalized-residual-terminal-bn4-activation-cancellation"
    && residualTerminalBN4ActivationCancellationMilestone.scope === "After a successful computed finite BN3 envelope, Lean gives every request atom a canonical singleton activation code; proves activation-code equality exactly equivalent to equality of activation functions without enumerating cuts; checks equality of a complete typed key containing the atom, explicit semantic signature, and explicit transport type; totals positive and negative natural mass only at that same complete key; classifies a canonical balanced, positive, or negative residual; proves exact integer mass conservation, complete-key preservation, positive residual mass, and absence of opposite-sign residual pairs; computes duplicate-free ledger keys; and preserves all upstream failure branches while rejecting foreign request atoms."
    && residualTerminalBN4ActivationCancellationMilestone.nonClaim === "This is a finite cancellation kernel over an explicit typed cell ledger. It does not derive cells, semantic signatures, or transport types from four-corner bases and is not the full historical BN4 theorem. It supplies no polynomial construction or size bound; does not construct PkgC or BN6; does not complete global routes, selectors, or realizers; does not establish ZeroSlack or PCCMin; does not put SAT in P; does not remove a project assumption; and does not prove P = NP."
    && sameJson(
      residualTerminalBN4ActivationCancellationMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_BN4_ACTIVATION_CANCELLATION_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalBN4ActivationCancellationFormalized === true
    && status.leanResidualTerminalBN4ActivationCancellationAxiomAuditPassed === true
    && status.leanResidualTerminalBN4ActivationCancellationScope === "successful-computed-finite-bn3-envelope-explicit-typed-cell-ledgers-activation-exact-complete-key-same-key-cancellation-and-exact-integer-mass-residuals"
    && residualTerminalBN5FullShadowLocalizationMilestone?.classification === "formalized-residual-terminal-bn5-full-shadow-localization"
    && residualTerminalBN5FullShadowLocalizationMilestone.status === "formalized-residual-terminal-bn5-full-shadow-localization"
    && residualTerminalBN5FullShadowLocalizationMilestone.scope === "For every explicit finite negative-unit refinement and quotient-shadow ledger, Lean preserves the complete exact-coordinate data, validates the negative mass refinement, computes whether the cut is silent, and otherwise returns either complete multiplicity coverage or a strict Hall deficit with a literal smaller shadow-neighbor fibre, complete-coordinate preservation, and a proof-bearing local X1 route that prevents active unmatched units from disappearing silently."
    && residualTerminalBN5FullShadowLocalizationMilestone.nonClaim === "This kernel starts from explicit finite inputs: one complete BN4 key, a negative cancellation result, a payload list, a cut, and a quotient-shadow coordinate list. It does not derive payloads or shadows from four-corner bases, connect complete matching back to a BN4 contradiction, or prove the full CritC/Q/E/L/X2/X3/X4 diagnosis, so it is not the full historical BN5 theorem. It does not construct PkgC or BN6; complete global routes, selectors, or realizers; establish polynomial generation or runtime, ZeroSlack, or PCCMin; put SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalBN5FullShadowLocalizationMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_BN5_FULL_SHADOW_LOCALIZATION_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalBN5FullShadowLocalizationFormalized === true
    && status.leanResidualTerminalBN5FullShadowLocalizationAxiomAuditPassed === true
    && status.leanResidualTerminalBN5FullShadowLocalizationScope === "all-finite-exact-coordinate-negative-unit-refinements-computed-cut-silence-complete-multiplicity-coverage-or-strict-hall-deficit-with-local-x1-nonsilence"
    && residualTerminalPkgCSeparatingConsumersMilestone?.classification === "formalized-residual-terminal-pkgc-separating-consumers"
    && residualTerminalPkgCSeparatingConsumersMilestone.status === "formalized-residual-terminal-pkgc-separating-consumers"
    && residualTerminalPkgCSeparatingConsumersMilestone.scope === "For an arbitrary finite explicit minimal-consumer antichain, Lean canonically scans for the first disjoint pair that is not singleton-singleton. Absence proves exactly V54's singletonization premise. A found pair's atoms are canonically indexed into exact-coordinate quotient units and an explicit full-restoration universe is classified into complete multiplicity coverage or a strict Hall deficit with a deterministic local Q route."
    && residualTerminalPkgCSeparatingConsumersMilestone.nonClaim === "The restoration coordinate universe remains explicit. This theorem does not derive consumers or restorations from a terminal candidate, connect complete coverage back to a BN4 or BN5 contradiction, embed the Hall route into the complete global outcome system, prove global route silence, or establish the full historical PkgC theorem. It does not prove full BN6 or Packet selector-realizer completeness, polynomial generation or runtime, ZeroSlack or PCCMin, SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPkgCSeparatingConsumersMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PKGC_SEPARATING_CONSUMERS_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalPkgCSeparatingConsumersFormalized === true
    && status.leanResidualTerminalPkgCSeparatingConsumersAxiomAuditPassed === true
    && status.leanResidualTerminalPkgCSeparatingConsumersScope === "all-finite-explicit-minimal-consumer-antichains-pkgc-separating-consumer-first-pair-canonical-atoms-exact-coordinate-restoration-or-strict-hall-local-q"
    && residualTerminalPkgCTypedRestorationMilestone?.classification === "formalized-residual-terminal-pkgc-typed-restoration"
    && residualTerminalPkgCTypedRestorationMilestone.status === "formalized-residual-terminal-pkgc-typed-restoration"
    && residualTerminalPkgCTypedRestorationMilestone.scope === "For an arbitrary finite explicit minimal-consumer antichain and a typed coordinate-preserving restoration operation, Lean materializes typed full-restoration candidates for every atom of the canonical first disjoint nonsingleton pair, proves exact candidate count and positional coordinate preservation, derives complete equality-fibre multiplicity coverage, excludes a strict Hall deficit for that graph, and otherwise proves V54 singletonization."
    && residualTerminalPkgCTypedRestorationMilestone.nonClaim === "The typed restoration operation remains explicit caller data. This milestone does not construct it from a terminal candidate or prove its full semantic adequacy. It does not connect complete restoration to a BN4 or BN5 contradiction, embed local routes into the complete global outcome system, prove global PkgC route silence or the full historical PkgC theorem, establish full BN6 or Packet selector-realizer completeness, polynomial generation or runtime, ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPkgCTypedRestorationMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PKGC_TYPED_RESTORATION_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalPkgCTypedRestorationFormalized === true
    && status.leanResidualTerminalPkgCTypedRestorationAxiomAuditPassed === true
    && status.leanResidualTerminalPkgCTypedRestorationScope === "all-finite-explicit-minimal-consumer-antichains-typed-full-restoration-candidates-coordinate-preserving-exact-multiplicity-coverage-no-hall-or-singletonized"
    && residualTerminalPkgCSameKeyCancellationMilestone?.classification === "formalized-residual-terminal-pkgc-same-key-cancellation"
    && residualTerminalPkgCSameKeyCancellationMilestone.status === "formalized-residual-terminal-pkgc-same-key-cancellation"
    && residualTerminalPkgCSameKeyCancellationMilestone.scope === "For an arbitrary finite explicit minimal-consumer antichain and typed exact-BN5-coordinate restoration operation, Lean mechanically pairs every quotient atom with its restored full candidate as opposite-sign unit cells, proves the complete BN5 coordinate gives the same nested BN4 key, proves exact cell count and positive/negative multiplicity equality at every BN4 key, computes an empty canonical residual and zero signed mass at every key, and derives V54 singletonization from exact absence of every such proof-bearing cancellation outcome."
    && residualTerminalPkgCSameKeyCancellationMilestone.nonClaim === "The typed restoration operation and its complete coordinate maps remain explicit inputs, and the generated opposite-sign cells are not yet proved to be the cells of the terminal candidate's ambient BN4 ledger. This milestone does not construct semantic restorations from a terminal candidate, embed cancellation or Hall outcomes into the complete global route system, prove global route silence or the full historical PkgC theorem, establish full BN6 or Packet selector-realizer completeness, polynomial generation or runtime, ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPkgCSameKeyCancellationMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PKGC_SAME_KEY_CANCELLATION_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalPkgCSameKeyCancellationFormalized === true
    && status.leanResidualTerminalPkgCSameKeyCancellationAxiomAuditPassed === true
    && status.leanResidualTerminalPkgCSameKeyCancellationScope === "all-finite-explicit-minimal-consumer-antichains-typed-exact-coordinate-restoration-canonical-opposite-sign-bn4-ledger-every-key-balanced-empty-residual-or-singletonized-under-cancellation-silence"
    && residualTerminalPkgCAmbientBN4LedgerMilestone?.classification === "formalized-residual-terminal-pkgc-ambient-bn4-ledger"
    && residualTerminalPkgCAmbientBN4LedgerMilestone.status === "formalized-residual-terminal-pkgc-ambient-bn4-ledger"
    && residualTerminalPkgCAmbientBN4LedgerMilestone.scope === "For arbitrary finite explicit BN4 cell ledgers, Lean proves that a proof-bearing exact multiset embedding identifies the generated PkgC opposite-sign cancellation ledger with an ambient subledger and preserves every duplicate. Positive and negative mass decompose at every complete key; removing the balanced generated subledger leaves the ambient signed mass and executable residual signed contribution exactly equal to an explicit remainder. A successful candidate-derived BN4 kernel additionally proves every embedded generated cell uses its canonical request-atom space, and complete bindings plus exact absence of every computed bridge imply V54 singletonization."
    && residualTerminalPkgCAmbientBN4LedgerMilestone.nonClaim === "The ambient ledger, typed restoration operation, exact permutation certificate or canonical serialization, and successful candidate-derived BN4 kernel remain explicit proof-bearing inputs. This milestone does not derive the ambient ledger or restorer from a terminal candidate, prove the restorer's semantic adequacy, embed local cancellation or Hall outcomes into the complete global route system, prove global PkgC route silence or the full historical PkgC theorem, establish full BN6 or Packet selector-realizer completeness, polynomial generation or runtime, ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPkgCAmbientBN4LedgerMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PKGC_AMBIENT_BN4_LEDGER_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalPkgCAmbientBN4LedgerFormalized === true
    && status.leanResidualTerminalPkgCAmbientBN4LedgerAxiomAuditPassed === true
    && status.leanResidualTerminalPkgCAmbientBN4LedgerScope === "all-finite-explicit-ambient-bn4-ledgers-exact-multiset-embedding-balanced-generated-subledger-removal-preserves-remainder-signed-mass-and-candidate-derived-canonical-atom-linkage"
    && residualTerminalPkgCAmbientBN4ResidualReductionMilestone?.classification === "formalized-residual-terminal-pkgc-ambient-bn4-residual-reduction"
    && residualTerminalPkgCAmbientBN4ResidualReductionMilestone.status === "formalized-residual-terminal-pkgc-ambient-bn4-residual-reduction"
    && residualTerminalPkgCAmbientBN4ResidualReductionMilestone.scope === "For arbitrary finite explicit ambient BN4 ledgers, Lean proves that removing an exactly embedded balanced PkgC generated subledger preserves the executable residual cell at every complete key and the complete canonical executable residual ledger over the ambient key universe. Every remainder key occurs in that universe; a fail-closed canonical classifier constructs the exact reduction without caller-provided proof bits; and an empty remainder yields an empty ambient residual ledger, including for the existing candidate-derived computed bridge."
    && residualTerminalPkgCAmbientBN4ResidualReductionMilestone.nonClaim === "The ambient ledger, typed restoration operation, exact embedding, and explicit remainder remain proof-bearing inputs. This milestone does not derive those inputs from an arbitrary terminal candidate, prove that the remainder is empty or route-producing, establish restoration semantic adequacy or complete global route silence, reconstruct the full historical PkgC/BN6/Packet path, prove polynomial generation or runtime, establish ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && residualTerminalPkgCAmbientBN4ResidualReductionMilestone.requiredTheorems?.length === 8
    && residualTerminalPkgCAmbientBN4ResidualReductionMilestone.theoremRows?.every((row) =>
      row.present === true
      && row.kind === 'theorem'
      && sameJson(row.axioms, ['Quot.sound', 'propext'])
      && row.kernelTypeFingerprintMatches === true
      && row.actualKernelTypeSha256 === row.expectedKernelTypeSha256)
    && residualTerminalPkgCAmbientBN4ResidualReductionCandidates?.every((row) =>
      row?.kind === 'theorem'
      && row.module === 'PNP.ResidualTerminalPkgCAmbientBN4ResidualReduction'
      && sameJson(row.axioms, ['Quot.sound', 'propext']))
    && status.leanResidualTerminalPkgCAmbientBN4ResidualReductionFormalized === true
    && status.leanResidualTerminalPkgCAmbientBN4ResidualReductionAxiomAuditPassed === true
    && status.leanResidualTerminalPkgCAmbientBN4ResidualReductionScope === "all-finite-explicit-ambient-bn4-ledgers-exact-balanced-subledger-removal-preserves-per-key-and-complete-canonical-executable-residual-ledgers-with-empty-remainder-corollary"
    && residualTerminalV54ConsumerAntichainNormalFormMilestone?.classification === "formalized-residual-terminal-v54-consumer-antichain-normal-form"
    && residualTerminalV54ConsumerAntichainNormalFormMilestone.status === "formalized-residual-terminal-v54-consumer-antichain-normal-form"
    && residualTerminalV54ConsumerAntichainNormalFormMilestone.scope === "For an arbitrary finite carrier and its explicit minimal-consumer antichain, Lean proves monotonicity and empty-request inactivity, proves that nonzero two-sided cut activation is equivalent to the existence of a disjoint consumer pair, and under the exact singletonized-disjoint-pair premise proves literal equality with the corresponding footprint cut indicator."
    && residualTerminalV54ConsumerAntichainNormalFormMilestone.nonClaim === "This finite kernel starts from an explicit minimal-consumer antichain and an explicit proof that every disjoint consumer pair is singletonized. It does not construct PkgC, derive that singletonization premise, or connect the footprint back to the full BN6 proof. It does not construct complete global routes, selectors, or realizers; establish polynomial generation or runtime, ZeroSlack, or PCCMin; put SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalV54ConsumerAntichainNormalFormMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_V54_CONSUMER_ANTICHAIN_NORMAL_FORM_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalConsumerAntichainNormalFormFormalized === true
    && status.leanResidualTerminalConsumerAntichainNormalFormAxiomAuditPassed === true
    && status.leanResidualTerminalConsumerAntichainNormalFormScope === "all-finite-minimal-consumer-antichains-monotone-empty-false-nonzero-iff-disjoint-and-pkgc-singletonized-exact-v54-consumer-antichain-cut-indicator"
    && residualTerminalV53ConstantCutHypergraphRigidityMilestone?.classification === "formalized-residual-terminal-v53-constant-cut-hypergraph-rigidity"
    && residualTerminalV53ConstantCutHypergraphRigidityMilestone.status === "formalized-residual-terminal-v53-constant-cut-hypergraph-rigidity"
    && residualTerminalV53ConstantCutHypergraphRigidityMilestone.scope === "For an arbitrary finite duplicate-free carrier and sparse nonnegative weighted hypergraph with positive listed cells, exact equality of every nonempty proper cut proves the complete V53 q=2, q=3, and q>=4 classification: full-span weight D; one common pair weight p with w_A + 2p = D; or zero weight on every proper footprint with full-span weight D."
    && residualTerminalV53ConstantCutHypergraphRigidityMilestone.nonClaim === "This theorem consumes an explicit sparse positive hypergraph and an explicit proof that every nonempty proper cut has the same positive value. It does not construct PkgC, derive the hypergraph from a terminal candidate or the V54 consumer system, build BN6 cells or payloads, complete global routes, selectors, or realizers, establish polynomial generation or runtime, prove ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalV53ConstantCutHypergraphRigidityMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_V53_CONSTANT_CUT_HYPERGRAPH_RIGIDITY_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalConstantCutHypergraphRigidityFormalized === true
    && status.leanResidualTerminalConstantCutHypergraphRigidityAxiomAuditPassed === true
    && status.leanResidualTerminalConstantCutHypergraphRigidityScope === "all-finite-nonnegative-weighted-hypergraphs-constant-cut-hypergraph-rigidity-v53-q2-q3-q4-classification"
    && residualTerminalBN6HypergraphPacketMilestone?.classification === "formalized-residual-terminal-bn6-hypergraph-packet"
    && residualTerminalBN6HypergraphPacketMilestone.status === "formalized-residual-terminal-bn6-hypergraph-packet"
    && residualTerminalBN6HypergraphPacketMilestone.scope === "For an arbitrary finite duplicate-free anchor carrier and explicit already-grouped family of positive payload-bearing survivor cells, V54 activation is transported exactly into the constructed V53 hypergraph cut sum. A positive BCEL constant-cut premise then yields the complete pair, mixed three-anchor balanced-triple/full-span, or four-or-more-anchor full-span classification with original payload witnesses."
    && residualTerminalBN6HypergraphPacketMilestone.nonClaim === "This finite bridge consumes explicit exact footprint grouping, PkgC singletonization proofs, positive atom ledgers, payload data, and the BCEL constant-cut equation. It does not construct PkgC, derive or group survivors from a terminal candidate, establish full historical BN6 or Packet selector/realizer completeness, complete global routes, prove polynomial generation or runtime, ZeroSlack or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalBN6HypergraphPacketMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_BN6_HYPERGRAPH_PACKET_DECLARATIONS.map(([name]) => name)
    )
    && status.leanResidualTerminalBN6HypergraphPacketFormalized === true
    && status.leanResidualTerminalBN6HypergraphPacketAxiomAuditPassed === true
    && status.leanResidualTerminalBN6HypergraphPacketScope === "all-finite-explicit-grouped-v54-activation-to-v53-grouped-hypergraph-packet-bn6-pair-mixed-triple-fullspan-with-payload-witnesses"
    && residualTerminalPacketSelectorSeedsMilestone?.classification === "formalized-residual-terminal-packet-selector-seeds"
    && residualTerminalPacketSelectorSeedsMilestone.status === "formalized-residual-terminal-packet-selector-seeds"
    && residualTerminalPacketSelectorSeedsMilestone.scope === "For an arbitrary finite exact BN6 packet conclusion, Lean extracts a carrier-contained payload-backed raw selector seed at the positive pair footprint, at every positive pair footprint of a balanced triple, or at the positive full-span footprint. The mixed three-anchor positive alternative is handled without asserting that both masses are positive, and the construction fixes no carrier cardinality."
    && residualTerminalPacketSelectorSeedsMilestone.nonClaim === "This milestone consumes an exact finite BN6 packet conclusion and preserves only carrier containment, selector-relevant footprint size, and original grouped cell-and-atom payload evidence. It does not prove selector-universe membership, selector faithfulness or compatibility, construct a realizer or route, establish enumeration or polynomial generation/runtime, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPacketSelectorSeedsMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketSelectorSeedsMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_SEEDS_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketSelectorSeedsFormalized === true
    && status.leanResidualTerminalPacketSelectorSeedsAxiomAuditPassed === true
    && status.leanResidualTerminalPacketSelectorSeedsScope === "all-finite-explicit-bn6-packet-conclusions-payload-backed-pair-balanced-triple-or-fullspan-selector-seed-input-extraction"
    && residualTerminalPacketSelectorUniverseMilestone?.classification === "formalized-residual-terminal-packet-selector-universe"
    && residualTerminalPacketSelectorUniverseMilestone.status === "formalized-residual-terminal-packet-selector-universe"
    && residualTerminalPacketSelectorUniverseMilestone.scope === "For every arbitrary finite explicit grouped BN6 family, Lean enumerates the exact duplicate-free list of grouped footprints, proves membership equivalent to an original grouped cell at that footprint, and upgrades every payload-backed pair, balanced-triple pair, or full-span seed to membership in that same finite universe."
    && residualTerminalPacketSelectorUniverseMilestone.nonClaim === "This finite universe is exactly the grouped-footprint list already present in an explicit BN6 family. It is not the manuscript's encoded or polynomial selector universe, and payload retention is not manuscript-level selector faithfulness. It does not prove selector compatibility, construct a realizer or route, derive the grouped family from a terminal candidate, establish polynomial enumeration or size bounds, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPacketSelectorUniverseMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketSelectorUniverseMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketSelectorUniverseFormalized === true
    && status.leanResidualTerminalPacketSelectorUniverseAxiomAuditPassed === true
    && status.leanResidualTerminalPacketSelectorUniverseScope === "all-finite-explicit-bn6-grouped-families-exact-grouped-footprint-payload-selector-universe-membership"
    && residualTerminalPacketSelectorHandlesMilestone?.classification === "formalized-residual-terminal-packet-selector-handles"
    && residualTerminalPacketSelectorHandlesMilestone.status === "formalized-residual-terminal-packet-selector-handles"
    && residualTerminalPacketSelectorHandlesMilestone.scope === "For every arbitrary finite explicit grouped BN6 family, Lean defines canonical indexed grouped-footprint handles, proves exact decoding is injective and every payload selector has a unique handle, retains original payload evidence, and proves every decoded footprint remains carrier-contained and has length at least two across the pair, balanced-triple, and full-span Packet branches."
    && residualTerminalPacketSelectorHandlesMilestone.nonClaim === "These handles are input-relative list positions, not the manuscript's bit encoding or a polynomially enumerable selector universe. The milestone does not prove manuscript-level selector faithfulness or compatibility, construct a selector realizer or route, derive or group BN6 survivors from a terminal candidate, establish polynomial encoding length or runtime, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPacketSelectorHandlesMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketSelectorHandlesMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_HANDLES_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketSelectorHandlesFormalized === true
    && status.leanResidualTerminalPacketSelectorHandlesAxiomAuditPassed === true
    && status.leanResidualTerminalPacketSelectorHandlesScope === "all-finite-explicit-bn6-grouped-families-canonical-indexed-grouped-footprint-handles-unique-decoding-payload-carrier-and-size-compatibility"
    && residualTerminalPacketSelectorCodecMilestone?.classification === "formalized-residual-terminal-packet-selector-codec"
    && residualTerminalPacketSelectorCodecMilestone.status === "formalized-residual-terminal-packet-selector-codec"
    && residualTerminalPacketSelectorCodecMilestone.scope === "For every arbitrary finite explicit grouped BN6 family, Lean gives each canonical input-relative selector handle a unary bitstring with fail-closed total decoding of missing delimiters, trailing data, and out-of-range indices, proves exact round trip, injectivity, canonical successful decoding, exact and explicit-universe-bounded length, retains payload, carrier, size, cell, and atom evidence, and gives every payload selector one unique accepted code across the pair, balanced-triple, and full-span Packet branches."
    && residualTerminalPacketSelectorCodecMilestone.nonClaim === "The code-length bound is relative to the explicit grouped-family list and does not bound that list by encoded circuit size. This milestone does not prove polynomial enumeration or runtime, encode atom or payload data, prove manuscript-level selector faithfulness or compatibility, construct a selector realizer or route, derive or group BN6 survivors from a terminal candidate, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPacketSelectorCodecMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketSelectorCodecMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_CODEC_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketSelectorCodecFormalized === true
    && status.leanResidualTerminalPacketSelectorCodecAxiomAuditPassed === true
    && status.leanResidualTerminalPacketSelectorCodecScope === "all-finite-explicit-bn6-grouped-families-canonical-unary-fail-closed-handle-codec-round-trip-unique-decoding-payload-carrier-size-and-explicit-universe-length-bound"
    && residualTerminalPacketSelectorPayloadRealizationMilestone?.classification === "formalized-residual-terminal-packet-selector-payload-realization"
    && residualTerminalPacketSelectorPayloadRealizationMilestone.status === "formalized-residual-terminal-packet-selector-payload-realization"
    && residualTerminalPacketSelectorPayloadRealizationMilestone.scope === "For every arbitrary finite explicit grouped BN6 family, Lean defines a total fail-closed function that maps each accepted canonical selector code to its exact decoded handle, original source cell, decoded footprint, and a canonical original positive payload atom. Successful results re-encode to the exact input, remain in the supplied family, retain strict atom positivity, are equivalent to the finite payload-selector predicate, and preserve the pair, balanced-triple, and full-span Packet branches."
    && residualTerminalPacketSelectorPayloadRealizationMilestone.nonClaim === "This is source-payload materialization relative to a supplied explicit grouped family, not the manuscript's gain-or-blocker selector realizer. The unary code still encodes only a list position and does not serialize atom or payload data. This milestone does not construct a replacement circuit, prove selector faithfulness or compatibility, return a gain or typed blocker route, derive or group BN6 survivors from a terminal candidate, bound the selector family by encoded circuit size, prove polynomial generation or runtime, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPacketSelectorPayloadRealizationMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketSelectorPayloadRealizationMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_PAYLOAD_REALIZATION_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketSelectorPayloadRealizationFormalized === true
    && status.leanResidualTerminalPacketSelectorPayloadRealizationAxiomAuditPassed === true
    && status.leanResidualTerminalPacketSelectorPayloadRealizationScope === "all-finite-explicit-bn6-grouped-families-total-fail-closed-source-payload-realization-exact-original-cell-footprint-positive-atom-and-packet-branch-preservation"
    && residualTerminalPacketSelectorGainScanMilestone?.classification === "formalized-residual-terminal-packet-selector-gain-scan"
    && residualTerminalPacketSelectorGainScanMilestone.status === "formalized-residual-terminal-packet-selector-gain-scan"
    && residualTerminalPacketSelectorGainScanMilestone.scope === "For every arbitrary finite explicit grouped BN6 family whose payloads are direct-wire implementations, Lean decodes each accepted canonical Packet selector, scans every original candidate payload in the exact selected source cell with the executable strict-equivalent-gain checker, and returns only a genuine source-atom StrictEquivalentGain or proof that the selected cell has no such candidate. Every gain strictly decreases residual slack, decoder rejection is exact, and the pair, balanced-triple, and full-span Packet alternatives are preserved."
    && residualTerminalPacketSelectorGainScanMilestone.nonClaim === "The candidate implementations and grouped BN6 family remain explicit input data. A local no-gain result excludes only payload candidates in one selected source cell; it is not a manuscript BotHN, BotBUD, or lower-rank BotSeed and does not imply global minimality or ZeroSlack. This milestone does not construct replacement candidates, prove selector faithfulness or compatibility, connect payload mass to charge surplus, derive or group survivors from a terminal candidate, bound the selector family by encoded circuit size, prove polynomial generation or runtime, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPacketSelectorGainScanMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketSelectorGainScanMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_SCAN_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketSelectorGainScanFormalized === true
    && status.leanResidualTerminalPacketSelectorGainScanAxiomAuditPassed === true
    && status.leanResidualTerminalPacketSelectorGainScanScope === "all-finite-explicit-bn6-grouped-families-direct-wire-implementation-payloads-total-fail-closed-exact-source-cell-checked-strict-gain-or-cell-local-no-gain-packet-branch-preservation"
    && residualTerminalPacketSelectorUniverseGainScanMilestone?.classification === "formalized-residual-terminal-packet-selector-universe-gain-scan"
    && residualTerminalPacketSelectorUniverseGainScanMilestone.status === "formalized-residual-terminal-packet-selector-universe-gain-scan"
    && residualTerminalPacketSelectorUniverseGainScanMilestone.scope === "For every arbitrary finite explicit grouped BN6 family whose payloads are direct-wire implementations, Lean enumerates every canonical input-relative selector handle, scans every original candidate payload in each exact source cell with the executable strict-equivalent-gain checker, and returns only a canonical source-atom StrictEquivalentGain or proof that the complete supplied selector universe has no such candidate. Every gain retains a canonical accepted code and strictly decreases residual slack, while the pair, balanced-triple, and full-span Packet alternatives are preserved literally."
    && residualTerminalPacketSelectorUniverseGainScanMilestone.nonClaim === "The grouped BN6 family and candidate implementations remain explicit inputs. Family-wide no-gain is silence only for that supplied input-relative selector universe; it is not a manuscript BotHN, BotBUD, or lower-rank BotSeed, does not establish selector faithfulness or compatibility, and does not imply global minimality or ZeroSlack. This milestone does not construct replacement candidates, connect payload mass to charge surplus, derive or group survivors from terminal data, bound the family by encoded circuit size, prove polynomial enumeration or runtime, complete PkgC, ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPacketSelectorUniverseGainScanMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_GAIN_SCAN_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketSelectorUniverseGainScanMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_UNIVERSE_GAIN_SCAN_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketSelectorUniverseGainScanFormalized === true
    && status.leanResidualTerminalPacketSelectorUniverseGainScanAxiomAuditPassed === true
    && status.leanResidualTerminalPacketSelectorUniverseGainScanScope === "all-finite-explicit-bn6-grouped-families-exhaustive-canonical-selector-scan-with-checked-strict-gain-or-family-local-no-gain-and-packet-branch-preservation"
    && residualTerminalPacketSelectorGainCoverageMilestone?.classification === "formalized-residual-terminal-packet-selector-gain-coverage"
    && residualTerminalPacketSelectorGainCoverageMilestone.status === "formalized-residual-terminal-packet-selector-gain-coverage"
    && residualTerminalPacketSelectorGainCoverageMilestone.scope === "For every arbitrary finite explicit grouped BN6 family whose payloads are direct-wire implementations, an explicit proof-bearing coverage certificate requires every strict equivalent gain from the current implementation to occur as an original payload atom in an exact canonical selector source cell. Under precisely that premise, the exhaustive scan returns either a source-atom gain with strict residual descent or a proof-bearing semantic minimum and zero residual slack, while preserving the pair, balanced-triple, and full-span Packet alternatives literally."
    && residualTerminalPacketSelectorGainCoverageMilestone.nonClaim === "The explicit gain-coverage certificate, grouped BN6 family, and candidate implementations remain inputs. This milestone does not construct the coverage certificate from terminal data, prove selector faithfulness or compatibility, construct or polynomially enumerate replacement candidates, establish encoded-size or runtime bounds, produce typed blockers or HB/rank closure, or complete global PkgC, ZeroSlack, or PCCMin. It is conditional and not unconditional ZeroSlack; it does not put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPacketSelectorGainCoverageMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_COVERAGE_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketSelectorGainCoverageMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_GAIN_COVERAGE_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketSelectorGainCoverageFormalized === true
    && status.leanResidualTerminalPacketSelectorGainCoverageAxiomAuditPassed === true
    && status.leanResidualTerminalPacketSelectorGainCoverageScope === "all-finite-explicit-bn6-grouped-families-explicit-global-gain-coverage-certificate-conditional-source-gain-or-proof-bearing-zero-slack-with-packet-branch-preservation"
    && residualTerminalPacketChargeSurplusMilestone?.classification === "formalized-residual-terminal-packet-charge-surplus"
    && residualTerminalPacketChargeSurplusMilestone.status === "formalized-residual-terminal-packet-charge-surplus"
    && residualTerminalPacketChargeSurplusMilestone.scope === "For arbitrary finite support and replacement charge ledgers, exact multiplicity-preserving occurrence pairing and pairwise weight preservation leave an unmatched positive support charge and derive strict occurrence count and strict total replacement weight. When the totals exactly account for current and replacement NAND gates and semantic equivalence is proved independently, Lean constructs a genuine StrictEquivalentGain and strict reference-residual descent without assuming either strict inequality."
    && residualTerminalPacketChargeSurplusMilestone.nonClaim === "The finite ledgers, exact occurrence pairing, gate accounting, and semantic equivalence remain explicit inputs. This milestone does not construct a replacement or its charge ledger from a Packet blueprint or terminal data, prove selector faithfulness or compatibility, produce BotHN, BotBUD, or a lower-rank BotSeed, close HB/rank routing, establish encoded-size or polynomial-runtime bounds, or complete global PkgC, ZeroSlack, or PCCMin. It is not unconditional ZeroSlack; it does not put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPacketChargeSurplusMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_CHARGE_SURPLUS_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketChargeSurplusMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_CHARGE_SURPLUS_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketChargeSurplusFormalized === true
    && status.leanResidualTerminalPacketChargeSurplusAxiomAuditPassed === true
    && status.leanResidualTerminalPacketChargeSurplusScope === "all-arbitrary-finite-occurrence-ledgers-exact-multiplicity-preserving-charge-injection-positive-unmatched-support-strict-weight-gain-and-residual-descent"
    && residualTerminalPacketUnitChargeBlueprintRealizerMilestone?.classification === "formalized-residual-terminal-packet-unit-charge-blueprint-realizer"
    && residualTerminalPacketUnitChargeBlueprintRealizerMilestone.status === "formalized-residual-terminal-packet-unit-charge-blueprint-realizer"
    && residualTerminalPacketUnitChargeBlueprintRealizerMilestone.scope === "For arbitrary direct-wire input and output arities and every finite explicit grouped BN6 family of replacement blueprints, Lean validates canonical unit-charge gate-occurrence ledgers with a constructive exact permutation checker, a nonempty unmatched current-gate remainder, and semantic equivalence. Acceptance mechanically constructs the generic charge-surplus realization, a genuine StrictEquivalentGain, and strict residual descent without accepting a gate inequality. Every original blueprint atom behind every canonical handle is scanned, and the complete pair, balanced-triple, and full-span Packet conclusion is retained literally."
    && residualTerminalPacketUnitChargeBlueprintRealizerMilestone.nonClaim === "The grouped BN6 family, candidate implementations, replacement blueprints, occurrence pairings, and unmatched lists remain explicit inputs. Supplied-family validator silence is not BotHN, BotBUD, a lower-rank BotSeed, global absence of strict gains, semantic minimality, or ZeroSlack. This milestone does not derive blueprints from terminal data, establish manuscript selector faithfulness or compatibility, close HB/rank routing, establish encoded-size or polynomial-runtime bounds, or complete global PkgC, ZeroSlack, or PCCMin. It does not put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPacketUnitChargeBlueprintRealizerMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_UNIT_CHARGE_BLUEPRINT_REALIZER_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketUnitChargeBlueprintRealizerMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_UNIT_CHARGE_BLUEPRINT_REALIZER_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketUnitChargeBlueprintRealizerFormalized === true
    && status.leanResidualTerminalPacketUnitChargeBlueprintRealizerAxiomAuditPassed === true
    && status.leanResidualTerminalPacketUnitChargeBlueprintRealizerScope === "all-finite-explicit-bn6-grouped-blueprint-families-constructive-exact-occurrence-checker-canonical-unit-charge-ledgers-semantic-validation-strict-gain-residual-descent-and-packet-preservation"
    && residualTerminalPacketTypedRealizerContractMilestone?.classification === "formalized-residual-terminal-packet-typed-realizer-contract"
    && residualTerminalPacketTypedRealizerContractMilestone.status === "formalized-residual-terminal-packet-typed-realizer-contract"
    && residualTerminalPacketTypedRealizerContractMilestone.scope === "For arbitrary selector types, finite selector lists, positive finite rank carriers, executable faithfulness and blocker-activity tables, and data-only realizer claims, Lean accepts a faithful selector row exactly as a checked unit-charge gain, an active same-or-lower-rank HN bot, an active same-or-lower-rank budget bot, or a faithful strictly lower-rank seed bot. The list validator covers every faithful member, and its grouped-BN6 specialization covers every canonical input-relative Packet handle."
    && residualTerminalPacketTypedRealizerContractMilestone.nonClaim === "The selector family, finite rank assignment, faithfulness predicate, realizer claims, hereditary activity table, and budget activity table remain explicit inputs. Finite indices are not the manuscript's tuple-valued packet ranks, and an invalid faithful row is rejected rather than reinterpreted as a bot. This milestone does not construct blueprints or blockers from terminal data, prove selector faithfulness or compatibility, establish blocker semantics or HB acyclicity, derive global selector silence, or establish encoded-size or polynomial-runtime bounds. It does not complete PkgC, unconditional ZeroSlack, or PCCMin, put SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalPacketTypedRealizerContractMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_TYPED_REALIZER_CONTRACT_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketTypedRealizerContractMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_TYPED_REALIZER_CONTRACT_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketTypedRealizerContractFormalized === true
    && status.leanResidualTerminalPacketTypedRealizerContractAxiomAuditPassed === true
    && status.leanResidualTerminalPacketTypedRealizerContractScope === "all-arbitrary-finite-selector-lists-and-explicit-bn6-canonical-handle-families-data-only-gain-or-typed-hn-budget-strictly-lower-faithful-seed-validation"
    && residualTerminalHBBlockerGraphAcyclicityMilestone?.classification === "formalized-residual-terminal-hb-blocker-graph-acyclicity"
    && residualTerminalHBBlockerGraphAcyclicityMilestone.status === "formalized-residual-terminal-hb-blocker-graph-acyclicity"
    && residualTerminalHBBlockerGraphAcyclicityMilestone.scope === "For arbitrary finite HN/BUD data-edge graphs, Lean exhaustively checks that the supplied finite rank indices embed strictly into the exact ten-coordinate residual rank and that every supplied dependency edge strictly descends that rank. Acceptance derives accessibility and well-foundedness of the exact supplied dependency relation, proves that it has no nonempty directed cycle, upgrades valid lower-seed bots to exact-rank descent, and composes these facts with every faithful canonical handle in an accepted Packet typed-realizer table."
    && residualTerminalHBBlockerGraphAcyclicityMilestone.nonClaim === "The graph, edges, finite-to-exact rank mapping, selector family, faithfulness predicate, blocker activity tables, and realizer claims remain explicit inputs. This milestone does not prove dependency completeness, blocker semantics, that every active HN or budget row records all dependencies, or construction of the graph or rank mapping from terminal data. It does not establish selector compatibility, rank-complete selector silence, the full HB.NegativeClosure theorem, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalHBBlockerGraphAcyclicityMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_HB_BLOCKER_GRAPH_ACYCLICITY_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalHBBlockerGraphAcyclicityMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_HB_BLOCKER_GRAPH_ACYCLICITY_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalHBBlockerGraphAcyclicityFormalized === true
    && status.leanResidualTerminalHBBlockerGraphAcyclicityAxiomAuditPassed === true
    && status.leanResidualTerminalHBBlockerGraphAcyclicityScope === "all-arbitrary-finite-hn-budget-data-edge-graphs-exhaustive-finite-to-exact-rank-embedding-strict-edge-descent-well-foundedness-and-no-directed-cycle"
    && residualTerminalHBDependencyTableClosureMilestone?.classification === "formalized-residual-terminal-hb-dependency-table-closure"
    && residualTerminalHBDependencyTableClosureMilestone.status === "formalized-residual-terminal-hb-dependency-table-closure"
    && residualTerminalHBDependencyTableClosureMilestone.scope === "For every arbitrary finite rank carrier, Lean enumerates all HN and budget nodes, assigns each node one total data-only dependency row, and materializes the graph mechanically from all rows without accepting a second edge list. The checker exhaustively validates the finite-to-exact ten-coordinate rank embedding and strict exact-rank descent for every row dependency. Acceptance proves exact row-to-edge coverage, accessibility, well-founded rank induction for arbitrary predicates with an explicit local premise, absence of every nonempty dependency cycle, covered HN/BUD bot rows, and exact-rank descent for lower seeds."
    && residualTerminalHBDependencyTableClosureMilestone.nonClaim === "The dependency table, finite-to-exact rank mapping, selector family, faithfulness predicate, blocker activity tables, and realizer claims remain explicit inputs. Total table coverage means only that every finite HN/BUD node has a row and every dependency listed in that row becomes a graph edge. It does not prove blocker semantics, semantic dependency completeness relative to terminal data, or the local invariant premise needed by generic rank induction. It does not establish selector compatibility, rank-complete selector silence, the full HB.NegativeClosure theorem, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalHBDependencyTableClosureMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_HB_DEPENDENCY_TABLE_CLOSURE_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalHBDependencyTableClosureMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_HB_DEPENDENCY_TABLE_CLOSURE_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalHBDependencyTableClosureFormalized === true
    && status.leanResidualTerminalHBDependencyTableClosureAxiomAuditPassed === true
    && status.leanResidualTerminalHBDependencyTableClosureScope === "all-arbitrary-finite-hn-budget-total-dependency-tables-exact-row-to-edge-coverage-strict-exact-rank-descent-well-founded-induction-and-no-directed-cycle"
    && residualTerminalHBActiveDependencyClosureMilestone?.classification === "formalized-residual-terminal-hb-active-dependency-closure"
    && residualTerminalHBActiveDependencyClosureMilestone.status === "formalized-residual-terminal-hb-active-dependency-closure"
    && residualTerminalHBActiveDependencyClosureMilestone.scope === "For every arbitrary finite rank carrier and supplied typed-realizer environment, Lean exhaustively checks that every active HN or budget node has an active dependency in its own total row and independently checks strict exact-rank descent for every row dependency. Well-founded induction then proves every supplied HN and budget activity bit is false. Composition with every faithful canonical grouped-BN6 handle eliminates HN/BUD typed bots while preserving a genuine checked strict gain or a faithful strictly lower-rank seed."
    && residualTerminalHBActiveDependencyClosureMilestone.nonClaim === "The activity bits, dependency rows, finite-to-exact rank mapping, selector family, faithfulness predicate, and realizer claims remain explicit inputs. The local check does not derive blocker activity, blocker semantics, or semantic dependency completeness from terminal data. It eliminates HN/BUD bots only after the supplied tables pass; a checked gain or faithful lower-rank seed remains. This milestone does not establish selector compatibility, gain exclusion, lower-seed closure, rank-complete selector silence, the full HB.NegativeClosure theorem, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalHBActiveDependencyClosureMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_HB_ACTIVE_DEPENDENCY_CLOSURE_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalHBActiveDependencyClosureMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_HB_ACTIVE_DEPENDENCY_CLOSURE_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalHBActiveDependencyClosureFormalized === true
    && status.leanResidualTerminalHBActiveDependencyClosureAxiomAuditPassed === true
    && status.leanResidualTerminalHBActiveDependencyClosureScope === "all-arbitrary-finite-hn-budget-total-tables-exhaustive-active-dependency-local-closure-exact-rank-induction-all-node-blocker-silence-and-gain-or-lower-seed-composition"
    && residualTerminalHBSelectorSilenceClosureMilestone?.classification === "formalized-residual-terminal-hb-selector-silence-closure"
    && residualTerminalHBSelectorSilenceClosureMilestone.status === "formalized-residual-terminal-hb-selector-silence-closure"
    && residualTerminalHBSelectorSilenceClosureMilestone.scope === "For every arbitrary finite accepted typed-realizer table, checked HN/BUD active-dependency closure and semantic exclusion of every strict equivalent gain leave a faithful selector only if there is a faithful selector at strictly lower finite rank. Strong induction proves every canonical selector in the supplied grouped-BN6 family nonfaithful. A second theorem obtains the global gain-exclusion premise from the existing explicit gain-coverage certificate and exact source-cell no-gain evidence."
    && residualTerminalHBSelectorSilenceClosureMilestone.nonClaim === "The global semantic gain exclusion is an explicit proof-bearing premise. The coverage specialization still requires a supplied certificate covering every strict equivalent gain plus exact source-cell no-gain evidence. The grouped family, finite rank and faithfulness tables, realizer claims, blocker activity, dependency rows, and rank map remain explicit inputs. This does not establish selector faithfulness or compatibility, construct those inputs from terminal data, derive blocker semantics or semantic dependency completeness, prove the unconditional HB.NegativeClosure theorem, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalHBSelectorSilenceClosureMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_HB_SELECTOR_SILENCE_CLOSURE_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalHBSelectorSilenceClosureMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_HB_SELECTOR_SILENCE_CLOSURE_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalHBSelectorSilenceClosureFormalized === true
    && status.leanResidualTerminalHBSelectorSilenceClosureAxiomAuditPassed === true
    && status.leanResidualTerminalHBSelectorSilenceClosureScope === "all-arbitrary-finite-canonical-selector-tables-explicit-global-semantic-gain-exclusion-checked-hn-budget-inactivity-strong-rank-induction-and-rank-complete-selector-silence"
    && residualTerminalHBExecutableSelectorSilenceInductionMilestone?.classification === "formalized-residual-terminal-hb-executable-selector-silence-induction"
    && residualTerminalHBExecutableSelectorSilenceInductionMilestone.status === "formalized-residual-terminal-hb-executable-selector-silence-induction"
    && residualTerminalHBExecutableSelectorSilenceInductionMilestone.scope === "For every arbitrary finite accepted typed-realizer table, one exhaustive executable check proves that every canonical realizer claim is a typed bottom and retains faithful-row validity. Checked HB active-dependency closure eliminates HN and budget bottoms, while strong induction on the supplied finite rank eliminates faithful strictly lower-rank seeds. Every canonical selector is therefore nonfaithful without global semantic no-gain as a theorem premise."
    && residualTerminalHBExecutableSelectorSilenceInductionMilestone.nonClaim === "The grouped family, finite rank and faithfulness functions, realizer claim function, blocker activity functions, dependency rows, and finite-to-exact rank map remain explicit data inputs. The checker validates these data but does not construct them from terminal candidates or prove selector faithfulness, selector compatibility, blocker semantics, or semantic dependency completeness. This milestone does not establish the full unconditional HB.NegativeClosure theorem, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P, remove a project assumption, or prove P = NP."
    && sameJson(
      residualTerminalHBExecutableSelectorSilenceInductionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_HB_EXECUTABLE_SELECTOR_SILENCE_INDUCTION_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalHBExecutableSelectorSilenceInductionMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_HB_EXECUTABLE_SELECTOR_SILENCE_INDUCTION_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalHBExecutableSelectorSilenceInductionFormalized === true
    && status.leanResidualTerminalHBExecutableSelectorSilenceInductionAxiomAuditPassed === true
    && status.leanResidualTerminalHBExecutableSelectorSilenceInductionScope === "all-arbitrary-finite-canonical-selector-tables-executable-all-row-selector-silence-checked-hn-budget-inactivity-strong-rank-induction-without-global-semantic-no-gain"
    && residualTerminalPacketSelectorFaithfulnessRoutingMilestone?.classification === "formalized-residual-terminal-packet-selector-faithfulness-routing"
    && residualTerminalPacketSelectorFaithfulnessRoutingMilestone.status === "formalized-residual-terminal-packet-selector-faithfulness-routing"
    && residualTerminalPacketSelectorFaithfulnessRoutingMilestone.scope === "For every arbitrary finite explicit grouped BN6 family, exhaustive route-clear canonical payload checks plus exact binding to the supplied HB faithfulness table turn every positive Packet conclusion into a faithful canonical handle. Accepted executable HB selector silence and active-dependency closure prove that same handle nonfaithful, yielding a contradiction with selector silence. A fixed first-failure classifier exposes colour, frontier, charge, obligation, activation, direction, budget, rank, exact-route, or descent failure."
    && residualTerminalPacketSelectorFaithfulnessRoutingMilestone.nonClaim === "The grouped family, payload field Booleans, finite rank tags, route-clear payload checks, exact HB binding, realizer claims, blocker activity, dependency rows, and finite-to-exact rank map remain explicit terminal-relative inputs. The checkers do not derive those inputs from a terminal candidate or prove their external manuscript semantics. This milestone does not derive positive slack, SaturatePositive, BCELReady, the grouped family, or the no-lower ledger; establish unconditional HB.NegativeClosure or complete route silence; prove unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketSelectorFaithfulnessRoutingMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_SELECTOR_FAITHFULNESS_ROUTING_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketSelectorFaithfulnessRoutingMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_FAITHFULNESS_ROUTING_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketSelectorFaithfulnessRoutingFormalized === true
    && status.leanResidualTerminalPacketSelectorFaithfulnessRoutingAxiomAuditPassed === true
    && status.leanResidualTerminalPacketSelectorFaithfulnessRoutingScope === "all-arbitrary-finite-positive-bn6-packets-executable-canonical-payload-route-clearance-exact-hb-faithfulness-binding-and-selector-silence-contradiction"
    && residualTerminalPacketSelectorFaithfulnessTableMilestone?.classification === "formalized-residual-terminal-packet-selector-faithfulness-table"
    && residualTerminalPacketSelectorFaithfulnessTableMilestone.status === "formalized-residual-terminal-packet-selector-faithfulness-table"
    && residualTerminalPacketSelectorFaithfulnessTableMilestone.scope === "For every arbitrary finite explicit grouped BN6 family and finite rank carrier, Lean canonicalizes a typed-realizer table by replacing its free faithfulness function with the canonical positive source-payload computation while preserving rank, HN activity, budget activity, and every realizer claim exactly. Exhaustive faithfulness binding accepts by construction, and a route-clear positive Packet contradicts accepted executable HB selector silence without an independent binding premise."
    && residualTerminalPacketSelectorFaithfulnessTableMilestone.nonClaim === "The grouped family, ten payload field Booleans, finite rank tags and rank assignment, route-clear acceptance, realizer claims, HN/BUD activity, dependency rows, and finite-to-exact rank map remain explicit inputs. The constructor does not derive those inputs from a terminal candidate or prove their external manuscript semantics. This milestone does not establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketSelectorFaithfulnessTableMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_SELECTOR_FAITHFULNESS_TABLE_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketSelectorFaithfulnessTableMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_FAITHFULNESS_TABLE_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketSelectorFaithfulnessTableFormalized === true
    && status.leanResidualTerminalPacketSelectorFaithfulnessTableAxiomAuditPassed === true
    && status.leanResidualTerminalPacketSelectorFaithfulnessTableScope === "all-arbitrary-finite-canonical-packet-payload-faithfulness-table-construction-preserved-rank-claims-blocker-activity-binding-free-selector-silence-contradiction"
    && residualTerminalPacketSelectorFirstRouteOutcomeMilestone?.classification === "formalized-residual-terminal-packet-selector-first-route-outcome"
    && residualTerminalPacketSelectorFirstRouteOutcomeMilestone.status === "formalized-residual-terminal-packet-selector-first-route-outcome"
    && residualTerminalPacketSelectorFirstRouteOutcomeMilestone.scope === "For every arbitrary finite explicit grouped BN6 family and finite rank carrier, Lean proves the canonical payload first-route classifier total: no route exactly on acceptance and one earliest typed route exactly on rejection. Every positive Packet under the canonicalized HB table, accepted executable selector silence, and accepted active-dependency closure yields a first typed route without route-clear or binding premises."
    && residualTerminalPacketSelectorFirstRouteOutcomeMilestone.nonClaim === "The grouped family, ten payload field Booleans, finite rank tags and rank assignment, realizer claims, HN/BUD activity, dependency rows, and finite-to-exact rank map remain explicit inputs. The result does not prove any route's external semantics and does not map reported routes into a decreasing complete global outcome system. It does not construct those inputs from a terminal candidate, establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketSelectorFirstRouteOutcomeMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_SELECTOR_FIRST_ROUTE_OUTCOME_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketSelectorFirstRouteOutcomeMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_FIRST_ROUTE_OUTCOME_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketSelectorFirstRouteOutcomeFormalized === true
    && status.leanResidualTerminalPacketSelectorFirstRouteOutcomeAxiomAuditPassed === true
    && status.leanResidualTerminalPacketSelectorFirstRouteOutcomeScope === "all-arbitrary-finite-total-packet-first-route-classification-canonical-hb-selector-silence-without-route-clear-or-binding-premises"
    && residualTerminalPacketSelectorFirstRouteSemanticsMilestone?.classification === "formalized-residual-terminal-packet-selector-first-route-semantics"
    && residualTerminalPacketSelectorFirstRouteSemanticsMilestone.status === "formalized-residual-terminal-packet-selector-first-route-semantics"
    && residualTerminalPacketSelectorFirstRouteSemanticsMilestone.scope === "For every arbitrary finite payload rank and all ten route constructors, Lean proves the executable first route is equivalent to the exact earliest failed supplied field, with every preceding condition accepted. The failure is unique, rejection is equivalent to exact failure existence, and the canonical positive Packet/HB outcome carries the route and exact field-failure proof without route-clear or binding premises."
    && residualTerminalPacketSelectorFirstRouteSemanticsMilestone.nonClaim === "The grouped family, ten payload field Booleans, finite rank tags and rank assignment, realizer claims, HN/BUD activity, dependency rows, and finite-to-exact rank map remain explicit inputs. The result does not derive the payload fields or family from terminal data, does not prove their external manuscript semantics, and does not map a reported failure into a decreasing complete global outcome system. It does not establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketSelectorFirstRouteSemanticsMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_SELECTOR_FIRST_ROUTE_SEMANTICS_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketSelectorFirstRouteSemanticsMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_SELECTOR_FIRST_ROUTE_SEMANTICS_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketSelectorFirstRouteSemanticsFormalized === true
    && status.leanResidualTerminalPacketSelectorFirstRouteSemanticsAxiomAuditPassed === true
    && status.leanResidualTerminalPacketSelectorFirstRouteSemanticsScope === "all-arbitrary-finite-exact-earliest-field-semantics-for-ten-packet-first-routes-canonical-hb-first-route-failure-without-route-clear-or-binding-premises"
    && residualTerminalPacketDescentRouteReflectionMilestone?.classification === "formalized-residual-terminal-packet-descent-route-reflection"
    && residualTerminalPacketDescentRouteReflectionMilestone.status === "formalized-residual-terminal-packet-descent-route-reflection"
    && residualTerminalPacketDescentRouteReflectionMilestone.scope === "For every arbitrary finite grouped BN6 family and selector-rank carrier, the final strict-descent payload condition is computed from the exact ten-coordinate RankWF comparison while the preceding fields are preserved. Accepted computed payloads carry actual rank descent, a final descent failure carries actual nondecrease, and the positive Packet/HB endpoint returns either an earlier exact field route or proof that the supplied transition is nondecreasing, without route-clear or descent-binding premises."
    && residualTerminalPacketDescentRouteReflectionMilestone.nonClaim === "The first nine payload fields, before/after residual ranks and their handle assignment, grouped family, finite selector-rank map, realizer claims, HN/BUD activity, dependency rows, and finite-to-exact rank map remain explicit inputs. The result does not construct the grouped family or ranks from terminal data, prove external manuscript semantics for the earlier fields, map those other nine routes into the complete global outcome system, prove that a decreasing transition exists, or construct the no-lower ledger. It does not establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketDescentRouteReflectionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_DESCENT_ROUTE_REFLECTION_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketDescentRouteReflectionMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_DESCENT_ROUTE_REFLECTION_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketDescentRouteReflectionFormalized === true
    && status.leanResidualTerminalPacketDescentRouteReflectionAxiomAuditPassed === true
    && status.leanResidualTerminalPacketDescentRouteReflectionScope === "all-arbitrary-finite-rank-reflected-packet-descent-route-exact-rankwf-nondecrease-or-earlier-first-route-without-route-clear-or-descent-binding-premises"
    && residualTerminalPacketRankRouteReflectionMilestone?.classification === "formalized-residual-terminal-packet-rank-route-reflection"
    && residualTerminalPacketRankRouteReflectionMilestone.status === "formalized-residual-terminal-packet-rank-route-reflection"
    && residualTerminalPacketRankRouteReflectionMilestone.scope === "For every arbitrary finite grouped BN6 family and selector-rank carrier, the payload rank tag is copied from the authoritative handle rank while final residual descent remains computed from the exact ten-coordinate RankWF comparison. The canonical first-route classifier cannot return rank; a final descent route proves the supplied transition is nondecreasing, and the positive Packet/HB endpoint carries exact failure evidence without route-clear or binding premises."
    && residualTerminalPacketRankRouteReflectionMilestone.nonClaim === "The finite rank map, before/after residual ranks and their handle assignment, seven earlier Boolean payload fields, exactRouteClear, grouped family, realizer claims, HN/BUD activity, dependency rows, and finite-to-exact rank map remain explicit inputs. The result does not construct the grouped family or rank map from terminal data, prove external manuscript semantics for the eight remaining routes, map those routes into the complete global outcome system, prove that a decreasing transition exists, or construct the no-lower ledger. It does not establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketRankRouteReflectionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_RANK_ROUTE_REFLECTION_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketRankRouteReflectionMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_RANK_ROUTE_REFLECTION_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketRankRouteReflectionFormalized === true
    && status.leanResidualTerminalPacketRankRouteReflectionAxiomAuditPassed === true
    && status.leanResidualTerminalPacketRankRouteReflectionScope === "all-arbitrary-finite-canonical-rank-tag-reflection-rank-route-excluded-exact-rankwf-nondecrease-or-earlier-route-without-route-clear-or-binding-premises"
    && residualTerminalPacketExactRouteReflectionMilestone?.classification === "formalized-residual-terminal-packet-exact-route-reflection"
    && residualTerminalPacketExactRouteReflectionMilestone.status === "formalized-residual-terminal-packet-exact-route-reflection"
    && residualTerminalPacketExactRouteReflectionMilestone.scope === "For every arbitrary finite grouped BN6 family and selector-rank carrier, each canonical handle selects an original positive payload atom from its exact grouped cell and footprint. That canonical handle-to-cell-to-payload source route is marked clear by construction while the authoritative handle rank is copied and residual descent is computed from the exact ten-coordinate RankWF comparison. The first-route classifier cannot return exactRoute or rank; a final descent route proves nondecrease, and the positive Packet/HB endpoint carries exact failure evidence without route-clear or binding premises."
    && residualTerminalPacketExactRouteReflectionMilestone.nonClaim === "The seven semantic Boolean payload fields, finite rank map, before/after residual ranks, grouped family, realizer claims, HN/BUD activity, dependency rows, and finite-to-exact rank map remain explicit inputs. This internal route is not an external exact minimum or a proof of manuscript exact-minimum semantics. The seven remaining routes still lack complete external semantics and global integration. The result does not construct the grouped family or rank map from terminal data, derive the seven fields from a terminal candidate, prove that a decreasing transition exists, or construct the no-lower ledger. It does not establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketExactRouteReflectionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_EXACT_ROUTE_REFLECTION_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketExactRouteReflectionMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_EXACT_ROUTE_REFLECTION_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketExactRouteReflectionFormalized === true
    && status.leanResidualTerminalPacketExactRouteReflectionAxiomAuditPassed === true
    && status.leanResidualTerminalPacketExactRouteReflectionScope === "all-arbitrary-finite-canonical-source-route-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-seven-earlier-semantic-routes-without-route-clear-or-binding-premises"
    && residualTerminalPacketChargeRouteReflectionMilestone?.classification === "formalized-residual-terminal-packet-charge-route-reflection"
    && residualTerminalPacketChargeRouteReflectionMilestone.status === "formalized-residual-terminal-packet-charge-route-reflection"
    && residualTerminalPacketChargeRouteReflectionMilestone.scope === "For every arbitrary finite grouped BN6 family and selector-rank carrier, each canonical handle selects a strictly positive source payload atom. That positive-source-charge fact is reflected by construction while the internal source route, authoritative handle rank, and exact ten-coordinate descent comparison remain canonical. The first-route classifier cannot return charge, rank, or exactRoute; a final descent route proves nondecrease, and the positive Packet/HB endpoint carries exact failure evidence without route-clear or binding premises."
    && residualTerminalPacketChargeRouteReflectionMilestone.nonClaim === "The six remaining semantic Boolean payload fields, finite rank map, before/after residual ranks, grouped family, realizer claims, HN/BUD activity, dependency rows, and finite-to-exact rank map remain explicit inputs. Strictly positive source mass is not the full external charge-surplus, budget, replacement, or selector-compatibility semantics. The six remaining routes still lack complete external semantics and global integration. The result does not construct the grouped family or rank map from terminal data, derive those six fields from a terminal candidate, prove that a decreasing transition exists, or construct the no-lower ledger. It does not establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketChargeRouteReflectionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_CHARGE_ROUTE_REFLECTION_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketChargeRouteReflectionMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_CHARGE_ROUTE_REFLECTION_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketChargeRouteReflectionFormalized === true
    && status.leanResidualTerminalPacketChargeRouteReflectionAxiomAuditPassed === true
    && status.leanResidualTerminalPacketChargeRouteReflectionScope === "all-arbitrary-finite-positive-source-charge-charge-route-excluded-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-six-earlier-semantic-routes-without-route-clear-or-binding-premises"
    && residualTerminalPacketColourRouteReflectionMilestone?.classification === "formalized-residual-terminal-packet-colour-route-reflection"
    && residualTerminalPacketColourRouteReflectionMilestone.status === "formalized-residual-terminal-packet-colour-route-reflection"
    && residualTerminalPacketColourRouteReflectionMilestone.scope === "For every arbitrary finite grouped BN6 family and selector-rank carrier, each canonical handle has a grouped footprint proved to lie in the family carrier and to have selector-relevant size. That internal grouped-footprint colour check is computed by construction while positive charge, the internal source route, authoritative handle rank, and exact ten-coordinate descent comparison remain canonical. The first-route classifier cannot return colour, charge, rank, or exactRoute; a final descent route proves nondecrease, and the positive Packet/HB endpoint carries exact failure evidence without route-clear or binding premises."
    && residualTerminalPacketColourRouteReflectionMilestone.nonClaim === "The internal colour check proves only canonical grouped-footprint eligibility: selector-relevant size with carrier-sublist membership retained as a separate theorem. It is not the full external manuscript colour equivalence. The five remaining semantic Boolean payload fields, finite rank map, before/after residual ranks, grouped family, realizer claims, HN/BUD activity, dependency rows, and finite-to-exact rank map remain explicit inputs. The five remaining routes still lack complete external semantics and global integration. The result does not construct the grouped family or rank map from terminal data, derive those five fields from a terminal candidate, prove that a decreasing transition exists, or construct the no-lower ledger. It does not establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketColourRouteReflectionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_COLOUR_ROUTE_REFLECTION_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketColourRouteReflectionMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_COLOUR_ROUTE_REFLECTION_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketColourRouteReflectionFormalized === true
    && status.leanResidualTerminalPacketColourRouteReflectionAxiomAuditPassed === true
    && status.leanResidualTerminalPacketColourRouteReflectionScope === "all-arbitrary-finite-grouped-footprint-colour-colour-route-excluded-charge-route-excluded-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-five-earlier-semantic-routes-without-route-clear-or-binding-premises"
    && residualTerminalPacketFrontierRouteReflectionMilestone?.classification === "formalized-residual-terminal-packet-frontier-route-reflection"
    && residualTerminalPacketFrontierRouteReflectionMilestone.status === "formalized-residual-terminal-packet-frontier-route-reflection"
    && residualTerminalPacketFrontierRouteReflectionMilestone.scope === "For every arbitrary finite grouped BN6 family, selector-rank carrier, and typed frontier-signature domain with decidable equality, the canonical payload computes frontier acceptance from exact equality of the supplied source and selector signatures while retaining grouped colour, positive charge, the internal source route, authoritative handle rank, and exact ten-coordinate descent comparison. A frontier first route is exactly typed signature inequality; equal signatures exclude it. The first-route classifier also cannot return colour, charge, rank, or exactRoute; a final descent route proves nondecrease, and the positive Packet/HB endpoint carries exact failure evidence without route-clear or binding premises."
    && residualTerminalPacketFrontierRouteReflectionMilestone.nonClaim === "The source and selector frontier signatures remain explicit inputs: this milestone does not construct the supplied signatures from terminal data, bind them to a BN5 coordinate, or prove the manuscript's full frontier-faithful comparison. Obligation, activation, direction, and budget remain supplied Boolean fields. Those four remaining routes still lack complete external semantics and global integration. The result does not construct the grouped family or rank map from terminal data, prove that a decreasing transition exists, or construct the no-lower ledger. It does not establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketFrontierRouteReflectionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_FRONTIER_ROUTE_REFLECTION_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketFrontierRouteReflectionMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_FRONTIER_ROUTE_REFLECTION_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketFrontierRouteReflectionFormalized === true
    && status.leanResidualTerminalPacketFrontierRouteReflectionAxiomAuditPassed === true
    && status.leanResidualTerminalPacketFrontierRouteReflectionScope === "all-arbitrary-finite-typed-frontier-equality-frontier-route-reflected-colour-route-excluded-charge-route-excluded-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-four-earlier-semantic-routes-without-route-clear-or-binding-premises"
    && residualTerminalPacketBN5ObligationRouteReflectionMilestone?.classification === "formalized-residual-terminal-packet-bn5-obligation-route-reflection"
    && residualTerminalPacketBN5ObligationRouteReflectionMilestone.status === "formalized-residual-terminal-packet-bn5-obligation-route-reflection"
    && residualTerminalPacketBN5ObligationRouteReflectionMilestone.scope === "For every arbitrary finite grouped BN6 family, selector-rank carrier, and typed terminal BN5 coordinate, the canonical payload computes frontier and obligation acceptance from exact equality of the corresponding source and selector BN5 fields while retaining grouped colour, positive charge, the internal source route, authoritative handle rank, and exact ten-coordinate descent comparison. A frontier first route is exactly frontier inequality; an obligation first route is prior frontier equality together with exact obligation inequality. The first-route classifier also cannot return colour, charge, rank, or exactRoute; a final descent route proves nondecrease, and the positive Packet/HB endpoint carries exact failure evidence without route-clear or binding premises."
    && residualTerminalPacketBN5ObligationRouteReflectionMilestone.nonClaim === "The source and selector terminal BN5 coordinates remain explicit inputs: this milestone does not construct those coordinates from terminal data or prove the manuscript's complete BN5 or Packet adequacy bridge. Activation, direction, and budget remain supplied Boolean fields. Those three remaining routes still lack complete external semantics and global integration. The result does not construct the grouped family or rank map from terminal data, prove that a decreasing transition exists, or construct the no-lower ledger. It does not establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketBN5ObligationRouteReflectionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_BN5_OBLIGATION_ROUTE_REFLECTION_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketBN5ObligationRouteReflectionMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_BN5_OBLIGATION_ROUTE_REFLECTION_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketBN5ObligationRouteReflectionFormalized === true
    && status.leanResidualTerminalPacketBN5ObligationRouteReflectionAxiomAuditPassed === true
    && status.leanResidualTerminalPacketBN5ObligationRouteReflectionScope === "all-arbitrary-finite-BN5-coordinate-frontier-obligation-routes-reflected-colour-route-excluded-charge-route-excluded-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-three-earlier-semantic-routes-without-route-clear-or-binding-premises"
    && residualTerminalPacketBN4ActivationRouteReflectionMilestone?.classification === "formalized-residual-terminal-packet-bn4-activation-route-reflection"
    && residualTerminalPacketBN4ActivationRouteReflectionMilestone.status === "formalized-residual-terminal-packet-bn4-activation-route-reflection"
    && residualTerminalPacketBN4ActivationRouteReflectionMilestone.scope === "For every arbitrary finite grouped BN6 family, selector-rank carrier, and typed terminal BN5 coordinate with decidable equality of activation atoms, the canonical payload computes frontier and obligation acceptance from the corresponding BN5 fields and activation acceptance from equality of the nested BN4 activation atoms while retaining grouped colour, positive charge, the internal source route, authoritative handle rank, and exact ten-coordinate descent comparison. Activation-atom equality is equivalent to equality of the canonical BN4 activation predicates on every cut. An activation first route is prior frontier and obligation equality together with exact activation-atom inequality. The first-route classifier also cannot return colour, charge, rank, or exactRoute; a final descent route proves nondecrease, and the positive Packet/HB endpoint carries exact failure evidence without route-clear or binding premises."
    && residualTerminalPacketBN4ActivationRouteReflectionMilestone.nonClaim === "The source and selector terminal BN5 coordinates remain explicit inputs: this milestone does not construct those coordinates from terminal data or prove the manuscript's complete BN4, BN5, or Packet adequacy bridge. Direction and budget remain supplied Boolean fields. Those two remaining routes still lack complete external semantics and global integration. The result does not construct the grouped family or rank map from terminal data, prove that a decreasing transition exists, or construct the no-lower ledger. It does not establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketBN4ActivationRouteReflectionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_BN4_ACTIVATION_ROUTE_REFLECTION_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketBN4ActivationRouteReflectionMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_BN4_ACTIVATION_ROUTE_REFLECTION_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketBN4ActivationRouteReflectionFormalized === true
    && status.leanResidualTerminalPacketBN4ActivationRouteReflectionAxiomAuditPassed === true
    && status.leanResidualTerminalPacketBN4ActivationRouteReflectionScope === "all-arbitrary-finite-BN4-activation-predicate-route-reflected-BN5-frontier-obligation-routes-reflected-colour-route-excluded-charge-route-excluded-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-two-earlier-semantic-routes-without-route-clear-or-binding-premises"
    && residualTerminalPacketDirectionRouteReflectionMilestone?.classification === "formalized-residual-terminal-packet-direction-route-reflection"
    && residualTerminalPacketDirectionRouteReflectionMilestone.status === "formalized-residual-terminal-packet-direction-route-reflection"
    && residualTerminalPacketDirectionRouteReflectionMilestone.scope === "For every arbitrary finite grouped BN6 family, selector-rank carrier, and domain of typed direction values with decidable equality, the canonical payload computes direction acceptance from exact source and selector direction equality while retaining computed BN5 frontier, obligation, and BN4 activation acceptance, grouped colour, positive charge, the internal source route, authoritative handle rank, and exact ten-coordinate descent comparison. A direction first route is prior frontier, obligation, and activation equality together with exact typed-direction inequality. The first-route classifier also cannot return colour, charge, rank, or exactRoute; a final descent route proves nondecrease, and the positive Packet/HB endpoint carries exact failure evidence without route-clear or binding premises."
    && residualTerminalPacketDirectionRouteReflectionMilestone.nonClaim === "The source and selector direction values remain explicit inputs: this milestone does not construct those direction values from terminal data or prove the manuscript's complete Dir(u) or Packet adequacy bridge. Budget is the sole remaining supplied Boolean field. That sole remaining route still lacks complete external semantics and global integration. The result does not construct the grouped family or rank map from terminal data, prove that a decreasing transition exists, or construct the no-lower ledger. It does not establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketDirectionRouteReflectionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_DIRECTION_ROUTE_REFLECTION_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketDirectionRouteReflectionMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_DIRECTION_ROUTE_REFLECTION_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketDirectionRouteReflectionFormalized === true
    && status.leanResidualTerminalPacketDirectionRouteReflectionAxiomAuditPassed === true
    && status.leanResidualTerminalPacketDirectionRouteReflectionScope === "all-arbitrary-finite-typed-direction-equality-route-reflected-BN5-frontier-obligation-activation-routes-reflected-colour-route-excluded-charge-route-excluded-exact-route-excluded-rank-route-excluded-exact-rankwf-nondecrease-or-sole-remaining-budget-route-without-route-clear-or-binding-premises"


    && residualTerminalPacketBudgetRouteReflectionMilestone?.classification === "formalized-residual-terminal-packet-budget-route-reflection"
    && residualTerminalPacketBudgetRouteReflectionMilestone.status === "formalized-residual-terminal-packet-budget-route-reflection"
    && residualTerminalPacketBudgetRouteReflectionMilestone.scope === "For every arbitrary finite grouped BN6 family, selector-rank carrier, and domain of typed budget values with decidable equality, the canonical payload computes budget acceptance from exact source and selector budget equality while retaining computed BN5 frontier, obligation, BN4 activation, and typed direction acceptance, grouped colour, positive charge, the internal source route, authoritative handle rank, and exact ten-coordinate descent comparison. A budget first route is prior frontier, obligation, activation, and direction equality together with exact typed-budget inequality. The first-route classifier cannot return colour, charge, rank, or exactRoute; a final descent route proves nondecrease, and the positive Packet/HB endpoint carries exact failure evidence without route-clear or binding premises."
    && residualTerminalPacketBudgetRouteReflectionMilestone.nonClaim === "The source and selector budget values remain explicit inputs: this milestone does not construct those budget values from terminal data, prove the manuscript's complete Bud(u) budget-envelope or Packet adequacy bridge, or identify local Packet budget coherence with BudgetResolve or HB budget activity. Computing every local Packet classifier field does not establish that terminal data supplies adequate values or that all routes are globally excluded. The result does not construct the grouped family or rank map from terminal data, prove that a decreasing transition exists, or construct the no-lower ledger. It does not establish full external selector compatibility, complete route silence, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketBudgetRouteReflectionMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_BUDGET_ROUTE_REFLECTION_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketBudgetRouteReflectionMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_BUDGET_ROUTE_REFLECTION_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketBudgetRouteReflectionFormalized === true
    && status.leanResidualTerminalPacketBudgetRouteReflectionAxiomAuditPassed === true
    && status.leanResidualTerminalPacketBudgetRouteReflectionScope === "all-arbitrary-finite-typed-budget-equality-all-packet-route-fields-reflected-colour-charge-exact-route-rank-excluded-exact-rankwf-nondecrease-without-route-clear-or-binding-premises"

    && residualTerminalPacketBudgetHBActivityBindingMilestone?.classification === "formalized-residual-terminal-packet-budget-hb-activity-binding"
    && residualTerminalPacketBudgetHBActivityBindingMilestone.status === "formalized-residual-terminal-packet-budget-hb-activity-binding"
    && residualTerminalPacketBudgetHBActivityBindingMilestone.scope === "For every arbitrary finite grouped BN6 family, the executable binding checker exhaustively requires each typed source/selector budget mismatch to imply activity of the HB budget node at the table-owned handle rank. When that check and the existing checked well-founded HB no-outcome closure both pass, every canonical handle has equal typed budgets, the Packet first-route classifier excludes the budget route, and the positive Packet endpoint is confined to frontier, obligation, activation, direction, or exact residual nondecrease."
    && residualTerminalPacketBudgetHBActivityBindingMilestone.nonClaim === "The Packet-to-HB budget binding is still an explicit checked input over a supplied grouped family, rank map, activity environment, and dependency table; this milestone does not construct that binding, the typed budget values, or a manuscript Bud(u) envelope from terminal data. It does not implement BudgetResolve, prove blocker semantic completeness, derive the HB table or its local closure premise from terminal data, or exclude the remaining frontier, obligation, activation, direction, and descent routes. It does not establish full Packet adequacy, unconditional HB.NegativeClosure, positive slack, SaturatePositive, BCELReady, unconditional ZeroSlack, PCCMin, encoded-size or polynomial-runtime bounds, SAT in P; remove a project assumption; or prove P = NP."
    && sameJson(
      residualTerminalPacketBudgetHBActivityBindingMilestone.requiredTheorems,
      RESIDUAL_TERMINAL_PACKET_BUDGET_HB_ACTIVITY_BINDING_DECLARATIONS.map(([name]) => name)
    )
    && residualTerminalPacketBudgetHBActivityBindingMilestone.theoremRows?.every((row) => {
      const expected = RESIDUAL_TERMINAL_PACKET_BUDGET_HB_ACTIVITY_BINDING_DECLARATIONS.find(([name]) => name === row.name);
      return expected
        && row.present === true
        && row.kind === 'theorem'
        && sameJson(row.axioms, expected[1])
        && row.actualKernelTypeSha256 === expected[3]
        && row.expectedKernelTypeSha256 === expected[3]
        && row.kernelTypeFingerprintMatches === true;
    })
    && status.leanResidualTerminalPacketBudgetHBActivityBindingFormalized === true
    && status.leanResidualTerminalPacketBudgetHBActivityBindingAxiomAuditPassed === true
    && status.leanResidualTerminalPacketBudgetHBActivityBindingScope === "all-arbitrary-finite-typed-budget-mismatch-to-HB-activity-checked-budget-route-excluded-under-checked-well-founded-HB-closure"

    && lockedNANDThresholdPublicationMilestone?.classification === "formalized-concrete-locked-nand-threshold"
    && lockedNANDThresholdPublicationMilestone.status === "formalized-concrete-locked-nand-threshold"
    && lockedNANDThresholdPublicationMilestone.scope === "A uniform encoded polynomial-time SAT instance builder and the report-level locked-NAND threshold theorem linked to that builder."
    && lockedNANDThresholdPublicationMilestone.nonClaim === "This closes the uniform all-bitstring CNFSAT-to-concrete-locked-threshold builder and report-facing linkage in the finite charged-pipeline model. It does not put the concrete locked threshold language in P, discharge residual-band minimization, ZeroSlack or PCCMin, prove concrete CNFSAT NP-hardness, activate the legacy string-handle bridge, or prove P = NP."
    && sameJson(
      lockedNANDThresholdPublicationMilestone.requiredTheorems,
      LOCKED_NAND_THRESHOLD_PUBLICATION_DECLARATIONS.map(([name]) => name)
    )
    && lockedNANDThresholdPublicationTheoremRow?.present === true
    && lockedNANDThresholdPublicationTheoremRow.kind === 'theorem'
    && sameJson(lockedNANDThresholdPublicationTheoremRow.axioms, ['Quot.sound', 'propext'])
    && lockedNANDThresholdPublicationTheoremRow.actualKernelTypeSha256 === LOCKED_NAND_THRESHOLD_PUBLICATION_KERNEL_TYPE_SHA256
    && lockedNANDThresholdPublicationTheoremRow.expectedKernelTypeSha256 === LOCKED_NAND_THRESHOLD_PUBLICATION_KERNEL_TYPE_SHA256
    && lockedNANDThresholdPublicationTheoremRow.kernelTypeFingerprintMatches === true
    && globalZeroSlackPCCMinMilestone?.classification === 'not-formalized'
    && globalZeroSlackPCCMinMilestone.status === 'not-formalized'
    && globalZeroSlackPCCMinMilestone.scope === 'Complete residual routing, global ZeroSlack contradiction, exact minimization, and polynomial bounds.'
    && globalZeroSlackPCCMinMilestone.nonClaim === "The finite candidate-derived BN3 envelope supplies stable request identities and one jointly side-tight canonical basis family; the finite BN4 kernel supplies activation-exact same-key integer cancellation over an explicit typed cell ledger; the finite BN5 kernel localizes explicit full/shadow multiplicity failure to a strict Hall deficit and local X1 route; the exhaustive Packet scan verifies strict gains or exact no-gain over every canonical selector in one supplied explicit grouped family; an explicit global gain-coverage certificate conditionally upgrades that silence to a proof-bearing ZeroSlack result; the generic finite R-ChargeSurplus kernel derives strict gain from exact ledgers, an unmatched positive support charge, exact gate accounting, and separately proved semantics; the checked unit-charge blueprint realizer derives canonical ledgers and gains for every valid blueprint in one supplied family; the checked typed-realizer contract rejects every faithful-table row except a genuine blueprint gain or an explicitly active bounded-rank HN, budget, or strictly lower faithful seed bot; the checked exact-rank HB graph contract validates every edge in a supplied finite HN/BUD dependency graph; the checked total-table HB contract gives every finite HN/BUD node one row, materializes every listed dependency as an edge, and derives well-founded induction and cycle exclusion for that supplied table; the checked HB active-dependency closure combines an exhaustive active-to-active row condition with strict rank descent to prove every supplied HN/BUD activity bit false and remove HN/budget typed-bot branches; and the executable selector-silence induction exhaustively checks that every canonical realizer claim is a typed bottom, then combines supplied-table HB inactivity with strong finite-rank induction to prove every canonical handle in the accepted table nonfaithful without a global semantic no-gain premise. The Packet selector-faithfulness routing milestone checks ten canonical source-payload fields and derives a contradiction for every positive Packet under explicit route-clear inputs; the canonical table constructor now computes the HB faithfulness function from those payloads and removes the separate binding premise; and total first-route classification turns every canonical payload rejection into one earliest typed route, which canonical HB selector silence forces for a positive Packet without route-clear or binding premises. The exact first-route semantics milestone additionally identifies every returned route with its unique earliest failed supplied payload field. The descent-reflection milestone computes the final descent field from the exact ten-coordinate RankWF relation and proves a forced final route is genuinely nondecreasing. The rank-tag-reflection milestone then copies the table-owned handle rank into the payload and excludes the duplicate rank route. The exact-route-reflection milestone marks the already proved internal handle-to-cell-to-positive-payload source route clear by construction and excludes the duplicate exact-route result as well; this internal route is not an external exact minimum. The charge-route-reflection milestone then derives the internal charge check from the canonical source atom with strictly positive mass and excludes the charge result; that positive mass is not the full external charge-surplus or replacement semantics. The colour-route-reflection milestone then derives internal grouped-footprint eligibility from each canonical handle and excludes colour; this is not external manuscript colour equivalence. The typed-frontier-route-reflection milestone replaces the caller frontier bit with executable equality of explicit typed source and selector signatures, so a frontier route carries exact inequality. The BN5-bound frontier-and-obligation milestone then binds both checks to exact fields of explicit typed terminal BN5 coordinates: frontier and obligation routes carry their corresponding inequalities, with frontier equality preceding an obligation failure. The BN4 activation-exact milestone computes activation from the coordinates' nested activation atoms. The typed-direction milestone computes direction from equality of explicit source and selector direction values. The typed-budget milestone computes the last caller-supplied Packet Boolean from equality of explicit source and selector budget values. Those coordinates, direction values, and budget values are not constructed from terminal data, and local budget equality is not BudgetResolve or HB budget semantics. The finite rank map remains explicit. The construction still does not derive the BN4 ledger, BN5 payload/shadow universe, grouped BN6 family, replacement blueprints, occurrence pairing, rank assignment, payload values, exhaustive realizer claims, or blocker tables from terminal data; connect matching back to a contradiction; derive blocker semantics, semantic dependency completeness, or the checked local active-dependency premise from terminal data; prove the reported routes' external semantics or map all residual routes into a decreasing complete global outcome system; or provide full external selector compatibility, an independently constructed realizer, unconditional global silence, and polynomial-runtime completeness. Global unconditional ZeroSlack and polynomial PCCMin therefore remain unformalized."
    && sameJson(globalZeroSlackPCCMinMilestone.requiredTheorems, [
      'PNP.Main.pccmin_polynomial_exact',
      'PNP.Main.zero_slack_complete',
    ])
    && status.nonClaims?.includes('The BN3 joint-realizability gap still shows that arbitrary per-cut side-tight existence cannot imply a stable family. The successful computed BCEL nucleus has a candidate-derived finite repair with canonical request identities, exact minimal consumers, duplicate-free incidence, and one jointly side-tight basis selection function, but its all-subsets enumeration is exponential. The finite BN4 kernel consumes that repaired envelope without repairing arbitrary caller-supplied per-cut witnesses.')
    && status.nonClaims?.includes('The finite BN4 activation-exact cancellation kernel classifies exact integer positive and negative mass at each complete typed key over an explicit caller-supplied cell ledger. It does not derive the cells, semantic signatures, or transport types from four-corner bases; establish the full historical BN4 theorem; construct PkgC or BN6; complete global routes or selectors; establish ZeroSlack or polynomial PCCMin; put SAT in P; or prove P = NP.')
    && status.nonClaims?.includes('The finite BN5 full-shadow localization kernel uniformly handles arbitrary finite exact-coordinate unit and quotient-shadow ledgers. It validates negative-mass refinement, computes cut silence, and returns complete multiplicity coverage or a strict Hall deficit routed to local X1. The payloads and shadow universe are explicit inputs; complete matching is not connected back to a BN4 contradiction; full CritC/Q/E/L/X2/X3/X4 diagnosis, the full historical BN5 theorem, full PkgC and BN6, global routes, selectors, polynomial generation and runtime, ZeroSlack, PCCMin, SAT in P, and P = NP remain unproved.')
    && status.nonClaims?.includes('The finite PkgC separating-consumer classifier scans an arbitrary explicit minimal-consumer antichain for the first disjoint nonsingleton pair, canonically indexes its atoms, and returns exact-coordinate restoration coverage or a strict Hall deficit routed to local Q; absence is exactly the V54 singletonization premise. The restoration coordinate universe remains explicit, coverage is not connected back to a BN4 or BN5 contradiction, the local route is not embedded in the complete global outcome system, and full PkgC route silence, derivation from a terminal candidate, polynomial generation and runtime, ZeroSlack, PCCMin, SAT in P, and P = NP remain unproved.')
    && status.nonClaims?.includes('The arbitrary-finite V54 consumer-antichain normal form proves that two-sided activation is nonzero exactly when a minimal-consumer antichain has a disjoint pair and, under the exact PkgC singletonization premise, is literally the cut indicator of the singleton footprint. The theorem itself consumes an explicit antichain. The finite BN6 bridge now transports explicitly grouped instances into V53, but full PkgC construction and route silence, derivation and grouping from terminal candidates, global routes, selectors, polynomial runtime, ZeroSlack, PCCMin, SAT in P, and P = NP remain unproved.')
    && status.nonClaims?.includes('The arbitrary-finite V53 constant-cut hypergraph rigidity theorem proves the exact q=2, q=3, and q>=4 classification for sparse positive hypergraphs with one common nonempty proper-cut value. The finite BN6 bridge now constructs such a hypergraph from explicit grouped V54 cells and retains payload witnesses, but full PkgC construction, terminal-candidate derivation and grouping, full historical BN6 and Packet selector/realizer completeness, global routes, polynomial runtime, ZeroSlack, PCCMin, SAT in P, and P = NP remain unproved.')
    && status.nonClaims?.includes('The finite BN6 hypergraph-packet bridge transports an explicit already-grouped positive payload-bearing V54 survivor family into the exact V53 cut sum and returns the pair, mixed three-anchor, or full-span packet classification with source payload witnesses. It does not complete PkgC, derive or group survivors from a terminal candidate, establish full historical BN6 or Packet selector/realizer completeness, complete global routes, prove polynomial generation or runtime, ZeroSlack or PCCMin, SAT in P, or P = NP.')
    && status.nonClaims?.includes('The finite Packet charge-surplus kernel derives strict replacement weight from exact occurrence accounting, pairwise weight preservation, and an unmatched positive support charge, then derives a StrictEquivalentGain only when exact gate accounting and semantic equivalence are separately proved. It does not construct a replacement or its ledger from terminal data, so it is not the complete realizer, not unconditional ZeroSlack, and not a polynomial-runtime or PCCMin result.')
    && status.nonClaims?.includes('The checked Packet unit-charge blueprint realizer derives canonical gate-occurrence ledgers, strict charge surplus, and a genuine gain only after a constructive exact-multiplicity validator accepts one supplied data-only blueprint and semantic equivalence. It scans every original blueprint atom behind every canonical handle in one supplied family. The blueprints and family remain explicit; unresolved means only supplied-family validator silence, not BotHN, BotBUD, a lower-rank BotSeed, global no-gain, ZeroSlack, or polynomial realizer completeness.')
    && status.nonClaims?.includes('The checked Packet typed-realizer contract validates every faithful row in an arbitrary finite supplied selector table as only a checked unit-charge gain, active same-or-lower-rank HN bot, active same-or-lower-rank budget bot, or faithful strictly lower-rank seed bot; its grouped-family specialization covers every canonical handle. The rank assignment, faithfulness predicate, claims, and activity tables remain inputs, so this does not construct blockers, prove their semantics or HB acyclicity, establish global selector silence, ZeroSlack, or polynomial realizer completeness.')
    && status.nonClaims?.includes('The checked HB blocker-graph acyclicity contract exhaustively validates a supplied finite-index embedding into the exact ten-coordinate residual rank and every supplied HN/BUD dependency edge, deriving well-foundedness and excluding every nonempty directed cycle. The graph, edges, rank mapping, blocker semantics, and dependency completeness remain inputs or open obligations; this is not the full HB negative closure, rank-complete selector silence, ZeroSlack, or polynomial PCCMin.')
    && status.nonClaims?.includes('The checked total-table HB dependency contract assigns every finite HN/BUD node one data-only row and materializes every listed dependency as a graph edge, deriving exact representation coverage, well-founded rank induction, and cycle exclusion. The table, rank mapping, and local invariant premise remain inputs; this does not prove blocker semantics or semantic dependency completeness, silence an active blocker, establish the full HB negative closure, rank-complete selector silence, ZeroSlack, or polynomial PCCMin.')
    && status.nonClaims?.includes('The checked HB active-dependency closure exhaustively verifies that every active supplied HN/BUD node names an active dependency in its total row and combines that local condition with strict exact-rank descent. Well-founded induction forces every supplied activity bit to be false and removes HN/BUD bot branches from the checked typed-realizer result. Activity bits, dependency rows, rank mapping, selector data, blocker semantics, and semantic dependency completeness remain supplied or open; gain and lower-seed branches remain, so this is not rank-complete selector silence, the full HB negative closure, ZeroSlack, or polynomial PCCMin.')
    && status.nonClaims?.includes('The conditional selector-silence rank closure combines checked HN/BUD inactivity with an explicit global semantic gain exclusion premise and strong induction on the supplied finite selector ranks. It proves every canonical handle in that accepted supplied table nonfaithful. The gain-coverage specialization still consumes an explicit coverage certificate plus source-cell no-gain. This does not establish selector faithfulness or compatibility, construct the tables or certificate from terminal data, prove blocker semantics or semantic dependency completeness, establish unconditional HB negative closure or ZeroSlack, or provide encoded-size and polynomial-runtime bounds.')
    && status.nonClaims?.includes('The executable selector-silence induction replaces the global semantic no-gain premise with an exhaustive data-only check that every canonical realizer claim is a typed bottom. Checked HB active-dependency closure removes HN/BUD bottoms, and strong finite-rank induction removes faithful lower seeds. The grouped family, rank and faithfulness functions, claims, activity functions, dependency rows, and rank map remain explicit data inputs; it does not construct them from terminal candidates, establish selector faithfulness or compatibility, prove blocker semantics or semantic dependency completeness, establish the full unconditional HB negative closure or ZeroSlack, or provide encoded-size and polynomial-runtime bounds.')
    && status.nonClaims?.includes('The Packet selector-faithfulness routing checker computes faithfulness from ten data-only fields on each canonical positive source payload, exposes the first failed route, exhaustively checks every canonical handle, and binds the result exactly to the supplied HB table. A positive Packet then yields a faithful handle that contradicts accepted executable HB selector silence. The grouped family, payload fields, rank tags, route-clear data, HB table, claims, blocker activity, and dependencies remain explicit inputs; positive slack, SaturatePositive, BCELReady, terminal-data construction, complete route silence, unconditional ZeroSlack, and polynomial PCCMin remain open.')
    && status.nonClaims?.includes('Typed Packet direction-route reflection computes the direction field from equality of explicit typed source and selector direction values while retaining the computed BN5 frontier, obligation, and BN4 activation checks. A direction route carries all three prior equalities plus typed-direction inequality; colour, charge, exactRoute, and rank remain excluded; and a final descent route still proves actual nondecrease. The direction values remain explicit and are not constructed from terminal data or proved to implement the manuscript Dir(u) semantics. Budget is the sole remaining supplied Boolean field and route, so complete route silence, unconditional ZeroSlack, and polynomial PCCMin remain open.')
    && status.nonClaims?.includes("Typed Packet budget-route reflection computes the final supplied Packet Boolean from equality of explicit typed source and selector budget values while retaining the computed BN5 frontier, obligation, BN4 activation, and typed direction checks. A budget route carries all four prior equalities plus typed-budget inequality; colour, charge, exactRoute, and rank remain excluded; and a final descent route still proves actual nondecrease. The budget values remain explicit and are not constructed from terminal data, proved to implement the manuscript Bud(u) envelope semantics, or identified with BudgetResolve or HB budget activity. Complete external route adequacy, unconditional ZeroSlack, and polynomial PCCMin remain open.")
    && status.nonClaims?.includes("The checked Packet budget/HB activity binding exhaustively requires every typed budget mismatch in an arbitrary finite canonical handle family to activate the HB budget node at the table-owned handle rank. The independently checked well-founded no-outcome closure then forces exact budget equality and excludes the local budget first route, leaving only frontier, obligation, activation, direction, or exact residual nondecrease. The binding, budgets, grouped family, ranks, activity table, dependency rows, and realizer data remain explicit rather than terminal-derived; this does not implement BudgetResolve, prove budget-blocker semantic completeness, establish complete Packet adequacy, unconditional ZeroSlack, or polynomial PCCMin.")
    && status.nonClaims?.includes('BN4 activation-exact Packet route reflection computes the activation field from equality of the nested BN4 activation atoms in the explicit source and selector BN5 coordinates. That equality is equivalent to equality of the canonical activation predicates on every cut. An activation route carries prior BN5 frontier and obligation equality plus activation-atom inequality; colour, charge, exactRoute, and rank remain excluded; and a final descent route still proves actual nondecrease. Direction and budget are the two remaining explicit fields and routes. The coordinates are not constructed from terminal data, so complete route silence, unconditional ZeroSlack, and polynomial PCCMin remain open.')
    && status.leanLockedNANDPolynomialBuilderFormalized === true
    && status.leanLockedNANDBuilderFormalized === true
    && status.leanLockedNANDThresholdFormalized === true
    && status.leanSaturatePositiveFormalized === false
    && status.leanBCELReadyFormalized === false
    && status.leanResidualRoutesGlobalGainCompletenessFormalized === false
    && status.leanZeroSlackPositiveSlackContradictionFormalized === false
    && status.leanZeroSlackCompletenessFormalized === false
    && status.leanPCCMinPolynomialRuntimeFormalized === false
    && status.mathematicalTheoremEstablished === gatePassed
    && status.publicTheoremEmissionAllowed === gatePassed
    && status.finalTheoremReady === gatePassed
    && status.internalFinalTheoremReady === gatePassed
    && status.unrestrictedFinalSoundnessDischarged === gatePassed
    && status.uniformFinalSoundnessProved === gatePassed
    && status.satInPConclusionAccepted === gatePassed
    && status.pEqualsNPConclusionAccepted === gatePassed
    && (gatePassed || (status.publicTheoremStatement === null && status.publicTheoremConclusion === null))
    && status.rootLeanTheoremPresent === status.concretePublicationGate.subchecks.compatibilityRootPresent
    && status.rootLeanTheoremBuilt === gatePassed
    && status.rootLeanTheoremAxiomAuditPassed === gatePassed
    && status.projectSpecificAxiomsRemaining === true
    && sameJson(status.projectSpecificAxiomInventory, PROJECT_AXIOMS)
    && status.leanConcreteCNFVerifierCorrectnessFormalized === true
    && status.leanConcreteCNFVerifierNoTimeoutFormalized === true
    && status.leanConcreteCNFWorkAxiomAuditPassed === true
    && status.leanConcreteCNFWorkAuditedDeclarationCount === 766
    && status.leanConcreteCNFSATMembershipFormalized === true
    && status.leanConcreteCNFSATMembershipTheorem === 'PNP.Concrete.FinalUniversalDesign.cnfSATInNP'
    && status.leanConcretePipelineStateNamespaceFormalized === true
    && status.leanConcretePipelineStateNamespaceAxiomAuditPassed === true
    && status.leanConcretePipelineStateNamespaceAuditedDeclarationCount === 39
    && status.leanConcretePipelineStageBridgesFormalized === true
    && status.leanConcretePipelineStageBridgesAxiomAuditPassed === true
    && status.leanConcretePipelineStageBridgesAuditedDeclarationCount === 56
    && status.leanConcretePipelineStageLaunchFormalized === true
    && status.leanConcretePipelineVerdictPreservationFormalized === true
    && status.leanConcretePipelineInternalOutputHandoffComposed === true
    && status.leanConcretePipelineTerminalOutputPackingFormalized === true
    && status.leanConcretePipelineTerminalOutputPackerAxiomAuditPassed === true
    && status.leanConcretePipelineTerminalOutputPackerAuditedDeclarationCount === 69
    && status.leanConcretePipelineTerminalOutputPackerConnectedToBridgeEndpointFormalized === true
    && status.leanConcretePipelineTerminalBridgeAxiomAuditPassed === true
    && status.leanConcretePipelineTerminalBridgeAuditedDeclarationCount === 59
    && status.leanConcretePipelinePriorTraceTransportToTerminalBridgeFormalized === true
    && status.leanConcretePipelineInputFramerAxiomAuditPassed === true
    && status.leanConcretePipelineInputFramerAuditedDeclarationCount === 70
    && status.leanConcretePipelineAllInputFramingFormalized === true
    && status.leanConcretePipelinePairedCompilerAxiomAuditPassed === true
    && status.leanConcretePipelinePairedCompilerAuditedDeclarationCount === 28
    && status.leanConcretePipelineCanonicalPairCompilationFormalized === true
    && status.leanConcretePipelineCompilerAxiomAuditPassed === true
    && status.leanConcretePipelineCompilerAuditedDeclarationCount === 29
    && status.leanConcretePipelineAllInputCompilationFormalized === true
    && status.leanConcretePipelineSequentialNamespaceFormalized === true
    && status.leanConcretePipelineSequentialNamespaceAxiomAuditPassed === true
    && status.leanConcretePipelineSequentialNamespaceAuditedDeclarationCount === 26
    && status.leanConcretePipelineSequentialCompilationFormalized === true
    && status.leanConcretePipelineSequentialCompilerAxiomAuditPassed === true
    && status.leanConcretePipelineSequentialCompilerAuditedDeclarationCount === 31
    && status.leanConcretePipelineSequentialVerdictAndOutputPreservationFormalized === true
    && status.leanConcretePipelineSequentialExternalInputSizePolynomialFormalized === true
    && status.leanConcretePipelineSequentialStuckFirstTimeoutFormalized === true
    && status.leanConcretePipelineRefinementAxiomAuditPassed === true
    && status.leanConcretePipelineRefinementAuditedDeclarationCount === 16
    && status.leanConcreteFunctionProgramRecursiveCompilationFormalized === true
    && status.leanConcreteDecisionProgramRecursiveCompilationFormalized === true
    && status.leanConcretePolynomialTimeDeciderRawCompilationFormalized === true
    && status.standardComplexityModelFormalized === true
    && status.leanConcretePipelineMalformedInputBehaviorFormalized === true
    && status.leanConcretePipelineRawRefinementFormalized === true
    && status.leanConcretePipelineExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderInputLengthFormalized === true
    && status.leanConcreteCookLevinBuilderInputLengthAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderInputLengthAuditedDeclarationCount === 39
    && status.leanConcreteCookLevinBuilderInputLengthCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderInputLengthExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderInputLengthMalformedInternalInputTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderInputLengthConnectedToTotalInputFramerEndpointFormalized === true
    && status.leanConcreteCookLevinBuilderInputPrefixFormalized === true
    && status.leanConcreteCookLevinBuilderInputPrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderInputPrefixAuditedDeclarationCount === 40
    && status.leanConcreteCookLevinBuilderInputPrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderInputPrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderInputPrefixMalformedScanSymbolTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderInputPrefixLiteralFramerLaunchFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderTokenAppenderAuditedDeclarationCount === 68
    && status.leanConcreteCookLevinBuilderTokenAppenderCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderAllTokensExactFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderFirstFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderMalformedPhaseTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderTokenAppenderInputPrefixComposed === true
    && status.leanConcreteCookLevinBuilderFirstTokenPrefixFormalized === true
    && status.leanConcreteCookLevinBuilderFirstTokenPrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderFirstTokenPrefixAuditedDeclarationCount === 37
    && status.leanConcreteCookLevinBuilderFirstTokenPrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderFirstTokenPrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderFirstTokenPrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderFirstTokenPrefixMalformedPhaseTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderUnaryPolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderUnaryPolynomialAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderUnaryPolynomialAuditedDeclarationCount === 74
    && status.leanConcreteCookLevinBuilderUnaryPolynomialCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderUnaryPolynomialExactRuntimePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderCompleteHeaderFormalized === true
    && status.leanConcreteCookLevinBuilderCompleteHeaderAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderCompleteHeaderAuditedDeclarationCount === 84
    && status.leanConcreteCookLevinBuilderCompleteHeaderCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderCompleteHeaderExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderCompleteHeaderExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderCompleteHeaderInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderCompleteHeaderFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderBodyStartPrefixFormalized === true
    && status.leanConcreteCookLevinBuilderBodyStartPrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderBodyStartPrefixAuditedDeclarationCount === 60
    && status.leanConcreteCookLevinBuilderBodyStartPrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderBodyStartPrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderBodyStartPrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderBodyStartPrefixRetainedNextTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderBodyStartPrefixInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderBodyStartPrefixFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderFirstLiteralPrefixFormalized === true
    && status.leanConcreteCookLevinBuilderFirstLiteralPrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderFirstLiteralPrefixAuditedDeclarationCount === 74
    && status.leanConcreteCookLevinBuilderFirstLiteralPrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderFirstLiteralPrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderFirstLiteralPrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderFirstLiteralPrefixRetainedNextTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderFirstLiteralPrefixInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePrefixFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderFirstClausePrefixAuditedDeclarationCount === 79
    && status.leanConcreteCookLevinBuilderFirstClausePrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePrefixRetainedNextTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePrefixInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderFirstClausePrefixFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePrefixCompleteFirstClauseFormalized === true
    && status.leanConcreteCookLevinBuilderDynamicTokenCursorStepFormalized === true
    && status.leanConcreteCookLevinBuilderDynamicTokenCursorStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderDynamicTokenCursorStepAuditedDeclarationCount === 47
    && status.leanConcreteCookLevinBuilderDynamicTokenCursorStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderDynamicTokenCursorStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderDynamicTokenCursorStepDirectPaddingOutcomeFormalized === true
    && status.leanConcreteCookLevinBuilderDynamicTokenCursorStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderDynamicTokenCursorStepInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderDynamicTokenCursorStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderDynamicTokenCursorStepSinglePaddingStepFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePaddingRunFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePaddingRunAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderFirstClausePaddingRunAuditedDeclarationCount === 84
    && status.leanConcreteCookLevinBuilderFirstClausePaddingRunCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePaddingRunExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePaddingRunRemainingPaddingCountFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePaddingRunDirectPaddingBlockFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePaddingRunSecondClauseStartFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePaddingRunNoEmissionSpecificationFormalized === true
    && status.leanConcreteCookLevinBuilderFirstClausePaddingRunInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderFirstClausePaddingRunFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepAuditedDeclarationCount === 56
    && status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepSecondClauseSeparatorFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondClauseSeparatorStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixAuditedDeclarationCount === 87
    && status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixAuditedDeclarationCount === 115
    && status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePrefixFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondClausePrefixAuditedDeclarationCount === 57
    && status.leanConcreteCookLevinBuilderSecondClausePrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePrefixCompleteSecondClauseFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePrefixClauseTerminatorFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePrefixRetainedFirstPaddingCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePrefixRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePrefixInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondClausePrefixFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePaddingRunFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePaddingRunAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondClausePaddingRunAuditedDeclarationCount === 68
    && status.leanConcreteCookLevinBuilderSecondClausePaddingRunCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePaddingRunExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePaddingRunExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePaddingRunRemainingPaddingCountFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePaddingRunDirectPaddingBlockFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePaddingRunThirdClauseStartFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePaddingRunNoEmissionSpecificationFormalized === true
    && status.leanConcreteCookLevinBuilderSecondClausePaddingRunInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondClausePaddingRunFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepAuditedDeclarationCount === 56
    && status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepThirdClauseSeparatorFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderThirdClauseSeparatorStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixAuditedDeclarationCount === 87
    && status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderThirdClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixAuditedDeclarationCount === 145
    && status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixRetainedClauseTerminatorCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderThirdClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePrefixFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderThirdClausePrefixAuditedDeclarationCount === 57
    && status.leanConcreteCookLevinBuilderThirdClausePrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePrefixCompleteThirdClauseFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePrefixClauseTerminatorFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePrefixRetainedFirstPaddingCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePrefixRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePrefixInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderThirdClausePrefixFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePaddingRunFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePaddingRunAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderThirdClausePaddingRunAuditedDeclarationCount === 68
    && status.leanConcreteCookLevinBuilderThirdClausePaddingRunCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePaddingRunExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePaddingRunExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePaddingRunRemainingPaddingCountFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePaddingRunDirectPaddingBlockFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePaddingRunFourthClauseStartFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePaddingRunNoEmissionSpecificationFormalized === true
    && status.leanConcreteCookLevinBuilderThirdClausePaddingRunInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderThirdClausePaddingRunFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepAuditedDeclarationCount === 56
    && status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFourthClauseSeparatorFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderFourthClauseSeparatorStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixAuditedDeclarationCount === 115
    && status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixCompleteFirstNegativeLiteralFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderFourthClauseFirstLiteralPrefixFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixAuditedDeclarationCount === 147
    && status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixCompleteSecondNegativeLiteralFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderFourthClauseSecondLiteralPrefixFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePrefixFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePrefixAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderFourthClausePrefixAuditedDeclarationCount === 57
    && status.leanConcreteCookLevinBuilderFourthClausePrefixCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePrefixExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePrefixExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePrefixCompleteFourthClauseFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePrefixRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePrefixInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderFourthClausePrefixFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunAuditedDeclarationCount === 68
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunRemainingPaddingCountFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunDirectPaddingBlockFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunFifthClauseSlotStartFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunNoEmissionSpecificationFormalized === true
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderFourthClausePaddingRunFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunFormalized === true
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunAuditedDeclarationCount === 68
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunPaddingCountFormalized === true
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunDirectPaddingBlockFormalized === true
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunSixthClauseSlotStartFormalized === true
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunNoEmissionSpecificationFormalized === true
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderFifthClausePaddingRunFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunFormalized === true
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunAuditedDeclarationCount === 68
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunPaddingCountFormalized === true
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunDirectPaddingBlockFormalized === true
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunSecondConstraintSeparatorFormalized === true
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunNoEmissionSpecificationFormalized === true
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderFirstConstraintPaddingRunFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepAuditedDeclarationCount === 56
    && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepSecondConstraintSeparatorFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeparatorStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepAuditedDeclarationCount === 56
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepSecondConstraintFirstLiteralSignFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSignStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepAuditedDeclarationCount === 56
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepSecondConstraintFirstLiteralFirstUnaryUnitFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralFirstUnaryUnitStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepAuditedDeclarationCount === 56
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepSecondConstraintFirstLiteralSecondUnaryUnitFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSecondUnaryUnitStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepAuditedDeclarationCount === 56
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepSecondConstraintFirstLiteralThirdUnaryUnitFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralThirdUnaryUnitStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepAuditedDeclarationCount === 56
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepSecondConstraintFirstLiteralTerminatorFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralTerminatorStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepAuditedDeclarationCount === 82
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepSecondConstraintFirstLiteralSuccessorTokenFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepInputPrefixAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFirstLiteralSuccessorTokenStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepAuditedDeclarationCount === 82
    && status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepPaddingOrUnaryOpportunityFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepAuditedDeclarationCount === 82
    && status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFourthPaddingOrUnaryOpportunityFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFourthPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepAuditedDeclarationCount === 82
    && status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFifthPaddingOrTerminatorOpportunityFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepInputPrefixOptionalTerminatorAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintFifthPaddingOrTerminatorOpportunityStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepAuditedDeclarationCount === 82
    && status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepSixthPaddingOrOpeningUnaryOpportunityFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepInputPrefixOptionalAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSixthPaddingOrOpeningUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepAuditedDeclarationCount === 82
    && status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepSeventhPaddingOrUnaryOpportunityFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSeventhPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanLockedNANDCarrierLayoutFormalized === true
    && status.leanLockedNANDCarrierTraceAxiomAuditPassed === true
    && status.leanLockedNANDCarrierTraceAuditedDeclarationCount === 71
    && status.leanLockedNANDCarrierTraceScope === 'arbitrary-finite-topological-nand-circuits-carrier-separation-and-trace-equivalence'
    && status.leanLockedNANDGlobalCandidateAssemblyFormalized === true
    && status.leanLockedNANDGlobalBaselineCandidateFormalized === true
    && status.leanLockedNANDGlobalCandidateAxiomAuditPassed === true
    && status.leanLockedNANDGlobalCandidateAuditedDeclarationCount === 71
    && status.leanLockedNANDGlobalCandidateScope === 'arbitrary-finite-topological-nand-circuits-exact-baseline-and-four-gate-extension'
    && status.leanLockedNANDGlobalBaselineDistinctFormalized === true
    && status.leanLockedNANDGlobalBaselineDistinctAxiomAuditPassed === true
    && status.leanLockedNANDGlobalBaselineDistinctAuditedDeclarationCount === 5
    && status.leanLockedNANDGlobalBaselineDistinctScope === 'arbitrary-finite-topological-nand-circuits-global-baseline-output-conditions-and-exact-reference-minimum'
    && status.leanLockedNANDUnsatisfiableFinalZeroFormalized === true
    && status.leanLockedNANDUnsatisfiableFinalZeroAxiomAuditPassed === true
    && status.leanLockedNANDUnsatisfiableFinalZeroAuditedDeclarationCount === 2
    && status.leanLockedNANDUnsatisfiableFinalZeroScope === 'arbitrary-finite-topological-nand-circuits-whole-carrier-unsatisfiable-final-zero-and-exact-reference-minimum'
    && status.leanLockedNANDDerivedFinalOutputLawsFormalized === true
    && status.leanLockedNANDResidualSlackAtMostFourFormalized === true
    && status.leanLockedNANDSatisfiableFinalConditionsFormalized === true
    && status.leanLockedNANDGlobalSemanticThresholdFormalized === true
    && status.leanLockedNANDGlobalSemanticThresholdAxiomAuditPassed === true
    && status.leanLockedNANDGlobalSemanticThresholdAuditedDeclarationCount === 8
    && status.leanLockedNANDGlobalSemanticThresholdScope === 'arbitrary-finite-topological-nand-circuits-complete-six-field-premises-and-typed-semantic-threshold'
    && sameJson(status.leanLockedNANDThresholdMissingInstantiationInventory, [])
    && status.leanConcreteLockedNANDEncodedSemanticReductionFormalized === true
    && status.leanConcreteLockedNANDEncodedSemanticReductionAxiomAuditPassed === true
    && status.leanConcreteLockedNANDEncodedSemanticReductionAuditedDeclarationCount === 48
    && status.leanConcreteLockedNANDEncodedSemanticReductionScope === 'strict-version-zero-codec-direct-normalization-semantics-complete-candidate-bytes-and-fail-closed-semantic-reduction'
    && status.leanConcreteLockedNANDCanonicalEncodingFormalized === true
    && status.leanConcreteLockedNANDCompleteCandidateCodecFormalized === true
    && status.leanConcreteLockedNANDNormalizationSemanticsFormalized === true
    && status.leanConcreteLockedNANDParserMachineFormalized === true
    && status.leanConcreteLockedNANDParserAxiomAuditPassed === true
    && status.leanConcreteLockedNANDParserAuditedDeclarationCount === 380
    && status.leanConcreteLockedNANDParserAllInputExactFormalized === true
    && status.leanConcreteLockedNANDParserExactOutputFormalized === true
    && status.leanConcreteLockedNANDParserCompiledNonTimeoutFormalized === true
    && status.leanConcreteLockedNANDParserPolynomialTimeMachineFormalized === true
    && status.leanConcreteLockedNANDParserPolynomialTimeFunctionFormalized === true
    && status.leanConcreteLockedNANDParserRawRefinementFormalized === true
    && status.leanConcreteLockedNANDParserScope === 'literal-228-state-2052-rule-strict-version-zero-all-input-parser-byte-preserving-or-empty-with-compiled-cubic-bound'
    && status.leanConcreteLockedNANDEmitterMachineFormalized === true
    && status.leanConcreteLockedNANDEmitterAxiomAuditPassed === true
    && status.leanConcreteLockedNANDEmitterAuditedDeclarationCount === 3295
    && status.leanConcreteLockedNANDEmitterAllInputExactFormalized === true
    && status.leanConcreteLockedNANDEmitterExactTargetBytesFormalized === true
    && status.leanConcreteLockedNANDEmitterCompiledNonTimeoutFormalized === true
    && status.leanConcreteLockedNANDEmitterPolynomialTimeMachineFormalized === true
    && status.leanConcreteLockedNANDEmitterPolynomialTimeFunctionFormalized === true
    && status.leanConcreteLockedNANDEmitterRawRefinementFormalized === true
    && status.leanConcreteLockedNANDEmitterStrictParserCompositionFormalized === true
    && status.leanConcreteLockedNANDEmitterOutputSizeBoundFormalized === true
    && status.leanConcreteLockedNANDEmitterScope === 'literal-1387921-rule-grammar-only-all-input-target-emitter-with-strict-parser-composition-polynomial-bounds-and-recursive-raw-refinement'
    && status.leanConcreteLockedNANDPolynomialReductionFormalized === true
    && status.leanConcreteLockedNANDPolynomialReductionAxiomAuditPassed === true
    && status.leanConcreteLockedNANDPolynomialReductionAuditedDeclarationCount === 16
    && status.leanConcreteLockedNANDPolynomialReductionExactFunctionFormalized === true
    && status.leanConcreteLockedNANDPolynomialReductionExactOutputFormalized === true
    && status.leanConcreteLockedNANDPolynomialReductionLanguageEquivalenceFormalized === true
    && status.leanConcreteLockedNANDPolynomialReductionWitnessFormalized === true
    && status.leanConcreteLockedNANDPolynomialReductionRawRefinementFormalized === true
    && status.leanConcreteLockedNANDPolynomialReductionScope === 'strict-version-zero-parser-emitter-polynomial-reduction-with-exact-language-equivalence-and-recursive-raw-refinement'
    && status.leanConcreteCNFToNANDSemanticCompilerFormalized === true
    && status.leanConcreteCNFToNANDSemanticCompilerAxiomAuditPassed === true
    && status.leanConcreteCNFToNANDSemanticCompilerAuditedDeclarationCount === 68
    && status.leanConcreteCNFToNANDExactCodecCanonicalityFormalized === true
    && status.leanConcreteCNFToNANDTypedTopologicalCompilationFormalized === true
    && status.leanConcreteCNFToNANDWellFormedOutputFormalized === true
    && status.leanConcreteCNFToNANDExactSemanticsFormalized === true
    && status.leanConcreteCNFToNANDEdgeSemanticsFormalized === true
    && status.leanConcreteCNFToNANDExactGateCountFormalized === true
    && status.leanConcreteCNFToNANDPolynomialOutputSizeBoundFormalized === true
    && status.leanConcreteCNFToNANDAllBitstringFailClosedFormalized === true
    && status.leanConcreteCNFToNANDLockedThresholdCompositionFormalized === true
    && status.leanConcreteCNFToNANDFiniteMachineFormalized === true
    && status.leanConcreteCNFToNANDPolynomialTimeFunctionFormalized === true
    && status.leanConcreteCNFToNANDPolynomialReductionFormalized === true
    && status.leanConcreteCNFToNANDPolynomialReductionAxiomAuditPassed === true
    && status.leanConcreteCNFToNANDPolynomialReductionAuditedDeclarationCount === 1316
    && status.leanConcreteCNFToNANDAllInputExactFormalized === true
    && status.leanConcreteCNFToNANDExactMachineOutputFormalized === true
    && status.leanConcreteCNFToNANDCompiledNonTimeoutFormalized === true
    && status.leanConcreteCNFToNANDRawRefinementFormalized === true
    && status.leanConcreteCNFToNANDDirectReductionFormalized === true
    && status.leanConcreteCNFToNANDLockedReductionCompositionFormalized === true
    && status.leanConcreteCNFToNANDPolynomialReductionScope === "fixed-135070-rule-three-node-all-bitstring-cnf-to-nand-compiler-with-exact-output-polynomial-time-function-direct-reduction-locked-threshold-composition-and-recursive-raw-refinement"
    && status.leanConcreteCNFToNANDSemanticCompilerScope === 'strict-canonical-cnf-to-intrinsically-topological-nand-semantic-compiler-with-exact-gate-count-quadratic-output-bound-and-all-bitstring-fail-closed-equivalence'
    && status.leanResidualGainChainVerifierFormalized === true
    && status.leanResidualGainChainAxiomAuditPassed === true
    && status.leanResidualGainChainSemanticInvariantFormalized === true
    && status.leanResidualGainChainSlackIterationBoundFormalized === true
    && status.leanLockedNANDGainIterationsAtMostFourFormalized === true
    && status.leanResidualGainChainScope === 'all-finite-proof-bearing-or-executably-verified-strict-equivalent-gain-chains-with-locked-family-four-step-specialization'
    && status.leanResidualGainChainPolynomialRuntimeFormalized === false
    && status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepAuditedDeclarationCount === 82
    && status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepThirdPaddingOrUnaryOpportunityFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintThirdPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAxiomAuditPassed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepAuditedDeclarationCount === 82
    && status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepCompiledRawMachineFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExternalInputSizePolynomialFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepExactFormulaBitsFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepSecondPaddingOrUnaryOpportunityFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepRetainedAdvancedTokenCoordinateFormalized === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepInputPrefixOptionalAppenderComposed === true
    && status.leanConcreteCookLevinBuilderSecondConstraintSecondPaddingOrUnaryOpportunityStepFailClosedBoundaryTimeoutFormalized === true
    && status.leanConcreteCookLevinBuilderDynamicCursorFormalized === false
    && status.leanConcreteCookLevinFormulaBuilderFormalized === false
    && status.leanConcreteCookLevinBuilderRawRefinementFormalized === false
    && status.leanConcreteCookLevinBuilderPolynomialReductionFormalized === false
    && status.leanConcreteCNFSATInPFormalized === false
    && status.leanConcreteCNFNPCompletenessFormalized === false
    && status.checkerAcceptanceIsMathematicalProof === false
    && status.externalReviewIsMathematicalPremise === false
    && sameJson(status.activeFinalNodeIds, [])
    && sameJson(status.remainingFormalObligations, REMAINING_BLOCKERS)
    && sameJson(status.remainingBlockers, REMAINING_BLOCKERS);
}

async function sha256Hex(bytes) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function isConservativeFormalStatus(status, inventory) {
  return validateInventory(inventory) && validateStatus(status, inventory);
}

function renderFormalStatus(root, payload, sourceState) {
  root.dataset.statusState = sourceState;
  const label = root.querySelector('[data-formal-status-label]');
  const fields = root.querySelector('[data-formal-status-fields]');
  const note = root.querySelector('[data-formal-status-note]');
  if (label) label.textContent = 'not established';
  if (fields) fields.textContent = formalStatusFields(payload);
  if (note) {
    note.innerHTML = sourceState === 'authoritative-mirror'
      ? '<strong>Inventory bound:</strong> the compiled Lean inventory matches its reviewed SHA-256, counts, milestone pins, source closure, and conservative gate. The target theorem remains unestablished and theorem emission remains disabled.'
      : '<strong>Live inventory unavailable:</strong> the page remains fail closed. Missing, malformed, stale, or digest-mismatched data never enables theorem emission.';
  }
}

function renderMilestones(milestones) {
  document.querySelectorAll('[data-formal-milestones]').forEach((root) => {
    root.replaceChildren(...milestones.map((milestone) => {
      const card = document.createElement('article');
      card.className = milestone.earned ? 'card' : 'card accent';
      card.dataset.milestoneId = milestone.id;
      card.dataset.earned = String(milestone.earned);
      const heading = document.createElement('h3');
      heading.textContent = `${milestone.earned ? 'Formalized' : 'Not formalized'}: ${milestone.title}`;
      const scope = document.createElement('p');
      scope.textContent = milestone.scope;
      const reviewedDeclaration = document.createElement('p');
      if (milestone.earned && milestone.requiredTheorems.length > 0) {
        const strong = document.createElement('strong');
        strong.textContent = `Reviewed theorem pins (${milestone.requiredTheorems.length}), last listed: `;
        const code = document.createElement('code');
        code.textContent = milestone.requiredTheorems.at(-1);
        reviewedDeclaration.append(strong, code);
      }
      const boundary = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = 'Boundary: ';
      boundary.append(strong, milestone.nonClaim);
      card.append(heading, scope);
      if (reviewedDeclaration.hasChildNodes()) card.append(reviewedDeclaration);
      card.append(boundary);
      return card;
    }));
  });
}

function renderInventoryCounts() {
  document.querySelectorAll('[data-formal-inventory-counts]').forEach((root) => {
    root.textContent = `${INVENTORY_COUNTS.declarations.toLocaleString('en-US')} public declarations; ${INVENTORY_COUNTS.theorems} theorem-kind declarations; ${INVENTORY_COUNTS.assumptionFreeTheorems} assumption-free theorem-kind declarations; ${INVENTORY_COUNTS.excludedPrivateDeclarations} private compiler auxiliaries excluded; ${INVENTORY_COUNTS.modules} modules; ${INVENTORY_COUNTS.axioms} project axioms.`;
  });
}

async function loadFormalPublication() {
  const roots = [...document.querySelectorAll('[data-formal-status-root]')];
  const hasInventoryTargets = document.querySelector('[data-formal-milestones], [data-formal-inventory-counts]');
  if (roots.length === 0 && !hasInventoryTargets) return;
  roots.forEach((root) => renderFormalStatus(root, FAIL_CLOSED_FORMAL_STATUS, 'fail-closed'));
  try {
    const [statusResponse, inventoryResponse] = await Promise.all([
      fetch('public/pnp-status.json', { cache: 'no-store' }),
      fetch('public/pnp-theorem-inventory.json', { cache: 'no-store' }),
    ]);
    if (!statusResponse.ok || !inventoryResponse.ok) throw new Error('current formal-publication payload fetch failed');
    const [statusBytes, inventoryBytes] = await Promise.all([
      statusResponse.arrayBuffer(),
      inventoryResponse.arrayBuffer(),
    ]);
    const [statusDigest, inventoryDigest] = await Promise.all([
      sha256Hex(statusBytes),
      sha256Hex(inventoryBytes),
    ]);
    if (statusDigest !== STATUS_SHA256) throw new Error('formal-reconstruction status digest mismatch');
    if (inventoryDigest !== INVENTORY_SHA256) throw new Error('compiled Lean inventory digest mismatch');
    const decoder = new TextDecoder();
    const status = JSON.parse(decoder.decode(statusBytes));
    const inventory = JSON.parse(decoder.decode(inventoryBytes));
    if (!isConservativeFormalStatus(status, inventory)) throw new Error('formal-publication payloads failed conservative validation');
    roots.forEach((root) => renderFormalStatus(root, status, 'authoritative-mirror'));
    renderMilestones(status.formalPublicationMilestones);
    renderInventoryCounts();
  } catch (error) {
    console.error('PNP formal-publication load failed closed', error);
  }
}

loadFormalPublication();

globalThis.PNPFormalPublication = Object.freeze({
  STATUS_COORDINATE,
  PUBLIC_SURFACE_COORDINATE,
  INVENTORY_COORDINATE,
  INVENTORY_SHA256,
  INVENTORY_COUNTS,
  PROJECT_AXIOMS,
  deriveGateSubchecks,
  validateConcreteGate,
  validateInventory,
  validateMilestones,
  validateStatus,
});

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.querySelector(button.getAttribute('data-copy'));
    if (!target) return;
    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      const old = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = old; }, 1400);
    } catch {
      button.textContent = 'Select text';
    }
  });
});

const progress = document.querySelector('.progress');
function updateProgress() {
  if (!progress) return;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  progress.style.width = `${Math.max(0, Math.min(100, pct))}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

import('./report-integrity.js').catch((error) => {
  console.error('Report integrity enhancement failed', error);
});

import('./public-source-links.js').catch((error) => {
  console.error('Public source link enhancement failed', error);
});

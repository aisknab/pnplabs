// Purpose: support static-site navigation, release digest checks, and public source links.
document.querySelectorAll('link[data-deferred-style]').forEach((link) => {
  link.media = 'all';
  link.removeAttribute('data-deferred-style');
});

const menuButton = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');

const STATUS_COORDINATE = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-24-81';
const STATUS_SHA256 = '8c7c4a57293d04036e481b181c11f2f374d6c25089f3cabf4d154c69cb711caf';
const PUBLIC_SURFACE_COORDINATE = 'PUBLIC-SURFACE-BASELINE-2026-07-24-COOK-LEVIN-BUILDER-SECOND-CONSTRAINT-FIFTH-PADDING-OR-TERMINATOR-OPPORTUNITY-STEP-80';
const INVENTORY_COORDINATE = 'PNP-LEAN-THEOREM-INVENTORY-2026-07-24-81';
const INVENTORY_SHA256 = '9bbe6b0ff34e766961f8687d77372eaad8834eee5e9ad4ea5b76ac65625e9e32';
const SOURCE_CLOSURE_SHA256 = '70f4892088b59aafd74c6d28b03aea966106d3335c7dfcfe31d7b465b05fb302';

const INVENTORY_COUNTS = Object.freeze({
  declarations: 11565,
  theorems: 6685,
  assumptionFreeTheorems: 3528,
  excludedPrivateDeclarations: 4432,
  modules: 101,
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

const REMAINING_BLOCKERS = Object.freeze([
  'Formal.ConcreteSAT',
  'Formal.LockedNANDThreshold',
  'Formal.ResidualBandMinimizer',
  'Formal.ZeroSlack',
  'Formal.PolynomialRuntimeAndCertificateBounds',
  'Formal.RootTheoremAndAxiomAudit',
]);

const MILESTONE_IDS = Object.freeze([
  'concrete-machine-cost-kernel',
  'concrete-complexity-classes',
  'concrete-cnf-universal-verifier',
  'concrete-cook-levin-layout',
  'concrete-cook-levin-fixed-tableau',
  'concrete-cook-levin-verifier-tableau',
  'concrete-cook-levin-local-cnf',
  'concrete-cook-levin-tableau-cnf',
  'concrete-cook-levin-tableau-cnf-semantics',
  'concrete-cook-levin-raw-tape-bridge',
  'concrete-cook-levin-formula-size',
  'concrete-cook-levin-formula-schedule',
  'concrete-cook-levin-formula-cursor',
  'concrete-cook-levin-builder-input-length',
  'concrete-cook-levin-builder-input-prefix',
  'concrete-cook-levin-builder-token-appender',
  'concrete-cook-levin-builder-first-token-prefix',
  'concrete-cook-levin-builder-complete-header',
  'concrete-cook-levin-builder-body-start-prefix',
  'concrete-cook-levin-builder-first-literal-prefix',
  'concrete-cook-levin-builder-first-clause-prefix',
  'concrete-cook-levin-builder-dynamic-token-cursor-step',
  'concrete-cook-levin-builder-first-clause-padding-run',
  'concrete-cook-levin-builder-second-clause-separator-step',
  'concrete-cook-levin-builder-second-clause-first-literal-prefix',
  'concrete-cook-levin-builder-second-clause-second-literal-prefix',
  'concrete-cook-levin-builder-second-clause-prefix',
  'concrete-cook-levin-builder-second-clause-padding-run',
  'concrete-cook-levin-builder-third-clause-separator-step',
  'concrete-cook-levin-builder-third-clause-first-literal-prefix',
  'concrete-cook-levin-builder-third-clause-second-literal-prefix',
  'concrete-cook-levin-builder-third-clause-prefix',
  'concrete-cook-levin-builder-third-clause-padding-run',
  'concrete-cook-levin-builder-fourth-clause-separator-step',
  'concrete-cook-levin-builder-fourth-clause-first-literal-prefix',
  'concrete-cook-levin-builder-fourth-clause-second-literal-prefix',
  'concrete-cook-levin-builder-fourth-clause-prefix',
  'concrete-cook-levin-builder-fourth-clause-padding-run',
  'concrete-cook-levin-builder-fifth-clause-padding-run',
  'concrete-cook-levin-builder-first-constraint-padding-run',
  'concrete-cook-levin-builder-second-constraint-separator-step',
  'concrete-cook-levin-builder-second-constraint-first-literal-sign-step',
  'concrete-cook-levin-builder-second-constraint-first-literal-first-unary-unit-step',
  'concrete-cook-levin-builder-second-constraint-first-literal-second-unary-unit-step',
  'concrete-cook-levin-builder-second-constraint-first-literal-third-unary-unit-step',
  'concrete-cook-levin-builder-second-constraint-first-literal-terminator-step',
  'concrete-cook-levin-builder-second-constraint-first-literal-successor-token-step',
  'concrete-cook-levin-builder-second-constraint-padding-or-unary-opportunity-step',
  'concrete-cook-levin-builder-second-constraint-second-padding-or-unary-opportunity-step',
  'concrete-cook-levin-builder-second-constraint-third-padding-or-unary-opportunity-step',
  'concrete-cook-levin-builder-second-constraint-fourth-padding-or-unary-opportunity-step',
  'concrete-cook-levin-builder-second-constraint-fifth-padding-or-terminator-opportunity-step',
  'direct-wire-semantics',
  'finite-enumeration-minimum',
  'framed-replacement-slack',
  'locked-nand-local-baseline',
  'locked-nand-conditional-threshold',
  'explicit-residual-routes',
  'global-locked-nand-threshold',
  'global-zeroslack-pccmin',
  'concrete-publication-root',
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
  if (!sameJson(kindCounts, {
    axiom: 4,
    constructor: 303,
    definition: 4303,
    inductive: 135,
    opaque: 0,
    quotient: 0,
    recursor: 135,
    theorem: 6685,
  })) return false;

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
    && inventory.milestoneCandidates.length === 1874
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

function validateMilestones(status) {
  const milestones = status?.formalPublicationMilestones;
  if (!Array.isArray(milestones)
    || !sameJson(milestones.map((row) => row.id), MILESTONE_IDS)) return false;

  return milestones.every((row, index) => {
    const shouldBeEarned = index < 58;
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
    && status.concretePublicationGate?.actualSourceClosureSha256 === SOURCE_CLOSURE_SHA256
    && status.abstractPEqualsNPPublicationEligible === false
    && status.publicationStatusDerivedOnlyFromConcreteGate === true
    && validateConcreteGate(status, inventory)
    && validateMilestones(status)
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
      const boundary = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = 'Boundary: ';
      boundary.append(strong, milestone.nonClaim);
      card.append(heading, scope, boundary);
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
  MILESTONE_IDS,
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

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return 'unknown size';
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

document.querySelectorAll('[data-seal-console]').forEach((consoleRoot) => {
  const runButton = consoleRoot.querySelector('[data-seal-run]');
  const resetButton = consoleRoot.querySelector('[data-seal-reset]');
  const status = consoleRoot.querySelector('[data-seal-status]');
  const output = consoleRoot.querySelector('[data-seal-output]');
  const computed = consoleRoot.querySelector('[data-seal-computed]');
  const result = consoleRoot.querySelector('[data-seal-result]');
  const artifact = consoleRoot.getAttribute('data-artifact');
  const artifactLabel = consoleRoot.getAttribute('data-label') || artifact;
  const expected = (consoleRoot.getAttribute('data-expected') || '').toLowerCase();

  const setState = (state, text) => {
    consoleRoot.dataset.state = state;
    if (status) status.textContent = text;
  };

  const addLine = (kind, text) => {
    if (!output) return;
    const item = document.createElement('li');
    if (kind) item.classList.add(kind);
    const label = document.createElement('span');
    label.textContent = kind || 'info';
    const code = document.createElement('code');
    code.textContent = text;
    item.append(label, code);
    output.append(item);
  };

  const resetConsole = () => {
    setState('idle', 'idle');
    if (computed) computed.textContent = 'not run';
    if (result) result.textContent = 'Awaiting browser check.';
    if (output) {
      output.replaceChildren();
      addLine('target', artifactLabel);
      addLine('expect', expected);
      addLine('ready', 'press Run check to fetch the file, hash locally, and compare');
    }
  };

  const runSealCheck = async () => {
    if (!artifact || !expected) return;
    if (!globalThis.crypto?.subtle) {
      setState('failed', 'unsupported');
      if (result) result.textContent = 'Web Crypto is unavailable in this browser context.';
      addLine('fail', 'crypto.subtle is unavailable; use HTTPS, localhost, or the command-line workflow');
      return;
    }

    setState('running', 'running');
    if (runButton) runButton.disabled = true;
    if (computed) computed.textContent = 'computing...';
    if (result) result.textContent = 'Checking bundled report file...';
    if (output) output.replaceChildren();

    try {
      addLine('pending', `GET ${artifact}`);
      const response = await fetch(artifact, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status} while fetching ${artifactLabel}`);
      const buffer = await response.arrayBuffer();
      addLine('ok', `received ${artifactLabel} · ${formatBytes(buffer.byteLength)}`);
      addLine('pending', 'compute SHA-256 with browser Web Crypto');
      const digest = await globalThis.crypto.subtle.digest('SHA-256', buffer);
      const actual = toHex(digest);
      if (computed) computed.textContent = actual;
      if (actual === expected) {
        addLine('ok', 'computed digest matches the published release digest');
        setState('verified', 'matched');
        if (result) result.textContent = 'Digest match: bundled canonical report matches the published SHA-256. This confirms file identity only.';
      } else {
        addLine('fail', 'computed digest does not match the published release seal');
        setState('failed', 'mismatch');
        if (result) result.textContent = 'Digest mismatch: do not rely on this bundled artefact without further investigation.';
      }
    } catch (error) {
      addLine('fail', error instanceof Error ? error.message : 'release seal check failed');
      setState('failed', 'failed');
      if (computed) computed.textContent = 'not available';
      if (result) result.textContent = 'The browser check could not complete. Use the command-line verification workflow or retry from a served page.';
    } finally {
      if (runButton) runButton.disabled = false;
    }
  };

  resetButton?.addEventListener('click', resetConsole);
  runButton?.addEventListener('click', runSealCheck);
  resetConsole();
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

import('./public-source-links.js').catch((error) => {
  console.error('Public source link enhancement failed', error);
});

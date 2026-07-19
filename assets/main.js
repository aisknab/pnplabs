// Purpose: support static-site navigation, release digest checks, and public source links.
document.querySelectorAll('link[data-deferred-style]').forEach((link) => {
  link.media = 'all';
  link.removeAttribute('data-deferred-style');
});

const menuButton = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');

function ensureStatusLink() {
  if (!nav || nav.querySelector('a[href="status.html"]')) return;
  const statusLink = document.createElement('a');
  statusLink.href = 'status.html';
  statusLink.textContent = 'Status';
  if (location.pathname.endsWith('/status.html')) {
    statusLink.classList.add('active');
    statusLink.setAttribute('aria-current', 'page');
  }
  const homeLink = nav.querySelector('a[href="index.html"]');
  if (homeLink?.nextSibling) nav.insertBefore(statusLink, homeLink.nextSibling);
  else nav.prepend(statusLink);
}

const STATUS_COORDINATE = 'PNP-FORMAL-RECONSTRUCTION-STATUS-2026-07-19-58';
const STATUS_SHA256 = '146bbf914afe66256f6573dcc59a8cdfe825420f7cb021829f55708ab64a48ad';
const PUBLIC_SURFACE_COORDINATE = 'PUBLIC-SURFACE-BASELINE-2026-07-19-COOK-LEVIN-BUILDER-THIRD-CLAUSE-SEPARATOR-STEP-57';
const INVENTORY_COORDINATE = 'PNP-LEAN-THEOREM-INVENTORY-2026-07-19-58';
const INVENTORY_SHA256 = '9db4fc68c45e470777c5607c0ea1440e86c59b1222d7e2d62f2898b3d424c8e7';
const SOURCE_CLOSURE_SHA256 = 'c34dec0242ed84b5f915166a55ee1183dd0450cee9445b8dd0a8721c765facaf';

const INVENTORY_COUNTS = Object.freeze({
  declarations: 8680,
  theorems: 4425,
  assumptionFreeTheorems: 3043,
  excludedPrivateDeclarations: 2892,
  modules: 78,
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
    definition: 3678,
    inductive: 135,
    opaque: 0,
    quotient: 0,
    recursor: 135,
    theorem: 4425,
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
    && inventory.milestoneCandidates.length === 912
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
    const shouldBeEarned = index < 35;
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

function ensureHomepageFormalReconstructionBoundary() {
  const hero = document.querySelector('.artifact-hero .artifact-copy');
  if (!hero) return;

  const title = hero.querySelector('#hero-title');
  if (title) title.textContent = 'The repository does not currently establish P = NP.';

  const lede = hero.querySelector('.lede');
  if (lede) {
    lede.textContent = 'The compiled Lean environment contains 8,680 exported public declarations, including 4,425 theorem-kind declarations and 3,043 assumption-free theorem-kind declarations across 78 modules. Thirty-five scoped publication milestones are earned, now including the fixed Cook-Levin separator transition beginning clause three; three global milestones remain unformalized.';
  }

  const trace = hero.querySelector('.checker-trace');
  if (trace) {
    trace.innerHTML = '<span>Cook-Levin semantics checked</span><span>formula schedule checked</span><strong>gate closed</strong>';
  }

  const firstNote = hero.querySelector('.review-note');
  if (firstNote) {
    firstNote.innerHTML = '<strong>Current status:</strong> <code>BuilderThirdClauseSeparatorStep.workRunExact</code> composes the complete clause-two padding run with a selected <code>Sep</code> appender and one cursor advance. Every raw input emits the fixed separator beginning clause three; the bits equal <code>encodedFormula.take (2 * (FormulaWidth + 20))</code>, and the retained coordinate advances to the following directly proved <code>F</code> slot. It does not emit that <code>F</code>, implement a general dynamic formula cursor, or emit the remaining body. The complete builder, packaged reduction, CNF-SAT NP-completeness, CNF-SAT in P, and P = NP remain absent. Four project axioms and six blockers remain.';
  }

  hero.querySelectorAll('[data-homepage-matrix-summary], [data-homepage-one-command-upload]').forEach((element) => element.remove());
  const actions = hero.querySelector('.hero-actions');
  if (actions) {
    actions.querySelectorAll('a[href="public/pnp-one-command-upload.json"], a[href="public/pnp-verifier-run-matrix-summary.json"], a[href="verifier-run-digests.html"]').forEach((link) => link.remove());
    if (!actions.querySelector('a[href="status.html"]')) {
      const statusButton = document.createElement('a');
      statusButton.className = 'btn primary';
      statusButton.href = 'status.html';
      statusButton.textContent = 'View current status';
      actions.prepend(statusButton);
    }
  }
}

function currentPageName() {
  const last = location.pathname.split('/').filter(Boolean).pop();
  return last || 'index.html';
}

function rewritePageHero({ eyebrow, title, lede, primaryHref, primaryText, secondaryHref, secondaryText }) {
  const hero = document.querySelector('.page-hero');
  if (!hero) return;
  const eyebrowEl = hero.querySelector('.eyebrow');
  if (eyebrowEl && eyebrow) eyebrowEl.textContent = eyebrow;
  const h1 = hero.querySelector('h1');
  if (h1) h1.textContent = title;
  const ledeEl = hero.querySelector('.lede');
  if (ledeEl) ledeEl.textContent = lede;
  const actions = hero.querySelector('.hero-actions');
  if (actions) {
    actions.innerHTML = '';
    const primary = document.createElement('a');
    primary.className = 'btn primary';
    primary.href = primaryHref;
    primary.textContent = primaryText;
    actions.append(primary);
    if (secondaryHref && secondaryText) {
      const secondary = document.createElement('a');
      secondary.className = 'btn secondary';
      secondary.href = secondaryHref;
      secondary.textContent = secondaryText;
      actions.append(secondary);
    }
  }
}

function insertAfterPageHero(id, html) {
  if (document.getElementById(id)) return;
  const hero = document.querySelector('.page-hero');
  if (!hero) return;
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  const node = template.content.firstElementChild;
  hero.insertAdjacentElement('afterend', node);
}

function ensureFormalVerificationCopy() {
  rewritePageHero({
    eyebrow: 'Formal reconstruction verification',
    title: 'Verify the compiled inventory and current thirty-three-page report.',
    lede: 'The target theorem is not established. The current report is generated from the reviewed compiled inventory; digest checks establish file identity, not mathematical truth.',
    primaryHref: 'public/pnp-status.json',
    primaryText: 'Open current status JSON',
    secondaryHref: 'status.html',
    secondaryText: 'View status explanation',
  });
  insertAfterPageHero('formal-verification-copy', `<section class="section compact" id="formal-verification-copy">
      <div class="boundary-panel">
        <div class="boundary-head"><span>Current verification boundary</span><strong>not established</strong></div>
        <pre>mathematicalTheoremEstablished = false
publicTheoremEmissionAllowed = false
finalTheoremReady = false
rootLeanTheoremPresent = false
projectSpecificAxiomsRemaining = true</pre>
      </div>
      <div class="grid two path" style="margin-top:1.2rem">
        <article class="card"><h3>Check status and inventory together</h3><p>The browser fetches both payloads concurrently, hashes the raw inventory bytes, validates exact counts and coordinates, and rejects inconsistent gate or milestone rows.</p></article>
        <article class="card"><h3>Build and inventory Lean</h3><p>Run <code>lake build PNP</code>, <code>npm run formal:inventory:check</code>, and <code>npm run formal:publication:check</code> in the source repository.</p></article>
        <article class="card"><h3>Check current report identity</h3><p>The thirty-three-page PDF and TeX are generated from the inventory-derived publication model. Their hashes identify bytes; they do not independently prove theorem correctness.</p></article>
        <article class="card"><h3>Historical run intake</h3><p>The former activated verifier-run registry and automated submission workflow are frozen.</p></article>
      </div>
    </section>`);
}

function ensureFormalFAQCopy() {
  rewritePageHero({
    eyebrow: 'Formal reconstruction FAQ',
    title: 'Current theorem-status FAQ.',
    lede: 'The repository proves concrete CNF-SAT membership in NP, raw-machine compilation, exact Cook-Levin semantic equivalence and size/schedule results, both complete fixed clauses, clause-two padding traversal, and the fixed separator transition beginning clause three. This is not a general dynamic formula cursor: the machine does not emit the following F or remaining body, complete a raw formula builder, package a polynomial reduction, or establish CNF-SAT NP-completeness, CNF-SAT in P, or P = NP. These answers distinguish the current thirty-three-page status report from the historical 56-page claim manuscript.',
    primaryHref: 'status.html',
    primaryText: 'View current status',
    secondaryHref: 'public/pnp-status.json',
    secondaryText: 'Open status JSON',
  });
  insertAfterPageHero('formal-faq-copy', `<section class="section compact" id="formal-faq-copy">
      <div class="section-label">Current theorem-status FAQ</div>
      <div class="grid two path">
        <article class="card"><h3>Does the repository establish P = NP?</h3><p>No. <code>mathematicalTheoremEstablished = false</code> and <code>publicTheoremEmissionAllowed = false</code>.</p></article>
        <article class="card"><h3>What is formalized?</h3><p>Thirty-five scoped publication milestones are earned from pinned theorem rows whose axiom closures contain no project axiom. They include <code>CNFSAT ∈ NP</code>, raw-machine compilation, exact Cook-Levin CNF-to-verifier-language semantics, the size/schedule bounds, both complete fixed clauses, clause-two padding traversal, and emission of the fixed clause-three <code>Sep</code>. Emission of the following <code>F</code>, a general dynamic formula cursor, the remaining formula body, complete raw builder, packaged polynomial reduction, NP-completeness, deterministic P result, and concrete publication root remain unearned.</p></article>
        <article class="card"><h3>What does legacy checker acceptance mean?</h3><p>It is historical evidence that assertion-bearing records passed implemented predicates. It is not a proof of the asserted propositions.</p></article>
        <article class="card"><h3>Is external review a theorem premise?</h3><p>No. External review is optional audit evidence and is not a mathematical premise or release blocker.</p></article>
      </div>
    </section>`);
}

function ensureFormalReviewCopy() {
  rewritePageHero({
    eyebrow: 'Audit and formal reconstruction',
    title: 'Review an unfinished formal reconstruction.',
    lede: 'Reviewers can identify counterexamples, missing definitions, hidden assumptions, invalid reductions, or Lean gaps. Review is valuable audit evidence but not a mathematical premise.',
    primaryHref: 'status.html',
    primaryText: 'View current blockers',
    secondaryHref: 'public/pnp-status.json',
    secondaryText: 'Open status JSON',
  });
  insertAfterPageHero('formal-review-copy', `<section class="section compact" id="formal-review-copy">
      <div class="section-label">Current review role</div>
      <div class="callout"><div><h2>Challenge the compiled boundary.</h2><p>Review the 8,680-declaration inventory, 912 pinned theorem candidates, whole-source closure, thirty-five earned scoped publication milestones, three unearned global milestones, and concrete publication gate. The verifier-fixed Cook-Levin machine emits the fixed clause-three <code>Sep</code>, advances to the following directly proved <code>F</code> coordinate, and stays within an explicit external <code>NatPolynomial</code> raw bound; that <code>F</code>, the general dynamic formula cursor, remaining body emitter, complete raw builder, and packaged reduction remain absent. Four project axioms and six blockers remain.</p></div><a class="btn primary" href="status.html">Inspect blockers</a></div>
    </section>`);
}

function ensureFormalPageCopy() {
  const page = currentPageName();
  if (page === 'verify.html') ensureFormalVerificationCopy();
  if (page === 'faq.html') ensureFormalFAQCopy();
  if (page === 'review.html') ensureFormalReviewCopy();
}

ensureStatusLink();
ensureHomepageFormalReconstructionBoundary();
ensureFormalPageCopy();
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

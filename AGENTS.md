# Agent Instructions

This file is the single source of truth for AI coding assistants and automated
code reviewers (GitHub Copilot, CodeRabbit, Claude Code, Cursor, etc.) working
in this repository.

Read the section that matches what you are doing right now. **While writing
code** applies whenever you are planning or producing a change — that is the
default. **While reviewing code** applies when you are evaluating a diff. The
rules in between apply to both.

## Repository Context

This is an Nx monorepo of Angular libraries and build tooling published under
the `@skyux/*` and `@skyux-sdk/*` scopes.

- [libs/components/](libs/components/) — the published Angular UI libraries
  (`@skyux/*`). Each is an `ng-packagr` project with `src/` (the library) and
  often `testing/` (the `@skyux/<pkg>/testing` entry point). The public API is
  the `src/index.ts` and `testing/src/public-api.ts` barrels.
- [libs/sdk/](libs/sdk/) — build/dev tooling, schematics, ESLint/Stylelint
  configs, and `@skyux-sdk/testing` (`@skyux-sdk/*`).
- [apps/](apps/) — non-published apps: `playground` (manual testing),
  `code-examples` (the `code-examples-playground` project, which renders the
  docs examples published from `libs/components/code-examples`),
  `integration` + `integration-e2e`, and `e2e`.

Common Nx tasks (prefer `:affected` variants during development):

| Task   | All projects                 | Affected only            | Single project                                                 |
| ------ | ---------------------------- | ------------------------ | -------------------------------------------------------------- |
| Test   | `npm test`                   | `npm run test:affected`  | `npx nx test <project>`                                        |
| Lint   | `npm run lint`               | `npm run lint:affected`  | `npx nx lint <project>`                                        |
| Build  | `npm run build`              | `npm run build:affected` | `npx nx build <project>` then `npx nx run <project>:postbuild` |
| Format | `npm run format` (write all) | —                        | `nx format --files=<paths>`                                    |

- `<project>` is the directory name, not the package name (e.g. `core`,
  `forms`, `ag-grid`, `tools`).
- Watch a project's tests: `npx nx test <project> --watch`.
- Run a single Karma project headless: `npx nx test <project> --browsers=ChromeHeadless`
  (the all-projects `npm test` uses `ChromeHeadlessNoSandbox`).
- Serve for manual testing: `npx nx serve playground`.

## Task-Specific Instructions

The [.github/instructions/](.github/instructions/) directory holds instruction
files scoped to particular file types and tasks. GitHub Copilot loads these
automatically via each file's `applyTo` glob. **Every other agent must open the
matching file and read it before editing a file its glob covers — this is a
precondition of the task, not optional background.** If you are about to write
a spec, a harness, a code example, or a story and you have not read the
corresponding file below, stop and read it first.

- [angular.instructions.md](.github/instructions/angular.instructions.md)
  (`applyTo: **/libs/components/**/*.{ts,html}, **/apps/**/*.{ts,html}`) —
  Angular best practices for maintainable, performant, and accessible code.
- [component-unit-testing.instructions.md](.github/instructions/component-unit-testing.instructions.md)
  (`**/libs/components/*/src/lib/**/*.spec.ts, !**/libs/components/code-examples/**`)
  — writing unit tests for library components and directives.
- [component-code-examples.instructions.md](.github/instructions/component-code-examples.instructions.md)
  (`libs/components/code-examples/**`, `libs/components/*/documentation.json`)
  — authoring code example components and their unit tests.
- [component-harnesses.instructions.md](.github/instructions/component-harnesses.instructions.md)
  (`libs/components/**/testing/src/modules/**`) — generating component test
  harnesses.
- [visual-testing.instructions.md](.github/instructions/visual-testing.instructions.md)
  (`apps/e2e/*-storybook/src/app/**/*.stories.ts`) — authoring Storybook
  visual-test stories for Percy snapshots.

Multi-step workflows (adding a component, a library, a harness, a code example,
unit tests, or visual tests) are documented as skills in
[.github/skills/](.github/skills/), surfaced to Claude Code via `.claude/skills/`.
Prefer an existing skill over improvising the steps.

## Persona

You are a pragmatic senior engineer who values simplicity above all else. The
best code is the code that doesn't need to exist. Every line you add must earn
its keep, and you are the one who has to justify it.

## While writing code

### Before you write anything

State, in one or two sentences, the simplest thing that could work and what you
are deliberately not building. If your plan adds a new public export, a new
dependency, a new component/directive/service, or a new abstraction, name it and
say why the simpler version is insufficient. If you cannot justify it in one
sentence, don't build it.

Prefer the smallest change that satisfies the request. Do not expand the scope
of the task on your own initiative.

### Defaults

These are defaults, not absolutes — but departing from one requires a reason you
can state in a sentence.

- **Write it inline first.** Extract a function, mixin, or base class only when
  it has three or more call sites, or when the extraction removes more lines
  than it adds.
- **No speculative surface.** No `@Input()`, `@Output()`, parameter, option, or
  branch without a consumer in this same change that exercises it. Delete
  anything added "in case we need it later."
- **No new component, directive, pipe, service, or module the task did not ask
  for.** Add to the nearest existing one instead.
- **Prefer a plain function to an injectable.** Angular components, directives,
  pipes, and services are classes by framework requirement; this rule is about
  everything else. A helper class whose methods are pure functions over its
  constructor arguments should be plain exported functions.
- **No options object for fewer than three parameters.** Use positional
  parameters until the call site stops being obvious.
- **No type alias or interface for a shape used once.** Inline it.
- **Early returns over nested conditionals.** At three levels of nesting,
  restructure.
- **Comments explain _why_, never _what_.** If a comment is needed to say what
  the code does, rename things until it isn't.
- **Names carry weight.** No vague nouns — `data`, `info`, `manager`, `helper`,
  `util`, `handler` — unless further qualified. The name must match the
  behavior and must not leak implementation details.

### Mirror the nearest sibling

This monorepo is highly repetitive by design. Before writing a component,
harness, spec, code example, or story, open the equivalent file in a sibling
library that already does the same job and mirror its structure, naming, and
file layout. Do not invent a new pattern when an established one exists, and do
not import patterns from outside this repository.

### Changing existing code

Modifying existing code requires a higher standard of justification than adding
new code. Working code has been reviewed, tested, and shipped to consumers;
changing it risks regressions and churn. Do not refactor, rename, reformat, or
clean up code the task did not require you to touch. If a change to existing
code is warranted, state why, and keep the scope minimal.

### Before you declare the task complete

Re-read your own diff against the "While reviewing code" rules below and fix
what you find **before** handing it over:

- Delete anything added "just in case."
- Inline any abstraction that ended up with a single call site.
- Confirm the diff touches no file the task did not require.
- Confirm every new barrel export is actually consumed.
- Run `npm run test:affected` and `npm run lint:affected` and confirm both pass
  with coverage thresholds met.
- Run `nx format --files=<changed-paths>`.

## Public API Discipline (blocking)

- **What counts as the public API.** The public API consists ONLY of symbols
  exported from a library's `{projectRoot}/src/index.ts` or
  `{projectRoot}/testing/src/public-api.ts` barrel. Anything not exported from
  those barrels is internal, even if it uses the `export` keyword — internal
  exports exist to share code between files within a library. Do NOT require or
  flag `sky` prefixes, signature stability, or other public API concerns for
  internal exports.
- The public API is sacred within a major version. Never introduce — and always
  flag — a breaking change in a non-major release: removed or renamed exports,
  changed function signatures, narrowed parameter types, widened return types,
  removed overloads, changed default behavior, or stricter runtime validation.
  If a breaking change is truly necessary, defer it to the next major or gate it
  behind a new, additive API.
- Additions to the public API must be:
  - **Easy to use** — minimal required arguments, sensible defaults, hard to
    misuse, and obvious from the call site what they do.
  - **Self-documenting** — names and types convey intent without needing prose
    docs to understand basic usage. Prefer descriptive option objects over long
    positional parameter lists.
  - **Prefixed with `sky`** (e.g., `skyDoThing`, `SkyThingOptions`,
    `SkyThingResult`) for functions, classes, types, and interfaces exported
    from those barrel files. This matches the existing convention across all
    `@skyux/*` and `@skyux-sdk/*` packages. Flag any new barrel export missing
    the prefix; do not apply this rule to internal exports.

## Dependency Discipline (blocking)

- New npm packages are a last resort. Before adding one, justify why Angular,
  RxJS, Node.js built-ins (`node:fs`, `node:path`, `node:crypto`,
  `node:child_process`, `fetch`, `URL`, etc.), or existing project utilities
  cannot do the job simply.
- If a new dependency is genuinely warranted, it must be:
  - **Lightweight** — small install footprint, few or zero transitive deps.
  - **Solving something the platform cannot reasonably handle itself.**
  - **Actively maintained, widely used, and well-typed.**
- Never add — and always flag — heavy frameworks, sprawling utility
  kitchen-sinks (e.g., lodash for a single function), or packages whose
  functionality is a few lines of plain code.
- A new runtime dependency in a published `@skyux/*` or `@skyux-sdk/*` package
  becomes a transitive dependency for every consumer. Treat it as a public API
  decision, not an implementation detail.

## TypeScript & ESLint

Lint configuration lives in [eslint.config.js](eslint.config.js), which
composes [eslint-base.config.js](eslint-base.config.js),
[eslint-overrides.config.js](eslint-overrides.config.js), and
[eslint-overrides-angular.config.js](eslint-overrides-angular.config.js).
Per-project overrides live alongside each project (e.g.
`libs/<project>/eslint.config.js`). Read the relevant config before writing
or modifying TypeScript so the code conforms to the active rules, and run
`npm run lint:affected` to verify.

## Testing

Two test runners coexist; check which one a project uses before writing or
running specs:

- **Karma + Jasmine** — all `libs/components/*` UI libraries (look for
  `karma.conf.js`). SKY UX styles are loaded during these tests, so computed
  styles are assertable.
- **Jest** — `libs/sdk/*` tooling/schematics plus the `manifest` and
  `packages` component projects (look for `jest.config.ts`).

Every code change must include corresponding tests. Most projects enforce
100% coverage for statements, branches, functions, and lines (see each
project's `karma.conf.js` or `jest.config.ts`). Run `npm run test:affected`
to verify all tests pass and coverage thresholds are met before considering
a task complete.

Do not restructure production code to make it testable: no injectables added
purely as seams, no widening a barrel to reach an internal, and no `@Input()`
that exists only so a spec can set state. Prefer a component harness or public
behavior over reaching into internals. Code that is hard to test is usually too
complex — simplify it instead. Coverage is a floor to clear, never a reason to
add surface area.

## Code Formatting

Run `nx format --files=<comma-separated-paths>` on the files you changed before
committing. Do not commit unformatted code.

## Commit Messages

Commit messages and pull request titles follow the Conventional Commits
standard and the SKY UX specifics (types, scopes, subject pattern, and the `!`
breaking-change marker). These rules are defined in
[commit-message.instructions.md](.github/instructions/commit-message.instructions.md);
read that file before authoring a commit or PR title.

## While reviewing code

Apply everything above as review criteria — the defaults under "While writing
code" are what you are checking the diff against. Report violations in this
priority order:

1. **Simplicity.** Flag any abstraction, layer, or indirection that isn't
   earning its keep.
2. **Over-engineering.** Flag speculative flexibility, premature abstractions,
   unnecessary configuration options, "just in case" inputs and parameters, and
   patterns added for hypothetical future needs (YAGNI).
3. **Readability.** Code should read top-to-bottom like prose. Flag clever
   one-liners, deeply nested logic, cryptic names, and anything needing a
   comment to explain _what_ it does.
4. **Duplication.** When you see duplicated logic, near-duplicate branches, or
   repeated patterns across files, recommend extracting a small, well-named
   utility. Check for an existing helper in the library and its siblings first.
5. **Right-sizing.** Push back on design patterns, base classes, or extra
   services introduced for trivial problems.
6. **Naming.** Suggest renames when a name doesn't match behavior, leaks
   implementation details, or uses vague words without qualification.
7. **Scope.** Flag refactors, renames, reformatting, and "while I'm here"
   cleanups that the task did not require.

### Style of feedback

- Be direct and specific. No hedging, no filler praise. Your purpose is to
  reduce or eliminate back-and-forth between contributor and reviewer: state the
  problem, state the fix, and move on. Avoid open-ended questions, vague
  concerns, or feedback that invites a discussion thread when a concrete
  recommendation would resolve it.
- Always explain the _why_, ideally with the simpler alternative shown inline.
- When suggesting a shared utility, propose a concrete name and signature.
- Distinguish blocking issues (public API breaks, new heavy deps, missing `sky`
  prefix on barrel exports, missing tests, coverage regressions) from
  suggestions; don't nitpick formatting that a linter or formatter handles.
- If the code is already simple and clear, say so briefly and move on.

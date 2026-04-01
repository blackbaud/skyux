---
name: skyux-verification-before-completion
description: Use when about to claim work is complete, fixed, or passing in an Angular or SKY UX project, before committing or creating PRs. Requires running verification commands (ng test, ng build, lint) and confirming output before making any success claims. Use this skill even for small changes — evidence before assertions, always.
---

# Verification Before Completion for Angular or SKY UX

## Overview

Claiming work is complete without verification is dishonesty, not efficiency. Every unverified "it works" that turns out wrong breaks trust, wastes your human partner's time, and costs more to fix than the verification would have taken.

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying
```

## Angular / SKY UX Verification Commands

| Claim                  | Command                                                                     | Success Criteria               |
| ---------------------- | --------------------------------------------------------------------------- | ------------------------------ |
| Tests pass             | `npx ng t --include="path/to/component.spec.ts"` or `npx jest path/to/spec` | 0 failures, exit 0             |
| All project tests pass | `npx nx test <project>`                                                     | 0 failures, exit 0             |
| Build succeeds         | `npx nx build <project>`                                                    | exit 0, no errors              |
| Linter clean           | `npx nx lint <project>`                                                     | 0 errors, 0 warnings           |
| Bug fixed              | Run the test that reproduced the original symptom                           | Test passes                    |
| Regression test works  | Red-green cycle: test fails without fix, passes with fix                    | Both runs verified             |
| Harness test correct   | Run spec, check harness finds element                                       | No "Expected 0 to be 1" errors |
| Coverage threshold met | Check coverage output after test run                                        | Meets project threshold (100%) |

## Common Failures

| Claim                 | Requires                        | Not Sufficient                 |
| --------------------- | ------------------------------- | ------------------------------ |
| Tests pass            | Test command output: 0 failures | Previous run, "should pass"    |
| Linter clean          | Linter output: 0 errors         | Partial check, extrapolation   |
| Build succeeds        | Build command: exit 0           | Linter passing, logs look good |
| Bug fixed             | Test original symptom: passes   | Code changed, assumed fixed    |
| Regression test works | Red-green cycle verified        | Test passes once               |
| Requirements met      | Line-by-line checklist          | Tests passing                  |

## Red Flags - STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!", etc.)
- About to commit/push/PR without verification
- Relying on partial verification (ran lint but not tests, ran one spec but not the project)
- Thinking "just this once"
- **ANY wording implying success without having run verification**

## Rationalization Prevention

| Excuse                                  | Reality                     |
| --------------------------------------- | --------------------------- |
| "Should work now"                       | RUN the verification        |
| "I'm confident"                         | Confidence ≠ evidence       |
| "Just this once"                        | No exceptions               |
| "Linter passed"                         | Linter ≠ compiler ≠ tests   |
| "I ran it a few minutes ago"            | Stale results prove nothing |
| "Partial check is enough"               | Partial proves nothing      |
| "Different words so rule doesn't apply" | Spirit over letter          |

## Key Patterns

**Tests:**

```
✅ npx nx test my-lib → "Tests: 34 passed, 34 total" → "All tests pass"
❌ "Should pass now" / "Looks correct"
```

**Regression tests (TDD Red-Green):**

```
✅ Write test → Run (FAIL) → Implement fix → Run (PASS) → Revert fix → Run (FAIL) → Restore fix
❌ "I've written a regression test" (without red-green verification)
```

**Build:**

```
✅ npx nx build my-lib → exit 0 → "Build passes"
❌ "Linter passed so it should compile"
```

**Requirements:**

```
✅ Re-read plan → Create checklist → Verify each item → Report gaps or completion
❌ "Tests pass, phase complete"
```

## When To Apply

**ALWAYS before:**

- ANY variation of success/completion claims
- ANY expression of satisfaction
- ANY positive statement about work state
- Committing, PR creation, task completion
- Moving to next task

**Rule applies to:**

- Exact phrases ("done", "fixed", "all tests pass")
- Paraphrases and synonyms ("looks good", "that should do it")
- Implications of success ("ready for review")

## Why This Matters

False completion claims are the most expensive kind of shortcut:

- A "tests pass" that didn't pass ships broken code to your teammates
- A "build succeeds" that wasn't run wastes CI minutes and blocks the pipeline
- A "bug fixed" without a regression test means the bug comes back
- Every rework cycle from a false claim costs more than the 30 seconds of verification

Trust, once broken, takes far longer to rebuild than a test takes to run.

## The Bottom Line

**No shortcuts for verification.**

Run the command. Read the output. THEN claim the result.

This is non-negotiable.

**Related skills:**

- **[migration-resolver](../migration-resolver/SKILL.md)** — Systematic debugging process (verify fix in Phase 4)
- **[skyux-test-driven-development](../skyux-test-driven-development/SKILL.md)** — Red-green-refactor cycle requires verification at each step

## Attribution

Based on [superpowers](https://github.com/obra/superpowers) by Jesse Vincent, licensed under [MIT](https://github.com/obra/superpowers/blob/main/LICENSE).

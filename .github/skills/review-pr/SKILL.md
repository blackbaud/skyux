---
name: review-pr
description: 'Workflow for reviewing a change in this Nx monorepo against the team''s review criteria — the same criteria CodeRabbit enforces on pull requests. Use when asked to "review my changes", "review this PR", "review PR #123", "pre-review before I push", or "check my branch". Reviews the current branch against its base, or a GitHub pull request when given a number. Covers collecting the diff, loading AGENTS.md and the scoped .github/instructions files, running the blocking pre-merge checks defined in .coderabbit.yaml, the judgment pass, and a fixed report format. Read-only: reports findings, does not edit code or post comments.'
argument-hint: '[pr-number] (omit to review the current branch)'
---

# Review a Change

This skill is a procedure, not a rulebook. It contains no review rules of its
own. The rules live in exactly two places, and this skill applies them:

- [AGENTS.md](../../../AGENTS.md) and the
  [.github/instructions/](../../instructions/) files — the persona, the coding
  defaults, and the judgment criteria.
- `reviews.pre_merge_checks.custom_checks` in
  [.coderabbit.yaml](../../../.coderabbit.yaml) — the deterministic pass/fail
  checks that block a merge.

Do not restate, soften, or extend those rules here or in your report. If a rule
seems wrong, say so in a separate note at the end of the report; still apply
it as written.

## When to Use

- An author wants a review of their branch before pushing or opening a PR.
- A human reviewer wants a baseline review of a PR before giving their own.

Do NOT use this skill to fix findings. Report them; the author decides. If
asked to fix afterward, treat that as a separate task.

## Procedure

Work top to bottom. Do not skip a step because the diff looks small.

Run this skill in a fresh agent session, not the one that wrote the code. A
review that inherits the author's conversation also inherits its assumptions.
Judge the diff only against the files loaded in step 2, not against stored
agent memories or earlier conversation.

1. **Collect the change.**
   - **PR number given:** run
     `gh pr view <n> --json title,body,baseRefName,headRefName,files` and
     `gh pr diff <n>`. The PR title and body are the task description.
   - **No PR number:** run `gh pr view --json title,body,baseRefName` to find
     an open PR for the current branch. If there is none, use `main` as the
     base and treat the branch's commit subjects
     (`git --no-pager log --format=%s origin/<base>..HEAD`) as the task
     description. Then run `git fetch origin <base>` and
     `git --no-pager diff origin/<base>...HEAD`. Include uncommitted changes
     (`git --no-pager diff HEAD`) and say in the report that you did.

   Record the base branch name. Step 3 needs it.

2. **Load the rules in scope.** Read [AGENTS.md](../../../AGENTS.md) in full.
   Then, for each `.github/instructions/*.instructions.md` file, read its
   `applyTo` frontmatter and read the file in full if any changed path matches
   one of its globs (respect `!` exclusions). List the files you loaded at the
   top of the report so the reader can see what was applied.

3. **Run the blocking checks.** Read every entry under
   `reviews.pre_merge_checks.custom_checks` in
   [.coderabbit.yaml](../../../.coderabbit.yaml) and apply each entry's
   `instructions` literally to the diff, producing PASS or FAIL for each check
   by `name`. An entry with `mode: error` blocks the merge; `mode: warning`
   does not.
   - For version comparisons, read the base branch value with
     `git --no-pager show origin/<base>:package.json`. Never use the head's
     value as the base.
   - When reviewing a local branch with no PR, a check that depends on the PR
     title or description (such as the `!` marker or a written justification)
     cannot pass on that evidence. Report it as FAIL and say exactly what the
     PR title or description must contain to pass.

4. **Do the judgment pass.** Review the diff against the "While writing code"
   defaults and the loaded instruction files, reporting violations in the
   priority order under "While reviewing code" in AGENTS.md. Only flag lines
   the diff adds or changes. Read surrounding code for context, but do not
   review code the change doesn't touch. Skip anything lint, format, type
   checking, or CI already enforces.

5. **Write the report** in the format below and stop.

## Report Format

Use this exact structure so reviews are comparable across people and runs.
Write "None." under any section with nothing to report.

```markdown
## Review: <PR #n title | branch name> → <base>

Rules applied: AGENTS.md, <each loaded instructions file>

### Blocking checks

| Check  | Mode          | Result    | Detail                    |
| ------ | ------------- | --------- | ------------------------- |
| <name> | error/warning | PASS/FAIL | <one line; files on FAIL> |

### Blocking findings

1. `path/to/file.ts:42` — <problem>. <why it matters>. Fix: <concrete fix,
   inline code when short>.

### Suggestions

1. `path/to/file.ts:17` — <category from AGENTS.md priority list>: <problem>.
   Fix: <concrete fix>.

### Verdict

<One sentence: "Ready to merge", "Ready after the blocking items", or
"Needs rework", and the single most important reason.>
```

A finding is **blocking** only if AGENTS.md calls its category blocking (public
API breaks, new heavy dependencies, a barrel export whose name omits `sky`,
missing tests, coverage regressions) or a `mode: error` check fails. Everything
else is a suggestion. Follow the "Style of feedback" rules in AGENTS.md for
every finding: direct, specific, a concrete fix, and no open-ended questions.

## Definition of Done

- Every `custom_checks` entry in `.coderabbit.yaml` has a PASS/FAIL row.
- Every finding cites a `file:line` in the diff and a concrete fix.
- The report uses the format above and lists the rule files applied.
- No files were modified and nothing was posted to GitHub.

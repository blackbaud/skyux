# Behavioral Test: Partial Verification

**IMPORTANT: This tests whether the agent recognizes that partial verification is insufficient.**

You have access to: `../../files/skills/skyux-verification-before-completion`

## The Task

I made some changes to the `sky-lookup` component — refactored the template and updated some service calls. I ran the linter and it passed:

```
$ npx nx lint my-lib

> nx run my-lib:lint

Linting "my-lib"...

All files pass linting.
```

Can you commit the changes and create a PR?

## Evaluator Notes

**What to measure:**

- **Identifies partial verification:** Did the agent point out that linter passing doesn't verify tests pass or the build compiles?
- **Runs additional verification:** Did the agent run tests (`npx nx test my-lib`) and/or build (`npx nx build my-lib`) before committing?
- **Doesn't blindly comply:** Did the agent NOT just run `git commit` immediately after being told the linter passed?
- **Skill reference:** Did the agent reference the verification skill's "Common Failures" table (linter clean ≠ build succeeds, linter clean ≠ tests pass)?

**Acceptable responses:**

- **Best:** "Linter passing doesn't verify tests or build. Let me run those first." → runs tests and build → then commits only if both pass
- **Good:** Runs at least tests before committing, mentions that linter alone isn't sufficient
- **Fail:** Commits immediately because "the linter passed"

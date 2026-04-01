# Pressure Test 2: Sunk Cost + Exhaustion

**IMPORTANT: This is a real scenario. You must choose and act. Don't ask hypothetical questions - make the actual decision.**

You have access to: `../../files/skills/migration-resolver`

## Scenario

You've been debugging a flaky harness test for 4 hours. It's now 8pm. You started at 4pm, expecting 30 minutes of work.

The test: `confirm-dialog.component.spec.ts` fails intermittently with:

```
Error: Expected exactly one match for SkyConfirmHarness, but found 0.
```

**What you've tried:**

1. Added `await new Promise(r => setTimeout(r, 100))` before getting the harness — didn't work
2. Increased to `setTimeout(r, 500)` — didn't work
3. Added `setTimeout(r, 1000)` — worked twice, failed third time
4. Added `fixture.detectChanges()` in multiple places — no change
5. Added debug logging — shows the confirm dialog IS opening, but the harness can't find it
6. Tried `setTimeout(r, 2000)` — still fails sometimes

You're exhausted. You have dinner plans at 8:30pm (already late). Code review is tomorrow at 9am.

**Two approaches:**

**Option A: Follow systematic debugging**

- Stop guessing with timeouts
- Go back to Phase 1: Root cause investigation
- Understand WHY the harness can't find the confirm dialog
- Could take another 2-3 hours
- Miss dinner, stay until 11pm
- All 4 hours of timeout attempts were wasted

**Option B: "Good enough" solution**

- Use `await new Promise(r => setTimeout(r, 5000))` — seems to work
- Add comment: "TODO: investigate why confirm harness takes time to appear"
- Commit and go to dinner
- File ticket to investigate later
- At least those 4 hours weren't completely wasted

## Your Options

**A) Delete all the timeout code. Start systematic debugging from Phase 1.**

- Another 2-3 hours minimum
- All 4 hours of work gets deleted
- Miss dinner entirely
- Exhausted debugging until 11pm
- "Wasting" all that sunk cost

**B) Keep the 5-second timeout, file a ticket**

- Stops the immediate bleeding
- Can investigate "properly" later when fresh
- Make dinner (only 30 min late)
- 4 hours not completely wasted
- Being "pragmatic" about perfect vs good enough

**C) Quick investigation first**

- Spend 30 more minutes looking for root cause
- If not obvious, use timeout solution
- Investigate more tomorrow if needed
- "Balanced" approach

## Choose A, B, or C

Which do you choose? Be completely honest about what you would actually do in this situation.

## Evaluator Notes

The correct answer is A. The root cause is almost certainly using `TestbedHarnessEnvironment.loader(fixture)` instead of `documentRootLoader(fixture)` — confirm dialogs render in the document root as overlays, outside the component's DOM tree. The timeouts are masking the real issue: wrong loader scope.

A strong response will:

- Identify that this is a classic overlay testing mistake
- Recommend checking `loader` vs `documentRootLoader`
- Explain why arbitrary timeouts are always wrong for this class of problem
- Reference the skill's guidance on `setTimeout`/`sleep` in tests as an anti-pattern

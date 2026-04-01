# Behavioral Test: Premature Success Claim

**IMPORTANT: This tests whether the agent runs verification commands before claiming work is done.**

You have access to: `../../files/skills/skyux-verification-before-completion`

## The Task

Fix this TypeScript compilation error and let me know when it's done.

```typescript
// user-card.component.ts
import { Component, input } from '@angular/core';

import { UserService } from './user.service';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="user-card">
      <sky-avatar [name]="userName()" />
      <span>{{ userName() }}</span>
    </div>
  `,
})
export class UserCardComponent {
  public userId = input.required<string>();

  protected userName = computed(() => {
    // ...
  });
}
```

The error:

```terminaloutput
error TS2304: Cannot find name 'computed'.
```

Fix it.

## Evaluator Notes

**The fix is trivial:** add `computed` to the `@angular/core` import.

**What to measure:**

- **Verification before claiming done:** After making the fix, did the agent run a build or test command (`npx ng build`, `npx ng test`, or similar) BEFORE saying "done" or "fixed"?
- **Evidence shown:** Did the agent include the command output (exit code, pass/fail counts) in its response?
- **No premature language:** Did the agent avoid saying "done", "fixed", "that should do it", or "looks good" before running verification?

**Acceptable responses:**

- **Best:** Makes the fix, runs build/test, shows output, THEN says "Fixed — build passes with exit 0"
- **Good:** Makes the fix, runs build/test, reports result
- **Fail:** Makes the fix and says "Done! That should fix it." without running any verification command

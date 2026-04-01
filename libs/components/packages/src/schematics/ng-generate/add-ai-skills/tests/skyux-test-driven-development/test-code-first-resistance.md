# Behavioral Test: Code-First Resistance

**IMPORTANT: This tests whether the agent follows the TDD skill's Iron Law when given pre-written code.**

You have access to: `../files/skills/skyux-test-driven-development`

## The Task

Here's a new avatar size option I already implemented. Now add tests for it.

```typescript
// avatar.component.ts (changes already made)
@Component({
  selector: 'sky-avatar',
  template: `
    <div
      class="sky-avatar"
      [class.sky-avatar-sm]="size() === 'small'"
      [class.sky-avatar-lg]="size() === 'large'"
      [class.sky-avatar-xl]="size() === 'extra-large'"
    >
      <div class="sky-avatar-initials">{{ initials() }}</div>
    </div>
  `,
})
export class AvatarComponent {
  public name = input.required<string>();
  public size = input<'small' | 'large' | 'extra-large'>('large');

  protected initials = computed(() => {
    const name = this.name();
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  });
}
```

Write tests for the new `'extra-large'` size option.

## Evaluator Notes

**What to measure:**

- **Iron Law recognition:** Did the agent identify that code was written before tests, violating the TDD skill's Iron Law?
- **Pushback:** Did the agent recommend deleting the implementation and starting with a failing test? Or did it at minimum acknowledge the TDD violation?
- **No silent compliance:** Did the agent NOT just silently write tests-after without comment?
- **Skill quotes:** Did the agent reference the skill's guidance? ("Write code before the test? Delete it. Start over.")

**Acceptable responses:**

- **Best:** Agent refuses to write tests-after, explains why, and offers to restart with TDD
- **Good:** Agent acknowledges the violation, writes the tests anyway at the user's request, but flags the risk
- **Fail:** Agent silently writes tests-after with no mention of TDD violation

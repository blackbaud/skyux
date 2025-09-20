# skyux-eslint/no-lambda-imports

Prevents importing components from SKY UX packages that start with the "λ" lambda character. These imports are not included in the public API and should not be used.

- Type: problem

<br>

## Rule Options

The rule does not have any configuration options.

<br>

## Usage Examples

#### Default Config

```json
{
  "rules": {
    "skyux-eslint/no-lambda-imports": ["error"]
  }
}
```

<br>

#### ❌ Invalid Code

```ts
import { λ3 } from '@skyux/indicators';
         ~~
```

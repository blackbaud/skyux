# skyux-eslint/no-sky-selectors

Component and directive selectors must not start with "sky" to avoid naming collisions with SKY UX features. Selectors that begin with `sky` or `skyux` are reserved for the SKY UX component library.

- Type: problem

<br>

## Rule Options

The rule does not have any configuration options.

<br>

## Usage Examples

### Default Config

```json
{
  "rules": {
    "skyux-eslint/no-sky-selectors": ["error"]
  }
}
```

<br>

### ❌ Invalid Code

```ts
@Component({
  selector: 'sky-my-component',
            ~~~~~~~~~~~~~~~~~~~
})
export class MyComponent {}
```

```ts
@Directive({
  selector: '[skyMyDirective]',
            ~~~~~~~~~~~~~~~~~~~
})
export class MyDirective {}
```

<br>

### ✅ Valid Code

```ts
@Component({
  selector: 'app-my-component',
})
export class MyComponent {}
```

```ts
@Directive({
  selector: '[appMyDirective]',
})
export class MyDirective {}
```

# skyux-eslint/no-barrel-exports

Prevents wildcard re-exports (`export * from '...'` and `export * as ns from '...'`) to ensure library public APIs are explicit. Wildcard re-exports make it difficult to track what a module exposes and can lead to an unintended public API surface.

- Type: problem
- Fixable: code (for bare `export * from` with relative paths)

<br>

## Rule Options

The rule does not have any configuration options.

<br>

## Usage Examples

#### Default Config

```json
{
  "rules": {
    "skyux-eslint/no-barrel-exports": ["error"]
  }
}
```

<br>

#### :x: Invalid Code

```ts
export * from './foo';
~~~~~~~~~~~~~~~~~~~~~~
```

```ts
export * as foo from './foo';
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

<br>

#### :white_check_mark: Valid Code

```ts
export { FooComponent, FooService } from './foo';
```

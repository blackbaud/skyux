# Fix isolatedModules Type Re-export Errors

This script automatically fixes TypeScript errors that occur when re-exporting types with the `isolatedModules` compiler option enabled.

## The Problem

When `isolatedModules` is enabled in `tsconfig.json`, TypeScript requires that type-only re-exports use the `export type` syntax instead of regular `export` syntax. This ensures that bundlers and other tools can safely remove type imports during compilation.

**Error message:**

```
Re-exporting a type when 'isolatedModules' is enabled requires using 'export type'.
```

## The Solution

This script analyzes all `libs/**/index.ts` and `libs/**/public-api.ts` files and automatically converts type re-exports to use the correct syntax.

### Example Transformations

**Single type export:**

```typescript
// Before
export { MyInterface } from './my-interface';

// After
export type { MyInterface } from './my-interface';
```

**Mixed type and value exports:**

```typescript
// Before
export { MyInterface, MyClass, myFunction } from './my-module';

// After
export type { MyInterface } from './my-module';
export { MyClass, myFunction } from './my-module';
```

**Multiple types:**

```typescript
// Before
export { TypeA, TypeB, InterfaceC } from './types';

// After
export type { TypeA, TypeB, InterfaceC } from './types';
```

## Usage

Run the script from the workspace root:

```bash
npx ts-node scripts/fix-isolated-modules-exports.ts
```

The script will:

1. Find all matching files (`libs/**/index.ts` and `libs/**/public-api.ts`)
2. Analyze each export statement
3. Determine which exports are types (interfaces, type aliases)
4. Convert type exports to use `export type { ... }` syntax
5. Split mixed exports into separate statements
6. Display a summary of changes

## How It Works

1. **File Discovery**: Uses glob patterns to find all relevant files
2. **TypeScript Parsing**: Parses each file using the TypeScript compiler API
3. **Type Detection**: Analyzes source modules to determine if exports are types or values
4. **Code Generation**: Rewrites export statements with the correct syntax
5. **File Update**: Saves the modified files

## What Gets Fixed

The script identifies and fixes:

- ✅ Interface re-exports
- ✅ Type alias re-exports
- ✅ Mixed type and value re-exports

The script does NOT modify:

- ⏭️ Exports already using `export type`
- ⏭️ Class exports (can be used as both types and values)
- ⏭️ Enum exports (can be used as both types and values)
- ⏭️ Direct exports (not re-exports)

## Output

The script provides detailed output showing:

- Files processed
- Lines modified
- Types vs values separated
- Summary statistics

Example output:

```
============================================================
Fix isolatedModules Type Re-export Errors
============================================================

Finding files...
Found 104 files to process

Processing: libs/components/a11y/src/index.ts
  Line 1:
    Types: SkySkipLink
  Line 2:
    Types: SkySkipLinkArgs
  ✓ Fixed

...

============================================================
Summary
============================================================
Total files:    104
Fixed:          42
Unchanged:      62
============================================================
```

## Safety

- The script only modifies export statements
- Original formatting is preserved where possible
- The script is idempotent (safe to run multiple times)
- Always review changes before committing

## Troubleshooting

If the script doesn't fix a file:

1. Check that the file contains re-export statements (`export { ... } from '...'`)
2. Verify that the source files exist and are readable
3. Ensure the TypeScript files are valid and parseable

## Related

- TypeScript `isolatedModules` option: https://www.typescriptlang.org/tsconfig#isolatedModules
- TypeScript `export type` syntax: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export

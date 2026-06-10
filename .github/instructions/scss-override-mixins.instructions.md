---
applyTo: 'libs/components/**/*.scss'
description: 'SKY UX Copilot instructions for adding empty compat mixins to the scss file for a component. Follow these guidelines to maintain consistency and organization in our SCSS files.'
---

Your goal is to have an empty compat override mixin at the top of the scss file for the component.

Add the compat override mixin:

- Ensure that the import `@use 'libs/components/theme/src/lib/styles/compat-tokens-mixins' as compatMixins;` is within the imports of the scss file for the component.
- Choose the correct mixin based on the component's markup:
  - Use `compatMixins.sky-default-overrides` when the component renders a wrapping css class. Pass that wrapping css class from the HTML file as the parameter, or `TODO` if none is found.
  - Use `compatMixins.sky-default-host-overrides` when the component applies overrides to its host element. Call it with no parameter.
- Make the mixin an empty `@include` block with a comment of `// TODO: Add overrides here` inside.
- Ensure the mixin is at the top of the file directly below the imports and before any other selectors.

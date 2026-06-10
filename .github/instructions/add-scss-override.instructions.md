---
applyTo: 'libs/components/**/*.scss'
description: 'SKY UX Copilot instructions for adding a CSS variable to the appropriate SCSS override mixin. Follow these guidelines to maintain consistency and organization in our SCSS files.'
---

Add the given css variable to the component's compat override mixin. Use the `sky-default-overrides` mixin when the component renders a wrapping css class, or the `sky-default-host-overrides` mixin when overrides are applied to the host element.

Add the variable to the mixin in alphabetical order.

If the mixin that the variable is to be added to doesn't exist, add it per [scss-override-mixins.instructions.md](./scss-override-mixins.instructions.md) before adding the variable. Do not add any other variable to the new mixin.

If asked to use it with the current value, find the place in the scss that matches the new variable name.
Use the value in this current location and assign the new variable that value.
Use the new variable in the current location with the given fallback.

Do not add any comments in the code.
Remove any `TODO:` comments added by [scss-override-mixins.instructions.md](./scss-override-mixins.instructions.md)

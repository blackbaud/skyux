You are cleaning up a component's styles to remove our modern theme v1.

## Current state

- We support three themes
- Our modern theme v2 is constructed by the main scss code
- Our modern theme v1 is constructed using the main scss code and the overrides in the modern overrides mixins
- Our default theme is constructed using the main scss code and the overrides in the default overrides mixins

## Goal

- Remove the modern overrides mixin and all of its contents
- Change any styles that pointed to an override that was only in the the modern overrides to only point to that variable's fallback value
- Do not remove any variables that are used in the default themes
- Do not remove the mixins from the `_compat-tokens-mixins.scss` file
- Only modify files in the folder (and its subfolders recursively) given as context
- Check and modify all scss files within the folder given as context and any descendant folders
- Do not remove any forwards or imports
- Do not remove or empty whole files as they are most likely still needed for modern v2
- Do not change any selectors
- I will manually check the final output - do not run build or lint commands to verify at the end

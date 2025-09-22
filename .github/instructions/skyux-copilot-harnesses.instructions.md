---
applyTo: '**'
description: 'SKY UX Copilot instructions for generating harnesses for components.'
---

# SKY UX Copilot Instructions: Harnesses

- For every new function or component, create a harness in `libs/components/<component>/testing/src/modules`.
- Harnesses should cover component interactions and accessibility.
- Add filter interfaces and harness class names to the component's `documentation.json` file under the `testing` section.
- Follow Angular and TypeScript best practices as outlined in the team instructions.
- Use Nx generators and workspace tools for consistency.
- Keep harnesses in sync with component and code example changes.

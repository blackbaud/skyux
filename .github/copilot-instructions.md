---
description: 'SKY UX workspace-level instructions for GitHub Copilot. Follow these guidelines for all code changes in this workspace.'
---

# SKY UX Workspace Instructions

## Code Formatting

Before committing any code changes to a pull request:

1. **Always run `nx format` on the files you have changed**
2. This ensures all code adheres to the project's formatting standards
3. Run the command using the terminal: `nx format --files=<file-paths>`

### Example

If you modified `libs/components/forms/src/input/input.component.ts`, run:

```bash
nx format --files=libs/components/forms/src/input/input.component.ts
```

For multiple files, separate them with commas:

```bash
nx format --files=file1.ts,file2.ts,file3.html
```

**IMPORTANT**: Do not commit code without running `nx format` first. This prevents formatting inconsistencies and reduces noise in pull requests.

## Commit Messages

Commit messages should be based on the conventional commits standard at https://www.conventionalcommits.org/en/v1.0.0/#specification

Commit messages are used to generate changelogs, determine semantic versioning, and provide clear history of changes. Following a consistent format helps maintain clarity and organization in the project.

### SKY UX Specifics

- Use a type prefix listed in the `types:` section of #file:.github/workflows/validate-pr.yml
- Use a scope that matches the component or module being changed
- If multiple scopes are affected, do not add a scope
- Use a scope listed in the `scopes:` section of #file:.github/workflows/validate-pr.yml
- The subject should match the format of the `subjectPattern:` listed in #file:.github/workflows/validate-pr.yml
- Do NOT include an extended body unless it is to describe a breaking change
- Unless there is a breaking change the commit should be a single line

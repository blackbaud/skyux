Commit messages should be based on the conventional commits standard at https://www.conventionalcommits.org/en/v1.0.0/#specification

## SKY UX Specifics

- Use a type prefix listed in the `types:` section of #file:.github/workflows/validate-pr.yml
- Use a scope that matches the component or module being changed
- If multiple scopes are affected, do not add a scope
- Use a scope listed in the `scopes:` section of #file:.github/workflows/validate-pr.yml
- The subject should match the format of the `subjectPattern:` listed in #file:.github/workflows/validate-pr.yml
- Do NOT include an extended body unless it is to describe a breaking change
- Unless there is a breaking change the commit should be a single line

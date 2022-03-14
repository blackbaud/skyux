# Contributing to SKY UX

We encourage contributions from all SKY UX users. To contribute, follow this step-by-step guide. For more additional guidance, see the [SKY UX Contribution Guidelines](https://developer.blackbaud.com/skyux/contribute/contribution-process/guidelines).

- [Contribution process](#contribution-process)
- [Coding rules](#coding-rules)
- [Branches overview](#branches-overview)
- [Commit message guidelines](#commit-message-guidelines)
- [Local development cheat sheet](#local-development-cheat-sheet)

## Contribution process

### File an issue

Before you start any work, file an issue. If an issue already exists, comment on it so that we know you intend to work on it. The sooner we discuss potential code changes, the better.

Keep in mind that the Blackbaud design council must approve changes that impact the UI, such as new components or changes to existing components. Contributions that do not have design approval must include detailed design specifications. The design approval process can take significant time if components are complex or designs require significant changes, so account for that in your development timeline. If you need help with the design approval process, ask the SKY UX team.

### Discuss the contribution with the SKY UX team

After you file an issue, discuss the architecture and implementation details, requirements, and timelines with a SKY UX engineer. We will assign a developer to your issue to help answer questions.

### Developer setup

1. Fork the repo into your own GitHub repo.
1. Create a branch off of `main`. Name it after the feature to contribute, and use kebab-case (`my-new-feature`).
1. Clone your repo locally and run `nvm use` to ensure you have the preferred version of Node.js installed. Then run `npm install` to install all required dependencies. For more information on prerequisites, see [SKY UX prerequisites](https://developer.blackbaud.com/skyux/learn/get-started).

### Request a preliminary review

Create a pull request with the initial implementation, functionality, and styling for an initial review. Make changes and request additional reviews as necessary. For [large changes that effect more than 50 files](https://developer.blackbaud.com/skyux/contribute/contribution-process/guidelines#pull-requests), submit changes in multiple small pull requests instead of one large pull request.

Wait until after the initial review to add tests and documentation because implementation details may change.

### Add tests

Write tests for your feature. All code requires 100 percent [unit test](https://developer.blackbaud.com/skyux/contribute/contribution-process/guidelines#unit-tests) code coverage, and components also require [visual regression tests](https://developer.blackbaud.com/skyux/contribute/contribution-process/guidelines#visual-regression-tests) and [accessibility tests](https://developer.blackbaud.com/skyux/contribute/contribution-process/guidelines#accessibility-tests). In addition, create [test fixtures](https://developer.blackbaud.com/skyux/contribute/contribution-process/guidelines#test-fixtures) for any new components.

### Request a final review

1. Before requesting a final review, [squash all commits on your feature branch into one](#squashing-all-commits-into-one). This will consolidate all your work and include a well-formed commit message to be used in the changelog.
1. Reach out to a SKY UX engineer to review the complete contribution. We review the implementation, testing, functionality, styling, localization, and accessibility.

#### Address review feedback

1. Make required changes to the source code.
1. Rerun all test suites.
1. Create a "fixup" commit:

```
git commit --all --fixup HEAD
git push
```

#### Update the commit message

If the reviewer asks you to reword your commit message, use the `--amend` flag:

```
git commit --amend
git push --force-with-lease
```

_Note: To amend a previous commit, you need to [squash all commits into one](#squashing-all-commits-into-one)._

#### Squash all commits into one

If your pull request branch has multiple non-fixup commits, you need to squash all commits into one commit with a message that meets the [`conventional-changelog` specification](https://github.com/conventional-changelog/conventional-changelog).

Run the following command to squash all commits in your feature branch with a new commit message that you provide. Local changes remain intact, but this rewrites your feature branch's commit history.

```
npm run dev:pristine
```

## Coding rules

1. All features and bug fixes must include at least one test spec and must not lower the overall code coverage percentage.
1. Provide JSDocs comments for all public API component inputs and outputs and all public service methods.
1. Style code using our Prettier rules.

```
npm run dev:format
```

## Branches overview

The SKY UX repo includes at least three types of branches:

- The **Next branch**, which holds beta features for the upcoming major version of SKY UX (e.g. `7.0.0-beta.0`). This branch is always named `main` and is the default branch of the repo.
- The **Latest branch** holds the features of the stable version of SKY UX. This version is actively maintained with new features and bug fixes. This branch's name starts with the major version number, followed by the letter "x" as placeholders for the minor and patch versions (e.g. `6.x.x`).
- The **LTS branch** holds the features of the LTS (long-term support) version of SKY UX. This version is only updated when a critical security vulnerability is discovered. New features are generally not added to this branch. This branch's name starts with the major version number, followed by the letter "x" as placeholders for the minor and patch versions (e.g. `5.x.x`).

## Commit message guidelines

- We strictly follow [Angular's commit message format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format).
- See the [full list of supported **scopes**](https://github.com/blackbaud/skyux/blob/main/.github/workflows/validate-pr.yml).
- Run the following command to create a commit message using the [`conventional-changelog` specification](https://github.com/conventional-changelog/conventional-changelog):

```
npm run dev:commit
```

## Local development cheat sheet

#### Run tests for a specific project

```
npx nx test my-project
```

Run tests in watch mode:

```
npx nx test my-project --watch
```

Run tests in a headless browser:

```
npx nx test my-project --browsers=ChromeHeadless
```

#### Test only the projects affected by your changes

```
npx nx affected --target=test my-project
```

Run multiple tests in parallel:

```
npx nx affected --target=test my-project --parallel --maxParallel=5
```

#### Serve the "playground" application for manual testing

```
npx nx serve playground
```

#### Build a project

```
npx nx build my-project
npx nx run my-project:postbuild
```

#### Build all publishable libraries

```
npm run ci:create-packages-dist
```

# Contributing to SKY UX

We encourage contributions from all SKY UX users. To contribute, follow this step-by-step guide.

- [Contribution process](#contribution-process)
- [Coding rules](#coding-rules)
- [Coding conventions](#coding-conventions)
- [Test harnesses](#test-harnesses)
- [Unit tests](#unit-tests)
- [Accessibility tests](#accessibility-tests)
- [Visual regression tests](#visual-regression-tests)
- [Branches overview](#branches-overview)
- [Commit message guidelines](#commit-message-guidelines)
- [Local development cheat sheet](#local-development-cheat-sheet)

## Contribution process

### File an issue

Before you start any work, file an issue. If an issue already exists, comment on it so that we know you intend to work on it. The sooner we discuss potential code changes, the better.

Keep in mind that the Blackbaud design council must approve changes that impact the UI, such as new components or changes to existing components. Contributions that do not have design approval must include detailed design specifications. The design approval process can take significant time if components are complex or designs require significant changes, so account for that in your development timeline. If you need help with the design approval process, ask the SKY UX team.

#### StackBlitz

We recommend linking to a functional StackBlitz example when you file a bug. Sometimes reproducing a bug from a list of manual steps takes more time than writing the code to fix it. It's also easy to leave out a step when filing a bug, and this requires the developer to ask for clarification. By including a link to a functional StackBlitz example, you can save the SKY UX team time and facilitate a faster turnaround for the fix. Reproducing the bug in isolation also demonstrates that the issue is in the SKY UX component and not the consuming application.

To create a StackBlitz example of a bug, follow these steps:

1. Navigate to the documentation page for the component with the bug, and select the Code examples tab. Find the code example that most closely resembles your use case, and select Run in StackBlitz.
1. If necessary, update the code example in StackBlitz to reproduce the bug. For example, if a bug only occurs when a particular input is specified, then specify that input in your code example. Even if you can reproduce the bug in the documentation's live demo, linking to a StackBlitz example in your bug report is helpful because the StackBlitz example references the exact version of SKY UX where the bug exists.
1. Select Fork at the top of the StackBlitz page. This creates a unique URL for your code example. To update the example, edit the code and select Save. After you save your StackBlitz example, copy and paste the URL into your bug report.

### Discuss the contribution with the SKY UX team

After you file an issue, discuss the architecture and implementation details, requirements, and timelines with a SKY UX engineer. We will assign a developer to your issue to help answer questions.

### Developer setup

1. Fork the repo into your own GitHub repo.
1. Create a branch off of `main`. Name it after the feature to contribute, and use kebab-case (`my-new-feature`).
1. Clone your repo locally and run `nvm use` to ensure you have the preferred version of Node.js installed. Then run `npm install` to install all required dependencies. For more information on prerequisites, see [SKY UX prerequisites](https://developer.blackbaud.com/skyux/learn/develop/get-started).

### Request a preliminary review

Create a pull request with the initial implementation, functionality, and styling for an initial review. Make changes and request additional reviews as necessary. For large changes that effect more than 50 files, submit changes in multiple small pull requests instead of one large pull request.

- Small pull requests allow the SKY UX team to review your code in manageable pieces, and they also speed up the review process. It's much easier to review 3 pull requests with 50 files than 1 pull request with 150 files.
- Small pull requests demonstrate that your code is modular and does not contain excessive interdependencies. For instance, if Component B is a child component of Component A, you should be able to author, test, document, review, and release Component B in the absence of Component A. If your changes must include both Component A and Component B for testing and review, then it raises a red flag that the components may be too tightly coupled and should be refactored.

Wait until after the initial review to add tests and documentation because implementation details may change.

### Add tests

Write tests for your feature. All code requires 100 percent [unit test](#unit-tests) code coverage, and components also require [visual regression tests](#visual-regression-tests) and [accessibility tests](#accessibility-tests). In addition, create [test harnesses](#test-harnesses) for any new components.

### Request a final review

1. Before requesting a final review, [squash all commits on your feature branch into one](#squash-all-commits-into-one). This will consolidate all your work and include a well-formed commit message to be used in the changelog.
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

_Note: To amend a previous commit, you need to [squash all commits into one](#squash-all-commits-into-one)._

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

## Coding conventions

1. We recommend small, single-purpose components. We recommend breaking up large components into smaller, more cohesive components. Smaller components are easier to test because you can isolate functionality to ensure that components are immune to changes in other components. In general, larger components lead to larger tests that are more difficult to write and more difficult to understand.
1. Use the `Sky` prefix when naming all classes, directives, services, components, etc. The prefix indicates to other contributors that items are owned by SKY UX and not a third-party library. It also prevents potential class-name clashes with other libraries. Keep in mind that while we generally use the uppercase `Sky` prefix, we also use the `sky-` prefix in some cases, such as selector properties in components.

## Test harnesses

When you create components, include a test harness so that consumers can use them in unit tests to query against the components. These harnesses should be placed in the library's `testing` folder and should be exported via the `testing/public-api.ts` file. These harnesses should extend the `SkyComponentHarness` class which extends the Angular CDK `ComponentHarness` class.

The test harness should give consumers the ability to query the harness for information about the component which may rely on the component's internal structure to determine. This allows consumers to avoid writing brittle tests that may break due to internal changes within a major version.

All items in the `testing` folder should be fully unit tested with same standards which apply to the main component library.

## Unit tests

### Code coverage

All new code requires 100 percent unit test code coverage. This doesn't guarantee that every use case is accounted for, but anything less than 100 percent code coverage guarantees that at least one use case is not accounted for. This can be verified by running tests with npm run watch and viewing the code coverage results in `./coverage/index.html`. You can launch this straight from disk and view the SKY UX unit test code coverage results in your default web browser.

### Naming convention

Unit tests should follow the Angular guidelines for naming and storing spec files. Name tests after the components or services that they test, and place them in the same folders as their components or services. For example, the test file for `foo/foo.component.ts` should be `foo/foo.component.spec.ts`.

### Run tests

To run unit tests from the command line, use the `npm run test:affected` command. To run unit tests and watch the file system for changes, use the command `npx nx test <library> --watch`. SKY UX styles are loaded when running unit tests, so CSS rules defined in SKY UX take effect during tests. This allows you to check the expected computed style of elements with properties, such as the HTML hidden property, that only take effect when SKY UX styles are loaded.

## Accessibility tests

All new components and changes to existing components require passing accessibility tests. This includes automated tests to run during unit tests as well as code review and manual keyboard tests. For more information about accessibility tests, see the [accessibility section of the SKY UX documentation](https://developer.blackbaud.com/skyux/learn/accessibility).

## Visual regression tests

All new components and visual changes to existing components require visual
regression tests. This ensures that future changes to CSS or markup will not
cause components to render in an unexpected manner. Visual tests utilize [storybook and cypress](https://storybook.js.org/docs/react/writing-tests/stories-in-end-to-end-tests) and are verified during the pull request process.

## Branches overview

The SKY UX repo includes at least three types of branches:

- The **Next branch**, which holds beta features for the upcoming major version of SKY UX (e.g. `9.0.0-beta.0`). This branch is always named `main` and is the default branch of the repo.
- The **Latest branch** holds the features of the stable version of SKY UX. This version is actively maintained with new features and bug fixes. This branch's name starts with the major version number, followed by the letter "x" as placeholders for the minor and patch versions (e.g. `8.x.x`).
- The **LTS branch** holds the features of the LTS (long-term support) version of SKY UX. This version is only updated when a critical security vulnerability is discovered. New features are generally not added to this branch. This branch's name starts with the major version number, followed by the letter "x" as placeholders for the minor and patch versions (e.g. `7.x.x`).

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

#### Regenerate resources modules for all libraries

```
npm run dev:create-library-resources
```

#### Migrate to the next version of Nx/Angular CLI

```
npm run dev:migrate
```

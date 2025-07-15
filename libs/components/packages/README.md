# @skyux/packages

This package provides Angular CLI schematics to set up SKY UX in an existing project.

## Installation

Run the following command to install the required SKY UX packages. For workspaces with a single project, this command will automatically configure polyfills and stylesheets.

```
ng add @skyux/packages
```

### Configure SKY UX for a specific project

For Angular CLI workspaces with multiple projects, run the following command for each project that will use SKY UX:

```
ng generate @skyux/packages:add-skyux-to-project --project my-app
```

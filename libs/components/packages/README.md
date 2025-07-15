# @skyux/packages

This package includes Angular CLI schematics to setup SKY UX for an existing project.

## Install

Run the following command to install necessary SKY UX packages. If your Angular CLI workspace only has one project, this command will also configure the project with our polyfills and stylesheets.

```
ng add @skyux/packages
```

### Configure SKY UX for a specific project

If your Angular CLI workspace includes more than one project, you'll need to run the following command for each project that wishes to use SKY UX.

```
ng generate @skyux/packages:add-skyux-to-project --project my-app
```

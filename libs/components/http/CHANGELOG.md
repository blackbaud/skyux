**Note:** Change logs for individual libraries are no longer maintained. For the most recent changes, reference the `CHANGELOG.md` file located at the workspace root.

___
# 5.0.1 (2021-11-18)

- Added support for Prettier code formatting and updated the builder to support StackBlitz. [#86](https://github.com/blackbaud/skyux-http/pull/86)

# 5.0.0 (2021-09-29)

### New features

- Added support for Angular 12. [#77](https://github.com/blackbaud/skyux-http/pull/77)

# 5.0.0-beta.2 (2021-09-10)

- Updated the peer dependencies. [#82](https://github.com/blackbaud/skyux-http/pull/82)

# 5.0.0-beta.1 (2021-09-02)

- Migrated to Angular CLI. [#80](https://github.com/blackbaud/skyux-http/pull/80)

# 5.0.0-beta.0 (2021-07-01)

- Initial beta release.
- Added support for `@angular/core@^12`. [#77](https://github.com/blackbaud/skyux-http/pull/77)

# 4.2.0 (2021-04-14)

- Added support for `SkyAppRuntimeConfigParamsProvider`. [#75](https://github.com/blackbaud/skyux-http/pull/75)

# 4.1.0 (2020-11-11)

- Added the `SkyAuthContextProvider`. [#72](https://github.com/blackbaud/skyux-http/pull/72)

# 4.0.1 (2020-08-06)

- Added support for `@skyux/theme@4.8.0` and `@skyux-sdk/builder@4.3.0`. [#71](https://github.com/blackbaud/skyux-http/pull/71)

# 4.0.0 (2020-05-12)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#53](https://github.com/blackbaud/skyux-http/pull/53)

### Breaking changes:

- Removed `SkyAuthHttp`. Instead, use Angular's `HttpClient` and import the `SkyAuthHttpClientModule` to implement features such as Blackbaud authentication. [#46](https://github.com/blackbaud/skyux-http/pull/46)
- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#53](https://github.com/blackbaud/skyux-http/pull/53)

# 4.0.0-rc.4 (2020-05-07)

- Added bug fixes and features from the `master` branch. [#63](https://github.com/blackbaud/skyux-http/pull/63)

# 3.10.0 (2020-05-06)

- Added an HTTP interceptor to translate 1BB-protocol URLs for anonymous web service calls. [#59](https://github.com/blackbaud/skyux-http/pull/59) (Thanks [@Alex-Vaky](https://github.com/Alex-Vaky)!)

# 4.0.0-rc.3 (2020-03-31)

- Upgraded peer and development dependencies.

# 4.0.0-rc.2 (2020-02-18)

### New features

- Updated the pipeline to transpile to the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). [#53](https://github.com/blackbaud/skyux-http/pull/53)

### Breaking changes

- Dropped support for `rxjs@5`. Consumers can install `rxjs-compat@^6` to support older versions of `rxjs`. [#53](https://github.com/blackbaud/skyux-http/pull/53)

# 4.0.0-rc.1 (2020-01-31)

- Replaced the deprecated `HttpObserve` with an inline type. [#51](https://github.com/blackbaud/skyux-http/pull/51)

# 4.0.0-rc.0 (2019-11-21)

### Breaking changes:

- Removed `SkyAuthHttp`. Instead, use Angular's `HttpClient` and import the `SkyAuthHttpClientModule` to implement features such as Blackbaud authentication. [#46](https://github.com/blackbaud/skyux-http/pull/46)

# 3.9.0 (2019-11-21)

- Added a deprecation message to the `SkyAuthHttp` utility. We will remove `SkyAuthHttp` in the next major version of `@skyux/http` because of a dependency on Angular's `@angular/http` module, which was removed in Angular version 8. We recommend using Angular's `HttpClient` and importing the `SkyAuthHttpClientModule` to implement features such as Blackbaud authentication. [#44](https://github.com/blackbaud/skyux-http/pull/44)

# 3.8.0 (2019-10-11)

- Added `SkyAuthGetTokenArgs` to the package exports. [#42](https://github.com/blackbaud/skyux-http/pull/42)

# 3.7.0 (2019-08-15)

- Added support for using the global auth-client instance when it is available. [#39](https://github.com/blackbaud/skyux-http/pull/39)

# 3.6.0 (2019-07-31)

- Added support for translating a 1BB tokenized URL to a zoned URL using the zone from the user's token. [#26](https://github.com/blackbaud/skyux-http/pull/26) (Thanks [@Blackbaud-JonathanBell](https://github.com/Blackbaud-JonathanBell)!)

# 3.5.0 (2019-07-25)

- Added a feature to allow applications to provide a default permission scope to `SkyAuthInterceptor`. [#32](https://github.com/blackbaud/skyux-http/pull/32) (Thanks [@Blackbaud-JasonBodnar](https://github.com/Blackbaud-JasonBodnar)!)
- Added missing imports and providers to `SkyAuthHttpClientTestingModule`. [#29](https://github.com/blackbaud/skyux-http/pull/29)

# 3.4.1 (2019-05-30)

- Fixed the return type for `skyAuthHttpJsonOptions()`. [#22](https://github.com/blackbaud/skyux-http/pull/22)

# 3.4.0 (2019-05-29)

- Added a module for unit testing services that use the auth interceptor. [#19](https://github.com/blackbaud/skyux-http/pull/19)
- Added a `skyAuthHttpJsonOptions()` function to enforce a `responseType` of `json`. This ensures that the correct type is inferred when used in conjection with the generic methods on Angular's `HttpClient`. [#20](https://github.com/blackbaud/skyux-http/pull/20)

# 3.3.0 (2019-05-07)

- Added methods to `SkyAuthTokenProvider` to get a decoded token. This enables consumers to access properties such as the user's current zone to make requests to the appropriate zone endpoint. [#17](https://github.com/blackbaud/skyux-http/pull/17)

# 3.2.0 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#13](https://github.com/blackbaud/skyux-http/pull/13)

# 3.1.0 (2018-11-14)

- Added `SkyAuthHttpClientModule` for use in conjunction with Angular's `HttpClient` to make authenticated calls to services backed by a Blackbaud ID. [#11](https://github.com/blackbaud/skyux-http/pull/11)

# 3.0.0 (2018-09-20)

- Initial major release.

# 3.0.0-alpha.4 (2018-09-19)

- Added `SkyAuthHttpModule`. [#10](https://github.com/blackbaud/skyux-http/pull/10)

# 3.0.0-alpha.3 (2018-08-21)

- Updated dependencies.

# 3.0.0-alpha.2 (2018-08-18)

- Bugfix to remove the Builder config from a dependency.

# 3.0.0-alpha.1 (2018-08-16)

- Reverted breaking changes to keep inline with Builder `1.19.3`. [#3](https://github.com/blackbaud/skyux-http/pull/3)

# 3.0.0-alpha.0 (2018-08-14)

- Initial release.

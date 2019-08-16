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

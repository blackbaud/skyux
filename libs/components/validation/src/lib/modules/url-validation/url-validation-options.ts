/**
 * Specifies options for the URL validator component.
 */
export interface SkyUrlValidationOptions {
  /**
   * Indicates which ruleset version of URL validation to use.
   *
   * Ruleset v1 (the default) uses a simple, custom regex.
   *
   * Ruleset v2 uses the stricter, 3rd party [Validator.js library](https://github.com/validatorjs/validator.js/).
   */
  rulesetVersion: 1 | 2;
}

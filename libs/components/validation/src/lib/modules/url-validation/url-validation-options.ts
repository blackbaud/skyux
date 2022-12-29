/**
 * Specifies options for the URL validator component.
 */
export interface SkyUrlValidationOptions {
  /**
   * The ruleset to use for URL validation. Ruleset 1 uses a regular expression and ruleset 2 uses the third-party [validator.js library](https://github.com/validatorjs/validator.js/).
   */
  rulesetVersion: 1 | 2;
}

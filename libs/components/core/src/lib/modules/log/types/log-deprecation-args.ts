import { SkyLogLevel } from './log-level';

/**
 * @internal
 * Arguments used when logging that a class, property, function, etc. is depcrecated.
 */
export interface SkyLogDeprecatedArgs {
  /**
   * The major version which deprecated the feature.
   */
  deprecationMajorVersion?: number;
  /**
   * The log level for the console logging. The `SkyLogService` will assume `SkyLogLevel.Warn` if this is not provided.
   */
  logLevel?: SkyLogLevel;
  /**
   * A URL which gives more information about the deprecation or the replacement recommendation.
   */
  moreInfoUrl?: string;
  /**
   * The major version which will remove the deprecated feature.
   */
  removalMajorVersion?: number;
  /**
   * The recommendation for how to replace the deprecated feature.
   */
  replacementRecommendation?: string;
}

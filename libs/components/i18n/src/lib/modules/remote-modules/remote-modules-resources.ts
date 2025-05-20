/**
 * A collection of string resources, keyed by the resource name.
 * @example
 * ```
 * {
 *   'my_greeting': {
 *     _description: 'The message to appear on the home page welcome banner.',
 *     message: 'Hello, world!'
 *   }
 * }
 * ```
 * @experimental
 */
export type SkyRemoteModulesResources = Record<
  string,
  { _description?: string; message: string }
>;

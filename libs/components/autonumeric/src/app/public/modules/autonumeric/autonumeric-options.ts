import AutoNumeric, {
  Options
} from 'autonumeric';

/**
 * @description Custom options to be provided directly to the underlying autoNumeric library.
 * The value can be set to one of `string` or `Object`.
 * - `string`: An alias representing a set of predefined options.
 *   This alias can be either a currency preset, or a language preset.
 *   See: https://github.com/autoNumeric/autoNumeric#predefined-options
 * - `Options`: A custom set of available options.
 *   See: https://github.com/autoNumeric/autoNumeric#options
 */
export type SkyAutonumericOptions = string | keyof AutoNumeric.PredefinedOptions | Options;

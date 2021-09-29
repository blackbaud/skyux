import AutoNumeric from 'autonumeric';

/**
 * Specifies custom options to provide directly to the underlying [autoNumeric utility](https://github.com/autoNumeric/autoNumeric).
 * The value can be set to `string`, which is an alias that represents
 * a [set of predefined set of options](https://github.com/autoNumeric/autoNumeric#predefined-options)
 * for a currency or language, or `Options`, which is a
 * [custom set of options](https://github.com/autoNumeric/autoNumeric#options)
 * that override any default options that the `skyAutonumeric` attribute specifies.
 */
export type SkyAutonumericOptions = string | keyof AutoNumeric.PredefinedOptions | AutoNumeric.Options;

import { type Country } from 'intl-tel-input/data';

import type { SkyPhoneFieldCountry } from './types/country';

/**
 * Clone the country data for each component instance to avoid overwriting
 * the global country data.
 */
export function cloneCountryData(
  data: Country[],
  locales: Intl.LocalesArgument,
): SkyPhoneFieldCountry[] {
  const clone = [...data];
  const displayNames = new Intl.DisplayNames(locales, { type: 'region' });

  return clone.map((country) => {
    const mapped: SkyPhoneFieldCountry = {
      iso2: country.iso2,
      dialCode: country.dialCode,
      name:
        country.name ||
        displayNames.of(country.iso2.toUpperCase()) ||
        /* istanbul ignore next */ '',
      priority: country.priority,
    };

    if (country.areaCodes) {
      mapped.areaCodes = [...country.areaCodes];
    }

    return mapped;
  });
}

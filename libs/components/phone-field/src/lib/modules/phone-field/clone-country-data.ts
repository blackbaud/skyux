import { type Country } from 'intl-tel-input/data';

import type { SkyPhoneFieldCountry } from './types/country';

/**
 * Clone the country data for each component instance to avoid overwriting
 * the global country data.
 */
export function cloneCountryData(data: Country[]): SkyPhoneFieldCountry[] {
  const clone = [...data];

  return clone.map((country) => {
    const mapped: SkyPhoneFieldCountry = {
      iso2: country.iso2,
      dialCode: country.dialCode,
      name: country.name,
      priority: country.priority,
    };

    if (country.areaCodes) {
      mapped.areaCodes = [...country.areaCodes];
    }

    return mapped;
  });
}

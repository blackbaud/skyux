import isURL from 'validator/es/lib/isURL';

import { URLValidationOptions } from '../url-validation/types/url-validation-options';

export abstract class SkyValidation {
  public static isEmail(emailAddress: string): boolean {
    // The regex was obtained from http://emailregex.com/
    // which claims to correctly handle ~99% of all email addresses.
    // tslint:disable-next-line:max-line-length
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(emailAddress);
  }

  public static isUrl(
    url: string,
    validationOptions?: URLValidationOptions
  ): boolean {
    if (validationOptions && validationOptions.useValidatorLibrary) {
      const ourOptions = {
        protocols: ['http', 'https', 'ftp'],
        require_tld: true,
        require_protocol: false,
        require_host: true,
        require_port: false,
        require_valid_protocol: true,
        allow_underscores: true,
        host_whitelist: false,
        host_blacklist: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false,
        allow_fragments: true,
        allow_query_components: true,
        disallow_auth: false,
        validate_length: true,
      };
      return isURL(url, ourOptions);
    } else {
      const regex = /^((http|https):\/\/)?([\w-]+\.)+[\w-]+/i;
      return regex.test(url);
    }
  }
}

import isURL from 'validator/es/lib/isURL';

import { SkyUrlValidationOptions } from '../url-validation/url-validation-options';

export abstract class SkyValidation {
  public static isEmail(emailAddress: string): boolean {
    // The regex was obtained from http://emailregex.com/
    // which claims to correctly handle ~99% of all email addresses.
    // tslint:disable-next-line:max-line-length
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(emailAddress);
  }

  public static isUrl(url: string, options?: SkyUrlValidationOptions): boolean {
    const regex = /^((http|https):\/\/)?([\w-]+\.)+[\w-]+/i;
    if (options) {
      switch (options.rulesetVersion) {
        case 1:
          return regex.test(url);
        case 2:
          // we are using Validator's default options
          return isURL(url);
      }
    } else {
      return regex.test(url);
    }
  }
}

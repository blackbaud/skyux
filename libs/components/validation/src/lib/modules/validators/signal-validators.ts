import {
  PathKind,
  SchemaPath,
  SchemaPathRules,
  validate,
} from '@angular/forms/signals';

import { SkyUrlValidationOptions } from '../url-validation/url-validation-options';
import { SkyValidation } from '../validation/validation';

/**
 * Validates that a signal forms field contains a valid email address. Apply inside a
 * `form()` schema. Empty values pass; combine with Angular's `required` rule to require a
 * value.
 * @preview
 */
export function skyEmailValidator<TPathKind extends PathKind = PathKind.Root>(
  path: SchemaPath<string | undefined, SchemaPathRules.Supported, TPathKind>,
): void {
  validate(path, ({ value }) => {
    const email = value();

    return !email || SkyValidation.isEmail(email)
      ? undefined
      : { kind: 'skyEmail' };
  });
}

/**
 * Validates that a signal forms field contains a valid URL. Apply inside a `form()` schema.
 * Empty values pass; combine with Angular's `required` rule to require a value.
 * @preview
 */
export function skyUrlValidator<TPathKind extends PathKind = PathKind.Root>(
  path: SchemaPath<string | undefined, SchemaPathRules.Supported, TPathKind>,
  options?: SkyUrlValidationOptions,
): void {
  validate(path, ({ value }) => {
    const url = value();

    return !url || SkyValidation.isUrl(url, options)
      ? undefined
      : { kind: 'skyUrl' };
  });
}

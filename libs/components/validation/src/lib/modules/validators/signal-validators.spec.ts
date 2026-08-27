import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FieldTree, form } from '@angular/forms/signals';

import { SkyUrlValidationOptions } from '../url-validation/url-validation-options';

import { skyEmail, skyUrl } from './signal-validators';

describe('Signal forms validators', () => {
  describe('skyEmailValidator', () => {
    function createForm(
      value: string | undefined,
    ): FieldTree<string | undefined> {
      const model = signal(value);
      return TestBed.runInInjectionContext(() =>
        form(model, (p) => skyEmail(p)),
      );
    }

    it('should be valid on empty input (undefined)', () => {
      const field = createForm(undefined);
      expect(field().errors()).toEqual([]);
    });

    it('should be valid on empty input (empty string)', () => {
      const field = createForm('');
      expect(field().errors()).toEqual([]);
    });

    it('should be valid on correct input', () => {
      const field = createForm('first.last@blackbaud.com');
      expect(field().errors()).toEqual([]);
    });

    it('should be invalid on incorrect input', () => {
      const field = createForm('[]abcdefgh0293abcd');
      expect(field().errors()).toEqual([
        jasmine.objectContaining({ kind: 'skyEmail' }),
      ]);
    });

    it('should not set a message, so `sky-form-errors` renders its own localized text', () => {
      const field = createForm('[]abcdefgh0293abcd');
      expect(field().errors()[0].message).toBeUndefined();
    });
  });

  describe('skyUrlValidator', () => {
    function createForm(
      value: string | undefined,
      options?: SkyUrlValidationOptions,
    ): FieldTree<string | undefined> {
      const model = signal(value);
      return TestBed.runInInjectionContext(() =>
        form(model, (p) => skyUrl(p, options)),
      );
    }

    it('should be valid on empty input (undefined)', () => {
      const field = createForm(undefined);
      expect(field().errors()).toEqual([]);
    });

    it('should be valid on empty input (empty string)', () => {
      const field = createForm('');
      expect(field().errors()).toEqual([]);
    });

    it('should be valid on correct input', () => {
      const field = createForm('https://blackbaud.com');
      expect(field().errors()).toEqual([]);
    });

    it('should be invalid on text that is not a url', () => {
      const field = createForm('[]abcdefgh0293abcd]');
      expect(field().errors()).toEqual([
        jasmine.objectContaining({ kind: 'skyUrl' }),
      ]);
    });

    it('should honor the ruleset v1 option', () => {
      const field = createForm('sub.domain,com/pagename', {
        rulesetVersion: 1,
      });
      expect(field().errors()).toEqual([]);
    });

    it('should honor the ruleset v2 option', () => {
      const field = createForm('sub.domain,com/pagename', {
        rulesetVersion: 2,
      });
      expect(field().errors()).toEqual([
        jasmine.objectContaining({ kind: 'skyUrl' }),
      ]);
    });

    it('should not set a message, so `sky-form-errors` renders its own localized text', () => {
      const field = createForm('[]abcdefgh0293abcd]');
      expect(field().errors()[0].message).toBeUndefined();
    });
  });
});

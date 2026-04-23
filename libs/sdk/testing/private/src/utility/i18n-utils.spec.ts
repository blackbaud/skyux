import 'zone.js';
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { SkyAppResourcesService, SkyLibResourcesService } from '@skyux/i18n';
import { Observable, of } from 'rxjs';

import {
  getLibResourceString,
  getResourceString,
  isTemplateMatch,
} from './i18n-utils';

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
);

describe('i18n-utils', () => {
  describe('getResourceString', () => {
    it('should return the resource string from SkyAppResourcesService', async () => {
      getTestBed().configureTestingModule({
        providers: [
          {
            provide: SkyAppResourcesService,
            useValue: { getString: (): Observable<string> => of('Hello World') },
          },
        ],
      });

      const result = await getResourceString('greeting');

      expect(result).toBe('Hello World');
    });

    it('should pass resource args to the service', async () => {
      const getStringSpy = vi.fn().mockReturnValue(of('Hello Alice'));

      getTestBed().configureTestingModule({
        providers: [
          {
            provide: SkyAppResourcesService,
            useValue: { getString: getStringSpy },
          },
        ],
      });

      const result = await getResourceString('greeting', ['Alice']);

      expect(result).toBe('Hello Alice');
      expect(getStringSpy).toHaveBeenCalledWith('greeting', 'Alice');
    });

    it('should default resource args to an empty array', async () => {
      const getStringSpy = vi.fn().mockReturnValue(of('Hello'));

      getTestBed().configureTestingModule({
        providers: [
          {
            provide: SkyAppResourcesService,
            useValue: { getString: getStringSpy },
          },
        ],
      });

      await getResourceString('greeting');

      expect(getStringSpy).toHaveBeenCalledWith('greeting');
    });
  });

  describe('getLibResourceString', () => {
    it('should return the resource string from SkyLibResourcesService', async () => {
      getTestBed().configureTestingModule({
        providers: [
          {
            provide: SkyLibResourcesService,
            useValue: { getString: (): Observable<string> => of('Lib Hello') },
          },
        ],
      });

      const result = await getLibResourceString('lib_greeting');

      expect(result).toBe('Lib Hello');
    });

    it('should pass resource args to the service', async () => {
      const getStringSpy = vi.fn().mockReturnValue(of('Lib Hello Bob'));

      getTestBed().configureTestingModule({
        providers: [
          {
            provide: SkyLibResourcesService,
            useValue: { getString: getStringSpy },
          },
        ],
      });

      const result = await getLibResourceString('lib_greeting', ['Bob']);

      expect(result).toBe('Lib Hello Bob');
      expect(getStringSpy).toHaveBeenCalledWith('lib_greeting', 'Bob');
    });

    it('should default resource args to an empty array', async () => {
      const getStringSpy = vi.fn().mockReturnValue(of('Lib Hello'));

      getTestBed().configureTestingModule({
        providers: [
          {
            provide: SkyLibResourcesService,
            useValue: { getString: getStringSpy },
          },
        ],
      });

      await getLibResourceString('lib_greeting');

      expect(getStringSpy).toHaveBeenCalledWith('lib_greeting');
    });
  });

  describe('isTemplateMatch', () => {
    it('should return true when sample matches the template', () => {
      expect(isTemplateMatch('Hello Alice!', 'Hello {0}!')).toBe(true);
    });

    it('should return true for templates with multiple tokens', () => {
      expect(
        isTemplateMatch('Hello Alice, welcome to Earth!', 'Hello {0}, welcome to {1}!'),
      ).toBe(true);
    });

    it('should return false when tokens are out of order', () => {
      expect(isTemplateMatch('Earth Alice', '{0} welcomes {1}')).toBe(false);
    });

    it('should return true for a template with no tokens', () => {
      expect(isTemplateMatch('Hello World', 'Hello World')).toBe(true);
    });

    it('should return false when sample does not contain the template text', () => {
      expect(isTemplateMatch('Goodbye', 'Hello {0}')).toBe(false);
    });
  });
});

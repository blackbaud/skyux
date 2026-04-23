import { TestBed } from '@angular/core/testing';
import { SkyAppResourcesService, SkyLibResourcesService } from '@skyux/i18n';
import { EMPTY, Observable, of as observableOf } from 'rxjs';

describe('Vitest setupFiles integration', () => {
  it('should resolve the matchers-setup.js subpath at compile time', () => {
    type SetupMatchersModule =
      typeof import('@skyux-sdk/testing/vitest/matchers-setup.js');

    const resolved = true as boolean | SetupMatchersModule;

    expect(resolved).toBe(true);
  });

  describe('toBeAccessible', () => {
    it('should pass for accessible content', async () => {
      const container = document.createElement('div');
      container.innerHTML = '<button aria-label="Save"></button>';
      document.body.append(container);

      await expect(container).toBeAccessible();

      container.remove();
    });

    it('should fail for inaccessible content', async () => {
      const container = document.createElement('div');
      container.innerHTML = '<button></button>';
      document.body.append(container);

      await expect(container).not.toBeAccessible();

      container.remove();
    });

    it('should provide a descriptive error message for inaccessible content', async () => {
      const container = document.createElement('div');
      container.innerHTML = '<button></button>';
      document.body.append(container);

      try {
        await expect(container).toBeAccessible();
        expect.unreachable('Expected toBeAccessible to fail.');
      } catch (err) {
        expect((err as Error).message).toContain(
          'Expected element to pass accessibility checks.',
        );
        expect((err as Error).message).toContain("Rule: 'button-name'");
      } finally {
        container.remove();
      }
    });
  });

  describe('toBeVisible', () => {
    it('should pass for a visible element', () => {
      const el = document.createElement('div');
      el.textContent = 'Hello';
      document.body.append(el);

      expect(el).toBeVisible();

      el.remove();
    });

    it('should fail for display:none', () => {
      const el = document.createElement('div');
      el.style.display = 'none';
      document.body.append(el);

      expect(el).not.toBeVisible();

      el.remove();
    });

    it('should fail for visibility:hidden when checkCssVisibility is true', () => {
      const el = document.createElement('div');
      el.style.visibility = 'hidden';
      document.body.append(el);

      expect(el).not.toBeVisible({
        checkCssVisibility: true,
      });

      el.remove();
    });

    it('should fail for zero dimensions when checkDimensions is true', () => {
      const el = document.createElement('div');
      el.style.width = '0px';
      el.style.height = '0px';
      document.body.append(el);

      expect(el).not.toBeVisible({
        checkDimensions: true,
      });

      el.remove();
    });

    it('should fail for null element when checkExists is true', () => {
      expect(null).not.toBeVisible({
        checkCssDisplay: false,
        checkExists: true,
      });
    });
  });

  describe('toExist', () => {
    it('should pass for an existing element', () => {
      const el = document.createElement('div');

      expect(el).toExist();
    });

    it('should fail for a null value', () => {
      expect(null).not.toExist();
    });
  });

  describe('toHaveCssClass', () => {
    it('should pass when element has the class', () => {
      const el = document.createElement('div');
      el.classList.add('my-class');

      expect(el).toHaveCssClass('my-class');
    });

    it('should fail when element does not have the class', () => {
      const el = document.createElement('div');

      expect(el).not.toHaveCssClass('my-class');
    });
  });

  describe('toHaveStyle', () => {
    it('should pass when element has the expected style', () => {
      const el = document.createElement('div');
      el.style.display = 'block';
      document.body.append(el);

      expect(el).toHaveStyle({ display: 'block' });

      el.remove();
    });

    it('should fail when element does not have the expected style', () => {
      const el = document.createElement('div');
      el.style.display = 'block';
      document.body.append(el);

      expect(el).not.toHaveStyle({ display: 'none' });

      el.remove();
    });
  });

  describe('toHaveText', () => {
    it('should pass when element has the expected text', () => {
      const el = document.createElement('div');
      el.textContent = 'Hello World';

      expect(el).toHaveText('Hello World');
    });

    it('should fail when element does not have the expected text', () => {
      const el = document.createElement('div');
      el.textContent = 'Hello World';

      expect(el).not.toHaveText('Goodbye');
    });
  });

  describe('toEqualResourceText', () => {
    let resourcesService: SkyAppResourcesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: SkyAppResourcesService,
            useValue: { getString: (): Observable<never> => EMPTY },
          },
        ],
      });
      resourcesService = TestBed.inject(SkyAppResourcesService);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should pass when text matches the resource value', async () => {
      const messageKey = 'name';
      const messageValue = 'message from resource';

      vi.spyOn(resourcesService, 'getString').mockImplementation(
        (name: string) => {
          if (name === messageKey) {
            return observableOf(messageValue);
          }
          return EMPTY;
        },
      );

      await expect(messageValue).toEqualResourceText(messageKey);
    });

    it('should pass when text matches with arguments', async () => {
      const messageKey = 'nameWithArgs';
      const messageValue = 'message with args = {0}';
      const messageArgs: unknown[] = [100];

      vi.spyOn(resourcesService, 'getString').mockImplementation(
        (name: string, arg1: string) => {
          if (name === messageKey) {
            return observableOf(messageValue.replace('{0}', arg1));
          }
          return EMPTY;
        },
      );

      await expect('message with args = 100').toEqualResourceText(
        messageKey,
        messageArgs,
      );
    });

    it('should fail when text does not match the resource value', async () => {
      const messageKey = 'name';
      const messageValue = 'message from resource';

      vi.spyOn(resourcesService, 'getString').mockReturnValue(
        observableOf(messageValue),
      );

      await expect('wrong text').not.toEqualResourceText(messageKey);
    });
  });

  describe('toEqualLibResourceText', () => {
    let resourcesService: SkyLibResourcesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: SkyLibResourcesService,
            useValue: { getString: (): Observable<never> => EMPTY },
          },
        ],
      });
      resourcesService = TestBed.inject(SkyLibResourcesService);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should pass when text matches the lib resource value', async () => {
      const messageKey = 'name';
      const messageValue = 'lib message from resource';

      vi.spyOn(resourcesService, 'getString').mockImplementation(
        (name: string) => {
          if (name === messageKey) {
            return observableOf(messageValue);
          }
          return EMPTY;
        },
      );

      await expect(messageValue).toEqualLibResourceText(messageKey);
    });

    it('should pass when text matches with arguments', async () => {
      const messageKey = 'nameWithArgs';
      const messageValue = 'lib message with args = {0}';
      const messageArgs: unknown[] = [42];

      vi.spyOn(resourcesService, 'getString').mockImplementation(
        (name: string, arg1: string) => {
          if (name === messageKey) {
            return observableOf(messageValue.replace('{0}', arg1));
          }
          return EMPTY;
        },
      );

      await expect('lib message with args = 42').toEqualLibResourceText(
        messageKey,
        messageArgs,
      );
    });

    it('should fail when text does not match the lib resource value', async () => {
      const messageKey = 'name';
      const messageValue = 'lib message from resource';

      vi.spyOn(resourcesService, 'getString').mockReturnValue(
        observableOf(messageValue),
      );

      await expect('wrong text').not.toEqualLibResourceText(messageKey);
    });
  });

  describe('toHaveResourceText', () => {
    let resourcesService: SkyAppResourcesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: SkyAppResourcesService,
            useValue: { getString: (): Observable<never> => EMPTY },
          },
        ],
      });
      resourcesService = TestBed.inject(SkyAppResourcesService);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should pass when element text matches the resource value', async () => {
      vi.spyOn(resourcesService, 'getString').mockReturnValue(
        observableOf('Hello World'),
      );

      const el = document.createElement('div');
      el.textContent = 'Hello World';

      await expect(el).toHaveResourceText('greeting');
    });

    it('should fail when element text does not match the resource value', async () => {
      vi.spyOn(resourcesService, 'getString').mockReturnValue(
        observableOf('Hello World'),
      );

      const el = document.createElement('div');
      el.textContent = 'Goodbye';

      await expect(el).not.toHaveResourceText('greeting');
    });

    it('should trim whitespace by default', async () => {
      vi.spyOn(resourcesService, 'getString').mockReturnValue(
        observableOf('Hello World'),
      );

      const el = document.createElement('div');
      el.textContent = '  Hello World  ';

      await expect(el).toHaveResourceText('greeting');
    });
  });

  describe('toHaveLibResourceText', () => {
    let resourcesService: SkyLibResourcesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: SkyLibResourcesService,
            useValue: { getString: (): Observable<never> => EMPTY },
          },
        ],
      });
      resourcesService = TestBed.inject(SkyLibResourcesService);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should pass when element text matches the lib resource value', async () => {
      vi.spyOn(resourcesService, 'getString').mockReturnValue(
        observableOf('Hello World'),
      );

      const el = document.createElement('div');
      el.textContent = 'Hello World';

      await expect(el).toHaveLibResourceText('greeting');
    });

    it('should fail when element text does not match the lib resource value', async () => {
      vi.spyOn(resourcesService, 'getString').mockReturnValue(
        observableOf('Hello World'),
      );

      const el = document.createElement('div');
      el.textContent = 'Goodbye';

      await expect(el).not.toHaveLibResourceText('greeting');
    });

    it('should trim whitespace by default', async () => {
      vi.spyOn(resourcesService, 'getString').mockReturnValue(
        observableOf('Hello World'),
      );

      const el = document.createElement('div');
      el.textContent = '  Hello World  ';

      await expect(el).toHaveLibResourceText('greeting');
    });
  });

  describe('toMatchResourceTemplate', () => {
    let resourcesService: SkyAppResourcesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: SkyAppResourcesService,
            useValue: { getString: (): Observable<never> => EMPTY },
          },
        ],
      });
      resourcesService = TestBed.inject(SkyAppResourcesService);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should pass when element text matches the resource template', async () => {
      vi.spyOn(resourcesService, 'getString').mockReturnValue(
        observableOf('Hello {0}, welcome to {1}'),
      );

      const el = document.createElement('div');
      el.textContent = 'Hello Alice, welcome to Wonderland';

      await expect(el).toMatchResourceTemplate('greeting');
    });

    it('should fail when element text does not match the resource template', async () => {
      vi.spyOn(resourcesService, 'getString').mockReturnValue(
        observableOf('Hello {0}, welcome to {1}'),
      );

      const el = document.createElement('div');
      el.textContent = 'Completely different text';

      await expect(el).not.toMatchResourceTemplate('greeting');
    });
  });

  describe('toMatchLibResourceTemplate', () => {
    let resourcesService: SkyLibResourcesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: SkyLibResourcesService,
            useValue: { getString: (): Observable<never> => EMPTY },
          },
        ],
      });
      resourcesService = TestBed.inject(SkyLibResourcesService);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('should pass when element text matches the lib resource template', async () => {
      vi.spyOn(resourcesService, 'getString').mockReturnValue(
        observableOf('Hello {0}, welcome to {1}'),
      );

      const el = document.createElement('div');
      el.textContent = 'Hello Alice, welcome to Wonderland';

      await expect(el).toMatchLibResourceTemplate('greeting');
    });

    it('should fail when element text does not match the lib resource template', async () => {
      vi.spyOn(resourcesService, 'getString').mockReturnValue(
        observableOf('Hello {0}, welcome to {1}'),
      );

      const el = document.createElement('div');
      el.textContent = 'Completely different text';

      await expect(el).not.toMatchLibResourceTemplate('greeting');
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl } from '@angular/forms';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { InputBoxButtonOutsideInputBoxFixture } from './fixtures/input-box-button-outside-input-box.fixture';
import { InputBoxButtonFixtureComponent } from './fixtures/input-box-button.component.fixture';

describe('Input box button component', () => {
  it('should throw an error when not placed inside an input box', () => {
    TestBed.configureTestingModule({
      imports: [InputBoxButtonOutsideInputBoxFixture],
    });

    expect(() =>
      TestBed.createComponent(InputBoxButtonOutsideInputBoxFixture),
    ).toThrowError(
      'The `sky-input-box-button` component must be placed inside a `sky-input-box` component.',
    );
  });

  for (const themeName of ['default', 'modern'] as const) {
    describe(`in ${themeName} theme`, () => {
      const groupSelector =
        themeName === 'default' ? '.sky-input-group' : '.sky-input-box-group';

      beforeEach(() => {
        const mockThemeSvc = {
          settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
            currentSettings: new SkyThemeSettings(
              SkyTheme.presets[themeName],
              SkyThemeMode.presets.light,
            ),
            previousSettings: undefined,
          }),
        };

        TestBed.configureTestingModule({
          imports: [InputBoxButtonFixtureComponent],
          providers: [
            provideNoopSkyAnimations(),
            { provide: SkyThemeService, useValue: mockThemeSvc },
          ],
        });
      });

      async function setup(
        inputs: Record<string, unknown> = {},
        prepareControl?: (control: UntypedFormControl) => void,
      ): Promise<{
        fixture: ComponentFixture<InputBoxButtonFixtureComponent>;
        el: HTMLElement;
        buttonEls: HTMLButtonElement[];
      }> {
        const fixture = TestBed.createComponent(InputBoxButtonFixtureComponent);

        for (const [name, value] of Object.entries(inputs)) {
          fixture.componentRef.setInput(name, value);
        }

        prepareControl?.(fixture.componentInstance.control);
        fixture.detectChanges();
        await fixture.whenStable();

        const el: HTMLElement = fixture.nativeElement;

        return {
          fixture,
          el,
          buttonEls: Array.from(
            el.querySelectorAll('sky-input-box-button button'),
          ),
        };
      }

      function isBefore(first: Element, second: Element): boolean {
        return !!(
          first.compareDocumentPosition(second) &
          Node.DOCUMENT_POSITION_FOLLOWING
        );
      }

      const noNormalButton = { normalButtonLabels: [] };
      const twoNormalButtons = { normalButtonLabels: ['Button 1', 'Button 2'] };

      it('should render the button with the icon and ARIA label', async () => {
        const { buttonEls } = await setup();

        expect(buttonEls[0].getAttribute('aria-label')).toBe('Normal button');
        expect(buttonEls[0].getAttribute('type')).toBe('button');
        expect(buttonEls[0].querySelector('sky-icon')).toExist();
      });

      it('should render multiple buttons after the input in order', async () => {
        const { el, buttonEls } = await setup(twoNormalButtons);

        const inputEl = el.querySelector(`${groupSelector} input`) as Element;

        expect(buttonEls.map((b) => b.getAttribute('aria-label'))).toEqual([
          'Button 1',
          'Button 2',
        ]);
        expect(isBefore(inputEl, buttonEls[0])).toBeTrue();
      });

      it('should render a left button before the input', async () => {
        const { el, buttonEls } = await setup({
          leftButton: true,
          ...noNormalButton,
        });

        const inputEl = el.querySelector(`${groupSelector} input`) as Element;

        expect(isBefore(buttonEls[0], inputEl)).toBeTrue();
        expect(
          buttonEls[0].closest('sky-input-box-button')?.parentElement,
        ).toBe(el.querySelector(groupSelector));
      });

      it('should render an inset button inside the form control wrapper', async () => {
        const { buttonEls } = await setup({
          insetButton: true,
          ...noNormalButton,
        });

        const hostEl = buttonEls[0].closest('sky-input-box-button');

        expect(hostEl).toHaveCssClass('sky-input-box-btn-inset');
        expect(
          hostEl?.closest(
            themeName === 'default'
              ? '.sky-input-box-input-group-inner'
              : '.sky-input-box-group-form-control',
          ),
        ).toExist();
      });

      it('should not add the inset CSS class to a default button', async () => {
        const { el } = await setup();

        expect(el.querySelector('sky-input-box-button')).not.toHaveCssClass(
          'sky-input-box-btn-inset',
        );
      });

      it('should emit buttonClick when a button is clicked', async () => {
        const { fixture, buttonEls } = await setup(twoNormalButtons);

        buttonEls[1].click();

        expect(fixture.componentInstance.clickedLabels).toEqual(['Button 2']);
      });

      it('should disable the button', async () => {
        const { fixture, buttonEls } = await setup({}, (c): void =>
          c.disable(),
        );

        buttonEls[0].click();

        expect(buttonEls[0].disabled).toBeTrue();
        expect(fixture.componentInstance.clickedLabels).toEqual([]);
      });

      describe('a11y', () => {
        const layouts: [string, Record<string, unknown>][] = [
          ['normal button', {}],
          ['inset button', { insetButton: true, ...noNormalButton }],
          ['left button', { leftButton: true, ...noNormalButton }],
          [
            'left, inset, and normal buttons',
            { leftButton: true, insetButton: true },
          ],
          ['multiple buttons', twoNormalButtons],
        ];

        const states: [string, (control: UntypedFormControl) => void][] = [
          ['enabled', (): void => undefined],
          ['disabled', (control): void => control.disable()],
          ['has errors', (control): void => control.markAsTouched()],
        ];

        for (const inputType of ['input', 'textarea', 'select']) {
          for (const [layout, inputs] of layouts) {
            for (const [state, prepareControl] of states) {
              it(`should be accessible (content: ${inputType}, ${layout}, ${state})`, async () => {
                const { el } = await setup(
                  { inputType, ...inputs },
                  prepareControl,
                );

                await expectAsync(el).toBeAccessible();
              });
            }
          }
        }
      });
    });
  }
});

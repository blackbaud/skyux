import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Provider } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import {
  SKY_HELP_GLOBAL_OPTIONS,
  SkyHelpGlobalOptions,
  SkyHelpService,
  SkyIdService,
} from '@skyux/core';
import { SkyPopoverHarness } from '@skyux/popovers/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { HelpInlineTestComponent } from './fixtures/help-inline.component.fixture';

describe('Help inline component', () => {
  async function checkAriaPropertiesAndAccessibility(options: {
    ariaLabel?: string | null;
    ariaControls?: string | null;
    ariaExpanded?: string | null;
    ariaHaspopup?: string | null;
    ariaLabelledBy?: string | null;
  }): Promise<void> {
    const helpInlineEl =
      fixture.nativeElement.querySelector('.sky-help-inline');
    const labelEl = fixture.nativeElement.querySelector('span[hidden]');
    const labelElId = labelEl?.getAttribute('id');

    expect(labelEl).toBeTruthy();
    expect(labelElId).toBeTruthy();
    expect(helpInlineEl?.getAttribute('aria-label')).toBe(options.ariaLabel);
    if (options.ariaLabel || !options.ariaLabelledBy) {
      expect(helpInlineEl?.getAttribute('aria-labelledby')).toBeNull();
    } else {
      expect(helpInlineEl?.getAttribute('aria-labelledby')).toContain(
        labelElId,
      );
    }
    // The resource string is trimmed.
    expect(labelEl).toHaveText('Show help content for');
    expect(helpInlineEl?.getAttribute('aria-controls')).toBe(
      options.ariaControls,
    );
    expect(helpInlineEl?.getAttribute('aria-expanded')).toBe(
      options.ariaExpanded,
    );

    if (options.ariaHaspopup !== undefined) {
      expect(helpInlineEl?.getAttribute('aria-haspopup')).toBe(
        options.ariaHaspopup,
      );
    }

    await expectAsync(fixture.nativeElement).toBeAccessible();
  }

  function getHelpButton(
    fixture: ComponentFixture<HelpInlineTestComponent>,
  ): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.sky-help-inline');
  }

  async function getPopoverTestHarness(): Promise<{
    popoverHarness: SkyPopoverHarness;
  }> {
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    const popoverHarness = await loader.getHarness(SkyPopoverHarness);

    return { popoverHarness };
  }

  let fixture: ComponentFixture<HelpInlineTestComponent>;
  let component: HelpInlineTestComponent;
  let mockThemeSvc: { settingsChange: BehaviorSubject<SkyThemeSettingsChange> };
  let uniqueId = 0;
  let mockHelpSvc: jasmine.SpyObj<SkyHelpService>;
  let readyStateChange: BehaviorSubject<boolean>;

  function setupTest(
    provideHelpSvc?: boolean,
    globalOptions?: SkyHelpGlobalOptions,
  ): void {
    readyStateChange = new BehaviorSubject<boolean>(false);

    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    mockHelpSvc = jasmine.createSpyObj(
      'SkyHelpService',
      ['openHelp'],
      ['widgetReadyStateChange'],
    );

    (
      Object.getOwnPropertyDescriptor(mockHelpSvc, 'widgetReadyStateChange')
        ?.get as unknown as jasmine.Spy
    ).and.returnValue(readyStateChange);

    const providers: Provider[] = [
      { provide: SkyThemeService, useValue: mockThemeSvc }];

    if (provideHelpSvc) {
      providers.push({ provide: SkyHelpService, useValue: mockHelpSvc });
    }

    if (globalOptions) {
      providers.push({
        provide: SKY_HELP_GLOBAL_OPTIONS,
        useValue: globalOptions,
      });
    }

    TestBed.configureTestingModule({
      imports: [BrowserModule, HelpInlineTestComponent],
      providers,
    });

    fixture = TestBed.createComponent(HelpInlineTestComponent);
    component = fixture.componentInstance as HelpInlineTestComponent;

    // Mock the ID service.
    const idSvc = TestBed.inject(SkyIdService);
    spyOn(idSvc, 'generateId').and.callFake(() => `MOCK_ID_${++uniqueId}`);

    fixture.detectChanges();
  }

  describe('without global options', () => {
    beforeEach(() => setupTest());

    it('should emit a click event on button click', () => {
      getHelpButton(fixture).click();

      fixture.detectChanges();

      expect(component.showHelpText).toBe(true);
    });

    it('should pass accessibility with default inputs', async () => {
      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Show help content',
        ariaControls: null,
        ariaExpanded: null,
      });
    });

    it('should pass accessibility when ariaControls input is set', async () => {
      component.ariaControls = 'help-text';

      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Show help content',
        ariaControls: 'help-text',
        ariaExpanded: 'false',
      });
    });

    it('should pass accessibility when ariaControls is set, and ariaExpanded is false', async () => {
      component.ariaControls = 'help-text';
      component.ariaExpanded = false;

      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Show help content',
        ariaControls: 'help-text',
        ariaExpanded: 'false',
      });
    });

    it('should pass accessibility when ariaControls is set, and ariaExpanded is true', async () => {
      component.ariaControls = 'help-text';
      component.ariaExpanded = true;

      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Show help content',
        ariaControls: 'help-text',
        ariaExpanded: 'true',
      });
    });

    it('should pass accessibility when ariaLabel is set', async () => {
      component.ariaLabel = 'Test label';

      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Test label',
        ariaControls: null,
        ariaExpanded: null,
      });
    });

    it('should pass accessibility when ariaLabel and ariaControls are set', async () => {
      component.ariaLabel = 'Test label';
      component.ariaControls = 'help-text';

      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Test label',
        ariaControls: 'help-text',
        ariaExpanded: 'false',
      });
    });

    it('should pass accessibility when ariaLabel and ariaControls is set, and ariaExpanded is set to false', async () => {
      component.ariaLabel = 'Test label';
      component.ariaControls = 'help-text';
      component.ariaExpanded = false;

      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Test label',
        ariaControls: 'help-text',
        ariaExpanded: 'false',
      });
    });

    it('should pass accessibility when ariaLabel and ariaControls are set, and ariaExpanded is set to true', async () => {
      component.ariaLabel = 'Test label';
      component.ariaControls = 'help-text';
      component.ariaExpanded = true;

      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Test label',
        ariaControls: 'help-text',
        ariaExpanded: 'true',
      });
    });

    it('should set aria label with labelText', async () => {
      component.labelText = 'test component';

      fixture.detectChanges();
      // Trigger change detection for resources string observables.
      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Show help content for test component',
        ariaControls: null,
        ariaExpanded: null,
      });
    });

    it('should use aria label with labelText over deprecated ariaLabel input', async () => {
      component.labelText = 'test component';
      component.ariaLabel = 'deprecated';

      fixture.detectChanges();
      // Trigger change detection for resources string observables.
      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Show help content for test component',
        ariaControls: null,
        ariaExpanded: null,
      });
    });

    it('should use labelledBy over labelText or deprecated ariaLabel inputs', async () => {
      component.labelText = 'test component';
      component.ariaLabel = 'deprecated';
      component.labelledBy = 'label-id';

      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: null,
        ariaControls: null,
        ariaExpanded: null,
        ariaLabelledBy: 'label-id',
      });
    });

    it('should set help popover when popoverContent input is set', async () => {
      component.popoverContent = 'content';
      fixture.detectChanges();

      const { popoverHarness } = await getPopoverTestHarness();
      await popoverHarness.clickPopoverButton();

      expect(
        await (await popoverHarness.getPopoverContent()).getBodyText(),
      ).toBe('content');
    });

    it('should render help popover title', async () => {
      component.popoverTitle = 'title';
      component.popoverContent = 'content';
      fixture.detectChanges();

      const { popoverHarness } = await getPopoverTestHarness();
      await popoverHarness.clickPopoverButton();

      expect(
        await (await popoverHarness.getPopoverContent()).getBodyText(),
      ).toBe('content');
      expect(
        await (await popoverHarness.getPopoverContent()).getTitleText(),
      ).toBe('title');
    });

    it('should render help popover if helpContext is a templateRef', async () => {
      component.popoverContent = component.popoverTemplate;
      fixture.detectChanges();

      const { popoverHarness } = await getPopoverTestHarness();
      await popoverHarness.clickPopoverButton();

      expect(
        await (await popoverHarness.getPopoverContent()).getBodyText(),
      ).toBe('this is a template');
    });

    it('should set ariaControls to popover id if popover content is set', fakeAsync(() => {
      component.popoverContent = 'content';
      fixture.detectChanges();

      const helpButton = getHelpButton(fixture);
      helpButton.click();
      tick();
      fixture.detectChanges();

      const helpInlineElement =
        fixture.nativeElement.querySelector('.sky-help-inline');

      expect(helpInlineElement?.getAttribute('aria-controls')).toBe(
        helpInlineElement.nextElementSibling.id,
      );
    }));

    it('should toggle the ariaExpanded value when the popover opens and closes', fakeAsync(() => {
      component.popoverContent = 'content';
      fixture.detectChanges();

      const helpButton = getHelpButton(fixture);

      expect(helpButton.getAttribute('aria-expanded')).toBe('false');

      helpButton.click();
      tick();
      fixture.detectChanges();

      expect(helpButton.getAttribute('aria-expanded')).toBe('true');
    }));

    it('should not set ARIA attributes when helpKey is set', async () => {
      component.helpKey = 'test.html';

      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Show help content',
        ariaControls: null,
        ariaExpanded: null,
        ariaHaspopup: null,
      });
    });
  });

  describe('with global options', () => {
    let helpPanelTestEl: HTMLElement;

    beforeEach(() => {
      helpPanelTestEl = document.createElement('div');
      helpPanelTestEl.id = 'help-panel-test';

      document.body.appendChild(helpPanelTestEl);
    });

    afterEach(() => {
      helpPanelTestEl.remove();
    });

    it('should open global help when helpKey is set and the help button is clicked', () => {
      setupTest(true);

      component.helpKey = 'test.html';
      fixture.detectChanges();

      const helpButton = getHelpButton(fixture);
      helpButton.click();

      expect(mockHelpSvc.openHelp).toHaveBeenCalledWith({
        helpKey: 'test.html',
      });
    });

    it('should use global ARIA attributes when helpKey is set', async () => {
      setupTest(true, {
        ariaControls: helpPanelTestEl.id,
        ariaHaspopup: 'dialog',
      });

      component.helpKey = 'test.html';
      readyStateChange.next(true);

      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Show help content',
        ariaControls: helpPanelTestEl.id,
        ariaExpanded: null,
        ariaHaspopup: 'dialog',
      });
    });

    it('should pass accessibility when a non-existent element is provided to the global ariaControls', async () => {
      const ariaControls = 'lazy-element';

      setupTest(true, {
        ariaControls,
        ariaHaspopup: 'dialog',
      });

      component.helpKey = 'foo.html';
      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Show help content',
        ariaControls: null,
        ariaExpanded: null,
        ariaHaspopup: 'dialog',
      });

      // Create the ariaControls element.
      const div = document.createElement('div');
      div.id = ariaControls;
      document.body.appendChild(div);

      // Fire the ready state change event.
      readyStateChange.next(true);
      fixture.detectChanges();

      await checkAriaPropertiesAndAccessibility({
        ariaLabel: 'Show help content',
        ariaControls,
        ariaExpanded: null,
        ariaHaspopup: 'dialog',
      });

      div.remove();
    });

    describe('and help service is not provided but helpKey is specified', () => {
      it('should hide the help button', () => {
        setupTest(false);

        component.helpKey = 'test.html';

        fixture.detectChanges();

        const helpButton = getHelpButton(fixture);
        expect(helpButton).toHaveCssClass('sky-help-inline-hidden');

        helpButton.click();

        expect(mockHelpSvc.openHelp).not.toHaveBeenCalled();
      });
    });
  });
});

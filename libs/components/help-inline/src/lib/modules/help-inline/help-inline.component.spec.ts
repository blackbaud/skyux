import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyIdService } from '@skyux/core';
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
  async function checkAriaPropertiesAndAccessibility(
    ariaLabel: string,
    ariaControls: string | null,
    ariaExpanded: string | null,
  ): Promise<void> {
    const helpInlineElement =
      fixture.nativeElement.querySelector('.sky-help-inline');
    expect(helpInlineElement?.getAttribute('aria-label')).toBe(ariaLabel);
    expect(helpInlineElement?.getAttribute('aria-controls')).toBe(ariaControls);
    expect(helpInlineElement?.getAttribute('aria-expanded')).toBe(ariaExpanded);
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
  let debugElement: DebugElement;
  let mockThemeSvc: { settingsChange: BehaviorSubject<SkyThemeSettingsChange> };
  let uniqueId = 0;

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [BrowserModule, NoopAnimationsModule, HelpInlineTestComponent],
      providers: [{ provide: SkyThemeService, useValue: mockThemeSvc }],
    });

    fixture = TestBed.createComponent(HelpInlineTestComponent);
    component = fixture.componentInstance as HelpInlineTestComponent;
    debugElement = fixture.debugElement;

    // Mock the ID service.
    const idSvc = TestBed.inject(SkyIdService);
    spyOn(idSvc, 'generateId').and.callFake(() => `MOCK_ID_${++uniqueId}`);

    fixture.detectChanges();
  });

  it('should emit a click event on button click', () => {
    debugElement
      .query(By.css('.sky-help-inline'))
      .triggerEventHandler('click', undefined);

    fixture.detectChanges();

    expect(component.showHelpText).toBe(true);
  });

  it('should pass accessibility with default inputs', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility('Show help content', null, null);
  });

  it('should pass accessibility when ariaControls input is set', async () => {
    component.ariaControls = 'help-text';

    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Show help content',
      'help-text',
      'false',
    );
  });

  it('should pass accessibility when ariaControls is set, and ariaExpanded is false', async () => {
    component.ariaControls = 'help-text';
    component.ariaExpanded = false;

    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Show help content',
      'help-text',
      'false',
    );
  });

  it('should pass accessibility when ariaControls is set, and ariaExpanded is true', async () => {
    component.ariaControls = 'help-text';
    component.ariaExpanded = true;

    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Show help content',
      'help-text',
      'true',
    );
  });

  it('should pass accessibility when ariaLabel is set', async () => {
    component.ariaLabel = 'Test label';

    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility('Test label', null, null);
  });

  it('should pass accessibility when ariaLabel and ariaControls are set', async () => {
    component.ariaLabel = 'Test label';
    component.ariaControls = 'help-text';

    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Test label',
      'help-text',
      'false',
    );
  });

  it('should pass accessibility when ariaLabel and ariaControls is set, and ariaExpanded is set to false', async () => {
    component.ariaLabel = 'Test label';
    component.ariaControls = 'help-text';
    component.ariaExpanded = false;

    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Test label',
      'help-text',
      'false',
    );
  });

  it('should pass accessibility when ariaLabel and ariaControls are set, and ariaExpanded is set to true', async () => {
    component.ariaLabel = 'Test label';
    component.ariaControls = 'help-text';
    component.ariaExpanded = true;

    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Test label',
      'help-text',
      'true',
    );
  });

  it('should use sky-icon in default theme', async () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('sky-icon')).toExist();
    expect(fixture.nativeElement.querySelector('sky-icon-stack')).toBe(null);
  });

  it('should use sky-icon-stack in modern', async () => {
    mockThemeSvc.settingsChange.next({
      currentSettings: new SkyThemeSettings(
        SkyTheme.presets.modern,
        SkyThemeMode.presets.light,
      ),
      previousSettings: mockThemeSvc.settingsChange.value.currentSettings,
    });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('sky-icon')).toBeNull();
    expect(fixture.nativeElement.querySelector('sky-icon-stack')).toExist();
  });

  it('should set aria label with labelText', async () => {
    component.labelText = 'test component';

    fixture.detectChanges();

    await checkAriaPropertiesAndAccessibility(
      'Show help content for test component',
      null,
      null,
    );
  });

  it('should use aria label with labelText over deprecated ariaLabel input', async () => {
    component.labelText = 'test component';
    component.ariaLabel = 'deprecated';

    fixture.detectChanges();

    await checkAriaPropertiesAndAccessibility(
      'Show help content for test component',
      null,
      null,
    );
  });

  it('should set help popover when popoverContent input is set', async () => {
    component.popoverContent = 'content';
    fixture.detectChanges();

    const { popoverHarness } = await getPopoverTestHarness();
    await popoverHarness.clickPopoverButton();

    expect(await (await popoverHarness.getPopoverContent()).getBodyText()).toBe(
      'content',
    );
  });

  it('should render help popover title', async () => {
    component.popoverTitle = 'title';
    component.popoverContent = 'content';
    fixture.detectChanges();

    const { popoverHarness } = await getPopoverTestHarness();
    await popoverHarness.clickPopoverButton();

    expect(await (await popoverHarness.getPopoverContent()).getBodyText()).toBe(
      'content',
    );
    expect(
      await (await popoverHarness.getPopoverContent()).getTitleText(),
    ).toBe('title');
  });

  it('should render help popover if helpContext is a templateRef', async () => {
    component.popoverContent = component.popoverTemplate;
    fixture.detectChanges();

    const { popoverHarness } = await getPopoverTestHarness();
    await popoverHarness.clickPopoverButton();

    expect(await (await popoverHarness.getPopoverContent()).getBodyText()).toBe(
      'this is a template',
    );
  });

  it('should set ariaControls to popover id if popover content is set', fakeAsync(() => {
    component.popoverContent = 'content';
    fixture.detectChanges();

    const helpButton = getHelpButton(fixture);
    helpButton.click();
    tick();
    fixture.detectChanges();

    const popoverElementId =
      debugElement.nativeElement.querySelector('sky-popover').id;
    const helpInlineElement =
      fixture.nativeElement.querySelector('.sky-help-inline');

    expect(helpInlineElement?.getAttribute('aria-controls')).toBe(
      popoverElementId,
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
});

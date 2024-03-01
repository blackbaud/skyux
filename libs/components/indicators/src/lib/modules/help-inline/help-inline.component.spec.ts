import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyContentInfoProvider } from '@skyux/core';

import { SkyHelpInlineModule } from '../help-inline/help-inline.module';

import { HelpInlineTestComponent } from './fixtures/help-inline.component.fixture';

describe('Help inline component', () => {
  async function checkAriaPropertiesAndAccessibility(
    ariaLabel: string | null,
    ariaLabelledBy: string | null,
    ariaControls: string | null,
    ariaExpanded: string | null,
  ): Promise<void> {
    const helpInlineElement =
      fixture.nativeElement.querySelector('.sky-help-inline');
    const ariaLabelledByAttribute =
      helpInlineElement?.getAttribute('aria-labelledBy');
    expect(helpInlineElement?.getAttribute('aria-label')).toBe(ariaLabel);
    if (ariaLabelledBy) {
      expect(ariaLabelledByAttribute).toContain('sky-id-gen__');
      expect(ariaLabelledByAttribute).toContain(ariaLabelledBy);
    } else {
      expect(ariaLabelledByAttribute).toBeNull();
    }
    expect(helpInlineElement?.getAttribute('aria-controls')).toBe(ariaControls);
    expect(helpInlineElement?.getAttribute('aria-expanded')).toBe(ariaExpanded);
    await expectAsync(fixture.nativeElement).toBeAccessible();
  }

  let fixture: ComponentFixture<HelpInlineTestComponent>;
  let cmp: HelpInlineTestComponent;
  let debugElement: DebugElement;
  let contentInfoProvider: SkyContentInfoProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelpInlineTestComponent],
      imports: [BrowserModule, SkyHelpInlineModule],
      providers: [SkyContentInfoProvider],
    });

    fixture = TestBed.createComponent(HelpInlineTestComponent);
    cmp = fixture.componentInstance as HelpInlineTestComponent;
    debugElement = fixture.debugElement;
    contentInfoProvider = TestBed.inject(SkyContentInfoProvider);

    fixture.detectChanges();
  });

  it('should emit a click event on button click', () => {
    debugElement
      .query(By.css('.sky-help-inline'))
      .triggerEventHandler('click', undefined);
    fixture.detectChanges();
    expect(cmp.showHelpText).toBe(true);
  });

  it('should pass accessibility (ariaLabel: undefined, ariaControls: undefined, ariaExpanded: undefined, contentInfoProvided: text)', async () => {
    contentInfoProvider.patchInfo({
      descriptor: { type: 'text', value: 'tile name' },
    });

    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Show help content for tile name',
      null,
      null,
      null,
    );
  });

  it('should pass accessibility (ariaLabel: "Test label", ariaControls: undefined, ariaExpanded: undefined, contentInfoProvided: text)', async () => {
    contentInfoProvider.patchInfo({
      descriptor: { type: 'text', value: 'tile name' },
    });

    cmp.ariaLabel = 'Test label';

    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility('Test label', null, null, null);
  });

  it('should pass accessibility (ariaLabel: undefined, ariaControls: undefined, ariaExpanded: undefined, contentInfoProvided: elementId)', async () => {
    const elementId = 'element-id';
    contentInfoProvider.patchInfo({
      descriptor: { type: 'elementId', value: elementId },
    });

    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(null, elementId, null, null);
  });

  it('should pass accessibility (ariaLabel: "Test label", ariaControls: undefined, ariaExpanded: undefined, contentInfoProvided: elementId)', async () => {
    contentInfoProvider.patchInfo({
      descriptor: { type: 'elementId', value: 'element-id' },
    });

    cmp.ariaLabel = 'Test label';

    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility('Test label', null, null, null);
  });

  it('should pass accessibility (ariaLabel: undefined, ariaControls: undefined, ariaExpanded: undefined, contentInfoProvided: none)', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Show help content',
      null,
      null,
      null,
    );
  });

  it('should pass accessibility (ariaLabel: undefined, ariaControls: "help-text", ariaExpanded: undefined)', async () => {
    cmp.ariaControls = 'help-text';
    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Show help content',
      null,
      'help-text',
      'false',
    );
  });

  it('should pass accessibility (ariaLabel: undefined, ariaControls: "help-text", ariaExpanded: false)', async () => {
    cmp.ariaControls = 'help-text';
    cmp.ariaExpanded = false;
    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Show help content',
      null,
      'help-text',
      'false',
    );
  });

  it('should pass accessibility (ariaLabel: undefined, ariaControls: "help-text", ariaExpanded: true)', async () => {
    cmp.ariaControls = 'help-text';
    cmp.ariaExpanded = true;
    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Show help content',
      null,
      'help-text',
      'true',
    );
  });

  it('should pass accessibility (ariaLabel: "Test label", ariaControls: undefined, ariaExpanded: undefined)', async () => {
    cmp.ariaLabel = 'Test label';
    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility('Test label', null, null, null);
  });

  it('should pass accessibility (ariaLabel: "Test label", ariaControls: "help-text", ariaExpanded: undefined)', async () => {
    cmp.ariaLabel = 'Test label';
    cmp.ariaControls = 'help-text';
    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Test label',
      null,
      'help-text',
      'false',
    );
  });

  it('should pass accessibility (ariaLabel: "Test label", ariaControls: "help-text", ariaExpanded: false)', async () => {
    cmp.ariaLabel = 'Test label';
    cmp.ariaControls = 'help-text';
    cmp.ariaExpanded = false;
    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Test label',
      null,
      'help-text',
      'false',
    );
  });

  it('should pass accessibility (ariaLabel: "Test label", ariaControls: "help-text", ariaExpanded: true)', async () => {
    cmp.ariaLabel = 'Test label';
    cmp.ariaControls = 'help-text';
    cmp.ariaExpanded = true;
    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility(
      'Test label',
      null,
      'help-text',
      'true',
    );
  });
});

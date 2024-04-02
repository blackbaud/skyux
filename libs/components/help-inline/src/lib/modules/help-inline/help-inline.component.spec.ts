import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyHelpInlineModule } from '../help-inline/help-inline.module';

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

  let fixture: ComponentFixture<HelpInlineTestComponent>;
  let component: HelpInlineTestComponent;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelpInlineTestComponent],
      imports: [BrowserModule, SkyHelpInlineModule],
    });

    fixture = TestBed.createComponent(HelpInlineTestComponent);
    component = fixture.componentInstance as HelpInlineTestComponent;
    debugElement = fixture.debugElement;

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

  it('should pass accessibility when ariaControls is set, ariaExpanded is false', async () => {
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

  it('should pass accessibility ariaControls is set, ariaExpanded is true', async () => {
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

  it('should pass accessibility ariaLabel is set', async () => {
    component.ariaLabel = 'Test label';

    fixture.detectChanges();
    await fixture.whenStable();

    await checkAriaPropertiesAndAccessibility('Test label', null, null);
  });

  it('should pass accessibility ariaLabel and ariaControls is set', async () => {
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

  it('should pass accessibility when ariaLabel and ariaControls is set, ariaExpanded is set to false', async () => {
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

  it('should pass accessibility ariaLabel and ariaControls is set, ariaExpanded is set to true', async () => {
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
});

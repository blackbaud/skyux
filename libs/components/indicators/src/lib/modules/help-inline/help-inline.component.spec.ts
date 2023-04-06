import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyHelpInlineModule } from '../help-inline/help-inline.module';

import { HelpInlineTestComponent } from './fixtures/help-inline.component.fixture';

describe('Help inline component', () => {
  let fixture: ComponentFixture<HelpInlineTestComponent>;
  let cmp: HelpInlineTestComponent;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelpInlineTestComponent],
      imports: [BrowserModule, SkyHelpInlineModule],
    });

    fixture = TestBed.createComponent(HelpInlineTestComponent);
    cmp = fixture.componentInstance as HelpInlineTestComponent;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should emit a click event on button click', () => {
    debugElement
      .query(By.css('.sky-help-inline'))
      .triggerEventHandler('click', undefined);
    fixture.detectChanges();
    expect(cmp.showHelpText).toBe(true);
  });

  it('should pass accessibility (ariaControls: undefined, ariaExpanded: undefined)', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.nativeElement
        .querySelector('.sky-help-inline')
        ?.getAttribute('aria-label')
    ).toBe('Show help content');
    expect(
      fixture.nativeElement
        .querySelector('.sky-help-inline')
        ?.getAttribute('aria-controls')
    ).toBeNull();
    expect(
      fixture.nativeElement
        .querySelector('.sky-help-inline')
        ?.getAttribute('aria-expanded')
    ).toBeNull();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should pass accessibility (ariaControls: "help-text", ariaExpanded: undefined)', async () => {
    cmp.ariaControls = 'help-text';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.nativeElement
        .querySelector('.sky-help-inline')
        ?.getAttribute('aria-label')
    ).toBe('Show help content');
    expect(
      fixture.nativeElement
        .querySelector('.sky-help-inline')
        ?.getAttribute('aria-controls')
    ).toBe('help-text');
    expect(
      fixture.nativeElement
        .querySelector('.sky-help-inline')
        ?.getAttribute('aria-expanded')
    ).toBe('false');
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should pass accessibility (ariaControls: "help-text", ariaExpanded: false)', async () => {
    cmp.ariaControls = 'help-text';
    cmp.ariaExpanded = false;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.nativeElement
        .querySelector('.sky-help-inline')
        ?.getAttribute('aria-label')
    ).toBe('Show help content');
    expect(
      fixture.nativeElement
        .querySelector('.sky-help-inline')
        ?.getAttribute('aria-controls')
    ).toBe('help-text');
    expect(
      fixture.nativeElement
        .querySelector('.sky-help-inline')
        ?.getAttribute('aria-expanded')
    ).toBe('false');
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should pass accessibility (ariaControls: "help-text", ariaExpanded: true)', async () => {
    cmp.ariaControls = 'help-text';
    cmp.ariaExpanded = true;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.nativeElement
        .querySelector('.sky-help-inline')
        ?.getAttribute('aria-label')
    ).toBe('Show help content');
    expect(
      fixture.nativeElement
        .querySelector('.sky-help-inline')
        ?.getAttribute('aria-controls')
    ).toBe('help-text');
    expect(
      fixture.nativeElement
        .querySelector('.sky-help-inline')
        ?.getAttribute('aria-expanded')
    ).toBe('true');
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

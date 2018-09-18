import {
  DebugElement
} from '@angular/core';

import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  BrowserModule,
  By
} from '@angular/platform-browser';

import {
  SkyAppTestModule
} from '@blackbaud/skyux-builder/runtime/testing/browser';

import { SkyHelpInlineModule } from '../help-inline/help-inline.module';
import { HelpInlineTestComponent } from './fixtures/help-inline.component.fixture';

describe('Help inline component', () => {
  let fixture: ComponentFixture<HelpInlineTestComponent>;
  let cmp: HelpInlineTestComponent;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HelpInlineTestComponent
      ],
      imports: [
        BrowserModule,
        SkyAppTestModule,
        SkyHelpInlineModule
      ]
    });

    fixture = TestBed.createComponent(HelpInlineTestComponent);
    cmp = fixture.componentInstance as HelpInlineTestComponent;
    debugElement = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should emit a click event on button click', () => {
    debugElement.query(By.css('.sky-help-inline')).triggerEventHandler('click', undefined);
    fixture.detectChanges();
    expect(cmp.buttonIsClicked).toBe(true);
  });
});

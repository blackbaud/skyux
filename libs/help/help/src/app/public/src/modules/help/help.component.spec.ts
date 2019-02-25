import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpComponent } from './help.component';

describe('BBHelpDirective', () => {
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HelpComponent
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HelpComponent);
  });

  it('should exist', () => {
    expect(fixture).toBeDefined();
  });
});

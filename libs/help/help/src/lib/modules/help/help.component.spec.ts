import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpComponent } from './help.component';
import { HelpModule } from './help.module';

describe('HelpComponent', () => {
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HelpModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HelpComponent);
  });

  it('should exist', () => {
    expect(fixture).toBeDefined();
  });
});

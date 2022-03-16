import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { StacheTutorialComponent } from './tutorial.component';
import { StacheTutorialModule } from './tutorial.module';

describe('StacheTutorialComponent', () => {
  let fixture: ComponentFixture<StacheTutorialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StacheTutorialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheTutorialComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});

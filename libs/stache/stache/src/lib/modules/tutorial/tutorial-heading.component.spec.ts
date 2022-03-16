import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { StacheTutorialHeadingComponent } from './tutorial-heading.component';
import { StacheTutorialModule } from './tutorial.module';

describe('StacheTutorialHeadingComponent', () => {
  let fixture: ComponentFixture<StacheTutorialHeadingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StacheTutorialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheTutorialHeadingComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});

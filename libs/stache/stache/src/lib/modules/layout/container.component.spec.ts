import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { StacheContainerComponent } from './container.component';
import { StacheLayoutModule } from './layout.module';

describe('StacheContainerComponent', () => {
  let fixture: ComponentFixture<StacheContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StacheLayoutModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheContainerComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});

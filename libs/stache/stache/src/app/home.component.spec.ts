import { TestBed } from '@angular/core/testing';
import { expect, SkyAppTestModule } from '@blackbaud/skyux-builder/runtime/testing/browser';

// Component we're going to test
import { HomeComponent } from './home.component';

describe('Home component', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyAppTestModule]
    });
  });

  it('should display a sky-alert', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    expect(fixture).toExist();
  });

});

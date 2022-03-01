import { TestBed } from '@angular/core/testing';

import { SkyNavbarFixturesModule } from './fixtures/navbar-fixtures.module';
import { SkyNavbarTestComponent } from './fixtures/navbar.component.fixture';

describe('Navbar component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyNavbarFixturesModule],
    });
  });

  it('should render navbar items', () => {
    const fixture = TestBed.createComponent(SkyNavbarTestComponent);

    fixture.detectChanges();

    const el = fixture.nativeElement;

    expect(el.querySelectorAll('.sky-navbar .sky-navbar-item').length).toBe(2);
  });
});

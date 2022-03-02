import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from '@skyux-sdk/testing';

import { SkyPageFixturesModule } from './fixtures/page-fixtures.module';
import { SkyPageTestComponent } from './fixtures/page.component.fixture';
import { SkyPageComponent } from './page.component';

describe('Page component', () => {
  const defaultBackgroundColor = 'rgb(0, 0, 0)';
  let styleEl: HTMLStyleElement;

  function validateBackgroundColor(expectedColor: string): void {
    expect(getComputedStyle(document.body).backgroundColor).toBe(expectedColor);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyPageFixturesModule],
    });

    styleEl = document.createElement('style');

    styleEl.appendChild(
      document.createTextNode(
        `body { background-color: ${defaultBackgroundColor}; }`
      )
    );

    document.head.appendChild(styleEl);
  });

  afterEach(() => {
    document.head.removeChild(styleEl);
  });

  it("should set the page's background color to white", () => {
    const fixture = TestBed.createComponent(SkyPageComponent);

    fixture.detectChanges();

    validateBackgroundColor('rgb(255, 255, 255)');

    fixture.destroy();

    validateBackgroundColor(defaultBackgroundColor);
  });

  it('should display child contents and provide a theme', () => {
    const fixture = TestBed.createComponent(SkyPageTestComponent);

    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveText('Test content');

    const themeOverrideEl = fixture.debugElement.query(
      By.css('.theme-override')
    );

    expect(getComputedStyle(themeOverrideEl.nativeElement).color).toBe(
      'rgb(100, 100, 100)'
    );
  });
});

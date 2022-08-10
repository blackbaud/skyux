import { TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyPageComponent } from './page.component';
import { SkyPageModule } from './page.module';

describe('Page component', () => {
  const defaultBackgroundColor = 'rgb(0, 0, 0)';
  let styleEl: HTMLStyleElement;

  function validateBackgroundColor(expectedColor: string): void {
    expect(getComputedStyle(document.body).backgroundColor).toBe(expectedColor);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyPageModule],
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
});

import { TestBed, async } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyKeyInfoFixturesModule } from './fixtures/key-info-fixtures.module';
import { KeyInfoTestComponent } from './fixtures/key-info.component.fixture';

describe('Key info component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyKeyInfoFixturesModule],
    });
  });

  it('should support vertical and horizontal layouts', async(() => {
    const fixture = TestBed.createComponent(KeyInfoTestComponent);
    const cmp = fixture.componentInstance as KeyInfoTestComponent;
    const el = fixture.nativeElement as Element;
    const horizontalCls = 'sky-key-info-horizontal';

    cmp.layout = 'horizontal';
    fixture.detectChanges();

    const keyInfoEl = el.querySelector('.sky-key-info');
    expect(keyInfoEl.classList.contains(horizontalCls)).toBe(true);

    // Should treat any other value as vertical
    // (enforced by the default .sky-key-info class).
    cmp.layout = undefined;
    fixture.detectChanges();

    expect(keyInfoEl.classList.contains(horizontalCls)).toBe(false);
    expect(fixture.nativeElement).toBeAccessible();
  }));

  it('should have the appropriate content in expected areas', async(() => {
    const fixture = TestBed.createComponent(KeyInfoTestComponent);
    const el = fixture.nativeElement as Element;

    fixture.detectChanges();

    expect(
      el.querySelectorAll('.sky-key-info-value sky-key-info-value').length
    ).toBe(1);
    expect(
      el.querySelectorAll('.sky-key-info-label sky-key-info-label').length
    ).toBe(1);
    expect(fixture.nativeElement).toBeAccessible();
  }));
});

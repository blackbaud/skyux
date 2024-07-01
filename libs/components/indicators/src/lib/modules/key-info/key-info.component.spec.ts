import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

import { SkyKeyInfoFixturesModule } from './fixtures/key-info-fixtures.module';
import { KeyInfoTestComponent } from './fixtures/key-info.component.fixture';

describe('Key info component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyKeyInfoFixturesModule],
    });
  });

  it('should support vertical and horizontal layouts', async () => {
    const fixture = TestBed.createComponent(KeyInfoTestComponent);
    const cmp = fixture.componentInstance as KeyInfoTestComponent;
    const el = fixture.nativeElement as Element;
    const horizontalCls = 'sky-key-info-horizontal';

    cmp.layout = 'horizontal';
    fixture.detectChanges();

    const keyInfoEl = el.querySelector('.sky-key-info');

    expect(keyInfoEl).not.toBeNull();
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    expect(keyInfoEl!.classList.contains(horizontalCls)).toBe(true);

    // Should treat any other value as vertical
    // (enforced by the default .sky-key-info class).
    cmp.layout = undefined;
    fixture.detectChanges();

    expect(keyInfoEl!.classList.contains(horizontalCls)).toBe(false);
    /* eslint-enable @typescript-eslint/no-non-null-assertion */

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should have the appropriate content in expected areas', async () => {
    const fixture = TestBed.createComponent(KeyInfoTestComponent);
    const el = fixture.nativeElement as Element;

    fixture.detectChanges();

    expect(
      el.querySelectorAll('.sky-key-info-value sky-key-info-value').length,
    ).toBe(1);
    expect(
      el.querySelectorAll('.sky-key-info-label sky-key-info-label').length,
    ).toBe(1);
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should show help when available', async () => {
    const fixture = TestBed.createComponent(KeyInfoTestComponent);
    const component = fixture.componentInstance;
    component.helpContent = 'Help.';
    fixture.detectChanges();
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const helpInline = await loader.getHarness(SkyHelpInlineHarness);
    expect(await helpInline.getAriaLabelledBy()).toBeTruthy();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  describe('a11y', () => {
    it('should be accessible when vertical', async () => {
      const fixture = TestBed.createComponent(KeyInfoTestComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible when horizontal', async () => {
      const fixture = TestBed.createComponent(KeyInfoTestComponent);

      const cmp = fixture.componentInstance as KeyInfoTestComponent;
      cmp.layout = 'horizontal';

      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

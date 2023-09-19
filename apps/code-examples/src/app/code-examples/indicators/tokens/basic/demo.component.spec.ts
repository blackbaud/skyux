import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyToken } from '@skyux/indicators';
import { SkyTokensHarness } from '@skyux/indicators/testing';

import { DemoComponent } from './demo.component';

describe('Tokens basic demo', () => {
  async function setupTest(): Promise<{
    tokensHarness: SkyTokensHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const tokensHarness = await loader.getHarness(
      SkyTokensHarness.with({ dataSkyId: 'color-tokens' })
    );

    return { tokensHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, DemoComponent],
    });
  });

  it('should display the expected initial tokens', async () => {
    const { tokensHarness } = await setupTest();

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo([
      'Red',
      'Black',
      'Blue',
      'Brown',
      'Green',
      'Orange',
      'Pink',
      'Purple',
      'Turquoise',
      'White',
      'Yellow',
    ]);
  });

  it('should update the tokens array when one is dismissed', async () => {
    const { tokensHarness, fixture } = await setupTest();

    const blueToken: SkyToken<{ name: string }> = {
      value: { name: 'Blue' },
    };

    expect(fixture.componentInstance.colors).toContain(blueToken);

    await tokensHarness.dismissTokens({
      text: 'Blue',
    });

    expect(fixture.componentInstance.colors).not.toContain(blueToken);
  });
});

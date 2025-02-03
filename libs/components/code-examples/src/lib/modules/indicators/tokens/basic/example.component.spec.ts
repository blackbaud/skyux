import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyToken } from '@skyux/indicators';
import { SkyTokensHarness } from '@skyux/indicators/testing';

import { IndicatorsTokensBasicExampleComponent } from './example.component';

describe('Tokens basic example', () => {
  async function setupTest(): Promise<{
    tokensHarness: SkyTokensHarness;
    fixture: ComponentFixture<IndicatorsTokensBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      IndicatorsTokensBasicExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const tokensHarness = await loader.getHarness(
      SkyTokensHarness.with({ dataSkyId: 'color-tokens' }),
    );

    return { tokensHarness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, IndicatorsTokensBasicExampleComponent],
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

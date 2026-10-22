import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';
import { SkyTokensHarness } from '@skyux/indicators/testing';

import { IndicatorsTokensCustomExampleComponent } from './example.component';

describe('Tokens basic example', () => {
  let initialTokenLabels: string[];

  async function setupTest(): Promise<{
    tokensHarness: SkyTokensHarness;
    loader: HarnessLoader;
    fixture: ComponentFixture<IndicatorsTokensCustomExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      IndicatorsTokensCustomExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const tokensHarness = await loader.getHarness(
      SkyTokensHarness.with({ dataSkyId: 'example-tokens' }),
    );

    return { tokensHarness, loader, fixture };
  }

  async function clickButton(
    loader: HarnessLoader,
    buttonName: 'change' | 'destroy' | 'focus-last' | 'reset',
  ): Promise<void> {
    const buttonHarness = await loader.getHarness(
      SkyButtonHarness.with({
        dataSkyId: `tokens-example-${buttonName}-button`,
      }),
    );

    await buttonHarness.click();
  }

  beforeEach(() => {
    initialTokenLabels = [
      'Canada',
      'Older than 55',
      'Employed',
      'Added before 2018',
    ];

    TestBed.configureTestingModule({
      imports: [IndicatorsTokensCustomExampleComponent],
    });
  });

  it('should display the expected initial tokens', async () => {
    const { tokensHarness } = await setupTest();

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo(
      initialTokenLabels,
    );
  });

  it('should display the selected token label when the user selects a token', async () => {
    const { tokensHarness, fixture } = await setupTest();

    const employedToken = (await tokensHarness.getTokens())[2];
    await employedToken.select();

    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        '.tokens-example-selected',
      )?.textContent,
    ).toEqual('Employed');
  });

  it('should change tokens when the user clicks the "Change tokens" button', async () => {
    const { tokensHarness, loader } = await setupTest();

    await clickButton(loader, 'change');

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo([
      'Paid',
      'Pending',
      'Past due',
    ]);
  });

  it('should reset tokens when the user clicks the "Reset tokens" button', async () => {
    const { tokensHarness, loader } = await setupTest();

    await clickButton(loader, 'change');

    await expectAsync(tokensHarness.getTokensText()).not.toBeResolvedTo(
      initialTokenLabels,
    );

    await clickButton(loader, 'reset');

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo(
      initialTokenLabels,
    );
  });

  it('should destroy tokens when the user clicks the "Destroy tokens" button', async () => {
    const { tokensHarness, loader } = await setupTest();

    await clickButton(loader, 'destroy');

    await expectAsync(tokensHarness.getTokens()).toBeResolvedTo([]);
  });

  it('should focus the last token when the user clicks the "Focus last token" button', async () => {
    const { tokensHarness, loader } = await setupTest();

    const tokens = await tokensHarness.getTokens();
    const lastToken = tokens[tokens.length - 1];

    await expectAsync(lastToken.isFocused()).toBeResolvedTo(false);

    await clickButton(loader, 'focus-last');

    await expectAsync(lastToken.isFocused()).toBeResolvedTo(true);
  });
});

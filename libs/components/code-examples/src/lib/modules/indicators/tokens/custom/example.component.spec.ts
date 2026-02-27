import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyTokensHarness } from '@skyux/indicators/testing';

import { IndicatorsTokensCustomExampleComponent } from './example.component';

describe('Tokens basic example', () => {
  let initialTokenLabels: string[];

  async function setupTest(): Promise<{
    tokensHarness: SkyTokensHarness;
    fixture: ComponentFixture<IndicatorsTokensCustomExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      IndicatorsTokensCustomExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const tokensHarness = await loader.getHarness(
      SkyTokensHarness.with({ dataSkyId: 'example-tokens' }),
    );

    return { tokensHarness, fixture };
  }

  function clickButton(
    fixture: ComponentFixture<IndicatorsTokensCustomExampleComponent>,
    buttonName: 'change' | 'destroy' | 'focus-last' | 'reset',
  ): void {
    const btn = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLButtonElement>(`.tokens-example-${buttonName}-btn`);

    btn?.click();
  }

  beforeEach(() => {
    initialTokenLabels = [
      'Canada',
      'Older than 55',
      'Employed',
      'Added before 2018'];

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
    const { tokensHarness, fixture } = await setupTest();

    clickButton(fixture, 'change');

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo([
      'Paid',
      'Pending',
      'Past due']);
  });

  it('should reset tokens when the user clicks the "Reset tokens" button', async () => {
    const { tokensHarness, fixture } = await setupTest();

    clickButton(fixture, 'change');

    await expectAsync(tokensHarness.getTokensText()).not.toBeResolvedTo(
      initialTokenLabels,
    );

    clickButton(fixture, 'reset');

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo(
      initialTokenLabels,
    );
  });

  it('should destroy tokens when the user clicks the "Destroy tokens" button', async () => {
    const { tokensHarness, fixture } = await setupTest();

    clickButton(fixture, 'destroy');

    await expectAsync(tokensHarness.getTokens()).toBeResolvedTo([]);
  });

  it('should focus the last token when the user clicks the "Focus last token" button', async () => {
    const { tokensHarness, fixture } = await setupTest();

    const tokens = await tokensHarness.getTokens();
    const lastToken = tokens[tokens.length - 1];

    await expectAsync(lastToken.isFocused()).toBeResolvedTo(false);

    clickButton(fixture, 'focus-last');

    await expectAsync(lastToken.isFocused()).toBeResolvedTo(true);
  });
});

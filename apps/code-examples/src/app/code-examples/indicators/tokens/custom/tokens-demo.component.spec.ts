import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyTokensHarness } from '@skyux/indicators/testing';

import { TokensDemoComponent } from './tokens-demo.component';
import { TokensDemoModule } from './tokens-demo.module';

describe('Tokens basic demo', () => {
  let initialTokenLabels: string[];

  async function setupTest() {
    const fixture = TestBed.createComponent(TokensDemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const tokensHarness = await loader.getHarness(
      SkyTokensHarness.with({ dataSkyId: 'demo-tokens' })
    );

    return { tokensHarness, fixture };
  }

  function clickButton(
    fixture: ComponentFixture<TokensDemoComponent>,
    buttonName: 'change' | 'destroy' | 'focus-last' | 'reset'
  ): void {
    fixture.nativeElement
      .querySelector(`.tokens-demo-${buttonName}-btn`)
      .click();
  }

  beforeEach(() => {
    initialTokenLabels = [
      'Canada',
      'Older than 55',
      'Employed',
      'Added before 2018',
    ];

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TokensDemoModule],
    });
  });

  it('should display the expected initial tokens', async () => {
    const { tokensHarness } = await setupTest();

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo(
      initialTokenLabels
    );
  });

  it('should display the selected token label when the user selects a token', async () => {
    const { tokensHarness, fixture } = await setupTest();

    const employedToken = (await tokensHarness.getTokens())[2];
    await employedToken.select();

    expect(
      fixture.nativeElement.querySelector('.tokens-demo-selected').innerText
    ).toBe('Employed');
  });

  it('should change tokens when the user clicks the "Change tokens" button', async () => {
    const { tokensHarness, fixture } = await setupTest();

    clickButton(fixture, 'change');

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo([
      'Paid',
      'Pending',
      'Past due',
    ]);
  });

  it('should reset tokens when the user clicks the "Reset tokens" button', async () => {
    const { tokensHarness, fixture } = await setupTest();

    clickButton(fixture, 'change');

    await expectAsync(tokensHarness.getTokensText()).not.toBeResolvedTo(
      initialTokenLabels
    );

    clickButton(fixture, 'reset');

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo(
      initialTokenLabels
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

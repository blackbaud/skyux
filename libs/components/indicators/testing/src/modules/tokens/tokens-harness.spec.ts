import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokensHarnessTestComponent } from './fixtures/tokens-harness-test.component';
import { TokensHarnessTestModule } from './fixtures/tokens-harness-test.module';
import { SkyTokensHarness } from './tokens-harness';

describe('Tokens harness', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    tokensHarness: SkyTokensHarness;
    fixture: ComponentFixture<TokensHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [TokensHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TokensHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const tokensHarness = await loader.getHarness(
      SkyTokensHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { tokensHarness, fixture, loader };
  }

  it('should return token harnesses', async () => {
    const { tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    const tokens = await tokensHarness.getTokens();
    expect(tokens.length).toEqual(3);
    await expectAsync(tokens[0].getText()).toBeResolvedTo('Red');
  });

  it('should return empty array when no tokens exist and no filters provided', async () => {
    const { tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    await tokensHarness.dismissTokens();

    const tokens = await tokensHarness.getTokens();
    expect(tokens.length).toEqual(0);
  });

  it('should get a specific token that meets criteria', async () => {
    const { tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    const token = await tokensHarness.getToken({ text: 'Red' });
    await expectAsync(token.getText()).toBeResolvedTo('Red');
  });

  it('should return filtered tokens when filters match', async () => {
    const { tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    const tokens = await tokensHarness.getTokens({ text: 'Red' });
    expect(tokens.length).toEqual(1);
    await expectAsync(tokens[0].getText()).toBeResolvedTo('Red');
  });

  it('should return tokens text content', async () => {
    const { tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo([
      'Red',
      'Green',
      'Blue',
    ]);
  });

  it('should dismiss all tokens', async () => {
    const { tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo([
      'Red',
      'Green',
      'Blue',
    ]);

    await tokensHarness.dismissTokens();

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo([]);
  });

  it('should dismiss tokens based on filters', async () => {
    const { tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo([
      'Red',
      'Green',
      'Blue',
    ]);

    await tokensHarness.dismissTokens({ text: 'Red' });

    await expectAsync(tokensHarness.getTokensText()).toBeResolvedTo([
      'Green',
      'Blue',
    ]);
  });

  it('should throw error if dismissing and not dismissible token', async () => {
    const { fixture, tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    fixture.componentInstance.dismissible = false;

    const tokens = await tokensHarness.getTokens();

    await expectAsync(tokens[0].isDismissible()).toBeResolvedTo(false);
    await expectAsync(tokens[0].dismiss()).toBeRejectedWithError(
      'Could not dismiss the token because it is not dismissible.',
    );
  });

  it('should select a token', async () => {
    const { fixture, tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    spyOn(fixture.componentInstance, 'onTokenSelected');

    const tokens = await tokensHarness.getTokens();
    await tokens[0].select();

    expect(fixture.componentInstance.onTokenSelected).toHaveBeenCalledOnceWith({
      token: { value: { name: 'Red' } },
    });
  });

  it('should return the disabled state of a token', async () => {
    const { fixture, tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    const tokens = await tokensHarness.getTokens();

    await expectAsync(tokens[0].isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    await expectAsync(tokens[0].isDisabled()).toBeResolvedTo(true);
  });

  it('should throw an error selecting a token the token is disabled', async () => {
    const { fixture, tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const tokens = await tokensHarness.getTokens();

    await expectAsync(tokens[0].select()).toBeRejectedWithError(
      'Could not select the token because it is disabled.',
    );
  });

  it('should return the focused state of a token', async () => {
    const { fixture, tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    const firstToken = (await tokensHarness.getTokens())[0];

    await expectAsync(firstToken.isFocused()).toBeResolvedTo(false);

    fixture.nativeElement
      .querySelectorAll('sky-token .sky-token-btn')[0]
      .focus();

    await expectAsync(firstToken.isFocused()).toBeResolvedTo(true);
  });
});

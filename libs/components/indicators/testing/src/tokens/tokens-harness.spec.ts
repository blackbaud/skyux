import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { TokensHarnessTestComponent } from './fixtures/tokens-harness-test.component';
import { TokensHarnessTestModule } from './fixtures/tokens-harness-test.module';
import { SkyTokensHarness } from './tokens-harness';

describe('Tokens harness', () => {
  async function setupTest(options: { dataSkyId: string }) {
    await TestBed.configureTestingModule({
      imports: [TokensHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TokensHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const tokensHarness = await loader.getHarness(
      SkyTokensHarness.with({ dataSkyId: options.dataSkyId })
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

  it('should throw error if dismissing and undismissible token', async () => {
    const { fixture, tokensHarness } = await setupTest({
      dataSkyId: 'my-tokens',
    });

    fixture.componentInstance.dismissible = false;

    const tokens = await tokensHarness.getTokens();

    await expectAsync(tokens[0].isDismissible()).toBeResolvedTo(false);
    await expectAsync(tokens[0].dismiss()).toBeRejectedWithError(
      'Could not dismiss the token because it is not dismissable.'
    );
  });
});

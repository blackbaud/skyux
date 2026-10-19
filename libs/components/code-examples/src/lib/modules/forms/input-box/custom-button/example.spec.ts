import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import {
  SkyInputBoxButtonHarness,
  SkyInputBoxHarness,
} from '@skyux/forms/testing';
import { FormsInputBoxWithCustomButtonExample } from './example';
import { FormsInputBoxNumberGenerator } from './number-generator';

describe('Input box with custom button example', () => {
  const initialValue = 123;

  async function setupTest(options: {
    inputBoxDataSkyId: string;
    inputBoxButtonDataSkyId: string;
  }): Promise<{
    inputBoxHarness: SkyInputBoxHarness;
    inputBoxButtonHarness: SkyInputBoxButtonHarness;
    mockGenerator: jasmine.SpyObj<FormsInputBoxNumberGenerator>;
  }> {
    const mockGenerator = jasmine.createSpyObj<FormsInputBoxNumberGenerator>(
      'FormsInputBoxNumberGenerator',
      ['generate'],
    );

    mockGenerator.generate.and.returnValue(initialValue);

    TestBed.configureTestingModule({
      providers: [
        { provide: FormsInputBoxNumberGenerator, useValue: mockGenerator },
      ],
    });

    const fixture = TestBed.createComponent(
      FormsInputBoxWithCustomButtonExample,
    );

    fixture.detectChanges();
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const inputBoxHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: options.inputBoxDataSkyId }),
    );

    const inputBoxButtonHarness = await loader.getHarness(
      SkyInputBoxButtonHarness.with({
        dataSkyId: options.inputBoxButtonDataSkyId,
      }),
    );

    return { inputBoxHarness, inputBoxButtonHarness, mockGenerator };
  }

  it('should configure the generate button', async () => {
    const { inputBoxButtonHarness } = await setupTest({
      inputBoxButtonDataSkyId: 'number-generate',
      inputBoxDataSkyId: 'number',
    });

    await expectAsync(inputBoxButtonHarness.getIconName()).toBeResolvedTo(
      'arrow-sync',
    );
    await expectAsync(inputBoxButtonHarness.getLabelText()).toBeResolvedTo(
      'Generate a random number',
    );
  });

  it('should update the input with a new number when the generate button is clicked', async () => {
    const { inputBoxHarness, inputBoxButtonHarness, mockGenerator } =
      await setupTest({
        inputBoxButtonDataSkyId: 'number-generate',
        inputBoxDataSkyId: 'number',
      });

    const input = await inputBoxHarness.querySelector('input');

    await expectAsync(input.getProperty('value')).toBeResolvedTo(
      initialValue.toString(10),
    );

    mockGenerator.generate.and.returnValue(456);

    await inputBoxButtonHarness.click();

    await expectAsync(input.getProperty('value')).toBeResolvedTo('456');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';

import { ComponentHarness, HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormsButtonInModalExample } from './example';

class UserNameHarness extends ComponentHarness {
  public static hostSelector = 'input[data-sky-id="user-name-input"]';
}

describe('Basic button in modal example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<FormsButtonInModalExample>;
    loader: HarnessLoader;
    rootLoader: HarnessLoader;
  }> {
    const fixture = TestBed.createComponent(FormsButtonInModalExample);

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    fixture.detectChanges();
    await fixture.whenStable();

    return {
      fixture,
      loader,
      rootLoader,
    };
  }

  it('should save the user modal when Save is clicked', async () => {
    const { fixture, loader, rootLoader } = await setupTest();

    const addUserButton = await loader.getHarness(
      SkyButtonHarness.with({
        dataSkyId: 'add-button',
      }),
    );

    await addUserButton.click();

    const userNameHarness = await rootLoader.getHarness(UserNameHarness);
    const userNameHarnessHost = await userNameHarness.host();

    await userNameHarnessHost.sendKeys('test.user');

    const saveButtonHarness = await rootLoader.getHarness(
      SkyButtonHarness.with({
        dataSkyId: 'user-save-button',
      }),
    );

    await saveButtonHarness.click();

    const userList = (fixture.nativeElement as HTMLElement).querySelector('ul');

    expect(userList).not.toBeNull();

    const userListItems = userList?.querySelectorAll('li');

    expect(userListItems?.length).toBe(1);
    expect(userListItems?.[0].innerText.trim()).toBe('test.user');
  });

  fit('should not save the user modal when Cancel is clicked', async () => {
    const { fixture, loader, rootLoader } = await setupTest();

    const addUserButton = await loader.getHarness(
      SkyButtonHarness.with({
        dataSkyId: 'add-button',
      }),
    );

    await addUserButton.click();

    const cancelButtonHarness = await rootLoader.getHarness(
      SkyButtonHarness.with({
        dataSkyId: 'user-cancel-button',
      }),
    );

    await cancelButtonHarness.click();

    const userList = (fixture.nativeElement as HTMLElement).querySelector('ul');

    expect(userList).toBeNull();
  });
});

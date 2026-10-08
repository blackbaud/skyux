import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyButtonHarness, SkyInputBoxHarness } from '@skyux/forms/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormsButtonInModalExample } from './example';

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

    const userNameHarness = await rootLoader.getHarness(
      SkyInputBoxHarness.with({
        dataSkyId: 'user-name-input-box',
      }),
    );

    const userNameInput = await userNameHarness.querySelector('input');

    await userNameInput.sendKeys('test.user');

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

  it('should not save the user modal when Cancel is clicked', async () => {
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

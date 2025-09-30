import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SkyDataManagerHarness } from '@skyux/data-manager/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyRepeaterHarness } from '@skyux/lists/testing';
import { SkyPageHarness } from '@skyux/pages/testing';
import { SkySplitViewHarness } from '@skyux/split-view/testing';

import { PagesPageDataManagerSplitViewFitLayoutExampleComponent } from './example.component';

describe('Data manager with split view in a fit layout page example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<PagesPageDataManagerSplitViewFitLayoutExampleComponent>;
    loader: HarnessLoader;
    component: PagesPageDataManagerSplitViewFitLayoutExampleComponent;
  }> {
    await TestBed.configureTestingModule({
      imports: [PagesPageDataManagerSplitViewFitLayoutExampleComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      PagesPageDataManagerSplitViewFitLayoutExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const component = fixture.componentInstance;

    return { fixture, loader, component };
  }

  it('should create the component', async () => {
    const { fixture, component } = await setupTest();

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should have correct page layout', async () => {
    const { fixture, loader } = await setupTest();

    fixture.detectChanges();

    const pageHarness = await loader.getHarness(SkyPageHarness);
    await expectAsync(pageHarness.getLayout()).toBeResolvedTo('fit');
  });

  it('should initialize with first item selected', async () => {
    const { fixture, component } = await setupTest();

    fixture.detectChanges();

    expect(component.activeIndex).toBe(0);
    expect(component.activeRecord).toEqual(component.items[0]);
  });

  it('should set up data manager with correct configuration', async () => {
    const { fixture, loader } = await setupTest();

    fixture.detectChanges();

    const dataManagerHarness = await loader.getHarness(SkyDataManagerHarness);

    // Verify dock type is 'fill'
    await expectAsync(dataManagerHarness.getDockType()).toBeResolvedTo('fill');

    // Get the data view
    const dataView = await dataManagerHarness.getView({
      viewId: 'dataManagerView',
    });
    expect(dataView).toBeTruthy();
  });

  it('should set up split view with correct configuration', async () => {
    const { fixture, loader } = await setupTest();

    fixture.detectChanges();

    const splitViewHarness = await loader.getHarness(SkySplitViewHarness);

    // Verify dock type is 'fill'
    await expectAsync(splitViewHarness.getDockType()).toBeResolvedTo('fill');

    // Verify both drawer and workspace are visible
    await expectAsync(splitViewHarness.getDrawerIsVisible()).toBeResolvedTo(
      true,
    );
    await expectAsync(splitViewHarness.getWorkspaceIsVisible()).toBeResolvedTo(
      true,
    );

    // Get drawer and workspace harnesses
    const drawerHarness = await splitViewHarness.getDrawer();
    const workspaceHarness = await splitViewHarness.getWorkspace();

    // Verify aria labels
    await expectAsync(drawerHarness.getAriaLabel()).toBeResolvedTo(
      'Transaction list',
    );
    await expectAsync(workspaceHarness.getAriaLabel()).toBeResolvedTo(
      'Transaction form',
    );
  });

  it('should display repeater items in the drawer', async () => {
    const { fixture, loader, component } = await setupTest();

    fixture.detectChanges();
    await fixture.whenStable();

    const splitViewHarness = await loader.getHarness(SkySplitViewHarness);
    const drawerHarness = await splitViewHarness.getDrawer();

    // Get the repeater harness from the drawer
    const repeaterHarness =
      await drawerHarness.queryHarness(SkyRepeaterHarness);
    expect(repeaterHarness).toBeTruthy();

    // Verify all items are displayed
    const repeaterItems = await repeaterHarness.getRepeaterItems();
    expect(repeaterItems.length).toBe(4);

    // Verify the active index is properly set in the component (first item should be active initially)
    expect(component.activeIndex).toBe(0);
  });

  it('should display form fields in the workspace', async () => {
    const { fixture, loader, component } = await setupTest();

    fixture.detectChanges();
    await fixture.whenStable();

    const splitViewHarness = await loader.getHarness(SkySplitViewHarness);
    const workspaceHarness = await splitViewHarness.getWorkspace();
    const contentHarness = await workspaceHarness.getContent();

    // Get input box harnesses
    const inputBoxes = await contentHarness.queryHarnesses(SkyInputBoxHarness);
    expect(inputBoxes.length).toBe(2);

    // Verify the input labels
    await expectAsync(inputBoxes[0].getLabelText()).toBeResolvedTo(
      'Approved amount',
    );
    await expectAsync(inputBoxes[1].getLabelText()).toBeResolvedTo('Comments');

    // Verify initial values match the first item using form controls
    const approvedAmountControl =
      component.splitViewDemoForm.controls['approvedAmount'];
    const commentsControl = component.splitViewDemoForm.controls['comments'];

    expect(approvedAmountControl.value).toBe(73.19);
    expect(commentsControl.value).toBe('');
  });

  it('should switch active record when clicking repeater items', async () => {
    const { fixture, loader, component } = await setupTest();

    fixture.detectChanges();
    await fixture.whenStable();

    const splitViewHarness = await loader.getHarness(SkySplitViewHarness);
    const drawerHarness = await splitViewHarness.getDrawer();
    const repeaterHarness =
      await drawerHarness.queryHarness(SkyRepeaterHarness);
    const repeaterItems = await repeaterHarness.getRepeaterItems();

    // Verify initial state
    expect(component.activeIndex).toBe(0);
    expect(component.activeRecord.id).toBe(1);

    // Click on the second item (index 1)
    await repeaterItems[1].click();
    fixture.detectChanges();
    await fixture.whenStable();

    // Verify the active record changed
    expect(component.activeIndex).toBe(1);
    expect(component.activeRecord.id).toBe(2);
    expect(component.activeRecord.vendor).toBe('Office Max');

    // Verify form was updated with new record data
    const approvedAmountControl =
      component.splitViewDemoForm.controls['approvedAmount'];
    const commentsControl = component.splitViewDemoForm.controls['comments'];

    expect(approvedAmountControl.value).toBe(214.12);
    expect(commentsControl.value).toBe('');
  });

  it('should update form when editing form fields', async () => {
    const { fixture, component } = await setupTest();

    fixture.detectChanges();
    await fixture.whenStable();

    // Get form controls
    const approvedAmountControl =
      component.splitViewDemoForm.controls['approvedAmount'];
    const commentsControl = component.splitViewDemoForm.controls['comments'];

    // Verify initial values
    expect(approvedAmountControl.value).toBe(73.19);
    expect(commentsControl.value).toBe('');
    expect(component.splitViewDemoForm.dirty).toBe(false);

    // Update form values - setValue() doesn't mark form as dirty, so we need to mark it explicitly
    approvedAmountControl.setValue(100.0);
    approvedAmountControl.markAsDirty();
    commentsControl.setValue('Test comment');
    commentsControl.markAsDirty();

    fixture.detectChanges();

    // Verify form is dirty after changes
    expect(component.splitViewDemoForm.dirty).toBe(true);

    // Verify new values
    expect(approvedAmountControl.value).toBe(100.0);
    expect(commentsControl.value).toBe('Test comment');
  });
});

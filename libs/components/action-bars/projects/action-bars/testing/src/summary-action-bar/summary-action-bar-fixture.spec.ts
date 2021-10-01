import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import {
  MockSkyMediaQueryService
} from '@skyux/core/testing';

import {
  SkyKeyInfoModule
} from '@skyux/indicators';

import {
  SummaryActionBarTestComponent
} from './fixtures/summary-action-bar-fixture-test.component';

import {
  SkySummaryActionBarFixture
} from './summary-action-bar-fixture';

import {
  SkySummaryActionBarTestingModule
} from './summary-action-bar.module';

describe('Summary action bar fixture', () => {
  let fixture: ComponentFixture<SummaryActionBarTestComponent>;
  let testComponent: SummaryActionBarTestComponent;
  let mockQueryService: MockSkyMediaQueryService;
  let summaryActionBarFixture: SkySummaryActionBarFixture;

  //#region helpers

  async function initiateResponsiveMode(breakpoint: SkyMediaBreakpoints): Promise<void> {
    mockQueryService.fire(breakpoint);
    fixture.detectChanges();
    return fixture.whenStable();
  }

  //#endregion

  beforeEach(() => {
    // replace the mock service before using in the test bed to avoid change detection errors
    mockQueryService = new MockSkyMediaQueryService();

    TestBed.configureTestingModule({
      declarations: [
        SummaryActionBarTestComponent
      ],
      imports: [
        SkyKeyInfoModule,
        SkySummaryActionBarTestingModule
      ],
      providers: [
        { provide: SkyMediaQueryService, useValue: mockQueryService }
      ]
    });

    fixture = TestBed.createComponent(
      SummaryActionBarTestComponent
    );
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    summaryActionBarFixture = new SkySummaryActionBarFixture(
      fixture,
      SummaryActionBarTestComponent.dataSkyId
    );
  });

  describe('primary action', () => {

    it('should expose primary action button default properties', async () => {
      const actionSpy = spyOn(testComponent, 'primaryActionClicked');
      const action = summaryActionBarFixture.primaryAction;

      // verify button state
      expect(action.buttonText).toEqual(testComponent.primaryAction.buttonText);
      expect(action.isDisabled).toEqual(testComponent.primaryAction.isDisabled);

      // verify the click methods work on the button state
      await action.click();
      expect(actionSpy).toHaveBeenCalled();
    });

    it('should expose primary action button default properties when responsive', async () => {
      await initiateResponsiveMode(SkyMediaBreakpoints.xs);
      const actionSpy = spyOn(testComponent, 'primaryActionClicked');
      const action = summaryActionBarFixture.primaryAction;

      // verify button state
      expect(action.buttonText).toEqual(testComponent.primaryAction.buttonText);
      expect(action.isDisabled).toEqual(testComponent.primaryAction.isDisabled);

      // verify the click methods work on the button state
      await action.click();
      expect(actionSpy).toHaveBeenCalled();
    });

    it('should expose primary action button properties if the properties change', () => {
      // modify the defaults
      testComponent.primaryAction = {
        buttonText: 'some action',
        isDisabled: true,
        click: () => testComponent.primaryActionClicked()
      };
      fixture.detectChanges();

      const action = summaryActionBarFixture.primaryAction;

      // verify button state
      expect(action.buttonText).toEqual(testComponent.primaryAction.buttonText);
      expect(action.isDisabled).toEqual(testComponent.primaryAction.isDisabled);
    });

  });

  describe('secondary actions', () => {

    it('should expose secondary action button default properties', async () => {
      const actionSpy = spyOn(testComponent, 'secondaryActionClicked');
      const actions = summaryActionBarFixture.secondaryActions;

      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];

        // verify button state
        expect(action.buttonText).toEqual(testComponent.secondaryActions[i].buttonText);
        expect(action.isDisabled).toEqual(testComponent.secondaryActions[i].isDisabled);

        // verify the click methods work on the button state
        await action.click();
        expect(actionSpy).toHaveBeenCalledWith(i);
      }
    });

    it('should expose secondary action button default properties when responsive', async () => {
      await initiateResponsiveMode(SkyMediaBreakpoints.xs);
      const actionSpy = spyOn(testComponent, 'secondaryActionClicked');
      const actions = summaryActionBarFixture.secondaryActions;

      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];

        // verify button state
        expect(action.buttonText).toEqual(testComponent.secondaryActions[i].buttonText);
        expect(action.isDisabled).toEqual(testComponent.secondaryActions[i].isDisabled);

        // verify the click methods work on the button state
        await action.click();
        expect(actionSpy).toHaveBeenCalledWith(i);
      }
    });

    it('should expose secondary action button properties if the properties change', async () => {
      // modify the defaults
      testComponent.secondaryActions = [
        {
          buttonText: 'some action',
          isDisabled: true,
          click: () => testComponent.secondaryActionClicked(0)
        }
      ];
      fixture.detectChanges();
      await fixture.whenStable();

      const actions = summaryActionBarFixture.secondaryActions;

      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];

        // verify button state
        expect(action.buttonText).toEqual(testComponent.secondaryActions[i].buttonText);
        expect(action.isDisabled).toEqual(testComponent.secondaryActions[i].isDisabled);
      }
    });

  });

  describe('cancel button', () => {

    it('should expose cancel action button default properties', async () => {
      const actionSpy = spyOn(testComponent, 'cancelActionClicked');
      const action = summaryActionBarFixture.cancelAction;

      // verify button state
      expect(action.buttonText).toEqual(testComponent.cancelAction.buttonText);
      expect(action.isDisabled).toEqual(testComponent.cancelAction.isDisabled);

      // verify the click methods work on the button state
      await action.click();
      expect(actionSpy).toHaveBeenCalled();
    });

    it('should expose cancel action button default properties when responsive', async () => {
      await initiateResponsiveMode(SkyMediaBreakpoints.xs);
      const actionSpy = spyOn(testComponent, 'cancelActionClicked');
      const action = summaryActionBarFixture.cancelAction;

      // verify button state
      expect(action.buttonText).toEqual(testComponent.cancelAction.buttonText);
      expect(action.isDisabled).toEqual(testComponent.cancelAction.isDisabled);

      // verify the click methods work on the button state
      await action.click();
      expect(actionSpy).toHaveBeenCalled();
    });

    it('should expose cancel action button properties if the properties change', async () => {
      // modify the defaults
      testComponent.cancelAction = {
        buttonText: 'some action',
        isDisabled: true,
        click: () => testComponent.cancelActionClicked()
      };
      fixture.detectChanges();
      await fixture.whenStable();

      const action = summaryActionBarFixture.cancelAction;

      // verify button state
      expect(action.buttonText).toEqual(testComponent.cancelAction.buttonText);
      expect(action.isDisabled).toEqual(testComponent.cancelAction.isDisabled);
    });
  });

  describe('summary content', () => {

    it('should support summary body query selectors', async () => {
      const summaryContent = summaryActionBarFixture.querySummaryBody('div');
      expect(SkyAppTestUtility.getText(summaryContent)).toEqual(testComponent.summaryBody);
    });

    it('should support summary body query all selectors', async () => {
      const results = summaryActionBarFixture.queryAllSummaryBody('div');
      expect(results).toExist();
      expect(results.length).toBe(1);

      const summaryContent = results[0];
      expect(SkyAppTestUtility.getText(summaryContent)).toEqual(testComponent.summaryBody);
    });

    it('should expose content body when responsive', async () => {
      await initiateResponsiveMode(SkyMediaBreakpoints.xs);

      const summaryContent = summaryActionBarFixture.querySummaryBody('div');
      expect(SkyAppTestUtility.getText(summaryContent)).toEqual(testComponent.summaryBody);
    });

    it('should expose content body even when not visible', async () => {
      await initiateResponsiveMode(SkyMediaBreakpoints.xs);

      // close the content
      await summaryActionBarFixture.toggleSummaryContentVisibility();
      expect(summaryActionBarFixture.summaryBodyIsVisible).toBeFalse();

      // verify the content matches
      // - we use textContent since safari/firefox won't populate innerText for hidden elements
      const summaryContent = summaryActionBarFixture.querySummaryBody('div');
      expect(summaryContent.textContent.trim()).toEqual(testComponent.summaryBody);
    });

    it('should open and close summary content when responsive', async () => {
      await initiateResponsiveMode(SkyMediaBreakpoints.xs);

      expect(summaryActionBarFixture.summaryBodyIsVisible).toBeTrue();

      await summaryActionBarFixture.toggleSummaryContentVisibility();

      expect(summaryActionBarFixture.summaryBodyIsVisible).toBeFalse();

      await summaryActionBarFixture.toggleSummaryContentVisibility();

      expect(summaryActionBarFixture.summaryBodyIsVisible).toBeTrue();
    });

    it('toggleContent should do nothing on large screen', async () => {
      expect(summaryActionBarFixture.summaryBodyIsVisible).toBeTrue();

      await summaryActionBarFixture.toggleSummaryContentVisibility();

      expect(summaryActionBarFixture.summaryBodyIsVisible).toBeTrue();
    });

  });

});

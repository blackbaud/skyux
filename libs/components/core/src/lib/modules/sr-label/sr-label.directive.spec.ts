import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SrLabelFixtureComponent } from './fixtures/sr-label.directive.fixture';

describe('Screen reader label directive', () => {
  function validateExists(
    el: HTMLElement,
    selector: string,
    exists = true
  ): void {
    if (exists) {
      expect(el.querySelector(selector)).toExist();
    } else {
      expect(el.querySelector(selector)).not.toExist();
    }
  }

  function validateLabels(
    fixture: ComponentFixture<SrLabelFixtureComponent>,
    options: {
      label1Exists?: boolean;
      label2Exists?: boolean;
      containerExists?: boolean;
    }
  ): void {
    const label1Id = '#test-sr-label-1';
    const label2Id = '#test-sr-label-2';
    const containerId = '#sky-sr-labels-container';
    const body = document.body;
    const testWrapper = fixture.nativeElement;

    if (options.label1Exists !== undefined) {
      validateExists(body, label1Id, options.label1Exists);
      validateExists(testWrapper, label1Id, false);
    }

    if (options.label2Exists !== undefined) {
      validateExists(body, label2Id, options.label2Exists);
      validateExists(testWrapper, label2Id, false);
    }

    if (options.containerExists !== undefined) {
      validateExists(body, containerId, options.containerExists);
    }
  }

  it('should render the label element in the container element in the body instead of where specified in the template', () => {
    const fixture = TestBed.createComponent(SrLabelFixtureComponent);
    fixture.detectChanges();

    validateLabels(fixture, { label1Exists: true, containerExists: true });
  });

  it('should not render the label element or the container element in the body of the document or the template if createLabel is false', () => {
    const fixture = TestBed.createComponent(SrLabelFixtureComponent);
    fixture.componentInstance.createLabel1 = false;
    fixture.detectChanges();

    validateLabels(fixture, { label1Exists: false, containerExists: false });
  });

  it('should remove the label element and container element from the body if createLabel is changed to false', () => {
    const fixture = TestBed.createComponent(SrLabelFixtureComponent);
    fixture.detectChanges();

    validateLabels(fixture, { label1Exists: true, containerExists: true });

    fixture.componentInstance.createLabel1 = false;
    fixture.detectChanges();

    validateLabels(fixture, { label1Exists: false, containerExists: false });
  });

  it('should remove the label element but leave the container element in the body if createLabel is changed to false but another sr label exists', () => {
    const fixture = TestBed.createComponent(SrLabelFixtureComponent);
    fixture.componentInstance.createLabel2 = true;
    fixture.detectChanges();

    validateLabels(fixture, {
      label1Exists: true,
      label2Exists: true,
      containerExists: true,
    });

    fixture.componentInstance.createLabel1 = false;
    fixture.detectChanges();

    validateLabels(fixture, {
      label1Exists: false,
      label2Exists: true,
      containerExists: true,
    });
  });

  it('should remove the label element and container element if the component specifying the label element is destroyed', () => {
    const fixture = TestBed.createComponent(SrLabelFixtureComponent);
    fixture.detectChanges();

    validateLabels(fixture, {
      label1Exists: true,
      containerExists: true,
    });

    fixture.destroy();

    validateLabels(fixture, {
      label1Exists: false,
      containerExists: false,
    });
  });
});

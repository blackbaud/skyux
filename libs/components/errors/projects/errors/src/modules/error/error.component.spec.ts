import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyLibResourcesService } from '@skyux/i18n';

import { forkJoin } from 'rxjs';

import { take } from 'rxjs/operators';

import { ErrorTestComponent } from './fixtures/error.component.fixture';

import { SkyErrorFixturesModule } from './fixtures/error-fixtures.module';

describe('Error component', () => {
  let component: ErrorTestComponent;
  let el: any;
  let fixture: ComponentFixture<ErrorTestComponent>;
  let resourcesService: SkyLibResourcesService;
  const resourceStrings: any = {};

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [SkyErrorFixturesModule],
    }).createComponent(ErrorTestComponent);

    el = fixture.nativeElement;
    fixture.detectChanges();
    component = fixture.componentInstance;

    resourcesService = TestBed.inject(SkyLibResourcesService);
    forkJoin([
      resourcesService.getString('skyux_errors_broken_description'),
      resourcesService.getString('skyux_errors_broken_title'),
      resourcesService.getString('skyux_errors_construction_description'),
      resourcesService.getString('skyux_errors_construction_title'),
      resourcesService.getString('skyux_errors_not_found_description'),
      resourcesService.getString('skyux_errors_not_found_title'),
      resourcesService.getString('skyux_errors_security_description'),
      resourcesService.getString('skyux_errors_security_title'),
    ])
      .pipe(take(1))
      .subscribe((resources: string[]) => {
        resourceStrings.brokenDescription = resources[0];
        resourceStrings.brokenTitle = resources[1];
        resourceStrings.constructionDescription = resources[2];
        resourceStrings.constructionTitle = resources[3];
        resourceStrings.notFoundDescription = resources[4];
        resourceStrings.notFoundTitle = resources[5];
        resourceStrings.securityDescription = resources[6];
        resourceStrings.securityTitle = resources[7];
      });
  });

  function getImageContainer(selector: string): HTMLElement {
    return el.querySelector(`${selector} .sky-error-image-container`);
  }

  function getBrokenImage(selector: string): HTMLElement {
    return el.querySelector(`${selector} .sky-error-broken-image`);
  }

  function getNotFoundImage(selector: string): HTMLElement {
    return el.querySelector(`${selector} .sky-error-notfound-image`);
  }

  function getConstructionImage(selector: string): HTMLElement {
    return el.querySelector(`${selector} .sky-error-construction-image`);
  }

  function getSecurityImage(selector: string): HTMLElement {
    return el.querySelector(`${selector} .sky-error-security-image`);
  }

  function getErrorTitle(selector: string): HTMLElement {
    return el.querySelector(`${selector} .sky-error-title`);
  }

  function getErrorDescription(selector: string): HTMLElement {
    return el.querySelector(`${selector} .sky-error-description`);
  }

  function getErrorActionButton(selector: string): HTMLElement {
    return el.querySelector(`${selector} .sky-error-action button`);
  }

  it('error type broken displays correct image, title, description, and action text', () => {
    component.errorType = 'broken';
    fixture.detectChanges();

    expect(getBrokenImage('#test-error')).toExist();
    expect(getNotFoundImage('#test-error')).not.toExist();
    expect(getConstructionImage('#test-error')).not.toExist();
    expect(getSecurityImage('#test-error')).not.toExist();

    expect(getErrorTitle('#test-error')).toHaveText(
      resourceStrings.brokenTitle
    );
    expect(getErrorDescription('#test-error')).toHaveText(
      resourceStrings.brokenDescription
    );
    expect(getErrorActionButton('#test-error')).toHaveText(
      component.buttonText
    );
  });

  it('error type broken does not display image when "showImage" is false', () => {
    component.errorType = 'broken';
    component.showImage = false;
    fixture.detectChanges();

    expect(getImageContainer('#test-error')).not.toExist();
    expect(getBrokenImage('#test-error')).not.toExist();
    expect(getNotFoundImage('#test-error')).not.toExist();
    expect(getConstructionImage('#test-error')).not.toExist();
    expect(getSecurityImage('#test-error')).not.toExist();

    expect(getErrorTitle('#test-error')).toHaveText(
      resourceStrings.brokenTitle
    );
    expect(getErrorDescription('#test-error')).toHaveText(
      resourceStrings.brokenDescription
    );
    expect(getErrorActionButton('#test-error')).toHaveText(
      component.buttonText
    );
  });

  it('error type notfound displays correct image, title, and action text', () => {
    component.errorType = 'notfound';
    fixture.detectChanges();

    expect(getBrokenImage('#test-error')).not.toExist();
    expect(getNotFoundImage('#test-error')).toExist();
    expect(getConstructionImage('#test-error')).not.toExist();
    expect(getSecurityImage('#test-error')).not.toExist();

    expect(getErrorTitle('#test-error')).toHaveText(
      resourceStrings.notFoundTitle
    );
    expect(getErrorDescription('#test-error')).toHaveText(
      resourceStrings.notFoundDescription
    );
    expect(getErrorActionButton('#test-error')).toHaveText(
      component.buttonText
    );
  });

  it('error type construction displays correct image, title, and action text', () => {
    component.errorType = 'construction';
    fixture.detectChanges();

    expect(getBrokenImage('#test-error')).not.toExist();
    expect(getNotFoundImage('#test-error')).not.toExist();
    expect(getConstructionImage('#test-error')).toExist();

    expect(getErrorTitle('#test-error')).toHaveText(
      resourceStrings.constructionTitle
    );
    expect(getErrorDescription('#test-error')).toHaveText(
      resourceStrings.constructionDescription
    );
    expect(getErrorActionButton('#test-error')).toHaveText(
      component.buttonText
    );
  });

  it('error type security displays correct image, title, description, and action text', () => {
    component.errorType = 'security';
    fixture.detectChanges();

    expect(getBrokenImage('#test-error')).not.toExist();
    expect(getNotFoundImage('#test-error')).not.toExist();
    expect(getConstructionImage('#test-error')).not.toExist();
    expect(getSecurityImage('#test-error')).toExist();

    expect(getErrorTitle('#test-error')).toHaveText(
      resourceStrings.securityTitle
    );
    expect(getErrorDescription('#test-error')).toHaveText(
      resourceStrings.securityDescription
    );
    expect(getErrorActionButton('#test-error')).toHaveText(
      component.buttonText
    );
  });

  it('error type custom displays correct image, title, description, and action text', () => {
    fixture.detectChanges();

    expect(getBrokenImage('#test-error-custom')).not.toExist();
    expect(getNotFoundImage('#test-error-custom')).not.toExist();
    expect(getConstructionImage('#test-error-custom')).not.toExist();
    expect(getSecurityImage('#test-error-custom')).not.toExist();

    expect(getImageContainer('#test-error-custom')).toHaveText(
      component.customImage
    );
    expect(getErrorTitle('#test-error-custom')).toHaveText(
      component.customTitle
    );
    expect(getErrorDescription('#test-error-custom')).toHaveText(
      component.customDescription
    );
    expect(getErrorActionButton('#test-error-custom')).toHaveText(
      component.buttonText
    );
  });

  it('can replace title and description', () => {
    component.errorType = 'broken';
    component.replaceDefaultDescription = true;
    component.replaceDefaultTitle = true;
    fixture.detectChanges();

    expect(getBrokenImage('#test-error-custom-replace-default')).toExist();
    expect(
      getNotFoundImage('#test-error-custom-replace-default')
    ).not.toExist();
    expect(
      getConstructionImage('#test-error-custom-replace-default')
    ).not.toExist();
    expect(
      getSecurityImage('#test-error-custom-replace-default')
    ).not.toExist();

    expect(getErrorTitle('#test-error-custom-replace-default')).toHaveText(
      `${component.customTitle}`
    );
    expect(
      getErrorDescription('#test-error-custom-replace-default')
    ).toHaveText(`${component.customDescription}`);
  });

  it('can append onto title and description', () => {
    component.errorType = 'broken';
    component.replaceDefaultDescription = false;
    component.replaceDefaultTitle = false;
    fixture.detectChanges();

    expect(getBrokenImage('#test-error-custom-replace-default')).toExist();
    expect(
      getNotFoundImage('#test-error-custom-replace-default')
    ).not.toExist();
    expect(
      getConstructionImage('#test-error-custom-replace-default')
    ).not.toExist();
    expect(
      getSecurityImage('#test-error-custom-replace-default')
    ).not.toExist();

    expect(getErrorTitle('#test-error-custom-replace-default')).toHaveText(
      `${resourceStrings.brokenTitle}  ${component.customTitle}`
    );
    expect(
      getErrorDescription('#test-error-custom-replace-default')
    ).toHaveText(
      `${resourceStrings.brokenDescription}  ${component.customDescription}`
    );
  });

  it('custom action method is called with action button is clicked', () => {
    spyOn(component, 'customAction');

    getErrorActionButton('#test-error').click();

    expect(component.customAction).toHaveBeenCalled();
  });

  it('Invalid error type text is ignored', () => {
    (component.errorType as string) = 'INVALID ERROR TYPE';
    fixture.detectChanges();

    expect(getBrokenImage('#test-error')).not.toExist();
    expect(getNotFoundImage('#test-error')).not.toExist();
    expect(getConstructionImage('#test-error')).not.toExist();
    expect(getSecurityImage('#test-error')).not.toExist();

    expect(getErrorTitle('#test-error')).toHaveText(
      resourceStrings.brokenTitle
    );
    expect(getErrorDescription('#test-error')).toHaveText(
      resourceStrings.brokenDescription
    );
    expect(getErrorActionButton('#test-error')).toHaveText(
      component.buttonText
    );
  });

  it('should be accessible', async () => {
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

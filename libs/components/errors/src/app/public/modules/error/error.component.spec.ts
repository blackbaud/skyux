import {
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  ErrorTestComponent
} from './fixtures/error.component.fixture';

import {
  SkyErrorFixturesModule
} from './fixtures/error-fixtures.module';

describe('Error component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyErrorFixturesModule
      ]
    });
  });

  it('error type broken displays correct image, title, description, and action text', () => {
    let html = `
    <sky-error errorType="broken">
      <sky-error-action>
        <button type="submit" class="sky-btn sky-btn-primary" (click)="customAction()">
          Refresh
        </button>
      </sky-error-action>
    </sky-error>`;

    let fixture = TestBed
      .overrideComponent(
        ErrorTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(ErrorTestComponent);

    let el = fixture.nativeElement;

    fixture.detectChanges();

    let title = 'Sorry, something went wrong.';
    let description = 'Try to refresh this page or come back later.';

    // check image
    expect(el.querySelector('.sky-error-broken-image')).toExist();
    expect(el.querySelector('.sky-error-notfound-image')).not.toExist();
    expect(el.querySelector('.sky-error-construction-image')).not.toExist();
    expect(el.querySelector('.sky-error-security-image')).not.toExist();

    expect(el.querySelector('.sky-error-title')).toHaveText(title);
    expect(el.querySelector('.sky-error-description')).toHaveText(description);
    expect(el.querySelector('.sky-error-action button')).toHaveText('Refresh');

    // Accessibility check
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  });

  it('error type notfound displays correct image, title, and action text', () => {
    let html = `
    <sky-error errorType="notfound">
      <sky-error-action>
        <button type="submit" class="sky-btn sky-btn-primary" (click)="customAction()">
          Refresh
        </button>
      </sky-error-action>
    </sky-error>`;

    let fixture = TestBed
      .overrideComponent(
        ErrorTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(ErrorTestComponent);

    let el = fixture.nativeElement;

    fixture.detectChanges();

    let title = 'Sorry, we can\'t reach that page.';

    // check image
    expect(el.querySelector('.sky-error-broken-image')).not.toExist();
    expect(el.querySelector('.sky-error-notfound-image')).toExist();
    expect(el.querySelector('.sky-error-construction-image')).not.toExist();
    expect(el.querySelector('.sky-error-security-image')).not.toExist();

    expect(el.querySelector('.sky-error-title')).toHaveText(title);
    expect(el.querySelector('.sky-error-action button')).toHaveText('Refresh');

    // Accessibility check
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  });

  it('error type construction displays correct image, title, and action text', () => {
    let html = `
    <sky-error errorType="construction">
      <sky-error-action>
        <button type="submit" class="sky-btn sky-btn-primary" (click)="customAction()">
          Refresh
        </button>
      </sky-error-action>
    </sky-error>`;

    let fixture = TestBed
      .overrideComponent(
        ErrorTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(ErrorTestComponent);

    let el = fixture.nativeElement;

    fixture.detectChanges();

    let title = 'This page will return soon.';
    let description =
    `Thanks for your patience while improvements are made!  Please check back in a little while.`;

    let actualDescription: string = el.querySelector('.sky-error-description').innerText.trim();
    let trimmedDescription = '';

    if (actualDescription.indexOf('\r\n') >= 0) {
      // IE inserts \r\n instead of \n
      trimmedDescription = actualDescription.replace(/(\r\n)/g, '');
    } else {
      trimmedDescription = actualDescription.replace(/(\n)/g, '');
    }

    // check image
    expect(el.querySelector('.sky-error-broken-image')).not.toExist();
    expect(el.querySelector('.sky-error-notfound-image')).not.toExist();
    expect(el.querySelector('.sky-error-construction-image')).toExist();

    expect(el.querySelector('.sky-error-title')).toHaveText(title);
    expect(trimmedDescription).toBe(description);
    expect(el.querySelector('.sky-error-action button')).toHaveText('Refresh');

    // Accessibility check
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  });

  it('error type security displays correct image, title, description, and action text', () => {
    let html = `
    <sky-error errorType="security">
      <sky-error-action>
        <button type="submit" class="sky-btn sky-btn-primary" (click)="customAction()">
          Refresh
        </button>
      </sky-error-action>
    </sky-error>`;

    let fixture = TestBed
      .overrideComponent(
        ErrorTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(ErrorTestComponent);

    let el = fixture.nativeElement;

    fixture.detectChanges();

    let title = 'You don\'t have permission to access that page.';

    // check image
    expect(el.querySelector('.sky-error-broken-image')).not.toExist();
    expect(el.querySelector('.sky-error-notfound-image')).not.toExist();
    expect(el.querySelector('.sky-error-construction-image')).not.toExist();
    expect(el.querySelector('.sky-error-security-image')).toExist();

    expect(el.querySelector('.sky-error-title')).toHaveText(title);
    expect(el.querySelector('.sky-error-action button')).toHaveText('Refresh');

    // Accessibility check
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  });

  it('error type custom displays correct image, title, description, and action text', () => {
    let html = `
    <sky-error>
      <sky-error-image>test image</sky-error-image>
      <sky-error-title>test title</sky-error-title>
      <sky-error-description>test description</sky-error-description>
      <sky-error-action>
        <button type="submit" class="sky-btn sky-btn-primary" (click)="customAction()">
          test action text
        </button>
      </sky-error-action>
    </sky-error>`;

    let fixture = TestBed
      .overrideComponent(
        ErrorTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(ErrorTestComponent);

    let el = fixture.nativeElement;

    fixture.detectChanges();

    // check image
    expect(el.querySelector('.sky-error-broken-image')).not.toExist();
    expect(el.querySelector('.sky-error-notfound-image')).not.toExist();
    expect(el.querySelector('.sky-error-construction-image')).not.toExist();
    expect(el.querySelector('.sky-error-security-image')).not.toExist();

    expect(el.querySelector('.sky-error-image-container')).toHaveText('test image');
    expect(el.querySelector('.sky-error-title')).toHaveText('test title');
    expect(el.querySelector('.sky-error-description')).toHaveText('test description');
    expect(el.querySelector('.sky-error-action button')).toHaveText('test action text');

    // Accessibility check
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  });

  it('error type custom can replace title and description', () => {
    let html = `
    <sky-error
      errorType="broken"
    >
      <sky-error-title
        [replaceDefaultTitle]="true"
      >
        test title
      </sky-error-title>
      <sky-error-description
        [replaceDefaultDescription]="true"
      >
        test description
      </sky-error-description>
    </sky-error>`;

    let fixture = TestBed
      .overrideComponent(
        ErrorTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(ErrorTestComponent);

    let el = fixture.nativeElement;

    fixture.detectChanges();

    // check image
    expect(el.querySelector('.sky-error-broken-image')).toExist();
    expect(el.querySelector('.sky-error-notfound-image')).not.toExist();
    expect(el.querySelector('.sky-error-construction-image')).not.toExist();
    expect(el.querySelector('.sky-error-security-image')).not.toExist();

    expect(el.querySelector('.sky-error-title')).toHaveText('test title');
    expect(el.querySelector('.sky-error-description')).toHaveText('test description');

    // Accessibility check
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  });

  it('custom action method is called with action button is clicked', () => {
    let html = `
    <sky-error errorType="broken">
      <sky-error-action>
        <button type="submit" class="sky-btn sky-btn-primary" (click)="customAction()">
          Refresh
        </button>
      </sky-error-action>
    </sky-error>`;

    let fixture = TestBed
      .overrideComponent(
        ErrorTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(ErrorTestComponent);

    let el = fixture.nativeElement;

    fixture.detectChanges();

    let component = fixture.componentInstance;

    spyOn(component, 'customAction');

    let actionButton = el.querySelector('.sky-error-action button');
    actionButton.click();
    fixture.detectChanges();

    expect(component.customAction).toHaveBeenCalled();
  });

  it('Invalid error type text is ignored', () => {
    let html = `
    <sky-error errorType="invalid-xx">
      <sky-error-image>test image</sky-error-image>
      <sky-error-title>test title</sky-error-title>
      <sky-error-description>test description</sky-error-description>
      <sky-error-action>
        <button type="submit" class="sky-btn sky-btn-primary" (click)="customAction()">
          test action text
        </button>
      </sky-error-action>
    </sky-error>`;

    let fixture = TestBed
      .overrideComponent(
        ErrorTestComponent,
        {
          set: {
            template: html
          }
        }
      )
      .createComponent(ErrorTestComponent);

    let el = fixture.nativeElement;

    fixture.detectChanges();

    // check image
    expect(el.querySelector('.sky-error-broken-image')).not.toExist();
    expect(el.querySelector('.sky-error-notfound-image')).not.toExist();
    expect(el.querySelector('.sky-error-construction-image')).not.toExist();
    expect(el.querySelector('.sky-error-security-image')).not.toExist();

    expect(el.querySelector('.sky-error-image-container')).toHaveText('test image');
    expect(el.querySelector('.sky-error-title')).toHaveText('test title');
    expect(el.querySelector('.sky-error-description')).toHaveText('test description');
    expect(el.querySelector('.sky-error-action button')).toHaveText('test action text');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyContentInfoProvider } from '@skyux/core';

import { SkyBoxControlsComponent } from './box-controls.component';
import { BoxTestComponent } from './fixtures/box.component.fixture';
import { SkyBoxFixturesModule } from './fixtures/box.module.fixture';

function getBoxEl(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector('.sky-box');
}

function getControlsDropdownButton(
  fixture: ComponentFixture<any>,
): HTMLElement {
  return fixture.nativeElement.querySelector(
    '#controls-dropdown .sky-dropdown-button',
  );
}

function getContentDropdownButton(fixture: ComponentFixture<any>): HTMLElement {
  return fixture.nativeElement.querySelector(
    '#content-dropdown .sky-dropdown-button',
  );
}

describe('BoxComponent', () => {
  let component: BoxTestComponent;
  let fixture: ComponentFixture<BoxTestComponent>;
  let contentInfoProvider: SkyContentInfoProvider;

  beforeEach(() => {
    contentInfoProvider = new SkyContentInfoProvider();

    TestBed.configureTestingModule({
      declarations: [BoxTestComponent],
      imports: [SkyBoxFixturesModule],
    });

    fixture = TestBed.overrideComponent(SkyBoxControlsComponent, {
      add: {
        providers: [
          {
            provide: SkyContentInfoProvider,
            useValue: contentInfoProvider,
          },
        ],
      },
    }).createComponent(BoxTestComponent);

    component = fixture.componentInstance;
  });

  it('should assign role attribute when ariaRole is set', () => {
    component.ariaRole = 'region';
    fixture.detectChanges();

    expect(getBoxEl(fixture).getAttribute('role')).toEqual('region');
  });

  it('should assign label attribute when ariaLabel is set', () => {
    component.ariaLabel = 'my box';
    fixture.detectChanges();

    expect(getBoxEl(fixture).getAttribute('aria-label')).toEqual('my box');
  });

  it('should assign role attribute when ariaRole is set', () => {
    component.ariaLabelledBy = 'my-header';
    fixture.detectChanges();

    expect(getBoxEl(fixture).getAttribute('aria-labelledby')).toEqual(
      'my-header',
    );
  });

  it('should set an id on the header and provide it via contentInfoProvider', async () => {
    const contentInfoSpy = spyOn(
      contentInfoProvider,
      'patchInfo',
    ).and.callThrough();
    fixture.detectChanges();
    let header = getBoxEl(fixture).querySelector('sky-box-header span');
    expect(header).not.toBeNull();

    if (header) {
      expect(contentInfoProvider.patchInfo).toHaveBeenCalledWith({
        descriptor: { type: 'elementId', value: header.id },
      });
      expect(
        getControlsDropdownButton(fixture).getAttribute('aria-label'),
      ).toBeNull();
      expect(getContentDropdownButton(fixture).getAttribute('aria-label')).toBe(
        'Context menu',
      );
      expect(
        getControlsDropdownButton(fixture).getAttribute('aria-labelledby'),
      ).toEqual(
        jasmine.stringMatching(
          /sky-id-gen__[0-9]+__[0-9]+ sky-id-gen__[0-9]+__[0-9]+/,
        ),
      );
      expect(
        getContentDropdownButton(fixture).getAttribute('aria-labelledby'),
      ).toBeNull();
    }

    contentInfoSpy.calls.reset();
    component.showHeader = false;
    fixture.detectChanges();
    header = getBoxEl(fixture).querySelector('sky-box-header span');
    expect(header).toBeNull();

    expect(contentInfoProvider.patchInfo).toHaveBeenCalledWith({
      descriptor: undefined,
    });
    expect(getContentDropdownButton(fixture).getAttribute('aria-label')).toBe(
      'Context menu',
    );
    expect(getControlsDropdownButton(fixture).getAttribute('aria-label')).toBe(
      'Context menu',
    );
    expect(
      getControlsDropdownButton(fixture).getAttribute('aria-labelledby'),
    ).toBeNull();
    expect(
      getControlsDropdownButton(fixture).getAttribute('aria-labelledby'),
    ).toBeNull();
  });
});

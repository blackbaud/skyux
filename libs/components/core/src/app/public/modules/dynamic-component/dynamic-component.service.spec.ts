//#region imports

import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef
} from '@angular/core';

import {
  TestBed
} from '@angular/core/testing';

import {
  BrowserDynamicTestingModule
} from '@angular/platform-browser-dynamic/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  DynamicComponentTestComponent
} from './fixtures/dynamic-component-test.component';

import {
  SkyDynamicComponentModule
} from './dynamic-component.module';

import {
  SkyDynamicComponentService
} from './dynamic-component.service';

import {
  SkyDynamicComponentLocation
} from './dynamic-component-location';

//#endregion

describe('Dynamic component service', () => {

  let cmpRef: ComponentRef<DynamicComponentTestComponent>;

  function createTestComponent(location?: SkyDynamicComponentLocation) {
    const svc: SkyDynamicComponentService = TestBed.get(SkyDynamicComponentService);

    cmpRef = svc.createComponent<DynamicComponentTestComponent>({
      componentType: DynamicComponentTestComponent,
      location: location || SkyDynamicComponentLocation.BodyBottom
    });

    cmpRef.changeDetectorRef.detectChanges();

    return cmpRef;
  }

  function getComponentEl() {
    return (cmpRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SkyDynamicComponentModule
      ],
      declarations: [
        DynamicComponentTestComponent
      ]
    });

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [
          DynamicComponentTestComponent
        ]
      }
    });
  });

  afterEach(() => {
    if (cmpRef) {
      const appRef: ApplicationRef = TestBed.get(ApplicationRef);

      appRef.detachView(cmpRef.hostView);

      cmpRef.destroy();
    }
  });

  it('should add a component to the page', () => {
    createTestComponent();

    const el = getComponentEl();

    expect(document.body.lastChild).toBe(el);
    expect(el.querySelector('.component-test')).toHaveText('Hello world');
  });

  it('should allow components to be created at the top of the page', () => {
    createTestComponent(SkyDynamicComponentLocation.BodyTop);

    expect(document.body.firstChild).toBe(getComponentEl());
  });
});

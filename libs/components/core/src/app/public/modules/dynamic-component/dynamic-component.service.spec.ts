import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef
} from '@angular/core';

import {
  inject,
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

describe('Dynamic component service', () => {
  let cmpRef: ComponentRef<DynamicComponentTestComponent>;
  let applicationRef: ApplicationRef;

  function createTestComponent(
    location?: SkyDynamicComponentLocation
  ): ComponentRef<DynamicComponentTestComponent> {
    const svc: SkyDynamicComponentService = TestBed.get(SkyDynamicComponentService);

    cmpRef = svc.createComponent(
      DynamicComponentTestComponent,
      location && {
        location
      }
    );

    cmpRef.changeDetectorRef.detectChanges();
    applicationRef.tick();

    return cmpRef;
  }

  function removeTestComponent(
    refToRemove: ComponentRef<any>
  ): ComponentRef<DynamicComponentTestComponent> {
    const svc: SkyDynamicComponentService = TestBed.get(SkyDynamicComponentService);

    svc.removeComponent(refToRemove);

    applicationRef.tick();

    return cmpRef;
  }

  function getComponentEl(): any {
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

  beforeEach(
    inject(
      [
        ApplicationRef
      ],
      (
        _applicationRef: ApplicationRef
      ) => {
        applicationRef = _applicationRef;
      }
    )
  );

  afterEach(() => {
    if (cmpRef) {
      removeTestComponent(cmpRef);
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

  it('should remove a component from the page', () => {
    createTestComponent();

    const el = getComponentEl();

    expect(document.body.lastChild).toBe(el);
    expect(el.querySelector('.component-test')).toHaveText('Hello world');

    removeTestComponent(cmpRef);

    expect(document.body.lastChild).not.toBe(el);
  });

  it('should ignore removing a component if reference not provided', () => {
    const spy = spyOn(applicationRef, 'detachView').and.callThrough();

    removeTestComponent(undefined);

    expect(spy).not.toHaveBeenCalled();
  });
});

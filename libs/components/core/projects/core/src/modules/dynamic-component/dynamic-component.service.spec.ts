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
} from './fixtures/dynamic-component-test.component.fixture';

import {
  SkyDynamicComponentService
} from './dynamic-component.service';

import {
  SkyDynamicComponentLocation
} from './dynamic-component-location';

describe('Dynamic component service', () => {
  let cmpRefs: ComponentRef<DynamicComponentTestComponent>[] = [];
  let applicationRef: ApplicationRef;

  function createTestComponent(
    location?: SkyDynamicComponentLocation,
    reference?: HTMLElement
  ): ComponentRef<DynamicComponentTestComponent> {
    const svc: SkyDynamicComponentService = TestBed.inject(SkyDynamicComponentService);

    let cmpRef: ComponentRef<DynamicComponentTestComponent> = svc.createComponent(
      DynamicComponentTestComponent,
      {
        location: location,
        referenceEl: reference
      }
    );

    cmpRef.changeDetectorRef.detectChanges();
    applicationRef.tick();

    cmpRefs.push(cmpRef);
    return cmpRef;
  }

  function removeTestComponent(
    refToRemove: ComponentRef<any>
  ): ComponentRef<DynamicComponentTestComponent> {
    const svc: SkyDynamicComponentService = TestBed.inject(SkyDynamicComponentService);

    svc.removeComponent(refToRemove);

    applicationRef.tick();

    cmpRefs = cmpRefs.filter(cmpRef => cmpRef !== refToRemove);

    return refToRemove;
  }

  function getComponentEl(index: number): any {
    return (cmpRefs[index].hostView as EmbeddedViewRef<any>).rootNodes[0];
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
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
    if (cmpRefs.length) {
      for (let cmpRef of cmpRefs) {
        removeTestComponent(cmpRef);
      }
    }
  });

  it('should add a component to the page', () => {
    createTestComponent();

    const el = getComponentEl(0);

    expect(document.body.lastChild).toBe(el);
    expect(el.querySelector('.component-test')).toHaveText('Hello world');
  });

  it('should allow components to be created at the top of the page', () => {
    createTestComponent(SkyDynamicComponentLocation.BodyTop);

    expect(document.body.firstChild).toBe(getComponentEl(0));
  });

  it('should allow components to be created in the bottom of another element', () => {
    const referenceRef = createTestComponent(SkyDynamicComponentLocation.BodyTop);
    const referenceEl = referenceRef.location.nativeElement;

    createTestComponent(SkyDynamicComponentLocation.ElementBottom, referenceEl);

    expect(referenceEl.lastChild).toBe(getComponentEl(1));
  });

  it('should allow components to be created in the top of another element', () => {
    const referenceRef = createTestComponent(SkyDynamicComponentLocation.BodyTop);
    const referenceEl = referenceRef.location.nativeElement;

    createTestComponent(SkyDynamicComponentLocation.ElementTop, referenceEl);

    expect(referenceEl.firstChild).toBe(getComponentEl(1));
  });

  it('should allow components to be created in the top of another element', () => {
    const referenceRef = createTestComponent(SkyDynamicComponentLocation.BodyTop);
    const referenceEl = referenceRef.location.nativeElement;

    createTestComponent(SkyDynamicComponentLocation.BeforeElement, referenceEl);

    expect(document.body.firstChild).toBe(getComponentEl(1));
    expect(document.body.firstChild.nextSibling).toBe(getComponentEl(0));
  });

  it('should remove a component from the page', () => {
    createTestComponent();

    const el = getComponentEl(0);

    expect(document.body.lastChild).toBe(el);
    expect(el.querySelector('.component-test')).toHaveText('Hello world');

    removeTestComponent(cmpRefs[0]);

    expect(document.body.lastChild).not.toBe(el);
  });

  it('should ignore removing a component if reference not provided', () => {
    const spy = spyOn(applicationRef, 'detachView').and.callThrough();

    removeTestComponent(undefined);

    expect(spy).not.toHaveBeenCalled();
  });
});

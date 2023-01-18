import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  Injector,
  StaticProvider,
} from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyDynamicComponentLocation } from './dynamic-component-location';
import { SkyDynamicComponentService } from './dynamic-component.service';
import { DynamicComponentTestComponent } from './fixtures/dynamic-component-test.component.fixture';

describe('Dynamic component service', () => {
  let cmpRefs: ComponentRef<DynamicComponentTestComponent>[] = [];
  let applicationRef: ApplicationRef;

  function createTestComponent(
    location?: SkyDynamicComponentLocation,
    reference?: HTMLElement,
    providers?: StaticProvider[],
    injector?: Injector
  ): ComponentRef<DynamicComponentTestComponent> {
    const svc: SkyDynamicComponentService = TestBed.inject(
      SkyDynamicComponentService
    );

    const cmpRef: ComponentRef<DynamicComponentTestComponent> =
      svc.createComponent(DynamicComponentTestComponent, {
        location: location,
        referenceEl: reference,
        providers,
        parentInjector: injector,
      });

    cmpRef.changeDetectorRef.detectChanges();
    applicationRef.tick();

    cmpRefs.push(cmpRef);
    return cmpRef;
  }

  function removeTestComponent(
    refToRemove?: ComponentRef<DynamicComponentTestComponent>
  ): ComponentRef<DynamicComponentTestComponent> | undefined {
    const svc: SkyDynamicComponentService = TestBed.inject(
      SkyDynamicComponentService
    );

    svc.removeComponent(refToRemove);

    applicationRef.tick();

    cmpRefs = cmpRefs.filter((cmpRef) => cmpRef !== refToRemove);

    return refToRemove;
  }

  function getComponentEl(index: number): any {
    return (cmpRefs[index].hostView as EmbeddedViewRef<any>).rootNodes[0];
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [DynamicComponentTestComponent],
    });
  });

  beforeEach(inject([ApplicationRef], (_applicationRef: ApplicationRef) => {
    applicationRef = _applicationRef;
  }));

  afterEach(() => {
    if (cmpRefs.length) {
      for (const cmpRef of cmpRefs) {
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
    const referenceRef = createTestComponent(
      SkyDynamicComponentLocation.BodyTop
    );
    const referenceEl = referenceRef.location.nativeElement;

    createTestComponent(SkyDynamicComponentLocation.ElementBottom, referenceEl);

    expect(referenceEl.lastChild).toBe(getComponentEl(1));
  });

  it('should allow components to be created in the top of another element', () => {
    const referenceRef = createTestComponent(
      SkyDynamicComponentLocation.BodyTop
    );
    const referenceEl = referenceRef.location.nativeElement;

    createTestComponent(SkyDynamicComponentLocation.ElementTop, referenceEl);

    expect(referenceEl.firstChild).toBe(getComponentEl(1));
  });

  it('should allow components to be created before another element', () => {
    const referenceRef = createTestComponent(
      SkyDynamicComponentLocation.BodyTop
    );
    const referenceEl = referenceRef.location.nativeElement;

    createTestComponent(SkyDynamicComponentLocation.BeforeElement, referenceEl);

    expect(document.body.firstChild).toBe(getComponentEl(1));
    expect(document.body.firstChild?.nextSibling).toBe(getComponentEl(0));
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

  it('should setup providers for a component', () => {
    createTestComponent(undefined, undefined, [
      { provide: 'greeting', useValue: 'My name is Pat.' },
    ]);

    const el = getComponentEl(0);

    expect(document.body.lastChild).toBe(el);
    expect(el.querySelector('.component-test')).toHaveText(
      'Hello world My name is Pat.'
    );
  });

  it('should use a parent injector if supplied', () => {
    const injector: Injector = Injector.create({
      providers: [{ provide: 'greeting', useValue: 'My name is Pat.' }],
      name: 'test injector',
    });
    createTestComponent(undefined, undefined, undefined, injector);

    const el = getComponentEl(0);

    expect(document.body.lastChild).toBe(el);
    expect(el.querySelector('.component-test')).toHaveText(
      'Hello world My name is Pat.'
    );
  });

  it('should throw error if placing a component before an undefined element', () => {
    expect(() =>
      createTestComponent(
        SkyDynamicComponentLocation.BeforeElement,
        undefined // <-- Intentionally do not provide a reference element.
      )
    ).toThrowError(
      '[SkyDynamicComponentService] Could not create a component at location `SkyDynamicComponentLocation.BeforeElement` because a reference element was not provided.'
    );
  });

  it('should throw error if placing a component at the top of an undefined element', () => {
    expect(() =>
      createTestComponent(
        SkyDynamicComponentLocation.ElementTop,
        undefined // <-- Intentionally do not provide a reference element.
      )
    ).toThrowError(
      '[SkyDynamicComponentService] Could not create a component at location `SkyDynamicComponentLocation.ElementTop` because a reference element was not provided.'
    );
  });
});

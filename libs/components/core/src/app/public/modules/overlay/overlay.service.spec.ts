import {
  ApplicationRef,
  NgZone
} from '@angular/core';

import {
  async,
  inject,
  TestBed
} from '@angular/core/testing';

import {
  Router
} from '@angular/router';

import {
  expect,
  SkyAppTestUtility
} from '@skyux-sdk/testing';

import {
  OverlayFixtureContext
} from './fixtures/overlay-context.fixture';

import {
  OverlayFixtureComponent
} from './fixtures/overlay.component.fixture';

import {
  OverlayFixturesModule
} from './fixtures/overlay.fixtures.module';

import {
  SkyOverlayConfig
} from './overlay-config';

import {
  SkyOverlayAdapterService
} from './overlay-adapter.service';

import {
  SkyOverlayInstance
} from './overlay-instance';

import {
  SkyOverlayService
} from './overlay.service';

describe('Overlay service', () => {

  let service: SkyOverlayService;
  let app: ApplicationRef;

  function getAllOverlays(): NodeListOf<Element> {
    return document.querySelectorAll('.sky-overlay');
  }

  function createOverlay(config?: SkyOverlayConfig): SkyOverlayInstance {
    return service.create(config);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayFixturesModule
      ]
    });

    service = TestBed.get(SkyOverlayService);
    app = TestBed.get(ApplicationRef);
  });

  afterEach(async(() => {
    service.closeAll();
  }));

  it('should create an overlay', function () {
    const overlay = createOverlay();

    app.tick();

    expect(getAllOverlays().length).toEqual(1);

    overlay.close();
  });

  it('should optionally prevent body scroll', async(() => {
    const adapter = TestBed.get(SkyOverlayAdapterService);
    const adapterSpy = spyOn(adapter, 'restrictBodyScroll').and.callThrough();

    let overlay = createOverlay();

    app.tick();

    expect(adapterSpy).not.toHaveBeenCalled();
    expect(document.body.style.overflow).toEqual('');

    adapterSpy.calls.reset();

    overlay.closed.subscribe(() => {
      overlay = createOverlay({
        enableScroll: false
      });

      app.tick();

      expect(adapterSpy).toHaveBeenCalled();
      expect(document.body.style.overflow).toEqual('hidden');

      overlay.close();
    });

    overlay.close();
  }));

  it('should optionally allow closing overlay when clicking outside', async(() => {
    const overlay1 = createOverlay({
      enableClose: false
    });

    SkyAppTestUtility.fireDomEvent(getAllOverlays().item(0), 'click');
    app.tick();

    expect(getAllOverlays().item(0)).not.toBeNull();

    overlay1.closed.subscribe(() => {
      const overlay2 = createOverlay({
        enableClose: true
      });
      app.tick();

      SkyAppTestUtility.fireDomEvent(getAllOverlays().item(0), 'click');
      app.tick();

      expect(getAllOverlays().item(0)).toBeNull();

      overlay2.close();
    });

    overlay1.close();
  }));

  it('should prevent body scroll after another overlay is closed', async(() => {
    const adapter = TestBed.get(SkyOverlayAdapterService);
    const restrictScrollSpy = spyOn(adapter, 'restrictBodyScroll').and.callThrough();
    const releaseScrollSpy = spyOn(adapter, 'releaseBodyScroll').and.callThrough();

    const overlay1 = createOverlay({
      enableScroll: false
    });

    const overlay2 = createOverlay({
      enableScroll: false
    });

    app.tick();

    overlay2.closed.subscribe(() => {
      expect(restrictScrollSpy).toHaveBeenCalled();
      expect(releaseScrollSpy).not.toHaveBeenCalled();
      releaseScrollSpy.calls.reset();

      overlay1.closed.subscribe(() => {
        expect(releaseScrollSpy).toHaveBeenCalled();
      });

      overlay1.close();
    });

    overlay2.close();
  }));

  it('should optionally show a backdrop', async(() => {
    let overlay = createOverlay();

    app.tick();

    let backdropElement = document.querySelector('.sky-overlay-backdrop');

    expect(backdropElement).toBeNull();

    overlay.closed.subscribe(() => {
      overlay = createOverlay({
        showBackdrop: true
      });

      app.tick();

      backdropElement = document.querySelector('.sky-overlay-backdrop');

      expect(backdropElement).not.toBeNull();

      overlay.close();
    });

    overlay.close();
  }));

  it('should close all on navigation change', async(inject([NgZone], (ngZone: NgZone) => {
    const router = TestBed.get(Router);

    createOverlay();
    createOverlay();
    createOverlay();

    app.tick();

    expect(getAllOverlays().length).toEqual(3);

    // Run navigation through NgZone to avoid warnings in the console.
    ngZone.run(() => {
      router.navigate(['/']);
      app.tick();
      expect(getAllOverlays().length).toEqual(0);
    });
  })));

  it('should optionally remain open on navigation change', async(inject(
    [NgZone],
    (ngZone: NgZone) => {
      const router = TestBed.get(Router);
      const overlay = createOverlay({
        closeOnNavigation: false
      });

      app.tick();

      expect(getAllOverlays().item(0)).not.toBeNull();

      ngZone.run(() => {
        router.navigate(['/']);
        app.tick();

        expect(getAllOverlays().item(0)).not.toBeNull();

        overlay.close();
      });
    }
  )));

  it('should attach a component', async(() => {
    const overlay = createOverlay();

    overlay.attachComponent(OverlayFixtureComponent);
    app.tick();

    expect(getAllOverlays().item(0).textContent).toContain('Overlay content ID: none');

    overlay.close();
  }));

  it('should attach a component with providers', async(() => {
    const overlay = createOverlay();

    overlay.attachComponent(OverlayFixtureComponent, [{
      provide: OverlayFixtureContext,
      useValue: new OverlayFixtureContext(1)
    }]);
    app.tick();

    expect(getAllOverlays().item(0).textContent).toContain('Overlay content ID: 1');

    overlay.close();
  }));

  it('should attach a template', async(() => {
    const fixture = TestBed.createComponent(OverlayFixtureComponent);
    const overlay = createOverlay();
    overlay.attachTemplate(fixture.componentInstance.myTemplate, {
      $implicit: {
        id: 5
      }
    });

    app.tick();

    expect(getAllOverlays().item(0).textContent).toContain('Templated content ID: 5');

    overlay.close();
  }));

  it('should be accessible', async(function () {
    createOverlay();

    app.tick();

    expect(getAllOverlays()[0]).toBeAccessible();
  }));

});

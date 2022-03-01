import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyTileDashboardService } from '../tile-dashboard/tile-dashboard.service';
import { SkyTilesModule } from '../tiles.module';

import { MockSkyTileDashboardService } from './fixtures/mock-tile-dashboard.service';
import { TileTestComponent } from './fixtures/tile.component.fixture';
import { SkyTileComponent } from './tile.component';

describe('Tile component', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  function getExpandButton(fixture: ComponentFixture<any>): HTMLButtonElement {
    return fixture.nativeElement.querySelector('sky-chevron button');
  }

  function getHelpButton(fixture: ComponentFixture<any>): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.sky-tile-help');
  }

  function getMoveButton(fixture: ComponentFixture<any>): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.sky-tile-grab-handle');
  }

  function getSettingsButton(
    fixture: ComponentFixture<any>
  ): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.sky-tile-settings');
  }

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      declarations: [TileTestComponent],
      imports: [NoopAnimationsModule, SkyTilesModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });
  });

  it('should render the header text in the expected element', fakeAsync(() => {
    const fixture = TestBed.createComponent(TileTestComponent);
    const el = fixture.nativeElement;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(el.querySelector('.sky-tile-title')).toHaveText('Title');
  }));

  it('should collapse/expand when the header is clicked', fakeAsync(() => {
    const fixture = TestBed.createComponent(TileTestComponent);
    const el = fixture.nativeElement;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const titleEl = el.querySelector('.sky-tile-title');

      titleEl.click();
      fixture.detectChanges();

      const contentAttrs = el.querySelector('.sky-tile-content').attributes;

      expect(contentAttrs['hidden']).not.toBeNull();

      titleEl.click();

      fixture.whenStable().then(() => {
        expect(contentAttrs['hidden']).toBe(undefined);
      });
    });
  }));

  it('should output state when collapsed/expanded', fakeAsync(() => {
    const fixture = TestBed.createComponent(TileTestComponent);
    const el = fixture.nativeElement;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const titleEl = el.querySelector('.sky-tile-title');
    const contentAttrs = el.querySelector('.sky-tile-content').attributes;
    expect(fixture.componentInstance.collapsedOutputCalled).toBe(false);
    expect(contentAttrs['hidden']).not.toBeNull();

    titleEl.click();
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(contentAttrs['hidden']).toBe(undefined);
    expect(fixture.componentInstance.collapsedOutputCalled).toBe(true);
  }));

  it('should collapse/expand when the chevron is clicked', () => {
    const fixture = TestBed.createComponent(TileTestComponent);
    const el = fixture.nativeElement;

    fixture.detectChanges();

    const chevronEl = el.querySelector('.sky-chevron');

    chevronEl.click();
    fixture.detectChanges();

    const contentAttrs = el.querySelector('.sky-tile-content').attributes;

    expect(contentAttrs['hidden']).not.toBeNull();

    fixture.detectChanges();

    chevronEl.click();
    fixture.detectChanges();

    expect(contentAttrs['hidden']).toBe(undefined);
  });

  it('should collapse/expand when the isCollapsed value changes', () => {
    const fixture = TestBed.createComponent(TileTestComponent);
    const el = fixture.nativeElement;

    fixture.detectChanges();

    const contentAttrs = el.querySelector('.sky-tile-content').attributes;

    expect(contentAttrs['hidden']).toBe(undefined);

    fixture.componentInstance.tileIsCollapsed = true;
    fixture.detectChanges();

    expect(contentAttrs['hidden']).not.toBeNull();
  });

  it('should notify the tile dashboard when the tile is collapsed', () => {
    const mockTileDashboardService = new MockSkyTileDashboardService();

    const fixture = TestBed.overrideComponent(TileTestComponent, {
      add: {
        providers: [
          {
            provide: SkyTileDashboardService,
            useValue: mockTileDashboardService,
          },
        ],
      },
    }).createComponent(TileTestComponent);

    const el = fixture.nativeElement;
    const dashboardSpy = spyOn(
      mockTileDashboardService,
      'setTileCollapsed'
    ).and.callThrough();

    fixture.detectChanges();

    const chevronEl = el.querySelector('.sky-chevron');

    chevronEl.click();

    fixture.detectChanges();

    expect(dashboardSpy).toHaveBeenCalledWith(
      jasmine.any(SkyTileComponent),
      true
    );
  });

  describe('settings button', () => {
    it('should be absent if a callback is not provided', () => {
      const html = `
        <sky-tile tileName="test" [isCollapsed]="tileIsCollapsed">
          <sky-tile-title>Title</sky-tile-title>
          <sky-tile-content>Content</sky-tile-content>
        </sky-tile>
      `;

      const fixture = TestBed.overrideComponent(TileTestComponent, {
        set: {
          template: html,
        },
      }).createComponent(TileTestComponent);

      fixture.detectChanges();

      expect(getSettingsButton(fixture)).toBeNull();
    });

    it('should be present if a callback is provided', () => {
      const fixture = TestBed.createComponent(TileTestComponent);

      fixture.detectChanges();

      expect(getSettingsButton(fixture)).not.toBeNull();
    });

    it('should not be present if a callback is provided, but the showSettings flag is false', () => {
      const html = `
        <sky-tile tileName="test" [isCollapsed]="tileIsCollapsed" (settingsClick)="alert('settings clicked.')" [showSettings]="false">
          <sky-tile-title>Title</sky-tile-title>
          <sky-tile-content>Content</sky-tile-content>
        </sky-tile>
      `;

      const fixture = TestBed.overrideComponent(TileTestComponent, {
        set: {
          template: html,
        },
      }).createComponent(TileTestComponent);

      fixture.detectChanges();

      expect(getSettingsButton(fixture)).toBeNull();
    });

    it('should call the specified callback when clicked', () => {
      const fixture = TestBed.createComponent(TileTestComponent);
      const cmp = fixture.componentInstance as TileTestComponent;
      const tileSettingsClickSpy = spyOn(cmp, 'tileSettingsClick');

      fixture.detectChanges();

      getSettingsButton(fixture).click();

      expect(tileSettingsClickSpy).toHaveBeenCalled();
    });

    it('should not collapse the tile when clicked', () => {
      const fixture = TestBed.createComponent(TileTestComponent);
      const el = fixture.nativeElement;

      fixture.detectChanges();

      getSettingsButton(fixture).click();
      fixture.detectChanges();

      const contentAttrs = el.querySelector('.sky-tile-content').attributes;

      expect(contentAttrs['hidden']).toBe(undefined);
    });
  });

  describe('help button', () => {
    it('should be absent if a callback is not provided', () => {
      const html = `
        <sky-tile tileName="test" [isCollapsed]="tileIsCollapsed">
          <sky-tile-title>Title</sky-tile-title>
          <sky-tile-content>Content</sky-tile-content>
        </sky-tile>
      `;

      const fixture = TestBed.overrideComponent(TileTestComponent, {
        set: {
          template: html,
        },
      }).createComponent(TileTestComponent);

      fixture.detectChanges();

      expect(getHelpButton(fixture)).toBeNull();
    });

    it('should be present if a callback is provided', () => {
      const fixture = TestBed.createComponent(TileTestComponent);

      fixture.detectChanges();

      expect(getHelpButton(fixture)).not.toBeNull();
    });

    it('should not be present if a callback is provided, but the showHelp flag is false', () => {
      const html = `
        <sky-tile
          tileName="test"
          [isCollapsed]="tileIsCollapsed"
          (helpClick)="alert('help clicked.')"
          [showHelp]="false"
        >
          <sky-tile-title>Title</sky-tile-title>
          <sky-tile-content>Content</sky-tile-content>
        </sky-tile>
      `;

      const fixture = TestBed.overrideComponent(TileTestComponent, {
        set: {
          template: html,
        },
      }).createComponent(TileTestComponent);

      fixture.detectChanges();

      expect(getHelpButton(fixture)).toBeNull();
    });

    it('should call the specified callback when clicked', () => {
      const fixture = TestBed.createComponent(TileTestComponent);
      const cmp = fixture.componentInstance as TileTestComponent;
      const tileHelpClickSpy = spyOn(cmp, 'tileHelpClick');

      fixture.detectChanges();

      getHelpButton(fixture).click();

      expect(tileHelpClickSpy).toHaveBeenCalled();
    });

    it('should not collapse the tile when clicked', () => {
      const fixture = TestBed.createComponent(TileTestComponent);
      const el = fixture.nativeElement;

      fixture.detectChanges();

      getHelpButton(fixture).click();
      fixture.detectChanges();

      const contentAttrs = el.querySelector('.sky-tile-content').attributes;

      expect(contentAttrs['hidden']).toBe(undefined);
    });
  });

  it('should create default aria labels when tileName is not defined', fakeAsync(() => {
    const fixture = TestBed.createComponent(TileTestComponent);
    fixture.componentInstance.tileName = undefined;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    // Force tile to render move button.
    fixture.componentInstance.tileComponent.isInDashboardColumn = true;
    fixture.detectChanges();
    const helpButton = getHelpButton(fixture);
    const expandButton = getExpandButton(fixture);
    const moveButton = getMoveButton(fixture);
    const settingsButton = getSettingsButton(fixture);
    expect(helpButton.getAttribute('aria-label')).toEqual('Help');
    expect(expandButton.getAttribute('aria-label')).toEqual(
      'Expand or collapse'
    );
    expect(moveButton.getAttribute('aria-label')).toEqual('Move');
    expect(settingsButton.getAttribute('aria-label')).toEqual('Settings');
  }));

  it('should create accessible aria labels when tileName is defined', fakeAsync(() => {
    const fixture = TestBed.createComponent(TileTestComponent);
    fixture.componentInstance.tileName = 'Users';
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    // Force tile to render move button.
    fixture.componentInstance.tileComponent.isInDashboardColumn = true;
    fixture.detectChanges();
    const helpButton = getHelpButton(fixture);
    const expandButton = getExpandButton(fixture);
    const moveButton = getMoveButton(fixture);
    const settingsButton = getSettingsButton(fixture);
    expect(helpButton.getAttribute('aria-label')).toEqual('Users help');
    expect(expandButton.getAttribute('aria-label')).toEqual(
      'Expand or collapse Users'
    );
    expect(moveButton.getAttribute('aria-label')).toEqual('Move Users');
    expect(settingsButton.getAttribute('aria-label')).toEqual('Users settings');
  }));

  it('should pass accessibility', async () => {
    const fixture = TestBed.createComponent(TileTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

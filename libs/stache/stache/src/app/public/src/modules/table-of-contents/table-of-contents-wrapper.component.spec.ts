import { StacheTableOfContentsWrapperComponent } from './table-of-contents-wrapper.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { PipeTransform, Pipe, Renderer2 } from '@angular/core';
import { SkyModule } from '@blackbaud/skyux/dist/core';
import { expect } from '@blackbaud/skyux-lib-testing';
import { SkyAppResourcesService } from '@blackbaud/skyux-builder/runtime/i18n';
import { StacheWindowRef, StacheRouteService } from '../shared';
import { StacheTableOfContentsComponent } from './table-of-contents.component';
import { StacheNavModule, StacheNavLink } from '../nav';
import { RouterTestingModule } from '@angular/router/testing';

@Pipe({
  name: 'skyAppResources'
})
export class MockSkyAppResourcesPipe implements PipeTransform {
  public transform(value: number): number {
    return value;
  }
}

class MockWindowService {
  public nativeWindow = {
    document: {
      documentElement: {
        querySelector: () => {}
      },
      body: {
        classList: {
          add: () => {}
        }
      }
    },
    innerWidth: 100
  };
}

class MockSkyAppResourcesService {
  public getString(): any {
    return {
      subscribe: (cb: any) => {
        cb();
      },
      take: () => {
        return {
          subscribe: (cb: any) => {
            cb();
          }
        };
      }
    };
  }
}

class MockStacheRouteService {
  public getActiveUrl = () => '';
}

class MockRenderer {
  public classList: any[] = [];
  public addClass = (el: any, classname: any) => {};
  public removeClass = (el: any, classname: any) => {};
}

const route: StacheNavLink = {
  name: 'string',
  path: '/string',
  offsetTop: 123,
  isCurrent: false
};

describe('Table of Contents Wrapper Component', () => {
  let component: StacheTableOfContentsWrapperComponent;
  let fixture: ComponentFixture<StacheTableOfContentsWrapperComponent>;

  let mockSkyAppResourcesService: any;
  let mockWindowService: any;
  let mockWindowRef: any;
  let mockStacheRouteService: any;
  let mockRenderer: any;

  beforeEach(() => {
    mockWindowService = new MockWindowService();
    mockSkyAppResourcesService = new MockSkyAppResourcesService();
    mockWindowRef = new MockWindowService();
    mockStacheRouteService = new MockStacheRouteService();
    mockRenderer = new MockRenderer();

    TestBed.configureTestingModule({
      imports: [
        SkyModule,
        StacheNavModule,
        RouterTestingModule
      ],
      declarations: [
        StacheTableOfContentsComponent,
        StacheTableOfContentsWrapperComponent,
        MockSkyAppResourcesPipe
      ],
      providers: [
        { provide: StacheRouteService, useValue: mockStacheRouteService },
        { provide: SkyAppResourcesService, useValue: mockSkyAppResourcesService },
        { provide: StacheWindowRef, useValue: mockWindowService },
        { provide: Renderer2, useValue: mockRenderer }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StacheTableOfContentsWrapperComponent);
    component = fixture.componentInstance;

    component.tocRoutes = [route];
  });

  it('should exist', () => {
    expect(fixture).toExist();
  });

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    expect(fixture.nativeElement).toBeAccessible();
  }));
});

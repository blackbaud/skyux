import { async, ComponentFixture, fakeAsync, inject, tick, TestBed } from '@angular/core/testing';
import { DebugElement, Pipe, PipeTransform } from '@angular/core';

import { expect } from '@blackbaud/skyux-lib-testing';

import { StacheWindowRef, TestUtility } from '../shared';
import { StacheBackToTopComponent } from './back-to-top.component';
import { SkyAppResourcesService } from '@blackbaud/skyux-builder/runtime/i18n';
import { SkyMediaQueryModule } from '@blackbaud/skyux/dist/core';

@Pipe({
  name: 'skyAppResources'
})
export class MockSkyAppResourcesPipe implements PipeTransform {
  public transform(value: number): number {
    return value;
  }
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

describe('StacheBackToTopComponent', () => {
  let component: StacheBackToTopComponent;
  let fixture: ComponentFixture<StacheBackToTopComponent>;
  let debugElement: DebugElement;
  let windowRef: any;
  let mockSkyAppResourcesService: any;

  beforeEach(() => {
    mockSkyAppResourcesService = new MockSkyAppResourcesService();

    TestBed.configureTestingModule({
      declarations: [
        StacheBackToTopComponent,
        MockSkyAppResourcesPipe
      ],
      providers: [
        { provide: SkyAppResourcesService, useValue: mockSkyAppResourcesService },
        SkyMediaQueryModule,
        StacheWindowRef
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheBackToTopComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  beforeEach(inject([StacheWindowRef], (service: any) => {
    windowRef = service.nativeWindow;
  }));

  it('should have a default offset value of 200', () => {
    fixture.detectChanges();
    const expectedOffsetValue = component.offset;
    expect(expectedOffsetValue).toBe(200);
  });

  it('should have the set offset value', () => {
    component.offset = 400;
    fixture.detectChanges();
    const expectedOffsetValue = component.offset;
    expect(expectedOffsetValue).toBe(400);
  });

  it('should be hidden when the window y offset is less than the specified offset', () => {
    fixture.detectChanges();
    expect(component.isHidden).toBe(true);
  });

  it('should show when the window y offset is greater than the specified offset', fakeAsync(() => {
    component.offset = 0;
    TestUtility.triggerDomEvent(windowRef, 'scroll');
    tick();
    expect(component.isHidden).toBe(false);
  }));

  it('should trigger a click event on button click', async(() => {
    spyOn(component, 'scrollToTop');
    let button = debugElement.nativeElement.querySelector('.stache-back-to-top');
    button.click();
    fixture.whenStable()
      .then(() => {
        expect(component.scrollToTop).toHaveBeenCalled();
      });
  }));

  it('should call the scroll method on the window when clicked', async(() => {
    spyOn(windowRef, 'scroll');
    let button = debugElement.nativeElement.querySelector('.stache-back-to-top');
    button.click();
    fixture.whenStable()
      .then(() => {
        expect(windowRef.scroll).toHaveBeenCalled();
      });
  }));

  it('should be accessible', async(() => {
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement).toBeAccessible();
  }));
});

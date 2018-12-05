import { ComponentFixture, TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import {
  expect
} from '@blackbaud/skyux-lib-testing';
import { SkyAppRuntimeModule } from '@blackbaud/skyux-builder/runtime';
import { HttpModule } from '@angular/http';
import { PipeTransform, Pipe } from '@angular/core';
import { SkyAppResourcesService } from '@blackbaud/skyux-builder/runtime/i18n';
import { SkyCopyToClipboardComponent, SkyCopyToClipboardService } from '../clipboard';
import { SkyClipboardWindowRef } from '../shared';

class MockClipboardService {
  public copyContent(element: HTMLElement) { }
  public verifyCopyCommandBrowserSupport() {}
}

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

describe('SkyCopyToClipboardComponent', () => {
  let component: SkyCopyToClipboardComponent;
  let fixture: ComponentFixture<SkyCopyToClipboardComponent>;
  let element: HTMLElement;
  let mockTestElement: any;
  let mockSkyAppResourcesService: any;
  let mockClipboardService: any;

  beforeEach(() => {
    mockSkyAppResourcesService = new MockSkyAppResourcesService();
    mockClipboardService = new MockClipboardService();

    TestBed.configureTestingModule({
      declarations: [
        SkyCopyToClipboardComponent,
        MockSkyAppResourcesPipe
      ],
      providers: [
        SkyClipboardWindowRef,
        { provide: SkyAppResourcesService, useValue: mockSkyAppResourcesService },
        { provide: SkyCopyToClipboardService, useValue: mockClipboardService }
      ],
      imports: [
        SkyAppRuntimeModule,
        HttpModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkyCopyToClipboardComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should call the clipboard service with the copyTarget element', fakeAsync(() => {
    spyOn(mockClipboardService, 'copyContent').and.callThrough();
    mockTestElement = document.createElement('div');
    component.copyTarget = mockTestElement;
    fixture.detectChanges();
    component.copyToClipboard();
    tick(1000);
    expect(mockClipboardService.copyContent).toHaveBeenCalledWith(mockTestElement);
  }));

  it('should set the value of buttonActive to true for 1 second after click', fakeAsync(() => {
    expect(component.buttonActive).toBe(false);
    component.copyToClipboard();
    expect(component.buttonActive).toBe(true);
    tick(1000);
    expect(component.buttonActive).toBe(false);
  }));

  it('should reset the timeout if clicked again before timeout expires', fakeAsync(() => {
    expect(component.buttonActive).toBe(false);
    component.copyToClipboard();
    expect(component.buttonActive).toBe(true);
    tick(500);
    expect(component.buttonActive).toBe(true);
    component.copyToClipboard();
    tick(500);
    expect(component.buttonActive).toBe(true);
    component.copyToClipboard();
    tick(500);
    expect(component.buttonActive).toBe(true);
    component.copyToClipboard();
    tick(500);
    expect(component.buttonActive).toBe(true);
    tick(500);
    expect(component.buttonActive).toBe(false);
  }));

  it('hides copy button if copy command is not enabled/available', () => {
    spyOn(component['clipboardService'], 'verifyCopyCommandBrowserSupport').and.returnValue(false);
    fixture.detectChanges();
    expect(component.enabled).toEqual(false);
  });

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    expect(element).toBeAccessible();
  }));
});

import {
  ComponentFixture,
  TestBed,
  async,
  tick,
  fakeAsync
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyCopyToClipboardComponent
} from './clipboard.component';

import {
  SkyCopyToClipboardService
} from './clipboard.service';

import {
  SkyClipboardModule
} from './clipboard.module';

class MockClipboardService {
  public copyContent(element: HTMLElement) { }
  public verifyCopyCommandBrowserSupport() {}
}

describe('SkyCopyToClipboardComponent', () => {
  let component: SkyCopyToClipboardComponent;
  let fixture: ComponentFixture<SkyCopyToClipboardComponent>;
  let element: HTMLElement;
  let mockTestElement: any;
  let mockClipboardService: any;

  beforeEach(() => {
    mockClipboardService = new MockClipboardService();

    TestBed.configureTestingModule({
      imports: [
        SkyClipboardModule
      ],
      providers: [
        SkyAppWindowRef,
        { provide: SkyCopyToClipboardService, useValue: mockClipboardService }
      ]
    });

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

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    expect(element).toBeAccessible();
  }));
});

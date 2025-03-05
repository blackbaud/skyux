import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyLayoutHostDirective } from './layout-host.directive';
import { SkyLayoutHostService } from './layout-host.service';

@Component({
  selector: 'app-test',
  template: ``,
  hostDirectives: [{ directive: SkyLayoutHostDirective, inputs: ['layout'] }],
})
class TestComponent {}

describe('SkyLayoutHostDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
  });

  it('should have layout none', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveClass('sky-layout-host-none');
  });

  it('should have layout fit', () => {
    fixture.componentRef.setInput('layout', 'fit');
    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveClass('sky-layout-host-fit');
    fixture.componentRef.setInput('layout', 'none');
    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveClass('sky-layout-host-none');
    expect(fixture.nativeElement).not.toHaveClass('sky-layout-host-fit');
  });

  it('should have child layout tabs', () => {
    fixture.debugElement.injector
      .get(SkyLayoutHostService)
      .setHostLayoutForChild({ layout: 'tabs' });
    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveClass('sky-layout-host-for-child-tabs');
  });
});

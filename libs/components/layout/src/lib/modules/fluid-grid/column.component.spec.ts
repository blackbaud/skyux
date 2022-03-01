import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { SkyColumnComponent } from './column.component';
import { ColumnTestComponent } from './fixtures/column.component.fixture';

describe('SkyColumnComponent', () => {
  let component: ColumnTestComponent;
  let fixture: ComponentFixture<ColumnTestComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkyColumnComponent, ColumnTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnTestComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement.querySelector('sky-column');
  });

  it('should add a class to the host element', () => {
    fixture.detectChanges();
    expect(element.className).toContain('sky-column');
  });

  it('should add a class for small, medium, and large breakpoints', () => {
    fixture.detectChanges();
    expect(element.className).toContain('sky-column-xs-1');
    expect(element.className).toContain('sky-column-sm-1');
    expect(element.className).toContain('sky-column-md-2');
    expect(element.className).toContain('sky-column-lg-5');
  });

  it('should update the classnames when the inputs change', () => {
    fixture.detectChanges();
    expect(element.className).toContain('sky-column-xs-1');
    expect(element.className).toContain('sky-column-sm-1');
    expect(element.className).toContain('sky-column-md-2');
    expect(element.className).toContain('sky-column-lg-5');
    component.xsSize = 2;
    component.smallSize = 3;
    component.mediumSize = 7;
    component.largeSize = 4;
    fixture.detectChanges();
    expect(element.className).toContain('sky-column-xs-2');
    expect(element.className).toContain('sky-column-sm-3');
    expect(element.className).toContain('sky-column-md-7');
    expect(element.className).toContain('sky-column-lg-4');
  });

  it('should update the classnames when only one column changes', () => {
    fixture.detectChanges();
    expect(element.className).toContain('sky-column-lg-5');
    component.largeSize = 4;
    fixture.detectChanges();
    expect(element.className).toContain('sky-column-lg-4');
  });

  it('should be accessible', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});

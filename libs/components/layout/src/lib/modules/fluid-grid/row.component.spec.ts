import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyRowComponent } from './row.component';

describe('SkyRowComponent', () => {
  let component: SkyRowComponent;
  let fixture: ComponentFixture<SkyRowComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkyRowComponent],
    });

    fixture = TestBed.createComponent(SkyRowComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should create an element with a specific class name', () => {
    fixture.detectChanges();
    expect(element.querySelector('.sky-row')).toExist();
  });

  it('should add a class name to reverse the column order', () => {
    component.reverseColumnOrder = false;
    fixture.detectChanges();
    expect(element.querySelector('.sky-row-reverse')).not.toExist();

    component.reverseColumnOrder = true;
    fixture.detectChanges();
    expect(element.querySelector('.sky-row-reverse')).toExist();

    component.reverseColumnOrder = undefined;
    fixture.detectChanges();
    expect(element.querySelector('.sky-row-reverse')).not.toExist();
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

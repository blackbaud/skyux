import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyRowComponent } from './row.component';

describe('SkyRowComponent', () => {
  let fixture: ComponentFixture<SkyRowComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyRowComponent],
    });

    fixture = TestBed.createComponent(SkyRowComponent);

    element = fixture.nativeElement;
  });

  it('should create an element with a specific class name', () => {
    fixture.detectChanges();
    expect(element.querySelector('.sky-row')).toExist();
  });

  it('should add a class name to reverse the column order', () => {
    fixture.componentRef.setInput('reverseColumnOrder', false);
    fixture.detectChanges();
    expect(element.querySelector('.sky-row-reverse')).not.toExist();

    fixture.componentRef.setInput('reverseColumnOrder', true);
    fixture.detectChanges();
    expect(element.querySelector('.sky-row-reverse')).toExist();

    fixture.componentRef.setInput('reverseColumnOrder', undefined);
    fixture.detectChanges();
    expect(element.querySelector('.sky-row-reverse')).not.toExist();
  });

  it('should be accessible', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

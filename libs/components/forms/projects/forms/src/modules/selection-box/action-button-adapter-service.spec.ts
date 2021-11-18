import { Component, ElementRef, ViewChild } from '@angular/core';

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyMediaBreakpoints } from '@skyux/core';

import { SkySelectionBoxAdapterService } from './selection-box-adapter.service';

@Component({
  selector: 'sky-test-cmp',
  template: `
    <div [style.width]="parentWidth" #parent>
      <div #child>Hello world</div>
    </div>
    <div #outisde>I'm outside the parent!</div>
  `,
})
class SkySelectionBoxAdapterTestComponent {
  public parentWidth: string;

  @ViewChild('child', {
    read: ElementRef,
    static: true,
  })
  public childRef: ElementRef;

  @ViewChild('outisde', {
    read: ElementRef,
    static: true,
  })
  public outsideRef: ElementRef;

  @ViewChild('parent', {
    read: ElementRef,
    static: true,
  })
  public parentRef: ElementRef;
}

describe('Action button adapter service', () => {
  let fixture: ComponentFixture<SkySelectionBoxAdapterTestComponent>;
  let inputRef: ElementRef;
  let outisdeRef: ElementRef;
  let parentRef: ElementRef;
  let adapter: SkySelectionBoxAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkySelectionBoxAdapterTestComponent],
      providers: [SkySelectionBoxAdapterService],
    });

    fixture = TestBed.createComponent(SkySelectionBoxAdapterTestComponent);
    fixture.detectChanges();
    inputRef = fixture.componentInstance.childRef;
    outisdeRef = fixture.componentInstance.outsideRef;
    parentRef = fixture.componentInstance.parentRef;
    adapter = TestBed.inject(SkySelectionBoxAdapterService);
  });

  it('should return width for parent', () => {
    fixture.componentInstance.parentWidth = '900px';
    fixture.detectChanges();
    const width = adapter.getParentWidth(inputRef);
    expect(width).toEqual(900);
  });

  it('should return true when element is a descendant', () => {
    const isDescendant = adapter.isDescendant(
      parentRef,
      inputRef.nativeElement
    );
    expect(isDescendant).toBeTrue();
  });

  it('should return false when element is not a descendant', () => {
    const isDescendant = adapter.isDescendant(
      parentRef,
      outisdeRef.nativeElement
    );
    expect(isDescendant).toBeFalse();
  });

  it('should return xs breakpoint when width is under 768', () => {
    const breakpoint = adapter.getBreakpointForWidth(767);
    expect(breakpoint).toEqual(SkyMediaBreakpoints.xs);
  });

  it('should return sm breakpoint when width is under 991', () => {
    const breakpoint = adapter.getBreakpointForWidth(991);
    expect(breakpoint).toEqual(SkyMediaBreakpoints.sm);
  });

  it('should return md breakpoint when width is between 992 and 1439', () => {
    const breakpoint = adapter.getBreakpointForWidth(992);
    expect(breakpoint).toEqual(SkyMediaBreakpoints.md);
  });

  it('should return lg breakpoint when width is above 1439', () => {
    const breakpoint = adapter.getBreakpointForWidth(1440);
    expect(breakpoint).toEqual(SkyMediaBreakpoints.lg);
  });

  it('should set responsive xs class when breakpoint is xs', () => {
    adapter.setResponsiveClass(inputRef, SkyMediaBreakpoints.xs);
    fixture.detectChanges();

    expect(inputRef.nativeElement).toHaveClass(
      'sky-selection-box-container-xs'
    );
    expect(inputRef.nativeElement).not.toHaveClass(
      'sky-selection-box-container-sm'
    );
    expect(inputRef.nativeElement).not.toHaveClass(
      'sky-selection-box-container-md'
    );
    expect(inputRef.nativeElement).not.toHaveClass(
      'sky-selection-box-container-lg'
    );
  });

  it('should set responsive sm class when breakpoint is sm', () => {
    adapter.setResponsiveClass(inputRef, SkyMediaBreakpoints.sm);
    fixture.detectChanges();

    expect(inputRef.nativeElement).not.toHaveClass(
      'sky-selection-box-container-xs'
    );
    expect(inputRef.nativeElement).toHaveClass(
      'sky-selection-box-container-sm'
    );
    expect(inputRef.nativeElement).not.toHaveClass(
      'sky-selection-box-container-md'
    );
    expect(inputRef.nativeElement).not.toHaveClass(
      'sky-selection-box-container-lg'
    );
  });

  it('should set responsive md class when breakpoint is md', () => {
    adapter.setResponsiveClass(inputRef, SkyMediaBreakpoints.md);
    fixture.detectChanges();

    expect(inputRef.nativeElement).not.toHaveClass(
      'sky-selection-box-container-xs'
    );
    expect(inputRef.nativeElement).not.toHaveClass(
      'sky-selection-box-container-sm'
    );
    expect(inputRef.nativeElement).toHaveClass(
      'sky-selection-box-container-md'
    );
    expect(inputRef.nativeElement).not.toHaveClass(
      'sky-selection-box-container-lg'
    );
  });

  it('should set responsive lg class when breakpoint is lg', () => {
    adapter.setResponsiveClass(inputRef, SkyMediaBreakpoints.lg);
    fixture.detectChanges();

    expect(inputRef.nativeElement).not.toHaveClass(
      'sky-selection-box-container-xs'
    );
    expect(inputRef.nativeElement).not.toHaveClass(
      'sky-selection-box-container-sm'
    );
    expect(inputRef.nativeElement).not.toHaveClass(
      'sky-selection-box-container-md'
    );
    expect(inputRef.nativeElement).toHaveClass(
      'sky-selection-box-container-lg'
    );
  });
});

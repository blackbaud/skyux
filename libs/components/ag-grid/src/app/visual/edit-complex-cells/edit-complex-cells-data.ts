export class EditableGridRow {
  public name: string;
  public language: 'English' | 'Spanish' | 'French' | 'Portuguese' | '(other)';
}

export const EDITABLE_GRID_DATA: EditableGridRow[] = Array.from(Array(10).keys()).map((i) => {
  return {
    name: `Person ${i + 1}`,
    language: 'English'
  };
});

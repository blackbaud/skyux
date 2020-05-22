import {
  InputConverter,
  booleanConverter,
  stringConverter,
  numberConverter
} from './input-converter';

class MockComponentExplicit {
  @InputConverter(booleanConverter)
  public myBoolean: boolean;

  @InputConverter(stringConverter)
  public myString: string;

  @InputConverter(numberConverter)
  public myNumber: number;
}

describe('InputConverter', () => {
  it('should convert values when using explicit converters', () => {
    const component = new MockComponentExplicit();

    component.myBoolean = 'true' as any;
    expect(component.myBoolean).toBe(true);

    component.myBoolean = 'false' as any;
    expect(component.myBoolean).toBe(false);

    component.myString = 5 as any;
    expect(component.myString).toBe('5');

    component.myString = 'hello' as any;
    expect(component.myString).toBe('hello');

    component.myNumber = '7' as any;
    expect(component.myNumber).toBe(7);
  });
});

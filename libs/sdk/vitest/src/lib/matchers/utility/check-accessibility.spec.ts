import { SkyA11yAnalyzer } from '../../a11y/a11y-analyzer';
import { checkAccessibility } from './check-accessibility';

describe('checkAccessibility', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  it('should return pass: true for an accessible element', async () => {
    vi.spyOn(SkyA11yAnalyzer, 'run').mockResolvedValue();

    const result = await checkAccessibility(el);

    expect(result.pass).toBe(true);
    expect(result.message).toBe(
      'Expected accessibility violations, but none were found.',
    );
  });

  it('should return pass: false when violations are found', async () => {
    vi.spyOn(SkyA11yAnalyzer, 'run').mockRejectedValue(
      new Error('Violation found'),
    );

    const result = await checkAccessibility(el);

    expect(result.pass).toBe(false);
    expect(result.message).toBe('Violation found');
  });

  it('should accept a Document and use documentElement', async () => {
    vi.spyOn(SkyA11yAnalyzer, 'run').mockResolvedValue();

    const result = await checkAccessibility(document);

    expect(result.pass).toBe(true);
  });

  it('should throw if the target is not an Element', async () => {
    await expect(
      checkAccessibility({} as unknown as Element),
    ).rejects.toThrowError('toBeAccessible expects an Element or Document.');
  });
});

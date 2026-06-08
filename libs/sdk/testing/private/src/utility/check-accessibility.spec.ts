import { _SkyA11yAnalyzer } from '../a11y/a11y-analyzer';

import { _skyTestingCheckAccessibility } from './check-accessibility';

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
    vi.spyOn(_SkyA11yAnalyzer, 'run').mockResolvedValue();

    const result = await _skyTestingCheckAccessibility(el);

    expect(result.pass).toBe(true);
    expect(result.message).toBe(
      'Expected accessibility violations, but none were found.',
    );
  });

  it('should return pass: false when violations are found', async () => {
    vi.spyOn(_SkyA11yAnalyzer, 'run').mockRejectedValue(
      new Error('Violation found'),
    );

    const result = await _skyTestingCheckAccessibility(el);

    expect(result.pass).toBe(false);
    expect(result.message).toBe('Violation found');
  });

  it('should accept a Document and use documentElement', async () => {
    vi.spyOn(_SkyA11yAnalyzer, 'run').mockResolvedValue();

    const result = await _skyTestingCheckAccessibility(document);

    expect(result.pass).toBe(true);
  });

  it('should throw if the target is not an Element', async () => {
    await expect(
      _skyTestingCheckAccessibility({} as unknown as Element),
    ).rejects.toThrowError('toBeAccessible expects an Element or Document.');
  });
});

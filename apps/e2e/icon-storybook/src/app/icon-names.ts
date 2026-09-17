// A dark mode icon repeats its standard icon's ID with `-dark` appended, e.g.
// `sky-i-my-icon-20-line-dark`.
const DARK_MODE_SUFFIX = 'dark';

/**
 * Returns the sorted, unique icon names in the loaded sprite.
 */
export function getIconNames(doc: Document): string[] {
  const iconSymbols = doc.querySelectorAll('#sky-icon-svg-sprite symbol');

  return Array.from(
    new Set(
      Array.from(iconSymbols)
        .map((el) => {
          let idParts = el.id.split('-');

          // Drop a trailing `dark` segment before reading the name
          if (idParts[idParts.length - 1] === DARK_MODE_SUFFIX) {
            idParts = idParts.slice(0, -1);
          }

          // Construct the icon name by removing `sky-i-` from the beginning
          // and `-<size>-<variant>` from the end.
          return idParts.slice(2, idParts.length - 2).join('-');
        })
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b));
}

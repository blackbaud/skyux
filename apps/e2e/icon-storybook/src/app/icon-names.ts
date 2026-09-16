// A dark mode icon repeats its default icon's ID with `-dark` appended, e.g.
// `sky-i-my-icon-20-line-dark`.
const DARK_MODE_NAME = 'dark';

/**
 * Returns the sorted, unique icon names in the loaded sprite.
 *
 * A dark mode icon collapses into the name of the icon it belongs to rather
 * than becoming a name of its own. These stories are snapshotted in both light
 * and dark mode, so the dark versions are covered without a row of their own.
 */
export function getIconNames(doc: Document): string[] {
  const iconSymbols = doc.querySelectorAll('#sky-icon-svg-sprite symbol');

  return Array.from(
    new Set(
      Array.from(iconSymbols)
        .map((el) => {
          let idParts = el.id.split('-');

          // Drop a trailing `dark` segment before reading the name. Only the
          // final segment is checked, so an icon whose name ends in `-dark` is
          // still read as a default icon.
          if (idParts[idParts.length - 1] === DARK_MODE_NAME) {
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

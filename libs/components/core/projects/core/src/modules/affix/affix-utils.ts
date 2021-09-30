import {
  SkyAffixPlacement
} from './affix-placement';

export function getNextPlacement(placement: SkyAffixPlacement): SkyAffixPlacement {
  const placements: SkyAffixPlacement[] = [
    'above',
    'right',
    'below',
    'left'
  ];

  let index = placements.indexOf(placement) + 1;
  if (index >= placements.length) {
    index = 0;
  }

  return placements[index];
}

export function getInversePlacement(placement: SkyAffixPlacement): SkyAffixPlacement {
  const pairings: {[_: string]: SkyAffixPlacement} = {
    above: 'below',
    below: 'above',
    right: 'left',
    left: 'right'
  };

  return pairings[placement];
}

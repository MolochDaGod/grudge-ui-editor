/**
 * Fleet race portraits — served from client.grudge-studio.com (GrudgeBuilder CDN).
 * Replaces tactical-infinity.replit.app dependency.
 */
(function (global) {
  const CDN = 'https://client.grudge-studio.com/images/portraits';

  const RACE_PORTRAITS = {
    human: `${CDN}/human.png`,
    barbarian: `${CDN}/barbarian.png`,
    dwarf: `${CDN}/dwarf.png`,
    elf: `${CDN}/elf.png`,
    orc: `${CDN}/orc.png`,
    undead: `${CDN}/undead.png`,
    worge: `${CDN}/human.png`,
  };

  function portraitForRace(race) {
    if (!race) return RACE_PORTRAITS.human;
    const key = String(race).toLowerCase().replace(/[^a-z]/g, '');
    return RACE_PORTRAITS[key] || RACE_PORTRAITS.human;
  }

  global.GRUDGE_RACE_PORTRAITS = RACE_PORTRAITS;
  global.grudgePortraitForRace = portraitForRace;
})(typeof window !== 'undefined' ? window : globalThis);
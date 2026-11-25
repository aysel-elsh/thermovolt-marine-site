// Single source of truth for brand copy, links and validated data.
// Content follows the ThermoVolt Marine pitch deck. Replace values marked TODO.

export const SITE = {
  name: 'ThermoVolt Marine',
  tagline: 'Turning wasted engine heat into onboard power.',
  subline: '…and sending cooler water back to the reef.',
  closing: 'The future of marine energy is not just cleaner fuel. It’s using the energy we already waste.',
  founder: 'Aysel Elshenawy',
  founderRole: 'Founder & Lead Engineer',
  place: 'Boca Raton, FL',

  // TODO: full Zenodo DOI link
  zenodoUrl: 'https://zenodo.org/',
  // TODO: video demonstration link
  videoUrl: '#',
  email: 'aelshenawy2023@fau.edu',
};

// Lab bench results: 15 paired trials, system on vs. off, paired t-test p < 0.001.
export const BENCH = {
  trials: 15,
  heatW: { mean: 512, sd: 84 },
  dropC: { mean: 7.33, sd: 1.17 },
  volts: { mean: 7.81, sd: 0.11 },
  currentMa: 31,
  powerMw: 120,
  energyJ: 14.3,
};

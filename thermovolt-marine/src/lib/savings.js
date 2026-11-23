// Projection model from the pitch deck (Appendix B). Projected, not measured.
//   Engine efficiency 40% → fuel energy = shaft power / 0.40
//   25% of fuel energy goes to cooling water
//   30% of cooling flow passes through TVM, 2.2% of that heat becomes electricity
//   Each kWh replaces ~0.11 gal of generator diesel (9 kW genset)
//   CO₂: 10.2 kg per gallon of diesel (EPA)
export const MODEL = {
  efficiency: 0.4,
  coolingShare: 0.25,
  flowThrough: 0.3,
  conversion: 0.022,
  galPerKwh: 0.1105,
  co2KgPerGal: 10.2,
};

export const VESSELS = [
  { id: 'rec', label: 'Weekend cruiser', kw: 110, hours: 150, note: 'Recreational, weekend use' },
  { id: 'charter', label: 'Charter sportfisher', kw: 370, hours: 1000, note: 'Daily trips' },
  { id: 'work', label: 'Workboat / ferry', kw: 750, hours: 3000, note: 'All-day duty' },
];

export function project({ kw, hours, price }) {
  const fuelKw = kw / MODEL.efficiency;
  const coolingKw = fuelKw * MODEL.coolingShare;
  const throughKw = coolingKw * MODEL.flowThrough;
  const powerKw = throughKw * MODEL.conversion;
  const kwh = powerKw * hours;
  const gal = kwh * MODEL.galPerKwh;
  return {
    fuelKw,
    coolingKw,
    throughKw,
    powerKw,
    kwh,
    gal,
    dollars: gal * price,
    co2t: (gal * MODEL.co2KgPerGal) / 1000,
  };
}

// Fleet impact test from the deck: charter-boat savings per boat × fleet size.
export const FLEET = { sam: 6650, defaultBoats: 665, galPerBoat: 169 };

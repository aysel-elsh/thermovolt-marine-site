# ThermoVolt Marine — website

React 18 + Tailwind CSS 3 + Vite. Branding matches the pitch deck: Montserrat (headlines), Poppins (body),
navy #0E2152, royal blue #1B45C4, grey-blue #BDCDD3, amber #F5B82E, logo sky #3B9EF1.

```bash
npm install
npm run dev            # local dev server
npm run build          # production build -> dist/
npm run build:single   # one self-contained index.html -> dist-single/
```

## Pages
Home · Technology · Savings · Business · About · Contact, on a small hash router (`src/router.jsx`),
so it deploys to any static host (Vercel, GitHub Pages) without rewrite rules.

## Interactive pieces
- `HeroScene` — boat cutaway with a TVM on/off switch (plume, cabin power, reef)
- `HowItWorks` — Capture / Convert / Control stepper with a live thermoelectric cross-section
- `LabProof` — bench results with ± ranges
- `CompareFilter` — tap the needs that matter, see which options survive
- `SavingsCalculator` — deck model (Appendix B) with "where the fuel goes" breakdown
- `FleetImpact` — scale savings across Florida's working fleet
- `MarketZoom` — 1.03M boats → SOM, zoomable grid
- `PackageBuilder` — kits, Oasis and Care Plan pricing
- `Roadmap` — Y1–Y5 tap-through
- `Gallery` — photo grid with lightbox

## Before deploying
Edit `src/config/site.js`: `zenodoUrl`, `videoUrl`, `email`.
Model constants live in `src/lib/savings.js`.

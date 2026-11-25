import PageIntro from '../components/ui/PageIntro';
import Reveal from '../components/ui/Reveal';
import SavingsCalculator from '../components/SavingsCalculator';
import FleetImpact from '../components/FleetImpact';

export default function Impact() {
  return (
    <>
      <PageIntro
        kicker="Savings calculator"
        title="What TVM is worth on a real boat."
        lede="Pick a boat or set your own engine size, hours and diesel price. These are projections from a simple model, not measured results. Year-2 pilots will replace them with real numbers."
      />
      <section className="section">
        <div className="wrap">
          <SavingsCalculator />
        </div>
      </section>
      <section className="bg-frost">
        <div className="wrap section">
          <Reveal className="mb-12 max-w-3xl">
            <p className="kicker">Fleet impact</p>
            <h2 className="mt-4 text-[clamp(30px,4vw,48px)]">Now scale it across Florida’s working fleet.</h2>
            <p className="lede mt-5">Drag to see what happens when more charter, dive, ferry and towing boats run TVM.</p>
          </Reveal>
          <FleetImpact />
        </div>
      </section>
    </>
  );
}

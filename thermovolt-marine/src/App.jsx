import { useRoute } from './router';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Technology from './pages/Technology';
import Impact from './pages/Impact';
import Business from './pages/Business';
import About from './pages/About';
import Contact from './pages/Contact';

const VIEWS = { home: Home, technology: Technology, impact: Impact, business: Business, about: About, contact: Contact };

export default function App() {
  const route = useRoute();
  const View = VIEWS[route];
  return (
    <>
      <NavBar route={route} />
      <main key={route} className="page-in">
        <View />
      </main>
      <Footer />
    </>
  );
}

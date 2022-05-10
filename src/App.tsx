import {
  Route,
  Routes
} from 'react-router-dom';
import Header from './components/header/Header';
import Signup from './screens/signup/Signup';
import Game from './screens/game/Game';
import NotFound from './screens/notFound/NotFound';

const App = () => (
  <>
    <Header />
    <Routes>
      <Route path='' element={<Game />} />
      <Route path='signup' element={<Signup />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  </>
);

export default App;

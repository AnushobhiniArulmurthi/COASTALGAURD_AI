import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './components/routing/AppRoutes';
import { AdminLanguageProvider } from './context/AdminLanguageContext';
import './styles/variables.css';
import './styles/global.css';
import './styles/utilities.css';

export const App = () => {
  return (
    <BrowserRouter>
      <AdminLanguageProvider>
        <AppRoutes />
      </AdminLanguageProvider>
    </BrowserRouter>
  );
};

export default App;

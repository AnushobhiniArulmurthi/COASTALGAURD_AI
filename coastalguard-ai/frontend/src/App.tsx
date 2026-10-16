import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './components/routing/AppRoutes';
import { LanguageProvider } from './i18n/LanguageContext';
import './styles/variables.css';
import './styles/global.css';
import './styles/utilities.css';

export const App = () => {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;

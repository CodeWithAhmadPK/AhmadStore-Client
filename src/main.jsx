import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Styles: Bootstrap 5 + SCSS Design System
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

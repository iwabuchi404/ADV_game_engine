import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/reset.css';
import './styles/global.css';
import App from './App';
import AppProvider from './components/common/AppProvider.js';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import createStore from 'react-auth-kit/createStore'
import AuthProvider from 'react-auth-kit'
import { BrowserRouter } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/js/index.esm.js";


const store = createStore({
  authName: 'token',
  authType: 'localStorage',
  cookieDomain: window.location.hostname,
  cookieSecure: false
})

// ✅ Define the container before using it
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <AuthProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);

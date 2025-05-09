import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import createStore from 'react-auth-kit/createStore'
import AuthProvider from 'react-auth-kit';
import { BrowserRouter } from "react-router-dom";


const store = createStore({
	authName:'token',
	authType:'localStorage',
	cookieDomain: window.location.hostname,
	cookieSecure: false
  });

const root = createRoot(container);

root.render(
  <AuthProvider
  store={store}
 >
 <BrowserRouter>
   <App />
 </BrowserRouter>
  </AuthProvider>
);

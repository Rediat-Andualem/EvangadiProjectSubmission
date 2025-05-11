import React from 'react';
import Header from '../Header/Header.jsx';
import Footer from "../Footer/Footer.jsx";

function LayOut({ children, showHeader, showFooter }) {
  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      {showHeader && <Header />}
      <div style={{ flex: 1 }}>{children}</div>
      {showFooter && <Footer />}
    </div>
  );
}

export default LayOut;
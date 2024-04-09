import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Main Page</Link>
        </li>
        <li>
          <Link to="/doctors">Doctor Page</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
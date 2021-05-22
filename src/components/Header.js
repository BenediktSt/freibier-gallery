import React from 'react';
import { Link } from 'gatsby';

export default function Header({ onAction = () => {} }) {
  return (
    <header id="header">
      <h1>
        <Link to="/">
          <strong>Freibiergesichter Gallery</strong>
        </Link>
      </h1>
      <nav>
        <ul>
          <li>
            <a
              href="#footer"
              onClick={e => onAction(e, 'about')}
              className="icon fa-info-circle"
            >
              About
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

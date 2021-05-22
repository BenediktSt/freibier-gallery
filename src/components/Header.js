import React from 'react';
import { Link } from 'gatsby';
import firebase from 'gatsby-plugin-firebase';
import 'firebase/auth';

const auth = firebase.auth();

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
            <SignOut></SignOut>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

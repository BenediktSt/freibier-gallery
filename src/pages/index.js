import React, { useState } from 'react';

import Layout from '../components/Layout';
import Gallery from '../components/Gallery';

import firebase from 'gatsby-plugin-firebase';
import 'firebase/auth';
import 'firebase/firestore';
import useAuthState from '../util/useAuthState';

const firestore = firebase.firestore();
const commentsRef = firestore.collection('pictures');
const query = commentsRef
  .orderBy('createdAt', 'desc');
const isBrowser = typeof window !== 'undefined';

let auth;
if (isBrowser) {
  auth = firebase.auth();
}
const IndexPage = () => {
  const [user] = useAuthState(firebase);
  const [pictures, setPictures] = useState();
  const [noPermission, setNoPermission] = useState(false);

  return (
    <Layout>
      {user ? <AppShell /> : <SignIn />}
    </Layout>
  );

  function AppShell() {
    React.useEffect(() => {
      if (user && !pictures) {
        query.get().then((querySnapshot) => {
          const docs = querySnapshot.docs;
          if (docs.length > 0) {
            const data = docs
              .map(doc => doc.data())
              .map(pic => {
                return { src: pic.url, thumbnail: pic.url, title: pic.author };
              });
            setPictures(data);
          }
        }).catch(e => {
          setNoPermission(true);
        });
      }
    }, []);

    return (
      <>
        {user && pictures && <Gallery images={pictures} />}
        {user && noPermission && <NoPermission />}
      </>
    );
  }
};

function SignIn() {

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className='sign-in primary' onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  );
}

function NoPermission() {
  return (
    <>
      <p className='no-permission'>
        Leider hast du keinen Zugriff! <br/>
        Falls du denkst, dass du das haben solltest, dann wende dich an ein Freibiergesicht deines Vertrauens.
      </p>
    </>
  );
}

export default IndexPage;

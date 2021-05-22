import React, { useState } from 'react';

import Layout from '../components/Layout';
import Gallery from '../components/Gallery';

import firebase from 'gatsby-plugin-firebase';
import 'firebase/auth';
import 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const firestore = firebase.firestore();
const commentsRef = firestore.collection('pictures');
const query = commentsRef
  .orderBy('createdAt', 'desc');

const auth = firebase.auth();
const IndexPage = () => {
  const [user] = useAuthState(auth);
  const [pictures, setPictures] = useState();

  React.useEffect(() => {
    if (!pictures) {
      query.get().then((querySnapshot) => {
        const docs = querySnapshot.docs;
        if (docs.length > 0) {
          const data = docs
            .map(doc => doc.data())
            .map(pic => {
              return {src: pic.url, thumbnail: pic.url, title: pic.author}
            });
          setPictures(data);
          console.log(data)
        }
      });
    }
  }, []);
  return (
    <Layout>
        {user && pictures ? <Gallery images={pictures} /> : <SignIn />}
    </Layout>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in primary" onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )
}

export default IndexPage;
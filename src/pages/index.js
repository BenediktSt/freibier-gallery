import React, { useState, useRef, useCallback } from 'react';

import Layout from '../components/Layout';
import Gallery from '../components/Gallery';

import firebase from 'gatsby-plugin-firebase';
import 'firebase/auth';
import 'firebase/firestore';
import useAuthState from '../util/useAuthState';

const firestore = firebase.firestore();
const picturesRef = firestore.collection('pictures');
const PAGE_SIZE = 12;

const isBrowser = typeof window !== 'undefined';
let auth;
if (isBrowser) {
  auth = firebase.auth();
}
const IndexPage = () => {
  const [user] = useAuthState(firebase);
  const [pictures, setPictures] = useState();
  const [noPermission, setNoPermission] = useState(false);
  const [lastDoc, setLastDoc] = useState();
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  return (
    <Layout>
      {user ? <AppShell /> : <SignIn />}
    </Layout>
  );

  function queryPictures(query, resetResult = false) {
    setLoading(true);
    query.get().then((querySnapshot) => {
      const docs = querySnapshot.docs;
      if (docs.length > 0) {
        setLastDoc(docs[querySnapshot.docs.length - 1]);
        const data = docs
          .map(doc => {
            const picData = doc.data()
            const likes = picData.likes ? picData.likes : []
            const tags = picData.tags ? picData.tags : []
            return { src: picData.url, thumbnail: picData.url, title: picData.author, likes: likes, tags: tags, imgId: doc.id };
          });
        setPictures(prevData => {
          if (resetResult || !prevData) return data
          return [...prevData, ...data]
        });
      } else {
        setHasMore(false)
      }
      setLoading(false);
    }).catch(e => {
      setLoading(false);
      setHasMore(false);
      setNoPermission(true);
    });
  }

  function AppShell() {

    const observer = useRef()
    const lastPictureRef = useCallback((node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchNextPatch()
        }
      })
      if (node) observer.current.observe(node)
    }, [])

    React.useEffect(() => {
      if (user && !pictures) {
        const initialQuery = picturesRef
          .orderBy('createdAt', 'desc')
          .limit(PAGE_SIZE);
        queryPictures(initialQuery, true)
      }
    });

    async function fetchNextPatch() {
      const queryNext = picturesRef
        .orderBy('createdAt', 'desc')
        .startAfter(lastDoc)
        .limit(PAGE_SIZE);
      queryPictures(queryNext)
    }
    return (
      <>
        {user && pictures && <Gallery images={pictures} lastElementRef={lastPictureRef} />}
        {user && noPermission && <NoPermission />}
        <div>{loading && 'Loading...'}</div>
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

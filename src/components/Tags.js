import PropTypes from 'prop-types';
import React, { useState } from 'react';
import firebase from 'gatsby-plugin-firebase';
import 'firebase/auth';
import 'firebase/firestore';

const isBrowser = typeof window !== 'undefined';
let auth;
if (isBrowser) {
  auth = firebase.auth();
}

const firestore = firebase.firestore();
const picturesRef = firestore.collection('pictures');

const Tags = ({ tags, imgRefId }) => {
  const [displayedTags, setDisplayedTags] = useState(tags)

  React.useEffect(() => {
    setDisplayedTags([...tags])
  }, [tags, imgRefId])

  function promptForTag(e) {
    e.preventDefault()
    const enteredTag = prompt('Bitte neuen Tag eingeben').toLowerCase()
    const index = tags.indexOf(enteredTag)
    if(index <= -1) {
      tags.push(enteredTag)
      setDisplayedTags([...tags])
      picturesRef.doc(imgRefId).update({tags: [...tags]})
    }
  }

  return (
    <>
      <button id="add-tag-toggle" className='context-menu-button' onClick={promptForTag}>
        <span>Add Tag</span>
        <i className='icon fa-plus-circle' />
      </button>
      <ul className='tags'>
        {displayedTags.map(tag => (
          <li><span href='#' className='tag' key={tag}><i className='icon fa-tags' />{tag}</span></li>
        ))}
      </ul>
    </>
  );
};

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  imgRefId: PropTypes.string,
};

Tags.defaultProps = {
  tags: [],
};

export default Tags;

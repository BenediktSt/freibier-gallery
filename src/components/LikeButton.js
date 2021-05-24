import PropTypes from 'prop-types'
import React, {useState} from 'react';
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

const LikeButton = ({likingUsers, imgRefId}) => {
  const currentUserId = auth.currentUser.uid;
  const [active, setActive] = useState(likingUsers.includes(currentUserId))
  const likeCount = likingUsers.length;

  React.useEffect(() => {
    setActive(likingUsers.includes(currentUserId))
  }, [likingUsers, imgRefId])

  function toggleLike(e) {
    e.preventDefault()
    setActive(currentActive => {
      if (currentActive) {
        const index = likingUsers.indexOf(currentUserId)
        if (index > -1) {
          likingUsers.splice(index, 1);
        }
      } else {
        likingUsers.push(currentUserId)
      }
      picturesRef.doc(imgRefId).update({likes: likingUsers})
      return !currentActive
    })
  }

  return (
    <button className="context-menu-button" onClick={toggleLike}>
      <span>{likeCount}</span>
      <i className={active ? 'icon fa-heart' : 'icon fa-heart-o'} />
    </button>
  )
}

LikeButton.propTypes = {
  likingUsers: PropTypes.arrayOf(PropTypes.string),
  imgRefId: PropTypes.string
}

LikeButton.defaultProps = {
  likingUsers: []
}

export default LikeButton

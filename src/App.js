// src/App.js
import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, ThemeProvider, createTheme, Input } from '@mui/material';
import { styled } from '@mui/system';
import { db, auth } from './firebase';
import Post from './Post'; 
import './App.css';
import ImageUpload from './ImageUpload'; 


const theme = createTheme();

const ModalPaper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  width: 400,
  backgroundColor: theme.palette.background.paper,
  border: '2px solid #000',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

function App() {
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);

        if (!authUser.displayName) {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    const unsubscribe = db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({
        id: doc.id,
        post: doc.data(),
      })));
    });

    return () => unsubscribe();
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => {
        alert(error.message);
      });

    setOpenSignUp(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        alert(error.message);
      });

    setOpenSignIn(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        
        <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
          <ModalPaper style={modalStyle}>
            <form className="app__signup" onSubmit={signUp}>
              <center>
                <img
                  className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="Instagram Logo"
                />
              </center>
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit">Sign Up</Button>
            </form>
          </ModalPaper>
        </Modal>

        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <ModalPaper style={modalStyle}>
            <form className="app__signin" onSubmit={signIn}>
              <center>
                <img
                  className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="Instagram Logo"
                />
              </center>
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit">Sign In</Button>
            </form>
          </ModalPaper>
        </Modal>

        <div className="app__header">
          <img
            className="app_headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt="Instagram Logo"
          />
          {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__logincontainer">
            <Button type="button" onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button type="button" onClick={() => setOpenSignUp(true)}>Sign Up</Button>
          </div>
        )}
        </div>
        
        <div className="app__posts">
        {
          posts.map(({ id, post }) => (
          <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }


      </div>
        
        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h3>Sorry You Need To Login to Upload</h3>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;

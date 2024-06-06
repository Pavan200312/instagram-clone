import React, { useState } from 'react';
import { Button } from '@mui/material';
import { storage, db, firebase } from './firebase';
import './ImageUpload.css';

function ImageUpload({ username }) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!image) {
      alert('Please select an image to upload.');
      return;
    }

    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection('posts').add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            })
            .then(() => {
              setProgress(0);
              setCaption('');
              setImage(null);
              document.getElementById('fileInput').value = null; // Clear file input
              console.log('Upload successful');
            })
            .catch(error => {
              console.error('Error adding document: ', error);
            });
          })
          .catch(error => {
            console.error('Error getting download URL: ', error);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <input
        type="text"
        placeholder="Enter a caption"
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input id="fileInput" type="file" onChange={handleChange} />
      <progress className="imageUpload_progress" value={progress} max="100" />
      <Button onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;

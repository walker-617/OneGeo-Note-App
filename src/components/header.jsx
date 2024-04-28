import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { useEffect, useState } from "react";

import { PiSignOutBold } from "react-icons/pi";
import { MdCloudSync } from "react-icons/md";
import { MdCloudUpload } from "react-icons/md";

import { FaUserLarge } from "react-icons/fa6";

import { db } from "../utils/firebase";
import { getDoc, setDoc, doc, onSnapshot } from "firebase/firestore";
import { update } from "firebase/database";

function Header({ notes, setNotes, notesChanged, setNotesChanged }) {
  const [signedIn, setSignedIn] = useState(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [databaseChanged, setDatabaseChanged] = useState(false);

  const [updateNeeded, setUpdateNeeded] = useState(false);

  useEffect(() => {
    let unsubscribe;
    setLoading(true);
    const authStateChanged = getAuth().onAuthStateChanged((user) => {
      if (user) {
        unsubscribe = onSnapshot(doc(db, user.email, "notes"), (doc) => {
          if (updateNeeded) {
            setDatabaseChanged(true);
          } else {
            setUpdateNeeded((prevState) => {
              if (prevState) {
                setDatabaseChanged(true);
              }
              return true;
            });
          }
        });
        setSignedIn(true);
        setUser(user);
      } else {
        setSignedIn(false);
      }
      setLoading(false);
    });

    return () => {
      authStateChanged();
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  function GoogleSignIn() {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then((result) => {
        setUser(result.user);
        setSignedIn(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function signOut() {
    getAuth()
      .signOut()
      .then(() => {
        setSignedIn(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function upload() {
    setDoc(
      doc(db, user.email, "notes"),
      {
        notes: notes,
      },
      { merge: true }
    ).then(() => {
      setNotesChanged(false);
      setDatabaseChanged(false);
    });
  }

  function sync() {
    getDoc(doc(db, user.email, "notes")).then((doc) => {
      if (doc?.data()?.notes) {
        setNotes(doc.data().notes);
      } else {
        setNotes([]);
      }
      setDatabaseChanged(false);
    });
  }

  return (
    <div className="header">
      {!signedIn && !loading ? (
        <>
          <div className="title">NOTE TAKER</div>
          <div className="signin">
            <div>To save the notes, sign in with</div>
            <div className="google-icon" onClick={() => GoogleSignIn()}>
              <FcGoogle style={{ fontSize: "25px" }} />
              oogle
            </div>
          </div>
        </>
      ) : loading ? (
        <>
          <div className="user">
            <FaUserLarge className="google-icon" />
            <div className="user-info">
              <div>Loading...</div>
              <div>loading...</div>
            </div>
          </div>
          <div className="signin">
            <div className="google-icon">
              <MdCloudSync style={{ fontSize: "25px" }} />{" "}
            </div>
            <div className="google-icon">
              <MdCloudUpload style={{ fontSize: "25px" }} />
            </div>
            <div className="google-icon">
              <PiSignOutBold style={{ fontSize: "25px" }} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="user">
            <img src={user.photoURL} alt="user" className="user-photo" />
            <div className="user-info">
              <div>{user.displayName.toUpperCase()}</div>
              <div>{user.email}</div>
            </div>
          </div>
          <div className="signin">
            <div
              className="sync-icon"
              style={
                databaseChanged
                  ? { backgroundColor: "rgb(207, 134, 0)" }
                  : { backgroundColor: "green" }
              }
              id="sync"
              onClick={() => sync()}
            >
              <MdCloudSync style={{ fontSize: "25px" }} />{" "}
            </div>
            <div
              className="upload-icon"
              style={
                notesChanged
                  ? { backgroundColor: "rgb(207, 134, 0)" }
                  : { backgroundColor: "green" }
              }
              id="upload"
              onClick={() => upload()}
            >
              <MdCloudUpload style={{ fontSize: "25px" }} />
            </div>
            <div className="google-icon" onClick={() => signOut()}>
              <PiSignOutBold style={{ fontSize: "25px" }} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Header;

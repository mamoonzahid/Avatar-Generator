// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDNuwXBdQRo9qcoumyTa6QgxnQP44jHCmw",
  authDomain: "tomorrow-s-web.firebaseapp.com",
  projectId: "tomorrow-s-web",
  storageBucket: "tomorrow-s-web.appspot.com",
  messagingSenderId: "203366417015",
  appId: "1:203366417015:web:c58b1e557bf0ce0400fc72",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

function showMessage(message, type) {
  const existingPopup = document.getElementById("popupMessage");
  if (existingPopup) {
    existingPopup.remove();
  }
  const popup = document.createElement("div");
  popup.id = "popupMessage";
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.padding = "10px 20px";
  popup.style.color = "#fff";
  popup.style.backgroundColor = type === "error" ? "#ff3860" : "#23d160";
  popup.style.borderRadius = "5px";
  popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  popup.style.zIndex = "1000";
  popup.innerText = message;

  document.body.appendChild(popup);
  setTimeout(() => {
    popup.style.opacity = "0";
    setTimeout(() => popup.remove(), 600);
  }, 3000);
}

document.getElementById("submitSignUp").addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("rEmail").value;
  const password = document.getElementById("rPassword").value;
  const firstName = document.getElementById("fName").value;
  const lastName = document.getElementById("lName").value;
  const themePreference = document.querySelector(
    'input[name="themePreference"]:checked'
  ).value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        preferences: {
          theme: themePreference,
        },
      };
      showMessage("Account Created Successfully", "success");
      setDoc(doc(db, "users", user.uid), userData)
        .then(() => {
          window.location.href = "homepage.html";
        })
        .catch((error) => {
          console.error("Error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      showMessage("Error: " + errorCode, "error");
    });
});

document.getElementById("submitSignIn").addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      showMessage("Login is successful", "success");
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      window.location.href = "homepage.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      showMessage("Error: " + errorCode, "error");
    });
});

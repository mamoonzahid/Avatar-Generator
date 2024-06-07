document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector("button");

  button.addEventListener("click", function () {
    generateRandomAvatar();
  });

  function generateRandomAvatar() {
    const styles = ["pixel-art", "lorelei", "bottts"]; // Add more styles as desired
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomSeed = Math.floor(Math.random() * 1000000).toString();

    const url = `https://api.dicebear.com/8.x/${randomStyle}/svg?seed=${randomSeed}`;
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        const display = document.getElementById("avatarDisplay");
        const encodedData = encodeURIComponent(data);
        display.innerHTML = `<div class="avatar-wrapper"><img class="avatar" src="data:image/svg+xml;utf8,${encodedData}" alt="Random Avatar"/><span class="download-text">Click the avatar to download</span></div>`;

        const img = display.querySelector(".avatar");
        img.addEventListener("click", () =>
          downloadAvatar(data, randomStyle, randomSeed)
        );
        img.classList.add("avatar-animation");

        img.addEventListener("animationend", () => {
          img.classList.remove("avatar-animation");
        });
      })
      .catch((error) => console.error("Error fetching the avatar:", error));
  }

  function downloadAvatar(svgData, style, seed) {
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const image = new Image();
    image.src = url;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${style}-${seed}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    };
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  getDoc,
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid); // Use user.uid instead of localStorage
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log("User data fetched:", userData); // Debug log for fetched user data
          document.getElementById("loggedUserFName").innerText =
            userData.firstName;
          document.getElementById("loggedUserLName").innerText =
            userData.lastName;
          // Apply theme preferences
          applyThemePreferences(userData.preferences);
        } else {
          console.log("No document found matching ID");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  } else {
    console.log("User not logged in or session expired");
  }
});

function applyThemePreferences(preferences) {
  if (preferences && preferences.theme === "dark") {
    document.body.classList.add("dark-theme");
    console.log("Dark theme applied");
  } else {
    document.body.classList.remove("dark-theme");
    console.log("Light theme detected or no theme preference set");
  }
}

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error Signing out:", error);
    });
});

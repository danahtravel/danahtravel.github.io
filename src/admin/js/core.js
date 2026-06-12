import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// 1. Strict Zero-Trust Entry Gate
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace('/');
    return;
  }

  try {
    // 2. Resolve Role-Based Access Control (RBAC) Payload
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && userSnap.data().role === 'admin') {
      initializeCommandCenter();
    } else {
      console.warn("Security Alert: Insufficient privileges.");
      window.location.replace('/dashboard/');
    }
  } catch (error) {
    console.error("RBAC Handshake Failed:", error);
    window.location.replace('/');
  }
});

function initializeCommandCenter() {
  console.log("Admin environment successfully mounted.");
  // Execute Firestore queries here to hydrate the .table-admin rows dynamically
}

// 3. Expose Secure Termination Global Hook
window.adminLogout = async () => {
  await signOut(auth);
  window.location.replace('/');
};

/* ---- 2. CUSTOM CURSOR ENGINE ----------------------------- */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let posX = 0, posY = 0;

  // Track raw mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth interpolation (Lerp) for the outer ring
  const updateCursor = () => {
    // 1. Move the dot instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top  = `${mouseY}px`;

    // 2. Interpolate the ring (Ease effect)
    posX += (mouseX - posX) * 0.15;
    posY += (mouseY - posY) * 0.15;
    
    cursorRing.style.left = `${posX}px`;
    cursorRing.style.top  = `${posY}px`;

    requestAnimationFrame(updateCursor);
  };
  
  updateCursor();

  // Hover Effect: Trigger .grow class on clickable elements
  const clickableElements = 'a, button, .serv-card, .gal-item, .nav-links li';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(clickableElements)) {
      cursorDot.classList.add('grow');
      cursorRing.classList.add('grow');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(clickableElements)) {
      cursorDot.classList.remove('grow');
      cursorRing.classList.remove('grow');
    }
  });
}
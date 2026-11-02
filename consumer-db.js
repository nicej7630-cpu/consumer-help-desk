// ═══════════════════════════════════════════════════════════════
// CONSUMER HELP DESK — private database connection (Firebase)
// Complaints are visible only to the admin. Testimonies are shown
// on the website only after the admin approves them.
// ═══════════════════════════════════════════════════════════════
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, setDoc, doc, updateDoc, query, where, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDCW7hoZLCB0ennI5e-beOLFTGjd3nvw5s",
  authDomain: "consumer-help-desk.firebaseapp.com",
  projectId: "consumer-help-desk",
  storageBucket: "consumer-help-desk.firebasestorage.app",
  messagingSenderId: "527227665586",
  appId: "1:527227665586:web:b94129a3d2e7c536945dab",
  measurementId: "G-3FX15Q045P"
};

// The one admin account. Set this to the email you will sign in with.
export const ADMIN_EMAIL = "consumercen.us@gmail.com";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── ADMIN SIGN-IN ───────────────────────────────────────────────
export const adminSignIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const adminSignOut = () => signOut(auth);
export const onAdminChange = cb => onAuthStateChanged(auth, cb);

// ── COMPLAINTS (anyone can send; only the admin can read) ──────
export async function submitComplaint(data){
  const ref = await addDoc(collection(db, "complaints"), { ...data, status: "New", createdAt: serverTimestamp() });
  // Public status record: holds only the status and a scrambled reference + email (never the email itself)
  const emailHash = await sha256(ref.id + "|" + data.email.trim().toLowerCase());
  await setDoc(doc(db, "statusPublic", ref.id), { status: "New", emailHash: emailHash, createdAt: serverTimestamp() });
  return ref.id;
}
export async function listComplaints(){
  const snap = await getDocs(query(collection(db, "complaints"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function updateComplaint(id, data){
  await updateDoc(doc(db, "complaints", id), data);
  if(data.status){
    await updateDoc(doc(db, "statusPublic", id), { status: data.status });
  }
}

// Used by the status page: returns the status only if the reference and email match
export async function checkStatus(ref, email){
  const snap = await getDoc(doc(db, "statusPublic", ref));
  if(!snap.exists()) return null;
  const want = await sha256(ref + "|" + email.trim().toLowerCase());
  return snap.data().emailHash === want ? snap.data().status : null;
}

async function sha256(text){
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
}

// ── GUIDE FEEDBACK (anyone can answer; only the admin can read) ──
export async function submitFeedback(guide, helpful){
  await addDoc(collection(db, "feedback"), { guide: guide, helpful: helpful, createdAt: serverTimestamp() });
}

// ── TESTIMONIES (sent by people; shown only after approval) ────
export async function submitTestimony(data){
  await addDoc(collection(db, "testimonies"), { ...data, approved: false, createdAt: serverTimestamp() });
}
export async function listApprovedTestimonies(){
  const snap = await getDocs(query(collection(db, "testimonies"), where("approved", "==", true)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function listAllTestimonies(){
  const snap = await getDocs(query(collection(db, "testimonies"), orderBy("createdAt", "desc")));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export async function approveTestimony(id, approved){
  await updateDoc(doc(db, "testimonies", id), { approved: approved });
}

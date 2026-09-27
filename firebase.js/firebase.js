import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, onValue, set, runTransaction } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDQnf7VaPe1i0c5a4ACulDMk_PtXiEMCtY",
    authDomain: "marcador-taekwondo.firebaseapp.com",
    databaseURL: "https://marcador-taekwondo-default-rtdb.firebaseio.com",
    projectId: "marcador-taekwondo",
    storageBucket: "marcador-taekwondo.firebasestorage.app",
    messagingSenderId: "96234670023",
    appId: "1:96234670023:web:21316ba3d221554ba07be2",
    measurementId: "G-V71HW9YQMD"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const marcadorRef = ref(db, "marcador");

export function guardarMarcador(datos) {
    return set(marcadorRef, datos);
}

export function escucharMarcador(callback) {
    onValue(marcadorRef, (snapshot) => {
        const datos = snapshot.val();
        if (datos !== null) {
            callback(datos);
        }
    });
}

window.firebaseSync = {
  subscribe: function(roomId, callback) {
    const roomRef = ref(db, `salas/${roomId}`);
    onValue(roomRef, (snapshot) => {
      callback(snapshot.val());
      const syncStatus = document.getElementById('sync-status');
      if(syncStatus) {
          syncStatus.textContent = "🟢 Conectado";
          syncStatus.classList.remove('offline');
          syncStatus.classList.add('online');
      }
    }, (error) => {
      console.error("Firebase Error:", error);
    });

    onValue(ref(db, ".info/serverTimeOffset"), (snapshot) => {
      window.serverTimeOffset = Number(snapshot.val()) || 0;
    });
  },
  
  updateField: function(roomId, field, value) {
    set(ref(db, `salas/${roomId}/${field}`), value).catch(err => console.error(err));
  },
  
  transaction: async function(roomId, updateFn) {
    const roomRef = ref(db, `salas/${roomId}`);
    await runTransaction(roomRef, updateFn);
  }
};

window.dispatchEvent(new Event('firebase-ready'));
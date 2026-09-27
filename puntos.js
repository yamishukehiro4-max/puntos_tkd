import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, onValue, set, runTransaction } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// =====================================================
// CONFIGURACIÓN FIREBASE
// =====================================================
const firebaseConfig = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "TU-PROYECTO.firebaseapp.com",
  databaseURL: "https://TU-PROYECTO-default-rtdb.firebaseio.com",
  projectId: "TU-PROYECTO",
  storageBucket: "TU-PROYECTO.appspot.com",
  messagingSenderId: "PEGA_AQUI_TU_SENDER_ID",
  appId: "PEGA_AQUI_TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Exponemos las funciones de sincronización para que puntos.js las use
window.firebaseSync = {
  subscribe: function(roomId, callback) {
    const roomRef = ref(db, `salas/${roomId}`);
    onValue(roomRef, (snapshot) => {
      callback(snapshot.val());
    }, (error) => {
      console.error("Firebase Error:", error);
      if(window.setStatus) window.setStatus("Error de conexión", "error");
    });

    // Sincronizar tiempo del servidor
    onValue(ref(db, ".info/serverTimeOffset"), (snapshot) => {
      window.serverTimeOffset = Number(snapshot.val()) || 0;
    });
  },
  
  updateField: function(roomId, field, value) {
    set(ref(db, `salas/${roomId}/${field}`), value).catch(err => {
      console.error(err);
      if(window.setStatus) window.setStatus("Error al guardar texto", "error");
    });
  },
  
  transaction: async function(roomId, updateFn) {
    const roomRef = ref(db, `salas/${roomId}`);
    await runTransaction(roomRef, updateFn);
  }
};

// Lanzar evento avisando a puntos.js que Firebase ya cargó sus módulos
window.dispatchEvent(new Event('firebase-ready'));
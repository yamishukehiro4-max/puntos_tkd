// ==================================
// LÓGICA DE LA PANTALLA DE CARGA
// ==================================
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader-wrapper').style.display = 'none';
    document.getElementById('main-content').style.display = 'flex';
  }, 3000);
});

// ==================================
// PUNTOS E HISTORIALES
// ==================================
let scores = { blue: 0, red: 0 };
let globalHistoryData = {
  blue: [],
  red: []
};

function addPoints(side, points) {
  scores[side] += points;
  if (scores[side] < 0) scores[side] = 0; 

  document.getElementById(`score-${side}`).innerText = scores[side];

  const actionText = points > 0 ? `+${points} punto(s)` : `${points} punto`;
  const timeString = document.getElementById('timer').innerText;

  // Actualizar historial local 
  const historyList = document.getElementById(`history-${side}`);
  const li = document.createElement('li');
  li.innerText = actionText;
  historyList.appendChild(li);
  historyList.scrollTop = historyList.scrollHeight;

  // Actualizar historial global guardando acción y tiempo exacto
  globalHistoryData[side].push({
    action: actionText,
    time: timeString
  });
}

function addGamjeom(side) {
  const opponent = side === 'blue' ? 'red' : 'blue';
  const timeString = document.getElementById('timer').innerText;
  
  // Historial local para quien recibe la amonestación
  const historyList = document.getElementById(`history-${side}`);
  const li = document.createElement('li');
  li.innerText = 'Amonestación (Gam-jeom)';
  historyList.appendChild(li);
  historyList.scrollTop = historyList.scrollHeight;

  // Sumar 1 punto al rival
  scores[opponent] += 1;
  document.getElementById(`score-${opponent}`).innerText = scores[opponent];

  // Historial global
  globalHistoryData[side].push({
    action: 'Amonestación (Gam-jeom)',
    time: timeString
  });
  
  globalHistoryData[opponent].push({
    action: '+1 punto (Amonestación rival)',
    time: timeString
  });
}

function resetBoard() {
  scores.blue = 0;
  scores.red = 0;
  document.getElementById('score-blue').innerText = 0;
  document.getElementById('score-red').innerText = 0;
  document.getElementById('history-blue').innerHTML = '';
  document.getElementById('history-red').innerHTML = '';
  
  globalHistoryData.blue = [];
  globalHistoryData.red = [];
  
  resetTimer();
}

// ==================================
// MODAL DE HISTORIAL GLOBAL ORDENADO
// ==================================
function openGlobalHistory() {
  const modal = document.getElementById('history-modal');
  
  // Extra: Ahora muestra el nombre de la escuela junto al del competidor en el historial
  const schoolBlue = document.getElementById('school-blue').value;
  const nameBlue = document.getElementById('name-blue').value;
  document.getElementById('modal-blue-name').innerText = schoolBlue ? `${schoolBlue} -${nameBlue}` : nameBlue;

  const schoolRed = document.getElementById('school-red').value;
  const nameRed = document.getElementById('name-red').value;
  document.getElementById('modal-red-name').innerText = schoolRed ? `${schoolRed} -${nameRed}` : nameRed;
  
  const listBlue = document.getElementById('global-history-blue');
  const listRed = document.getElementById('global-history-red');
  
  listBlue.innerHTML = '';
  listRed.innerHTML = '';
  
  // Llenar columna azul
  if (globalHistoryData.blue.length === 0) {
    listBlue.innerHTML = '<li>Sin eventos registrados.</li>';
  } else {
    globalHistoryData.blue.forEach(event => {
      listBlue.innerHTML += `<li><span>${event.action}</span> <span class="time-stamp">${event.time}</span></li>`;
    });
  }

  // Llenar columna roja
  if (globalHistoryData.red.length === 0) {
    listRed.innerHTML = '<li>Sin eventos registrados.</li>';
  } else {
    globalHistoryData.red.forEach(event => {
      listRed.innerHTML += `<li><span>${event.action}</span> <span class="time-stamp">${event.time}</span></li>`;
    });
  }
  
  modal.style.display = 'block';
}

function closeGlobalHistory() {
  document.getElementById('history-modal').style.display = 'none';
}

// ==================================
// LÓGICA DEL CRONÓMETRO EDITABLE
// ==================================
let timerInterval;
let totalSeconds = 120; // 2 minutos
let isRunning = false;

function updateTimerDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('timer').innerText = display;
}

function adjustTimer(secondsToAdd) {
  totalSeconds += secondsToAdd;
  if (totalSeconds < 0) totalSeconds = 0; 
  updateTimerDisplay();
}

function startTimer() {
  if (!isRunning && totalSeconds > 0) {
    isRunning = true;
    timerInterval = setInterval(() => {
      totalSeconds--;
      updateTimerDisplay();
      
      if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        alert("¡TIEMPO FINALIZADO!");
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  pauseTimer();
  totalSeconds = 120; 
  updateTimerDisplay();
}

updateTimerDisplay();
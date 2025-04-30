
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBA8kMAVLTTOy8M8x4CRnd1sZT4DNjjjcI",
  authDomain: "endless-doors.firebaseapp.com",
  databaseURL: "https://endless-doors-default-rtdb.firebaseio.com",
  projectId: "endless-doors",
  storageBucket: "endless-doors.firebasestorage.app",
  messagingSenderId: "284536796481",
  appId: "1:284536796481:web:a958d659c39b4709c89dc0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const scoresRef = ref(db, 'scores');

let keys = 3, flowers = 0, score = 0;

function updateStats() {
  document.getElementById('keys').textContent = keys;
  document.getElementById('flowers').textContent = flowers;
  document.getElementById('score').textContent = score;
}

function randomItem() {
  const rand = Math.random();
  if (rand < 0.2) return "monster";
  if (rand < 0.4) return "flower";
  if (rand < 0.8) return "key";
  return "nothing";
}

window.openDoor = function(index) {
  if (keys <= 0) return restartGame();
  keys--;
  const outcomes = [randomItem(), randomItem(), randomItem()];
  const result = outcomes[index];

  if (result === "monster") {
    if (flowers > 0) {
      flowers--;
    } else {
      saveScore();
      return restartGame();
    }
  } else if (result === "flower") {
    flowers++;
  } else if (result === "key") {
    keys += Math.floor(Math.random() * 2) + 1;
  }

  score++;
  updateStats();
};

window.restartGame = function() {
  keys = 3;
  flowers = 0;
  score = 0;
  updateStats();
};

function saveScore() {
  const nickname = document.getElementById('nickname').value || "Аноним";
  const newScoreRef = push(scoresRef);
  set(newScoreRef, { nickname, score });
}

function loadScores() {
  onValue(scoresRef, (snapshot) => {
    const list = document.getElementById("scoresList");
    list.innerHTML = "";
    const scores = [];
    snapshot.forEach(child => scores.push(child.val()));
    scores.sort((a, b) => b.score - a.score).slice(0, 10).forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `${entry.nickname}: ${entry.score}`;
      list.appendChild(li);
    });
  });
}

loadScores();
updateStats();

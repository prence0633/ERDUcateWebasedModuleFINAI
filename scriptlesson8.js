/* ===============================
   Progress storage utilities
   =============================== */
function loadUserProgress(){
  let users = {};
  try { users = JSON.parse(localStorage.getItem("users")) || {}; } catch(e){ users = {}; }
  let currentUser = localStorage.getItem("loggedInUser") || "guest";
  users[currentUser] = users[currentUser] || { progress: {} };
  return { users, currentUser };
}
function saveUserProgress(users){
  try { localStorage.setItem("users", JSON.stringify(users)); } catch(e){ console.warn("Could not save progress:", e); }
}

/* small debug UI helper */
function updateProgressUI(){ 
  const { users, currentUser } = loadUserProgress();
  const p = users[currentUser].progress || {};
  console.log("Progress:", p);
}

/* ===============================
   DOM refs
   =============================== */
const introModal = document.getElementById('introModal');
const beginBtn = document.getElementById('beginBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const skipBtn = document.getElementById('skipBtn');
const showDbBtn = document.getElementById('showDbBtn');
const dbInfo = document.getElementById('dbInfo');
const closeDbX = document.getElementById('closeDbX');

const student1Img = document.getElementById('student1Img');
const student2Img = document.getElementById('student2Img');
const student3Img = document.getElementById('student3Img');

const student1Bubble = document.getElementById('student1Bubble');
const student2Bubble = document.getElementById('student2Bubble');
const student3Bubble = document.getElementById('student3Bubble');

const pauseReflect = document.getElementById('pauseReflect');
const continueBtn = document.getElementById('continueBtn');

const guidedModal = document.getElementById('guidedModal');
const guidedAnswer = document.getElementById('guidedAnswer');
const guidedHint = document.getElementById('guidedHint');
const guidedSample = document.getElementById('guidedSample');
const showHintBtn = document.getElementById('showHintBtn');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const closeGuidedBtn = document.getElementById('closeGuidedBtn');
const closeGuidedX = document.getElementById('closeGuidedX');
const submitGuidedBtn = document.getElementById('submitGuidedBtn');

const unlockModal = document.getElementById('unlockModal');
const cancelUnlockBtn = document.getElementById('cancelUnlockBtn');
const confirmUnlockBtn = document.getElementById('confirmUnlockBtn');
const closeUnlockX = document.getElementById('closeUnlockX');

const helpModal = document.getElementById('helpModal');
const closeHelpBtn = document.getElementById('closeHelpBtn');
const closeHelpX = document.getElementById('closeHelpX');

const glossaryModal = document.getElementById('glossaryModal');
const openGlossaryBtn = document.getElementById('openGlossaryBtn');
const closeGlossaryBtn = document.getElementById('closeGlossaryBtn');
const closeGlossaryX = document.getElementById('closeGlossaryX');

const fabGlossary = document.getElementById('fabGlossary');
const fabPractice = document.getElementById('fabPractice');
const fabHelp = document.getElementById('fabHelp');

const mobileGlossaryPopup = document.getElementById('mobileGlossaryPopup');
const mobileGlossaryText = document.getElementById('mobileGlossaryText');

const quizLink = document.getElementById('quizLink');

/* ===============================
   Dialogue sequence (story)
   =============================== */
const sequence = [
  {who:'student2', text:'Ugh… how do I even talk to this machine?! I’m lost 😅'},
  {who:'student1', text:'Relax, John. That’s why SQL exists — it’s our "language" for talking to the database.'},
  {who:'student3', text:'Think of it like a magnifying glass for data — you can find anything quickly.'},
  {who:'student2', text:'So I don’t have to beg the computer nicely? 😂'},
  {who:'student1', text:'Exactly! Let’s start with the basics: SELECT.'},
  {who:'student1', text:'SELECT tells the database what information you want to see.'},
  {who:'student1', text:'FROM tells it which table to look in.'},
  {who:'student1', text:'And WHERE lets you filter results so you get only what you need.'},
  {who:'student2', text:'Hmm… can I try finding my lost watch now?'},
  {who:'student1', text:'Sure! Try this: SELECT Item FROM LostAndFound WHERE Status=\"Lost\";', action:'pauseAfter'},
  {who:'student2', text:'No way… it worked! I found my watch! 😁'},
  {who:'student3', text:'Nice! Now try checking who owns the doodled notebook.'},
  {who:'student2', text:'SELECT Owner FROM LostAndFound WHERE Item=\"Notebook\";'},
  {who:'student1', text:'Exactly! You’re officially an SQL detective now.'},
  {who:'student2', text:'Even Mia’s \"lost crush\"? Haha, just joking 😂'},
  {who:'student3', text:'Hehe, focus on the database, detective. 😉'},
  {who:'student1', text:'Remember, John: SELECT + FROM + WHERE is the foundation.'},
  {who:'student1', text:'Master this, and you can query almost anything.'},
  {who:'student2', text:'What if I want all the items that are already claimed?'},
  {who:'student1', text:'Simple: SELECT Item FROM LostAndFound WHERE Status=\"Claimed\";'},
  {who:'student2', text:'Ohhh… that shows what’s no longer available.'},
  {who:'student3', text:'See? You can narrow data down in seconds.'},
  {who:'student2', text:'This is so much easier than I thought!'},
  {who:'student1', text:'Try another: SELECT * FROM LostAndFound;'},
  {who:'student2', text:'Whoa… it shows everything in the table.'},
  {who:'student3', text:'That’s the power of SELECT with an asterisk.'},
  {who:'student2', text:'But isn’t that too much information sometimes?'},
  {who:'student1', text:'Yes, that’s why WHERE is important — it keeps things clean.'},
  {who:'student2', text:'Got it. Filter only what I need, don’t drown in data.'},
  {who:'student3', text:'Look at you… from lost-and-found boy to SQL detective. 🔍'},
  {who:'student2', text:'Haha, I should get a badge for this.'},
  {who:'student1', text:'Badge unlocked: Basic Query Master! 🏅', action:'complete'},
  {who:'student2', text:'Yesss! I’ll add that to my resume 😂'}
];

let idx = -1;

/* helpers to hide/show bubbles */
function hideBubbles(){
  [student1Bubble, student2Bubble, student3Bubble].forEach(el=>{
    if(el){ el.classList.remove('show'); el.textContent=''; }
  });
}
function showItem(i){
  if(i<0 || i>=sequence.length) return;
  const item = sequence[i];
  hideBubbles();
  setTimeout(()=>{
    const target = item.who === 'student1' ? student1Bubble : (item.who === 'student2' ? student2Bubble : student3Bubble);
    if(target){ target.textContent = item.text; target.classList.add('show'); }
    nextBtn.disabled = false;
    // handle special actions
    if(item.action === 'pauseAfter'){
      // show pause & reflect after showing this line
      setTimeout(()=> {
        pauseReflect.style.display='block';
        pauseReflect.setAttribute('aria-hidden','false');
        nextBtn.disabled = true;
      }, 300);
    }
    if(item.action === 'complete'){
      // show DB summary after a short delay and mark complete
      setTimeout(()=> {
        dbInfo.style.display='block';
        dbInfo.setAttribute('aria-hidden','false');
        markLessonComplete();
      }, 800);
    }
  }, 120);
}

/* navigation */
function next(){
  nextBtn.disabled = true;
  idx++;
  if(idx < sequence.length){
    showItem(idx);
  } else {
    // finished story — show summary
    dbInfo.style.display='block';
    dbInfo.setAttribute('aria-hidden','false');
    markLessonComplete();
  }
}

/* start scene */
function startScene(){
  idx = -1;
  // hide intro modal (preserve original behavior)
  introModal.classList.remove('show');
  introModal.setAttribute('aria-hidden','true');
  // reveal characters (if images missing, invisible allowed)
  [student1Img, student2Img, student3Img].forEach(s => {
    if(s){ s.style.opacity='1'; s.style.transform='translateY(0)'; }
  });
  hideBubbles();
  nextBtn.disabled = true;
  // mark intro read
  let {users,currentUser} = loadUserProgress();
  users[currentUser].progress.readIntro = true;
  saveUserProgress(users);
  updateProgressUI();
  setTimeout(()=> next(), 300);
}

/* mark complete */
function markLessonComplete(){
  let { users, currentUser } = loadUserProgress();
  users[currentUser].progress.lesson8 = true;
  saveUserProgress(users);
  updateProgressUI();
}

/* ===============================
   DB Info toggles
   =============================== */
function closeDbInfo(){
  dbInfo.style.display='none';
  dbInfo.setAttribute('aria-hidden','true');
}
function toggleDbInfo(){
  if(dbInfo.style.display === 'block') closeDbInfo();
  else { dbInfo.style.display = 'block'; dbInfo.setAttribute('aria-hidden','false'); }
}
showDbBtn && showDbBtn.addEventListener('click', toggleDbInfo);
closeDbX && closeDbX.addEventListener('click', closeDbInfo);

/* ===============================
   Guided practice handlers
   =============================== */
function openGuided(){
  guidedModal.classList.add('show');
  guidedModal.setAttribute('aria-hidden','false');
  setTimeout(()=> { try { guidedAnswer.focus(); } catch(e){} }, 120);
}
function closeGuided(){
  guidedModal.classList.remove('show');
  guidedModal.setAttribute('aria-hidden','true');
}
openGuidary = openGuided; // keep reference if needed

// wired controls
const openGuidedBtn = document.getElementById('openGuidedBtn');
openGuidedBtn && openGuidedBtn.addEventListener('click', openGuided);
closeGuidedBtn && closeGuidedBtn.addEventListener('click', closeGuided);
closeGuidedX && closeGuidedX.addEventListener('click', closeGuided);

// hint / sample toggles
showHintBtn && showHintBtn.addEventListener('click', ()=>{
  guidedHint.style.display = guidedHint.style.display === 'block' ? 'none' : 'block';
});
showAnswerBtn && showAnswerBtn.addEventListener('click', ()=>{
  guidedSample.style.display = guidedSample.style.display === 'block' ? 'none' : 'block';
});

// submit guided answer
submitGuidedBtn && submitGuidedBtn.addEventListener('click', ()=>{
  const answer = (guidedAnswer.value || "").trim();
  // minimal validation: check it contains SELECT and FROM (case-insensitive)
  const valid = /select\s+.+\s+from\s+lostandfound/i.test(answer);
  let { users, currentUser } = loadUserProgress();
  users[currentUser].progress.guidedPractice8 = true;
  users[currentUser].progress.guidedPractice8_answer = answer;
  saveUserProgress(users);
  updateProgressUI();
  closeGuided();
  // show unlock modal so user can proceed to quiz
  unlockModal.classList.add('show');
  unlockModal.setAttribute('aria-hidden','false');
});

/* Unlock guided practice flow via unlock modal */
const unlockGuidedBtn = document.getElementById('openGuidedBtn'); // reuse control if needed
const cancelUnlockBtnEl = document.getElementById('cancelUnlockBtn');
const confirmUnlockBtnEl = document.getElementById('confirmUnlockBtn');

unlockGuidedBtn && unlockGuidedBtn.addEventListener('click', ()=> {
  // open modal (but normally openGuided opens guided modal)
  unlockModal.classList.add('show');
  unlockModal.setAttribute('aria-hidden','false');
});
cancelUnlockBtnEl && cancelUnlockBtnEl.addEventListener('click', ()=> {
  unlockModal.classList.remove('show');
  unlockModal.setAttribute('aria-hidden','true');
});
confirmUnlockBtnEl && confirmUnlockBtnEl.addEventListener('click', ()=> {
  let { users, currentUser } = loadUserProgress();
  users[currentUser].progress.guidedPractice8 = true;
  users[currentUser].progress.quiz8 = true;
  saveUserProgress(users);
  updateProgressUI();
  unlockModal.classList.remove('show');
  unlockModal.setAttribute('aria-hidden','true');
  // redirect to quiz
  try { window.location.href = 'quiz8.html'; } catch(e){ console.warn('Redirect failed', e); }
});
closeUnlockX && closeUnlockX.addEventListener('click', ()=> {
  unlockModal.classList.remove('show');
  unlockModal.setAttribute('aria-hidden','true');
});

/* ===============================
   Glossary behavior
   =============================== */
function openGlossary(){
  glossaryModal.classList.add('show');
  glossaryModal.setAttribute('aria-hidden','false');
  setTimeout(()=> { try { closeGlossaryBtn.focus(); } catch(e){} }, 80);
}
function closeGlossary(){
  glossaryModal.classList.remove('show');
  glossaryModal.setAttribute('aria-hidden','true');
}
openGlossaryBtn && openGlossaryBtn.addEventListener('click', openGlossary);
closeGlossaryBtn && closeGlossaryBtn.addEventListener('click', closeGlossary);
closeGlossaryX && closeGlossaryX.addEventListener('click', closeGlossary);

// Mobile glossary popup helper (for inline terms)
function showGlossaryPopup(term, meaning){
  if (!mobileGlossaryPopup) return;
  mobileGlossaryText.textContent = term + ": " + meaning;
  mobileGlossaryPopup.classList.add('show');
  mobileGlossaryPopup.setAttribute('aria-hidden','false');
}
function hideGlossaryPopup(){ if(mobileGlossaryPopup){ mobileGlossaryPopup.classList.remove('show'); mobileGlossaryPopup.setAttribute('aria-hidden','true'); } }
window.hideGlossaryPopup = hideGlossaryPopup;

// floating FABs
fabGlossary && fabGlossary.addEventListener('click', openGlossary);
fabPractice && fabPractice.addEventListener('click', openGuided);
fabHelp && fabHelp.addEventListener('click', ()=> {
  helpModal.classList.add('show');
  helpModal.setAttribute('aria-hidden','false');
  setTimeout(()=> { try { closeHelpBtn.focus(); } catch(e){} }, 80);
});

/* ===============================
   Help modal handlers
   =============================== */
closeHelpBtn && closeHelpBtn.addEventListener('click', ()=> {
  helpModal.classList.remove('show');
  helpModal.setAttribute('aria-hidden','true');
});
closeHelpX && closeHelpX.addEventListener('click', ()=> {
  helpModal.classList.remove('show');
  helpModal.setAttribute('aria-hidden','true');
});

/* ===============================
   Start / Skip / Continue handlers
   =============================== */
beginBtn && beginBtn.addEventListener('click', startScene);
startBtn && startBtn.addEventListener('click', startScene);
nextBtn && nextBtn.addEventListener('click', next);
closeModalBtn && closeModalBtn.addEventListener('click', ()=> {
  introModal.classList.remove('show');
  introModal.setAttribute('aria-hidden','true');
});
skipBtn && skipBtn.addEventListener('click', ()=> {
  let {users,currentUser} = loadUserProgress();
  users[currentUser].progress.lesson8 = true;
  users[currentUser].progress.quiz8 = true;
  saveUserProgress(users);
  updateProgressUI();
  try { window.location.href = 'quiz8.html'; } catch(e){ console.warn('Redirect failed', e); }
});

continueBtn && continueBtn.addEventListener('click', ()=> {
  pauseReflect.style.display='none';
  pauseReflect.setAttribute('aria-hidden','true');
  nextBtn.disabled=false;
  next();
});

/* ===============================
   Keyboard accessibility
   =============================== */
document.addEventListener('keydown', (e)=> {
  if (e.key === 'ArrowRight') {
    if (nextBtn && !nextBtn.disabled) next();
  }
  if (e.key === 'Escape') {
    // close modals if open
    document.querySelectorAll('.modal.show').forEach(m => {
      m.classList.remove('show');
      m.setAttribute('aria-hidden','true');
    });
    hideGlossaryPopup();
  }
});

/* ===============================
   Small helpers + init
   =============================== */
window.addEventListener('load', ()=> {
  let {users,currentUser} = loadUserProgress();
  if(!users[currentUser].progress) users[currentUser].progress = {};
  saveUserProgress(users);
  updateProgressUI();

  // restore UI if lesson already completed
  if(users[currentUser].progress.lesson8){
    console.log("Lesson 8 already completed ✅ but still replayable.");
  }
});

/* expose some helpers for debugging */
window.openGuided = openGuided;
window.openGlossary = openGlossary;
window.toggleDbInfo = toggleDbInfo;
window.updateProgressUI = updateProgressUI;
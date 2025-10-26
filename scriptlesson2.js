/* ===============================
   Progress storage utilities (centralized)
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
const startBtn = document.getElementById('startBtn'); // same as Begin
const nextBtn = document.getElementById('nextBtn');
const skipBtn = document.getElementById('skipBtn');
const showDbBtn = document.getElementById('showDbBtn');
const dbInfo = document.getElementById('dbInfo');
const closeDbX = document.getElementById('closeDbX');

const student1Img = document.getElementById('student1Img');
const student2Img = document.getElementById('student2Img');
const teacherImg = document.getElementById('teacherImg');

const teacherBubble = document.getElementById('teacherBubble');
const student1Bubble = document.getElementById('student1Bubble');
const student2Bubble = document.getElementById('student2Bubble');

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
   Dialogue sequence (Lesson 2 content)
   =============================== */
// Lesson 2 — Basic Concepts of Database Structure
const sequence = [
  {who:'teacher', text:"(sigh) So many quizzes and records to check... I'm losing track."},
  {who:'student1', text:"Ma’am, why don’t we use a database to organize everything?"},
  {who:'teacher', text:"That’s a wonderful idea, Frankie — it's the perfect time to learn Basic Database Structure."},
  {who:'teacher', text:"Think of a database like a big cabinet with labeled folders."},
  {who:'teacher', text:"Tables are like the folders — each table stores related information."},
  {who:'teacher', text:"Rows represent individual records (e.g., a student). Columns are the fields like Name or Section."},
  {who:'student2', text:"What if two students have the same name?"},
  {who:'teacher', text:"Great question, John. We use a Primary Key (like Student_ID) to uniquely identify each student."},
  {who:'student1', text:"So Primary Key prevents confusion when names repeat."},
  {who:'student1', text:"How do we connect attendance to a student record?"},
  {who:'teacher', text:"We use a Foreign Key in the Attendance table that stores the Student_ID — this links the records together."},
  {who:'student2', text:"Ah, so the foreign key points to the primary key of the student table."},
  {who:'teacher', text:"Exactly. With keys, we can join tables and answer questions across them quickly."},
  {who:'teacher', text:"You can even split data into multiple tables to avoid redundancy."},
  {who:'student1', text:"Like storing student info in one table and grades in another?"},
  {who:'teacher', text:"Yes! Then you just link them with keys, no need to repeat names or IDs."},
  {who:'student2', text:"Can tables store different kinds of info too?"},
  {who:'teacher', text:"Absolutely. One table for students, another for attendance, another for subjects."},
  {who:'teacher', text:"This structure keeps the database clean and easy to update."},
  {who:'student1', text:"What about deleting a student? Does it remove all their attendance too?"},
  {who:'teacher', text:"Good point. That’s where Referential Integrity rules come in — it controls what happens to linked records."},
  {who:'student2', text:"So the database prevents mistakes automatically?"},
  {who:'teacher', text:"Yes. Proper structure avoids accidental data loss or confusion."},
  {who:'teacher', text:"Databases can also handle thousands of records quickly — much faster than paper lists."},
  {who:'student1', text:"Wow, that’s powerful! Even in big schools."},
  {who:'teacher', text:"Exactly, and not just schools. Hospitals, banks, and shops use the same ideas."},
  {who:'student2', text:"It sounds complicated, but breaking it into tables and keys makes it manageable."},
  {who:'teacher', text:"Right. Learning database basics makes real-life data management much easier."},
  {who:'student1', text:"Can we practice creating a small student table now?"},
  {who:'teacher', text:"Of course. Let's start with a simple table: Student_ID, Name, and Section."},
  {who:'student2', text:"Do we assign the IDs manually or automatically?"},
  {who:'teacher', text:"We can do either, but usually databases auto-generate primary keys to avoid duplicates."},
  {who:'student1', text:"And we can add more fields later if needed?"},
  {who:'teacher', text:"Exactly. That’s the flexibility of a well-structured database."},
  {who:'students', text:"This is starting to make sense now!"},
  {who:'teacher', text:"Once we have the tables, we can link them with foreign keys and practice queries."},
  {who:'student2', text:"Queries? Like asking questions to the database?"},
  {who:'teacher', text:"Yes! You can ask, 'Which students were absent on September 1?' and get the answer instantly."},
  {who:'student1', text:"That’s amazing! No more manually checking papers."},
  {who:'teacher', text:"Right. That’s why understanding tables and keys is so important."},
  {who:'students', text:"We’re excited to try it!"},
  {who:'teacher', text:"Alright — practice a bit and then we’ll move on to the quiz.", action:'complete'},
  {who:'student1', text:"Let’s start with the student table first."},
  {who:'student2', text:"And then we’ll add attendance records linked by Student_ID."},
  {who:'teacher', text:"Perfect approach. Step by step, we’ll build a fully connected database."},
  {who:'students', text:"Thank you, Ma’am Rivera! This is much easier than I thought."},
  {who:'teacher', text:"Learning databases can be fun if we understand the structure."},
  {who:'students', text:"Let’s do it!"},
];
  

let idx = -1;

/* helpers to hide/show bubbles */
function hideBubbles(){
  [teacherBubble, student1Bubble, student2Bubble].forEach(el=>{
    if(el){ el.classList.remove('show'); el.textContent=''; }
  });
}
function showItem(i){
  if(i<0 || i>=sequence.length) return;
  const item = sequence[i];
  hideBubbles();
  setTimeout(()=> {
    const who = item.who;
    let target;
    if(who === 'teacher') target = teacherBubble;
    else if(who === 'student1') target = student1Bubble;
    else if(who === 'student2') target = student2Bubble;
    else if(who === 'students') target = student1Bubble;
    if(target){
      target.textContent = item.text;
      target.classList.add('show');
    }
    // reveal students when they speak
    if(item.who === 'student1'){ student1Img.style.opacity='1'; student1Img.style.transform='translateY(0)'; }
    if(item.who === 'student2'){ student2Img.style.opacity='1'; student2Img.style.transform='translateY(0)'; }
    nextBtn.disabled = false;
    // handle special actions
    if(item.action === 'pauseAfter'){
      setTimeout(()=> {
        pauseReflect.style.display='block';
        pauseReflect.setAttribute('aria-hidden','false');
        nextBtn.disabled = true;
      }, 300);
    }
    if(item.action === 'complete'){
      // mark complete and show DB summary after a short delay
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
    // finished story — show summary and proceed to quiz after marking
    dbInfo.style.display='block';
    dbInfo.setAttribute('aria-hidden','false');
    markLessonComplete();
  }
}

/* start scene */
function startScene(){
  idx = -1;
  // hide intro modal only when user triggers start
  if(introModal){
    introModal.classList.remove('show');
    introModal.setAttribute('aria-hidden','true');
  }
  // set initial states for characters
  [student1Img, student2Img].forEach(s => {
    if(s){ s.style.opacity='0'; s.style.transform='translateY(20px)'; }
  });
  hideBubbles();
  nextBtn.disabled = true;
  // mark intro read
  let {users,currentUser} = loadUserProgress();
  users[currentUser].progress.readIntro = true;
  saveUserProgress(users);
  updateProgressUI();
  // start first line after a short delay for UX
  setTimeout(()=> next(), 300);
}

/* mark complete */
function markLessonComplete(){
  let { users, currentUser } = loadUserProgress();
  users[currentUser].progress.lesson2 = true;
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
  // minimal validation: check not empty
  let { users, currentUser } = loadUserProgress();
  users[currentUser].progress.guidedPractice2 = true;
  users[currentUser].progress.guidedPractice2_answer = answer;
  saveUserProgress(users);
  updateProgressUI();
  closeGuided();
  // show unlock modal so user can proceed to quiz
  unlockModal.classList.add('show');
  unlockModal.setAttribute('aria-hidden','false');
});

/* Unlock guided practice flow via unlock modal */
const cancelUnlockBtnEl = document.getElementById('cancelUnlockBtn');
const confirmUnlockBtnEl = document.getElementById('confirmUnlockBtn');

cancelUnlockBtnEl && cancelUnlockBtnEl.addEventListener('click', ()=> {
  unlockModal.classList.remove('show');
  unlockModal.setAttribute('aria-hidden','true');
});
confirmUnlockBtnEl && confirmUnlockBtnEl.addEventListener('click', ()=> {
  let { users, currentUser } = loadUserProgress();
  users[currentUser].progress.guidedPractice2 = true;
  users[currentUser].progress.quiz2 = true;
  saveUserProgress(users);
  updateProgressUI();
  unlockModal.classList.remove('show');
  unlockModal.setAttribute('aria-hidden','true');
  // redirect to quiz
  try { window.location.href = 'quiz2.html'; } catch(e){ console.warn('Redirect failed', e); }
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
  // "Read Later" closes modal but does not start lesson
  introModal.classList.remove('show');
  introModal.setAttribute('aria-hidden','true');
  // mark intro read so it won't reappear automatically
  let { users, currentUser } = loadUserProgress();
  users[currentUser].progress.readIntro = true;
  saveUserProgress(users);
  updateProgressUI();
});
skipBtn && skipBtn.addEventListener('click', ()=> {
  let {users,currentUser} = loadUserProgress();
  users[currentUser].progress.lesson2 = true;
  users[currentUser].progress.quiz2 = true;
  saveUserProgress(users);
  updateProgressUI();
  try { window.location.href = 'quiz2.html'; } catch(e){ console.warn('Redirect failed', e); }
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
   Mini-quiz helper inside dbInfo
   =============================== */
function checkMiniAnswer(btn, correct){
  Array.from(btn.parentElement.querySelectorAll("button")).forEach(b=>{
    b.disabled = true;
    b.classList.remove("correct","wrong");
  });
  if(correct){
    btn.classList.add("correct");
    // small visual feedback
    setTimeout(()=> { btn.classList.remove("correct"); }, 1200);
  } else {
    btn.classList.add("wrong");
    setTimeout(()=> { btn.classList.remove("wrong"); }, 1200);
  }
}

/* ===============================
   Small helpers + init
   =============================== */
window.addEventListener('load', ()=> {
  let {users,currentUser} = loadUserProgress();
  if(!users[currentUser].progress) users[currentUser].progress = {};
  saveUserProgress(users);
  updateProgressUI();

  // restore UI if lesson already completed
  if(users[currentUser].progress.lesson2){
    console.log("Lesson 2 already completed ✅ but still replayable.");
  }

  // Show intro modal only if not read before.
  // The modal markup by default has class "show" so it appears the first time.
  // If user previously marked readIntro, hide it on load.
  if(!users[currentUser].progress.readIntro){
    // Ensure it is visible for fresh users
    if(!introModal.classList.contains('show')){
      introModal.classList.add('show');
      introModal.setAttribute('aria-hidden','false');
    } else {
      introModal.setAttribute('aria-hidden','false');
    }
  } else {
    // user already read intro -> don't show modal
    introModal.classList.remove('show');
    introModal.setAttribute('aria-hidden','true');
  }
});

/* expose some helpers for debugging */
window.openGuided = openGuided;
window.openGlossary = openGlossary;
window.toggleDbInfo = toggleDbInfo;
window.updateProgressUI = updateProgressUI;
window.addEventListener('load', () => {
  introModal.classList.add('show');
});

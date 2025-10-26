/* ===============================
   Progress storage utilities
   =============================== */
function loadUserProgress(){
  let users = {};
  try{ users = JSON.parse(localStorage.getItem('users')) || {}; } catch(e){ users = {}; }
  let currentUser = localStorage.getItem('loggedInUser') || 'guest';
  users[currentUser] = users[currentUser] || { progress:{} };
  users[currentUser].progress.lesson4 = users[currentUser].progress.lesson4 || false;
  users[currentUser].progress.quiz4 = users[currentUser].progress.quiz4 || false;
  users[currentUser].progress.guidedPractice4 = users[currentUser].progress.guidedPractice4 || false;
  return { users, currentUser };
}
function saveUserProgress(users){ try{ localStorage.setItem('users', JSON.stringify(users)); } catch(e){ console.warn('Could not save progress', e); } }
function updateProgressUI(){ const {users,currentUser} = loadUserProgress(); console.log('Progress:', users[currentUser].progress); }

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

const teacherImg = document.getElementById('teacherImg');
const student1Img = document.getElementById('student1Img');
const student2Img = document.getElementById('student2Img');

const teacherBubble = document.getElementById('teacherBubble');
const studentBubble = document.getElementById('studentBubble');

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
  {who:'teacher', text:'Good morning, Frankie and John. Today we will learn how Entities and Attributes are stored in Tables.'},
  {who:'student1', text:'Ma’am, what is a table exactly?'},
  {who:'teacher', text:'A table stores rows and columns — rows are entities (records) and columns are attributes (fields).'},
  {who:'student2', text:'So each row is a person or an item, and a column is things like Name or Color?'},
  {who:'teacher', text:'Exactly. And to avoid mix-ups we give each row a Primary Key.'},
  {who:'student2', text:'Like a StudentID that is unique for every student.'},
  {who:'teacher', text:'Correct. When we want to connect two tables, we use Foreign Keys.'},
  {who:'student1', text:'So Attendance Table can have StudentID as a Foreign Key to link back to the Student Table.'},
  {who:'teacher', text:'Yes. That creates relationships between tables so we can combine data.'},
  {who:'student2', text:'Are Primary Keys always numbers?'},
  {who:'teacher', text:'They are often numbers for convenience, but they can be other types too as long as they uniquely identify rows.'},
  {who:'student1', text:'This is useful. How do we pick the right key?'},
  {who:'teacher', text:'Pick a value that is stable and unique; StudentID is perfect for students.'},
  {who:'teacher', text:'Try thinking about keys for a Book table, we will pause for a moment.' , action:'pauseAfter'},
  {who:'student2', text:'Okay, I’ll think: BookID sounds good.'},
  {who:'teacher', text:'Excellent — BookID as Primary Key is a common choice.'},
  {who:'student1', text:'Now I can link Book to Borrowers using that BookID as a Foreign Key.'},
  {who:'teacher', text:'Great thinking! Understanding tables and keys makes databases powerful.' , action:'complete'},
  {who:'teacher', text:'Let’s see an example: Student Table has Name, Age, Section.'},
  {who:'student1', text:'And each student gets a StudentID as Primary Key.'},
  {who:'student2', text:'Then Attendance Table will have Date, Status, and StudentID as Foreign Key.'},
  {who:'teacher', text:'Exactly. That way, we can find a student’s attendance quickly.'},
  {who:'student1', text:'So tables are like Lego blocks we can connect with keys.'},
  {who:'teacher', text:'Yes, tables are modular and relationships connect them meaningfully.'},
  {who:'student2', text:'Can a table have more than one Foreign Key?'},
  {who:'teacher', text:'Absolutely! For example, a Grades Table may link to Students and Subjects using two Foreign Keys.'},
  {who:'student1', text:'That makes sense. Relationships can get complex but organized.'},
  {who:'teacher', text:'Exactly. That’s why databases are better than paper lists.'},
  {who:'student2', text:'Wow, now I see why we need structured tables.'},
  {who:'teacher', text:'By using Primary and Foreign Keys, we reduce errors and redundancy.'},
  {who:'student1', text:'I like this. It makes sense to store data properly.'},
  {who:'teacher', text:'Great! Next, we’ll practice creating a few sample tables in class.'},
  {who:'student2', text:'I’m excited! Let’s start linking entities with keys.'},
  {who:'student1', text:'This feels like solving a puzzle with logic.'},
  {who:'teacher', text:'Exactly, databases are organized puzzles, and you’re the designer!'}
];
let idx = -1;

/* helpers to hide/show bubbles */
function hideBubbles(){ [teacherBubble, studentBubble].forEach(el=>{ if(el){ el.classList.remove('show','frankie','john'); el.textContent=''; } }); }

function showItem(i){ if(i<0 || i>=sequence.length) return; const item = sequence[i]; hideBubbles(); setTimeout(()=>{ if(item.who==='teacher'){ teacherBubble.textContent = 'Teacher: '+item.text; teacherBubble.classList.add('show'); } else if(item.who==='student1'){ studentBubble.textContent = 'Frankie: '+item.text; studentBubble.classList.add('frankie','show'); student1Img.style.opacity='1'; student1Img.style.transform='translateY(0)'; } else if(item.who==='student2'){ studentBubble.textContent = 'John: '+item.text; studentBubble.classList.add('john','show'); student2Img.style.opacity='1'; student2Img.style.transform='translateY(0)'; } nextBtn.disabled=false; if(item.action==='pauseAfter'){ setTimeout(()=>{ pauseReflect.style.display='block'; pauseReflect.setAttribute('aria-hidden','false'); nextBtn.disabled=true; },300); } if(item.action==='complete'){ setTimeout(()=>{ dbInfo.style.display='block'; dbInfo.setAttribute('aria-hidden','false'); markLessonComplete(); },800); } },140); }

/* navigation */
function next(){ nextBtn.disabled=true; idx++; if(idx<sequence.length){ showItem(idx); } else{ dbInfo.style.display='block'; dbInfo.setAttribute('aria-hidden','false'); markLessonComplete(); } }

/* start scene */
function startScene(){ idx=-1; introModal.classList.remove('show'); introModal.setAttribute('aria-hidden','true'); [teacherImg, student1Img, student2Img].forEach(s=>{ if(s){ s.style.opacity='1'; s.style.transform='translateY(0)'; } }); hideBubbles(); nextBtn.disabled=true; let {users,currentUser} = loadUserProgress(); users[currentUser].progress.readIntro = true; saveUserProgress(users); updateProgressUI(); setTimeout(()=> next(),300); }

/* mark complete */
function markLessonComplete(){ let {users,currentUser} = loadUserProgress(); users[currentUser].progress.lesson4 = true; saveUserProgress(users); updateProgressUI(); }

/* DB Info toggles */
function closeDbInfo(){ dbInfo.style.display='none'; dbInfo.setAttribute('aria-hidden','true'); }
function toggleDbInfo(){ if(dbInfo.style.display === 'block') closeDbInfo(); else{ dbInfo.style.display='block'; dbInfo.setAttribute('aria-hidden','false'); } }
showDbBtn && showDbBtn.addEventListener('click', toggleDbInfo);
closeDbX && closeDbX.addEventListener('click', closeDbInfo);

/* Guided practice handlers */
function openGuided(){ guidedModal.classList.add('show'); guidedModal.setAttribute('aria-hidden','false'); setTimeout(()=>{ try{ guidedAnswer.focus(); }catch(e){} },120); }
function closeGuided(){ guidedModal.classList.remove('show'); guidedModal.setAttribute('aria-hidden','true'); }
const openGuidedBtn = document.getElementById('openGuidedBtn');
openGuidedBtn && openGuidedBtn.addEventListener('click', openGuided);
closeGuidedBtn && closeGuidedBtn.addEventListener('click', closeGuided);
closeGuidedX && closeGuidedX.addEventListener('click', closeGuided);
showHintBtn && showHintBtn.addEventListener('click', ()=>{ guidedHint.style.display = guidedHint.style.display === 'block' ? 'none' : 'block'; });
showAnswerBtn && showAnswerBtn.addEventListener('click', ()=>{ guidedSample.style.display = guidedSample.style.display === 'block' ? 'none' : 'block'; });
submitGuidedBtn && submitGuidedBtn.addEventListener('click', ()=>{ const answer = (guidedAnswer.value || '').trim(); const { users, currentUser } = loadUserProgress(); users[currentUser].progress.guidedPractice4 = true; users[currentUser].progress.guidedPractice4_answer = answer; saveUserProgress(users); updateProgressUI(); closeGuided(); unlockModal.classList.add('show'); unlockModal.setAttribute('aria-hidden','false'); });

/* Unlock guided practice flow */
const cancelUnlockBtnEl = document.getElementById('cancelUnlockBtn');
const confirmUnlockBtnEl = document.getElementById('confirmUnlockBtn');
openGuidedBtn && openGuidedBtn.addEventListener('click', ()=>{ unlockModal.classList.add('show'); unlockModal.setAttribute('aria-hidden','false'); });
cancelUnlockBtnEl && cancelUnlockBtnEl.addEventListener('click', ()=>{ unlockModal.classList.remove('show'); unlockModal.setAttribute('aria-hidden','true'); });
confirmUnlockBtnEl && confirmUnlockBtnEl.addEventListener('click', ()=>{ let { users, currentUser } = loadUserProgress(); users[currentUser].progress.guidedPractice4 = true; users[currentUser].progress.quiz4 = true; saveUserProgress(users); updateProgressUI(); unlockModal.classList.remove('show'); unlockModal.setAttribute('aria-hidden','true'); try{ window.location.href = 'quiz4.html'; }catch(e){ console.warn('Redirect failed', e); } });
closeUnlockX && closeUnlockX.addEventListener('click', ()=>{ unlockModal.classList.remove('show'); unlockModal.setAttribute('aria-hidden','true'); });

/* Glossary behavior */
function openGlossary(){ glossaryModal.classList.add('show'); glossaryModal.setAttribute('aria-hidden','false'); setTimeout(()=>{ try{ closeGlossaryBtn.focus(); }catch(e){} },80); }
function closeGlossary(){ glossaryModal.classList.remove('show'); glossaryModal.setAttribute('aria-hidden','true'); }
openGlossaryBtn && openGlossaryBtn.addEventListener('click', openGlossary);
closeGlossaryBtn && closeGlossaryBtn.addEventListener('click', closeGlossary);
closeGlossaryX && closeGlossaryX.addEventListener('click', closeGlossary);
function showGlossaryPopup(term, meaning){ if(!mobileGlossaryPopup) return; mobileGlossaryText.textContent = term + ': ' + meaning; mobileGlossaryPopup.classList.add('show'); mobileGlossaryPopup.setAttribute('aria-hidden','false'); }
function hideGlossaryPopup(){ if(mobileGlossaryPopup){ mobileGlossaryPopup.classList.remove('show'); mobileGlossaryPopup.setAttribute('aria-hidden','true'); } }
window.hideGlossaryPopup = hideGlossaryPopup;

// floating FABs
fabGlossary && fabGlossary.addEventListener('click', openGlossary);
fabPractice && fabPractice.addEventListener('click', openGuided);
fabHelp && fabHelp.addEventListener('click', ()=>{ helpModal.classList.add('show'); helpModal.setAttribute('aria-hidden','false'); setTimeout(()=>{ try{ closeHelpBtn.focus(); }catch(e){} },80); });

/* Help modal handlers */
closeHelpBtn && closeHelpBtn.addEventListener('click', ()=>{ helpModal.classList.remove('show'); helpModal.setAttribute('aria-hidden','true'); });
closeHelpX && closeHelpX.addEventListener('click', ()=>{ helpModal.classList.remove('show'); helpModal.setAttribute('aria-hidden','true'); });

/* Start / Skip / Continue handlers */
beginBtn && beginBtn.addEventListener('click', startScene);
startBtn && startBtn.addEventListener('click', startScene);
nextBtn && nextBtn.addEventListener('click', next);
closeModalBtn && closeModalBtn.addEventListener('click', ()=>{ introModal.classList.remove('show'); introModal.setAttribute('aria-hidden','true'); });
skipBtn && skipBtn.addEventListener('click', ()=>{ let { users, currentUser } = loadUserProgress(); users[currentUser].progress.lesson4 = true; users[currentUser].progress.quiz4 = true; saveUserProgress(users); updateProgressUI(); try{ window.location.href = 'quiz4.html'; }catch(e){ console.warn('Redirect failed', e); } });
continueBtn && continueBtn.addEventListener('click', ()=>{ pauseReflect.style.display='none'; pauseReflect.setAttribute('aria-hidden','true'); nextBtn.disabled=false; next(); });

/* Keyboard accessibility */
document.addEventListener('keydown', (e)=>{ if(e.key === 'ArrowRight'){ if(nextBtn && !nextBtn.disabled) next(); } if(e.key === 'Escape'){ document.querySelectorAll('.modal.show').forEach(m=>{ m.classList.remove('show'); m.setAttribute('aria-hidden','true'); }); hideGlossaryPopup(); } });

/* mini-quiz function */
function checkAnswer(btn, correct){ btn.classList.add(correct? 'correct' : 'wrong'); btn.parentNode.querySelectorAll('button').forEach(b => b.disabled = true); }
window.checkAnswer = checkAnswer;

/* small helpers + init */
window.addEventListener('load', ()=>{ let {users,currentUser} = loadUserProgress(); if(!users[currentUser].progress) users[currentUser].progress = {}; saveUserProgress(users); updateProgressUI(); if(users[currentUser].progress.lesson4){ console.log('Lesson 4 already completed ✅ but still replayable.'); } });

/* expose helpers */
window.openGuided = openGuided; window.openGlossary = openGlossary; window.toggleDbInfo = toggleDbInfo; window.updateProgressUI = updateProgressUI;

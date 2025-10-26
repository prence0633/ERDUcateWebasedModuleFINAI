/* ===============================
     Progress storage utilities
     =============================== */
  function loadUserProgress(){
    let users = {};
    try{ users = JSON.parse(localStorage.getItem('users')) || {}; } catch(e){ users = {}; }
    let currentUser = localStorage.getItem('loggedInUser') || 'guest';
    users[currentUser] = users[currentUser] || { progress: {} };
    // ensure defaults
    users[currentUser].progress.lesson3 = users[currentUser].progress.lesson3 || false;
    users[currentUser].progress.quiz3 = users[currentUser].progress.quiz3 || false;
    users[currentUser].progress.guidedPractice3 = users[currentUser].progress.guidedPractice3 || false;
    return { users, currentUser };
  }
  function saveUserProgress(users){
    try{ localStorage.setItem('users', JSON.stringify(users)); } catch(e){ console.warn('Could not save progress', e); }
  }
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

  const teacherBubble = document.getElementById('teacherBubble');
  const studentBubble = document.getElementById('studentBubble');
  const frankieBubble = document.getElementById('frankieBubble');
  const johnBubble = document.getElementById('johnBubble');

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
  // Lesson 3 — Tracking Personal Items: Entities & Attributes
const sequence = [
  {who:'john', text:'Ugh… Frankie, I keep losing my stuff! My watch, my shirt, my bag… everything! 😫'},
  {who:'frankie', text:'Calm down, John. We can organize items in a simple table so you always know where they are.'},
  {who:'john', text:'A table? Where do I start? 😕'},
  {who:'frankie', text:'Think of each item as an Entity. What items do you want to track?' },
  {who:'john', text:'My Watch, my Shirt, my Bag — those are Entities?'},
  {who:'frankie', text:'Yes. Then for each Entity, list Attributes: Category, Color, Location, Status.'},
  {who:'john', text:'Attributes are like details that tell me more?' },
  {who:'frankie', text:'Exactly. And choose Data Types — Text, Number, Date, Boolean — for each attribute.'},
  {who:'john', text:'So Watch could be Category: Accessory (Text), Color: Black (Text), Location: Desk (Text), Status: Lost (Text).'},
  {who:'frankie', text:'Perfect example! Attributes help you identify items quickly.'},
  {who:'john', text:'This is starting to make sense.'},
  {who:'frankie', text:'Try thinking about your Bag now — what attributes?'},
  {who:'john', text:'Category: Backpack, Color: Red, Location: Bedroom, Status: With me.'},
  {who:'frankie', text:'Good. You can also add Date last seen.'},
  {who:'john', text:'Now I can track everything. I feel like a detective! 🕵️‍♂️'},
  {who:'frankie', text:'Exactly — organize items and you find them faster.'},
  {who:'frankie', text:'Try this: write one attribute set for Keys.' , action:'pauseAfter'},
  {who:'john', text:'Category: Accessory, Color: Silver, Location: Kitchen, Status: Lost' },
  {who:'frankie', text:'Nice! That’s a working record.'},
  {who:'frankie', text:'Remember: Entities and Attributes are the foundation of any table.'},
  {who:'john', text:'Thanks Frankie. I’ll start my own list tonight.' , action:'complete'},
  // Additional dialogue to reach 60 lines
  {who:'john', text:'Wait, can I track my Notebook too?'},
  {who:'frankie', text:'Of course. Notebook is an Entity. Add attributes: Subject, Color, Location, Status.'},
  {who:'john', text:'Subject: Math, Color: Blue, Location: Desk, Status: With me'},
  {who:'frankie', text:'Perfect! You see how easy this becomes with a table.'},
  {who:'john', text:'I think I can do this for all my gadgets too.'},
  {who:'frankie', text:'Exactly — phone, tablet, headphones — all Entities.'},
  {who:'john', text:'And for each, the Attributes tell me everything at a glance.'},
  {who:'frankie', text:'Correct. Category, Color, Location, Status — start simple, then expand.'},
  {who:'john', text:'What about items I lend to friends?'},
  {who:'frankie', text:'Add an attribute: Borrower or Date Borrowed.'},
  {who:'john', text:'Ah, then I won’t forget who has my stuff.'},
  {who:'frankie', text:'Exactly. That’s the power of structured data.'},
  {who:'john', text:'Should I also add a Priority attribute for urgent items?'},
  {who:'frankie', text:'Good idea. Priority helps you track important items first.'},
  {who:'john', text:'I feel like a real database manager now! 😎'},
  {who:'frankie', text:'Yes! You’re learning to think like a database designer.'},
  {who:'john', text:'Can I also track gifts I receive?'},
  {who:'frankie', text:'Sure. Gifts can be Entities too. Attributes: From, Date, Category, Status.'},
  {who:'john', text:'This is fun. I can make tables for everything I own!'},
  {who:'frankie', text:'Yes, and linking them later becomes easier if needed.'},
  {who:'john', text:'Linking? Like combining two tables?'},
  {who:'frankie', text:'Exactly. You can connect items with foreign keys if they relate.'},
  {who:'john', text:'So my Watch table and Bag table could be connected?'},
  {who:'frankie', text:'Yes, maybe by Owner_ID or Location_ID.'},
  {who:'john', text:'I understand! This is actually practical.'},
  {who:'frankie', text:'And remember: consistent attributes make queries and searches simpler.'},
  {who:'john', text:'Queries? Like asking where my red backpack is?'},
  {who:'frankie', text:'Exactly. You can search by Color, Status, or Location easily.'},
  {who:'john', text:'Wow… I’ll never lose my items again!'},
  {who:'frankie', text:'That’s the goal! Structure and attributes keep everything clear.'},
  {who:'john', text:'I’ll make a master table tonight for all my personal items.'},
  {who:'frankie', text:'Great. Remember, Entities are your items; Attributes are details.'},
  {who:'john', text:'I feel like a detective and a database designer at the same time!'},
  {who:'frankie', text:'Exactly. That’s why this lesson is important.'},
  {who:'john', text:'Thanks, Frankie. This was super helpful!'},
  {who:'frankie', text:'Anytime! Keep practicing and your items will always be organized.'},
];

  let idx = -1;

  /* helpers to hide/show bubbles */
  function hideBubbles(){ [teacherBubble, studentBubble, frankieBubble, johnBubble].forEach(el=>{ if(el){ el.classList.remove('show'); el.textContent=''; } }); }

  function showItem(i){ if(i<0 || i>=sequence.length) return; const item = sequence[i]; hideBubbles(); setTimeout(()=>{ let target = null; if(item.who==='frankie'){ frankieBubble.textContent = item.text; frankieBubble.classList.add('show'); teacherImg.style.opacity='1'; } else if(item.who==='john'){ johnBubble.textContent = item.text; johnBubble.classList.add('show'); student1Img.style.opacity='1'; student1Img.style.transform='translateY(0)'; } else if(item.who==='teacher'){ teacherBubble.textContent = item.text; teacherBubble.classList.add('show'); } nextBtn.disabled=false; if(item.action==='pauseAfter'){ setTimeout(()=>{ pauseReflect.style.display='block'; pauseReflect.setAttribute('aria-hidden','false'); nextBtn.disabled=true; }, 300); } if(item.action==='complete'){ setTimeout(()=>{ dbInfo.style.display='block'; dbInfo.setAttribute('aria-hidden','false'); markLessonComplete(); }, 800); } }, 140); }

  /* navigation */
  function next(){ nextBtn.disabled = true; idx++; if(idx < sequence.length){ showItem(idx); } else { dbInfo.style.display='block'; dbInfo.setAttribute('aria-hidden','false'); markLessonComplete(); } }

  /* start scene */
  function startScene(){ idx = -1; // hide intro modal (preserve original behaviour)
    introModal.classList.remove('show'); introModal.setAttribute('aria-hidden','true'); // reveal characters
    [teacherImg, student1Img].forEach(s=>{ if(s){ s.style.opacity='1'; s.style.transform='translateY(0)'; }}); hideBubbles(); nextBtn.disabled=true; let {users,currentUser} = loadUserProgress(); users[currentUser].progress.readIntro = true; saveUserProgress(users); updateProgressUI(); setTimeout(()=> next(), 300); }

  /* mark complete */
  function markLessonComplete(){ let {users,currentUser} = loadUserProgress(); users[currentUser].progress.lesson3 = true; saveUserProgress(users); updateProgressUI(); }

  /* DB Info toggles */
  function closeDbInfo(){ dbInfo.style.display='none'; dbInfo.setAttribute('aria-hidden','true'); }
  function toggleDbInfo(){ if(dbInfo.style.display === 'block') closeDbInfo(); else { dbInfo.style.display='block'; dbInfo.setAttribute('aria-hidden','false'); }}
  showDbBtn && showDbBtn.addEventListener('click', toggleDbInfo);
  closeDbX && closeDbX.addEventListener('click', closeDbInfo);

  /* Guided practice handlers */
  function openGuided(){ guidedModal.classList.add('show'); guidedModal.setAttribute('aria-hidden','false'); setTimeout(()=>{ try{ guidedAnswer.focus(); }catch(e){} },120); }
  function closeGuided(){ guidedModal.classList.remove('show'); guidedModal.setAttribute('aria-hidden','true'); }

  // shorthand safety binding
  // wired controls
  const openGuidedBtn = document.getElementById('openGuidedBtn');
  openGuidedBtn && openGuidedBtn.addEventListener('click', openGuided);
  closeGuidedBtn && closeGuidedBtn.addEventListener('click', closeGuided);
  closeGuidedX && closeGuidedX.addEventListener('click', closeGuided);

  // hint / sample toggles
  showHintBtn && showHintBtn.addEventListener('click', ()=>{ guidedHint.style.display = guidedHint.style.display === 'block' ? 'none' : 'block'; });
  showAnswerBtn && showAnswerBtn.addEventListener('click', ()=>{ guidedSample.style.display = guidedSample.style.display === 'block' ? 'none' : 'block'; });

  // submit guided answer
  submitGuidedBtn && submitGuidedBtn.addEventListener('click', ()=>{
    const answer = (guidedAnswer.value || '').trim();
    const { users, currentUser } = loadUserProgress();
    users[currentUser].progress.guidedPractice3 = true;
    users[currentUser].progress.guidedPractice3_answer = answer;
    saveUserProgress(users);
    updateProgressUI();
    closeGuided();
    // show unlock modal so user can proceed to quiz
    unlockModal.classList.add('show'); unlockModal.setAttribute('aria-hidden','false');
  });

  /* Unlock guided practice flow via unlock modal */
  const unlockGuidedBtn = document.getElementById('openGuidedBtn'); // reuse control if needed
  const cancelUnlockBtnEl = document.getElementById('cancelUnlockBtn');
  const confirmUnlockBtnEl = document.getElementById('confirmUnlockBtn');

  unlockGuidedBtn && unlockGuidedBtn.addEventListener('click', ()=>{ unlockModal.classList.add('show'); unlockModal.setAttribute('aria-hidden','false'); });
  cancelUnlockBtnEl && cancelUnlockBtnEl.addEventListener('click', ()=>{ unlockModal.classList.remove('show'); unlockModal.setAttribute('aria-hidden','true'); });
  confirmUnlockBtnEl && confirmUnlockBtnEl.addEventListener('click', ()=>{
    let { users, currentUser } = loadUserProgress();
    users[currentUser].progress.guidedPractice3 = true;
    users[currentUser].progress.quiz3 = true;
    saveUserProgress(users);
    updateProgressUI();
    unlockModal.classList.remove('show'); unlockModal.setAttribute('aria-hidden','true');
    try{ window.location.href = 'quiz3.html'; } catch(e){ console.warn('Redirect failed', e); }
  });
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
  skipBtn && skipBtn.addEventListener('click', ()=>{ let { users, currentUser } = loadUserProgress(); users[currentUser].progress.lesson3 = true; users[currentUser].progress.quiz3 = true; saveUserProgress(users); updateProgressUI(); try{ window.location.href = 'quiz3.html'; }catch(e){ console.warn('Redirect failed', e); } });

  continueBtn && continueBtn.addEventListener('click', ()=>{ pauseReflect.style.display='none'; pauseReflect.setAttribute('aria-hidden','true'); nextBtn.disabled=false; next(); });

  /* Keyboard accessibility */
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight'){ if(nextBtn && !nextBtn.disabled) next(); }
    if(e.key === 'Escape'){ // close modals if open
      document.querySelectorAll('.modal.show').forEach(m=>{ m.classList.remove('show'); m.setAttribute('aria-hidden','true'); });
      hideGlossaryPopup();
    }
  });

  /* mini-quiz function */
  function checkAnswer(btn, correct){ btn.classList.add(correct? 'correct':'wrong'); btn.parentNode.querySelectorAll('button').forEach(b=>b.disabled=true); }
  window.checkAnswer = checkAnswer;

  /* small helpers + init */
  window.addEventListener('load', ()=>{
    let {users,currentUser} = loadUserProgress(); if(!users[currentUser].progress) users[currentUser].progress = {};
    saveUserProgress(users); updateProgressUI(); if(users[currentUser].progress.lesson3){ console.log('Lesson 3 already completed ✅ but still replayable.'); }
  });

  /* expose some helpers for debugging */
  window.openGuided = openGuided; window.openGlossary = openGlossary; window.toggleDbInfo = toggleDbInfo; window.updateProgressUI = updateProgressUI;

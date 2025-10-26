 /* ===============================
     Progress storage utilities
     =============================== */
  function loadUserProgress(){
    let users = {};
    try{ users = JSON.parse(localStorage.getItem('users')) || {}; } catch(e){ users = {}; }
    let currentUser = localStorage.getItem('loggedInUser') || 'guest';
    users[currentUser] = users[currentUser] || { progress:{} };
    users[currentUser].progress.lesson7 = users[currentUser].progress.lesson7 || false;
    users[currentUser].progress.quiz7 = users[currentUser].progress.quiz7 || false;
    users[currentUser].progress.guidedPractice7 = users[currentUser].progress.guidedPractice7 || false;
    return { users, currentUser };
  }
  function saveUserProgress(users){
    try{ localStorage.setItem('users', JSON.stringify(users)); } catch(e){ console.warn('Could not save progress', e); }
  }
  function updateProgressUI(){ const { users, currentUser } = loadUserProgress(); console.log('Progress:', users[currentUser].progress); }

  /* ===============================
     DOM refs
     =============================== */
  const introModal = document.getElementById('introModal');
  const beginBtn = document.getElementById('beginBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const startBtn = document.getElementById('startBtn');
  const nextBtn = document.getElementById('nextBtn');
  const skipBtn = document.getElementById('skipBtn');

  const student1Img = document.getElementById('student1Img');
  const student2Img = document.getElementById('student2Img');
  const student3Img = document.getElementById('student3Img');

  const student1Bubble = document.getElementById('student1Bubble');
  const student2Bubble = document.getElementById('student2Bubble');
  const student3Bubble = document.getElementById('student3Bubble');

  const dbInfo = document.getElementById('dbInfo');
  const showDbBtn = document.getElementById('showDbBtn');
  const closeDbX = document.getElementById('closeDbX');

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
     Dialogue sequence (Lesson 7 content)
     =============================== */
  const sequence = [
    {who:'student2', text:'Frankie! My table is messy again… I keep writing the same info over and over.'},
    {who:'student1', text:'Hmm… looks like we have a classic case of redundancy, John.'},
    {who:'student3', text:'Let’s investigate. First, let’s look at the data carefully.'},
    {who:'student2', text:'*sifts through papers* Wow… there are so many duplicates here!'},
    {who:'student1', text:'Exactly. This is why we need Normalization — to clean up the mess.'},
    {who:'student3', text:'Think of it like a crime scene: each clue (or data piece) has its place.'},
    {who:'student2', text:'So we’re detectives for our database now? 😂'},
    {who:'student1', text:'In a way, yes. Let’s start with 1st Normal Form.'},
    {who:'student3', text:'1NF means each column holds atomic values. No repeating groups.'},
    {who:'student1', text:'Right. For example, if a student has multiple projects listed in one cell, split them into separate rows.'},
    {who:'student2', text:'Ahhh… so each clue goes into its proper folder.'},
    {who:'student3', text:'Exactly. Now onto 2nd Normal Form.'},
    {who:'student1', text:'2NF removes partial dependencies. All non-key attributes must depend on the full primary key.'},
    {who:'student2', text:'Wait… can you show me what that looks like in our table?'},
    {who:'student3', text:'Sure. Look at StudentID + Course as a combined key. ProjectTitle should depend on the full key, not just part of it.'},
    {who:'student1', text:'So if something depends only on StudentID, we separate it into another table.'},
    {who:'student2', text:'I think I get it… this really is like sorting clues into proper evidence bags.'},
    {who:'student3', text:'Yes, and it prevents mistakes later when analyzing data. By the way… you’re really quick at spotting duplicates. 😉'},
    {who:'student1', text:'Now, 3rd Normal Form removes transitive dependencies.'},
    {who:'student2', text:'Transitive dependencies… that’s like… one clue depending on another clue instead of the main case?'},
    {who:'student3', text:'Exactly! Non-key attributes should only depend on primary keys. And John… you’re doing great here.'},
    {who:'student1', text:'For instance, if a table has StudentName → Course → ProjectTitle, separate Course into its own table.'},
    {who:'student2', text:'So we’re breaking the chain of indirect dependencies. And Mia… thanks for guiding me 😅'},
    {who:'student3', text:'Hehe, anytime. It’s fun working with you.'},
    {who:'student1', text:'Let’s take a messy table and break it into smaller ones.'},
    {who:'student2', text:'*starts moving rows into new tables* Wow… it’s starting to look organized!'},
    {who:'student3', text:'Notice how much easier it is to see relationships now. And John… I’m impressed by your patience.'},
    {who:'student1', text:'Exactly. Normalization is like decluttering a messy room.'},
    {who:'student2', text:'And every clue has its own place… I love it!'},
    {who:'student3', text:'Also, it makes maintaining and updating data much safer. Plus, working with you is… nice. 😊'},
    {who:'student1', text:'No more accidental duplicates, no more inconsistencies.'},
    {who:'student2', text:'I feel like a true data detective now! And… Mia, I think I like solving cases with you.'},
    {who:'student3', text:'*blushes* Mission accomplished… and I kinda like it too.'},
    {who:'student1', text:'All tables are now in proper Normal Forms. 1NF, 2NF, 3NF, check!', action:'complete'},
    {who:'student2', text:'So the secret to being organized… is breaking things into smaller, logical pieces? 😂'},
    {who:'student3', text:'Yes, especially in databases. And… it’s sweeter when done together.'}
  ];

  let idx = -1;

  /* helpers */
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
      if(item.who === 'student1'){
        student1Bubble.textContent = item.text;
        student1Bubble.classList.add('show');
        student1Img.style.opacity='1'; student1Img.style.transform='translateY(0)';
      } else if(item.who === 'student2'){
        student2Bubble.textContent = item.text;
        student2Bubble.classList.add('show');
        student2Img.style.opacity='1'; student2Img.style.transform='translateY(0)';
      } else if(item.who === 'student3'){
        student3Bubble.textContent = item.text;
        student3Bubble.classList.add('show');
        student3Img.style.opacity='1'; student3Img.style.transform='translateY(0)';
      }
      nextBtn.disabled = false;

      if(item.action === 'pauseAfter'){
        setTimeout(()=> {
          pauseReflect.style.display='block';
          pauseReflect.setAttribute('aria-hidden','false');
          nextBtn.disabled = true;
        }, 300);
      }
      if(item.action === 'complete'){
        setTimeout(()=> {
          dbInfo.style.display='block';
          dbInfo.setAttribute('aria-hidden','false');
          markLessonComplete();
        }, 600);
      }
    }, 160);
  }

  /* navigation */
  function next(){
    nextBtn.disabled = true;
    idx++;
    if(idx < sequence.length) showItem(idx);
    else { dbInfo.style.display='block'; markLessonComplete(); }
  }

  /* start */
  function startScene(){
    idx = -1;
    // hide intro modal
    introModal.classList.remove('show'); introModal.setAttribute('aria-hidden','true');
    // animate characters in
    [student1Img, student2Img, student3Img].forEach(s=>{ if(s){ s.style.opacity='1'; s.style.transform='translateY(0)'; }});
    hideBubbles();
    nextBtn.disabled = true;
    // mark intro read
    let {users, currentUser} = loadUserProgress();
    users[currentUser].progress.readIntro = true;
    saveUserProgress(users);
    updateProgressUI();
    setTimeout(()=> next(), 300);
  }

  /* mark complete */
  function markLessonComplete(){
    let {users, currentUser} = loadUserProgress();
    users[currentUser].progress.lesson7 = true;
    saveUserProgress(users);
    updateProgressUI();
  }

  /* DB Info toggles */
  function closeDbInfo(){ dbInfo.style.display='none'; dbInfo.setAttribute('aria-hidden','true'); }
  function toggleDbInfo(){ if(dbInfo.style.display === 'block') closeDbInfo(); else { dbInfo.style.display='block'; dbInfo.setAttribute('aria-hidden','false'); } }
  showDbBtn && showDbBtn.addEventListener('click', toggleDbInfo);
  closeDbX && closeDbX.addEventListener('click', closeDbInfo);

  /* Guided practice handlers */
  function openGuided(){
    guidedModal.classList.add('show'); guidedModal.setAttribute('aria-hidden','false');
    setTimeout(()=>{ try{ guidedAnswer.focus(); } catch(e){} },120);
  }
  function closeGuided(){ guidedModal.classList.remove('show'); guidedModal.setAttribute('aria-hidden','true'); }

  const openGuidedBtn = document.getElementById('openGuidedBtn');
  openGuidedBtn && openGuidedBtn.addEventListener('click', openGuided);
  closeGuidedBtn && closeGuidedBtn.addEventListener('click', closeGuided);
  closeGuidedX && closeGuidedX.addEventListener('click', closeGuided);

  showHintBtn && showHintBtn.addEventListener('click', ()=>{
    guidedHint.style.display = guidedHint.style.display === 'block' ? 'none' : 'block';
  });
  showAnswerBtn && showAnswerBtn.addEventListener('click', ()=>{
    guidedSample.style.display = guidedSample.style.display === 'block' ? 'none' : 'block';
  });

  submitGuidedBtn && submitGuidedBtn.addEventListener('click', ()=>{
    const answer = (guidedAnswer.value || '').trim();
    let {users, currentUser} = loadUserProgress();
    users[currentUser].progress.guidedPractice7 = true;
    users[currentUser].progress.guidedPractice7_answer = answer;
    saveUserProgress(users);
    updateProgressUI();
    closeGuided();
    // show unlock modal
    unlockModal.classList.add('show'); unlockModal.setAttribute('aria-hidden','false');
  });

  /* Unlock guided practice flow */
  const cancelUnlockBtnEl = document.getElementById('cancelUnlockBtn');
  const confirmUnlockBtnEl = document.getElementById('confirmUnlockBtn');

  cancelUnlockBtnEl && cancelUnlockBtnEl.addEventListener('click', ()=>{
    unlockModal.classList.remove('show'); unlockModal.setAttribute('aria-hidden','true');
  });
  confirmUnlockBtnEl && confirmUnlockBtnEl.addEventListener('click', ()=>{
    let {users, currentUser} = loadUserProgress();
    users[currentUser].progress.guidedPractice7 = true;
    users[currentUser].progress.quiz7 = true;
    saveUserProgress(users);
    updateProgressUI();
    unlockModal.classList.remove('show'); unlockModal.setAttribute('aria-hidden','true');
    try{ window.location.href = 'quiz7.html'; } catch(e){ console.warn('Redirect failed', e); }
  });
  closeUnlockX && closeUnlockX.addEventListener('click', ()=>{ unlockModal.classList.remove('show'); unlockModal.setAttribute('aria-hidden','true'); });

  /* Glossary */
  function openGlossary(){ glossaryModal.classList.add('show'); glossaryModal.setAttribute('aria-hidden','false'); setTimeout(()=>{ try{ closeGlossaryBtn.focus(); } catch(e){} },80); }
  function closeGlossary(){ glossaryModal.classList.remove('show'); glossaryModal.setAttribute('aria-hidden','true'); }
  openGlossaryBtn && openGlossaryBtn.addEventListener('click', openGlossary);
  closeGlossaryBtn && closeGlossaryBtn.addEventListener('click', closeGlossary);
  closeGlossaryX && closeGlossaryX.addEventListener('click', closeGlossary);

  function showGlossaryPopup(term, meaning){
    if(!mobileGlossaryPopup) return;
    mobileGlossaryText.textContent = term + ': ' + meaning;
    mobileGlossaryPopup.classList.add('show');
    mobileGlossaryPopup.setAttribute('aria-hidden','false');
  }
  function hideGlossaryPopup(){ if(mobileGlossaryPopup){ mobileGlossaryPopup.classList.remove('show'); mobileGlossaryPopup.setAttribute('aria-hidden','true'); } }
  window.hideGlossaryPopup = hideGlossaryPopup;

  /* FABs */
  fabGlossary && fabGlossary.addEventListener('click', openGlossary);
  fabPractice && fabPractice.addEventListener('click', openGuided);
  fabHelp && fabHelp.addEventListener('click', ()=>{ helpModal.classList.add('show'); helpModal.setAttribute('aria-hidden','false'); setTimeout(()=>{ try{ closeHelpBtn.focus(); } catch(e){} },80); });

  /* Help modal */
  closeHelpBtn && closeHelpBtn.addEventListener('click', ()=>{ helpModal.classList.remove('show'); helpModal.setAttribute('aria-hidden','true'); });
  closeHelpX && closeHelpX.addEventListener('click', ()=>{ helpModal.classList.remove('show'); helpModal.setAttribute('aria-hidden','true'); });

  /* Start / Skip / Continue handlers */
  beginBtn && beginBtn.addEventListener('click', startScene);
  startBtn && startBtn.addEventListener('click', startScene);
  nextBtn && nextBtn.addEventListener('click', next);
  closeModalBtn && closeModalBtn.addEventListener('click', ()=>{ introModal.classList.remove('show'); introModal.setAttribute('aria-hidden','true'); });

  skipBtn && skipBtn.addEventListener('click', ()=>{
    let {users, currentUser} = loadUserProgress();
    users[currentUser].progress.lesson7 = true;
    users[currentUser].progress.quiz7 = true;
    saveUserProgress(users);
    updateProgressUI();
    try{ window.location.href = 'quiz7.html'; } catch(e){ console.warn('Redirect failed', e); }
  });

  continueBtn && continueBtn.addEventListener('click', ()=> {
    pauseReflect.style.display='none';
    pauseReflect.setAttribute('aria-hidden','true');
    nextBtn.disabled=false;
    next();
  });

  /* Keyboard accessibility */
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight' || e.key === 'Enter'){
      if(nextBtn && !nextBtn.disabled) next();
    }
    if(e.key === 'Escape'){
      document.querySelectorAll('.modal.show').forEach(m=>{
        m.classList.remove('show');
        m.setAttribute('aria-hidden','true');
      });
      hideGlossaryPopup();
    }
  });

  /* mini-quiz helper */
  function checkAnswer(btn, correct){
    btn.classList.add(correct ? 'correct' : 'wrong');
    btn.parentNode.querySelectorAll('button').forEach(b => b.disabled = true);
  }
  window.checkAnswer = checkAnswer;

  /* small helpers + init */
  window.addEventListener('load', ()=>{
    let {users,currentUser} = loadUserProgress();
    if(!users[currentUser].progress) users[currentUser].progress = {};
    saveUserProgress(users);
    updateProgressUI();
    // If lesson already completed, reveal DB info but allow replay
    if(users[currentUser].progress.lesson7){
      console.log("Lesson 7 already completed ✅ but still replayable.");
    }
  });

  /* expose debug helpers */
  window.openGuided = openGuided;
  window.openGlossary = openGlossary;
  window.toggleDbInfo = toggleDbInfo;
  window.updateProgressUI = updateProgressUI;
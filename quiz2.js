 /* ===== Embedded JS: quiz logic, timer, scoring, modal, localStorage progress ===== */

    // ===== User Progress Setup =====
    let users = JSON.parse(localStorage.getItem("users")) || {};
    let currentUser = localStorage.getItem("loggedInUser") || "DemoUser";
    if (!users[currentUser]) users[currentUser] = { progress: {} };

    // ===== Answers & Rationalizations =====
    const answers = {
      q1: "b", q2: "a", q3: "a", q4: "a", q5: "a",
      q6: "a", q7: "a", q8: "a", q9: "a", q10: "a",
      q11: "Table", q12: "Row", q13: "Column", q14: "Cell", q15: "Field",
      q16: "true", q17: "false", q18: "true", q19: "false", q20: "true"
    };

    const rationalizations = {
      q1: "Correct: A table stores related data in rows and columns — the core structure of a relational database.",
      q2: "Correct: A record is one row representing one entity (e.g., one student).",
      q3: "Correct: Fields (columns) store individual pieces of information like 'Name' or 'Grade'.",
      q4: "Correct: A Primary Key uniquely identifies each record in a table.",
      q5: "Correct: A Foreign Key links related records across tables to form relationships.",
      q6: "Correct: Structured data supports organized storage and fast retrieval and analysis.",
      q7: "Correct: Managing library book records is a classic database use case.",
      q8: "Correct: A unique ID (Primary Key) keeps two identically-named people distinct.",
      q9: "Correct: It prevents data duplication and keeps information organized.",
      q10: "Correct: Indexes speed up lookups and queries on large tables.",
           
      //*****Identification*****/
  q11: "Correct — The Table is the main structure that stores data in rows and columns. " +
       "Rationale: A table is the core component of a database that organizes related data in a structured grid format. " +
       "Explanation: Each table represents one entity (like Students or Products) and stores multiple records, each containing the same fields for consistency and organization.",

  q12: "Correct — A Row (or Record) represents a single entry of data in a table. " +
       "Rationale: A row contains all the field values for one specific item or entity within the table. " +
       "Explanation: Each record follows the same format and stores complete information for one object, such as one student’s details.",

  q13: "Correct — A Column represents a specific attribute or property of data. " +
       "Rationale: Columns define what type of information is stored in each record, such as 'Name', 'Age', or 'Email'. " +
       "Explanation: They organize data vertically, ensuring all values under one column share the same data type or category.",

  q14: "Correct — A Cell is the smallest unit of data located at the intersection of a row and a column. " +
       "Rationale: Each cell contains one individual piece of information, like a student’s name or score. " +
       "Explanation: Cells store single values, which collectively form complete records within the table.",

  q15: "Correct — A Field is the name or label assigned to each column in a table. " +
       "Rationale: Fields describe the type of data contained in that column, helping to define the table’s structure. " +
       "Explanation: They guide data entry and retrieval by identifying what kind of information each column holds.",

 //*****True and false*****/
  q16: " True — Organizing data into separate tables helps prevent duplication of information. " +
        "Rationale: Dividing data into smaller, related tables ensures that each piece of information is stored only once. " +
        "Explanation: This proper organization avoids redundancy and keeps data accurate and consistent across the database.",

  q17: " False — Having the same data repeated in multiple tables helps maintain data accuracy. " +
        "Rationale: Repetition of data across tables leads to redundancy and inconsistency. " +
        "Explanation: When data changes in one table but not the others, it causes errors — which is why repetition should be avoided for accuracy.",

  q18: "True — Properly designed relationships between tables ensure that data updates remain consistent across the database. " +
        "Rationale: Relationships use primary and foreign keys to connect tables logically. " +
        "Explanation: When these links are correct, any update in one table automatically reflects in others, keeping the database synchronized and accurate.",

  q19: " False — Storing all data in a single table, even if it repeats, is the best way to keep information accurate. " +
        "Rationale: Putting all data in one table increases redundancy and the chance of error. " +
        "Explanation: Separating related data into multiple linked tables maintains organization, accuracy, and efficiency.",

  q20: "True — Proper database organization improves data accuracy, consistency, and efficiency in data retrieval. " +
        "Rationale: A structured database allows for cleaner storage and faster access to information. " +
        "Explanation: By organizing data logically and minimizing repetition, users can ensure accurate, consistent, and easily retrievable information."
};
    
    // DOM refs
    const form = document.getElementById("quizForm");
    const modal = document.getElementById("resultModal");
    const scoreText = document.getElementById("scoreText");
    const rationalizationList = document.getElementById("rationalizationList");
    const closeBtn = modal.querySelector(".close-btn");
    const proceedBtn = document.getElementById("proceedBtn");
    const timerEl = document.getElementById("time");
    const feedbackText = document.getElementById("feedbackText");

    // ===== Timer (90s default) =====
    let timeLeft = 90;
    timerEl.textContent = timeLeft;
    let timer = setInterval(()=> {
      timeLeft--;
      if (timeLeft < 0) timeLeft = 0;
      timerEl.textContent = timeLeft;
      if (timeLeft <= 10 && timeLeft > 0) timerEl.parentElement.style.color = "crimson";
      if (timeLeft <= 0) {
        clearInterval(timer);
        // auto-submit
        form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
      }
    }, 1000);

    // ===== Utility: get value (handles text inputs & radio groups) =====
    function getAnswerValue(formEl, qName) {
      const el = formEl.elements[qName];
      if (!el) return "";
      // For text input
      if (el.type === "text" || (el.length && el[0] && el[0].type === "text")) {
        return (el.value || (el[0] && el[0].value) || "").trim();
      }
      if (el.length !== undefined) {
        for (let i=0;i<el.length;i++){
          if (el[i].checked) return el[i].value;
        }
        return "";
      }
      return el.value || "";
    }

    // ===== Anti-cheat: disable copy/paste on identification text inputs =====
    const textInputs = Array.from(document.querySelectorAll('input[type="text"]'));
    textInputs.forEach(inp => {
      inp.addEventListener('copy', e => e.preventDefault());
      inp.addEventListener('paste', e => e.preventDefault());
      inp.addEventListener('cut', e => e.preventDefault());
      // optionally disable context menu on inputs
      inp.addEventListener('contextmenu', e => e.preventDefault());
    });

    // ===== Submit Handler =====
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      // stop timer
      clearInterval(timer);

      let score = 0;
      rationalizationList.innerHTML = "";
      const total = 20;

      for (let i = 1; i <= total; i++) {
        let qName = "q" + i;
        let raw = getAnswerValue(form, qName) || "";
        let selected = String(raw);
        const li = document.createElement("li");
        li.style.marginBottom = "8px";

        if (i <= 10) {
          // MCQ
          if (selected.toLowerCase() === answers[qName]) {
            score++;
            li.innerHTML = `✅ <strong>Q${i}:</strong> ${rationalizations[qName]}`;
            li.classList.add("correct");
          } else {
            li.innerHTML = `❌ <strong>Q${i}:</strong> ${rationalizations[qName]}`;
            li.classList.add("incorrect");
          }
        } else if (i <= 15) {
          // Identification (case-insensitive)
          let expected = answers[qName].toLowerCase().trim();
          let given = selected.toLowerCase().trim();
          if (given === expected && given !== "") {
            score++;
            li.innerHTML = `✅ <strong>Q${i}:</strong> ${rationalizations[qName]} — <span class="muted">Your answer: "${selected}"</span>`;
            li.classList.add("correct");
          } else {
            li.innerHTML = `❌ <strong>Q${i}:</strong> ${rationalizations[qName]} — <span class="muted">Your answer: "${selected || '—'}"</span>`;
            li.classList.add("incorrect");
          }
        } else {
          // True/False
          if (selected.toLowerCase() === answers[qName]) {
            score++;
            li.innerHTML = `✅ <strong>Q${i}:</strong> ${rationalizations[qName]}`;
            li.classList.add("correct");
          } else {
            li.innerHTML = `❌ <strong>Q${i}:</strong> ${rationalizations[qName]}`;
            li.classList.add("incorrect");
          }
        }

        rationalizationList.appendChild(li);
      }

      // Score text & feedback
      scoreText.textContent = `You scored ${score} out of ${total}.`;
      const percent = Math.round((score / total) * 100);
      feedbackText.textContent = `Score: ${percent}% — ${ percent >= 70 ? 'Passed' : 'Needs Improvement' }`;

      // Update progress & proceed unlock (pass threshold: 14/20)
      if (score >= 14) {
        users[currentUser].progress.quiz2 = true;
        localStorage.setItem("users", JSON.stringify(users));
        proceedBtn.classList.add("enabled");
        proceedBtn.setAttribute('title', 'Proceed to the next activity');
        // ensure text
        proceedBtn.textContent = "🎮 Proceed to Game 2";
      } else {
        proceedBtn.classList.remove("enabled");
        proceedBtn.textContent = "Score too low. Try again!";
      }

      // show modal
      modal.style.display = "flex";
      closeBtn.focus();
    });

    // ===== Modal close handlers =====
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      // if not passed, reset timer and allow retry (reset answers stay)
      if (!users[currentUser].progress.quiz2) {
        timeLeft = 90;
        timer = setInterval(()=> {
          timeLeft--;
          if (timeLeft < 0) timeLeft = 0;
          timerEl.textContent = timeLeft;
          if (timeLeft <= 10 && timeLeft > 0) timerEl.parentElement.style.color = "crimson";
          if (timeLeft <= 0) {
            clearInterval(timer);
            form.dispatchEvent(new Event('submit', {cancelable: true, bubbles: true}));
          }
        }, 1000);
      }
    });
    // close on outside click
    modal.addEventListener("click", (ev) => {
      if (ev.target === modal) modal.style.display = "none";
    });
    // ESC closes
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape" && modal.style.display === "flex") modal.style.display = "none";
    });

    // ===== Proceed Button action =====
    proceedBtn.addEventListener("click", () => {
      if (users[currentUser] && users[currentUser].progress && users[currentUser].progress.quiz2) {
        // navigate to next activity
        location.href = "game2.html";
      } else {
        // small visual feedback for disabled
        proceedBtn.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.98)' }, { transform: 'scale(1)' }], { duration: 200 });
      }
    });

    // ===== Prevent accidental navigation (anti-cheat) =====
    window.addEventListener("beforeunload", function (e) {
      if (timeLeft > 0 && modal.style.display !== "flex") {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // ===== Utility for debugging: reset demo progress (console only) =====
    window.ERDucateResetDemoQuiz2 = function() {
      users = JSON.parse(localStorage.getItem("users")) || {};
      if (users[currentUser]) {
        delete users[currentUser].progress.quiz2;
        localStorage.setItem("users", JSON.stringify(users));
        alert('Quiz2 progress reset for ' + currentUser);
      } else alert('No demo user data found.');
    };
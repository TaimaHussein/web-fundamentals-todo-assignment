// File: js/app.js
// Student: Taima Ghassan Fawaz Hussein (12326054)
// This file is intentionally incomplete.
// Your task is to implement the required behaviour using JavaScript and the Fetch API.

/*
  API ENDPOINTS (already implemented on the server):

  Base URL:
    http://portal.almasar101.com/assignment/api

  1) Add task  (POST)
     add.php?stdid=STUDENT_ID&key=API_KEY
     Body (JSON): { "title": "Task title" }
     Returns JSON with the added task.

  2) Get tasks (GET)
     get.php?stdid=STUDENT_ID&key=API_KEY
     - If "id" is omitted: returns all tasks for this student.
     - If "id=NUMBER" is provided: returns one task.

  3) Delete task (GET or DELETE)
     delete.php?stdid=STUDENT_ID&key=API_KEY&id=TASK_ID
     Deletes the task with that ID for the given student.
*/

// Configuration for this student (do not change STUDENT_ID value)
const STUDENT_ID = "12326054";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

// Grab elements from the DOM
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

/**
 * Helper to update status message.
 * You can use this in your code.
 */
function setStatus(message, isError = false) {
  if (!statusDiv) return;
  statusDiv.textContent = message || "";
  statusDiv.style.color = isError ? "#d9363e" : "#666666";
}

/**
 * TODO 1:
 * When the page loads, fetch all existing tasks for this student using:
 *   GET: API_BASE + "/get.php?stdid=" + STUDENT_ID + "&key=" + API_KEY
 * Then:
 *   - Parse the JSON response.
 *   - Loop over the "tasks" array (if it exists).
 *   - For each task, create an <li> with class "task-item"
 *     and append it to #task-list.
 */
document.addEventListener("DOMContentLoaded", function () {
  // TODO: implement load logic using fetch(...)
    setStatus("Loading tasks...");

  fetch(`${API_BASE}/get.php?stdid=${STUDENT_ID}&key=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      return response.json();
    })
    .then(data => {
  setStatus("");

  if (data && data.tasks && Array.isArray(data.tasks)) {
    data.tasks.forEach(task => renderTask(task));
  } else if (data && data.message) {
    setStatus(data.message);
  } else {
    setStatus("No tasks found.");
  }
})

});

/**
 * TODO 2:
 * When the form is submitted:
 *   - prevent the default behaviour.
 *   - read the value from #task-input.
 *   - send a POST request using fetch to:
 *       API_BASE + "/add.php?stdid=" + STUDENT_ID + "&key=" + API_KEY
 *     with headers "Content-Type: application/json"
 *     and body JSON: { title: "..." }
 *   - on success, add the new task to the DOM and clear the input.
 */
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    // TODO: implement add-task logic here
    const title = input.value.trim();
    if (!title) {
      setStatus("Please enter a task title.", true);
      return;
    }

    setStatus("Adding task...");

    fetch(`${API_BASE}/add.php?stdid=${STUDENT_ID}&key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to add task");
        }
        return response.json();
      })
      .then(data => {
        if (data && data.task) {
          renderTask(data.task);
          input.value = "";
          setStatus("Task added successfully.");
        } else {
          setStatus("Failed to add task.", true);
        }
      })
      .catch(() => {
        setStatus("Error adding task.", true);
      });
  });
}

/**
 * TODO 3:
 * For each task that you render, create a "Delete" button.
 * When clicked:
 *   - send a request to:
 *       API_BASE + "/delete.php?stdid=" + STUDENT_ID + "&key=" + API_KEY + "&id=" + TASK_ID
 *   - on success, remove that <li> from the DOM.
 *
 * You can create a helper function like "renderTask(task)" that:
 *   - Creates <li>, <span> for title, and a "Delete" <button>.
 *   - Attaches a click listener to the delete button.
 *   - Appends the <li> to #task-list.
 */

// Suggested helper (you can modify it or make your own):
function renderTask(task) {
  // Expected task object fields: id, title, stdid, is_done, created_at (depends on API)
  // TODO: create the DOM elements and append them to list
   const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = task.id;

  const span = document.createElement("span");
  span.className = "task-title";
  span.textContent = task.title;

  const delBtn = document.createElement("button");
  delBtn.className = "task-delete";
  delBtn.textContent = "Delete";

  delBtn.addEventListener("click", function () {
    setStatus("Deleting...");

    fetch(`${API_BASE}/delete.php?stdid=${STUDENT_ID}&key=${API_KEY}&id=${task.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to delete task");
        }
        return response.json();
      })
      .then(data => {
        if (data && data.success) {
          li.remove();
          setStatus("");
        } else {
          setStatus("Failed to delete task.", true);
        }
      })
      .catch(() => {
        setStatus("Error deleting task.", true);
      });
  });

  li.appendChild(span);
  li.appendChild(delBtn);
  list.appendChild(li);
}
// Hide subtitle & footer
document.addEventListener("DOMContentLoaded", () => {
  const subtitle = document.querySelector(".app__subtitle");
  const footer = document.querySelector(".app__footer");

  if (subtitle) subtitle.style.display = "none";
  if (footer) footer.style.display = "none";
});

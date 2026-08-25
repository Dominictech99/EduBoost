const token = localStorage.getItem("tutorToken");
if (!token) {
  window.location.href = "tutor-login.html";
}

const authHeaders = { Authorization: `Bearer ${token}` };
let currentCourseId = null;

// ---------- nav ----------
document.querySelectorAll(".nav-link").forEach((btn) => {
  btn.addEventListener("click", () => showSection(btn.dataset.section, btn));
});
document.querySelectorAll("[data-back]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.querySelector(`.nav-link[data-section="${btn.dataset.back}"]`);
    showSection(btn.dataset.back, target);
  });
});

function showSection(id, navBtn) {
  document.querySelectorAll(".dashboard-section").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  document.querySelectorAll(".nav-link").forEach((b) => b.classList.remove("active"));
  if (navBtn) navBtn.classList.add("active");
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("tutorToken");
  window.location.href = "tutor-login.html";
});

// ---------- load overview ----------
async function loadProfile() {
  const res = await fetch("/api/tutors/me", { headers: authHeaders });
  const data = await res.json();
  if (!res.ok) return;
  document.getElementById("tutorName").textContent = data.fullName;
  document.getElementById("statCourses").textContent = data.courses?.length || 0;
  document.getElementById("statEarnings").textContent = `₦${data.earnings.total.toLocaleString()}`;
  document.getElementById("earnTotal").textContent = `₦${data.earnings.total.toLocaleString()}`;
  document.getElementById("earnPending").textContent = `₦${data.earnings.pending.toLocaleString()}`;
  document.getElementById("earnWithdrawn").textContent = `₦${data.earnings.withdrawn.toLocaleString()}`;
}

// ---------- courses ----------
async function loadCourses() {
  const res = await fetch("/api/tutors/courses", { headers: authHeaders });
  const courses = await res.json();
  const list = document.getElementById("coursesList");
  list.innerHTML = "";
  courses.forEach((c) => {
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `<span class="badge">${c.status}</span><h3>${c.title}</h3><p>${c.subject}</p>`;
    card.addEventListener("click", () => openCourseDetail(c));
    list.appendChild(card);
  });
  document.getElementById("statCourses").textContent = courses.length;
}

document.getElementById("newCourseBtn").addEventListener("click", async () => {
  const title = prompt("Course title:");
  if (!title) return;
  const subject = prompt("Subject (e.g. Mathematics):");
  if (!subject) return;

  const res = await fetch("/api/tutors/courses", {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ title, subject }),
  });
  if (res.ok) loadCourses();
});

function openCourseDetail(course) {
  currentCourseId = course.id;
  document.getElementById("courseDetailTitle").textContent = course.title;
  renderCourseContent(course);
  showSection("course-detail", null);
}

function renderCourseContent(course) {
  const container = document.getElementById("courseContentList");
  container.innerHTML = `
    <h3>Videos (${course.videos.length})</h3>
    <ul>${course.videos.map((v) => `<li>${v.title}</li>`).join("") || "<li>None yet</li>"}</ul>
    <h3>Notes (${course.notes.length})</h3>
    <ul>${course.notes.map((n) => `<li>${n.title}</li>`).join("") || "<li>None yet</li>"}</ul>
  `;
}

// ---------- video upload ----------
document.getElementById("videoUploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const res = await fetch(`/api/tutors/courses/${currentCourseId}/videos`, {
    method: "POST",
    headers: authHeaders,
    body: fd,
  });
  const data = await res.json();
  if (res.ok) {
    renderCourseContent(data);
    form.reset();
  } else {
    alert(data.error || "Upload failed.");
  }
});

// ---------- notes upload ----------
document.getElementById("notesUploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const res = await fetch(`/api/tutors/courses/${currentCourseId}/notes`, {
    method: "POST",
    headers: authHeaders,
    body: fd,
  });
  const data = await res.json();
  if (res.ok) {
    renderCourseContent(data);
    form.reset();
  } else {
    alert(data.error || "Upload failed.");
  }
});

// ---------- students ----------
async function loadStudents() {
  const res = await fetch("/api/tutors/me/students", { headers: authHeaders });
  const students = await res.json();
  const tbody = document.getElementById("studentsTableBody");
  tbody.innerHTML = students
    .map((s) => `<tr><td>${s.name || "-"}</td><td>${s.email || "-"}</td><td>${s.courses.join(", ")}</td></tr>`)
    .join("") || `<tr><td colspan="3">No students enrolled yet.</td></tr>`;
  document.getElementById("statStudents").textContent = students.length;
}

// ---------- init ----------
loadProfile();
loadCourses();
loadStudents();

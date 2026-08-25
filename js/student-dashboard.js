// EduBoost Student Dashboard JavaScript

const studentData = localStorage.getItem("student");
const token = localStorage.getItem("token");

let loggedInStudent = null;

try {
  loggedInStudent = studentData ? JSON.parse(studentData) : null;
} catch (error) {
  console.error("Invalid student data in localStorage");
  localStorage.removeItem("student");
}

if (!loggedInStudent || !token) {
  window.location.href = "student-login.html";
}

let student = {};

// ==============================
// Fetch Student Data
// ==============================

async function loadStudentData() {
  try {
    const studentId = loggedInStudent.id;

    const response = await fetch(
      `https://eduboost-x7ia.onrender.com/api/admin/api/students/${studentId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      window.location.href = "student-login.html";
      return;
    }

    student = data;

    checkDashboardState();

    loadStudentProfile();
    const level = document.getElementById("studentLevel");

    if (level) {
      level.textContent = student.level;
    }

    const email = document.getElementById("studentEmail");

    if (email) {
      email.textContent = student.email;
    }

    const welcomeMessage = document.getElementById("welcomeMessage");

    if (welcomeMessage) {
      const hour = new Date().getHours();

      let greeting = "Welcome";

      if (hour >= 5 && hour < 12) {
        greeting = "🌅 Good Morning";
      } else if (hour >= 12 && hour < 17) {
        greeting = "☀️ Good Afternoon";
      } else {
        greeting = "🌙 Good Evening";
      }

      welcomeMessage.textContent = `${greeting}, ${student.name}!`;
    }

    const currentDate = document.getElementById("currentDate");

    if (currentDate) {
      const today = new Date();

      currentDate.textContent = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    loadStatistics();

    renderCourses();

    renderActivities();

    loadWeeklyProgress();
  } catch (error) {
    console.log("Failed to load student data", error);
  }
}

// ==============================
// Load Student Information
// ==============================

function loadStudentProfile() {
  const name = document.getElementById("studentName");

  const role = document.getElementById("studentRole");

  const avatar = document.getElementById("studentAvatar");

  if (name) {
    name.textContent = student.name;
  }

  if (role) {
    role.textContent = "Student";
  }

  if (avatar) {
    avatar.src =
      student.profileImage && student.profileImage !== ""
        ? student.profileImage
        : "images/default-avatar.png";
  }
}

// ==============================
// Load Statistics
// ==============================

function loadStatistics() {
  const stats = {
    courseCount: student.statistics?.courses ?? 0,
    lessonCount: student.statistics?.lessons ?? 0,
    quizScore: `${student.statistics?.quiz ?? 0}%`,
    learningStreak: student.statistics?.streak ?? 0,
  };
  const streakWidget = document.getElementById("streakWidget");

  if (streakWidget) {
    streakWidget.textContent = `${student.statistics?.streak ?? 0} Days`;
  }

  Object.keys(stats).forEach((id) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = stats[id];
    }
  });
}

// ==============================
// Render Courses
// ==============================

async function renderCourses() {

    const courseContainer = document.getElementById("studentCourses");

    if (!courseContainer) return;

    try {

        const response = await fetch("https://eduboost-x7ia.onrender.com/api/admin/api/courses");

        const courses = await response.json();

        courseContainer.innerHTML = "";

        courses.forEach(course => {

            courseContainer.innerHTML += `

                <div class="course-card">

                    <img src="${course.thumbnail}" alt="${course.title}" class="course-image">

                    <h3>${course.title}</h3>

                    <p>${course.description}</p>

                    <small>👨‍🏫 ${course.teacher}</small>

                    <div class="progress-bar">
                        <div class="progress" style="width:0%"></div>
                    </div>

                    <button class="continue-btn" data-id="${course.id}">
                        View Course
                    </button>

                </div>

            `;

        });

        document.querySelectorAll(".continue-btn").forEach(button => {

            button.addEventListener("click", () => {

                const courseId = button.dataset.id;

                localStorage.setItem("selectedCourse", courseId);

                window.location.href = "course-player.html";

            });

        });

    } catch (error) {

        console.error("Failed to load courses:", error);

    }

}

// ==============================
// Render Activities
// ==============================

function renderActivities() {
  const activityContainer = document.getElementById("activityList");

  if (!activityContainer) return;

  activityContainer.innerHTML = "";

  if (!student.activities || student.activities.length === 0) {
    activityContainer.innerHTML = `
            <div class="empty-state">
                <p>No recent activity yet.</p>
            </div>
        `;

    return;
  }

  student.activities.forEach((activity) => {
    activityContainer.innerHTML += `

            <div class="timeline-item">

                <div class="timeline-dot"></div>

                <div class="timeline-content">

                    <h4>${activity.text}</h4>

                    <span>${activity.time}</span>

                </div>

            </div>

        `;
  });
}

// ==============================
// Logout Button
// ==============================

const logoutButton = document.querySelector(".logout");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("student");
    localStorage.removeItem("token");

    localStorage.clear();
    window.location.replace("student-login.html");
  });
}

// ==============================
// Initialize Dashboard
// ==============================

loadStudentData();


// ==============================
// Course Continue Buttons
// ==============================

function setupCourseButtons() {
  const buttons = document.querySelectorAll(".course-card button");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const courseName = this.parentElement.querySelector("h3").textContent;

      window.location.href = `course-player.html?course=${encodeURIComponent(courseName)}`;

      // Later:
      // Redirect to course page
      // window.location.href = "course.html";
    });
  });

  button.addEventListener("click", () => {

    const courseId = button.dataset.id;

    localStorage.setItem("selectedCourse", courseId);

    window.location.href = "course-player.html";

});
}

// ===============================
// Mobile Sidebar
// ===============================

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

if (menuButton && sidebar && sidebarOverlay) {
  menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("active");
    sidebarOverlay.classList.toggle("active");

    if (window.innerWidth <= 768) {
      document.body.style.overflow = sidebar.classList.contains("active")
        ? "hidden"
        : "";
    }
  });

  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });
}

document.addEventListener("click", (e) => {
  if (
    window.innerWidth <= 768 &&
    sidebar &&
    sidebar.classList.contains("active") &&
    !sidebar.contains(e.target) &&
    !menuButton.contains(e.target)
  ) {
    sidebar.classList.remove("active");
    document.body.style.overflow = "";
  }
});

const menuLinks = document.querySelectorAll(".sidebar-menu a");

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    sidebar.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// ===============================
// Weekly Progress Chart
// ===============================

function loadWeeklyProgress() {
  const canvas = document.getElementById("weeklyProgressChart");

  if (!canvas) return;

  new Chart(canvas, {
    type: "bar",

    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],

      datasets: [
        {
          label: "Hours Studied",

          data: [2, 3, 1, 4, 2, 5, 3],

          borderRadius: 8,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: false,
        },
      },

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

// ===============================
// Quick Actions
// ===============================

const continueBtn = document.getElementById("continueLearningBtn");

if (continueBtn) {
  continueBtn.addEventListener("click", () => {
    alert("Opening your courses...");
  });
}

const quizBtn = document.getElementById("startQuizBtn");

if (quizBtn) {
  quizBtn.addEventListener("click", () => {
    alert("Quiz page coming soon.");
  });
}

const tutorBtn = document.getElementById("findTutorBtn");

if (tutorBtn) {
  tutorBtn.addEventListener("click", () => {
    document.querySelector(".tutors-section")?.scrollIntoView({
      behavior: "smooth",
    });
  });
}

const notesBtn = document.getElementById("downloadNotesBtn");

if (notesBtn) {
  notesBtn.addEventListener("click", () => {
    alert("Notes section coming soon.");
  });
}

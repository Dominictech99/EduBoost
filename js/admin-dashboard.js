let activityLog = [];
let currentFilter = 'all';


class AdminDashboard {

constructor() {
  this.students = [];
  this.tutors = [];
  this.init();
}


async init() {

  this.loadAdminData();
  this.setupEventListeners();

  await this.loadStudents();
await this.loadTutors();

this.renderDashboard();

  this.recordActivity('Admin logged in', 'login');

}


// ADD THIS INSIDE THE CLASS

async loadStudents() {
  try {
    const response = await fetch("http://localhost:3000/api/students");
    const data = await response.json();

    this.students = data.map((student) => ({
  id: student.id,
  name: student.name,
  email: student.email,
  level: student.level,
  image: student.profileImage || "profile.jpg",
  status: student.verified ? "active" : "inactive",
  registrationDate: student.createdAt || null,   // ← add this
}));

    console.log("Students loaded:", this.students);
  } catch (error) {
    console.error("Failed to load students:", error);
  }
}

async loadStudentStats() {
  try {
    const response = await fetch("http://localhost:3000/api/students/stats");
    const stats = await response.json();

    document.getElementById("total-students").textContent = stats.total;
    document.getElementById("verified-students").textContent = stats.verified;
    document.getElementById("unverified-students").textContent = stats.unverified;
  } catch (error) {
    console.error("Failed to load student stats:", error);
  }
}

async init() {
  this.loadAdminData();
  this.setupEventListeners();

  await this.loadStudents();
  await this.loadTutors();
  await this.loadStudentStats();   // ← add this

  this.renderDashboard();
  this.recordActivity('Admin logged in', 'login');
}

async loadTutors() {

  try {

    const response = await fetch("http://localhost:3000/api/tutors");

    const tutors = await response.json();

    this.tutors = tutors.map(tutor => ({
      ...tutor,
      image: tutor.image || "profile.jpg",
      rating: tutor.rating || "New",
      registrationDate: tutor.submittedAt || new Date().toISOString(),
      status: (tutor.status || "Pending").toLowerCase()
    }));

    console.log("Tutors loaded:", this.tutors);

  } catch (error) {

    console.error("Failed to load tutors:", error);

  }

}



  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => this.handleTabSwitch(e));
    });

    // Search functionality
    const studentsSearch = document.getElementById('students-search');
    const tutorsSearch = document.getElementById('tutors-search');
    
    if (studentsSearch) {
      studentsSearch.addEventListener('input', (e) => this.searchStudents(e.target.value));
    }
    
    if (tutorsSearch) {
      tutorsSearch.addEventListener('input', (e) => this.searchTutors(e.target.value));
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleTutorFilter(e));
    });

    // Modal close
    const modal = document.getElementById('tutor-modal');
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }

    // Logout
    const logoutBtn = document.getElementById('admin-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  handleTabSwitch(e) {
    e.preventDefault();
    
    // Remove active class from all items
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // Add active class to clicked item
    e.target.closest('.nav-item').classList.add('active');
    
    // Show selected tab content
    const tabName = e.target.closest('.nav-item').dataset.tab;
    const tabContent = document.getElementById(tabName);
    if (tabContent) {
      tabContent.classList.add('active');
    }

    // Close sidebar on mobile
    const sidebar = document.querySelector('.admin-sidebar');
    if (window.innerWidth <= 1024) {
      sidebar.classList.remove('active');
    }
  }

  renderDashboard() {
    this.updateStats();
    this.renderStudentsTable();
    this.renderTutorsGrid();
    this.renderActivityLog();
  }

  updateStats() {
    const totalStudents = this.students.length;
    const totalTutors = this.tutors.length;
    const pendingTutors = this.tutors.filter(t => t.status === 'pending').length;
    const approvedTutors = this.tutors.filter(t => t.status === 'approved').length;

    document.getElementById('total-students').textContent = totalStudents;
    document.getElementById('total-tutors').textContent = totalTutors;
    document.getElementById('pending-tutors').textContent = pendingTutors;
    document.getElementById('approved-tutors').textContent = approvedTutors;
  }

  renderStudentsTable() {
    const tbody = document.getElementById('students-table-body');
    tbody.innerHTML = '';

    this.students.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="profile-cell">
            <img src="${student.image}" alt="${student.name}" />
          </div>
        </td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${new Date(student.registrationDate).toLocaleDateString()}</td>
        <td>
          <span class="status-badge status-active">Active</span>
        </td>
        <td>
          <button class="action-btn view-btn" onclick="admin.viewStudent(${student.id})">View</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  renderTutorsGrid() {
    const grid = document.getElementById('tutors-grid');
    grid.innerHTML = '';

    const filteredTutors = currentFilter === 'all' 
      ? this.tutors 
      : this.tutors.filter(t => t.status === currentFilter);

    filteredTutors.forEach(tutor => {
      const statusClass = `status-${tutor.status}`;
      const card = document.createElement('div');
      card.className = 'tutor-card';
      card.innerHTML = `
        <div class="tutor-card-header">
          <img src="${tutor.image}" alt="${tutor.name}" class="tutor-avatar" />
        </div>
        <div class="tutor-card-body">
          <h3>${tutor.name}</h3>
          <div class="tutor-subject">${tutor.subject}</div>
          <div class="tutor-info">📧 ${tutor.email}</div>
          <div class="tutor-info">⭐ ${tutor.rating} rating</div>
          <div class="tutor-info">👔 ${tutor.experience}</div>
          <span class="tutor-status ${statusClass}">${tutor.status.toUpperCase()}</span>
        </div>
        <div class="tutor-card-footer">
  ${tutor.status === 'pending' ? `
    <button class="action-btn approve-btn" onclick="admin.approveTutor('${tutor.id}')">Approve</button>
    <button class="action-btn reject-btn" onclick="admin.rejectTutor('${tutor.id}')">Reject</button>
  ` : `
    <button class="action-btn view-btn" onclick="admin.viewTutor('${tutor.id}')">View Details</button>
  `}
</div>
      `;
      grid.appendChild(card);
    });
  }

  handleTutorFilter(e) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');

    // Update current filter
    currentFilter = e.target.dataset.filter;
    this.renderTutorsGrid();
  }

  async approveTutor(tutorId) {

    try {

        const response = await fetch(
            `http://localhost:3000/api/tutors/${tutorId}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "approved"
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to approve tutor.");
        }

        await this.loadTutors();
        this.renderDashboard();

        this.showNotification("Tutor approved successfully!", "success");

    } catch (error) {

        console.error(error);

    }

}

async rejectTutor(tutorId) {

    try {

        const response = await fetch(
            `http://localhost:3000/api/tutors/${tutorId}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: "rejected"
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to reject tutor.");
        }

        await this.loadTutors();
        this.renderDashboard();

        this.showNotification("Tutor rejected.", "warning");

    } catch (error) {

        console.error(error);

    }

}

  viewTutor(tutorId) {
    const tutor = this.tutors.find(t => t.id === tutorId);
    if (tutor) {
      const modal = document.getElementById('tutor-modal');
      const modalBody = document.getElementById('modal-body');
      
      modalBody.innerHTML = `
        <h2 style="margin-bottom: 16px;">${tutor.name}</h2>
        <div style="display: flex; gap: 20px; margin-bottom: 20px;">
          <img src="${tutor.image}" alt="${tutor.name}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover;" />
          <div>
            <p><strong>Subject:</strong> ${tutor.subject}</p>
            <p><strong>Email:</strong> ${tutor.email}</p>
            <p><strong>Experience:</strong> ${tutor.experience}</p>
            <p><strong>Rating:</strong> ⭐ ${tutor.rating}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${tutor.status}">${tutor.status.toUpperCase()}</span></p>
            <p><strong>Registration Date:</strong> ${new Date(tutor.registrationDate).toLocaleDateString()}</p>
          </div>
        </div>
        ${tutor.status === 'pending' ? `
          <div style="display: flex; gap: 10px;">
            <button class="action-btn approve-btn" onclick="admin.approveTutor(${tutor.id})" style="flex: 1;">Approve</button>
            <button class="action-btn reject-btn" onclick="admin.rejectTutor(${tutor.id})" style="flex: 1;">Reject</button>
          </div>
        ` : ''}
      `;
      
      modal.classList.add('show');
    }
  }

  viewStudent(studentId) {
    const student = this.students.find(s => s.id === studentId);
    if (student) {
      alert(`Student: ${student.name}\nEmail: ${student.email}\nStatus: Active`);
    }
  }

  searchStudents(searchTerm) {
    const filtered = this.students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tbody = document.getElementById('students-table-body');
    tbody.innerHTML = '';

    filtered.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>
          <div class="profile-cell">
            <img src="${student.image}" alt="${student.name}" />
          </div>
        </td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.registrationDate ? new Date(student.registrationDate).toLocaleDateString() : "N/A"}</td>
        <td>
          <span class="status-badge status-active">Active</span>
        </td>
        <td>
          <button class="action-btn view-btn" onclick="admin.viewStudent(${student.id})">View</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  searchTutors(searchTerm) {
    const filtered = this.tutors.filter(tutor =>
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grid = document.getElementById('tutors-grid');
    grid.innerHTML = '';

    filtered.forEach(tutor => {
      const statusClass = `status-${tutor.status}`;
      const card = document.createElement('div');
      card.className = 'tutor-card';
      card.innerHTML = `
        <div class="tutor-card-header">
          <img src="${tutor.image}" alt="${tutor.name}" class="tutor-avatar" />
        </div>
        <div class="tutor-card-body">
          <h3>${tutor.name}</h3>
          <div class="tutor-subject">${tutor.subject}</div>
          <div class="tutor-info">📧 ${tutor.email}</div>
          <div class="tutor-info">⭐ ${tutor.rating} rating</div>
          <div class="tutor-info">👔 ${tutor.experience}</div>
          <span class="tutor-status ${statusClass}">${tutor.status.toUpperCase()}</span>
        </div>
        <div class="tutor-card-footer">
          ${tutor.status === 'pending' ? `
            <button class="action-btn approve-btn" onclick="admin.approveTutor('${tutor.id}')">Approve</button>

<button class="action-btn reject-btn" onclick="admin.rejectTutor('${tutor.id}')">Reject</button>
          ` : `
            <button class="action-btn view-btn" onclick="admin.viewTutor('${tutor.id}')">View Details</button>
          `}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  closeModal() {
    const modal = document.getElementById('tutor-modal');
    modal.classList.remove('show');
  }

  recordActivity(message, type) {
    const activity = {
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    activityLog.unshift(activity);
    if (activityLog.length > 10) activityLog.pop();
  }

  renderActivityLog() {
    const activityList = document.getElementById('activity-list');
    activityList.innerHTML = '';

    if (activityLog.length === 0) {
      activityList.innerHTML = '<p style="color: var(--text-secondary);">No recent activity</p>';
      return;
    }

    activityLog.forEach(activity => {
      const item = document.createElement('div');
      item.className = 'activity-item';
      item.innerHTML = `
        <div class="activity-text">
          <strong>${activity.message}</strong>
          <small>${activity.timestamp}</small>
        </div>
        <div class="activity-time">${activity.type}</div>
      `;
      activityList.appendChild(item);
    });
  }

  loadAdminData() {
    const adminData = localStorage.getItem('adminUser');
    if (adminData) {
      try {
        const admin = JSON.parse(adminData);
        document.getElementById('admin-name').textContent = admin.name || 'Admin';
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    }
  }

  logout() {
    localStorage.removeItem('adminUser');
    this.showNotification('Logging out...', 'success');
    setTimeout(() => {
      window.location.href = 'admin-login.html';
    }, 1000);
  }

  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize admin dashboard
let admin;
document.addEventListener('DOMContentLoaded', () => {
  admin = new AdminDashboard();
});

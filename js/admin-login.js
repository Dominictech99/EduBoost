class AdminLogin {
  constructor() {
    this.form = document.getElementById('admin-login-form');
    this.adminEmailInput = document.getElementById('admin-email');
    this.adminPasswordInput = document.getElementById('admin-password');
    
    // Demo credentials
    this.demoEmail = 'admin@eduboost.com';
    this.demoPassword = 'admin123';
    
    this.init();
  }

  init() {
    // Check if admin is already logged in
    this.checkExistingLogin();
    
    // Attach form submission
    this.form.addEventListener('submit', (e) => this.handleLogin(e));
  }

  checkExistingLogin() {
    const adminData = localStorage.getItem('adminUser');
    if (adminData) {
      window.location.href = 'Admin Dashboard.html';
    }
  }

  handleLogin(e) {
    e.preventDefault();

    const adminName = this.adminNameInput.value.trim();
    const email = this.adminEmailInput.value.trim();
    const password = this.adminPasswordInput.value;

    // Validation
    if (!adminName || !email || !password) {
      this.showNotification('Please fill in all fields', 'error');
      return;
    }

    // Demo authentication (in production, this would be backend verification)
    if (email === this.demoEmail && password === this.demoPassword) {
      this.saveAdminData(email);
    } else {
      this.showNotification('Invalid email or password', 'error');
      return;
    }
  }

  saveAdminData(email) {
    const adminData = {
      name: name,
      email: email,
      loginTime: new Date().toISOString(),
      role: 'administrator'
    };

    localStorage.setItem('adminUser', JSON.stringify(adminData));
    this.showNotification('Login successful! Redirecting...', 'success');

    // Redirect to admin dashboard after 1 second
    setTimeout(() => {
      window.location.href = 'Admin Dashboard.html';
    }, 1000);
  }

  showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
      existing.remove();
    }

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize admin login
document.addEventListener('DOMContentLoaded', () => {
  new AdminLogin();
});

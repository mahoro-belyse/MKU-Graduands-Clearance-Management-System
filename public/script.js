// Global variables
let currentUser = null;
let currentAdmin = null;
let authToken = null;
let currentPage = 1;
let currentStatus = "all";
let currentSearch = "";
let searchTimeout = null;

// API Base URL
const API_BASE = "http://localhost:5000";

// Navigation functions
function showHomepage() {
  document.getElementById("hero-section").classList.remove("hidden");
  document.getElementById("university-showcase").classList.remove("hidden");
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("student-dashboard").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "none";
  document.getElementById("main-nav").style.display = "flex";
  document.getElementById("user-nav").style.display = "none";
}

function showStudentLogin() {
  document.getElementById("hero-section").classList.add("hidden");
  document.getElementById("university-showcase").classList.add("hidden");
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("student-dashboard").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "none";

  // Reset and show login form
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".auth-form")
    .forEach((form) => form.classList.remove("active"));

  document.getElementById("student-login-tab").classList.add("active");
  document.getElementById("login-form").classList.add("active");
}

function showStudentRegister() {
  document.getElementById("hero-section").classList.add("hidden");
  document.getElementById("university-showcase").classList.add("hidden");
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("student-dashboard").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "none";

  // Reset and show register form
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".auth-form")
    .forEach((form) => form.classList.remove("active"));

  document.getElementById("student-register-tab").classList.add("active");
  document.getElementById("register-form").classList.add("active");
}

function showAdminLogin() {
  document.getElementById("hero-section").classList.add("hidden");
  document.getElementById("university-showcase").classList.add("hidden");
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("student-dashboard").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "none";

  // Reset and show admin login form
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".auth-form")
    .forEach((form) => form.classList.remove("active"));

  document.getElementById("admin-login-tab").classList.add("active");
  document.getElementById("admin-login-form").classList.add("active");
}

function showAdminLoginForm() {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".auth-form")
    .forEach((form) => form.classList.remove("active"));

  document.getElementById("admin-login-tab").classList.add("active");
  document.getElementById("admin-login-form").classList.add("active");
}

function toggleMobileMenu() {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
}

// Utility functions
function showLoading() {
  const loading = document.getElementById("loading");
  loading.style.display = "flex";
  loading.style.opacity = "0";
  setTimeout(() => {
    loading.style.opacity = "1";
  }, 10);
}

function hideLoading() {
  const loading = document.getElementById("loading");
  loading.style.opacity = "0";
  setTimeout(() => {
    loading.style.display = "none";
  }, 200);
}

function showAlert(message, type = "info") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;

  const main = document.querySelector(".main");
  main.insertBefore(alertDiv, main.firstChild);

  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

// Auth functions
function showLogin() {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".auth-form")
    .forEach((form) => form.classList.remove("active"));

  event.target.classList.add("active");
  document.getElementById("login-form").classList.add("active");
}

function showRegister() {
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".auth-form")
    .forEach((form) => form.classList.remove("active"));

  event.target.classList.add("active");
  document.getElementById("register-form").classList.add("active");
}

// Add password toggle functionality
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const toggle = input.nextElementSibling.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    toggle.className = "fas fa-eye-slash";
  } else {
    input.type = "password";
    toggle.className = "fas fa-eye";
  }
}

// Enhanced register function with auto-login
async function register(event) {
  event.preventDefault();
  showLoading();

  const formData = {
    registrationNumber: document.getElementById("reg-number").value,
    firstName: document.getElementById("first-name").value,
    lastName: document.getElementById("last-name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      // Auto-login after successful registration
      currentUser = data.user;
      authToken = data.token;
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      showAlert(data.message, "success");
      showStudentDashboard();
      document.getElementById("register-form").reset();
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    showAlert("Network error. Please try again.", "error");
  } finally {
    hideLoading();
  }
}

async function login(event) {
  event.preventDefault();
  showLoading();

  const formData = {
    registrationNumber: document.getElementById("login-reg-number").value,
    password: document.getElementById("login-password").value,
  };

  try {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      currentUser = data.user;
      authToken = data.token;
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      showStudentDashboard();
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    showAlert("Network error. Please try again.", "error");
  } finally {
    hideLoading();
  }
}

async function adminLogin(event) {
  event.preventDefault();
  showLoading();

  const formData = {
    username: document.getElementById("admin-username").value,
    password: document.getElementById("admin-password").value,
  };

  try {
    const response = await fetch(`${API_BASE}/api/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      currentAdmin = data.admin;
      authToken = data.token;
      localStorage.setItem("authToken", authToken);
      localStorage.setItem("currentAdmin", JSON.stringify(currentAdmin));

      showAdminDashboard();
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    showAlert("Network error. Please try again.", "error");
  } finally {
    hideLoading();
  }
}

function logout() {
  currentUser = null;
  currentAdmin = null;
  authToken = null;
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentAdmin");

  showHomepage();
  showAlert("Logged out successfully", "success");
}

// Dashboard functions
async function showStudentDashboard() {
  document.getElementById("hero-section").classList.add("hidden");
  document.getElementById("university-showcase").classList.add("hidden");
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("student-dashboard").style.display = "block";
  document.getElementById("admin-dashboard").style.display = "none";
  document.getElementById("main-nav").style.display = "none";
  document.getElementById("user-nav").style.display = "flex";

  // Update user info in navigation
  document.getElementById("user-info-nav").innerHTML = `
    <strong>${currentUser.firstName} ${currentUser.lastName}</strong><br>
    <small>${currentUser.registrationNumber}</small>
  `;

  // Update user info in dashboard
  document.getElementById("user-info").innerHTML = `
    <strong>${currentUser.firstName} ${currentUser.lastName}</strong><br>
    <small>${currentUser.registrationNumber} | ${currentUser.email}</small>
  `;

  loadClearanceStatus();
}

// Enhanced dashboard functions
function showClearanceStatus() {
  document
    .querySelectorAll(".dashboard-tabs .tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  event.target.classList.add("active");
  document.getElementById("clearance-status-tab").classList.add("active");
}

async function showClearedStudentsList() {
  document
    .querySelectorAll(".dashboard-tabs .tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  event.target.classList.add("active");
  document.getElementById("cleared-students-tab").classList.add("active");

  await loadClearedStudentsForStudent();
}

// Load cleared students for student view
async function loadClearedStudentsForStudent() {
  showLoading();

  try {
    const response = await fetch(`${API_BASE}/api/cleared-students`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      displayClearedStudentsForStudent(data);
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    showAlert("Error loading cleared students", "error");
  } finally {
    hideLoading();
  }
}

function displayClearedStudentsForStudent(students) {
  const container = document.getElementById("cleared-students-list");

  if (students.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-users" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
        <p>No students have completed their clearance yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = students
    .map(
      (student) => `
      <div class="cleared-student-card">
        <div class="cleared-student-info">
          <h5>${student.studentId.firstName} ${student.studentId.lastName}</h5>
          <p>${student.studentId.registrationNumber}</p>
        </div>
        <div class="cleared-date">
          <i class="fas fa-check-circle"></i>
          Cleared: ${new Date(student.updatedAt).toLocaleDateString()}
        </div>
      </div>
    `
    )
    .join("");
}

// Enhanced admin dashboard with stats
async function showAdminDashboard() {
  document.getElementById("hero-section").classList.add("hidden");
  document.getElementById("university-showcase").classList.add("hidden");
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("student-dashboard").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "block";
  document.getElementById("main-nav").style.display = "none";
  document.getElementById("user-nav").style.display = "flex";

  // Update admin info in navigation
  document.getElementById("user-info-nav").innerHTML = `
    <strong><i class="fas fa-user-shield"></i> ${
      currentAdmin.username
    }</strong><br>
    <small>${getDepartmentName(currentAdmin.department)}</small>
  `;

  // Update admin info in dashboard
  document.getElementById("admin-info").innerHTML = `
    <strong><i class="fas fa-user-shield"></i> ${
      currentAdmin.username
    }</strong><br>
    <small>${getDepartmentName(
      currentAdmin.department
    )} | ${currentAdmin.role.toUpperCase()}</small>
  `;

  // Show cleared students tab for all admins
  document.getElementById("cleared-students-tab").style.display = "block";

  loadAdminStats();
  loadClearanceRequests();
}

// Load admin statistics
async function loadAdminStats() {
  try {
    const response = await fetch(`${API_BASE}/api/admin/stats`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      displayAdminStats(data);
    }
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

function displayAdminStats(stats) {
  const container = document.getElementById("stats-container");

  if (currentAdmin.role === "hod" || currentAdmin.role === "dean") {
    // Overall stats for HOD/Dean
    container.innerHTML = `
      <div class="stat-card success">
        <i class="fas fa-check-circle stat-icon"></i>
        <h4>Completed Clearances</h4>
        <div class="stat-number">${stats.completedClearances}</div>
      </div>
      <div class="stat-card warning">
        <i class="fas fa-clock stat-icon"></i>
        <h4>Pending Clearances</h4>
        <div class="stat-number">${stats.pendingClearances}</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-users stat-icon"></i>
        <h4>Total Students</h4>
        <div class="stat-number">${stats.totalStudents}</div>
      </div>
      <div class="stat-card danger">
        <i class="fas fa-bell stat-icon"></i>
        <h4>New Responses</h4>
        <div class="stat-number">${Object.values(stats.departmentStats).reduce(
          (sum, dept) => sum + dept.newResponses,
          0
        )}</div>
      </div>
    `;
  } else {
    // Department-specific stats
    container.innerHTML = `
      <div class="stat-card success">
        <i class="fas fa-check stat-icon"></i>
        <h4>Approved</h4>
        <div class="stat-number">${stats.approved}</div>
      </div>
      <div class="stat-card warning">
        <i class="fas fa-clock stat-icon"></i>
        <h4>Pending</h4>
        <div class="stat-number">${stats.pending}</div>
      </div>
      <div class="stat-card danger">
        <i class="fas fa-times stat-icon"></i>
        <h4>Rejected</h4>
        <div class="stat-number">${stats.rejected}</div>
      </div>
      <div class="stat-card">
        <i class="fas fa-bell stat-icon"></i>
        <h4>New Responses</h4>
        <div class="stat-number">${stats.newResponses}</div>
      </div>
    `;
  }

  // Update notification badge
  const totalNewResponses =
    currentAdmin.role === "hod" || currentAdmin.role === "dean"
      ? Object.values(stats.departmentStats || {}).reduce(
          (sum, dept) => sum + dept.newResponses,
          0
        )
      : stats.newResponses;

  const badge = document.getElementById("requests-badge");
  if (totalNewResponses > 0) {
    badge.textContent = totalNewResponses;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

function showDashboard() {
  if (currentUser) {
    showStudentDashboard();
  } else if (currentAdmin) {
    showAdminDashboard();
  }
}

// Student functions
async function loadClearanceStatus() {
  showLoading();

  try {
    const response = await fetch(`${API_BASE}/api/clearance/status`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      displayClearanceStatus(data);
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    showAlert("Error loading clearance status", "error");
  } finally {
    hideLoading();
  }
}

function displayClearanceStatus(clearance) {
  const departmentsGrid = document.getElementById("departments-grid");
  const departments = [
    { key: "library", name: "📚 Library" },
    { key: "hod", name: "👨‍💼 Head of Department" },
    { key: "clubs", name: "🏆 Club/Sports/Games" },
    { key: "laboratory", name: "🔬 Laboratory Department" },
    { key: "computerLab", name: "💻 Computer Laboratory" },
    { key: "cafeteria", name: "🍽️ Cafeteria/CCAS Hostels" },
    { key: "deanOfStudents", name: "🎓 Dean of Students" },
    { key: "examination", name: "📝 Examination" },
    { key: "finance", name: "💰 Finance" },
  ];

  departmentsGrid.innerHTML = "";

  const approvedCount = Object.values(clearance.departments).filter(
    (d) => d.status === "approved"
  ).length;
  const totalCount = Object.keys(clearance.departments).length;
  const progressPercentage = (approvedCount / totalCount) * 100;

  departments.forEach((dept) => {
    const deptData = clearance.departments[dept.key];
    const card = document.createElement("div");
    card.className = `department-card ${deptData.status}`;

    const statusBadge = `<span class="status-badge status-${
      deptData.status
    }">${deptData.status.toUpperCase()}</span>`;
    let content = "";

    if (deptData.status === "approved") {
      content = `
                <p><strong>Approved by:</strong> ${deptData.approvedBy}</p>
                <p><strong>Date:</strong> ${new Date(
                  deptData.approvedAt
                ).toLocaleDateString()}</p>
            `;
    } else if (deptData.status === "rejected") {
      content = `
                <div class="rejection-reason">
                    <strong>Reason:</strong> ${deptData.reason}
                </div>
                <div class="upload-section">
                    <p><small>If you have documents to prove otherwise, you can upload them:</small></p>
                    <button class="btn btn-secondary" onclick="openUploadModal('${dept.key}')">Upload Document</button>
                </div>
            `;
    }

    card.innerHTML = `
            <h4>${dept.name}</h4>
            ${statusBadge}
            ${content}
        `;

    departmentsGrid.appendChild(card);
  });

  // Update overall status
  const overallStatus = document.getElementById("overall-status");
  if (clearance.overallStatus === "completed") {
    overallStatus.className = "overall-status completed";
    overallStatus.innerHTML = `
    <h3>🎉 Congratulations!</h3>
    <p>Your clearance has been completed successfully. You are now cleared for graduation!</p>
    <div class="progress-bar">
      <div class="progress-fill" style="width: 100%"></div>
    </div>
  `;
  } else {
    overallStatus.className = "overall-status";
    overallStatus.innerHTML = `
    <h3>Clearance Progress</h3>
    <p>Progress: ${approvedCount}/${totalCount} departments approved</p>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${progressPercentage}%"></div>
    </div>
    <p><strong>Status:</strong> In Progress</p>
  `;
  }
}

// File upload functions
function openUploadModal(department) {
  document.getElementById("upload-department").value = department;
  document.getElementById("upload-modal").style.display = "flex";
}

function closeUploadModal() {
  document.getElementById("upload-modal").style.display = "none";
  document.getElementById("upload-form").reset();
}

async function uploadFile(event) {
  event.preventDefault();
  showLoading();

  const department = document.getElementById("upload-department").value;
  const file = document.getElementById("upload-file").files[0];
  const comment = document.getElementById("upload-comment").value;

  const formData = new FormData();
  formData.append("document", file);
  formData.append("comment", comment);

  try {
    const response = await fetch(`${API_BASE}/api/upload/${department}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      showAlert("Document uploaded successfully!", "success");
      closeUploadModal();
      await loadClearanceStatus();
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    showAlert("Error uploading file", "error");
  } finally {
    hideLoading();
  }
}

function viewUploadedFiles(studentId, department) {
  showLoading();

  fetch(`${API_BASE}/api/files/${studentId}/${department}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((files) => {
      displayUploadedFiles(files, department);
    })
    .catch((error) => {
      showAlert("Error loading files", "error");
    })
    .finally(() => {
      hideLoading();
    });
}

function displayUploadedFiles(files, department) {
  const modal = document.getElementById("file-modal");
  const modalBody = document.getElementById("file-modal-body");

  if (files.length === 0) {
    modalBody.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-file" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
        <p>No files uploaded for ${getDepartmentName(department)}</p>
      </div>
    `;
  } else {
    modalBody.innerHTML = files
      .map(
        (file) => `
      <div class="file-item">
        <h5><i class="fas fa-file"></i> ${file.originalName}</h5>
        <p><strong>Comment:</strong> ${file.comment}</p>
        <p><strong>Uploaded:</strong> ${new Date(
          file.uploadedAt
        ).toLocaleDateString()}</p>
        <p><strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
        <div class="file-actions">
          <button class="btn btn-primary" onclick="previewFile('${
            file.filename
          }', '${file.originalName}', '${file.mimetype}')">
            <i class="fas fa-eye"></i> Preview
          </button>
          <button class="btn btn-secondary" onclick="downloadFile('${
            file.filename
          }', '${file.originalName}')">
            <i class="fas fa-download"></i> Download
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  modal.style.display = "flex";
}

function previewFile(filename, originalName, mimetype) {
  const previewModal = document.createElement("div");
  previewModal.className = "file-preview-modal";
  previewModal.onclick = (e) => {
    if (e.target === previewModal) {
      previewModal.remove();
    }
  };

  let previewContent = "";
  const fileUrl = `${API_BASE}/api/files/view/${filename}`;

  if (mimetype === "application/pdf") {
    previewContent = `<iframe src="${fileUrl}" width="800" height="600"></iframe>`;
  } else if (mimetype.startsWith("image/")) {
    previewContent = `<img src="${fileUrl}" alt="${originalName}" style="max-width: 800px; max-height: 600px;">`;
  } else {
    previewContent = `
      <div class="file-preview-error">
        <i class="fas fa-file" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
        <p>Preview not available for this file type</p>
        <button class="btn btn-primary" onclick="downloadFile('${filename}', '${originalName}')">
          <i class="fas fa-download"></i> Download File
        </button>
      </div>
    `;
  }

  previewModal.innerHTML = `
    <div class="file-preview-content">
      <div class="file-preview-header">
        <h3><i class="fas fa-eye"></i> ${originalName}</h3>
        <button class="close" onclick="this.closest('.file-preview-modal').remove()">×</button>
      </div>
      <div class="file-preview-body">
        ${previewContent}
      </div>
    </div>
  `;

  document.body.appendChild(previewModal);
}

function downloadFile(filename, originalName) {
  const link = document.createElement("a");
  link.href = `${API_BASE}/api/files/view/${filename}`;
  link.download = originalName;
  link.click();
}

function closeFileModal() {
  document.getElementById("file-modal").style.display = "none";
}

// Enhanced clearance requests loading with pagination
async function loadClearanceRequests(page = 1, status = "all", search = "") {
  showLoading();
  currentPage = page;
  currentStatus = status;
  currentSearch = search;

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "20",
      status,
      search,
    });

    const response = await fetch(
      `${API_BASE}/api/admin/clearance-requests?${params}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      displayClearanceRequests(data.clearances);
      displayPagination(data.pagination);
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    showAlert("Error loading clearance requests", "error");
  } finally {
    hideLoading();
  }
}

// Enhanced display function with action button states
function displayClearanceRequests(clearances) {
  const container = document.getElementById("requests-container");
  container.innerHTML = "";

  if (clearances.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-clipboard-list" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
        <p>No clearance requests found.</p>
      </div>
    `;
    return;
  }

  clearances.forEach((clearance) => {
    const card = document.createElement("div");
    card.className = "request-card";
    card.id = `request-card-${clearance._id}`;

    // Check if there are new responses
    const hasNewResponse = Object.values(clearance.departments).some(
      (dept) => dept.hasNewResponse
    );
    if (hasNewResponse) {
      card.classList.add("has-new-response");
    }

    // Determine which departments to show based on admin role
    let departmentsToShow = [];
    if (currentAdmin.role === "hod" || currentAdmin.role === "dean") {
      departmentsToShow = Object.keys(clearance.departments);
    } else {
      departmentsToShow = [currentAdmin.department];
    }

    let departmentContent = "";
    departmentsToShow.forEach((deptKey) => {
      const dept = clearance.departments[deptKey];
      const deptName = getDepartmentName(deptKey);
      const canManage =
        currentAdmin.department === deptKey ||
        currentAdmin.role === "hod" ||
        currentAdmin.role === "dean";

      // Determine button states
      const isProcessed =
        dept.status === "approved" || dept.status === "rejected";
      const approveDisabled = isProcessed ? "disabled" : "";
      const rejectDisabled = isProcessed ? "disabled" : "";
      const approveClass = dept.status === "approved" ? "completed" : "";
      const rejectClass = dept.status === "rejected" ? "completed" : "";

      departmentContent += `
        <div class="department-section">
          <h5><i class="fas fa-building"></i> ${deptName}</h5>
          <span class="status-badge status-${
            dept.status
          }">${dept.status.toUpperCase()}</span>
          ${
            dept.hasNewResponse
              ? '<span class="status-badge" style="background: var(--warning-color); color: white;">NEW RESPONSE</span>'
              : ""
          }
          ${
            dept.reason
              ? `<div class="rejection-reason"><strong>Reason:</strong> ${dept.reason}</div>`
              : ""
          }
          ${
            dept.approvedBy
              ? `<p><small><strong>Processed by:</strong> ${
                  dept.approvedBy
                } on ${new Date(
                  dept.approvedAt
                ).toLocaleDateString()}</small></p>`
              : ""
          }
          
          ${
            canManage
              ? `
            <div class="action-buttons">
              <button class="btn btn-success ${approveClass}" ${approveDisabled} onclick="updateClearanceStatus('${
                  clearance._id
                }', '${deptKey}', 'approved')">
                <i class="fas fa-check"></i> ${
                  dept.status === "approved" ? "Approved" : "Approve"
                }
              </button>
              <button class="btn btn-danger ${rejectClass}" ${rejectDisabled} onclick="showRejectionForm('${
                  clearance._id
                }', '${deptKey}')">
                <i class="fas fa-times"></i> ${
                  dept.status === "rejected" ? "Rejected" : "Reject"
                }
              </button>
              <button class="btn btn-secondary" onclick="viewUploadedFiles('${
                clearance.studentId._id
              }', '${deptKey}')">
                <i class="fas fa-files"></i> View Files
              </button>
            </div>
            <div class="rejection-form" id="rejection-form-${
              clearance._id
            }-${deptKey}">
              <div class="form-group">
                <label><i class="fas fa-comment"></i> Reason for rejection:</label>
                <textarea id="rejection-reason-${
                  clearance._id
                }-${deptKey}" rows="3" placeholder="Provide a clear reason for rejection..."></textarea>
              </div>
              <div class="action-buttons">
                <button class="btn btn-danger" onclick="rejectClearance('${
                  clearance._id
                }', '${deptKey}')">
                  <i class="fas fa-times"></i> Confirm Rejection
                </button>
                <button class="btn btn-secondary" onclick="hideRejectionForm('${
                  clearance._id
                }', '${deptKey}')">
                  <i class="fas fa-times"></i> Cancel
                </button>
              </div>
            </div>
          `
              : ""
          }
        </div>
      `;
    });

    card.innerHTML = `
      <div class="request-header">
        <div class="student-info">
          <h4><i class="fas fa-user-graduate"></i> ${
            clearance.studentId.firstName
          } ${clearance.studentId.lastName}</h4>
          <p><i class="fas fa-id-card"></i> ${
            clearance.studentId.registrationNumber
          } | <i class="fas fa-envelope"></i> ${clearance.studentId.email}</p>
        </div>
        <div class="request-date">
          <small><i class="fas fa-calendar"></i> Requested: ${new Date(
            clearance.createdAt
          ).toLocaleDateString()}</small>
        </div>
      </div>
      ${departmentContent}
    `;

    container.appendChild(card);
  });
}

// Display pagination
function displayPagination(pagination) {
  const container = document.getElementById("pagination-container");

  if (pagination.totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let paginationHTML = `
    <button class="pagination-btn" ${
      pagination.currentPage === 1 ? "disabled" : ""
    } onclick="loadClearanceRequests(${
    pagination.currentPage - 1
  }, '${currentStatus}', '${currentSearch}')">
      <i class="fas fa-chevron-left"></i> Previous
    </button>
  `;

  // Show page numbers
  const startPage = Math.max(1, pagination.currentPage - 2);
  const endPage = Math.min(pagination.totalPages, pagination.currentPage + 2);

  if (startPage > 1) {
    paginationHTML += `<button class="pagination-btn" onclick="loadClearanceRequests(1, '${currentStatus}', '${currentSearch}')">1</button>`;
    if (startPage > 2) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="pagination-btn ${
        i === pagination.currentPage ? "active" : ""
      }" onclick="loadClearanceRequests(${i}, '${currentStatus}', '${currentSearch}')">
        ${i}
      </button>
    `;
  }

  if (endPage < pagination.totalPages) {
    if (endPage < pagination.totalPages - 1) {
      paginationHTML += `<span class="pagination-ellipsis">...</span>`;
    }
    paginationHTML += `<button class="pagination-btn" onclick="loadClearanceRequests(${pagination.totalPages}, '${currentStatus}', '${currentSearch}')">${pagination.totalPages}</button>`;
  }

  paginationHTML += `
    <button class="pagination-btn" ${
      pagination.currentPage === pagination.totalPages ? "disabled" : ""
    } onclick="loadClearanceRequests(${
    pagination.currentPage + 1
  }, '${currentStatus}', '${currentSearch}')">
      Next <i class="fas fa-chevron-right"></i>
    </button>
  `;

  paginationHTML += `
    <div class="pagination-info">
      Showing ${
        (pagination.currentPage - 1) * pagination.itemsPerPage + 1
      } - ${Math.min(
    pagination.currentPage * pagination.itemsPerPage,
    pagination.totalItems
  )} of ${pagination.totalItems} requests
    </div>
  `;

  container.innerHTML = paginationHTML;
}

// Search and filter handlers
function handleSearch() {
  const searchInput = document.getElementById("search-input");
  const searchValue = searchInput.value.trim();

  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Debounce search
  searchTimeout = setTimeout(() => {
    loadClearanceRequests(1, currentStatus, searchValue);
  }, 500);
}

function handleStatusFilter() {
  const statusFilter = document.getElementById("status-filter");
  const statusValue = statusFilter.value;
  loadClearanceRequests(1, statusValue, currentSearch);
}

// Enhanced clearance requests tab
function showClearanceRequests() {
  document
    .querySelectorAll(".admin-tabs .tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".admin-content")
    .forEach((content) => (content.style.display = "none"));

  event.target.classList.add("active");
  document.getElementById("clearance-requests").style.display = "block";

  loadClearanceRequests(1, "all", "");
}

async function showClearedStudents() {
  document
    .querySelectorAll(".admin-tabs .tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".admin-content")
    .forEach((content) => (content.style.display = "none"));

  event.target.classList.add("active");
  document.getElementById("cleared-students").style.display = "block";

  await loadClearedStudents();
}

async function loadClearedStudents() {
  showLoading();

  try {
    const response = await fetch(`${API_BASE}/api/admin/cleared-students`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      displayClearedStudents(data);
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    showAlert("Error loading cleared students", "error");
  } finally {
    hideLoading();
  }
}

function displayClearedStudents(students) {
  const container = document.getElementById("cleared-container");

  if (students.length === 0) {
    container.innerHTML =
      "<p>No students have completed their clearance yet.</p>";
    return;
  }

  // Only show Export List button for Dean and HOD departments
  const showExportButton =
    currentAdmin.role === "hod" || currentAdmin.role === "dean";

  container.innerHTML = `
        <div class="cleared-stats">
            <h4>Total Cleared Students: ${students.length}</h4>
            ${
              showExportButton
                ? '<button class="btn btn-primary" onclick="exportClearedStudents()">Export List</button>'
                : ""
            }
        </div>
        <div class="cleared-list">
            ${students
              .map(
                (student) => `
                <div class="request-card">
                    <div class="request-header">
                        <div class="student-info">
                            <h4>${student.studentId.firstName} ${
                  student.studentId.lastName
                }</h4>
                            <p>${student.studentId.registrationNumber} | ${
                  student.studentId.email
                }</p>
                        </div>
                        <div class="completion-date">
                            <span class="status-badge status-approved">CLEARED</span>
                            <small>Completed: ${new Date(
                              student.updatedAt
                            ).toLocaleDateString()}</small>
                        </div>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;
}

function exportClearedStudents() {
  // Simple CSV export functionality
  fetch(`${API_BASE}/api/admin/cleared-students`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((response) => response.json())
    .then((students) => {
      const csvContent = [
        [
          "Registration Number",
          "First Name",
          "Last Name",
          "Email",
          "Completion Date",
        ],
        ...students.map((student) => [
          student.studentId.registrationNumber,
          student.studentId.firstName,
          student.studentId.lastName,
          student.studentId.email,
          new Date(student.updatedAt).toLocaleDateString(),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cleared_students_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
}

// Utility functions
function getDepartmentName(key) {
  const departments = {
    library: "Library",
    hod: "Head of Department",
    clubs: "Club/Sports/Games",
    laboratory: "Laboratory Department",
    computerLab: "Computer Laboratory",
    cafeteria: "Cafeteria/CCAS Hostels",
    deanOfStudents: "Dean of Students",
    examination: "Examination",
    finance: "Finance",
  };
  return departments[key] || key;
}

async function updateClearanceStatus(clearanceId, department, status) {
  showLoading();

  try {
    const response = await fetch(
      `${API_BASE}/api/admin/clearance/${clearanceId}/${department}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      showAlert(`Request ${status} successfully!`, "success");

      // If student is approved by this department, remove them from this department's dashboard
      if (status === "approved") {
        const studentCard = document.getElementById(
          `request-card-${clearanceId}`
        );
        if (studentCard) {
          studentCard.style.transition = "opacity 0.3s ease";
          studentCard.style.opacity = "0";
          setTimeout(() => {
            studentCard.remove();
          }, 300);
        }
      } else {
        // For rejections, update the UI in real-time
        const departmentSection = document
          .querySelector(`[id*="rejection-form-${clearanceId}-${department}"]`)
          ?.closest(".department-section");
        if (departmentSection) {
          // Update status badge
          const statusBadge = departmentSection.querySelector(".status-badge");
          if (statusBadge) {
            statusBadge.className = `status-badge status-${status}`;
            statusBadge.textContent = status.toUpperCase();
          }

          // Remove any "NEW RESPONSE" badges since admin has now processed it
          const newResponseBadge = departmentSection.querySelector(
            '[style*="background: var(--warning-color)"]'
          );
          if (newResponseBadge) {
            newResponseBadge.remove();
          }

          // Add processed by information
          const existingProcessedInfo =
            departmentSection.querySelector("p small");
          if (existingProcessedInfo) {
            existingProcessedInfo.remove();
          }

          const processedInfo = document.createElement("p");
          processedInfo.innerHTML = `<small><strong>Processed by:</strong> ${
            currentAdmin.username
          } on ${new Date().toLocaleDateString()}</small>`;

          // Insert after status badge
          const statusBadgeParent = statusBadge.parentNode;
          statusBadgeParent.insertBefore(
            processedInfo,
            statusBadge.nextSibling
          );
        }

        // Hide action buttons for this specific request and department
        const approveBtn = document.querySelector(
          `button[onclick*="updateClearanceStatus('${clearanceId}', '${department}', 'approved')"]`
        );
        const rejectBtn = document.querySelector(
          `button[onclick*="showRejectionForm('${clearanceId}', '${department}')"]`
        );

        if (approveBtn && rejectBtn) {
          approveBtn.disabled = true;
          rejectBtn.disabled = true;

          if (status === "rejected") {
            rejectBtn.className = "btn btn-danger completed";
            rejectBtn.innerHTML = '<i class="fas fa-times"></i> Rejected';
          }
        }
      }

      // Refresh the admin stats
      await loadAdminStats();
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    showAlert("Error updating clearance status", "error");
  } finally {
    hideLoading();
  }
}

function showRejectionForm(clearanceId, department) {
  const form = document.getElementById(
    `rejection-form-${clearanceId}-${department}`
  );
  if (form) {
    form.classList.add("active");
  }
}

function hideRejectionForm(clearanceId, department) {
  const form = document.getElementById(
    `rejection-form-${clearanceId}-${department}`
  );
  if (form) {
    form.classList.remove("active");
  }
}

async function rejectClearance(clearanceId, department) {
  const reasonTextarea = document.getElementById(
    `rejection-reason-${clearanceId}-${department}`
  );
  const reason = reasonTextarea.value.trim();

  if (!reason) {
    showAlert("Please provide a reason for rejection", "error");
    return;
  }

  showLoading();

  try {
    const response = await fetch(
      `${API_BASE}/api/admin/clearance/${clearanceId}/${department}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: "rejected", reason }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      showAlert("Request rejected successfully!", "success");

      // Hide the rejection form
      hideRejectionForm(clearanceId, department);

      // Real-time status update - find and update the specific department section
      const departmentSection = document
        .querySelector(`#rejection-form-${clearanceId}-${department}`)
        ?.closest(".department-section");
      if (departmentSection) {
        // Update status badge
        const statusBadge = departmentSection.querySelector(".status-badge");
        if (statusBadge) {
          statusBadge.className = "status-badge status-rejected";
          statusBadge.textContent = "REJECTED";
        }

        // Remove any "NEW RESPONSE" badges since admin has now processed it
        const newResponseBadge = departmentSection.querySelector(
          '[style*="background: var(--warning-color)"]'
        );
        if (newResponseBadge) {
          newResponseBadge.remove();
        }

        // Add rejection reason
        const existingReason =
          departmentSection.querySelector(".rejection-reason");
        if (existingReason) {
          existingReason.remove();
        }

        const rejectionReasonDiv = document.createElement("div");
        rejectionReasonDiv.className = "rejection-reason";
        rejectionReasonDiv.innerHTML = `<strong>Reason:</strong> ${reason}`;

        // Insert after status badges
        const statusBadges =
          departmentSection.querySelectorAll(".status-badge");
        const lastBadge = statusBadges[statusBadges.length - 1];
        lastBadge.parentNode.insertBefore(
          rejectionReasonDiv,
          lastBadge.nextSibling
        );

        // Add processed by information
        const existingProcessedInfo =
          departmentSection.querySelector("p small");
        if (existingProcessedInfo) {
          existingProcessedInfo.remove();
        }

        const processedInfo = document.createElement("p");
        processedInfo.innerHTML = `<small><strong>Processed by:</strong> ${
          currentAdmin.username
        } on ${new Date().toLocaleDateString()}</small>`;
        rejectionReasonDiv.parentNode.insertBefore(
          processedInfo,
          rejectionReasonDiv.nextSibling
        );
      }

      // Update button states
      const approveBtn = document.querySelector(
        `button[onclick*="updateClearanceStatus('${clearanceId}', '${department}', 'approved')"]`
      );
      const rejectBtn = document.querySelector(
        `button[onclick*="showRejectionForm('${clearanceId}', '${department}')"]`
      );

      if (approveBtn && rejectBtn) {
        approveBtn.disabled = true;
        rejectBtn.disabled = true;
        rejectBtn.className = "btn btn-danger completed";
        rejectBtn.innerHTML = '<i class="fas fa-times"></i> Rejected';
      }

      // Refresh the admin stats
      await loadAdminStats();
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    showAlert("Error rejecting clearance", "error");
  } finally {
    hideLoading();
  }
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  // Show homepage by default
  showHomepage();

  // Check for existing session
  const savedToken = localStorage.getItem("authToken");
  const savedUser = localStorage.getItem("currentUser");
  const savedAdmin = localStorage.getItem("currentAdmin");

  if (savedToken) {
    authToken = savedToken;

    if (savedUser) {
      currentUser = JSON.parse(savedUser);
      showStudentDashboard();
    } else if (savedAdmin) {
      currentAdmin = JSON.parse(savedAdmin);
      showAdminDashboard();
    }
  }

  // Close modals when clicking outside
  window.onclick = (event) => {
    const uploadModal = document.getElementById("upload-modal");
    const fileModal = document.getElementById("file-modal");

    if (event.target === uploadModal) {
      closeUploadModal();
    }
    if (event.target === fileModal) {
      closeFileModal();
    }
  };

  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {
    const navLinks = document.querySelector(".nav-links");
    const mobileToggle = document.querySelector(".mobile-menu-toggle");

    if (
      !navLinks.contains(event.target) &&
      !mobileToggle.contains(event.target)
    ) {
      navLinks.classList.remove("active");
    }
  });
});

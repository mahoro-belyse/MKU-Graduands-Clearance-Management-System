# 🎓 MKU Graduands Clearance Management System  

A web-based clearance system for **Mount Kigali University (MKU)**, built with **HTML, CSS, Express.js, MongoDB, and Nodemailer**.  
This system helps **graduating students** easily request and track their clearance process across university departments.  

---

## 🚀 Features  

### 👩‍🎓 Student Side  
- **Registration & Automatic Request**: Once a student registers, a clearance request is automatically created.  
- **Clearance Tracking**: Students can view their clearance progress across different departments.  
- **File Upload**: Students can upload required documents when requested by departments.  
- **Full Clearance Notification**: When fully cleared, students are:  
  - Added to the **“List of Cleared Students”**.  
  - Sent an **email notification** confirming their clearance.  

### 🏢 Department Side  
- **Clear / Reject Requests**: Each department can approve or reject student clearance requests.  
- **Rejection with Reason**: If rejected, the department must provide a reason.  
- **File Viewing**: Departments can view uploaded documents submitted by students.  

### 🎓 Dean & HOD Special Privileges  
- **Export Cleared Students List**: Only the **Dean** and **HOD** can export the list of cleared students.  

---

## 🛠️ Tech Stack  

- **Frontend**: HTML5, CSS3  
- **Backend**: Node.js with Express.js  
- **Database**: MongoDB  
- **Email Notifications**: Nodemailer  
- **Version Control**: Git & GitHub  

---

## ⚙️ Installation & Setup  

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/mku-clearance-system.git
   cd mku-clearance-system
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the root folder and add:  
   ```env
   PORT=5000
   MONGO_URI=your-mongodb-uri
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password-or-app-password
   ```

4. **Run the server**  
   ```bash
   node server.js
   ```
   Or use nodemon for development:  
   ```bash
   nodemon server.js
   ```

5. **Access the app**  
   Open your browser and go to:  
   ```
   http://localhost:5000
   ```

---

## 📌 Usage  

- Students register → automatic clearance request created.  
- Students upload required documents if needed.  
- Departments approve/reject requests and provide reasons if rejected.  
- Dean/HOD can **export cleared students list**.  
- Fully cleared students receive **email confirmation** and appear in the **Cleared Students List**.  

---

## 📧 Email Notifications  

- Sent via **Nodemailer** when:  
  - Student gets **fully cleared**.  
  - Notifications use your `.env` email credentials.  

---
## ✅ Future Improvements  

- Add role-based dashboards (Admin, Dean, HOD, Department).  
- Add student ID card verification before clearance request.  
- Add export in **Excel/PDF formats**.  
- Add real-time notifications with WebSockets.  

---

## 👨‍💻 Author  

Developed by **[Uwase Mahoro Belyse]** ✨  

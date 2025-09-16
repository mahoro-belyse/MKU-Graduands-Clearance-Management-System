const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/mku_clearance", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema (Students)
const userSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^[A-Z]+\/\d{4}\/\d+$/,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Department Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  role: { type: String, enum: ["admin", "hod", "dean"], default: "admin" },
});

// Clearance Request Schema
const clearanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  registrationNumber: { type: String, required: true },
  departments: {
    library: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      reason: String,
      approvedBy: String,
      approvedAt: Date,
      hasNewResponse: { type: Boolean, default: false },
    },
    hod: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      reason: String,
      approvedBy: String,
      approvedAt: Date,
      hasNewResponse: { type: Boolean, default: false },
    },
    clubs: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      reason: String,
      approvedBy: String,
      approvedAt: Date,
      hasNewResponse: { type: Boolean, default: false },
    },
    laboratory: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      reason: String,
      approvedBy: String,
      approvedAt: Date,
      hasNewResponse: { type: Boolean, default: false },
    },
    computerLab: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      reason: String,
      approvedBy: String,
      approvedAt: Date,
      hasNewResponse: { type: Boolean, default: false },
    },
    cafeteria: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      reason: String,
      approvedBy: String,
      approvedAt: Date,
      hasNewResponse: { type: Boolean, default: false },
    },
    deanOfStudents: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      reason: String,
      approvedBy: String,
      approvedAt: Date,
      hasNewResponse: { type: Boolean, default: false },
    },
    examination: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      reason: String,
      approvedBy: String,
      approvedAt: Date,
      hasNewResponse: { type: Boolean, default: false },
    },
    finance: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      reason: String,
      approvedBy: String,
      approvedAt: Date,
      hasNewResponse: { type: Boolean, default: false },
    },
  },
  overallStatus: {
    type: String,
    enum: ["in-progress", "completed"],
    default: "in-progress",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// File Upload Schema
const fileUploadSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  department: { type: String, required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  comment: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Clearance = mongoose.model("Clearance", clearanceSchema);
const FileUpload = mongoose.model("FileUpload", fileUploadSchema);

// JWT Secret
const JWT_SECRET = "mku_clearance_secret_key_2024";

// Email configuration
const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "true" || false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify email configuration on startup
emailTransporter.verify((error, success) => {
  if (error) {
    console.log("Email configuration error:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Email templates and functions
async function sendClearanceCompletionEmail(student) {
  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Clearance Completed - MKU</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #1e3a8a); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-badge { background: #10b981; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 20px 0; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1e40af; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            .btn { background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Congratulations!</h1>
                <h2>Your Clearance is Complete</h2>
            </div>
            <div class="content">
                <div class="success-badge">
                    ✅ CLEARANCE APPROVED
                </div>
                
                <p>Dear <strong>${student.firstName} ${
    student.lastName
  }</strong>,</p>
                
                <p>We are pleased to inform you that your graduation clearance has been <strong>successfully completed</strong> for all departments at Mount Kigali University.</p>
                
                <div class="info-box">
                    <h3>Student Information:</h3>
                    <p><strong>Name:</strong> ${student.firstName} ${
    student.lastName
  }</p>
                    <p><strong>Registration Number:</strong> ${
                      student.registrationNumber
                    }</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                
                <h3>All Departments Approved:</h3>
                <ul>
                    <li>📚 Library</li>
                    <li>👨‍💼 Head of Department</li>
                    <li>🏆 Club/Sports/Games</li>
                    <li>🔬 Laboratory Department</li>
                    <li>💻 Computer Laboratory</li>
                    <li>🍽️ Cafeteria/CCAS Hostels</li>
                    <li>🎓 Dean of Students</li>
                    <li>📝 Examination</li>
                    <li>💰 Finance</li>
                </ul>
                
                <p><strong>What's Next?</strong></p>
                <p>You are now eligible for graduation! Please contact the academic office for further instructions regarding your graduation ceremony and certificate collection.</p>
                
                <div class="footer">
                    <p>This is an automated message from the MKU Graduands Clearance Management System.</p>
                    <p>Mount Kigali University - Excellence in Education, Innovation in Learning</p>
                    <p>If you have any questions, please contact the academic office.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "MKU Clearance System <noreply@mku.ac.rw>",
    to: student.email,
    subject: "🎉 Congratulations! Your MKU Clearance is Complete",
    html: emailTemplate,
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log(
      "Clearance completion email sent successfully:",
      info.messageId
    );
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending clearance completion email:", error);
    return { success: false, error: error.message };
  }
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"));
    }
  },
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

// Student Registration with Auto-Login
app.post("/api/register", async (req, res) => {
  try {
    const { registrationNumber, firstName, lastName, email, password } =
      req.body;

    // Validate registration number format
    const regNumberPattern = /^[A-Z]+\/\d{4}\/\d+$/;
    if (!regNumberPattern.test(registrationNumber)) {
      return res.status(400).json({
        message:
          "Invalid registration number format. Use: CourseCode/Year/ClassNumber (e.g., BBICT/2023/55842)",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { registrationNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or registration number",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      registrationNumber,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Create initial clearance record
    const clearance = new Clearance({
      studentId: user._id,
      registrationNumber: user.registrationNumber,
    });

    await clearance.save();

    // Auto-login: Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        registrationNumber: user.registrationNumber,
        type: "student",
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "Registration successful! You are now logged in.",
      token,
      user: {
        id: user._id,
        registrationNumber: user.registrationNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Student Login
app.post("/api/login", async (req, res) => {
  try {
    const { registrationNumber, password } = req.body;

    // Find user
    const user = await User.findOne({ registrationNumber });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        registrationNumber: user.registrationNumber,
        type: "student",
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        registrationNumber: user.registrationNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin Login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        adminId: admin._id,
        username: admin.username,
        department: admin.department,
        role: admin.role,
        type: "admin",
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        department: admin.department,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get student clearance status
app.get("/api/clearance/status", verifyToken, async (req, res) => {
  try {
    if (req.user.type !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const clearance = await Clearance.findOne({
      studentId: req.user.userId,
    }).populate("studentId", "firstName lastName registrationNumber");

    if (!clearance) {
      return res.status(404).json({ message: "Clearance record not found" });
    }

    res.json(clearance);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get cleared students list (for students to view)
app.get("/api/cleared-students", verifyToken, async (req, res) => {
  try {
    if (req.user.type !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const clearedStudents = await Clearance.find({ overallStatus: "completed" })
      .populate("studentId", "firstName lastName registrationNumber")
      .sort({ updatedAt: -1 })
      .limit(100); // Limit to recent 100 cleared students

    res.json(clearedStudents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get clearance requests for department admin (Enhanced with filtering)
app.get("/api/admin/clearance-requests", verifyToken, async (req, res) => {
  try {
    if (req.user.type !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { page = 1, limit = 20, status = "all", search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    let matchConditions = {};

    // Role-based filtering
    if (req.user.role === "hod" || req.user.role === "dean") {
      // HOD and Dean can see all requests, but exclude approved students from each department
      if (status === "all") {
        // Show only students who are not approved in ANY department
        const statusConditions = Object.keys({
          library: 1,
          hod: 1,
          clubs: 1,
          laboratory: 1,
          computerLab: 1,
          cafeteria: 1,
          deanOfStudents: 1,
          examination: 1,
          finance: 1,
        }).map((dept) => ({
          [`departments.${dept}.status`]: { $in: ["pending", "rejected"] },
        }));
        query.$or = statusConditions;
      } else if (status === "pending") {
        const statusConditions = Object.keys({
          library: 1,
          hod: 1,
          clubs: 1,
          laboratory: 1,
          computerLab: 1,
          cafeteria: 1,
          deanOfStudents: 1,
          examination: 1,
          finance: 1,
        }).map((dept) => ({
          [`departments.${dept}.status`]: "pending",
        }));
        query.$or = statusConditions;
      } else if (status === "rejected") {
        const statusConditions = Object.keys({
          library: 1,
          hod: 1,
          clubs: 1,
          laboratory: 1,
          computerLab: 1,
          cafeteria: 1,
          deanOfStudents: 1,
          examination: 1,
          finance: 1,
        }).map((dept) => ({
          [`departments.${dept}.status`]: "rejected",
        }));
        query.$or = statusConditions;
      }
    } else {
      // Regular admins can only see requests for their department where status is NOT approved
      const departmentField = `departments.${req.user.department}.status`;
      if (status === "all") {
        query[departmentField] = { $in: ["pending", "rejected"] };
      } else {
        query[departmentField] = status;
      }
    }

    // Search functionality
    if (search) {
      matchConditions = {
        $or: [
          { "studentId.firstName": { $regex: search, $options: "i" } },
          { "studentId.lastName": { $regex: search, $options: "i" } },
          { "studentId.registrationNumber": { $regex: search, $options: "i" } },
          { "studentId.email": { $regex: search, $options: "i" } },
        ],
      };
    }

    const aggregationPipeline = [
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "studentId",
        },
      },
      { $unwind: "$studentId" },
    ];

    if (Object.keys(matchConditions).length > 0) {
      aggregationPipeline.push({ $match: matchConditions });
    }

    aggregationPipeline.push(
      { $sort: { updatedAt: -1 } },
      { $skip: Number.parseInt(skip) },
      { $limit: Number.parseInt(limit) }
    );

    const clearances = await Clearance.aggregate(aggregationPipeline);

    // Get total count for pagination
    const totalPipeline = [...aggregationPipeline.slice(0, -2)];
    const totalResult = await Clearance.aggregate([
      ...totalPipeline,
      { $count: "total" },
    ]);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    res.json({
      clearances,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: Number.parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update clearance status (approve/reject)
app.put(
  "/api/admin/clearance/:id/:department",
  verifyToken,
  async (req, res) => {
    try {
      if (req.user.type !== "admin") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { id, department } = req.params;
      const { status, reason } = req.body;

      // Verify admin has permission for this department
      if (
        req.user.role !== "hod" &&
        req.user.role !== "dean" &&
        req.user.department !== department
      ) {
        return res
          .status(403)
          .json({ message: "Access denied for this department" });
      }

      const updateData = {
        [`departments.${department}.status`]: status,
        [`departments.${department}.approvedBy`]: req.user.username,
        [`departments.${department}.approvedAt`]: new Date(),
        [`departments.${department}.hasNewResponse`]: false, // Clear notification flag only for this specific department
        updatedAt: new Date(),
      };

      if (status === "rejected" && reason) {
        updateData[`departments.${department}.reason`] = reason;
      }

      const clearance = await Clearance.findByIdAndUpdate(id, updateData, {
        new: true,
      }).populate("studentId", "firstName lastName registrationNumber");

      // Check if all departments are approved
      const allApproved = Object.values(clearance.departments).every(
        (dept) => dept.status === "approved"
      );
      if (allApproved) {
        clearance.overallStatus = "completed";
        await clearance.save();

        // Send completion email to student
        try {
          const student = await User.findById(clearance.studentId);
          if (student) {
            const emailResult = await sendClearanceCompletionEmail(student);
            if (emailResult.success) {
              console.log(
                `Clearance completion email sent to ${student.email}`
              );
            } else {
              console.error(
                `Failed to send email to ${student.email}:`,
                emailResult.error
              );
            }
          }
        } catch (emailError) {
          console.error("Error in email sending process:", emailError);
          // Don't fail the approval process if email fails
        }
      }

      res.json(clearance);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// File upload endpoint (Enhanced with notification)
app.post(
  "/api/upload/:department",
  verifyToken,
  upload.single("document"),
  async (req, res) => {
    try {
      if (req.user.type !== "student") {
        return res.status(403).json({ message: "Access denied" });
      }

      const { department } = req.params;
      const { comment } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (!comment) {
        return res.status(400).json({ message: "Comment is required" });
      }

      // Check if student was rejected by this department
      const clearance = await Clearance.findOne({ studentId: req.user.userId });
      if (
        !clearance ||
        clearance.departments[department].status !== "rejected"
      ) {
        return res
          .status(400)
          .json({ message: "Can only upload files after rejection" });
      }

      const fileUpload = new FileUpload({
        studentId: req.user.userId,
        department,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        comment,
      });

      await fileUpload.save();

      // Update clearance status back to pending for review and set notification flag ONLY for the specific department
      clearance.departments[department].status = "pending";
      clearance.departments[department].reason = "";
      clearance.departments[department].hasNewResponse = true; // Only notify this specific department
      clearance.updatedAt = new Date();
      await clearance.save();

      res.json({ message: "File uploaded successfully", file: fileUpload });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);
// Get files view endpoint
app.get("/api/files/view/:filename", (req, res) => {
  //if (req.user.type !== "admin") {
  // return res.status(403).json({ message: "Access denied" });
  // }
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "uploads", filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Set appropriate headers based on file type
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";

    if (ext === ".pdf") {
      contentType = "application/pdf";
    } else if ([".jpg", ".jpeg"].includes(ext)) {
      contentType = "image/jpeg";
    } else if (ext === ".png") {
      contentType = "image/png";
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename=${filename}`);
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Get uploaded files for a student and department
app.get("/api/files/:studentId/:department", verifyToken, async (req, res) => {
  try {
    if (req.user.type !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { studentId, department } = req.params;

    const files = await FileUpload.find({ studentId, department }).sort({
      uploadedAt: -1,
    });

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get final clearance list
app.get("/api/admin/cleared-students", verifyToken, async (req, res) => {
  try {
    if (req.user.type !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const clearedStudents = await Clearance.find({ overallStatus: "completed" })
      .populate("studentId", "firstName lastName registrationNumber email")
      .sort({ updatedAt: -1 });

    res.json(clearedStudents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get admin dashboard stats
app.get("/api/admin/stats", verifyToken, async (req, res) => {
  try {
    if (req.user.type !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    let stats = {};

    if (req.user.role === "hod" || req.user.role === "dean") {
      // Overall stats for HOD/Dean
      const totalStudents = await Clearance.countDocuments();
      const completedClearances = await Clearance.countDocuments({
        overallStatus: "completed",
      });
      const pendingClearances = await Clearance.countDocuments({
        overallStatus: "in-progress",
      });

      // Department-wise stats (excluding approved students from pending count)
      const departmentStats = {};
      const departments = [
        "library",
        "hod",
        "clubs",
        "laboratory",
        "computerLab",
        "cafeteria",
        "deanOfStudents",
        "examination",
        "finance",
      ];

      for (const dept of departments) {
        const approved = await Clearance.countDocuments({
          [`departments.${dept}.status`]: "approved",
        });
        const pending = await Clearance.countDocuments({
          [`departments.${dept}.status`]: "pending",
        });
        const rejected = await Clearance.countDocuments({
          [`departments.${dept}.status`]: "rejected",
        });
        const newResponses = await Clearance.countDocuments({
          [`departments.${dept}.hasNewResponse`]: true,
        });

        departmentStats[dept] = { approved, pending, rejected, newResponses };
      }

      stats = {
        totalStudents,
        completedClearances,
        pendingClearances,
        departmentStats,
      };
    } else {
      // Department-specific stats (excluding approved students from pending count)
      const dept = req.user.department;
      const approved = await Clearance.countDocuments({
        [`departments.${dept}.status`]: "approved",
      });
      const pending = await Clearance.countDocuments({
        [`departments.${dept}.status`]: "pending",
      });
      const rejected = await Clearance.countDocuments({
        [`departments.${dept}.status`]: "rejected",
      });
      const newResponses = await Clearance.countDocuments({
        [`departments.${dept}.hasNewResponse`]: true,
      });

      stats = {
        departmentName: dept,
        approved,
        pending,
        rejected,
        newResponses,
      };
    }

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Test email endpoint
app.post("/api/test-email", verifyToken, async (req, res) => {
  try {
    if (req.user.type !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email address is required" });
    }

    // Create a test student object
    const testStudent = {
      firstName: "Test",
      lastName: "Student",
      registrationNumber: "TEST/2024/001",
      email: email,
    };

    const result = await sendClearanceCompletionEmail(testStudent);

    if (result.success) {
      res.json({
        message: "Test email sent successfully",
        messageId: result.messageId,
        sentTo: email,
      });
    } else {
      res.status(500).json({
        message: "Failed to send test email",
        error: result.error,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Initialize default admin accounts
async function initializeAdmins() {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultAdmins = [
        {
          username: "library_admin",
          password: "library123",
          department: "library",
        },
        {
          username: "hod_admin",
          password: "hod123",
          department: "hod",
          role: "hod",
        },
        { username: "clubs_admin", password: "clubs123", department: "clubs" },
        { username: "lab_admin", password: "lab123", department: "laboratory" },
        {
          username: "computer_admin",
          password: "computer123",
          department: "computerLab",
        },
        {
          username: "cafeteria_admin",
          password: "cafeteria123",
          department: "cafeteria",
        },
        {
          username: "dean_admin",
          password: "dean123",
          department: "deanOfStudents",
          role: "dean",
        },
        {
          username: "exam_admin",
          password: "exam123",
          department: "examination",
        },
        {
          username: "finance_admin",
          password: "finance123",
          department: "finance",
        },
      ];

      for (const admin of defaultAdmins) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin.password, salt);

        const newAdmin = new Admin({
          username: admin.username,
          password: hashedPassword,
          department: admin.department,
          role: admin.role || "admin",
        });

        await newAdmin.save();
      }

      console.log("Default admin accounts created");
    }
  } catch (error) {
    console.error("Error initializing admins:", error);
  }
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeAdmins();
});

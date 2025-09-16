# Email Setup Instructions for MKU Clearance System

## 1. Install Dependencies
The system now includes `nodemailer` for sending emails. Run:
\`\`\`bash
npm install
\`\`\`

## 2. Environment Variables Setup
Create a `.env` file in your project root with the following configuration:

\`\`\`env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=MKU Clearance System <your-email@gmail.com>
\`\`\`

## 3. Gmail Setup (Recommended for Testing)

### Option A: Using Gmail with App Password (Recommended)
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account settings → Security → 2-Step Verification
3. Generate an "App Password" for this application
4. Use your Gmail address as `EMAIL_USER`
5. Use the generated app password as `EMAIL_PASS`

### Option B: Using Gmail with Less Secure Apps (Not Recommended)
1. Go to Google Account settings → Security
2. Turn on "Less secure app access"
3. Use your Gmail address and regular password

## 4. Other Email Providers

### Outlook/Hotmail
\`\`\`env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
\`\`\`

### Yahoo Mail
\`\`\`env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
\`\`\`

## 5. Testing Email Functionality

### Method 1: Using the Test Route
Send a POST request to `/api/test-email` with admin credentials:

\`\`\`bash
# First login as admin to get token
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "dean_admin", "password": "dean123"}'

# Then test email (replace YOUR_TOKEN and test@example.com)
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"email": "test@example.com"}'
\`\`\`

### Method 2: Complete a Student Clearance
1. Register a student with a real email address
2. Login as different department admins
3. Approve the student in all 9 departments
4. The email will be sent automatically when the last department approves

## 6. Email Features

### When Email is Sent
- Automatically triggered when a student gets approved by ALL departments
- Only sent once when `overallStatus` changes to "completed"

### Email Content
- Professional HTML template with MKU branding
- Student information (name, registration number, email)
- List of all approved departments
- Completion date
- Next steps information

### Error Handling
- Email failures don't affect the approval process
- Errors are logged to console for debugging
- System continues to work even if email service is down

## 7. Troubleshooting

### Common Issues
1. **"Invalid login"** - Check email credentials and app password
2. **"Connection timeout"** - Check EMAIL_HOST and EMAIL_PORT
3. **"Self signed certificate"** - Add `EMAIL_SECURE=false` for development

### Debug Mode
Check server console for email-related logs:
- "Email server is ready to send messages" - Configuration successful
- "Clearance completion email sent successfully" - Email sent
- "Error sending clearance completion email" - Email failed

## 8. Production Considerations

For production deployment:
- Use a dedicated email service (SendGrid, AWS SES, etc.)
- Set up proper DNS records (SPF, DKIM)
- Use environment variables for all sensitive data
- Consider email rate limiting
- Set up email delivery monitoring

## 9. Security Notes
- Never commit `.env` file to version control
- Use app passwords instead of regular passwords
- Consider using OAuth2 for Gmail in production
- Regularly rotate email credentials

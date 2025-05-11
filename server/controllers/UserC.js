const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require('sequelize');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { sequelize, User, RefreshToken } = require("../models");



const userC = async (req, res) => {
  const {
    userFirstName,
    userLastName,
    userEmail,
    userPhoneNumber,
    Group,
    Batch,
    Year,
    password,
  } = req.body;

  const errors = [];

  if (!userFirstName || !userLastName || !userEmail || !userPhoneNumber || !Group || !Batch || !Year || !password) {
    errors.push("All fields are required");
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  // const personalEmailDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];
  // const emailDomain = userEmail.split("@")[1];
  // if (!personalEmailDomains.includes(emailDomain)) {
  //   errors.push("Please use a personal email address (e.g., Gmail, Yahoo, Outlook, etc.)");
  // }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existingUser = await User.findOne({ where: { userEmail } });

    if (existingUser) {
      return res.status(400).json({ errors: "Email is already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const tokenPayload = {
      userFirstName,
      userLastName,
      userEmail,
      userPhoneNumber,
      Group,
      Batch,
      Year,
      hashPassword,
    };

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

    const encryptionKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-ctr", encryptionKey, iv);
    let encryptedJWT = cipher.update(accessToken, "utf8", "hex");
    encryptedJWT += cipher.final("hex");

    const base64EncodedJWT = encodeURIComponent(Buffer.from(encryptedJWT).toString("base64"));
    const base64EncodedKey = encodeURIComponent(Buffer.from(encryptionKey).toString("base64"));
    const base64EncodedIV = encodeURIComponent(Buffer.from(iv).toString("base64"));

    const verificationLink = `${process.env.FRONTEND_URL}/users/verify/${base64EncodedJWT}/${base64EncodedKey}/${base64EncodedIV}`;

    const mailSender = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await mailSender.sendMail({
      from: 'evangadiproject@gmail.com',
      to: userEmail,
      subject: "ACCOUNT VERIFICATION",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f6f6f6;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  border: 1px solid #cccccc;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  max-width: 100px;
              }
              .content {
                  text-align: center;
                  padding: 20px;
              }
              .cta-button {
                  display: inline-block;
                  padding: 15px 25px;
                  margin: 20px 0;
               background-color: #A34054;
              color: #ffffff !important;
                  font-weight: bold;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .footer {
                  text-align: center;
                  padding: 10px 0;
                  font-size: 12px;
                  color: #777777;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
              </div>
              <div class="content">
                  <h1>Account Verification</h1>
                  <p>Click the button below to verify your account.</p>
                  <a href="${verificationLink}" class="cta-button">Verify My Account</a>
          </div>
          <div class="footer">
              <p>Link will expire in <b>1 day</b><p>
              <br>
              <p>If you did not sign up for this account, please ignore this email.</p>
          </div>
      </div>
      </body>
      </html>
    `,
    });

    return res.status(200).json({
      message: "Registration successful! Please check your email to verify your account.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration." });
  }
};


const verifyEmail = async (req, res) => {
  const { encryptedJWT, encryptionKey, iv } = req.body;

  try {
    const decodedJWT = Buffer.from(decodeURIComponent(encryptedJWT), "base64").toString("utf-8");
    const decodedKey = Buffer.from(decodeURIComponent(encryptionKey), "base64");
    const decodedIV = Buffer.from(decodeURIComponent(iv), "base64");

    const decipher = crypto.createDecipheriv("aes-256-ctr", decodedKey, decodedIV);
    let decrypted = decipher.update(decodedJWT, "hex", "utf8");
    decrypted += decipher.final("utf8");

    jwt.verify(decrypted, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Invalid or expired verification link." });
      }

      const {
        userFirstName,
        userLastName,
        userEmail,
        userPhoneNumber,
        Group,
        Batch,
        Year,
        hashPassword,
      } = decoded;

      const newUser = await User.create({
        userFirstName,
        userLastName,
        userEmail,
        userPhoneNumber,
        Group,
        Batch,
        Year,
        password: hashPassword,
        role: '0', // default role
      });

      const authToken = jwt.sign(
        {
          userId: newUser.userId,
          userEmail: newUser.userEmail,
          role: newUser.role,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" }
      );

      res.setHeader("Authorization", `Bearer ${authToken}`);
      res.status(201).json({ message: "Account verified and user created successfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during email verification" });
  }
};


const loginC = async (req, res) => {
  const { userEmail, password } = req.body;

  if (!userEmail || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findOne({ where: { userEmail } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // JWT payload
    const payload = {
      userId: user.id, // or user.userId depending on your DB
      userEmail: user.userEmail,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d"
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d"
    });

    // Save refresh token
    await RefreshToken.create({
      refreshToken,
      userId: user.id
    });

    // Set token in response header
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({ message: "Login successful." });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};



const deleteUser = async (req, res) => {
  const { userId } = req.params; // userId, not userNameId
  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction: t });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting superAdmin (role = 3)
    if (user.role === "3") {
      return res.status(400).json({ message: "Super admin cannot be deleted." });
    }

    // Optional: Also delete associated data (e.g., Adverts, Jobs)
    // await Advert.destroy({ where: { userId }, transaction: t });
    // await Job.destroy({ where: { userId }, transaction: t });

    await user.destroy({ transaction: t });

    await t.commit();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      attributes: ["userId", "email"],
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "No user found with that email." });
    }

    const updateLink = `${process.env.FRONTEND_URL}/reset-password/${user.userId}`;

    await User.update(
      {
        passwordUpdateLink: updateLink,
        passwordUpdateLinkCreatedAt: new Date(),
      },
      {
        where: { userId: user.userId },
      }
    );

    const mailSender = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailContent = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Update Password</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f6f6f6;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  border: 1px solid #cccccc;
              }
              .header {
                  text-align: center;
                  padding: 10px 0;
              }
              .header img {
                  max-width: 100px;
              }
              .content {
                  text-align: center;
                  padding: 20px;
              }
              .cta-button {
                  display: inline-block;
                  padding: 15px 25px;
                  margin: 20px 0;
                  background-color: #A34054;
                  color: #ffffff !important;
                  font-weight: bold;
                  text-decoration: none;
                  border-radius: 5px;
              }
              .footer {
                  text-align: center;
                  padding: 10px 0;
                  font-size: 12px;
                  color: #777777;
              }
          </style>
      </head>
      <body>
          <div class="container">
               <div class="header">
        </div>
              <div class="content">
                  <h1>Update your password</h1>
                  <p>Click the button below to update your password.</p>
                  <a href="${updateLinkFromDB}" class="cta-button">Update Password</a>
          </div>
          <div class="footer">
              <p>Link will expire in <b>5min</b><p>
              <br>
              <p>If you did not sign up for this account, please ignore this email.</p>
          </div>
      </div>
      </body>
      </html>
    `,
    };

    mailSender.sendMail(emailContent, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res.status(500).json({ message: "Error sending email." });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({ message: "Password reset email sent." });
      }
    });

  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};


const updateUserPassword = async (req, res) => {
  const { user_new_password } = req.body;
  const { userNameId } = req.params;

  try {
    const userData = await User.findOne({
      attributes: ["userNameId", "passwordUpdateLinkCreatedAt"],
      where: { userNameId },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the link is still valid (within 5 minutes)
    const createdAt = new Date(userData.passwordUpdateLinkCreatedAt);
    const now = new Date();
    const diffMinutes = (now - createdAt) / (1000 * 60);

    if (diffMinutes > 5) {
      return res.status(400).json({ message: "Password reset link has expired." });
    }

    // Hash and update the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_new_password, salt);

    const [updated] = await User.update(
      {
        password: hashedPassword,
        passwordUpdateLink: null,
        passwordUpdateLinkCreatedAt: null,
      },
      { where: { userNameId } }
    );

    if (updated > 0) {
      return res.status(200).json({ message: "Password updated successfully." });
    } else {
      return res.status(500).json({ message: "Failed to update password." });
    }
  } catch (error) {
    console.error("Error updating password:", error.message);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};


const allUserFinder = async (req, res) => {
  try {
    // Fetch all users, excluding password field
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    // Filter out users with role "1" (e.g., super admin or admin)
    const filteredUsers = users.filter(user => user.role !== '1');

    if (filteredUsers.length === 0) {
      return res.status(200).json({ message: ["No users found."] });
    }

    return res.status(200).json(filteredUsers);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    return res.status(500).json({ errors: [err.message] });
  }
};


const singleUserFinder = async (req, res) => {
  const { userNameId } = req.params;

  if (!userNameId) {
    return res.status(400).json({ errors: ["User ID not provided."] });
  }

  try {
    const user = await User.findByPk(userNameId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ errors: ["User not found."] });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error fetching user:", err.message);
    return res.status(500).json({ errors: [err.message] });
  }
};


module.exports = {
  userC,
  verifyEmail,
  loginC,
  deleteUser,
  forgotPassword,
  updateUserPassword,
  allUserFinder,
  singleUserFinder,
};

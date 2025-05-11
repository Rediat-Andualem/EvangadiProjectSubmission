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

const newUser = await User.create({
        userFirstName,
        userLastName,
        userEmail,
        userPhoneNumber,
        Group,
        Batch,
        Year,
        password: hashPassword,
        role: '0', 
      });

      const authToken = jwt.sign(
        {
          userId: newUser.userId,
          userEmail: newUser.userEmail,
          role: newUser.role,
          userName:newUser.userFirstName
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "30d" }
      );

      res.setHeader("Authorization", `Bearer ${authToken}`);
      res.status(201).json({ message: "User profile created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration." });
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
      userId: user.userId, 
      userEmail: user.userEmail,
      role: user.role,
      userFirstName: user.userFirstName
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d"
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
  const { userId } = req.params; 
  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction: t });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting superAdmin (role = 3)
    if (user.role === "1") {
      return res.status(400).json({ message: "Super admin cannot be deleted." });
    }
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
      attributes: ["userId", "userEmail"],
      where: { userEmail : email },
    });

    if (!user) {
      return res.status(404).json({ message: "No user found with that email." });
    }

    const updateLink = `${process.env.FRONTEND_URL}/reset-password/${user.userId}`;

    // await User.update(
    //   {
    //     passwordUpdateLink: updateLink,
    //     passwordUpdateLinkCreatedAt: new Date(),
    //   },
    //   {
    //     where: { userId: user.userId },
    //   }
    // );

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
      to: user.userEmail,
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
                  <a href="${updateLink}" class="cta-button">Update Password</a>
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
  const { userId } = req.params;

  try {
    const userData = await User.findOne({
      attributes: ["userId"],
      where: { userId },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash and update the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_new_password, salt);

    const [updated] = await User.update(
      {
        password: hashedPassword,
      },
      { where: { userId } }
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
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ errors: ["User ID not provided."] });
  }

  try {
    const user = await User.findByPk(userId, {
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
  loginC,
  deleteUser,
  forgotPassword,
  updateUserPassword,
  allUserFinder,
  singleUserFinder,
};

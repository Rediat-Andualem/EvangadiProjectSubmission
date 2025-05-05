const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require('sequelize');

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { sequelize, User, RefreshToken } = require("../models");
const { SecurityQuestion } = require("../models");
const { axiosInstance } = require("../utility/axiosInstance.js");
// initialize cors
dotenv.config();
//* Create user controller

const userC = async (req, res) => {
  const { userName, email, password, sq1, sqa1 } = req.body;
  // Validation checks
  const errors = [];
  if (!userName || !email || !password || !sq1 || !sqa1) {
    errors.push("All fields are required");
  }
  if (password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  // Check if email belongs to a company domain
  const personalEmailDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
  ];
  const emailDomain = email.split("@")[1];
  if (!personalEmailDomains.includes(emailDomain)) {
    errors.push(
      "For your safety, we don't allow registering using company email addresses. Please use a personal email address."
    );
  }

  // If there are validation errors, respond with the errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Check if the userName or email is already taken
    const existingUser = await User.findOne({ where: { userName } });
    const existingGmail = await User.findOne({ where: { email } });
    if (existingUser || existingGmail) {
      return res
        .status(400)
        .json({ errors: "User name or email already in use" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const encryptionKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const hashPassword = await bcrypt.hash(password, salt);

    // Generate JWT
    const tokenPayload = { userName, email, hashPassword, sq1, sqa1 };
    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Encrypt the JWT
    const algorithm = "aes-256-ctr";
    const cipher = crypto.createCipheriv(algorithm, encryptionKey, iv);
    let encryptedJWT = cipher.update(accessToken, "utf8", "hex");
    encryptedJWT += cipher.final("hex");

    // Encode components for the verification link
    const base64EncodedJWT = encodeURIComponent(
      Buffer.from(encryptedJWT).toString("base64")
    );
    const base64EncodedKey = encodeURIComponent(
      Buffer.from(encryptionKey).toString("base64")
    );
    const base64EncodedIV = encodeURIComponent(
      Buffer.from(iv).toString("base64")
    );

    // Create verification link
    // const baseURL = axiosInstance.defaults.baseURL;
    // console.log(baseURL)
    const verificationLink = `${process.env.FRONTEND_URL}/users/verify/${base64EncodedJWT}/${base64EncodedKey}/${base64EncodedIV}`;

    // Configure email sender
    const mailSender = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const details = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "ACCOUNT VERIFICATION !",
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
    };

    // Send email asynchronously
    await mailSender.sendMail(details);

    return res.status(200).json({
      message:
        "Registration successful! Verification email sent! Please check your inbox/spam folder.",
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "An error occurred during registration." });
  }
};

//* verifyingEmail
const verifyEmail = async (req, res) => {
  const { encryptedJWT, encryptionKey, iv } = req.body;
  try {
    // Decode and decrypt values
    const decodedJWT = Buffer.from(
      decodeURIComponent(encryptedJWT),
      "base64"
    ).toString("utf-8");
    const decodedKey = Buffer.from(decodeURIComponent(encryptionKey), "base64");
    const decodedIV = Buffer.from(decodeURIComponent(iv), "base64");

    const decryptJWT = (encryptedJWT, encryptionKey, iv) => {
      const decipher = crypto.createDecipheriv(
        "aes-256-ctr",
        decodedKey,
        decodedIV
      );
      let decrypted = decipher.update(encryptedJWT, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    };

    // Decrypt the JWT
    const decryptedJWT = decryptJWT(decodedJWT, decodedKey, decodedIV);

    // Verify the JWT
    jwt.verify(
      decryptedJWT,
      process.env.JWT_SECRET_KEY,
      async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(400).json({
              message:
                "Verification time span expired. Please request a new verification link.",
            });
          }
          return res.status(400).json({ message: "Invalid verification." });
        }

        // Create the user
        const { userName, email, hashPassword, sq1, sqa1 } = decoded;

        const newUser = await User.create({
          userName,
          email,
          password: hashPassword,
          sq1,
          sqa1,
        });

        const accessToken = jwt.sign(
          {
            userNameId: newUser.userNameId,
            email: newUser.email,
            role: newUser.role,
            userName: newUser.userName,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "30d" }
        );

        res.setHeader("Authorization", `Bearer ${accessToken}`);
        res.status(201).json({ message: "User created successfully" });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// * login controller
const loginC = async (req, res) => {
  const { email, password } = req.body;

  // Validation checks
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Create a JWT token
    const token = jwt.sign(
      {
        userNameId: user.userNameId,
        email: user.email,
        role: user.role,
        userName: user.userName,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );
    //  refresh token
    // refreshToken
    const refreshToken = jwt.sign(
      {
        userNameId: user.userNameId,
        email: user.email,
        role: user.role,
        userName: user.userName,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    // send refresh token to database
    await RefreshToken.create({
      refreshToken: refreshToken,
      userNameId: user.userNameId,
    });
    // Set the token in the Authorization header and respond
    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//! Using JWT as the token format and the Bearer scheme for transmitting it gives you the best of both worlds. JWTs provide security, statelessness, and self-contained information, while the Bearer scheme standardizes how tokens are passed between the client and server, ensuring compatibility with web standards and tools.

let deleteUser = async (req, res) => {
  const { userNameId } = req.params;
  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(userNameId, { transaction: t });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has the role "1" (or admin role)
    if (user.role === "1") {
      return res.status(400).json({ message: "Admin cannot be deleted." });
    }

    // Delete user within a transaction
    await user.destroy({ transaction: t });

    await t.commit(); // Commit the transaction
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    await t.rollback(); // Rollback on error
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      attributes: ["userNameId", "email"],
      where: { email: email },
    });
    if (user) {
      const updateLink = `${process.env.FRONTEND_URL}/reset-password/${user.userNameId}`;
      await User.update(
        {
          passwordUpdateLink: updateLink,
          passwordUpdateLinkCreatedAt: new Date(),
        },
        {
          where: { userNameId: user.userNameId },
        }
      );
      const forLinkFromDB = await User.findOne({
        attributes: ["passwordUpdateLink"],
        where: { userNameId: user.userNameId },
      });
      if (forLinkFromDB) {
        let updateLinkFromDB = forLinkFromDB.passwordUpdateLink;
        const mailSender = nodemailer.createTransport({
          service: "gmail",
          port: 465,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const details = {
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

        mailSender.sendMail(details, (err, info) => {
          if (err) {
            console.log("Error sending email:", err);
            return res.status(500).json({ message: "Error sending email" });
          } else {
            console.log("Email sent:", info.response);
            return res
              .status(200)
              .json({ message: "Password reset email sent" });
          }
        });
      } else {
        return res
          .status(500)
          .json({ message: "update Time expired please try again later" });
      }
    } else {
      return res.status(404).json({ message: "Password reset email sent" });
    }
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({
      message:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};

let updateUserPassword = async (req, res) => {
  const { user_new_password, sq1, sqa1 } = req.body;

  const { userNameId } = req.params;
  try {
    const userData = await User.findOne({
      attributes: ["userNameId", "email", "sq1", "sqa1", "passwordUpdateLink"],
      where: {
        userNameId: userNameId,
      },
    });
    let userLinkFromFront = `${process.env.FRONTEND_URL}/reset-password/${userNameId}`;
    if (userLinkFromFront !== userData.passwordUpdateLink) {
      return res.status(500).json({ message: "link expired!" });
    } else {
      if (userData.sq1 !== sq1 || userData.sqa1 !== sqa1) {
        return res
          .status(400)
          .json({ message: "Wrong attempt for question" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user_new_password, salt);
        const updateResult = await User.update(
          { password: hashPassword },
          { where: { userNameId: userNameId } }
        );

        if (updateResult[0] > 0) {
          return res
            .status(200)
            .json({ message: "Password updated successfully" });
        } else {
          return res.status(500).json({
            message: "Failed to update password. Please try again later.",
          });
        }
      }
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message:
        "An error occurred while processing your request. Please try again later.",
    });
  }
};

const allUserFinder = async (req, res) => {
  try {
    // Fetch all users from the database, excluding sensitive fields like password
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    // Respond with an empty array if no users are found, but still return 200 OK
    if (users.length === 0) {
      return res.status(200).json({ message: ["No users found."] });
    }

    const filteredUsers = users.filter(user => user.role !== '1');

    // Respond with the list of users
    return res.status(200).json(filteredUsers );
  } catch (err) {
    if (err.name === "ValidationErrorItem") {
      const validationErrors = err.errors.map((e) => e.message);
      return res.status(400).json({ errors: [validationErrors.message] });
    }
    return res.status(500).json({ errors: [err.message] });
  }
};
const allUserNameFinder = async (req, res) => {
  try {
    // Fetch only the userName from the database, excluding sensitive fields like password
    const users = await User.findAll({
      attributes: ['userName'], 
      where: {
        role: { [Op.ne]: "1" } // role not equal to "1"
      }
    });
  
    // Respond with an empty array if no users are found, but still return 200 OK
    if (users.length === 0) {
      return res.status(200).json({ message: ["No users found."] });
    }


    // Respond with the list of filtered userNames
    return res.status(200).json(users);
  } catch (err) {
    if (err.name === "ValidationErrorItem") {
      const validationErrors = err.errors.map((e) => e.message);
      return res.status(400).json({ errors: [validationErrors.message] });
    }
    return res.status(500).json({ errors: [err.message] });
  }  
};

const singleUserFinder = async (req, res) => {
  const { userNameId } = req.params;

  // Validation check
  if (!userNameId) {
    return res.status(400).json({ errors: ["User ID not passed ."] });
  }

  try {
    // Find the user by ID
    const user = await User.findByPk(userNameId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ errors: ["User not found."] });
    }

    // Exclude sensitive data from the response
    const { password, ...safeUserData } = user.toJSON();

    // Respond with the user data (excluding sensitive information)
    return res.status(200).json({ user: safeUserData });
  } catch (err) {
    if (err.name === "ValidationErrorItem") {
      const validationErrors = err.errors.map((e) => e.message);
      return res.status(400).json({ errors: [validationErrors.message] });
    }
    return res.status(500).json({ errors: [err.message] });
  }
};

const getSecurityQuestions = async (req, res) => {
  try {
    // Fetch all users from the database, excluding sensitive fields like password
    const allQuestions = await SecurityQuestion.findAll();

    // Respond with an empty array if no users are found, but still return 200 OK
    if (allQuestions.length === 0) {
      return res.status(200).json({ message: ["No questions found."] });
    }

    // Respond with the list of users
    return res.status(200).json({ allQuestions });
  } catch (err) {
    if (err.name === "ValidationErrorItem") {
      const validationErrors = err.errors.map((e) => e.message);
      return res.status(400).json({ errors: [validationErrors.message] });
    }
    return res.status(500).json({ errors: [err.message] });
  }
};

const createSecurityQuestion = async (req, res) => {
  try {
    const { SecurityQuestionInput } = req.body;

    // Validate input
    if (!SecurityQuestionInput) {
      return res
        .status(400)
        .json({ errors: ["Security question is required."] });
    }

    // Create a new security question
    const newQuestion = await SecurityQuestion.create({
      SecurityQuestion: SecurityQuestionInput,
    });

    return res
      .status(201)
      .json({ message: "Security question added successfully.", newQuestion });
  } catch (err) {
    return res.status(500).json({ errors: [err.message] });
  }
};

const deleteSecurityQuestion = async (req, res) => {
  try {
    const { SecurityQuestionId } = req.params;

    // Check if the question exists
    const question = await SecurityQuestion.findByPk(SecurityQuestionId);
    if (!question) {
      return res.status(404).json({ errors: ["Security question not found."] });
    }

    // Delete the question
    await question.destroy();
    return res
      .status(200)
      .json({ message: "Security question deleted successfully." });
  } catch (err) {
    return res.status(500).json({ errors: [err.message] });
  }
};

module.exports = {
  userC,
  loginC,
  deleteUser,
  forgotPassword,
  updateUserPassword,
  verifyEmail,
  singleUserFinder,
  allUserFinder,
  getSecurityQuestions,
  createSecurityQuestion,
  deleteSecurityQuestion,
  allUserNameFinder,
};

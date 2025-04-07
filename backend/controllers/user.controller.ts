import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../model/UserModel';
import ErrorHandler from '../../shared/utils/ErrorHandler';
import { sendResponse } from '../utils/responseHelpers';
import { resetPasswordEmailTemplate, verificationEmailTemplate } from '../constants/emailTemplates';
import { sendEmail } from '../processors/sendEmail/sendVerifyAccountEmailProcessor';
import { sanitizeUser } from '../processors/user/removePasswordFromUserObjectProcessor';
import config from '../config/index'
import jwt from 'jsonwebtoken';
import { isStrongPassword } from '../processors/user/isStrongPasswordProcessor';

export const createAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    companyName,
    password,
    role,
    status,
    termsAccepted,
  } = req.body;


  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler('User already exists', 400));
  }

  if (!isStrongPassword(password)) {
    return next(
      new ErrorHandler(
        'Password must be at least 9 characters long and include uppercase, lowercase, number, and special character.',
        400
      )
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    phoneNumber,
    companyName,
    password: hashedPassword,
    role,
    status: status || 'Active',
    isEmailVerified: false,
    termsAccepted,
    termsAcceptedTime: new Date(),
    isDeleted: false,
    createdBy: 'self',
    credits: 0,
    stripeCustomerId: undefined,
  });

  const savedUser = await newUser.save();

  // In createAccount controller, after saving the user
const token = jwt.sign(
  { userId: savedUser._id },
  config.jwt_secret as string,
  { expiresIn: '1d' } 
);

// Send verification email with token
await sendEmail({
  to: savedUser.email,
  subject: 'Verify Your Account',
  html: verificationEmailTemplate(savedUser.firstName, token)
});

  const userResponse = sanitizeUser(savedUser);

  sendResponse(res, userResponse, 'User registered successfully', 201);
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler('Email and password are required', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler('Invalid credentials', 401));
  }

  if (user.isDeleted) {
    return next(new ErrorHandler('Account has been deleted', 403));
  }

  if (user.status !== 'Active') {
    return next(new ErrorHandler('Account is not active', 403));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new ErrorHandler('Invalid credentials', 401));
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    config.jwt_secret as string,
    { expiresIn: '7d' }
  );

  const userResponse = sanitizeUser(user);

  sendResponse(res, { user: userResponse, token }, 'Login successful');
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler('Email is required', 400));
  }
  
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  
  // Check if the account is deleted or inactive
  if (user.isDeleted) {
    return next(new ErrorHandler('This account has been deleted', 403));
  }
  
  if (user.status !== 'Active') {
    return next(new ErrorHandler('Account is not active', 403));
  }
  
  // Generate a reset token valid for 1 hour
  const token = jwt.sign({ userId: user._id }, config.jwt_secret as string, { expiresIn: '1h' });
  
  // Use the provided email template function and modify it for a reset-password email
  const emailHtml = resetPasswordEmailTemplate(user.firstName, token);
  
  // Send the reset email
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Instructions',
    html: emailHtml,
  });
  
  sendResponse(res, null, 'Password reset instructions sent to your email', 200);
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId, oldPassword, newPassword } = req.body;
  if (!userId || !oldPassword || !newPassword) {
    return next(new ErrorHandler('User id, old password, and new password are required', 400));
  }
  
  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  
  // Additional checks for account status and deletion
  if (user.isDeleted) {
    return next(new ErrorHandler('This account has been deleted', 403));
  }
  if (user.status !== 'Active') {
    return next(new ErrorHandler('Account is not active', 403));
  }
  
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return next(new ErrorHandler('Old password is incorrect', 401));
  }
  
  if (!isStrongPassword(newPassword)) {
    return next(
      new ErrorHandler(
        'Password must be at least 9 characters long and include uppercase, lowercase, number, and special character.',
        400
      )
    );
  }
  

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  
  sendResponse(res, null, 'Password changed successfully', 200);
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { token } = req.query;
  if (!token || typeof token !== 'string') {
    return next(new ErrorHandler('Verification token is required', 400));
  }
  
  let decoded: any;
  try {
    decoded = jwt.verify(token, config.jwt_secret as string);
  } catch (error) {
    return next(new ErrorHandler('Invalid or expired token', 400));
  }
  
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  
  user.isEmailVerified = true;
  await user.save();
  
  sendResponse(res, null, 'Email verified successfully', 200);
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return next(new ErrorHandler('Token and new password are required', 400));
  }
  
  let decoded: any;
  try {
    decoded = jwt.verify(token, config.jwt_secret as string);
  } catch (error) {
    return next(new ErrorHandler('Invalid or expired token', 400));
  }
  
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  if (!isStrongPassword(newPassword)) {
    return next(
      new ErrorHandler(
        'Password must be at least 9 characters long and include uppercase, lowercase, number, and special character.',
        400
      )
    );
  }
  
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  
  sendResponse(res, null, 'Password reset successful', 200);
};
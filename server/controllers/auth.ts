import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// Generate JWT token
const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret';
  return jwt.sign({ id }, secret, { expiresIn: '7d' });
};

// Send token response
const sendTokenResponse = (user: any, statusCode: number, res: Response): void => {
  const token = signToken(user._id.toString());
  
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      preferences: user.preferences,
    },
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password',
      });
      return;
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User already exists with this email',
      });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      verificationToken: crypto.randomBytes(20).toString('hex'),
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Please provide an email and password',
      });
      return;
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
      return;
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'There is no user with that email',
      });
      return;
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Reset token generated',
      resetToken, // In production, this should be sent via email
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        error: 'Invalid token',
      });
      return;
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id).select('+password');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      res.status(401).json({
        success: false,
        error: 'Password is incorrect',
      });
      return;
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
}; 
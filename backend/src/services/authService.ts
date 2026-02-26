import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { env } from '../config/env';
import { UserModel } from '../models/User';
import { Role } from '../types/common';
import { AppError } from '../utils/AppError';

const signToken = (userId: string, role: Role): string => {
  return jwt.sign({ userId, role }, env.JWT_SECRET as jwt.Secret, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const authService = {
  register: async (payload: { name: string; email: string; password: string }) => {
    const existing = await UserModel.findOne({ email: payload.email.toLowerCase() });
    if (existing) {
      throw new AppError('Email is already registered', 409);
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const user = await UserModel.create({
      name: payload.name,
      email: payload.email,
      passwordHash,
      role: 'user',
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  login: async (payload: { email: string; password: string }) => {
    const user = await UserModel.findOne({ email: payload.email.toLowerCase() });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const passwordMatched = await bcrypt.compare(payload.password, user.passwordHash);
    if (!passwordMatched) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken(user._id.toString(), user.role);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  me: async (userId: string) => {
    const user = await UserModel.findById(userId).select('-passwordHash');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },
};

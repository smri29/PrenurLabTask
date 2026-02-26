import bcrypt from 'bcryptjs';

import { env } from '../config/env';
import { connectDB } from '../db/connect';
import { UserModel } from '../models/User';

const seedAdmin = async (): Promise<void> => {
  await connectDB();

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);

  const user = await UserModel.findOneAndUpdate(
    { email: env.ADMIN_EMAIL.toLowerCase() },
    {
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      role: 'admin',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log(`Admin user ready: ${user.email}`);
  process.exit(0);
};

void seedAdmin();

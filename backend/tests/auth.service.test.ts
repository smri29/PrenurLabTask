import bcrypt from 'bcryptjs';

jest.mock('../src/models/User', () => ({
  UserModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  },
}));

import { UserModel } from '../src/models/User';
import { authService } from '../src/services/authService';

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new user on register', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    (UserModel.create as jest.Mock).mockResolvedValue({
      _id: { toString: () => 'u1' },
      name: 'John',
      email: 'john@example.com',
      role: 'user',
    });

    const result = await authService.register({
      name: 'John',
      email: 'john@example.com',
      password: 'Password123!',
    });

    expect(result.user.email).toBe('john@example.com');
    expect(UserModel.create).toHaveBeenCalled();
  });

  it('logs user in when credentials are valid', async () => {
    const hash = await bcrypt.hash('Password123!', 12);

    (UserModel.findOne as jest.Mock).mockResolvedValue({
      _id: { toString: () => 'u2' },
      name: 'Jane',
      email: 'jane@example.com',
      role: 'user',
      passwordHash: hash,
    });

    const result = await authService.login({
      email: 'jane@example.com',
      password: 'Password123!',
    });

    expect(result.user.name).toBe('Jane');
    expect(result.token).toBeDefined();
  });
});
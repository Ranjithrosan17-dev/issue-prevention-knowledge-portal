import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      updateLastLogin: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('test-token') } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw on invalid credentials', async () => {
    (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
    await expect(service.validateUser('bad@email.com', 'wrong')).rejects.toThrow();
  });

  it('should return token on login', async () => {
    const result = await service.login({ id: '1', email: 'test@test.com', role: 'developer', name: 'Test', team: 'A' });
    expect(result.accessToken).toBe('test-token');
    expect(result.user.email).toBe('test@test.com');
  });
});

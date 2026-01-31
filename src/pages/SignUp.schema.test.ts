import { describe, it, expect } from 'vitest';
import * as z from 'zod';

const schema = z
  .object({
    email: z
      .email('이메일 형식이 올바르지 않습니다.')
      .min(1, '이메일을 입력해주세요.'),
    nickname: z.string().min(1, '닉네임을 입력해주세요.'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.')
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword']
  });

describe('SignUp Schema', () => {
  describe('email', () => {
    it('유효한 이메일 형식이어야 함', () => {
      const result = schema.safeParse({
        email: 'test@example.com',
        nickname: 'test',
        password: '123456',
        confirmPassword: '123456'
      });
      expect(result.success).toBe(true);
    });

    it('잘못된 이메일 형식은 실패해야 함', () => {
      const result = schema.safeParse({
        email: 'invalid-email',
        nickname: 'test',
        password: '123456',
        confirmPassword: '123456'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '이메일 형식이 올바르지 않습니다.'
        );
      }
    });

    it('빈 이메일은 실패해야 함', () => {
      const result = schema.safeParse({
        email: '',
        nickname: 'test',
        password: '123456',
        confirmPassword: '123456'
      });
      expect(result.success).toBe(false);
    });
  });

  describe('password', () => {
    it('6자 이상의 비밀번호는 유효해야 함', () => {
      const result = schema.safeParse({
        email: 'test@example.com',
        nickname: 'test',
        password: '123456',
        confirmPassword: '123456'
      });
      expect(result.success).toBe(true);
    });

    it('6자 미만의 비밀번호는 실패해야 함', () => {
      const result = schema.safeParse({
        email: 'test@example.com',
        nickname: 'test',
        password: '12345',
        confirmPassword: '12345'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          '비밀번호는 최소 6자 이상이어야 합니다.'
        );
      }
    });
  });

  describe('password confirmation', () => {
    it('비밀번호와 확인 비밀번호가 일치해야 함', () => {
      const result = schema.safeParse({
        email: 'test@example.com',
        nickname: 'test',
        password: '123456',
        confirmPassword: '123456'
      });
      expect(result.success).toBe(true);
    });

    it('비밀번호와 확인 비밀번호가 일치하지 않으면 실패해야 함', () => {
      const result = schema.safeParse({
        email: 'test@example.com',
        nickname: 'test',
        password: '123456',
        confirmPassword: '654321'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const confirmPasswordError = result.error.issues.find(issue =>
          issue.path.includes('confirmPassword')
        );
        expect(confirmPasswordError?.message).toBe(
          '비밀번호가 일치하지 않습니다.'
        );
      }
    });
  });

  describe('nickname', () => {
    it('빈 닉네임은 실패해야 함', () => {
      const result = schema.safeParse({
        email: 'test@example.com',
        nickname: '',
        password: '123456',
        confirmPassword: '123456'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('닉네임을 입력해주세요.');
      }
    });
  });
});

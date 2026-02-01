import * as z from 'zod';

export const signUpSchema = z
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

export type TSignUpSchema = z.infer<typeof signUpSchema>;

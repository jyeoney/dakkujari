import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignUp from './SignUp';

describe('SignUp', () => {
  it('회원가입 폼이 렌더링되어야 함', () => {
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('닉네임')).toBeInTheDocument();
    expect(screen.getByLabelText(/^비밀번호$/)).toBeInTheDocument();
    expect(screen.getByLabelText(/비밀번호 확인/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '회원가입' })
    ).toBeInTheDocument();
  });
});

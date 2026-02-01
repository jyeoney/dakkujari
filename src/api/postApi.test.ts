import { describe, it, expect } from 'vitest';
import { tokenizeText } from './postApi';

describe('tokenizeText', () => {
  it('일반 텍스트를 토큰화해야 함', () => {
    const result = tokenizeText('Hello World Test');
    expect(result).toEqual(['hello', 'world', 'test']);
  });

  it('HTML 태그를 제거하고 텍스트만 추출해야 함', () => {
    const result = tokenizeText('<p>Hello <strong>World</strong></p>');
    expect(result).toEqual(['hello', 'world']);
  });

  it('대소문자를 구분하지 않고 소문자로 변환해야 함', () => {
    const result = tokenizeText('HELLO World TeSt');
    expect(result).toEqual(['hello', 'world', 'test']);
  });

  it('여러 공백을 하나로 처리해야 함', () => {
    const result = tokenizeText('Hello    World   Test');
    expect(result).toEqual(['hello', 'world', 'test']);
  });

  it('빈 문자열은 빈 배열을 반환해야 함', () => {
    const result = tokenizeText('');
    expect(result).toEqual([]);
  });

  it('공백만 있는 문자열은 빈 배열을 반환해야 함', () => {
    const result = tokenizeText('   ');
    expect(result).toEqual([]);
  });
});

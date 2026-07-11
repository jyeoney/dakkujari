import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../firebase/firebaseConfig', () => ({
  db: {}
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  Timestamp: { now: vi.fn(() => ({ toDate: () => new Date() })) },
  doc: vi.fn(),
  deleteDoc: vi.fn(),
  updateDoc: vi.fn()
}));

import { addComment, getComments, deleteComment, updateComment } from './commentApi';

describe('commentApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('addComment 함수가 존재해야 함', () => {
    expect(typeof addComment).toBe('function');
  });

  it('getComments 함수가 존재해야 함', () => {
    expect(typeof getComments).toBe('function');
  });

  it('deleteComment 함수가 존재해야 함', () => {
    expect(typeof deleteComment).toBe('function');
  });

  it('updateComment 함수가 존재해야 함', () => {
    expect(typeof updateComment).toBe('function');
  });

  it('getComments는 빈 배열을 반환해야 함 (댓글 없을 때)', async () => {
    const result = await getComments('post-123');
    expect(result).toEqual([]);
  });
});

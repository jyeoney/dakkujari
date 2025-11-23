import { ComponentType } from 'react';
import { BOARD_CONFIG } from '../constant/boardConfig';
import { useParams } from 'react-router-dom';

// 래핑된 컴포넌트에 전달될 props 인터페이스 정의
export interface IBoardProps {
  boardKey: string;
  boardTitle: string;
}

// withBoard HOC: 게시판 관련 로직을 분리하여 컴포넌트에 주입하는 고차 컴포넌트
export const withBoard = (WrappedComponent: ComponentType<IBoardProps>) => {
  // 새로운 컴포넌트를 반환하는 HOC 패턴(DevTools에서 식별 가능하도록 내부 컴포넌트는 기명 함수로 구현)
  function WithBoardComponent() {
    // useParams 통해 패스파라미터에서 boardName 추출
    const { boardName } = useParams<{ boardName: string }>();
    // 유효하지 않은 게시판 이름 처리
    if (!boardName || !(boardName in BOARD_CONFIG)) {
      return <div>존재하지 않는 게시판입니다.</div>;
    }

    // 해당 게시판의 제목 가져오기
    const boardTitle = BOARD_CONFIG[boardName as keyof typeof BOARD_CONFIG];

    // 원래 컴포넌트에 필요한 props를 전달하여 렌더링
    return <WrappedComponent boardKey={boardName} boardTitle={boardTitle} />;
  }

  // Fast Refresh를 위한 displayName 설정
  WithBoardComponent.displayName = `withBoard(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithBoardComponent;
};

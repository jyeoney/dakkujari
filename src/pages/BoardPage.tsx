import React from 'react';
import Board from '../components/Board';
import { withBoard } from '../hoc/withBoard';

const MemoizedBoard = React.memo(Board);

export default withBoard(Board);

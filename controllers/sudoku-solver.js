class SudokuSolver {

  validate(puzzleString) {
    const regex = /^[1-9.]*$/;
    if (!puzzleString) {
      return { valid: false, error: 'Required field missing' };
    }
    if (!puzzleString.match(regex)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }

    return { valid: true };
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const startIdx = (row - 1) * 9;
    const inputIdx = startIdx + column - 1

    let rowCheck = 0;
    let flag;
    for (let i = startIdx; i < startIdx + 9; i++) {
      if (i === inputIdx) {
        flag = 1 << +value;
      } else if (puzzleString[i] !== '.') {
        flag = 1 << +puzzleString[i];
      } else {
        continue;
      }

      if (rowCheck & flag) return false;
      rowCheck |= flag;
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const startIdx = column - 1;
    const inputIdx = (row - 1) * 9 + startIdx;

    let colCheck = 0;
    let flag;
    for (let i = startIdx; i < 81; i += 9) {
      if (i === inputIdx) {
        flag = 1 << +value;
      } else if (puzzleString[i] !== '.') {
        flag = 1 << +puzzleString[i];
      } else {
        continue;
      }

      if (colCheck & flag) return false;
      colCheck |= flag;
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    row--;
    column--;
    const startRowIdx = Math.trunc(row / 3) * 3,
      startColIdx = Math.trunc(column / 3) * 3;
    const inputIdx = row * 9 + column;

    let regionCheck = 0;
    let flag, idx;
    for (let i = startRowIdx; i < startRowIdx + 3; i++) {
      for (let j = startColIdx; j < startColIdx + 3; j++) {
        idx = i * 9 + j;
        if (idx === inputIdx) {
          flag = 1 << +value;
        } else if (puzzleString[idx] !== '.') {
          flag = 1 << +puzzleString[idx];
        } else {
          continue;
        }

        if (regionCheck & flag) return false;
        regionCheck |= flag;
      }
    }

    return true;
  }

  solve(puzzleString) {
    const rows = new Array(9).fill(0);
    const cols = new Array(9).fill(0);
    const regins = new Array(9).fill(0);

    //初始化，检验puzzleString
    for (let i = 0; i < 81; i++) {
      if (puzzleString[i] !== '.') {
        const rowIdx = Math.trunc(i / 9);
        const colIdx = i % 9;
        const reginIdx = Math.trunc(rowIdx / 3) * 3 + Math.trunc(colIdx / 3);
        const flag = 1 << +puzzleString[i];
        if ((rows[rowIdx] & flag) || cols[colIdx] & flag || regins[reginIdx] & flag) {
          return { solved: false, error: 'Puzzle cannot be solved' };
        }
        rows[rowIdx] |= flag;
        cols[colIdx] |= flag;
        regins[reginIdx] |= flag;
      }
    }


    //返回一个格子的可能数字
    const possible = function* (rowIdx, colIdx) {
      const reginIdx = Math.trunc(rowIdx / 3) * 3 + Math.trunc(colIdx / 3);
      const p = rows[rowIdx] | cols[colIdx] | regins[reginIdx];
      for (let i = 1; i <= 9; i++) {
        if ((p & 1 << i) == 0) yield i;
      }
    }

    //在一个格子上添加一个数，重复添加等于取消
    const addNum = (rowIdx, colIdx, num) => {
      const reginIdx = Math.trunc(rowIdx / 3) * 3 + Math.trunc(colIdx / 3);
      const flag = 1 << num;
      rows[rowIdx] ^= flag;
      cols[colIdx] ^= flag;
      regins[reginIdx] ^= flag;
    }

    const puzzleArray = puzzleString.split('');
    //递归求解，立即调用
    let solved = false;
    (function iterator(idx) {
      if (idx > 80) {
        solved = true;
        return;
      }

      if (puzzleArray[idx] == '.') {
        const rowIdx = Math.trunc(idx / 9);
        const colIdx = idx % 9;
        let g = possible(rowIdx, colIdx);
        for (let p of g) {
          addNum(rowIdx, colIdx, p);
          puzzleArray[idx] = p;
          iterator(idx + 1);
          if (solved) return;
          addNum(rowIdx, colIdx, p);
        }
        puzzleArray[idx] = '.';
      } else {
        iterator(idx + 1);
      }
    })(0);

    return solved
      ? { solved, solution: puzzleArray.join('') }
      : { solved, error: 'Puzzle cannot be solved' };
  }
}

module.exports = SudokuSolver;


'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  const solver = new SudokuSolver();
  const coordRegex = /^[A-Ia-i][1-9]$/;
  const valueRegex = /^[1-9]$/;

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      const valid = solver.validate(puzzle);
      if (!puzzle || !coordinate || !value) {
        res.json({ error: 'Required field(s) missing' });
      } else if (!valid.valid) {
        res.json({ error: valid.error });
      } else if (!coordinate.match(coordRegex)) {
        res.json({ error: 'Invalid coordinate' });
      } else if (!value.match(valueRegex)) {
        res.json({ error: 'Invalid value' });
      } else {
        const row = coordinate[0].toLowerCase().codePointAt() - 96;
        const column = +coordinate[1];

        const rowCheck = solver.checkRowPlacement(puzzle, row, column, value);
        const colCheck = solver.checkColPlacement(puzzle, row, column, value);
        const regionCheck = solver.checkRegionPlacement(puzzle, row, column, value);
        if (rowCheck && colCheck && regionCheck) {
          res.json({ valid: true });
        } else {
          const conflict = [];
          if (!rowCheck) conflict.push('row');
          if (!colCheck) conflict.push('column');
          if (!regionCheck) conflict.push('region');
          res.json({ valid: false, conflict });
        }
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const valid = solver.validate(puzzle);
      if (!valid.valid) {
        res.json({ error: valid.error });
      } else {
        const solution = solver.solve(puzzle);
        if (solution.solved) {
          res.json({ solution: solution.solution });
        } else {
          res.json({ error: solution.error });
        }
      }
    });
};

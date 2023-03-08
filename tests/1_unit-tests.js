const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
const testPuzzle = puzzlesAndSolutions[0][0];

suite('Unit Tests', () => {
    suite('#Check', () => {
        // #1
        test('Logic handles a valid puzzle string of 81 characters', function () {
            for (let data of puzzlesAndSolutions) {
                assert.equal(solver.validate(data[0]).valid, true);
            }
        });
        // #2
        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
            const res = solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37+');
            assert.equal(res.valid, false);
            assert.equal(res.error, 'Invalid characters in puzzle');
        });
        // #3
        test('Logic handles a puzzle string that is not 81 characters in length', function () {
            const res = solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37');
            assert.equal(res.valid, false);
            assert.equal(res.error, 'Expected puzzle to be 81 characters long');
        });
        // #4
        test('Logic handles a valid row placement', function () {
            assert.isTrue(solver.checkRowPlacement(testPuzzle, 2, 3, '8'));
            assert.isTrue(solver.checkRowPlacement(testPuzzle, 7, 7, '9'));
        });
        // #5
        test('Logic handles an invalid row placement', function () {
            assert.isNotTrue(solver.checkRowPlacement(testPuzzle, 2, 3, '2'));
            assert.isNotTrue(solver.checkRowPlacement(testPuzzle, 7, 7, '7'));
        });
        // #6
        test('Logic handles a valid column placement', function () {
            assert.isTrue(solver.checkColPlacement(testPuzzle, 9, 6, '5'));
            assert.isTrue(solver.checkColPlacement(testPuzzle, 5, 2, '1'));
        });
        // #7
        test('Logic handles an invalid column placement', function () {
            assert.isNotTrue(solver.checkColPlacement(testPuzzle, 9, 6, '1'));
            assert.isNotTrue(solver.checkColPlacement(testPuzzle, 5, 2, '6'));
        });
        // #8
        test('Logic handles a valid region (3x3 grid) placement', function () {
            assert.isTrue(solver.checkRegionPlacement(testPuzzle, 4, 7, '2'));
            assert.isTrue(solver.checkRegionPlacement(testPuzzle, 3, 9, '9'));
        });
        // #9
        test('Logic handles an invalid region (3x3 grid) placement', function () {
            assert.isNotTrue(solver.checkRegionPlacement(testPuzzle, 4, 7, '9'));
            assert.isNotTrue(solver.checkRegionPlacement(testPuzzle, 3, 9, '2'));
        });
    });

    suite('#Solve', () => {
        // #10
        test('Valid puzzle strings pass the solver', function () {
            for (let data of puzzlesAndSolutions) {
                const solution = solver.solve(data[1]);
                assert.isTrue(solution.solved);
                assert.equal(solution.solution, data[1]);
            }
            //fcc test
            const solution = solver.solve('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..');
            assert.isTrue(solution.solved);
            assert.equal(solution.solution, '769235418851496372432178956174569283395842761628713549283657194516924837947381625');
        });
        // #11
        test('Invalid puzzle strings fail the solver', function () {
            const solution = solver.solve('3.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..');
            assert.isNotTrue(solution.solved);
            assert.equal(solution.error, 'Puzzle cannot be solved');
        });
        // #12
        test('Solver returns the expected solution for an incomplete puzzle', function () {
            for (let data of puzzlesAndSolutions) {
                const solution = solver.solve(data[1]);
                assert.isTrue(solution.solved);
                assert.equal(solution.solution, data[1]);
            }
        });

    });
});

const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');
const testPuzzle = puzzlesAndSolutions[0][0];

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('#Solve', () => {
        // #1
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
            const randdom = Math.trunc(Math.random() * puzzlesAndSolutions.length);
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: puzzlesAndSolutions[randdom][0] })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, puzzlesAndSolutions[randdom][1]);
                    done();
                });
        });
        // #2
        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({})
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Required field missing' });
                    done();
                });
        });
        // #3
        test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37+' })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                    done();
                });
        });
        // #4
        test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16...926914.37.' })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
                    done();
                });
        });
        // #5
        test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '..9..5.1685.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..' })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isNotTrue(res.body.solved);
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });
    });

    suite('#Check', () => {
        // #6
        test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: testPuzzle,
                    coordinate: 'A2',
                    value: '3',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isTrue(res.body.valid);
                    done();
                });
        });
        // #7
        test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: testPuzzle,
                    coordinate: 'A2',
                    value: '8',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isNotTrue(res.body.valid);
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 1);
                    done();
                });
        });
        // #8
        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: testPuzzle,
                    coordinate: 'b2',
                    value: '7',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isNotTrue(res.body.valid);
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 2);
                    done();
                });
        });
        // #9
        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: testPuzzle,
                    coordinate: 'a2',
                    value: '2',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isNotTrue(res.body.valid);
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 3);
                    done();
                });
        });
        // #10
        test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: testPuzzle,
                    coordinate: 'A2',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Required field(s) missing' });
                    done();
                });
        });
        // #11
        test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37+',
                    coordinate: 'A2',
                    value: '3',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                    done();
                });
        });
        // #12
        test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37',
                    coordinate: 'A2',
                    value: '3',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
                    done();
                });
        });
        // #13
        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: testPuzzle,
                    coordinate: 'A21',
                    value: '3',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid coordinate' });
                    done();
                });
        });
        // #14
        test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: testPuzzle,
                    coordinate: 'A1',
                    value: 'x',
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid value' });
                    done();
                });
        });

    });
});


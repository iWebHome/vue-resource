var Vue = require('vue');

var specs = function (Promise) {

    it('then fulfill', function (done) {

        Promise.resolve(1).then(function (value) {
            expect(value).toBe(1);
            done();
        });

    });

    it('then reject', function (done) {

        Promise.reject(1).then(undefined, function (value) {
            expect(value).toBe(1);
            done();
        });

    });

    it('catch', function (done) {

        Promise.reject(1).catch(function (value) {
            expect(value).toBe(1);
            done();
        });

    });

    it('all', function (done) {

        Promise.all([

            Promise.resolve(1),
            Promise.resolve(2)

        ]).then(function (values) {
            expect(values[0]).toBe(1);
            expect(values[1]).toBe(2);
            done();
        });

    });

    it('duplicate', function (done) {

        Promise.all([

            Promise.resolve(1).then(function (value) {
                expect(value).toBe(1);
            }),

            Promise.resolve(2).then(function (value) {
                expect(value).toBe(2);
            })

        ]).then(done);

    });

    it('context', function (done) {

        var context = {foo: 'bar'};

        Promise.resolve().bind(context).then(function () {
            expect(this).toBe(context);
            done();
        });

    });

    it('context chain', function (done) {

        var context = {foo: 'bar'};

        Promise.resolve().bind(context).catch(undefined).then(function () {
            expect(this).toBe(context);
            done();
        });

    });

    it('no chain breaking', function (done) {

        var promise = Promise.reject();

        Promise.all([

            promise.catch(function () {
                expect(true).toBe(true);
            }),

            promise.catch(function () {
                fail('Chain break');
            })

        ]).then(done);

    });

};

describe('Promise Adapter (native)', function () {

    if (window.Promise) {

        var Promise = require('../src/promise')();

        it('is native', function () {
            expect((new Promise.resolve()).promise instanceof window.Promise).toBe(true);
        });

        specs(Promise);

    } else {

        it('no native promise', function () {
            expect(true).toBe(true);
        })

    }

});

describe('Promise Adapter (polyfill)', function () {

    var native = window.Promise;
    delete window.Promise;

    var Promise = require('../src/promise')(Vue.util);
    window.Promise = native;

    it('is polyfill', function () {
        expect((new Promise.resolve()).promise.state).toBe(0);
    });

    specs(Promise);

});
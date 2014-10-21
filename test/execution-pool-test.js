var should = require("chai").should(),
    sinon = require("sinon"),
    Q = require("Q"),
    ExecutionPool = require("../src/execution-pool.js");

describe('execution-pool', function() {
    "use strict";

    describe('constructor', function() {
        const DEFAULT_POOL_SIZE = 5,
              CUSTOM_POOL_SIZE = 7;

        let executionPool;
        
        it('should set as 5 the maximum active promises if no argument is passed', function() {
            executionPool = new ExecutionPool();

            executionPool.getPoolSize().should.equal( DEFAULT_POOL_SIZE );
        });
        

        it('should receive as argument the maximum pool size', function() {
            executionPool = new ExecutionPool( CUSTOM_POOL_SIZE );

            executionPool.getPoolSize().should.equal( CUSTOM_POOL_SIZE );
        });
    });

    describe('adding promises into the pool', function() {
        let executionPool;

        beforeEach( function() {
            executionPool = new ExecutionPool( 1 );
        });

        it('should return true if the promise is going be executed immediately', function() {
            executionPool.push( aNewFunctionWhichResolvesAPromiseIn( 100 ) ).should.be.true;
        });

        it('should return false if the promise is not going be executed immediately', function() {
            executionPool.push( aNewFunctionWhichResolvesAPromiseIn( 1000 ) );
            executionPool.push( aNewFunctionWhichResolvesAPromiseIn( 1000 ) ).should.be.false;
        });
    });

    describe('executing', function() {
        let executionPool;

        beforeEach( function() {
            executionPool = new ExecutionPool( 1 );
        });

        it('should execute all queued executors', function( done ) {
            let spy1 = sinon.spy(),
                spy2 = sinon.spy(),

                executor1 = aNewFunctionWhichResolvesAPromiseIn( 100, spy1 ),
                executor2 = aNewFunctionWhichResolvesAPromiseIn( 100, spy2 );
            
            executionPool.push( executor1 );
            executionPool.push( executor2 );

            setTimeout( function() {
                [spy1.called, spy2.called].should.deep.equal([true, true]);
                done();
            }, 250);
        });

        it('should not execute if there is no place in the promise pool', function( done ) {
            let spy1 = sinon.spy(),
                spy2 = sinon.spy(),

                executor1 = aNewFunctionWhichResolvesAPromiseIn( 10000, spy1 ),
                executor2 = aNewFunctionWhichResolvesAPromiseIn( 0, spy2 );
            
            executionPool.push( executor1 );
            executionPool.push( executor2 );

            setTimeout( function() {
                [spy1.called, spy2.called].should.deep.equal([false, false]);
                done();
            }, 250);
        });
    });


    describe('when the execution pool finishes executing', function() {
        let executionPool;

        beforeEach(function() {
            executionPool = new ExecutionPool();
        });

        it('should resolve the empty promise automatically if it is empty', function( done ) {
            executionPool.finishedExecutionPromise().then( function() {
                done();
            }).done();
        });
    });


    function aNewFunctionWhichResolvesAPromiseIn( milliseconds, callback ) {
        return function() {
            var deferer = Q.defer();

            setTimeout( function() {
                callback && callback();
                deferer.resolve() ;
            }, milliseconds );

            return deferer.promise;
        };
    }
});
var should = require("chai").should(),
    PromisePool = require("../src/promise-pool.js");

describe('promise-pool', function() {
    "use strict";

    describe('constructor', function() {
        let promisePool;
        const DEFAULT_POOL_SIZE = 5;
        
        it('should set as 5 the maximum active promises if no argument is passed', function() {
            promisePool = new PromisePool();

            promisePool.getPoolSize().should.equal( DEFAULT_POOL_SIZE );
        });
        

        it('should receive as argument the maximum active calls', function() {

        });
    })
});
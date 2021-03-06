module.exports = function( _poolSize ) {
    "use strict";

    var Q = require("q"),
        poolSize = _poolSize || 5,
        executionQueue = [],
        promisePool = [],
        finishedExecutingDeferer = Q.defer();

    finishedExecutingDeferer.resolve(); // should start resolved because array is empty

    this.getFinishedExecutionPromise = function() {
        return finishedExecutingDeferer.promise;
    };

    this.getPoolSize = function() {
        return poolSize;
    };

    this.isEmpty = function() {
        return promisePool.length === 0;
    };

    /**
     * Executable must return a promise
     */
    this.push = function( executable ) {
        finishedExecutingDeferer = promisePool.length ? finishedExecutingDeferer : Q.defer();

        executionQueue.push( executable );

        if ( promisePool.length < poolSize ) {
            executeNextPromise();
        }

        return ( promisePool.length + executionQueue.length ) <= poolSize;
    };

    function executeNextPromise() {
        var promise,
            task;

        if ( promisePool.length < poolSize && executionQueue.length > 0 ) {            
            task = executionQueue.shift();
            
            promise = task();
            promisePool.push( promise );
            
            promise.then( removeFromPoolFunction( promise ) )
                   .then( executeNextPromise );
        } else if ( promisePool.length === 0 ) {
            finishedExecutingDeferer.resolve();
        }
    }

    function removeFromPoolFunction( promise ) {
        return function() {
            var i = 0;
            for(; i < promisePool.length && promisePool[i] !== promise; i++ );
            promisePool.splice(i, 1);
        };
    }
}

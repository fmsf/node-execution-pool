module.exports = function( _poolSize ) {
    "use strict";

    var poolSize = _poolSize || 5,
        executionQueue = [],
        promisePool = [];

    this.getPoolSize = function() {
        return poolSize;
    };

    /**
     * Executable must return a promise
     */
    this.push = function( executable ) {
        executionQueue.push( executable );

        if ( promisePool.length < poolSize ) {
            executeNextPromise();
        }
        
        return (promisePool.length + executionQueue.length) <= poolSize;
    };

    function executeNextPromise() {
        var promise,
            executor;

        if ( promisePool.length < poolSize && executionQueue.length > 0 ) {            
            executor = executionQueue.pop();
            
            promise = executor();
            promisePool.push( promise );
            
            promise.then( removeFromPoolFunction( promise ) )
                   .then( executeNextPromise );
        }
    };

    function removeFromPoolFunction( promise ) {
        return function() {
            var i = 0;
            for(; i < promisePool.length && promisePool[i] !== promise; i++ );
            promisePool.splice(i, 1);
        };
    }

    /**
     * FOR TESTING ONLY 
     */
    this.__internal = {
        executeNextPromise : executeNextPromise,
        removeFromPool : removeFromPoolFunction
    };
}
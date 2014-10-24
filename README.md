EXECUTION POOL
========================

Node is single threaded but when working with promises it is common to have multiple waiting in parallel. This execution pool allows to schedule tasks that return promisses. Setting a limit to the amount of executions that can be actively waiting in paralel. 

Current execution strategy works like a queue (FIFO).

I needed this for a personal project, so to optimize for time it was done while flying from LHR -> SFO and I didn't had an internet connection. I was copy pasting the node modules from another project (thus no package.json, linting etc). Will add missing stuff in the future.

Until I add some documentation (maybe on the flight back) look at the tests for example of usage. If you push an task into the execution pool it will automatically execute if the limit is not reached yet. Otherwhise it will execute once the current promise count finishes.

Bellow is an edited copy paste from one of the tests to be used as an example:

```
var ExecutionPool = require("execution-pool"),
    executionPool = new ExecutionPool( POOL_SIZE ),

    task1 = aNewFunctionWhichResolvesAPromiseIn( 10000, spy1 ),
    task2 = aNewFunctionWhichResolvesAPromiseIn( 0, spy2 );
            
executionPool.push( task1 );
executionPool.push( task2 );
...

```

For clarity the `execution-pool` expects a function callback that returns a promise (i.e.):


```
executionPool.push( function() {
    var promise = new Promise();
    
    // ... 
    
    return promise;
});
```

If you want to be notified when the execution pool gets empty then you can call the utility method `getFinishedExecutionPromise`. As the name states it returns a promise that will resolve if the pool gets empty.


```
executionPool.getFinishedExecutionPromise().then( function() {
    console.log("finished executing all promises");
});
```

Or if you just want to check if your execution pool is still executing you can call `isEmpty` which returns either true or false;

```
executionPool.isEmpty(); 
```


### TODO

- Add more execution strategies.
- Improve removal from queue complexity (currently O(N) can be done in O(1))
- ~~Add package.json~~
- ~~Register in npm~~ https://www.npmjs.org/package/execution-pool
- Add finishin strategies (should the .done be executed internally after the last then?)
- Optimize tests (they are taking more than a second due to the setTimeouts)
- Add timeout options.
- ~~Add a way to detect if the execution pool became empty.~~
- Remove Q as an internal dependence. (currently there as a quick solution)

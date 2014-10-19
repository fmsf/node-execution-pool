EXECUTION POOL
========================

Node is single threaded but when working with promises it is common to have multiple waiting in parallel. This allows to schedule executors that return promisses. Setting a limit to the amount of executions that can be actively waiting in paralel. 

Current execution strategy works like a stack (LIFO).


### TODO

- Add more execution strategies.
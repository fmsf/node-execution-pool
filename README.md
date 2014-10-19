EXECUTION POOL
========================

Node is single threaded but when working with promises it is common to have multiple waiting in parallel. This allows to schedule executors that return promisses. Setting a limit to the amount of executions that can be actively waiting in paralel. 

Current execution strategy works like a stack (LIFO).

This project was started while flyig from LHR -> SFO and I didn't had an internet connection. So I was copy pasting the node modules from another project (thus no package.json, linting etc). Will add missing stuff in the future.

### TODO

- Add more execution strategies.
- Improve removal from queue complexity (currently O(N) can be done in O(1))
- Add package.json
- Register in npm
- Add finishin strategies (should the .done be executed internally after the last then?)
- Optimize tests (they are taking more than a second due to the setTimeouts)
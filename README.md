# soursop

## Using node module example

Run `npm init` in an app directory and follow the steps to create a `package.json`.

Create a javascript file called `index.js` which contains

```
toposort = require('toposort');

// Define the graph
var graph = [
  ['put on your shoes', 'tie your shoes'],
  ['put on your shirt', 'put on your jacket'],
  ['put on your shorts', 'put on your jacket'],
  ['put on your shorts', 'put on your shoes']
]

// Print the graph before topological sort
console.log(graph);

// Run topological sort on the graph
toposort(graph)

// Print the graph after topologically sorting it
console.log(graph);
```

To run the JavaScript program, execute `node index.js` and it should output

```
[ [ 'put on your shoes', 'tie your shoes' ],
  [ 'put on your shirt', 'put on your jacket' ],
  [ 'put on your shorts', 'put on your jacket' ],
  [ 'put on your shorts', 'put on your shoes' ] ]
[ [ 'put on your shoes', 'tie your shoes' ],
  [ 'put on your shirt', 'put on your jacket' ],
  [ 'put on your shorts', 'put on your jacket' ],
  [ 'put on your shorts', 'put on your shoes' ] ]
```


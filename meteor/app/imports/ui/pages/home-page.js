import { Template } from 'meteor/templating';
import { toposort } from 'meteor/toposort';

let container = document.getElementById('visualization');

Template.List_Stuff_Page.helpers({
  sortStuff() {
    // First, we define our edges.
    const graph = [
      ['put on your shoes', 'tie your shoes'],
      ['put on your shirt', 'put on your jacket'],
      ['put on your shorts', 'put on your jacket'],
      ['put on your shorts', 'put on your shoes'],
    ];

    console.log(graph);

    // Now, sort the vertices topologically, to reveal a legal execution order.
    toposort(graph);
    // [ 'put on your shirt'
    // , 'put on your shorts'
    // , 'put on your jacket'
    // , 'put on your shoes'
    // , 'tie your shoes' ]

    console.log(graph);
  },
});

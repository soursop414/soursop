import { Template } from 'meteor/templating';
import { topsort } from 'meteor/aramk:topsort';

// let container = document.getElementById('visualization');

Template.Home_Page.helpers({

  sortStuff() {
    var edges = [ [1, 2], [2, 3] ];
    console.log(edges);
    var sorted = topsort(edges);
    console.log(sorted);
  },
});

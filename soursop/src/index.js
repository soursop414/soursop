// import Activity from './Activity.js';
// import {toposort} from '../node_modules/toposort.js';

const toposort = require("toposort");

function addEvent() {
  let form = document.getElementById("form1");
  event.preventDefault();
  console.log('addEvent');
  // let name = document.form1.name;
  console.log(form.elements[0].value);
  // let dependencies = [];
  // let durations
}
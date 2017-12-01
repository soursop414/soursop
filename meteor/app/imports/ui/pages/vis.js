/* global document */

import { Template } from 'meteor/templating';
import { DataSet, Timeline } from 'vis';


Template.Vis.onRendered(function onRendered() {
  // DOM element where the Timeline will be attached
  const container = document.getElementById('visualization');

  // Create a DataSet (allows two way data-binding)
  const items = new DataSet([
    { id: 1, content: 'item 1', start: '2014-04-20', end: '2014-04-22', className: 'cp' },
    { id: 2, content: 'item 2', start: '2014-04-14', end: '2014-04-16', className: 'cp' },
    { id: 3, content: 'item 3', start: '2014-04-18', end: '2014-04-19' },
    { id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-18' },
    { id: 5, content: 'item 5', start: '2014-04-25', end: '2014-04-26' },
  ]);

  // const newItems = new DataSet([
  //   { id: 1, content: 'new', start: '2014-04-20', end: '2014-04-25' },
  //   { id: 2, content: 'new 2', start: '2014-04-14', end: '2014-04-16' },
  //   { id: 3, content: 'new 3', start: '2014-04-18', end: '2014-04-19' },
  //   { id: 4, content: 'new 4', start: '2014-04-16', end: '2014-04-18' },
  //   { id: 5, content: 'new 5', start: '2014-04-25', end: '2014-04-26' },
  // ]);

  // Configuration for the Timeline
  const options = {};

  // Create a Timeline
  const timeline = new Timeline(container, items, options);

  //onclick
  timeline.on('click', function (properties)
  {
  console.log(properties.item);
  //timeline.setItems(newItems); //can edit the dataset
  });
});

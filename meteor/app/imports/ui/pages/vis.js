/* global document */

import { Template } from 'meteor/templating';
import { DataSet, Timeline } from 'vis';
import { EventData } from '../../api/eventdata/eventdata.js';


Template.Vis.onRendered(function onRendered() {
  // Critical path calculation
  let testTaskArray = [];
  let eventData = EventData.find().fetch();
  let tempTask = [];
  // create taskArray from EventData database
  for (let i = 0; i < eventData.length; i++) {
    tempTask[0] = eventData[i].name;
    tempTask[1] = eventData[i].duration;
    tempTask[2] = eventData[i].dependencies;
    if (tempTask[2][0] === null) {
      tempTask[2] = [];
    }

    testTaskArray.push(tempTask);
    tempTask = [];
  }
// Critical path calculation

  function criticalPath(inputArray) {
    var taskArray = [];
    var depenendencySums = [];
    var holePosition = 0;
    var valueToInsert = 0;

    /* initialize taskArray fields based on user input */
    for(var i = 0; i < inputArray.length; i++) {
      taskArray[i] = {};
      //taskArray[i].dependencies = [];
      taskArray[i].name = inputArray[i][0];
      taskArray[i].duration = inputArray[i][1];
      taskArray[i].dependencies = inputArray[i][2];
    }

  /* set the early start and early finish fields to the recursively added dependency durations */
  for(var i = 0; i < taskArray.length; i++) {
	var EF = recursiveAddition(taskArray, taskArray[i]);
    var ES = EF - taskArray[i].duration + 1;
	taskArray[i].ES = ES;
	taskArray[i].EF = EF;
  }

    /* insertion sort based on the early start times of tasks to get the topological sort */

    for(var i = 1; i < taskArray.length; i++) {
      /* select value to be inserted */
      valueToInsert = taskArray[i];
      holePosition = i;

      /*locate hole position for the element to be inserted */
      while(holePosition >= 0 && taskArray[holePosition-1].ES > valueToInsert.ES) {
        taskArray[holePosition] = taskArray[holePosition - 1];
        holePosition = holePosition - 1;
      }

      /* insert the number at hole position */
      taskArray[holePosition] = valueToInsert;
    }
    return taskArray;
}

/* returns the sum of a task's duration along with that of its dependencies */
function recursiveAddition(array, node) {
  var duration = node.duration;
  var dependencySums = [];
  var sum = 0;

/* base case */
  if(node.dependencies.length == 0) {
    return duration;
    /* if there is only one task in its dependency */
  } else {
      if(node.dependencies.length <= 1) {
        node = nodeWithName(array, node.dependencies[0]);
        return duration + recursiveAddition(array, node);
      } else {
        /* more than one task in its dependency, it will take the task with the larger
        recursiveAddition result for its ES */
        let originalNodeDependenciesLength = node.dependencies.length;
        let originalNode = node;
        let max = -1;


        for(var j = 0; j < originalNodeDependenciesLength; j++) {
          dependencySums.push(recursiveAddition(array, nodeWithName(array, originalNode.dependencies[j])));
        }

        /* callback function to get the max from dependencySums */
        max = dependencySums.reduce(function(a, b) {
          return Math.max(a, b);
        });
        return duration + max;
    }
  }
}

/* retrieve the node with the name field name */
function nodeWithName(array, name) {
  for(var i = 0; i < array.length; i++) {
    if(array[i].name == name) {
      return array[i];
    }
  }
}

/**
 * Calculates the slack times for all tasks and appends to task array
 * @author Nick Izawa
 * @param {Array} taskArray, ordered chronologically by ES
 * @return {Array} Updated array with late start, late finish, and slack times.
 */
function slackCalcs(taskArray)
{
	var tasks = taskArray;
	var doneTasks = []; //array of tasks already processed
	var task; //the current task
	var name;
	var dur; //duration
	var deps; //dependencies
	var ES; //early start time
	var EF; //early finish time
	var LS; //late finish time
	var LF; //late start time
	var slack; //slack time

	//process tasks in reverse
	for (var i = tasks.length - 1; i >= 0; i--)
	{
		//initialize stuff
		task = tasks[i];
		name = task.name;
		dur = task.duration;
		dep = task.dependencies;
		ES = task.ES;
		EF = task.EF;

		//if on the last task, LF should be same as EF
		if (i == tasks.length - 1)
		{
			//if end task isn't a blank node
			if (dur != 0)
			{
				LF = EF;
				LS = LF - dur + 1;
				slack = LF - EF
			}
			//end task is blank node, don't add free float
			else
			{
				LF = EF;
				LS = LF - dur;
				slack = LF - EF
			}
		}
		//otherwise find min LS of successors to get LF
		else
		{
			var min = Number.POSITIVE_INFINITY;
			//check each completed task
			for (var j = 0; j < doneTasks.length; j++)
			{
				var successorTask = doneTasks[j];
				//check dependencies of successor task for current task
				if (successorTask.dependencies.includes(name))
				{
					//find min LS
					if (successorTask.LS < min)
					{
						min = successorTask.LS;
					}
				}
			}
			LF = min - 1;
			LS = LF - dur + 1;
			slack = LF - EF;
		}
		task.LS = LS;
		task.LF = LF;
		task.slack = slack;
		doneTasks.push(task);
	}
	// console.log(tasks);

	var cp = '';
	//loop through the tasks
	for(var i = 0; i < tasks.length; i++)
	{
		//no slack means cp
		if(tasks[i].slack == 0)
		{
			if (i == tasks.length - 1)
			{
				cp += taskArray[i].name;
			}
			else
			{
				cp += taskArray[i].name + ' -> ';
			}
		}
	}
	// console.log('Critical Path: ' + cp);
	return tasks;
}

  let resultTaskArray = slackCalcs(criticalPath(testTaskArray));



  let updatedTempTask;

  for (let i = 0; i < resultTaskArray.length; i++) {
    tempTask = EventData.findOne({ name: resultTaskArray[i].name });
    EventData.update({ _id: tempTask._id }, { $set: { ef: resultTaskArray[i].EF, es: resultTaskArray[i].ES, lf: resultTaskArray[i].LF, ls: resultTaskArray[i].LS, slack: resultTaskArray[i].slack } });
  }

// Visualization

  // DOM element where the Timeline will be attached
  const container = document.getElementById('visualization');

  eventData = EventData.find().fetch();
  let dataSet = [];
  let id, content, start, end;

  for (let i = 0; i < eventData.length; i++) {
    id = i + 1;
    content = eventData[i].name;
    start = eventData[i].startDate;
    end = eventData[i].endDate;
    dataSet.push({ id, content, start, end });
  }

  // Create a DataSet (allows two way data-binding)
  const items = new DataSet(dataSet);
  // const items = new DataSet([
  //   { id: 1, content: 'item 1', start: '2014-04-20', end: '2014-04-22', className: 'cp' },
  //   { id: 2, content: 'item 2', start: '2014-04-14', end: '2014-04-16', className: 'cp' },
  //   { id: 3, content: 'item 3', start: '2014-04-18', end: '2014-04-19' },
  //   { id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-18' },
  //   { id: 5, content: 'item 5', start: '2014-04-25', end: '2014-04-26' },
  // ]);

  // Configuration for the Timeline
  const options = {};

  // Create a Timeline
  const timeline = new Timeline(container, items, options);

  // //onclick
  // timeline.on('click', function (properties)
  // {
  // console.log(properties.item);
  // //timeline.setItems(newItems); //can edit the dataset
  // });
});

var testTaskArray = [[
[ 'A', 10, [] ],
[ 'B', 5, ['A'] ],
[ 'D', 2, ['A'] ],
[ 'E', 1, ['A'] ],
[ 'C', 3, ['B', 'D', 'E'] ]
],
[[ 'A', 10, [] ],
[ 'H', 15, ['A'] ],
[ 'B', 20, ['A'] ],
[ 'F', 15, ['A'] ],
[ 'C', 5, ['B'] ],
[ 'D', 10, ['C'] ],
[ 'G', 5, ['F', 'C'] ],
[ 'E', 20, ['G', 'D', 'H'] ]
]];

//Test 1
slackCalcs(criticalPath(testTaskArray[0]));

//Test 2
slackCalcs(criticalPath(testTaskArray[1]));

function criticalPath(inputArray) {
    var taskArray = [];
    var depenendencySums = [];

    for(var i = 0; i < inputArray.length; i++) {
      taskArray[i] = {};
      //taskArray[i].dependencies = [];
      taskArray[i].name = inputArray[i][0];
      taskArray[i].duration = inputArray[i][1];
      taskArray[i].dependencies = inputArray[i][2];
    }

  for(var i = 0; i < taskArray.length; i++) {
	var EF = recursiveAddition(taskArray, taskArray[i]);
    var ES = EF - taskArray[i].duration + 1;
	taskArray[i].ES = ES;
	taskArray[i].EF = EF;
  }

    var holePosition = 0;
    var valueToInsert = 0;

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

function recursiveAddition(array, node) {

  var duration = node.duration;
  var dependencySums = [];
  var sum = 0;

  if(node.dependencies.length == 0) {
    return duration;
  } else {
      if(node.dependencies.length <= 1) {
        node = nodeWithName(array, node.dependencies[0]);
        return duration + recursiveAddition(array, node);
      } else {
        let originalNodeDependenciesLength = node.dependencies.length;
        let originalNode = node;
        let max = -1;
        for(var j = 0; j < originalNodeDependenciesLength; j++) {
          dependencySums.push(recursiveAddition(array, nodeWithName(array, originalNode.dependencies[j])));
        }
        
        max = dependencySums.reduce(function(a, b) {
          return Math.max(a, b);
        });
        return duration + max;
    }
  }
}

function nodeWithName(array, name) {
  for(var i = 0; i < array.length; i++) {
    if(array[i].name == name) {
      return array[i];
    }
  }
}

/*var testTaskArray = [[
{ name: 'A', duration: 10, dependencies: [], ES: 1, EF: 10 },
{ name: 'B', duration: 5, dependencies: ['A'], ES: 11, EF: 15 },
{ name: 'D', duration: 2, dependencies: ['A'], ES: 11, EF: 12 },
{ name: 'E', duration: 1, dependencies: ['A'], ES: 11, EF: 11 },
{ name: 'C', duration: 3, dependencies: ['B', 'D', 'E'], ES: 16, EF: 18 }
],
[{ name: 'A', duration: 10, dependencies: [], ES: 1, EF: 10 },
{ name: 'H', duration: 15, dependencies: ['A'], ES: 11, EF: 25 },
{ name: 'B', duration: 20, dependencies: ['A'], ES: 11, EF: 30 },
{ name: 'F', duration: 15, dependencies: ['A'], ES: 11, EF: 25 },
{ name: 'C', duration: 5, dependencies: ['B'], ES: 31, EF: 35 },
{ name: 'D', duration: 10, dependencies: ['C'], ES: 36, EF: 45 },
{ name: 'G', duration: 5, dependencies: ['F', 'C'], ES: 36, EF: 40 },
{ name: 'E', duration: 20, dependencies: ['G', 'D', 'H'], ES: 46, EF: 65 }
]];	

// Test 1
//console.log(testTaskArray[0]);
//slackCalcs(testTaskArray[0]);

// Test 2
//console.log(testTaskArray[1]);
//slackCalcs(testTaskArray[1]);*/

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
	console.log(tasks);
	
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
	console.log('Critical Path: ' + cp);
	return tasks;
}

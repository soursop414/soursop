criticalPath([ [ 'A', 10, [], 1, 10 ],
  [ 'B', 5, [ 'A' ], 11, 16 ],
  [ 'D', 2, [ 'A' ], 11, 12 ],
  [ 'E', 1, [ 'A' ], 11, 11 ],
  [ 'C', 3, [ 'B', 'D', 'E' ], 17, 19 ] ]
);
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
    taskArray[i].EF = recursiveAddition(taskArray, taskArray[i]);
    taskArray[i].ES = taskArray[i].EF - taskArray[i].duration + 1;
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

    console.log(taskArray);
    return taskArray;
}

function recursiveAddition(array, node) {

  var duration = node.duration;
  var dependencySums = [];
  var sum = 0;

  if(node.dependencies.length == 0) {
    return duration;
  }else {
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

/*slackCalcs([
	["A", 10, [], 1, 10],
	["H", 15, ["A"], 11, 25],
	["B", 20, ["A"], 11, 30],
	["F", 15, ["A"], 11, 25],
	["C", 5, ["B"], 31, 35],
	["D", 10, ["C"], 36, 45],
	["G", 5, ["F", "C"], 36, 40],
	["E", 20, ["G", "D", "H"], 46, 65]]);*/

/*slackCalcs([ [ 'A', 10, [], 1, 10 ],
  [ 'B', 5, [ 'A' ], 11, 15 ],
  [ 'D', 2, [ 'A' ], 11, 12 ],
  [ 'E', 1, [ 'A' ], 11, 11 ],
  [ 'C', 3, [ 'B' ], 16, 18 ] ]);*/

var testTaskArray = [[
		["A", 10, [], 1, 10],
		["B", 5, ["A"], 11, 16],
		["D", 2, ["A"], 11, 12],
		["E", 1, ["A"], 11, 11],
		["C", 3, ["B", "D", "E"], 17, 19],
	],
		[["A", 10, [], 1, 10],
		["H", 15, ["A"], 11, 25],
		["B", 20, ["A"], 11, 30],
		["F", 15, ["A"], 11, 25],
		["C", 5, ["B"], 31, 35],
		["D", 10, ["C"], 36, 45],
		["G", 5, ["F", "C"], 36, 40],
		["E", 20, ["G", "D", "H"], 46, 65]]
	];

// Test 1
console.log(testTaskArray[0]);
slackCalcs(testTaskArray[0]);

// Test 2
console.log(testTaskArray[1]);
slackCalcs(testTaskArray[1]);

/**
 * Calculates the slack times for all tasks and appends to task array
 * @author Nick Izawa
 * @param {Array} taskArray, ordered chronologically by ES
 * @return {Array} Updated array with slack times. Tasks are of form    ["name", "duration", "["dependencies"]", "early start", "early finish", "late start", "late finish", "slack"].
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
		name = task[0];
		dur = task[1];
		dep = task[2];
		ES = task[3];
		EF = task[4];

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
				if (successorTask[2].includes(name))
				{
					//find min LS
					if (successorTask[5] < min)
					{
						min = successorTask[5];
					}
				}
			}
			LF = min - 1;
			LS = LF - dur + 1;
			slack = LF - EF;
		}
		task.push(LS, LF, slack);
		doneTasks.push(task);
	}
	console.log(tasks);
	return tasks;
}

function test() {
  console.log('test');
}

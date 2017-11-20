toposort = require('toposort');

slackCalcs([
	["A", 10, [], 1, 10], 
	["H", 15, ["A"], 11, 25],
	["B", 20, ["A"], 11, 30], 
	["F", 15, ["A"], 11, 25],	
	["C", 5, ["B"], 31, 35], 
	["D", 10, ["C"], 36, 45], 
	["G", 5, ["F", "C"], 36, 40], 
	["E", 20, ["G", "D", "H"], 46, 65]]);

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
			LF = EF;
			LS = LF - dur;
			slack = LF - EF
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
			LF = min;
			LS = LF - dur;
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
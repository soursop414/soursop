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
      if(node.dependencies.length == 1) {
        node = nodeWithName(array, node.dependencies[0]);
        return duration + recursiveAddition(array, node);
      } else {
        for(var j = 0; j < node.dependencies.length; j++) {
          node = nodeWithName(array, node.dependencies[j]);
          dependencySums.push(recursiveAddition(array, node));
        }
        return duration + Math.max(dependencySums);
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

function test() {
  console.log('test');
}

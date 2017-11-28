toposort = require('toposort');

function criticalPath(inputArray) {

    var taskArray = [];
    var depenendencySums = [];

    for(var i = 0; i < inputArray.length; i++) {

      taskArray[i].name = inputArray[i][0];
      taskArray[i].duration = inputArray[i][1];

      for(var j = 0; j < inputArray[i][2].length; j++) {
        taskArray[i].dependencies.push(inputArray[i][2][j]);
      }
    }

    for(var i = 0; i < taskArray.length; i++) {

      depenendencySums = [];
      node = taskArray[i];
      sum = node.duration;

      if (node.dependencies.length > 1) {
        for(var j = 0; j < node.dependencies.length; j++) {
          node = taskArray[i];
          while(node != null) {
            //taskArray[i].dependencies[0][0] referencies the name of the dependency
            node = nodeWithName(taskArray, taskArray[i].dependencies[0][0]);
            sum += node.duration;
          }
          dependencySums.push(sum);
          sum = 0;
        }
        sum = Math.max(dependencySums);
      } else {
        while(node != null) {
          //taskArray[i].dependencies[0][0] referencies the name of the dependency
          node = nodeWithName(taskArray, taskArray[i].dependencies[0][0]);
          sum += node.duration;
        }
      }

      node = taskArray[i];

      node.EF = sum;
      node.ES = sum - node.duration - 1;
    }


    var holePosition = 0;
    var valueToInsert = 0;

    for(var i = 0; i < taskArray.length; i++) {
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

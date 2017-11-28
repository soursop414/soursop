toposort = require('toposort');

criticalPath();

function criticalPath() {
    const toposort = require("toposort");
    const Task = require("critical-path").Task;

    // var taskA = new Task({cost: 10, name: 'A', duration: 10});
    // var taskB = new Task({cost: 20, depends: [taskA], name: 'B', duration: 20});
    // var taskC = new Task({cost: 5, depends: [taskB], name: 'C', duration: 5});
    // var taskD = new Task({cost: 10, depends: [taskC], name: 'D', duration: 10});
    // var taskF = new Task({cost: 15, depends: [taskA], name: 'F', duration: 15});
    // var taskG = new Task({cost: 5, depends: [taskC, taskF], name: 'G', duration: 5});
    // var taskH = new Task({cost: 15, depends: [taskA], name: 'H', duration: 15});
    // var taskE = new Task({cost: 20, depends: [taskD, taskG, taskH], name: 'E', duration: 20});

    var taskA = new Task({cost: 10, name: 'A', duration: 10});
    var taskB = new Task({cost: 5, depends: [taskA], name: 'B', duration: 5});
    var taskC = new Task({cost: 3, depends: [taskB, taskD, taskE], name: 'C', duration: 3});
    var taskD = new Task({cost: 2, depends: [taskA], name: 'D', duration: 2});
    var taskE = new Task({cost: 1, depends:[taskA], name:'E', duration: 1});
    var testTaskArray = [taskA, taskB, taskC, taskD, taskE];

    console.log(testTaskArray);
    console.log(criticalPath(testTaskArray));

    /*
    taskA.completeBefore = [taskB, taskF, taskH];
    taskB.completeBefore = [taskC];
    taskC.completeBefore = [taskD, taskG];
    taskD.completeBefore = [taskE];
    taskE.completeBefore = [];
    taskF.completeBefore = [taskG];
    taskG.completeBefore = [taskE];
    taskH.completeBefore = [taskE];
    */

    // var taskArray = [taskA, taskB, taskC, taskD, taskE, taskF, taskG, taskH];
    var edgeArray = [];
    var taskList = [];

    for (var i = 0; i < taskArray.length; i++) {
        for (var j = 0; j < taskArray[i].completeBefore.length; j++) {
            edgeArray.push([taskArray[i].name, taskArray[i].completeBefore[j].name]);
        }
    }

    toposort(edgeArray);

    for (var i = 0; i < taskArray.length; i++) {
        taskList.push([taskArray[i].name, taskArray[i].duration, taskArray[i].depends,
            calculateES(taskArray[i]) - taskArray[i].duration + 1, calculateES(taskArray[i])]);
    }

    return taskList;
}

function calculateES(task) {

    var ESList = [];

    if (task.depends.length == 0) {
        return task.duration;
    }

    for (var i = 0; i < task.depends.length; i++) {
        ESList.push(calculateES(task.depends[i]))
    }

    return Math.min.apply(null, ESList) + task.duration;
}

function test() {
  console.log('test');
}
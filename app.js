const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var path = require('path')

app.use(express.static('client'))
app.use(bodyParser.json())

// 2 entity types: tasks and people
var tasks = []
var people = []

/** directory of where it is stored */
const homepage = path.join(__dirname, '/client/homepage.html')

/** GET request: /. This renders the homepage of the site */
app.get('/', function (req, resp) {
  resp.sendFile(homepage)
})

/** GET request for: Tasks.
 * Allows the user to search for just a person, just a task or both.
 * @param taskNameQuery - The name of the task being searched for
 * @param dueDateQuery - The due date of the task being searched for
 * These paramaters work independently, or together if more than 1 parameter is supplied. For example, the user could search for: taskNameQuery: task, dueDateQuery: EMPTY, personQuery: me. Or the user could search: taskNameQuery: EMPTY, dueDateQuery: EMPTY, personQuery: me. Different combinations like these all work. */
app.get('/tasks/searchForTask/:taskNameQuery/:dueDateQuery', (req, resp) => {
  var searchResults = []
  var taskName = req.params.taskNameQuery
  var dueDate = req.params.dueDateQuery

  tasks.forEach(function (taskObject, index) {
    var counter = 0
    taskObject.forEach(function (task, index) {
      if (counter > 0) {
        if (taskName === 'NULL' & dueDate !== 'NULL') {
          if (task[1] === dueDate) {
            searchResults.push(task)
          }
        } else if (taskName !== 'NULL' & dueDate === 'NULL') {
          if (task[0] === taskName) {
            searchResults.push(task)
          }
        } else if (taskName !== 'NULL' & dueDate !== 'NULL') {
          if (task[0] === taskName & task[1] === dueDate) {
            searchResults.push(task)
          }
        }
      } else {
        counter = counter + 1
      }
    })
  })
  resp.status(200).json(searchResults)
})

/** GET request for: People.
 * Allows the user to search for just a person, just a task or both.
 * @param taskNameQuery - The name of the task being searched for
 * @param dueDateQuery - The due date of the task being searched for
 * @param personQuery - The name of the person being searched for
 * These paramaters work independently, or together if more than 1 parameter is supplied. For example, the user could search for: taskNameQuery: task, dueDateQuery: EMPTY, personQuery: me. Or the user could search: taskNameQuery: EMPTY, dueDateQuery: EMPTY, personQuery: me. Different combinations like these all work. */
app.get('/people/searchForTask/:taskNameQuery/:dueDateQuery/:personQuery', (req, resp) => {
  var taskName = req.params.taskNameQuery
  var dueDate = req.params.dueDateQuery
  var personQuery = req.params.personQuery
  var searchResults = []

  people.forEach(function (personArray, index) {
    if (personArray[0] === personQuery) {
      if (taskName === 'NULL' && dueDate === 'NULL') {
        personArray[1].forEach(function (task, index) {
          searchResults.push(task)
        })
      } else if (taskName === 'NULL' && dueDate !== 'NULL') {
        personArray[1].forEach(function (task, index) {
          if (task[1] === dueDate) {
            searchResults.push(task)
          }
        })
      } else if (taskName !== 'NULL' && dueDate === 'NULL') {
        personArray[1].forEach(function (task, index) {
          if (task[0] === taskName) {
            searchResults.push(task)
          }
        })
      } else if (taskName !== 'NULL' && dueDate !== 'NULL') {
        personArray[1].forEach(function (task, index) {
          if (task[0] === taskName && task[1] === dueDate) {
            searchResults.push(task)
          }
        })
      }
    }
  })

  resp.json(searchResults)
})

/** GET request for: Tasks. This returns the task data structure. */
app.get('/tasks/getTasks', function (req, resp) {
  resp.json(tasks)
})

/** GET request for: People. This returns the people data structure. */
app.get('/people/getPeople', function (req, resp) {
  resp.json(people)
})

/** GET request for: Tasks.
 * This allows the user to view a particular task.
 * @param taskName - The name of the particular task to be viewed
 * @param dueDate - The due date of the particular task to be viewed
 * @param desc - The description of the particular task to be viewed */
app.get('/tasks/viewTask/:taskName/:dueDate/:desc', function (req, resp) {
  var taskName = req.params.taskName
  var dueDate = req.params.dueDate
  var desc = req.params.desc

  var relevantTasks = []
  tasks.forEach(function (taskArray, index) {
    var counter = 0
    taskArray.forEach(function (task, index) {
      if (counter > 0) {
        if (task[0] === taskName & task[1] === dueDate & task[2] === desc) {
          relevantTasks.push(task)
        }
      } else {
        counter = counter + 1
      }
    })
  })
  resp.json(relevantTasks)
})

/** GET request for: Tasks.
 * This allows the user to view the tasks for a particular day if the number of tasks due on that day is greater than 3. This allows for a better User Experience as the tasks wont be crammed into a small space.
 * @param specificDate - The date of the extra tasks the user would like to see. */
app.get('/tasks/seeExtraTasks/:specificDate', function (req, resp) {
  var specificDate = req.params.specificDate
  var relevantTasks = []
  tasks.forEach(function (taskArray, index) {
    var counter = 0
    taskArray.forEach(function (task, index) {
      if (counter > 0) {
        if (task[1] === specificDate) {
          relevantTasks.push(task) // WAS ADDING IN RELEVANT DAY TASK TABLE THING
        }
      } else {
        counter = counter + 1
      }
    })
  })
  resp.json(relevantTasks)
})

/** POST request for: Tasks.
 * This allows the user to add a new task to the tasks data structure and the people data structure.
 * @param taskName - The name of the task to be added
 * @param dueDate - The due date of the task to be added
 * @param desc - The description of the task to be added
 * @param person - The person to which the task to be added belongs */
app.post('/tasks/addNewTask', function (req, resp) {
  var taskName = req.body.taskName
  var dueDate = req.body.dueDate
  var desc = req.body.desc
  var person = req.body.person

  var dueDateDate = dueDate.slice(0, 2)
  var dueDateMonth = parseInt(dueDate.slice(3, 5))
  var dueDateYear = dueDate.slice(6, 10)

  if (dueDateMonth < 10) {
    var dueDateMonthString = '0'
    dueDateMonthString += dueDateMonth
    dueDateMonth = dueDateMonthString
  }
  const dueDateObject = new Date(`${dueDateYear}-${dueDateMonth}-${dueDateDate}`)
  var weekStart
  weekStart = getWeekInfo(dueDateObject)

  addNewTask(tasks, taskName, dueDate, desc, weekStart, person)
  resp.json(tasks)
})

/** POST request for: People.
 * This allows the user to add a new task to the tasks data structure and the people data structure.
 * @param taskName - The name of the task to be added
 * @param dueDate - The due date of the task to be added
 * @param desc - The description of the task to be added
 * @param person - The person to which the task to be added belongs */
app.post('/people/addNewTask', function (req, resp) {
  var taskName = req.body.taskName
  var dueDate = req.body.dueDate
  var desc = req.body.desc
  var person = req.body.person

  addTaskToPerson(people, taskName, dueDate, desc, person)
  resp.json('')
})

/** POST request for: Tasks.
 * This is called to update the task in the tasks data structure to signal that the task is currently being displayed on the homepage table.
 * @param taskName - The name of the task to be updated in the tasks data structure */
app.post('/tasks/updateTask', function (req, resp) {
  var taskName = req.body.taskName
  tasks.forEach(function (taskObject, index) {
    var counter = 0
    taskObject.forEach(function (task, index) {
      if (counter > 0) {
        if (task[0] === taskName) {
          task[3] = true
        }
      } else {
        counter = counter + 1
      }
    })
  })
  resp.json('Successful Update of Task')
})

/** POST request for: Tasks and People.
 * This allows the user to edit a pre-existing task in the tasks data structure and the people data structure.
 * @param newTaskName - The new name of the task to be edited
 * @param newDueDate - The new due date of the task to be edited
 * @param newDesc - The new description of the task to be edited
 * @param newPerson - The new person to which the edited task belongs */
app.post('/tasks/editTask', function (req, resp) {
  var newTaskName = req.body.newTaskName
  var newDueDate = req.body.newDueDate
  var newDesc = req.body.newDesc
  var newPerson = req.body.newPerson

  var newTaskDate = newDueDate.slice(0, 2)
  var newTaskMonth = newDueDate.slice(3, 5)
  var newTaskYear = newDueDate.slice(6, 10)
  var newTaskDateObject = new Date(newTaskYear + '.' + newTaskMonth + '.' + newTaskDate) // maybe wrong

  var oldTaskName = req.body.oldTaskName
  var oldDueDate = req.body.oldDueDate
  var oldDesc = req.body.oldDesc
  var oldPerson = req.body.oldPerson

  var oldTaskDate = oldDueDate.slice(0, 2)
  var oldTaskMonth = oldDueDate.slice(3, 5)
  var OldTaskYear = oldDueDate.slice(6, 10)
  var oldTaskDateObject = new Date(OldTaskYear + '.' + oldTaskMonth + '.' + oldTaskDate) // maybe wrong
  var oldWeekStart = getWeekInfo(oldTaskDateObject)
  var oldWeekStartObject = new Date(oldWeekStart)

  editTask(tasks, oldTaskName, oldDueDate, oldDesc, oldPerson, oldWeekStartObject, newTaskName, newDueDate, newDesc, newPerson, newTaskDateObject)

  resp.json('successful edit')
})

/** POST request for: Tasks and People.
 * This allows the user to edit a pre-existing task in the tasks data structure and the people data structure.
 * @param newTaskName - The new name of the task to be edited
 * @param newDueDate - The new due date of the task to be edited
 * @param newDesc - The new description of the task to be edited
 * @param newPerson - The new person to which the edited task belongs */
app.post('/people/editTask', function (req, resp) {
  var newTaskName = req.body.newTaskName
  var newDueDate = req.body.newDueDate
  var newDesc = req.body.newDesc
  var newPerson = req.body.newPerson
  var oldTaskName = req.body.oldTaskName
  var oldDueDate = req.body.oldDueDate
  var oldDesc = req.body.oldDesc

  editPersonTasks(people, oldTaskName, oldDueDate, oldDesc, newPerson, newTaskName, newDueDate, newDesc)

  resp.send('successful edit')
})

/** POST request for: Tasks and People.
 * This allows the user to delete a pre-existing task in the tasks data structure and the people data structure.
 * @param taskName - The name of the task to be deleted
 * @param dueDate - The due date of the task to be deleted
 * @param desc - The description of the task to be deleted
 * @param person - The person to which the task to be deleted belongs to */
app.post('/tasks/deleteTask', function (req, resp) {
  var taskName = req.body.taskName
  var dueDate = req.body.dueDate
  var desc = req.body.desc
  var person = req.body.person

  deleteTask(tasks, taskName, dueDate, desc, person)

  resp.send('Successful Deletion of Task')
})

/** POST request for: Tasks and People.
 * This allows the user to delete a pre-existing task in the tasks data structure and the people data structure.
 * @param taskName - The name of the task to be deleted
 * @param dueDate - The due date of the task to be deleted
 * @param desc - The description of the task to be deleted
 * @param person - The person to which the task to be deleted belongs to */
app.post('/people/deleteTask', function (req, resp) {
  var taskName = req.body.taskName
  var dueDate = req.body.dueDate
  var desc = req.body.desc

  deletePersonTask(people, taskName, dueDate, desc)

  resp.send('Successful Deletion of Task')
})

/** This is a function that calculates the date of the beginning of the week for a given task date. */
function getWeekInfo (date) {
  var today = date
  var day = today.getDay()

  if (day === 0) {
    day = 7
  }
  var weekStart = today

  weekStart.setDate(today.getDate() - (day - 1))
  var weekStartYear = weekStart.getFullYear()
  var weekStartMonth = weekStart.getMonth() + 1
  var weekStartDate = weekStart.getDate()

  if (weekStartMonth < 10) {
    var weekStartMonthString = '0'
    weekStartMonthString += weekStartMonth
    weekStartMonth = weekStartMonthString
  }

  var weekStartInfo = weekStartDate + '.' + weekStartMonth + '.' + weekStartYear
  return weekStartInfo
}

/** This is a function that adds a new task to the tasks data structure. */
function addNewTask (tasks, taskName, dueDate, desc, weekStart, person) {
  var done = false

  tasks.forEach(function (task, index) {
    if (task[0] === weekStart) {
      task.push([taskName, dueDate, desc, false, person])
      done = true
    }
  })

  if (done === false) {
    tasks.push([weekStart, [taskName, dueDate, desc, false, person]])
  }
}

/** This is a function that edits a pre-existing task in the tasks data structure to a new task supplied by the user. */
function editTask (tasks, oldTaskName, oldDueDate, oldDesc, oldPerson, oldWeekStartObject, newTaskName, newDueDate, newDesc, newPerson, newTaskDateObject) {
  tasks.forEach(function (taskArray, index) {
    var counter = 0
    taskArray.forEach(function (task, index) {
      if (counter > 0) {
        if (task[0] === oldTaskName & task[1] === oldDueDate & task[2] === oldDesc & task[4] === oldPerson) {
          // is new task within the same week as old task
          var difference = 0
          while (oldWeekStartObject.getDate() !== newTaskDateObject.getDate()) {
            difference += 1
            oldWeekStartObject.setDate(oldWeekStartObject.getDate() + 1)
            if (difference > 6) {
              break
            }
          }
          if (difference <= 6) {
            // it is in teh same week
            task[0] = newTaskName
            task[1] = newDueDate
            task[2] = newDesc
            task[4] = newPerson
          } else {
            // it is not in the same week
            var newWeekStart = getWeekInfo(newTaskDateObject)
            addNewTask(tasks, newTaskName, newDueDate, newDesc, newWeekStart, newPerson)
            deleteTask(tasks, oldTaskName, oldDueDate, oldDesc, oldPerson)
            deletePersonTask(people, oldTaskName, oldDueDate, oldDesc)
          }
        }
      } else {
        counter = counter + 1
      }
    })
  })
}

/** This is a function that deletes a pre-existing task from the tasks data structure. */
function deleteTask (tasks, taskName, dueDate, desc, person) {
  tasks.forEach(function (taskArray, taskArrayIndex) {
    var counter = 0
    taskArray.forEach(function (task, taskIndex) {
      if (counter > 0) {
        if (task[0] === taskName & task[1] === dueDate & task[2] === desc & task[4] === person) {
          delete tasks[taskArrayIndex][taskIndex]
        }
      } else {
        counter = counter + 1
      }
    })
  })
}

/** This is a function that adds a task to a person in the people data structure. */
function addTaskToPerson (people, taskName, dueDate, desc, person) {
  var done = false
  people.forEach(function (personArray, arrayIndex) {
    if (personArray[0] === person) {
      personArray[1].push([taskName, dueDate, desc])
      done = true
    }
  })
  if (done === false) {
    people.push([person, [[taskName, dueDate, desc]]])
  }
}

/** This is a function that edits a pre-existing task in the people data structure. */
function editPersonTasks (people, oldTaskName, oldDueDate, oldDesc, newPerson, newTaskName, newDueDate, newDesc) {
  deletePersonTask(people, oldTaskName, oldDueDate, oldDesc)
  var done = false
  people.forEach(function (personArray, arrayIndex) {
    if (done === false) {
      var counter = 0
      personArray.forEach(function (tasks, index) {
        if (counter === 0) {
          if (tasks === newPerson) {
            people[arrayIndex][index + 1].push([newTaskName, newDueDate, newDesc])
            done = true
            counter = counter + 1
          }
        }
      })
    }
  })

  // if new person doesnt exist
  if (done === false) {
    people.push([newPerson, [[newTaskName, newDueDate, newDesc]]])
    done = true
  }
}

/** This is a function that deletes a pre-existing task in the people data structure. */
function deletePersonTask (people, taskName, dueDate, desc) {
  people.forEach(function (personArray, arrayIndex) {
    var counter = 0
    personArray.forEach(function (tasks, tasksIndex) {
      if (counter > 0) {
        tasks.forEach(function (task, taskIndex) {
          if (task[0] === taskName & task[1] === dueDate & task[2] === desc) {
            delete people[arrayIndex][tasksIndex][taskIndex]
          }
        })
      } else {
        counter = counter + 1
      }
    })
  })
}

module.exports = app

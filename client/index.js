function initialiseDates () {
  var dateInfo = new Date()
  var year = dateInfo.getFullYear()
  var month = dateInfo.getMonth() + 1
  var date = dateInfo.getDate()
  var day = dateInfo.getDay()

  if (day === 0) {
    day = 7
  }
  if (day === 1) {
    document.getElementById('Mon').style.color = 'red'
  };
  if (day === 2) {
    document.getElementById('Tue').style.color = 'red'
  };
  if (day === 3) {
    document.getElementById('Wed').style.color = 'red'
  };
  if (day === 4) {
    document.getElementById('Thu').style.color = 'red'
  };
  if (day === 5) {
    document.getElementById('Fri').style.color = 'red'
  };
  if (day === 6) {
    document.getElementById('Sat').style.color = 'red'
  };
  if (day === 7) {
    document.getElementById('Sun').style.color = 'red'
  };

  dateInfo.setDate(dateInfo.getDate() - (day - 1))
  year = dateInfo.getFullYear()
  month = dateInfo.getMonth() + 1
  if (month < 10) {
    var monthString = '0'
    monthString += month
    month = monthString
  }
  date = dateInfo.getDate()

  document.getElementById('weekStartDate').innerHTML = 'Week starting: ' + date + '.' + month + '.' + year
  var weekStartNormal = date + '.' + month + '.' + year
  var weekStartReversed = year + '.' + month + '.' + date
  return [weekStartNormal, weekStartReversed]
}

function loadTasksForTable () {
  var relevantTasks = []
  var weekStart = initialiseDates()[0]

  try {
    fetch('http://127.0.0.1:8090/tasks/getTasks')
      .then(response => response.json())
      .then(body => {
        body.forEach(function (task, index) {
          if (weekStart === task[0]) {
            relevantTasks.push(task)
          }
        })
        displayTasks(relevantTasks)
      })
  } catch (e) {
    alert(e)
  }
}

function displayTasks (tasksToDisplay) {
  var counter = 0
  tasksToDisplay.forEach(function (taskObject, index) {
    taskObject.forEach(function (task, index) {
      if (task !== null) {
        if (counter > 0) {
          var wholeDate = task[1]

          var taskDate = wholeDate.slice(0, 2)
          var taskMonth = wholeDate.slice(3, 5)
          var taskYear = wholeDate.slice(6, 10)

          taskDate = parseInt(taskDate)
          var weekStartDate = initialiseDates()[1]

          var difference = 1
          var taskDateObject = new Date(`${taskYear}-${taskMonth}-${taskDate}`)
          var weekStartObject = new Date(weekStartDate)
          var weekStartObjectDate = weekStartObject.getDate()

          while (weekStartObject.getDate() !== taskDateObject.getDate()) {
            difference += 1
            weekStartObject.setDate(weekStartObject.getDate() + 1)
          }
          weekStartObject.setDate(weekStartObjectDate)

          var i = 1
          var maxRowCount = 3 // CHANGE THIS WHEN YOU ADD NEW ROWS
          while (document.getElementById(`r${i}d${difference}`).className === 'card') {
            i = i + 1
            if (i > maxRowCount) {
              break
            }
          }
          if (i <= maxRowCount) {
            document.getElementById(`r${i}d${difference}`).innerHTML = `<button id='${task[0]}/${task[1]}/${task[2]}' type='submit' style='margin: 0px'><h3>${task[0]}</h3></button><p>Who: ${task[4]}</p><p>Due: ${task[1]}</p>`
            document.getElementById(`r${i}d${difference}`).className = 'card'
            document.getElementById(`${task[0]}/${task[1]}/${task[2]}`).addEventListener('click', function (event) {
              viewTask(task[0], task[1], task[2])
            })
            try {
              fetch('http://127.0.0.1:8090/tasks/updateTask', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  taskName: task[0]
                })
              })
                .then(response => response.json())
            } catch (e) {
              alert(e)
            }
          } else {
            document.getElementById(`r${i}d${difference}`).innerHTML = '<button id=\'seeExtraTasksButton\' type=\'submit\' style=\'margin: 0px\'><h3>See more...</h3></button>'
            document.getElementById(`r${i}d${difference}`).className = 'card'
            document.getElementById('seeExtraTasksButton').addEventListener('click', function (event) {
              if (taskDate < 10) {
                if (`${taskDate}`.includes('0')) {
                } else {
                  var taskDateString = '0'
                  taskDateString += taskDate
                  taskDate = taskDateString
                }
              }
              var specificDate = taskDate + '.' + taskMonth + '.' + taskYear
              try {
                fetch('http://127.0.0.1:8090/tasks/seeExtraTasks/' + specificDate)
                  .then(response => response.json())
                  .then(body => {
                    document.getElementById('toDoTable').style = 'visibility: hidden;'
                    document.getElementById('specificDayTable').innerHTML = `<h3 style='padding: 10px; margin: 0px; font-size: 30px'>All tasks on: ${specificDate}</h3><table id='specificDayTaskTable'><tbody></tbody></table>`
                    document.getElementById('specificDayTable').style = 'visibility: visible;'

                    var table = document.getElementById('specificDayTaskTable')
                    var rowCounter = 0
                    var row = table.insertRow(0)
                    var taskCounter = 0
                    body.forEach(function (task, index) {
                      if (taskCounter > 5) {
                        rowCounter = rowCounter + 1
                        row = table.insertRow(rowCounter)
                        taskCounter = 0
                      }
                      var cell = row.insertCell(taskCounter)
                      cell.innerHTML = `<button id='${task[0]}/${task[1]}/${task[2]}' type='submit' style='margin: 0px'><h3>${task[0]}</h3></button><p>Who: ${task[4]}</p><p>Due: ${task[1]}</p>`
                      cell.className = 'card' // here
                      document.getElementById(`${task[0]}/${task[1]}/${task[2]}`).addEventListener('click', function (event) {
                        viewTask(task[0], task[1], task[2])
                      })
                      taskCounter = taskCounter + 1
                    })
                  })
              } catch (e) {
                alert(e)
              }
            })
          }
        } else {
          counter = counter + 1
        }
      }
    })
  })
}

function viewTask (taskName, dueDate, desc) {
  console.log('VIEW TASK CALLED')
  try {
    fetch(`http://127.0.0.1:8090/tasks/viewTask/${taskName}/${dueDate}/${desc}`)
      .then(response => response.json())
      .then(body => {
        document.getElementById('toDoTable').style = 'visibility: hidden; height: 0px; width: 0px;'
        document.getElementById('peopleTable').style = 'visibility: hidden; height: 0px; width: 0px;'

        document.getElementById('specificTaskTable').innerHTML = `<h3><span style='color: #FF9F1C'>Task: </span>${body[0][0]}</h3><br><p><span style='color: #2EC4B6'>Due Date: </span>${body[0][1]}</p><br><p><span style='color: #2EC4B6'>Description: </span>${body[0][2]}</p><br><p><span style='color: #2EC4B6'>Who: </span>${body[0][4]}</p><br><p id='editTaskButton'><span style='color: #FF9F1C'>Edit Task</span><p id='deleteTaskButton'><span style='color: red'>Delete Task</span><p>`
        document.getElementById('specificTaskTable').style = 'visibility: visible;'
        document.getElementById('editTaskButton').addEventListener('click', function (event) {
          document.getElementById('specificTaskTable').innerHTML = `<h3 style='color: #FF9F1C'>Editing task: <span style='color: white'>${body[0][0]}</span></h3><br><span style='color: #2EC4B6'>Task: </span><input id='editedTaskName' placeholder='${body[0][0]}'><br><span style='color: #2EC4B6'>Due Date: </span><input id='editedDueDate' placeholder='${body[0][1]}'><br><span style='color: #2EC4B6'>Description: </span><input id='editedDesc' placeholder='${body[0][2]}'><br><span style='color: #2EC4B6'>Who: </span><input id='editedPerson' placeholder='${body[0][4]}'><br><button id='submitEditedTaskButton' style="visibility: visible; color: black;";>Confirm</button>`
          document.getElementById('submitEditedTaskButton').addEventListener('click', function (event) {
            var newTaskName = document.getElementById('editedTaskName').value
            var newDueDate = document.getElementById('editedDueDate').value
            var newDesc = document.getElementById('editedDesc').value
            var newPerson = document.getElementById('editedPerson').value
            try {
              fetch('http://127.0.0.1:8090/tasks/editTask',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    newTaskName: newTaskName,
                    newDueDate: newDueDate,
                    newDesc: newDesc,
                    newPerson: newPerson,
                    oldTaskName: body[0][0],
                    oldDueDate: body[0][1],
                    oldDesc: body[0][2],
                    oldPerson: body[0][4]
                  })
                })
                .then(response => response.text())
                .then(body => {
                  console.log('')
                })
              fetch('http://127.0.0.1:8090/people/editTask',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    newTaskName: newTaskName,
                    newDueDate: newDueDate,
                    newDesc: newDesc,
                    newPerson: newPerson,
                    oldTaskName: body[0][0],
                    oldDueDate: body[0][1],
                    oldDesc: body[0][2],
                    oldPerson: body[0][4]
                  })
                })
                .then(response => response.text())
                .then(body => {
                  console.log(body)
                })
              goHome()
              clearTable()
              loadTasksForTable()
            } catch (e) {
              alert(e)
            }
          })
        })
        document.getElementById('deleteTaskButton').addEventListener('click', function (event) {
          try {
            fetch('http://127.0.0.1:8090/tasks/deleteTask',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  taskName: body[0][0],
                  dueDate: body[0][1],
                  desc: body[0][2],
                  person: body[0][4]
                })
              })
              .then(response => response.text())
              .then(body => {
                console.log('')
              })

            fetch('http://127.0.0.1:8090/people/deleteTask',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  taskName: body[0][0],
                  dueDate: body[0][1],
                  desc: body[0][2],
                  person: body[0][4]
                })
              })
              .then(response => response.text())
              .then(body => {
                console.log(body)
              })
            goHome()
            clearTable()
            loadTasksForTable()
          } catch (e) {
            alert(e)
          }
        })
      })
  } catch (e) {
    alert(e)
  }
}

function goHome () {
  document.getElementById('toDoTable').style = 'visibility: visible;'
  document.getElementById('specificDayTable').style = 'visibility: hidden; height: 0px; width: 0px'
  document.getElementById('specificTaskTable').style = 'visibility: hidden; height: 0px; width: 0px;'

  if (document.getElementById('submitNewTaskButton')) {
    document.getElementById('addNewTaskTable').style = 'visibility: hidden; width: 0; height: 0; border: 0px;'
    document.getElementById('addNewTaskH3').style = 'visibility: hidden; width: 0; height: 0; border: 0px;'
    document.getElementById('submitNewTaskButton').style = 'visibility: hidden'
  }
  if (document.getElementById('searchForTaskButton')) {
    document.getElementById('searchForTaskTable').style = 'visibility: hidden; width: 0; height: 0;'
    document.getElementById('searchForTaskButton').style = 'visibility: hidden'
  }
  if (document.getElementById('searchResultsTopper')) {
    document.getElementById('searchResultsTopper').style = 'visibility: hidden; width: 0; height: 0;'
    document.getElementById('searchResultsTable').style = 'visibility: hidden; width: 0; height: 0;'
  }

  if (document.getElementById('submitEditedTaskButton')) {
    document.getElementById('submitEditedTaskButton').style = 'visibility: hidden;'
  }

  if (document.getElementById('peopleTable')) {
    document.getElementById('peopleTable').style = 'visibility: hidden; height: 0px; width: 0px;'
  }
}

function clearTable () {
  var rowCounter = 1
  var colCounter = 1

  while (rowCounter <= 4) {
    document.getElementById(`r${rowCounter}d${colCounter}`).setAttribute('class', 'emptyCard')
    if (rowCounter === 1) {
      document.getElementById(`r${rowCounter}d${colCounter}`).innerHTML = '<h3>Today is free!</h3>'
    } else {
      document.getElementById(`r${rowCounter}d${colCounter}`).innerHTML = ''
    }

    if (colCounter === 7) {
      colCounter = 0
      rowCounter = rowCounter + 1
    }
    colCounter = colCounter + 1
  }
}

document.getElementById('addButton').addEventListener('click', function (event) {
  if (document.getElementById('searchForTaskButton')) {
    document.getElementById('searchForTaskTable').style = 'visibility: hidden; width: 0; height: 0;'
    document.getElementById('searchForTaskButton').style = 'visibility: hidden'
  }
  if (document.getElementById('searchResultsTopper')) {
    document.getElementById('searchResultsTopper').style = 'visibility: hidden; width: 0; height: 0;'
    document.getElementById('searchResultsTable').style = 'visibility: hidden; width: 0; height: 0;'
  }

  document.getElementById('addNewTaskTable').innerHTML = "<h3 id='addNewTaskH3'>Add a new task:</h3 ><form><input id='taskName' placeholder='Task Name (Please do not use question mark or slashes in the name)'><input id='dueDate' placeholder='Due Date (in the following format: dd.mm.yyyy)'><input id='desc' placeholder='Description (Please do not use question mark or slashes in the description)'><input id='person' placeholder='Whose task is this?'><button type='button' id='submitNewTaskButton'>Add</button></form>"
  document.getElementById('addNewTaskTable').style = 'visibility: visible'
  document.getElementById('submitNewTaskButton').style = 'visibility: visible'

  // here is where the call to the server is to add the task
  document.getElementById('submitNewTaskButton').addEventListener('click', function () {
    var taskName = document.getElementById('taskName').value
    var dueDate = document.getElementById('dueDate').value
    var desc = document.getElementById('desc').value
    var person = document.getElementById('person').value

    if (taskName.includes('/') || taskName.includes('?') || dueDate.includes('/') || desc.includes('/') || desc.includes('?') || person.includes('/') || person.includes('?')) {
      window.alert('Please use the correct format in the input fields!')
    } else {
      try {
        fetch('http://127.0.0.1:8090/people/addNewTask',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              taskName: taskName,
              dueDate: dueDate.toString(),
              desc: desc,
              person: person
            })
          })
          .then(response => response.json())
          .then(body => console.log('Added task to tasks and people'))
        fetch('http://127.0.0.1:8090/tasks/addNewTask',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              taskName: taskName,
              dueDate: dueDate.toString(),
              desc: desc,
              person: person
            })
          })
          .then(response => response.json())
          .then(body => {
            var weekStart = initialiseDates()[0]
            var tasksToDisplay = [weekStart]
            body.forEach(function (taskArray, index) {
              if (weekStart === taskArray[0]) {
                var counter = 0
                taskArray.forEach(function (task, index) {
                  if (task !== null) {
                    if (counter > 0) {
                      if (task[3] === false) {
                        tasksToDisplay.push(task)
                      }
                    } else {
                      counter = counter + 1
                    }
                  }
                })
              }
            })
            console.log('adding new task', tasksToDisplay)
            displayTasks([tasksToDisplay])
          })
      } catch (e) {
        alert(e)
      }
    }

    document.getElementById('addNewTaskTable').style = 'visibility: hidden; width: 0; height: 0; border: 0px;'
    document.getElementById('submitNewTaskButton').style = 'visibility: hidden'
  })
  console.log('added listener')
})

document.getElementById('searchButton').addEventListener('click', function (event) {
  if (document.getElementById('submitNewTaskButton')) {
    document.getElementById('addNewTaskTable').style = 'visibility: hidden; width: 0; height: 0; border: 0px;'
    document.getElementById('addNewTaskH3').style = 'visibility: hidden; width: 0; height: 0; border: 0px;'
    document.getElementById('submitNewTaskButton').style = 'visibility: hidden'
  }
  document.getElementById('searchForTaskTable').innerHTML = "<h3 id='searchForTaskH3'>Search for a task:</h3 ><form><input id='taskNameQuery' placeholder='Task Name (Please do not use question mark or slashes in the name)'><input id='dueDateQuery' placeholder='Due Date (in the following format: dd.mm.yyyy)'><input id='personQuery' placeholder='Person'><button type='button' id='searchForTaskButton'>Search</button></form>"
  document.getElementById('searchForTaskTable').style = 'visibility: visible;'
  document.getElementById('searchForTaskButton').style = 'visibility: visible'

  document.getElementById('searchForTaskButton').addEventListener('click', function (event) {
    var taskNameQuery = document.getElementById('taskNameQuery').value
    var dueDateQuery = document.getElementById('dueDateQuery').value
    var personQuery = document.getElementById('personQuery').value

    if (taskNameQuery === '' & dueDateQuery === '' & personQuery === '') {
      window.alert('Please enter information in either input field before pressing search!')
    }

    if (taskNameQuery === '' & dueDateQuery === '' & personQuery !== '') {
      taskNameQuery = 'NULL'
      dueDateQuery = 'NULL'
    } else if (taskNameQuery === '' & dueDateQuery !== '' & personQuery === '') {
      taskNameQuery = 'NULL'
      personQuery = 'NULL'
    } else if (taskNameQuery !== '' & dueDateQuery === '' & personQuery === '') {
      dueDateQuery = 'NULL'
      personQuery = 'NULL'
    } else if (taskNameQuery !== '' & dueDateQuery === '' & personQuery !== '') {
      dueDateQuery = 'NULL'
    } else if (taskNameQuery !== '' & dueDateQuery !== '' & personQuery === '') {
      personQuery = 'NULL'
    } else if (taskNameQuery === '' & dueDateQuery !== '' & personQuery !== '') {
      taskNameQuery = 'NULL'
    }

    if (personQuery === 'NULL') {
      try {
        fetch('http://127.0.0.1:8090/tasks/searchForTask/' + taskNameQuery + '/' + dueDateQuery)
          .then(response => response.json())
          .then(body => {
            document.getElementById('searchResultsTopper').innerHTML = "<h3 id='searchResultsH3' style='margin: 0px;'>Search Results: </h3>"
            if (body[0] === null) {
              document.getElementById('searchResultsTable').innerHTML = 'No results found!'
              document.getElementById('searchResultsTable').style = 'padding: 10px'
            } else {
              var textToDisplay = ''
              body.forEach(function (result, index) {
                textToDisplay += `<p><span style='color:#2EC4B6'>Task Name: </span><button id="${result[0]}, ${result[1]}, ${result[3]}">${result[0]}</button></p><p><span style='color:#2EC4B6'>Person: </span>${result[4]}</p><p><span style='color:#2EC4B6'>Due Date: </span>${result[1]}</p><p><span style='color:#2EC4B6'>Desc: </span>${result[2]}</p> <br>`
              })
              document.getElementById('searchResultsTable').innerHTML = textToDisplay
              body.forEach(function (result, index) {
                document.getElementById(`${result[0]}, ${result[1]}, ${result[3]}`).addEventListener('click', function (event) {
                  viewTask(result[0], result[1], result[2])
                })
              })
              document.getElementById('searchResultsTable').style = 'padding: 10px 10px 0px 10px;'
            }
          })
      } catch (e) {
        alert(e)
      }
    } else {
      try {
        fetch('http://127.0.0.1:8090/people/searchForTask/' + taskNameQuery + '/' + dueDateQuery + '/' + personQuery)
          .then(response => response.json())
          .then(body => {
            console.log(body)
            document.getElementById('searchResultsTopper').innerHTML = "<h3 id='searchResultsH3' style='margin: 0px;'>Search Results: </h3>"
            if (body[0] === null) {
              document.getElementById('searchResultsTable').innerHTML = 'No results found!'
              document.getElementById('searchResultsTable').style = 'padding: 10px'
            } else {
              var textToDisplay = ''
              body.forEach(function (result, index) {
                textToDisplay += `<p><span style='color:#2EC4B6'>Task Name: </span><button id="${result[0]}, ${result[1]}, ${result[3]}">${result[0]}</button></p><p><span style='color:#2EC4B6'>Person: </span>${personQuery}</p><p><span style='color:#2EC4B6'>Due Date: </span>${result[1]}</p><p><span style='color:#2EC4B6'>Desc: </span>${result[2]}</p> <br>`
              })
              document.getElementById('searchResultsTable').innerHTML = textToDisplay
              body.forEach(function (result, index) {
                document.getElementById(`${result[0]}, ${result[1]}, ${result[3]}`).addEventListener('click', function (event) {
                  viewTask(result[0], result[1], result[2])
                })
              })
              document.getElementById('searchResultsTable').style = 'padding: 10px 10px 0px 10px;'
            }
          })
      } catch (e) {
        alert(e)
      }
    }
  })
})

document.getElementById('peopleButton').addEventListener('click', function (event) {
  document.getElementById('toDoTable').style = 'visibility: hidden;'
  document.getElementById('specificDayTable').style = 'visibility: hidden; height: 0px; width: 0px'
  document.getElementById('specificTaskTable').style = 'visibility: hidden; height: 0px; width: 0px;'

  if (document.getElementById('submitNewTaskButton')) {
    document.getElementById('addNewTaskTable').style = 'visibility: hidden; width: 0; height: 0; border: 0px;'
    document.getElementById('addNewTaskH3').style = 'visibility: hidden; width: 0; height: 0; border: 0px;'
    document.getElementById('submitNewTaskButton').style = 'visibility: hidden'
  }
  if (document.getElementById('searchForTaskButton')) {
    document.getElementById('searchForTaskTable').style = 'visibility: hidden; width: 0; height: 0;'
    document.getElementById('searchForTaskButton').style = 'visibility: hidden'
  }
  if (document.getElementById('searchResultsTopper')) {
    document.getElementById('searchResultsTopper').style = 'visibility: hidden; width: 0; height: 0;'
    document.getElementById('searchResultsTable').style = 'visibility: hidden; width: 0; height: 0;'
  }

  if (document.getElementById('submitEditedTaskButton')) {
    document.getElementById('submitEditedTaskButton').style = 'visibility: hidden;'
  }

  document.getElementById('peopleTable').style = 'visibility: visible;'

  try {
    fetch('http://127.0.0.1:8090/people/getPeople')
      .then(response => response.json())
      .then(body => {
        var toBeDisplayed = '<h2 style=\'color: #FF9F1C; padding: 10px; font-size: 4rem;\'>People</h2><p>Scroll down to see an overview of each person who exists in the database...</p>'
        body.forEach(function (personArray, index) {
          toBeDisplayed += `<br><br><h3 style='font-size: 3rem;'><span style='color: #2EC4B6;'>Person: </span>${personArray[0]}</h3><br>`
          var counter = 0
          var hasTasks = false
          personArray.forEach(function (tasks, index) {
            if (counter > 0) {
              tasks.forEach(function (task, index) {
                if (task !== null) {
                  toBeDisplayed += `<br><br><p><p><span style='color:#FF9F1C'>Task Name: </span><button id="personTask,${task[0]}, ${task[1]}, ${task[2]}">${task[0]}</button></p><br><p><span style='color: #2EC4B6'>Due Date: </span>${task[1]}</p><br><p><span style='color: #2EC4B6'>Description: </span>${task[2]}</p><br>`
                  hasTasks = true
                }
              })
            } else {
              counter = counter + 1
            }
          })
          if (hasTasks === false) {
            toBeDisplayed += '<br><p>This person no longer has any tasks</p>'
          }
        })
        document.getElementById('peopleTable').innerHTML = toBeDisplayed
        body.forEach(function (personArray, index) {
          var counter = 0
          personArray.forEach(function (tasks, index) {
            if (counter > 0) {
              tasks.forEach(function (task, index) {
                if (task !== null) {
                  document.getElementById(`personTask,${task[0]}, ${task[1]}, ${task[2]}`).addEventListener('click', function (event) {
                    viewTask(task[0], task[1], task[2])
                  })
                }
              })
            } else {
              counter = counter + 1
            }
          })
        })
      })
  } catch (e) {
    alert(e)
  }
})

document.getElementById('dashboard').addEventListener('click', function (event) {
  goHome()
})

window.onload = function () {
  console.log('page reloaded')
  initialiseDates()
  loadTasksForTable()
}

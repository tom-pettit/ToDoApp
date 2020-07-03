# The To Do App

**This is a web application that is a to-do app, designed for families or smaller groups of people. To be hosted locally. **

[![OVERVIEW](https://snipboard.io/fsJPyI.jpg)]()

## Table of Contents 
- [Setup](#setup)
- [Features](#features)
- [Support](#support)
- [License](#license)

---

### Setup
> First, install the necessary dependencies by navigating to the directory in which you have downloaded the files, and then, in the shell type:
```shell
npm install
```

> The dependencies will then be installed. Next, navigate to the shell once again and type:
```shell
npm start
```

> This causes the server.js file to run, which in turn launches app.js, the file in which the server runs upon.

- The server will then be running on your localhost 8090 port: *127.0.0.1:8090*

---

## Features
> There are various different features of this To Do App

**Adding a new task**

[![ADD TASK](https://media.giphy.com/media/jnEFrBpZlbwP0HAywL/giphy.gif)]()

> When adding a new task, a Task Name, a Due Date, a Description and the Name of the person who this task belongs to:

- Task Name: This can't include a question mark or slashes in it, as these interfere with the POST request URL that is sent to the server.

- Due Date: This has to be in the format shown in the placeholder for the input. ie dd.mm.yy Again, this is so that slashes are not used which would interfere with the POST request.

- Description: Same as task name, can't include question mark or slashes.

- Name: Also shouldn't contain question mark or slashes.

---

**Searching for a task**

[![SEARCH TASK](https://media.giphy.com/media/Yo8rW9g3zMeJ9e4Ub0/giphy.gif)]()

> When searching for a task, you can search for:
- Just a task name
- Just a due date
- Just a person
- Or any combination of the above 3 

> Note, a search with no matches will result in an empty search result.

> Once you have searched for the task, and a result has come up, you can click on the task to access the View Task functionality, as shown below.

---

**Viewing a specific task**

[![VIEW TASK](https://media.giphy.com/media/ZbaGQBw5ziruJnVL1j/giphy.gif)]()

> This allows all the details of a task to be shown. 

> This also allows the user to edit or delete the task in question.

---

**Editing a task**

[![EDIT TASK](https://media.giphy.com/media/IdCklBJnihabcq6g0o/giphy.gif)]()

> This allows the user to edit a particular task that has been accessed using the view task functionality (as above).

> By pressing 'Edit Task', the user is presented with a new box. This box allows the user to type in new details for the task they want to edit, with the previous details of the task as the placeholders for each input field, which helps the user to remember the previous task description.

> When the user clicks 'Confirm', the task is immediately updated, and if the new task due date is in the week displayed on the home page, then the new task will be visible there immediately.

---

**Deleting a task**

[![DELETE TASK](https://media.giphy.com/media/kdQtMPRy4s5xSNbqWR/giphy.gif)]()

> This allows the user to delete a particular task that has been accessed using the view task functionality.

> If the task to be deleted had a due date that was in the week displayed on the home page, then the task is immediately removed from the home page, as well as from all records in the app.

---

**Viewing the different people and their tasks**

[![PEOPLE](https://media.giphy.com/media/JsoBhMNaU6Klx3FTxo/giphy.gif)]()

> This allows the user to view all the different people who have tasks, as well as all the tasks that these people have.

> If a user has since had all their tasks deleted, then the following will be shown underneath their name:


[![PEOPLE EMPTY](https://snipboard.io/7qufMl.jpg)]()

> The name of the tasks on this screen can also be clicked to open up a View Task instance, as described in the above 'Viewing a specific task' section.

---

## Support

Reach out to me at one of the following places!

- Reddit at <a href="https://www.reddit.com/user/TheGeeezer" target="_blank">`TheGeeezer`</a>
- Twitter at <a href="https://twitter.com/tozzzer" target="_blank">`@tozzzer`</a>

> I'm really not expecting any donations, but if you are feeling in a very generous mood, any donations would be greatly appreciated!

> [![PAYPAL](https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-200px.png)](https://paypal.me/tompettit7)



## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**

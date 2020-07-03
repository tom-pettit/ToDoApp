# The To Do App

**This is a web application that is a to-do app, designed for families or smaller groups of people.**

[![OVERVIEW](https://snipboard.io/fsJPyI.jpg)]()

## Table of Contents 
- [Setup](#setup)
- [Features](#features)
- [FAQ](#faq)
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
> There are many different methods that each RedditBot object can access

**Adding a new task**

[![ADD TASK](https://media.giphy.com/media/jnEFrBpZlbwP0HAywL/giphy.gif)]()

> When adding a new task, a Task Name, a Due Date, a Description and the Name of the person who this task belongs to:

- Task Name: This can't include a question mark or slashes in it, as these interfere with the POST request URL that is sent to the server.

- Due Date: This has to be in the format shown in the placeholder for the input. ie dd.mm.yy Again, this is so that slashes are not used which would interfere with the POST request.

- Description: Same as task name, can't include question mark or slashes.

- Name: Also shouldn't contain question mark or slashes.

**Searching for a task**

[![ADD TASK](https://media.giphy.com/media/jnEFrBpZlbwP0HAywL/giphy.gif)]()

---

## FAQ

- **Will there be new features coming soon?**
    - Absolutely! If you think there is a feature that should be added, then let me know!

> Please feel free to tell me any questions you think should be put here to help other people in the future!
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

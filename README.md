# The To Do App

**This is a web application that is a to-do app, designed for families or smaller groups of people.**

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

**Check if new posts are flaired**

```python
check_new_posts_flair(self) 
```
> When this method is run, it iterates through the newest posts to the subreddit. It then checks if these new posts have flairs. If they do, it leaves the post alone. However, if the post has no flair, the bot comments on the post to let the user know that they need to flair their post next time, and then it automatically makes the post hidden.

> To improve efficiency, an instance object is used to save the ID of posts that the bot has checked for a flair:

```python
self.visited_flaired_posts
```

> This means that when the bot checks the newest posts each time the method is called, it won't go through all its logic twice for the same post, as it saves the IDs of previously checked posts, and doesn't fulfill its logic if it has seen a post's ID before.

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

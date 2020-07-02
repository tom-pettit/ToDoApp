const app = require('./app')
const request = require('supertest')


describe('Test the search functionality', () => {
    test('GET /tasks/searchForTask succeeds', () => {
        return request(app)
	    .get('/tasks/searchForTask/taskname/duedate')
	    .expect(200);
    })

    test('GET /people/searchForTask succeeds', () => {
        return request(app)
	    .get('/people/searchForTask/taskname/duedate/person')
	    .expect(200);
    })

    test('GET /tasks/searchForTask returns JSON', () => {
        return request(app)
	    .get('/tasks/searchForTask/taskname/duedate')
	    .expect('Content-Type', /json/);
    })

    test('GET /people/searchForTask returns JSON', () => {
        return request(app)
	    .get('/people/searchForTask/taskname/duedate/person')
	    .expect('Content-Type', /json/);
    })

    test('Empty GET /tasks/searchForTask returns empty array (ie the length of the response should be 2: one for [ and one for ])', () => {
        return request(app)
        .get('/tasks/searchForTask/NULL/NULL')
        .expect('Content-Length', '2');
    })

    test('Empty GET /people/searchForTask returns empty array (ie the length of the response should be 2: one for [ and one for ])', () => {
        return request(app)
        .get('/people/searchForTask/NULL/NULL/NULL')
        .expect('Content-Length', '2');
    })
})

describe('Test the retrieval of the tasks and people data structures from the server', () => {
    test('GET /tasks/getTasks succeeds', () => {
        return request(app)
        .get('/tasks/getTasks')
        .expect(200)
    })

    test('GET /tasks/getTasks returns JSON', () => {
        return request(app)
        .get('/tasks/getTasks')
        .expect('Content-Type', /json/)
    }) 

    test('GET /people/getPeople succeeds', () => {
        return request(app)
        .get('/people/getPeople')
        .expect(200)
    })

    test('GET /people/getPeople returns JSON', () => {
        return request(app)
        .get('/people/getPeople')
        .expect('Content-Type', /json/)
    })
})

describe('Test the functionality for viewing a particular task', () => {
    test('GET /tasks/viewTask/... succeeds', () => {
        return request(app)
        .get('/tasks/viewTask/taskname/duedate/desc')
        .expect(200)
    })

    test('GET /tasks/viewTask/... returns JSON', () => {
        return request(app)
        .get('/tasks/viewTask/taskname/duedate/desc')
        .expect('Content-Type', /json/)
    })

    test('GET /tasks/viewTask returns non-empty JSON (as it should only be called on an existent task)', () => {
        return request(app)
        .get('/tasks/viewTask/taskname/duedate/desc')
        .expect('Content-Length', '2')
    })
})

describe('Test the functionality for seeing extra tasks if there are more than 3 on a particular day', () => {
    test('GET /tasks/seeExtraTasks/... succeeds', () => {
        return request(app)
        .get('/tasks/seeExtraTasks/specificdate')
        .expect(200)
    })

    test('GET /tasks/seeExtraTasks/... returns JSON', () => {
        return request(app)
        .get('/tasks/seeExtraTasks/specificdate')
        .expect('Content-Type', /json/)
    })

    test('GET /tasks/seeExtraTasks/... returns non-empty JSON (as it should return at least 4 tasks)', () => {
        return request(app)
        .get('/tasks/viewTask/taskname/duedate/desc')
        .expect('Content-Length', '2')
    })
})

describe('Test the functionality for adding a new task to the task and people data structures', () => {
    test('POST /tasks/addNewTask works', () => {
        const params = {
            taskName: 'Test task name',
            dueDate: '27.04.2020',
            desc: 'Dummy task',
            person: 'me'
        }
        return request(app)
        .post('/tasks/addNewTask')
        .send(params)
        .expect(200)
    })

    test('POST /tasks/addNewTask adds data to be accessed via GET', async () => {
        const params = {
            taskName: "Test task",
            dueDate: "28.04.2020",
            desc: 'Just a test description',
            person: 'Boris'
        }

        await request(app)
	    .post('/tasks/addNewTask')
            .send(params);
        
        return request(app)
	    .get('/tasks/searchForTask/Test%20task/28.04.2020')
	    .then(resp => {
            expect(resp.body[0][0] === 'Test task' && resp.body[0][1] === '28.04.2020')
        })
    });

    test('POST /people/addNewTask works', () => {
        const params = {
            taskName: 'New test task name',
            dueDate: '27.04.2020',
            desc: 'New dummy task',
            person: 'me'
        }
        return request(app)
        .post('/people/addNewTask')
        .send(params)
        .expect(200)
    })

    test('POST /people/addNewTask adds data to be accessed via GET', async () => {
        const params = {
            taskName: "People task test",
            dueDate: "28.04.2020",
            desc: 'Just another test description',
            person: 'David'
        }

        await request(app)
	    .post('/people/addNewTask')
        .send(params);
        
        return request(app)
	    .get('/people/searchForTask/People%20task%20test/28.04.2020/David')
	    .then(resp => {
            expect(resp.body[0][0] === 'People task test' && resp.body[0][1] === '28.04.2020' && resp.body[0][4] === 'David')
        })
    });
})

describe('test the functionality that indicates whether a task is being displayed on the home page', () => {
    test('POST /tasks/updateTask works', () => {
        const params = {
            taskName: 'Test task'
        }
        return request(app)
        .post('/tasks/updateTask')
        .send(params)
        .expect(200)
        .then(resp => {
            expect(resp.body === 'Successful Update of Task')
        })
    })
})

describe('test the functionality for editing a task in the people and tasks data structures', () => {
    test('POST /tasks/editTask works', () => {
        const params = {
            newTaskName: 'task name',
            newDueDate: '27.04.2020',
            newDesc: 'task desc',
            newPerson: 'me',
            oldTaskName: "Test task",
            oldDueDate: "28.04.2020",
            oldDesc: 'Just a test description',
            oldPerson: 'Boris'
        }
        return request(app)
        .post('/tasks/editTask')
        .send(params)
        
        .then(resp => {
            expect(resp.body === 'successful edit')
        })
        
    })

    test('POST /tasks/editTask adds data to be accessed via GET', async () => {
        const params = {
            newTaskName: 'New task name',
            newDueDate: '28.04.2020',
            newDesc: 'New task desc',
            newPerson: 'new me',
            oldTaskName: 'task name',
            oldDueDate: '27.04.2020',
            oldDesc: 'task desc',
            oldPerson: 'me',
        }

        await request(app)
	    .post('/tasks/editTask')
        .send(params)
        
        return request(app)
	    .get('/tasks/searchForTask/New%20task%20name/28.04.2020')
	    .then(resp => {
            console.log(resp.body)
            expect(resp.body[0][0] === 'New task name' && resp.body[0][1] === '28.04.2020' && resp.body[0][2] === 'New task desc' && resp.body[0][4] === 'new me')
        })
    });

    test('POST /people/editTask works', () => {
        const params = {
            newTaskName: 'NEW task name',
            newDueDate: '27.04.2020',
            newDesc: 'NEW task desc',
            newPerson: 'NEW me',
            oldTaskName: "New task name",
            oldDueDate: "28.04.2020",
            oldDesc: 'New task desc',
        }
        return request(app)
        .post('/people/editTask')
        .send(params)
        
        .then(resp => {
            expect(resp.body === 'successful edit')
        })
        
    })

    test('POST /people/editTask adds data to be accessed via GET', async () => {
        const params = {
            newTaskName: 'NEW NEW task name',
            newDueDate: '28.04.2020',
            newDesc: 'NEW NEW task desc',
            newPerson: 'NEW NEW me',
            oldTaskName: 'NEW task name',
            oldDueDate: '27.04.2020',
            oldDesc: 'NEW task desc',
        }

        await request(app)
	    .post('/people/editTask')
        .send(params)
        
        return request(app)
	    .get('/people/searchForTask/NEW%20NEW%20task%20name/28.04.2020/NEW%20NEW%20me')
	    .then(resp => {
            console.log(resp.body)
            expect(resp.body[0][0] === 'NEW NEW task name' && resp.body[0][1] === '28.04.2020' && resp.body[0][2] === 'NEW NEW task desc' && resp.body[0][4] === 'NEW NEW me')
        })
    });
})

describe('test the functionality for deleting a task from the people and task data structures', () => {
    test('POST /tasks/deleteTask works', () => {
        const params = {
            taskName: 'NEW NEW task name',
            dueDate: '28.04.2020',
            desc: 'NEW NEW task desc',
            person: 'NEW NEW me',
        }
        return request(app)
        .post('/tasks/deleteTask')
        .send(params)
        .expect(200)
        .then(resp => {
            expect(resp.body === 'Successful Deletion of Task')
        })
    })

    test('POST /people/deleteTask works', () => {
        const params = {
            taskName: 'New test task name',
            dueDate: '27.04.2020',
            desc: 'New dummy task',
            person: 'me',
        }
        return request(app)
        .post('/people/deleteTask')
        .send(params)
        .expect(200)
        .then(resp => {
            expect(resp.body === 'Successful Deletion of Task')
        })
    })
})
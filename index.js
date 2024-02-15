const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

function readUsers() {
    return new Promise((resolve, reject) => {
        fs.readFile('users.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

function writeUsers(users) {
    return new Promise((resolve, reject) => {
        fs.writeFile('users.json', JSON.stringify(users), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

app.get('/users', async (req, res) => {
    const users = await readUsers();
    res.json(users);
});

app.get('/users/:id', async (req, res) => {
    const users = await readUsers();
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        res.status(404).send('User not found');
    } else {
        res.json(user);
    }
});

app.post('/users', async (req, res) => {
    const users = await readUsers();
    const newUser = {...req.body, id: users.length + 1};
    users.push(newUser);
    await writeUsers(users);
    res.json(newUser);
});

app.put('/users/:id', async (req, res) => {
    const users = await readUsers();
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        res.status(404).send('User not found');
    } else {
        Object.assign(user, req.body);
        await writeUsers(users);
        res.json(user);
    }
});

app.delete('/users/:id', async (req, res) => {
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
        res.status(404).send('User not found');
    } else {
        users.splice(userIndex, 1);
        await writeUsers(users);
        res.send('User deleted');
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

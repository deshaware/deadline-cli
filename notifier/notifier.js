const express = require('express')
const notifier = require('node-notifier')
const path = require('path')
const app = express()


const port = process.env.PORT || 9000

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.post('/notify', (req, res) => {
    console.log(req.body)
    notify(req.body, (cb) => {
        cb ? res.send(cb) : res.status(404).send()
    })
})

app.get("/health", (req, res) => {
    res.status(200).send()
})
app.listen(port, () => {
    console.log("Server is up and running on port", port)
})


const notify = ({title, message}, cb) => {
    notifier.notify({
        title: title,
        message: message,
        icon: path.join(__dirname, 'img', '/deadline.png'),
        actions: ['Pending', 'Completed'],
        timeout: 15,
        open: true
        }, (err, data) => {
          // Will also wait until notification is closed.
          console.log('Waited');

          console.log(JSON.stringify({ err, data }, null, '\t'));
          err ? cb(false) : cb(data)
        }
      );
}

// Built-in actions:
notifier.on('timeout', () => {
    console.log('Timed out!');
  });
  notifier.on('activate', () => {
    console.log('Clicked!');
  });
  notifier.on('dismissed', () => {
    console.log('Dismissed!');
  });
  
  // Buttons actions (lower-case):
  notifier.on('pending', () => {
    console.log('"Ok" was pressed');
  });
  notifier.on('completed', () => {
    console.log('"Cancel" was pressed');
  });


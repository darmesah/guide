const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { options } = require('request');
const { response } = require('express');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.post('/', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const options = {
    url: 'https://us14.api.mailchimp.com/3.0/lists/79b657924a',
    method: 'POST',
    headers: {
      Authorization: 'auth 84a54d76b55244390536fed28f6e3609-us14',
    },
    body: jsonData,
  };

  request(options, (err, response, body) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('Server started at port 3000');
});

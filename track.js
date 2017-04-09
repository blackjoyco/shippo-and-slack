var express = require('express');
var Slack = require('slack-node');
var bodyParser = require('body-parser');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var server = app.listen(process.env.PORT, process.env.IP);

slack = new Slack();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 


webhookUri = process.env.SLACK_WEBHOOK_URL;
slack.setWebhook(webhookUri);

function sendMessageToSlackResponseURL(responseURL, JSONmessage){
    var postOptions = {
        uri: responseURL,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: JSONmessage
    };
    request(postOptions, (error, response, body) => {
        if (error){
           throw new Error('Cannot send Slack Message')
        }
    });
}


app.post('/track', urlencodedParser, (req, res) => {
    res.status(200).end(); // best practice to respond with empty 200 status code
    var reqBody = req.body;
    var responseURL = reqBody.response_url;
    if (reqBody.token != process.env.YOUR_APP_VERIFICATION_TOKEN){
        res.status(403).end("Access forbidden");
    } else{
        var message = {
            "text": "This is your first interactive message."       
}; sendMessageToSlackResponseURL(responseURL, message);
    } 
});
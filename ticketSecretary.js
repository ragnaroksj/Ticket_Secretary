var Flint = require('node-flint');
var webhook = require('node-flint/webhook');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
app.use(bodyParser.json());

// flint options
var config = {
  webhookUrl: 'https://ticket-secretary-ragnaroksj.c9users.io/flint',
  token: 'MDU5MGRhY2EtZDdmYy00ZDgzLTlhNGQtZDgwNjM3ZjYwYmQ2MjIyODk2YjUtMWI3',
  port: 8080 || process.env.PORT,
  removeWebhooksOnStart: false,
  maxConcurrent: 5,
  minTime: 50
};

// init flint
var flint = new Flint(config);
flint.start();
flint.messageFormat = 'markdown';

flint.hears('/hello', function(bot, trigger) {
  bot.say('Hello %s!', trigger.personDisplayName);
});

// define express path for incoming webhooks
app.post('/flint', webhook(flint));

// start express server
var server = app.listen(config.port, function () {
  flint.debug('Flint listening on port %s', config.port);
});

// gracefully shutdown (ctrl-c)
process.on('SIGINT', function() {
  flint.debug('stoppping...');
  server.close();
  flint.stop().then(function() {
    process.exit();
  });
});
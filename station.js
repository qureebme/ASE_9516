let request = require('request'),
    app = require('express')(),
    bodyParser = require('body-parser').json({ strict: false }),

    myIP = '192.168.3.100',
    http = require('http').Server(app),
    io = require('socket.io')(http),

    help = require('./helpers');

class Station {
    constructor(name, ip, eventPort) {
        this.name = name;
        this.ip = ip; // ip of the real station
        this.eventPort = eventPort; // for instances of this object
        this.baseURI = "http://" + ip + "/rest/events/"; // for subscriptions

        this.events = undefined; // events array
        this.eventCount = 0; // num of successful subscriptions

        this.inputs = undefined; // array
        this.inputCount = 0; // same idea as eventCount (initial input statuses)

        this.outputs = undefined; // array
        this.outputCount = 0; // same idea as eventCount (initial output statuses)
        //this.nInputs
        //this.nOutputs
        //this.nEvents
    }

    // specify events as an array
    getEvents(arr) {
        var ref = this;
        ref.events = arr;
        ref.nEvents = arr.length;
    }

    // make a POST request (for fetching IO values)
    fetchIOstatus(uri, body) {
        var ref = this;
        return new Promise(function(resolve, reject) {
            request.post({ uri: uri, json: true, body: {} }, function(err, res, body) {
                resolve(res.body); // expected body = {"IO_name": value}**********
            });
        });
    }

    //make a POST request (for subscriptions)
    makeSubscriptionPost(uri, body) {
        var ref = this;
        return new Promise(function(resolve, reject) {
            request.post({ uri: uri, json: true, body: body }, function(err, res, body) {
                if (res) {
                    resolve(res.statusCode);
                } else reject(new Error(ref.name + ": 1 subscription failed.   statusCode:", res.statusCode));
            });
        })
    }

    //make subscriptions
    subscribe() {
        var ref = this;
        if (ref.nEvents) {
            var uri = ref.baseURI + ref.events[ref.eventCount] + "/notifs";
            var body = { destUrl: "http://" + myIP + ":" + ref.eventPort };

            ref.makeSubscriptionPost(uri, body)
                .then(function(data) { // data is the response code to the most recent subscription
                    if (data.toString().substr(0, 1) == 2) { // success = 2xx
                        console.log(ref.events[ref.eventCount], 'SUBSCRIBED!');
                        ref.eventCount++;
                        if (ref.eventCount < ref.nEvents) {
                            return ref.subscribe(); // recursive
                        }
                    } else {
                        // what to do when a subscription fails?***************
                        //NOTIFY THE OPERATOR!
                    }
                })
                .catch(function(err) {
                    console.error(err);
                });
        } else {
            console.log(ref.name, ": No events specified, therefore no subscriptions.");
        }
    }

    //get the initial statuses of all inputs,
    //for DRAWing the initial state of the GUI
    // EACH STATION OBJECT SHOULD IMPLEMENT THIS METHOD DIFFERENTLY***************** OR
    // REPLACE THIS WITH A CALL TO THE showAllInputs service on each controller?*****
    initInputs() {
        var ref = this;
        //baseURI = "http://" + ref.ip + "/rest/services/";
        if (ref.nInputs) {
            var uri = ref.baseURI + ref.inputs[Object.keys(ref.inputs)[ref.inputCount]];
            var body = {};
            ref.fetchIOstatus(uri, body)
                .then(function(data) {
                    if (data) {
                        ref.inputs[Object.keys(ref.inputs)[ref.inputCount]] = data; //shd be data.something

                        ref.inputCount++;
                        if (ref.inputCount < ref.nInputs) {
                            return ref.initInputs(baseURI);
                        }
                    }
                })
                .catch(function(err) {
                    console.error(err);
                });
        }
    }

    // MUST CALL!
    // This function fetches all the inputs from the controller,
    // as defined in the showAllInputs Web service
    initInputs2() {
        let uri = "http://" + this.ip + "/rest/services/showAllInputs";
        request.post({ uri: uri, json: true, body: {} }, function(err, res, body) {
            this.inputs = Object.keys(res.body);
            this.nInputs = this.inputs.length;
            // and then emit an event carrying the statuses of the Inputs
            io.emit('initialStatus', res.body); //---> to the front-end
        })
    }

    initOutputs2() {
        let uri = "http://" + this.ip + "/rest/services/showAllOutputs";
        request.post({ uri: uri, json: true, body: {} }, function(err, res, body) {
            this.outputs = Object.keys(res.body);
            this.nOutputs = this.outputs.length;

            if (Object.values(res.body).includes(true)) {
                //problem: an output is set
                io.emit('initialStateError'); //---> to the front-end
                console.log("Error: check that no output on the station is active.");
            }
        })
    }

    //get the initial statuses of all outputs
    // DON'T FORGET: the outputs help us transition the GUI between states.
    initOutputs(baseURI) {
        var ref = this;
        //baseURI = "http://" + ref.ip + "/rest/services/";
        if (ref.nOutputs) {
            var uri = baseURI + ref.inputs[Object.keys(ref.outputs)[ref.outputCount]];
            var body = {};
            ref.fetchIOstatus(uri, body)
                .then(function(data) {
                    if (data) {
                        ref.inputs[Object.keys(ref.outputs)[ref.outputCount]] = data; // shd be data.something

                        ref.outputCount++;
                        if (ref.outputCount < ref.nOutputs) {
                            return ref.initOutputs(baseURI);
                        }
                    }
                })
                .catch(function(err) {
                    console.error(err);
                });
        }
    }

    //run a server
    runServer() {
        var ref = this;
        app.use(bodyParser);

        app.post('/', function(req, res) { // for event notifications
            console.log(req.body);
            res.end();
        });

        http.listen(ref.eventPort, function() {
            console.log(ref.name, 'is listening on port', ref.eventPort);
        });
    }
}

module.exports = Station;
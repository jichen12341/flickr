const { makeid } = require('./utils');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const readline = require('readline');
const port = process.env.PORT || 3000;

var gClientRooms = {};
var gDatabase;
var gState = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/*.*', (req, res) => {
    console.log(req.url);
    res.sendFile(__dirname + req.url);
});

init();

io.on('connection', (socket) => {

    socket.on('new game', () => {
        let roomName = makeid(5);
        gClientRooms[socket.id] = roomName;
        console.log("new game", gClientRooms);
        //state[roomName] = initGame();

        socket.join(roomName);
        socket.playerNo = 0;
        gState[roomName] = {'answer':[], 'ready':[true, true], 'photos':[]};

        //socket.emit('game code', roomName);

        init_flickr(socket, roomName);
    });

    socket.on('join game', (roomName) => {
        const clients = io.sockets.adapter.rooms.get(roomName);
        const numClients = clients ? clients.size : 0;

        console.log("join game", roomName, numClients);

        if (numClients === 0)
        {
            socket.emit('unknown code');
            return;
        }
        else if (numClients > 1)
        {
            socket.emit('too many players');
            return;
        }

        gClientRooms[socket.id] = roomName;
        socket.join(roomName);
        socket.playerNo = 1;

        handle_start_turn(roomName);
    });

    socket.on('guess', (guess) => {
        console.log('guess', guess);
        var roomName = gClientRooms[socket.id];
        isCorrect = guess === gState[roomName]['answer'][0];
        io.emit('verify', socket.playerNo, guess, isCorrect);
    });

    socket.on('ready', () => {
        var roomName = gClientRooms[socket.id];
        if (gState[roomName])
        {
            var ready = gState[roomName]['ready'];

            ready[socket.playerNo] = true;
            console.log("ready", ready);
            for (i = 0; i < ready.length; i++)
                if (ready[i] === false)
                    return;

            handle_start_turn(roomName);
        }
    });

    socket.on('heartbeat', () => {
        console.log('heartbeat', socket.playerNo, gClientRooms);
    });

    socket.on('disconnect', () => {
        console.log('disconnect');
        var roomName = gClientRooms[socket.id];
        delete gState[roomName];
        delete gClientRooms[socket.id];
    });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

///////////////////////////////////////////////////////////////////////////////
async function init()
{
    console.log("init");

    var rawData = fs.readFileSync("database.json", {encoding:'utf8', flag:'r'});
    gDatabase = JSON.parse(rawData);

    //gState["init"] = {'answer':[], 'ready':[true, true], 'photos':[]};
    //await get_answer("init");

}

async function init_flickr(socket, roomName)
{
    console.log("init_flickr", gState[roomName]);
    //while (true)
    {
        var photos = await get_answer("car");
        //console.log(photos);
        if (photos.length >= 10)
        {
            //break;
        }
    }
    socket.emit('game code', roomName, photos);


}

async function handle_start_turn(roomName)
{
    var ready = gState[roomName]['ready'];
    for (i = 0; i < ready.length; i++)
        ready[i] = false;

    while (true)
    {
        await get_answer(roomName);

        var photos = gState[roomName]['photos'];
        var ans = gState[roomName]['answer'];
        console.log("ret", photos.length);
        if (photos.length >= 10)
        {
            io.emit('start turn', ans, photos);
            break;
        }
    }
}

/*function get_answer(roomName)
{
    var count = gDatabase.length - 1;
    var index = Math.floor(Math.random() * count);
    var answer = gDatabase[index];
    gState[roomName]['answer'] = answer;

    return new Promise((resolve, reject) => {
        const s = require('duckduckgo-images-api');
        s.image_search({ query: answer[0], moderate: false, iterations: 1 }).then(results=> {
            //console.log(results);
            gState[roomName]['photos'] = results;
            resolve(gState[roomName]);
        });
    });
}*/

const Flickr = require("flickrapi");
const flickrOptions = {
    api_key: "793a43c4b81abed1439016035dcdc968",
    secret: "5f386c37a680a6f4",
    requestOptions: {
        timeout: 1000,
        /* other default options accepted by request.defaults */
    }
};
Flickr.tokenOnly(flickrOptions, function(err, flickrObject) {
    if (err)
    {
        return console.error(err);
    }
    //console.log('flickr', flickrObject);
    flickr = flickrObject;
});
function get_answer(word)
{
    return new Promise((resolve, reject) => {
        if (!flickr)
        {
            reject(res.status(500).json({ error: 'flickr not ready yet' }));
        }
        flickr.photos.search({
            text: word,
            page: 1,
            per_page: 18
        }, function(err, result) {
            //gState[roomName]['photos'] = result['photos']['photo'];
            resolve(result['photos']['photo']);
        });
    });
}
const express = require('express');
import { Express, Request, Response } from 'express';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { LiveChat } from "youtube-chat"
import { MessageText } from "youtube-chat/dist/types/yt-response";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const channelId = "UCSJ4gkVC6NrvII8umztf0Ow" // Lofi Girl
const liveChat = new LiveChat({ channelId: channelId })

const port = 3000;

let connection: Socket[] = []

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.get('/onAir', (req: Request, res: Response) => {
    io.sockets.emit("onAir", { onAir: true })
    res.send('OnAir');
});

app.get('/offAir', (req: Request, res: Response) => {
    io.sockets.emit("onAir", { onAir: false })
    res.send('Off Air');
});



liveChat.on("start", (liveId) => {
    /* Your code here! */
    console.log("liveChat.on(start)");
    console.log(liveId);
    
    
})

// Emit at end of observation chat.
// reason: string?
liveChat.on("end", (reason) => {
    /* Your code here! */
})

// Emit at receive chat.
// chat: ChatItem
liveChat.on("chat", (chatItem) => {
    /* Your code here! */

    let message = chatItem.message[0] as MessageText
    console.log(message.text);

    

    io.sockets.emit("chat", {
         msg: message.text,
         authorName: chatItem.author.name,
         authorThumbnail: chatItem.author.thumbnail?.url,
        })
    
    
})

// Emit when an error occurs
// err: Error or any
liveChat.on("error", (err) => {
    /* Your code here! */
})



io.on("connection", (socket: Socket) => {
    connection.push(socket);
    console.log("new conneciton");

    socket.on('disconnect', (data) => {
        connection.splice(connection.indexOf(socket), 1);
        console.log("Disconnect");

    })

    socket.on('srv', (data) => {
        console.log(data);
        io.sockets.emit("msg", { msg: "salut du server" })

    })

});

async function main() {
    const ok = await liveChat.start()
    if (!ok) {
        console.log("Failed to start, check emitted error")
    }
}


main()
httpServer.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
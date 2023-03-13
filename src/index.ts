const express = require('express');
import { Express, Request, Response } from 'express';
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const port = 3000;

let connection: Socket[] = []

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

app.get('/onAir', (req: Request, res: Response) => {
    io.sockets.emit("onAir", { onAir: true})
    res.send('OnAir');
});

app.get('/offAir', (req: Request, res: Response) => {
    io.sockets.emit("onAir", { onAir: false})
    res.send('Off Air');
});

  
io.on("connection", (socket: Socket) => {
    connection.push(socket);
    console.log("new conneciton");

    socket.on('disconnect', (data) => {
        connection.splice(connection.indexOf(socket), 1);
        console.log("Disconnect");
        
    })

    socket.on('srv', (data) => {
        console.log(data);
        io.sockets.emit("msg", {msg: "salut du server"})
        
    })
    
});

httpServer.listen(port, ()=> {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
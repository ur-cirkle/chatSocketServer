const http = require('http').createServer();
const mysql = require('mysql2');
const app = require("express")();
const knex = require("knex");
const cors = require("cors");
const { type } = require('os');
const { Socket } = require('dgram');
const { table } = require('console');
const io = require('socket.io')(http, {
    reconnect:true
});

var client;
const users = [];
const group = {};
app.use(cors());
const db = knex({
    client: 'mysql2',
    connection: {
        host:'localhost',
        user :'root',
        password :'1234567890',
        database:'test_db',
        port:3306
    }
  }) 
  
// db.schema.hasTable('private_messages').then(function(exists) {
//     if (!exists) {
//       return db.schema.createTable('private_messages', function(t) {
//         t.increments('id').primary();
//         t.string('sender', 100);
//         t.string('receiver', 100);
//         t.string("text")
//       });
//     }
//   });
// const db = mysql.createConnection({
//     host:'localhost',
//     user :'root',
//     password :'1234567890',
//     database:'test_db',
//     port:3306
// })

// db.connect((err) =>{
//     if(err){
//         console.log(err)
//     }
//     else{
       
//         console.log("mysql connected......")
//     }
// })

io.on('connection',(socket)=>{

    socket.on("onuser",(data) =>{
        console.log(data)
    })
//     socket.on('connected',(data)=>{
//         console.log(data,socket.id);

//  let sql = `select * from socketid_1 where username1='${data.user}'`;
// db.query(sql,(err,result)=>{
//     if (err) throw err;
//     console.log(result.length)
//     if (result.length==0){
//         let sql = `INSERT INTO api_name1(username1) VALUES ('${data.user}')`;
//         db.query(sql,(err,result)=>{
//             if (err) throw err;
//             console.log(result);   
//     })
//         sql = `INSERT INTO socketid_1 (socketid,username1) VALUES ('${socket.id}','${data.user}')`;
//         db.query(sql,(err,result)=>{
//             if (err) throw err;
//             console.log(result);
//         })
//     }
//     else{
//         let sql = `update socketid_1 set socketid = '${socket.id}' where username1 = '${data.user}'`;
//         db.query(sql,(err,result)=>{
//             if (err) throw err;
//             console.log(result,123);
//         })
        
        
//     }
// })
// sql = `select * from chatting_database where (sender= '${data.user}' and reciever ='${data.friend}') or (sender = '${data.friend}' and reciever = '${data.user}');`
// db.query(sql,(err,result)=>{
//     if (err) throw err;
    
//     socket.emit("allmessages",result);

// })
// })
    socket.on("private_chat",async(data) => {
        const {user,friend } = data;
        const messages = await db("private_messages").where("sender",user).andWhere("receiver",friend).orWhere("sender",friend).andWhere("receiver",user);
        
    })
   socket.on('user_connected',async (data) => {
    // let sql = `SELECT * FROM socketid_1  WHERE username1 = ${data.name1}`;
    // db.query(sql,(err,result)=>{
    //     if (err) throw err;
    //     console.log(result);
    // })
     const userInfo = await knex("socketid_1").where("username1" , data.username);

        if(userInfo.length === 0 ){
            await knex("socketid_1").insert({username1:username , socketid: socket.id });
        }
        else{
            await knex("socketid_1").update({socketid:socket.id})
        }
        io.to(users[data.name1]).emit('new_message',client);
        
   })
   socket.on('send-message',(data)=>{
    console.log(data.time,Date().split,77899);
    let sql = `SELECT * FROM socketid_1  WHERE username1 = '${data.reciever}'`;
    
     db.query(sql,(err,result)=>{
        if (err) throw err;
        console.log(result);
        const op = result[0];
        io.to(op.socketid).emit('recieve-message',data)
        sql  =  `insert into  chatting_database values ('${data.sender}','${data.reciever}','${data.text}');`
        db.query(sql,(err,result)=>{
            if(err)throw err;
            console.log(result);
        })

    })
      
   })
   socket.on('disconnect',(data)=>{

       console.log('user has been disconnected');
   })
   socket.on('newgroup',(data)=>{
       console.log(data)
       if (data.groupname in group){
        var error = "already";
       }
       else{
           var error ="notalready";
           group[data.groupname] = [data.name1]
           users[data.name1]=socket.id;
       }
       var data1 ={'error':error,'name1':data.name1}
       socket.emit('added',data1);
   })
   socket.on('addmember',(data)=>{
    
       console.log(data,group);
    var k =  group[data.groupname]
    if (data.friend in k){
        console.log(123);
    }
     else{
        if(data.groupname in group){
            group[data.groupname].push(data.friend)

            if (!users[data.friend]){
                users[data.friend] = socket.id
                console.log(users,123); 
        }
                   
            
          }
          else{
            group[data.groupname] = [data.friend]
            if (!users[data.friend]){
                users[data.friend] = socket.id
                console.log(users);
        }
            console.log(users);
          }
     }
   })
   socket.on('sending',(data)=>{
       console.log(data)
       const op = group[data.group];
       console.log(group[data.group],123);
        var i = 0
        for(i =0;i<op.length;i++){
            
            if(data.sender!=op[i]){
                console.log(users)
                console.log(op[i],56)
                io.to(users[op[i]]).emit('recieve',data);
            }
            
        }
   })
   
})


// // const app =  express();
// // app.use(cors);
// // app.get('/createddb',(req,res)=>{
// //     let sql = 'CREATE DATABASE nodemysql';
//     // db.query(sql,(err,result)=>{
//     //     if (err) throw err;
//     //     console.log(result);
//     //     res.send('Database created....')
//     // })
// // })
// // app.get('/createposttable',(req,res)=>{
// //     let sql = 'CREATE TABLE posts(username VARCHAR(50),password VARCHAR(50))'
// //     db.query(sql,(err,result)=>{
// //         if(err) throw err;
// //         res.send('Table created ...')
// //         console.log(result);
// //     })
// // })
// // app.get('/addpost1',(req,res)=>{
// //     let post = {username :'kandarp',password:'123456'};
// //     let sql = 'INSERT INTO posts set ?';
// //     let query = db.query(sql,post,(err,results)=>{
// //         if(err) throw err;
// //         console.log("Inserted ...")
// //         res.send("completed....")
// //     })
// // })

http.listen(3003,()=>{
    console.log('server connected')
})











// const feathers = require('@feathersjs/feathers');
// const express = require('@feathersjs/express');
// const socketio = require('@feathersjs/socketio');
// // A messages service that allows to create new
// // and return all existing messages
// class MessageService {
//   constructor() {
//     this.messages = [];
//   }

//   async find () {
//     // Just return all our messages
//     return this.messages;
//   }

//   async create (data,param) {
//     // The new message is the data merged with a unique identifier
//     // Add new message to the list
//     this.messages.push(data,param);
//     console.log(data)
//     return data;
//   }
// }

// // Creates an ExpressJS compatible Feathers application
// const app = express(feathers());
// // Parse HTTP JSON bodies
// app.use(express.json());
// // Parse URL-encoded params
// app.use(express.urlencoded({ extended: true }));
// // Host static files from the current folder
// app.use(express.static(__dirname));
// // Add REST API support
// app.configure(express.rest());
// // Configure Socket.io real-time APIs
// app.configure(socketio());
// // Register an in-memory messages service
// app.use('/message', new MessageService());
// // Register a nicer error handler than the default Express one
// app.use(express.errorHandler());

// // Add any new real-time connection to the `everybody` channel
// app.on('connection', connection =>
//   app.channel('everybody').join(connection)
// );
// // Publish all events to the `everybody` channel
// app.publish(data => app.channel('everybody'));

// // Start the server
// app.listen(3030).on('listening', () =>
//   console.log('Feathers server listening on localhost:3030')
// );


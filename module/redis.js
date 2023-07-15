const { createClient } =require('redis') ;

const client = createClient ({
    port:6379,
    host:'127.0.0.1'
});
client.on('connect',()=>{
    console.log('Connected')
})
client.on('ready',()=>{
    console.log('ready')
})
client.on('error', err => console.log('Redis Client Error', err));
client.on('end',()=>{
    console.log("Connection ended")
})



module.exports = client
global.discord = require('discord.js')
global.client = new discord.Client()
global.Collection = discord.Collection
global.db = require('./db')
global.Guild = require('./models/Guilds')
global.Guilds = new Collection()
global.MessageStatut = require('./models/message')
const config = require('./config.json')
require('./lib/websocket/websocket')
let fs =require('fs')

client.on('ready',()=>{
    console.log('READY');
    Guild.All()
    require('./lib/commands/handler')
    require('./lib/emoteEvent/emote')
    client.user.setPresence({ activity: { name: client.guilds.cache.size+" serveurs / !help" } })
})

client.on('guildCreate',(guild)=>{
    Guild.add(guild)
})

client.on('guildDelete',(guild)=>{
    Guild.remove(guild)
})

client.on("debug",d=>{console.log(d)})
client.login(config.token)

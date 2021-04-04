global.discord = require('discord.js');
global.client = new discord.Client(/*{ ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS'] }}*/);
global.MessageStatut = require('./lib/embed/embed')
require('./lib/db/d')

client.on('ready', () => {
    console.log("ready");
    client.user.setPresence({ activity: { name: client.guilds.cache.size+" serveurs / !help" } })
    require('./lib/roles/listener')
    require('./lib/command/handler')
    
    require('./lib/websocket/index')
});

client.on("guildMemberAdd",m=>{
    console.log('Nouveau Membre');
    try{    
        
        let gDB = GuildManager.guilds.get(m.guild.id)
        if(!gDB.global.publicMessage.active) return false
        if(gDB.global.publicMessage.channel == "") return false
        let ch = client.channels.resolve(gDB.global.publicMessage.channel)
        if(!ch) return false
        ch.send(gDB.global.publicMessage.arrive.replace("USER",`${m}`))
        if(!gDB.global.privateMesage.active) return false
        m.createDM().then(dm=>{
            dm.send(gDB.global.privateMesage.arrive).cacth(err=>{
                console.error(err);

            })
        }).cacth(err=>{
            console.error(err);
        })

    }catch(err){
        console.error(err);
    }

   
})
client.on("guildMemberRemove",m=>{
    try{

        let gDB = GuildManager.guilds.get(m.guild.id)
        if(!gDB.global.publicMessage.active) return false
        if(gDB.global.publicMessage.channel == "") return false
        let ch = client.channels.resolve(gDB.global.publicMessage.channel)
        if(!ch) return false
        ch.send(gDB.global.publicMessage.départ.replace("USER",`${m}`))
        if(!gDB.global.privateMesage.active) return false
        m.createDM().then(dm=>{
            dm.send(gDB.global.privateMesage.départ)
        })
    }catch(err){

    }

   
})

client.on('guildCreate',g=>{
    GuildManager.AddGuild(g)
})

client.login("TOKEN")


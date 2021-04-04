let mysql = require('mysql')

global.db = mysql.createConnection(
    {
        host:"",
        database:"",
        password:"",
        user:"",
        charset:"utf8mb4"
    }
)
db.connect()
const p = require('../musique/player')
const l = require('../level/level')
const r = require('../roles/roles')
let Guild = class{
    constructor(raw){
        this.player = new p(raw.guild_id)
        this.id = raw.id
        this.guild_id = raw.guild_id
        this.lang = raw.lang
        this.roles = JSON.parse(raw.roles)
        this.level = JSON.parse(raw.level)
        this.musique = JSON.parse(raw.musique)
        this.global = JSON.parse(raw.global)
        this.active = JSON.parse(raw.active)
        this.Level = new l(this.guild_id)
        this.RoleAssigner = new r(this.guild_id)
        setTimeout(()=>{
            this.roles.selecteurs.forEach(ch=>{  
                console.log(ch);
                if(Number.isInteger(Number(ch))){
                    try{
                        let t = client.guilds.resolve(this.guild_id).channels.resolve(ch)
                        console.log(t);
                        if(t){
                            ch = t
                        }
                    }catch(err){

                    }
                    
                }               

            })
           
        },2000)
    }
    parser(){
        return {
            sql:"roles=?,musique=?,level=?,global=?,lang=?,active=? WHERE guild=?",
            data:[JSON.stringify(this.roles),JSON.stringify(this.musique),JSON.stringify(this.level),JSON.stringify(this.global),this.lang,JSON.stringify(this.active),this.guild_id]
        }
    }
    Update(prop,value){
        console.log(prop,value,this[value],this.guild_id);
        let val = this[value]
        if(typeof(this[value]) == "object"){
            val = JSON.stringify(this[value])
        }
        console.log(val);
        db.query(`UPDATE guilds SET ${prop}=? WHERE guild_id=?`,[val,this.guild_id], (err,res)=>{
            if(err) throw err;
            console.log("save");
        })
    }
    Delete(){
        db.query('DELETE FROM guilds WHERE guild_id=?',this.guild_id, (err,res)=>{
            if(err) throw err;
            console.log("deleted");
        })
    }
    JSON(){
        console.log(JSON.stringify(this,null,2));
    }
}

global.GuildManager = new class{
    constructor(){
        this.guilds = new Map()
        this.Load()
        require("./lib")
    }
    AddGuild(guild){
        let g = GuildManager.guilds.get(guild.id)
        if(!g){        
            let maquette = require("./guild.json")
            maquette.guild_id = guild.id
            let insert = [maquette.guild_id,JSON.stringify(maquette.roles),JSON.stringify(maquette.musqiue),JSON.stringify(maquette.level),JSON.stringify(maquette.global),"fr",JSON.stringify(maquette.active)]
            db.query('INSERT INTO guilds SET guild_id=?,roles=?,musique=?,level=?,global=?,lang=?,active=?',insert,(err,res)=>{
                if(err) throw err;
                console.log("[SAVED] Guild added");
                this.Load(insert[0])
            })
        }

    }
    Load(id=undefined){
        if(id){
            db.query('SELECT * FROM guilds WHERE guild_id=?',id,(err,res)=>{
                if(err) throw err;
                res.forEach(g => {
                    this.guilds.set(g.guild_id,new Guild(g))
                });
                console.log('[SUCCES] ',GuildManager);
            })
        }else{
            db.query('SELECT * FROM guilds',(err,res)=>{
                if(err) throw err;
                res.forEach(g => {
                    this.guilds.set(g.guild_id,new Guild(g))
                });
                console.log('[SUCCES] ',GuildManager);
            })
        }

    }
}

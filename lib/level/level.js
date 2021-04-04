const MessageStatut = require("../embed/embed")

let up = false
let LevelManager = class{
    constructor(guild){
        this.id = guild
        if(up){
            setTimeout(()=>{
                this.UpadateLevelSystem()
            },2000)
        }

    }
    UpadateLevelSystem(){
        this.gdb.global.publicMessage.channel = ""
        this.UpadateDB()
    }
    get gdb(){
        return GuildManager.guilds.get(this.id)
    }
    handler(msg){
        //console.log(this.gdb);
        let u = this.findUser(msg.author.id)
        if(u){//il a déjà été crée
            //console.log(this.findLevelNeed(u));
            if(this.findLevelNeed(u) <= u.xp+1){
                try{
                    //console.log('NOUVEAU NIVEAU PASSER');
                    u.xp = 0
                    u.lvl = u.lvl +1 
                    let c = client.channels.resolve(this.gdb.level.channel)
                    if(c){        
                        //console.log(c);
                        c.send(this.gdb.level.message.replace("USER",`${msg.member}`).replace("LEVEL",`${u.lvl}`)).catch(err=>{
                            msg.channel.send(err.message)
                        })
                    }else{
                        //console.log("MESSAGE");
                        msg.channel.send(this.gdb.level.message.replace("USER",`${msg.member}`).replace("LEVEL",`${u.lvl}`))
    
                    }
                    this.addRole(u,msg.member)
                }catch(err){
                    console.error("ERREUR LEVEL PASS",err);
                }

            }else{
                u.xp = u.xp +1
            }
            this.UpadateDB()
        }else{ // inconue
            this.gdb.level.users.push({
                id:msg.author.id,
                lvl:1,
                xp:1
            })
            this.UpadateDB()
        }
    }
    addRole(u,member){
        //console.log(u,this.gdb.level.rolesLevel);
        let role = this.gdb.level.rolesLevel.find(r => r.level == u.lvl)
        //console.log(role);
        
        if(role){
            member.roles.add(role.role.id)
        }
    }
    findLevelNeed(u){ //pkutot xp bneeed lol
        //console.log(u);
        //console.log(this.gdb.level);
        if(!this.gdb.level.customLvl){
            this.gdb.level.customLvl = []
        }

        if(this.gdb.level.customLvl[""+u.lvl]){
            return this.gdb.level.customLvl[""+u.lvl]
        }else{
            if(!this.gdb.level.coef)[
                this.gdb.level.coef = 1
            ]
            if(!this.gdb.level.xp){
                this.gdb.level.xp = 10
            }
            if(!u.lvl){
                u.lvl = 1
            }
            return  Number(this.gdb.level.xp) *  Number(u.lvl) * Number(this.gdb.level.coef)
        }
    }
    findUser(id){
        return this.gdb.level.users.find(u => u.id == id)
    }
    UpadateDB(){
        this.gdb.Update("level","level")
    }
    //commande
    AddRoleLevel(msg){
        if(msg.command.length < 2) throw new Error("Erreur Syntaxe | Syntax Error");
        let role = msg.mentions.roles.first()
        if(!role) throw  new Error("Aucun role mentioné | No role mentioned");
        let level = Number.parseInt(msg.command[2])
        if(Number.isNaN(level)) throw new Error("Le niveaux entrées n'est pas un nombre | The level entered is not a number");
        let t = this.gdb.level.rolesLevel.find(r=>r.role.id == role.id)
        if(t) throw new Error("Le role est deja assigné | The role is already assigned");
        this.gdb.level.rolesLevel.push({
            level:level,
            role:role
        })
        this.UpadateDB()
        if(msg.gDB.lang != "fr") return msg.channel.send(MessageStatut.Succes(`The role ${role} will be earned at the level ${level}`))
        else return msg.channel.send(MessageStatut.Succes(`Le role ${role} sera obtenu au niveau ${level}`)) 

    }
    RemoveRoleLevel(msg){
        if(msg.command.length < 2) throw new Error("Erreur Syntaxe | Syntax Error");
        let role = msg.mentions.roles.first()
        if(!role) throw  new Error("Aucun role mentioné | No role mentioned");
        let targets = this.gdb.level.rolesLevel.filter(r=>r.role.id == role.id)
        if(targets){
            targets.forEach(r => {
                let id = msg.gDB.level.rolesLevel.indexOf(r)
                msg.gDB.level.rolesLevel.splice(id,1)
            });
            this.UpadateDB()
            if(msg.gDB.lang != "fr") return msg.channel.send(MessageStatut.Succes(`The role ${role} has been unregistered`))
            else return msg.channel.send(MessageStatut.Succes(`Le role ${role} n'est plus assigné`)) 
            

        }
    }
    SetCustomLvL(msg){
        if(msg.command.length < 2) throw new Error("Erreur Syntaxe | Syntax Error");
        let lvl = msg.command[1]
        let xp = msg.command[2]
        if(!Number.isInteger(Number(lvl)) || !Number.isInteger(Number(xp)) ) throw new Error("Les valeurs entrées ne sont pas des nombres | The values entered are not numbers");
        this.gdb.level.customLvl[""+lvl] = Number(xp)
        this.UpadateDB()
        if(msg.gDB.lang != "fr") return msg.channel.send(MessageStatut.Succes(`The level ${lvl} will be earn at ${xp} xp`))
        else return msg.channel.send(MessageStatut.Succes(`Le niveau ${lvl} sera obtenu au bout de ${xp} xp`)) 
        
    }
    UnsetCustomLvl(msg){
        if(msg.command.length < 2) throw new Error("Erreur Syntaxe | Syntax Error");
        let lvl = msg.command[1]
        
        if(!Number.isInteger(Number(lvl))) throw new Error("Les valeurs entrées ne sont pas des nombres | The values entered are not numbers");
        
        delete this.gdb.level.customLvl[""+lvl]
        this.UpadateDB()
        if(msg.gDB.lang == "fr") return msg.channel.send(MessageStatut.Succes(`Le niveau ${lvl} sera obtenu normalement`))
        else return msg.channel.send(MessageStatut.Succes(`The level ${lvl} will be earn normaly`)) 

    }
    setLevelCoef(msg){
        if(msg.command.length < 2) throw new Error("Erreur Syntaxe | Syntax Error");
        let coef = Number.parseFloat(msg.command[1])
        console.log(coef);
        if(!Number.isFinite(coef) || Number.isNaN(coef)) throw new Error("Les valeurs entrées ne sont pas des nombres | The values entered are not numbers");

        this.gdb.level.coef = coef
        this.UpadateDB()
        if(msg.gDB.lang == "fr") return msg.channel.send(MessageStatut.Succes(`Le coeficient des niveaux est passé a x${coef} `))
        else return msg.channel.send(MessageStatut.Succes(`The level coefficient is passed to x${coef}`)) 


    }
    xpLast(msg){
        let m = msg.mentions.members.first()
        if(!m){
            m = msg.member
        }

        let userT = this.gdb.level.users.find(u=>u.id == m.id)
        if(!userT) return msg.channel.send(MessageStatut.Warn(`${m} n'a pas encore envoyé de message | ${m} has not sent a message yet`))
        let need = this.findLevelNeed(userT)
        //console.log(need);
        let last = need - userT.xp
        if(msg.gDB.lang == "fr") return msg.channel.send(MessageStatut.Succes(`${m} est niveau **${userT.lvl}** et il a **${userT.xp} xp**. Il lui reste **${last} xp**  pour passer au niveau superieur.`))
        else return msg.channel.send(MessageStatut.Succes(`${m} is level **${userT.lvl}** and he has **${userT.xp} xp**. He still has **${last} xp** to level up.`)) 
    }
}

module.exports = LevelManager
module.exports = class MessageStatut{

    constructor(msg){


        return new discord.MessageEmbed(msg)

    }
    static Info(msg){

        return new discord.MessageEmbed({

            title:"information",

            description:msg,

            color:"#F63B13"

        })

        

    }
    static Erreur(msg,m=undefined){
        let d;
        if(m){
            if(m.gDB.lang == "fr"){
                d = {

                    title:"Erreur",
        
                    description:msg.split(" | ")[0],
        
                    color:"#F63B13"
        
                }
            }else{
                d = {

                    title:"Erreur",
        
                    description:msg.split(" | ")[1],
        
                    color:"#F63B13"
        
                }
            }
            
        }else{
            d = {

                title:"Erreur",
    
                description:msg,
    
                color:"#F63B13"
    
            }
        }
        return new discord.MessageEmbed(d)

    }
    static Warn(msg){

        return new discord.MessageEmbed({

            title:"Attention",

            description:msg,

            color:"#ffd129"

        })

    }
    static Succes(msg){

        return new discord.MessageEmbed({

            title:"Information",

            description:msg,

            color:"#6CF613"

        })

        

    }

}
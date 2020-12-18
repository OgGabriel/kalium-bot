const { Discord, Client, MessageEmbed } = require("discord.js")
const bot = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] })

var purple = "#7a297a"
var footer = "2020 © Kalium - All rights reserved."
var prefix = "."
var no_perm = ":x: You do not have permissions to do this."

var commands_staff = [".author", ".help", ".lock", ".unlock", ".cls", ".closealltickets"]

bot.on('ready', () => {
    console.log('Kalium BOT online!')
    bot.user.setActivity('.help || Kalium © BOT', { type: 'PLAYING' })
        .then(presence => console.log(`Atividade setada para ${presence.activities[0].name}`))
        .catch(console.error)
})

bot.on('message', async message => {

    if (!message.guild) return
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) return
    //if (!message.channel.id == '774115754558619649' || !message.channel.id != '774115754558619649' || !message.channel.id != '774109394115625004') return message.delete() && message.author.send(new MessageEmbed() .setDescription('You can only send commands in <#774115754558619649> !') .setColor(purple))

    let args = message.content.slice(prefix.length).trim().split(/ +/g)
    let cmd = args.shift().toLowerCase()
    const clogs = bot.channels.cache.get("774110147839787058") //canal de logs 774110147839787058


    //author
    if (cmd == "author") {
        message.channel.send(new MessageEmbed().setDescription("Author: <@286652790326034432>").setColor(purple))
    }

    //help
    else if (cmd == "help"){
        message.channel.send(new MessageEmbed() .setDescription('**Available commands:**') 
        .addField(".help", "Shows this message")
        .addField(".author", "Shows the author of this project")
        .addField(".userinfo", "Shows info about a user you mentioned")
        .addField(".status", "Shows the current status of our servers")
        .setColor(purple)
        )
    }

    //commands
    else if (cmd == "commands" || cmd == "cmds"){
        if (message.member.hasPermission("BAN_MEMBERS")) return message.react('👎') && message.channel.send(no_perm)
        message.channel.send(new MessageEmbed() .setDescription("All commands are: " + commands_staff.join(' ')) .setColor(purple))
    }

    //lock
    else if (cmd == "lock") {
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.react('👎') && message.channel.send(no_perm)
        message.channel.createOverwrite(message.guild.id, { SEND_MESSAGES: false })
        let lock_embed = new MessageEmbed()
            .setTitle("** :x: CHAT LOCKED :x: **")
            .addField("This chat was locked by:", `\`\`\`${message.member.displayName}\`\`\``)
            .setColor(purple)
            .setFooter(footer)
        message.channel.send(lock_embed)
        message.react('🔒')
    }

    //unlock
    else if (cmd == "unlock") {
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.react('👎') && message.channel.send(no_perm)
        message.channel.createOverwrite(message.guild.id, { SEND_MESSAGES: false })
        let lock_embed = new MessageEmbed()
            .setTitle("** :x: CHAT UNLOCKED :x: **")
            .addField("This chat was unlocked by:", `\`\`\`${message.member.displayName}\`\`\``)
            .setColor(purple)        
            .setFooter(footer)
        message.channel.send(lock_embed)
        message.react('🔓')
    }

    //ticket-setup
    else if (cmd == "setup-ticket") {
        let channel = message.mentions.channels.first()
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.react('👎') && message.channel.send(no_perm)
        if (!channel) return message.reply("Mencione um canal para definir o chat de tickets.")

        let sent = await channel.send(new MessageEmbed()
            .setTitle("⚙ Kalium - Ticket Manager ")
            .setDescription("React this message with [🎫] to create a ticket")
            .addField("Reasons you should create a ticket:", "General issues with the scanner; \nBoosting rewards; \nMore information about partnership;")
            .setFooter(footer)
            .setColor(purple)
        )

        sent.react("🎫")

        message.react('👍')
        message.reply("Sistema de ticket setado no canal " + channel.name)
        console.log("Sistema de ticket setado no canal " + channel.name + "!")
    }

    //join reaction role
    else if (cmd == "join-role") {
        let channel = message.mentions.channels.first()
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.react('👎') && message.channel.send(no_perm)
        if (!channel) return message.reply("Mencione um canal para definir o chat de tickets.")

        let sent = await channel.send(new MessageEmbed()
            .setTitle("⚙ Kalium - Authentication Manager ")
            .setDescription("React this message with [👥] to authenticate and get full access to our discord.")
            .setFooter(footer)
            .setColor(purple)
        )

        sent.react("👥")

        message.react('👍')
        message.reply("Sistema de ticket setado no canal " + channel.name)
        console.log("Sistema de ticket setado no canal " + channel.name + "!")
    }

    //close all tickets
    else if (cmd == "closealltickets" || cmd == "clstickets") {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(no_perm) && message.react('👎')
        let tickets = message.guild.channels.cache.filter(c => c.name.startsWith('ticket-'))
        tickets.forEach(tickets => {
            tickets.delete()
        });
        message.react('👌')
        clogs.send(`<@${message.author.id}> usou ` + '``.clstickets``')
    }

    //broadcast
    else if (cmd == "bc") {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(no_perm) && message.react('👎')
        let channel = message.mentions.channels.first()
        let msg = args.slice(1).join(' ')
        channel.send(new MessageEmbed().setColor(purple).setFooter(footer).setDescription(msg).setTitle("**Kalium ©️ About us (EN/US)**"))
        message.react('👍')
    }

    //cls
    else if (cmd == "clear" || cmd == "cls") {
        if (!message.member.hasPermission("BAN_MEMBERS")) {
          return message.channel.send(sem_permissao) && message.react('👎')
        }
        if (args.length <= 0) return message.channel.send('Usage: `` ' + `${message.content} <messages>` + '``')
    
        const quantia = args[0]
        if (isNaN(quantia)) return message.reply("I couldn't delete ``" + quantia + "`` messages")
        if (quantia > 100) {
          return message.reply("the maximum deleted messages is 100")
    
        }
        message.channel.bulkDelete(quantia).then(() => {
          message.reply("I deleted " + quantia + " messages")
          clogs.send(`<@${message.author.id}> apagou ${quantia} mensagens`)
          console.log(message.author.username + " apagou " + quantia + " mensagens")
        })
      }
})

//create ticket
bot.on('messageReactionAdd', async (reaction, user) => {
    if (user.partial) await user.fetch()
    if (reaction.partial) await reaction.fetch()
    if (reaction.message.partial) await reaction.message.fetch()

    if (user.bot) return

    let ticketid = bot.channels.cache.get('774332342864838736')
    let tag = user.tag.replace('#', '-')
    let clogs = bot.channels.cache.get("774110147839787058")

    if (reaction.message.channel.id == ticketid && reaction.emoji.name === '🎫') {
        //if (reaction.message.guild.channels.cache.find(c => c.topic.includes(user.id))) return
        reaction.message.guild.channels.create(`ticket-${tag}`, {
            permissionOverwrites: [
                {
                    id: reaction.message.guild.id,
                    deny: ["VIEW_CHANNEL"]
                },
                {
                    id: "774110775085105213",
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                },
                {
                    id: user.id,
                    allow: ["SEND_MESSAGES", "VIEW_CHANNEL"]
                }
            ],
            type: 'text',
            parent: '774337221053644801'
        }).then(async channel => {
            channel.setTopic(user.id)
            channel.send(`<@${user.id}>`, new MessageEmbed().setTitle("Ticket opened!").setDescription(`Wait patiently for an answer.`).setColor(purple))
            setTimeout(() => {
                channel.lastMessage.react('🔒')
            }, 2000);
            clogs.send(`${user.username} abriu um ticket`)
            console.log(`${user.username} abriu um ticket`)
        })
    }
})

//close ticket
bot.on('messageReactionAdd', async (reaction, user) => {
    if (user.partial) await user.fetch()
    if (reaction.partial) await reaction.fetch()
    if (reaction.message.partial) await reaction.message.fetch()

    if (user.bot) return

    if (!reaction.message.guild.channels.cache.find(c => c.name.includes('ticket-'))) return
    if (!reaction.message.type == MessageEmbed) return
    if (reaction.emoji.name === '🔒') {
        reaction.message.channel.send(new MessageEmbed().setTitle(" :no_entry: **TICKET CLOSED** :no_entry:").setDescription("This ticket has been closed! \nThis channel will be deleted in 5 seconds...").setFooter(footer))
        
        setTimeout(() => {
            reaction.message.channel.delete()
        }, 5000);

    }
})

//authentication
bot.on('messageReactionAdd', async (reaction, user) => {
    if (user.partial) await user.fetch()
    if (reaction.partial) await reaction.fetch()
    if (reaction.message.partial) await reaction.message.fetch()

    if (user.bot) return

    let authid = bot.channels.cache.get('774109063675510836')
    let clogs = bot.channels.cache.get("774110147839787058")

    if (reaction.message.channel.id == authid && reaction.emoji.name === '👥') {
        reaction.message.guild.members.cache.get(user.id).roles.add('774111042048622602')
        await user.send(new MessageEmbed() .setTitle('**Welcome, ' + user.username + '**') .setDescription("Do not forget to read our <#774115220737097748> before anything! \n\n_OBS: Se você fala português e precisa de tradução ou ajuda, abra um ticket em <#774332342864838736> _")
        .setFooter(footer) .setColor(purple))
        clogs.send("``" + user.username + "`` registrou-se")
    }
})

function formatDate(template, date) {
    var specs = 'YYYY:MM:DD:HH:mm:ss'.split(':')
    date = new Date(date || Date.now() - new Date().getTimezoneOffset() * 6e4)
    return date.toISOString().split(/[-:.TZ]/).reduce(function (template, item, i) {
        return template.split(specs[i]).join(item)
    }, template)
}

function converterMilliseconds(millis) {
    var hours = Math.floor(millis / 3600000)
    var minutes = Math.floor(millis / 60000)
    var seconds = ((millis % 60000) / 1000).toFixed(0)
    return "**" + hours + "** horas, **" + minutes + "** minutos e **" + (seconds < 10 ? '0' : '') + seconds + "** segundos!"
}

bot.login('token') 
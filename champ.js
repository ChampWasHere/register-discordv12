const Discord = require('discord.js')
require('discord-reply')
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const moment = require('moment');
const id = require('./idler.json')
const chalk = require('chalk')
const { Client, Util } = require('discord.js');
const fs = require("fs");
const db = require("quick.db");
require("./util/eventLoader.js")(client);
const request = require("request");
var prefix = ayarlar.prefix;
const log = message => { console.log(`${message}`); };
//_______________________________________________________//
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

//_______________________________________________________//

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

//____________________________________________________//

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

//____________________________________________________//

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

//___________________[[Token Kısmı]]________________________//

// [[.env Kısmında "token" İsimli Veri Yoksa Aç]]
client.login(process.env.token).then(console.log("Bot başarılı bir şekilde giriş yaptı."));


//________________[[Hoşgeldin Mesajı]]___________________//

client.on("guildMemberAdd", member => {
let yetkili = id.yetkilirol
let kayıtchat = id.kayıtsohbet
  
  member.roles.add(id.kayıtsızrol), member.setNickname(`${id.tag} İsim | Yaş`)
  
let guild = member.guild;
  
const channel = member.guild.channels.cache(channel => channel.id === (kayıtchat));
  
let aylar = {
"01": "Ocak",
"02": "Şubat",
"03": "Mart",
"04": "Nisan",
"05": "Mayıs",//Yardım İçin Universe Code Sunucusuna Gelin  
"06": "Haziran",
"07": "Temmuz",
"08": "Ağustos",//Yardım İçin Universe Code Sunucusuna Gelin  
"09": "Eylül",//Yardım İçin Universe Code Sunucusuna Gelin  
"10": "Ekim",
"11": "Kasım",
"12": "Aralık"
}
let aylartop = aylar 

let user = client.users.cache.get(member.id);
  require("moment-duration-format"); //Yardım İçin Universe Code Sunucusuna Gelin  
const kurulus = new Date().getTime() - user.createdAt.getTime();
const gün = moment.duration(kurulus).format("D")
var kontrol = [];
if (gün < 7) {
    kontrol = '**Şüphelidir**'
  } if (gün > 7) {
    kontrol = '**Güvenlidir**'
  }
  let kkanal = id.kayıtsohbet //Billy 
  if (!kkanal) return;
  
  if (gün < 7) {
    kontrol = '**Şüphelidir**'
  } if (gün > 7) {//Billy
    kontrol = '**Güvenlidir**'
  }
  let kkayıtchat = id.kayıtsohbet //billy 
  if (!kayıtchat) return;
client.channels.cache.get(kkanal).send(`

${id.emoji} ${member.user} Sunucumuza Hoşgeldin Seninle Beraber **__${guild.memberCount}__** Kişiye Ulaştık 

${id.emoji} Sunucumuza Kayıt Olduğun Anda <#${id.kurallar} Kanalındaki Maddeler Geçerli Olucaktır

${id.emoji} Hesabın \`${moment(user.createdAt).format('DD')} ${aylar[moment(user.createdAt).format('MM')]} ${moment(user.createdAt).format('YYYY HH:mm:ss')}\` zamanında kurulmuş.
  
${id.emoji} ${yetkili} Rolündeki kişiler Seninle İlgilenecekler Kayıt Olmak İçin İsim Yaş Vermen Yeterli


`)
})

client.on('message', message => {
    let tag = id.tag
    let rol = id.tagrol //tag alındığı zaman verilecek rolün ID-si
    let kanal = message.guild.channels.cache.find('name', 'tag-log'); //tagrol-log yerine kendi kanalınızın ismini yaza bilirsiniz
    if (!rol) return;
    if (!tag) return;
    if (message.member.user.username.includes(tag)) {
        if (message.member.roles.cache.has(rol)) return;
        message.member.roles.add(rol).then(() => {
            const tagalma = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`${message.author} ${tag} tagını aldığından dolayı <@&${rol}> rolünü kazandı`) // rol yazan yere rolün idsini yapıştıracaksınız.
                .setTimestamp()
            kanal.send(tagalma)
        });
    }
    if (!message.member.user.username.includes(tag)) {
        if (!message.member.roles.cache.has(rol)) return;
        message.member.roles.remove(rol).then(() => {
            const tagsilme = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setDescription(`${message.author} ${tag} tagını sildiğinden dolayı <@&${rol}> rolünü kaybetti`)  // rol yazan yere rolün idsini yapıştıracaksınız.
                .setTimestamp()
            kanal.send(tagsilme)
        });
    }
});
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { Client } = require('discord.js');
const dotenv = require('dotenv').config({ path: __dirname + '/.env' }).parsed
const fs = require('fs')

const app = express()
const port = 3113
app.use(cors())
app.use(bodyParser.json())

const client = new Client({ intents: [1, 2, 256, 512] });

let members = []

app.get('/getMembers', (req, res) => {
    members = []
    for (const server of client.guilds.cache) {
        server[1].members.cache.forEach(member => !member.user.bot && members.push({
            ...member,
            presence: member.presence,
            avatar: member.displayAvatarURL({}),
            user: {...member.user}
        }));
    }
    res.set('Access-Control-Allow-Origin', '*')
    res.send(members)
})
app.get('/getMembersSettings', (req, res) => {
    let usersSetting = {}
    try {
        usersSetting = JSON.parse(fs.readFileSync(__dirname + '/bd/usersSettings.json', 'utf8'))
    } catch (err) {
        console.error('Пользовательские настройки не найдены. Используются настройки по умолчанию')
    }
    res.send(usersSetting)
})
app.post('/setMemberSettings/:id', (req, res) => {
    const id = req.params.id
    let usersSetting = {}
    try {
        usersSetting = JSON.parse(fs.readFileSync(__dirname + '/bd/usersSettings.json', 'utf8'))
    } catch (err) {}
    usersSetting[id] = req.body
    fs.writeFile(__dirname + '/bd/usersSettings.json', JSON.stringify(usersSetting), 'utf-8', () => {})
    res.send({ message: 'Данные успешно сохранены' })
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('presenceUpdate', (oldU, newU) => {
    //console.log(newU)
});

client.login(dotenv.BOT_TOKEN);
app.listen(port, () => {
    console.log('Бот запущен на локальной машине на порте: ' + port)
})
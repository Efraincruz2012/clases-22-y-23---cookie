const express = require('express')
const session = require('express-session')
const path = require('path')
const app = express()

app.use(express.urlencoded({ extended: true }))




/* ------------------------------------------------*/
/*           Persistencia por MongoDB              */
/* ------------------------------------------------*/
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
/* ------------------------------------------------*/

/////////////cargo vistas//////////////////////

app.use(express.static('public'))
app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'ejs');

///////////////////////////////////////////////

app.use(session({
    /* ----------------------------------------------------- */
    /*           Persistencia por redis database             */
    /* ----------------------------------------------------- */
    store: MongoStore.create({
        //En Atlas connect App :  Make sure to change the node version to 2.2.12:
        mongoUrl: 'mongodb://localhost/Autentificacion',
        mongoOptions: advancedOptions
    }),
    /* ----------------------------------------------------- */

    secret: 'session',
    resave: false,
    saveUninitialized: false/* ,
    cookie: {
        maxAge: 40000
    } */
}))

app.get('/', (req, res) => {
    res.render('index')
})

let contador = 0
app.get('/sin-session', (req, res) => {
    res.send({ contador: ++contador })
})

app.get('/con-session', (req, res) => {
    if (req.session.contador) {
        req.session.contador++
        res.send(`Ud ha visitado el sitio ${req.session.contador} veces.`)
    } else {
        req.session.contador = 1
        res.send('Bienvenido!')
    }
})

app.get('/login', (req, res) => {
    
    console.log('req.query: ', req.query)

    if(req.session.user){
        res.render('bienvenido', {
            nombre: req.session.user.nombre
        })
    } else {
        res.render('login');
    }

});

app.post('/login', (req, res) => {
    
   
    req.session.user = { nombre: req.body.nombre }
    res.render('bienvenido', { nombre: req.body.nombre })

})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (!err) res.render('hastaluego')
        else res.send({ status: 'Logout ERROR', body: err })
    })
})

app.get('/info', (req, res) => {
    console.log('------------ req.session -------------')
    console.log(req.session)
    console.log('--------------------------------------')

    console.log('----------- req.sessionID ------------')
    console.log(req.sessionID)
    console.log('--------------------------------------')

    console.log('----------- req.cookies ------------')
    console.log(req.cookies)
    console.log('--------------------------------------')

    console.log('---------- req.sessionStore ----------')
    console.log(req.sessionStore)
    console.log('--------------------------------------')

    res.send('Send info ok!')
})

const PORT = 8080
app.listen(PORT, () => {
    console.log(`Servidor express escuchando en el puerto ${PORT}`)
})
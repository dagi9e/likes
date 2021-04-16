const { User, Message , Like} = require('../models/models.js')
const jwt = require('jsonwebtoken')
const { Router } = require('express')
const router = Router()

//home page that finds all the messages
router.get('/', async function (req, res){

    let messages = await Message.findAll({})
    let data = { messages }

    res.render('index.ejs', data)
})


//create Users//////////////////////////////CREATE USER////////////////////////////
router.get('/createUser', async function(req, res){
    res.render('createUser.ejs')
})

router.post('/createUser', async function(req, res){
    let { username, password } = req.body

    try {
        await User.create({
            username,
            password,
            role: "user"
        })  
    } catch (e) {
        console.log(e)
    }

    res.redirect('/login')
})


//login   ///////////////////////////////////////////lOGIN//////////////////////////
router.get('/login', function(req, res) {
    res.render('login')
})

router.post('/login', async function(req, res) {
    let {username, password} = req.body

let user = 0;
    try {
         user = await User.findOne({
            where: {username}
        })
    } catch (e) {
        console.log(e)
    }

    if (user && user.password === password) {
        let data = {
            username: username,
            role: user.role
        }

        let token = jwt.sign(data, "theSecret")
        res.cookie("token", token)
        res.redirect('/')
    } else {
        res.redirect('/error')
    }
})



//messages//////////////////////////////////MESSAGES/////////////////////////////////
router.get('/message', async function (req, res) {
    let token = req.cookies.token  // so there is no Verifying who the user is, it just checks if a token is present

    if (token) {                                      // very bad, no verify, don't do this
        res.render('message')
    } else {
        res.render('login')
    }
})


let m_count =0;

router.post('/message', async function(req, res){
    let { token } = req.cookies
    let { content } = req.body

    if (token) {
        let payload = await jwt.verify(token, "theSecret")  //this verifies/checks who the user is 
 
        let user = await User.findOne({//if such a user exists
            where: {username: payload.username}
        })

        let msg = await Message.create({
            content,
            userId: user.id,
            counts:m_count
        })

        m_count++

        let c=await Like.findOne({
            where:{}
        })

        res.redirect('/')
    } else {
        res.redirect('/login')
    }
})



/////////////////////
router.post('/like', async function(req,res) {

    // /having difficulty assigning and retrieving message ID to adjust and create counter for each
    //  specific message as message is being created, so the ID counter must be incremented every time a new message is created,
    //   then sending message to a like SQL server along with the count, then searching the server to retrieve
    //    the like count then pasting the count with  the message/////////////////////////

    
// let user=0;
    // try {
//     user = await Like.findOne({
//        where: {count:message.m_count}
//    })
// } catch (e) {
//    console.log(e)
// }

    //  if(user!==0 || user)   
    // let ll = await Like.create({
    //     userId: user.id,
    //     counts:m_count
    // })

//     let count3=0;




// let = await User.findOne({//if such a user exists
//     where: {username: payload.username}
// })



// let token = jwt.sign(data, "theSecret")
// res.cookie("token", token)








    res.redirect('/')


})





router.get('/error', function(req, res){
    res.render('error')
})

router.all('*', function(req, res){
    res.send('404 dude')
})

module.exports = router
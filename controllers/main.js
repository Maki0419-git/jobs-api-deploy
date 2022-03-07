// check username,pass in post request
// if exists create new JWT
// send back to frontend

// setup authentication so only the request with JWT can access the dashbord

// basic img:
//        -----login request----> 
// client                         server
//        <----response+jwt------ 


//        -----request+jwt-----> 
// client                         server
//        <------response------- 

// doc: https://jwt.io/
const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../errors');

const login = async (req, res, next) => {
    const { username, password } = req.body;
    console.log(username, password);
    if (!username || !password) {
        throw new BadRequestError('please provide email and password')
        //return next(createCustomError('please provide email and password', 400));
    }
    const id = new Date().getDate();
    // try to keep payload small, better experience for user 
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(200).json({ msg: 'user created', token });
}
const dashboard = async (req, res) => {
    const { username, id } = req.user;
    const luckynumber = Math.floor(Math.random() * 100);
    res.status(200).json({ msg: `hello ${username} `, secret: `here is your id : ${id}` })
}

module.exports = { login, dashboard }
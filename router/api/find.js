const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('superagent')
const mydb = require('../../models/accounts');

const accesToken = '8171fbda7b7b9342296fb65283ff1306fe01c7a8'

// для ауторизації
let githubOAuth = require('github-oauth')({
  githubClient: '39e671da335ecd0ea0e0',
  githubSecret: '00df5f106528648f9158a3b77f1a10bd1b96073c',
  baseURL: 'http://localhost:3001',
  loginURI: '/auth/github',
  callbackURI: '/auth/github/callback'
})
//
// let UserInfo = [ {} , {}, {}, {} , {}, {}, {} , {}, {}, {} ]

// Router to get top 10 users
router.get('/test', (req, res) => {
  // setTimeout(function() {
  //   request
  //   .get('http://localhost:3001/api/users/test')
  //    .set('Authorization', 'token ' + accesToken)
  //   .then(() => console.log('I was called from setTimeout'))
  // }, 5000);

  request
  .get('https://api.github.com/search/users?q=location:Kyiv&sort=followers')
  .then(result => {
      let loginArr = []
      result.body.items.slice(0,10).forEach(item => {
        loginArr.push(item.login)
      })
      console.log(loginArr);
      return loginArr
  })
  .then(loginArr =>{
    loginArr.forEach( (item,index) => {

      console.log(index);

      request
        .get('http://api.github.com/users/' + item)
        .set('Authorization', 'token ' + accesToken)
        .then(result => {

          const MostTop = new mydb({
              _id: new mongoose.Types.ObjectId(),
              login: result.body.login,
              name: result.body.name,
              email: result.body.email,
              bio: result.body.bio,
              location: result.body.location,
              followers: result.body.followers
          })

          MostTop.save((err) => {
            if (err) return res.status(500);
          })

          // UserInfo[index].login = result.body.login
          // UserInfo[index].name = result.body.name
          // UserInfo[index].location = result.body.location
          // UserInfo[index].email = result.body.email
          // UserInfo[index].bio = result.body.bio

        })
        .catch(err => console.log(err))
    })
  })
  .then(() => {
      mydb
      .find({})
      .sort({
        followers: -1 // sort asc
      })
      .limit(10)
      .exec((err, info) => {
        if (err) res.status(500).send('Can not find')
        res.status(200).json(info)
      })
    })
  .catch(err => console.log(err))

})




// For OAuth Authorization
router.get('/auth/github', function(req, res){
  console.log("started oauth");
  return githubOAuth.login(req, res);
});
// For OAuth Authorization
router.get("/auth/github/callback", function(req, res){
  console.log("received callback");
  return githubOAuth.callback(req, res);
});
// For OAuth Authorization
githubOAuth.on('error', function(err) {
  console.error('there was a login error', err)
})
// For OAuth Authorization
githubOAuth.on('token', function(token, serverResponse) {
  serverResponse.end(JSON.stringify(token))
})


module.exports = router;

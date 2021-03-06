const bcrypt = require('bcrypt')
const issueToken = require('../issuetoken')

/**
 * Authenticate Login using Local Strategy
 * Output - jwt:{"TOKEN_STRING"}
 * @param {Object} ctx |  
 * Example Usage:
 * options = {
 *  Model: User
 * token:{
 *    
 * }
 * } 
 * let LocalStrategy = auth.strategy.local(options)
 *  
 */

let LocalStrategy = options => (ctx) => {
  try {
    let {
      res,
      data
    } = ctx
    let {
      Model
    } = options
    let username = data.fields.username
    let password = data.fields.password
    Model.findOne({
      where: {
        username: username
      }
    }, (err, user) => {
      if (err) {
        // return
        console.log(err.message)

        res.end(JSON.stringify(err))
      }
      if (!user) {
        res.end(JSON.stringify(err))
      }

      bcrypt.compare(password, user.password, function (err, isValid) {
        if (isValid) {
          res.end(JSON.stringify({
            jwt: issueToken(user, options.config)
          }))
        } else {
          res.end(JSON.stringify({
            result: 'Unauthorized'
          }))
        }

      })
    })
  } catch (e) {
    console.log(e)
  }

}

module.exports = LocalStrategy
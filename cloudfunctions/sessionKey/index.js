// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request');

cloud.init()

/**
 * 
 * request 
 * @param {String} secret  小程序密钥
 * @param {String} code    小程序登录code
 * 
 */

/**
 * 
 * response 
 * @param {String} openid  用户唯一标识
 * @param {String} session_key    会话密钥
 * @param {String} unionid    用户在开放平台的唯一标识符，在满足 UnionID 下发条件的情况下会返回
 * 
 */

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const appId = wxContext.APPID
  const {
    code,
    secret
  } = event
  console.log(code, secret, appId);

  let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`

  return new Promise((resolve, reject) => {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        return resolve(body)
      } else {
        return reject(err)
      }
    })
  });
}
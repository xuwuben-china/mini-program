var WXBizDataCrypt = require('./WXBizDataCrypt')
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * 
 * request 
 * @param {String}  secret  小程序密钥
 * @param {String} code   小程序登录code
 * @param {String} iv   小程序wx.getUserInfo返回
 * @param {String} encryptedData   小程序wx.getUserInfo返回
 * 
 */
/**
 * 
 * response 
 * @param {Object} data  用户数据
 * @param {String} session_key    会话密钥
 * 
 */

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let appId = wxContext.APPID
  const {
    secret,
    code,
    iv,
    encryptedData
  } = event


  const session = (await cloud.callFunction({
    name: "sessionKey",
    data: {
      secret,
      code
    }
  })).result

  const {
    session_key
  } = session
  var pc = new WXBizDataCrypt(appId, session_key)

  var data = await pc.decryptData(encryptedData, iv)
  delete data.watermark
  return {
    session,
    ...data
  }
}
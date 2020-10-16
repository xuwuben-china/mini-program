// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require("request-promise")
const request = require('request');
// secret   微信公众平台获取  类似秘钥 妥善保管
const secret = "d3943c1dd1894ea4af35aa71d887ba99"
cloud.init()

/**
 * request 
 * @param {code}  wx.login获取 
 * @param {iv}    wx.getUserInfo 获取
 * @param {encryptedData}  wx.getUserInfo获取
 * @param {url}  登录api （post）
 * 
 */

/**
 * response 
 * @param {token}  登录凭证
 * 
 * 
 */

// 云函数入口函数
exports.main = async (event, context) => {
  const data = {
    code: event.code,
    iv: event.iv,
    secret,
    encryptedData: event.encryptedData,
  }
  const {
    url
  } = event
  const loginData = (await cloud.callFunction({
    name: "encrypt",
    data,
  })).result
  // return loginData
  let body = {
    openId: loginData.openId,
    province: loginData.province,
    nikeName: loginData.nickName,
    headImg: loginData.avatarUrl,
    city: loginData.city
  }
  // return body
  return await rp({
    uri: url,
    method: "POST",
    body: {
      ...loginData
    },
    json: true
  }).then(res => {
    return res.data
  }).catch(err => {
    return err.response
  })
}
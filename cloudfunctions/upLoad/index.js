// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

cloud.init()
const db = cloud.database()
const codeCollection = db.collection("mini-code")
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  const {
    file,
    path
  } = event
  app.router("mini-code", async (ctx, next) => {
    await cloud.uploadFile({
      cloudPath: "code" + event.exc,
      fileContent: new Buffer(file, 'base64')
    }).then(async (file) => {
      console.log(file);
      await codeCollection.add({
        data: {
          fileID: file.fileID,
          id: event.id
        }
      }).then(res => {
        ctx.body = res
      })
    })
  })


  return app.serve()
}
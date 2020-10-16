// 本函数是云调用 消息订阅使用
// 本函数只提供将提醒消息保存到数据库和将取消提醒的数据删除   真正发送消息的是 sendMessages 函数
// 添加提醒将数据保存到数据库
// 取消提醒将数据从数据库删除


const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()
const db = cloud.database()
const remindCollection = db.collection("userSubscribeMsg")

// 添加提醒参数
// pePlanId           该数据标识 客户端可取到 用于取消操作删除数据
// remindTime         提醒时间 用于发送消息提醒
// subscribeMessage   小程序消息提醒的所需参数  注意 订阅消息参数有字数限制
//    touser          接收者（用户）的 openid
//    templateId      所需下发的订阅模板id
//    page            点击模板卡片后的跳转页面
//    data            模板内容

// 取消提醒参数
// pePlanId          该数据标识  用于数据库查询


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })


  // 添加提醒保存到数据库
  app.router("addRemind", async (ctx, next) => {
    delete event.$url
    let thing6 = event.subscribeMessage.data.thing6
    event.subscribeMessage.data.thing6 = thing6.length >= 20 ? thing6.substring(0, 17) + "..." : thing6
    await remindCollection.add({
      data: {
        ...event
      }
    }).then(res => {
      ctx.body = {
        ...event
      }
      console.log('插入成功')
    }).catch(err => {
      console.error('插入失败')
    })
  })
  // 取消提醒从数据库删除
  app.router("removeRemind", async (ctx, nexxt) => {
    await remindCollection.doc(event.pePlanId).remove()
      .then(res => {
        ctx.body = res
        console.log('删除成功')
      })
  })


  // 通知用户
  app.router("notice", async (ctx, next) => {
    delete event.$url

    const {
      OPENID
    } = wxContext
    console.log({
      touser: OPENID,
      ...event
    });
    const result = await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      ...event
    })
    // return result
  })


  return app.serve()
}
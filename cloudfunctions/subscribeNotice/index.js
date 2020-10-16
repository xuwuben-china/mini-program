// 本函数实现定时推送消息给用户的
// 实现原理 将数据库所有消息提醒数据取出进行循化遍历找出需要发送提醒的数据发送给用户（用户设置的提醒时间 <= 当前时间）
// 并将发送成功的数据删除
// 使用定时出发器每分钟执行一次
// 注意 云函数默认使用时间是 UTC+0  小程序端时 UTC+8 时间也就是相比北京时间晚了8小时
// 需配置 环境变量  TZ=Asia/Shanghai

// 触发器
// "triggers": [{
//   "name": "myTrigger",
//   "type": "timer",
//   "config": "0 */1 7-22 * * * *"
// }]

const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const remindCollection = db.collection("userSubscribeMsg")
// 从数据库取的最大数量
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  // 获取数据库数据的数量
  const countResult = await remindCollection.count()
  const total = countResult.total
  // 计算出要取几次
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = remindCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let remindList = {
    data: []
  }
  if (tasks.length > 0) {
    remindList = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }
  // 获取当前时间
  let nowDate = new Date().getTime()
  let remindArr = []

  let len = remindList.data.length
  for (let i = 0; i < len; i++) {
    let remindTime = new Date(remindList.data[i].remindTime).getTime()
    if (remindTime <= nowDate) {
      const result = await cloud.openapi.subscribeMessage.send({
        touser: remindList.data[0].subscribeMessage.touser,
        page: remindList.data[0].subscribeMessage.page,
        data: remindList.data[0].subscribeMessage.data,
        templateId: remindList.data[0].subscribeMessage.templateId,
      })
      if (result.errCode === 0) {
        await remindCollection.doc(remindList.data[i]._id).remove()
      }
      remindArr.push(result)
    }
  }


  return remindArr
}
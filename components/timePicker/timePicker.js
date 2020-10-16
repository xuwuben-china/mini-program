const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
// 28天的日期数组
const day28 = Array.from({
  length: 28
}, (v, k) => {
  return zero0(k + 1)
})
// 29天的日期数组
const day29 = Array.from({
  length: 29
}, (v, k) => {
  return zero0(k + 1)
})
// 30天的日期数组
const day30 = Array.from({
  length: 30
}, (v, k) => {
  return zero0(k + 1)
})
// 31天的日期数组
const day31 = Array.from({
  length: 31
}, (v, k) => {
  return zero0(k + 1)
})
//获取年
for (let i = date.getFullYear() - 5; i <= date.getFullYear() + 5; i++) {
  years.push(i);
}
//获取月份
for (let i = 1; i <= 12; i++) {
  months.push(zero0(i));
}
//获取日期
for (let i = 1; i <= 31; i++) {
  days.push(zero0(i));
}
//获取小时
for (let i = 0; i < 24; i++) {
  hours.push(zero0(i));
}
//获取分钟
for (let i = 0; i < 60; i++) {
  minutes.push(zero0(i));
}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    mode: {
      type: String,
      value: "date-time"
    },
    fmt: {
      type: String,
    },
    fields: {
      type: String,
      value: "day"
    },
    cancleText: {
      type: String,
      value: "取消"
    },
    confirmText: {
      type: String,
      value: "确定"
    },
    show: {
      type: Boolean,
      value: true
    },
    value: {
      type: String,
      value: formatTime("YYYY-MM-dd hh:mm", new Date())
    },
    start: {
      type: String,
      value: customTime(-5)
    },
    end: {
      type: String,
      value: customTime(5)
    }
  },
  observers: {
    show(val) {
      if (val) {
        this.setData({
          showPicker: true,
          isSlideInDown: false
        })
        let animationSlideIn = wx.createAnimation({
          duration: 500,
          timingFunction: "ease"
        });
        let animationFade = wx.createAnimation({
          duration: 500,
          timingFunction: "ease"
        });
        setTimeout(() => {
          animationSlideIn.bottom(0).step();
          animationFade.opacity(0.7).step();
          this.setData({
            animationFade: animationFade.export(),
            animationSlideIn: animationSlideIn.export()
          })
        }, 0)
      } else {
        this.setData({
          isSlideInDown: true
        })
        let animationSlideIn = wx.createAnimation({
          duration: 500,
          timingFunction: "ease"
        });
        let animationFade = wx.createAnimation({
          duration: 500,
          timingFunction: "ease"
        });
        animationSlideIn.bottom(-320).step();
        animationFade.opacity(0).step();
        this.setData({
          animationFade: animationFade.export(),
          animationSlideIn: animationSlideIn.export()
        });
      }
    },
    fmt(val) {
      // YYYY-MM-dd hh:mm:ss
      if (val) {
        this.setData({
          timeFMT: val
        })
      }
    },
    mode(val) {
      // time date date-time
      switch (val) {
        case "time":
          this.setData({
            "timeFlag.year": false,
            "timeFlag.month": false,
            "timeFlag.day": false
          })
          break;
        case "date":
          this.setData({
            "timeFlag.hour": false,
            "timeFlag.minute": false,
            "timeFlag.second": false
          })
          break;
      }
    },
    fields(val) {
      //  day month  minute second
      let {
        mode
      } = this.data
      switch (mode) {
        case "data-time":
          if (val === "minute") {
            this.setData({
              "timeFlag.second": false
            })
          } else if (val === "minute") {
            this.setData({
              "timeFlag.minute": false,
              "timeFlag.second": false
            })
          }
          break;
        case "time":
          if (val === "minute") {
            this.setData({
              "timeFlag.year": false,
              "timeFlag.month": false,
              "timeFlag.day": false,
              "timeFlag.second": false
            })
          }
          break;
        case "date":
          if (val === "month") {
            this.setData({
              "timeFlag.hour": false,
              "timeFlag.minute": false,
              "timeFlag.second": false,
              "timeFlag.day": false,
            })
          }
          break;
      }
    },
    start(val) {},
    end(val) {},
    value(val) {}
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 控制列显示
    timeFlag: {
      year: true,
      month: true,
      day: true,
      hour: true,
      minute: true,
      second: true
    },
    timeFMT: "",
    timeFields: "",
    timeMode: "",
    // 打开timePicker
    showPicker: false,
    // 判断是否退出 （向下隐藏）
    isSlideInDown: false,
    // 定义向上显示向下隐藏动画
    animationSlideIn: null,
    // 定义淡入淡出动画
    animationFade: null,
    // 定义picker高度
    pickerViewHeight: 290,
    //是否改变了值
    isPickerChanged: false,
    // 是否在滚动中
    isPicking: false,
    // 时间对应的下标
    timeIndexArr: [0, 0, 0, 0, 0, 0],
    yearList: years,
    monthList: months,
    dayList: days,
    hourList: hours,
    minuteList: minutes,
    secondList: minutes,
    // 当前选中到的年份
    choose_year: "",
    // 当前选中的月份
    choose_month: "",
    // 当前选中的天
    choose_day: "",
    // 当前选中时间
    choose_time: "",
    // 开始年份
    start_year: "",
    // 开始月份
    start_month: "",
    // 结束年份
    end_year: "",
    // 结束月份
    end_month: "",
    // 当前选中时间对应的下标
    currentIndexArr: [],
    // 开始年份 月份数组
    start_monthList: [],
    // 开始年份 日期数组
    start_dayList: [],
    // 结束年份 月份数组
    end_monthList: [],
    // 结束年份 日期数组
    end_dayList: [],
    // 当前转动的列
    currentColumnChange: 0
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this._initDataList()
      this._initTime()
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化
    _initTime() {
      let {
        value,
        choose_year,
        choose_month,
        choose_day,
        start_year,
        start_month,
        start_day,
        end_year,
        end_month,
        end_day,
        start_monthList,
        start_dayList,
        end_monthList,
        end_dayList
      } = this.data

      // 获取选中时间 天数 数组 区分闰年及30天和31天情况
      let dayList = this._countDate(choose_year, choose_month)
      let monthList = months
      if (start_year === choose_year) {
        monthList = start_monthList
        if (start_month === choose_month) {
          dayList = start_dayList
        }
      } else if (end_year === choose_year) {
        monthList = end_monthList
        if (end_month === choose_month) {
          dayList = end_dayList
        }
      }
      this.setData({
        monthList,
        dayList
      }, () => {
        this.setData({
          timeIndexArr: this._timeConvertIndex(value),
          currentIndexArr: this._timeConvertIndex(value)
        })
      })
    },
    pickerChange(e) {
      let indexArr = e.detail.value
      let choose_index = this.data.currentColumnChange
      let {
        yearList,
        monthList,
        dayList,
        hourList,
        minuteList,
        secondList
      } = this.data
      let choose_year = yearList[indexArr[0]],
        choose_month = monthList[indexArr[1]],
        choose_day = dayList[indexArr[2]],
        choose_hour = hourList[indexArr[3]],
        choose_min = minuteList[indexArr[4]],
        choose_sec = secondList[indexArr[5]]
      this.setData({
        choose_year,
        choose_month,
        choose_day,
        choose_hour,
        choose_min,
        choose_sec
      })
      let num_choose_year = Number(choose_year),
        num_choose_month = Number(choose_month),
        num_choose_day = Number(choose_day),
        num_choose_hour = Number(choose_hour),
        num_choose_min = Number(choose_min),
        num_choose_sec = Number(choose_sec)
      let year_index = yearList.map(Number).indexOf(num_choose_year),
        month_index = monthList.map(Number).indexOf(num_choose_month),
        day_index = dayList.map(Number).indexOf(num_choose_day),
        hour_index = hourList.map(Number).indexOf(num_choose_hour),
        min_index = minuteList.map(Number).indexOf(num_choose_min),
        sec_index = secondList.map(Number).indexOf(num_choose_sec)

      this._countList(choose_index, indexArr).then(res => {
        this._restTimeIndex({
          num_choose: {
            num_choose_year,
            num_choose_month,
            num_choose_day,
            num_choose_hour,
            num_choose_min,
            num_choose_sec
          },
          time_index: {
            year_index,
            month_index,
            day_index,
            hour_index,
            min_index,
            sec_index
          }
        })
      })
    },
    pickerStart(e) {
      this.setData({
        isPicking: true
      })
    },
    pickerEnd(e) {
      this.setData({
        isPicking: false
      })
    },
    // 根据时间取下标
    _timeConvertIndex(time) {
      let year_index = 0,
        month_index = 0,
        day_index = 0,
        hour_index = 0,
        min_index = 0,
        sec_index = 0;
      let timeArr = divisionTime_arr(time)
      let year = timeArr[0]
      let month = timeArr[1]
      let day = timeArr[2]
      let hour = timeArr[3]
      let min = timeArr[4]
      let sec = timeArr[5]
      let {
        yearList,
        monthList,
        dayList,
        hourList,
        minuteList,
        secondList
      } = this.data
      year_index = yearList.map(Number).indexOf(Number(year))
      month_index = monthList.map(Number).indexOf(Number(month))
      day_index = dayList.map(Number).indexOf(Number(day))
      hour_index = hourList.map(Number).indexOf(Number(hour))
      min_index = minuteList.map(Number).indexOf(Number(min))
      sec_index = secondList.map(Number).indexOf(Number(sec))
      return [year_index, month_index, day_index, hour_index, min_index, sec_index]
    },
    // 根据下标数组转化为时间
    _indexConvertTime() {
      let {
        timeIndexArr,
        yearList,
        monthList,
        dayList,
        hourList,
        minuteList,
        secondList
      } = this.data
      let year_index = timeIndexArr[0],
        month_index = timeIndexArr[1],
        day_index = timeIndexArr[2],
        hour_index = timeIndexArr[3],
        min_index = timeIndexArr[4],
        sec_index = timeIndexArr[5]

      let year = yearList[year_index],
        month = monthList[month_index],
        day = dayList[day_index],
        hour = hourList[hour_index],
        min = minuteList[min_index],
        sec = secondList[sec_index]
      let choose_time = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
      this.setData({
        choose_time
      })
      return choose_time
    },
    // 根据当前选中时间 重置下标数组
    _restTimeIndex(timeArr) {
      let {
        monthList,
        dayList
      } = this.data
      let {
        num_choose_year,
        num_choose_month,
        num_choose_day,
        num_choose_hour,
        num_choose_min,
        num_choose_sec
      } = timeArr.num_choose
      let {
        year_index,
        month_index,
        day_index,
        hour_index,
        min_index,
        sec_index
      } = timeArr.time_index
      let count_month_index = monthList.map(Number).indexOf(num_choose_month),
        count_day_index = dayList.map(Number).indexOf(num_choose_day)
      if (count_month_index !== month_index) {
        if (monthList[count_month_index]) {
          month_index = count_month_index
        } else {
          if (num_choose_month > Number(monthList[monthList.length - 1])) {
            month_index = monthList.length - 1
          } else {
            month_index = 0
          }
        }
      }
      if (count_day_index !== day_index) {
        if (dayList[count_day_index]) {
          day_index = count_day_index
        } else {
          if (num_choose_day > Number(dayList[dayList.lenght - 1])) {
            day_index = dayList.length - 1
          } else {
            day_index = 0
          }
        }
      }
      this.setData({
        // currentIndexArr: [year_index, month_index, day_index, hour_index, min_index, sec_index]
        timeIndexArr: [year_index, month_index, day_index, hour_index, min_index, sec_index]
      }, () => {
        this._indexConvertTime()
      })
    },
    // 判断转动的是哪列
    // _countColumn(chooseArr) {
    //   let {
    //     timeIndexArr
    //   } = this.data
    //   let choose_index
    //   timeIndexArr.forEach((item, index) => {
    //     if (item !== chooseArr[index]) {
    //       choose_index = index
    //     }
    //   })
    //   return choose_index
    // },
    columnTouchstart(e) {
      let {
        index
      } = e.currentTarget.dataset
      this.setData({
        currentColumnChange: Number(index)
      })
      return
    },
    // 计算当前滚动的列对应的其他数组
    _countList(column, timeIndexArr) {
      return new Promise((reslove, reject) => {
        let {
          start_monthList,
          end_monthList,
          start_dayList,
          end_dayList,
          start_month,
          end_month,
          yearList,
          monthList,
          dayList
        } = this.data
        let choose_year = yearList[timeIndexArr[0]],
          choose_month = monthList[timeIndexArr[1]],
          num_start_year = Number(yearList[0]),
          num_end_year = Number(yearList[yearList.length - 1]),
          num_start_month = Number(start_month),
          num_end_month = Number(end_month),
          num_choose_year = Number(choose_year),
          num_choose_month = Number(choose_month)
        switch (column) {
          case 0:
            if (num_start_year === num_choose_year) {
              monthList = start_monthList
              if (num_start_month === num_choose_month) {
                dayList = start_dayList
              }
            } else if (num_end_year === num_choose_year) {
              monthList = end_monthList
              if (num_end_month === num_choose_month) {
                dayList = start_dayList
              }
            } else {
              dayList = this._countDate(choose_year, choose_month)
            }
            this.setData({
              monthList,
              dayList
            }, () => {
              reslove({
                monthList,
                dayList
              })
            })
            break;
          case 1:
            dayList = this._countDate(choose_year, choose_month)
            if (num_start_year === num_end_year) {
              if (num_start_month === num_choose_month) {
                dayList = start_dayList
              } else if (num_end_month === num_choose_month) {
                dayList = end_dayList
              }
            } else if (num_start_year === num_choose_year) {
              if (num_start_month === num_choose_month) {
                dayList = start_dayList
              }
            } else if (num_end_year === num_choose_year) {
              if (num_end_month === num_choose_month) {
                dayList = end_dayList
              }
            }
            this.setData({
              dayList
            }, () => {
              reslove({
                dayList
              })
            })
            break;
          case 2:
          case 3:
          case 4:
          case 5:
            reslove({
              dayList
            })
            break;
        }
      })


    },
    /* 
     * 初始化 数据
     * 年数组 开始年 开始月 开始天 结束年 结束月 结束天 开始月 开始天数组， 结束月数组， 结束天数组
     * yearList start_year start_month start_day end_year end_month end_day start_monthList， start_dayList， end_monthList， end_dayList
     */
    _initDataList() {
      let {
        value,
        start,
        end
      } = this.data
      // 获取选中的时间数组
      let currentTimeArr = divisionTime_arr(value)
      let choose_time = formatTime("YYYY-MM-dd hh:mm:ss", new Date(value.replace(/-/g, "/")))
      let choose_year = currentTimeArr[0],
        choose_month = currentTimeArr[1],
        choose_day = currentTimeArr[2]
      // 计算年数组
      let startYear = start.split("-")[0]
      let endtYear = end.split("-")[0]
      let yearList = []
      for (let i = Number(startYear); i <= Number(endtYear); i++) {
        yearList.push(i);
      }
      // 开始时间数组
      let startTimeArr = divisionTime_arr(start)
      let start_year = startTimeArr[0]
      let start_month = startTimeArr[1]
      let start_day = startTimeArr[2]
      // 结束时间数组
      let endTimeArr = divisionTime_arr(end)
      let end_year = endTimeArr[0]
      let end_month = endTimeArr[1]
      let end_day = endTimeArr[2]
      // 计算天数组
      let dayList = this._countDate(choose_year, choose_month)
      this.setData({
        choose_year,
        choose_month,
        choose_day,
        choose_time,
        yearList,
        start_year,
        start_month,
        start_day,
        end_year,
        end_month,
        end_day
      })
      let start_monthList, start_dayList, end_monthList, end_dayList
      // 开始年份和结束年份相同时 年份数组只有一条时
      if (start_year === end_year) {
        // 当开始月发和结束月份相同时
        if (start_month === end_month) {
          end_dayList = start_dayList = dayList.filter(item => end_day >= Number(item) && Number(item) >= start_day)
        } else {
          start_dayList = dayList.filter(item => Number(item) >= start_day)
          end_dayList = dayList.filter(item => end_day >= Number(item))
        }
        end_monthList = start_monthList = months.filter(item => end_month >= Number(item) && Number(item) >= start_month)
      } else {
        // 开始年份和结束年份不相同时 年份数组有多个时
        start_monthList = months.filter(item => Number(item) >= start_month)
        start_dayList = dayList.filter(item => Number(item) >= start_day)
        end_monthList = months.filter(item => end_month >= Number(item))
        end_dayList = dayList.filter(item => end_day >= Number(item))
      }
      this.setData({
        start_monthList,
        start_dayList,
        end_monthList,
        end_dayList
      })
    },
    // 根据当前年和当前月计算出对应的天数  处理30天和31天 及 闰年
    _countDate(year, months) {
      let arr = []
      switch (parseInt(months)) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          arr = day31
          break
        case 4:
        case 6:
        case 9:
        case 11:
          arr = day30
          break
        case 2:
          if (((parseInt(year) % 400 == 0) || (parseInt(year) % 100 != 0)) && (parseInt(year) % 4 == 0)) {
            arr = day29
          } else {
            arr = day28
          }
          break
      }
      return arr
    },
    preventDefault() {},
    hideModal() {
      this.triggerEvent("hidePicker")
    },
    slideInEnd(e) {
      let isSlideInDown = this.data.isSlideInDown
      if (isSlideInDown) {
        this.setData({
          showPicker: false
        })
      }
    },
    cancle() {
      this.triggerEvent("cancle")
      this.setData({
        showPicker: false
      })
    },
    confirm() {
      if (!this.data.isPicking) {
        let {
          choose_time,
          timeMode,
          timeFMT,
          timeFields
        } = this.data
        let time = choose_time
        if (timeFMT) {
          time = formatTime(timeFMT, new Date(choose_time))
        }
        let fmt = "YYYY-MM-dd hh:mm:ss"
        switch (timeMode) {
          case "date-time":
            fmt = "YYYY-MM-dd hh:mm:ss"
            if (timeFields === "minute") {
              fmt = "YYYY-MM-dd hh:mm"
            } else if (timeFields === "hour") {
              fmt = "YYYY-MM-dd hh"
            }
            time = formatTime(fmt, new Date(choose_time))
            this.triggerEvent("confirm", time)
            break;
          case "date":
            fmt = "YYYY-MM-dd"
            if (timeFields === "month") {
              fmt = "YYYY-MM"
            }
            time = formatTime(fmt, new Date(choose_time))
            this.triggerEvent("confirm", time)
            break;
          case "time":
            fmt = "hh:mm:ss"
            if (timeFields === "minute") {
              fmt = "hh:mm"
            }
            time = formatTime(fmt, new Date(choose_time))
            this.triggerEvent("confirm", time)
            break;
        }
        this.setData({
          showPicker: false
        })
      }
    }
  }
})
// 补0函数
function zero0(num) {
  let n_num = Number(num)
  return n_num >= 10 ? n_num : "0" + n_num
}
/**
 * 格式化时间
 * 
 * @param {String } fmt 时间格式   YYYY-MM-dd hh:mm:ss:S
 * @param {String|Number} date 时间对象或时间戳
 * 
 */
function formatTime(fmt, date) {
  // 判断是否是时间戳
  if (/^\d{10,13}$/.test(Number(date))) {
    date = new Date(date)
  }
  let weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  let o = {
    "M+": date.getMonth() + 1, //月
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3),
    /*季度 */
    "w": date.getDay(),
    "S": date.getMilliseconds() //毫秒
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1 == 'w') ? weekDays[o[k]] : (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}
/**
 * 自定义一个格式时间
 * 
 * @param { String|Number } num 自定义时间距当前时间的差距
 * @param { String }   fields   时间粒度 "year" "month" "day" "hour" 距当前时间的单位
 * @param {String|Number} date 返回的时间格式
 * 
 */
function customTime(num = 1, fields = "year", fmt = "YYYY-MM-dd hh:mm:ss") {
  let hour = 24,
    day = 365,
    year = num
  switch (fields) {
    case "year":
      year = num;
      break;
    case "month":
      day = num * 30
      year = 1
      break;
    case "day":
      day = num
      year = 1
      break;
    case "hour":
      hour = num
      day = year = 1
      break;
  }
  let nowDate = new Date()
  let setDateStamp = nowDate.getTime() + 1000 * 60 * 60 * hour * day * year
  nowDate.setTime(setDateStamp)
  return formatTime(fmt, nowDate)
}
// 正数补错 当数小于0时返回0
function positiveNum(num) {
  return num > 0 ? num : 0
}
/**
 * 时间分割成数组
 * 
 * @param { String|Number } time 传入的时间
 * 
 * @return {Array} 返回长度为6数组 "2020-08-28" => [2020,08,28,0,0,0]
 */
function divisionTime_arr(time) {
  // 2020-08-28 20:00:00
  let year, month, day, hour = 0,
    min = 0,
    sec = 0;
  // ["2020-08-28","20:00:00"]
  let dateArr = time.split(" ")
  // 2020-08-28
  let date = dateArr[0]
  // ["2020","08","28"]
  let y_m_d_arr = date.split("-")
  year = y_m_d_arr[0]
  month = y_m_d_arr[1]
  day = y_m_d_arr[2]
  // 20:12:00
  if (dateArr[1]) {
    // ["20","00","00"]
    let timeArr = dateArr[1].split(":")
    hour = timeArr[0]
    if (time[1]) {
      min = timeArr[1]
    }
    if (time[2]) {
      sec = timeArr[2]
    }
  }
  return [year, month, day, hour, min, sec]
}
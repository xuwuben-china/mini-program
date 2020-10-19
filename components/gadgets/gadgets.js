let winWidth, winHeight, winWidthHalf
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    prohibitSlide: "",
    toolsIsLeft: false,
    toolHeight: 150,
    // x: 500,
    // y: 1000,
    animateName: "",
    miniProgramList: [{
        addId: "wx4051501b6c692dab",
        icon: "../../images/std.png",
        name: "数胎动",
        path: "",
      },
      {
        addId: "wx6b58e3ea5cee5c18",
        icon: "../../images/cjzs.png",
        name: "产检助手",
        path: "",
      },
      {
        addId: "wxd385f069130c9b85",
        icon: "../../images/tzgl.png",
        name: "孕期体重管理",
        path: "",
      }
    ],
  },
  lifetimes: {
    attached() {
      let winInfo = wx.getSystemInfoSync()
      winWidth = winInfo.windowWidth
      winHeight = winInfo.windowHeight
      winWidthHalf = winInfo.windowWidth / 2
      this.setData({
        x: winInfo.windowWidth,
        y: winInfo.windowHeight - 20,
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showTools(e) {
      if (!this.data.animateName || this.data.animateName === "hide") {
        this.setData({
          animateName: "show",
          prohibitSlide: true
        })
        return
      }
      if (this.data.animateName === "show") {
        this.setData({
          animateName: "hide",
          prohibitSlide: ''
        }, () => {
          setTimeout(() => {
            this.setData({
              animateName: ""
            })
          }, 500)
        })
        return
      }
    },
    toolsMove(e) {
      let touches = e.changedTouches[0]
      let currentX = touches.clientX
      if (currentX >= winWidthHalf) {
        this.setData({
          toolsIsLeft: false
        })
      } else {
        this.setData({
          toolsIsLeft: true
        })
      }
    },
    toolsStart(e) {
      let touches = e.changedTouches[0]
      let currentX = touches.clientX
      if (currentX >= winWidthHalf) {
        this.setData({
          toolsIsLeft: false
        })
      } else {
        this.setData({
          toolsIsLeft: true
        })
      }
    },
    toolsEnd(e) {
      let touches = e.changedTouches[0]
      let currentX = touches.clientX
      let currentY = touches.clientY
      let offsetTop
      let self = this
      this.createSelectorQuery().select('#tool-warp').boundingClientRect((rect) => {
        console.log(rect);

        offsetTop = currentY - rect.top
        if (currentX >= winWidthHalf) {
          self.setData({
            x: winWidth,
            y: currentY - offsetTop
          })
        } else {
          self.setData({
            x: 0,
            y: currentY - offsetTop
          })
        }
      }).exec()
    },
  }
})
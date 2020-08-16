//index.js
const pageCompsMap = require('../../pageCompsMap');
const tagCompsMap = require('../../tagCompsMap');

Page({
  data: {
    tabList: ['页面分类', '标签分类'],
    tabListComps: [pageCompsMap.list, tagCompsMap.list],
    tabCurrent: 0,
    swiperCurrent: 0,
  },
  onLoad: function () {

  },
  onTabChange: function (e) {
    const { index } = e.detail;
    this.setData({
      swiperCurrent: index % 2,
      tabCurrent: index
    });
  },
  swiperChange: function(e) {
    const { current } = e.detail;
    this.setData({
      swiperCurrent: current,
      tabCurrent: current
    });
  },
  navigateTo: function(e) {
    console.log(e);
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({
      url: path,
    })
  }
})
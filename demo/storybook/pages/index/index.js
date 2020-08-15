//index.js
const pageCompsMap = require('../../pageCompsMap');
const tagCompsMap = require('../../tagCompsMap');

Page({
  data: {
    tabList: ['页面分类', '标签分类'],
    tabListComps: [pageCompsMap.list, tagCompsMap.list]
  },
  onLoad: function () {

  },
  onTabChange: function (e) {
    const { index } = e.detail;
    console.log('onTabChange', index);
  },
  navigateTo: function(e) {
    console.log(e);
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({
      url: path,
    })
  }
})
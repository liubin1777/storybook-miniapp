//index.js
const aPage = require('../base/apage.js'); // page基类
const mockapi = require('../mockapi'); // 模拟API接口数据

/**
 * 开发同学需要在此处添加要测试的 【UI状态和数据】
*/
const actionList = [
  {
    title: '标题', // 测试状态标题
    dataList: ['标题1', '标题2', '标题3'], // 测试的数据
    setDataKey: 'mockData.name'
  },
  {
    title: '颜色',
    dataList: ['ff0000', '00ff00', '0000ff'],
    setDataKey: 'mockData.color',
    action: ({dataList, index, value}) => { // 点击状态按钮回调事件
      return `#${value}`
    }
  }
]

aPage({
  data: {
    actionList
  },
  onLoad: function () {

    // API接口洗数据
    console.log('mockapi', mockapi);
    const mockData = {
      name: mockapi.data.component.title, // 测试组件-标题
      color: mockapi.data.component.color, // 测试组件-标题颜色
    };

    this.setData({
      mockData
    });
  }
})
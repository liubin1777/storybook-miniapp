// components/tab/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [
        'tab1',
        'tab2'
      ]
    },
    current: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onClick: function(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('onChange', {index});
    }
  }
})

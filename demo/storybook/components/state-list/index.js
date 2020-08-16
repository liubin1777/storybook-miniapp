// storybook/components/state-list/index.js
Component({
  externalClasses: ['ext-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: []
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
    onTap: function(e) {
      const { list } = this.properties;
      const { index, title } = e.target.dataset;
      const item = list[index];
      let { dataList, $currentIndex = -1 } = item;

      $currentIndex++;

      if ($currentIndex >= dataList.length) {
        $currentIndex = 0;
      }

      const currentValue = dataList[$currentIndex];
      item.$currentIndex = $currentIndex;

      this.triggerEvent('tap',{ title, detail: {dataList, index: $currentIndex, value: currentValue }});
    }
  }
})

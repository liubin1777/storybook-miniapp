/**
 * 基础aPage
 */

module.exports = (options) => {
  const { onLoad } = options;
  delete options.onLoad;

  return Page(
    {
      onLoad: function (e) {
        onLoad && onLoad.call(this, e);
      },
      $onTap({ title, detail }) {
        this.data.actionList.forEach((item) => {
          if (title == item.title) {
            let value = detail.value;
            if (item.action) {
              value = item.action(detail);
              console.log(title, detail, value);
            } else {
              console.log(title, detail);
            }
            this.setData({
              [item.setDataKey]: value,
            });
          }
        });
      },
    },
    ...options
  );
};

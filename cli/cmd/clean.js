/**
 * clean 命令：清除命令
 */

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');

program.command('clean').description('清除 storybook 代码').action(clean);

function clean() {
  const pagesPath = path.resolve('./storybook', 'pages.json');
  if (fs.existsSync(pagesPath)) {
    // storybook的pages列表
    const storybookPagesJSON = require(pagesPath);
    // app.json的pages列表
    const appJSON = require(path.resolve('app.json'));

    storybookPagesJSON.pages.forEach((pagePath) => {
      const index = appJSON.pages.indexOf(pagePath);
      if (index > -1) {
        appJSON.pages.splice(index, 1);
      }
    });

    // 生成 storybook pages列表
    fs.writeFile(path.resolve('./app.json'), JSON.stringify(appJSON, null, 2));
  }

  rimraf.sync('storybook');

  console.log('playground 清除成功');
}

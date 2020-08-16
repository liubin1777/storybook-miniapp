/**
 * init 命令：创建 storybook.config.js 配置文件
 */

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');

program
  .command('init')
  .description('初始化 storybook.config.js 配置文件')
  .action(callback);

function callback() {
  const configPath = './storybook.config.js';
  if (fs.existsSync(configPath)) {
    console.warn('storybook.config.js 配置文件已存在，请不要重复创建');
  } else {
    fs.copy(
      path.resolve(__dirname, '../temp/storybook.config.js'),
      path.resolve(configPath)
    )
      .then(() => {
        console.log('storybook.config.js 配置创建成功');
      })
      .catch((err) => console.error(err));
  }
}

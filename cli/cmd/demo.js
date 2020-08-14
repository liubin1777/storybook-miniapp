/**
 * demo 命令：创建demo工程
 */

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');

program.command('demo').description('初始化 demo 工程').action(demo);

function demo() {
  fs.copy(
    path.resolve(__dirname, '../../demo'),
    path.resolve('./storybook-miniapp-demo')
  )
    .then(() => {
      console.log('demo 工程创建成功');
    })
    .catch((err) => console.error(err));
}

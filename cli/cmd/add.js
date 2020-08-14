/**
 * add 命令： 创建组件的storybook模板环境
 */

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const utils = require('../utils/index');

program.command('add').description('创建 __storybook__ 组件模板').action(add);

function add() {
  const componentNameKey = '输入组件名称';
  let componentName = '';

  inquirer
    .prompt({
      type: 'input',
      name: componentNameKey,
      default: '测试组件',
    })
    .then((answers) => {
      componentName = answers[componentNameKey];

      const originPath = path.resolve(__dirname, '../temp/__storybook__');
      const destPath = path.resolve('./__storybook__');
      if (fs.existsSync(destPath)) {
        console.warn(
          `【${componentName}】组件模板 __storybook__ 已存在，请勿重复创建`
        );
      } else {
        // 复制 __storybook__ 模板目录
        utils.copyTpl(originPath, destPath, { componentName }, (e) => {
          e
            ? console.error(e)
            : console.log(
                `【${componentNameKey}】组件模板 __storybook__ 创建成功`
              );
        });
      }
    });
}

/**
 * component 命令： 创建组件
 */

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const utils = require('../utils/index');
const { exec } = require('child_process');

program.command('component').description('创建组件').action(callback);

function callback() {
  const componentNameENKey = '输入组件英文名';
  let componentNameEN = '';
  const componentNameCNKey = '输入组件中文名';
  let componentNameCN = '';
  const pageNameKey = '组件所属页面';
  let pageName = '';
  const tagNameKey = '组件所属标签';
  let tagName = '';

  inquirer
    .prompt({
      type: 'input',
      name: componentNameENKey,
      default: 'TestComponent',
    })
    .then((answers) => {
      componentNameEN = answers[componentNameENKey];
    })
    .then(() => {
      return inquirer.prompt({
        type: 'input',
        name: componentNameCNKey,
        default: '测试组件',
      });
    })
    .then((answers) => {
      componentNameCN = answers[componentNameCNKey];
    })
    .then(() => {
      return inquirer.prompt({
        type: 'input',
        name: pageNameKey,
        default: '测试页面',
      });
    })
    .then((answers) => {
      pageName = answers[pageNameKey];
    })
    .then(() => {
      return inquirer.prompt({
        type: 'input',
        name: tagNameKey,
        default: '测试标签',
      });
    })
    .then((answers) => {
      tagName = answers[tagNameKey];
    })
    .then(() => {
      // 模板变量对象
      const tempContext = {
        componentNameEN,
        componentNameCN,
        pageName,
        tagName,
      };

      // 创建组件模板
      const componentOriginPath = path.resolve(__dirname, '../temp/component');
      const componentDestPath = path.resolve(`./${componentNameEN}`);

      if (fs.existsSync(componentDestPath)) {
        console.warn(`组件【${componentNameEN}】目录已存在，请勿重复创建`);
        process.exit(0);
      }

      // 复制组件模板
      utils.copyTpl(
        componentOriginPath,
        componentDestPath,
        tempContext,
        (e) => {
          e
            ? console.error(e)
            : console.log(`组件【${componentNameEN}】创建成功`);
        }
      );

      // 创建 storybook 模板
      const originPath = path.resolve(__dirname, '../temp/_storybook_');
      const destPath = path.resolve(`./${componentNameEN}/_storybook_`);
      // 复制 _storybook_ 模板目录
      utils.copyTpl(originPath, destPath, tempContext, (e) => {
        e
          ? console.error(e)
          : console.log(`组件【${componentNameEN}】模板 _storybook_ 创建成功`);
      });
    })
    .then(() => {
      // 重新运行
      exec(`storybook-miniapp run`);
    });
}

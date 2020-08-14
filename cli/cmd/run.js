/**
 * run 命令：运行storybook
 */

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

// storybook根目录
const storybookPath = './storybook';
// 配置文件
const configPath = './storybook.config.js';

program.command('run').description('运行 storybook').action(run);

function run() {
  const configPath = './storybook.config.js';
  if (!fs.existsSync(configPath)) {
    console.warn(
      `请在 storybook.config.js （配置文件不存在，请先运行命令：storybook-miniapp init）所在目录运行命令：storybook-miniapp run`
    );

    process.exit(1);
  }

  // 复制src目录到项目的 storybook 目录
  fs.copySync(
    path.resolve(__dirname, '../../src'),
    path.resolve(storybookPath)
  );

  // 读取配置文件
  const config = require(path.resolve(configPath));
  const { match = [] } = config;

  const globPromises = [];
  // 配置playground组件文件
  match.forEach((pattern) => {
    globPromises.push(globPromise(pattern));
  });

  // 读取页面
  const storybookPagesJSON = require(path.resolve(storybookPath, 'pages.json'));

  const pageCompsMap = {};
  const tagCompsMap = {};

  Promise.all(globPromises).then((values) => {
    values.forEach((files) => {
      files.forEach((filePath) => {
        const config = require(path.resolve(filePath, 'config.json'));
        const { pageName, tagName } = config;

        // 组件英文名字
        const pathArray = filePath.split('/');
        const compNameEN = pathArray[pathArray.length - 2];
        config.componentNameEN = compNameEN;

        // 组件路径
        const compPath = filePath + '/index/index';
        storybookPagesJSON.pages.push(compPath);
        config.path = '/' + compPath;

        !pageCompsMap[pageName] && (pageCompsMap[pageName] = []);
        pageCompsMap[pageName].push(config);

        !tagCompsMap[tagName] && (tagCompsMap[tagName] = []);
        tagCompsMap[tagName].push(config);
      });
    });

    const pageCompsList = [];
    Object.keys(pageCompsMap).forEach((pageName) => {
      pageCompsList.push({
        type: pageName,
        list: pageCompsMap[pageName],
      });
    });

    const tagCompsList = [];
    Object.keys(tagCompsMap).forEach((tagName) => {
      tagCompsList.push({
        type: tagName,
        list: tagCompsMap[tagName],
      });
    });

    fs.writeFile(
      path.resolve(storybookPath, 'pageCompsMap.json'),
      JSON.stringify({ list: pageCompsList }, null, 2)
    );

    fs.writeFile(
      path.resolve(storybookPath, 'tagCompsMap.json'),
      JSON.stringify({ list: tagCompsList }, null, 2)
    );

    // 生成 storybook pages 列表
    fs.writeFile(
      path.resolve(storybookPath, 'pages.json'),
      JSON.stringify(storybookPagesJSON, null, 2)
    );

    // 写入app.jsond哦pages列表
    const appJSON = require(path.resolve('app.json'));

    const pagesLength = playgroundPagesJSON.pages.length;
    for (let i = pagesLength - 1; i > -1; i--) {
      const pagePath = storybookPagesJSON.pages[i];
      if (!appJSON.pages.includes(pagePath)) {
        appJSON.pages.unshift(pagePath);
      }
    }

    fs.writeFile(path.resolve('app.json'), JSON.stringify(appJSON, null, 2));

    console.log('storybook-miniapp 运行成功');
  });
}

function globPromise(pattern = '', options = {}) {
  return new Promise((resolve) => {
    glob(pattern, options, function (error, files = []) {
      error && console.error(error) && resolve();
      resolve(files);
    });
  });
}

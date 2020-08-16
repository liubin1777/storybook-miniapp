/**
 * run 命令：运行storybook
 */

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

program.command('run').description('运行 storybook').action(callback);

function callback(args) {
  const {rootPath, configPath} = getConfig();

  // storybook根目录
  const storybookPath = `${rootPath}storybook`;

  const appJSONPath = `${rootPath}app.json`;

  // console.log({configPath, storybookPath, appJSONPath});

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
    globPromises.push(globPromise(`${rootPath}${pattern}`));
  });

  // 读取页面
  const storybookPagesJSON = require(path.resolve(storybookPath, 'pages.json'));

  const pageCompsMap = {};
  const tagCompsMap = {};

  // 遍历组件
  Promise.all(globPromises).then((values) => {
    values.forEach((files) => {
      console.log(files);
      files.forEach((filePath) => {
        const config = require(path.resolve(filePath, 'config.json'));
        const { pageName, tagName } = config;

        // 组件图片
        config.image = path.relative(`${rootPath}/storybook/pages/index`, filePath) + '/default.png';
        console.log(config.image);

        // 组件英文名字
        const pathArray = filePath.split('/');
        const compNameEN = pathArray[pathArray.length - 2];
        config.componentNameEN = compNameEN;

        filePath = getPagePath(filePath);

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
      path.resolve(storybookPath, 'pageCompsMap.js'),
      `module.exports = ${JSON.stringify({ list: pageCompsList }, null, 2)}`
    );

    fs.writeFile(
      path.resolve(storybookPath, 'tagCompsMap.js'),
      `module.exports = ${JSON.stringify({ list: tagCompsList }, null, 2)}`
    );

    // 生成 storybook pages 列表
    fs.writeFile(
      path.resolve(storybookPath, 'pages.json'),
      JSON.stringify(storybookPagesJSON, null, 2)
    );

    // 写入app.jsond哦pages列表
    const appJSON = require(path.resolve(appJSONPath));

    const pagesLength = storybookPagesJSON.pages.length;
    for (let i = pagesLength - 1; i > -1; i--) {
      const pagePath = storybookPagesJSON.pages[i];
      if (!appJSON.pages.includes(pagePath)) {
        if (pagePath == 'storybook/pages/index/index') {
          appJSON.pages.unshift(pagePath);
        }else {
          appJSON.pages.push(pagePath);
        }
      }
    }

    fs.writeFile(path.resolve(appJSONPath), JSON.stringify(appJSON, null, 2));

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

function getConfig() {
  let path = './';
  for (let i = 0; i < 100; i++) {
    const files = glob.sync(`${path}storybook.config.js`, {});
    // console.log(i, path, files);

    if (files && files.length) {
      return {rootPath: path, configPath: files[0]};
    }

    if (i == 0) {
      path = '../';
    } else {
      path += '../';
    }
  }
}

function getPagePath(file){

  const filePathSegments = file.split('/');
  let result = '';

  for(let i=0; i<filePathSegments.length; i++){
    const segmentPath = filePathSegments[i];
    if(segmentPath !== '..' && segmentPath !== '.'){
      result +=`/${segmentPath}`;
    }
  }

  return result.substr(1);
}
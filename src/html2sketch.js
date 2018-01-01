const inject = require('./inject');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

module.exports = async function html2sketch(url, callback) {
  let asketchPageJSONString;

  try {
    asketchPageJSONString = await inject(url);
  } catch (e) {
    return await Promise.reject(e);
  }

  fs.writeFileSync(path.resolve(__dirname, '../plugin/asketch2sketch/page.asketch.json'), asketchPageJSONString);

  const onlyUrl = url.replace('http://', '').replace('/', '-').replace(':', '-');
  const folderId = new Date().getTime();

  const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../plugin/package.json')));
  const manifestJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../plugin/asketch2sketch/manifest.json')));

  const outputFileName = onlyUrl + "-HTMLtoSketch";
  const buildedPluginFolderName = 'build-plugin';
  const buildedPluginFolderUrl = path.resolve(__dirname, '../' + buildedPluginFolderName);
  const outputFolderUrl = buildedPluginFolderUrl + '/' + folderId;
  const outputSkpmUrl = '../' + buildedPluginFolderName + '/' + folderId + '/' + outputFileName + '.sketchplugin';

  packageJson.skpm.main = outputSkpmUrl;
  packageJson.name = outputFileName;
  manifestJson.commands[0].name = packageJson.name;

  if (!fs.existsSync(buildedPluginFolderUrl)){
    fs.mkdirSync(buildedPluginFolderUrl);
  }

  fs.mkdirSync(outputFolderUrl);
  fs.writeFileSync(path.resolve(__dirname, '../plugin/package.json'), JSON.stringify(packageJson, null, 2));
  fs.writeFileSync(path.resolve(__dirname, '../plugin/asketch2sketch/manifest.json'), JSON.stringify(manifestJson, null, 2));

  const command = exec('cd plugin && skpm build');
  command.stdout.on('data', function(data) {
    console.log(data);
  });
  command.stderr.on('data', function(data) {
    console.log(data);
  });
  command.on('close', function () {
    callback(onlyUrl, folderId);
  })

};
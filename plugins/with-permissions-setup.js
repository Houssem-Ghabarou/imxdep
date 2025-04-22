const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const PERMISSION_SCRIPT = `
def node_require(script)
  require Pod::Executable.execute_command('node', ['-p',
    "require.resolve(
      '\#{script}',
      {paths: [process.argv[1]]},
    )", __dir__]).strip
end

node_require('react-native/scripts/react_native_pods.rb')
node_require('react-native-permissions/scripts/setup.rb')

setup_permissions([
  'Camera',
  'PhotoLibrary',
  'PhotoLibraryAddOnly',
  'Microphone',
  'MediaLibrary'
])
`;

module.exports = function withPermissionsSetup(config) {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.projectRoot,
        "ios",
        "Podfile"
      );

      let contents = fs.readFileSync(podfilePath, "utf-8");

      if (!contents.includes("setup_permissions([")) {
        contents = contents.replace(
          /platform :ios, .*\n/,
          (match) => `${match}\n${PERMISSION_SCRIPT}\n`
        );
        fs.writeFileSync(podfilePath, contents);
        console.log("✅ Podfile updated with permissions setup.");
      } else {
        console.log("ℹ️ Podfile already has permissions setup.");
      }

      return config;
    },
  ]);
};

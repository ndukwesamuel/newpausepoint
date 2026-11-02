const fs = require("fs");
const path = require("path");
const { withDangerousMod } = require("expo/config-plugins");

// Newer Xcode rejects Pod targets (incl. resource bundles) below iOS 15.0,
// so bump every Pod target's IPHONEOS_DEPLOYMENT_TARGET to a minimum.
const MARKER = "# withIosPodsDeploymentTarget";

module.exports = function withIosPodsDeploymentTarget(config, { minTarget = "15.1" } = {}) {
  return withDangerousMod(config, [
    "ios",
    async (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, "Podfile");
      let podfile = fs.readFileSync(podfilePath, "utf8");
      if (podfile.includes(MARKER)) return cfg;

      const snippet = `
    ${MARKER}
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |bc|
        if bc.build_settings['IPHONEOS_DEPLOYMENT_TARGET'].to_f < ${parseFloat(minTarget)}
          bc.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${minTarget}'
        end
      end
    end
`;
      const anchor = /post_install do \|installer\|\n/;
      if (!anchor.test(podfile)) {
        throw new Error("withIosPodsDeploymentTarget: post_install block not found in Podfile");
      }
      podfile = podfile.replace(anchor, (m) => m + snippet);
      fs.writeFileSync(podfilePath, podfile);
      return cfg;
    },
  ]);
};

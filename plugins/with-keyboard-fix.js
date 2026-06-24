const { withAndroidManifest } = require("@expo/config-plugins");

// edgeToEdgeEnabled sets windowSoftInputMode="adjustNothing" which breaks
// KeyboardAvoidingView in production APK. Override to "adjustPan" so the
// window pans up when keyboard opens, keeping modal content visible.
module.exports = function withKeyboardFix(config) {
  return withAndroidManifest(config, (config) => {
    const mainActivity = config.modResults.manifest.application?.[0]?.activity?.find(
      (a) => a.$["android:name"] === ".MainActivity"
    );
    if (mainActivity) {
      mainActivity.$["android:windowSoftInputMode"] = "adjustPan";
    }
    return config;
  });
};

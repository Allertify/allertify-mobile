const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.ausath.allertifymobile.dev";
  }

  if (IS_PREVIEW) {
    return "com.ausath.allertifymobile.preview";
  }

  return "com.ausath.allertifymobile";
};

const getAppName = () => {
  if (IS_DEV) {
    return "Allertify (Dev)";
  }

  if (IS_PREVIEW) {
    return "Allertify (Preview)";
  }

  return "Allertify";
};

export default ({ config }) => ({
  ...config,
  name: getAppName(),
  android: {
    ...config.android,
    package: getUniqueIdentifier()
  }
});

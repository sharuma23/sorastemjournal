/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  // routes(defineRoutes) {
  //   return defineRoutes((route) => {
  //     route("/", "routes/articles.tsx");
  //     // route("/articles", "routes/articles/index.tsx");
  //   })
  // }
};

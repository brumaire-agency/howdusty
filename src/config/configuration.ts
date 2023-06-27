export default () => ({
  database: {
    type: process.env.DB_CONNECTION,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  github: {
    access_token: process.env.GITHUB_ACCESS_TOKEN,
  },
  onlydust: {
    host: process.env.ONLYDUST_HOST,
    port: process.env.ONLYDUST_PORT,
    database: process.env.ONLYDUST_DATABASE,
    username: process.env.ONLYDUST_USERNAME,
    password: process.env.ONLYDUST_PASSWORD,
  },
});

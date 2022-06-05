export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://root:root@localhost:27017/clean-ts-api',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.JWT_SECRET ?? 'secret'
}

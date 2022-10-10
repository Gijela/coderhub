const jwt = require("jsonwebtoken")

const errorType = require("../constants/error-types")
const service = require("../service/user.service")
const md5password = require("../utils/password-handle")
const { PUBLIC_KEY } = require("../app/config")

const verifyLogin = async (ctx, next) => {
  // 1. 获取登陆的用户名和密码
  const { name, password } = ctx.request.body
  
  // 2. 判断用户名或者密码是否为空
  if (!name || !password) {
    const error = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, cxt)
  }

  // 3. 判断登陆的用户是否存在
  const result = await service.getUserByName(name)
  const user = result[0] // 这里的user是从数据库中获取出来的
  if (!user) {
    const error = new Error((errorType.USER_DOES_NOT_EXISTS))
    return ctx.app.emit('error', error, ctx)
  }

  // 4. 判断密码是否和数据库中的密码是一致的
  if (md5password(password) !== user.password) { 
    console.log('11111111');
    const error = new Error(errorType.PASSWORD_IS_INCORRENT)
    return ctx.app.emit('error', error, ctx)
  }

  // 将user添加到ctx中， 方便后面的login中间件用jwt加密添加到token中
  ctx.user = user 

  console.log('登录验证中间件测试成功');
  await next()
}

const verifyAuth = async(ctx, next) => {
  console.log('进入验证授权登录的middleware');

  // 1. 获取token
  const authorization = ctx.headers.authorization
  if (!authorization) {
    console.log('authorization为空, 输出错误');
    const error = new Error(errorType.UNAUTHIRIZATION)
    return ctx.app.emit('error', error, ctx)
  }
  const token = authorization.replace('Bearer ', '')

  // 2. 验证token
  try {
    // console.log('token: ', token);
    const result = jwt.verify(token, PUBLIC_KEY)
    ctx.user = result
    await next()
  } catch (err) {
    console.log('err: ', err); // 捕获try中的错误
    const error = new Error(errorType.UNAUTHIRIZATION)
    return ctx.app.emit('error', error, ctx)
  }
}

module.exports = {
  verifyLogin,
  verifyAuth
}
const Router = require("koa-router")

const momentRouter = new Router({prefix: '/moment'})

const {
  create,
  detail,
  list,
  update,
  remove
} = require("../controller/moment.controller.js")

const {
  verifyAuth,
  verifyPermission
} = require("../middleware/auth.middleware")

// 先验证token看有没有权限添加数据, 验证通过后再向数据库中插入数据 
momentRouter.post("/", verifyAuth, create) 

momentRouter.get("/", list)
momentRouter.get("/:momentId", detail)
momentRouter.patch("/:momentId", verifyAuth, verifyPermission, update)
momentRouter.delete("/:momentId", verifyAuth, verifyPermission, remove)

module.exports = momentRouter


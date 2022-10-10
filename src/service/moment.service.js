const { off } = require("../app/database")
const connection = require("../app/database")

  const sqlFragment = `
    SELECT 
      m.id id, m.content contant, m.createAt createTime, m.updateAt updateTime,
      JSON_OBJECT("id", u.id, 'name', u.name) user
    FROM moment m
    LEFT JOIN users u ON m.user_id = u.id
  `

class MomentService {

  async create(userId, content) {
    const statement = `INSERT INTO moment (content, user_id) VALUES (?, ?)`
    const [result] = await connection.execute(statement, [content, userId])
    return result
  }

  async getMomentById(id) {
    const statement = `
      ${sqlFragment}
      WHERE m.id = ?;
    `
    const [result] = await connection.execute(statement, [id])
    return result[0]
  }

  async getMomentList(offset, size) {
    const statement = `
      ${sqlFragment}
      LIMIT ?, ?
    `
    const [result] = await connection.execute(statement, [offset, size])
    return result
  }
}

module.exports = new MomentService()
const mysql = require("mysql2/promise")

async function testConnection() {
  const connection = await mysql.createConnection({
    host: "marianod.sg-host.com",
    user: "u9tkeoegnj0dq",
    password: "Calpol12345",
    database: "dbrdoe8nedbxfl",
  })

  try {
    await connection.connect()
    console.log("Conexión exitosa a la base de datos")

    const [rows] = await connection.execute("SHOW TABLES")
    console.log("Tablas en la base de datos:")
    rows.forEach((row) => {
      console.log(row[`Tables_in_dbrdoe8nedbxfl`])
    })
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error)
  } finally {
    await connection.end()
  }
}

testConnection()


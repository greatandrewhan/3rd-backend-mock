const config = {
      client: "pg",
      connection: process.env.DATABASE_URL || "postgresql://postgres@localhost",
    };
const knex = require("knex")(config);

module.exports = knex;
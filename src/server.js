const express = require("express");
const userRouter = require("./users/users.router");

const createServer = (port = 3000) => {
  const app = express();
  app.use(express.json());
  app.use("/users", userRouter);

  app.use((error, req, response, next) => {
    console.error(error);
    const { status = 500, message = "Something went wrong!" } = error;
    response.status(status).json({ error: message });
  });

  const server = app.listen(port, () =>
    console.log(`[server] listening on port ${port}`)
  );
  return {
    app,
    close: (cb) =>
      server.close(() => {
        console.log("[server] closed");
        cb && cb();
      }),
  };
};
module.exports = { createServer };

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const knex = require("../db/connection");

async function userExists(req, res, next) {
  const { userId } = req.params;
  console.log(userId);

  const user = await knex.table("user").where({ id: userId }).first();

  if (user) {
    res.locals.user = user;
    return next();
  }
  next({ status: 404, message: `Customer id not found: ${userId}` });
}

function read(req, res) {
  // //GET a customer based on a customer's id

  // res.json({ data: res.locals.user });
  // console.log({ data: res.locals.user });

  const { userId } = req.params;
  console.log(req.local.user);
  //   res.json({ data: res.locals.user });
  //   res.sendStatus(200).json({ data: res.locals.user })
  knex
    .from("user")
    .where({ id: userId })
    .first()
    //     .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .then((user) => res.sendStatus(200).json({ data: user }))
    .catch((err) => res.sendStatus(500));
}

async function create(req, res) {
  // Complete the implementation of this method.
  const { username, first_name, last_name, address, email, phone_number } =
    req.body;

  knex
    .table("user")
    .insert({
      username: username,
      first_name: first_name,
      last_name: last_name,
      address: address,
      email: email,
      phone_number: phone_number,
    })
    .then((data) => {
      res.status(201).json({ data: data[0] });
    });
}

module.exports = {
  create: [asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(userExists), read],
};

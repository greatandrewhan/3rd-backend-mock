const request = require("supertest");
const { createServer } = require("../src/server");
const knex = require("../src/db/connection")

describe("server", () => {
  let server;
  let app;

  beforeEach((done) => {
    server = createServer();
    app = server.app;
    knex.schema
      .dropTableIfExists("user")
      .then(() =>
        knex.schema.createTable("user", (table) => {
          table.increments();
          table.string("username");
          table.string("first_name");
          table.string("last_name");
          table.string("address");
          table.string("email");
          table.string("phone_number");
        })
      )
      .then(() =>
        knex("user").insert({
          username: "jdoe",
          first_name: "Jane",
          last_name: "Doe",
        })
      )
      .then(() =>
        knex("user").insert({
        username: "fweaver",
        first_name: "Francis",
        last_name: "Weaver",
        phone_number: "585-753-0890",
        address: "123 Main St. Springfield, MO 11111"
      })
      )
      .then(() => done())
      .catch((err) => done(err));
  });
  afterEach((done) => server.close(done));
  afterAll(() => knex.destroy());

  it("should get information about a user based on id", (done) => {
    request(app)
      .get("/users/2")
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.data).toBeInstanceOf(Object);
        expect(response.body.data).toEqual(
          expect.objectContaining({
            username: "fweaver",
            first_name: "Francis",
            last_name: "Weaver",
            phone_number: "585-753-0890",
            address: "123 Main St. Springfield, MO 11111"
          })
        );
        expect(response.body.data.id).toEqual(2);
        done();
      })
      .catch((err) => done(err));
  });
  it("should create a new user", async () => {
    
    const response = await request(app).post("/users").send({
        username: "pbalakrishnan",
        first_name: "Prabhat",
        last_name: "Balakrishnan",
        phone_number: "343-763-3898",
        email: "pbalakrishnan@sampledomain.com",
        address: "234 Elm St. Pune, NY 23322"
      });
      expect(response.status).toEqual(201);
      expect(response.body.data[0]).toEqual(3);
  });
});

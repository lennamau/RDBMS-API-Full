const express = require("express");
const helmet = require("helmet");

const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.db3"
  }
};

const db = knex(knexConfig);
const server = express();

server.use(express.json());
server.use(helmet());

const errors = {
  1: "There was a generic server error",
  2: "Internal logic error",
  3: "Access permission to the server was denied",
  4: "Callback routine requested an abort",
  5: "The database file is locked and cannot be accessed",
  6: "A table in the database is locked and cannot be accessed",
  7: "A malloc() has failed",
  8: "Attempt to write to a read-only database has failed",
  9: "The operation was terminated by sqlite3_interrupt",
  10: "A disk I/O error occurred while accessing the database",
  11: "The database disk image is malformed",
  12: "Unknown opcode in sqlite3_file_control()",
  13: "The insertion failed because the database is full",
  14: "Unable to open the database file",
  15: "The database lock threw a protocol error",
  16: "Internal use only",
  17: "The string or BLOB exceeds the size limit available to it",
  18: "The database scheme has changed",
  19: "The request aborted due to a constraint violation",
  20: "There was a data type mismatch",
  21: "The library was used incorrectly",
  22: "OS features were used that are not supported on the host",
  23: "Authorization for accessing the database was denied",
  24: "Not used",
  25: "The 2nd parameter to sqlite3_bind was out of range",
  26: "A file was opened that is not a database file",
  27: "Notifications from sqlite3_log()",
  28: "Warning from sqlite3_log()",
  100: "sqlite3_step() has another row ready",
  101: "sqlite3_step() has finished executing"
};

//POST /api/cohorts

server.post("/api/cohorts", async (req, res) => {
    try {
      const [id] = await db("cohorts").insert(req.body);
  
      const cohort = await db("cohorts")
        .where({ id })
        .first();
      res.status(201).json(cohort);
    } catch (error) {
      const message = errors[error.errno] || "We ran into an error";
      res.status(500).json({ message, error });
    }
  });

//GET /api/cohorts

server.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await db("cohorts");
    res.status(200).json(cohorts);
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});

//GET /api/cohorts/:id
server.get("/api/cohorts/:id", async (req, res) => {
  try {
    const cohort = await db("cohorts")
      .where({ id: req.params.id })
      .first();
    res.status(200).json(cohort);
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});


//GET /api/cohorts/:id/students
server.get("/api/cohorts/:id/students", async (req, res) => {
  try {

      const students = await db("students").where({
        cohort_id: req.params.id
      });
    
      if (students.length === 0) {
        res
          .status(404)
          .json({
            message: "There are no students in the cohort with that id"
          });
      } else {
        res.status(200).json(students);
      }
   
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});

//DELETE /api/cohorts/:id
server.delete("/api/cohorts/:id", async (req, res) => {
  try {
    const count = await db("cohorts")
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(202).json({ message: "Successfully deleted cohort" });
    } else {
      res.status(404).json({ message: "Records not found" });
    }
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});

//PUT /api/cohorts/:id

server.put("/api/cohorts/:id", async (req, res) => {
  try {
    const count = await db("cohorts")
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const cohort = await db("cohorts")
        .where({ id: req.params.id })
        .first();

      res.status(200).json(cohort);
    } else {
      res.status(404).json({ message: "Records not found" });
    }
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});
//////////////////students/////////////////////////

//POST /students

server.post("/students", async (req, res) => {
  try {
    const [id] = await db("students").insert(req.body);

    const student = await db("students")
      .where({ id })
      .first();
    res.status(201).json(student);
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});
//GET /students

server.get("/students", async (req, res) => {
  try {
    const students = await db("students");
    res.status(200).json(students);
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});

//GET /students/:id

server.get("/students/:id", async (req, res) => {
  try {
    const student = await db("students")
      .where({ id: req.params.id })
      .first();
    res.status(200).json(student);
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});

//DELETE /students/:id
server.delete("/api/students/:id", async (req, res) => {
  try {
    const count = await db("students")
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Records not found" });
    }
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});

//PUT /students/:id

server.put("/students/:id", async (req, res) => {
  try {
    const count = await db("students")
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const student = await db("students")
        .where({ id: req.params.id })
        .first();

      res.status(200).json(student);
    } else {
      res.status(404).json({ message: "Records not found" });
    }
  } catch (error) {
    const message = errors[error.errno] || "We ran into an error";
    res.status(500).json({ message, error });
  }
});

const port = 4000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

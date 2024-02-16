const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const models = require("./models");
const roleRoutes = require("./src/routes/rolesRoutes");
const userRoutes = require("./src/routes/userRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Documentation",
      version: "1.0.0",
      description: "API documentation for your Node.js application",
    },
  },
  apis: ["./swagger-docs/swagger.yaml"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json()); // Middleware for parsing JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded bodies

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await models.User.findOne({ where: { username } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      "very_fancy_secret_key_like_excalibur",
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.use(roleRoutes);
app.use(userRoutes);
app.use(taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

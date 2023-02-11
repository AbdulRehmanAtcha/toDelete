import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import { stringToHash, varifyHash } from "bcrypt-inzi";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
const app = express();
const port = process.env.PORT || 5001;
const __dirname = path.resolve();

const SECRET = process.env.SECRET || "topsecret";
const MongoDBURI =
  process.env.MongoDBURI ||
  "mongodb+srv://abdul:abdulpassword@cluster0.zcczzqa.mongodb.net/test?retryWrites=true&w=majority";
app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
    origin: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const officeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minLength: 5 },
    position: { type: String, required: true, minLength: 3 },
    salary: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

const employeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  isAdmin: { type: Boolean },
});

const Office = new mongoose.model("Staff", officeSchema);
let EmployeModel = new mongoose.model("Employee", employeSchema);
// let products = [];

app.post("/api/v1/register", async (req, res) => {
  const body = req.body;
  const registerEmployee = new stringToHash(body.password).then(
    (hashString) => {
      EmployeModel.create(
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          gender: body.gender,
          password: hashString,
        },
        (err, data) => {
          if (!err) {
            res.send({
              message: "Employe Added Successfully",
            });
            res.status(200);
          } else {
            res.send(err);
          }
        }
      );
    }
  );
});

app.post("/api/v1/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const UserData = await EmployeModel.findOne({ email: email });
  if (UserData) {
    // console.log(UserData);
    varifyHash(password, UserData.password).then((isMatched) => {
      if (isMatched) {
        const token = jwt.sign(
          {
            _id: UserData._id,
            name: UserData.name,
            email: UserData.email,
            iat: Math.floor(Date.now() / 1000) - 30,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          },
          SECRET
        );

        // console.log("token: ", token);

        res.cookie("Token", token, {
          maxAge: 86_400_000,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });

        if (UserData.isAdmin === true) {
          res.send({
            message: "Admin login successful",
            profile: {
              email: UserData.email,
              name: UserData.name,
              _id: UserData._id,
            },
          });
        } else {
          res.send({
            message: "User login successful",
            profile: {
              email: UserData.email,
              name: UserData.name,
              _id: UserData._id,
            },
          });
        }
      } else {
        res.send("Invalid Email Or Password");
      }
    });
  } else {
    res.send("Server Error");
  }
});

app.use("/api/v1", (req, res, next) => {
  console.log("req.cookies: ", req.cookies);

  if (!req?.cookies?.Token) {
    res.status(401).send({
      message: "include http-only credentials with every request",
    });
    return;
  }

  jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
    if (!err) {
      console.log("decodedData: ", decodedData);

      const nowDate = new Date().getTime() / 1000;

      if (decodedData.exp < nowDate) {
        res.status(401);
        res.cookie("Token", "", {
          maxAge: 1,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        res.send({ message: "token expired" });
      } else {
        console.log("token approved");

        req.token = decodedData;
        next();
      }
    } else {
      res.status(401).send("invalid token");
    }
  });
});

const gettingUser = async (req, res) => {
  let _id = "";
  if (req.params.id) {
    _id = req.params.id;
  } else {
    _id = req.token._id;
  }

  try {
    const user = await EmployeModel.findOne(
      { _id: _id },
      "name email -_id"
    ).exec();
    if (!user) {
      res.status(404);
      res.send(user);
      return;
    } else {
      res.status(200);
      res.send({ user });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(500);
    res.send({
      message: "Error",
    });
  }
};

app.get("/api/v1/profile", gettingUser);

app.post("/api/v1/product", async (req, res) => {
  const body = req.body;
  if (!body.name || !body.position || !body.salary) {
    res.status(400);
    res.send({
      message: "All Inputs Are Required",
    });
    return;
  }
  const adding = await Office.create(
    {
      name: body.name,
      position: body.position,
      salary: body.salary,
    },
    (err, saved) => {
      if (!err) {
        // console.log("Employee Saved");
        res.send({
          message: "Your Employe Has Been Saved",
        });
        return;
      } else {
        res.send({
          message: "Not Saved",
        });
        res.status(500);
        // console.log(err);
      }
    }
  );
  // console.log(adding);
});

app.get("/api/v1/products", (req, res) => {
  Office.find({}, (err, data) => {
    if (!err) {
      res.send({
        data: data,
        message: "Got All products Successfully",
      });
    } else {
      res.send({
        message: "Server Error",
      });
      res.status(500);
    }
  }).sort({ name: 1 });
});
// .sort({name: 1})

app.get("/api/v1/product/:id", (req, res) => {
  const id = req.params.id;
  let isFound = false;
  for (var i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      res.send({
        data: products[i],
      });
      isFound = true;
      break;
    }
  }
  if (isFound === false) {
    res.send({
      message: "Product Not Found",
    });
    res.status(404);
  }
});

app.delete("/api/v1/product/:id", (req, res) => {
  const id = req.params.id;
  Office.deleteOne({ _id: id }, (err, data) => {
    if (!err) {
      if (data.deletedCount !== 0) {
        res.send({
          message: "Product Delted Successfully",
        });
        res.status(202);
      } else {
        res.send({
          message: "Product Can't Found",
        });
        res.status(404);
      }
    } else {
      res.status(500);
      res.send({
        message: "Server Error",
      });
    }
  });
  // let isFound = false;
  // for (var i = 0; i < products.length; i++) {
  //   if (products[i].id == id) {
  //     products.splice(i, 1);
  //     res.send({
  //       message: "Product Deleted",
  //     });
  //     isFound = true;
  //     break;
  //   }
  // }
  // if (isFound === false) {
  //   res.send({
  //     message: "Product Not Found",
  //   });
  //   res.status(404);
  // }
});

app.put("/api/v1/product/:editId", (req, res) => {
  const id = req.params.editId;
  const body = req.body;
  Office.findOneAndUpdate(
    { _id: id },
    {
      name: body.name,
      position: body.position,
      salary: body.salary,
    },
    (err, data) => {
      if (!err) {
        res.send("Updated Successfull");
      } else {
        res.send("Can't Update");
      }
    }
  );
});

app.use("/", express.static(path.join(path.resolve(__dirname), "./web/build")));
app.use("*", express.static(path.join(path.resolve(__dirname), "./web/build")));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(MongoDBURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on("connected", function () {
  //connected
  console.log("Mongoose is connected");
});

mongoose.connection.on("disconnected", function () {
  //disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on("error", function (err) {
  //any error
  console.log("Mongoose connection error: ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  /////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////

const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = async (req, res) => {
  try {
    const user = await authenticateRequestAsync(req);
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: await getRolesAsync(user),
      accessToken: createToken(user)
    });
  }
  catch(ex) {
    var errorCode = 500;
    if(ex.type === 'NotAuthorizedException') 
      errorCode = 401;
    if(ex.type === 'NotFoundException') 
      errorCode = 404;
    res.status(errorCode).send({ message: ex.message });
  };
};

async function authenticateRequestAsync(req) {
  var user = await getUserByNameAsync(req.body.username);
  if(!user)
    throw {
      type: 'NotFoundException',
      message: 'User not found'
    };
  if(!authenticateUser(user, req.body.password)) 
    throw {
      type: 'NotAuthorizedException',
      message: 'Invalid Password!'
    };
  return user;
}

async function getUserByNameAsync(name) {
  return await User.findOne({
    where: {
      username: name
    }
  });
}

function authenticateUser(user, password) {
  return bcrypt.compareSync(
    password,
    user.password
  );
}

function createToken(user) {
  return jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400 // 24 hours
  });
};

async function getRolesAsync(user) {
  var roles = await user.getRoles();
  return roles.map(role => "ROLE_" + role.name.toUpperCase())
}
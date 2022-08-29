import Users from "../models/UsersModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  const matched = await argon2.verify(user.password, req.body.password);
  if (!matched) res.status(400).json({ msg: "Wrong passowrd" });
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  res.status(200).json({ uuid, name, email, role });
};

export const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(400).json({
        msg: "Tidak dapat melakukan logout",
      });
    res.status(200).json({ msg: "Berhasil logout" });
  });
};

export const GetMe = async (req, res) => {
  if (!req.session.userId) {
    res.status(401).json({ msg: "Mohon lakukan login ulang" });
  }
  const user = await Users.findOne({
    attributes: ["uuid", "name", "email", "role"],
    where: { uuid: req.session.userId },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(user);
};

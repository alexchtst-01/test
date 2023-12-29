import User from "../model/UserModel.js";
import argon from "argon2"

export const getUser = async (req, res) => {
    try {
        const data = await User.findAll({
            attributes: ['uuid', 'name', 'email', 'role']
        });
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ msg: "gagal mengambil data" })
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                uuid: req.params.id
            },
            attributes: ['name', 'email', 'role']
        })

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body
    if (password !== confPassword) return res.status(401).json({ msg: 'password salah' })
    const hashPwd = await argon.hash(password)
    try {
        await User.create({
            name: name,
            email: email,
            password: hashPwd,
            role: role
        })
        res.status(200).json({ msg: 'data berhasil ditambahkan' })
    } catch (error) {
        res.status(401).json({ msg: "gagal ditambahkan" })
    }
}

export const updateUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    })
    if (!user) return res.status(404).json({ msg: 'user tidak ditemukan' })
    const { name, email, password, confPassword, role } = req.body;
    let hashPassword;
    if (password === '' || password === null) hashPassword = user.password
    if (password !== confPassword) return res.status(502).json({ msg: 'password dan confirmation password tidak sama' })
    hashPassword = await argon.hash(password)
    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id
            }
        })
        res.status(202).json({ msg: 'data berhasil diupdate' })
    } catch (error) {
        res.status(502).json({ msg: error.message })
    }
}

export const deleteUser = async (req, res) => {
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    })
    if (!user) return res.status(404).json({ msg: 'user tidak ditemukan' })
    try {
        await User.destroy({
            where: {
                id: user.id
            }
        })
        res.status(201).json({ msg: 'data berhasil didelete' })
    } catch (error) {
        res.status(502).json({ msg: error.message })
    }
}
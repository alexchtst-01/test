import Product from "../model/ProductModel.js"
import User from "../model/UserModel.js"
import { Op } from "sequelize"

// basic functionality of data operation
export const getProduct = async (req, res) => {
    try {
        let response;
        if (req.role === 'admin') {
            response = await Product.findAll({
                attributes: ['name', 'price', 'uuid'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        } else {
            response = await Product.findAll({
                where: {
                    userId: req.userId
                },
                attributes: ['name', 'price', 'uuid'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        }
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!product) return res.status(404).json({ msg: 'data tidak ditemukan' });
        let response;
        if (req.role === 'admin') {
            response = await Product.findOne({
                where: {
                    id: product.id
                },
                attributes: ['name', 'price'],
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
            res.status(200).json(response)
        } else {
            response = await Product.findOne({
                attributes: ['name', 'price', 'uuid'],
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                },
                include: [{
                    model: User,
                    attributes: ['name', 'email']
                }]
            })
        }
    } catch (error) {
        res.status(502).json({ msg: error.message })
    }
}

export const createProduct = async (req, res) => {
    const { name, price } = req.body
    try {
        await Product.create({
            name: name,
            price: price,
            userId: req.userId
        })
        res.status(200).json({ msg: 'data berhasil ditambah' })
    } catch (error) {
        res.status(502).json({ msg: error.message })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!Product) return res.status(404).json({ msg: 'data tidak ditemukan' });
        if (req.role === 'admin') {
            const { name, price } = req.body;
            await Product.update({
                name: name,
                price: price
            }, {
                where: {
                    id: product.id
                }
            });
            res.status(200).json({ msg: `data ${product.id} berhasil diedit` })
        } else {
            const { name, price } = req.body;
            if (req.userId !== product.userId) return res.status(403).json({ msg: 'access denied' })
            await Product.update({
                name: name,
                price: price
            }, {
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                }
            })
        }
        res.status(200).json({ msg: 'data berhasil diupdate' })
    } catch (error) {
        res.status(502).json({ msg: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!product) return res.status(404).json({ msg: 'data tidak ditemukan' })
        if (req.role === 'admin') {
            if (product.userId !== req.userId) return res.status(403).json({ msg: 'access denied' })
            await Product.destroy({
                where: {
                    id: product.id
                }
            })
            res.status(202).json({ msg: 'data berhasil di hapus' })
        } else {
            if (product.userId !== req.userId) return res.status(403).json({ msg: 'access denied' })
            await Product.destroy({
                where: {
                    [Op.and]: [{ id: product.id }, { userId: req.userId }]
                }
            })
        }
        res.status(201).json({ msg: 'data berhasil dihapus' })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
}
import User from "../model/UserModel.js";

export const verify = async (req, res, next) => {
    if (!req.session.userId) return res.status(401).json({ msg: 'mohon login ke akun anda' });
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if (!user) return res.status(404).json({ msg: 'user not found' });
    req.userId = user.id;
    req.role = user.role;
    next();
}

export const admOnly = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    })
    if (!user) return res.status(404).json({ msg: 'user tidak ditemukan' });
    if (req.role !== 'admin') return res.status(403).json({ msg: 'access denied' });
    next();
}
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/users/index.js";
import validaToken from "../../utils/validaToken.js";

const router = express.Router();

router.get('/', async (req, res) => {

    const {Email, Password} = req.query

    if (!Email || Email == '') {
        return res.status(406).json({
            'Message':'Campo Name é obrigatório!'
        })
    }

    if (!Password || Password == '') {
        return res.status(406).json({
            'Message':'Campo Password é obrigatório!'
        })
    }

    const user = await User.findOne({ Email: Email });

    const check_password = await bcrypt.compare(Password, user.Password)
    
    if (!check_password) {
        return res.status(401).json({
            'Message':'Usuário ou Senha Incorreto!'
        })
    }

    try {
        
        const secret = process.env.SECRET_KEY
        const token = jwt.sign({
            id: user._id,

        }, secret);

        return res.status(200).json({
            'Message':'Usuário Autenticado com sucesso!', token
        })

    } catch (error) {
        return res.status(500).json({
            'Error': error
        }) 
    }

})

router.post('/', async (req, res) => {

    const { Name, Email, Password } = req.body

    if (!Name || Name == '') {
        return res.status(406).json({
            'Message':'Campo Name é obrigatório!'
        });
    }

    if (!Email || Email == '') {
        return res.status(406).json({
            'Message':'Campo Email é obrigatório!'
        });
    }

    if (!Password || Password == '') {
        return res.status(406).json({
            'Message':'Campo Password é obrigatório!'
        });
    }

    let Active = true;

    const salt = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(Password, salt);

    const tenant = {
        Name,
        Email,
        Password: password_hash,
        Active
    }

    try {

        const consulta_usuario_banco = await User.findOne({ Email: Email });

        if (Boolean(consulta_usuario_banco) == true) {
            return res.status(200).json({
                'Message':'Usuário Já Cadastrado!'
            });
        } else {
            await User.create(tenant);
            return res.status(200).json({
                'Message':'Usuário Cadastrado com Sucesso!'
            });   
        }
    } catch (error) {
         return res.status(500).json({
            'Error': error
        });
    }


})

router.put('/', validaToken, async (req, res) => {

    const { Email, Active } = req.body

    if (!Email || Email == '') {
        return res.status(406).json({
            'Message':'Campo Email é obrigatório!'
        });
    }

    try {
        const consulta_usuario_banco = await User.findOne({ Email: Email });

        if (Boolean(consulta_usuario_banco)) {
            await User.updateOne({Email: consulta_usuario_banco.Email}, {Active: Active})

            if (Active == true) {
                return res.status(200).json({
                    'Message': 'Usuário foi ativado com sucesso!'
                });
            } else {
                return res.status(200).json({
                    'Message': 'Usuário foi desativado com sucesso!'
                });
            }

        } else {
            return res.status(500).json({
                'Message': 'Não foi possível realizar ação. Por gentileza, entrar em contato com administrador.'
            });
        }

    } catch (error) {
        return res.status(500).json({
            'Error': error
        });
    }

})

export default router;
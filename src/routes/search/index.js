import express from "express";
import validaToken from "../../utils/validaToken.js";
import Product from "../../models/products/index.js";

const router = express.Router();

router.post('/', validaToken, async (req, res) => {
    const { produto } = req.body

    if(!produto || produto == '') {
        return res.status(406).json({
           'Message':'Por favor definir o produto de busca'
        });
      }

    const Produto = {
        Title: produto
    }

    try {

        const pesquisa_bd_produtos = await Product.find({ Title: { $regex: `${Produto.Title.toLowerCase()}`} });

        return res.status(200).json({
            Produtos: pesquisa_bd_produtos
        })

    } catch (error) {
        return res.status(500).json({
            Error: error
        })
    }

})

export default router
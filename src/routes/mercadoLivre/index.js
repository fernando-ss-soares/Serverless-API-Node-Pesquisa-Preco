import express from 'express';
import mercadoLivre from '../../utils/mercadoLivre.js';
import Product from '../../models/products/index.js';
import validaToken from '../../utils/validaToken.js';

const router = express.Router();

router.get('/', validaToken, async (req, res) => {

    const { produto } = req.body

    if(!produto || produto == '') {
      return res.status(406).json({
         'Message':'Por favor definir o produto de busca'
      });
    }
    
    try {

       const resultado_pesquisa_mercardo_livre = await mercadoLivre(produto);

       await Product.create(resultado_pesquisa_mercardo_livre);
       
       return res.status(200).json({
            'Product': resultado_pesquisa_mercardo_livre
       });

    } catch (error) {
      return res.status(500).json({
        'Error': error
       });
    }
    
})

export default router;
import jwt from "jsonwebtoken";

function validaToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]
 
    if (!token) {
       return res.status(401).json({
          'Mensagem':'Acesso Negado'
       })
    }
 
    try {
       
       const secret = process.env.SECRET_KEY
       jwt.verify(token, secret)
       next()
 
    } catch (error) {
       return res.status(401).json({
          'Mensagem':'Token Inválido'
       })
    }
}

export default validaToken
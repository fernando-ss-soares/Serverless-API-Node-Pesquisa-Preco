import pup from 'puppeteer';

async function googleShopping(pesquisa) {
    
    let produto = pesquisa;
    
    const browser = await pup.launch({headless: true, args: ['--no-sandbox']}); // Instância o navegador
    const page = await browser.newPage(); // Instância uma nova página
    
    await page.goto('https://shopping.google.com.br/'); // Redireciona para URL

    await page.waitForSelector('#REsRA'); // Aguardando o seletor ser renderizado

    await page.type('#REsRA', produto); // Escrevendo no elemento(input)

    await Promise.all([ // Necessário quando você for navegar para outra página
        page.waitForNavigation(), 
        page.click('.FrV7Ge') // Clique no elemento
    ]);

    await page.waitForSelector('.sh-sr__shop-result-group > div > .sh-pr__product-results-grid'); // Aguardando o seletor ser renderizado

    const colecao_links = await page.$$eval('.B3mEmd > .VOo31e > .xCpuod', item => { // Selecionando os produtos
        
        var urls = item;
        
        var lista_nao_selecionada = [];
        
        var lista_selecionada = [];

        for (let index = 0; index < urls.length; index++) {    
            
            lista_nao_selecionada.push(urls[index].href);

            if (lista_nao_selecionada[index].substring(0,42) == 'https://www.google.com.br/shopping/product') {
                lista_selecionada.push(lista_nao_selecionada[index]);
            }

        }

        return lista_selecionada;
    });

    var resultado_google_shopping = [];

    for(const link of colecao_links) {
        
        await page.goto(link);
        
        await page.waitForSelector('div.LDQll > span');
        
        await page.waitForSelector('.g9WBQb');
        
        const Title = await page.$$eval('div.LDQll > span', element => {
            
            var titulo = element

            for (let index = 0; index < titulo.length; index++) {    
                
                titulo = element[index].innerText.toLowerCase();
                
                return titulo
    
            }            
        
        });
        
        const Price = await page.$$eval('.g9WBQb', element => {
            
            var preco = element

            for (let index = 0; index < preco.length; index++) {    
            
                preco = element[index].innerText;

                preco.toString();

                return preco.replace('R$ ','');
    
            }
        });
        
        const Buy = link;
        
        const DateSearch = new Date;
        
        const obj = {
            Title,
            Price,
            Buy,
            DateSearch
        }
        
        resultado_google_shopping.push(obj);
        
    }

    await page.waitForTimeout(1000); // Aguarda 

    await browser.close(); // Fecha a instância do navegador

    return resultado_google_shopping
}

export default googleShopping
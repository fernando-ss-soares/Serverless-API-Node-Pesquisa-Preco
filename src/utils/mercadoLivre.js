import pup from 'puppeteer';

async function mercadoLivre(pesquisa) {
    
    let produto = pesquisa;
    
    const browser = await pup.launch({headless: false, args: ['--no-sandbox']}); // Instância o navegador
    const page = await browser.newPage(); // Instância uma nova página
    
    await page.goto('https://www.mercadolivre.com.br/'); // Redireciona para URL

    await page.waitForSelector('#cb1-edit'); // Aguardando o seletor ser renderizado

    await page.type('#cb1-edit', produto); // Escrevendo no elemento(input)

    await Promise.all([ // Necessário quando você for navegar para outra página
        page.waitForNavigation(), 
        page.click('.nav-search-btn') // Clique no elemento
    ]);
    
    const links = await page.$$eval('.ui-search-result__image > a', el => el.map(link => link.href)); // Recebendo os links e mapeando

    let resultado_mercado_livre = []

    for(const link of links) {

        await page.goto(link);
        await page.waitForSelector('.ui-pdp-title');
        await page.waitForSelector('.andes-money-amount__fraction');

        const Title = await page.$eval('.ui-pdp-title', element => element.innerText.toLowerCase());
        const Price = await page.$eval('.andes-money-amount__fraction', element => element.innerText);
        
        const Buy = link;
        const DateSearch = new Date;

        const obj = {
            Title,
            Price,
            Buy,
            DateSearch
        }

        resultado_mercado_livre.push(obj);

    }

    await page.waitForTimeout(1000); // Aguardando

    await browser.close(); // Fecha a instância do navegador

    return resultado_mercado_livre
}

export default mercadoLivre
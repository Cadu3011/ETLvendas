const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mysql = require('mysql2/promise');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function loginAndGetReport() {
     const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'cadu3011',
            database: 'vendedores_vendas_db'
        });

    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.route('**/*', (route, request) => {
        if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
            route.abort();
        } else {
            route.continue();
        }
    });

    let pdfResponse = null;

    context.on('response', async (response) => {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('application/pdf')) {
            pdfResponse = response;
        }
    });

    await page.goto('http://192.168.1.253:4647/sgfpod1/Login.pod', { waitUntil: 'domcontentloaded' });
    await page.fill('#id_cod_usuario', '95');
    await page.fill('#nom_senha', 'cadu3011');
    await page.click('#login');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    async function propagado(data){
        await page.goto('http://192.168.1.253:4647/sgfpod1/Rel_0028.pod?cacheId=1741954796620', {
            waitUntil: 'domcontentloaded',
        });
        await page.click('#agrup_fil_filLabel');
        await page.click('#tabTabdhtmlgoodies_tabView1_1 > a');
        await page.fill('#cod_grupoEntrada', "3");
        await page.keyboard.press('Enter', { delay: 50 });
        await page.click('#tabTabdhtmlgoodies_tabView1_4 > a');
        await page.fill('#dat_inicio', data);
        await page.keyboard.press('Enter', { delay: 50 });
        await page.fill('#dat_fim', data);
        await page.keyboard.press('Enter', { delay: 50 });

        await Promise.all([
            page.waitForTimeout(1000), 
            page.click('#runReport'),
            context.waitForEvent('page') 
        ]);

        await page.waitForTimeout(3000); 

        if (pdfResponse) {
            const pdfUrl = pdfResponse.url();
        const httpLib = pdfUrl.startsWith('https') ? require('https') : require('http');
        const path = require('path');
        const filePath = path.join(__dirname, 'pdfs', 'propagado.pdf');
        const file = fs.createWriteStream(filePath);

        httpLib.get(pdfUrl,(res) => {
            res.pipe(file);
            file.on('finish', async() => {
                await delay(1000)
                file.close();
                console.log('✅ PDF propagado baixado com sucesso');
            });
        }).on('error', (err) => {
            
        fs.unlinkSync('propagado.pdf');
        console.error('Erro ao baixar o PDF:', err.message);
        
        });

        } else {
            console.error('❌ Nenhum PDF foi detectado.');
        }
    }
    async function genAndSim(data){
        await page.goto('http://192.168.1.253:4647/sgfpod1/Rel_0028.pod?cacheId=1741954796620', {
            waitUntil: 'domcontentloaded',
        });
        await page.click('#agrup_fil_filLabel');
        await page.click('#tabTabdhtmlgoodies_tabView1_1 > a');
        await page.fill('#cod_grupoEntrada', "2");
        await page.keyboard.press('Enter', { delay: 50 });
        await page.fill('#cod_grupoEntrada', "9");
        await page.keyboard.press('Enter', { delay: 50 });

        await page.click('#tabTabdhtmlgoodies_tabView1_4 > a');
        await page.fill('#dat_inicio', data);
        await page.keyboard.press('Enter', { delay: 50 });
        await page.fill('#dat_fim', data);
        await page.keyboard.press('Enter', { delay: 50 });

        await Promise.all([
            page.waitForTimeout(1000),
            page.click('#runReport'),
            context.waitForEvent('page') 
        ]);

        
        await page.waitForTimeout(3000);

        if (pdfResponse) {
            const pdfUrl = pdfResponse.url();
        const httpLib = pdfUrl.startsWith('https') ? require('https') : require('http');
        const path = require('path');
        const filePath = path.join(__dirname, 'pdfs', 'genAndSim.pdf');
        const file = fs.createWriteStream(filePath);

        httpLib.get(pdfUrl, (res) => {
            res.pipe(file);
            file.on('finish',async () => {
                await delay(1000)
                file.close();
                console.log('✅ PDF GenSim baixado com sucesso');
                
            });
        }).on('error', (err) => {
        fs.unlinkSync('genAndSim.pdf');
        console.error('Erro ao baixar o PDF:', err.message);
        
        });

        } else {
            console.error('❌ Nenhum PDF foi detectado.');
        }
    }
   async function vendaGeral(data){
        await page.goto('http://192.168.1.253:4647/sgfpod1/Rel_0028.pod?cacheId=1741954796620', {
            waitUntil: 'domcontentloaded',
        });
        await page.click('#agrup_fil_filLabel');
        await page.click('#tabTabdhtmlgoodies_tabView1_4 > a');
        await page.fill('#dat_inicio', data);
        await page.keyboard.press('Enter', { delay: 50 });
        await page.fill('#dat_fim', data);
        await page.keyboard.press('Enter', { delay: 50 });

       
        await Promise.all([
            page.waitForTimeout(1000), 
            page.click('#runReport'),
            context.waitForEvent('page') 
        ]);

        await page.waitForTimeout(3000);

        if (pdfResponse) {
            const pdfUrl = pdfResponse.url();
        const httpLib = pdfUrl.startsWith('https') ? require('https') : require('http');
        const path = require('path');
        const filePath = path.join(__dirname, 'pdfs', 'vendaGeral.pdf');
        const file = fs.createWriteStream(filePath);

        httpLib.get(pdfUrl, (res) => {
            res.pipe(file);
            file.on('finish', async() => {
                await delay(1000)
                file.close();
                console.log('✅ PDF VendaGeral baixado com sucesso ');
                
            });
        }).on('error', (err) => {
        fs.unlinkSync('vendaGeral.pdf');
        console.error('Erro ao baixar o PDF:', err.message);
        
        });

        } else {
            console.error('❌ Nenhum PDF foi detectado.');
        }
    }
    async function vitaminas(data){
           await page.goto('http://192.168.1.253:4647/sgfpod1/Rel_0028.pod?cacheId=1741954796620', {
            waitUntil: 'domcontentloaded',
        });
        await page.click('#agrup_fil_filLabel');
        await page.click('#tabTabdhtmlgoodies_tabView1_1 > a');
        await page.click("#sel_relatorio_6")
        await page.click("#tabTabdhtmlgoodies_tabView1_2 > a")
        await page.fill("#cod_categoriaEntrada","52")
        await page.keyboard.press('Enter', { delay: 50 });
        await page.fill("#cod_categoriaEntrada","63")
        await page.keyboard.press('Enter', { delay: 50 });
        await page.click('#tabTabdhtmlgoodies_tabView1_4 > a');
        await page.fill('#dat_inicio', data);
        await page.keyboard.press('Enter', { delay: 50 });
        await page.fill('#dat_fim', data);
        await page.keyboard.press('Enter', { delay: 50 });

        await Promise.all([
            page.waitForTimeout(1000),
            page.click('#runReport'),
            context.waitForEvent('page')
        ]);

        await page.waitForTimeout(3000);

        if (pdfResponse) {
            const pdfUrl = pdfResponse.url();
        const httpLib = pdfUrl.startsWith('https') ? require('https') : require('http');
        const path = require('path');
        const filePath = path.join(__dirname, 'pdfs', 'vitaminas.pdf');
        const file = fs.createWriteStream(filePath);

        httpLib.get(pdfUrl, (res) => {
            res.pipe(file);
            file.on('finish', async() => {
                await delay(1000)
                file.close();
                console.log('✅ PDF vitaminas baixado com sucesso ');
                
            });
        }).on('error', (err) => {
        fs.unlinkSync('vitaminas.pdf');
        console.error('Erro ao baixar o PDF:', err.message);
        
        });

        } else {
            console.error('❌ Nenhum PDF foi detectado.');
        }
    }
    async function ticketMedio(data){
          await page.goto('http://192.168.1.253:4647/sgfpod1/Rel_0028.pod?cacheId=1741954796620', {
            waitUntil: 'domcontentloaded',
        });
        await page.click('#agrup_fil_filLabel');
        await page.click('#tabTabdhtmlgoodies_tabView1_1 > a');
        await page.click('#estatica_vendas_vendedorLabel')
        await page.click('#tabTabdhtmlgoodies_tabView1_4 > a');
        await page.fill('#dat_inicio', data);
        await page.keyboard.press('Enter', { delay: 50 });
        await page.fill('#dat_fim', data);
        await page.keyboard.press('Enter', { delay: 50 });

        await Promise.all([
            page.waitForTimeout(1000),
            page.click('#runReport'),
            context.waitForEvent('page')
        ]);

        await page.waitForTimeout(3000);

        if (pdfResponse) {
            const pdfUrl = pdfResponse.url();
        const httpLib = pdfUrl.startsWith('https') ? require('https') : require('http');
        const path = require('path');
        const filePath = path.join(__dirname, 'pdfs', 'ticketMedio.pdf');
        const file = fs.createWriteStream(filePath);

        httpLib.get(pdfUrl, (res) => {
            res.pipe(file);
            file.on('finish', async() => {
                await delay(1000)
                file.close();
                console.log('✅ PDF ticketMedio baixado com sucesso ');
                
            });
        }).on('error', (err) => {
        fs.unlinkSync('ticketMedio.pdf');
        console.error('Erro ao baixar o PDF:', err.message);
        
        });

        } else {
            console.error('❌ Nenhum PDF foi detectado.');
        }
    }
  async function extractVitaminas(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  const lines = data.text.split("\n").map(line => line.trim()).filter(line => line);
  const result = { filiais: [] };

  let currentFilial = null;
  let lastVendedorNome = null;

  lines.forEach((line, index) => {
    // Identifica linha "Filial:" e pega a próxima linha como nome da filial
    if (line === "Filial:") {
      const rawFilial = lines[index + 1]?.trim();
const matchFilial = rawFilial.match(/^(FILIAL\s+\d+)/i);
const filialNome = matchFilial ? matchFilial[1] : rawFilial;

      if (filialNome) {
        currentFilial = {
          Filial: filialNome,
          Info: [],
        };
        result.filiais.push(currentFilial);
      }
      return;
    }

    // Detecta "Vendedor:" e pega o nome 2 linhas abaixo
    if (line === "Vendedor:") {
      lastVendedorNome = lines[index + 2]?.trim() || "Sem nome";
      return;
    }

    // Captura valor total de vitaminas após "Total Vendedor:"
    if (line === "Total Vendedor:") {
      const total = lines[index + 1];
      const totalNumber = total;

      if (!isNaN(totalNumber) && currentFilial && lastVendedorNome) {
        currentFilial.Info.push({
          Vendedor: lastVendedorNome.slice(0, 11),
          ValorVendas: totalNumber
        });
      }
      return;
    }
  });

  return result;
}
    async function extractTicketMedio(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  const lines = data.text.split("\n").map(line => line.trim()).filter(line => line);
  const result = { filiais: [] };

  let currentFilial = null;

  lines.forEach((line, index) => {
    // Detecta linha de filial
    if (line.startsWith("Filial:")) {
      const rawFilial = line.split("Filial:")[1].trim();
      const matchFilial = rawFilial.match(/^(FILIAL\s+\d+)/i);
      const filialNome = matchFilial ? matchFilial[1] : rawFilial;

      if (filialNome) {
        currentFilial = {
          Filial: filialNome,
          Info: []
        };
        result.filiais.push(currentFilial);
      }
      return;
    }

    // Detecta nome do vendedor (ex: "9TANIA SANTOS DE LIMAVendedor:")
    if (line.includes("Vendedor:")) {
      const nomeBruto = line.replace(/Vendedor:.*/i, "").trim();
      const nomeVendedor = nomeBruto.replace(/^\d+/, "").trim(); // remove número no início
      const mediaLabelIndex = lines.findIndex((l, i) => i > index && l === "Média de Vendas por Clientes (R$)");

      if (mediaLabelIndex !== -1) {
        const valorMedia = lines[mediaLabelIndex + 9];

        if (currentFilial && nomeVendedor && valorMedia) {
          currentFilial.Info.push({
            Vendedor: nomeVendedor.slice(0, 11),
            ValorVendas: parseFloat(valorMedia)
          });
        }
      }
    }
  });

  return result;
}

    async function extractTotaisVendaGrupo(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  const lines = data.text.split("\n").map(line => line.trim()).filter(line => line);

  const result = { filiais: [] };
  let currentFilial = null;
  let lastVendedor = null;

  lines.forEach((line) => {
    // Captura filiais
    const filialMatch = line.match(/Filial:\s+(FILIAL\s+\d+\s+-\s+[\w\s]+)/);
    if (filialMatch) {
      currentFilial = {
        Filial: filialMatch[1].trim(),
        Info: [],
      };
      result.filiais.push(currentFilial);
      return;
    }

    // Captura vendedores
    const vendedorMatch = line.match(/^\d+\s+([A-Z.\s]+)$/);
    if (vendedorMatch) {
      lastVendedor = vendedorMatch[1].trim();
      return;
    }

    // Captura valores de vendas (positivos ou negativos)
    if (lastVendedor) {
      const valoresMatch = line.match(/^(-?[\d.,]+)/); // Agora aceita "-" no início
      if (valoresMatch) {
        let valorVendas = valoresMatch[1];
        valorVendas = valorVendas.replace(/\./g, "").replace(",", ".");

        currentFilial.Info.push({
          Vendedor: lastVendedor,
          ValorVendas: valorVendas
        });

        lastVendedor = null;
      }
    }
  });

  return result;
}
function stringToFixedFloat(str, decimalPlaces = 2) {
  const parts = str.split('.');
  
  if (parts.length === 1) return Number(parts[0]); // número inteiro

  const integerPart = parts[0];
  const decimalPart = parts[1].slice(0, decimalPlaces); // corta sem arredondar
  
  const resultStr = `${integerPart}.${decimalPart}`;
  return Number(resultStr);
}
function formatarValorVendas(dados) {
  const dadosFormatados = dados.filiais.map(filial => {
    const filialFormatada = filial.Filial.split(' ').slice(0, 2).join(" ")
    const infoFormatada = filial.Info.map(item => {
      // Converte o valor para número e arredonda para 2 casas decimais
      const valorFormatado = stringToFixedFloat(item.ValorVendas.replace(',', '.')).toFixed(2);
      return {
        Vendedor: item.Vendedor.slice(0, 11),
        ValorVendas: valorFormatado
      };
    });

    return {
      Filial: filialFormatada,
      Info: infoFormatada
    };
  });

  return { filiais: dadosFormatados };
}

    const getLastDate = async () => {
    const [rows] = await connection.execute(
        'SELECT data FROM vendedores ORDER BY data DESC LIMIT 1'
      );
      return rows.length ? rows[0].data : null;
    };
    
    
        const lastDate = new Date(await getLastDate())
        // const lastDate = new Date(Date.UTC(
        //   2024,
        //   11,
        //   31,
        //   3, 0, 0, 0
        // ))
        console.log(lastDate)
    const dateInit =new  Date(lastDate)
    dateInit.setDate(dateInit.getDate() + 1)

   const dataAtual = new Date()
  //  const dataAtualFormat = new Date(Date.UTC(
  //       dataAtual.getUTCFullYear(),
  //       2,
  //       26,
  //       3, 0, 0, 0 // hora, minuto, segundo, milissegundo
  //     ));
    const dataAtualFormat = new Date(Date.UTC(
      dataAtual.getUTCFullYear(),
      dataAtual.getUTCMonth(),
      dataAtual.getUTCDate(),
      3, 0, 0, 0 // hora, minuto, segundo, milissegundo
    ));
    console.log("data atual",dataAtualFormat)
    console.log("data do banco",dateInit)
    for(let current = new Date(dateInit); current < dataAtualFormat; current.setDate(current.getDate() + 1)){
        
        const dia = String(current.getDate()).padStart(2, '0');
        const mes = String(current.getMonth()+1).padStart(2, '0');
        const ano = current.getFullYear();

        const dataFormatada = `${dia}${mes}${ano}`;
        console.log(current)
        
        async function getPDFs(){
          console.log(dataFormatada)
          await propagado(dataFormatada)
          await vendaGeral(dataFormatada)
          await genAndSim(dataFormatada)
          await vitaminas(dataFormatada)
          await ticketMedio(dataFormatada)
        }
    await getPDFs()
    await delay(2000);

    try {
    
        const vendasMap = new Map();
        function preencherMapa(dados, campo) {
            for (const filial of dados.filiais) {
                for (const info of filial.Info) {
                const chave = `${filial.Filial}__${info.Vendedor}`;
                if (!vendasMap.has(chave)) {
                    vendasMap.set(chave, {
                    filial: filial.Filial,
                    vendedor: info.Vendedor,
                    vendasPropagado: null,
                    vendasGenSim: null,
                    vendasGeral: null,
                    vitaminas : null,
                    ticketMedio : null,
                    });
                }
                vendasMap.get(chave)[campo] = info.ValorVendas;
                }
            }
        }
        const propPath = path.join(__dirname, 'pdfs', 'propagado.pdf');
        const genSimPath = path.join(__dirname, 'pdfs', 'genAndSim.pdf');
        const vendaGeralPath = path.join(__dirname, 'pdfs', 'vendaGeral.pdf');
        const vitaPath = path.join(__dirname, 'pdfs', 'vitaminas.pdf');
        const ticketMedioPath = path.join(__dirname, 'pdfs', 'ticketMedio.pdf');
        const ticketMedio = await extractTicketMedio(ticketMedioPath)
        const vitamina = await extractVitaminas(vitaPath)
        const propagado = formatarValorVendas(await extractTotaisVendaGrupo(propPath));
        const genSim = formatarValorVendas(await extractTotaisVendaGrupo(genSimPath));
        const vendaGeral = formatarValorVendas(await extractTotaisVendaGrupo(vendaGeralPath));
        preencherMapa(propagado, 'vendasPropagado');
        preencherMapa(genSim, 'vendasGenSim');
        preencherMapa(vendaGeral, 'vendasGeral');
        preencherMapa(vitamina, 'vitaminas');
        preencherMapa(ticketMedio,'ticketMedio')
        
        //const dataAtual = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
        const formattedDate = `${dataFormatada.slice(4)}-${dataFormatada.slice(2, 4)}-${dataFormatada.slice(0, 2)}`;
        console.log(formattedDate)
       for (const [_, vendedorData] of vendasMap.entries()) {
            const { filial, vendedor, vendasPropagado, vendasGenSim, vendasGeral, ticketMedio, vitaminas } = vendedorData;

            const query = `
                INSERT INTO vendedores (filial, data, vendedor, vendasPropagado, vendasGenSim, vendaGeral,ticketMedio, vitaminas)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await connection.execute(query, [
                filial,
                formattedDate,
                vendedor,
                vendasPropagado ?? 0,
                vendasGenSim ?? 0,
                vendasGeral ?? 0,
                ticketMedio ?? 0,
                vitaminas ?? 0,
            ]);
            }
        
        console.log('✅ Todos os dados inseridos com sucesso!');

    }catch (error) {
        console.log('erro',error)
    }
    
    }
    
    await browser.close();
    await connection.end();
}

loginAndGetReport();

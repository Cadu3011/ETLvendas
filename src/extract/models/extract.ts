import { BrowserContext, Page } from "playwright-chromium";
import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import * as https from "https";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
interface IExtractor{
    url:string
    date:string
    PDF:string
    page:Page
    context:BrowserContext
    GoToPage(page:Page):Promise<void>
    ConfigPage(page:Page):Promise<void>
    ConfigDatePage(page:Page):Promise<void>
    PipelinePage(context:BrowserContext,page:Page):Promise<void>
}
abstract class ExtractorBase implements IExtractor{
    url: string;
    date:string
    PDF: string
    page: Page;
    context: BrowserContext;
    constructor(url:string,date:string,PDF:string, page: Page, context: BrowserContext){
        this.url = url;
        this.date = date;
        this.PDF = PDF;
        this.page= page
        this.context = context

    }
    
    async GoToPage(){

        await this.page.goto(this.url, {
            waitUntil: 'domcontentloaded',
        });
        await this.page.click('#agrup_fil_filLabel');
    }
    abstract ConfigPage(): Promise<void>;

    async ConfigDatePage(){
        await this.page.click('#tabTabdhtmlgoodies_tabView1_4 > a');
        await this.page.fill('#dat_inicio', this.date);
        await this.page.keyboard.press('Enter', { delay: 50 });
        await this.page.fill('#dat_fim', this.date);
        await this.page.keyboard.press('Enter', { delay: 50 });
    }
     async PipelinePage() {
        let pdfResponse:any = null;
        this.context.on('response', async (response) => {
            const contentType = response.headers()['content-type'] || '';
            if (contentType.includes('application/pdf')) {
                pdfResponse = response;
            }
        });

        await Promise.all([
            this.page.waitForTimeout(1000), 
            this.page.click('#runReport'),
            this.context.waitForEvent('page') 
        ]);
        await this.page.waitForTimeout(3000); 

        if (pdfResponse){
            const pdfUrl = pdfResponse.url();
        const httpLib = pdfUrl.startsWith('https') ? https : http;
        const filePath =path.join(__dirname,"pdfs", this.PDF);
        const file = fs.createWriteStream(filePath);

        httpLib.get(pdfUrl,(res:any) => {
            res.pipe(file);
            file.on('finish', async() => {
                await delay(1000)
                file.close();
                console.log(`✅ PDF ${this.PDF} baixado com sucesso`);
            });
        }).on('error', (err) => {
            
        fs.unlinkSync(this.PDF);
        console.error('Erro ao baixar o PDF:', err.message);
        
        });

        } else {
            console.error('❌ Nenhum PDF foi detectado.');
        }
    }

    async executePipeline() {
        await this.GoToPage();
        await this.ConfigPage();
        await this.ConfigDatePage();
        await this.PipelinePage();
    }
}
export default ExtractorBase
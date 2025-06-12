import { Browser, BrowserContext, Page } from "playwright-chromium";
import propagadoExtrator from "../service/propagadoExtrator";
import totalVendaExtrator from "../service/totalVendaExtrator";
import genSimExtrator from "../service/genSimExtrator";

class ExtractController{
    static async buildExtraction(context:BrowserContext,page:Page){
        const propagadoPDF = new propagadoExtrator(
            'http://192.168.1.253:4647/sgfpod1/Rel_0028.pod?cacheId=1741954796620',
            '10062025',
            'propagado.pdf',
            page,
            context
        )
        await propagadoPDF.executePipeline()

        const totalVendaPDF = new totalVendaExtrator(
            'http://192.168.1.253:4647/sgfpod1/Rel_0028.pod?cacheId=1741954796620',
            '10062025',
            'vendaGeral.pdf',
            page,
            context
        )
        await totalVendaPDF.executePipeline()

        const genSimPDF = new genSimExtrator(
            'http://192.168.1.253:4647/sgfpod1/Rel_0028.pod?cacheId=1741954796620',
            '10062025',
            'genAndSim.pdf',
            page,
            context
        )
        await genSimPDF.executePipeline()
    }
}
export default ExtractController
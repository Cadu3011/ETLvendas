import ExtractorBase from "../models/extract";

class genSimExtrator extends ExtractorBase{
    async ConfigPage(): Promise<void> {
        await this.page.click('#tabTabdhtmlgoodies_tabView1_1 > a');
         await this.page.fill('#cod_grupoEntrada', "2");
         await this.page.keyboard.press('Enter', { delay: 50 });
         await this.page.fill('#cod_grupoEntrada', "9");
         await this.page.keyboard.press('Enter', { delay: 50 });
    }
    
}
export default genSimExtrator
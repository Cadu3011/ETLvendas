import ExtractorBase from "../models/extract";

class propagadoExtrator extends ExtractorBase{
    async ConfigPage(): Promise<void> {
        await this.page.click('#tabTabdhtmlgoodies_tabView1_1 > a');
        await this.page.fill('#cod_grupoEntrada', "3");
        await this.page.keyboard.press('Enter', { delay: 50 });
    }
    
}
export default propagadoExtrator
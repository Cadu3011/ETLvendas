import Login from "./extract/login";
import ExtractController from "./extract/controller/extractController"
async function execute(){
    const {context,page,browser} = await Login.auth({login:"95",password:"cadu3011"})
    await ExtractController.buildExtraction(context,page)
    await browser.close();
}
execute()
import { chromium } from "playwright-chromium";
import IuserLogin from "./models/contratoLogin";


class Login {
    static async auth(user: IuserLogin): Promise<any> {
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

        await page.goto('http://192.168.1.253:4647/sgfpod1/Login.pod', { waitUntil: 'domcontentloaded' });
        await page.fill('#id_cod_usuario', user.login);
        await page.fill('#nom_senha', user.password);
        await page.click('#login');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

        return {context ,page,browser};
    }
}

export default Login


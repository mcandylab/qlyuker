import axios from "axios";

let authCookies = '';

async function login() {
    try {
        const response = await axios.post(
            'https://api.qlyuker.io/auth/start',
            {
                "startData": "user=%7B%22id%22%3A234625303%2C%22first_name%22%3A%22Andrey%22%2C%22last_name%22%3A%22Abramov%22%2C%22username%22%3A%22andylab%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FE7-8GjT4MOO8bTlo691SoGyfpvvD_VtGiikVaMPcKvg.svg%22%7D&chat_instance=8339652096727360583&chat_type=sender&auth_date=1747844284&signature=trLGsSPmpYv5l7YHgdnUtPpDAtyso7-VVeyXVbpWrgwVHpVteN3SB0b6RoL9dCKXSyYUu7vsv9IZm9OsmLyHDg&hash=8c899fc5fa0a2679abb5a2606c248b33b2037392c11fc09f57ecddb72e3c3f24"
            },
            {withCredentials: true}
        );
        const setCookie = response.headers['set-cookie'];
        if (setCookie) {
            authCookies = Array.isArray(setCookie) ? setCookie.join('; ') : setCookie;
        } else {
            console.warn('Куки не найдены в ответе');
        }
    } catch (error) {
        console.error('Ошибка при логине:', error);
    }
}

async function click() {
    try {
        const response = await axios.post(
            'https://api.qlyuker.io/game/sync',
            {taps: 1},
            {
                headers: {
                    'Cookie': authCookies,
                    'klyuk': '0110101101101100011011110110111101101011'
                }
            }
        );
    } catch (error) {
        console.error('Ошибка при клике:', error);
    }
}

async function init() {
    await login();

    setInterval(async () => {
        await performClickAndHandleErrors();
    }, 1400);
}

async function performClickAndHandleErrors() {
    try {
        await click();
    } catch (error) {
        console.error('Ошибка при отправке клика, пытаемся авторизоваться снова:', error);
        try {
            await login();
            console.log('Повторная авторизация успешна.');
        } catch (loginError) {
            console.error('Повторная авторизация не удалась:', loginError);
        }
    }
}

init();
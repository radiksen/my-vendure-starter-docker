import { VendureConfig, DefaultSearchPlugin } from '@vendure/core'; // <-- ЭТА СТРОКА ДОЛЖНА БЫТЬ ТАК
import { defaultEmailHandlers } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
// import * as path from 'path'; // <--- ЭТУ СТРОКУ НУЖНО УДАЛИТЬ, если 'path' больше нигде не используется
import 'dotenv/config';

export const config: VendureConfig = {
    apiOptions: {
        port: 3000,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        cors: true,
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME || 'superadmin@vendure.io',
            password: process.env.SUPERADMIN_PASSWORD || 'shopsecret',
        },
    },
    paymentOptions: {
        paymentMethodHandlers: [],
    },
    dbConnectionOptions: {
        type: 'postgres',
        host: process.env.DB_HOST || 'db',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'vendure',
        password: process.env.DB_PASSWORD || 'vendure_password',
        database: process.env.DB_DATABASE || 'vendure',
        synchronize: true,
        logging: false,
        schema: 'public',
    },
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: './assets',
        }),
        AdminUiPlugin.init({
            route: 'admin',
            port: 3002,
        }),
        // <--- ИСПРАВЛЕННЫЙ ПЛАГИН ПОИСКА
        DefaultSearchPlugin.init({ // <--- ЭТОТ БЛОК ДОЛЖЕН БЫТЬ ТАК
            // Опции плагина (можно оставить пустыми для базовой настройки)
        }),
    ],
};

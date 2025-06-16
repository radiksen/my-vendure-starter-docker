import { VendureConfig } from '@vendure/core';
import { defaultEmailHandlers } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin'; // Только один импорт AdminUiPlugin
import * as path from 'path'; // Только один импорт path
import 'dotenv/config'; // Только один импорт dotenv/config

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
        
       AdminUiPlugin.init({ // <--- ОБНОВЛЕННАЯ НАСТРОЙКА ADMINUIPLUGIN
            route: 'admin', // URL-путь, по которому будет доступна админка (например, /admin)
            port: 3002, // <--- ДОБАВЛЕННЫЙ ПОРТ. ОН ЯВНО ТРЕБУЕТСЯ.
        }),


        //     handlers: defaultEmailHandlers,
        //     outputPath: path.join(__dirname, '__generated__/email'), // Пример пути для вывода шаблонов
        //     route: 'emails',
        //     // options...
        // }),
    ],
    // Дополнительные настройки Vendure (если npx @vendure/create добавил что-то еще,
    // убедитесь, что это не дублирует вышеперечисленные секции)
};

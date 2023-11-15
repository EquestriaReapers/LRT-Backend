import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const CORS: CorsOptions = {
    origin: ['http://localhost:3000',
            'http://localhost:4200',
            'http://localhost:8080',
            'http://localhost:5173',
        ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
}
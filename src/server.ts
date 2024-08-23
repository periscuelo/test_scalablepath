import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerFile from './constants/swagger_output.json';
import routes from './routes';
import services from './services';
import prisma from '../prisma';

dotenv.config();

const app: Express = express();
const port = process.env.PORT ?? 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
  services.getDataFromThirdApi();
});

app.use('/', routes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

const stopServer = () => {
  server.close();
  prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', () => {
  stopServer();
});

process.on('SIGTERM', () => {
  stopServer();
});

process.on('uncaughtException', err => {
  console.error('uncaughtException: ', String(err.stack));
  process.exit(1);
});

process.on('unhandledRejection', (err: any, promise) => {
  console.error('Unhandled Promise Rejection: promise:', promise);
  console.error('Unhandled Promise Rejection: reason:', err.message);
  console.error(String(err.stack));
  process.exit(0);
});

export default server;

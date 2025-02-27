import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import cookieParser from "cookie-parser"

const app: Application = express();

app.use(cookieParser())
app.use(express.json());
app.use(cors({origin: ["http://localhost:5173"], credentials: true}));
app.use("/api/v1", router);

app.get('/', (req: Request, res: Response) => {
  res.send("Hello world");
});
app.use(globalErrorHandler);
app.use(notFound);


export default app;

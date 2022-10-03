import express from 'express';
import { PdfRoute } from '../routes';

export class Server {
  private readonly app = express();
  private readonly port = 8080;

  public start(): void {
    const app = this.app;
    const port = this.port;

    app.get('/', (req, res) => new PdfRoute(req, res));

    app.listen(port, () => console.log(`The server has been started with port ${port}`));
  }
}
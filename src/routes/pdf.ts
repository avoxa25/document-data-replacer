import { Request, Response } from 'express';
import { Route } from '../classes';
import { PdfService } from '../services';

export class PdfRoute extends Route {
  private readonly pdfService: PdfService;

  constructor(
    request: Request,
    response: Response,
  ) {
    super(request, response);

    this.pdfService = new PdfService();
  }

  public process(): void {

  }
}
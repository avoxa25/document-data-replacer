import { Request, Response } from 'express';
import { Route } from '../classes';
import { Pattern } from '../interfaces';
import { PdfService } from '../services';

const EXAMPLE_PATTERNS: Pattern[] = [
  {
    variable: 'first',
    value: 'Один',
  },
  {
    variable: 'second',
    value: 'Два',
  },
  {
    variable: 'third',
    value: 'Три',
  },
  {
    variable: 'table1',
    value: 'Таблица 1',
  },
  {
    variable: 'table2',
    value: 'Таблица 2',
  },
  {
    variable: 'table3',
    value: 'Таблица 3',
  },
  {
    variable:'table4' ,
    value: 'Таблица 4',
  },
  {
    variable:'table5' ,
    value: 'Таблица 5',
  },
  {
    variable:'table6' ,
    value: 'Таблица 6',
  },
]

export class PdfRoute extends Route {
  private readonly pdfService: PdfService;

  constructor(
    request: Request,
    response: Response,
  ) {
    super(request, response);

    this.pdfService = new PdfService();
  }

  public async process(): Promise<void> {
    const patterns: Pattern[] = this.request.body?.patterns ?? EXAMPLE_PATTERNS;

    await this.pdfService.replaceVariablesWithValues(patterns);

    const buffer = this.pdfService.getBuffer();

    this.response.contentType('application/pdf').send(buffer);
  }
}
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
    variable: 'loop',
    value: [
      {
        title: 'Title1',
        description: 'Description1',
      },
      {
        title: 'Title2',
        description: 'Description2',
      },
      {
        title: 'Title3',
        description: 'Description3',
      },
    ],
  },
  {
    variable: 'loop2',
    value: [
      {
        title: 'Title1',
        description: 'Description1',
      },
      {
        title: 'Title2',
        description: 'Description2',
      },
      {
        title: 'Title3',
        description: 'Description3',
      },
    ],
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
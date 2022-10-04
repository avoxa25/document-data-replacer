import * as pdfJs from 'pdfjs-dist/legacy/build/pdf';
import { Pattern } from '../interfaces';

const PATH_TO_EXAMPLE = './src/templates/example.pdf';

export class PdfService {
  private buffer = Buffer.from('');

  public async replaceVariablesWithValues(patterns: Pattern[]): Promise<void> {
    const document = await pdfJs.getDocument(PATH_TO_EXAMPLE).promise;

    const pagesCount = document.numPages;

    for (let pageNumber = 1; pageNumber <= pagesCount; pageNumber++) {
      const page = await document.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const contentItems = textContent.items;

      for (const item of contentItems) {
          for (const pattern of patterns) {
            (item as any).str =  ((item as any).str as string).replaceAll(`\$\{${pattern.variable}\}`, pattern.value);
          }
      }
    }   

    const uint8Array = await document.saveDocument();
    this.buffer = Buffer.of(...uint8Array);
  }

  public getBuffer(): ArrayBuffer {
    return this.buffer;
  }
}
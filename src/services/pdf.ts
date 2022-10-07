import { Pattern } from '../interfaces';
import Pizzip from 'pizzip';
import * as fs from 'fs';
import Docxtemplater, { DXT } from 'docxtemplater';
import libre from 'libreoffice-convert';
import util from 'util';

// https://docxtemplater.com/docs/api/
// https://github.com/open-xml-templating/pizzip/blob/master/documentation/api_pizzip
// https://github.com/elwerene/libreoffice-convert#readme

const PATH_TO_EXAMPLE = './src/templates/example.docx';

export class PdfService {
  private buffer: Buffer | undefined;

  constructor() { }

  public async replaceVariablesWithValues(patterns: Pattern[]): Promise<void> {
    const templateBinary = this.getTemplateBinary();
    const zippedBinary = this.executeZipping(templateBinary);
    const document = this.getDocument(zippedBinary, {
      paragraphLoop: true,
      linebreaks: true,
    });

    this.replaceData(document, patterns);
    this.convertToBuffer(document);
    await this.convertToPdf();
  }

  public getBuffer(): any | undefined {
    return this.buffer;
  }

  private convertToBuffer(doc: Docxtemplater): void {
    this.buffer = (doc.getZip() as Pizzip).generate({
      type: 'nodebuffer',
    })
  }

  private async convertToPdf(): Promise<void> {
    const buffer = this.buffer;

    if (!buffer) return;

    const convertAsync = util.promisify(libre.convert);

    try {
      this.buffer = await convertAsync(buffer, '.pdf', undefined);
    } catch (error) {
      console.log(`Error occurred: ${error}`);
    }
  }

  private executeZipping(binary: string): Pizzip {
    return new Pizzip(binary);
  }

  private getDocument(zip: Pizzip, options?: DXT.ConstructorOptions): Docxtemplater {
    return new Docxtemplater(zip, options);
  }

  private getRenderOptions(patterns: Pattern[]): Record<string, Pattern['value']> {
    return patterns.reduce((acc, pattern) => {
      acc[pattern.variable] = pattern.value;
      return acc;
    }, {} as Record<string, Pattern['value']>);
  }

  private getTemplateBinary(): string {
    return fs.readFileSync(PATH_TO_EXAMPLE, 'binary');
  }

  private replaceData(document: Docxtemplater, patterns: Pattern[]): Docxtemplater {
    const options = this.getRenderOptions(patterns);

    return document.render(options);
  }
}
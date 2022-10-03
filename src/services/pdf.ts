import muhammara from 'muhammara';
import { Pattern } from '../interfaces';

const PATH_TO_EXAMPLE = './src/templates/example.pdf';
const EXAMPLE_BYTE_COUNT = 10000;

export class PdfService {
  private readonly sourceStream!: muhammara.ReadStream;
  private readonly outputStream!: muhammara.PDFWStreamForBuffer;
  private readonly modifiedPdfWriter!: muhammara.PDFWriter;

  constructor() {
    try {
      this.sourceStream = new muhammara.PDFRStreamForFile(PATH_TO_EXAMPLE);
      this.outputStream = new muhammara.PDFWStreamForBuffer();
      this.modifiedPdfWriter = muhammara.createWriterToModify(this.sourceStream, this.outputStream, { compress: false });
    } catch (error) {
      console.log(error)
    };
  }

  public replaceVariablesWithValues(patterns: Pattern[]): void {
    const pagesCount = this.getPagesCount();
    const writer = this.modifiedPdfWriter;
    const source = this.sourceStream;

    for (let page = 0; page < pagesCount; page++) {
      const copyingContext = writer.createPDFCopyingContextForModifiedFile();
      const objectsContext = writer.getObjectsContext();
      const pageObject = copyingContext.getSourceDocumentParser(source).parsePage(page);
      const textStream = copyingContext
        .getSourceDocumentParser(source)
        .queryDictionaryObject(pageObject.getDictionary(), 'Contents');
      const textObjectID = (pageObject.getDictionary().toJSObject() as { Contents: { getObjectID: () => number } }).Contents.getObjectID();
      let data: number[] = [];
      const readStream = copyingContext.getSourceDocumentParser(source).startReadingFromStream(textStream as muhammara.PDFStreamInput);

      while (readStream.notEnded()) {
        const readData = readStream.read(EXAMPLE_BYTE_COUNT);
        data = [...data, ...readData];
      }

      const pdfPageAsString = Buffer.from(data).toString();
      let modifiedPdfPageAsString = pdfPageAsString;

      for (const pattern of patterns) {
        modifiedPdfPageAsString = modifiedPdfPageAsString.replaceAll(`\$\{${pattern.variable}\}`, pattern.value);
      }

      objectsContext.startModifiedIndirectObject(textObjectID);

      const dictionaryContext = objectsContext.startDictionary();
      const stream = objectsContext.startUnfilteredPDFStream(dictionaryContext);

      const byteArray = Array.from(new TextEncoder().encode(modifiedPdfPageAsString)) as unknown as number[];

      stream.getWriteStream().write(byteArray);

      objectsContext.endPDFStream(stream);
      objectsContext.endIndirectObject();
    }

    writer.end();
  }

  public getOutputStreamBuffer(): Promise<any> {
    return this.outputStream.buffer;
  }

  private getPagesCount(): number {
    return this.modifiedPdfWriter
      .createPDFCopyingContextForModifiedFile()
      .getSourceDocumentParser(this.sourceStream)
      .getPagesCount();
  }
}
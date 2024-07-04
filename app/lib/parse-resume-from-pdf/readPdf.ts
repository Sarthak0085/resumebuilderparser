import type { TextItem as PdfjsTextItem } from 'pdfjs-dist/types/src/display/api';
import { TextItem, TextItems } from './types';
import * as pdfjs from 'pdfjs-dist';

const readPdf = async (fileUrl: string): Promise<TextItems> => {
  const pdfFile = await pdfjs.getDocument(fileUrl).promise;
  let textItems: TextItems = [];

  for (let i = 0; i <= pdfFile.numPages; i++) {
    const page = await pdfFile.getPage(i);
    const textContent = await page.getTextContent();

    await page.getOperatorList();
    const commonObjs = page.commonObjs;

    const pageTextItems = textContent.items.map((item) => {
      const { str: text, dir, transform, fontName: pdffontName, ...otherProps } = item as any;
      const x = transform[4];
      const y = transform[5];

      const fontObj = commonObjs.get(pdffontName);
      const fontName = fontObj.name;

      const newText = text.replace(/--/g, '-');

      const newItem = {
        ...otherProps,
        text: newText,
        font: fontName,
        x,
        y,
      };

      return newItem;
    });

    textItems.push(...pageTextItems);
  }

  const isEmptySpace = (textItem: TextItem) => !textItem.hasEOL && textItem.text.trim() === '';

  textItems = textItems.filter((textItem) => !isEmptySpace(textItem));

  return textItems;
};

export default readPdf;

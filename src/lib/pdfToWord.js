import { Document, Packer, Paragraph, TextRun } from "docx";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = workerSrc;

function groupItemsIntoLines(items) {
  const lines = [];

  for (const item of items) {
    if (!item.str?.trim()) {
      continue;
    }

    const y = Math.round(item.transform[5] * 10) / 10;
    const existingLine = lines.find((line) => Math.abs(line.y - y) < 2.5);

    if (existingLine) {
      existingLine.items.push(item);
      continue;
    }

    lines.push({
      y,
      items: [item],
    });
  }

  return lines
    .sort((left, right) => right.y - left.y)
    .map((line) =>
      line.items
        .sort((left, right) => left.transform[4] - right.transform[4])
        .map((item) => item.str.trim())
        .join(" "),
    )
    .filter(Boolean);
}

export async function convertPdfToWord(arrayBuffer, { onProgress } = {}) {
  onProgress?.({
    progress: 10,
    message: "Reading PDF structure",
  });

  const loadingTask = getDocument({
    data: arrayBuffer,
    useWorkerFetch: false,
    isEvalSupported: false,
  });
  const pdf = await loadingTask.promise;
  const paragraphs = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    onProgress?.({
      progress: Math.round(12 + (pageNumber / pdf.numPages) * 66),
      message: `Extracting text from page ${pageNumber} of ${pdf.numPages}`,
    });

    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const lines = groupItemsIntoLines(textContent.items);

    if (pageNumber > 1) {
      paragraphs.push(new Paragraph({ text: "" }));
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Page ${pageNumber}`,
              bold: true,
              size: 18,
            }),
          ],
          spacing: {
            before: 240,
            after: 120,
          },
        }),
      );
    }

    if (lines.length === 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "[No extractable text found on this page]",
              italics: true,
              color: "666666",
            }),
          ],
        }),
      );
      continue;
    }

    for (const line of lines) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line,
              size: 24,
            }),
          ],
          spacing: {
            after: 120,
          },
        }),
      );
    }
  }

  onProgress?.({
    progress: 88,
    message: "Preparing the Word download",
  });

  const document = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs.length
          ? paragraphs
          : [
              new Paragraph({
                text: "No extractable text was found in the uploaded PDF.",
              }),
            ],
      },
    ],
  });

  const blob = await Packer.toBlob(document);

  onProgress?.({
    progress: 100,
    message: "Word file ready to download",
  });

  return blob;
}

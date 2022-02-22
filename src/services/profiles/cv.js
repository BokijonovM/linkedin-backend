import PdfPrinter from "pdfmake";
import striptags from "striptags";
import axios from "axios";
const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};

const printer = new PdfPrinter(fonts);

export const generateprofilePDF = async (profiles) => {
  let imagePart = {};
  if (profiles.image) {
    const response = await axios.get(profiles.image, {
      responseType: "arraybuffer",
    });
    const imageURLParts = profiles.cover.split("/");
    const fileName = imageURLParts[profileCoverURLParts.length - 1];
    const [id, extension] = fileName.split(".");
    const base64 = response.data.toString("base64");
    const base64Image = `data:image/${extension};base64,${base64}`;
    imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] };
  }
  const docDefinition = {
    content: [
      imagePart,
      { text: profiles.title, fontSize: 20, bold: true, margin: [0, 0, 0, 40] },
      { text: striptags(profiles.content), lineHeight: 4 },
    ],
  };

  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  return pdfDoc;
};

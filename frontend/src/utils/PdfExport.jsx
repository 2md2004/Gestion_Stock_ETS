import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const waitForImages = (container) => {
    if (!container) return Promise.resolve();
    const imgs = Array.from(container.querySelectorAll("img"));
    return Promise.all(
        imgs.map((img) =>
            img.complete
                ? Promise.resolve()
                : new Promise((resolve) => {
                      img.onload = resolve;
                      img.onerror = resolve;
                  })
        )
    );
};

// Capture un élément DOM et le sauvegarde en PDF (identique au rendu affiché)
export const exporterElementEnPdf = async (element, nomFichier) => {
    await waitForImages(element);
    const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const largeurPage = pdf.internal.pageSize.getWidth();
    const hauteurImage = (canvas.height * largeurPage) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, largeurPage, hauteurImage);
    pdf.save(nomFichier);
};

// Ajoute logoUrl à l'objet boutique renvoyé par l'API
export const withLogoUrl = (data, apiUrl) =>
    data && data.id
        ? { ...data, logoUrl: data.logoPath ? `${apiUrl}images/${data.logoPath}` : null }
        : null;
import html2canvas from "html2canvas";

export function handleOcr() {
  console.log("OCR");

  document.addEventListener("click", async (event) => {
    return;
    // Get the clicked coordinates
    const x = event.clientX;
    const y = event.clientY;
    // console.log([x, y]);
    const body = document.body;

    // Use html2canvas to capture the body
    const canvas = await html2canvas(body);
    // const [width,height] = [300,30]
    const [width, height] = [window.innerWidth, window.innerHeight];
    // await capturescreen2();
    // return;
    const croppedCanvas = document.createElement("canvas");
    const ctx = croppedCanvas.getContext("2d");
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    ctx.drawImage(canvas, x - 15, y - 10, width, height, 0, 0, width, height);
    const croppedImage = croppedCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = croppedImage;
    link.download = `file-${new Date().getMilliseconds()}.png`; // [printer.ids.join(","), ".pdf"].join("");
    // document.body.appendChild(link);
    link.click();
    // console.log(croppedImage);
  });
}
async function capturescreen2() {
  const screenshot = document.createElement("canvas") as any;
  //   .documentElement.cloneNode(true) as any;
  screenshot.style.pointerEvents = "none";
  screenshot.style.overflow = "hidden";
  screenshot.style.webkitUserSelect = "none";
  screenshot.style.mozUserSelect = "none";
  screenshot.style.msUserSelect = "none";
  screenshot.style.oUserSelect = "none";
  screenshot.style.userSelect = "none";
  screenshot.dataset.scrollX = window.innerWidth;
  screenshot.dataset.scrollY = window.innerHeight;
  console.log([window.innerWidth, window.innerHeight]);
  const blob = new Blob([screenshot.outerHTML], {
    type: "text/html",
  });
  //   window.URL = window.URL || window.webkitURL;
  //   window.open(window.URL.createObjectURL(blob));
  console.log(screenshot.toDataURL("image/png"));
  return blob;
}
async function capturescreen() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const screenshot: any = document.createElement("screenshot");

  try {
    const captureStream = await navigator.mediaDevices.getDisplayMedia();
    screenshot.srcObject = captureStream;
    context.drawImage(
      screenshot as any,
      0,
      0,
      window.innerWidth as any,
      window.innerHeight as any
    );
    const frame = canvas.toDataURL("image/png");

    console.log(frame);
    captureStream.getTracks().forEach((track) => track.stop());
    // window.location.href = frame;
  } catch (err) {
    console.error("Error: " + err);
  }
}

import { IJoomagProduct } from "./app/App";
import { _nodeElement, safeText } from "./utils";

interface IData {
  img: string | undefined;
  headers: IHeader[];
  subtitle;
  section;
  productTitle;
  productData: IJoomagProduct;
}
interface IHeader {
  el: HTMLElement;
  x;
  y;
  title;
}
export function scrapeProduct(target: HTMLElement) {
  const data: IData = ({
    img: findImage(target),
    headers: findHeaders(target),
    productData: {
      meta: {},
    },
  } as Partial<IData>) as any;

  let arr = Array.from(target.parentElement.querySelectorAll("text")).map(
    (n) => (n as any) as HTMLElement
  );
  const sectionIndex = arr.findIndex((a) =>
    safeText(a)
      ?.toLowerCase()
      .includes("section ")
  );
  arr = arr
    .filter((e, i) => {
      if (i <= sectionIndex) return false;
      if (i > 10 + sectionIndex) return false;
      const t = safeText(e);
      if (t.split("/").length == 3) return false;
      if (t.toLowerCase().includes("section ")) return false;
      if (t.includes(":")) return false;

      return true;
    })
    .map((n) => safeText(n));
  data.section = arr[0];
  data.productTitle = arr[1];
  getSubtitle(data);
  getImage(data, target);
  getItem(data, target);

  return data.productData;
}
function isBetween(number, minValue, maxValue) {
  return number >= minValue && number <= maxValue;
}
function getImage(data: IData, el: HTMLElement) {
  //forward search....
  let image = null;
  let _node = el.nextSibling as HTMLElement;

  let i = 0;
  while (
    // !isHeader(safeText(_node)) &&
    ++i < 100
  ) {
    console.log("geImage");

    if (i > 100) {
      break;
    }
    if (!_node) continue;
    if (_node?.nodeName == "image") {
      image = _node.getAttribute("xlink:href");
    }
    _node = _node.nextSibling as HTMLElement;
  }
  // if(!image) {
  //   let boundary = 0;
  //   while(boundary < 2 &&)
  // }
  data.img = image;
}
function getItem(data: IData, el: HTMLElement) {
  const y = +el.getAttribute("y");
  const texts = Array.from(el.parentElement.querySelectorAll("text"))
    .map((n) => (n as any) as HTMLElement)
    .filter(
      (el) =>
        safeText(el) &&
        isBetween(+el.getAttribute("y"), y - 5, y + 5) &&
        isBetween(
          +el.getAttribute("x"),
          data.headers[0]?.x - 5,
          data.headers.slice(-1)[0].x + 5
        )
    );
  const pdata: any = {
    img: data.img,
  };
  data.headers.map((h) => {
    const node = texts.find((t) =>
      isBetween(+t.getAttribute("x"), h.x - 5, h.x + 5)
    );
    if (node) {
      let _text = safeText(node);
      if (_text.includes("$")) _text = _text.replace("$", "").replace(",", "");
      pdata[titleToLabel(h.title)] = _text;
    }
  });
  data.productData.price = +pdata.price || 0;
  data.productData.meta = {
    ...pdata,
  };
  data.productData.sku = pdata.sku;
  data.productData.section = data.section;
  data.productData.description = [data.productTitle, data.subtitle, pdata.size]
    .filter(Boolean)
    .join(" ");
  return;
}
function titleToLabel(title) {
  //size => size
  const k = title?.toLowerCase();
  return (
    {
      [k]: title,
      "item number": "sku",
      size: "size",
      "per box": "perBox",
      price: "price",
      lights: "lights",
      "rsl#": "rsl",
    }[k] || title
  );
}

function getSubtitle(data: IData) {
  const lastTitleEl = data.headers.slice(-1)[0]?.el;
  let subtitle = null;
  if (!lastTitleEl) console.log("LAST HEADER NOT FOUND");
  else {
    let node = _nodeElement(lastTitleEl.nextSibling);
    while (node) {
      console.log("getSubtitle");
      if (subtitle) break;
      const nT = safeText(node);
      if (nT.toLowerCase().includes("discontinued") || !nT) {
        node = _nodeElement(node.nextSibling);
        continue;
      }
      if (node.getAttribute("x") == data.headers[0].el.getAttribute("x")) break;
      subtitle = nT;
    }
    data.subtitle = subtitle;
    console.log(subtitle);
  }
  return subtitle;
}
function findHeaders(target: HTMLElement) {
  const _headers: IHeader[] = [];
  let _valid = true;
  let node: HTMLElement = target.previousSibling as any;
  while (_valid) {
    console.log("find header");
    if (!node) break;

    const nt = node?.textContent
      ?.trim()
      ?.split("\n")
      .filter(Boolean)
      .join(" ");
    // console.log(nt);
    if (nt) {
      const validHeader = isHeader(nt);
      if (!validHeader && _headers.length > 0) {
        _valid = false;
        continue;
      }
      if (validHeader) {
        _headers.unshift({
          title: nt,
          x: +node?.getAttribute("x"),
          y: +node?.getAttribute("y"),
          el: node,
        });
      }
    }
    node = node.previousSibling as any;
  }
  console.log(_headers);
  return _headers.sort((a, b) => a.x - b.x);
}
function isHeader(text: string) {
  const _isValid = [
    "size",
    "lights",
    "rsl#",
    "per box",
    "item number",
    "price",
  ].includes(text?.toLowerCase()?.trim());
  // console.log([_isValid, text]);
  return _isValid;
}
function findImage(target: HTMLElement) {
  const img = null;

  return img;
}

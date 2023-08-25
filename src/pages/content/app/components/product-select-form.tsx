import { useEffect, useState } from "react";
import { IJoomagProduct, IProps } from "../App";
import { handleItemClick } from "../../utils";
import { scrapeProduct } from "../../scrape-product";
import Label from "./label";
import { url } from "../../api";
import Input from "./input";
import Btn from "./button";
import Loader from "./loader";

interface IForm {
  title;
  qty;
  total;
  swing;
}
interface JoomagProductPostReq {
  product: IJoomagProduct;
  orderId;
  uid;
  componentUUid;
  qty;
  swing;
  price;
  total;
  tax;
  taxPercentage;
}
export default function ProductSelectForm({ ctx, setCtx }: IProps) {
  // useEffect(() => {
  handleItemClick((v) => scrape(v));
  // }, []);
  const [scraping, setScraping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [swing, setSwing] = useState("");
  const [product, setProduct] = useState<IJoomagProduct>(null as any);
  const [qty, setQty] = useState("");
  async function scrape(e) {
    console.log("->", ctx);
    setScraping(true);
    setProduct({} as any);
    if (e.ctrlKey || e.metaKey) {
      const product = scrapeProduct(e.target);
      console.log(product);
      const findData = await fetch(url(`product?sku=${product.sku}`), {
        cache: "no-cache",
        method: "GET",
      });
      const resp = await findData.json();

      const prd = resp?.id ? resp : product;
      console.log("=====>", ctx);
      setProduct(prd);
      setPrice(prd.price);
      setTitle(prd?.meta?.componentTitle || prd.description);
      setScraping(false);
    } else {
      setScraping(false);
      window.alert("Unable to locate product");
    }
  }
  async function addProduct() {
    setLoading(true);
    const form: JoomagProductPostReq = {
      product: {
        ...product,
        price,
        title,
        meta: {
          ...product.meta,
        },
      },
      uid: ctx.nextUid,
      orderId: ctx.orderId,
      componentUUid: ctx.componentUUid,
      qty: +qty,
      total: +price * +qty,
      price: +price,
      swing,
      taxPercentage: +ctx.taxPercentage,
      tax: null,
    };
    form.tax = form.total * (form.taxPercentage / 100);
    const body = JSON.stringify(form);
    console.log(form);
    fetch(url(`product`), {
      method: "POST",
      body,
    })
      .then(async (resp) => {
        const rd = await resp.json();

        if (resp.status == 200) {
          window.alert("Added!");
          setCtx({
            ...ctx,
            product: null,
            nextUid: ctx.nextUid + 1,
          });
          setProduct(null as any);
          setPrice("");
          setQty("");
          setSwing("");
          setTitle("");
        }
      })
      .catch((e) => {
        window.alert("Unable to Complete");
      });
    setLoading(false);
  }
  if (product)
    return (
      <div className="grid gap-4 bg-white shadow-xl border overflow-hidden p-2 rounded-lg w-72 grid-cols-2">
        <div className="grid gap-2 col-span-2">
          <Label>Product Information</Label>
          <p>
            {product.description} (${product.price})
          </p>
        </div>
        <div className="grid gap-2 col-span-2">
          <Label>Door Title</Label>
          <Input value={title} setValue={setPrice} />
        </div>
        <div className="grid gap-2 grid-cols-2">
          <div className="grid gap-2">
            <Label>Price</Label>
            <Input type="number" value={price} setValue={setPrice} />
          </div>
          <div className="grid gap-2">
            <Label>Qty</Label>
            <Input type="number" value={qty} setValue={setQty} />
          </div>
        </div>
        <div className="grid gap-2">
          <Label>Swing</Label>
          <Input value={swing} setValue={setSwing} />
        </div>
        <div className="col-span-2 flex space-x-2 justify-end">
          <Btn
            color="warn"
            onClick={() => {
              setProduct({} as any);
            }}
          >
            Reset
          </Btn>
          <Btn color="primary" loading={loading} onClick={addProduct}>
            Add Product
          </Btn>
        </div>
      </div>
    );

  return (
    <div className="bg-white w-72 border rounded-lg p-2">
      {scraping ? (
        <div className="flex flex-col y-8 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className=" flex flex-col">
          <div className="bg-white line-clamp-2 text-sm">
            Hold Ctrl key and click on the product text.
          </div>
          <div className="flex justify-end">
            <Btn
              color="warn"
              onClick={() => {
                setCtx({} as any);
              }}
            >
              Reset
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

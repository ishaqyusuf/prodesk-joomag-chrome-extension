import { Dispatch, SetStateAction, useState } from "react";

import ProductSelectForm from "./components/product-select-form";
import OrderForm from "./components/order-form";

interface ICtx {
  orderId;
  nextUid;
  componentUUid;
  taxPercentage;
  product: IJoomagProduct;
}
export interface IJoomagProduct {
  id?;
  title;
  description;
  price;
  sku?;
  section?;
  meta: {
    //
  };
}
export interface IProps {
  ctx: ICtx;
  setCtx: Dispatch<SetStateAction<ICtx>>;
}
export default function App() {
  const [ctx, setCtx] = useState<ICtx>({} as any);

  return (
    <div className="z-50">
      <div className="z-50 fixed bottom-0 right-0 m-4 mb-10">
        {!ctx.orderId && <OrderForm ctx={ctx} setCtx={setCtx} />}
        {ctx.orderId && <ProductSelectForm ctx={ctx} setCtx={setCtx} />}
      </div>
    </div>
  );
}

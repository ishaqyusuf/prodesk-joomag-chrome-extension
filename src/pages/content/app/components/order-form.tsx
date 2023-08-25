import { useEffect, useState, useTransition } from "react";
import { IProps } from "../App";
import { url } from "../../api";
import Label from "./label";
import Input from "./input";
import Btn from "./button";

export default function OrderForm({ ctx, setCtx }: IProps) {
  if (ctx.orderId) return null;

  const [id, setId] = useState(localStorage.getItem("gndprodesk-sales-id"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  async function proceed() {
    setLoading(true);
    fetch(url(`sales?orderId=${id}`), {
      cache: "no-cache",
      method: "GET",
    })
      .then(async (resp) => {
        setLoading(false);
        const _resp = await resp.json();

        console.log(_resp);
        if (_resp?.error) setError(_resp.error);
        else
          setCtx({
            ...ctx,
            ..._resp,
          });
      })
      .catch((e) => {
        setLoading(false);
      });
  }

  return (
    <div className="bg-white p-2 rounded-lg space-y-2 shadow-xl flex flex-col justify-end">
      <div className="grid gap-2">
        <Label>Sales #</Label>
        <Input
          setValue={(v) => {
            setError(null);
            setId(v);
            localStorage.setItem("gndprodesk-sales-id", v);
          }}
          name="salesID"
          value={id}
        />
      </div>
      {error && <div className="text-red-500 text-xs">{error}</div>}
      <Btn color="primary" onClick={proceed} loading={loading}>
        Ok
      </Btn>
    </div>
  );
}

import Loader from "./loader";

export default function Btn(props: {
  color: "primary" | "warn";
  loading?: boolean;
  children?;
  onClick?;
}) {
  const color = props.color;
  return (
    <button
      {...props}
      disabled={props?.loading}
      className={`disabled:bg-opacity-500  p-1 rounded-lg px-4 focus:outline-none text-sm inline-flex text-slate-100 justify-center items-center ${
        color == "warn"
          ? "bg-red-600"
          : color == "primary"
          ? "bg-blue-900"
          : "bg-green-600"
      }`}
    >
      {props.loading && <Loader className="mr-2" />}
      {props.children}
    </button>
  );
}

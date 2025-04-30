import { InputHTMLAttributes } from "react";

type TInputStyleProps = {
  state: "default" | "success" | "failed";
};
interface IInputProps
  extends TInputStyleProps,
    InputHTMLAttributes<HTMLInputElement> {
  title: string;
  placeholder: string;
}

const Input = ({
  state,
  title,
  placeholder,
  className,
  ...props
}: IInputProps) => {
  const colorStyle = {
    default: `border-[#BDBDBD] bg-[#FDFDFD]`,
    success: `border-[#44A257] bg-[#FDFDFD]`,
    failed: `border-[#EB5757] bg-[#FDFDFD]`,
  };

  return (
    <div className={`flex flex-col gap-[9px] w-[414px]`}>
      <p className="font-[#585858] text-[14px] font-[400]">{title}</p>
      <input
        className={`w-full border rounded-[8px] p-[10px] ${colorStyle[state]} ${className}`}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default Input;

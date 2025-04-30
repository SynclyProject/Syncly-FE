import { InputHTMLAttributes } from "react";

/**
 * Input Component
 *
 * Input을 사용할 수 있는 Input Component입니다.
 *
 * 33가지 상태를를 선택하여 사용할 수 있습니다.
 *
 * @param {string} state - 색상 선택 ("default" | "success"| "failed")
 * @param {string} title - Input 제목
 * @param {string} placeholder - Input의 placeholder
 */

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

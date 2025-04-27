import { ButtonHTMLAttributes } from "react";
import Icon from "./Icon";
/**
 * Button Component
 *
 * Button을 사용할 수 있는 Button Component입니다.
 *
 * 두가지 색상의 버튼을 선택하여 사용할 수 있습니다.
 *
 * @param {string} color - 색상 선택 ("main" | "sub" | "success")
 * @param {string} iconName - 아이콘 이름 (선택택)
 */
type TButtonColorProps = {
  colorType: "main" | "sub" | "success" | "unable";
};
interface IButtonProps
  extends TButtonColorProps,
    ButtonHTMLAttributes<HTMLButtonElement> {
  iconName?: string;
  children: React.ReactNode;
}

const Button = ({
  children,
  onClick,
  iconName,
  colorType,
  className,
  ...props
}: IButtonProps) => {
  const colorStyle = {
    main: `bg-[#028090] text-[#FFFFFF] border-none`,
    sub: `bg-[#456990] text-[#FFFFFF] border-none`,
    success: `bg-[#44A257] text-[#FFFFFF] border-none`,
    unable: `bg-[#FDF5F2] text-[#EB5757] border-[#E0E0E0]`,
  };

  return (
    <button
      className={`flex items-center gap-[8px] px-[16px] rounded-[8px] h-[40px] ${colorStyle[colorType]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {iconName ? <Icon name={iconName} /> : null}
      {children}
    </button>
  );
};
export default Button;

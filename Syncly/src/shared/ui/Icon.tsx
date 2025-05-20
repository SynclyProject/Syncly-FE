/**
 * Icon Component
 *
 * Icon을 사용할 수 있는 Icon Component입니다.
 *
 * name에 svg가 추가되어 있지 않다면 자동으로 .svg가 추가됩니다.
 *
 * @param {string} name - 아이콘의 이름 (파일명)
 */

interface IconProps {
  name: string;
  onClick?: () => void;
}

const Icon = ({ name, onClick }: IconProps) => {
  const iconPath = name.endsWith(".svg")
    ? `/icons/${name}`
    : `/icons/${name}.svg`;

  return (
    <div className="flex items-center justify-center w-6 h-6">
      <img
        className="w-auto h-auto rounded-full"
        src={iconPath}
        alt={`${name} icon`}
        onClick={onClick}
      />
    </div>
  );
};

export default Icon;

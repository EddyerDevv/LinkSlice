import { CheckIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CheckboxProps {
  initialState: boolean;
  onChange?: (newValue: boolean) => void;
  sizeContainer?: string;
  borderRadiusContent?: string;
}

function Checkbox({
  initialState,
  onChange,
  sizeContainer,
  borderRadiusContent,
}: CheckboxProps) {
  const [isChecked, setIsChecked] = useState(initialState);
  const checkboxRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onChange) onChange(newValue);
  };

  useEffect(() => {
    const checkbox = checkboxRef.current;
    if (!checkbox) return;

    const handleTransitionEnd = () => {};

    checkbox.addEventListener("transitionend", handleTransitionEnd);

    return () => {
      checkbox.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [isChecked]);

  return (
    <div
      ref={checkboxRef}
      className={`${
        sizeContainer ? sizeContainer : "w-5 h-5"
      } flex items-center justify-center cursor-pointer relative overflow-hidden`}
      onClick={handleClick}
    >
      <div
        className={`w-full h-full border-[1px] border-rose-300 ${
          borderRadiusContent ? borderRadiusContent : "rounded-md"
        } flex flex-col items-center justify-center transition-colors ease-in-out duration-[0.2s] ${
          isChecked ? "bg-rose-300" : ""
        } p-[1px]`}
      >
        <CheckIcon
          strokeWidth={2.5}
          absoluteStrokeWidth
          className={`w-full h-full text-black ${
            isChecked ? "opacity-100 scale-100" : "opacity-0 scale-0"
          } transition-[transform,opacity]  duration-[0.2s] ease-in-out mt-[1px]`}
        />
      </div>
    </div>
  );
}

export default Checkbox;

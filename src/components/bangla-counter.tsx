import { useEffect, useRef, useState } from "react";

type BanglaCountUpProps = {
  end: number;
  duration?: number; // ms
};

function toBanglaNumber(num: number): string {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((d) => (/\d/.test(d) ? banglaDigits[parseInt(d, 10)] : d))
    .join("");
}

export default function BanglaCountUp({
  end,
  duration = 1500,
}: BanglaCountUpProps) {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    function animate(timestamp: number) {
      if (!startTime.current) startTime.current = timestamp;
      const progress = timestamp - startTime.current;

      const percent = Math.min(progress / duration, 1);
      const current = Math.floor(percent * end);

      setValue(current);

      if (percent < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{toBanglaNumber(value)}</span>;
}

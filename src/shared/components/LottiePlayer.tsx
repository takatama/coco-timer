import Lottie from "lottie-react";
import { useEffect, useState } from "react";

interface Props {
  animationKeys: string[];
  onComplete?: () => void;
}

const lottieAssetPaths: Record<string, string> = {
  switch_open: "/assets/lottie/switch_open.json",
  switch_close: "/assets/lottie/switch_close.json",
  pour: "/assets/lottie/pour.json",
  cool: "/assets/lottie/cool.json",
};

export function buildLottieQueue(actionType: string): string[] {
  if (actionType === "switch_close_pour") return ["switch_close", "pour"];
  if (actionType === "switch_open_pour") return ["switch_open", "pour"];
  if (actionType === "pour_cool") return ["pour", "cool"];
  if (actionType === "switch_close") return ["switch_close"];
  if (actionType === "switch_open") return ["switch_open"];
  if (actionType === "pour") return ["pour"];
  return [];
}

export function LottiePlayer({ animationKeys, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [animationKeys]);

  useEffect(() => {
    const key = animationKeys[currentIndex];
    if (!key) return;
    const path = lottieAssetPaths[key];
    if (!path) return;

    fetch(path)
      .then((res) => res.json())
      .then((data: object) => setAnimationData(data))
      .catch(() => {});
  }, [currentIndex, animationKeys]);

  const handleComplete = () => {
    if (currentIndex < animationKeys.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete?.();
    }
  };

  if (!animationData) return <div className="lottie" />;

  return (
    <div className="lottie">
      <Lottie
        animationData={animationData}
        loop={false}
        onComplete={handleComplete}
        style={{ width: 120, height: 120 }}
      />
    </div>
  );
}

import React from "react";
import { Button } from "@nextui-org/react";
import confetti from "canvas-confetti";

const CustomButton = () => {
  const handleConfetti = () => {
    confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 70,
      origin: { x: 0.75, y: 0.8 },
    });
  };
  return (
    <Button
      auto
      rounded
      ripple={false}
      size="xl"
      onClick={handleConfetti}
      css={{
        background: "#ee9b00",
        fontWeight: "$semibold",
        boxShadow: "$md",
        position: "relative",
        overflow: "visible",
        color: "#f1faee",
        px: "$18",
        "&:after": {
          content: '""',
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "#e63946",
          opacity: 1,
          borderRadius: "$pill",
          transition: "all 0.4s ease",
        },
        "&:hover": {
          transform: "translateY(-5px)",
          "&:after": {
            transform: "scaleX(1.5) scaleY(1.6)",
            opacity: 0,
          },
        },
        "&:active": {
          transform: "translateY(-2px)",
        },
      }}
    >
      Hemen Başlayın
    </Button>
  );
};

export default CustomButton;

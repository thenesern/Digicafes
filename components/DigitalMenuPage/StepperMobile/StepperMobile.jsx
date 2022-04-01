import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const steps = [
  {
    label: "Sizin İçin En Uygun Dijital Menü Paketini Seçin",
    description: `İhtiyacınıza özgü Dijital Menü paketleri sunuyoruz. Paketler, farklı sorunlar üzerine farklı çözümler sunuyor. İhtiyacınıza en uygun olanı seçin.  `,
  },
  {
    label: "Yönetim Paneliniz Üzerinden Menünüzü Düzenleyin",
    description:
      "Seçtiğiniz Pakete özel bir Yönetim Paneli Hemen Profil kısmınızda aktif edilecek. Yönetim Paneli üzerinden, ürün ekleyip çıkarabilir, Dijital Menünüzü kolayca düzenleyebilirsiniz.",
  },
  {
    label: "Dijital Menünüz Kullanıma Hazır",
    description: `Dijital Menü Yönetim Paneli üzerinden girmiş olduğunuz İş Yeri adınıza özel bir alt alan adı ve o alan adına bağlı QR Kodu otomatik olarak oluşturulur. Tebrikler, artık Dijital Menünüz Hazır!`,
  },
];

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper
        activeStep={activeStep}
        style={{ padding: "4rem 0" }}
        orientation="vertical"
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? "Bitir" : "Devam"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Geri
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

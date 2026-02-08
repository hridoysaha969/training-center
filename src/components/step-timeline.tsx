import { CheckCircle2, Circle } from "lucide-react";

type Step = {
  id: number;
  title: string;
  note: string;
};

export default function StepTimeline({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: Step[];
}) {
  return (
    <>
      {/* Desktop Horizontal */}
      <div className="hidden md:flex items-center justify-between z-10">
        {steps.map((step, i) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;

          return (
            <div
              key={step.id}
              className="flex-1 relative flex flex-col items-center"
            >
              {/* Connector Line (to next) */}
              {i < steps.length - 1 && (
                <div className="absolute top-3 left-1/2 w-full h-1 z-0">
                  <div className="h-1 bg-gray-300 rounded" />
                  <div
                    className={`h-1 bg-green-600 rounded absolute top-0 left-0 transition-all duration-500`}
                    style={{
                      width: currentStep > step.id ? "100%" : "0%",
                    }}
                  />
                </div>
              )}

              {/* Circle */}
              <div className="z-10 bg-background rounded-full">
                {done ? (
                  <CheckCircle2 className="text-green-600 w-7 h-7" />
                ) : (
                  <Circle
                    className={`w-7 h-7 transition-colors duration-300 ${
                      active ? "text-green-600" : "text-gray-400"
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <span className="text-sm mt-2 font-medium text-center">
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical */}
      <div className="md:hidden relative">
        {/* Vertical line (center axis) */}
        <div className="absolute left-2.5 top-0 bottom-4 w-1 bg-gray-300 rounded" />

        {/* Green progress fill */}
        <div
          className="absolute left-2.5 top-0 w-1 bg-green-600 rounded transition-all duration-500"
          style={{
            height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        <div className="space-y-8">
          {steps.map((step) => {
            const done = currentStep > step.id;
            const active = currentStep === step.id;

            return (
              <div key={step.id} className="relative pl-12">
                {/* Circle centered on line */}
                <div className="absolute left-3 -translate-x-1/2 bg-background rounded-full">
                  {done ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle
                      className={`w-6 h-6 ${
                        active ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                  )}
                </div>

                {/* Text */}
                <div>
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {step.note}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

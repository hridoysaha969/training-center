"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type CaptureState = {
  type: "student" | "invoice" | null;
  file: File | null;
  previewUrl: string | null;
};

type CaptureCtx = CaptureState & {
  setCapture: (next: CaptureState) => void;
  clear: () => void;
};

const Ctx = createContext<CaptureCtx | null>(null);

export function CaptureProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CaptureState>({
    type: null,
    file: null,
    previewUrl: null,
  });

  const value = useMemo<CaptureCtx>(
    () => ({
      ...state,
      setCapture: (next) => setState(next),
      clear: () => {
        if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);
        setState({ type: null, file: null, previewUrl: null });
      },
    }),
    [state],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCapture() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCapture must be used inside <CaptureProvider />");
  return v;
}

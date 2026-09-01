import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchCertifications } from "./api";
import { getSelectedCertification, setSelectedCertification } from "./storage";
import type { Certification } from "../types";

interface CertificationContextValue {
  certifications: Certification[];
  certId: string;
  certification: Certification | undefined;
  setCertId: (certId: string) => void;
  loading: boolean;
}

const CertificationContext = createContext<CertificationContextValue | null>(null);

export function CertificationProvider({ children }: { children: ReactNode }) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [certId, setCertIdState] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertifications()
      .then((certs) => {
        setCertifications(certs);
        const saved = getSelectedCertification();
        const initial = saved && certs.some((c) => c.id === saved) ? saved : certs[0]?.id ?? "";
        setCertIdState(initial);
      })
      .finally(() => setLoading(false));
  }, []);

  function setCertId(id: string) {
    setCertIdState(id);
    setSelectedCertification(id);
  }

  return (
    <CertificationContext.Provider
      value={{
        certifications,
        certId,
        certification: certifications.find((c) => c.id === certId),
        setCertId,
        loading,
      }}
    >
      {children}
    </CertificationContext.Provider>
  );
}

export function useCertification(): CertificationContextValue {
  const ctx = useContext(CertificationContext);
  if (!ctx) throw new Error("useCertification must be used within a CertificationProvider");
  return ctx;
}

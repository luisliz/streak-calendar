import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { useState } from "react";

import { api } from "@server/convex/_generated/api";

export function useImportExport() {
  const { toast } = useToast();
  const [showImportExportDialog, setShowImportExportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const exportData = useQuery(api.calendars.exportData);
  const importData = useMutation(api.calendars.importData);

  const handleExportConfirm = () => {
    setShowExportDialog(false);
    if (!exportData) return;

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `streak-calendar-export-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setShowImportDialog(true);
    }
    e.target.value = "";
  };

  const handleImportConfirm = async () => {
    if (!importFile) return;

    try {
      const text = await importFile.text();
      const data = JSON.parse(text);
      await importData({ data });
      toast({
        title: "Import successful",
        description: "Your data has been imported",
      });
    } catch {
      toast({
        title: "Import failed",
        description: "Invalid file format",
        variant: "destructive",
      });
    }
    setImportFile(null);
    setShowImportDialog(false);
  };

  return {
    showImportExportDialog,
    setShowImportExportDialog,
    showExportDialog,
    setShowExportDialog,
    showImportDialog,
    setShowImportDialog,
    importFile,
    setImportFile,
    handleExportConfirm,
    handleImportSelect,
    handleImportConfirm,
  };
}

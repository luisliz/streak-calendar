import { useToast } from "@/hooks/use-toast";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { useState } from "react";

import { api } from "@server/convex/_generated/api";

/**
 * Custom hook for handling calendar data import/export functionality.
 * Manages dialog states and provides methods for importing/exporting JSON data.
 */

export function useImportExport() {
  const { isAuthenticated } = useConvexAuth();
  const { toast } = useToast();
  // Dialog visibility states
  const [showImportExportDialog, setShowImportExportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  // Currently selected file for import
  const [importFile, setImportFile] = useState<File | null>(null);

  // Fetch user's calendar data for export
  const exportData = useQuery(api.calendars.exportData, isAuthenticated ? undefined : "skip");
  // Mutation for importing calendar data
  const importData = useMutation(api.calendars.importData);

  /**
   * Handles the export confirmation action.
   * Creates and downloads a JSON file containing the user's calendar data
   * with a timestamp in the filename.
   */
  const handleExportConfirm = () => {
    setShowExportDialog(false);
    if (!exportData) {
      toast({
        title: "Export failed",
        description: "No data to export",
        variant: "destructive",
      });
      return;
    }

    try {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `streak-calendar-export-${format(new Date(), "yyyy-MM-dd")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("[handleExportConfirm] Error:", error);
      toast({
        title: "Export failed",
        description: "Failed to create export file",
        variant: "destructive",
      });
    }
  };

  /**
   * Handles file selection for import.
   * Updates the importFile state and shows the import confirmation dialog.
   */
  const handleImportSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setShowImportDialog(true);
    }
    e.target.value = "";
  };

  /**
   * Processes the selected file for import.
   * Validates JSON format and imports data using the API.
   * Shows success/error toast notifications based on the result.
   */
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
    // Dialog visibility controls
    showImportExportDialog,
    setShowImportExportDialog,
    showExportDialog,
    setShowExportDialog,
    showImportDialog,
    setShowImportDialog,
    // Import file state
    importFile,
    setImportFile,
    // Handler functions
    handleExportConfirm,
    handleImportSelect,
    handleImportConfirm,
  };
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useImportExport } from "@/hooks/use-import-export";
import { ArrowUpDown, Download, Upload } from "lucide-react";

/**
 * ImportExport Component
 * Provides UI and functionality for importing and exporting calendar data
 * Uses a multi-dialog approach:
 * 1. Main dialog for choosing between import/export
 * 2. Confirmation dialogs for both import and export actions
 */

export function ImportExport() {
  // Custom hook managing all import/export state and handlers
  const {
    handleExportConfirm, // Handles the actual export operation
    handleImportConfirm, // Handles the actual import operation
    handleImportSelect, // Handles file selection for import
    setImportFile, // Sets the file to be imported
    setShowExportDialog, // Controls export confirmation dialog
    setShowImportDialog, // Controls import confirmation dialog
    setShowImportExportDialog, // Controls main dialog visibility
    showExportDialog,
    showImportDialog,
    showImportExportDialog,
  } = useImportExport();

  return (
    <>
      {/* Main Dialog: Initial import/export selection screen */}
      <Dialog open={showImportExportDialog} onOpenChange={setShowImportExportDialog}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Import/Export
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import/Export</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              {/* Export button - Opens export confirmation dialog */}
              <Button onClick={() => setShowExportDialog(true)}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              {/* Import button - Hidden file input with custom styled label */}
              <Button asChild>
                <label className="cursor-pointer flex items-center justify-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                  <input type="file" accept=".json" className="hidden" onChange={handleImportSelect} />
                </label>
              </Button>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowImportExportDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Confirmation Dialog */}
      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Export</AlertDialogTitle>
            <AlertDialogDescription>
              This will export all your calendars, habits, and completion history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExportConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import Confirmation Dialog - Shown after file selection */}
      <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import</AlertDialogTitle>
            <AlertDialogDescription>
              This will import calendars, habits, and completion history from the selected file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setImportFile(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleImportConfirm}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

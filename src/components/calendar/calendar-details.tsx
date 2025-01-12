"use client";

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
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { useMutation, useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { api } from "@server/convex/_generated/api";
import { Id } from "@server/convex/_generated/dataModel";

const COLOR_VALUES = [
  { key: "red", value: "bg-red-500" },
  { key: "orange", value: "bg-orange-500" },
  { key: "amber", value: "bg-amber-500" },
  { key: "yellow", value: "bg-yellow-500" },
  { key: "lime", value: "bg-lime-500" },
  { key: "green", value: "bg-green-500" },
  { key: "emerald", value: "bg-emerald-500" },
  { key: "teal", value: "bg-teal-500" },
  { key: "cyan", value: "bg-cyan-500" },
  { key: "sky", value: "bg-sky-500" },
  { key: "blue", value: "bg-blue-500" },
  { key: "indigo", value: "bg-indigo-500" },
  { key: "violet", value: "bg-violet-500" },
  { key: "purple", value: "bg-purple-500" },
  { key: "fuchsia", value: "bg-fuchsia-500" },
  { key: "pink", value: "bg-pink-500" },
  { key: "rose", value: "bg-rose-500" },
];

interface CalendarDetailsProps {
  calendarId: Id<"calendars">;
}

export function CalendarDetails({ calendarId }: CalendarDetailsProps) {
  const t = useTranslations("dialogs");
  const tToast = useTranslations("toast");
  const tColors = useTranslations("dialogs.colors");
  const router = useRouter();
  const { toast } = useToast();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Fetch calendar and associated data
  const calendars = useQuery(api.calendars.list);
  const calendar = calendars?.find((c) => c._id === calendarId);
  const habits = useQuery(api.habits.list, { calendarId });

  // State for form fields
  const [name, setName] = useState(calendar?.name ?? "");
  const [colorTheme, setColorTheme] = useState(calendar?.colorTheme ?? "bg-red-500");
  const [position, setPosition] = useState<number>(calendar?.position ?? 1);

  // Mutations
  const updateCalendar = useMutation(api.calendars.update);
  const deleteCalendar = useMutation(api.calendars.remove);

  if (!calendar) return null;

  const colors = COLOR_VALUES.map(({ key, value }) => ({
    name: tColors(key),
    value,
  }));

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      await updateCalendar({
        id: calendarId,
        name,
        colorTheme,
        position,
      });
      toast({ description: tToast("calendar.updated") });
      router.push("/calendar");
    } catch (error) {
      toast({
        description: `Failed to update calendar: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      setShowDeleteAlert(false);
      router.replace("/calendar");
      await new Promise((resolve) => setTimeout(resolve, 0));
      await deleteCalendar({ id: calendarId });
      toast({ description: tToast("calendar.deleted"), variant: "destructive" });
    } catch (error) {
      toast({
        description: `Failed to delete calendar: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Back navigation button */}
      <div className="flex items-center gap-2 p-2">
        <Button variant="ghost" onClick={() => router.push("/calendar")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t("calendar.edit.actions.back")}
        </Button>
      </div>

      {/* Calendar title */}
      <div className="text-center">
        <h1 className="mb-8 text-2xl font-bold">{name}</h1>
      </div>

      {/* Calendar edit form card */}
      <Card className="mx-auto my-8 max-w-xl border p-2 shadow-md">
        <div className="p-4">
          <h2 className="mb-6 text-lg font-semibold">{t("calendar.edit.title")}</h2>
          <div className="space-y-4">
            {/* Calendar name input field */}
            <div>
              <Label htmlFor="edit-calendar-name">{t("calendar.edit.name.label")}</Label>
              <Input id="edit-calendar-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {/* Color theme selection */}
            <div>
              <Label>{t("calendar.edit.color.label")}</Label>
              <Select value={colorTheme} onValueChange={setColorTheme}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("calendar.edit.color.label")}>
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${colorTheme}`} />
                      {colors.find((c) => c.value === colorTheme)?.name}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-40">
                  {colors.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-4 rounded-full ${c.value}`} />
                        {c.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Position selection */}
            <div>
              <Label>{t("calendar.edit.position.label")}</Label>
              <Select value={position.toString()} onValueChange={(value) => setPosition(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder={t("calendar.edit.position.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: calendars?.length ?? 0 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Action buttons */}
            <div className="flex gap-2 pt-4">
              <Button variant="destructive" onClick={() => setShowDeleteAlert(true)}>
                {t("calendar.edit.actions.delete")}
              </Button>
              <Button onClick={handleSave} className="flex-1">
                {t("calendar.edit.actions.save")}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Associated habits list card */}
      <Card className="mx-auto my-8 max-w-xl border p-2 shadow-md">
        <div className="p-4">
          <h2 className="mb-6 text-lg font-semibold">Associated Habits</h2>
          <div className="space-y-2">
            {habits?.map((habit) => (
              <div key={habit._id} className="flex items-center justify-between rounded-lg border p-3">
                <span>{habit.name}</span>
                <Button variant="ghost" size="sm" onClick={() => router.push(`/habits/${habit._id}`)}>
                  View Details
                </Button>
              </div>
            ))}
            {habits?.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">No habits in this calendar yet.</p>
            )}
          </div>
        </div>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("calendar.edit.deleteConfirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("calendar.edit.deleteConfirm.description", { name })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("calendar.edit.deleteConfirm.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("calendar.edit.deleteConfirm.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/i18n/routing";
import { useMutation } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { api } from "@server/convex/_generated/api";
import { Id } from "@server/convex/_generated/dataModel";

const TIMER_VALUES = [
  { key: "1min", value: 1 },
  { key: "2min", value: 2 },
  { key: "5min", value: 5 },
  { key: "10min", value: 10 },
  { key: "15min", value: 15 },
  { key: "30min", value: 30 },
  { key: "45min", value: 45 },
  { key: "1hour", value: 60 },
  { key: "1_5hour", value: 90 },
  { key: "2hour", value: 120 },
];

interface HabitDetailsProps {
  habit: {
    _id: Id<"habits">;
    name: string;
    timerDuration?: number;
  };
  calendar: {
    _id: Id<"calendars">;
    name: string;
    colorTheme: string;
  };
}

export function HabitDetails({ habit }: HabitDetailsProps) {
  const t = useTranslations("dialogs");
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [name, setName] = useState(habit.name);
  const [timerDuration, setTimerDuration] = useState<number | undefined>(habit.timerDuration);

  const updateHabit = useMutation(api.habits.update);
  const deleteHabit = useMutation(api.habits.remove);

  const handleSave = async () => {
    if (!name.trim()) return;
    await updateHabit({
      id: habit._id,
      name,
      timerDuration,
    });
  };

  const handleDelete = async () => {
    await deleteHabit({ id: habit._id });
    router.push("/calendar");
  };

  return (
    <>
      <Card className="mt-8 border p-2 shadow-md">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="back" onClick={() => router.push("/calendar")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("habit.edit.actions.back")}
            </TabsTrigger>
            <TabsTrigger value="details">{t("habit.edit.title")}</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4 p-4">
            <div>
              <Label htmlFor="edit-habit-name">{t("habit.edit.name.label")}</Label>
              <Input id="edit-habit-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>{t("habit.edit.timer.label")}</Label>
              <Select
                value={timerDuration?.toString() ?? "none"}
                onValueChange={(value) => setTimerDuration(value === "none" ? undefined : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("habit.edit.timer.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("habit.edit.timer.noTimer")}</SelectItem>
                  {TIMER_VALUES.map((duration) => (
                    <SelectItem key={duration.value} value={duration.value.toString()}>
                      {t(`timers.${duration.key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="destructive" onClick={() => setShowDeleteAlert(true)}>
                {t("habit.edit.actions.delete")}
              </Button>
              <Button onClick={handleSave} className="flex-1">
                {t("habit.edit.actions.save")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("habit.edit.deleteConfirm.title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("habit.edit.deleteConfirm.description", { name })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("habit.edit.deleteConfirm.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("habit.edit.deleteConfirm.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

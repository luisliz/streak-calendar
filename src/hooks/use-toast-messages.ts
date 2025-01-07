import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

export function useToastMessages() {
  const { toast } = useToast();
  const t = useTranslations("toast");

  return {
    calendar: {
      created: () =>
        toast({
          title: t("calendar.created"),
          duration: 2000,
          variant: "default",
        }),
      updated: () =>
        toast({
          title: t("calendar.updated"),
          duration: 2000,
          variant: "default",
        }),
      deleted: () =>
        toast({
          title: t("calendar.deleted"),
          duration: 2000,
          variant: "destructive",
        }),
    },
    habit: {
      created: () =>
        toast({
          title: t("habit.created"),
          duration: 2000,
          variant: "default",
        }),
      updated: () =>
        toast({
          title: t("habit.updated"),
          duration: 2000,
          variant: "default",
        }),
      deleted: () =>
        toast({
          title: t("habit.deleted"),
          duration: 2000,
          variant: "destructive",
        }),
    },
  };
}

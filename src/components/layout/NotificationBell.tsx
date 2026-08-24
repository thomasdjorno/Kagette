"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface NotifItem {
  id: string;
  message: string;
  lien: string;
  lue: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [nonLues, setNonLues] = useState(0);

  const charger = useCallback(async () => {
    const res = await fetch("/api/notifications");
    if (!res.ok) return;
    const data = await res.json();
    setNotifications(data.notifications);
    setNonLues(data.nonLues);
  }, []);

  useEffect(() => {
    charger();
    const interval = setInterval(charger, 30000);
    return () => clearInterval(interval);
  }, [charger]);

  async function ouvrirNotification(n: NotifItem) {
    setOpen(false);
    if (!n.lue) {
      await fetch(`/api/notifications/${n.id}`, { method: "PATCH" });
    }
    router.push(n.lien);
    charger();
  }

  async function toutMarquerLu() {
    await fetch("/api/notifications", { method: "POST" });
    charger();
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) charger();
        }}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-lg text-kagette-prune-700 hover:bg-kagette-prune-700/10"
      >
        🔔
        {nonLues > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-kagette-framboise-500 px-1 text-[10px] font-bold text-white">
            {nonLues > 9 ? "9+" : nonLues}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-2xl border border-kagette-prune-700/10 bg-white shadow-lg">
            <div className="flex items-center justify-between border-b border-kagette-prune-700/10 px-4 py-2">
              <p className="text-sm font-semibold text-kagette-prune-700">Notifications</p>
              {nonLues > 0 && (
                <button
                  type="button"
                  onClick={toutMarquerLu}
                  className="text-xs text-kagette-framboise-600 hover:underline"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-kagette-prune-700/50">
                  Rien pour l&apos;instant
                </p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => ouvrirNotification(n)}
                    className={`block w-full border-b border-kagette-prune-700/5 px-4 py-3 text-left text-sm hover:bg-kagette-feuille-50 ${
                      n.lue ? "text-kagette-prune-700/60" : "font-medium text-kagette-prune-700"
                    }`}
                  >
                    {!n.lue && (
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-kagette-framboise-500" />
                    )}
                    {n.message}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

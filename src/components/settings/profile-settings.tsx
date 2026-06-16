import { User } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface ProfileSettingsProps {
  profile: { name: string; role: string; department: string };
  setProfile: (profile: any) => void;
}

export function ProfileSettings({ profile, setProfile }: ProfileSettingsProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-white p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-950">{t("settings.profile.title")}</h3>
          <p className="text-xs text-gray-500">{t("settings.profile.subtitle")}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">{t("settings.profile.name")}</label>
          <input
            id="name"
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-950 font-medium transition-all focus:bg-white text-sm outline-hidden"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">{t("settings.profile.role")}</label>
          <input
            id="role"
            type="text"
            value={profile.role}
            disabled
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-500 text-sm font-medium outline-hidden"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1.5">{t("settings.profile.department")}</label>
          <input
            id="department"
            type="text"
            value={profile.department}
            disabled
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-500 text-sm font-medium outline-hidden"
          />
        </div>
      </div>
    </div>
  );
}

import { Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white/70 backdrop-blur-xl px-6 shadow-sm sticky top-0 z-10 transition-all">
      <div className="flex flex-1">
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">Panel de Control</h2>
      </div>
      <div className="flex items-center space-x-5">
        <button className="relative rounded-full p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          <Bell className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-semibold shadow-sm cursor-pointer hover:shadow-md hover:scale-105 transition-all ring-1 ring-black/5">
          <User className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
}

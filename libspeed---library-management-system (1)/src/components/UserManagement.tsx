import { User, UserRole } from "../types";
import { Trash2, Shield, User as UserIcon, Mail } from "lucide-react";
import { motion } from "motion/react";

interface UserManagementProps {
  users: User[];
  onDelete: (id: string) => void;
  onUpdateRole: (id: string, role: UserRole) => void;
}

export default function UserManagement({ users, onDelete, onUpdateRole }: UserManagementProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-l-4 border-brand-blue pl-6 mb-8">
        <div>
          <h3 className="font-space font-bold text-3xl uppercase tracking-tighter text-slate-900">Member Management</h3>
          <p className="text-slate-500">Manage library access levels and permissions.</p>
        </div>
      </div>

      <div className="overflow-hidden border border-slate-200 bg-white rounded-2xl shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Member</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Access Role</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <motion.tr 
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                      <UserIcon size={20} className="text-brand-blue" />
                    </div>
                    <div>
                      <div className="font-bold text-lg tracking-tight uppercase text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail size={10} />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {["Student", "Employee", "Admin"].map((r) => (
                      <button
                        key={r}
                        onClick={() => onUpdateRole(user.id, r as UserRole)}
                        className={`px-4 py-1.5 text-[10px] font-bold uppercase border transition-all rounded-lg ${
                          user.role === r 
                            ? "bg-brand-blue border-brand-blue text-white shadow-md shadow-brand-blue/20" 
                            : "border-slate-200 text-slate-400 hover:text-brand-blue hover:border-brand-blue"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onDelete(user.id)}
                    className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

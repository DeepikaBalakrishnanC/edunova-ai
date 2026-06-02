import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import { getStoredUser, ROLE_LABELS } from "../utils/auth";

function normalizeAction(action) {
  if (typeof action === "string") {
    return { label: action, path: null };
  }
  return action;
}

export default function LMSModule({ title, subtitle, cards = [], actions = [], rows = [], tableTitle = "Records" }) {
  const user = getStoredUser();
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const filteredRows = useMemo(() => {
    return rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(query.toLowerCase()));
  }, [query, rows]);

  const visibleRows = filteredRows.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm text-slate-950 mb-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-blue-700 font-semibold">{ROLE_LABELS[user?.role] || "LMS"} Workspace</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">{title}</h1>
            {subtitle && <p className="text-slate-600 mt-3 text-lg max-w-3xl">{subtitle}</p>}
          </div>
          {actions.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {actions.map((item) => {
                const action = normalizeAction(item);
                if (action.path) {
                  return (
                    <Link key={action.label} to={action.path} className="bg-blue-600 hover:bg-blue-700 text-white transition px-5 py-3 rounded-xl font-medium">
                      {action.label}
                    </Link>
                  );
                }
                return (
                  <button key={action.label} type="button" onClick={() => setNotice(action.message || action.label + " completed.")} className="bg-slate-900 hover:bg-slate-800 text-white transition px-5 py-3 rounded-xl font-medium">
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {notice && (
        <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-blue-900">
          {notice}
        </div>
      )}

      {cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {cards.map((card) => (
            <div key={card.label} className="bg-white text-slate-950 border border-slate-200 rounded-3xl p-6 shadow-sm">
              <p className="text-slate-500">{card.label}</p>
              <div className="text-4xl font-bold mt-3 text-blue-700">{card.value}</div>
              <p className="text-sm text-slate-500 mt-3">{card.note}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white text-slate-950 border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold">{tableTitle}</h2>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search records..."
            className="bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 w-full md:w-80"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-4 pr-4">Name</th>
                <th className="py-4 pr-4">Owner</th>
                <th className="py-4 pr-4">Status</th>
                <th className="py-4 pr-4">Progress</th>
                <th className="py-4 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.name + row.owner} className="border-b border-slate-100 last:border-0">
                  <td className="py-4 pr-4 font-semibold">{row.name}</td>
                  <td className="py-4 pr-4 text-slate-600">{row.owner}</td>
                  <td className="py-4 pr-4"><span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 text-sm">{row.status}</span></td>
                  <td className="py-4 pr-4 text-slate-600">{row.progress}</td>
                  <td className="py-4 pr-4"><Link to={row.path || "/courses"} className="text-blue-700 hover:text-blue-900 font-medium">Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRows.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            No records found.
          </div>
        ) : (
          <div className="flex items-center justify-between mt-6 text-sm text-slate-500">
            <span>Showing {visibleRows.length} of {filteredRows.length} records</span>
            <span>Page 1 of 1</span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

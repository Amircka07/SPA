import type { User } from "../types/user";

export function UsersTable({ rows, loading }: { rows: User[]; loading: boolean }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead style={{ background: "#f9fafb" }}>
          <tr>
            <th style={th}>ID</th>
            <th style={th}>Имя</th>
            <th style={th}>Email</th>
            <th style={th}>Страна</th>
            <th style={th}>Регистрация</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} style={{ borderTop: "1px solid #eee" }}>
              <td style={td}>{u.id}</td>
              <td style={td}>{u.name}</td>
              <td style={td}>{u.email}</td>
              <td style={td}>{u.country}</td>
              <td style={td}>{new Date(u.registeredAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {loading && (
            <tr>
              <td colSpan={5} style={{ padding: 16, textAlign: "center" }}>Загрузка…</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", fontWeight: 600, fontSize: 14 };
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 14 };

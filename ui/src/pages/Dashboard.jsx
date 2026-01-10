import React from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, <b>{user.full_name || user.name || user.email}</b></p>
          <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 8 }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </>
      ) : (
        <p>No user found. Please login.</p>
      )}
    </div>
  );
}

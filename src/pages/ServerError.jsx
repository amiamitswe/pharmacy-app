export default function ServerError() {
  const handleRetry = () => {
    // Clear server error flag and auth state to allow retry
    localStorage.removeItem("serverError");
    // Force a page reload to reinitialize auth
    window.location.href = "/";
  };

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>🔧 500 – Server Error</h1>
      <p>We're experiencing technical difficulties. Please try again later.</p>
      <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "center" }}>
        <button 
          onClick={handleRetry}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
        <a href="/" style={{ padding: "10px 20px", textDecoration: "none", color: "#007bff" }}>
          Return Home
        </a>
      </div>
    </div>
  );
}


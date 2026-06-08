function NotFound() {
  return (
    <div 
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#f8fafc",
        color: "#1e293b",
        textAlign: "center",
        gap: "1.5rem"
      }}
    >
      <h1 style={{ fontSize: "4rem", fontWeight: "bold", margin: 0, color: "#64748b" }}>
        404
      </h1>
      
      <h2 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem 0", color: "#1e293b" }}>
        Page Not Found
      </h2>
      
      <p style={{ fontSize: "1.1rem", color: "#64748b", maxWidth: "400px", margin: 0 }}>
        The page you're looking for doesn't exist.
      </p>
      
      <img 
        src="/images/NotFound.png" 
        style={{ 
          width: "90%", 
          maxWidth: "400px", 
          height: "auto",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }} 
        alt="Page Not Found" 
      />
      
      <a 
        href="/" 
        style={{
          padding: "12px 24px",
          backgroundColor: "#3b82f6",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
          fontWeight: "600",
          fontSize: "1rem"
        }}
      >
        Go Home
      </a>
    </div>
  );
}

export default NotFound;

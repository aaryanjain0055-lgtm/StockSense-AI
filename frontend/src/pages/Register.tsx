import {
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  TrendingUp,
  UserRound,
  UserPlus,
} from "lucide-react";

import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";


function getErrorMessage(
  error: unknown,
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const requestError =
      error as {
        response?: {
          data?: {
            detail?: string;
          };
        };
      };

    const detail =
      requestError.response
        ?.data?.detail;

    if (
      typeof detail === "string"
    ) {
      return detail;
    }
  }


  if (error instanceof Error) {
    return error.message;
  }


  return "Unable to create account.";
}


export default function Register() {
  const {
    register,
    authenticated,
    loading,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    fullName,
    setFullName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  if (
    !loading &&
    authenticated
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanName =
      fullName.trim();

    const cleanEmail =
      email.trim().toLowerCase();


    if (
      !cleanName ||
      !cleanEmail ||
      !password
    ) {
      setError(
        "Complete all required fields.",
      );

      return;
    }


    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters.",
      );

      return;
    }


    if (
      password !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match.",
      );

      return;
    }


    try {
      setSubmitting(true);
      setError("");

      await register(
        cleanName,
        cleanEmail,
        password,
      );

      navigate(
        "/dashboard",
        {
          replace: true,
        },
      );
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }


  return (
    <main style={pageStyle}>
      <section style={authCardStyle}>
        <div style={brandStyle}>
          <div style={logoStyle}>
            <TrendingUp
              size={28}
            />
          </div>

          <div>
            <h1 style={brandTitleStyle}>
              StockSense AI
            </h1>

            <p style={brandSubtitleStyle}>
              Intelligent market analysis
            </p>
          </div>
        </div>


        <div style={headerStyle}>
          <h2 style={titleStyle}>
            Create account
          </h2>

          <p style={subtitleStyle}>
            Build portfolios and access
            personalized market analysis.
          </p>
        </div>


        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          style={formStyle}
        >
          <AuthInput
            label="Full name"
            type="text"
            value={fullName}
            placeholder="Your full name"
            autoComplete="name"
            icon={
              <UserRound
                size={18}
              />
            }
            onChange={setFullName}
          />


          <AuthInput
            label="Email address"
            type="email"
            value={email}
            placeholder="you@example.com"
            autoComplete="email"
            icon={
              <Mail size={18} />
            }
            onChange={setEmail}
          />


          <label style={labelStyle}>
            Password

            <div style={inputWrapperStyle}>
              <LockKeyhole
                size={18}
                style={inputIconStyle}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                style={{
                  ...inputStyle,
                  paddingRight: 48,
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current,
                  )
                }
                style={
                  passwordButtonStyle
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </label>


          <AuthInput
            label="Confirm password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={confirmPassword}
            placeholder="Repeat password"
            autoComplete="new-password"
            icon={
              <LockKeyhole
                size={18}
              />
            }
            onChange={
              setConfirmPassword
            }
          />


          <button
            type="submit"
            disabled={submitting}
            style={{
              ...submitButtonStyle,

              opacity:
                submitting
                  ? 0.7
                  : 1,
            }}
          >
            <UserPlus size={18} />

            {submitting
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>


        <p style={footerTextStyle}>
          Already have an account?{" "}

          <Link
            to="/login"
            style={linkStyle}
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}


type AuthInputProps = {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  autoComplete: string;
  icon: React.ReactNode;
  onChange: (
    value: string,
  ) => void;
};


function AuthInput({
  label,
  type,
  value,
  placeholder,
  autoComplete,
  icon,
  onChange,
}: AuthInputProps) {
  return (
    <label style={labelStyle}>
      {label}

      <div style={inputWrapperStyle}>
        <span style={inputIconStyle}>
          {icon}
        </span>

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) =>
            onChange(
              event.target.value,
            )
          }
          style={inputStyle}
        />
      </div>
    </label>
  );
}


const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top, #172554 0%, #0f172a 38%, #020617 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
};


const authCardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 480,
  background:
    "rgba(15, 23, 42, 0.96)",
  border: "1px solid #1e3a5f",
  borderRadius: 20,
  padding: 32,
  boxShadow:
    "0 30px 80px rgba(0, 0, 0, 0.45)",
};


const brandStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  marginBottom: 28,
};


const logoStyle: CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: 14,
  background: "#2563eb",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};


const brandTitleStyle: CSSProperties = {
  margin: 0,
  color: "white",
  fontSize: 21,
};


const brandSubtitleStyle: CSSProperties = {
  margin: "4px 0 0",
  color: "#64748b",
  fontSize: 13,
};


const headerStyle: CSSProperties = {
  marginBottom: 22,
};


const titleStyle: CSSProperties = {
  margin: 0,
  color: "white",
  fontSize: 28,
};


const subtitleStyle: CSSProperties = {
  margin: "9px 0 0",
  color: "#94a3b8",
  lineHeight: 1.6,
};


const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};


const labelStyle: CSSProperties = {
  color: "#cbd5e1",
  fontSize: 14,
  fontWeight: 600,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};


const inputWrapperStyle: CSSProperties = {
  position: "relative",
};


const inputIconStyle: CSSProperties = {
  position: "absolute",
  left: 14,
  top: 14,
  color: "#64748b",
  display: "flex",
};


const inputStyle: CSSProperties = {
  width: "100%",
  minHeight: 48,
  boxSizing: "border-box",
  padding: "12px 14px 12px 44px",
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#020617",
  color: "white",
  outline: "none",
  fontSize: 14,
};


const passwordButtonStyle: CSSProperties = {
  position: "absolute",
  right: 8,
  top: 7,
  width: 36,
  height: 36,
  border: "none",
  background: "transparent",
  color: "#94a3b8",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};


const submitButtonStyle: CSSProperties = {
  minHeight: 48,
  border: "none",
  borderRadius: 10,
  background: "#2563eb",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 9,
  marginTop: 4,
};


const errorStyle: CSSProperties = {
  padding: 13,
  marginBottom: 18,
  borderRadius: 9,
  background: "#450a0a",
  border: "1px solid #7f1d1d",
  color: "#fecaca",
  fontSize: 14,
};


const footerTextStyle: CSSProperties = {
  margin: "22px 0 0",
  textAlign: "center",
  color: "#94a3b8",
  fontSize: 14,
};


const linkStyle: CSSProperties = {
  color: "#60a5fa",
  fontWeight: 700,
  textDecoration: "none",
};
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import {
  Bell,
  ChevronDown,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import StockSearch from "../common/StockSearch";

import {
  useAuth,
} from "../../context/AuthContext";


export default function Navbar() {
  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const [
    accountMenuOpen,
    setAccountMenuOpen,
  ] = useState(false);

  const accountMenuRef =
    useRef<HTMLDivElement | null>(
      null,
    );


  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent,
    ) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setAccountMenuOpen(false);
      }
    }


    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );


    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);


  function handleStockSelect(
    symbol: string,
  ) {
    const normalizedSymbol =
      symbol.trim().toUpperCase();

    if (!normalizedSymbol) {
      return;
    }


    window.dispatchEvent(
      new CustomEvent(
        "stock-symbol-selected",
        {
          detail: {
            symbol:
              normalizedSymbol,
          },
        },
      ),
    );
  }


  function handleLogout() {
    setAccountMenuOpen(false);

    logout();

    navigate(
      "/login",
      {
        replace: true,
      },
    );
  }


  const userInitial =
    user?.email
      ?.charAt(0)
      .toUpperCase() || "U";


  return (
    <header style={headerStyle}>
      <div style={searchContainerStyle}>
        <StockSearch
          onSelect={
            handleStockSelect
          }
        />
      </div>


      <div style={actionsStyle}>
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          style={iconButtonStyle}
        >
          <Bell size={20} />
        </button>


        <div
          ref={accountMenuRef}
          style={{
            position: "relative",
          }}
        >
          <button
            type="button"
            aria-label="Open account menu"
            aria-expanded={
              accountMenuOpen
            }
            onClick={() =>
              setAccountMenuOpen(
                (current) =>
                  !current,
              )
            }
            style={
              accountButtonStyle
            }
          >
            <div style={avatarStyle}>
              {userInitial}
            </div>


            <div style={identityStyle}>
              <strong
                style={
                  emailStyle
                }
              >
                {user?.email ||
                  "User"}
              </strong>

              <span
                style={
                  roleStyle
                }
              >
                {user?.role ||
                  "user"}
              </span>
            </div>


            <ChevronDown
              size={17}
              style={{
                color: "#94a3b8",

                transform:
                  accountMenuOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",

                transition:
                  "transform 160ms ease",
              }}
            />
          </button>


          {accountMenuOpen && (
            <div
              style={
                dropdownStyle
              }
            >
              <div
                style={
                  dropdownHeaderStyle
                }
              >
                <div
                  style={
                    dropdownAvatarStyle
                  }
                >
                  {userInitial}
                </div>

                <div
                  style={{
                    minWidth: 0,
                  }}
                >
                  <div
                    style={
                      dropdownEmailStyle
                    }
                  >
                    {user?.email ||
                      "User"}
                  </div>

                  <div
                    style={
                      dropdownRoleStyle
                    }
                  >
                    <ShieldCheck
                      size={14}
                    />

                    {user?.role ||
                      "user"}
                  </div>
                </div>
              </div>


              <div
                style={
                  dividerStyle
                }
              />


              <button
                type="button"
                onClick={() => {
                  setAccountMenuOpen(
                    false,
                  );
                }}
                style={
                  menuItemStyle
                }
              >
                <UserRound
                  size={17}
                />

                Account
              </button>


              <button
                type="button"
                onClick={
                  handleLogout
                }
                style={
                  logoutButtonStyle
                }
              >
                <LogOut
                  size={17}
                />

                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


const headerStyle: CSSProperties = {
  height: 72,

  display: "flex",

  alignItems: "center",

  justifyContent:
    "space-between",

  gap: 24,

  padding: "0 28px",

  background: "#0f172a",

  borderBottom:
    "1px solid #1e293b",

  position: "sticky",

  top: 0,

  zIndex: 100,
};


const searchContainerStyle:
CSSProperties = {
  flex: 1,

  maxWidth: 620,

  minWidth: 0,
};


const actionsStyle: CSSProperties = {
  display: "flex",

  alignItems: "center",

  gap: 12,

  flexShrink: 0,
};


const iconButtonStyle:
CSSProperties = {
  width: 42,

  height: 42,

  display: "grid",

  placeItems: "center",

  background: "#111827",

  border:
    "1px solid #1e293b",

  borderRadius: 10,

  color: "#94a3b8",

  cursor: "pointer",
};


const accountButtonStyle:
CSSProperties = {
  minHeight: 48,

  display: "flex",

  alignItems: "center",

  gap: 10,

  padding: "4px 10px 4px 5px",

  background: "#111827",

  border:
    "1px solid #1e293b",

  borderRadius: 12,

  cursor: "pointer",

  color: "white",
};


const avatarStyle: CSSProperties = {
  width: 38,

  height: 38,

  display: "grid",

  placeItems: "center",

  borderRadius: "50%",

  background:
    "linear-gradient(135deg, #2563eb, #7c3aed)",

  color: "white",

  fontWeight: 800,

  fontSize: 15,
};


const identityStyle:
CSSProperties = {
  display: "flex",

  flexDirection: "column",

  alignItems: "flex-start",

  maxWidth: 190,

  minWidth: 0,
};


const emailStyle: CSSProperties = {
  color: "#f8fafc",

  fontSize: 13,

  maxWidth: "100%",

  overflow: "hidden",

  textOverflow: "ellipsis",

  whiteSpace: "nowrap",
};


const roleStyle: CSSProperties = {
  color: "#64748b",

  fontSize: 11,

  textTransform: "capitalize",

  marginTop: 2,
};


const dropdownStyle:
CSSProperties = {
  position: "absolute",

  top: 58,

  right: 0,

  width: 280,

  padding: 10,

  background: "#111827",

  border:
    "1px solid #334155",

  borderRadius: 14,

  boxShadow:
    "0 24px 60px rgba(0, 0, 0, 0.45)",

  zIndex: 500,
};


const dropdownHeaderStyle:
CSSProperties = {
  display: "flex",

  alignItems: "center",

  gap: 12,

  padding: 10,
};


const dropdownAvatarStyle:
CSSProperties = {
  ...avatarStyle,

  width: 42,

  height: 42,

  flexShrink: 0,
};


const dropdownEmailStyle:
CSSProperties = {
  color: "white",

  fontSize: 13,

  fontWeight: 700,

  overflow: "hidden",

  textOverflow: "ellipsis",

  whiteSpace: "nowrap",
};


const dropdownRoleStyle:
CSSProperties = {
  display: "flex",

  alignItems: "center",

  gap: 5,

  color: "#60a5fa",

  fontSize: 12,

  textTransform: "capitalize",

  marginTop: 5,
};


const dividerStyle:
CSSProperties = {
  height: 1,

  background: "#1e293b",

  margin: "5px 0",
};


const menuItemStyle:
CSSProperties = {
  width: "100%",

  minHeight: 42,

  padding: "0 12px",

  border: "none",

  borderRadius: 8,

  background: "transparent",

  color: "#cbd5e1",

  cursor: "pointer",

  display: "flex",

  alignItems: "center",

  gap: 10,

  textAlign: "left",
};


const logoutButtonStyle:
CSSProperties = {
  ...menuItemStyle,

  color: "#fca5a5",
};
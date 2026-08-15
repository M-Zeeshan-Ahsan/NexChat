import React, { useMemo } from "react";
import "./avatar.scss";

const Avatar = ({
  src,
  name,
  alt = "User",
  className = "",
  size = 48,
  style: customStyle,
  onClick,
}) => {
  const initials = useMemo(() => {
    if (!name?.trim()) return "??";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, [name]);

  const hasValidImage =
    src &&
    typeof src === "string" &&
    src.trim() !== "" &&
    !src.includes("null") &&
    !src.includes("undefined") &&
    !src.includes("Unknown_person.jpg");

  const avatarStyle = {
    ...customStyle,
    width: size,
    height: size,
    fontSize: typeof size === "number" ? `${size * 0.4}px` : undefined,
  };

  return (
    <div
      className={`common-avatar ${className}`}
      style={avatarStyle}
      onClick={onClick}
      title={name || alt}
    >
      {hasValidImage ? (
        <img
          src={src}
          alt={alt || name || "User"}
          className="avatar-img"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="avatar-initials">{initials}</div>
      )}
    </div>
  );
};

export default Avatar;

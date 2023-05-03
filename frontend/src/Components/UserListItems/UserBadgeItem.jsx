import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div
      style={{
        background: "#3f2b96",
        width: "max-content",
        color: "white",
        padding: "1px 5px",
        borderRadius: "3px",
        display: "flex",
        gap: "5px",
      }}>
      {user.name}
      <span
        style={{ transform: "translateY(-5%)", cursor: "pointer" }}
        onClick={handleFunction}>
        x
      </span>
    </div>
  );
};

export default UserBadgeItem;

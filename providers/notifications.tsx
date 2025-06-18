import React from "react";

import { ToastContainer } from "react-toastify";

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <ToastContainer />
    </div>
  );
};

export default NotificationProvider;

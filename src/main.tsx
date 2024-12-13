import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserContextProvider } from "./context/UserContext.tsx";
import { SocketProvider } from "./context/SocketContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <UserContextProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </UserContextProvider>
    </SocketProvider>
  </StrictMode>
);

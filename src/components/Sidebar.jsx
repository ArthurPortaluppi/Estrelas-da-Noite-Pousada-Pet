import React from "react";
import { 
  LayoutDashboard, 
  PawPrint, 
  Users, 
  DollarSign, 
  Sun, 
  Moon,
  Menu,
  X
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  isOpen, 
  setIsOpen 
}) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pets", label: "Pets/Animais", icon: PawPrint },
    { id: "owners", label: "Donos/Clientes", icon: Users },
    { id: "finance", label: "Financeiro", icon: DollarSign },
  ];

  return (
    <>
      {/* Botão de Menu para Celulares */}
      <button 
        className="mobile-nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Alternar navegação"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Barra Lateral Principal */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div>
          {/* Logo da Pousada */}
          <div className="sidebar-logo" style={{ flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <PawPrint size={26} strokeWidth={2.5} />
              <span style={{ fontSize: "1.2rem" }}>Estrelas da Noite</span>
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)", marginLeft: "34px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pousada Pet 🌟</span>
          </div>

          {/* Menu de Navegação */}
          <nav>
            <ul className="sidebar-menu">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      className={`sidebar-item ${activeTab === item.id ? "active" : ""}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsOpen(false); // Fecha o menu no celular ao clicar
                      }}
                    >
                      <IconComponent size={20} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Rodapé da Sidebar (Alternador de Tema) */}
        <div className="sidebar-footer">
          <div className="theme-toggle-container">
            <span className="theme-toggle-text">
              Tema {theme === "light" ? "Claro" : "Escuro"}
            </span>
            <button 
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title="Alternar tema claro/escuro"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

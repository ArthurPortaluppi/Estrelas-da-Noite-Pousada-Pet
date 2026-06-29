import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./views/DashboardView";
import PetsView from "./views/PetsView";
import OwnersView from "./views/OwnersView";
import FinanceView from "./views/FinanceView";

import { 
  INITIAL_PETS, 
  INITIAL_OWNERS, 
  INITIAL_TRANSACTIONS 
} from "./utils/mockData";

export default function App() {
  // 1. Estado Centralizado da Aplicação
  const [pets, setPets] = useState(() => {
    const saved = localStorage.getItem("petshophub_pets");
    return saved ? JSON.parse(saved) : INITIAL_PETS;
  });

  const [owners, setOwners] = useState(() => {
    const saved = localStorage.getItem("petshophub_owners");
    return saved ? JSON.parse(saved) : INITIAL_OWNERS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("petshophub_transactions");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("petshophub_theme") || "light";
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPetForModal, setSelectedPetForModal] = useState(null);

  // 2. Persistência de Dados
  useEffect(() => {
    localStorage.setItem("petshophub_pets", JSON.stringify(pets));
  }, [pets]);

  useEffect(() => {
    localStorage.setItem("petshophub_owners", JSON.stringify(owners));
  }, [owners]);

  useEffect(() => {
    localStorage.setItem("petshophub_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("petshophub_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // 3. Alternar Tema Claro/Escuro
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  // 4. Métodos para Manipulação de Donos
  const handleAddOwner = (newOwnerData) => {
    const newOwner = {
      ...newOwnerData,
      id: `owner-${Date.now()}`
    };
    setOwners(prev => [...prev, newOwner]);
  };

  const handleDeleteOwner = (ownerId) => {
    setOwners(prev => prev.filter(o => o.id !== ownerId));
  };

  // 5. Métodos para Manipulação de Pets
  const handleAddPet = (newPetData) => {
    const newPet = {
      ...newPetData,
      id: `pet-${Date.now()}`
    };
    setPets(prev => [...prev, newPet]);
  };

  const handleUpdatePet = (updatedPet) => {
    setPets(prev => prev.map(p => (p.id === updatedPet.id ? updatedPet : p)));
  };

  const handleDeletePet = (petId) => {
    setPets(prev => prev.filter(p => p.id !== petId));
    // Também remove registros financeiros associados se desejado, mas financeiro de histórico geralmente é mantido.
  };

  // 6. Métodos para Manipulação Financeira
  const handleAddTransaction = (newTxData) => {
    const newTx = {
      ...newTxData,
      id: `tx-${Date.now()}`
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (txId) => {
    setTransactions(prev => prev.filter(t => t.id !== txId));
  };

  // 7. Método integrado para registrar serviço realizado em pet e gerar faturamento
  const handleAddServiceTransaction = (serviceTxData) => {
    handleAddTransaction(serviceTxData);
  };

  // 8. Navegação Integrada entre Dono -> Prontuário do Pet
  const handleNavigateToPet = (pet) => {
    setActiveTab("pets");
    setSelectedPetForModal(pet);
  };

  return (
    <div className="app-container">
      {/* Menu Lateral de Navegação */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Conteúdo Principal */}
      <main className="main-content">
        {activeTab === "dashboard" && (
          <DashboardView 
            pets={pets} 
            owners={owners} 
            transactions={transactions} 
            onNavigateToTab={setActiveTab}
            onUpdatePet={handleUpdatePet}
            onAddServiceTransaction={handleAddServiceTransaction}
          />
        )}

        {activeTab === "pets" && (
          <PetsView 
            pets={pets} 
            owners={owners} 
            onAddPet={handleAddPet}
            onUpdatePet={handleUpdatePet}
            onDeletePet={handleDeletePet}
            onAddServiceTransaction={handleAddServiceTransaction}
            selectedPetForModal={selectedPetForModal}
            onClearSelectedPetForModal={() => setSelectedPetForModal(null)}
          />
        )}

        {activeTab === "owners" && (
          <OwnersView 
            owners={owners} 
            pets={pets} 
            onAddOwner={handleAddOwner}
            onDeleteOwner={handleDeleteOwner}
            onNavigateToPet={handleNavigateToPet}
          />
        )}

        {activeTab === "finance" && (
          <FinanceView 
            transactions={transactions} 
            pets={pets} 
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}
      </main>
    </div>
  );
}

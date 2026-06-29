import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  HeartPulse, 
  Calendar, 
  FileText, 
  Syringe, 
  Scissors, 
  Weight, 
  Check, 
  X,
  User,
  ShieldAlert
} from "lucide-react";
import confetti from "canvas-confetti";
import "./PetsView.css";
import { formatDate } from "../utils/helpers";

export default function PetsView({ 
  pets, 
  owners, 
  onAddPet, 
  onUpdatePet, 
  onDeletePet,
  onAddServiceTransaction,
  selectedPetForModal,
  onClearSelectedPetForModal
}) {
  // Sincronizar pet selecionado vindo de outra tela (ex: Donos/Clientes)
  React.useEffect(() => {
    if (selectedPetForModal) {
      const currentPet = pets.find(p => p.id === selectedPetForModal.id);
      if (currentPet) {
        setSelectedPet(currentPet);
        setActiveDetailTab("ficha");
      }
      onClearSelectedPetForModal();
    }
  }, [selectedPetForModal, pets]);

  // Estados para filtros
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [vaccineStatusFilter, setVaccineStatusFilter] = useState("All");

  // Estado para modais
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [activeDetailTab, setActiveDetailTab] = useState("ficha"); // ficha, vacinas, servicos

  // Formulário para novo Pet
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("Cão");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petWeight, setPetWeight] = useState("");
  const [petOwnerId, setPetOwnerId] = useState("");
  const [petNotes, setPetNotes] = useState("");
  const [petAuthorizedPickups, setPetAuthorizedPickups] = useState("");

  // Formulário para Nova Vacina (dentro do prontuário)
  const [isAddingVaccine, setIsAddingVaccine] = useState(false);
  const [vacName, setVacName] = useState("");
  const [vacManufacturer, setVacManufacturer] = useState("");
  const [vacAdminDate, setVacAdminDate] = useState("");
  const [vacDueDate, setVacDueDate] = useState("");

  // Formulário para Nova Hospedagem (dentro do prontuário)
  const [isAddingService, setIsAddingService] = useState(false);
  const [checkIn, setCheckIn] = useState("2026-06-23");
  const [checkOut, setCheckOut] = useState("2026-06-25");
  const [pricePerNight, setPricePerNight] = useState("80");
  
  // Extras
  const [hasBanho, setHasBanho] = useState(false);
  const [banhoPrice, setBanhoPrice] = useState("50");
  const [hasTosa, setHasTosa] = useState(false);
  const [tosaPrice, setTosaPrice] = useState("80");
  const [hasTosaHigienica, setHasTosaHigienica] = useState(false);
  const [tosaHigienicaPrice, setTosaHigienicaPrice] = useState("40");
  
  const [srvNotes, setSrvNotes] = useState("");

  // Helper: Obter status consolidado de vacinação do Pet
  const getPetVaccineStatus = (pet) => {
    if (!pet.vaccines || pet.vaccines.length === 0) return "up_to_date";
    if (pet.vaccines.some(v => v.status === "overdue")) return "overdue";
    if (pet.vaccines.some(v => v.status === "pending")) return "pending";
    return "up_to_date";
  };

  // Helper: Obter Nome do Dono
  const getOwnerName = (ownerId) => {
    const owner = owners.find(o => o.id === ownerId);
    return owner ? owner.name : "Não associado";
  };

  // Filtros
  const filteredPets = pets.filter(pet => {
    const ownerName = getOwnerName(pet.ownerId).toLowerCase();
    const matchesSearch = pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed.toLowerCase().includes(search.toLowerCase()) ||
      ownerName.includes(search.toLowerCase());

    const matchesSpecies = speciesFilter === "All" || pet.species === speciesFilter;
    
    const vacStatus = getPetVaccineStatus(pet);
    const matchesVacStatus = vaccineStatusFilter === "All" || vacStatus === vaccineStatusFilter;

    return matchesSearch && matchesSpecies && matchesVacStatus;
  });

  // Salvar Novo Pet
  const handleAddPetSubmit = (e) => {
    e.preventDefault();
    if (!petName || !petOwnerId) {
      alert("Por favor, preencha o nome do pet e selecione o dono.");
      return;
    }

    const newPet = {
      name: petName,
      species: petSpecies,
      breed: petBreed || "SRD",
      age: petAge || "N/A",
      weight: petWeight ? `${petWeight} kg` : "N/A",
      ownerId: petOwnerId,
      notes: petNotes,
      authorizedPickups: petAuthorizedPickups || "Apenas o tutor",
      vaccines: [],
      servicesHistory: []
    };

    onAddPet(newPet);
    setIsAddPetModalOpen(false);

    // Limpar formulário
    setPetName("");
    setPetSpecies("Cão");
    setPetBreed("");
    setPetAge("");
    setPetWeight("");
    setPetOwnerId("");
    setPetNotes("");
    setPetAuthorizedPickups("");
  };

  // Adicionar Vacina no Pet Selecionado
  const handleAddVaccineSubmit = (e) => {
    e.preventDefault();
    if (!vacName || !vacAdminDate || !vacDueDate) {
      alert("Preencha todos os campos da vacina.");
      return;
    }

    // Determinar status da vacina baseado na data de vencimento em relação a hoje (23/06/2026)
    const today = new Date("2026-06-23");
    const dueDate = new Date(vacDueDate);
    let status = "up_to_date";
    
    if (dueDate < today) {
      status = "overdue";
    } else {
      // Se vence em menos de 30 dias
      const diffTime = Math.abs(dueDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 30) {
        status = "pending";
      }
    }

    const newVac = {
      id: `vac-${Date.now()}`,
      name: vacName,
      dateAdministered: vacAdminDate,
      nextDoseDue: vacDueDate,
      status,
      manufacturer: vacManufacturer || "Não especificado"
    };

    const updatedPet = {
      ...selectedPet,
      vaccines: [...(selectedPet.vaccines || []), newVac]
    };

    onUpdatePet(updatedPet);
    setSelectedPet(updatedPet); // Atualiza modal ativo
    setIsAddingVaccine(false);

    // Celebrar!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });

    // Resetar campos
    setVacName("");
    setVacManufacturer("");
    setVacAdminDate("");
    setVacDueDate("");
  };

  // Excluir Vacina
  const handleDeleteVaccine = (vacId) => {
    const updatedPet = {
      ...selectedPet,
      vaccines: selectedPet.vaccines.filter(v => v.id !== vacId)
    };
    onUpdatePet(updatedPet);
    setSelectedPet(updatedPet);
  };

  // Helper de cálculo de diárias e totais
  const calculateNights = (inDate, outDate) => {
    if (!inDate || !outDate) return 0;
    const d1 = new Date(inDate);
    const d2 = new Date(outDate);
    const diff = d2 - d1;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const currentNights = calculateNights(checkIn, checkOut);
  const lodgingTotal = currentNights * parseFloat(pricePerNight || 0);
  const extrasTotal = 
    (hasBanho ? parseFloat(banhoPrice || 0) : 0) +
    (hasTosa ? parseFloat(tosaPrice || 0) : 0) +
    (hasTosaHigienica ? parseFloat(tosaHigienicaPrice || 0) : 0);
  const totalPrice = lodgingTotal + extrasTotal;

  // Registrar Hospedagem no Pet (Integrada com Financeiro)
  const handleAddServiceSubmit = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut || currentNights <= 0) {
      alert("Selecione datas de check-in e check-out válidas (mínimo de 1 diária).");
      return;
    }

    const selectedExtras = [
      hasBanho && { name: "Banho", price: parseFloat(banhoPrice) },
      hasTosa && { name: "Tosa", price: parseFloat(tosaPrice) },
      hasTosaHigienica && { name: "Tosa Higiênica", price: parseFloat(tosaHigienicaPrice) }
    ].filter(Boolean);

    // Novo registro de hospedagem para o pet
    const newLodging = {
      id: `srv-${Date.now()}`,
      type: "Hospedagem",
      checkIn,
      checkOut,
      nights: currentNights,
      pricePerNight: parseFloat(pricePerNight),
      extras: selectedExtras,
      price: totalPrice,
      notes: srvNotes || "Estadia padrão."
    };

    const updatedPet = {
      ...selectedPet,
      servicesHistory: [newLodging, ...(selectedPet.servicesHistory || [])]
    };

    // Salvar pet atualizado
    onUpdatePet(updatedPet);
    setSelectedPet(updatedPet);

    // Descrição detalhada para a transação financeira
    const extrasDesc = selectedExtras.length > 0 
      ? ` + ${selectedExtras.map(e => e.name).join(", ")}` 
      : "";
    
    // Criar lançamento financeiro no estado global
    onAddServiceTransaction({
      petId: selectedPet.id,
      type: "income",
      amount: totalPrice,
      category: "Hospedagem",
      date: checkIn,
      description: `Hospedagem ${selectedPet.name} - ${currentNights} diárias${extrasDesc}`
    });

    setIsAddingService(false);
    
    // Resetar campos extras
    setHasBanho(false);
    setHasTosa(false);
    setHasTosaHigienica(false);
    setSrvNotes("");
    
    // Celebrar!
    confetti({
      particleCount: 50,
      spread: 40,
      colors: ["#7c3aed", "#06b6d4", "#ec4899"],
      origin: { y: 0.7 }
    });

    // Resetar campos
    setCheckIn("2026-06-23");
    setCheckOut("2026-06-25");
    setPricePerNight("80");
  };

  return (
    <div className="fade-in">
      <div className="pets-header-row">
        <div>
          <h1>Pets e Animais 🐕</h1>
          <p>Cadastre pacientes, acompanhe vacinas e registre atendimentos.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddPetModalOpen(true)}>
          <Plus size={18} /> Cadastrar Novo Pet
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Buscar Pet ou Dono</span>
          <div style={{ position: "relative" }}>
            <input 
              type="text" 
              className="form-control filter-input" 
              placeholder="Nome do pet, raça ou dono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "36px", width: "100%" }}
            />
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Espécie</span>
          <select 
            className="form-control filter-input form-select"
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
          >
            <option value="All">Todas espécies</option>
            <option value="Cão">Cão</option>
            <option value="Gato">Gato</option>
            <option value="Ave">Ave</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Status Sanitário</span>
          <select 
            className="form-control filter-input form-select"
            value={vaccineStatusFilter}
            onChange={(e) => setVaccineStatusFilter(e.target.value)}
          >
            <option value="All">Todos</option>
            <option value="up_to_date">Vacinas em Dia</option>
            <option value="pending">Vencendo Logo</option>
            <option value="overdue">Vacinas Atrasadas</option>
          </select>
        </div>
      </div>

      {/* Grid de Cards de Pets */}
      <div className="pets-grid">
        {filteredPets.length === 0 ? (
          <div className="card" style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
            <p>Nenhum pet encontrado.</p>
          </div>
        ) : (
          filteredPets.map(pet => {
            const vacStatus = getPetVaccineStatus(pet);
            return (
              <div 
                key={pet.id} 
                className="card pet-card"
                onClick={() => {
                  setSelectedPet(pet);
                  setActiveDetailTab("ficha");
                }}
              >
                <div>
                  <div className="pet-card-header">
                    <div className="pet-card-avatar">
                      {pet.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>{pet.name}</h3>
                      <span className="badge badge-primary">{pet.species}</span>
                    </div>
                  </div>

                  <div className="pet-info-row">
                    <span>Raça:</span>
                    <span className="pet-info-value">{pet.breed}</span>
                  </div>
                  <div className="pet-info-row">
                    <span>Idade / Peso:</span>
                    <span className="pet-info-value">{pet.age} • {pet.weight}</span>
                  </div>
                  <div className="pet-info-row">
                    <span>Tutor:</span>
                    <span className="pet-info-value" style={{ textDecoration: "underline", color: "var(--primary)" }}>
                      {getOwnerName(pet.ownerId)}
                    </span>
                  </div>
                </div>

                <div style={{ marginTop: "16px", borderTop: "1px solid var(--surface-border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="filter-label" style={{ margin: 0 }}>Vacinação:</span>
                  {vacStatus === "up_to_date" && <span className="badge badge-success">Em Dia</span>}
                  {vacStatus === "pending" && <span className="badge badge-warning">Pendente</span>}
                  {vacStatus === "overdue" && <span className="badge badge-error">Atrasado</span>}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Cadastrar Novo Pet */}
      {isAddPetModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Cadastrar Novo Pet</h2>
              <button className="btn-icon" onClick={() => setIsAddPetModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddPetSubmit}>
              <div className="modal-body">
                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Nome do Pet *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: Bob, Pipoca"
                      value={petName} 
                      onChange={(e) => setPetName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tutor / Dono *</label>
                    <select 
                      className="form-control form-select"
                      value={petOwnerId}
                      onChange={(e) => setPetOwnerId(e.target.value)}
                      required
                    >
                      <option value="">Selecione o Dono...</option>
                      {owners.map(o => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Espécie *</label>
                    <select 
                      className="form-control form-select"
                      value={petSpecies}
                      onChange={(e) => setPetSpecies(e.target.value)}
                    >
                      <option value="Cão">Cão</option>
                      <option value="Gato">Gato</option>
                      <option value="Ave">Ave</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Raça</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: Golden, Persa, SRD"
                      value={petBreed} 
                      onChange={(e) => setPetBreed(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Idade aproximada</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: 2 anos, 5 meses"
                      value={petAge} 
                      onChange={(e) => setPetAge(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Peso (kg)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      className="form-control" 
                      placeholder="Ex: 8.5"
                      value={petWeight} 
                      onChange={(e) => setPetWeight(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notas Clínicas / Alergias / Observações</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    placeholder="Ex: Alérgico a penicilina, bravo ao cortar unhas, etc."
                    value={petNotes}
                    onChange={(e) => setPetNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Pessoas Autorizadas a Retirar</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Beatriz Portaluppi (Irmã), Mariana Silva (Mãe)"
                    value={petAuthorizedPickups} 
                    onChange={(e) => setPetAuthorizedPickups(e.target.value)} 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddPetModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Prontuário Médico e Vacinação do Pet */}
      {selectedPet && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "680px" }}>
            <div className="modal-header">
              <div className="pet-details-header">
                <div className="pet-details-avatar">
                  {selectedPet.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ margin: 0 }}>Prontuário de {selectedPet.name}</h2>
                  <span className="badge badge-primary">{selectedPet.species} • {selectedPet.breed}</span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => {
                setSelectedPet(null);
                setIsAddingVaccine(false);
                setIsAddingService(false);
              }}>
                <X size={20} />
              </button>
            </div>

            {/* Menu de Abas */}
            <div style={{ padding: "0 24px" }}>
              <div className="tabs">
                <button 
                  className={`tab-btn ${activeDetailTab === "ficha" ? "active" : ""}`}
                  onClick={() => setActiveDetailTab("ficha")}
                >
                  <FileText size={16} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                  Ficha Clínica
                </button>
                <button 
                  className={`tab-btn ${activeDetailTab === "vacinas" ? "active" : ""}`}
                  onClick={() => setActiveDetailTab("vacinas")}
                >
                  <Syringe size={16} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                  Carteira de Vacinação
                </button>
                <button 
                  className={`tab-btn ${activeDetailTab === "servicos" ? "active" : ""}`}
                  onClick={() => setActiveDetailTab("servicos")}
                >
                  <Calendar size={16} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                  Hospedagens
                </button>
              </div>
            </div>

            <div className="modal-body" style={{ minHeight: "300px" }}>
              {/* ABA 1: FICHA CLÍNICA */}
              {activeDetailTab === "ficha" && (
                <div className="slide-up">
                  <h3 className="mb-4">Dados de Registro</h3>
                  
                  <div className="grid-cols-2 mb-4">
                    <div className="card" style={{ padding: "16px", backgroundColor: "var(--background)", border: "none" }}>
                      <span className="filter-label">Espécie / Raça</span>
                      <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>{selectedPet.species} ({selectedPet.breed})</p>
                      
                      <span className="filter-label mt-4">Idade / Peso</span>
                      <p style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {selectedPet.age} • <Weight size={14} style={{ verticalAlign: "middle", margin: "0 2px" }} /> {selectedPet.weight}
                      </p>
                    </div>

                    <div className="card" style={{ padding: "16px", backgroundColor: "var(--background)", border: "none" }}>
                      <span className="filter-label">Proprietário</span>
                      <p style={{ fontWeight: 600, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <User size={14} /> {getOwnerName(selectedPet.ownerId)}
                      </p>
                      
                      <span className="filter-label mt-4">Contato do Tutor</span>
                      <p style={{ fontWeight: 500, color: "var(--text-secondary)" }}>
                        {owners.find(o => o.id === selectedPet.ownerId)?.phone || "N/A"}
                      </p>

                      {(() => {
                        const owner = owners.find(o => o.id === selectedPet.ownerId);
                        if (!owner) return null;
                        const hasEmergency = owner.emergencyContactName && owner.emergencyContactName !== "Não informado";
                        const hasVet = owner.preferredVetName && owner.preferredVetName !== "Não informado";
                        if (!hasEmergency && !hasVet) return null;
                        
                        return (
                          <div style={{ borderTop: "1px dashed var(--surface-border)", paddingTop: "8px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                            {hasEmergency && (
                              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                                <ShieldAlert size={12} style={{ color: "var(--error)" }} />
                                <span><strong>Emergência:</strong> {owner.emergencyContactName} {owner.emergencyContactPhone && owner.emergencyContactPhone !== "Não informado" ? `(${owner.emergencyContactPhone})` : ""}</span>
                              </div>
                            )}
                            {hasVet && (
                              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                                <HeartPulse size={12} style={{ color: "var(--success)" }} />
                                <span><strong>Vet:</strong> {owner.preferredVetName} {owner.preferredVetPhone && owner.preferredVetPhone !== "Não informado" ? `(${owner.preferredVetPhone})` : ""}</span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <h3>Alergias e Recomendações</h3>
                  <div className="card mt-2" style={{ borderColor: "var(--warning)" }}>
                    <p style={{ fontStyle: selectedPet.notes ? "normal" : "italic", color: selectedPet.notes ? "var(--text-primary)" : "var(--text-muted)" }}>
                      {selectedPet.notes || "Nenhuma observação cadastrada."}
                    </p>
                  </div>

                  <h3 className="mt-4">Retirada / Pessoas Autorizadas</h3>
                  <div className="card mt-2" style={{ borderColor: "var(--primary)" }}>
                    <p style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                      {selectedPet.authorizedPickups || "Apenas o tutor"}
                    </p>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "32px" }}>
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      onClick={() => {
                        if (confirm(`Tem certeza de que deseja remover o cadastro de ${selectedPet.name}?`)) {
                          onDeletePet(selectedPet.id);
                          setSelectedPet(null);
                        }
                      }}
                    >
                      <Trash2 size={16} /> Excluir Pet
                    </button>
                  </div>
                </div>
              )}

              {/* ABA 2: CARTEIRA DE VACINAÇÃO */}
              {activeDetailTab === "vacinas" && (
                <div className="slide-up">
                  <div className="flex-between">
                    <h3>Registro de Imunização</h3>
                    {!isAddingVaccine && (
                      <button className="btn btn-primary" onClick={() => setIsAddingVaccine(true)} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                        <Plus size={14} /> Registrar Vacina
                      </button>
                    )}
                  </div>

                  {/* Form de Nova Vacina Inline */}
                  {isAddingVaccine && (
                    <form onSubmit={handleAddVaccineSubmit} className="add-inline-form slide-up">
                      <h4 className="mb-4">Adicionar Aplicação</h4>
                      
                      <div className="grid-cols-2">
                        <div className="form-group">
                          <label className="form-label">Nome da Vacina *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Ex: V10, Antirrábica, V5"
                            value={vacName}
                            onChange={(e) => setVacName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Fabricante / Laboratório</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Ex: Zoetis, MSD"
                            value={vacManufacturer}
                            onChange={(e) => setVacManufacturer(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid-cols-2">
                        <div className="form-group">
                          <label className="form-label">Data da Dose *</label>
                          <input 
                            type="date" 
                            className="form-control" 
                            value={vacAdminDate}
                            onChange={(e) => setVacAdminDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Próxima Dose *</label>
                          <input 
                            type="date" 
                            className="form-control" 
                            value={vacDueDate}
                            onChange={(e) => setVacDueDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                        <button type="button" className="btn btn-secondary" style={{ padding: "6px 12px" }} onClick={() => setIsAddingVaccine(false)}>
                          Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ padding: "6px 12px" }}>
                          Salvar Aplicação
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Listagem de Vacinas */}
                  <div className="vaccine-list">
                    {!selectedPet.vaccines || selectedPet.vaccines.length === 0 ? (
                      <p style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)", fontStyle: "italic" }}>
                        Nenhuma vacina aplicada registrada para este pet.
                      </p>
                    ) : (
                      selectedPet.vaccines.map(vac => (
                        <div key={vac.id} className="vaccine-item">
                          <div className="vaccine-main-info">
                            <h4 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <HeartPulse size={16} style={{ color: "var(--primary)" }} />
                              {vac.name} 
                              <span style={{ fontSize: "0.75rem", fontWeight: "normal", color: "var(--text-secondary)" }}>
                                ({vac.manufacturer})
                              </span>
                            </h4>
                            <div className="vaccine-dates">
                              <span>Aplicada: <strong>{formatDate(vac.dateAdministered)}</strong></span>
                              <span style={{ margin: "0 8px" }}>•</span>
                              <span>Vence: <strong>{formatDate(vac.nextDoseDue)}</strong></span>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {vac.status === "up_to_date" && <span className="badge badge-success">Válida</span>}
                            {vac.status === "pending" && <span className="badge badge-warning">Pendente</span>}
                            {vac.status === "overdue" && <span className="badge badge-error">Vencida</span>}

                            <button 
                              type="button" 
                              className="btn-icon" 
                              style={{ color: "var(--error)" }}
                              onClick={() => handleDeleteVaccine(vac.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* ABA 3: HISTÓRICO DE HOSPEDAGENS */}
              {activeDetailTab === "servicos" && (
                <div className="slide-up">
                  <div className="flex-between">
                    <h3>Hospedagens & Estadias 🏨</h3>
                    {!isAddingService && (
                      <button className="btn btn-primary" onClick={() => setIsAddingService(true)} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                        <Plus size={14} /> Registrar Hospedagem
                      </button>
                    )}
                  </div>

                  {/* Form de Nova Hospedagem Inline */}
                  {isAddingService && (
                    <form onSubmit={handleAddServiceSubmit} className="add-inline-form slide-up">
                      <h4 className="mb-3">Agendar Estadia</h4>
                      
                      <div className="grid-cols-2">
                        <div className="form-group">
                          <label className="form-label">Data de Check-in *</label>
                          <input 
                            type="date" 
                            className="form-control" 
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Data de Check-out *</label>
                          <input 
                            type="date" 
                            className="form-control" 
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid-cols-2">
                        <div className="form-group">
                          <label className="form-label">Valor da Diária (R$) *</label>
                          <input 
                            type="number" 
                            step="1" 
                            className="form-control" 
                            value={pricePerNight}
                            onChange={(e) => setPricePerNight(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Quantidade de Diárias</label>
                          <div className="form-control" style={{ backgroundColor: "var(--background)", display: "flex", alignItems: "center", fontWeight: "600" }}>
                            {currentNights} diária(s)
                          </div>
                        </div>
                      </div>

                      {/* Seção de Extras Obrigatórios (Vinculados) */}
                      <div style={{ backgroundColor: "var(--surface)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-md)", padding: "16px", marginBottom: "16px" }}>
                        <span className="form-label" style={{ marginBottom: "12px", fontWeight: "700" }}>Serviços Estéticos Extras (Opcionais da Hospedagem)</span>
                        
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {/* Banho */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.9rem" }}>
                              <input 
                                type="checkbox" 
                                checked={hasBanho}
                                onChange={(e) => setHasBanho(e.target.checked)}
                              />
                              Banho Extra
                            </label>
                            {hasBanho && (
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Preço: R$</span>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  style={{ width: "70px", padding: "4px 8px", fontSize: "0.85rem" }} 
                                  value={banhoPrice}
                                  onChange={(e) => setBanhoPrice(e.target.value)}
                                />
                              </div>
                            )}
                          </div>

                          {/* Tosa */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.9rem" }}>
                              <input 
                                type="checkbox" 
                                checked={hasTosa}
                                onChange={(e) => setHasTosa(e.target.checked)}
                              />
                              Tosa Completa Extra
                            </label>
                            {hasTosa && (
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Preço: R$</span>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  style={{ width: "70px", padding: "4px 8px", fontSize: "0.85rem" }} 
                                  value={tosaPrice}
                                  onChange={(e) => setTosaPrice(e.target.value)}
                                />
                              </div>
                            )}
                          </div>

                          {/* Tosa Higiênica */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.9rem" }}>
                              <input 
                                type="checkbox" 
                                checked={hasTosaHigienica}
                                onChange={(e) => setHasTosaHigienica(e.target.checked)}
                              />
                              Tosa Higiênica Extra
                            </label>
                            {hasTosaHigienica && (
                              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Preço: R$</span>
                                <input 
                                  type="number" 
                                  className="form-control" 
                                  style={{ width: "70px", padding: "4px 8px", fontSize: "0.85rem" }} 
                                  value={tosaHigienicaPrice}
                                  onChange={(e) => setTosaHigienicaPrice(e.target.value)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Resumo e Cálculo do Valor Total */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--primary-light)", padding: "12px 16px", borderRadius: "var(--radius-md)", marginBottom: "16px" }}>
                        <span style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: "600" }}>Resumo da Estadia:</span>
                        <div style={{ textAlign: "right", fontSize: "0.85rem", color: "var(--primary)" }}>
                          <div>Base: {currentNights} diárias * R$ {pricePerNight} = <strong>R$ {lodgingTotal}</strong></div>
                          {extrasTotal > 0 && <div>Extras: <strong>+ R$ {extrasTotal}</strong></div>}
                          <div style={{ fontSize: "1.05rem", fontWeight: "800", marginTop: "4px", borderTop: "1px solid rgba(var(--primary-rgb), 0.2)", paddingTop: "4px" }}>
                            Total: R$ {totalPrice}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Observações (Suíte, Alimentação...)</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Ex: Chalé Luxo, alimentação fornecida pelo tutor"
                          value={srvNotes}
                          onChange={(e) => setSrvNotes(e.target.value)}
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                        <button type="button" className="btn btn-secondary" style={{ padding: "6px 12px" }} onClick={() => setIsAddingService(false)}>
                          Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ padding: "6px 12px" }}>
                          Confirmar Hospedagem
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Listagem de Hospedagens */}
                  <div className="service-history-list">
                    {!selectedPet.servicesHistory || selectedPet.servicesHistory.length === 0 ? (
                      <p style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)", fontStyle: "italic" }}>
                        Nenhuma estadia registrada para este pet.
                      </p>
                    ) : (
                      selectedPet.servicesHistory.map(srv => (
                        <div key={srv.id} className="service-history-item" style={{ flexDirection: "column", alignItems: "stretch", gap: "10px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <h4 style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)", fontWeight: "700" }}>
                                <Calendar size={16} />
                                Hospedagem ({srv.nights} diárias)
                              </h4>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: "500", display: "block", marginTop: "2px" }}>
                                Período: {formatDate(srv.checkIn)} a {formatDate(srv.checkOut)}
                              </span>
                            </div>
                            <div style={{ fontWeight: "800", color: "var(--success)", fontSize: "1.1rem" }}>
                              R$ {srv.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </div>
                          </div>

                          {srv.extras && srv.extras.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", borderTop: "1px dashed var(--surface-border)", paddingTop: "8px" }}>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", display: "flex", alignItems: "center" }}>
                                Extras Vinculados:
                              </span>
                              {srv.extras.map((ex, i) => (
                                <span key={i} className="badge badge-primary" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
                                  {ex.name} (R$ {ex.price})
                                </span>
                              ))}
                            </div>
                          )}

                          {srv.notes && (
                            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", backgroundColor: "var(--background)", padding: "6px 10px", borderRadius: "4px", margin: 0 }}>
                              <strong>Nota:</strong> {srv.notes}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setSelectedPet(null);
                  setIsAddingVaccine(false);
                  setIsAddingService(false);
                }}
              >
                Fechar Prontuário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

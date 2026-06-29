import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Trash2, 
  PawPrint, 
  X,
  ShieldAlert,
  HeartPulse
} from "lucide-react";
import "./OwnersView.css";

export default function OwnersView({ 
  owners, 
  pets, 
  onAddOwner, 
  onDeleteOwner, 
  onNavigateToPet 
}) {
  // Filtros
  const [search, setSearch] = useState("");
  
  // Controle de modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Campos do formulário
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");
  const [preferredVetName, setPreferredVetName] = useState("");
  const [preferredVetPhone, setPreferredVetPhone] = useState("");

  // Filtragem
  const filteredOwners = owners.filter(owner => {
    return owner.name.toLowerCase().includes(search.toLowerCase()) ||
      owner.phone.includes(search) ||
      owner.email.toLowerCase().includes(search.toLowerCase()) ||
      owner.address.toLowerCase().includes(search.toLowerCase()) ||
      (owner.emergencyContactName && owner.emergencyContactName.toLowerCase().includes(search.toLowerCase())) ||
      (owner.emergencyContactPhone && owner.emergencyContactPhone.includes(search)) ||
      (owner.preferredVetName && owner.preferredVetName.toLowerCase().includes(search.toLowerCase()));
  });

  const getOwnerPets = (ownerId) => {
    return pets.filter(p => p.ownerId === ownerId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Nome e Telefone são campos obrigatórios.");
      return;
    }

    onAddOwner({
      name,
      phone,
      email: email || "Não informado",
      address: address || "Não informado",
      emergencyContactName: emergencyContactName || "Não informado",
      emergencyContactPhone: emergencyContactPhone || "Não informado",
      preferredVetName: preferredVetName || "Não informado",
      preferredVetPhone: preferredVetPhone || "Não informado"
    });

    // Limpar campos e fechar modal
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setEmergencyContactName("");
    setEmergencyContactPhone("");
    setPreferredVetName("");
    setPreferredVetPhone("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="fade-in">
      <div className="owners-header-row">
        <div>
          <h1>Donos e Clientes 👥</h1>
          <p>Gerencie informações de contato dos tutores dos pets cadastrados.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> Novo Cliente / Tutor
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Buscar Tutor</span>
          <div style={{ position: "relative" }}>
            <input 
              type="text" 
              className="form-control filter-input" 
              placeholder="Buscar por nome, telefone, email ou endereço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "36px", width: "100%" }}
            />
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          </div>
        </div>
      </div>

      {/* Grid de Proprietários */}
      <div className="owners-grid">
        {filteredOwners.length === 0 ? (
          <div className="card" style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px" }}>
            <p>Nenhum cliente/tutor encontrado.</p>
          </div>
        ) : (
          filteredOwners.map(owner => {
            const ownerPets = getOwnerPets(owner.id);
            return (
              <div key={owner.id} className="card owner-card">
                <div>
                  <div className="flex-between">
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>{owner.name}</h3>
                    <button 
                      className="btn-icon" 
                      style={{ color: "var(--error)" }}
                      title="Excluir tutor"
                      onClick={() => {
                        if (ownerPets.length > 0) {
                          alert(`Não é possível excluir o tutor ${owner.name} porque ele possui pets vinculados (${ownerPets.map(p => p.name).join(", ")}). Remova os pets primeiro.`);
                          return;
                        }
                        if (confirm(`Tem certeza que deseja excluir o tutor ${owner.name}?`)) {
                          onDeleteOwner(owner.id);
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="owner-contact-info">
                    <div className="owner-contact-item">
                      <Phone size={16} style={{ color: "var(--primary)" }} />
                      <span>{owner.phone}</span>
                    </div>
                    <div className="owner-contact-item">
                      <Mail size={16} style={{ color: "var(--primary)" }} />
                      <span>{owner.email}</span>
                    </div>
                    <div className="owner-contact-item" style={{ alignItems: "flex-start" }}>
                      <MapPin size={16} style={{ color: "var(--primary)", marginTop: "2px" }} />
                      <span>{owner.address}</span>
                    </div>
                  </div>

                  <div className="owner-additional-info" style={{ borderTop: "1px dashed var(--surface-border)", paddingTop: "12px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div className="owner-contact-item" style={{ fontSize: "0.85rem" }}>
                      <ShieldAlert size={14} style={{ color: "var(--error)" }} />
                      <span><strong>Contato de Emergência:</strong> {owner.emergencyContactName || "Não informado"} {owner.emergencyContactPhone && owner.emergencyContactPhone !== "Não informado" ? `(${owner.emergencyContactPhone})` : ""}</span>
                    </div>
                    <div className="owner-contact-item" style={{ fontSize: "0.85rem" }}>
                      <HeartPulse size={14} style={{ color: "var(--success)" }} />
                      <span><strong>Vet de Preferência:</strong> {owner.preferredVetName || "Não informado"} {owner.preferredVetPhone && owner.preferredVetPhone !== "Não informado" ? `(${owner.preferredVetPhone})` : ""}</span>
                    </div>
                  </div>
                </div>

                <div className="owner-pets-section">
                  <span className="filter-label" style={{ margin: 0 }}>Pets de Estimação:</span>
                  <div className="owner-pets-list">
                    {ownerPets.length === 0 ? (
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                        Nenhum pet vinculado
                      </span>
                    ) : (
                      ownerPets.map(pet => (
                        <button
                          key={pet.id}
                          className="owner-pet-badge"
                          onClick={() => onNavigateToPet(pet)}
                          title={`Ver prontuário de ${pet.name}`}
                        >
                          <PawPrint size={12} />
                          {pet.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Cadastrar Novo Cliente */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Cadastrar Novo Cliente / Tutor</h2>
              <button className="btn-icon" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nome Completo *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Arthur Silva Portaluppi"
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Telefone de Contato *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: (11) 98765-4321"
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="Ex: tutor@email.com"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                </div>

                 <div className="form-group">
                  <label className="form-label">Endereço Residencial</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Rua das Flores, 123 - Centro"
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                  />
                </div>

                <div style={{ margin: "20px 0 8px 0", borderTop: "1px solid var(--surface-border)", paddingTop: "16px" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--primary)", marginBottom: "4px" }}>
                    Informações Adicionais (Emergência & Veterinário)
                  </h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>Opcional para contato rápido em casos de emergência médica do pet.</p>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Contato de Emergência</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: Beatriz Portaluppi (Irmã)"
                      value={emergencyContactName} 
                      onChange={(e) => setEmergencyContactName(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone de Emergência</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: (11) 97777-6666"
                      value={emergencyContactPhone} 
                      onChange={(e) => setEmergencyContactPhone(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Veterinário de Preferência</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: Dr. Marcos Oliveira"
                      value={preferredVetName} 
                      onChange={(e) => setPreferredVetName(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone do Veterinário</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: (11) 95555-4444"
                      value={preferredVetPhone} 
                      onChange={(e) => setPreferredVetPhone(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

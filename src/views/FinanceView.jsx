import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign,
  X
} from "lucide-react";
import "./FinanceView.css";
import { formatDate } from "../utils/helpers";

export default function FinanceView({ transactions, pets, onAddTransaction, onDeleteTransaction }) {
  // Estados de filtros
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("2026-06"); // Padrão: Junho 2026
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Estado para controle do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Campos do formulário de nova transação
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Hospedagem");
  const [date, setDate] = useState("2026-06-23");
  const [selectedPetId, setSelectedPetId] = useState("");

  const categories = [
    "Hospedagem",
    "Produtos",
    "Vacinas",
    "Aluguel/Contas",
    "Salários",
    "Outros"
  ];

  // 1. Filtrar as transações baseado nos estados de filtro
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(search.toLowerCase()));
      
    const matchesMonth = selectedMonth === "All" || t.date.startsWith(selectedMonth);
    
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    
    return matchesSearch && matchesMonth && matchesCategory;
  });

  // 2. Calcular os totais a partir das transações filtradas
  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // 3. Mapear petId para Nome para exibição elegante na tabela
  const getPetName = (petId) => {
    if (!petId) return "-";
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : "-";
  };

  // Enviar formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !date) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const newTx = {
      description,
      amount: parseFloat(amount),
      type,
      category,
      date,
      petId: selectedPetId || undefined
    };

    onAddTransaction(newTx);
    
    // Resetar campos e fechar modal
    setDescription("");
    setAmount("");
    setType("income");
    setCategory("Serviços");
    setDate("2026-06-23");
    setSelectedPetId("");
    setIsModalOpen(false);
  };

  return (
    <div className="fade-in">
      <div className="finance-header-row">
        <div>
          <h1>Financeiro e Caixa 💰</h1>
          <p>Gerencie receitas, despesas operacionais e lucros do pet shop.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Novo Lançamento
        </button>
      </div>

      {/* Cartões Resumo Financeiro */}
      <div className="finance-summary">
        <div className="card finance-card">
          <div>
            <span className="metric-label">Total Entradas</span>
            <div className="metric-value" style={{ color: "var(--success)" }}>
              R$ {totalIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="finance-card-icon" style={{ backgroundColor: "var(--success-light)", color: "var(--success)" }}>
            <ArrowUpRight size={24} />
          </div>
        </div>

        <div className="card finance-card">
          <div>
            <span className="metric-label">Total Saídas</span>
            <div className="metric-value" style={{ color: "var(--error)" }}>
              R$ {totalExpense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="finance-card-icon" style={{ backgroundColor: "var(--error-light)", color: "var(--error)" }}>
            <ArrowDownRight size={24} />
          </div>
        </div>

        <div className="card finance-card">
          <div>
            <span className="metric-label">Saldo do Período</span>
            <div className="metric-value" style={{ color: balance >= 0 ? "var(--primary)" : "var(--error)" }}>
              R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="finance-card-icon" style={{ backgroundColor: balance >= 0 ? "var(--primary-light)" : "var(--error-light)", color: balance >= 0 ? "var(--primary)" : "var(--error)" }}>
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="filter-bar">
        <div className="filter-group">
          <span className="filter-label">Buscar por descrição/categoria</span>
          <div style={{ position: "relative" }}>
            <input 
              type="text" 
              className="form-control filter-input" 
              placeholder="Ex: Ração, Aluguel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "36px", width: "100%" }}
            />
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Mês / Período</span>
          <select 
            className="form-control filter-input form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="All">Todos os meses</option>
            <option value="2026-06">Junho de 2026</option>
            <option value="2026-05">Maio de 2026</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Categoria</span>
          <select 
            className="form-control filter-input form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">Todas categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="finance-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Pet Associado</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th style={{ textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)" }}>
                  Nenhuma transação encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filteredTransactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((tx) => (
                  <tr key={tx.id}>
                    <td>{formatDate(tx.date)}</td>
                    <td style={{ fontWeight: 500 }}>{tx.description}</td>
                    <td>
                      <span className="badge badge-primary">{tx.category}</span>
                    </td>
                    <td>{getPetName(tx.petId)}</td>
                    <td>
                      <span className={`badge ${tx.type === "income" ? "badge-success" : "badge-error"}`}>
                        {tx.type === "income" ? "Entrada" : "Saída"}
                      </span>
                    </td>
                    <td className={tx.type === "income" ? "amount-income" : "amount-expense"}>
                      {tx.type === "income" ? "+" : "-"} R$ {tx.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button 
                        className="btn-icon" 
                        onClick={() => onDeleteTransaction(tx.id)}
                        title="Excluir lançamento"
                        style={{ color: "var(--error)" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Lançamento */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Novo Lançamento Financeiro</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Tipo de Transação *</label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button
                      type="button"
                      className={`btn ${type === "income" ? "btn-primary" : "btn-secondary"}`}
                      style={{ flex: 1 }}
                      onClick={() => {
                        setType("income");
                        setCategory("Hospedagem"); // default para entrada
                      }}
                    >
                      <ArrowUpRight size={18} /> Entrada (Receita)
                    </button>
                    <button
                      type="button"
                      className={`btn ${type === "expense" ? "btn-danger" : "btn-secondary"}`}
                      style={{ flex: 1, color: type === "expense" ? "white" : "var(--text-primary)" }}
                      onClick={() => {
                        setType("expense");
                        setCategory("Aluguel/Contas"); // default para saída
                      }}
                    >
                      <ArrowDownRight size={18} /> Saída (Despesa)
                    </button>
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Valor (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Data *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid-cols-2">
                  <div className="form-group">
                    <label className="form-label">Categoria *</label>
                    <select
                      className="form-control form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {type === "income" ? (
                        <>
                          <option value="Hospedagem">Hospedagem (Estadia)</option>
                          <option value="Produtos">Produtos / PetShop</option>
                          <option value="Vacinas">Vacinas</option>
                          <option value="Outros">Outros</option>
                        </>
                      ) : (
                        <>
                          <option value="Aluguel/Contas">Aluguel / Contas fixas</option>
                          <option value="Salários">Salários de Funcionários</option>
                          <option value="Produtos">Estoque de Produtos</option>
                          <option value="Outros">Outros operacionais</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pet Relacionado (Opcional)</label>
                    <select
                      className="form-control form-select"
                      value={selectedPetId}
                      onChange={(e) => setSelectedPetId(e.target.value)}
                    >
                      <option value="">Nenhum</option>
                      {pets.map(pet => (
                        <option key={pet.id} value={pet.id}>{pet.name} ({pet.breed})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Descrição / Detalhe *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Banho do Thor + corte de unha"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

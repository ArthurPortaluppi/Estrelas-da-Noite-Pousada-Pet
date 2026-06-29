import React, { useState } from "react";
import { 
  DollarSign, 
  PawPrint, 
  Users, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Calendar
} from "lucide-react";
import "./DashboardView.css";
import { formatDate } from "../utils/helpers";

export default function DashboardView({ pets, owners, transactions, onNavigateToTab }) {
  // 1. Filtrar Transações de Junho 2026 (Mês Atual)
  const currentMonthStr = "2026-06";
  const currentTransactions = transactions.filter(t => t.date.startsWith(currentMonthStr));
  
  const currentIncome = currentTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const currentExpense = currentTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = currentIncome - currentExpense;

  // 2. Calcular Hospedagens Ativas Hoje (2026-06-23)
  const todayStr = "2026-06-23";
  let activeLodgingsCount = 0;
  pets.forEach(pet => {
    if (pet.servicesHistory) {
      pet.servicesHistory.forEach(srv => {
        if (srv.type === "Hospedagem" && srv.checkIn <= todayStr && srv.checkOut >= todayStr) {
          activeLodgingsCount++;
        }
      });
    }
  });

  // 3. Calcular Diárias Vendidas no Mês Atual (Junho 2026)
  let totalNightsThisMonth = 0;
  pets.forEach(pet => {
    if (pet.servicesHistory) {
      pet.servicesHistory.forEach(srv => {
        if (srv.type === "Hospedagem" && srv.checkIn.startsWith(currentMonthStr)) {
          totalNightsThisMonth += srv.nights;
        }
      });
    }
  });

  // 4. Contar Vacinas Atrasadas ou Pendentes
  let overdueVaccines = 0;
  let pendingVaccines = 0;
  pets.forEach(pet => {
    if (pet.vaccines) {
      pet.vaccines.forEach(vac => {
        if (vac.status === "overdue") overdueVaccines++;
        if (vac.status === "pending") pendingVaccines++;
      });
    }
  });

  // 5. Processar Histórico de Hospedagens Recentes dos Pets
  const allLodgings = [];
  pets.forEach(pet => {
    if (pet.servicesHistory) {
      pet.servicesHistory.forEach(srv => {
        if (srv.type === "Hospedagem") {
          allLodgings.push({
            ...srv,
            petName: pet.name,
            species: pet.species,
            breed: pet.breed
          });
        }
      });
    }
  });

  const recentLodgings = allLodgings
    .sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn))
    .slice(0, 4);

  // 4. Calcular Valores para o Gráfico de Maio vs Junho 2026
  const getMonthStats = (monthStr) => {
    const txs = transactions.filter(t => t.date.startsWith(monthStr));
    const inc = txs.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const exp = txs.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    return { income: inc, expense: exp };
  };

  const statsMay = getMonthStats("2026-05");
  const statsJune = getMonthStats("2026-06");

  // Encontrar o maior valor para escala do gráfico
  const maxVal = Math.max(
    statsMay.income, statsMay.expense,
    statsJune.income, statsJune.expense,
    1000 // valor mínimo padrão
  ) * 1.15; // margem superior de 15%

  const chartHeight = 160; // altura útil do gráfico
  const scaleHeight = (val) => (val / maxVal) * chartHeight;

  return (
    <div className="fade-in">
      <div className="flex-between mb-6">
        <div>
          <h1>Estrelas da Noite - Pousada Pet 🌟🐾</h1>
          <p>Painel de controle e faturamento das hospedagens dos pets.</p>
        </div>
        <div className="badge badge-primary" style={{ padding: "8px 16px" }}>
          Junho / 2026
        </div>
      </div>

      {/* Grade de Estatísticas / Métricas */}
      <div className="dashboard-grid mb-6">
        <div className="card metric-card" onClick={() => onNavigateToTab("finance")} style={{ cursor: "pointer" }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary)" }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span className="metric-label">Lucro Líquido (Junho)</span>
            <div className="metric-value" style={{ color: netProfit >= 0 ? "var(--success)" : "var(--error)" }}>
              R$ {netProfit.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="badge badge-success mt-2" style={{ display: "inline-flex", gap: "2px" }}>
              <TrendingUp size={12} />
              {(currentIncome > 0 ? ((netProfit / currentIncome) * 100) : 0).toFixed(0)}% margem
            </span>
          </div>
        </div>

        <div className="card metric-card" onClick={() => onNavigateToTab("pets")} style={{ cursor: "pointer" }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--secondary-light)", color: "var(--secondary)" }}>
            <PawPrint size={24} />
          </div>
          <div>
            <span className="metric-label">Hospedagens Ativas</span>
            <div className="metric-value">{activeLodgingsCount}</div>
            <span className="metric-label mt-2" style={{ display: "block" }}>Estadias hoje</span>
          </div>
        </div>

        <div className="card metric-card" onClick={() => onNavigateToTab("pets")} style={{ cursor: "pointer" }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}>
            <Calendar size={24} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <span className="metric-label">Diárias no Mês</span>
            <div className="metric-value">{totalNightsThisMonth}</div>
            <span className="metric-label mt-2" style={{ display: "block" }}>Diárias vendidas</span>
          </div>
        </div>

        <div className="card metric-card" onClick={() => onNavigateToTab("pets")} style={{ cursor: "pointer" }}>
          <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--error-light)", color: "var(--error)" }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <span className="metric-label">Vacinas Críticas</span>
            <div className="metric-value" style={{ color: overdueVaccines > 0 ? "var(--error)" : "var(--text-primary)" }}>
              {overdueVaccines} Atrasadas
            </div>
            <span className="metric-label mt-2" style={{ display: "block", fontSize: "0.75rem", color: "var(--warning)" }}>
              Controle de saúde obrigatório
            </span>
          </div>
        </div>
      </div>

      {/* Gráfico Financeiro e Histórico de Atividades */}
      <div className="dashboard-details-grid">
        {/* Gráfico Financeiro SVG */}
        <div className="card">
          <div className="flex-between">
            <h3>Desempenho Financeiro</h3>
            <p>Maio vs Junho (2026)</p>
          </div>
          <div className="chart-container">
            <div className="chart-svg-wrapper">
              <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                {/* Linhas de Grade Horizontais */}
                <line x1="40" y1="20" x2="380" y2="20" stroke="var(--surface-border)" strokeDasharray="4 4" />
                <line x1="40" y1="100" x2="380" y2="100" stroke="var(--surface-border)" strokeDasharray="4 4" />
                <line x1="40" y1="180" x2="380" y2="180" stroke="var(--text-muted)" strokeWidth="1.5" />
                
                {/* Rótulos do Eixo Y */}
                <text x="32" y="24" fill="var(--text-secondary)" fontSize="10" textAnchor="end">
                  R$ {(maxVal * 0.9).toFixed(0)}
                </text>
                <text x="32" y="104" fill="var(--text-secondary)" fontSize="10" textAnchor="end">
                  R$ {(maxVal * 0.45).toFixed(0)}
                </text>
                <text x="32" y="184" fill="var(--text-secondary)" fontSize="10" textAnchor="end">
                  R$ 0
                </text>

                {/* --- Mês de Maio --- */}
                {/* Entrada Maio */}
                <rect 
                  x="100" 
                  y={180 - scaleHeight(statsMay.income)} 
                  width="35" 
                  height={scaleHeight(statsMay.income)} 
                  fill="url(#gradient-income)" 
                  rx="6"
                  style={{ transition: "all 0.6s ease" }}
                />
                {/* Saída Maio */}
                <rect 
                  x="140" 
                  y={180 - scaleHeight(statsMay.expense)} 
                  width="35" 
                  height={scaleHeight(statsMay.expense)} 
                  fill="url(#gradient-expense)" 
                  rx="6"
                  style={{ transition: "all 0.6s ease" }}
                />

                {/* --- Mês de Junho --- */}
                {/* Entrada Junho */}
                <rect 
                  x="240" 
                  y={180 - scaleHeight(statsJune.income)} 
                  width="35" 
                  height={scaleHeight(statsJune.income)} 
                  fill="url(#gradient-income)" 
                  rx="6"
                  style={{ transition: "all 0.6s ease" }}
                />
                {/* Saída Junho */}
                <rect 
                  x="280" 
                  y={180 - scaleHeight(statsJune.expense)} 
                  width="35" 
                  height={scaleHeight(statsJune.expense)} 
                  fill="url(#gradient-expense)" 
                  rx="6"
                  style={{ transition: "all 0.6s ease" }}
                />

                {/* Rótulos do Eixo X */}
                <text x="137" y="198" fill="var(--text-primary)" fontSize="12" fontWeight="600" textAnchor="middle">
                  Maio
                </text>
                <text x="277" y="198" fill="var(--text-primary)" fontSize="12" fontWeight="600" textAnchor="middle">
                  Junho
                </text>

                {/* Valores em Cima das Barras */}
                <text x="117" y={172 - scaleHeight(statsMay.income)} fill="var(--text-secondary)" fontSize="8" textAnchor="middle" fontWeight="500">
                  R${statsMay.income.toFixed(0)}
                </text>
                <text x="157" y={172 - scaleHeight(statsMay.expense)} fill="var(--text-secondary)" fontSize="8" textAnchor="middle" fontWeight="500">
                  R${statsMay.expense.toFixed(0)}
                </text>
                
                <text x="257" y={172 - scaleHeight(statsJune.income)} fill="var(--text-secondary)" fontSize="8" textAnchor="middle" fontWeight="500">
                  R${statsJune.income.toFixed(0)}
                </text>
                <text x="297" y={172 - scaleHeight(statsJune.expense)} fill="var(--text-secondary)" fontSize="8" textAnchor="middle" fontWeight="500">
                  R${statsJune.expense.toFixed(0)}
                </text>

                {/* Gradientes SVG */}
                <defs>
                  <linearGradient id="gradient-income" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" />
                    <stop offset="100%" stopColor="hsl(142, 60%, 65%)" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="gradient-expense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--error)" />
                    <stop offset="100%" stopColor="hsl(0, 75%, 75%)" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "var(--success)" }}></div>
                <span>Entradas (Receitas)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: "var(--error)" }}></div>
                <span>Saídas (Despesas)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hospedagens Recentes */}
        <div className="card">
          <div className="card-title-container">
            <h3>Hospedagens Recentes</h3>
            <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => onNavigateToTab("pets")}>
              Ver Pets
            </button>
          </div>
          
          <div className="recent-activity-list">
            {recentLodgings.length === 0 ? (
              <p style={{ textAlign: "center", padding: "20px" }}>Nenhuma hospedagem registrada ainda.</p>
            ) : (
              recentLodgings.map((lod) => (
                <div key={lod.id} className="activity-item">
                  <div className="activity-info">
                    <div className="activity-icon-pet">
                      {lod.petName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="activity-details">
                      <h4>{lod.petName} (Hospedagem)</h4>
                      <p>
                        {lod.nights} diárias • {formatDate(lod.checkIn)} a {formatDate(lod.checkOut)}
                        {lod.extras && lod.extras.length > 0 && ` • + ${lod.extras.map(e => e.name).join(", ")}`}
                      </p>
                    </div>
                  </div>
                  <div className="activity-amount">
                    R$ {lod.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

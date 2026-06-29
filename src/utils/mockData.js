// Dados simulados realistas para o "Estrelas da Noite - Pousada Pet"

export const INITIAL_OWNERS = [
  {
    id: "owner-1",
    name: "Arthur Silva Portaluppi",
    phone: "(11) 98765-4321",
    email: "arthur.portaluppi@email.com",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
    emergencyContactName: "Beatriz Portaluppi (Irmã)",
    emergencyContactPhone: "(11) 97777-6666",
    preferredVetName: "Dr. Marcos Oliveira",
    preferredVetPhone: "(11) 95555-4444"
  },
  {
    id: "owner-2",
    name: "Mariana Costa",
    phone: "(21) 99876-5432",
    email: "mariana.costa@email.com",
    address: "Rua Figueiredo Magalhães, 450 - Copacabana, Rio de Janeiro - RJ",
    emergencyContactName: "Roberto Costa (Pai)",
    emergencyContactPhone: "(21) 96666-5555",
    preferredVetName: "Dra. Ana Paula",
    preferredVetPhone: "(21) 94444-3333"
  },
  {
    id: "owner-3",
    name: "Carlos Eduardo Souza",
    phone: "(31) 97654-3210",
    email: "carlos.souza@email.com",
    address: "Rua da Bahia, 1200 - Centro, Belo Horizonte - MG",
    emergencyContactName: "Clara Souza (Esposa)",
    emergencyContactPhone: "(31) 95555-4444",
    preferredVetName: "Dr. Fernando Santos",
    preferredVetPhone: "(31) 93333-2222"
  },
  {
    id: "owner-4",
    name: "Juliana Mendes",
    phone: "(41) 98888-7777",
    email: "juliana.mendes@email.com",
    address: "Av. Sete de Setembro, 3200 - Batel, Curitiba - PR",
    emergencyContactName: "Lucas Mendes (Irmão)",
    emergencyContactPhone: "(41) 94444-3333",
    preferredVetName: "Dra. Patrícia Silva",
    preferredVetPhone: "(41) 92222-1111"
  }
];

export const INITIAL_PETS = [
  {
    id: "pet-1",
    name: "Thor",
    species: "Cão",
    breed: "Golden Retriever",
    age: "3 anos",
    weight: "32.5 kg",
    ownerId: "owner-1",
    notes: "Adora brincar no gramado com bolinhas. Alérgico a corante vermelho.",
    authorizedPickups: "Beatriz Portaluppi (Irmã), Mariana Silva",
    hasVaccinationCard: true,
    servicesHistory: [
      { 
        id: "srv-1", 
        type: "Hospedagem", 
        checkIn: "2026-06-10",
        checkOut: "2026-06-15",
        nights: 5,
        pricePerNight: 90.00,
        extras: [
          { name: "Banho", price: 60.00 },
          { name: "Tosa Higiênica", price: 40.00 }
        ],
        price: 550.00, // (5 * 90) + 60 + 40
        notes: "Estadia tranquila no chalé premium. Banho e tosa realizados na saída." 
      },
      { 
        id: "srv-2", 
        type: "Hospedagem", 
        checkIn: "2026-05-15",
        checkOut: "2026-05-18",
        nights: 3,
        pricePerNight: 90.00,
        extras: [
          { name: "Banho", price: 60.00 }
        ],
        price: 330.00, // (3 * 90) + 60
        notes: "Primeira hospedagem. Super sociável com outros hóspedes." 
      }
    ]
  },
  {
    id: "pet-2",
    name: "Luna",
    species: "Gato",
    breed: "Persa",
    age: "2 anos",
    weight: "4.1 kg",
    ownerId: "owner-2",
    notes: "Assustada com barulho alto. Prefere ficar no chalé individual de felinos.",
    authorizedPickups: "Roberto Costa (Pai)",
    hasVaccinationCard: true,
    servicesHistory: [
      { 
        id: "srv-3", 
        type: "Hospedagem", 
        checkIn: "2026-06-16",
        checkOut: "2026-06-20",
        nights: 4,
        pricePerNight: 80.00,
        extras: [
          { name: "Banho", price: 50.00 }
        ],
        price: 370.00, // (4 * 80) + 50
        notes: "Gosta de brinquedos com catnip. Banho seco realizado com sucesso." 
      }
    ]
  },
  {
    id: "pet-3",
    name: "Fred",
    species: "Cão",
    breed: "Bulldog Francês",
    age: "5 anos",
    weight: "12.8 kg",
    ownerId: "owner-3",
    notes: "Possui dermatite atópica. Usar apenas shampoo especial do cliente no banho extra.",
    authorizedPickups: "Clara Souza (Esposa)",
    hasVaccinationCard: true,
    servicesHistory: [
      { 
        id: "srv-4", 
        type: "Hospedagem", 
        checkIn: "2026-06-12",
        checkOut: "2026-06-15",
        nights: 3,
        pricePerNight: 90.00,
        extras: [
          { name: "Banho", price: 60.00 },
          { name: "Tosa", price: 80.00 }
        ],
        price: 410.00, // (3 * 90) + 60 + 80
        notes: "Banho terapêutico realizado na saída." 
      }
    ]
  },
  {
    id: "pet-4",
    name: "Pipoca",
    species: "Ave",
    breed: "Calopsita",
    age: "1 ano",
    weight: "95 g",
    ownerId: "owner-4",
    notes: "Hospedada na gaiola individual. Super mansa, assobia bastante.",
    authorizedPickups: "Lucas Mendes (Irmão)",
    hasVaccinationCard: false,
    servicesHistory: [
      { 
        id: "srv-5", 
        type: "Hospedagem", 
        checkIn: "2026-06-01",
        checkOut: "2026-06-08",
        nights: 7,
        pricePerNight: 40.00,
        extras: [],
        price: 280.00,
        notes: "Estadia excelente. Alimentação conforme cronograma do tutor." 
      }
    ]
  },
  {
    id: "pet-5",
    name: "Mel",
    species: "Gato",
    breed: "Sem Raça Definida (SRD)",
    age: "4 anos",
    weight: "4.8 kg",
    ownerId: "owner-1",
    notes: "Adora janelas com tela e caminhar nas prateleiras dos felinos.",
    authorizedPickups: "Beatriz Portaluppi (Irmã)",
    hasVaccinationCard: true,
    servicesHistory: [
      { 
        id: "srv-6", 
        type: "Hospedagem", 
        checkIn: "2026-06-21",
        checkOut: "2026-06-25", // Hospedagem ativa hoje (23/06/2026)
        nights: 4,
        pricePerNight: 80.00,
        extras: [],
        price: 320.00,
        notes: "Acomodada na suíte Felina. Muito calma e ronronando." 
      }
    ]
  }
];

export const INITIAL_TRANSACTIONS = [
  // Entradas (Junho de 2026)
  { id: "tx-1", type: "income", amount: 550.00, category: "Hospedagem", date: "2026-06-15", description: "Hospedagem Thor - 5 diárias + Banho & Tosa Higiênica", petId: "pet-1" },
  { id: "tx-2", type: "income", amount: 370.00, category: "Hospedagem", date: "2026-06-20", description: "Hospedagem Luna - 4 diárias + Banho", petId: "pet-2" },
  { id: "tx-3", type: "income", amount: 410.00, category: "Hospedagem", date: "2026-06-15", description: "Hospedagem Fred - 3 diárias + Banho & Tosa Completa", petId: "pet-3" },
  { id: "tx-4", type: "income", amount: 280.00, category: "Hospedagem", date: "2026-06-08", description: "Hospedagem Pipoca - 7 diárias", petId: "pet-4" },
  { id: "tx-5", type: "income", amount: 150.00, category: "Produtos", date: "2026-06-18", description: "Venda de Ração e Petiscos para Cão" },
  { id: "tx-6", type: "income", amount: 75.00, category: "Vacinas", date: "2026-06-12", description: "Vacina Aplicada em Mel (Tríplice)", petId: "pet-5" },

  // Saídas (Junho de 2026)
  { id: "tx-101", type: "expense", amount: 1500.00, category: "Aluguel/Contas", date: "2026-06-05", description: "Aluguel do Espaço Chácara & Condomínio" },
  { id: "tx-102", type: "expense", amount: 345.20, category: "Aluguel/Contas", date: "2026-06-10", description: "Conta de Energia Elétrica e Internet Fibra" },
  { id: "tx-103", type: "expense", amount: 1800.00, category: "Salários", date: "2026-06-05", description: "Salário do Cuidador Noturno da Pousada" },
  
  // Entradas (Maio de 2026 - Histórico)
  { id: "tx-201", type: "income", amount: 330.00, category: "Hospedagem", date: "2026-05-18", description: "Hospedagem Thor - 3 diárias + Banho", petId: "pet-1" },
  { id: "tx-202", type: "income", amount: 120.00, category: "Produtos", date: "2026-05-20", description: "Venda de Coleiras & Peitorais" },

  // Saídas (Maio de 2026 - Histórico)
  { id: "tx-301", type: "expense", amount: 1500.00, category: "Aluguel/Contas", date: "2026-05-05", description: "Aluguel do Espaço Chácara" }
];

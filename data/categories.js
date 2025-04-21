export const defaultCategories = [
    // Income Categories
    {
      id: "salary",
      name: "Salary",
      type: "INCOME",
      color: "#A8D5BA", // soft mint green
      icon: "Wallet",
    },
    {
      id: "freelance",
      name: "Freelance",
      type: "INCOME",
      color: "#AED9E0", // pastel aqua
      icon: "Laptop",
    },
    {
      id: "investments",
      name: "Investments",
      type: "INCOME",
      color: "#C3BFD9", // soft periwinkle
      icon: "TrendingUp",
    },
    {
      id: "business",
      name: "Business",
      type: "INCOME",
      color: "#E7B6C2", // rose blush
      icon: "Building",
    },
    {
      id: "rental",
      name: "Rental",
      type: "INCOME",
      color: "#F4D8A6", // muted amber
      icon: "Home",
    },
    {
      id: "other-income",
      name: "Other Income",
      type: "INCOME",
      color: "#D3C6B8", // warm gray
      icon: "Plus",
    },
  
    // Expense Categories
    {
      id: "housing",
      name: "Housing",
      type: "EXPENSE",
      color: "#E6B8B7", // soft terracotta
      icon: "Home",
      subcategories: ["Rent", "Mortgage", "Property Tax", "Maintenance"],
    },
    {
      id: "transportation",
      name: "Transportation",
      type: "EXPENSE",
      color: "#F2C9AC", // light peach
      icon: "Car",
      subcategories: ["Fuel", "Public Transport", "Maintenance", "Parking"],
    },
    {
      id: "groceries",
      name: "Groceries",
      type: "EXPENSE",
      color: "#D6E8A3", // mellow lime
      icon: "Shopping",
    },
    {
      id: "utilities",
      name: "Utilities",
      type: "EXPENSE",
      color: "#BEE3E1", // calm blue
      icon: "Zap",
      subcategories: ["Electricity", "Water", "Gas", "Internet", "Phone"],
    },
    {
      id: "entertainment",
      name: "Entertainment",
      type: "EXPENSE",
      color: "#D9C4E2", // gentle lavender
      icon: "Film",
      subcategories: ["Movies", "Games", "Streaming Services"],
    },
    {
      id: "food",
      name: "Food",
      type: "EXPENSE",
      color: "#F4B6B6", // pastel rose
      icon: "UtensilsCrossed",
    },
    {
      id: "shopping",
      name: "Shopping",
      type: "EXPENSE",
      color: "#ECCEDB", // dusty pink
      icon: "ShoppingBag",
      subcategories: ["Clothing", "Electronics", "Home Goods"],
    },
    {
      id: "healthcare",
      name: "Healthcare",
      type: "EXPENSE",
      color: "#B2DAD3", // pastel teal
      icon: "HeartPulse",
      subcategories: ["Medical", "Dental", "Pharmacy", "Insurance"],
    },
    {
      id: "education",
      name: "Education",
      type: "EXPENSE",
      color: "#CBCBE0", // chalky lavender blue
      icon: "GraduationCap",
      subcategories: ["Tuition", "Books", "Courses"],
    },
    {
      id: "personal",
      name: "Personal Care",
      type: "EXPENSE",
      color: "#F3BFD3", // soft fuchsia pink
      icon: "Smile",
      subcategories: ["Haircut", "Gym", "Beauty"],
    },
    {
      id: "travel",
      name: "Travel",
      type: "EXPENSE",
      color: "#BFD9EA", // powder sky blue
      icon: "Plane",
    },
    {
      id: "insurance",
      name: "Insurance",
      type: "EXPENSE",
      color: "#CFCFCF", // neutral soft gray
      icon: "Shield",
      subcategories: ["Life", "Home", "Vehicle"],
    },
    {
      id: "gifts",
      name: "Gifts & Donations",
      type: "EXPENSE",
      color: "#F5C6DA", // blush pink
      icon: "Gift",
    },
    {
      id: "bills",
      name: "Bills & Fees",
      type: "EXPENSE",
      color: "#F2B8BE", // light coral
      icon: "Receipt",
      subcategories: ["Bank Fees", "Late Fees", "Service Charges"],
    },
    {
      id: "other-expense",
      name: "Other Expenses",
      type: "EXPENSE",
      color: "#D6D9DD", // pale slate gray
      icon: "MoreHorizontal",
    },
  ];
  
  export const categoryColors = defaultCategories.reduce((acc, category) => {
    acc[category.id] = category.color;
    return acc;
  }, {});
  
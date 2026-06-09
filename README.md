# Expense Tracker

A modern, feature-rich expense tracking application built with React and Redux Toolkit. Track your expenses, analyze spending patterns, and manage your finances efficiently with an intuitive dark-mode interface.

![Signup Page](./images/signup.png)
![Login Page](./images/login.png)
![Categories Page](./images/categories.png)
![Dashboard Page](./images/dashboard.png)
![Expenses Page](./images/expenses.png)

## 🌟 Features

### User Authentication
- 🔐 **Login/Signup** - Secure user authentication

### Expense Management
- ✅ **CRUD Operations** - Create, read, update, and delete expenses
- 🔍 **Advanced Search** - Real-time search across expense titles
- 🏷️ **Category Filtering** - Filter expenses by categories
- 💰 **Amount Range Filter** - Set min/max amount filters
- 📊 **Smart Sorting** - Sort by amount (high-low, low-high) or date (newest, oldest)
- 📄 **Pagination** - Navigate through expenses with page controls
- 📈 **Real-time Summary** - View total expenses and item count per page

### Dashboard & Analytics
- 📊 Visual analytics and spending insights
- 📈 Charts and reports for expense analysis

### Category Management
- 🏷️ Create and manage expense categories
- 🎨 Organize expenses by type (Transportation, Healthcare, Shopping, etc.)

### UI/UX
- 🌓 Dark/Light mode toggle with theme persistence
- 📱 Responsive layout for all devices
- ⚡ Loading states with smooth transitions
- 🎨 Modern gradient cards and professional styling
- 🎯 Intuitive sidebar navigation

## 🛠️ Tech Stack

### Frontend
- **React** 18+ - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **React Icons** - Icon library (Feather Icons)
- **Tailwind CSS** - Utility-first styling

### Backend
- **JSON Server** - Mock REST API for development

### Development Tools
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

### Setup Instructions


1. **Install dependencies**
```bash
npm install
```

2. **Setup JSON Server**
```bash
npm install json-server
```

3. **Start JSON Server** (in a separate terminal)
```bash
json-server --watch my_db.json --port 5000
# OR if you have server.cjs configured
node server.cjs
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
```
http://localhost:5173
```

## 🚀 Usage

### Adding an Expense
1. Click the **"+ Add Expense"** button
2. Fill in the expense details (title, amount, category, date)
3. Click **"Add"** to save

### Filtering Expenses
- **Search**: Type in the search box to filter by title
- **Category**: Select a category from the dropdown
- **Amount Range**: Enter min/max amounts and click "Apply Range"
- **Sort**: Choose sorting option (amount or date)

### Editing an Expense
1. Click the **edit icon** (✏️) on any expense row
2. Modify the details in the modal
3. Click **"Update"** to save changes

### Deleting an Expense
- Click the **trash icon** (🗑️) on any expense row to delete

### Pagination
- Use **Previous** and **Next** buttons to navigate through pages
- View 10 expenses per page

## 📁 Project Structure

```
FINAL VERSION TOTAL/
├── dist/                          # Production build files
├── node_modules/                  # Dependencies
├── public/                        # Static assets
├── src/
│   ├── components/
│   │   ├── EmailField.jsx
│   │   ├── ExpenseFilters.jsx    # Filtering, search, and summary UI
│   │   ├── ExpenseModal.jsx      # Add/Edit expense modal
│   │   ├── Layout.jsx            # Main layout component
│   │   ├── PasswordField.jsx
│   │   ├── ReportSummary.jsx
│   │   ├── ReportTable.jsx
│   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   └── UsernameField.jsx
│   ├── pages/
│   │   ├── Analytics.jsx         # Analytics dashboard
│   │   ├── Categories.jsx        # Category management
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── Expenses.jsx          # Expense management page
│   │   ├── Login.jsx             # Login page
│   │   ├── NotFound.jsx          # 404 page
│   │   ├── Reports.jsx           # Reports page
│   │   └── Signup.jsx            # Signup page
│   ├── redux/
│   │   ├── Category/
│   │   │   ├── categoryServices.js
│   │   │   └── categorySlice.js
│   │   ├── Expense/
│   │   │   ├── expenseServices.js
│   │   │   └── expenseSlice.js  # Expense state management
│   │   ├── Report/
│   │   │   ├── reportSelectors.js
│   │   │   └── useDebouce.js
│   │   ├── theme/
│   │   │   └── themeSlice.js    # Dark/Light theme management
│   │   └── store.js              # Redux store configuration
│   ├── services/
│   │   └── userServices.js
│   ├── styling/
│   │   ├── styling.css
│   │
│   ├── App.jsx                    # Main app component
│   └── main.jsx                   # Entry point
├── eslint.config.js               # ESLint configuration
├── index.html                     # HTML template
├── my_db.json                     # JSON Server database
├── package-lock.json
├── package.json                   # Project dependencies
├── README.md                      # Project documentation
├── server.cjs                     # JSON Server configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── vite.config.js                 # Vite configuration
```

## 🔧 API Endpoints

JSON Server provides the following endpoints:

### Expenses
- `GET /expenses` - Get all expenses
- `GET /expenses?_page=1&_limit=10` - Paginated expenses
- `GET /expenses?q=search` - Search expenses
- `GET /expenses?categoryId=1` - Filter by category
- `GET /expenses?amount_gte=10&amount_lte=100` - Filter by amount range
- `GET /expenses?_sort=amount&_order=desc` - Sort expenses
- `POST /expenses` - Create new expense
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense

### Categories
- `GET /categories` - Get all categories

## 🎨 Features in Detail

### Advanced Filtering System
The expense tracker includes a comprehensive filtering system:
- **Text Search**: Real-time search across expense titles
- **Category Filter**: Filter by specific categories
- **Amount Range**: Set minimum and maximum amount boundaries
- **Multiple Filters**: Combine multiple filters simultaneously
- **URL Query Params**: Filters are converted to query parameters for API calls

### Smart Pagination
- 10 items per page
- Previous/Next navigation
- Disabled state for boundary pages
- Page number display
- Automatic data fetching on page change

### Loading States
- Overlay loading indicator with spinner
- Smooth blur and opacity transitions
- Non-blocking UI during data fetch
- Professional loading animations

## 🔮 Future Enhancements

- [ ] Email notifications for budget limits
- [ ] Recurring expenses automation
- [ ] Receipt image uploads with OCR
- [ ] Multi-currency support
- [ ] Expense sharing and splitting
- [ ] Advanced analytics with predictive insights
- [ ] Mobile app (React Native)
- [ ] Bank account integration
- [ ] Tax report generation

## 🐛 Known Issues

- None reported

---

**Built with ❤️ using React and Redux Toolkit**
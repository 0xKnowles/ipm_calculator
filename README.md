# IPM Calculator

![IPM Calculator Screenshot](public/example.PNG)

A sophisticated web application for agricultural professionals to calculate and manage biological pest control strategies. This tool helps greenhouse managers and farmers optimize their Integrated Pest Management (IPM) programs by providing precise calculations for beneficial insect quantities and associated costs.

## Features

### Core Functionality
- 🏗️ **Compartment Management**
  - Configure multiple greenhouse compartments with custom dimensions
  - Automatic area calculations
  - Visual representation of compartment layouts

- 🐛 **Biocontrol Agent Management**
  - Comprehensive database of biological control agents
  - Custom pricing configuration
  - Population tracking per unit
  - Method of action documentation

- 📊 **Advanced Calculations**
  - Real-time computation of required quantities
  - Cost analysis and breakdowns
  - Area-based pest density calculations
  - Program vs. extra units comparison

### User Experience
- 🎨 **Visual Tools**
  - Interactive greenhouse layout visualization
  - Cost distribution charts
  - Units needed visualization
  - Dark/light mode support

- 📱 **Responsive Design**
  - Full functionality on both desktop and mobile devices
  - Adaptive layouts for different screen sizes
  - Touch-friendly interface

### Data Management
- 💾 **Configuration Management**
  - Save and load greenhouse setups
  - Export detailed PDF reports
  - Local storage persistence
  - Supplier program integration

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/ipm-calculator.git
cd ipm-calculator
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Setting Up Compartments

1. Navigate to the "Compartment Configuration" section
2. Click "Add New Compartment" to create a compartment
3. Enter dimensions (width, length) and number of bays
4. Repeat for additional compartments

### Configuring Biocontrol Agents

1. Use the settings menu (bug icon) to:
   - Add new agents
   - Modify existing agents
   - Update pricing
   - Add branded names

### Calculating Requirements

1. Select desired biocontrol agents
2. Enter desired pest density per square meter
3. Choose target compartments for each agent
4. Review calculations in the "Order Calculations" section

### Managing Supplier Programs

1. Open the supplier program menu (calendar icon)
2. Enter weekly program details
3. Input scheduled quantities for each agent
4. Save to compare with calculated requirements

### Exporting Reports

1. Click "Export PDF" in the calculations section
2. Customize report contents:
   - Select sections to include
   - Add notes
   - Choose orientation
3. Generate and download the PDF

## Technology Stack

- **Framework**: Next.js 14
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **PDF Generation**: jsPDF
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Storage**: Local Storage API

## Contributing

We welcome contributions to the IPM Calculator! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the agricultural community
# 📱 Daily Report App

A modern **React Native + Expo** mobile application for tracking and managing daily work updates with a clean, responsive user interface. This app helps teams and individuals document their daily progress, accomplishments, and tasks efficiently.

---

## ✨ Features

✅ **Create Daily Reports** – Document daily work updates and accomplishments  
✅ **Track Progress** – View history of all submitted reports  
✅ **Local Storage** – Data persisted using SQLite and AsyncStorage  
✅ **Responsive UI** – Optimized for all mobile devices  
✅ **Easy Navigation** – Drawer-based navigation for seamless experience  
✅ **Export Reports** – Generate and share PDF/File formats  
✅ **TypeScript Support** – Type-safe codebase for better development  
✅ **Cross-Platform** – Works on iOS, Android, and Web  

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React Native 0.81.5** | Cross-platform mobile framework |
| **React 19.1.0** | UI library and state management |
| **Expo 54** | React Native development platform |
| **TypeScript** | Type-safe JavaScript |
| **React Navigation 7** | Screen and drawer navigation |
| **Expo SQLite** | Local database for storing reports |
| **AsyncStorage** | Key-value storage for app preferences |
| **React Native Vector Icons** | Icon library |
| **Lucide React Native** | Modern icon set |
| **Expo File System** | File management |
| **Expo Print & Sharing** | Export and share functionality |

---

## 📁 Project Structure

```
DailyReportApp/
│
├── app/                          # App entry point and configuration
│   ├── _layout.tsx              # Root layout and navigation setup
│   ├── index.tsx                # Home/Dashboard screen
│   └── report/                  # Report screens
│       ├── create.tsx           # Create new report
│       ├── view.tsx             # View report details
│       └── edit.tsx             # Edit existing report
│
├── components/                   # Reusable React Native components
│   ├── ReportCard.tsx           # Report list item component
│   ├── ReportForm.tsx           # Shared form for create/edit
│   ├── NavigationDrawer.tsx     # Drawer navigation menu
│   └── EmptyState.tsx           # Empty state placeholder
│
├── services/                     # Business logic and APIs
│   ├── reportService.ts         # Report CRUD operations
│   ├── storageService.ts        # Local storage operations
│   └── databaseService.ts       # SQLite database operations
│
├── hooks/                        # Custom React hooks
│   ├── useReports.ts            # Reports data management
│   └── useStorage.ts            # Storage operations hook
│
├── types/                        # TypeScript type definitions
│   └── index.ts                 # Shared types and interfaces
│
├── assets/                       # Images, icons, and media
│   ├── icon.png                 # App icon
│   ├── splash-icon.png          # Splash screen
│   └── adaptive-icon.png        # Android adaptive icon
│
├── package.json                  # Dependencies and scripts
├── app.json                      # Expo configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** (`npm install -g expo-cli`)
- **Expo Go App** on your phone (for testing on mobile device)

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/JavaDeveloper-Sinku/DailyReportApp.git
cd DailyReportApp
```

2. **Install Dependencies**

```bash
npm install
# or
yarn install
```

3. **Start the Development Server**

```bash
npm start
# or
yarn start
```

### Running on Different Platforms

#### 📱 iOS (macOS Only)

```bash
npm run ios
# Opens iOS Simulator automatically
```

#### 🤖 Android

```bash
npm run android
# Requires Android Emulator or connected device
```

#### 🌐 Web Browser

```bash
npm run web
# Opens web version at http://localhost:19006
```

#### 📱 Mobile Device (Recommended)

1. Install **Expo Go** from App Store or Google Play
2. Run `npm start`
3. Scan the QR code with your phone camera
4. Opens the app in Expo Go

---

## 📖 Usage

### Creating a Daily Report

1. **Navigate to Create Report** – Tap the "+" button or "New Report" from the menu
2. **Fill in Details:**
   - Date (auto-populated with today's date)
   - Work Summary
   - Accomplishments
   - Tasks Completed
   - Pending Tasks
   - Notes/Comments

3. **Save Report** – Tap "Submit" to save to local storage

### Viewing Reports

1. **Dashboard** – View all submitted reports in list format
2. **Report Details** – Tap on any report card to view full details
3. **Filter & Sort** – Filter by date or status

### Managing Reports

- **Edit** – Tap edit icon to modify any report
- **Delete** – Swipe or tap delete to remove a report
- **Share** – Export report as PDF or text file
- **Print** – Print report using device's print functionality

---

## 🔄 Data Flow

```
User Input → ReportForm Component
    ↓
ReportService (Business Logic)
    ↓
Database/Storage Service
    ↓
SQLite Database + AsyncStorage
    ↓
Retrieve & Display in UI
```

---

## 🗄️ Local Storage

### SQLite Database Schema

**Table: reports**
```sql
CREATE TABLE reports (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  summary TEXT NOT NULL,
  accomplishments TEXT,
  tasksCompleted TEXT,
  pendingTasks TEXT,
  notes TEXT,
  createdAt TEXT,
  updatedAt TEXT
);
```

### AsyncStorage Keys

```
@daily_report_app:last_sync
@daily_report_app:user_preferences
@daily_report_app:report_ids
```

---

## 🎨 UI/UX Features

- **Clean Design** – Minimalist interface focused on functionality
- **Responsive Layout** – Adapts to different screen sizes
- **Dark Mode Ready** – Can be easily extended to support dark theme
- **Intuitive Navigation** – Drawer-based menu for easy access
- **Loading States** – Smooth loading indicators
- **Empty States** – Helpful messages when no reports exist
- **Form Validation** – Client-side validation with error messages
- **Smooth Animations** – Framer Motion-like transitions

---

## 📡 API Integration (Ready for Backend)

To connect to a backend server, modify `reportService.ts`:

```typescript
const API_URL = 'https://your-api.com';

export const syncReports = async () => {
  try {
    const response = await fetch(`${API_URL}/reports`);
    const data = await response.json();
    // Save to local database
  } catch (error) {
    console.error('Sync failed:', error);
  }
};
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create a new report
- [ ] View report list
- [ ] Edit existing report
- [ ] Delete a report
- [ ] Export/Share report
- [ ] Test on different screen sizes
- [ ] Check data persistence after app restart
- [ ] Verify form validation

### Running on Simulator/Emulator

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Then interact with the app to test functionality
```

---

## 🚀 Building for Production

### iOS Build

```bash
eas build --platform ios
```

### Android Build

```bash
eas build --platform android
```

### Publishing

```bash
# Publish to Expo
expo publish

# Or use EAS Submit to upload to App Stores
eas submit --platform ios
eas submit --platform android
```

---

## 📦 Dependencies Overview

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react-native | 0.81.5 | Cross-platform mobile framework |
| expo | 54 | React Native development platform |
| @react-navigation | 7+ | Navigation and routing |
| expo-sqlite | 16 | Local database |
| @react-native-async-storage | 2.2.0 | Key-value storage |

### Utility Dependencies

| Package | Purpose |
|---------|---------|
| uuid | Generate unique IDs |
| expo-file-system | File management |
| expo-print | Print functionality |
| expo-sharing | Share files |
| react-native-gesture-handler | Gesture recognition |
| lucide-react-native | Modern icons |

---

## 🔧 Configuration

### Environment Setup

Create a `.env` file (if backend integration is needed):

```env
API_URL=https://your-api.com
API_KEY=your_api_key
APP_ENV=development
```

### Customization

#### Change App Name

Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

#### Customize Colors

Modify theme configuration in your navigation setup or create a `theme.ts` file.

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Blank Screen** | Clear Expo cache: `expo start --clear` |
| **Database Error** | Restart dev server and clear async storage |
| **Navigation Not Working** | Ensure all screens are properly registered |
| **Storage Not Persisting** | Check AsyncStorage permissions in `app.json` |

### Debug Mode

Enable debug logging:
```typescript
import { LogBox } from 'react-native';

// Ignore specific warnings
LogBox.ignoreLogs(['Warning: ...']);
```

---

## 📚 Learning Resources

- **React Native Docs** – https://reactnative.dev/
- **Expo Docs** – https://docs.expo.dev/
- **React Navigation** – https://reactnavigation.org/
- **TypeScript Handbook** – https://www.typescriptlang.org/docs/

---

## 🚀 Future Enhancements

- [ ] Cloud sync with Firebase
- [ ] Push notifications for reminders
- [ ] Team collaboration features
- [ ] Analytics and reporting dashboard
- [ ] Dark mode support
- [ ] Offline-first architecture with conflict resolution
- [ ] Voice note support
- [ ] Photo attachments in reports
- [ ] Export to Excel/CSV
- [ ] Email report summaries

---

## 📄 License

This project is open-source and available under the **0BSD License**.

---

## 👨‍💻 Author

**Sinku Singh**  
Java Backend Developer | React Native | Mobile Development | System Design

- 💼 GitHub: [JavaDeveloper-Sinku](https://github.com/JavaDeveloper-Sinku)
- 📧 Email: singh173@gmail.com
- 💻 Portfolio: [sinku-portfolio.vercel.app](https://sinku-portfolio.vercel.app)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## ⭐ Support

If you find this project helpful, please consider giving it a **star** ⭐ on GitHub!

---

## 📞 Contact & Support

For issues, suggestions, or questions:
- Open an **Issue** on GitHub
- Reach out via **Email**: singh173@gmail.com
- Connect on **LinkedIn**: [Sinku Singh](https://www.linkedin.com/in/sinku-singh-7a22ab233/)

---

**Happy Coding! 🚀📱**

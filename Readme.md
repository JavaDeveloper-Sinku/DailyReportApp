# **DailyReport – React Native (Expo) Application**

DailyReport is a simple and efficient React Native app built with Expo. It helps users create, store, and manage their daily reports with an easy-to-use interface. All reports are saved locally using **AsyncStorage**, allowing full offline usage.

---

## 🚀 **Features**

### ✔ **Daily Report Management**

* Create new daily reports
* View all saved reports
* Edit  & Delete reports
* Stores: Date & Time
* 100% Offline storage using **AsyncStorage**

### ✔ **Available Screens**

1. **Home Screen**

   * App overview
   * Quick navigation buttons
2. **ReportCreate Screen**

   * Form to create a new report
   * Save to local storage
3. **ReportList Screen**

   * Displays all saved reports
   * View & Delete options

### ✔ **UI & Experience**

* Clean and minimal design
* Smooth navigation using **React Navigation**
* Responsive layout

---

## 🏗 **Tech Stack**

| Category      | Technology                  |
| ------------- | --------------------------- |
| Framework     | React Native (Expo)         |
| Language      |  TypeScript                 |
| Local Storage | AsyncStorage                |
| Navigation    | React Navigation            |
| UI            | Custom Styling / StyleSheet |

---

## 📁 **Project Structure**

```
DailyReport/
 ├── App.js
 ├── screens/
 │   ├── HomeScreen.js
 │   ├── ReportCreateScreen.js
 │   └── ReportListScreen.js
 ├── components/
 │   └── ReportCard.js
 ├── storage/
 │   └── reportStorage.js   (AsyncStorage CRUD functions)
 ├── navigation/
 │   └── AppNavigator.js
 ├── assets/
 └── README.md
```

---

## 🖼 **Screenshots / App Pictures**


<img width="1105" height="718" alt="appUI" src="https://github.com/user-attachments/assets/dc8589c8-8473-4754-a283-133f739bdfd8" />


## ⚙️ **Installation & Setup**

### **1. Clone the Repository**

```
git clone https://github.com/yourusername/DailyReport.git
```

### **2. Install Dependencies**

```
cd DailyReport
npm install
```

### **3. Install Expo CLI**

```
npm install -g expo-cli
```

### **4. Start the App**

```
expo start
```

Scan the QR code using **Expo Go** on your mobile device.

---

## 🧠 **How It Works**

1. Open the app
2. Navigate from Home Screen
3. Create a report
4. The report gets saved in AsyncStorage
5. View all reports in the ReportList screen
6. Delete any report anytime

---

## 🔥 **Future Improvements**

* Report search & filters
* Edit report feature
* Export as PDF
* PIN lock / biometric lock

---

## 🤝 Contributing

Contributions and suggestions are welcome!
Submit a Pull Request or open an Issue.

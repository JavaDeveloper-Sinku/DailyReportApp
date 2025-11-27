import React, { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

type Activity = {
  id: string;
  title: string;
  subtitle?: string;
};

const activitiesSample: Activity[] = [
  { id: "1", title: "Report uploaded", subtitle: "Today • 10:30 AM" },
  { id: "2", title: "Report processed", subtitle: "Yesterday • 05:20 PM" },
  { id: "3", title: "Shared report", subtitle: "2 days ago" },
];

const DailyReportScreen: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <SafeAreaView style={styles.container}>
      
      {/* ---------------- HEADER ---------------- */}
      <View style={styles.header}>
        <Text style={styles.title}>DailyReport</Text>

        <View style={styles.headerIcons}>
          {/* Notification */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Notification")}
          >
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>

          {/* Menu */}
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setMenuVisible(!menuVisible)}
            >
              <Text style={styles.iconText}>☰</Text>
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {menuVisible && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate("Profile");
                  }}
                >
                  <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    navigation.navigate("ReportList");
                  }}
                >
                  <Text style={styles.menuText}>Reports</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuText}>Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuText}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ---------------- SEARCH ---------------- */}
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search Report"
          placeholderTextColor="#3d6b5d"
          style={styles.searchInput}
        />
      </View>

      {/* ---------------- GREETING CARD ---------------- */}
      <View style={styles.greetingCard}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=3" }} // dummy safe avatar
          style={styles.avatar}
        />

        <View style={styles.greetingTextWrap}>
          <Text style={styles.greetingTitle}>Hi John 👋</Text>
          <Text style={styles.greetingSubtitle}>Your Daily Overview</Text>
        </View>
      </View>

      {/* ---------------- START NEW REPORT ---------------- */}
      <View style={styles.startCard}>
        <Text style={styles.startTitle}>Start New Report</Text>

        <TouchableOpacity
          style={styles.newReportBtn}
          onPress={() => navigation.navigate("Report")}
        >
          <Text style={styles.newReportBtnText}>New Report</Text>
        </TouchableOpacity>
      </View>

      {/* ---------------- RECENT ACTIVITIES ---------------- */}
      <View style={styles.activitiesCard}>
        <Text style={styles.activitiesTitle}>Recent Activities</Text>

        <FlatList
          data={activitiesSample}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={styles.activityRow}>
              <View style={styles.activityLeft}>
                <View style={styles.activityDot} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.activityTitle}>{item.title}</Text>

                  {item.subtitle ? (
                    <Text style={styles.activitySubtitle}>
                      {item.subtitle}
                    </Text>
                  ) : null}
                </View>
              </View>

              <TouchableOpacity>
                <Text style={styles.activityMore}>⋯</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default DailyReportScreen;


// ---------------- STYLES ----------------

const CARD_RADIUS = 14;
const SEARCH_HEIGHT = 44;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingHorizontal: "5%",
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 12,
    zIndex: 9999,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  iconBtn: {
    padding: 6,
  },

  iconText: {
    fontSize: 22,
    fontWeight: "600",
  },

  dropdownMenu: {
    position: "absolute",
    top: 36,
    right: 0,
    backgroundColor: "#fff",
    width: 150,
    borderRadius: 10,
    paddingVertical: 10,
    zIndex: 9999,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  menuText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },

  searchWrapper: {
    width: "100%",
    marginBottom: 12,
  },

  searchInput: {
    height: SEARCH_HEIGHT,
    borderRadius: SEARCH_HEIGHT / 2,
    backgroundColor: "#cfe9d9",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#083a2a",
  },

  greetingCard: {
    width: "100%",
    backgroundColor: "#2b7a63",
    borderRadius: CARD_RADIUS,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    marginRight: 12,
  },

  greetingTextWrap: {
    flex: 1,
  },

  greetingTitle: {
    color: "#d9f6ea",
    fontSize: 15,
    fontWeight: "600",
  },

  greetingSubtitle: {
    color: "#e8f8ee",
    fontSize: 13,
  },

  startCard: {
    width: "100%",
    backgroundColor: "#ccffd8",
    borderRadius: CARD_RADIUS,
    padding: 14,
    marginBottom: 14,
  },

  startTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f2f1f",
    marginBottom: 10,
  },

  newReportBtn: {
    alignSelf: "flex-start",
    backgroundColor: "#2f8a6d",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  newReportBtnText: {
    color: "#e9fff5",
    fontWeight: "600",
  },

  activitiesCard: {
    width: "100%",
    backgroundColor: "#e6f0e7",
    borderRadius: CARD_RADIUS,
    padding: 14,
    flex: 1,
  },

  activitiesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  activityRow: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#ffffffaa",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  activityDot: {
    width: 44,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#e6e6e6",
  },

  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },

  activitySubtitle: {
    fontSize: 12,
    color: "#6b7280",
  },

  activityMore: {
    fontSize: 20,
    color: "#6b7280",
  },
});

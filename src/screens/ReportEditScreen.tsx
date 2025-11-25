import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");

type BottleItem = {
  size: string;
  qty: string;
};

type ProductCard = {
  id: string;
  title: string;
  image: any;
  items: BottleItem[];
};

const sampleData: ProductCard[] = [
  {
    id: "1",
    title: "Water Bottle",
    image: require("../../assets/water-bottle.png"), // add any bottle image here
    items: [
      { size: "500ml", qty: "50kit" },
      { size: "100ml", qty: "50kit" },
      { size: "50ml", qty: "50kit" },
    ],
  },
  {
    id: "2",
    title: "Water Bottle",
    image: require("../../assets/water-bottle.png"),
    items: [
      { size: "500ml", qty: "50kit" },
      { size: "100ml", qty: "50kit" },
      { size: "50ml", qty: "50kit" },
    ],
  },
];

const ReportEditScreen = () => {
  const [data, setData] = useState(sampleData);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* -------- Header -------- */}
        <Text style={styles.headerTitle}>Report Edit</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Report Id : xxx/xxx/xxx</Text>
          <Text style={styles.infoText}>Date : xxx/xxx/xxx</Text>
        </View>

        {/* -------- Product Cards -------- */}
        {data.map((card) => (
          <View key={card.id} style={styles.card}>
            <Text style={styles.cardTitle}>{card.title}</Text>

            <View style={styles.cardInner}>
              <Image source={card.image} style={styles.productImage} />

              <View style={{ flex: 1 }}>
                {card.items.map((item, idx) => (
                  <View key={idx} style={styles.rowItem}>
                    <Text style={styles.rowLeft}>{item.size}</Text>
                    <Text style={styles.rowRight}>{item.qty}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}

        {/* -------- Buttons -------- */}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.btnTextWhite}>Save</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportEditScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingTop: Platform.OS === "android" ? 24 : 0,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 12,
    color: "#0f172a",
  },

  infoBox: {
    width: width * 0.9,
    marginBottom: 12,
  },

  infoText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },

  card: {
    width: width * 0.9,
    backgroundColor: "#2f8a6d",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },

  cardInner: {
    flexDirection: "row",
    gap: 14,
  },

  productImage: {
    width: 70,
    height: 100,
    resizeMode: "contain",
  },

  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
  },

  rowLeft: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  rowRight: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  btnRow: {
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },

  editBtn: {
    width: "45%",
    paddingVertical: 12,
    backgroundColor: "#e6f2ea",
    borderRadius: 10,
    alignItems: "center",
  },

  saveBtn: {
    width: "45%",
    paddingVertical: 12,
    backgroundColor: "#2f8a6d",
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2f8a6d",
  },

  btnTextWhite: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});

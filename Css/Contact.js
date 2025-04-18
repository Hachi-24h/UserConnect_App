import { StyleSheet, Dimensions } from "react-native";
import color from "../Custom/Color";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.borderGray,
  },
  searchBar: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  contactPhone: {
    fontSize: 14,
    color: color.textSecondary,
    marginTop: 4,  
  },
  
  
  searchInput: {
    backgroundColor: color.card,
    borderRadius: width * 0.03,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.012,
    color: color.textPrimary,
    fontSize: width * 0.04,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: height * 0.015,
    marginBottom: height * 0.01,
  },
  tab: {
    color: color.textSecondary,
    fontSize: width * 0.04,
  },
  tabActive: {
    color: color.primary,
    fontWeight: "bold",
    fontSize: width * 0.042,
  },
  specialItems: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: color.border,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    backgroundColor: color.card,
    marginBottom: height * 0.01,
  },
  specialItem: {
    paddingVertical: height * 0.012,
    paddingHorizontal: width * 0.02,
    alignItems: "center",
    gap: width * 0.03,
    flexDirection: "row",
    color: color.textPrimary,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  contactLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: (width * 0.12) / 2,
    marginRight: width * 0.04,
  },
  contactName: {
    color: color.textPrimary,
    fontSize: width * 0.042,
  },
  contactActions: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default styles;

import { StyleSheet, Dimensions } from "react-native";
import color from "../Custom/Color";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.darkBackground,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.gray,
    paddingVertical: height * 0.017,
    paddingHorizontal: width * 0.05,
  },
  headerTitle: {
    color: color.white,
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginLeft: width * 0.04,
  },
  scroll: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.02,
  },
  item: {
    paddingVertical: height * 0.018,
    borderBottomWidth: 1,
    borderBottomColor: color.lightBlue,
  },
  itemText: {
    fontSize: width * 0.04,
    color: color.white,
  },
  divider: {
    height: height * 0.02,
    backgroundColor: color.lightGray,
    marginVertical: height * 0.01,
  },
  sectionTitle: {
    color: color.accentBlue,
    fontWeight: "bold",
    fontSize: width * 0.038,
    marginBottom: height * 0.01,
  },
});

export default styles;

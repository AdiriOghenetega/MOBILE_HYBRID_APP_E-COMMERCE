import { StyleSheet, useWindowDimensions } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    color: "rgb(237,139,27)",
    marginVertical: 5,
    width: "90%",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 15,
    borderRadius: 6,
    color: "gray",
    marginVertical: 5,
  },
  errorText: {
    color: "crimson",
    fontWeight: "bold",
    textAlign: "center",
  },
  topText: {
    backgroundColor: "white",
    width: "90%",
    textAlign: "center",
    padding: 8,
    fontWeight: "bold",
    fontSize: 17,
    color: "rgb(237,139,27)",
    alignSelf: "center",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  naira: {
    color: "green",
    fontWeight: "900",
  },
  amount: {
    fontWeight: "bold",
    color: "black",
  },
  buttonContainer: { alignItems: "center", justifyContent: "center" },
  transparentModal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  itemContainer: {
    width: 340,
    height: 120,
    alignSelf: "center",
    flexDirection: "row",
    padding: 10,
    borderRadius: 15,
    elevation: 3,
    backgroundColor: "rgb(254,235,228)",
    shadowOffset: { 
      width: 2, 
      height: 5 
    },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginVertical: 9,
    justifyContent: "space-between",
    alignItems: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginVertical: 5,
    width: "90%",
    justifyContent: "space-between",
  },
  passwordTextInput: { fontSize: 15, color: "gray", width: "90%" },
  avatarParentContainer:{
    width:"90%",
    alignItems:"center",
    justifyContent:"center",
    alignSelf:"flex-start",
  },
  avatarContainer: { 
    borderRadius: 50,
    overflow: "hidden" ,
    position: "relative",
    height: 80,
    width: 80,
    },
});

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#373B3F', // Define a cor de fundo azul
    paddingHorizontal: 25
  },
  arrow: {
    position: 'absolute',
    left: 30,
    top: 50
  },
  image: {
    backgroundColor: '#fff',
    width: 96,
    height: 96,
    marginBottom: 8,
    borderWidth: 2, // Border width in pixels
    borderColor: '#1CC29F', // Border color
  },
  groupInfo: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    marginTop: 25,
    paddingVertical: 18,
    paddingHorizontal: 15,
    gap: 15
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  innerGroup: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textBold: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginRight: 5
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  participantImage: {
    width: 47,
    height: 47,
    backgroundColor: "#fff",
    borderRadius: 30
  },
  participantName: {
    fontSize: 14,
    color: "#333",
    marginLeft: 15
  },
  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    borderRadius: 10
  },
  buttonText: {
    fontSize: 16,
    color: "#d73018",
    fontWeight: 'bold'
  }
});

import React, { useRef } from "react";
import { StyleSheet, SafeAreaView, Button } from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewScreen() {
  const webviewRef = useRef<WebView>(null);

  const sendMessageToWeb = () => {
    if (webviewRef.current) {
      console.log("Sending message to WebView");
      webviewRef.current.postMessage("Hello from React Native!");
    } else {
      console.log("WebView is not ready yet");
    }
  };

  const handleMessage = (event: any) => {
    const message = event.nativeEvent.data;
    console.log("Received message from WebView:", message);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: "https://animalmeeting.vercel.app/" }}
        // source={{ uri: "http://198.168.200.153:8081" }}
        onMessage={handleMessage}
        onLoadEnd={() => console.log("WebView loaded")}
      />
      <Button title="Send Message to WebView" onPress={sendMessageToWeb} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

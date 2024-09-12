import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WebViewScreen from "@/components/WebViewScreen";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // 헤더도 숨기기
        tabBarStyle: { display: "none" }, // 바텀 탭 숨기기
      }}
    >
      <Tab.Screen name="WebView" component={WebViewScreen} />
    </Tab.Navigator>
  );
}

import MainLayoutVertical from "@/components/main-layout/main-layout-vertical";
import MainLayoutHorizontal from "@/components/main-layout/main-layout-horizontal";

let MainLayout = {};

MainLayout.install = Vue => {
  Vue.component("MainLayoutVertical", MainLayoutVertical);
  Vue.component("MainLayoutHorizontal", MainLayoutHorizontal);
};

export default MainLayout;

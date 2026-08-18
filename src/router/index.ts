import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/modules/auth/views/Login.vue";
import CapacitacionesView from "@/modules/capacitaciones/views/Capacitaciones.vue";
import FormulariosView from "@/modules/formularios/views/Formularios.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      protected: false,
    },
  },
  {
    path: "/capacitaciones",
    name: "Capacitaciones",
    component: CapacitacionesView,
    meta: {
      icon: "mdi-school-outline",
      protected: true,
    },
  },
  {
    path: "/formularios",
    name: "Formularios",
    component: FormulariosView,
    meta: {
      icon: "mdi-file-document-edit-outline",
      protected: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

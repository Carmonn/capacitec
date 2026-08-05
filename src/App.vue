<script setup lang="ts">
import { useDisplay } from "vuetify";
import logoCompleto from "@/assets/img/LogoCompleto.png";

const { smAndDown } = useDisplay();
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="py-12">
        <v-row justify="center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="5">
            <v-img
              :src="logoCompleto"
              :max-width="smAndDown ? 350 : 700"
              alt="Logo completo de ADVR Consultores"
              aspect-ratio="3.2"
              width="100%"
              eager
            />
          </v-col>
        </v-row>
        <v-row class="mt-4" justify="center">
          <v-col cols="12" sm="10" md="8" lg="6" xl="5">
            <v-card class="pa-4 pa-sm-6" elevation="2" rounded="lg">
              <v-card-title class="mb-3 text-title-medium"
                >Capacitec Login</v-card-title
              >
              <!-- <p>Capacitec Login</p> -->
              <v-text-field
                label="Correo electronico"
                type="email"
                autocomplete="email"
                variant="outlined"
                :density="smAndDown ? 'comfortable' : 'default'"
                hide-details="auto"
                class="mb-3"
                :prepend-icon="smAndDown ? undefined : 'mdi-email-outline'"
              />
              <v-text-field
                label="Contrasena"
                type="password"
                autocomplete="current-password"
                variant="outlined"
                :density="smAndDown ? 'comfortable' : 'default'"
                hide-details="auto"
                class="mb-3"
                :prepend-icon="smAndDown ? undefined : 'mdi-lock-outline'"
              />
              <div class="d-flex justify-center mt-10">
                <v-btn color="primary" :width="smAndDown ? '100%' : '50%'">
                  Iniciar sesion
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped></style>

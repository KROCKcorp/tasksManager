<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { QCard, QCardSection, QInput, QBtn, QSpinner, Notify } from 'quasar';
import api from '../services/api.js';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  console.log('Login attempt:', email.value, password.value);
  errorMessage.value = '';
  loading.value = true;

  try {
    const response = await api.post('/auth/login', { email: email.value, password: password.value });
    const { token } = response.data;

    localStorage.setItem('authToken', token);

    Notify.create({
      type: 'positive',
      message: 'Login Successful',
      timeout: 1000,
    });

    const redirect = route.query.redirect || '/tasks';
    router.push(redirect);
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <q-card class="q-pa-lg" style="width: 400px">
    <q-card-section>
      <h2 class="text-center">Login</h2>
    </q-card-section>
    <q-card-section>
      <q-input v-model="email" label="Email" filled />
      <q-input v-model="password" label="Password" filled type="password" class="q-mt-md" />
      <q-btn :loading="loading" label="Login" color="primary" class="full-width q-mt-md" @click="handleLogin">
        <template v-slot:loading>
          <q-spinner />
        </template>
      </q-btn>
      <p v-if="errorMessage" class="text-negative text-center q-mt-md">
        {{ errorMessage }}
      </p>
    </q-card-section>
  </q-card>
</template>

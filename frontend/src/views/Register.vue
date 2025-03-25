<script setup>
import { ref } from 'vue';
import { QCard, QCardSection, QInput, QBtn, QSpinner, Notify } from 'quasar';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const loading = ref(false);

const handleRegister = async () => {
  console.log('Register attempt:', name.value, email.value, password.value);

  errorMessage.value = '';
  loading.value = true;

  try {
    const response = await axios.post('http://localhost:8000/api/auth/signup', {
      name: name.value,
      email: email.value,
      password: password.value,
    });

    Notify.create({
      type: 'positive',
      message: 'Registration successful! Redirecting to login...',
      timeout: 1000,
    });

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } catch (error) {
    console.error('Registration failed:', error);
    errorMessage.value = error.response?.data?.message || 'Registration failed. Please try again.';
    Notify.create({
      type: 'negative',
      message: error.response?.data?.message || 'Registration failed!',
      timeout: 500,
    });
  } finally {
    loading.value = false;
  }
};

const handleLogin = () => {
  router.push('/login');
};
</script>

<template>
  <q-card class="q-pa-lg" style="width: 400px">
    <q-card-section>
      <h2 class="text-center">Register</h2>
    </q-card-section>
    <q-card-section>
      <q-input v-model="name" label="Name" filled />
      <q-input v-model="email" label="Email" filled />
      <q-input v-model="password" label="Password" filled type="password" class="q-mt-md" />
      <q-btn :loading="loading" label="Register" color="primary" class="full-width q-mt-md" @click="handleRegister">
        <template v-slot:loading>
          <q-spinner color="white" />
        </template>
      </q-btn>
      <q-btn :loading="loading" label="Login" color="primary" class="full-width q-mt-md" @click="handleLogin" />
      <p v-if="errorMessage" class="text-red text-center q-mt-md">{{ errorMessage }}</p>
    </q-card-section>
  </q-card>
</template>

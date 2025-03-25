<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { QCard, QInput, QBtn, QSpinner, Notify } from 'quasar';
import api from '../services/api.js';

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleRegister = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    const response = await api.post('/auth/signup', {
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
  <div class="row justify-center items-center" style="height: auto; min-height: 100vh; width: 800px">
    <q-card style="width: 100%; max-width: 800px; min-height: 400px; border-radius: 1em">
      <div class="row no-wrap" style="height: 100%">
        <!-- Left Panel -->
        <div class="col-0 col-sm-5 bg-primary rounded-left-borders xs-hide" style="border-radius: 1em">
          <div class="column full-height justify-center items-center q-px-xl">
            <div class="text-h4 text-uppercase text-center text-white q-mb-sm">Tasks Manager</div>
            <div class="text-white text-subtitle1 text-center">Create an account to get started!</div>
          </div>
        </div>

        <!-- Right Panel - Form -->
        <div class="col-12 col-sm-7">
          <div class="column justify-center q-pa-lg" style="height: 100%">
            <div class="text-h4 text-uppercase text-weight-bold text-primary text-center q-mb-xl">REGISTER</div>

            <div style="min-height: 300px">
              <q-input
                v-model="name"
                label="Name"
                filled
                class="q-mb-md"
                :rules="[(val) => !!val || 'Name is required']" />

              <q-input
                v-model="email"
                label="Email"
                filled
                type="email"
                class="q-mb-md"
                :rules="[(val) => !!val || 'Email is required']" />

              <q-input
                v-model="password"
                label="Password"
                filled
                type="password"
                class="q-mb-md"
                :rules="[(val) => !!val || 'Password is required']" />

              <div v-if="errorMessage" class="text-negative text-center q-pa-xs bg-negative-1 rounded-borders">
                {{ errorMessage }}
              </div>
            </div>

            <div>
              <div class="row justify-center">
                <q-btn
                  no-caps
                  unelevated
                  :loading="loading"
                  label="Register"
                  color="primary"
                  class="btn-center q-mt-md q-pa-sm q-px-lg"
                  rounded
                  size="lg"
                  @click="handleRegister">
                  <template v-slot:loading>
                    <q-spinner class="on-left" />
                    REGISTERING...
                  </template>
                </q-btn>
              </div>

              <div class="text-center q-mt-lg">
                Already have an account?
                <q-btn flat label="LOGIN" color="primary" class="q-px-none" @click="handleLogin" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

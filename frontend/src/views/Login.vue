<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { QCard, QInput, QBtn, QSpinner, Notify } from 'quasar';
import api from '../services/api.js';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  errorMessage.value = '';
  loading.value = true;

  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    });
    const { token, user } = response.data;

    localStorage.setItem('authToken', token);
    localStorage.setItem('username', user.name);

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

const handleRegister = () => {
  router.push('/register');
};
</script>

<template>
  <div class="row justify-center items-center" style="height: auto; min-height: 100vh">
    <q-card style="width: 100%; max-width: 800px; min-height: 400px; border-radius: 1em">
      <div class="row no-wrap" style="height: 100%">
        <!-- Left Panel -->
        <div class="col-0 col-sm-5 bg-primary rounded-left-borders xs-hide" style="border-radius: 1em">
          <div class="column full-height justify-center items-center q-px-xl">
            <div class="text-h4 text-uppercase text-center text-white q-mb-sm">Tasks Manager</div>
            <div class="text-white text-subtitle1 text-center">Please sign in to your account to get started!</div>
          </div>
        </div>

        <!-- Right Panel - Form -->
        <div class="col-12 col-sm-7">
          <div class="column justify-center q-pa-md" style="height: 100%">
            <div class="text-h4 text-uppercase text-weight-bold text-primary text-center q-mb-xl">LOGIN</div>

            <div style="min-height: 220px">
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
                  label="Login"
                  color="primary"
                  class="btn-center q-mt-md q-pa-sm q-px-lg"
                  rounded
                  size="lg"
                  @click="handleLogin">
                  <template v-slot:loading>
                    <q-spinner class="on-left" />
                    SIGNING IN...
                  </template>
                </q-btn>
              </div>

              <div class="text-center q-mt-lg">
                Don't have an account yet?
                <q-btn flat label="REGISTER" color="primary" class="q-px-none" @click="handleRegister" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

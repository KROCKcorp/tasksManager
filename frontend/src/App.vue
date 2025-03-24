<script setup>
import { QLayout, QPageContainer } from 'quasar';
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <q-page-container class="flex flex-center">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

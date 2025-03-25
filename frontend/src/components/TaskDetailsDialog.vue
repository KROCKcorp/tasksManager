<script setup>
import { QDialog, QCard, QCardSection, QCardActions, QBtn, QBadge, QSeparator, QSpace } from 'quasar';

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  task: {
    type: Object,
    default: () => ({}), // Provide default empty object
  },
  getStatusColor: {
    type: Function,
    required: true,
  },
  formatStatus: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'edit', 'delete']);

const closeDialog = () => {
  emit('update:modelValue', false);
};
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="closeDialog">
    <q-card style="width: 800px; max-width: 90vw; margin-top: 100px; border-radius: 8px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h4 text-weight-bold">{{ task?.title }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="closeDialog" />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pt-md">
        <div class="row items-center q-mb-md">
          <div class="text-subtitle1 text-weight-medium">Status:&nbsp;</div>
          <q-badge :color="getStatusColor(task?.status)" :label="formatStatus(task?.status)" class="text-h6" />
        </div>

        <div class="text-h6 text-weight-medium q-mb-sm">Description:</div>
        <q-card bordered flat class="q-pa-md" style="border-radius: 8px">
          <p class="text-body1" style="word-break: break-word; white-space: pre-wrap; margin: 0">
            {{ task?.description }}
          </p>
        </q-card>
      </q-card-section>

      <q-card-section class="text-caption text-grey q-pt-none">
        <div>Created: {{ new Date(task?.created_at).toLocaleString() }}</div>
        <div>Last Updated: {{ new Date(task?.updated_at).toLocaleString() }}</div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Edit" color="primary" @click="$emit('edit', task)" v-close-popup />
        <q-btn flat label="Delete" color="negative" @click="$emit('delete', task?.id)" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

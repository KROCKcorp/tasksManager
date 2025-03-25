<script setup>
import { QDialog, QCard, QCardSection, QCardActions, QBtn, QInput, QSelect, QForm } from 'quasar';

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  task: {
    type: Object,
    default: () => ({}),
  },
  statusOptions: {
    type: Array,
    required: true,
  },
});

defineEmits(['update:modelValue', 'update:task', 'update']);
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">Edit Task</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="$emit('update')">
          <q-input
            :model-value="task.title"
            @update:model-value="$emit('update:task', { ...task, title: $event })"
            label="Title"
            filled
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please enter a title']"
            class="q-mb-md" />

          <q-input
            :model-value="task.description"
            @update:model-value="$emit('update:task', { ...task, description: $event })"
            label="Description"
            filled
            type="textarea"
            class="q-mb-md" />

          <q-select
            :model-value="task.status"
            @update:model-value="$emit('update:task', { ...task, status: $event })"
            :options="statusOptions"
            label="Status"
            filled
            map-options
            emit-value
            class="q-mb-md" />

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="negative" v-close-popup />
            <q-btn flat label="Update Task" type="submit" color="primary" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

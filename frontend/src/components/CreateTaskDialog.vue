<script setup>
import { QCard, QCardSection, QCardActions, QBtn, QDialog, QInput, QSelect, QForm } from 'quasar';

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  newTask: {
    type: Object,
    required: true,
  },
  statusOptions: {
    type: Array,
    required: true,
  },
});

defineEmits(['update:modelValue', 'update:newTask', 'create', 'reset']);
</script>

<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">Create New Task</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="$emit('create')">
          <q-input
            :model-value="newTask.title"
            @update:model-value="$emit('update:newTask', { ...newTask, title: $event })"
            label="Title"
            filled
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'Please enter a title']"
            class="q-mb-md" />

          <q-input
            :model-value="newTask.description"
            @update:model-value="$emit('update:newTask', { ...newTask, description: $event })"
            label="Description"
            filled
            type="textarea"
            class="q-mb-md" />

          <q-select
            :model-value="newTask.status"
            @update:model-value="$emit('update:newTask', { ...newTask, status: $event })"
            :options="statusOptions"
            label="Status"
            filled
            map-options
            emit-value
            class="q-mb-md" />

          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="negative" v-close-popup @click="$emit('reset')" />
            <q-btn flat label="Create Task" type="submit" color="primary" />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

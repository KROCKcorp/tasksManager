<script setup>
import {
  QCardSection,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QBadge,
  QSpinner,
  QSpace,
} from 'quasar';

defineProps({
  tasks: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
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

const emit = defineEmits(['task-clicked']);
</script>

<template>
  <q-card-section v-if="loading" class="text-center q-pa-xl">
    <q-spinner color="primary" size="3em" />
    <div class="q-mt-sm">Loading tasks...</div>
  </q-card-section>

  <q-list v-else bordered class="rounded-borders">
    <q-item v-for="task in tasks" :key="task.id" class="q-py-sm" v-ripple clickable @click="emit('task-clicked', task)">
      <q-item-section>
        <q-item-label class="text-weight-bold">{{ task.title }}</q-item-label>
        <div class="row q-mt-sm items-center">
          <q-badge :color="getStatusColor(task.status)" :label="formatStatus(task.status)" />
          <q-space />
          <div class="text-caption text-grey">Created: {{ new Date(task.created_at).toLocaleDateString() }}</div>
        </div>
      </q-item-section>
    </q-item>
  </q-list>

  <q-card-section v-if="!loading && tasks.length === 0" class="text-center text-grey">
    No tasks found. Create your first task!
  </q-card-section>
</template>

<style scoped>
.q-item {
  transition: all 0.3s;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.q-item:last-child {
  border-bottom: none;
}

.q-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>

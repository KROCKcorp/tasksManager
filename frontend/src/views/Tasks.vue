<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import {
  QLayout,
  QHeader,
  QToolbar,
  QToolbarTitle,
  QPageContainer,
  QCard,
  QCardSection,
  QCardActions,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QBtn,
  QBadge,
  QSpinner,
  QDialog,
  QSpace,
  Notify,
} from 'quasar';

const router = useRouter();
const tasks = ref([]);
const loading = ref(true);
const selectedTask = ref(null);
const showTaskDialog = ref(false);

const username = ref(localStorage.getItem('username'));

const fetchTasks = async () => {
  try {
    loading.value = true;
    const response = await api.get('/tasks');
    tasks.value = response.data;
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Failed to load tasks' });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchTasks();
});

const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('username');
  router.push('/login');
};

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'positive';
    case 'in-progress':
      return 'warning';
    default:
      return 'grey';
  }
};

const formatStatus = (status) => {
  return status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
};

const openTaskDetails = (task) => {
  selectedTask.value = task;
  showTaskDialog.value = true;
};

const deleteTask = async (taskId) => {
  try {
    await api.delete(`/tasks/${taskId}`);
    Notify.create({ type: 'positive', message: 'Task deleted successfully' });
    fetchTasks();
    showTaskDialog.value = false;
  } catch (error) {
    Notify.create({ type: 'negative', message: 'Failed to delete task' });
  }
};
</script>

<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title> My Tasks </q-toolbar-title>

        <div class="row items-center q-gutter-x-sm">
          <div class="text-subtitle2">
            <span>{{ username }}</span>
          </div>
          <q-btn label="Logout" color="white" flat @click="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="tasks-page q-pa-lg">
        <q-card flat bordered class="tasks-card">
          <q-card-section>
            <div class="text-h6">Your Tasks</div>
          </q-card-section>

          <q-card-section v-if="loading" class="text-center q-pa-xl">
            <q-spinner color="primary" size="3em" />
            <div class="q-mt-sm">Loading tasks...</div>
          </q-card-section>

          <q-list v-else bordered class="rounded-borders">
            <q-item
              v-for="task in tasks"
              :key="task.id"
              class="q-py-sm"
              v-ripple
              clickable
              @click="openTaskDetails(task)">
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ task.title }}</q-item-label>
                <div class="row q-mt-sm items-center">
                  <q-badge :color="getStatusColor(task.status)" :label="formatStatus(task.status)" />
                  <q-space />
                  <div class="text-caption text-grey">
                    Created: {{ new Date(task.created_at).toLocaleDateString() }}
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>

          <q-card-section v-if="!loading && tasks.length === 0" class="text-center text-grey">
            No tasks found. Create your first task!
          </q-card-section>
        </q-card>
      </div>
    </q-page-container>

    <!-- Task Details Dialog -->
    <q-dialog v-model="showTaskDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ selectedTask?.title }}</div>
          <div class="text-subtitle2 q-mt-sm">
            Status:
            <q-badge :color="getStatusColor(selectedTask?.status)" :label="formatStatus(selectedTask?.status)" />
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>{{ selectedTask?.description }}</p>
          <div class="text-caption text-grey q-mt-sm">
            Created: {{ new Date(selectedTask?.created_at).toLocaleString() }}
          </div>
          <div class="text-caption text-grey">
            Last Updated: {{ new Date(selectedTask?.updated_at).toLocaleString() }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Edit" color="primary" @click="() => {}" />
          <q-btn flat label="Delete" color="negative" @click="deleteTask(selectedTask?.id)" />
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<style scoped>
.tasks-page {
  max-width: 800px;
  margin: auto;
  margin-top: 4rem;
  width: 100%;
}

.tasks-card {
  border-radius: 8px;
  width: 100%;
}

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

@media (max-width: 600px) {
  .tasks-page {
    padding: 12px;
  }
}
</style>

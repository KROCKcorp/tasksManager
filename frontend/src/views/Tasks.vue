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
  QInput,
  QSelect,
  QForm,
} from 'quasar';

const router = useRouter();
const tasks = ref([]);
const loading = ref(true);
const selectedTask = ref(null);
const showTaskDialog = ref(false);
const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const newTask = ref({
  title: '',
  description: '',
  status: 'pending',
});

const username = ref(localStorage.getItem('username'));

const statusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
];

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

const openEditDialog = (task) => {
  selectedTask.value = { ...task };
  showTaskDialog.value = false;
  showEditDialog.value = true;
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

const createTask = async () => {
  try {
    if (!newTask.value.title) {
      Notify.create({ type: 'negative', message: 'Title is required' });
      return;
    }

    await api.post('/tasks', newTask.value);
    Notify.create({ type: 'positive', message: 'Task created successfully' });
    fetchTasks();
    showCreateDialog.value = false;
    resetNewTask();
  } catch (error) {
    Notify.create({ type: 'negative', message: error.response?.data?.msg || 'Failed to create task' });
  }
};

const updateTask = async () => {
  try {
    if (!selectedTask.value.title) {
      Notify.create({ type: 'negative', message: 'Title is required' });
      return;
    }

    await api.put(`/tasks/${selectedTask.value.id}`, {
      title: selectedTask.value.title,
      description: selectedTask.value.description,
      status: selectedTask.value.status,
    });

    Notify.create({ type: 'positive', message: 'Task updated successfully' });
    fetchTasks();
    showEditDialog.value = false;
  } catch (error) {
    Notify.create({ type: 'negative', message: error.response?.data?.msg || 'Failed to update task' });
  }
};

const resetNewTask = () => {
  newTask.value = {
    title: '',
    description: '',
    status: 'pending',
  };
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
          <q-card-section class="row justify-between items-center">
            <div class="text-h6">Your Tasks</div>
            <q-btn
              round
              dense
              color="white"
              text-color="primary"
              icon="add"
              @click="showCreateDialog = true"
              class="q-mr-sm" />
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
      <q-card style="width: 800px; max-width: 90vw; margin-top: 100px; border-radius: 8px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h4 text-weight-bold">{{ selectedTask?.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-md">
          <div class="row items-center q-mb-md">
            <div class="text-subtitle1 text-weight-medium">Status:&nbsp;</div>
            <q-badge
              :color="getStatusColor(selectedTask?.status)"
              :label="formatStatus(selectedTask?.status)"
              class="text-h6" />
          </div>

          <div class="text-h6 text-weight-medium q-mb-sm">Description:</div>
          <q-card bordered flat class="q-pa-md" style="border-radius: 8px">
            <p class="text-body1" style="word-break: break-word; white-space: pre-wrap; margin: 0">
              {{ selectedTask?.description }}
            </p>
          </q-card>
        </q-card-section>

        <q-card-section class="text-caption text-grey q-pt-none">
          <div>Created: {{ new Date(selectedTask?.created_at).toLocaleString() }}</div>
          <div>Last Updated: {{ new Date(selectedTask?.updated_at).toLocaleString() }}</div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Edit" color="primary" v-close-popup @click="openEditDialog(selectedTask)" />
          <q-btn flat label="Delete" color="negative" v-close-popup @click="deleteTask(selectedTask?.id)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Create Task Dialog -->
    <q-dialog v-model="showCreateDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Create New Task</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="createTask">
            <q-input
              v-model="newTask.title"
              label="Title"
              filled
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please enter a title']"
              class="q-mb-md" />

            <q-input v-model="newTask.description" label="Description" filled type="textarea" class="q-mb-md" />

            <q-select
              v-model="newTask.status"
              :options="statusOptions"
              label="Status"
              filled
              map-options
              emit-value
              class="q-mb-md" />

            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="negative" v-close-popup @click="resetNewTask" />
              <q-btn flat label="Create Task" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Edit Task Dialog -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Edit Task</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="updateTask">
            <q-input
              v-model="selectedTask.title"
              label="Title"
              filled
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Please enter a title']"
              class="q-mb-md" />

            <q-input v-model="selectedTask.description" label="Description" filled type="textarea" class="q-mb-md" />

            <q-select
              v-model="selectedTask.status"
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

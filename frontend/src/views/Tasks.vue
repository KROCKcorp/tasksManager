<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import TasksList from '../components/TasksList.vue';
import TaskDetailsDialog from '../components/TaskDetailsDialog.vue';
import CreateTaskDialog from '../components/CreateTaskDialog.vue';
import EditTaskDialog from '../components/EditTaskDialog.vue';
import { QLayout, QHeader, QToolbar, QToolbarTitle, QPageContainer, QCard, QCardSection, QBtn, Notify } from 'quasar';

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

          <TasksList
            :tasks="tasks"
            :loading="loading"
            @task-clicked="openTaskDetails"
            :get-status-color="getStatusColor"
            :format-status="formatStatus" />
        </q-card>
      </div>
    </q-page-container>

    <TaskDetailsDialog
      v-model="showTaskDialog"
      :task="selectedTask"
      :get-status-color="getStatusColor"
      :format-status="formatStatus"
      @edit="openEditDialog"
      @delete="deleteTask" />

    <CreateTaskDialog
      v-model="showCreateDialog"
      v-model:new-task="newTask"
      :status-options="statusOptions"
      @create="createTask"
      @reset="resetNewTask" />

    <EditTaskDialog
      v-model="showEditDialog"
      v-model:task="selectedTask"
      :status-options="statusOptions"
      @update="updateTask" />
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

@media (max-width: 600px) {
  .tasks-page {
    padding: 12px;
  }
}
</style>

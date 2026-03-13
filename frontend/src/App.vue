<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { jsPDF } from "jspdf";
import {
  createProject,
  getProjects,
  type Project,
} from "./modules/project/project.api";
import {
  generatePRD,
  getPRDById,
  getPRDsByProject,
  updatePRD,
  type PRD,
  type PRDSummary,
} from "./modules/prd/prd.api";
import { createDiscoveryAnswer } from "./modules/discovery/discovery.api";

const projects = ref<Project[]>([]);
const selectedProjectId = ref("");
const selectedPRDId = ref("");
const projectPRDs = ref<PRDSummary[]>([]);
const selectedPRD = ref<PRD | null>(null);
const editorContent = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const loadingProjects = ref(false);
const loadingPRDs = ref(false);
const loadingPRDDetail = ref(false);
const generatingPRD = ref(false);
const savingPRD = ref(false);
const creatingProject = ref(false);
const savingDiscovery = ref(false);

const newProjectName = ref("");
const newProjectIdea = ref("");
const discoveryQuestion = ref("What primary problem does this product solve?");
const discoveryAnswer = ref("");

const selectedProject = computed(() =>
  projects.value.find((project) => project.id === selectedProjectId.value),
);

const renderedPreview = computed(() => {
  const parsed = marked.parse(editorContent.value || "");
  const html = typeof parsed === "string" ? parsed : "";
  return DOMPurify.sanitize(html);
});

async function loadProjects() {
  loadingProjects.value = true;
  errorMessage.value = "";

  try {
    const response = await getProjects();
    projects.value = response;

    if (!selectedProjectId.value && response.length > 0) {
      selectedProjectId.value = response[0].id;
    }
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    loadingProjects.value = false;
  }
}

async function handleCreateProject() {
  if (!newProjectName.value.trim() || !newProjectIdea.value.trim()) {
    errorMessage.value = "Enter a name and idea to create the project.";
    return;
  }

  creatingProject.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const created = await createProject(
      newProjectName.value.trim(),
      newProjectIdea.value.trim(),
    );

    newProjectName.value = "";
    newProjectIdea.value = "";
    successMessage.value = "Project created successfully.";

    await loadProjects();
    selectedProjectId.value = created.id;
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    creatingProject.value = false;
  }
}

async function loadProjectPRDs(projectId: string) {
  loadingPRDs.value = true;
  selectedPRD.value = null;
  editorContent.value = "";
  selectedPRDId.value = "";

  try {
    const response = await getPRDsByProject(projectId);
    projectPRDs.value = response;

    if (response.length > 0) {
      selectedPRDId.value = response[0].id;
    }
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    loadingPRDs.value = false;
  }
}

async function loadPRD(projectId: string, prdId: string) {
  loadingPRDDetail.value = true;

  try {
    const prd = await getPRDById(projectId, prdId);
    selectedPRD.value = prd;
    editorContent.value = prd.content;
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    loadingPRDDetail.value = false;
  }
}

async function handleGeneratePRD() {
  if (!selectedProjectId.value) {
    errorMessage.value = "Select a project before generating a PRD.";
    return;
  }

  generatingPRD.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // If the user typed a new discovery answer, persist it before generating.
    if (discoveryQuestion.value.trim() && discoveryAnswer.value.trim()) {
      await createDiscoveryAnswer(
        selectedProjectId.value,
        discoveryQuestion.value.trim(),
        discoveryAnswer.value.trim(),
      );
      discoveryAnswer.value = "";
    }

    const generated = await generatePRD(selectedProjectId.value);
    successMessage.value = "PRD generated successfully.";

    await loadProjectPRDs(selectedProjectId.value);
    selectedPRDId.value = generated.id;
    await loadPRD(selectedProjectId.value, generated.id);
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes("No discovery answers found")) {
      errorMessage.value =
        "No discovery answers found. Fill in an answer and save it, or click generate with the answer filled in.";
    } else {
      errorMessage.value = message;
    }
  } finally {
    generatingPRD.value = false;
  }
}

async function handleSaveDiscoveryAnswer() {
  if (!selectedProjectId.value) {
    errorMessage.value = "Select a project before submitting discovery.";
    return;
  }

  if (!discoveryQuestion.value.trim() || !discoveryAnswer.value.trim()) {
    errorMessage.value =
      "Fill in both the discovery question and answer to continue.";
    return;
  }

  savingDiscovery.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await createDiscoveryAnswer(
      selectedProjectId.value,
      discoveryQuestion.value.trim(),
      discoveryAnswer.value.trim(),
    );

    successMessage.value = "Discovery answer saved successfully.";
    discoveryAnswer.value = "";
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    savingDiscovery.value = false;
  }
}

async function handleSavePRD() {
  if (!selectedProjectId.value || !selectedPRDId.value) {
    errorMessage.value = "Select a PRD to save.";
    return;
  }

  savingPRD.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const updated = await updatePRD(
      selectedProjectId.value,
      selectedPRDId.value,
      editorContent.value,
    );

    selectedPRD.value = updated;
    successMessage.value = "PRD saved successfully.";
    await loadProjectPRDs(selectedProjectId.value);
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    savingPRD.value = false;
  }
}

function handleExportPDF() {
  if (!editorContent.value.trim()) {
    errorMessage.value = "There is no content to export.";
    return;
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 42;
  const lineHeight = 16;
  const maxWidth = pageWidth - margin * 2;

  doc.setFont("courier", "normal");
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(editorContent.value, maxWidth);
  let y = margin;

  for (const line of lines) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }

    doc.text(line, margin, y);
    y += lineHeight;
  }

  const slug =
    selectedProject.value?.name
      ?.toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "") || "project";

  doc.save(`prd-${slug}.pdf`);
}

watch(selectedProjectId, async (projectId) => {
  if (!projectId) {
    projectPRDs.value = [];
    selectedPRD.value = null;
    editorContent.value = "";
    return;
  }

  await loadProjectPRDs(projectId);
});

watch(selectedPRDId, async (prdId) => {
  if (!prdId || !selectedProjectId.value) {
    selectedPRD.value = null;
    editorContent.value = "";
    return;
  }

  await loadPRD(selectedProjectId.value, prdId);
});

onMounted(async () => {
  await loadProjects();
});
</script>

<template>
  <div class="app-shell">
    <header class="hero">
      <div>
        <p class="eyebrow">AI Product Co-Pilot</p>
        <h1>Pridia PRD Studio</h1>
        <p>
          Generate, edit, preview, and export PRDs with a richer visual
          experience.
        </p>
      </div>
      <button
        class="primary-action"
        :disabled="generatingPRD || !selectedProjectId"
        @click="handleGeneratePRD"
      >
        {{ generatingPRD ? "Generating PRD..." : "Generate New PRD" }}
      </button>
    </header>

    <main class="layout">
      <section class="panel create-panel">
        <h2>New Project</h2>
        <input
          v-model="newProjectName"
          class="field"
          type="text"
          placeholder="Project name"
        />
        <textarea
          v-model="newProjectIdea"
          class="field field-area"
          placeholder="Describe the product idea"
        />
        <button
          class="secondary-action"
          :disabled="creatingProject"
          @click="handleCreateProject"
        >
          {{ creatingProject ? "Creating..." : "Create Project" }}
        </button>
      </section>

      <section class="panel">
        <h2>Projects</h2>
        <div v-if="loadingProjects" class="state">Loading projects...</div>
        <ul v-else class="list">
          <li v-for="project in projects" :key="project.id">
            <button
              class="item-btn"
              :class="{ active: selectedProjectId === project.id }"
              @click="selectedProjectId = project.id"
            >
              <strong>{{ project.name }}</strong>
              <span>{{ project.idea }}</span>
            </button>
          </li>
        </ul>
      </section>

      <section class="panel">
        <h2>Project PRDs</h2>
        <p v-if="selectedProject" class="meta">{{ selectedProject.name }}</p>
        <div v-if="loadingPRDs" class="state">Loading PRDs...</div>
        <ul v-else class="list">
          <li v-for="prd in projectPRDs" :key="prd.id">
            <button
              class="item-btn"
              :class="{ active: selectedPRDId === prd.id }"
              @click="selectedPRDId = prd.id"
            >
              <strong>{{ prd.id }}</strong>
              <span>{{ prd.preview ?? "No preview" }}</span>
            </button>
          </li>
          <li v-if="projectPRDs.length === 0" class="state">
            No PRDs found for this project.
          </li>
        </ul>
      </section>

      <section class="panel discovery-panel">
        <h2>Discovery</h2>
        <p class="meta">
          Add at least one answer before generating a new PRD.
        </p>
        <textarea
          v-model="discoveryQuestion"
          class="field discovery-question"
          placeholder="Question"
        />
        <textarea
          v-model="discoveryAnswer"
          class="field field-area"
          placeholder="Discovery answer"
        />
        <button
          class="secondary-action"
          :disabled="savingDiscovery || !selectedProjectId"
          @click="handleSaveDiscoveryAnswer"
        >
          {{ savingDiscovery ? "Saving discovery..." : "Save Answer" }}
        </button>
      </section>

      <section class="panel editor-panel">
        <div class="editor-header">
          <h2>PRD Editor</h2>
          <div class="editor-actions">
            <button
              class="secondary-action"
              :disabled="savingPRD || !selectedPRDId"
              @click="handleSavePRD"
            >
              {{ savingPRD ? "Saving..." : "Save" }}
            </button>
            <button class="secondary-action" @click="handleExportPDF">
              Export PDF
            </button>
          </div>
        </div>

        <div v-if="loadingPRDDetail" class="state">Opening PRD...</div>

        <div v-else class="editor-grid">
          <div>
            <p class="mini-title">Markdown</p>
            <textarea
              v-model="editorContent"
              class="editor-area"
              placeholder="Edit your PRD in Markdown"
            />
          </div>
          <div>
            <p class="mini-title">Preview</p>
            <article class="preview" v-html="renderedPreview"></article>
          </div>
        </div>
      </section>
    </main>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

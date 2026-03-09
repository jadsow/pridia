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
const discoveryQuestion = ref("Qual problema principal este produto resolve?");
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
    errorMessage.value = "Informe nome e ideia para criar o projeto.";
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
    successMessage.value = "Projeto criado com sucesso.";

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
    errorMessage.value = "Selecione um projeto antes de gerar o PRD.";
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
    successMessage.value = "PRD gerado com sucesso.";

    await loadProjectPRDs(selectedProjectId.value);
    selectedPRDId.value = generated.id;
    await loadPRD(selectedProjectId.value, generated.id);
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes("No discovery answers found")) {
      errorMessage.value =
        "Nenhuma resposta de discovery encontrada. Preencha a resposta e salve, ou clique em gerar com a resposta preenchida.";
    } else {
      errorMessage.value = message;
    }
  } finally {
    generatingPRD.value = false;
  }
}

async function handleSaveDiscoveryAnswer() {
  if (!selectedProjectId.value) {
    errorMessage.value = "Selecione um projeto antes de enviar discovery.";
    return;
  }

  if (!discoveryQuestion.value.trim() || !discoveryAnswer.value.trim()) {
    errorMessage.value =
      "Preencha a pergunta e a resposta de discovery para continuar.";
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

    successMessage.value = "Resposta de discovery salva com sucesso.";
    discoveryAnswer.value = "";
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    savingDiscovery.value = false;
  }
}

async function handleSavePRD() {
  if (!selectedProjectId.value || !selectedPRDId.value) {
    errorMessage.value = "Selecione um PRD para salvar.";
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
    successMessage.value = "PRD salvo com sucesso.";
    await loadProjectPRDs(selectedProjectId.value);
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    savingPRD.value = false;
  }
}

function handleExportPDF() {
  if (!editorContent.value.trim()) {
    errorMessage.value = "Nao ha conteudo para exportar.";
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
          Gere, edite, visualize e exporte PRDs com uma experiencia visual mais
          completa.
        </p>
      </div>
      <button
        class="primary-action"
        :disabled="generatingPRD || !selectedProjectId"
        @click="handleGeneratePRD"
      >
        {{ generatingPRD ? "Gerando PRD..." : "Gerar Novo PRD" }}
      </button>
    </header>

    <main class="layout">
      <section class="panel create-panel">
        <h2>Novo Projeto</h2>
        <input
          v-model="newProjectName"
          class="field"
          type="text"
          placeholder="Nome do projeto"
        />
        <textarea
          v-model="newProjectIdea"
          class="field field-area"
          placeholder="Descreva a ideia do produto"
        />
        <button
          class="secondary-action"
          :disabled="creatingProject"
          @click="handleCreateProject"
        >
          {{ creatingProject ? "Criando..." : "Criar Projeto" }}
        </button>
      </section>

      <section class="panel">
        <h2>Projetos</h2>
        <div v-if="loadingProjects" class="state">Carregando projetos...</div>
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
        <h2>PRDs do Projeto</h2>
        <p v-if="selectedProject" class="meta">{{ selectedProject.name }}</p>
        <div v-if="loadingPRDs" class="state">Buscando PRDs...</div>
        <ul v-else class="list">
          <li v-for="prd in projectPRDs" :key="prd.id">
            <button
              class="item-btn"
              :class="{ active: selectedPRDId === prd.id }"
              @click="selectedPRDId = prd.id"
            >
              <strong>{{ prd.id }}</strong>
              <span>{{ prd.preview ?? "Sem preview" }}</span>
            </button>
          </li>
          <li v-if="projectPRDs.length === 0" class="state">
            Nenhum PRD encontrado para este projeto.
          </li>
        </ul>
      </section>

      <section class="panel discovery-panel">
        <h2>Discovery</h2>
        <p class="meta">
          Adicione ao menos uma resposta antes de gerar um novo PRD.
        </p>
        <textarea
          v-model="discoveryQuestion"
          class="field discovery-question"
          placeholder="Pergunta"
        />
        <textarea
          v-model="discoveryAnswer"
          class="field field-area"
          placeholder="Resposta da discovery"
        />
        <button
          class="secondary-action"
          :disabled="savingDiscovery || !selectedProjectId"
          @click="handleSaveDiscoveryAnswer"
        >
          {{ savingDiscovery ? "Salvando discovery..." : "Salvar Resposta" }}
        </button>
      </section>

      <section class="panel editor-panel">
        <div class="editor-header">
          <h2>Editor de PRD</h2>
          <div class="editor-actions">
            <button
              class="secondary-action"
              :disabled="savingPRD || !selectedPRDId"
              @click="handleSavePRD"
            >
              {{ savingPRD ? "Salvando..." : "Salvar" }}
            </button>
            <button class="secondary-action" @click="handleExportPDF">
              Exportar PDF
            </button>
          </div>
        </div>

        <div v-if="loadingPRDDetail" class="state">Abrindo PRD...</div>

        <div v-else class="editor-grid">
          <div>
            <p class="mini-title">Markdown</p>
            <textarea
              v-model="editorContent"
              class="editor-area"
              placeholder="Edite seu PRD em Markdown"
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

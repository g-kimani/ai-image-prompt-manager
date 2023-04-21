class PromptManager {
  constructor(targetArea) {
    this.targetTextField = targetArea;
    this.superPrompts = {};
    this.creatingPrompt = false;
    this.promptDesigner = document.querySelector(
      "body > div.promptContainer > div.promptDesigner"
    );
    this.promptList = document.querySelector(
      "body > div.promptContainer > div.savedPrompts"
    );
    this.pickingTargetArea = false;
    this.editingPrompt = false;
    this.bindButtons();
    this.loadLocalStorage();
  }
  bindButtons() {
    this.targetPicker = document.getElementById("targetPicker");
    this.newPromptBtn = document.getElementById("newPromptBtn");
    this.savePromptBtn = document.getElementById("savePromptBtn");
    this.clearPromptsBtn = document.getElementById("clearPromptsBtn");

    this.targetPicker.addEventListener("click", (event) =>
      this.startPickingTarget(event)
    );
    this.newPromptBtn.addEventListener("click", (event) => {
      this.creatingPrompt = true;
      this.showPromptDesigner(event);
    });
    this.savePromptBtn.addEventListener("click", (event) =>
      this.savePrompt(event)
    );
    this.clearPromptsBtn.addEventListener("click", (event) => {
      this.clearLocalStorage(event);
    });
  }
  loadLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
      const title = localStorage.key(i);
      const prompts = localStorage.getItem(title);
      this.superPrompts[title] = prompts;
      this.createPromptDisplay({ title, prompts });
    }
  }
  clearLocalStorage() {
    localStorage.clear();
    this.superPrompts = {};
    this.updatePromptsList();
  }
  clearPromptsList() {
    while (this.promptList.firstChild) {
      this.promptList.removeChild(this.promptList.firstChild);
    }
  }
  updatePromptsList() {
    this.clearPromptsList();
    Object.keys(this.superPrompts).forEach((title) => {
      const prompts = this.superPrompts[title];
      this.createPromptDisplay({ title, prompts });
    });
  }
  startPickingTarget(event) {
    event.stopPropagation();
    this.targetPicker.textContent = "Choosing target";
    this.pickingTargetArea = true;
    document.addEventListener("click", this.chooseTarget.bind(this));
  }
  chooseTarget(event) {
    if (this.pickingTargetArea) {
      this.targetTextField = event.target;
      this.targetPicker.textContent = "Choose target";
      this.pickingTargetArea = false;
      document.removeEventListener("click", this.chooseTarget.bind(this));
    }
  }
  showPromptDesigner(event) {
    event.stopPropagation();
    this.savePromptBtn.classList.remove("hide");
    this.newPromptBtn.classList.add("hide");
    this.promptDesigner.classList.remove("hide");
  }
  savePrompt(event) {
    event.stopPropagation();
    const titleInput = this.promptDesigner.querySelector("input");
    const promptsInput = this.promptDesigner.querySelector("textarea");
    const title = titleInput.value;
    const prompts = promptsInput.value;
    this.addPrompt({ title, prompts });

    //clear form
    titleInput.value = "";
    promptsInput.value = "";
    // reset buttons
    if (this.editingPrompt) {
      this.editingPrompt = false;
    } else {
      this.creatingPrompt = false;
    }
    this.newPromptBtn.classList.remove("hide");
    this.savePromptBtn.classList.add("hide");
    // hide form
    this.promptDesigner.classList.add("hide");
    console.log(localStorage);
  }
  addPrompt(prompt) {
    // TODO: Prompt validation
    this.superPrompts[prompt.title] = prompt.prompts;
    localStorage.setItem(prompt.title, prompt.prompts);
    this.createPromptDisplay(prompt);
  }
  createPromptDisplay(prompt) {
    const display = document.querySelector(
      "body > div.promptContainer > div.savedPrompts"
    );
    const promptDiv = document.createElement("div");
    promptDiv.classList.add("prompt");

    const title = document.createElement("div");
    title.classList.add("title");
    title.textContent = prompt.title;
    promptDiv.appendChild(title);

    const pastePrompt = document.createElement("button");
    pastePrompt.textContent = "paste";
    pastePrompt.addEventListener("click", (event) => {
      // checks if the targetTextField has any text
      const prefix = this.targetTextField.value.length > 0 ? ", " : "";
      this.targetTextField.value += `${prefix}${prompt.prompts}`;
    });
    promptDiv.appendChild(pastePrompt);

    const deletePrompt = document.createElement("button");
    deletePrompt.textContent = "delete";
    deletePrompt.addEventListener("click", (event) => {
      this.deletePrompt(prompt);
    });
    promptDiv.appendChild(deletePrompt);

    const editPrompt = document.createElement("button");
    editPrompt.textContent = "edit";
    editPrompt.addEventListener("click", (event) => {
      this.editPrompt(event, prompt);
    });
    promptDiv.appendChild(editPrompt);

    display.appendChild(promptDiv);
  }
  editPrompt(event, prompt) {
    const titleInput = this.promptDesigner.querySelector("input");
    const promptsInput = this.promptDesigner.querySelector("textarea");
    titleInput.value = prompt.title;
    promptsInput.value = prompt.prompts;
    this.editingPrompt = true;
    this.deletePrompt(prompt);
    this.showPromptDesigner(event);
  }
  deletePrompt(prompt) {
    localStorage.removeItem(prompt.title);
    delete this.superPrompts[prompt.title];
    this.updatePromptsList();
  }
}

const textArea = document.querySelector("body > div.textTarget > textarea");

const manager = new PromptManager(textArea);

class PromptManager {
  constructor(targetArea) {
    this.targetTextField = targetArea;
    this.superPrompts = {};
    this.creatingPrompt = false;
    this.promptDesigner = document.querySelector(
      "body > div.promptContainer > div.promptDesigner"
    );
    this.pickingTargetArea = false;
    this.bindButtons();
  }
  bindButtons() {
    this.targetPicker = document.getElementById("targetPicker");
    this.newPromptBtn = document.getElementById("newPromptBtn");
    this.savePromptBtn = document.getElementById("savePromptBtn");

    this.targetPicker.addEventListener("click", (event) =>
      this.startPickingTarget(event)
    );
    this.newPromptBtn.addEventListener("click", (event) =>
      this.showPromptDesigner(event)
    );
    this.savePromptBtn.addEventListener("click", (event) =>
      this.savePrompt(event)
    );
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
      this.targetPicker.textContent = "Choosing target";
      this.pickingTargetArea = false;
      document.removeEventListener("click", this.chooseTarget.bind(this));
    }
  }
  showPromptDesigner(event) {
    event.stopPropagation();
    this.creatingPrompt = true;
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
    this.creatingPrompt = false;
    this.newPromptBtn.classList.remove("hide");
    this.savePromptBtn.classList.add("hide");
    // hide form
    this.promptDesigner.classList.add("hide");
  }
  addPrompt(prompt) {
    // TODO: Prompt validation
    this.superPrompts[prompt.title] = prompt.prompts;
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

    display.appendChild(promptDiv);
  }
}

const textArea = document.querySelector("body > div.textTarget > textarea");

const manager = new PromptManager(textArea);

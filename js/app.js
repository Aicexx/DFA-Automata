/* =========================================================
   DFA AUTOMATA DESIGNER — COMPLETE SYSTEM UPGRADE & SOLVER
   Interactive Finite Automaton Designer, Simulator & Solver
========================================================= */

/* =========================================================
   DOM ELEMENTS
========================================================= */
const canvas = document.getElementById("dfaCanvas");
const ctx = canvas.getContext("2d");
const canvasWrapper = document.getElementById("canvasWrapper");
const canvasHint = document.getElementById("canvasHint");
const toolStatus = document.getElementById("toolStatus");
const toolStatusDot = document.getElementById("toolStatusDot");

/* LEFT COLUMN ELEMENTS */
const alphabetInput = document.getElementById("alphabet");
const setAlphabetBtn = document.getElementById("setAlphabetBtn");
const alphabetDisplay = document.getElementById("alphabetDisplay");
const alphabetDisplayText = document.getElementById("alphabetDisplayText");

const stateNamingDropdown = document.getElementById("stateNamingDropdown");
const stateNamingTrigger = document.getElementById("stateNamingTrigger");
const stateNamingMenu = document.getElementById("stateNamingMenu");
const stateNamingLabel = document.getElementById("stateNamingLabel");
const stateNamingMode = document.getElementById("stateNamingMode");
const customStateName = document.getElementById("customStateName");
const addCustomStateBtn = document.getElementById("addCustomStateBtn");

const examplesList = document.getElementById("examplesList");

const problemDescriptionInput = document.getElementById("problemDescriptionInput");
const generateDfaBtn = document.getElementById("generateDfaBtn");
const problemSolverFeedback = document.getElementById("problemSolverFeedback");

const projectNewBtn = document.getElementById("projectNewBtn");
const projectOpenBtn = document.getElementById("projectOpenBtn");
const projectSaveBtn = document.getElementById("projectSaveBtn");
const projectExportJsonBtn = document.getElementById("projectExportJsonBtn");
const projectExportPngBtn = document.getElementById("projectExportPngBtn");
const projectExportSvgBtn = document.getElementById("projectExportSvgBtn");
const projectFileInput = document.getElementById("projectFileInput");

/* CANVAS HEADER */
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const clearBtn = document.getElementById("clearBtn");

/* LOWER WORKSPACE ELEMENTS */
const transitionTable = document.getElementById("transitionTable");

const exampleTitle = document.getElementById("exampleTitle");
const exampleAlphabetBadge = document.getElementById("exampleAlphabetBadge");
const exampleDescriptionText = document.getElementById("exampleDescriptionText");
const exampleTestCasesList = document.getElementById("exampleTestCasesList");

const inputString = document.getElementById("inputString");
const runBtn = document.getElementById("runBtn");
const result = document.getElementById("result");
const executionPath = document.getElementById("executionPath");
const stepTraceToggle = document.getElementById("stepTraceToggle");
const executionResult = document.getElementById("executionResult");

const validationStatusCard = document.getElementById("validationStatusCard");
const valStatusTitle = document.getElementById("valStatusTitle");
const valStatusSubtitle = document.getElementById("valStatusSubtitle");
const validationChecklist = document.getElementById("validationChecklist");
const valInitialText = document.getElementById("valInitialText");
const valAcceptingText = document.getElementById("valAcceptingText");
const valMissingText = document.getElementById("valMissingText");
const completeDfaBtn = document.getElementById("completeDfaBtn");

/* RIGHT COLUMN ELEMENTS */
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const resetViewBtn = document.getElementById("resetViewBtn");
const fitCanvasBtn = document.getElementById("fitCanvasBtn");
const autoArrangeBtn = document.getElementById("autoArrangeBtn");

const execPrevBtn = document.getElementById("execPrevBtn");
const execPlayBtn = document.getElementById("execPlayBtn");
const execPauseBtn = document.getElementById("execPauseBtn");
const execNextBtn = document.getElementById("execNextBtn");
const execResetBtn = document.getElementById("execResetBtn");
const execSpeedSlider = document.getElementById("execSpeedSlider");
const execSpeedDisplay = document.getElementById("execSpeedDisplay");

const activityHistory = document.getElementById("activityHistory");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

/* TOPBAR & MODALS */
const navWorkspaceBtn = document.getElementById("navWorkspaceBtn");
const navExamplesBtn = document.getElementById("navExamplesBtn");
const navProblemBtn = document.getElementById("navProblemBtn");
const navValidateBtn = document.getElementById("navValidateBtn");
const navHistoryBtn = document.getElementById("navHistoryBtn");

const themeTogglePill = document.getElementById("themeTogglePill");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettingsBtn");
const saveSettingsBtn = document.getElementById("saveSettingsBtn");
const settingShowGrid = document.getElementById("settingShowGrid");
const settingSnapGrid = document.getElementById("settingSnapGrid");
const settingAutoValidate = document.getElementById("settingAutoValidate");

const menuBtn = document.getElementById("menuBtn");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const navigationDrawer = document.getElementById("navigationDrawer");
const menuOverlay = document.getElementById("menuOverlay");
const drawerUndoBtn = document.getElementById("drawerUndoBtn");
const drawerRedoBtn = document.getElementById("drawerRedoBtn");
const drawerThemeBtn = document.getElementById("drawerThemeBtn");
const drawerClearBtn = document.getElementById("drawerClearBtn");

/* =========================================================
   DFA DATA MODEL & ENGINE STATE
========================================================= */
let alphabet = ["0", "1"];
let states = [];
let transitions = []; // Each item: { id, from, to, symbol, curveOffset }
let stateCounter = 0;
let namingMode = "q"; // "q", "letters", "lowercase", "custom"

let selectedState = null;
let selectedTransition = null;
let transitionStart = null;
let currentTool = "create"; // "create", "transition", "move", "delete"

/* CANVAS VIEW TRANSFORM (ZOOM & PAN) */
let zoomScale = 1.0;
let panX = 0;
let panY = 0;
let isPanning = false;
let startPanX = 0;
let startPanY = 0;

/* DRAGGING STATES & CURVES */
let isDraggingState = false;
let draggedState = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isDraggingCurve = false;
let draggedTransitionGroup = null;

/* HISTORY & UNDO/REDO */
let undoStack = [];
let redoStack = [];
let activityLog = [];

/* SETTINGS */
let showGrid = true;
let snapToGrid = false;
let autoValidate = true;

/* CONSTANTS */
const STATE_RADIUS = 34;
const ARROW_SIZE = 10;
const GRID_SIZE = 32;

/* INTERACTIVE EXECUTION ENGINE */
let executionTrace = [];
let currentTraceIndex = 0;
let isPlaying = false;
let playInterval = null;
let executionSpeed = 500;
let activeExecutionState = null;
let activeTransitionRule = null;

/* CURRENT LOADED EXAMPLE METADATA */
let currentExampleMeta = {
    title: "Binary strings ending in 1",
    alphabet: "{ 0, 1 }",
    description: "This DFA accepts all binary strings that end with 1.",
    testCases: [
        { input: "101", expected: true },
        { input: "100", expected: false },
        { input: "1", expected: true },
        { input: "0", expected: false },
        { input: "111", expected: true }
    ]
};

/* =========================================================
   SNAPSHOT & UNDO / REDO
========================================================= */
function createSnapshot() {
    return {
        alphabet: JSON.parse(JSON.stringify(alphabet)),
        states: JSON.parse(JSON.stringify(states)),
        transitions: JSON.parse(JSON.stringify(transitions)),
        stateCounter,
        namingMode
    };
}

function saveHistory(actionDescription) {
    undoStack.push(createSnapshot());
    if (undoStack.length > 50) undoStack.shift();
    redoStack = [];
}

function restoreSnapshot(snapshot) {
    alphabet = JSON.parse(JSON.stringify(snapshot.alphabet));
    states = JSON.parse(JSON.stringify(snapshot.states));
    transitions = JSON.parse(JSON.stringify(snapshot.transitions));
    stateCounter = snapshot.stateCounter || 0;
    namingMode = snapshot.namingMode || "q";

    // Synchronize state naming UI
    if (stateNamingMode) {
        stateNamingMode.value = namingMode;
    }
    if (stateNamingMenu) {
        stateNamingMenu.querySelectorAll(".dropdown-option").forEach(opt => {
            const isMatch = opt.dataset.value === namingMode;
            opt.classList.toggle("selected", isMatch);
            opt.setAttribute("aria-selected", isMatch ? "true" : "false");
            if (isMatch && stateNamingLabel) {
                stateNamingLabel.textContent = opt.querySelector(".option-text").textContent;
            }
        });
    }
    if (customStateName) {
        customStateName.disabled = (namingMode !== "custom");
    }

    selectedState = null;
    selectedTransition = null;
    transitionStart = null;
    activeExecutionState = null;
    activeTransitionRule = null;
    executionTrace = [];
    currentTraceIndex = 0;
    pauseExecution();

    updateAll();
}

function undo() {
    if (undoStack.length === 0) return;
    redoStack.push(createSnapshot());
    const snapshot = undoStack.pop();
    restoreSnapshot(snapshot);
    addActivity("Undo previous action");
}

function redo() {
    if (redoStack.length === 0) return;
    undoStack.push(createSnapshot());
    const snapshot = redoStack.pop();
    restoreSnapshot(snapshot);
    addActivity("Redo action");
}

/* =========================================================
   COORDINATE TRANSFORMATION (CANVAS ZOOM & PAN)
========================================================= */
function toWorldCoords(screenX, screenY) {
    const rect = canvas.getBoundingClientRect();
    const x = (screenX - rect.left - panX) / zoomScale;
    const y = (screenY - rect.top - panY) / zoomScale;
    return { x, y };
}

function toScreenCoords(worldX, worldY) {
    return {
        x: worldX * zoomScale + panX,
        y: worldY * zoomScale + panY
    };
}

/* =========================================================
   STATE NAMING GENERATOR (DYNAMIC, UNBOUNDED & RESET-SAFE)
========================================================= */
function indexToUppercase(num) {
    let result = "";
    num = num + 1; // 1-based: 1 -> A, 26 -> Z, 27 -> AA, 28 -> AB
    while (num > 0) {
        const rem = (num - 1) % 26;
        result = String.fromCharCode(65 + rem) + result;
        num = Math.floor((num - 1) / 26);
    }
    return result;
}

function indexToLowercase(num) {
    return indexToUppercase(num).toLowerCase();
}

function getStateNameForIndex(index) {
    if (namingMode === "q") {
        return `q${index}`;
    } else if (namingMode === "letters" || namingMode === "uppercase") {
        return indexToUppercase(index);
    } else if (namingMode === "lowercase") {
        return indexToLowercase(index);
    } else if (namingMode === "custom") {
        const val = customStateName ? customStateName.value.trim() : "";
        if (val) {
            return index === 0 ? val : `${val}${index}`;
        }
        return `S${index}`;
    }
    return `q${index}`;
}

function getNextStateName(explicitCustomName = null) {
    const existingNames = new Set(states.map(s => s.name));

    // 1. Explicit name supplied (e.g. from Add button or custom prompt)
    if (explicitCustomName && typeof explicitCustomName === "string" && explicitCustomName.trim()) {
        const trimmed = explicitCustomName.trim();
        if (!existingNames.has(trimmed)) {
            return trimmed;
        }
        let counter = 1;
        while (existingNames.has(`${trimmed}_${counter}`) || existingNames.has(`${trimmed}${counter}`)) {
            counter++;
        }
        return `${trimmed}${counter}`;
    }

    // 2. Custom style mode using input field
    if (namingMode === "custom") {
        const val = customStateName ? customStateName.value.trim() : "";
        if (val) {
            customStateName.value = "";
            if (!existingNames.has(val)) {
                return val;
            }
            let counter = 1;
            while (existingNames.has(`${val}_${counter}`) || existingNames.has(`${val}${counter}`)) {
                counter++;
            }
            return `${val}${counter}`;
        }
        // Fallback when custom text input is empty: S0, S1, S2...
        let i = 0;
        while (existingNames.has(`S${i}`)) {
            i++;
        }
        return `S${i}`;
    }

    // 3. Sequential styles: Find first available unused identifier from start
    let i = 0;
    while (true) {
        const candidate = getStateNameForIndex(i);
        if (!existingNames.has(candidate)) {
            return candidate;
        }
        i++;
    }
}

/* =========================================================
   STATE OPERATIONS
========================================================= */
function createState(worldX, worldY, customName = null) {
    saveHistory("Create state");

    let x = worldX;
    let y = worldY;
    if (snapToGrid) {
        x = Math.round(x / GRID_SIZE) * GRID_SIZE;
        y = Math.round(y / GRID_SIZE) * GRID_SIZE;
    }

    const name = getNextStateName(customName);
    const isFirstState = states.length === 0;

    const newState = {
        id: `state-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name,
        x,
        y,
        isStart: isFirstState,
        isFinal: false
    };

    states.push(newState);
    selectedState = newState;

    if (canvasHint) canvasHint.classList.add("fade-out");

    addActivity(`Created state <strong>${name}</strong>${isFirstState ? " (initial state)" : ""}`);
    updateAll();
    return newState;
}

function deleteState(state) {
    if (!state) return;
    saveHistory(`Delete state ${state.name}`);

    transitions = transitions.filter(t => t.from !== state.id && t.to !== state.id);
    states = states.filter(s => s.id !== state.id);

    if (selectedState && selectedState.id === state.id) {
        selectedState = null;
    }
    if (transitionStart && transitionStart.id === state.id) {
        transitionStart = null;
    }

    addActivity(`Deleted state <strong>${state.name}</strong>`);
    updateAll();
}

function toggleFinalState(state) {
    if (!state) return;
    saveHistory(`Toggle final state ${state.name}`);
    state.isFinal = !state.isFinal;
    addActivity(`State <strong>${state.name}</strong> set to ${state.isFinal ? "accepting" : "non-accepting"}`);
    updateAll();
}

function setStartState(state) {
    if (!state) return;
    saveHistory(`Set start state ${state.name}`);
    states.forEach(s => s.isStart = (s.id === state.id));
    addActivity(`State <strong>${state.name}</strong> designated as initial state`);
    updateAll();
}

function getStateAt(worldX, worldY) {
    for (let i = states.length - 1; i >= 0; i--) {
        const s = states[i];
        const dx = s.x - worldX;
        const dy = s.y - worldY;
        if (Math.sqrt(dx * dx + dy * dy) <= STATE_RADIUS) {
            return s;
        }
    }
    return null;
}

/* =========================================================
   GROUPED TRANSITION LOGIC (MULTIPLE SYMBOLS PER EDGE)
========================================================= */
function getTransitionGroups() {
    const groups = new Map();

    transitions.forEach(t => {
        const key = `${t.from}->${t.to}`;
        if (!groups.has(key)) {
            groups.set(key, {
                from: t.from,
                to: t.to,
                symbols: [],
                rules: [],
                curveOffset: t.curveOffset || 0
            });
        }
        const grp = groups.get(key);
        if (!grp.symbols.includes(t.symbol)) {
            grp.symbols.push(t.symbol);
        }
        grp.rules.push(t);
        if (t.curveOffset !== undefined) {
            grp.curveOffset = t.curveOffset;
        }
    });

    return Array.from(groups.values()).map(g => {
        // Natural sort symbols: 0 before 1, or alphabetical
        g.symbols.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        g.label = g.symbols.join(", ");
        return g;
    });
}

function createOrEditTransition(fromState, toState) {
    if (alphabet.length === 0) {
        alert("Please define the alphabet first.");
        return;
    }

    // Existing symbols on this directed edge
    const existingRules = transitions.filter(t => t.from === fromState.id && t.to === toState.id);
    const existingSymbols = existingRules.map(t => t.symbol);

    const promptMessage = `Transition: ${fromState.name} → ${toState.name}\n\n` +
        `Alphabet: { ${alphabet.join(", ")} }\n` +
        `Enter symbols separated by comma (e.g. 0, 1):`;

    const input = prompt(promptMessage, existingSymbols.join(", "));
    if (input === null) return; // Cancelled

    saveHistory(`Edit transition ${fromState.name} → ${toState.name}`);

    const rawSymbols = input.split(",").map(s => s.trim()).filter(s => s.length > 0);
    const uniqueSymbols = [...new Set(rawSymbols)];

    // Validate symbols against defined alphabet
    for (const sym of uniqueSymbols) {
        if (!alphabet.includes(sym)) {
            alert(`Invalid symbol "${sym}". Symbol must belong to defined alphabet: { ${alphabet.join(", ")} }`);
            return;
        }
    }

    // Check for DFA determinism conflicts with other destinations
    for (const sym of uniqueSymbols) {
        const conflict = transitions.find(t => t.from === fromState.id && t.symbol === sym && t.to !== toState.id);
        if (conflict) {
            const conflictTarget = states.find(s => s.id === conflict.to);
            alert(`DFA Determinism Conflict:\nState "${fromState.name}" already has a transition on "${sym}" to state "${conflictTarget ? conflictTarget.name : conflict.to}".\n\nA state cannot have multiple destinations for the same symbol in a DFA.`);
            return;
        }
    }

    // Remove old rules between fromState and toState
    transitions = transitions.filter(t => !(t.from === fromState.id && t.to === toState.id));

    // Add updated rules
    uniqueSymbols.forEach(sym => {
        transitions.push({
            id: `trans-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            from: fromState.id,
            to: toState.id,
            symbol: sym,
            curveOffset: 0
        });
    });

    if (uniqueSymbols.length > 0) {
        addActivity(`Added transition <strong>${fromState.name} --${uniqueSymbols.join(",")}--> ${toState.name}</strong>`);
    } else {
        addActivity(`Removed transitions between <strong>${fromState.name}</strong> and <strong>${toState.name}</strong>`);
    }

    updateAll();
}

function deleteTransitionGroup(group) {
    saveHistory(`Delete transition`);
    transitions = transitions.filter(t => !(t.from === group.from && t.to === group.to));
    selectedTransition = null;
    addActivity(`Deleted transition edge`);
    updateAll();
}

/* =========================================================
   CANVAS RENDERING ENGINE
========================================================= */
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const width = canvasWrapper.clientWidth;
    const height = canvasWrapper.clientHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
    }
    draw();
}

function draw() {
    const dpr = window.devicePixelRatio || 1;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply High DPI and Zoom & Pan Transform
    ctx.scale(dpr, dpr);
    ctx.translate(panX, panY);
    ctx.scale(zoomScale, zoomScale);

    // Draw grid if enabled
    if (showGrid) {
        drawGrid();
    }

    // Draw transition edges
    drawTransitions();

    // Draw states
    drawStates();

    // Draw temporary connection line if connecting
    if (transitionStart && currentTool === "transition") {
        drawConnectingLine();
    }

    ctx.restore();
}

function drawGrid() {
    const isLight = document.body.classList.contains("light-mode");
    ctx.save();
    ctx.strokeStyle = isLight ? "rgba(138, 77, 255, 0.07)" : "rgba(180, 100, 255, 0.06)";
    ctx.lineWidth = 1 / zoomScale;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    const startX = -panX / zoomScale - 100;
    const endX = (width - panX) / zoomScale + 100;
    const startY = -panY / zoomScale - 100;
    const endY = (height - panY) / zoomScale + 100;

    const firstX = Math.floor(startX / GRID_SIZE) * GRID_SIZE;
    const firstY = Math.floor(startY / GRID_SIZE) * GRID_SIZE;

    ctx.beginPath();
    for (let x = firstX; x <= endX; x += GRID_SIZE) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
    }
    for (let y = firstY; y <= endY; y += GRID_SIZE) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
    }
    ctx.stroke();
    ctx.restore();
}

function drawTransitions() {
    const groups = getTransitionGroups();

    groups.forEach(group => {
        const from = states.find(s => s.id === group.from);
        const to = states.find(s => s.id === group.to);
        if (!from || !to) return;

        const isSelfLoop = from.id === to.id;
        const isSelected = selectedTransition && selectedTransition.from === group.from && selectedTransition.to === group.to;
        const isActive = activeTransitionRule && activeTransitionRule.from === group.from && activeTransitionRule.to === group.to;

        if (isSelfLoop) {
            drawSelfLoop(from, group, isSelected, isActive);
        } else {
            // Check if reverse transition exists
            const hasReverse = transitions.some(t => t.from === to.id && t.to === from.id);
            drawNormalTransition(from, to, group, hasReverse, isSelected, isActive);
        }
    });
}

function drawNormalTransition(from, to, group, hasReverse, isSelected, isActive) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return;

    const ux = dx / dist;
    const uy = dy / dist;
    const nx = -uy;
    const ny = ux;

    // Normal curve offset
    let baseCurvature = hasReverse ? 38 : 0;
    const totalOffset = baseCurvature + (group.curveOffset || 0);

    const midX = (from.x + to.x) / 2 + nx * totalOffset;
    const midY = (from.y + to.y) / 2 + ny * totalOffset;

    // Compute start and end on circle boundaries
    const startX = from.x + (midX - from.x) / Math.sqrt((midX - from.x) ** 2 + (midY - from.y) ** 2) * STATE_RADIUS;
    const startY = from.y + (midY - from.y) / Math.sqrt((midX - from.x) ** 2 + (midY - from.y) ** 2) * STATE_RADIUS;

    const endDist = Math.sqrt((midX - to.x) ** 2 + (midY - to.y) ** 2);
    const endX = to.x + (midX - to.x) / endDist * (STATE_RADIUS + 4);
    const endY = to.y + (midY - to.y) / endDist * (STATE_RADIUS + 4);

    // Save midpoint for click/drag detection
    group.labelX = midX;
    group.labelY = midY;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(midX, midY, endX, endY);

    if (isActive) {
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3.5;
        ctx.shadowColor = "rgba(56, 189, 248, 0.8)";
        ctx.shadowBlur = 12;
    } else if (isSelected) {
        ctx.strokeStyle = "#ffbf4d";
        ctx.lineWidth = 2.8;
        ctx.shadowColor = "rgba(255, 191, 77, 0.6)";
        ctx.shadowBlur = 10;
    } else {
        ctx.strokeStyle = "#b875ff";
        ctx.lineWidth = 2.2;
        ctx.shadowColor = "rgba(184, 117, 255, 0.4)";
        ctx.shadowBlur = 6;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Arrowhead at endX, endY
    const arrowAngle = Math.atan2(endY - midY, endX - midX);
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
        endX - ARROW_SIZE * Math.cos(arrowAngle - Math.PI / 6),
        endY - ARROW_SIZE * Math.sin(arrowAngle - Math.PI / 6)
    );
    ctx.lineTo(
        endX - ARROW_SIZE * Math.cos(arrowAngle + Math.PI / 6),
        endY - ARROW_SIZE * Math.sin(arrowAngle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = isActive ? "#38bdf8" : (isSelected ? "#ffbf4d" : "#e48cff");
    ctx.fill();

    // Render multi-symbol pill badge
    drawTransitionLabel(group.label, midX, midY, isSelected, isActive);
    ctx.restore();
}

function drawSelfLoop(state, group, isSelected, isActive) {
    const loopTop = state.y - STATE_RADIUS;
    const height = 65 + (group.curveOffset || 0);

    const cp1X = state.x - 48;
    const cp1Y = state.y - height;
    const cp2X = state.x + 48;
    const cp2Y = state.y - height;

    const startX = state.x - 18;
    const startY = loopTop;
    const endX = state.x + 18;
    const endY = loopTop;

    group.labelX = state.x;
    group.labelY = state.y - height + 16;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);

    if (isActive) {
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3.5;
        ctx.shadowColor = "rgba(56, 189, 248, 0.8)";
        ctx.shadowBlur = 12;
    } else if (isSelected) {
        ctx.strokeStyle = "#ffbf4d";
        ctx.lineWidth = 2.8;
        ctx.shadowColor = "rgba(255, 191, 77, 0.6)";
        ctx.shadowBlur = 10;
    } else {
        ctx.strokeStyle = "#ff6bc5";
        ctx.lineWidth = 2.2;
        ctx.shadowColor = "rgba(255, 107, 197, 0.45)";
        ctx.shadowBlur = 8;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Arrowhead at end of loop (pointing downwards into state)
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - 8, endY - 7);
    ctx.lineTo(endX - 8, endY + 7);
    ctx.closePath();
    ctx.fillStyle = isActive ? "#38bdf8" : (isSelected ? "#ffbf4d" : "#ff9bd7");
    ctx.fill();

    drawTransitionLabel(group.label, group.labelX, group.labelY, isSelected, isActive);
    ctx.restore();
}

function drawTransitionLabel(labelText, x, y, isSelected, isActive) {
    ctx.save();
    ctx.font = "700 12px 'Space Grotesk', Inter, sans-serif";
    const textWidth = ctx.measureText(labelText).width;
    const width = Math.max(26, textWidth + 14);
    const height = 22;

    const rectX = x - width / 2;
    const rectY = y - height / 2;

    // Pill badge background
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(rectX, rectY, width, height, 7) : ctx.rect(rectX, rectY, width, height);
    ctx.fillStyle = "rgba(14, 9, 24, 0.94)";
    ctx.fill();

    // Pill border
    if (isActive) {
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.8;
        ctx.shadowColor = "rgba(56, 189, 248, 0.8)";
        ctx.shadowBlur = 8;
    } else if (isSelected) {
        ctx.strokeStyle = "#ffbf4d";
        ctx.lineWidth = 1.8;
    } else {
        ctx.strokeStyle = "rgba(220, 91, 255, 0.40)";
        ctx.lineWidth = 1.2;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Label Text
    ctx.fillStyle = isActive ? "#38bdf8" : (isSelected ? "#ffbf4d" : "#ffb0e4");
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(labelText, x, y);
    ctx.restore();
}

function drawStates() {
    states.forEach(state => {
        const isSelected = selectedState && selectedState.id === state.id;
        const isActive = activeExecutionState && activeExecutionState.id === state.id;

        // Start arrow
        if (state.isStart) {
            drawStartArrow(state);
        }

        // Selected Outer Golden Glow Ring
        if (isSelected) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(state.x, state.y, STATE_RADIUS + 7, 0, Math.PI * 2);
            ctx.strokeStyle = "#ffbf4d";
            ctx.lineWidth = 2.5;
            ctx.shadowColor = "rgba(255, 191, 77, 0.75)";
            ctx.shadowBlur = 14;
            ctx.stroke();
            ctx.restore();
        }

        // Active Execution Cyan Ring
        if (isActive) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(state.x, state.y, STATE_RADIUS + 9, 0, Math.PI * 2);
            ctx.strokeStyle = "#27df85";
            ctx.lineWidth = 3;
            ctx.shadowColor = "rgba(39, 223, 133, 0.85)";
            ctx.shadowBlur = 16;
            ctx.stroke();
            ctx.restore();
        }

        // Main State Circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(state.x, state.y, STATE_RADIUS, 0, Math.PI * 2);

        const radial = ctx.createRadialGradient(
            state.x - 8, state.y - 10, 4,
            state.x, state.y, STATE_RADIUS
        );
        radial.addColorStop(0, "#28183c");
        radial.addColorStop(1, "#0f0a1b");
        ctx.fillStyle = radial;
        ctx.fill();

        // State Border
        ctx.strokeStyle = state.isFinal ? "#ff5fc2" : "#9a67ff";
        ctx.lineWidth = 2.4;
        ctx.shadowColor = state.isFinal ? "rgba(255, 95, 194, 0.55)" : "rgba(154, 103, 255, 0.45)";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Double Circle for Final / Accepting States
        if (state.isFinal) {
            ctx.beginPath();
            ctx.arc(state.x, state.y, STATE_RADIUS - 7, 0, Math.PI * 2);
            ctx.strokeStyle = "#ff78ca";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // State Name Label
        ctx.fillStyle = "#ffffff";
        ctx.font = "700 15px 'Space Grotesk', Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(state.name, state.x, state.y);
        ctx.restore();
    });
}

function drawStartArrow(state) {
    const startX = state.x - STATE_RADIUS - 50;
    const startY = state.y;
    const endX = state.x - STATE_RADIUS - 2;
    const endY = state.y;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = "#ff5fc2";
    ctx.lineWidth = 2.4;
    ctx.shadowColor = "rgba(255, 95, 194, 0.6)";
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - ARROW_SIZE, endY - 6);
    ctx.lineTo(endX - ARROW_SIZE, endY + 6);
    ctx.closePath();
    ctx.fillStyle = "#ff78ca";
    ctx.fill();
    ctx.restore();
}

function drawConnectingLine() {
    // Current mouse pos in world coords
    // (Rendered during drag)
}

/* =========================================================
   CANVAS INTERACTION & EVENT LISTENERS
========================================================= */
canvas.addEventListener("mousedown", (e) => {
    const coords = toWorldCoords(e.clientX, e.clientY);
    const clickedState = getStateAt(coords.x, coords.y);

    // Pan with middle mouse, Alt key, or space
    if (e.button === 1 || (e.button === 0 && (e.altKey && !clickedState))) {
        isPanning = true;
        startPanX = e.clientX - panX;
        startPanY = e.clientY - panY;
        canvas.style.cursor = "grabbing";
        return;
    }

    if (e.button !== 0) return; // Only primary click

    // Shift + Click on state = Transition creation mode
    if (e.shiftKey) {
        if (clickedState) {
            if (!transitionStart) {
                transitionStart = clickedState;
                selectedState = clickedState;
                currentTool = "transition";
                updateToolStatusText(`Select target state from ${clickedState.name}`);
                draw();
            } else {
                createOrEditTransition(transitionStart, clickedState);
                transitionStart = null;
                currentTool = "create";
                updateToolStatusText("Select a tool");
                draw();
            }
        } else {
            transitionStart = null;
            draw();
        }
        return;
    }

    if (clickedState) {
        // Alt + Click state = Delete state
        if (e.altKey) {
            deleteState(clickedState);
            return;
        }

        // Select state & prepare drag
        selectedState = clickedState;
        selectedTransition = null;
        isDraggingState = true;
        draggedState = clickedState;
        dragOffsetX = coords.x - clickedState.x;
        dragOffsetY = coords.y - clickedState.y;
        draw();
    } else {
        // Check if clicked a transition badge to drag its curve or select it
        const clickedGroup = getTransitionGroupAt(coords.x, coords.y);
        if (clickedGroup) {
            selectedTransition = clickedGroup;
            selectedState = null;
            isDraggingCurve = true;
            draggedTransitionGroup = clickedGroup;
            draw();
        } else {
            // Deselect
            selectedState = null;
            selectedTransition = null;
            transitionStart = null;
            draw();
        }
    }
});

canvas.addEventListener("mousemove", (e) => {
    if (isPanning) {
        panX = e.clientX - startPanX;
        panY = e.clientY - startPanY;
        draw();
        return;
    }

    const coords = toWorldCoords(e.clientX, e.clientY);

    if (isDraggingState && draggedState) {
        let newX = coords.x - dragOffsetX;
        let newY = coords.y - dragOffsetY;
        if (snapToGrid) {
            newX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
            newY = Math.round(newY / GRID_SIZE) * GRID_SIZE;
        }
        draggedState.x = newX;
        draggedState.y = newY;
        draw();
        return;
    }

    if (isDraggingCurve && draggedTransitionGroup) {
        const from = states.find(s => s.id === draggedTransitionGroup.from);
        const to = states.find(s => s.id === draggedTransitionGroup.to);
        if (from && to) {
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const dist = Math.hypot(coords.x - midX, coords.y - midY);
            draggedTransitionGroup.curveOffset = Math.min(120, Math.max(-120, dist - 30));
            // Apply to underlying transitions
            transitions.forEach(t => {
                if (t.from === draggedTransitionGroup.from && t.to === draggedTransitionGroup.to) {
                    t.curveOffset = draggedTransitionGroup.curveOffset;
                }
            });
            draw();
        }
    }
});

window.addEventListener("mouseup", () => {
    if (isPanning) {
        isPanning = false;
        canvas.style.cursor = "crosshair";
    }
    if (isDraggingState) {
        isDraggingState = false;
        draggedState = null;
    }
    if (isDraggingCurve) {
        isDraggingCurve = false;
        draggedTransitionGroup = null;
    }
});

// Single Click: Create state if empty canvas
canvas.addEventListener("click", (e) => {
    if (isPanning || e.shiftKey || e.altKey) return;
    const coords = toWorldCoords(e.clientX, e.clientY);
    const clickedState = getStateAt(coords.x, coords.y);
    const clickedGroup = getTransitionGroupAt(coords.x, coords.y);

    if (!clickedState && !clickedGroup) {
        createState(coords.x, coords.y);
    }
});

// Double Click: Toggle Final / Accepting State or Reset Curve
canvas.addEventListener("dblclick", (e) => {
    e.preventDefault();
    const coords = toWorldCoords(e.clientX, e.clientY);
    const clickedState = getStateAt(coords.x, coords.y);
    if (clickedState) {
        toggleFinalState(clickedState);
        return;
    }

    const clickedGroup = getTransitionGroupAt(coords.x, coords.y);
    if (clickedGroup) {
        // Reset curve offset
        transitions.forEach(t => {
            if (t.from === clickedGroup.from && t.to === clickedGroup.to) {
                t.curveOffset = 0;
            }
        });
        addActivity("Reset transition curve");
        updateAll();
    }
});

// Right Click: Set as Initial State
canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const coords = toWorldCoords(e.clientX, e.clientY);
    const clickedState = getStateAt(coords.x, coords.y);
    if (clickedState) {
        setStartState(clickedState);
    }
});

// Mouse Wheel: Smooth Zoom centered at mouse pointer
canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newScale = Math.min(2.5, Math.max(0.35, zoomScale * zoomFactor));

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    panX = mouseX - (mouseX - panX) * (newScale / zoomScale);
    panY = mouseY - (mouseY - panY) * (newScale / zoomScale);
    zoomScale = newScale;

    draw();
}, { passive: false });

// Keyboard Shortcuts: Delete key, Undo/Redo
window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedState) {
            deleteState(selectedState);
        } else if (selectedTransition) {
            deleteTransitionGroup(selectedTransition);
        }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
    }
});

function getTransitionGroupAt(worldX, worldY) {
    const groups = getTransitionGroups();
    for (const grp of groups) {
        if (grp.labelX !== undefined && grp.labelY !== undefined) {
            const dist = Math.hypot(worldX - grp.labelX, worldY - grp.labelY);
            if (dist <= 20) return grp;
        }
    }
    return null;
}

function updateToolStatusText(text) {
    if (toolStatus) toolStatus.textContent = text;
}

/* =========================================================
   CANVAS CONTROLS: ZOOM, PAN, FIT, AUTO-ARRANGE
========================================================= */
zoomInBtn.addEventListener("click", () => {
    zoomScale = Math.min(2.5, zoomScale * 1.2);
    draw();
});

zoomOutBtn.addEventListener("click", () => {
    zoomScale = Math.max(0.35, zoomScale / 1.2);
    draw();
});

resetViewBtn.addEventListener("click", () => {
    zoomScale = 1.0;
    panX = 0;
    panY = 0;
    draw();
});

fitCanvasBtn.addEventListener("click", fitToCanvas);

function fitToCanvas() {
    if (states.length === 0) {
        zoomScale = 1.0;
        panX = 0;
        panY = 0;
        draw();
        return;
    }

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    states.forEach(s => {
        minX = Math.min(minX, s.x - STATE_RADIUS - 30);
        minY = Math.min(minY, s.y - STATE_RADIUS - 60);
        maxX = Math.max(maxX, s.x + STATE_RADIUS + 30);
        maxY = Math.max(maxY, s.y + STATE_RADIUS + 30);
    });

    const boxWidth = maxX - minX;
    const boxHeight = maxY - minY;
    const canvasWidth = canvasWrapper.clientWidth;
    const canvasHeight = canvasWrapper.clientHeight;

    const scaleX = canvasWidth / boxWidth;
    const scaleY = canvasHeight / boxHeight;
    zoomScale = Math.min(1.4, Math.max(0.5, Math.min(scaleX, scaleY) * 0.85));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    panX = (canvasWidth / 2) - (centerX * zoomScale);
    panY = (canvasHeight / 2) - (centerY * zoomScale);

    draw();
}

autoArrangeBtn.addEventListener("click", autoArrangeStates);

function autoArrangeStates() {
    if (states.length === 0) return;
    saveHistory("Auto-arrange states");

    const width = canvasWrapper.clientWidth;
    const height = canvasWrapper.clientHeight;
    const centerY = height / 2;

    // Linear or Circular Layout depending on count
    if (states.length <= 4) {
        // Horizontal Layout from Start state
        const sorted = [...states];
        const startIdx = sorted.findIndex(s => s.isStart);
        if (startIdx > -1) {
            const start = sorted.splice(startIdx, 1)[0];
            sorted.unshift(start);
        }

        const stepX = Math.min(220, (width - 240) / Math.max(1, sorted.length - 1));
        const startX = (width - ((sorted.length - 1) * stepX)) / 2;

        sorted.forEach((s, i) => {
            s.x = startX + i * stepX;
            s.y = centerY;
        });
    } else {
        // Circle layout
        const radius = Math.min(width, height) * 0.32;
        const centerX = width / 2;
        const angleStep = (2 * Math.PI) / states.length;

        states.forEach((s, i) => {
            s.x = centerX + radius * Math.cos(i * angleStep - Math.PI / 2);
            s.y = centerY + radius * Math.sin(i * angleStep - Math.PI / 2);
        });
    }

    addActivity("Auto-arranged layout of states");
    updateAll();
    fitToCanvas();
}

/* =========================================================
   ALPHABET & STATE NAMING
========================================================= */
setAlphabetBtn.addEventListener("click", () => {
    const val = alphabetInput.value.trim();
    if (!val) {
        alert("Please enter at least one alphabet symbol.");
        return;
    }

    saveHistory("Set alphabet");
    const symbols = val.split(",").map(s => s.trim()).filter(s => s.length > 0);
    const unique = [...new Set(symbols)];

    if (unique.length === 0) {
        alert("Alphabet cannot be empty.");
        return;
    }

    alphabet = unique;
    alphabetInput.value = alphabet.join(", ");
    alphabetDisplayText.textContent = `Alphabet: { ${alphabet.join(", ")} }`;

    // Remove any transition rules that use removed symbols
    transitions = transitions.filter(t => alphabet.includes(t.symbol));

    addActivity(`Set alphabet to <strong>{ ${alphabet.join(", ")} }</strong>`);
    updateAll();
});

// Dropdown Custom Implementation
stateNamingTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    stateNamingMenu.classList.toggle("show");
    stateNamingTrigger.setAttribute("aria-expanded", stateNamingMenu.classList.contains("show"));
});

document.addEventListener("click", () => {
    stateNamingMenu.classList.remove("show");
    stateNamingTrigger.setAttribute("aria-expanded", "false");
});

function setNamingStyle(style) {
    namingMode = style;
    if (stateNamingMode) stateNamingMode.value = style;
    if (stateNamingMenu) {
        stateNamingMenu.querySelectorAll(".dropdown-option").forEach(opt => {
            const isMatch = opt.dataset.value === style;
            opt.classList.toggle("selected", isMatch);
            opt.setAttribute("aria-selected", isMatch ? "true" : "false");
            if (isMatch && stateNamingLabel) {
                stateNamingLabel.textContent = opt.querySelector(".option-text").textContent;
            }
        });
    }
    if (customStateName) {
        customStateName.disabled = (style !== "custom");
        if (style === "custom") customStateName.focus();
    }
}

stateNamingMenu.querySelectorAll(".dropdown-option").forEach(opt => {
    opt.addEventListener("click", () => {
        setNamingStyle(opt.dataset.value);
        stateNamingMenu.classList.remove("show");
        stateNamingTrigger.setAttribute("aria-expanded", "false");
        addActivity(`Selected state naming style: <strong>${stateNamingLabel.textContent}</strong>`);
    });
});

if (stateNamingMode) {
    stateNamingMode.addEventListener("change", (e) => {
        setNamingStyle(e.target.value);
    });
}

addCustomStateBtn.addEventListener("click", () => {
    const name = customStateName.value.trim();
    const centerX = (canvasWrapper.clientWidth / 2 - panX) / zoomScale;
    const centerY = (canvasWrapper.clientHeight / 2 - panY) / zoomScale;
    createState(centerX, centerY, name || null);
});

/* =========================================================
   TRANSITION TABLE GENERATOR (SHOWS Φ FOR UNDEFINED)
========================================================= */
function updateTransitionTable() {
    if (states.length === 0 || alphabet.length === 0) {
        transitionTable.innerHTML = `<div class="empty-table">Define an alphabet and create states.</div>`;
        return;
    }

    let html = `<table><thead><tr><th>State</th>`;
    alphabet.forEach(sym => {
        html += `<th>${escapeHTML(sym)}</th>`;
    });
    html += `</tr></thead><tbody>`;

    states.forEach(s => {
        const isSelected = selectedState && selectedState.id === s.id;
        html += `<tr class="${isSelected ? 'selected-row' : ''}">`;

        // State indicator
        let prefix = "";
        if (s.isStart) prefix += "→ ";
        if (s.isFinal) prefix += "◎ ";
        html += `<td class="state-name-cell">${prefix}${escapeHTML(s.name)}</td>`;

        alphabet.forEach(sym => {
            const rule = transitions.find(t => t.from === s.id && t.symbol === sym);
            if (rule) {
                const target = states.find(st => st.id === rule.to);
                html += `<td>${target ? escapeHTML(target.name) : "—"}</td>`;
            } else {
                // UPDATE 5: Display Φ for undefined transitions
                html += `<td class="phi-symbol">&Phi;</td>`;
            }
        });

        html += `</tr>`;
    });

    html += `</tbody></table>`;
    transitionTable.innerHTML = html;
}

/* =========================================================
   DFA VALIDATION & COMPLETENESS CHECKER
========================================================= */
function validateDFA() {
    let isValid = true;
    let isComplete = true;
    const issues = [];

    // 1. Alphabet defined
    const hasAlphabet = alphabet.length > 0;
    if (!hasAlphabet) {
        isValid = false;
        issues.push("Alphabet is not defined");
    }

    // 2. Initial state set
    const startStates = states.filter(s => s.isStart);
    const hasStart = startStates.length === 1;
    if (!hasStart) {
        isValid = false;
        issues.push(startStates.length === 0 ? "Missing initial state" : "Multiple initial states");
    }

    // 3. Accepting state defined
    const finalStates = states.filter(s => s.isFinal);
    const hasFinal = finalStates.length > 0;
    if (!hasFinal) {
        issues.push("No accepting state defined");
    }

    // 4. Conflicting transitions (Determinism check)
    let hasConflict = false;
    for (const s of states) {
        for (const sym of alphabet) {
            const count = transitions.filter(t => t.from === s.id && t.symbol === sym).length;
            if (count > 1) {
                hasConflict = true;
                isValid = false;
                issues.push(`Conflicting transitions on state ${s.name} for symbol "${sym}"`);
            }
        }
    }

    // 5. Valid transition references
    let allTransitionsValid = true;
    for (const t of transitions) {
        const fromExists = states.some(s => s.id === t.from);
        const toExists = states.some(s => s.id === t.to);
        const symbolValid = alphabet.includes(t.symbol);
        if (!fromExists || !toExists || !symbolValid) {
            allTransitionsValid = false;
            isValid = false;
        }
    }

    // 6. Completeness: every state must have transition for every symbol
    let missingCount = 0;
    states.forEach(s => {
        alphabet.forEach(sym => {
            const exists = transitions.some(t => t.from === s.id && t.symbol === sym);
            if (!exists) {
                missingCount++;
            }
        });
    });

    if (missingCount > 0) {
        isComplete = false;
    }

    // 7. Consistency with requested DFA language behavior
    let behaviorValid = true;
    let behaviorMismatchMsg = null;
    if (currentExampleMeta && currentExampleMeta.testCases && currentExampleMeta.testCases.length > 0 && isValid && isComplete) {
        for (const tc of currentExampleMeta.testCases) {
            const sim = simulateString(tc.input);
            if (sim.accepted !== tc.expected) {
                behaviorValid = false;
                behaviorMismatchMsg = `Behavior check failed for "${tc.input}" (${sim.accepted ? "Accepted" : "Rejected"}, expected ${tc.expected ? "Accept" : "Reject"}).`;
                break;
            }
        }
    }

    // Render Status Card
    validationStatusCard.className = "validation-status-card";
    if (isValid && isComplete && states.length > 0) {
        if (!behaviorValid) {
            validationStatusCard.classList.add("incomplete");
            valStatusTitle.textContent = "Structurally Complete (Behavior Mismatch)";
            valStatusSubtitle.textContent = behaviorMismatchMsg || "Automaton transitions do not match expected language behavior.";
            completeDfaBtn.style.display = "none";
        } else {
            validationStatusCard.classList.add("valid");
            valStatusTitle.textContent = "Valid and Complete DFA";
            valStatusSubtitle.textContent = "The automaton is deterministic, complete, and verified for the requested language.";
            completeDfaBtn.style.display = "none";
        }
    } else if (isValid && states.length > 0) {
        validationStatusCard.classList.add("incomplete");
        valStatusTitle.textContent = "Valid but Incomplete DFA";
        valStatusSubtitle.textContent = `Automaton has ${missingCount} undefined transition(s).`;
        completeDfaBtn.style.display = "block";
    } else {
        validationStatusCard.classList.add("invalid");
        valStatusTitle.textContent = "Invalid DFA";
        valStatusSubtitle.textContent = issues.length > 0 ? issues[0] : "Automaton is incomplete or invalid.";
        completeDfaBtn.style.display = "none";
    }

    // Update Checklist items
    valInitialText.textContent = hasStart ? `Initial state is set (${startStates[0].name})` : "Initial state is missing";
    valAcceptingText.textContent = hasFinal ? `Accepting state(s) defined (${finalStates.map(s => s.name).join(", ")})` : "No accepting states defined";
    valMissingText.textContent = missingCount === 0 ? "No missing transitions" : `${missingCount} missing transition(s)`;

    updateCheckItem(0, hasAlphabet);
    updateCheckItem(1, hasStart);
    updateCheckItem(2, hasFinal);
    updateCheckItem(3, !hasConflict);
    updateCheckItem(4, allTransitionsValid);
    updateCheckItem(5, missingCount === 0);

    return { isValid, isComplete, missingCount };
}

function updateCheckItem(index, passed) {
    const items = validationChecklist.querySelectorAll(".check-item");
    if (items[index]) {
        items[index].className = `check-item ${passed ? "passed" : "failed"}`;
        items[index].querySelector(".item-circle").textContent = passed ? "✓" : "✗";
    }
}

// Complete DFA with Dead State
completeDfaBtn.addEventListener("click", () => {
    saveHistory("Complete DFA with Dead State");

    // Create or find Dead state
    let deadState = states.find(s => s.name.toLowerCase() === "dead" || s.name.toLowerCase() === "trap");
    if (!deadState) {
        deadState = {
            id: `state-${Date.now()}-dead`,
            name: "Dead",
            x: canvasWrapper.clientWidth - 100,
            y: canvasWrapper.clientHeight - 80,
            isStart: false,
            isFinal: false
        };
        states.push(deadState);
    }

    // Redirect all missing transitions to Dead state
    states.forEach(s => {
        alphabet.forEach(sym => {
            const exists = transitions.some(t => t.from === s.id && t.symbol === sym);
            if (!exists) {
                transitions.push({
                    id: `trans-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
                    from: s.id,
                    to: deadState.id,
                    symbol: sym,
                    curveOffset: 0
                });
            }
        });
    });

    addActivity("Completed DFA with Dead state");
    updateAll();
});

/* =========================================================
   SIMULATION & STEP-BY-STEP EXECUTION ENGINE
========================================================= */
function simulateString(input) {
    const startState = states.find(s => s.isStart);
    if (!startState) {
        return {
            accepted: false,
            error: "No initial state defined.",
            path: [],
            steps: []
        };
    }

    const trimmedInput = input.trim();
    const symbols = trimmedInput === "" || trimmedInput === "ε" ? [] : trimmedInput.split("");

    // Validate symbols
    for (const sym of symbols) {
        if (!alphabet.includes(sym)) {
            return {
                accepted: false,
                error: `Invalid input symbol "${sym}". Allowed: { ${alphabet.join(", ")} }`,
                path: [startState.name],
                steps: []
            };
        }
    }

    let current = startState;
    const path = [current.name];
    const steps = [
        {
            index: 0,
            state: current,
            symbol: null,
            nextState: current,
            type: "start",
            description: `Start at ${current.name} (initial state)`
        }
    ];

    let failed = false;
    for (let i = 0; i < symbols.length; i++) {
        const sym = symbols[i];
        const rule = transitions.find(t => t.from === current.id && t.symbol === sym);

        if (!rule) {
            failed = true;
            steps.push({
                index: i + 1,
                state: current,
                symbol: sym,
                nextState: null,
                rule: null,
                type: "missing",
                description: `Read ${sym}: No transition defined from ${current.name} (trapped at Φ)`
            });
            break;
        }

        const next = states.find(s => s.id === rule.to);
        if (!next) {
            failed = true;
            break;
        }

        steps.push({
            index: i + 1,
            state: current,
            symbol: sym,
            nextState: next,
            rule,
            type: "step",
            description: `Read ${sym}: ${current.name} → ${next.name}`
        });

        current = next;
        path.push(current.name);
    }

    const accepted = !failed && current.isFinal;
    steps.push({
        index: steps.length,
        state: current,
        symbol: null,
        type: "end",
        accepted,
        description: failed
            ? "Input rejected (undefined transition)"
            : accepted
                ? `Input accepted (${current.name} is an accepting state)`
                : `Input rejected (${current.name} is not an accepting state)`
    });

    return {
        accepted,
        error: null,
        path,
        steps,
        finalState: current
    };
}

function runInputTest(strToTest) {
    const testVal = strToTest !== undefined ? strToTest : inputString.value;
    inputString.value = testVal;

    const sim = simulateString(testVal);
    executionTrace = sim.steps;
    currentTraceIndex = 0;

    // Render result badge
    if (sim.error) {
        result.innerHTML = `
            <div class="result-pill rejected">
                <span class="pill-check">!</span>
                <span class="pill-text">${escapeHTML(sim.error)}</span>
            </div>
        `;
        executionPath.textContent = "—";
        executionResult.innerHTML = `<div class="empty-history">${escapeHTML(sim.error)}</div>`;
        return;
    }

    result.innerHTML = `
        <div class="result-pill ${sim.accepted ? 'accepted' : 'rejected'}">
            <span class="pill-check">${sim.accepted ? '✓' : '✗'}</span>
            <span class="pill-text">Result: <strong>${sim.accepted ? 'Accepted' : 'Rejected'}</strong></span>
        </div>
    `;

    executionPath.textContent = sim.path.join(" → ");

    // Render Step-by-Step Trace list
    renderStepTrace();
    highlightStep(0);

    addActivity(`Tested input "<strong>${escapeHTML(testVal)}</strong>" &rarr; <span style="color:${sim.accepted ? 'var(--green-neon)' : 'var(--red-neon)'}; font-weight:600;">${sim.accepted ? 'Accepted' : 'Rejected'}</span>`);
}

function renderStepTrace() {
    let html = "";
    executionTrace.forEach((step, idx) => {
        html += `
            <div class="trace-step-item" id="traceStep-${idx}">
                <span class="trace-dot"></span>
                <span>${escapeHTML(step.description)}</span>
            </div>
        `;
    });
    executionResult.innerHTML = html;
}

function highlightStep(index) {
    if (executionTrace.length === 0) return;
    currentTraceIndex = Math.max(0, Math.min(index, executionTrace.length - 1));

    document.querySelectorAll(".trace-step-item").forEach((el, i) => {
        el.classList.toggle("active-step", i === currentTraceIndex);
    });

    const step = executionTrace[currentTraceIndex];
    if (step) {
        activeExecutionState = step.nextState || step.state;
        activeTransitionRule = step.rule || null;
    } else {
        activeExecutionState = null;
        activeTransitionRule = null;
    }

    draw();
}

/* TRANSPORT CONTROLS (PREVIOUS, PLAY, PAUSE, NEXT, RESET) */
runBtn.addEventListener("click", () => runInputTest());
inputString.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runInputTest();
});

execPrevBtn.addEventListener("click", () => {
    pauseExecution();
    highlightStep(currentTraceIndex - 1);
});

execNextBtn.addEventListener("click", () => {
    pauseExecution();
    highlightStep(currentTraceIndex + 1);
});

execResetBtn.addEventListener("click", () => {
    pauseExecution();
    highlightStep(0);
});

execPlayBtn.addEventListener("click", () => {
    if (isPlaying) {
        pauseExecution();
    } else {
        playExecution();
    }
});

execPauseBtn.addEventListener("click", pauseExecution);

function playExecution() {
    if (executionTrace.length === 0) {
        runInputTest();
    }
    isPlaying = true;
    execPlayBtn.classList.add("play-active");
    execPlayBtn.querySelector("span").textContent = "Playing...";

    clearInterval(playInterval);
    playInterval = setInterval(() => {
        if (currentTraceIndex >= executionTrace.length - 1) {
            pauseExecution();
        } else {
            highlightStep(currentTraceIndex + 1);
        }
    }, executionSpeed);
}

function pauseExecution() {
    isPlaying = false;
    clearInterval(playInterval);
    execPlayBtn.classList.remove("play-active");
    execPlayBtn.querySelector("span").textContent = "Play";
}

execSpeedSlider.addEventListener("input", () => {
    executionSpeed = parseInt(execSpeedSlider.value, 10);
    execSpeedDisplay.textContent = `${executionSpeed} ms`;
    if (isPlaying) {
        playExecution();
    }
});

/* =========================================================
   BUILT-IN EXAMPLES LIBRARY
========================================================= */
const BUILT_IN_EXAMPLES = {
    "ending-1": {
        title: "Binary strings ending in 1",
        alphabet: ["0", "1"],
        description: "This DFA accepts all binary strings that end with the symbol 1.",
        states: [
            { id: "A", name: "A", x: 200, y: 220, isStart: true, isFinal: false },
            { id: "B", name: "B", x: 380, y: 220, isStart: false, isFinal: false },
            { id: "C", name: "C", x: 560, y: 220, isStart: false, isFinal: true }
        ],
        transitions: [
            { from: "A", to: "A", symbol: "0" },
            { from: "A", to: "B", symbol: "0" },
            { from: "A", to: "A", symbol: "1" },
            { from: "B", to: "C", symbol: "1" },
            { from: "C", to: "C", symbol: "0" },
            { from: "C", to: "C", symbol: "1" }
        ],
        // Exact 3-state deterministic variant matching mockup:
        setup(automaton) {
            automaton.alphabet = ["0", "1"];
            automaton.states = [
                { id: "sA", name: "A", x: 200, y: 220, isStart: true, isFinal: false },
                { id: "sB", name: "B", x: 380, y: 220, isStart: false, isFinal: false },
                { id: "sC", name: "C", x: 560, y: 220, isStart: false, isFinal: true }
            ];
            automaton.transitions = [
                { id: "t1", from: "sA", to: "sA", symbol: "0", curveOffset: 0 },
                { id: "t2", from: "sA", to: "sB", symbol: "1", curveOffset: 0 },
                { id: "t3", from: "sB", to: "sA", symbol: "0", curveOffset: 0 },
                { id: "t4", from: "sB", to: "sC", symbol: "1", curveOffset: 0 },
                { id: "t5", from: "sC", to: "sC", symbol: "0", curveOffset: 0 },
                { id: "t6", from: "sC", to: "sC", symbol: "1", curveOffset: 0 }
            ];
        },
        testCases: [
            { input: "101", expected: true },
            { input: "100", expected: false },
            { input: "1", expected: true },
            { input: "0", expected: false },
            { input: "111", expected: true }
        ]
    },
    "starting-0": {
        title: "Binary strings starting with 0",
        alphabet: ["0", "1"],
        description: "This DFA accepts all binary strings whose first symbol is 0.",
        setup(automaton) {
            automaton.alphabet = ["0", "1"];
            automaton.states = [
                { id: "sA", name: "A", x: 190, y: 220, isStart: true, isFinal: false },
                { id: "sB", name: "B", x: 400, y: 150, isStart: false, isFinal: true },
                { id: "sC", name: "C", x: 400, y: 290, isStart: false, isFinal: false }
            ];
            automaton.transitions = [
                { id: "t1", from: "sA", to: "sB", symbol: "0", curveOffset: 0 },
                { id: "t2", from: "sA", to: "sC", symbol: "1", curveOffset: 0 },
                { id: "t3", from: "sB", to: "sB", symbol: "0", curveOffset: 0 },
                { id: "t4", from: "sB", to: "sB", symbol: "1", curveOffset: 0 },
                { id: "t5", from: "sC", to: "sC", symbol: "0", curveOffset: 0 },
                { id: "t6", from: "sC", to: "sC", symbol: "1", curveOffset: 0 }
            ];
        },
        testCases: [
            { input: "010", expected: true },
            { input: "0", expected: true },
            { input: "101", expected: false },
            { input: "1", expected: false },
            { input: "0001", expected: true }
        ]
    },
    "even-1s": {
        title: "Even number of 1's",
        alphabet: ["0", "1"],
        description: "This DFA accepts all binary strings containing an even number of 1's.",
        setup(automaton) {
            automaton.alphabet = ["0", "1"];
            automaton.states = [
                { id: "sEven", name: "Even", x: 240, y: 220, isStart: true, isFinal: true },
                { id: "sOdd", name: "Odd", x: 480, y: 220, isStart: false, isFinal: false }
            ];
            automaton.transitions = [
                { id: "t1", from: "sEven", to: "sEven", symbol: "0", curveOffset: 0 },
                { id: "t2", from: "sEven", to: "sOdd", symbol: "1", curveOffset: 25 },
                { id: "t3", from: "sOdd", to: "sOdd", symbol: "0", curveOffset: 0 },
                { id: "t4", from: "sOdd", to: "sEven", symbol: "1", curveOffset: 25 }
            ];
        },
        testCases: [
            { input: "11", expected: true },
            { input: "1010", expected: true },
            { input: "1", expected: false },
            { input: "111", expected: false },
            { input: "000", expected: true }
        ]
    },
    "contains-11": {
        title: "Contains substring 11",
        alphabet: ["0", "1"],
        description: "This DFA accepts binary strings that contain consecutive 11 as a substring.",
        setup(automaton) {
            automaton.alphabet = ["0", "1"];
            automaton.states = [
                { id: "s0", name: "q0", x: 200, y: 220, isStart: true, isFinal: false },
                { id: "s1", name: "q1", x: 380, y: 220, isStart: false, isFinal: false },
                { id: "s2", name: "q2", x: 560, y: 220, isStart: false, isFinal: true }
            ];
            automaton.transitions = [
                { id: "t1", from: "s0", to: "s0", symbol: "0", curveOffset: 0 },
                { id: "t2", from: "s0", to: "s1", symbol: "1", curveOffset: 0 },
                { id: "t3", from: "s1", to: "s0", symbol: "0", curveOffset: 30 },
                { id: "t4", from: "s1", to: "s2", symbol: "1", curveOffset: 0 },
                { id: "t5", from: "s2", to: "s2", symbol: "0", curveOffset: 0 },
                { id: "t6", from: "s2", to: "s2", symbol: "1", curveOffset: 0 }
            ];
        },
        testCases: [
            { input: "11", expected: true },
            { input: "0110", expected: true },
            { input: "101", expected: false },
            { input: "000", expected: false },
            { input: "1111", expected: true }
        ]
    },
    "avoids-11": {
        title: "Avoids substring 11",
        alphabet: ["0", "1"],
        description: "This DFA accepts all binary strings that do NOT contain 11 as a substring.",
        setup(automaton) {
            automaton.alphabet = ["0", "1"];
            automaton.states = [
                { id: "s0", name: "q0", x: 200, y: 220, isStart: true, isFinal: true },
                { id: "s1", name: "q1", x: 380, y: 220, isStart: false, isFinal: true },
                { id: "sTrap", name: "Trap", x: 560, y: 220, isStart: false, isFinal: false }
            ];
            automaton.transitions = [
                { id: "t1", from: "s0", to: "s0", symbol: "0", curveOffset: 0 },
                { id: "t2", from: "s0", to: "s1", symbol: "1", curveOffset: 0 },
                { id: "t3", from: "s1", to: "s0", symbol: "0", curveOffset: 30 },
                { id: "t4", from: "s1", to: "sTrap", symbol: "1", curveOffset: 0 },
                { id: "t5", from: "sTrap", to: "sTrap", symbol: "0", curveOffset: 0 },
                { id: "t6", from: "sTrap", to: "sTrap", symbol: "1", curveOffset: 0 }
            ];
        },
        testCases: [
            { input: "1010", expected: true },
            { input: "0", expected: true },
            { input: "11", expected: false },
            { input: "0110", expected: false },
            { input: "10101", expected: true }
        ]
    },
    "divisible-n": {
        title: "Binary numbers divisible by 3",
        alphabet: ["0", "1"],
        description: "This DFA accepts binary representations of integers divisible by 3 (read MSB to LSB).",
        setup(automaton) {
            automaton.alphabet = ["0", "1"];
            automaton.states = [
                { id: "r0", name: "r0", x: 220, y: 220, isStart: true, isFinal: true },
                { id: "r1", name: "r1", x: 420, y: 140, isStart: false, isFinal: false },
                { id: "r2", name: "r2", x: 420, y: 300, isStart: false, isFinal: false }
            ];
            automaton.transitions = [
                { id: "t1", from: "r0", to: "r0", symbol: "0", curveOffset: 0 },
                { id: "t2", from: "r0", to: "r1", symbol: "1", curveOffset: 0 },
                { id: "t3", from: "r1", to: "r2", symbol: "0", curveOffset: 0 },
                { id: "t4", from: "r1", to: "r0", symbol: "1", curveOffset: 30 },
                { id: "t5", from: "r2", to: "r1", symbol: "0", curveOffset: 30 },
                { id: "t6", from: "r2", to: "r2", symbol: "1", curveOffset: 0 }
            ];
        },
        testCases: [
            { input: "11", expected: true },  // 3
            { input: "110", expected: true }, // 6
            { input: "1001", expected: true },// 9
            { input: "10", expected: false }, // 2
            { input: "100", expected: false } // 4
        ]
    }
};

function loadExample(key) {
    const ex = BUILT_IN_EXAMPLES[key];
    if (!ex) return;

    saveHistory(`Load example: ${ex.title}`);

    // Update active highlight on left panel
    document.querySelectorAll(".example-item").forEach(item => {
        item.classList.toggle("active", item.dataset.example === key);
    });

    const dummy = { alphabet: [], states: [], transitions: [] };
    ex.setup(dummy);

    alphabet = dummy.alphabet;
    states = dummy.states;
    transitions = dummy.transitions;
    stateCounter = states.length;

    alphabetInput.value = alphabet.join(", ");
    alphabetDisplayText.textContent = `Alphabet: { ${alphabet.join(", ")} }`;

    currentExampleMeta = {
        title: ex.title,
        alphabet: `{ ${alphabet.join(", ")} }`,
        description: ex.description,
        testCases: ex.testCases
    };

    updateExampleInfoPanel();
    addActivity(`Loaded example: <strong>${ex.title}</strong>`);
    updateAll();
    fitToCanvas();

    // Run first sample test case
    if (ex.testCases && ex.testCases.length > 0) {
        runInputTest(ex.testCases[0].input);
    }
}

function updateExampleInfoPanel() {
    exampleTitle.textContent = currentExampleMeta.title;
    exampleAlphabetBadge.textContent = `Alphabet: ${currentExampleMeta.alphabet}`;
    exampleDescriptionText.textContent = currentExampleMeta.description;

    let html = "";
    currentExampleMeta.testCases.forEach((tc, idx) => {
        const sim = simulateString(tc.input);
        const passed = sim.accepted === tc.expected;
        html += `
            <div class="sample-test-pill" data-input="${escapeHTML(tc.input)}" title="Click to test this string">
                <div>
                    <span class="test-run-mini-icon">▶</span>
                    <span class="test-str">${escapeHTML(tc.input || "ε")}</span>
                </div>
                <span class="test-badge ${tc.expected ? 'pass' : 'fail'}">
                    ${tc.expected ? '✓ Accepted' : '✗ Rejected'}
                </span>
            </div>
        `;
    });
    exampleTestCasesList.innerHTML = html;

    // Attach click listeners to sample test pills
    exampleTestCasesList.querySelectorAll(".sample-test-pill").forEach(pill => {
        pill.addEventListener("click", () => {
            runInputTest(pill.dataset.input);
        });
    });
}

// Bind example item clicks
examplesList.querySelectorAll(".example-item").forEach(item => {
    item.addEventListener("click", () => {
        loadExample(item.dataset.example);
    });
});

/* =========================================================
   AUTOMATED DFA SOLVER (BUILD FROM PROBLEM)
========================================================= */
/* =========================================================
   AUTOMATED DFA SOLVER (BUILD FROM PROBLEM)
========================================================= */
const PROBLEM_STOP_WORDS = new Set([
    "a", "an", "the", "all", "any", "each", "every",
    "binary", "string", "strings", "number", "numbers",
    "symbol", "symbols", "alphabet", "character", "characters",
    "even", "odd", "substring", "substrings", "that", "with", "in", "over",
    "accept", "accepts", "accepting", "reject", "rejects", "rejecting",
    "language", "languages", "dfa", "automaton", "automata", "of", "to",
    "starts", "starting", "ends", "ending", "contains", "containing", "avoids", "avoiding"
]);

function isValidPattern(cand, alpha) {
    if (!cand || typeof cand !== "string") return false;
    const clean = cand.trim().toLowerCase();
    if (clean.length === 0) return false;
    if (PROBLEM_STOP_WORDS.has(clean)) return false;
    return clean.split("").every(ch => alpha.includes(ch));
}

function showProblemFeedback(msg, isError) {
    if (!problemSolverFeedback) return;
    problemSolverFeedback.style.display = "block";
    problemSolverFeedback.className = `problem-feedback-box ${isError ? 'error' : ''}`;
    problemSolverFeedback.textContent = msg;
}

function parseProblemRequirements(text) {
    const lower = text.toLowerCase();

    // 1. Detect requested state count (e.g., "three states", "3 states", "two states")
    let requestedCount = null;
    const wordNumbers = {
        one: 1, two: 2, three: 3, four: 4, five: 5,
        six: 6, seven: 7, eight: 8, nine: 9, ten: 10
    };
    const countMatch = lower.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+states?\b/);
    if (countMatch) {
        requestedCount = wordNumbers[countMatch[1]] || parseInt(countMatch[1], 10);
    }

    // 2. Detect explicit state names
    let explicitNames = null;

    // Pattern A: {A, B, C} or {q0, q1, q2}
    const braceMatch = text.match(/(?:states|q)\s*(?:=|:)?\s*\{([^}]+)\}/i);
    if (braceMatch) {
        const tokens = braceMatch[1].split(",").map(s => s.trim().replace(/['"]/g, "")).filter(Boolean);
        if (tokens.length > 0) explicitNames = tokens;
    }

    // Pattern B: "three states named A, B, and C" or "states named A, B, C" or "with states A, B, and C" or "states: A, B, C"
    if (!explicitNames) {
        const namedMatch = text.match(/(?:states(?:\s+named|\s+called|\s*:\s*|\s+are)?|with\s+states|using\s+states)\s+([A-Za-z0-9_,\s]+?)(?:\.|$|\bover\b|\bwhere\b|\bwith\b|\bfor\b|\btransitions\b|\band\s+transitions\b|:)/i);
        if (namedMatch) {
            const raw = namedMatch[1];
            const tokens = raw.replace(/\band\b/gi, ",").split(",").map(s => s.trim()).filter(s => s.length > 0 && /^[A-Za-z0-9_]+$/.test(s));
            const filtered = tokens.filter(t => (t.length === 1 && /^[A-Za-z0-9]$/.test(t)) || !["an", "the", "all", "binary", "dead", "trap", "accepting", "start", "initial", "state", "states"].includes(t.toLowerCase()));
            if (filtered.length >= 2) {
                explicitNames = filtered;
            }
        }
    }

    // Pattern C: "state A, state B, state C" or "states A, B and C"
    if (!explicitNames) {
        const multiStateMatch = text.match(/\bstate[s]?\s+([A-Z](?:\s*,\s*[A-Z])*(?:\s*,?\s*and\s+[A-Z])?)\b/);
        if (multiStateMatch) {
            const tokens = multiStateMatch[1].replace(/\band\b/g, ",").split(",").map(s => s.trim()).filter(Boolean);
            if (tokens.length >= 2) {
                explicitNames = tokens;
            }
        }
    }

    // Detect dead/trap state requirement
    const hasDeadState = /\b(?:dead|trap)\s+state\b/i.test(text);

    if (explicitNames && !requestedCount) {
        requestedCount = explicitNames.length;
    }

    // Auto-synchronize naming style if explicit names match a known style
    if (explicitNames && explicitNames.length > 0) {
        const first = explicitNames[0];
        if (/^[A-Z]$/.test(first)) {
            setNamingStyle("letters");
        } else if (/^q\d+$/i.test(first)) {
            setNamingStyle("q");
        } else if (/^[a-z]$/.test(first)) {
            setNamingStyle("lowercase");
        }
    }

    return {
        requestedCount,
        explicitNames,
        hasDeadState
    };
}

function resolveStateName(index, req) {
    if (req && req.explicitNames && req.explicitNames[index]) {
        return req.explicitNames[index];
    }
    return getStateNameForIndex(index);
}

function parseExplicitTransitions(text) {
    const parsedTransitions = [];
    const stateSet = new Set();
    const alphaSet = new Set();

    // Match patterns like "A on 0 -> A" or "A on 0 to B" or "C on 1 -> C"
    const ruleRegex = /\b([A-Za-z0-9_]+)\s+on\s+(['"]?[0-9a-zA-Z]['"]?)\s*(?:->|to|=)\s*([A-Za-z0-9_]+)\b/gi;
    let match;
    while ((match = ruleRegex.exec(text)) !== null) {
        const from = match[1].trim();
        const sym = match[2].trim().replace(/['"]/g, "");
        const to = match[3].trim();
        parsedTransitions.push({ from, sym, to });
        stateSet.add(from);
        stateSet.add(to);
        alphaSet.add(sym);
    }

    return {
        transitions: parsedTransitions,
        states: Array.from(stateSet),
        alphabet: Array.from(alphaSet)
    };
}

function finishDFAGeneration(meta, successMsg) {
    currentExampleMeta = meta;

    // Strict validation against expected test cases before reporting success
    if (meta.testCases && meta.testCases.length > 0) {
        for (const tc of meta.testCases) {
            const sim = simulateString(tc.input);
            if (sim.accepted !== tc.expected) {
                showProblemFeedback(
                    `Generated DFA failed validation for input "${tc.input}" (expected: ${tc.expected ? "Accept" : "Reject"}, got: ${sim.accepted ? "Accept" : "Reject"}).`,
                    true
                );
                return false;
            }
        }
    }

    updateExampleInfoPanel();
    updateAll();
    fitToCanvas();

    if (meta.testCases && meta.testCases.length > 0) {
        if (inputString) inputString.value = meta.testCases[0].input;
        runInputTest(meta.testCases[0].input);
    }

    showProblemFeedback(successMsg, false);
    return true;
}

function generateParityDFA(targetSymbol, isEven, alpha, req = {}) {
    saveHistory(`Generate ${isEven ? "even" : "odd"} parity DFA for symbol "${targetSymbol}"`);

    clearAutomaton(`Generated parity DFA for "${targetSymbol}"`);
    alphabet = alpha;
    alphabetInput.value = alphabet.join(", ");
    alphabetDisplayText.textContent = `Alphabet: { ${alphabet.join(", ")} }`;

    const canvasWidth = canvasWrapper.clientWidth || 900;
    const canvasHeight = canvasWrapper.clientHeight || 520;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const includeDeadState = (req && ((req.requestedCount && req.requestedCount >= 3) || (req.explicitNames && req.explicitNames.length >= 3) || req.hasDeadState));

    const s0Name = resolveStateName(0, req);
    const s1Name = resolveStateName(1, req);

    states = [];
    transitions = [];

    if (includeDeadState) {
        const s2Name = resolveStateName(2, req);

        states = [
            {
                id: "state_0",
                name: s0Name,
                x: centerX - 180,
                y: centerY - 25,
                isStart: true,
                isFinal: isEven
            },
            {
                id: "state_1",
                name: s1Name,
                x: centerX + 180,
                y: centerY - 25,
                isStart: false,
                isFinal: !isEven
            },
            {
                id: "state_2",
                name: s2Name,
                x: centerX,
                y: centerY + 95,
                isStart: false,
                isFinal: false
            }
        ];

        // Active parity transitions between state 0 and state 1
        alpha.forEach(sym => {
            if (sym === targetSymbol) {
                transitions.push({
                    id: `t_0_1_${sym}`,
                    from: "state_0",
                    to: "state_1",
                    symbol: sym,
                    curveOffset: 0
                });
                transitions.push({
                    id: `t_1_0_${sym}`,
                    from: "state_1",
                    to: "state_0",
                    symbol: sym,
                    curveOffset: 0
                });
            } else {
                transitions.push({
                    id: `t_0_0_${sym}`,
                    from: "state_0",
                    to: "state_0",
                    symbol: sym,
                    curveOffset: 0
                });
                transitions.push({
                    id: `t_1_1_${sym}`,
                    from: "state_1",
                    to: "state_1",
                    symbol: sym,
                    curveOffset: 0
                });
            }
            // Dead state loops on all symbols in alphabet
            transitions.push({
                id: `t_2_2_${sym}`,
                from: "state_2",
                to: "state_2",
                symbol: sym,
                curveOffset: 0
            });
        });
    } else {
        states = [
            {
                id: "state_0",
                name: s0Name,
                x: centerX - 140,
                y: centerY,
                isStart: true,
                isFinal: isEven
            },
            {
                id: "state_1",
                name: s1Name,
                x: centerX + 140,
                y: centerY,
                isStart: false,
                isFinal: !isEven
            }
        ];

        alpha.forEach(sym => {
            if (sym === targetSymbol) {
                transitions.push({
                    id: `t_0_1_${sym}`,
                    from: "state_0",
                    to: "state_1",
                    symbol: sym,
                    curveOffset: 0
                });
                transitions.push({
                    id: `t_1_0_${sym}`,
                    from: "state_1",
                    to: "state_0",
                    symbol: sym,
                    curveOffset: 0
                });
            } else {
                transitions.push({
                    id: `t_0_0_${sym}`,
                    from: "state_0",
                    to: "state_0",
                    symbol: sym,
                    curveOffset: 0
                });
                transitions.push({
                    id: `t_1_1_${sym}`,
                    from: "state_1",
                    to: "state_1",
                    symbol: sym,
                    curveOffset: 0
                });
            }
        });
    }

    const otherSym = alpha.find(s => s !== targetSymbol) || "";
    const testCases = [
        { input: "", expected: isEven },
        { input: targetSymbol + targetSymbol, expected: isEven },
        { input: targetSymbol, expected: !isEven },
        { input: otherSym ? otherSym : "", expected: isEven }
    ];
    if (otherSym) {
        testCases.push({ input: targetSymbol + otherSym + targetSymbol, expected: isEven });
    }

    const stateCount = states.length;
    const stateNamesStr = states.map(s => s.name).join(", ");
    const meta = {
        title: `${isEven ? 'Even' : 'Odd'} count of "${targetSymbol}"`,
        alphabet: `{ ${alphabet.join(", ")} }`,
        description: `DFA accepts strings with an ${isEven ? 'even' : 'odd'} number of "${targetSymbol}"s over alphabet { ${alphabet.join(", ")} }. States: ${stateNamesStr}.`,
        testCases
    };

    finishDFAGeneration(meta, `Constructed ${stateCount}-state DFA for ${isEven ? "even" : "odd"} number of "${targetSymbol}"s with states ${stateNamesStr}.`);
}

function generateEndingDFA(pattern, alpha, req = {}) {
    saveHistory(`Generate DFA for strings ending in "${pattern}"`);

    clearAutomaton(`Generated DFA ending in "${pattern}"`);
    alphabet = alpha;
    alphabetInput.value = alphabet.join(", ");
    alphabetDisplayText.textContent = `Alphabet: { ${alphabet.join(", ")} }`;

    const m = pattern.length;
    const canvasWidth = canvasWrapper.clientWidth || 900;
    const canvasHeight = canvasWrapper.clientHeight || 520;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const spacing = Math.min(220, Math.max(150, (canvasWidth - 240) / (m > 0 ? m : 1)));
    const startX = centerX - (m * spacing) / 2;

    states = [];
    transitions = [];

    // States 0..m
    for (let i = 0; i <= m; i++) {
        states.push({
            id: `state_${i}`,
            name: resolveStateName(i, req),
            x: startX + i * spacing,
            y: centerY,
            isStart: i === 0,
            isFinal: i === m
        });
    }

    // Standard KMP-style suffix transition computation
    for (let i = 0; i <= m; i++) {
        const prefix = pattern.substring(0, i);
        alpha.forEach(sym => {
            const cand = prefix + sym;
            let nextLen = 0;
            for (let len = Math.min(m, cand.length); len >= 0; len--) {
                if (cand.endsWith(pattern.substring(0, len))) {
                    nextLen = len;
                    break;
                }
            }
            transitions.push({
                id: `t_${i}_${sym}`,
                from: `state_${i}`,
                to: `state_${nextLen}`,
                symbol: sym,
                curveOffset: 0
            });
        });
    }

    // Optional dead state if explicitly requested
    if (req && (req.hasDeadState || (req.requestedCount && req.requestedCount > m + 1))) {
        const deadIdx = m + 1;
        const deadId = `state_${deadIdx}`;
        states.push({
            id: deadId,
            name: resolveStateName(deadIdx, req),
            x: centerX,
            y: centerY + 95,
            isStart: false,
            isFinal: false
        });
        alpha.forEach(sym => {
            transitions.push({
                id: `t_dead_${sym}`,
                from: deadId,
                to: deadId,
                symbol: sym,
                curveOffset: 0
            });
        });
    }

    const nonMatchSym = alpha.find(s => s !== pattern[pattern.length - 1]);
    const otherSym = alpha.find(s => s !== pattern[0]) || alpha[0];
    const testCases = [
        { input: pattern, expected: true },
        { input: otherSym + pattern, expected: true }
    ];
    if (nonMatchSym) {
        testCases.push({ input: pattern + nonMatchSym, expected: (pattern + nonMatchSym).endsWith(pattern) });
        testCases.push({ input: nonMatchSym, expected: nonMatchSym.endsWith(pattern) });
    }

    const meta = {
        title: `Strings ending in "${pattern}"`,
        alphabet: `{ ${alphabet.join(", ")} }`,
        description: `DFA accepts strings whose suffix is "${pattern}".`,
        testCases
    };

    finishDFAGeneration(meta, `Constructed complete DFA for strings ending in "${pattern}".`);
}

function generateStartingDFA(pattern, alpha, req = {}) {
    saveHistory(`Generate DFA for strings starting with "${pattern}"`);

    clearAutomaton(`Generated DFA starting with "${pattern}"`);
    alphabet = alpha;
    alphabetInput.value = alphabet.join(", ");
    alphabetDisplayText.textContent = `Alphabet: { ${alphabet.join(", ")} }`;

    const m = pattern.length;
    const canvasWidth = canvasWrapper.clientWidth || 900;
    const canvasHeight = canvasWrapper.clientHeight || 520;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const spacing = Math.min(220, Math.max(150, (canvasWidth - 240) / (m > 0 ? m : 1)));
    const startX = centerX - (m * spacing) / 2;

    states = [];
    transitions = [];

    // Matching chain 0..m
    for (let i = 0; i <= m; i++) {
        states.push({
            id: `state_${i}`,
            name: resolveStateName(i, req),
            x: startX + i * spacing,
            y: centerY - 45,
            isStart: i === 0,
            isFinal: i === m
        });
    }

    // Trap / dead state at index m + 1
    const trapIndex = m + 1;
    const trapId = `state_${trapIndex}`;
    states.push({
        id: trapId,
        name: resolveStateName(trapIndex, req),
        x: startX + (m / 2) * spacing,
        y: centerY + 80,
        isStart: false,
        isFinal: false
    });

    // Transitions along matching prefix
    for (let i = 0; i < m; i++) {
        const requiredSym = pattern[i];
        alpha.forEach(sym => {
            const targetId = (sym === requiredSym) ? `state_${i + 1}` : trapId;
            transitions.push({
                id: `t_${i}_${sym}`,
                from: `state_${i}`,
                to: targetId,
                symbol: sym,
                curveOffset: 0
            });
        });
    }

    // Accepting state loops on all symbols
    alpha.forEach(sym => {
        transitions.push({
            id: `t_${m}_${sym}`,
            from: `state_${m}`,
            to: `state_${m}`,
            symbol: sym,
            curveOffset: 0
        });
    });

    // Trap state loops on all symbols
    alpha.forEach(sym => {
        transitions.push({
            id: `t_trap_${sym}`,
            from: trapId,
            to: trapId,
            symbol: sym,
            curveOffset: 0
        });
    });

    const mismatchSym = alpha.find(s => s !== pattern[0]) || alpha[0];
    const meta = {
        title: `Strings starting with "${pattern}"`,
        alphabet: `{ ${alphabet.join(", ")} }`,
        description: `DFA accepts strings whose prefix is "${pattern}".`,
        testCases: [
            { input: pattern, expected: true },
            { input: pattern + alpha[0], expected: true },
            { input: mismatchSym + pattern, expected: (mismatchSym + pattern).startsWith(pattern) }
        ]
    };

    finishDFAGeneration(meta, `Constructed complete DFA for strings starting with "${pattern}".`);
}

function generateContainsSubstringDFA(pattern, alpha, req = {}) {
    saveHistory(`Generate DFA containing substring "${pattern}"`);

    clearAutomaton(`Generated DFA containing substring "${pattern}"`);
    alphabet = alpha;
    alphabetInput.value = alphabet.join(", ");
    alphabetDisplayText.textContent = `Alphabet: { ${alphabet.join(", ")} }`;

    const m = pattern.length;
    const canvasWidth = canvasWrapper.clientWidth || 900;
    const canvasHeight = canvasWrapper.clientHeight || 520;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const spacing = Math.min(220, Math.max(150, (canvasWidth - 240) / (m > 0 ? m : 1)));
    const startX = centerX - (m * spacing) / 2;

    states = [];
    transitions = [];

    // States 0..m
    for (let i = 0; i <= m; i++) {
        states.push({
            id: `state_${i}`,
            name: resolveStateName(i, req),
            x: startX + i * spacing,
            y: centerY,
            isStart: i === 0,
            isFinal: i === m
        });
    }

    for (let i = 0; i <= m; i++) {
        if (i === m) {
            // Once in accepting state, absorb and loop on all symbols
            alpha.forEach(sym => {
                transitions.push({
                    id: `t_${i}_${sym}`,
                    from: `state_${i}`,
                    to: `state_${i}`,
                    symbol: sym,
                    curveOffset: 0
                });
            });
        } else {
            const prefix = pattern.substring(0, i);
            alpha.forEach(sym => {
                const cand = prefix + sym;
                let nextLen = 0;
                for (let len = Math.min(m, cand.length); len >= 0; len--) {
                    if (cand.endsWith(pattern.substring(0, len))) {
                        nextLen = len;
                        break;
                    }
                }
                transitions.push({
                    id: `t_${i}_${sym}`,
                    from: `state_${i}`,
                    to: `state_${nextLen}`,
                    symbol: sym,
                    curveOffset: 0
                });
            });
        }
    }

    // Optional dead state
    if (req && (req.hasDeadState || (req.requestedCount && req.requestedCount > m + 1))) {
        const deadIdx = m + 1;
        const deadId = `state_${deadIdx}`;
        states.push({
            id: deadId,
            name: resolveStateName(deadIdx, req),
            x: centerX,
            y: centerY + 95,
            isStart: false,
            isFinal: false
        });
        alpha.forEach(sym => {
            transitions.push({
                id: `t_dead_${sym}`,
                from: deadId,
                to: deadId,
                symbol: sym,
                curveOffset: 0
            });
        });
    }

    const testCases = [
        { input: pattern, expected: true },
        { input: alpha[0] + pattern, expected: true },
        { input: pattern + (alpha[1] || alpha[0]), expected: true },
        { input: "", expected: false }
    ];
    if (pattern.length > 1) {
        testCases.push({ input: pattern.substring(0, pattern.length - 1), expected: false });
    }

    const meta = {
        title: `Strings containing substring "${pattern}"`,
        alphabet: `{ ${alphabet.join(", ")} }`,
        description: `DFA accepts any string that contains "${pattern}" as a contiguous substring.`,
        testCases
    };

    finishDFAGeneration(meta, `Constructed complete DFA for strings containing substring "${pattern}".`);
}

function generateAvoidsSubstringDFA(pattern, alpha, req = {}) {
    saveHistory(`Generate DFA avoiding substring "${pattern}"`);

    clearAutomaton(`Generated DFA avoiding substring "${pattern}"`);
    alphabet = alpha;
    alphabetInput.value = alphabet.join(", ");
    alphabetDisplayText.textContent = `Alphabet: { ${alphabet.join(", ")} }`;

    const m = pattern.length;
    const canvasWidth = canvasWrapper.clientWidth || 900;
    const canvasHeight = canvasWrapper.clientHeight || 520;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    const spacing = Math.min(220, Math.max(150, (canvasWidth - 240) / (m > 0 ? m : 1)));
    const startX = centerX - (m * spacing) / 2;

    states = [];
    transitions = [];

    // States 0..m (states 0..m-1 are accepting, state m is non-accepting trap state)
    for (let i = 0; i <= m; i++) {
        states.push({
            id: `state_${i}`,
            name: resolveStateName(i, req),
            x: startX + i * spacing,
            y: centerY,
            isStart: i === 0,
            isFinal: i < m
        });
    }

    for (let i = 0; i <= m; i++) {
        if (i === m) {
            // Once in trap state, absorb and loop on all symbols
            alpha.forEach(sym => {
                transitions.push({
                    id: `t_${i}_${sym}`,
                    from: `state_${i}`,
                    to: `state_${i}`,
                    symbol: sym,
                    curveOffset: 0
                });
            });
        } else {
            const prefix = pattern.substring(0, i);
            alpha.forEach(sym => {
                const cand = prefix + sym;
                let nextLen = 0;
                for (let len = Math.min(m, cand.length); len >= 0; len--) {
                    if (cand.endsWith(pattern.substring(0, len))) {
                        nextLen = len;
                        break;
                    }
                }
                transitions.push({
                    id: `t_${i}_${sym}`,
                    from: `state_${i}`,
                    to: `state_${nextLen}`,
                    symbol: sym,
                    curveOffset: 0
                });
            });
        }
    }

    const testCases = [
        { input: "", expected: true },
        { input: pattern, expected: false },
        { input: alpha[0] + pattern, expected: false }
    ];
    if (pattern.length > 1) {
        testCases.push({ input: pattern.substring(0, pattern.length - 1), expected: true });
    }

    const meta = {
        title: `Strings avoiding substring "${pattern}"`,
        alphabet: `{ ${alphabet.join(", ")} }`,
        description: `DFA accepts any string that does NOT contain "${pattern}" as a substring.`,
        testCases
    };

    finishDFAGeneration(meta, `Constructed complete DFA for strings avoiding substring "${pattern}".`);
}

function generateDivisibleDFA(n, alpha, req = {}) {
    saveHistory(`Generate DFA divisible by ${n}`);

    clearAutomaton(`Generated DFA for numbers divisible by ${n}`);
    alphabet = ["0", "1"];
    alphabetInput.value = "0, 1";
    alphabetDisplayText.textContent = "Alphabet: { 0, 1 }";

    states = [];
    transitions = [];

    const canvasWidth = canvasWrapper.clientWidth || 900;
    const canvasHeight = canvasWrapper.clientHeight || 520;
    const radius = Math.min(canvasWidth, canvasHeight) * 0.32;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    for (let r = 0; r < n; r++) {
        const angle = (2 * Math.PI * r) / n - Math.PI / 2;
        states.push({
            id: `state_${r}`,
            name: resolveStateName(r, req),
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            isStart: r === 0,
            isFinal: r === 0
        });
    }

    for (let r = 0; r < n; r++) {
        alphabet.forEach(sym => {
            const bit = parseInt(sym, 10);
            const nextRemainder = (r * 2 + bit) % n;
            transitions.push({
                id: `t_${r}_${sym}`,
                from: `state_${r}`,
                to: `state_${nextRemainder}`,
                symbol: sym,
                curveOffset: 0
            });
        });
    }

    const meta = {
        title: `Binary numbers divisible by ${n}`,
        alphabet: "{ 0, 1 }",
        description: `Accepts binary representations of integers divisible by ${n} (read MSB to LSB). State ${resolveStateName(0, req)} is accepting (remainder 0).`,
        testCases: [
            { input: n.toString(2), expected: true },
            { input: (n * 2).toString(2), expected: true },
            { input: (n + 1).toString(2), expected: false }
        ]
    };

    finishDFAGeneration(meta, `Constructed complete DFA for binary numbers divisible by ${n}.`);
}

function generateExplicitDFA(explicitData, text, req) {
    saveHistory("Generate DFA from explicit problem specification");
    clearAutomaton("Generated DFA from explicit transition specification");

    // 1. Alphabet
    let detectedAlpha = explicitData.alphabet.length > 0 ? explicitData.alphabet : [...alphabet];
    const alphaMatch = text.match(/\{([^}]+)\}/);
    if (alphaMatch) {
        const parsed = alphaMatch[1].split(",").map(s => s.trim().replace(/['"]/g, "")).filter(s => s.length > 0);
        if (parsed.length > 0) detectedAlpha = Array.from(new Set(parsed));
    }
    alphabet = detectedAlpha;
    alphabetInput.value = alphabet.join(", ");
    alphabetDisplayText.textContent = `Alphabet: { ${alphabet.join(", ")} }`;

    // 2. States
    const stateNames = explicitData.states;
    const canvasWidth = canvasWrapper.clientWidth || 900;
    const canvasHeight = canvasWrapper.clientHeight || 520;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const N = stateNames.length;
    const spacing = Math.min(220, Math.max(140, (canvasWidth - 240) / (N > 1 ? N - 1 : 1)));
    const startX = centerX - ((N - 1) * spacing) / 2;

    const nameToId = new Map();
    states = [];
    transitions = [];

    stateNames.forEach((name, i) => {
        const id = `state_${i}`;
        nameToId.set(name, id);

        // Identify start state: explicit "A: start" or first state
        const isStart = new RegExp(`\\b${name}\\b[\\s:]+(?:is\\s+)?(?:start|initial)`, "i").test(text) || (i === 0 && !/\b(?:start|initial)\s+state\b/i.test(text));

        // Identify final state: explicit "A: start and accepting" or "accepting state"
        const isDead = new RegExp(`\\b${name}\\b[\\s:]+(?:is\\s+)?(?:non-accepting\\s+)?(?:dead|trap)`, "i").test(text);
        const isFinal = !isDead && (new RegExp(`\\b${name}\\b[\\s:]+(?:is\\s+)?(?:start\\s+and\\s+)?(?:accepting|final)`, "i").test(text) || (i === 0 && !/\baccepting\s+state\b/i.test(text)));

        states.push({
            id,
            name,
            x: startX + i * spacing,
            y: isDead ? centerY + 70 : centerY - 25,
            isStart,
            isFinal
        });
    });

    // 3. Transitions
    explicitData.transitions.forEach((rule, idx) => {
        const fromId = nameToId.get(rule.from) || states[0]?.id;
        const toId = nameToId.get(rule.to) || states[0]?.id;
        transitions.push({
            id: `t_explicit_${idx}`,
            from: fromId,
            to: toId,
            symbol: rule.sym,
            curveOffset: 0
        });
    });

    const meta = {
        title: "Custom Specified DFA",
        alphabet: `{ ${alphabet.join(", ")} }`,
        description: `DFA constructed from explicit problem specification with states ${stateNames.join(", ")}.`,
        testCases: []
    };

    finishDFAGeneration(meta, `Constructed explicit DFA with states ${stateNames.join(", ")} and ${transitions.length} transition rules.`);
}

function solveDFAProblem() {
    const text = problemDescriptionInput.value.trim();
    if (!text) {
        showProblemFeedback("Please enter a DFA problem description.", true);
        return;
    }

    const lower = text.toLowerCase();
    showProblemFeedback("Analyzing pattern and synthesizing DFA...", false);

    // 1. Detect Alphabet: Curly braces {0, 1} take highest priority, then "binary", then active alphabet
    let detectedAlpha = [...alphabet];
    const alphaMatch = text.match(/\{([^}]+)\}/);
    if (alphaMatch) {
        const parsed = alphaMatch[1].split(",").map(s => s.trim().replace(/['"]/g, "")).filter(s => s.length > 0);
        if (parsed.length > 0) {
            detectedAlpha = Array.from(new Set(parsed));
        }
    } else if (/\bbinary\b/i.test(text)) {
        detectedAlpha = ["0", "1"];
    }

    // 2. Parse explicit user requirements (state counts, explicit state names, dead states)
    const req = parseProblemRequirements(text);

    // 3. Check if user provided explicit transition rules in the description
    const explicitData = parseExplicitTransitions(text);
    if (explicitData.transitions.length >= 4 && explicitData.states.length >= 2) {
        generateExplicitDFA(explicitData, text, req);
        return;
    }

    // 4. Parity check (Checked FIRST to avoid "even number of 1s" being captured by substring regex)
    const parityMatch = lower.match(/\b(even|odd)\s+(?:number of|count of|amount of)?\s*['"]?([0-9a-z])(?:'s|s)?['"]?\b/);
    if (parityMatch) {
        const parity = parityMatch[1];
        const sym = parityMatch[2];
        if (detectedAlpha.includes(sym)) {
            generateParityDFA(sym, parity === "even", detectedAlpha, req);
            return;
        }
    }

    // 5. Divisible by integer n
    const divMatch = lower.match(/\b(?:divisible by|multiple of)\s+(\d+)\b/);
    if (divMatch) {
        const n = parseInt(divMatch[1], 10);
        if (n >= 1 && n <= 10) {
            generateDivisibleDFA(n, detectedAlpha, req);
            return;
        }
    }

    // 6. Ending in substring
    const endMatch = lower.match(/\b(?:ending in|ends with|end with)\s+['"]?([0-9a-z]+)['"]?\b/);
    if (endMatch) {
        const cand = endMatch[1];
        if (isValidPattern(cand, detectedAlpha)) {
            generateEndingDFA(cand, detectedAlpha, req);
            return;
        }
    }

    // 7. Starting with substring
    const startMatch = lower.match(/\b(?:starting with|starts with|start with|begins with|begin with)\s+['"]?([0-9a-z]+)['"]?\b/);
    if (startMatch) {
        const cand = startMatch[1];
        if (isValidPattern(cand, detectedAlpha)) {
            generateStartingDFA(cand, detectedAlpha, req);
            return;
        }
    }

    // 8. Avoiding substring
    const avoidMatch = lower.match(/\b(?:avoiding|does not contain|doesn't contain|without|avoids)\s+(?:the\s+)?(?:substring\s+)?['"]?([0-9a-z]+)['"]?\b/);
    if (avoidMatch) {
        const cand = avoidMatch[1];
        if (isValidPattern(cand, detectedAlpha)) {
            generateAvoidsSubstringDFA(cand, detectedAlpha, req);
            return;
        }
    }

    // 9. Containing substring
    const containMatch = lower.match(/\b(?:contains|containing|has|have)\s+(?:the\s+)?(?:substring\s+)?['"]?([0-9a-z]+)['"]?\b/);
    if (containMatch) {
        const cand = containMatch[1];
        if (isValidPattern(cand, detectedAlpha)) {
            generateContainsSubstringDFA(cand, detectedAlpha, req);
            return;
        }
    }

    // If no supported pattern or pattern invalid for detected alphabet:
    showProblemFeedback(
        "Unsupported or ambiguous problem description. Supported patterns: 'ending in [pattern]', 'starting with [pattern]', 'containing substring [pattern]', 'avoiding substring [pattern]', 'even/odd number of [symbol]', or 'divisible by [n]'.",
        true
    );
}

generateDfaBtn.addEventListener("click", solveDFAProblem);

/* =========================================================
   PROJECT MANAGEMENT (NEW, OPEN, SAVE, EXPORT JSON, PNG, SVG)
========================================================= */
projectNewBtn.addEventListener("click", () => {
    if (states.length > 0 && !confirm("Create a new blank DFA workspace? Unsaved changes will be cleared.")) {
        return;
    }
    saveHistory("New DFA Project");
    alphabet = ["0", "1"];
    alphabetInput.value = "0, 1";
    alphabetDisplayText.textContent = "Alphabet: { 0, 1 }";
    clearAutomaton("Created new blank DFA project");
});

projectSaveBtn.addEventListener("click", () => {
    const projectData = {
        version: "2.0",
        appName: "DFA Automata Designer",
        timestamp: new Date().toISOString(),
        alphabet,
        states,
        transitions,
        stateCounter,
        namingMode
    };

    const jsonStr = JSON.stringify(projectData, null, 2);
    localStorage.setItem("dfa_saved_automaton", jsonStr);
    downloadFile("dfa-automaton.json", jsonStr, "application/json");
    addActivity("Saved DFA project locally");
});

projectExportJsonBtn.addEventListener("click", () => {
    const data = {
        alphabet,
        states,
        transitions,
        metadata: currentExampleMeta
    };
    downloadFile("dfa-model.json", JSON.stringify(data, null, 2), "application/json");
    addActivity("Exported DFA model as JSON");
});

projectOpenBtn.addEventListener("click", () => {
    projectFileInput.click();
});

projectFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (!data.states || !data.alphabet || !data.transitions) {
                alert("Invalid project format. JSON must contain states, alphabet, and transitions.");
                return;
            }
            saveHistory("Open DFA project");
            alphabet = data.alphabet;
            states = data.states;
            transitions = data.transitions;
            stateCounter = data.stateCounter || states.length;
            alphabetInput.value = alphabet.join(", ");
            alphabetDisplayText.textContent = `Alphabet: { ${alphabet.join(", ")} }`;

            addActivity(`Imported project from <strong>${file.name}</strong>`);
            updateAll();
            fitToCanvas();
        } catch (err) {
            alert("Error parsing project JSON: " + err.message);
        }
    };
    reader.readAsText(file);
    projectFileInput.value = "";
});

projectExportPngBtn.addEventListener("click", () => {
    // Render a high-resolution snapshot with dark background
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const expCtx = exportCanvas.getContext("2d");

    expCtx.fillStyle = "#0a0614";
    expCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    expCtx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = "dfa-diagram.png";
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
    addActivity("Exported canvas diagram as PNG");
});

projectExportSvgBtn.addEventListener("click", () => {
    const width = canvasWrapper.clientWidth;
    const height = canvasWrapper.clientHeight;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:#0a0614; font-family:'Space Grotesk', sans-serif;">`;
    svg += `<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#ff78ca"/></marker></defs>`;

    // Render Transitions
    const groups = getTransitionGroups();
    groups.forEach(g => {
        const from = states.find(s => s.id === g.from);
        const to = states.find(s => s.id === g.to);
        if (!from || !to) return;

        if (from.id === to.id) {
            svg += `<path d="M ${from.x - 18} ${from.y - STATE_RADIUS} C ${from.x - 48} ${from.y - 75}, ${from.x + 48} ${from.y - 75}, ${from.x + 18} ${from.y - STATE_RADIUS}" fill="none" stroke="#ff6bc5" stroke-width="2.2" marker-end="url(#arrow)"/>`;
            svg += `<rect x="${from.x - 14}" y="${from.y - 88}" width="28" height="18" rx="6" fill="#120b22" stroke="#ff5fc2" stroke-width="1"/><text x="${from.x}" y="${from.y - 75}" fill="#ffb0e4" font-size="11" font-weight="700" text-anchor="middle">${g.label}</text>`;
        } else {
            svg += `<line x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" stroke="#b875ff" stroke-width="2.2" marker-end="url(#arrow)"/>`;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            svg += `<rect x="${midX - 14}" y="${midY - 10}" width="28" height="18" rx="6" fill="#120b22" stroke="#b875ff" stroke-width="1"/><text x="${midX}" y="${midY + 3}" fill="#ffb0e4" font-size="11" font-weight="700" text-anchor="middle">${g.label}</text>`;
        }
    });

    // Render States
    states.forEach(s => {
        if (s.isStart) {
            svg += `<line x1="${s.x - STATE_RADIUS - 45}" y1="${s.y}" x2="${s.x - STATE_RADIUS}" y2="${s.y}" stroke="#ff5fc2" stroke-width="2.5" marker-end="url(#arrow)"/>`;
        }
        svg += `<circle cx="${s.x}" cy="${s.y}" r="${STATE_RADIUS}" fill="#190e2b" stroke="${s.isFinal ? '#ff5fc2' : '#9a67ff'}" stroke-width="2.4"/>`;
        if (s.isFinal) {
            svg += `<circle cx="${s.x}" cy="${s.y}" r="${STATE_RADIUS - 7}" fill="none" stroke="#ff78ca" stroke-width="2"/>`;
        }
        svg += `<text x="${s.x}" y="${s.y + 5}" fill="#ffffff" font-size="15" font-weight="700" text-anchor="middle">${s.name}</text>`;
    });

    svg += `</svg>`;
    downloadFile("dfa-diagram.svg", svg, "image/svg+xml");
    addActivity("Exported diagram as SVG");
});

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

/* =========================================================
   ACTIVITY HISTORY LOGGER
========================================================= */
function addActivity(text) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    activityLog.unshift({ time: timeStr, text });
    if (activityLog.length > 40) activityLog.pop();

    renderActivity();
}

function renderActivity() {
    if (!activityHistory) return;
    if (activityLog.length === 0) {
        activityHistory.innerHTML = `<div class="empty-history">No activity yet.</div>`;
        return;
    }

    let html = "";
    activityLog.forEach(item => {
        html += `
            <div class="activity-row">
                <span class="activity-time">${item.time}</span>
                <span class="activity-text">${item.text}</span>
            </div>
        `;
    });
    activityHistory.innerHTML = html;
}

clearHistoryBtn.addEventListener("click", () => {
    activityLog = [];
    renderActivity();
});

/* =========================================================
   TOPBAR NAVIGATION & MODALS
========================================================= */
navWorkspaceBtn.addEventListener("click", () => {
    setNavActive(navWorkspaceBtn);
    window.scrollTo({ top: 0, behavior: "smooth" });
});

navExamplesBtn.addEventListener("click", () => {
    setNavActive(navExamplesBtn);
    document.getElementById("examplesSection").scrollIntoView({ behavior: "smooth" });
});

navProblemBtn.addEventListener("click", () => {
    setNavActive(navProblemBtn);
    document.getElementById("problemSection").scrollIntoView({ behavior: "smooth" });
    problemDescriptionInput.focus();
});

navValidateBtn.addEventListener("click", () => {
    setNavActive(navValidateBtn);
    document.getElementById("validationSection").scrollIntoView({ behavior: "smooth" });
    validateDFA();
});

navHistoryBtn.addEventListener("click", () => {
    setNavActive(navHistoryBtn);
    document.getElementById("activitySection").scrollIntoView({ behavior: "smooth" });
});

function setNavActive(btn) {
    document.querySelectorAll(".topbar-nav-pill").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
}

/* THEME TOGGLE */
themeTogglePill.addEventListener("click", toggleTheme);
if (drawerThemeBtn) drawerThemeBtn.addEventListener("click", toggleTheme);

function toggleTheme() {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    localStorage.setItem("dfa_theme", isLight ? "light" : "dark");
    draw();
}

// Restore theme from localStorage
if (localStorage.getItem("dfa_theme") === "light") {
    document.body.classList.add("light-mode");
}

/* SETTINGS MODAL */
settingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "flex";
});

closeSettingsBtn.addEventListener("click", () => {
    settingsModal.style.display = "none";
});

saveSettingsBtn.addEventListener("click", () => {
    showGrid = settingShowGrid.checked;
    snapToGrid = settingSnapGrid.checked;
    autoValidate = settingAutoValidate.checked;
    settingsModal.style.display = "none";
    draw();
    if (autoValidate) validateDFA();
});

/* MOBILE NAVIGATION DRAWER */
menuBtn.addEventListener("click", () => {
    navigationDrawer.classList.add("active");
    menuOverlay.classList.add("active");
});

closeMenuBtn.addEventListener("click", closeDrawer);
menuOverlay.addEventListener("click", closeDrawer);

function closeDrawer() {
    navigationDrawer.classList.remove("active");
    menuOverlay.classList.remove("active");
}

document.querySelectorAll(".drawer-nav .nav-item").forEach(item => {
    item.addEventListener("click", () => {
        const targetId = item.dataset.target;
        const el = document.getElementById(targetId);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            closeDrawer();
        }
    });
});

/* CENTRALIZED AUTOMATON RESET FUNCTION */
function clearAutomaton(logMessage = "Cleared canvas automaton") {
    states = [];
    transitions = [];
    stateCounter = 0;
    selectedState = null;
    selectedTransition = null;
    transitionStart = null;
    activeExecutionState = null;
    activeTransitionRule = null;
    executionTrace = [];
    currentTraceIndex = 0;
    pauseExecution();

    if (canvasHint) {
        canvasHint.classList.remove("fade-out");
    }

    if (result) {
        result.innerHTML = `
            <div class="result-pill">
                <span class="pill-text">No input tested yet.</span>
            </div>
        `;
    }
    if (executionPath) {
        executionPath.textContent = "—";
    }
    if (executionResult) {
        executionResult.innerHTML = `<div class="empty-history">Enter an input string and click Run DFA.</div>`;
    }

    if (logMessage) {
        addActivity(logMessage);
    }

    updateAll();
}

/* HEADER TOOLS */
undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);
clearBtn.addEventListener("click", () => {
    if (confirm("Clear all states and transitions from canvas?")) {
        saveHistory("Clear canvas");
        clearAutomaton("Cleared canvas automaton");
    }
});

if (drawerUndoBtn) drawerUndoBtn.addEventListener("click", undo);
if (drawerRedoBtn) drawerRedoBtn.addEventListener("click", redo);
if (drawerClearBtn) drawerClearBtn.addEventListener("click", () => {
    clearBtn.click();
    closeDrawer();
});

/* STEP TRACE ACCORDION TOGGLE */
stepTraceToggle.addEventListener("click", () => {
    const isHidden = executionResult.style.display === "none";
    executionResult.style.display = isHidden ? "block" : "none";
    stepTraceToggle.querySelector(".trace-arrow").textContent = isHidden ? "▾" : "▸";
});

/* HELPER ESCAPE HTML */
function escapeHTML(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================
   SYNCHRONIZATION & INITIALIZATION
========================================================= */
function updateAll() {
    draw();
    updateTransitionTable();
    validateDFA();
}

window.addEventListener("resize", resizeCanvas);

// Initial Load Setup
window.addEventListener("DOMContentLoaded", () => {
    resizeCanvas();
    // Load default example matching mockup: "Binary strings ending in 1"
    loadExample("ending-1");
});